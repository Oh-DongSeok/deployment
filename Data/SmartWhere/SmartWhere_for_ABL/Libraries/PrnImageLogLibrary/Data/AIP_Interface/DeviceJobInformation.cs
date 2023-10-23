namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class DeviceJobInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "DeviceJobInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string JobID         = "JobID";
                    public const string JobType       = "JobType";
                    public const string JobDetailType = "JobDetailType";
                    public const string CompleteTime  = "CompleteTime";
                    public const string Status        = "Status";
                    public const string StateReason   = "StateReason";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties

        public string                    JobID         { get; set; }
        public Types.DeviceJobType       JobType       { get { return this.JobDetailType.ToDeviceJobType(); } }
        public Types.DeviceJobDetailType JobDetailType { get; set; }
        public string                    Status        { get; set; }
        public Types.JobStateType        StateReason   { get; set; }

        #endregion Properties



        #region Constructors

        public DeviceJobInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.JobID         = string.Empty;
            this.JobDetailType = Types.DeviceJobDetailType.Unknown;
            this.Status        = string.Empty;
            this.StateReason   = Types.JobStateType.Unknown;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + DeviceJobInformation.XML.Root.Name,
                new XElement(ns + DeviceJobInformation.XML.Element.Name.JobID,         this.JobID),
                new XElement(ns + DeviceJobInformation.XML.Element.Name.JobType,       this.JobType.ToXmlString()),
                new XElement(ns + DeviceJobInformation.XML.Element.Name.JobDetailType, this.JobDetailType.ToXmlString()),
                new XElement(ns + DeviceJobInformation.XML.Element.Name.Status,        this.Status),
                new XElement(ns + DeviceJobInformation.XML.Element.Name.StateReason,   this.StateReason.ToXmlString())
                );

            listXml.Add(xmlRoot);

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