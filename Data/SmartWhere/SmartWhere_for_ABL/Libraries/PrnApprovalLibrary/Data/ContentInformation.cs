namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.Xml.Linq;

    using Metadata;



    public class ContentInformation
    {
        #region Constants

        public struct XML
        {
            public struct Root
            {
                public const string Name = "Content";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string DocumentName = "Name";
                    public const string Extension    = "Extension";
                    public const string TemplateCD   = "TemplateCD";
                    public const string Bin          = "Bin";
                    public const string Txt          = "Txt";
                    public const string Path         = "Path";
                }

                public struct Value
                {
                    public const string ExtensionPDF = "pdf";
                }
            }
        }

        #endregion Constants



        #region Properties

        public string Name       { get; set; }
        public string Extension  { get; set; }
        public string TemplateCD { get; set; }
        public string Bin        { get; set; }
        public string Txt        { get; set; }
        public string Path       { get; set; }

        #endregion Properties



        #region Constructors

        public ContentInformation ()
        {
            this.InitializeProperties();
        }

        public ContentInformation (PrnMetadata metadata) : this()
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            this.Name       = metadata.PrnInfo.DocumentName;
            this.Extension  = ContentInformation.XML.Element.Value.ExtensionPDF;
            this.TemplateCD = metadata.Policy.SecurityTemplateCD;
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Name       = string.Empty;
            this.Extension  = string.Empty;
            this.TemplateCD = string.Empty;
            this.Bin        = string.Empty;
            this.Txt        = string.Empty;
            this.Path       = string.Empty;
        }

        #endregion Methods :: Initialize



        #region Methods

        public XElement ToXML ()
        {
            XElement doc = new XElement(ContentInformation.XML.Root.Name,
                new XElement(ContentInformation.XML.Element.Name.DocumentName, this.Name),
                new XElement(ContentInformation.XML.Element.Name.Extension,    this.Extension),
                new XElement(ContentInformation.XML.Element.Name.TemplateCD,   this.TemplateCD),
                new XElement(ContentInformation.XML.Element.Name.Bin,          this.Bin),
                new XElement(ContentInformation.XML.Element.Name.Txt,          this.Txt),
                new XElement(ContentInformation.XML.Element.Name.Path,         this.Path)
                );

            return doc;
        }

        #endregion Methods
    }
}