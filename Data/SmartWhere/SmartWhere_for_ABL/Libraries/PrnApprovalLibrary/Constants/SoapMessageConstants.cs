namespace FXKIS.SmartWhere.Approval.Constants
{
    #region Constants

    public struct HTML
    {
        public struct Header
        {
            public const string ContentType = "Content-Type";
        }

        public struct MediaType
        {
            public const string XML         = "text/xml";
            public const string JSON        = "application/json";
            public const string OctetStream = "appliation/octet-stream";
        }
        public struct ContentDisposition
        {
            public struct Name
            {
                public const string XML       = "\"xml\"";
                public const string Attribute = "\"attr\"";
            }
        }
    }

    public struct SOAP
    {
        public struct Format
        {
            public const string Attribute = "<attribute name=\"{0}\">" +
                                            "    <value>{1}</value>" +
                                            "</attribute>";
        }

        public struct Result
        {
            public const string Success = "SUCCESS";
            public const string Fail    = "FAIL";
        }
    }

    #endregion Constants
}