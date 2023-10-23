namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;

    using Metadata;
    using Policy;



    public class ExtractInformation
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "ExtractInfo";
            }
        }

        #endregion Constants :: XML



        #region Collections

        public List<DetectionInformation> DetectionList { get; private set; }

        #endregion Collections



        #region Constructors

        public ExtractInformation ()
        {
            this.InitializeCollections();
        }

        public ExtractInformation (PrnMetadata metadata) : this()
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (metadata.Policy == null || metadata.Policy.Securities == null || metadata.Policy.Securities.Count < 1)
            {
                return;
            }

            foreach (PrnSecurityPolicy security in metadata.Policy.Securities)
            {
                DetectionInformation detection = new DetectionInformation(security);

                if (detection.DetectionCountDictionary == null || detection.DetectionCountDictionary.Count < 1)
                {
                    continue;
                }

                this.DetectionList.Add(detection);
            }
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeCollections ()
        {
            this.DetectionList = new List<DetectionInformation>();
        }

        #endregion Methods :: Initialize



        #region Methods

        public XElement ToXML ()
        {
            XElement doc = new XElement(ExtractInformation.XML.Root.Name);

            List<XElement> listDetectionNode = new List<XElement>();

            foreach (DetectionInformation detection in this.DetectionList)
            {
                listDetectionNode.Add(detection.ToXML());
            }

            doc.Add(listDetectionNode.ToArray());

            return doc;
        }

        #endregion Methods
    }
}