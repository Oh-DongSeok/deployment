namespace FXKIS.SmartWhere.Metadata
{
    using System;

    using Common.Extension;

    using MaskingConstants;



    public class FontInformation
    {
        #region Properties

        public string Name         { get; set; }
        public string DataFileName { get; set; }

        public RangeData RangeOffset
        {
            get
            {
                return new RangeData
                {
                    Start = this._OffsetStartCharacter,
                    End   = this._OffsetEndCharacter
                };
            }
            set
            {
                this._OffsetStartCharacter = value.Start;
                this._OffsetEndCharacter   = value.End;
            }
        }
        private long _OffsetStartCharacter = -1;
        private long _OffsetEndCharacter   = -1;

        public int    CharAttributeCount { get; set; }

        #endregion Properties



        #region Constructors

        public FontInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Name               = string.Empty;
            this.DataFileName       = string.Empty;
            this.CharAttributeCount = 0;
            this.RangeOffset        = new RangeData { Start = -1, End = -1 };
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}