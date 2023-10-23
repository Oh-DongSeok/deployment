namespace FXKIS.SmartWhere.PdfReceive
{
    using log4net;
    using System;
    using System.IO;
    using System.Text;
    using System.Xml;


    public class MakeXml
    {
        public JobInfo JobInfo = null;
        public static readonly ILog Logger = LogManager.GetLogger(typeof(MakeXml));

        public MakeXml(JobInfo jobInfo)
        {
            this.JobInfo = jobInfo;
        }
        
        public bool MakeFile(string xmlTemplate, string xmlPath)
        {
            try
            {
                XmlDocument document = new XmlDocument();
                document.Load(xmlTemplate);
                
                string copies   = this.JobInfo.Copies.ToString();
                string numberUp = this.JobInfo.Nup.ToString();

                string colorEffectsType = string.Empty;
                switch (this.JobInfo.ColorMode)
                {
                    case JobInfo.ColorType.C:

                        colorEffectsType = ProcessorUtility.SetXml.ValueColor;
                        break;
                    case JobInfo.ColorType.B:
                        colorEffectsType = ProcessorUtility.SetXml.ValueBlackWhite;
                        break;

                }
               
                string sides = string.Empty;
                switch (this.JobInfo.OutPlex)
                {
                    case JobInfo.DuplexType.S:
                        sides = ProcessorUtility.SetXml.ValueSimplex;
                        break;
                    case JobInfo.DuplexType.DL:
                        sides = ProcessorUtility.SetXml.ValueDuplexLongEdge;
                        break;
                    case JobInfo.DuplexType.DS:
                        sides = ProcessorUtility.SetXml.ValueDuplexShortEdge;
                        break;
                }

                string jobName = this.JobInfo.DocName;

                // 부수 : 정수치 (Min:1 ~ Max:99) 
                SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildCopies, copies);

                // 컬러
                SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildColorEffectsType, colorEffectsType);


                // 양단면
                SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildSides, sides);

                // nup  
                if (numberUp == "1")
                {
                    DeleteNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildNumberUp);
                }
                else
                {
                    SetNode(document, ProcessorUtility.SetXml.DocumentProcessingNode, ProcessorUtility.SetXml.DocumentProcessingChildNumberUp, numberUp);
                }

                // 잡네임
                SetNode(document, ProcessorUtility.SetXml.JobDescriptionNode, ProcessorUtility.SetXml.JobDescriptionChildJobName, jobName);
                
                XmlWriterSettings settings = new XmlWriterSettings
                {
                    Indent      = true,
                    IndentChars = ("\t"),
                    Encoding    = new UTF8Encoding(false) // The false means, do not emit the BOM.
                };

                FileInfo fi = new FileInfo(xmlPath);

                if(fi.Exists == true)
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


        /// <summary>
        /// 노드의 텍스트 GET
        /// </summary>
        /// <param name="document">xml파일</param>
        /// <param name="parentNode">부모 노드</param>
        /// <param name="childNode">자식 노드</param>
        /// <returns></returns>
        public string GetNode(XmlDocument document, string parentNode, string childNode)
        {
            XmlNodeList nodeList   = document.SelectNodes(parentNode);
            XmlNode     selectNode = nodeList[0].SelectSingleNode(childNode);
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
    }
}
