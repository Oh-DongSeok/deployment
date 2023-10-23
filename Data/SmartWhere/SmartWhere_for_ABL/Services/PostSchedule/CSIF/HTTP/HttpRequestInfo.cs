namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System;
    using System.IO;

    using FXKIS.Common.Extension;



    public class HttpRequestInfo
    {
        #region Enumerations

        public enum MethodType
        {
            Unknown = -1,
            Get,
            Post
        }

        #endregion Enumerations



        #region Constants

        public const string MethodGet  = "GET";
        public const string MethodPost = "POST";

        public const string HeaderNameForHost          = "HOST";
        public const string HeaderNameForConnection    = "CONNECTION";
        public const string HeaderNameForOrigin        = "ORIGIN";
        public const string HeaderNameForJobTicket     = "FX-ACCESS-TICKET";
        public const string HeaderNameForContentLength = "CONTENT-LENGTH";

        public const string HeaderNameForUserAgent      = "USER-AGENT";
        public const string HeaderNameForContentType    = "CONTENT-TYPE";
        public const string HeaderNameForAccept         = "ACCEPT";
        public const string HeaderNameForAcceptEncoding = "ACCEPT-ENCODING";
        public const string HeaderNameForAcceptLanguage = "ACCEPT-LANGUAGE";

        #endregion Constants



        #region Properties

        public MethodType Method         { get; set; }
        public string     Url            { get; set; }
        public string     Version        { get; set; }
        public string     Host           { get; set; }
        public string     Connection     { get; set; }
        public string     Origin         { get; set; }
        public string     Accept         { get; set; }
        public string     AcceptEncoding { get; set; }
        public string     AcceptLanguage { get; set; }
        public string     UserAgent      { get; set; }
        public string     JobTicket      { get; set; }
        public long       ContentLength  { get; set; }
        public string     ContentType    { get; set; }
        public string     Content        { get; set; }

        #endregion Properties



        #region Constructors

        public HttpRequestInfo ()
        {
            this.Method         = MethodType.Unknown;
            this.Url            = string.Empty;
            this.Version        = string.Empty;
            this.Host           = string.Empty;
            this.Connection     = string.Empty;
            this.Origin         = string.Empty;
            this.Accept         = string.Empty;
            this.AcceptEncoding = string.Empty;
            this.AcceptLanguage = string.Empty;
            this.UserAgent      = string.Empty;
            this.JobTicket      = string.Empty;
            this.ContentLength  = 0;
            this.ContentType    = string.Empty;
            this.Content        = string.Empty;
        }

        public HttpRequestInfo (MethodType method, string url, string version) : this()
        {
            if (string.IsNullOrEmpty(url) == true)
            {
                throw new ArgumentNullException("string url");
            }

            if (string.IsNullOrEmpty(version) == true)
            {
                throw new ArgumentNullException("string version");
            }

            this.Method  = method;
            this.Url     = url;
            this.Version = version;
        }

        public HttpRequestInfo (HttpRequestInfo info) : this()
        {
            if (info == null)
            {
                throw new ArgumentNullException("HttpRequestInfo info");
            }

            this.Method         = info.Method;
            this.Url            = info.Url;
            this.Version        = info.Version;
            this.Host           = info.Host;
            this.Connection     = info.Connection;
            this.Origin         = info.Origin;
            this.Accept         = info.Accept;
            this.AcceptEncoding = info.AcceptEncoding;
            this.AcceptLanguage = info.AcceptLanguage;
            this.UserAgent      = info.UserAgent;
            this.JobTicket      = info.JobTicket;
            this.ContentLength  = info.ContentLength;
            this.ContentType    = info.ContentType;
            this.Content        = info.Content;
        }

        #endregion Constructors



        #region Methods

        public static HttpRequestInfo ParseFromHeader (string header)
        {
            if (string.IsNullOrWhiteSpace(header) == true)
            {
                throw new ArgumentNullException("string request");
            }

            string[] lines = header.Split('\n');

            if (lines.Length < 2)
            {
                throw new Exception("-----------------------------------");
            }

            // First Line
            string[] tokens = lines[0].Split(' ');

            if (tokens.Length < 3)
            {
                throw new Exception("Invalid http request line");
            }

            HttpRequestInfo info = new HttpRequestInfo();

            info.Method  = ParsingEx.ParseToEnum<MethodType>(tokens[0]);
            info.Url     = tokens[1];
            info.Version = tokens[2];

            // Other Line
            for (int idx = 1; idx < lines.Length; idx++)
            {
                try
                {
                    string line  = lines[idx];
                    string name  = string.Empty;
                    string value = string.Empty;

                    int separator = line.IndexOf(':');

                    if (separator < 0)
                    {
                        throw new InvalidDataException(string.Format("Invalid http header line: {0}", line));
                    }

                    if (line.Length <= separator)
                    {
                        // value is empty
                        continue;
                    }

                    name      = line.Substring(0, separator).Trim();
                    separator += 1;
                    value     = line.Substring(separator, line.Length - separator).Trim();

                    switch (name.ToUpper())
                    {
                        case HttpRequestInfo.HeaderNameForHost:
                            info.Host = value;
                            break;

                        case HttpRequestInfo.HeaderNameForConnection:
                            info.Connection = value;
                            break;

                        case HttpRequestInfo.HeaderNameForOrigin:
                            info.Origin = value;
                            break;

                        case HttpRequestInfo.HeaderNameForAccept:
                            info.Accept = value;
                            break;

                        case HttpRequestInfo.HeaderNameForAcceptEncoding:
                            info.AcceptEncoding = value;
                            break;

                        case HttpRequestInfo.HeaderNameForAcceptLanguage:
                            info.AcceptLanguage = value;
                            break;

                        case HttpRequestInfo.HeaderNameForUserAgent:
                            info.UserAgent = value;
                            break;

                        case HttpRequestInfo.HeaderNameForJobTicket:
                            info.JobTicket = value;
                            break;

                        case HttpRequestInfo.HeaderNameForContentLength:
                            info.ContentLength = int.Parse(value);
                            break;

                        case HttpRequestInfo.HeaderNameForContentType:
                            info.ContentType = value;
                            break;

                        default:
                            continue;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return info;
        }

        private const int ReadBufferSize = 4096;

        public static HttpRequestInfo Parse (Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream");
            }

            string strHeader  = string.Empty;
            string strContent = string.Empty;
            string strLine    = string.Empty;

            while (string.IsNullOrWhiteSpace(strLine = stream.ReadLine()) == false)
            {
                strHeader += string.Format("{0}\n", strLine);
            }

            HttpRequestInfo info = HttpRequestInfo.ParseFromHeader(strHeader);

            ////////////////////////////////////////////////////////////////

            byte[] buf = new byte[HttpRequestInfo.ReadBufferSize + 1];

            int to_read = (int)info.ContentLength;
            int numread = 0;

            // Content-Length의 값 만큼 읽는다.
            using (MemoryStream ms = new MemoryStream())
            {
                while (to_read > 0)
                {
                    numread = stream.Read(buf, 0, Math.Min(HttpRequestInfo.ReadBufferSize, to_read));

                    if (numread < 1)
                    {
                        if (to_read < 1)
                        {
                            break;
                        }

                        throw new Exception("Client disconnected during post");
                    }

                    to_read -= numread;

                    ms.Write(buf, 0, numread);
                }

                ms.Seek(0, SeekOrigin.Begin);

                using (StreamReader sr = new StreamReader(ms))
                {
                    info.Content = sr.ReadToEnd();

                    return info;
                }
            }
        }

        public static bool TryParseFromHeader (string header, out HttpRequestInfo info)
        {
            info = null;

            try
            {
                info = HttpRequestInfo.ParseFromHeader(header);

                return (info != null);
            }
            catch
            {
                return false;
            }
        }

        public static bool TryParse (Stream stream, out HttpRequestInfo info)
        {
            info = null;

            try
            {
                info = HttpRequestInfo.Parse(stream);

                return (info != null);
            }
            catch
            {
                return false;
            }
        }

        public override string ToString ()
        {
            return string.Format("{0} {1} {2}", this.Method, this.Url, this.Version);
        }

        #endregion Methods
    }
}
