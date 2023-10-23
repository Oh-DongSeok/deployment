namespace FXKIS.SmartWhere.Policy
{
    using System;

    using Common.Extension;



    // be used in HeaderFoooter & Watermark
    public class TextItem
    {
        #region Enumerations

        public enum TextType
        {
            Unknown,
            PCTime,
            DocumentName,
            UserID,
            IPAddress,
            CustomString
        }

        public enum IPMaskingType
        {
            Unknown,
            ClassA,
            ClassB,
            ClassC,
            ClassD
        }

        public enum PCTimeFormatType
        {
            Unknown,

            /// <summary>
            /// yyyy년MM월dd일 HH시mm분ss초 (default)
            /// </summary>
            KT,

            /// <summary>
            /// yyyy/MM/dd HH:mm:ss
            /// </summary>
            ST,

            /// <summary>
            /// yyyy-MM-dd HH:mm:ss
            /// </summary>
            DT,

            /// <summary>
            /// yyyyMMddHHmmss
            /// </summary>
            NT,

            /// <summary>
            /// yyyy년MM월dd일
            /// </summary>
            K,

            /// <summary>
            /// yyyy/MM/dd
            /// </summary>
            S,

            /// <summary>
            /// yyyy-MM-dd
            /// </summary>
            D,

            /// <summary>
            /// yyyyMMdd
            /// </summary>
            N
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public const string DBValueTextTypeIPAddress          = @"IP";
        public const string DBValueTextTypePCTime             = @"TM";
        public const string DBValueTextTypeDocumentName       = @"TT";
        public const string DBValueTextTypeUserID             = @"ID";
        public const string DBValueTextTypeCustomString       = @"CS";

        public const string DBValuePCTimeFormatKT             = @"KT";
        public const string DBValuePCTimeFormatST             = @"ST";
        public const string DBValuePCTimeFormatDT             = @"DT";
        public const string DBValuePCTimeFormatNT             = @"NT";
        public const string DBValuePCTimeFormatK              = @"K";
        public const string DBValuePCTimeFormatS              = @"S";
        public const string DBValuePCTimeFormatD              = @"D";
        public const string DBValuePCTimeFormatN              = @"N";

        public const string DBValueIPAddressMaskingTypeClassD = @"N";
        public const string DBValueIPAddressMaskingTypeClassC = @"1";
        public const string DBValueIPAddressMaskingTypeClassB = @"2";
        public const string DBValueIPAddressMaskingTypeClassA = @"3";

        #endregion Constants :: Database Values



        #region Constants :: Formats

        public const string DatetimeFormatKT = "yyyy년MM월dd일 HH시mm분ss초";
        public const string DatetimeFormatST = "yyyy/MM/dd HH:mm:ss";
        public const string DatetimeFormatDT = "yyyy-MM-dd HH:mm:ss";
        public const string DatetimeFormatNT = "yyyyMMddHHmmss";
        public const string DatetimeFormatK  = "yyyy년MM월dd일";
        public const string DatetimeFormatS  = "yyyy/MM/dd";
        public const string DatetimeFormatD  = "yyyy-MM-dd";
        public const string DatetimeFormatN  = "yyyyMMdd";

        #endregion Constants :: Formats



        #region Constants

        private const string IPMaskingString = @"XXX";

        #endregion Constants



        #region Properties


        public TextType         Type          { get; set; }
        public PCTimeFormatType PCTimeFormat  { get; set; }
        public IPMaskingType    IPMaskingMode { get; set; }
        public string           CustomString  { get; set; }

        #endregion Properties



        #region Constructors

        public TextItem ()
        {
            this.InitializeProperties();
        }

        public TextItem (TextType type = TextType.Unknown) : this()
        {
            this.Type  = type;
        }

        public TextItem (PCTimeFormatType pctimeFormat) : this(TextType.PCTime)
        {
            this.PCTimeFormat = pctimeFormat;
        }

        public TextItem (IPMaskingType ipMasking) : this(TextType.IPAddress)
        {
            this.IPMaskingMode = ipMasking;
        }

        public TextItem (string customString) : this(TextType.CustomString)
        {
            if (string.IsNullOrWhiteSpace(customString) == true)
            {
                throw new ArgumentNullException("string customString");
            }

            this.CustomString = customString;
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Type          = TextType.Unknown;
            this.PCTimeFormat  = PCTimeFormatType.Unknown;
            this.IPMaskingMode = IPMaskingType.Unknown;
            this.CustomString  = string.Empty;
        }

        public string GetLocalTimeString (DateTime datetime)
        {
            return TextItem.GetLocalTimeString(datetime, this.PCTimeFormat);
        }

        public string GetLocalTimeStringKT (DateTime datetime)
        {
            return TextItem.GetLocalTimeString(datetime, PCTimeFormatType.KT);
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static PCTimeFormatType ToPCTimeFormat (string strType)
        {
            if (string.IsNullOrWhiteSpace(strType) == true)
            {
                throw new ArgumentNullException("string strType");
            }

            strType = strType.Trim();

            try
            {
                switch (strType.ToUpper())
                {
                    case TextItem.DBValuePCTimeFormatKT:
                        return PCTimeFormatType.KT;

                    case TextItem.DBValuePCTimeFormatST:
                        return PCTimeFormatType.ST;

                    case TextItem.DBValuePCTimeFormatDT:
                        return PCTimeFormatType.DT;

                    case TextItem.DBValuePCTimeFormatNT:
                        return PCTimeFormatType.NT;

                    case TextItem.DBValuePCTimeFormatK:
                        return PCTimeFormatType.K;

                    case TextItem.DBValuePCTimeFormatS:
                        return PCTimeFormatType.S;

                    case TextItem.DBValuePCTimeFormatD:
                        return PCTimeFormatType.D;

                    case TextItem.DBValuePCTimeFormatN:
                        return PCTimeFormatType.N;

                    default:
                        return PCTimeFormatType.Unknown;
                }
            }
            catch
            {
                return PCTimeFormatType.Unknown;
            }
        }

        public static IPMaskingType ToIPMaskingType (string strType)
        {
            if (string.IsNullOrWhiteSpace(strType) == true)
            {
                throw new ArgumentNullException("string strType");
            }

            strType = strType.Trim();

            try
            {
                switch (strType.ToUpper())
                {

                    case TextItem.DBValueIPAddressMaskingTypeClassD:
                        return IPMaskingType.ClassD;

                    case TextItem.DBValueIPAddressMaskingTypeClassC:
                        return IPMaskingType.ClassC;

                    case TextItem.DBValueIPAddressMaskingTypeClassB:
                        return IPMaskingType.ClassB;

                    case TextItem.DBValueIPAddressMaskingTypeClassA:
                        return IPMaskingType.ClassA;

                    default:
                        return IPMaskingType.Unknown;
                }
            }
            catch
            {
                return IPMaskingType.Unknown;
            }
        }

        public static TextItem ToTextItem (string strTextType)
        {
            if (string.IsNullOrWhiteSpace(strTextType) == true)
            {
                throw new ArgumentNullException("string strTextType");
            }

            strTextType = strTextType.Trim();

            try
            {
                switch (strTextType.ToUpper())
                {
                    case TextItem.DBValueTextTypeIPAddress:
                        return new TextItem(TextType.IPAddress)
                        {
                            IPMaskingMode = IPMaskingType.ClassD
                        };

                    case TextItem.DBValueTextTypePCTime:
                        return new TextItem(TextType.PCTime);

                    case TextItem.DBValueTextTypeDocumentName:
                        return new TextItem(TextType.DocumentName);

                    case TextItem.DBValueTextTypeUserID:
                        return new TextItem(TextType.UserID);

                    case TextItem.DBValueTextTypeCustomString:
                        return new TextItem(TextType.CustomString);

                    default:
                        return null;
                }
            }
            catch
            {
                return null;
            }
        }

        public static string GetLocalTimeString (DateTime datetime, TextItem.PCTimeFormatType pcTimeFormat)
        {
            switch (pcTimeFormat)
            {
                case TextItem.PCTimeFormatType.KT:
                    return datetime.ToString(TextItem.DatetimeFormatKT);

                case TextItem.PCTimeFormatType.ST:
                    return datetime.ToString(TextItem.DatetimeFormatST);

                case TextItem.PCTimeFormatType.DT:
                    return datetime.ToString(TextItem.DatetimeFormatDT);

                case TextItem.PCTimeFormatType.NT:
                    return datetime.ToString(TextItem.DatetimeFormatNT);

                case TextItem.PCTimeFormatType.K:
                    return datetime.ToString(TextItem.DatetimeFormatK);

                case TextItem.PCTimeFormatType.S:
                    return datetime.ToString(TextItem.DatetimeFormatS);

                case TextItem.PCTimeFormatType.D:
                    return datetime.ToString(TextItem.DatetimeFormatD);

                case TextItem.PCTimeFormatType.N:
                    return datetime.ToString(TextItem.DatetimeFormatN);

                default:
                    return string.Empty;
            }
        }

        public string GetMaskedIPAddress (string strIPAddress)
        {
            if (string.IsNullOrEmpty(strIPAddress) == true)
            {
                throw new ArgumentNullException("string strIPAddress");
            }

            string[] arrIP = strIPAddress.Split('.');

            if (arrIP.Length != 4)
            {
                new ArgumentException(string.Format("IP Address' format is incorrect. (VALUE: {0})", strIPAddress), "string arrIP");
            }

            int numClassValue = int.MaxValue;

            foreach (string strClassValue in arrIP)
            {
                if (int.TryParse(strClassValue, out numClassValue) == false)
                {
                    new ArgumentException(string.Format("IP Address' format is incorrect. (VALUE: {0})", strIPAddress), "string arrIP");
                }

                if (numClassValue < 0 || numClassValue > 255)
                {
                    new ArgumentException(string.Format("IP Address' format is incorrect. (VALUE: {0})", strIPAddress), "string arrIP");
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            string classA = arrIP[0];
            string classB = arrIP[1];
            string classC = arrIP[2];
            string classD = arrIP[3];

            switch (this.IPMaskingMode)
            {
                case TextItem.IPMaskingType.ClassA:
                    //192.xxx.xxx.xxx
                    classB = TextItem.IPMaskingString;
                    classC = TextItem.IPMaskingString;
                    classD = TextItem.IPMaskingString;
                    break;

                case TextItem.IPMaskingType.ClassB:
                    //192.168.xxx.xxx
                    classC = TextItem.IPMaskingString;
                    classD = TextItem.IPMaskingString;
                    break;

                case TextItem.IPMaskingType.ClassC:
                    //192.168.100.xxx
                    classD = TextItem.IPMaskingString;
                    break;

                case TextItem.IPMaskingType.ClassD:
                    //192.168.100.11
                    break;

                default:
                    return string.Empty;
            }

            return string.Format("{0}.{1}.{2}.{3}", classA, classB, classC, classD);
        }

        #endregion Static Methods
    }
}