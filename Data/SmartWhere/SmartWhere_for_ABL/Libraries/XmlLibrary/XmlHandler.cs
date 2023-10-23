namespace XmlLibrary
{
    using FXKIS.SmartWhere.CommonIF;
    using FXKIS.SmartWhere.Metadata;
    using log4net;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Xml;

    public class XmlHandler
    {
        public const int BufferSize = 524288;

        public static readonly ILog Logger = LogManager.GetLogger(typeof(XmlHandler));

        public XmlHandler()
        {
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
            XmlNodeList nodeList = document.SelectNodes(parentNode);
            XmlNode selectNode = nodeList[0].SelectSingleNode(childNode);

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
            XmlNode seletNode = document.SelectSingleNode(parentNode); // 추가할 부모 Node 찾기
            XmlElement xmlEle = document.CreateElement(addNode); // 추가할 Node 생성

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
            XmlNodeList nodeList = document.SelectNodes(parentNode);
            XmlNode seletNode = nodeList[0].SelectSingleNode(delNode);
            XmlNode parentSeletNode = seletNode.ParentNode;

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

                                            if (data == 0x0a || fsLoad.Position == fsLoad.Length)
                                            {
                                                byte[] dataByte = listByte.ToArray();
                                                dataString = Encoding.UTF8.GetString(dataByte);

                                                listByte.Clear();

                                                // xml 시작~
                                                if (dataString.Contains("<?xml version") && xmlWriteStart == false)
                                                {
                                                    do
                                                    {
                                                        bw.Write(xmlBr.ReadBytes(XmlHandler.BufferSize));
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
