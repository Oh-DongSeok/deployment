namespace FXKIS.SmartWhere.ImageLog.HTTP
{
    using System;
    using System.Collections.Generic;



    public class ContentHeader
    {
        #region Enumerations

        public enum HeaderType
        {
            Unknown,

            Type,
            ID,
            TransferEncoding
        }

        #endregion Enumerations



        #region Constants

        public struct Constants
        {
            public struct HeaderType
            {
                public const string Type             = "Content-Type";
                public const string ID               = "Content-Id";
                public const string TransferEncoding = "Content-Transfer-Encoding";
            }

            public struct Format
            {
                public const string HeaderString = "{0}: {1}";
            }
        }

        #endregion Constants



        #region Collections

        public Dictionary<HeaderType, string> DictionaryHeader { get; private set; }

        #endregion Collections



        #region Constructors

        public ContentHeader ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.DictionaryHeader = new Dictionary<HeaderType, string>();
        }

        public override string ToString ()
        {
            if (this.DictionaryHeader == null || this.DictionaryHeader.Count < 1)
            {
                return string.Empty;
            }

            string result = string.Empty;

            foreach (var pair in this.DictionaryHeader)
            {
                try
                {
                    string key   = pair.Key.ToHeaderString();
                    string value = pair.Value;

                    if (string.IsNullOrWhiteSpace(key) == true)
                    {
                        continue;
                    }

                    if (value == null)
                    {
                        value = string.Empty;
                    }

                    result += string.Format(Constants.Format.HeaderString, key, value) + Environment.NewLine;
                }
                catch
                {
                    continue;
                }
            }

            return result;
        }

        public string ToString (string boundary)
        {
            if (string.IsNullOrWhiteSpace(boundary) == true)
            {
                throw new ArgumentNullException("string boundary");
            }

            return string.Format("--{0}\r\n{1}\r\n", boundary, this.ToString());
        }

        #endregion Methods



        #region Static Methods

        public static ContentHeader CreateAttributes ()
        {
            ContentHeader header = new ContentHeader();

            header.DictionaryHeader.Add(ContentHeader.HeaderType.Type, ImageLog.Constants.ContentHeader.SoapMessage.Type);

            return header;
        }

        public static ContentHeader CreatePDF (string contentID)
        {
            if (string.IsNullOrWhiteSpace(contentID) == true)
            {
                throw new ArgumentNullException("string contentID");
            }

            ContentHeader header = new ContentHeader();

            header.DictionaryHeader.Add(ContentHeader.HeaderType.ID,               contentID);
            header.DictionaryHeader.Add(ContentHeader.HeaderType.TransferEncoding, ImageLog.Constants.ContentHeader.PDF.TransferEncoding);
            header.DictionaryHeader.Add(ContentHeader.HeaderType.Type,             ImageLog.Constants.HTML.MediaType.PDF);

            return header;
        }

        public static ContentHeader CreateJobLog (string contentID)
        {
            if (string.IsNullOrWhiteSpace(contentID) == true)
            {
                throw new ArgumentNullException("string contentID");
            }

            ContentHeader header = new ContentHeader();

            header.DictionaryHeader.Add(ContentHeader.HeaderType.ID,               contentID);
            header.DictionaryHeader.Add(ContentHeader.HeaderType.TransferEncoding, ImageLog.Constants.ContentHeader.JobLog.TransferEncoding);
            header.DictionaryHeader.Add(ContentHeader.HeaderType.Type,             ImageLog.Constants.ContentHeader.JobLog.Type);

            return header;
        }

        #endregion Static Methods
    }



    /// <summary>
    /// static class :: ContentHeaderUtility (for Extension Methods)
    /// </summary>
    public static class ContentHeaderUtility
    {
        public static string ToHeaderString (this ContentHeader.HeaderType type)
        {
            switch (type)
            {
                case ContentHeader.HeaderType.Type:
                    return ContentHeader.Constants.HeaderType.Type;

                case ContentHeader.HeaderType.ID:
                    return ContentHeader.Constants.HeaderType.ID;

                case ContentHeader.HeaderType.TransferEncoding:
                    return ContentHeader.Constants.HeaderType.TransferEncoding;

                default:
                    return string.Empty;
            }
        }
    }
}