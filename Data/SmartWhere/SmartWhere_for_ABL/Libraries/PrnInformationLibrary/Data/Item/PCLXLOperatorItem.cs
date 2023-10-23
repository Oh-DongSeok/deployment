namespace FXKIS.PDL
{
    using System;



    public class PCLXLOperatorItem : PCLXLItem
    {
        #region Enumerations
        
        public enum EmbeddedDataTagType
        {
            None           = 0x00,
            DataLength     = 0xFA,
            DataLengthByte = 0xFB
        }

        #endregion Enumerations



        #region Properties

        public byte Operator { get; set; }

        public string OperatorName
        {
            get
            {
                string format = @"{0}(0x{1})";

                if (!Constants.PCLXLOperator.OperatorTable.ContainsKey(this.Operator))
                {
                    return string.Format(format, Constants.PCLXLOperator.NotSupportedOperatorName, this.Operator.ToString("X2"));
                }

                return string.Format(format, Constants.PCLXLOperator.OperatorTable[this.Operator], this.Operator.ToString("X2"));
            }
        }

        public byte[] Data { get; set; }

        public ushort GlyphID { get; set; }

        public EmbeddedDataTagType EmbeddedDataTag { get; set; }

        public override string TypeRepresentation
        {
            get 
            {
                return this.OperatorName;
            }
        }

        public override string TagRepresentation
        {
            get 
            {
                if (this.EmbeddedDataTag == EmbeddedDataTagType.None)
                {
                    return string.Empty;
                }

                return this.EmbeddedDataTag.ToString();
            }
        }

        public override string Representation 
        { 
            get
            {
                // Data is not exists
                if (this.EmbeddedDataTag == EmbeddedDataTagType.None)
                {
                    return string.Empty;
                }

                if (Constants.PCLXLOperator.DataSkipOperatorTable.Contains(this.Operator))
                {
                    return string.Format(@"[Data: {0}cnt] {1}", this.Data.Length, Constants.PCLXLOperator.StrDataSkipOperator);
                }

                // Data is exists 
                return string.Format(@"[Data: {0}cnt] {1}", this.Data.Length, BitConverter.ToString(this.Data));
            }
        }

        #endregion Properties



        #region Constructors

        public PCLXLOperatorItem () : base(PCLXLItemType.Operator)
        {
            this.Operator = (byte)0;

            this.Data = null;

            this.EmbeddedDataTag = EmbeddedDataTagType.None;

            this.GlyphID = ushort.MaxValue;

            this.Offset = -1;
        }

        #endregion Constructors



        #region Methods

        public override byte[] ToBinary ()
        {
            // [Count of Bytes]
            // Operator = 1
            // EmbeddedDataTag = 0 / 1
            // DataLength = 4 / 1 (0xFA : 4, 0xFB : 1)
            // Data = 1~n
            
            byte[] arrValue = new byte[] { this.Operator };

            if (this.EmbeddedDataTag != EmbeddedDataTagType.None)
            {
                byte[] arrEmbed = new byte[] { (byte)this.EmbeddedDataTag };

                if (this.EmbeddedDataTag == EmbeddedDataTagType.DataLength)
                {
                    arrEmbed = BufferProcessing.AttachBufferArray(BitConverter.GetBytes((uint)this.Data.Length), arrEmbed);
                }
                else
                {
                    arrEmbed = BufferProcessing.AttachBufferArray(new byte[] { (byte)this.Data.Length }, arrEmbed);
                }

                arrValue = BufferProcessing.AttachBufferArray(arrEmbed, arrValue);

                arrValue = BufferProcessing.AttachBufferArray(this.Data, arrValue);
            }

            return arrValue;
        }

        public static EmbeddedDataTagType CheckPCLXLEmbeddedDataTag (byte tag)
        {
            switch (tag)
            {
                case Constants.PCLXLEmbeddedDataTag.DataLength:
                    return EmbeddedDataTagType.DataLength;

                case Constants.PCLXLEmbeddedDataTag.DataLengthByte:
                    return EmbeddedDataTagType.DataLengthByte;

                default:
                    return EmbeddedDataTagType.None;
            }
        }

        /**********************************************************************************************//**
         * <summary> Extracts the glyph identifier.</summary>
         *
         * <remarks> sangmin.cho@kor.fujixerox.com, 2015-12-02.</remarks>
         **************************************************************************************************/
        public bool ExtractGlyphID ()
        {
            if (this.Operator != PDL.Constants.PCLXLOperator.ReadChar)
            {
                return false;
            }

            // TODO: 상수 지정 필요
            if (this.Data == null || this.Data.Length < 6)
            {
                return false;
            }

            byte charCodeFormat = 0xFF;
            byte charCodeClass  = 0xFF;

            int idxGlyphID = -1;

            charCodeFormat = this.Data[0];
            charCodeClass  = this.Data[1];

            if (charCodeFormat != 1)
            {
                return false;
            }
            else
            {
                switch (charCodeClass)
                {
                    case 0:
                        idxGlyphID = 4;
                        break;

                    case 1:
                        {
                            if (this.Data.Length < 10)
                            {
                                return false;
                            }

                            idxGlyphID = 8;
                        }
                        break;

                    case 2:
                        {
                            if (this.Data.Length < 12)
                            {
                                return false;
                            }

                            idxGlyphID = 10;
                        }
                        break;

                    default:
                        return false;
                }

                // Big-Endian
                byte[] arrGlyphID = 
                { 
                    this.Data[idxGlyphID + 1], 
                    this.Data[idxGlyphID] 
                };

                this.GlyphID = BitConverter.ToUInt16(arrGlyphID, 0);
            }

            return true;
        }

        #endregion Methods



        #region Methods :: To String

        public override string ToString ()
        {
            if (this.EmbeddedDataTag == EmbeddedDataTagType.None)
            {
                return string.Format("{0} [ OPERATOR] {1}, {2}", this.OffsetHex, this.TypeRepresentation, this.Representation);
            }

            return string.Format("{0} [ OPERATOR] {1}, {2}, {3}", this.OffsetHex, this.TypeRepresentation, this.TagRepresentation, this.Representation);
        }

        #endregion Methods :: To String
    }
}
