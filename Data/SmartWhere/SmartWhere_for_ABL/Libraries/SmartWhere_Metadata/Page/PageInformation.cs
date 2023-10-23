namespace FXKIS.SmartWhere.Metadata
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.IO;

    using Common.Extension;

    using PDL;
    using MaskingConstants;



    public class PageInformation
    {
        #region Constants

        public const byte DefaultPaperCode = PDL.Constants.MediaSizeInfo.EA4PAPER;

        #endregion Constants



        #region Properties :: Collections

        public PageOffsetInformation    OffsetInfo      { get; private set; }
        public List<MaskingInformation> MaskingInfoList { get; private set; }

        #endregion Properties :: Collections



        #region Properties

        public uint PageNumber       { get; set; }
        public byte PaperCode        { get; set; }
        public bool IsBlackWhite     { get; set; }
        public bool HasPhysicalStart { get; set; }
        public bool HasPhysicalEnd   { get; set; }
        public byte RopValue         { get; set; }
        public byte ColorSpaceValue  { get; set; }

        private PrnPageInfo.ResolutionType Resolution { get; set; }

        #endregion Properties



        #region Constructors

        public PageInformation ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public PageInformation (uint page) : this()
        {
            if (page < 1)
            {
                throw new ArgumentOutOfRangeException("uint page", page, string.Format("Page Number is less than 1 ({0} < 1)", page));
            }

            this.PageNumber = page;
        }

        public PageInformation (int page) : this()
        {
            if (page < 1)
            {
                throw new ArgumentOutOfRangeException("int page", page, string.Format("Page Number is less than 1 ({0} < 1)", page));
            }

            this.PageNumber = (uint)page;
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.PageNumber       = 0;
            this.PaperCode        = PageInformation.DefaultPaperCode;
            this.IsBlackWhite     = false;
            this.HasPhysicalStart = false;
            this.HasPhysicalEnd   = false;
            this.RopValue = 0;
            this.ColorSpaceValue = 0;
        }

        private void InitializeCollections ()
        {
            this.OffsetInfo      = new PageOffsetInformation();
            this.MaskingInfoList = new List<MaskingInformation>();
        }

        #endregion Methods :: Initialize



        #region Methods :: Masking

        public bool ContainsFont (string fontName)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (this.MaskingInfoList == null || this.MaskingInfoList.Count < 1)
            {
                return false;
            }

            fontName = fontName.Trim();

            foreach (MaskingInformation masking in this.MaskingInfoList)
            {
                if (masking.Font == null || string.IsNullOrWhiteSpace(masking.Font.Name) == true)
                {
                    continue;
                }

                if (string.Compare(fontName, masking.Font.Name.Trim(), true) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        public void AddMaskingInformation (MaskingInformation masking, CommonIF.FontInformation currentFont, RangeData range, int numCharCode)
        {
            MaskingInformation existsMasking = null;

            Dictionary<long, MaskingTextData> dictionaryOutranged = new Dictionary<long, MaskingTextData>();

            if (masking != null)
            {
                existsMasking = this.GetMaskingInformation(masking.Font);

                if (existsMasking == null)
                {
                    foreach (long offset in dictionaryOutranged.Keys)
                    {
                        masking.MaskingDictionary.Remove(offset);
                    }

                    this.MaskingInfoList.Add(masking);
                }
                else
                {
                    foreach (var pairMasking in masking.MaskingDictionary)
                    {
                        try
                        {
                            long            offset      = pairMasking.Key;
                            MaskingTextData maskingData = pairMasking.Value;

                            if (existsMasking.MaskingDictionary.ContainsKey(offset) == true)
                            {
                                continue;
                            }

                            existsMasking.MaskingDictionary.Add(offset, maskingData);
                        }
                        catch
                        {
                            continue;
                        }
                    }
                }
            }

            /////////////////////////////////////////////////////////////////////////

            if (this.ContainsFont(currentFont.InputName) == false)
            {
                return;
            }

            existsMasking = this.GetMaskingInformation(currentFont.InputName, range);

            if (existsMasking != null)
            {
                return;
            }

            masking = new MaskingInformation(currentFont, range, numCharCode);

            this.MaskingInfoList.Add(masking);
        }

        private MaskingInformation GetMaskingByNearOffset (long offset, string name)
        {
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException("long offset", offset, string.Format("value is less than 0 ({0} < 0)", offset));
            }

            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            try
            {
                for (int i = this.MaskingInfoList.Count - 1; i >= 0; i--)
                {
                    try
                    {
                        MaskingInformation info = this.MaskingInfoList[i];

                        if (info.Font.RangeOffset.Start > offset)
                        {
                            continue;
                        }

                        if (info.Font.Name == name)
                        {
                            return info;
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            catch { }

            return null;
        }

        private MaskingInformation GetMaskingInformation (FontInformation font)
        {
            if (font == null)
            {
                throw new ArgumentNullException("FontInformation font");
            }

            if (this.MaskingInfoList == null || this.MaskingInfoList.Count < 1)
            {
                return null;
            }

            string    name  = font.Name.Trim();
            RangeData range = font.RangeOffset;

            return this.GetMaskingInformation(name, range);
        }

        private MaskingInformation GetMaskingInformation (string name, RangeData range)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            name = name.Trim();

            foreach (MaskingInformation masking in this.MaskingInfoList)
            {
                try
                {
                    if (string.Compare(name, masking.Font.Name.Trim(), true) != 0)
                    {
                        continue;
                    }

                    if (range.Start != masking.Font.RangeOffset.Start)
                    {
                        continue;
                    }

                    if (range.End != masking.Font.RangeOffset.End)
                    {
                        continue;
                    }

                    return masking;
                }
                catch
                {
                    continue;
                }
            }

            return null;
        }

        public MaskingTextData GetMaskingTextData (string fontName, long offset)
        {
            if (string.IsNullOrWhiteSpace(fontName) == true)
            {
                throw new ArgumentNullException("string fontName");
            }

            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException("long offset", offset, string.Format("value is less than 0 ({0} < 0)", offset));
            }

            foreach (MaskingInformation info in this.MaskingInfoList)
            {
                if (info.Font.Name != fontName)
                {
                    continue;
                }

                if (info.MaskingDictionary.Count < 1)
                {
                    continue;
                }

                if (info.MaskingDictionary.ContainsKey(offset) == false)
                {
                    continue;
                }

                return info.MaskingDictionary[offset];
            }

            return null;
        }

        public void SortMaskingTextData ()
        {
            SortedDictionary<long, MaskingTextSortingData> dictionarySortedData = new SortedDictionary<long, MaskingTextSortingData>();

            List<long> listSortedOffset = new List<long>();

            ///////////////////////////////////////////////////////////////////////////////

            foreach (MaskingInformation info in MaskingInfoList)
            {
                long offsetStart = this.OffsetInfo.StartLogical;

                listSortedOffset.Clear();

                foreach (var pairMaskedData in info.MaskingDictionary)
                {
                    if (pairMaskedData.Key < offsetStart)
                    {
                        listSortedOffset.Add(pairMaskedData.Key);
                    }
                }

                foreach (long offsetSorted in listSortedOffset)
                {
                    MaskingTextSortingData data = new MaskingTextSortingData()
                    {
                        Offset   = offsetSorted,
                        FontName = info.Font.Name,
                        Data     = info.MaskingDictionary[offsetSorted]
                    };

                    dictionarySortedData.Add(offsetSorted, data);

                    info.MaskingDictionary.Remove(offsetSorted);
                }
            }

            ///////////////////////////////////////////////////////////////////////////////

            foreach (var pairSorted in dictionarySortedData)
            {
                long                   offsetSorted = pairSorted.Key;
                MaskingTextSortingData sortingData  = pairSorted.Value;

                for (int i = this.MaskingInfoList.Count - 1; i >= 0; i--)
                {
                    if (string.Compare(this.MaskingInfoList[i].Font.Name.Trim(), sortingData.FontName.Trim(), true) != 0)
                    {
                        continue;
                    }

                    long offsetStart = this.MaskingInfoList[i].Font.RangeOffset.Start;

                    if (pairSorted.Key > offsetStart)
                    {
                        this.MaskingInfoList[i].MaskingDictionary.Add(offsetSorted, sortingData.Data);
                        break;
                    }
                }
            }
        }

        #endregion Methods :: Masking



        #region Methods :: Getter - Size

        public int GetPaperSpace ()
        {
            try
            {
                if (this.Resolution == PrnPageInfo.ResolutionType.None)
                {
                    return -1;
                }

                return PrnPageInfo.GetPaperSpace(this.Resolution);
            }
            catch
            {
                return -1;
            }
        }

        public int GetPageSpace ()
        {
            try
            {
                if (this.Resolution == PrnPageInfo.ResolutionType.None)
                {
                    return -1;
                }

                return PrnPageInfo.GetPageSpace(this.Resolution);
            }
            catch
            {
                return -1;
            }
        }

        public Point GetPixelPerMM ()
        {
            try
            {
                if (this.Resolution == PrnPageInfo.ResolutionType.None)
                {
                    return new Point(-1, -1);
                }

                return PrnPageInfo.GetPixelPerMM(this.Resolution);
            }
            catch
            {
                return new Point(-1, -1);
            }
        }

        public Size GetPaperSize ()
        {
            try
            {
                int paperSpace = this.GetPaperSpace();

                if (paperSpace < 0)
                {
                    throw new InvalidDataException("Atttribute's Value is wrong");
                }

                int index = PDL.Constants.MediaSizeInfo.MEDIA_SIZE_ARRAY;

                switch (this.Resolution)
                {
                    case PrnPageInfo.ResolutionType.DPI200:
                        index *= 0;
                        break;

                    case PrnPageInfo.ResolutionType.DPI300:
                        index *= 1;
                        break;

                    case PrnPageInfo.ResolutionType.DPI600:
                        index *= 2;
                        break;

                    case PrnPageInfo.ResolutionType.DPI1200:
                        index *= 3;
                        break;

                    default:
                        throw new InvalidDataException("Atttribute's Value is wrong");
                }

                for (int i = 0; i < PDL.Constants.MediaSizeInfo.MEDIA_SIZE.Length; i++)
                {
                    if (this.PaperCode == PDL.Constants.MediaSizeInfo.MEDIA_SIZE[i])
                    {
                        return new Size(PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 0] + paperSpace,
                                        PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 1] + paperSpace);
                    }

                    if (i == PDL.Constants.MediaSizeInfo.MEDIA_SIZE.Length - 1)
                    {
                        return new Size(PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[PDL.Constants.MediaSizeInfo.EA4PAPER + index, 0] + paperSpace,
                                        PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[PDL.Constants.MediaSizeInfo.EA4PAPER + index, 1] + paperSpace);
                    }
                }
            }
            catch { }

            return Size.Empty;
        }

        public static Size GetPaperSize (PrnPageInfo.ResolutionType resolution, int paperCode = PDL.Constants.MediaSizeInfo.EA4PAPER)
        {
            if (paperCode < 0)
            {
                throw new ArgumentOutOfRangeException("int paperCode", paperCode, string.Format("Paper Code is less than 0 ({0} < 0)", paperCode));
            }

            try
            {
                int paperSpace = PrnPageInfo.GetPaperSpace(resolution);

                if (paperSpace < 0)
                {
                    throw new InvalidDataException("Atttribute's Value is wrong");
                }

                int index = PDL.Constants.MediaSizeInfo.MEDIA_SIZE_ARRAY;

                switch (resolution)
                {
                    case PrnPageInfo.ResolutionType.DPI200:
                        index *= 0;
                        break;

                    case PrnPageInfo.ResolutionType.DPI300:
                        index *= 1;
                        break;

                    case PrnPageInfo.ResolutionType.DPI600:
                        index *= 2;
                        break;

                    case PrnPageInfo.ResolutionType.DPI1200:
                        index *= 3;
                        break;

                    default:
                        throw new InvalidDataException("Atttribute's Value is wrong");
                }

                for (int i = 0; i < PDL.Constants.MediaSizeInfo.MEDIA_SIZE.Length; i++)
                {
                    if (paperCode == PDL.Constants.MediaSizeInfo.MEDIA_SIZE[i])
                    {
                        return new Size(PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 0] + paperSpace,
                                        PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[i + index, 1] + paperSpace);
                    }

                    if (i == PDL.Constants.MediaSizeInfo.MEDIA_SIZE.Length - 1)
                    {
                        return new Size(PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[PDL.Constants.MediaSizeInfo.EA4PAPER + index, 0] + paperSpace,
                                        PDL.Constants.MediaSizeInfo.MEDIA_SIZE_INFO[PDL.Constants.MediaSizeInfo.EA4PAPER + index, 1] + paperSpace);
                    }
                }
            }
            catch { }

            return Size.Empty;
        }

        public Point GetPageOrigin (int nup, PrnInformation.OrientationType orientation)
        {
            if (nup < 1)
            {
                throw new ArgumentOutOfRangeException("int nup", nup, string.Format("Value is less than 1 ({0} < 1)", nup));
            }

            int lenRow = 0;
            int lenCol = 0;

            int cntRow = 0;
            int cntCol = 0;

            Point point = new Point(0, 0);

            PDL.Constants.PageInfo.NUpType nupType = PDL.Constants.PageInfo.CalculateNup(nup);

            /////////////////////////////////////////////////////////////////////////////

            int pageSpace  = this.GetPageSpace();
            int paperSpace = this.GetPaperSpace();

            if (pageSpace < 0)
            {
                throw new InvalidDataException("Value of Page Space is invalid");
            }

            if (paperSpace < 0)
            {
                throw new InvalidDataException("Value of Paper Space is invalid");
            }

            Size paperSize = this.GetPaperSize();

            if (paperSize.IsEmpty == true)
            {
                throw new InvalidDataException("Value of Page Size is invalid");
            }

            /////////////////////////////////////////////////////////////////////////////

            switch (nupType)
            {
                case PDL.Constants.PageInfo.NUpType.Single: // 1up, 4up, 16up, ~
                    {
                        lenCol = (int)Math.Sqrt((double)nup);
                        lenRow = nup / lenCol;

                        cntCol = (int)((this.PageNumber - 1) % nup) % lenCol;
                        cntRow = (int)((this.PageNumber - 1) % nup) / lenCol;
                    }
                    break;

                case PDL.Constants.PageInfo.NUpType.Double: // 2up, 8up, 32up, ~
                    {
                        lenCol = (int)Math.Sqrt((double)nup / 2);
                        lenRow = nup / lenCol;

                        if (orientation == PrnInformation.OrientationType.Portrait)
                        {
                            int temp = lenCol;
                            lenCol = lenRow;
                            lenRow = temp;
                        }

                        cntCol = (int)((this.PageNumber - 1) % nup) % lenCol;
                        cntRow = (int)((this.PageNumber - 1) % nup) / lenCol;
                    }
                    break;

                default:
                    throw new InvalidDataException("N-up value is invalid");
            }

            /////////////////////////////////////////////////////////////////////////////

            Size paperSizeWithoutMargin = new Size(paperSize.Width - pageSpace * 2, paperSize.Height - pageSpace * 2);

            if (nupType == PDL.Constants.PageInfo.NUpType.Single)
            {
                if (orientation != PrnInformation.OrientationType.Landscape)
                {
                    point.X = (paperSizeWithoutMargin.Width  / lenCol) * cntCol + pageSpace;
                    point.Y = (paperSizeWithoutMargin.Height / lenRow) * cntRow + pageSpace;
                }
                else
                {
                    point.Y = paperSizeWithoutMargin.Height - ((paperSizeWithoutMargin.Height / lenCol) * cntCol) + pageSpace;
                    point.X = (paperSizeWithoutMargin.Width / lenRow) * cntRow + pageSpace;
                }
            }
            else
            {
                if (orientation != PrnInformation.OrientationType.Landscape)
                {
                    point.X = (paperSizeWithoutMargin.Height / lenCol) * cntCol + pageSpace;
                    point.Y = (paperSizeWithoutMargin.Width  / lenRow) * cntRow + pageSpace;
                }
                else
                {
                    point.Y = paperSizeWithoutMargin.Width - ((paperSizeWithoutMargin.Width / lenCol) * cntCol) + pageSpace;
                    point.X = (paperSizeWithoutMargin.Height / lenRow) * cntRow + pageSpace;
                }
            }

            /////////////////////////////////////////////////////////////////////////////

            return point;
        }

        public static bool IsAbstractedPageStartByNup (int totalPages, int currentPage, int nup)
        {
            if (totalPages < 1)
            {
                throw new ArgumentOutOfRangeException("int totalPages", totalPages, string.Format("Total Pages' value is less than 1 ({0} < 1)", totalPages));
            }

            if (totalPages == 1)
            {
                return false;
            }

            if (totalPages < currentPage)
            {
                throw new ArgumentOutOfRangeException("int totalPages", totalPages, string.Format("Total Pages' value is less than Current Page Number ({0} < {1})", totalPages, currentPage));
            }

            if (nup < 1)
            {
                throw new ArgumentOutOfRangeException("int nup", nup, string.Format("N-up value is less than 1 ({0} < 1)", nup));
            }

            if (nup == 1 || currentPage == 1)
            {
                return false;
            }

            return (currentPage % nup != 1);
        }

        public static bool IsAbstractedPageEndByNup (int totalPages, int currentPage, int nup)
        {
            if (totalPages < 1)
            {
                throw new ArgumentOutOfRangeException("int totalPages", totalPages, string.Format("Total Pages' value is less than 1 ({0} < 1)", totalPages));
            }

            if (totalPages == 1)
            {
                return false;
            }

            if (totalPages < currentPage)
            {
                throw new ArgumentOutOfRangeException("int totalPages", totalPages, string.Format("Total Pages' value is less than Current Page Number ({0} < {1})", totalPages, currentPage));
            }

            if (nup < 1)
            {
                throw new ArgumentOutOfRangeException("int nup", nup, string.Format("N-up value is less than 1 ({0} < 1)", nup));
            }

            if (nup == 1 || totalPages == currentPage)
            {
                return false;
            }

            return (currentPage % nup != 0);
        }

        #endregion Methods :: Getter - Size



        #region Methods

        public void SetResolution (ushort value)
        {
            this.Resolution = PrnPageInfo.GetResolutionType(value);
        }

        public bool IsExistsSameFontMasking (string font)
        {
            if (string.IsNullOrWhiteSpace(font) == true)
            {
                throw new ArgumentNullException("string font");
            }
            
            if (this.MaskingInfoList == null || this.MaskingInfoList.Count < 1)
            {
                return false;
            }

            foreach (MaskingInformation masking in this.MaskingInfoList)
            {
                try
                {
                    string fontMasking = masking.Font.Name.Trim();

                    if (string.Compare(font, fontMasking, true) == 0)
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return false;
        }

        public void SortMasking ()
        {
            if (this.MaskingInfoList == null || this.MaskingInfoList.Count < 1)
            {
                return;
            }

            this.MaskingInfoList.Sort(delegate (MaskingInformation x, MaskingInformation y)
            {
                if (x.Font == null && y.Font == null)
                {
                    return 0;
                }
                else if (x.Font == null)
                {
                    return -1;
                }
                else if (y.Font == null)
                {
                    return 1;
                }
                else
                {
                    if (x.Font.RangeOffset.Start < y.Font.RangeOffset.Start)
                    {
                        return -1;
                    }
                    else if (x.Font.RangeOffset.Start == y.Font.RangeOffset.Start)
                    {
                        return 0;
                    }
                    else
                    {
                        return 1;
                    }
                }
            });

            Dictionary<string, int> dictionaryLastCharAttr = new Dictionary<string, int>();

            foreach (MaskingInformation info in this.MaskingInfoList)
            {
                if (info.Font == null)
                {
                    continue;
                }

                if (info.Font.CharAttributeCount >= 0)
                {
                    dictionaryLastCharAttr[info.Font.Name] = info.Font.CharAttributeCount;
                }
                else
                {
                    info.Font.CharAttributeCount = dictionaryLastCharAttr[info.Font.Name];
                }
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}