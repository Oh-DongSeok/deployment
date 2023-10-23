namespace FXKIS.SmartWhere.Metadata
{
    using System;
    using System.Collections.Generic;

    using Common.Extension;

    using MaskingConstants;



    public class MaskingInformation
    {
        #region Properties

        public FontInformation                         Font              { get; private set; }
        public SortedDictionary<long, MaskingTextData> MaskingDictionary { get; private set; }

        #endregion Properties



        #region Constructors

        public MaskingInformation ()
        {
            this.InitializeProperties();
        }

        public MaskingInformation (CommonIF.FontInformation font, RangeData range, int numCharCode) : this()
        {
            if (font == null)
            {
                throw new ArgumentNullException("CommonIF.FontInformation font");
            }

            this.SetFontInformation(font, range, numCharCode);
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Font              = new FontInformation();
            this.MaskingDictionary = new SortedDictionary<long, MaskingTextData>();
        }

        public void SetFontInformation (FontInformation font)
        {
            if (font == null)
            {
                throw new ArgumentNullException("FontInformation font");
            }

            this.Font = font;
        }

        public void SetFontInformation (CommonIF.FontInformation font, RangeData range, int numCharCode)
        {
            if (font == null)
            {
                throw new ArgumentNullException("CommonIF.FontInformation font");
            }

            this.Font = new FontInformation()
            {
                Name               = font.InputName,
                DataFileName       = font.DataFileName,
                RangeOffset        = range,
                CharAttributeCount = (numCharCode + 1)
            };

            if (numCharCode < 0)
            {
                this.Font.CharAttributeCount = -1;
            }
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}