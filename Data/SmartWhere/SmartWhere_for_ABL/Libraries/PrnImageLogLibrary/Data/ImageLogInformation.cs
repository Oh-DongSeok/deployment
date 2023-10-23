namespace FXKIS.SmartWhere.ImageLog
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;

    using Common.Extension;



    public class ImageLogInformation
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
                public const string Name = "Envelope";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string Header     = "Header";
                    public const string Body       = "Body";
                    public const string PutRecord  = "putRecord";
                    public const string Record     = "record";
                    public const string Attributes = "attributes";
                    public const string Attribute  = "attribute";
                    public const string Value      = "value";
                    public const string Content    = "content";
                }

                public struct Attribute
                {
                    public const string Hyperlink = "href";
                }
            }

            public struct Attribute
            {
                public struct Name
                {
                    public const string AttributeName = "name";
                }

                public struct Value
                {
                    public const string ClientType        = "clientType";
                    public const string ProtocolVersion   = "protocolVersion";
                    public const string DeviceHostAddress = "deviceHostAddress";
                    public const string DeviceHostName    = "deviceHostName";
                    public const string SerialNumber      = "serialNumber";
                    public const string ReceivedTime      = "receivedTime";
                    public const string ContentsCount     = "contentsCount";
                }
            }

            public struct Namespace
            {
                public struct Name
                {
                    public const string SoapEnvironment = "SOAP-ENV";
                    public const string ImageLogWsdl    = "ns0";
                    public const string JobTemplate     = "jt";
                }

                public struct Value
                {
                    public const string SoapEnvironment = "http://schemas.xmlsoap.org/soap/envelope/";
                    public const string ImageLogWsdl    = "http://www.fujixerox.co.jp/2005/06/erma/imagelog/wsdl";
                    public const string JobTemplate     = "http://www.fujixerox.co.jp/2003/12/ssm/jobTemplate";
                }
            }
        }

        #endregion Constants :: XML



        #region Constants

        public const string DefaultClientType      = "Fujixerox Device";
        public const string DefaultDeviceHostName  = "Hp000003";
        public const string DefaultProtocolVersion = "1.0.0";
        public const string DefaultSerialNumber    = "100000";

        private const int VersionFieldCount = 3;

        #endregion Constants



        #region Properties

        public string   ClientType        { get; set; }
        public Version  ProtocolVersion   { get; set; }
        public string   DeviceHostAddress { get; set; }
        public string   DeviceHostName    { get; set; }
        public string   SerialNumber      { get; set; }
        public DateTime ReceivedTime      { get; set; }

        #endregion Properties



        #region Collections

        public List<string> ListContentID { get; private set; }

        #endregion Collections



        #region Constructors

        public ImageLogInformation ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.ClientType        = ImageLogInformation.DefaultClientType;
            this.ProtocolVersion   = new Version(ImageLogInformation.DefaultProtocolVersion);
            this.DeviceHostAddress = string.Empty;
            this.DeviceHostName    = ImageLogInformation.DefaultDeviceHostName;
            this.SerialNumber      = ImageLogInformation.DefaultSerialNumber;
            this.ReceivedTime      = DateTime.Now;
        }

        private void InitializeCollections ()
        {
            this.ListContentID = new List<string>();
        }

        public XDocument ToXML ()
        {
            XNamespace nsSoapEnv     = XML.Namespace.Value.SoapEnvironment;
            XNamespace nsJobTemplate = XML.Namespace.Value.JobTemplate;
            XNamespace nsImageLog    = XML.Namespace.Value.ImageLogWsdl;

            /////////////////////////////////////////////////////////////////////

            XElement xAttr = new XElement(XML.Element.Name.Record,
                                              new XElement(XML.Element.Name.Attributes,
                                              ImageLogInformation.CreateKeyValueAttribute(XML.Attribute.Value.ClientType,        this.ClientType),
                                              ImageLogInformation.CreateKeyValueAttribute(XML.Attribute.Value.ProtocolVersion,   this.ProtocolVersion.ToString(3)),
                                              ImageLogInformation.CreateKeyValueAttribute(XML.Attribute.Value.DeviceHostAddress, this.DeviceHostAddress),
                                              ImageLogInformation.CreateKeyValueAttribute(XML.Attribute.Value.DeviceHostName,    this.DeviceHostName),
                                              ImageLogInformation.CreateKeyValueAttribute(XML.Attribute.Value.SerialNumber,      this.SerialNumber)
                                              )
                                          );

            if (this.ListContentID.Count > 0)
            {
                foreach (string id in this.ListContentID)
                {
                    xAttr.Add(new XElement(XML.Element.Name.Content, new XAttribute(XML.Element.Attribute.Hyperlink, id)));
                }
            }

            /////////////////////////////////////////////////////////////////////

            XDocument xDoc = new XDocument(new XDeclaration(XML.Declaration.Version, XML.Declaration.Encoding, XML.Declaration.Standalone));

            XElement root = new XElement(new XElement(nsSoapEnv + XML.Root.Name,
                                             new XAttribute(XNamespace.Xmlns + XML.Namespace.Name.SoapEnvironment, nsSoapEnv),
                                             new XAttribute(XNamespace.Xmlns + XML.Namespace.Name.ImageLogWsdl,    nsImageLog),
                                             new XAttribute(XNamespace.Xmlns + XML.Namespace.Name.JobTemplate,     nsJobTemplate),
                                                 new XElement(nsSoapEnv + XML.Element.Name.Body,
                                                     new XElement(nsImageLog + XML.Element.Name.PutRecord,
                                                         new XAttribute(XNamespace.Xmlns + XML.Namespace.Name.ImageLogWsdl, nsImageLog),
                                                         xAttr
                                                     )
                                                 )
                                             )
                                         );

            xDoc.Add(root);

            /////////////////////////////////////////////////////////////////////

            return xDoc;
        }

        public static XElement CreateKeyValueAttribute (string key, string value)
        {
            if (string.IsNullOrWhiteSpace(key) == true)
            {
                throw new ArgumentNullException("string key");
            }

            if (value == null)
            {
                throw new ArgumentNullException("string value");
            }

            return new XElement(XML.Element.Name.Attribute,
                                new XAttribute (XML.Attribute.Name.AttributeName, key),
                                new XElement   (XML.Element.Name.Value,           value)
                                );
        }

        public string ToXmlString ()
        {
            XDocument xDoc = this.ToXML();

            return string.Format("{0}\r\n{1}\r\n", xDoc.Declaration.ToString(), xDoc.ToString());
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}