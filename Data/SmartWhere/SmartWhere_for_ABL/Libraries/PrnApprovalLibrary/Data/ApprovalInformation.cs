namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.Xml.Linq;

    using Metadata;



    public class ApprovalInformation
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Declaration
            {
                public const string Version    = "1.0";
                public const string Encoding   = "UTF-8";
                public const string Standalone = "no";
            }

            public struct Root
            {
                public const string SmartWhere = "SmartWhere";
                public const string Approval   = "Approval";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string UserID = "UserID";
                    public const string JobID  = "JobID";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties

        public string             UserID      { get; set; }
        public string             JobID       { get; set; }
        public StatusInformation  StatusInfo  { get; private set; }
        public ContentInformation Content     { get; private set; }
        public ExtractInformation ExtractInfo { get; private set; }

        #endregion Properties



        #region Constructors

        public ApprovalInformation ()
        {
            this.InitializeProperties();
        }

        public ApprovalInformation (PrnMetadata metadata) : this()
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            this.UserID = metadata.PrnInfo.UserID;
            this.JobID  = metadata.PrnInfo.UUID;

            this.StatusInfo  = new StatusInformation  (metadata);
            this.Content     = new ContentInformation (metadata);
            this.ExtractInfo = new ExtractInformation (metadata);
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.UserID      = string.Empty;
            this.JobID       = string.Empty;

            this.StatusInfo  = new StatusInformation  ();
            this.Content     = new ContentInformation ();
            this.ExtractInfo = new ExtractInformation ();
        }

        #endregion Methods :: Initialize



        #region Methods

        public XDocument ToXML ()
        {
            XDocument xDoc = new XDocument(new XDeclaration(XML.Declaration.Version, XML.Declaration.Encoding, XML.Declaration.Standalone));

            /////////////////////////////////////////////////////////////////////

            XElement approval = new XElement(XML.Root.Approval,
                                                 new XElement(XML.Element.Name.UserID, this.UserID),
                                                 new XElement(XML.Element.Name.JobID,  this.JobID),

                                                 this.StatusInfo.ToXML(),
                                                 this.Content.ToXML()
                                             );

            if (this.ExtractInfo.DetectionList.Count > 0)
            {
                approval.Add(this.ExtractInfo.ToXML());
            }

            XElement root = new XElement(XML.Root.SmartWhere, approval);

            xDoc.Add(root);
            
            /////////////////////////////////////////////////////////////////////

            return xDoc;
        }

        public string ToXmlString ()
        {
            XDocument xDoc = this.ToXML();

            return string.Format("{0}\n{1}", xDoc.Declaration.ToString(), xDoc.ToString());
        }

        #endregion Methodss
    }
}