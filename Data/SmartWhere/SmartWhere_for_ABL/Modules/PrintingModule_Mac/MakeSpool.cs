namespace FXKIS.SmartWhere.PrintingModule.Mac
{
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Globalization;
    using System.IO;
    using System.Text;
    using System.Xml;
    using XmlLibrary;

    /// <summary>
    /// 원래 파일이 1up시 사용
    /// </summary>
    public class MakeSpool
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(MakeSpool));
        // N Up( 1, 2, 4)
        public enum NlppType
        {
            None = 0,
            N2 = 2,
            N4 = 4
        }

        public NlppType Nlpp { get; set; }

        private const string ExtensionXml = ".xml";
        private const string ExtensionPDF = ".pdf";

        public PrintJobData JobData { get; set; }
        public PrnMetadata  Metadata  { get; set; }
        public string NumberUp { get; set; }

        public FileInfo TempSpool { get; set; }
        public FileInfo TempPDF { get; set; }


        public readonly byte[] PjlStart = { 0x1B, 0x25, 0x2D, 0x31, 0x32, 0x33, 0x34, 0x35, 0x58 };

        public MakeSpool()
        {
            this.JobData  = null;
            this.Metadata = null;
            this.NumberUp = string.Empty;
            this.Nlpp     = NlppType.None;

            this.TempSpool = null;
            this.TempPDF = null;
        }

        public MakeSpool(PrintJobData jobInfo, PrnMetadata meta, string numberupOrg, FileInfo spool, FileInfo pdf) : this()
        {
            this.JobData  = jobInfo;
            this.Metadata = meta;
            this.NumberUp = numberupOrg;

            this.TempSpool = spool;
            this.TempPDF   = pdf;
        }
        public void CheckNup()
        {
            int nup = 0;
            if (int.TryParse(this.NumberUp, out nup) == true)
            {
                switch (nup)
                {
                    case 1:
                    case 2:
                        this.Nlpp = NlppType.N2;
                        break;

                    case 4:
                        this.Nlpp = NlppType.N4;
                        break;
                    default:
                        throw new ArgumentOutOfRangeException("nup");
                }
            }
           

        }

        public bool StartJob()
        {
            this.CheckNup();
            
            if(this.TempSpool.Exists == true)
            {
                this.TempSpool.Delete();
            }
            

            try
            {
                using (FileStream fs = this.TempSpool.Create())
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        this.AddPjlHeader(bw);

                        this.AddXml(bw);

                        this.AddPdf(bw);

                        this.AddPjlFooter(bw);

                        bw.Flush();
                    }
                }
                Logger.Debug("MakeSpool SUCCESS");
                return true;
            }
            catch (Exception ex)
            {
                Logger.Debug("MakeSpool FAIL");
                Logger.Error(ex);
                return false;
            }
        }
        
        public void AddPjlHeader(BinaryWriter bw)
        {
            DateTime date = DateTime.Now;

            bw.Write(this.PjlStart);

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.StringCodeSet));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.JobMode));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Begin));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Version));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Joau, this.Metadata.PrnInfo.UserID)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Joep));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Date, date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Time, date.ToString("HH:mm:ss"))));

            // nup
            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Nlpp, this.Nlpp)));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Uacn, this.JobData.DocumentName)));
            
            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.SetJobAtrr.Cnam, this.Metadata.PrnInfo.UserID)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.SetJobAtrr.Language));
        }


        public void AddXml(BinaryWriter bw)
        {
            string pathXmlTemplate = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PrintProcessor.XmlTemplateFileName);

            string pathXml = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathSpoolDirectory,
                this.JobData.ClientIPAddress, this.JobData.SpoolFileName + MakeSpool.ExtensionXml);

            bool isSuccess = this.MakeFile(pathXmlTemplate, pathXml);
            if (isSuccess == false)
            {
                if (File.Exists(pathXml) == true)
                {
                    File.Delete(pathXml);
                }
                throw new Exception("AddPjlHeaderFail");
            }

            using (FileStream fs = new FileStream(pathXml, FileMode.Open))
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    bw.Write(br.ReadBytes((int)fs.Length));
                }
            }

            File.Delete(pathXml);
        }


        public void AddPdf(BinaryWriter bw)
        {
            using (FileStream fs = new FileStream(this.TempPDF.FullName, FileMode.Open))
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    bw.Write(br.ReadBytes((int)fs.Length));
                }
            }
        }

        public void AddPjlFooter(BinaryWriter bw)
        {
            bw.Write(this.PjlStart);

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Version));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Begin));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PdlType));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PageCopies));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.JobCopies, this.JobData.Copies)));

            string duplexType = string.Empty;
            switch (this.JobData.Duplex)
            {
                case PrintJobData.DuplexType.Simplex : //OneSided SIMPLEX
                    duplexType = ProcessorUtility.FxJobInfo.OneSideedValue;
                    break;

                case PrintJobData.DuplexType.DuplexLongEdge: //TwoSidedLongEdge DUPLEX
                    duplexType = ProcessorUtility.FxJobInfo.TwoSidedLongEdgeValue;
                    break;

                case PrintJobData.DuplexType.DuplexShortEdge: //TwoSidedShortEdge TUMBLE
                    duplexType = ProcessorUtility.FxJobInfo.TwoSidedShortEdgeValue;
                    break;
            }

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.DuplexType, duplexType)));

            string color = string.Empty;
            
            switch (this.JobData.Color)
            {
                case PrintJobData.ColorType.Color:
                    color = ProcessorUtility.FxJobInfo.ColorValue;
                    break;

                case PrintJobData.ColorType.BlackWhite:
                    color = ProcessorUtility.FxJobInfo.GrayscaleValue;
                    break;
            }

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.ColorMode, color)));

            bw.WriteLine(Encoding.Default.GetBytes(string.Format(ProcessorUtility.FxJobInfo.Nup, this.JobData.Nup)));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.PassThrough));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.End));

            bw.WriteLine(Encoding.Default.GetBytes(ProcessorUtility.FxJobInfo.Eoj));
        }

        public bool MakeFile(string xmlTemplate, string xmlPath)
        {
            XmlHandler xmlHandle = new XmlHandler();
            try
            {
                XmlDocument document = new XmlDocument();
                document.Load(xmlTemplate);

                string copies   = this.JobData.Copies.ToString();
                
                string colorEffectsType = string.Empty;
                switch (this.JobData.Color)
                {
                    case PrintJobData.ColorType.Color:
                        colorEffectsType = ProcessorUtility.SetXml.ValueColor;
                        break;

                    case PrintJobData.ColorType.BlackWhite:
                        colorEffectsType = ProcessorUtility.SetXml.ValueBlackWhite;
                        break;
                }

                string sides = string.Empty;
                switch (this.JobData.Duplex)
                {
                    case PrintJobData.DuplexType.Simplex:
                        sides = ProcessorUtility.SetXml.ValueSimplex;
                        break;

                    case PrintJobData.DuplexType.DuplexLongEdge:
                        sides = ProcessorUtility.SetXml.ValueDuplexLongEdge;
                        break;

                    case PrintJobData.DuplexType.DuplexShortEdge:
                        sides = ProcessorUtility.SetXml.ValueDuplexShortEdge;
                        break;
                }

                string jobName = this.JobData.DocumentName;

                // 강제정책 컬러
                if (colorEffectsType == ProcessorUtility.SetXml.ValueColor)
                {
                    if (this.Metadata.Policy.PrintOption.ForceBlackWhite == true)
                    {
                        colorEffectsType = ProcessorUtility.SetXml.ValueBlackWhite;
                    }
                }

                // 강제정책 양단면
                if (sides == ProcessorUtility.SetXml.ValueSimplex)
                {
                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexShortEdge)
                    {
                        sides = ProcessorUtility.SetXml.ValueDuplexShortEdge;
                    }

                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexLongEdge)
                    {
                        sides = ProcessorUtility.SetXml.ValueDuplexLongEdge;
                    }
                }

                // 부수 : 정수치 (Min:1 ~ Max:99) 
                xmlHandle.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildCopies, copies);

                // 컬러
                xmlHandle.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildColorEffectsType, colorEffectsType);


                // 양단면
                xmlHandle.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides, sides);

                // nup
                int nup = (int)this.Nlpp;
                xmlHandle.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildNumberUp, nup.ToString());

                // 잡네임
                xmlHandle.SetNode(document, ProcessorUtility.SetXml.JobDescriptionNode, ProcessorUtility.SetXml.JobDescriptionChildJobName, jobName);
                

                XmlWriterSettings settings = new XmlWriterSettings
                {
                    Indent = true,
                    IndentChars = ("\t"),
                    Encoding = new UTF8Encoding(false) // The false means, do not emit the BOM.
                };

                FileInfo fi = new FileInfo(xmlPath);

                if (fi.Exists == true)
                {
                    fi.Delete();
                }

                using (FileStream fs = new FileStream(xmlPath, FileMode.CreateNew))
                {
                    using (StreamWriter sw = new StreamWriter(fs))
                    {
                        using (XmlWriter xw = XmlWriter.Create(fs, settings))
                        {
                            document.Save(xw);

                            sw.Write('\n');
                        }
                    }
                }

                Logger.InfoFormat("MakeXml : {0}\n{1}", fi.Name, document.OuterXml);
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                return false;
            }
        }
    }

    public static class MakeSpoolExtensions
    {
        public static void WriteLine(this BinaryWriter bw, byte[] binary)
        {
            if (bw == null)
            {
                throw new ArgumentNullException("this BinaryWriter bw");
            }

            if (binary == null || binary.Length < 1)
            {
                throw new ArgumentNullException("byte[] binary");
            }

            byte[] line = { 0x0d, 0x0a };

            bw.Write(binary);
            bw.Write(line);
        }
    }
}
