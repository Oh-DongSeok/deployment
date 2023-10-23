namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class NetInJobInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "NetInJobInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string Protocol       = "Protocol";
                    public const string DocumentFormat = "DocumentFormat";
                    public const string DocumentName   = "DocumentName";
                    public const string HostName       = "HostName";
                    public const string HostAddress    = "HostAddress";
                    public const string JobClientID    = "JobClientID";
                    public const string NetworkNumber  = "NetworkNumber";
                }

                public struct Value
                {
                    public const string NetworkNumberEthernet1 = "Ethernet1";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties

        public string                   Protocol       { get; set; }
        public Types.DocumentFormatType DocumentFormat { get; set; }
        public string                   DocumentName   { get; set; }
        public string                   HostName       { get; set; }
        public string                   HostAddress    { get; set; }
        public string                   JobClientID    { get; set; }
        public string                   NetworkNumber  { get; set; }

        #endregion Properties



        #region Constructors

        public NetInJobInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Protocol       = string.Empty;
            this.DocumentFormat = Types.DocumentFormatType.Unknown;
            this.DocumentName   = string.Empty;
            this.HostName       = string.Empty;
            this.HostAddress    = string.Empty;
            this.JobClientID    = string.Empty;
            this.NetworkNumber  = XML.Element.Value.NetworkNumberEthernet1;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + NetInJobInformation.XML.Root.Name,
                new XElement(ns + NetInJobInformation.XML.Element.Name.Protocol,       this.Protocol),
                new XElement(ns + NetInJobInformation.XML.Element.Name.DocumentFormat, this.DocumentFormat.ToXmlString()),
                new XElement(ns + NetInJobInformation.XML.Element.Name.DocumentName,   this.DocumentName),
                new XElement(ns + NetInJobInformation.XML.Element.Name.HostName,       this.HostName),
                new XElement(ns + NetInJobInformation.XML.Element.Name.HostAddress,    this.HostAddress),
                new XElement(ns + NetInJobInformation.XML.Element.Name.JobClientID,    this.JobClientID),
                new XElement(ns + NetInJobInformation.XML.Element.Name.NetworkNumber,  this.NetworkNumber)
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