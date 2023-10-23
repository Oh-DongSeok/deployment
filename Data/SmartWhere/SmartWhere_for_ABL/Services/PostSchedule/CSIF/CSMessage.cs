namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System;

    using FXKIS.Common.Extension;



    public class CSMessage
    {
        #region Enumerations

        public enum RequestType
        {
            Unknown = -1,
            GetUsagePrnCnt,
            GetPrnListPolicy,
            RegisterCard,
            DeleteSelected,
            PrintSelected,
            PrintAll
        }

        #endregion Enumerations



        #region Properties

        public CSRequestBase  Request  { get; set; }
        public CSResponseBase Response { get; set; }
        public RequestType    Type     { get; set; }

        #endregion Properties



        #region Constructors

        public CSMessage ()
        {
            this.Request  = null;
            this.Response = null;
            this.Type     = RequestType.Unknown;
        }

        #endregion Constructors



        #region Methods

        public static CSMessage ParseRequest (string url, string content)
        {
            if (string.IsNullOrWhiteSpace(url) == true)
            {
                throw new ArgumentNullException("string url");
            }

            if (string.IsNullOrWhiteSpace(content) == true)
            {
                throw new ArgumentNullException("string content");
            }

            if (url[0] == '/')
            {
                url = url.Remove(0, 1);
            }

            RequestType type = RequestType.Unknown;

            if (ParsingEx.TryParseToEnum(url, out type) == false)
            {
                throw new NotSupportedException(string.Format("Method parsing failed (URL: {0}", url));
            }

            CSMessage message = new CSMessage()
            {
                Type = type
            };

            switch (type)
            {
                case RequestType.GetUsagePrnCnt:
                    message.Request = SerializationEx.JsonToObject<CSRequestCommon>(content);
                    break;

                case RequestType.GetPrnListPolicy:
                    message.Request = SerializationEx.JsonToObject<CSRequestCommon>(content);
                    break;

                case RequestType.RegisterCard:
                    message.Request = SerializationEx.JsonToObject<CSRequestRegisterCard>(content);
                    break;

                case RequestType.DeleteSelected:
                    message.Request = SerializationEx.JsonToObject<CSRequestDeleteSelected>(content);
                    break;

                case RequestType.PrintSelected:
                    message.Request = SerializationEx.JsonToObject<CSRequestPrintSelected>(content);
                    break;

                case RequestType.PrintAll:
                    message.Request = SerializationEx.JsonToObject<CSRequestPrintAll>(content);
                    break;

                default:
                    throw new NotSupportedException(string.Format("METHOD {0} is not supported in this service.", message.Type.ToString()));
            }

            return message;
        }

        public static bool TryParseRequest (string url, string content, out CSMessage message)
        {
            message = null;

            try
            {
                message = CSMessage.ParseRequest(url, content);

                if (message == null)
                {
                    return false;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        #endregion Methods
    }
}
