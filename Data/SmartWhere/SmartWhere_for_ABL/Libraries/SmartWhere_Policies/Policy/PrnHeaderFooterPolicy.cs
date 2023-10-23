namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    using Common.Extension;



    public class PrnHeaderFooterPolicy : PrnPolicyItemBase
    {
        #region Enumerations

        public enum HeaderFooterType
        {
            Unknown,
            Header,
            Footer
        }

        public enum LocationType
        {
            Unknown,
            Left,
            Center,
            Right
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public const string DBValueTypeHeader     = @"H";
        public const string DBValueTypeFooter     = @"F";

        public const string DBValueLocationLeft   = @"L";
        public const string DBValueLocationCenter = @"C";
        public const string DBValueLocationRight  = @"R";

        #endregion Constants :: Database Values



        #region Constants :: Default Values

        public const LocationType DefaultLocation = LocationType.Unknown;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumOrder = 1;
        public const int MaximumOrder = 5;

        #endregion Constants :: Ranges



        #region Constants

        private const string Separator = @"/";

        #endregion Constants



        #region Properties
        
        public  HeaderFooterType            Type      { get; set; }
        public  LocationType                Location  { get; set; }
        public  string                      Title     { get; set; }
        private string                      ImagePath { get; set; }
        public  HeaderFooterFontInformation Font      { get; private set; }

        #endregion Properties



        #region Properties :: Collections

        // KEY:   Order
        // VALUE: HeaderItem
        public SortedDictionary<int, TextItem> HeaderFooterItemDictionary { get; private set; }

        #endregion Properties :: Collections



        #region Constructors

        public PrnHeaderFooterPolicy () : base()
        {
        }

        #endregion Constructors



        #region Methods :: Initialize

        protected override void InitializeProperties ()
        {
            this.IsEnabled = false;
            this.Type      = HeaderFooterType.Unknown;
            this.Location  = LocationType.Unknown;
            this.Title     = string.Empty;
            this.ImagePath = string.Empty;
            this.Font      = new HeaderFooterFontInformation();
        }

        protected override void InitializeCollections ()
        {
            this.HeaderFooterItemDictionary = new SortedDictionary<int, TextItem>();
        }

        #endregion Methods :: Initialize



        #region Methods

        public void SetImagePath (string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            if (File.Exists(path) == false)
            {
                throw new FileNotFoundException("Image file is not exists", path);
            }

            this.ImagePath = path;
        }

        public string GetImagePath ()
        {
            return this.ImagePath;
        }

        public override string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime)
        {
            if (string.IsNullOrWhiteSpace(ipAddress) == true)
            {
                throw new ArgumentNullException("string ipAddress");
            }

            if (string.IsNullOrWhiteSpace(userID) == true)
            {
                throw new ArgumentNullException("string userID");
            }

            if (string.IsNullOrWhiteSpace(documentName) == true)
            {
                throw new ArgumentNullException("documentName");
            }

            List<string> listTextItemString = new List<string>();

            try
            {
                foreach (var pairTextItem in this.HeaderFooterItemDictionary)
                {
                    try
                    {
                        TextItem item = pairTextItem.Value;

                        switch (item.Type)
                        {
                            case TextItem.TextType.PCTime:
                                {
                                    string strPCTime = item.GetLocalTimeString(rcdTime);

                                    if (string.IsNullOrWhiteSpace(strPCTime) == true)
                                    {
                                        continue;
                                    }

                                    listTextItemString.Add(strPCTime);
                                }
                                break;

                            case TextItem.TextType.DocumentName:
                                listTextItemString.Add(documentName);
                                break;

                            case TextItem.TextType.UserID:
                                listTextItemString.Add(userID);
                                break;

                            case TextItem.TextType.IPAddress:
                                {
                                    ipAddress = item.GetMaskedIPAddress(ipAddress);

                                    if (string.IsNullOrWhiteSpace(ipAddress) == true)
                                    {
                                        continue;
                                    }

                                    listTextItemString.Add(ipAddress);
                                }
                                break;

                            case TextItem.TextType.CustomString:
                                listTextItemString.Add(item.CustomString);
                                break;

                            default:
                                break;
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                if (listTextItemString.Count < 1)
                {
                    return string.Empty;
                }

                return string.Join(PrnHeaderFooterPolicy.Separator, listTextItemString);
            }
            catch
            {
                return string.Empty;
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static HeaderFooterType ToType (string strType)
        {
            if (string.IsNullOrWhiteSpace(strType) == true)
            {
                throw new ArgumentNullException("string strType");
            }

            try
            {
                switch (strType.ToUpper())
                {

                    case PrnHeaderFooterPolicy.DBValueTypeHeader:
                        return HeaderFooterType.Header;

                    case PrnHeaderFooterPolicy.DBValueTypeFooter:
                        return HeaderFooterType.Footer;

                    default:
                        return HeaderFooterType.Unknown;
                }
            }
            catch
            {
                return HeaderFooterType.Unknown;
            }
        }

        public static LocationType ToLocation (string strLocation)
        {
            if (string.IsNullOrWhiteSpace(strLocation) == true)
            {
                throw new ArgumentNullException("string strLocation");
            }

            try
            {
                switch (strLocation.ToUpper())
                {
                    case PrnHeaderFooterPolicy.DBValueLocationLeft:
                        return LocationType.Left;

                    case PrnHeaderFooterPolicy.DBValueLocationCenter:
                        return LocationType.Center;

                    case PrnHeaderFooterPolicy.DBValueLocationRight:
                        return LocationType.Right;

                    default:
                        return LocationType.Unknown;
                }
            }
            catch
            {
                return LocationType.Unknown;
            }
        }

        #endregion Static Methods
    }
}