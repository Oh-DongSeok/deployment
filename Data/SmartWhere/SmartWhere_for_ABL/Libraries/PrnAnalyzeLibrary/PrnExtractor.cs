namespace FXKIS.PDL.Analyze
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;
    using System.IO;

    using Data;
    using Event;
    using Exceptions;
    using EmailSender;

    using SmartWhere.Policy;
    using FXKIS.SmartWhere.CommonIF;
    using log4net;

    public partial class PrnExtractor : IDisposable
    {
        #region Events

        public event EventHandler<ItemUpdatedEventArgs> ItemUpdated;        

        #endregion Events


        #region Properties

        private Stream      PrnStream { get; set; }
        private PrnBuffer   PrnBuffer { get; set; }
        private PrnDocument Document  { get; set; }    
        private EmailSender Mailsender{ get; set; }

        public string userIDforDB { get; set; }
        public string emailTo { get; set; }
        public string originalDocumentName { get; set; }


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
        

        #endregion Properties



        #region Constructors

        public PrnExtractor (Stream stream)
        {
            this.Initialize(stream);
        }

        public PrnExtractor (string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            if (Path.IsPathRooted(path) == false)
            {
                path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }

            this.Initialize(new FileInfo(path));
        }

        public PrnExtractor (FileInfo fi)
        {
            this.Initialize(fi);
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void Initialize (Stream stream)
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

        private void Initialize (FileInfo fi)
        {
            if (fi == null)
            {
                throw new ArgumentNullException("FileInfo fi");
            }

            if (fi.Exists == false)
            {
                throw new FileNotFoundException("Analyzed Spoolfile is not exists", fi.FullName);
            }

            this.Initialize(fi.OpenRead());
        }

        #endregion Methods :: Initialize




        #region Methods :: Extract

        public PrnExtractedData Extract(DatabaseEnvironment database)
        {

            userIDforDB = string.Empty;
            

            PrnExtractedData data = new PrnExtractedData();

            /////////////////////////////////////////////////////////////////////

            if (database != null)
            {
                userIDforDB = this.ExtractPJL(ItemType.PJL.UserID);
               
            }
            
            if (string.IsNullOrWhiteSpace(userIDforDB) == true)
            {
                throw new InvalidDataException("User ID is not exists or invalid in Spoolfile");
            }

            /////////////////////////////////////////////////////////////////////

            PrnPolicyDatabaseManager db = new PrnPolicyDatabaseManager(database);

            data.Policy = db.Load(userIDforDB);

            if (data.Policy == null)
            {
                throw new InvalidDataException(string.Format("USER \"{0}\" is not exists in SmartWhere", userIDforDB));
            }


            /////////////////////////////////////////////////////////////////////

            if (data.Policy.Exceptional != null && data.Policy.Exceptional.IsEnabled == true)
            {
                if (string.IsNullOrWhiteSpace(data.Policy.Exceptional.Address) == true)
                {
                    throw new InvalidDataException("Exceptional Policy's Device Address is empty");
                }

                if (data.Policy.Exceptional.UsePolicy == false)
                {
                    data.Policy.ClearWithoutExceptional();
                }
            }

            /////////////////////////////////////////////////////////////////////

            // HEAD PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // PCL-XLs (Attribute & Operator)
            data.PCLXLs.AddRange(this.ExtractPCLXLs(data.Policy.HasMaskingProcessing));

            // TAIL PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // VERSION INFORMATION
            if (this.Document.PCLXL != null && this.Document.PCLXL.Header != null)
            {
                data.DriverVersion = this.Document.PCLXL.Header.VersionInfo;
                data.WindowsVersion = this.Document.PCLXL.Header.WindowsInfo;
            }


            /////////////////////////////////////////////////////////////////////
            

            return data;
        }

        public PrnExtractedData ExtractHeavy(DatabaseEnvironment database, SmartWhereEnvironment env)
        {

            userIDforDB = string.Empty;
            emailTo = string.Empty;
            originalDocumentName = string.Empty;

            PrnExtractedData data = new PrnExtractedData();            

            if (env != null)
            {
                this.Mailsender = new EmailSender(env);
            }
            /////////////////////////////////////////////////////////////////////

            if (database != null)
            {
                userIDforDB = this.ExtractPJL(ItemType.PJL.UserID);
                //emailTo = Mailsender.GetEmailAddress(userIDforDB);
                originalDocumentName = this.ExtractPJL(ItemType.PJL.DocumentName);
            }                      

            if (string.IsNullOrWhiteSpace(userIDforDB) == true)
            {
                throw new InvalidDataException("User ID is not exists or invalid in Spoolfile");
            }

            //if (this.Length > env.Analyzer.AbortSizeLimit)
            //{
            //    this.Mailsender.SendEmail(EmailEnvironment.MailType.SpoolAbort, emailTo, originalDocumentName);
            //    return null;
            //}

            //if (emailTo != string.Empty)
            //{
            //    this.Mailsender.SendEmail(EmailEnvironment.MailType.SpoolReady,emailTo, originalDocumentName);
            //}

            /////////////////////////////////////////////////////////////////////

            PrnPolicyDatabaseManager db = new PrnPolicyDatabaseManager(database);

            data.Policy = db.Load(userIDforDB);

            if (data.Policy == null)
            {
                throw new InvalidDataException(string.Format("USER \"{0}\" is not exists in SmartWhere", userIDforDB));
            }            

            /////////////////////////////////////////////////////////////////////

            if (data.Policy.Exceptional != null && data.Policy.Exceptional.IsEnabled == true)
            {
                if (string.IsNullOrWhiteSpace(data.Policy.Exceptional.Address) == true)
                {
                    throw new InvalidDataException("Exceptional Policy's Device Address is empty");
                }

                if (data.Policy.Exceptional.UsePolicy == false)
                {
                    data.Policy.ClearWithoutExceptional();
                }
            }

            /////////////////////////////////////////////////////////////////////

            // HEAD PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // PCL-XLs (Attribute & Operator)
            data.PCLXLs.AddRange(this.ExtractPCLXLs(data.Policy.HasMaskingProcessing));

            // TAIL PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // VERSION INFORMATION
            if (this.Document.PCLXL != null && this.Document.PCLXL.Header != null)
            {
                data.DriverVersion = this.Document.PCLXL.Header.VersionInfo;
                data.WindowsVersion = this.Document.PCLXL.Header.WindowsInfo;
            }


            /////////////////////////////////////////////////////////////////////

            return data;
        }

        public PrnExtractedData Extract (PrnPolicy policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicy policy");
            }

            PrnExtractedData data = new PrnExtractedData();

            data.Policy = policy;

            // not used
            string userID = this.ExtractPJL(ItemType.PJL.UserID);

            /////////////////////////////////////////////////////////////////////

            // HEAD PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // PCL-XLs (Attribute & Operator)
            data.PCLXLs.AddRange(this.ExtractPCLXLs(data.Policy.HasMaskingProcessing));

            // TAIL PJLs
            data.PJLs.AddRange(this.ExtractPJLs(ItemType.PJL.All));

            // VERSION INFORMATION
            if (this.Document.PCLXL != null && this.Document.PCLXL.Header != null)
            {
                data.DriverVersion  = this.Document.PCLXL.Header.VersionInfo;
                data.WindowsVersion = this.Document.PCLXL.Header.WindowsInfo;
            }

            /////////////////////////////////////////////////////////////////////

            return data;
        }

        private string ExtractPJL (ItemType.PJL extractType = ItemType.PJL.All)
        {
            if (extractType == ItemType.PJL.Unknown || extractType == ItemType.PJL.All)
            {
                throw new ArgumentException("Extract Type is not supported in this method", "PJLItemType extractType");
            }

            Dictionary<ItemType.PJL, string> dictionary = new Dictionary<ItemType.PJL, string>();

            dictionary = this.ExtractPJLs(extractType);
            
            if (dictionary == null || dictionary.ContainsKey(extractType) == false)
            {
                return string.Empty;
            }

            return dictionary[extractType];
        }

        private Dictionary<ItemType.PJL, string> ExtractPJLs (ItemType.PJL extractType = ItemType.PJL.All)
        {
            if (this.PrnStream == null)
            {
                throw new InvalidOperationException("Stream is null");
            }

            if (extractType == ItemType.PJL.Unknown)
            {
                throw new ArgumentException("Extract Type is invalid", "PJLItemType extractType");
            }

            Dictionary<ItemType.PJL, string> dictionary = new Dictionary<ItemType.PJL, string>();

            try
            {
                PJLReader pjlReader = new PJLReader();

                if (this.PrnStream.CanRead == false || this.PrnStream.CanSeek == false)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.CannotReadStream);
                }

                bool bufferReadStopCondition = false;

                PJLItem removedPJL = null;

                while (true)
                {
                    if (bufferReadStopCondition == true || this.PrnBuffer.ReaderMode != PrnBuffer.PrnReaderMode.PJL)
                    {
                        break;
                    }

                    this.PrnBuffer.Buffer = BufferProcessing.ReadBuffer(this.PrnStream, PDL.Constants.BufferProcessing.BufferSize);

                    if (this.PrnBuffer == null)
                    {
                        break;
                    }
                    
                    if (this.PrnBuffer.Buffer == null)
                    {
                        if (this.PrnBuffer.RemainBuffer[0] != 0x1b)
                        {
                            break;
                        }
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

                // Extract
                foreach (PJLItem pjl in this.Document.PJL.Items)
                {
                    string strKey = string.Empty;
                    string value  = string.Empty;
                    ItemType.PJL key;

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
                                continue;
                        }

                        if (string.IsNullOrWhiteSpace(strKey) == true)
                        {
                            continue;
                        }

                        key = ItemType.StringToPJL(strKey);

                        if (key == ItemType.PJL.Unknown || key == ItemType.PJL.All)
                        {
                            // invalid PJL item
                            continue;
                        }

                        if (extractType == ItemType.PJL.All && dictionary.ContainsKey(key) == true)
                        {
                            continue;
                        }

                        if (extractType == key)
                        {
                            removedPJL = pjl;

                            bufferReadStopCondition = true;
                        }

                        dictionary.Add(key, value);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return dictionary;
        }


        private SortedDictionary<long, PCLXLItem> ExtractPCLXLs (bool isMasking = false)
        {
            if (this.PrnStream == null)
            {
                throw new InvalidOperationException("Stream is null");
            }

            SortedDictionary<long, PCLXLItem> dictionary = new SortedDictionary<long, PCLXLItem>();

            try
            {
                PCLXLExtractor pclxlReader = new PCLXLExtractor(this.PrnStream);

                if (this.PrnStream.CanRead == false || this.PrnStream.CanSeek == false)
                {
                    throw new PrnParserException(PrnParserException.PrnParserExceptionType.CannotReadStream);
                }

                bool bufferReadStopCondition = false;

                while (true)
                {
                    if (bufferReadStopCondition == true || this.PrnBuffer.ReaderMode != PrnBuffer.PrnReaderMode.PCLXL)
                    {
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
                                this.PrnBuffer = pclxlReader.Extract(this.PrnBuffer, this.Document, isMasking);
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

                // Extract
                foreach (PCLXLItem pcl in this.Document.PCLXL.Items)
                {
                    try
                    {
                        if (dictionary.ContainsKey(pcl.Offset) == true)
                        {
                            continue;
                        }

                        dictionary.Add(pcl.Offset, pcl);
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return dictionary;
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
}
