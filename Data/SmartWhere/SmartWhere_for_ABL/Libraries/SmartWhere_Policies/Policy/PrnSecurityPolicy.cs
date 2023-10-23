namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.Collections.Generic;
    using System.Text.RegularExpressions;

    using Common.Extension;

    using PDL;



    public class PrnSecurityPolicy : PrnPolicyItemBase
    {
        #region Enumerations

        public enum SecurityType
        {
            Unknown,
            Keyword,
            Pattern
        }

        public enum PageDetectionType
        {
            Unknown,
            All,
            First,
            Odd,
            Even,
            Custom
        }

        public enum MaskingType
        {
            Unknown,
            All,
            Odd,
            Even,
            Custom
        }

        #endregion Enumerations



        #region Constants :: Database Values

        public const string DBValueTypeKeyword        = @"K";
        public const string DBValueTypePattern        = @"P";

        public const string DBValueRangeAll           = @"ALL";
        public const string DBValueRangeFirst         = @"FIRST";
        public const string DBValueRangeOdd           = @"ODD";
        public const string DBValueRangeEven          = @"EVEN";
        public const string DBValueRangeCustomByRegex = @"(\d+)-(\d+)";

        #endregion Constants :: Database Values



        #region Constants :: Default Values

        public const SecurityType      DefaultSecurityType      = SecurityType.Unknown;
        public const bool              DefaultUseMasking        = false;
        public const bool              DefaultUseApproval       = false;
        public const PageDetectionType DefaultPageDetectionMode = PageDetectionType.Unknown;
        public const MaskingType       DefaultMaskingMode       = MaskingType.Unknown;
        public const int               DefaultLimitCount        = 1;

        #endregion Constants :: Default Value



        #region Properties

        public string            ID                 { get; set; }
        public string            Name               { get; set; }
        public SecurityType      Type               { get; set; }
        public string            Value              { get; set; }
        public bool              UseMasking         { get; set; }
        public bool              UseApproval        { get; set; }
        public PageDetectionType PageDetectionMode  { get; set; }
        public uint              PageDetectionStart { get; private set; } // used only custom
        public uint              PageDetectionEnd   { get; private set; } // used only custom
        public MaskingType       MaskingMode        { get; set; }
        public uint              MaskingStart       { get; private set; } // used only custom
        public uint              MaskingEnd         { get; private set; } // used only custom
        public int               LimitCount
        {
            get
            {
                return this._LimitCount;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than 0 ({0} < 0)", value));
                }

                this._LimitCount = value;
            }
        }
        private int _LimitCount = PrnSecurityPolicy.DefaultLimitCount;

        public string            Description        { get; set; }

        /**********************************************************************************************//**
         * <summary> 해당 마스킹 정책을 적용하여 문서에서 검출된 결과에 대한 정보 
         *           (직렬화 하지않음, only be used to Pre-process Routine)
         *           <para> Key:   페이지 번호 </para>
         *           <para> Value: 검출 갯수   </para></summary>
         **************************************************************************************************/
        private SortedDictionary<int, int> DetectionCountDictionary { get; set; }

        #endregion Properties



        #region Constructors

        public PrnSecurityPolicy () : base()
        {
        }

        #endregion Constructors



        #region Methods :: Initialize

        protected override void InitializeProperties ()
        {
            this.IsEnabled          = false;
            this.ID                 = string.Empty;
            this.Name               = string.Empty;
            this.Type               = PrnSecurityPolicy.DefaultSecurityType;
            this.Value              = string.Empty;
            this.UseMasking         = PrnSecurityPolicy.DefaultUseMasking;
            this.UseApproval        = PrnSecurityPolicy.DefaultUseApproval;
            this.PageDetectionMode  = PrnSecurityPolicy.DefaultPageDetectionMode;
            this.PageDetectionStart = uint.MinValue;
            this.PageDetectionEnd   = uint.MaxValue;
            this.MaskingMode        = PrnSecurityPolicy.DefaultMaskingMode;
            this.MaskingStart       = uint.MinValue;
            this.MaskingEnd         = uint.MaxValue;
            this.LimitCount         = PrnSecurityPolicy.DefaultLimitCount;
            this.Description        = string.Empty;
        }

        protected override void InitializeCollections ()
        {
            this.DetectionCountDictionary = new SortedDictionary<int, int>();
        }

        #endregion Methods :: Initialize



        #region Methods :: Setters

        public void SetPageDetection (string strValue)
        {
            if (string.IsNullOrWhiteSpace(strValue) == true)
            {
                throw new ArgumentNullException("string strValue");
            }

            this.PageDetectionMode = PrnSecurityPolicy.ToPageDetectionType(strValue);

            if (this.PageDetectionMode == PageDetectionType.Custom)
            {
                uint start = uint.MinValue;
                uint end   = uint.MaxValue;

                bool isExtracted = PrnPolicyDatabaseManager.TryExtractRangeString(strValue, out start, out end);

                if (isExtracted == false)
                {
                    return;
                }

                this.PageDetectionStart = start;
                this.PageDetectionEnd   = end;
            }
        }

        public void SetMasking (string strValue)
        {
            if (string.IsNullOrWhiteSpace(strValue) == true)
            {
                throw new ArgumentNullException("string strValue");
            }

            this.MaskingMode = PrnSecurityPolicy.ToMaskingType(strValue);

            if (this.MaskingMode == MaskingType.Custom)
            {
                uint start = uint.MinValue;
                uint end   = uint.MaxValue;

                bool isExtracted = PrnPolicyDatabaseManager.TryExtractRangeString(strValue, out start, out end);

                if (isExtracted == false)
                {
                    return;
                }

                this.MaskingStart = start;
                this.MaskingEnd   = end;
            }
        }

        #endregion Methods :: Setters



        #region Methods :: Masking Inspection

        public SortedDictionary<long, uint[]> AddMatchResult (List<PCLXLAttributeItem> listAttribute, int idxFound, int lenFound = 0)
        {
            if (listAttribute == null || listAttribute.Count < 1)
            {
                throw new ArgumentNullException("List<PCLXLAttributeItem> listAttribute");
            }

            if (idxFound < 0)
            {
                throw new ArgumentOutOfRangeException("int idxFound", idxFound, string.Format("value is less than 0 ({0} < 0)", idxFound));
            }

            if (this.Type == SecurityType.Keyword)
            {
                lenFound = this.Value.Length;
            }

            if (lenFound < 1)
            {
                throw new ArgumentOutOfRangeException("int lenFound", lenFound, string.Format("value is less than 1 ({0} < 1)", lenFound));
            }

            if (this.UseMasking == false)
            {
                return null;
            }

            return this.ConvertMaskedAttributeList(listAttribute, idxFound, lenFound);
        }

        private SortedDictionary<long, uint[]> ConvertMaskedAttributeList (List<PCLXLAttributeItem> listAttribute, int idxFound, int lenFound)
        {
            int idxStart = idxFound;
            int idxEnd   = idxFound + lenFound;
            int posText  = 0;
            int lenText  = 0;

            int idxMasking = 0;

            SortedDictionary<long, uint[]> dictionaryMaskingResult = new SortedDictionary<long, uint[]>();

            List<uint> listMaskedIndex = null;

            foreach (PCLXLAttributeItem attribute in listAttribute)
            {
                try
                {
                    listMaskedIndex = new List<uint>();

                    posText += lenText;

                    if (posText >= idxEnd)
                    {
                        break;
                    }

                    switch (attribute.ValueTag)
                    {
                        case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                            lenText = attribute.ValueByte.Length;
                            break;

                        case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                            lenText = attribute.ValueUInt16.Length;
                            break;

                        default:
                            continue;
                    }

                    if (posText + lenText <= idxStart)
                    {
                        continue;
                    }

                    bool isMasking = false;

                    for (uint idx = 0; idx < lenText; idx++)
                    {
                        if (posText + idx < idxStart)
                        {
                            continue;
                        }

                        if (posText + idx >= idxEnd)
                        {
                            break;
                        }

                        idxMasking++;

                        bool isChangeAsetrisk = false;

                        switch (this.MaskingMode)
                        {
                            case PrnSecurityPolicy.MaskingType.All:
                                isChangeAsetrisk = true;
                                break;

                            case PrnSecurityPolicy.MaskingType.Odd:
                                if ((idxMasking % 2) == 1)
                                {
                                    isChangeAsetrisk = true;
                                }
                                break;

                            case PrnSecurityPolicy.MaskingType.Even:
                                if ((idxMasking % 2) == 0)
                                {
                                    isChangeAsetrisk = true;
                                }
                                break;

                            case PrnSecurityPolicy.MaskingType.Custom:
                                if (this.MaskingStart <= idxMasking && idxMasking <= this.MaskingEnd)
                                {
                                    isChangeAsetrisk = true;
                                }
                                break;
                        }

                        if (isChangeAsetrisk == true)
                        {
                            listMaskedIndex.Add(idx);

                            isMasking = true;
                        }
                    }

                    if (isMasking == true)
                    {
                        dictionaryMaskingResult.Add(attribute.Offset, listMaskedIndex.ToArray());
                    }
                }
                catch
                {
                    continue;
                }
            }

            if (dictionaryMaskingResult.Count < 1)
            {
                return null;
            }

            return dictionaryMaskingResult;
        }

        public void IncreseDetectionCount (int page)
        {
            if (page < 1)
            {
                throw new ArgumentOutOfRangeException("int page", page, string.Format("Page Number is less than 1 ({0} < 1)", page));
            }

            if (this.DetectionCountDictionary == null)
            {
                this.DetectionCountDictionary = new SortedDictionary<int, int>();
            }

            if (this.DetectionCountDictionary.ContainsKey(page) == false)
            {
                this.DetectionCountDictionary.Add(page, 1);
            }
            else
            {
                this.DetectionCountDictionary[page]++;
            }
        }

        public int GetTotalDetectionCount ()
        {
            int count = 0;

            foreach (int cntPerPage in this.DetectionCountDictionary.Values)
            {
                count += cntPerPage;
            }

            return count;
        }

        public SortedDictionary<int, int> GetDetectionCountDictionary ()
        {
            return this.DetectionCountDictionary;
        }


        public PrnMaskingResults CreateMaskingResult (string spoolID = null)
        {
            PrnMaskingResults results = new PrnMaskingResults();

            if (spoolID == null)
            {
                spoolID = "";
            }

            foreach (var pair in this.DetectionCountDictionary)
            {
                try
                {
                    PrnMaskingResult result = new PrnMaskingResult()
                    {
                        SpoolID        = spoolID,
                        PolicyID       = this.ID,
                        PageNumber     = pair.Key,
                        DetectionCount = pair.Value
                    };

                    results.Results.Add(result);
                }
                catch
                {
                    continue;
                }
            }

            return results;
        }

        public bool IsRequiredApproval ()
        {
            if (this.UseApproval == false)
            {
                return false;
            }

            return this.GetTotalDetectionCount() > this.LimitCount;
        }

        #endregion Methods :: Masking Inspection



        #region Methods :: Value Convert

        public static SecurityType ToType (string strType)
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

                    case PrnSecurityPolicy.DBValueTypeKeyword:
                        return SecurityType.Keyword;

                    case PrnSecurityPolicy.DBValueTypePattern:
                        return SecurityType.Pattern;

                    default:
                        return SecurityType.Unknown;
                }
            }
            catch
            {
                return SecurityType.Unknown;
            }
        }

        public static PageDetectionType ToPageDetectionType (string strType)
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
                    case PrnSecurityPolicy.DBValueRangeAll:
                        return PageDetectionType.All;

                    case PrnSecurityPolicy.DBValueRangeFirst:
                        return PageDetectionType.First;

                    case PrnSecurityPolicy.DBValueRangeOdd:
                        return PageDetectionType.Odd;

                    case PrnSecurityPolicy.DBValueRangeEven:
                        return PageDetectionType.Even;

                    default:
                        {
                            Match match = Regex.Match(strType, PrnSecurityPolicy.DBValueRangeCustomByRegex);

                            // ORIGINAL, START, END -> 3
                            if (match == null || match.Success == false || match.Groups.Count < 3)
                            {
                                return PageDetectionType.Unknown;
                            }

                            return PageDetectionType.Custom;
                        }
                }
            }
            catch
            {
                return PageDetectionType.Unknown;
            }
        }

        public static MaskingType ToMaskingType (string strType)
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
                    case PrnSecurityPolicy.DBValueRangeAll:
                        return MaskingType.All;

                    case PrnSecurityPolicy.DBValueRangeOdd:
                        return MaskingType.Odd;

                    case PrnSecurityPolicy.DBValueRangeEven:
                        return MaskingType.Even;

                    default:
                        {
                            Match match = Regex.Match(strType, PrnSecurityPolicy.DBValueRangeCustomByRegex);

                            // ORIGINAL, START, END -> 3
                            if (match == null || match.Success == false || match.Groups.Count < 3)
                            {
                                return MaskingType.Unknown;
                            }

                            return MaskingType.Custom;
                        }
                }
            }
            catch
            {
                return MaskingType.Unknown;
            }
        }

        [Obsolete]
        public override string ToString (string ipAddress, string userID, string documentName, DateTime rcdTime)
        {
            throw new NotImplementedException();
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods :: Value Convert
    }
}
