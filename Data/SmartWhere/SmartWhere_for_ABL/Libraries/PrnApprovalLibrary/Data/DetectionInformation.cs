namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;

    using Policy;



    public class DetectionInformation
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name         = "PolicyInfo";
                public const string NameForItems = "Items";
                public const string NameForItem  = "Item";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string Type         = "Type";
                    public const string SecurityCD   = "SecurityCD";
                    public const string SecurityName = "SecurityNM";
                    public const string LimitCount   = "LimitCNT";
                    public const string Page         = "Page";
                    public const string Count        = "Count";
                }

                public struct Value
                {
                    public const string TypePattern = "P";
                    public const string TypeKeyword = "K";
                }
            }
        }


        #endregion Constants :: XML



        #region Properties

        public PrnSecurityPolicy.SecurityType Type         { get; set; }
        public string                         SecurityCD   { get; set; }
        public string                         SecurityName { get; set; }
        public int                            LimitCount   { get; set; }

        #endregion Properties



        #region Collections

        public SortedDictionary<int, int> DetectionCountDictionary { get; private set; }

        #endregion Collections



        #region Constructors

        public DetectionInformation ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public DetectionInformation (PrnSecurityPolicy security) : this()
        {
            ////////////////////////////////////////////////////////////////////////////////

            if (security == null)
            {
                throw new ArgumentNullException("PrnSecurityPolicy security");
            }

            ////////////////////////////////////////////////////////////////////////////////

            SortedDictionary<int, int> dictionary = security.GetDetectionCountDictionary();

            if (dictionary == null || dictionary.Count < 1)
            {
                return;
            }

            ////////////////////////////////////////////////////////////////////////////////

            this.Type         = security.Type;
            this.SecurityCD   = security.ID;
            this.SecurityName = security.Name;
            this.LimitCount   = security.LimitCount;

            foreach (var pair in dictionary)
            {
                this.DetectionCountDictionary.Add(pair.Key, pair.Value);
            }

            ////////////////////////////////////////////////////////////////////////////////
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Type         = PrnSecurityPolicy.SecurityType.Unknown;
            this.SecurityCD   = string.Empty;
            this.SecurityName = string.Empty;
            this.LimitCount   = 0;
        }

        private void InitializeCollections ()
        {
            this.DetectionCountDictionary = new SortedDictionary<int, int>();
        }

        #endregion Methods :: Initialize



        #region Methods

        public XElement ToXML ()
        {
            string strType = string.Empty;

            switch (this.Type)
            {
                case PrnSecurityPolicy.SecurityType.Pattern:
                    strType = DetectionInformation.XML.Element.Value.TypePattern;
                    break;

                case PrnSecurityPolicy.SecurityType.Keyword:
                    strType = DetectionInformation.XML.Element.Value.TypeKeyword;
                    break;

                default:
                    throw new NotSupportedException(string.Format("Type is not supported (TYPE: {0})", this.Type.ToString()));
            }

            XElement doc = new XElement(DetectionInformation.XML.Root.Name,
                new XElement(DetectionInformation.XML.Element.Name.Type,         strType),
                new XElement(DetectionInformation.XML.Element.Name.SecurityCD,   this.SecurityCD),
                new XElement(DetectionInformation.XML.Element.Name.SecurityName, this.SecurityName),
                new XElement(DetectionInformation.XML.Element.Name.LimitCount,   this.LimitCount)
                );

            List<XElement> listItems = new List<XElement>();

            foreach (var pair in this.DetectionCountDictionary)
            {
                XElement item = new XElement(DetectionInformation.XML.Root.NameForItem,
                    new XElement(DetectionInformation.XML.Element.Name.Page,  pair.Key),
                    new XElement(DetectionInformation.XML.Element.Name.Count, pair.Value)
                    );

                listItems.Add(item);
            }

            doc.Add(new XElement(DetectionInformation.XML.Root.NameForItems, listItems.ToArray()));

            return doc;
        }

        #endregion Methods
    }
}