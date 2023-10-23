namespace FXKIS.SmartWhere.PrintingModule.Mac
{
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.IO;
    using System.Text;
    using System.Xml;
    using XmlLibrary;

    public class XmlProcessor
    {
        private const string ExtensionXml = ".xml";

        public const int BufferSize = 524288;

        public PrnMetadata  Metadata { get; set; }
        public PrintJobData JobData  { get; set; }

        public static readonly ILog Logger = LogManager.GetLogger(typeof(XmlProcessor));

        public XmlProcessor()
        {
            this.Metadata = null;
            this.JobData  = null;
        }

        public XmlProcessor(PrnMetadata metadata, PrintJobData jobData) : this()
        {
            this.Metadata = metadata;
            this.JobData  = jobData;
        }

        public bool Start(FileInfo fi)
        {

            XmlHandler xmlHandler = new XmlHandler();
            
            string xmlFile = fi.FullName + XmlProcessor.ExtensionXml;
            
            if (xmlHandler.MakeXML(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("MakeXML FAIL : {0}", fi.Name);
                return false;
            }
            Logger.InfoFormat("MakeXML SUCCESS : {0}", fi.Name);

            if (this.ModiXml(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("ModiXml : {0}", fi.Name);
                return false;
            }
            Logger.InfoFormat("ModiXml SUCCESS : {0}", fi.Name);

            if (xmlHandler.RemakeSpool(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("RemakeSpool : {0}", fi.Name);
                return false;
            }
            Logger.InfoFormat("RemakeSpool SUCCESS : {0}", fi.Name);
            return true;
        }


        public bool ModiXml(string spoolFile, string xmlFile)
        {
            XmlHandler xmlHandler = new XmlHandler();
            try
            {
                XmlDocument document = new XmlDocument();
                document.Load(xmlFile);

                string copiesOrigin           = this.JobData.Copies.ToString();
                string numberUpOrigin         = this.JobData.Nup.ToString();
                string colorEffectsTypeOrigin = string.Empty;
                string sidesOrigin            = string.Empty;

                PrintJobData.ColorType colorEffectsType = this.JobData.Color;
                switch (colorEffectsType)
                {
                    case PrintJobData.ColorType.BlackWhite:
                        colorEffectsTypeOrigin = ProcessorUtility.SetXml.ValueBlackWhite;
                        break;

                    case PrintJobData.ColorType.Color:
                        colorEffectsTypeOrigin = ProcessorUtility.SetXml.ValueColor;
                        break;

                    default:
                        colorEffectsTypeOrigin = string.Empty;
                        break;
                }

                PrintJobData.DuplexType sides = this.JobData.Duplex;
                switch (sides)
                {
                    case PrintJobData.DuplexType.Simplex:
                        sidesOrigin = ProcessorUtility.SetXml.ValueSimplex;
                        break;

                    case PrintJobData.DuplexType.DuplexLongEdge:
                        sidesOrigin = ProcessorUtility.SetXml.ValueDuplexLongEdge;
                        break;

                    case PrintJobData.DuplexType.DuplexShortEdge:
                        sidesOrigin = ProcessorUtility.SetXml.ValueDuplexShortEdge;
                        break;

                    default:
                        sidesOrigin = string.Empty;
                        break;
                }

                if (string.IsNullOrWhiteSpace(colorEffectsTypeOrigin))
                {
                    throw new ArgumentNullException("colorEffectsTypeOrigin");
                }

                if (string.IsNullOrWhiteSpace(sidesOrigin))
                {
                    throw new ArgumentNullException("sidesOrigin");
                }

                // xml에서 읽어온 데이터
                string getCopies = xmlHandler.GetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildCopies);
                string getSides  = xmlHandler.GetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides);
                string getColorEffectsType = xmlHandler.GetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildColorEffectsType);

                // xml에 finishings 포함시 제거(Staple Option)
                string getFinishings = xmlHandler.GetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildFinishings);
                if (string.IsNullOrWhiteSpace(getFinishings) == false)
                {
                    xmlHandler.DeleteNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildFinishings);
                }

                // 부수 : 정수치 (Min:1 ~ Max:99) 
                if (getCopies != copiesOrigin)
                {
                    int copiesParse = 0;
                    if (int.TryParse(copiesOrigin, out copiesParse) == false)
                    {
                        throw new NotFiniteNumberException("copiesOrigin is not a number");
                    }

                    if (copiesParse < 1 || copiesParse > 99)
                    {
                        throw new ArgumentOutOfRangeException("copiesOrigin");
                    }

                    xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildCopies, copiesOrigin);
                }

                // 컬러
                if (getColorEffectsType != colorEffectsTypeOrigin)
                {
                    xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildColorEffectsType, colorEffectsTypeOrigin);
                }

                // 양단면
                if (getSides != sidesOrigin)
                {
                    xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides, sidesOrigin);
                }
                
                // 강제정책 컬러
                if (colorEffectsTypeOrigin == ProcessorUtility.SetXml.ValueColor)
                {
                    if (this.Metadata.Policy.PrintOption.ForceBlackWhite == true)
                    {
                        xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildColorEffectsType, 
                            ProcessorUtility.SetXml.ValueBlackWhite);
                    }
                }

                // 강제정책 양단면
                if (sidesOrigin == ProcessorUtility.SetXml.ValueSimplex)
                {
                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexShortEdge)
                    {
                        xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides, ProcessorUtility.SetXml.ValueDuplexShortEdge);
                    }

                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexLongEdge)
                    {
                        xmlHandler.SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides, ProcessorUtility.SetXml.ValueDuplexLongEdge);
                    }
                }
                
                XmlWriterSettings settings = new XmlWriterSettings
                {
                    Indent      = true,
                    IndentChars = ("\t"),
                    Encoding    = new UTF8Encoding(false) // The false means, do not emit the BOM.
                };

                string tempXml = xmlFile + XmlProcessor.ExtensionXml;
                if (File.Exists(tempXml))
                {
                    File.Delete(tempXml);
                }

                using (FileStream fs = new FileStream(tempXml, FileMode.CreateNew))
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

                Logger.InfoFormat("ModiXml : {0}\n{1}", spoolFile, document.OuterXml);

                File.Delete(xmlFile);
                File.Move(tempXml, xmlFile);

                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.TargetSite);
                return false;
            }
        }
    }
}

