namespace FXKIS.SmartWhere.Metadata
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;

    using Common.Extension;
    using Policy;

    using PDL;
    using PDL.Analyze;

    using MaskingConstants;



    public class PrnMetadata
    {
        #region Constants

        private const double WindowsVersionOverThanXP = 6.0;

        #endregion Constants



        #region Properties

        public  PrnInformation PrnInfo        { get; private set; }
        public  PrnPolicy      Policy         { get; private set; }
        public  string         DriverVersion  { get; private set; }
        public  string         WindowsVersion { get; private set; }
        private bool           IsWindowXP     { get; set; }

        public  bool           IsApproval
        {
            get
            {
                if (this.IsApprovalSecurity == true || this.IsOverMassLimit == true || this.IsOverColorLimit == true)
                {
                    return true;
                }

                return false;
            }
        }

        public bool IsApprovalSecurity
        {
            get
            {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////

                if (this.Policy == null || this.Policy.Securities == null || this.Policy.Securities.Count < 1)
                {
                    return false;
                }

                if (this.PageDictionary == null || this.PageDictionary.Count < 1)
                {
                    return false;
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////////////

                List<string> listApprovalSecurityID = new List<string>();
                
                foreach (PrnSecurityPolicy security in this.Policy.Securities)
                {
                    try
                    {
                        if (string.IsNullOrWhiteSpace(security.ID) == true)
                        {
                            continue;
                        }

                        if (security.UseApproval == true)
                        {
                            listApprovalSecurityID.Add(security.ID.Trim().ToUpper());
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                ///////////////////////////////////////////////////////////////////////////////////////////////////////

                foreach (PageInformation page in this.PageDictionary.Values)
                {
                    try
                    {
                        if (page.MaskingInfoList == null || page.MaskingInfoList.Count < 1)
                        {
                            continue;
                        }

                        foreach (MaskingInformation masking in page.MaskingInfoList)
                        {
                            if (masking.MaskingDictionary == null || masking.MaskingDictionary.Count < 1)
                            {
                                continue;
                            }

                            foreach (MaskingTextData text in masking.MaskingDictionary.Values)
                            {
                                if (string.IsNullOrWhiteSpace(text.PolicyID) == true)
                                {
                                    continue;
                                }

                                if (listApprovalSecurityID.Contains(text.PolicyID.Trim().ToUpper()) == true)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                return false;

                ///////////////////////////////////////////////////////////////////////////////////////////////////////
            }
        }

        public bool IsDetectedSecurity
        {
            get
            {
                if (this.Policy == null || this.Policy.Securities == null || this.Policy.Securities.Count < 1)
                {
                    return false;
                }

                if (this.PageDictionary == null || this.PageDictionary.Count < 1)
                {
                    return false;
                }

                foreach (PageInformation page in this.PageDictionary.Values)
                {
                    try
                    {
                        if (page.MaskingInfoList == null || page.MaskingInfoList.Count < 1)
                        {
                            continue;
                        }

                        foreach (MaskingInformation masking in page.MaskingInfoList)
                        {
                            if (masking.MaskingDictionary != null && masking.MaskingDictionary.Count > 0)
                            {
                                return true;
                            }
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }

                return false;
            }
        }

        public bool IsOverMassLimit
        {
            get
            {
                if (this.Policy == null || this.Policy.PrintOption == null)
                {
                    return false;
                }

                if (this.Policy.PrintOption.MassChecked == false)
                {
                    return false;
                }

                if (this.PageCount >= this.Policy.PrintOption.MassLimit)
                {
                    return true;
                }

                return false;
            }
        }

        public bool IsOverColorLimit
        {
            get
            {
                if (this.Policy == null || this.Policy.PrintOption == null)
                {
                    return false;
                }

                if (this.Policy.PrintOption.ColorChecked == false || this.Policy.PrintOption.ForceBlackWhite == true)
                {
                    return false;
                }

                if (this.ColorPageCount >= this.Policy.PrintOption.ColorLimit)
                {
                    return true;
                }

                return false;
            }
        }

        public int ColorPageCount
        {
            get
            {
                if (this.PageDictionary == null || this.PageDictionary.Count < 1)
                {
                    return 0;
                }

                int count = 0;

                foreach (PageInformation page in this.PageDictionary.Values)
                {
                    try
                    {
                        if (page.IsBlackWhite == false)
                        {
                            count++;
                        }
                    }
                    catch { }
                }

                return count;
            }
        }

        public int PageCount
        {
            get
            {
                if (this.PageDictionary == null)
                {
                    return 0;
                }

                return this.PageDictionary.Count;
            }
        }

        #endregion Properties



        #region Properties :: Collections

        public  SortedDictionary<int,    PageInformation>          PageDictionary          { get; private set; }
        private SortedDictionary<string, CommonIF.FontInformation> FontInfoDictionary      { get; set; }
        private SortedDictionary<long,   MaskingInformation>       PageBlankFontDictionary { get; set; }

        #endregion Properties :: Collections



        #region Constructors

        public PrnMetadata ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public PrnMetadata (PrnExtractedData extracted) : this()
        {
            if (extracted == null)
            {
                throw new ArgumentNullException("PrnExtractedData extracted");
            }

            this.SetExtractedData(extracted);
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.PrnInfo        = new PrnInformation();
            this.Policy         = new PrnPolicy();
            this.DriverVersion  = string.Empty;
            this.WindowsVersion = string.Empty;
            this.IsWindowXP     = false;
        }

        private void InitializeCollections ()
        {
            this.PageDictionary          = new SortedDictionary<int,    PageInformation>();
            this.FontInfoDictionary      = new SortedDictionary<string, CommonIF.FontInformation>();
            this.PageBlankFontDictionary = new SortedDictionary<long,   MaskingInformation>();
        }

        public void SetPrnInformation (PrnInformation prnInfo)
        {
            if (prnInfo == null)
            {
                throw new ArgumentNullException("PrnInformation prnInfo");
            }

            this.PrnInfo = new PrnInformation(prnInfo);
        }

        public void SetPolicy (PrnPolicy policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("PrnPolicy policy");
            }

            this.Policy = new PrnPolicy(policy);
        }

        private void SetExtractedData (PrnExtractedData extracted)
        {
            if (extracted == null)
            {
                throw new ArgumentNullException("PrnExtractedData extracted");
            }

            if (this.Policy != null)
            {
                this.Policy = new PrnPolicy(extracted.Policy);
            }

            this.SetVersionInfo(extracted);
            this.SetRemainDays();

            this.SetExtractedPJL(extracted.PJLs);
            this.SetExtractedPCLXL(extracted.PCLXLs);
        }

        private void SetVersionInfo (PrnExtractedData extracted)
        {
            if (extracted == null)
            {
                throw new ArgumentNullException("PrnExtractedDate extracted");
            }

            this.DriverVersion  = extracted.DriverVersion;
            this.WindowsVersion = extracted.WindowsVersion;

            try
            {
                double fWindowsVersion;

                if (double.TryParse(this.WindowsVersion, out fWindowsVersion) == true)
                {
                    if (fWindowsVersion < PrnMetadata.WindowsVersionOverThanXP)
                    {
                        this.IsWindowXP = true;
                    }
                }
            }
            catch { }
        }

        private void SetRemainDays ()
        {
            if (this.Policy == null || this.Policy.PrintOption == null)
            {
                return;
            }

            try
            {
                this.PrnInfo.SetRemainDays(this.Policy.PrintOption.RemainDays);
            }
            catch { }
        }

        private void SetExtractedPJL (Dictionary<ItemType.PJL, string> dictionaryPJL)
        {
            if (dictionaryPJL == null)
            {
                throw new ArgumentNullException("Dictionary<ItemType.PJL, string> dictionaryPJL");
            }

            if (dictionaryPJL.Count < 1)
            {
                return;
            }

            string date     = string.Empty;
            string time     = string.Empty;
            string duplex   = string.Empty;
            string binding  = string.Empty;
            int    intValue = 0;

            int copies   = 0;
            int quantity = 0;

            // Analyze a PJL datas
            foreach (var pair in dictionaryPJL)
            {
                try
                {
                    switch (pair.Key)
                    {
                        case ItemType.PJL.Date:
                            date = pair.Value;
                            break;

                        case ItemType.PJL.Time:
                            time = pair.Value;
                            break;

                        case ItemType.PJL.DocumentName:
                            this.PrnInfo.DocumentName = pair.Value;
                            break;


                        case ItemType.PJL.Qty:
                            if (int.TryParse(pair.Value, out intValue) == true)
                            {
                                quantity = intValue;
                            }
                            break;

                        case ItemType.PJL.Copies:
                            if (int.TryParse(pair.Value, out intValue) == true)
                            {
                                copies = intValue;
                            }
                            break;

                        case ItemType.PJL.Duplex:
                            duplex = pair.Value;
                            break;

                        case ItemType.PJL.Binding:
                            binding = pair.Value;
                            break;

                        case ItemType.PJL.UserID:
                            this.PrnInfo.UserID = pair.Value;
                            break;

                        case ItemType.PJL.Nup:
                            if (int.TryParse(pair.Value, out intValue) == true)
                            {
                                this.PrnInfo.Nup = intValue;
                            }
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

            /////////////////////////////////////////////////////////////////////////////////
            // todo :: 2018.06.26 qty,copies
            /////////////////////////////////////////////////////////////////////////////////
            this.PrnInfo.Copies = quantity >= copies ? quantity : copies; 

            // JOB TIME
            if (string.IsNullOrWhiteSpace(date) == false && string.IsNullOrWhiteSpace(time) == false)
            {
                DateTime jobtime;

                if (DateTime.TryParse(string.Format("{0} {1}", date, time), out jobtime) == true)
                {
                    this.PrnInfo.JobTime = jobtime;
                }
            }

            // DUPLEX MODE
            if (string.IsNullOrWhiteSpace(duplex) == false && string.IsNullOrWhiteSpace(binding) == false)
            {
                switch (duplex.ToUpper())
                {
                    case PDL.Constants.PJLVariable.ValueOn:
                        {
                            switch (binding.ToUpper())
                            {
                                case PDL.Constants.PJLVariable.ValueLongEdge:
                                    this.PrnInfo.DuplexMode = PrnInformation.DuplexType.DuplexLongEdge;
                                    break;

                                case PDL.Constants.PJLVariable.ValueShortEdge:
                                    this.PrnInfo.DuplexMode = PrnInformation.DuplexType.DuplexShortEdge;
                                    break;

                                default:
                                    this.PrnInfo.DuplexMode = PrnInformation.DuplexType.Simplex;
                                    break;
                            }
                        }
                        break;

                    default:
                        this.PrnInfo.DuplexMode = PrnInformation.DuplexType.Simplex;
                        break;
                }
            }

        }

        private void SetExtractedPCLXL (SortedDictionary<long, PCLXLItem> dictionaryPCLXL)
        {
            if (dictionaryPCLXL == null)
            {
                throw new ArgumentNullException("SortedDictionary<long, PCLXLItem> dictionaryPCLXL");
            }

            if (dictionaryPCLXL.Count < 1)
            {
                return;
            }

            // CharCodeIndex -> Font glyphID ->  Unicode
            Dictionary<CommonIF.FontInformation, List<ushort>> tableFontUnicode = new Dictionary<CommonIF.FontInformation, List<ushort>>();

            int  cntPage     = 0;
            int  numCharCode = -1;
            bool hasColor    = false;

            RangeData rangeFont = new RangeData
            {
                Start = -1,
                End   = -1
            };

            List<PCLXLAttributeItem> listCurrentLineAttribute = new List<PCLXLAttributeItem>();
            List<PCLXLAttributeItem> listMaskedAttribute      = new List<PCLXLAttributeItem>();

            CommonIF.FontInformation currentFont = null;
            MaskingInformation[]     maskings    = null;

            string strCurrentLine = string.Empty;
            int    currentAxisY   = 0;

            int intValue = 0;

            // StartPhysical :: CommentData "FXPC="              (Optional for n-up)
            // StartLogical  :: CommentData "StartPage"
            // EndLogical    :: CommentData "EndPage of Logical"
            // EndPhysical   :: Operator    "EndPage"            (Optional for n-up)

            // ㄴ Color  :: CommentData "FXPC="
            // ㄴ Angle  :: Attribute   "PageAngle"
            // ㄴ Origin :: Attribute   "PageOrigin"
            // ㄴ Scale  :: Attribute   "PageScale"

            PageInformation page = null;

            // Analyze a PCL-XL datas
            foreach (var pair in dictionaryPCLXL)
            {
                try
                {
                    switch (pair.Value.Type)
                    {
                        case PCLXLItem.PCLXLItemType.Attribute:
                            {
                                if ((pair.Value is PCLXLAttributeItem) == false)
                                {
                                    continue;
                                }

                                PCLXLAttributeItem attr = pair.Value as PCLXLAttributeItem;

                                switch (attr.Attribute)
                                {
                                    case PDL.Constants.PCLXLAttribute.CommentData:
                                        {
                                            string text = attr.Text.ToUpper();

                                            // PAGE START (PHYSICAL)
                                            if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.ColorMode) == true)
                                            {
                                                Match match = Regex.Match(text, PDL.Constants.PCLXLAttribute.CommentDataValue.PatternColorMode);

                                                if (match == null || match.Success == false || match.Groups.Count != 2)
                                                {
                                                    continue;
                                                }

                                                if (page != null)
                                                {
                                                    page.SortMasking();

                                                    this.PageDictionary.Add(cntPage, page);
                                                }

                                                // NEW PAGE (PHYSICAL)
                                                cntPage++;
                                                numCharCode = -1;

                                                page = new PageInformation(cntPage)
                                                {
                                                    HasPhysicalStart = true
                                                };

                                                page.OffsetInfo.StartPhysical = attr.Offset;

                                                page.OffsetInfo.OffsetDictionary.Add(attr.Offset, PageOffsetInformation.PageOffsetType.Color);

                                                // Color
                                                string strValue = match.Groups[1].Value;

                                                if (int.TryParse(strValue, out intValue) == true)
                                                {
                                                    if (intValue == 1)
                                                    {
                                                        page.IsBlackWhite = true;
                                                    }
                                                    else
                                                    {
                                                        page.IsBlackWhite = false;

                                                        if (hasColor == false)
                                                        {
                                                            hasColor = true;
                                                        }
                                                    }
                                                }
                                            }

                                            // PAGE START (LOGICAL)
                                            else if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.StartPage) == true)
                                            {
                                                // Add a Page Information
                                                if (page.HasPhysicalEnd == false && page.OffsetInfo.EndLogical >= 0)
                                                {
                                                    if (page != null)
                                                    {
                                                        this.PageDictionary.Add(cntPage, page);
                                                    }

                                                    // NEW PAGE (LOGICAL)
                                                    cntPage++;
                                                    numCharCode = -1;

                                                    page = new PageInformation(cntPage);
                                                }

                                                currentAxisY = 0;

                                                page.OffsetInfo.StartLogical = attr.Offset;
                                            }

                                            // PAGE END (LOGICAL)
                                            else if (text.Contains(PDL.Constants.PCLXLAttribute.CommentDataValue.EndPageOfLogical) == true)
                                            {
                                                page.OffsetInfo.EndLogical = attr.Offset;

                                                // Masking 문자열 검출 :: (LOGICAL) Page가 변경되는 경우
                                                if (string.IsNullOrWhiteSpace(strCurrentLine) == false)
                                                {
                                                    maskings = this.DetectSecurity(listCurrentLineAttribute, strCurrentLine, cntPage, currentFont, rangeFont, numCharCode);

                                                    if (maskings != null)
                                                    {
                                                        foreach (MaskingInformation masking in maskings)
                                                        {
                                                            page.AddMaskingInformation(masking, currentFont, rangeFont, numCharCode);
                                                        }
                                                    }
                                                }

                                                strCurrentLine = string.Empty;

                                                listCurrentLineAttribute.Clear();

                                                // Font 초기화
                                                currentFont = null;

                                                this.FontInfoDictionary.Clear();

                                                this.PageBlankFontDictionary.Clear();

                                                // Masking data 정렬
                                                page.SortMaskingTextData();
                                            }
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.UnitsPerMeasure:
                                        switch (attr.ValueTagDataType)
                                        {
                                            case PCLXLAttributeItem.AttributeValueTagDataType.UInt16:
                                                this.PrnInfo.Resoulution = attr.ValueUInt16[0];
                                                break;

                                            case PCLXLAttributeItem.AttributeValueTagDataType.Real32:
                                                this.PrnInfo.Resoulution = (int)attr.ValueReal32[0];
                                                break;
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.MediaSize:
                                        if (attr.ValueTagDataType == PCLXLAttributeItem.AttributeValueTagDataType.UByte)
                                        {
                                            page.PaperCode = attr.ValueByte[0];
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.Orientation:
                                        page.OffsetInfo.OffsetDictionary.Add(attr.Offset, PageOffsetInformation.PageOffsetType.Orientation);
                                        break;

                                    case PDL.Constants.PCLXLAttribute.PageOrigin:
                                        page.OffsetInfo.OffsetDictionary.Add(attr.Offset, PageOffsetInformation.PageOffsetType.Origin);
                                        break;

                                    case PDL.Constants.PCLXLAttribute.PageScale:
                                        page.OffsetInfo.OffsetDictionary.Add(attr.Offset, PageOffsetInformation.PageOffsetType.Scale);
                                        break;

                                    case PDL.Constants.PCLXLAttribute.PageAngle:
                                        if (page.PageNumber == 1)
                                        {
                                            if (attr.ValueTag == PCLXLAttributeItem.AttributeValueTagType.SingleUInt16)
                                            {
                                                this.PrnInfo.SetOrientationByPageAngle(attr.ValueUInt16[0]);
                                            }
                                            else if (attr.ValueTag == PCLXLAttributeItem.AttributeValueTagType.SingleSInt16)
                                            {
                                                this.PrnInfo.SetOrientationByPageAngle(attr.ValueSInt16[0]);
                                            }
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.FontName:
                                        {
                                            if (currentFont != null && rangeFont.Start > 0 && rangeFont.End >= rangeFont.Start)
                                            {
                                                MaskingInformation blankFont = new MaskingInformation(currentFont, rangeFont, numCharCode);

                                                if (this.PageBlankFontDictionary.ContainsKey(rangeFont.Start) == false)
                                                {
                                                    this.PageBlankFontDictionary.Add(rangeFont.Start, blankFont);
                                                }
                                            }

                                            /////////////////////////////////////////////////////////////////////////

                                            string fontName = attr.Text.Trim();

                                            bool isEqualFont = (currentFont != null && (string.Compare(fontName, currentFont.InputName.Trim(), true) == 0));

                                            // Masking 문자열 검출 :: Font가 변경되는 경우, 기존 Font 통해 추출한 문자열 대상으로 검출
                                            if (currentFont == null || isEqualFont == false)
                                            {
                                                if (currentFont != null && string.IsNullOrWhiteSpace(strCurrentLine) == false)
                                                {
                                                    maskings = this.DetectSecurity(listCurrentLineAttribute, strCurrentLine, cntPage, currentFont, rangeFont, numCharCode);

                                                    if (maskings != null)
                                                    {
                                                        foreach (MaskingInformation masking in maskings)
                                                        {
                                                            page.AddMaskingInformation(masking, currentFont, rangeFont, numCharCode);
                                                        }
                                                    }
                                                    else if (page.IsExistsSameFontMasking(currentFont.InputName) == true && rangeFont.Start > 0 && rangeFont.End > rangeFont.Start)
                                                    {
                                                        MaskingInformation masking = new MaskingInformation(currentFont, rangeFont, numCharCode);

                                                        page.MaskingInfoList.Add(masking);
                                                    }
                                                }

                                                strCurrentLine = string.Empty;

                                                listCurrentLineAttribute.Clear();

                                                // 현재 Font 획득
                                                currentFont = this.GetFontInformation(fontName, this.IsWindowXP);

                                                rangeFont   = new RangeData { Start = attr.Offset, End = attr.Offset };
                                                numCharCode = -1;
                                            }
                                            else if (page.IsExistsSameFontMasking(currentFont.InputName) == true && rangeFont.Start > 0 && rangeFont.End > rangeFont.Start)
                                            {
                                                MaskingInformation masking = new MaskingInformation(currentFont, rangeFont, numCharCode);

                                                page.MaskingInfoList.Add(masking);
                                            }
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.Point:
                                        {
                                            int valueY = -1;

                                            switch (attr.ValueTag)
                                            {
                                                case PCLXLAttributeItem.AttributeValueTagType.XYUByte:
                                                    valueY = attr.ValueByte[1];
                                                    break;

                                                case PCLXLAttributeItem.AttributeValueTagType.XYUInt16:
                                                    valueY = attr.ValueUInt16[1];
                                                    break;

                                                case PCLXLAttributeItem.AttributeValueTagType.XYSInt16:
                                                    valueY = attr.ValueSInt16[1];
                                                    break;

                                                default:
                                                    continue;
                                            }

                                            if (valueY == -1)
                                            {
                                                continue;
                                            }

                                            // Masking 문자열 검출 :: 추출 중인 TextData들의 Y 좌표값이 달라지는 경우 (같은 line에서 벗어나는 경우)
                                            if (currentAxisY != valueY)
                                            {
                                                currentAxisY = valueY;

                                                if (string.IsNullOrWhiteSpace(strCurrentLine) == false)
                                                {
                                                    maskings = this.DetectSecurity(listCurrentLineAttribute, strCurrentLine, cntPage, currentFont, rangeFont, numCharCode);

                                                    if (maskings != null)
                                                    {
                                                        foreach (MaskingInformation masking in maskings)
                                                        {
                                                            page.AddMaskingInformation(masking, currentFont, rangeFont, numCharCode);
                                                        }
                                                    }
                                                }

                                                strCurrentLine = string.Empty;

                                                listCurrentLineAttribute.Clear();
                                            }
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.CharCode:
                                        {
                                            if (currentFont == null)
                                            {
                                                continue;
                                            }
                                            
                                            switch (attr.ValueTag)
                                            {
                                                case PCLXLAttributeItem.AttributeValueTagType.SingleUByte:
                                                    {
                                                        if (attr.ValueByte[0] >= 0xFF)
                                                        {
                                                            break;
                                                        }

                                                        numCharCode = attr.ValueByte[0];
                                                    }
                                                    break;

                                                case PCLXLAttributeItem.AttributeValueTagType.SingleUInt16:
                                                    {
                                                        if (attr.ValueUInt16[0] >= 0xFFFF)
                                                        {
                                                            break;
                                                        }

                                                        numCharCode = attr.ValueUInt16[0];
                                                    }
                                                    break;

                                                default:
                                                    continue;
                                            }
                                        }
                                        break;

                                    case PDL.Constants.PCLXLAttribute.TextData:
                                        {
                                            string strTextDataEachItem = string.Empty;

                                            if (currentFont == null)
                                            {
                                                continue;
                                            }

                                            switch (attr.ValueTag)
                                            {
                                                case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                                                    foreach (byte byteCharCode in attr.ValueByte)
                                                    {
                                                        var listCharCode = tableFontUnicode[currentFont];

                                                        if (byteCharCode >= listCharCode.Count)
                                                        {
                                                            throw new InvalidOperationException(string.Format("PCL-XL Data Parsing Error occured (OFFSET: {0})", attr.Offset));
                                                        }

                                                        strTextDataEachItem += Convert.ToChar(listCharCode[byteCharCode]);
                                                    }
                                                    break;

                                                case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                                                    foreach (ushort ushortCharCode in attr.ValueUInt16)
                                                    {
                                                        var listCharCode = tableFontUnicode[currentFont];

                                                        if (ushortCharCode >= listCharCode.Count)
                                                        {
                                                            throw new InvalidOperationException(string.Format("PCL-XL Data Parsing Error occured (OFFSET: {0})", attr.Offset));
                                                        }

                                                        strTextDataEachItem += Convert.ToChar(listCharCode[ushortCharCode]);
                                                    }
                                                    break;

                                                default:
                                                    throw new InvalidOperationException(string.Format("PCL-XL Data Parsing Error occured (OFFSET: {0})", attr.Offset));
                                            }

                                            listCurrentLineAttribute.Add(attr);

                                            if (string.IsNullOrEmpty(strTextDataEachItem) == true)
                                            {
                                                continue;
                                            }

                                            strCurrentLine += strTextDataEachItem;

                                            // for DEBUG
                                            attr.ValueTextData = strTextDataEachItem;                                        
                                        }
                                        break;

                                    default:
                                        continue;
                                }
                            }
                            break;

                        case PCLXLItem.PCLXLItemType.Operator:
                            {
                                if ((pair.Value is PCLXLOperatorItem) == false)
                                {
                                    continue;
                                }

                                PCLXLOperatorItem oper = pair.Value as PCLXLOperatorItem;

                                switch (oper.Operator)
                                {
                                    case PDL.Constants.PCLXLOperator.BeginChar:
                                        rangeFont.Start = oper.Offset;
                                        break;

                                    case PDL.Constants.PCLXLOperator.EndChar:
                                        rangeFont.End = oper.Offset;
                                        break;

                                    case PDL.Constants.PCLXLOperator.ReadChar:
                                        {
                                            if (currentFont == null)
                                            {
                                                continue;
                                            }

                                            ushort unicode = 0xFFFF;

                                            if (currentFont.TryGetUnicode(oper.GlyphID, out unicode) == false)
                                            {
                                                continue;
                                            }

                                            if (tableFontUnicode.ContainsKey(currentFont) == false)
                                            {
                                                tableFontUnicode.Add(currentFont, new List<ushort>());
                                            }

                                            tableFontUnicode[currentFont].Add(unicode);
                                        }
                                        break;

                                    case PDL.Constants.PCLXLOperator.EndPage:
                                        {
                                            page.OffsetInfo.EndPhysical = oper.Offset;

                                            page.HasPhysicalEnd = true;
                                        }
                                        break;

                                    default:
                                        break;
                                }

                            }
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

            if (page != null)
            {
                page.SortMasking();

                this.PageDictionary.Add(cntPage, page);
            }

            //////////////////////////////////////////////////////////////////////////////////

            this.CleanMaskingInfoByLimitCount();

            this.PrnInfo.TotalPages = cntPage;
            this.PrnInfo.ColorMode  = (hasColor == true) ? PrnInformation.ColorType.Color : PrnInformation.ColorType.Grayscale;
        }

        private MaskingInformation[] DetectSecurity (List<PCLXLAttributeItem> listLineAttribute, string strLine, int cntPage, CommonIF.FontInformation font, RangeData range, int numCharCode)
        {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (listLineAttribute == null)
            {
                throw new ArgumentNullException("List<PCLXLAttributeItem> listLineAttribute");
            }

            if (listLineAttribute.Count < 1)
            {
                return null;
            }

            if (string.IsNullOrWhiteSpace(strLine) == true)
            {
                return null;
            }

            if (cntPage < 1)
            {
                throw new ArgumentOutOfRangeException("int cntPage", cntPage, string.Format("Value is less than 1 ({0} < 1)", cntPage));
            }

            if (font == null)
            {
                throw new ArgumentNullException("CommonIF.FontInformation font");
            }

            if (range.Start < 0)
            {
                throw new ArgumentOutOfRangeException("(RangeData range).Start", range.Start, string.Format("value is less than 0 ({0} < 0)", range.Start));
            }

            if (range.End < 0)
            {
                throw new ArgumentOutOfRangeException("(RangeData range).End", range.End, string.Format("value is less than 0 ({0} < 0)", range.End));
            }

            if (numCharCode < 0)
            {
                throw new ArgumentOutOfRangeException("int numCharCode", numCharCode, string.Format("value is less than 0 ({0} < 0)", numCharCode));
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            List<MaskingTextData> listMaskingResult = null;

            // Keyword & Pattern 매칭 확인 후 결과값 반환
            listMaskingResult = this.DetectSecurity(listLineAttribute, strLine, cntPage);

            if (listMaskingResult == null || listMaskingResult.Count < 1)
            {
                return null;
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            SortedDictionary<long, MaskingInformation> dictionaryNewMasking = new SortedDictionary<long, MaskingInformation>();

            MaskingInformation masking = null;

            foreach (MaskingTextData text in listMaskingResult)
            {
                masking = null;

                if (text.Offset > range.Start)
                {
                    masking = new MaskingInformation(font, range, numCharCode);
                }
                else
                {
                    // find font object
                    for (int idx = this.PageBlankFontDictionary.Keys.Count - 1; idx >= 0; idx--)
                    {
                        var pair = this.PageBlankFontDictionary.ElementAt(idx);

                        if (pair.Key < text.Offset)
                        {
                            masking = pair.Value;
                            break;
                        }
                    }
                }

                ////////////////////////////////////////////////////////////////

                if (masking == null)
                {
                    continue;
                }

                if (dictionaryNewMasking.ContainsKey(masking.Font.RangeOffset.Start) == true)
                {
                    dictionaryNewMasking[masking.Font.RangeOffset.Start].MaskingDictionary.Add(text.Offset, text);
                }
                else
                {
                    masking.MaskingDictionary.Add(text.Offset, text);

                    dictionaryNewMasking.Add(masking.Font.RangeOffset.Start, masking);
                }
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (dictionaryNewMasking == null || dictionaryNewMasking.Count < 1)
            {
                return null;
            }

            return dictionaryNewMasking.Values.ToArray();
        }

        private List<MaskingTextData> DetectSecurity (List<PCLXLAttributeItem> listAttribute, string line, int page)
        {
            if (listAttribute == null)
            {
                throw new ArgumentNullException("List<PCLXLAttributeItem> listAttribute");
            }

            if (string.IsNullOrWhiteSpace(line) == true)
            {
                throw new ArgumentNullException("string line");
            }

            List<MaskingTextData> listMaskedAttribute = new List<MaskingTextData>();

            SortedDictionary<long, uint[]> listMaskingResult = null;

            foreach (PrnSecurityPolicy security in this.Policy.Securities)
            {
                // PAGE DETECTION SWITCHING
                switch (security.PageDetectionMode)
                {
                    case PrnSecurityPolicy.PageDetectionType.All:
                        break;

                    case PrnSecurityPolicy.PageDetectionType.First:
                        if (page > 1)
                        {
                            continue;
                        }
                        break;

                    case PrnSecurityPolicy.PageDetectionType.Odd:
                        if (page % 2 == 0)
                        {
                            continue;
                        }
                        break;

                    case PrnSecurityPolicy.PageDetectionType.Even:
                        if (page % 2 != 0)
                        {
                            continue;
                        }
                        break;

                    case PrnSecurityPolicy.PageDetectionType.Custom:
                        if (page < security.PageDetectionStart || page > security.PageDetectionEnd)
                        {
                            continue;
                        }
                        break;

                    default:
                        continue;
                }

                // KEYWORD / PATTERN SWITCHING
                switch (security.Type)
                {
                    case PrnSecurityPolicy.SecurityType.Keyword:
                        {
                            int idx = 0;

                            while (true)
                            {
                                idx = line.IndexOf(security.Value, idx);

                                if (idx < 0)
                                {
                                    break;
                                }

                                security.IncreseDetectionCount(page);

                                listMaskingResult = security.AddMatchResult(listAttribute, idx);

                                idx += security.Value.Length;

                                if (idx >= line.Length)
                                {
                                    break;
                                }
                            }
                        }
                        break;

                    case PrnSecurityPolicy.SecurityType.Pattern:
                        {
                            MatchCollection matches = Regex.Matches(line, security.Value);

                            foreach (Match match in matches)
                            {
                                security.IncreseDetectionCount(page);

                                listMaskingResult = security.AddMatchResult(listAttribute, match.Index, match.Length);
                            }
                        }
                        break;

                    default:
                        continue;
                }

                if (listMaskingResult == null)
                {
                    continue;
                }

                foreach (var pair in listMaskingResult)
                {
                    try
                    {
                        MaskingTextData masked = new MaskingTextData()
                        {
                            Offset = pair.Key,
                        };

                        masked.PolicyID = security.ID;

                        masked.MaskingIndexList.AddRange(pair.Value);

                        listMaskedAttribute.Add(masked);
                    }
                    catch
                    {
                        continue;
                    }
                }

                listMaskingResult = null;
            }

            return listMaskedAttribute;
        }

        public CommonIF.FontInformation GetFontInformation (string fontName, bool isWindowsXP = false)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (this.FontInfoDictionary.ContainsKey(fontName) == true)
            {
                return this.FontInfoDictionary[fontName];
            }

            CommonIF.FontInformation font = new CommonIF.FontInformation();

            if (font.GetAnalyzedFontData(fontName, isWindowsXP) == false)
            {
                return null;
            }

            this.FontInfoDictionary.Add(fontName, font);

            return font;
        }

        public CommonIF.FontInformation GetFontInformation (string fontName, string dataFileName)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (string.IsNullOrWhiteSpace(dataFileName) == true)
            {
                throw new ArgumentNullException("string dataFileName");
            }

            if (this.FontInfoDictionary.ContainsKey(fontName) == true)
            {
                return this.FontInfoDictionary[fontName];
            }

            CommonIF.FontInformation font = new CommonIF.FontInformation(fontName, false);

            if (font.GetAnalyzedFontDataByFileName(dataFileName) == false)
            {
                return null;
            }

            this.FontInfoDictionary.Add(fontName, font);

            return font;
        }

        private void CleanMaskingInfoByLimitCount ()
        {
            List<MaskingInformation> listRemovedMaskInfo   = new List<MaskingInformation>();
            List<long>               listRemovedMaskOffset = new List<long>();

            foreach (PrnSecurityPolicy security in this.Policy.Securities)
            {
                try
                {
                    int totalDetectionCnt = security.GetTotalDetectionCount();

                    if (totalDetectionCnt < 1 || totalDetectionCnt > security.LimitCount)
                    {
                        continue;
                    }

                    foreach (PageInformation pageInfo in this.PageDictionary.Values)
                    {
                        listRemovedMaskInfo.Clear();

                        foreach (MaskingInformation maskInfo in pageInfo.MaskingInfoList)
                        {
                            listRemovedMaskOffset.Clear();

                            foreach (var pairMaskData in maskInfo.MaskingDictionary)
                            {
                                if (pairMaskData.Value.VerifyPolicyID(security.ID) == false)
                                {
                                    continue;
                                }

                                listRemovedMaskOffset.Add(pairMaskData.Key);
                            }

                            foreach (long removedOffset in listRemovedMaskOffset)
                            {
                                maskInfo.MaskingDictionary.Remove(removedOffset);
                            }

                            if (maskInfo.MaskingDictionary.Count < 1)
                            {
                                listRemovedMaskInfo.Add(maskInfo);
                            }
                        }

                        foreach (MaskingInformation removedMaskInfo in listRemovedMaskInfo)
                        {
                            pageInfo.MaskingInfoList.Remove(removedMaskInfo);
                        }
                    }
                }
                catch
                {
                    continue;
                }
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods



        #region Static Methods

        public static PrnMetadata CreateMetadata (PrnExtractedData extracted)
        {
            return new PrnMetadata(extracted);
        }

        #endregion Static Methods
    }
}