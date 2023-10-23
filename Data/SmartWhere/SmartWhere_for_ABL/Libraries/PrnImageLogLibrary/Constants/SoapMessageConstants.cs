namespace FXKIS.SmartWhere.ImageLog.Constants
{
    using System;
    using System.Collections.Generic;



    #region Constants

    public struct HTML
    {
        public struct MediaType
        {
            public const string XML         = "text/xml";
            public const string JSON        = "application/json";
            public const string PDF         = "appliation/pdf";
            public const string OctetStream = "appliation/octet-stream";
        }
        public struct ContentDisposition
        {
            public struct Name
            {
                public const string XML       = "xml";
                public const string Attribute = "attr";
            }
        }
    }

    public struct SOAP
    {
        public struct Attribute
        {
            public const string ClientType        = "clientType";
            public const string ProtocolVersion   = "protocolVersion";
            public const string DeviceHostAddress = "deviceHostAddress";
            public const string DeviceHostName    = "deviceHostName";
            public const string SerialNumber      = "serialNumber";
            public const string ReceivedTime      = "receivedTime";
            public const string ContentsCount     = "contentsCount";
        }

        public struct Format
        {
            #region Constants

            public const string Envelope    = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
                                              "    <SOAP-ENV:Header/>\n" +
                                              "    <SOAP-ENV:Body>\n" +
                                              "        <ns0:putRecord xmlns:ns0=\"http://www.fujixerox.co.jp/2005/06/erma/imagelog/wsdl\">\n" +
                                              "            <record>\n" +
                                              "                {0}\n\n" +
                                              "                {1}\n" +
                                              "            </record>\n" +
                                              "        </ns0:putRecord>\n" +
                                              "    </SOAP-ENV:Body>\n" +
                                              "</SOAP-ENV:Envelope>\n";
            public const string Attribute   = "<attribute name=\"{0}\">" +
                                              "    <value>{1}</value>" +
                                              "</attribute>";
            public const string Attributes  = "<attributes>" +
                                              "    {0}" +
                                              "</attributes>";
            public const string ContentID   = "<content href=\"{0}\"/>";
            public const string DateTimeGMT = "yyyy-MM-dd%THH:mm:sszzz";
            public const string Boundary    = "--==FX{0}==";
            public const string End         = "--{0}--\r\n\r\n";

            #endregion Constants



            #region Static Methods

            public static string ConvertAttibute (string name, string value)
            {
                if (string.IsNullOrWhiteSpace(name) == true)
                {
                    throw new ArgumentNullException("string name");
                }

                if (string.IsNullOrEmpty(value) == true)
                {
                    value = "";
                }

                return string.Format(Format.Attribute, name, value);
            }

            public static string ConvertAttributes (string strAttribute)
            {
                if (string.IsNullOrEmpty(strAttribute) == true)
                {
                    strAttribute = "";
                }

                return string.Format(Format.Attributes, strAttribute);
            }

            public static string ConvertAttributes (Dictionary<string, string> dictionaryAttributes)
            {
                if (dictionaryAttributes == null)
                {
                    throw new ArgumentNullException("Dictionary<string, string> dictionaryAttributes");
                }

                string strAttributes = string.Empty;

                foreach (var pair in dictionaryAttributes)
                {
                    try
                    {
                        strAttributes += Format.ConvertAttibute(pair.Key, pair.Value) + "\n";
                    }
                    catch { }
                }

                return Format.ConvertAttributes(strAttributes);
            }

            #endregion Static Methods
        }

        public struct Result
        {
            public const string Success = "SUCCESS";
            public const string Fail    = "FAIL";
        }
    }

    public struct ContentHeader
    {
        public struct SoapMessage
        {
            public const string Type = "text/xml; charset=\"UTF-8\"";
        }

        public struct JobLog
        {
            public const string Type             = "text/xml";
            public const string TransferEncoding = "8bit";
        }

        public struct PDF
        {
            public const string TransferEncoding = "binary";
        }
    }

    #endregion Constants
}