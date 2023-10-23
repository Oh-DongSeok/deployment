namespace FXKIS.SmartWhere.PrintingModule.Mobile
{
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Xml;

    public class XmlModify
    {
        private const string ValueSimplex         = "OneSided";
        private const string ValueDuplexLongEdge  = "TwoSidedLongEdge";
        private const string ValueDuplexShortEdge = "TwoSidedShortEdge";
        private const string ValueColor           = "Color";
        private const string ValueBlackWhite      = "MonochromeGrayscale";

        public const string DocumentProcessingNode = "PwgPrintJobTicket/DocumentProcessing";
        public const string MediaColNode           = "PwgPrintJobTicket/DocumentProcessing/MediaCol";
        public const string JobDescriptionNode     = "PwgPrintJobTicket/JobDescription";


        public const string DocumentProcessingChildCopies           = "Copies";
        public const string DocumentProcessingChildSheetCollate     = "SheetCollate";
        public const string DocumentProcessingChildColorEffectsType = "ColorEffectsType";
        public const string DocumentProcessingChildSides            = "Sides";
        public const string DocumentProcessingChildNumberUp         = "NumberUp";
        public const string DocumentProcessingNodeChildUpper        = "PageRanges/PageRange/Upperbound";
        public const string DocumentProcessingNodeChildLower        = "PageRanges/PageRange/Lowerbound";
        public const string DocumentProcessingChildFinishings        = "Finishings";
         
        public const string MediaColChildMediaSizeName = "MediaSizeName";
        public const string MediaColChildMediaLocation = "MediaLocations/MediaLocation";

        public const string JobDescriptionChildJobName = "JobName";


        public const int BufferSize = 524288;

        public PrnMetadata Metadata { get; set; }
        public PrintJobData JobData { get; set; }

        public static readonly ILog Logger = LogManager.GetLogger(typeof(XmlModify));

        public XmlModify()
        {
            this.Metadata = null;
            this.JobData = null;
        }
        
        public XmlModify(PrnMetadata metadata, PrintJobData jobData) : this()
        {
            this.Metadata = metadata;
            this.JobData = jobData;
        }

        public bool Start(FileInfo fi)
        {
            string xmlFile = fi.FullName + ".xml";

            if(this.MakeXML(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("MakeXML FAIL : {0}",fi.Name);
                return false;
            }
            Logger.InfoFormat("MakeXML SUCCESS : {0}", fi.Name);

            if(this.ModiXml(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("ModiXml : {0}", fi.Name);
                return false;
            }
            Logger.InfoFormat("ModiXml SUCCESS : {0}", fi.Name);

            if(this.RemakeSpool(fi.FullName, xmlFile) == false)
            {
                Logger.InfoFormat("RemakeSpool : {0}", fi.Name);
                return false;
            }
            Logger.InfoFormat("RemakeSpool SUCCESS : {0}", fi.Name);
            return true;
        }


        public bool MakeXML(string spoolFile, string xmlFile)
        {
            try
            {
                bool isStart = false;

                if (File.Exists(xmlFile))
                {
                    File.Delete(xmlFile);
                }

                List<byte> listByte = new List<byte>();
                string dataString = string.Empty;
                using (FileStream fsLoad = new FileStream(spoolFile, FileMode.Open, FileAccess.Read))
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        using (FileStream fsSave = new FileStream(xmlFile, FileMode.CreateNew, FileAccess.Write))
                        {
                            using (BinaryWriter bw = new BinaryWriter(fsSave))
                            {
                                do
                                {
                                    byte data = br.ReadByte();
                                    listByte.Add(data);

                                    if (data == 0x0a)
                                    {
                                        byte[] dataByte = listByte.ToArray();
                                        dataString = Encoding.UTF8.GetString(dataByte);

                                        listByte.Clear();

                                        if (isStart == false && dataString.Contains("<?xml version"))
                                        {
                                            bw.Write(dataByte);
                                            bw.Flush();
                                            isStart = true;
                                        }
                                        else if (isStart == true)
                                        {
                                            if (dataString.Contains("%PDF"))
                                            {
                                                break;
                                            }
                                            bw.Write(dataByte);
                                            bw.Flush();
                                        }
                                    }
                                } while (fsLoad.Position < fsLoad.Length);
                            }

                        }
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex.TargetSite);
                return false;
            }
        }

        
        public bool ModiXml(string spoolFile, string xmlFile)
        {
            try
            {
                XmlDocument document = new XmlDocument();
                document.Load(xmlFile);

                string copiesOrigin           = this.JobData.Copies.ToString();
                string numberUpOrigin         = this.JobData.Nup.ToString();
                string colorEffectsTypeOrigin = string.Empty;
                string sidesOrigin            = string.Empty;
                string jobNameOrigin          = this.JobData.DocumentName;

                PrintJobData.ColorType colorEffectsType = this.JobData.Color;
                switch (colorEffectsType)
                {
                    case PrintJobData.ColorType.BlackWhite:
                        colorEffectsTypeOrigin = XmlModify.ValueBlackWhite;
                        break;

                    case PrintJobData.ColorType.Color:
                        colorEffectsTypeOrigin = XmlModify.ValueColor;
                        break;

                    default:
                        colorEffectsTypeOrigin = string.Empty;
                        break;
                }

                PrintJobData.DuplexType sides = this.JobData.Duplex;
                switch (sides)
                {
                    case PrintJobData.DuplexType.Simplex:
                        sidesOrigin = XmlModify.ValueSimplex;
                        break;

                    case PrintJobData.DuplexType.DuplexLongEdge:
                        sidesOrigin = XmlModify.ValueDuplexLongEdge;
                        break;

                    case PrintJobData.DuplexType.DuplexShortEdge:
                        sidesOrigin = XmlModify.ValueDuplexShortEdge;
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
                string getCopies           = GetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildCopies);
                string getColorEffectsType = GetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildColorEffectsType);
                string getSides            = GetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildSides);
                string getNumberUp         = GetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildNumberUp);
                string getJobName          = GetNode(document, XmlModify.JobDescriptionNode, XmlModify.JobDescriptionChildJobName);

                // xml에 finishings 포함시 제거(Staple Option)
                string getFinishings = GetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildFinishings);
                if (string.IsNullOrWhiteSpace(getFinishings) == false)
                {
                    DeleteNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildFinishings);
                }

                if (getNumberUp == string.Empty)
                {
                    getNumberUp = "1";
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

                    SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildCopies, copiesOrigin);
                }

                // 컬러
                if (getColorEffectsType != colorEffectsTypeOrigin)
                {
                    SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildColorEffectsType, colorEffectsTypeOrigin);
                }

                // 양단면
                if (getSides != sidesOrigin)
                {
                    SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildSides, sidesOrigin);
                }

                if (this.Metadata.PrnInfo.TotalPages == 1)
                {
                    if (getNumberUp != "1")
                    {
                        DeleteNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildNumberUp);
                    }
                }
                else
                {
                    // N Up( 1, 2, 4)
                    if (getNumberUp != numberUpOrigin)
                    {
                        int numberUpParse = 0;
                        if (int.TryParse(numberUpOrigin, out numberUpParse) == false)
                        {
                            throw new NotFiniteNumberException("numberUpOrigin is not a number");
                        }

                        if (numberUpParse < 1 || numberUpParse == 3 || numberUpParse > 4)
                        {
                            throw new ArgumentOutOfRangeException("numberUpOrigin");
                        }

                        if (numberUpOrigin == "1")
                        {
                            DeleteNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildNumberUp);
                        }
                        else
                        {
                            SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildNumberUp, numberUpOrigin);
                        }
                    }

                    // 강제정책 2up
                    if (numberUpOrigin == "1")
                    {
                        if (this.Metadata.Policy.PrintOption.Force2Up == true)
                        {
                            SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildNumberUp, "2");
                        }
                    }
                }

                if (getJobName != jobNameOrigin)
                {
                    SetNode(document, XmlModify.JobDescriptionNode, XmlModify.JobDescriptionChildJobName, jobNameOrigin);
                }

                // 강제정책 컬러
                if (colorEffectsTypeOrigin == XmlModify.ValueColor)
                {
                    if (this.Metadata.Policy.PrintOption.ForceBlackWhite == true)
                    {
                        SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildColorEffectsType, XmlModify.ValueBlackWhite);
                    }
                }

                // 강제정책 양단면
                if (sidesOrigin == XmlModify.ValueSimplex)
                {
                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexShortEdge)
                    {
                        SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildSides, XmlModify.ValueDuplexShortEdge);
                    }

                    if (this.Metadata.Policy.PrintOption.ForceDuplex == Policy.PrnPrintOptionPolicy.ForceDuplexType.DuplexLongEdge)
                    {
                        SetNode(document, XmlModify.DocumentProcessingNode, XmlModify.DocumentProcessingChildSides, XmlModify.ValueDuplexLongEdge);
                    }
                }

                XmlWriterSettings settings = new XmlWriterSettings
                {
                    Indent = true,
                    IndentChars = ("\t"),
                    Encoding = new UTF8Encoding(false) // The false means, do not emit the BOM.
                };

                string tempXml = xmlFile + ".xml";
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

       
        /// <summary>
        /// 노드의 텍스트 GET
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="childNode">자식 노드</param>
        /// <returns></returns>
        public string GetNode(XmlDocument document, string parentNode, string childNode)
        {
            XmlNodeList nodeList = document.SelectNodes(parentNode);
            XmlNode selectNode = nodeList[0].SelectSingleNode(childNode);
            if (selectNode == null)
            {
                return string.Empty;
            }

            return selectNode.InnerText;
        }


        /// <summary>
        /// 노드의 텍스트 SET
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="childNode">자식 노드</param>
        /// <param name="setValue">노드의 수정할 값</param>
        public void SetNode(XmlDocument document, string parentNode, string childNode, string setValue)
        {
            XmlNodeList nodeList   = document.SelectNodes(parentNode);
            XmlNode     selectNode = nodeList[0].SelectSingleNode(childNode);

            if (selectNode == null)
            {
                AddNode(document, parentNode, childNode, setValue);
                return;
            }
            selectNode.InnerText = setValue;
        }
         
         
        /// <summary>
        /// 노드 삽입할때
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="addNode">추가할 노드</param>
        /// <param name="setValue">노드의 추가할 값</param>
        public void AddNode(XmlDocument document, string parentNode, string addNode, string setValue)
        {
            XmlNode    seletNode = document.SelectSingleNode(parentNode); // 추가할 부모 Node 찾기
            XmlElement xmlEle    = document.CreateElement(addNode); // 추가할 Node 생성

            xmlEle.InnerText = setValue;

            seletNode.AppendChild(xmlEle); // 위에서 찾은 부모 Node에 자식 노드로 추가
        }


        /// <summary>
        /// 노드 삭제할때
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="delNode">삭제할 노드</param>
        public void DeleteNode(XmlDocument document, string parentNode, string delNode)
        {
            XmlNodeList nodeList        = document.SelectNodes(parentNode);
            XmlNode     seletNode       = nodeList[0].SelectSingleNode(delNode);
            XmlNode     parentSeletNode = seletNode.ParentNode;

            parentSeletNode.RemoveChild(seletNode);
        }


        public bool RemakeSpool(string loadFi, string modiXml)
        {
            try
            {
                string saveFi = loadFi + "temp";
                if (File.Exists(saveFi))
                {
                    File.Delete(saveFi);
                }

                bool xmlWriteStart = false;
                bool xmlWriteEnd = false;

                byte data = 0;
                List<byte> listByte = new List<byte>();
                string dataString = string.Empty;
                using (FileStream fsLoad = new FileStream(loadFi, FileMode.Open, FileAccess.Read))
                {
                    using (BinaryReader br = new BinaryReader(fsLoad))
                    {
                        using (FileStream xmlLoad = new FileStream(modiXml, FileMode.Open, FileAccess.Read))
                        {
                            using (BinaryReader xmlBr = new BinaryReader(xmlLoad))
                            {
                                using (FileStream fs = new FileStream(saveFi, FileMode.CreateNew, FileAccess.Write))
                                {
                                    using (BinaryWriter bw = new BinaryWriter(fs))
                                    {
                                        do
                                        {
                                            data = br.ReadByte();
                                            listByte.Add(data);

                                            if (data == 0x0a)
                                            {
                                                byte[] dataByte = listByte.ToArray();
                                                dataString = Encoding.UTF8.GetString(dataByte);

                                                listByte.Clear();

                                                // xml 시작~
                                                if (dataString.Contains("<?xml version") && xmlWriteStart == false)
                                                {
                                                    do
                                                    {
                                                        bw.Write(xmlBr.ReadBytes(XmlModify.BufferSize));
                                                        bw.Flush();

                                                    } while (xmlLoad.Position < xmlLoad.Length);

                                                    xmlWriteStart = true;
                                                }

                                                // xml 시작전
                                                else if (xmlWriteStart == false && xmlWriteEnd == false)
                                                {
                                                    bw.Write(dataByte);
                                                    bw.Flush();
                                                }

                                                // xml 끝
                                                else if (xmlWriteStart == true && dataString.Contains("%PDF") == true)
                                                {
                                                    bw.Write(dataByte);
                                                    bw.Flush();
                                                    xmlWriteEnd = true;

                                                }
                                                // 뒷부분
                                                else if (xmlWriteEnd == true)
                                                {
                                                    bw.Write(dataByte);
                                                    bw.Flush();
                                                }

                                            }
                                        } while (fsLoad.Position < fsLoad.Length);
                                    }
                                }
                            }

                        }
                    }
                }

                File.Delete(modiXml);
                File.Delete(loadFi);
                File.Move(saveFi, loadFi);

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
