namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class CommonInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Element
            {
                public struct Name
                {
                    public const string JobID        = "JobID";
                    public const string Status       = "Status";
                    public const string StartTime    = "StartTime";
                    public const string CompleteTime = "CompleteTime";
                    public const string UserID       = "User";
                    public const string DocumentName = "Name";
                }

                public struct Format
                {
                    public const string DateTimeGMT = "yyyy-MM-dd%THH:mm:sszzz";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties

        public string           JobID        { get; set; }
        public Types.StatusType Status       { get; set; }
        public DateTime         StartTime    { get; set; }
        public DateTime?        CompleteTime { get; set; }
        public string           UserID       { get; set; }
        public string           DocumentName { get; set; }

        #endregion Properties



        #region Constructors

        public CommonInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.JobID        = Guid.NewGuid().ToString();
            this.Status       = Types.StatusType.Unknown;
            this.StartTime    = DateTime.Now;
            this.CompleteTime = null;
            this.UserID       = string.Empty;
            this.DocumentName = string.Empty;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            string strCompleteTime = string.Empty;

            if (this.CompleteTime != null)
            {
                strCompleteTime = this.CompleteTime.Value.ToString(CommonInformation.XML.Element.Format.DateTimeGMT);
            }

            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.JobID,        this.JobID));
            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.Status,       this.Status.ToXmlString()));
            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.StartTime,    this.StartTime.ToString(CommonInformation.XML.Element.Format.DateTimeGMT)));
            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.CompleteTime, strCompleteTime));
            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.UserID,       this.UserID));
            listXml.Add(new XElement(ns + CommonInformation.XML.Element.Name.DocumentName, this.DocumentName));

            /////////////////////////////////////////////////////////////////////

            if (listXml.Count < 1)
            {
                return null;
            }

            return listXml.ToArray();
        }

        #endregion Methods
    }
}