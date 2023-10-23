namespace FXKIS.PDL.Process
{
    using System;
    using System.Collections.Generic;



    public class MaskingFontData
    {
        #region Properties

        public long                                Offset           { get; set; } // EndChar :: for insert asterisk
        public long                                AsteriskCharCode { get; set; }
        public SmartWhere.CommonIF.FontInformation Font             { get; set; }
        public HashSet<int>                        PageSet          { get; private set; }

        #endregion Properties



        #region Constructors

        public MaskingFontData ()
        {
            this.InitializeProperties();

            this.InitializeCollections();
        }

        public MaskingFontData (SmartWhere.Metadata.FontInformation fontMetadata, SmartWhere.CommonIF.FontInformation fontInfo) : this()
        {
            if (fontMetadata == null)
            {
                throw new ArgumentNullException("SmartWhere.Metadata.FontInformation fontMetadata");
            }

            if (fontInfo == null)
            {
                throw new ArgumentNullException("SmartWhere.CommonIF.FontInformation fontInfo");
            }

            this.Offset           = fontMetadata.RangeOffset.End;
            this.AsteriskCharCode = fontMetadata.CharAttributeCount;
            this.Font             = fontInfo;
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.Offset           = -1;
            this.AsteriskCharCode = -1;
            this.Font             = null;
        }

        private void InitializeCollections ()
        {
            this.PageSet = new HashSet<int>();
        }

        #endregion Methods :: Initialize
    }
}