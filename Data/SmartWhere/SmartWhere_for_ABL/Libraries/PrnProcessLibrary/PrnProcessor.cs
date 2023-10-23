namespace FXKIS.PDL.Process
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.IO;
    using System.Text;

    using Data;
    using Event;
    using Exceptions;

    using SmartWhere.CommonIF;
    using SmartWhere.Metadata;
    using SmartWhere.Policy;



    public class PrnProcessor : IDisposable
    {
        #region Events

        public event EventHandler<ItemUpdatedEventArgs> ItemUpdated;

        #endregion Events

        private const int Copies = 1;

        #region Properties :: Metadata & Send

        private PrintJobData JobData                      { get; set; }
        private PrnMetadata  Metadata                     { get; set; }
        private Stream[]     OutputStreams                { get; set; }
        private string       PathSpool                    { get; set; }
        private string       PathFontDataDirectory        { get; set; }
        private string       PathWatermarkImageDirectory  { get; set; }
        private string       PathImageProcessingDirectory { get; set; }
        private string       JobTicket                    { get; set; }

        #endregion Properties :: Metadata & Send



        #region Properties :: Spool

        private Stream      PrnStream { get; set; }
        private PrnBuffer   PrnBuffer { get; set; }
        private PrnDocument Document  { get; set; }

        public long Position
        {
            get
            {
                if (this.PrnStream == null)
                {
                    return 0;
                }

                return this.PrnStream.Position;
            }
        }

        public long Length
        {
            get
            {
                if (this.PrnStream == null)
                {
                    return 0;
                }

                return this.PrnStream.Length;
            }
        }

        #endregion Properties :: Spool



        #region Properties :: Modified flags

        private bool ModifiedDuplex { get; set; }
        private bool ModifiedCopies { get; set; }

        #endregion Properties :: Modified flags



        #region Constructors

        public PrnProcessor (PrintJobData jobData, PrnMetadata metadata, Stream[] arrOutputStream, string pathSpool, string pathFontDir, string pathWatermarkImageDir, string pathImageProcessingDir, string jobTicket)
        {
            if (jobData == null)
            {
                throw new ArgumentNullException("PrintJobData jobData");
            }

            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (arrOutputStream == null || arrOutputStream.Length < 1)
            {
                throw new ArgumentNullException("Stream[] arrOutputStream");
            }

            foreach (Stream stream in arrOutputStream)
            {
                if (stream.CanWrite == false)
                {
                    throw new InvalidOperationException("Stream can not write");
                }
            }

            if (string.IsNullOrWhiteSpace(pathSpool) == true)
            {
                throw new ArgumentNullException("string pathSpool");
            }

            if (string.IsNullOrWhiteSpace(pathFontDir) == true)
            {
                throw new ArgumentNullException("string pathFontDir");
            }

            if (string.IsNullOrWhiteSpace(pathWatermarkImageDir) == true)
            {
                throw new ArgumentNullException("string pathWatermarkImageDir");
            }

            if (string.IsNullOrWhiteSpace(pathImageProcessingDir) == true)
            {
                throw new ArgumentNullException("string pathImageProcessingDir");
            }

            if (string.IsNullOrWhiteSpace(jobTicket) == true)
            {
                jobTicket = string.Empty;
            }

            this.JobData                      = jobData;
            this.Metadata                     = metadata;
            this.OutputStreams                = arrOutputStream;
            this.PathSpool                    = pathSpool;
            this.PathFontDataDirectory        = pathFontDir;
            this.PathWatermarkImageDirectory  = pathWatermarkImageDir;
            this.PathImageProcessingDirectory = pathImageProcessingDir;
            this.JobTicket                    = jobTicket;

            this.InitializeBuffer(new FileInfo(this.PathSpool));

            this.InitializeFlags();
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeBuffer (FileInfo fi)
        {
            if (fi == null)
            {
                throw new ArgumentNullException("FileInfo fi");
            }

            if (fi.Exists == false)
            {
                throw new FileNotFoundException("Processed Spoolfile is not exists", fi.FullName);
            }

            this.InitializeBuffer(fi.OpenRead());
        }

        private void InitializeBuffer (Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream");
            }

            this.PrnStream = stream;
            this.PrnBuffer = new PrnBuffer()
            {
                ReaderMode = PrnBuffer.PrnReaderMode.PJL
            };

            this.Document = new PrnDocument()
            {
                StreamLength = this.PrnStream.Length
            };
            this.Document.ItemUpdated += this.PrnDocument_ItemUpdated;

            this.ItemUpdated = null;
        }

        private void InitializeFlags ()
        {
            // DUPLEX
            int numDuplexPrnInfo = (int)this.Metadata.PrnInfo.DuplexMode;
            int numDuplexPolicy  = (int)this.Metadata.Policy.PrintOption.ForceDuplex;
            int numDuplexJobData = (int)this.JobData.Duplex;

            if (numDuplexPrnInfo != numDuplexPolicy || numDuplexPolicy != numDuplexJobData)
            {
                this.ModifiedDuplex = true;
            }
            else
            {
                this.ModifiedDuplex = false;
            }

            // COPIES
            if (this.Metadata.PrnInfo.Copies == this.JobData.Copies)
            {
                this.ModifiedCopies = false;
            }
            else
            {
                this.ModifiedCopies = true;
            }
        }

        #endregion Methods :: Initialize




        #region Methods :: 

        public void Process ()
        {
            // HEAD PJLs
            this.ProcessPJLs();

            // PCL-XLs (Attribute & Operator)
            this.ProcessPCLXLs(true);

            // TAIL PJLs
            this.ProcessPJLs();
        }

        private void ProcessPJLs ()
        {
            if (this.PrnStream == null)
            {
                throw new InvalidOperationException("Stream is null");
            }

            try
            {
                PJLReader pjlReader = new PJLReader();

                if (this.PrnStream.CanRead == false || this.PrnStream.CanSeek == false)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.CannotReadStream);
                }

                bool bufferReadStopCondition = false;

                while (true)
                {
                    if (bufferReadStopCondition == true || this.PrnBuffer.ReaderMode != PrnBuffer.PrnReaderMode.PJL)
                    {
                        break;
                    }

                    try
                    {
                        this.PrnBuffer.Buffer = BufferProcessing.ReadMoreBuffer(this.PrnStream, PDL.Constants.BufferProcessing.BufferSize);
                    }
                    catch (EndOfStreamException)
                    {
                        bufferReadStopCondition = true;
                    }

                    if (this.PrnBuffer == null)
                    {
                        break;
                    }

                    if (this.PrnBuffer.Buffer == null && (this.PrnBuffer.RemainBuffer == null && this.Position >= this.Length))
                    {
                        break;
                    }

                    this.PrnBuffer.AttachBuffer();

                    try
                    {
                        // Read
                        switch (this.PrnBuffer.ReaderMode)
                        {
                            case PrnBuffer.PrnReaderMode.Exit:
                                bufferReadStopCondition = true;
                                break;

                            case PrnBuffer.PrnReaderMode.PJL:
                                this.PrnBuffer = pjlReader.LoadPJL(this.PrnBuffer, this.Document, this.Position);
                                break;

                            default:
                                bufferReadStopCondition = true;
                                break;
                        }
                    }
                    catch (PrnParserException ppex)
                    {
                        switch (ppex.Type)
                        {
                            case PrnParserException.PrnParserExceptionType.SequenceReadingContinue:
                                this.PrnBuffer.AccureExistingBuffer();
                                break;

                            case PrnParserException.PrnParserExceptionType.PCLXLHeaderParsingError:
                            case PrnParserException.PrnParserExceptionType.PCLXLDataParsingError:
                            case PrnParserException.PrnParserExceptionType.PJLDataParsingError:
                            case PrnParserException.PrnParserExceptionType.IsNotSupported:
                            case PrnParserException.PrnParserExceptionType.FileEnd:
                            default:
                                throw ppex;
                        }
                    }
                }

                // LOOP for PROCESSING
                foreach (PJLItem pjl in this.Document.PJL.Items)
                {
                    string strKey = string.Empty;
                    string value  = string.Empty;

                    PJLItem newItem = null;

                    ////////////////////////////////////////////////////

                    do
                    {
                        try
                        {
                            switch (pjl.Command)
                            {
                                case PJLItem.PJLCommandType.Comment:
                                    strKey = pjl.Variable;
                                    value  = pjl.EnvironmentValue;

                                    if (strKey != null && strKey.ToUpper() == PDL.Constants.PJLVariable.FxJobInfo)
                                    {
                                        strKey = pjl.EnvironmentVariable;
                                        value  = pjl.EnvironmentValue;
                                    }
                                    break;

                                case PJLItem.PJLCommandType.Set:
                                    if (pjl.Variable != null && pjl.Variable.ToUpper() == PDL.Constants.PJLVariable.JobAttribute)
                                    {
                                        strKey = pjl.JobAttributeCommand;
                                        value  = pjl.JobAttributeParameter;
                                    }
                                    else
                                    {
                                        strKey = pjl.Variable;
                                        value  = pjl.EnvironmentValue;
                                    }
                                    break;

                                default:
                                    break;
                            }

                            if (string.IsNullOrWhiteSpace(strKey) == true)
                            {
                                break;
                            }

                            ItemType.PJL key = ItemType.StringToPJL(strKey);

                            switch (key)
                            {
                                case ItemType.PJL.UserID: // @PJL SET JOBATTR="@JOET=####"
                                    if (string.IsNullOrWhiteSpace(this.JobTicket) == false)
                                    {
                                        newItem = new PJLItem("@PJL SET JOBATTR=\"@JOET=" + this.JobTicket + "\"");
                                    }
                                    break;

                                case ItemType.PJL.Duplex: // @PJL SET DUPLEX=ON/OFF
                                    if (this.ModifiedDuplex == true)
                                    {
                                        if (this.JobData.Duplex == PrintJobData.DuplexType.Simplex)
                                        {
                                            pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueOff;
                                        }
                                        else
                                        {
                                            pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueOn;
                                        }
                                    }

                                    int nup = this.JobData.Nup;

                                    if (this.Metadata.PrnInfo.TotalPages <= nup)
                                    {
                                        pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueOff;
                                    }
                                    break;

                                case ItemType.PJL.EconomyMode: // @PJL SET ECONOMODE=ON/OFF
                                    if (this.Metadata.Policy.PrintOption != null && this.Metadata.Policy.PrintOption.TonerSave == true)
                                    {
                                        pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueOn;
                                    }
                                    break;

                                case ItemType.PJL.TonerSave: // @PJL COMMENT FXJOBINFO TONERSAVE=ON/OFF
                                    if (this.Metadata.Policy.PrintOption != null && this.Metadata.Policy.PrintOption.TonerSave == true)
                                    {
                                        pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueOn;
                                    }
                                    break;

                                case ItemType.PJL.Binding: // @PJL SET BINDING=LONGEDGE/SHORTEDGE
                                    if (this.ModifiedDuplex == true)
                                    {
                                        if (this.JobData.Duplex == PrintJobData.DuplexType.DuplexShortEdge)
                                        {
                                            pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueShortEdge;
                                        }
                                        else
                                        {
                                            pjl.EnvironmentValue = PDL.Constants.PJLVariable.ValueLongEdge;
                                        }
                                    }
                                    break;

                                ////////////////////////////////////// todo :: 2018.06.26 qty,copies
                                case ItemType.PJL.Qty:

                                    pjl.EnvironmentValue = this.JobData.Copies.ToString();
                                    break;


                                case ItemType.PJL.Copies:

                                    pjl.EnvironmentValue = Copies.ToString();
                                    break;

                                default:
                                    break;
                            }
                        }
                        catch
                        {
                            continue;
                        }
                    }
                    while (false);

                    ////////////////////////////////////////////////////

                    byte[] binary = pjl.ToBinary();

                    if (binary == null)
                    {
                        continue;
                    }

                    this.OutputStreams.WriteBinary(binary);

                    if (newItem == null)
                    {
                        continue;
                    }

                    binary = newItem.ToBinary();

                    if (binary == null)
                    {
                        continue;
                    }

                    this.OutputStreams.WriteBinary(binary);

                    ////////////////////////////////////////////////////
                }

                this.Document.PJL.Items.Clear();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private void ProcessPCLXLs (bool isMasking = false)
        {
            if (this.PrnStream == null)
            {
                throw new InvalidOperationException("Stream is null");
            }

            try
            {
                PCLXLProcessor processor = new PCLXLProcessor(this.PrnStream, this.OutputStreams, this.Metadata, this.JobData, this.PathFontDataDirectory, this.PathWatermarkImageDirectory, this.PathImageProcessingDirectory);

                if (this.PrnStream.CanRead == false || this.PrnStream.CanSeek == false)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.CannotReadStream);
                }

                ///////////////////////////////////////////////////////////////////////////////////
                // HeaderFooter / Watermark 이미지 생성
                ///////////////////////////////////////////////////////////////////////////////////

                processor.MakeWatermarkImage(this.Metadata.Policy.Watermarks);

                processor.MakeHeaderFooter(this.Metadata.Policy.Headers);

                processor.MakeHeaderFooter(this.Metadata.Policy.Footers);

                ///////////////////////////////////////////////////////////////////////////////////

                bool bufferReadStopCondition = false;

                while (true)
                {
                    if (bufferReadStopCondition == true || this.PrnBuffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL)
                    {
                        this.PrnBuffer.RemainBuffer = this.PrnBuffer.Buffer;
                        this.PrnBuffer.Buffer       = null;
                        break;
                    }

                    this.PrnBuffer.Buffer = BufferProcessing.ReadBuffer(this.PrnStream, PDL.Constants.BufferProcessing.BufferSize);

                    if (this.PrnBuffer == null)
                    {
                        break;
                    }

                    if (this.PrnBuffer.Buffer == null && (this.PrnBuffer.RemainBuffer == null && this.Position >= this.Length))
                    {
                        break;
                    }

                    this.PrnBuffer.AttachBuffer();

                    try
                    {
                        // Read
                        switch (this.PrnBuffer.ReaderMode)
                        {
                            case PrnBuffer.PrnReaderMode.Exit:
                                bufferReadStopCondition = true;
                                break;

                            case PrnBuffer.PrnReaderMode.PCLXL:
                                this.PrnBuffer = processor.Process(this.PrnBuffer, this.Document, isMasking);
                                break;

                            default:
                                bufferReadStopCondition = true;
                                break;
                        }
                    }
                    catch (PrnParserException ppex)
                    {
                        switch (ppex.Type)
                        {
                            case PrnParserException.PrnParserExceptionType.SequenceReadingContinue:
                                this.PrnBuffer.AccureExistingBuffer();
                                break;

                            case PrnParserException.PrnParserExceptionType.PCLXLHeaderParsingError:
                            case PrnParserException.PrnParserExceptionType.PCLXLDataParsingError:
                            case PrnParserException.PrnParserExceptionType.PJLDataParsingError:
                            case PrnParserException.PrnParserExceptionType.IsNotSupported:
                            case PrnParserException.PrnParserExceptionType.FileEnd:
                            default:
                                throw ppex;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // 가공된 이미지 파일 제거
                try
                {
                    this.Metadata.Policy.RemoveProcessingImages();
                }
                catch { }
            }
        }

        private void PrnDocument_ItemUpdated (object sender, ItemUpdatedEventArgs args)
        {
            if (this.ItemUpdated != null)
            {
                this.ItemUpdated(this, args);
            }
        }

        public void Terminate ()
        {
            if (this.PrnBuffer != null)
            {
                this.PrnBuffer.IsTerminate = true;
            }
        }

        public void Dispose ()
        {
            this.Document.ItemUpdated -= this.PrnDocument_ItemUpdated;

            if (this.PrnStream != null)
            {
                this.PrnStream.Close();
            }
        }

        #endregion Methods :: Extract
    }



    /// <summary>
    /// static class :: PrnProcessorUtility (for Extension Methods)
    /// </summary>
    public static class PrnProcessorUtility
    {
        public static void WriteBinary (this Stream stream, byte[] binary)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("this Stream stream");
            }

            if (stream.CanWrite == false)
            {
                throw new InvalidOperationException("This stream can not write");
            }

            if (binary == null || binary.Length < 1)
            {
                throw new ArgumentNullException("byte[] binary");
            }

            stream.Write(binary, 0, binary.Length);
        }

        public static void WriteBinary (this Stream[] streams, byte[] binary)
        {
            if (streams == null || streams.Length < 1)
            {
                throw new ArgumentNullException("this Stream[] streams");
            }

            foreach (Stream stream in streams)
            {
                stream.WriteBinary(binary);
            }
        }

        public static void WriteString (this Stream stream, string line, Encoding encoding = null)
        {
            if (string.IsNullOrWhiteSpace(line) == true)
            {
                throw new ArgumentNullException("string line");
            }

            if (encoding == null)
            {
                encoding = Encoding.Default;
            }

            line = line.Trim();

            byte[] binary = encoding.GetBytes(line);

            PrnProcessorUtility.WriteBinary(stream, binary);
        }

        public static void WriteString (this Stream[] streams, string line, Encoding encoding = null)
        {
            if (streams == null || streams.Length < 1)
            {
                throw new ArgumentNullException("this Stream[] streams");
            }

            if (encoding == null)
            {
                encoding = Encoding.Default;
            }

            foreach (Stream stream in streams)
            {
                stream.WriteString(line, encoding);
            }
        }

        public static PrnBuffer SkipBuffer (this PrnBuffer buffer, Stream readStream, int lengthSkip, Stream[] arrOutputStream = null)
        {
            if (buffer == null)
            {
                throw new ArgumentNullException("this PrnBuffer buffer");
            }

            if (readStream == null)
            {
                throw new ArgumentNullException("Stream readStream");
            }

            if (readStream.CanRead == false || readStream.CanSeek == false)
            {
                throw new PrnParserException(PrnParserException.PrnParserExceptionType.CannotReadStream);
            }

            if (lengthSkip < 0)
            {
                throw new ArgumentOutOfRangeException("int lengthSkip", lengthSkip, string.Format("value is less than 0 ({0} < 0})", lengthSkip));
            }

            bool write = (arrOutputStream != null && arrOutputStream.Length > 0);

            if (buffer.Offset + lengthSkip < buffer.Length)
            {
                // <Example>
                // - offset : 5
                // - diff   : 2
                // - buffer : 9

                if (write == true)
                {
                    // WRITE and JUMP
                    arrOutputStream.WriteBinary(buffer.GetRange(buffer.Offset, lengthSkip));
                }

                buffer.Slice(buffer.Offset + lengthSkip);
            }
            else
            {
                // <Example>
                // - buffer.Offset : 5
                // - diff          : 50
                // - buffer.Length : 9

                long preLength = buffer.Length - buffer.Offset;
                
                if (write == true)
                {
                    arrOutputStream.WriteBinary(buffer.GetRange(buffer.Offset));
                }

                buffer.Offset += buffer.Length;

                buffer = PrnBuffer.BufferSecuringProcess(readStream, buffer, 0, buffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL, false, (int)lengthSkip + PDL.Constants.BufferProcessing.BufferSize);

                if (write == true)
                {
                    arrOutputStream.WriteBinary(buffer.GetRange(0, lengthSkip - preLength));
                }

                buffer.Slice(lengthSkip - preLength);
            }

            return buffer;
        }

        public static void CloseAll (this IEnumerable<Stream> listStream)
        {
            if (listStream == null || listStream.Count() < 1)
            {
                throw new ArgumentNullException("this IEnumerable<Stream> listStream");
            }

            foreach (Stream stream in listStream)
            {
                try
                {
                    stream.Close();
                }
                catch { }
            }
        }
    }
}