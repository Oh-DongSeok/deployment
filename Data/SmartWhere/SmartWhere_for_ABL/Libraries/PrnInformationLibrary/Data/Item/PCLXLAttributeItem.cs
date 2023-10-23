namespace FXKIS.PDL
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Drawing;
    using System.IO;
    using System.Linq;
    using System.Text;



    public class PCLXLAttributeItem : PCLXLItem
    {
        #region Constants

        private const string FormatHex2Digits = "X2";

        #endregion Constants



        #region Enumerations

        public enum AttributeValueTagType
        {
            None         = 0x00,
            SingleUByte  = 0xC0,
            SingleUInt16 = 0xC1,
            SingleUInt32 = 0xC2,
            SingleSInt16 = 0xC3,
            SingleSInt32 = 0xC4,
            SingleReal32 = 0xC5,
            XYUByte      = 0xD0,
            XYUInt16     = 0xD1,
            XYUInt32     = 0xD2,
            XYSInt16     = 0xD3,
            XYSInt32     = 0xD4,
            XYReal32     = 0xD5,
            BoxUByte     = 0xE0,
            BoxUInt16    = 0xE1,
            BoxUInt32    = 0xE2,
            BoxSInt16    = 0xE3,
            BoxSInt32    = 0xE4,
            BoxReal32    = 0xE5,
            ArrayUByte   = 0xC8,
            ArrayUInt16  = 0xC9,
            ArrayUInt32  = 0xCA,
            ArraySInt16  = 0xCB,
            ArraySInt32  = 0xCC,
            ArrayReal32  = 0xCD
        }

        public enum AttributeValueTagSizeType
        {
            None,
            Single,
            XY,
            Box,
            Array
        }

        public enum AttributeValueTagDataType
        {
            None,
            UByte,
            UInt16,
            UInt32,
            SInt16,
            SInt32,
            Real32
        }

        public enum AttributeTagType
        {
            None   = 0x00,
            UByte  = 0xF8,
            UInt16 = 0xF9
        }

        public enum OrientaionType
        {
            None      = 0xFF,
            Portrait  = 0x00,
            Landscape = 0x01
        }

        #endregion Enumerations



        #region Properties

        public AttributeValueTagType ValueTag { get; set; }
        public AttributeValueTagSizeType ValueTagSizeType
        {
            get
            {
                switch (this.ValueTag)
                {
                    case AttributeValueTagType.SingleUByte:
                    case AttributeValueTagType.SingleUInt16:
                    case AttributeValueTagType.SingleUInt32:
                    case AttributeValueTagType.SingleSInt16:
                    case AttributeValueTagType.SingleSInt32:
                    case AttributeValueTagType.SingleReal32:
                        return AttributeValueTagSizeType.Single;

                    case AttributeValueTagType.XYUByte:
                    case AttributeValueTagType.XYUInt16:
                    case AttributeValueTagType.XYUInt32:
                    case AttributeValueTagType.XYSInt16:
                    case AttributeValueTagType.XYSInt32:
                    case AttributeValueTagType.XYReal32:
                        return AttributeValueTagSizeType.XY;

                    case AttributeValueTagType.BoxUByte:
                    case AttributeValueTagType.BoxUInt16:
                    case AttributeValueTagType.BoxUInt32:
                    case AttributeValueTagType.BoxSInt16:
                    case AttributeValueTagType.BoxSInt32:
                    case AttributeValueTagType.BoxReal32:
                        return AttributeValueTagSizeType.Box;

                    case AttributeValueTagType.ArrayUByte:
                    case AttributeValueTagType.ArrayUInt16:
                    case AttributeValueTagType.ArrayUInt32:
                    case AttributeValueTagType.ArraySInt16:
                    case AttributeValueTagType.ArraySInt32:
                    case AttributeValueTagType.ArrayReal32:
                        return AttributeValueTagSizeType.Array;

                    case AttributeValueTagType.None:
                    default:
                        return AttributeValueTagSizeType.None;
                }
            }
        }

        public AttributeValueTagDataType ValueTagDataType
        {
            get
            {
                switch (this.ValueTag)
                {
                    case AttributeValueTagType.SingleUByte:
                    case AttributeValueTagType.XYUByte:
                    case AttributeValueTagType.BoxUByte:
                    case AttributeValueTagType.ArrayUByte:
                        return AttributeValueTagDataType.UByte;
                        
                    case AttributeValueTagType.SingleUInt16:
                    case AttributeValueTagType.XYUInt16:
                    case AttributeValueTagType.BoxUInt16:
                    case AttributeValueTagType.ArrayUInt16:
                        return AttributeValueTagDataType.UInt16;
                        
                    case AttributeValueTagType.SingleUInt32:
                    case AttributeValueTagType.XYUInt32:
                    case AttributeValueTagType.BoxUInt32:
                    case AttributeValueTagType.ArrayUInt32:
                        return AttributeValueTagDataType.UInt32;
                        
                    case AttributeValueTagType.SingleSInt16:
                    case AttributeValueTagType.XYSInt16:
                    case AttributeValueTagType.BoxSInt16:
                    case AttributeValueTagType.ArraySInt16:
                        return AttributeValueTagDataType.SInt16;
                        
                    case AttributeValueTagType.SingleSInt32:
                    case AttributeValueTagType.XYSInt32:
                    case AttributeValueTagType.BoxSInt32:
                    case AttributeValueTagType.ArraySInt32:
                        return AttributeValueTagDataType.SInt32;
                        
                    case AttributeValueTagType.SingleReal32:
                    case AttributeValueTagType.XYReal32:
                    case AttributeValueTagType.BoxReal32:
                    case AttributeValueTagType.ArrayReal32:
                        return AttributeValueTagDataType.Real32;

                    case AttributeValueTagType.None:
                    default:
                        return AttributeValueTagDataType.None;
                }
            }
        }

        public AttributeValueTagType ArrayLengthTag { get; set; }

        public byte[]   ValueByte     { get; set; }
        public ushort[] ValueUInt16   { get; set; }
        public uint[]   ValueUInt32   { get; set; }
        public short[]  ValueSInt16   { get; set; }
        public int[]    ValueSInt32   { get; set; }
        public float[]  ValueReal32   { get; set; }
        public string   ValueTextData { get; set; }

        public AttributeTagType Tag { get; set; }

        // TODO: 속도 개선 관련
        public byte[] ValueOriginal { get; set; }
        
        public byte Attribute { get; set; }
        public string AttributeName
        {
            get
            {
                string format = @"{0}(0x{1})";

                if (!Constants.PCLXLAttribute.AttributeTable.ContainsKey(this.Attribute))
                {
                    return string.Format(format, Constants.PCLXLAttribute.NotSupportedAttributeName, this.Attribute.ToString(PCLXLAttributeItem.FormatHex2Digits));
                }

                return string.Format(format, Constants.PCLXLAttribute.AttributeTable[this.Attribute], this.Attribute.ToString(PCLXLAttributeItem.FormatHex2Digits));
            }
        }

        public override string TypeRepresentation
        {
            get 
            {
                return this.AttributeName;    
            }
        }

        public override string TagRepresentation
        {
            get
            {
                string strLength = string.Empty;

                if (this.ValueTagSizeType == AttributeValueTagSizeType.Array)
                {
                    IEnumerator en = null;

                    switch (this.ValueTagDataType)
                    {
                        case AttributeValueTagDataType.UByte:
                            en = this.ValueByte.GetEnumerator();
                            break;

                        case AttributeValueTagDataType.UInt16:
                            en = this.ValueUInt16.GetEnumerator();
                            break;

                        case AttributeValueTagDataType.UInt32:
                            en = this.ValueUInt32.GetEnumerator();
                            break;

                        case AttributeValueTagDataType.SInt16:
                            en = this.ValueSInt16.GetEnumerator();
                            break;

                        case AttributeValueTagDataType.SInt32:
                            en = this.ValueSInt32.GetEnumerator();
                            break;

                        case AttributeValueTagDataType.Real32:
                            en = this.ValueReal32.GetEnumerator();
                            break;

                        default:
                            break;
                    }

                    if (en != null)
                    {
                        int cnt = 0;

                        while (en.MoveNext())
                        {
                            cnt++;
                        }

                        strLength = (cnt > 0) ? string.Format(@"({0})", cnt.ToString()) : string.Empty;
                    }
                }

                return this.ValueTag.ToString() + strLength;
            }
        }

        public override string Representation
        {
            get
            {
                string strValue = this.Text;

                if (string.IsNullOrWhiteSpace(strValue) == true)
                {
                    return string.Format("[{0}]", this.Tag.ToString());
                }

                return string.Format(@"{0} [{1}]", strValue, this.Tag.ToString());
            }
        }

        public string Text
        {
            get
            {
                try
                {
                    if (string.IsNullOrEmpty(this.ValueTextData) == false)
                    {
                        return this.ValueTextData;
                    }

                    string strValue = string.Empty;

                    Array listValue = null;

                    switch (this.ValueTagDataType)
                    {
                        case AttributeValueTagDataType.UByte:
                            listValue = this.ValueByte;
                            break;

                        case AttributeValueTagDataType.UInt16:
                            listValue = this.ValueUInt16;
                            break;

                        case AttributeValueTagDataType.UInt32:
                            listValue = this.ValueUInt32;
                            break;

                        case AttributeValueTagDataType.SInt16:
                            listValue = this.ValueSInt16;
                            break;

                        case AttributeValueTagDataType.SInt32:
                            listValue = this.ValueSInt32;
                            break;

                        case AttributeValueTagDataType.Real32:
                            listValue = this.ValueReal32;
                            break;

                        default:
                            break;
                    }

                    if (listValue == null || listValue.Length < 1)
                    {
                        return string.Empty;
                    }

                    List<byte>   listByteValue      = new List<byte>();
                    List<string> listConvertedValue = new List<string>();

                    string str;

                    if (Constants.PCLXLAttribute.TextConvertedAttributes.Contains(this.Attribute) == true)
                    {
                        foreach (var value in listValue)
                        {
                            listByteValue.Add((byte)value);
                        }

                        return Encoding.Default.GetString(listByteValue.ToArray());
                    }

                    foreach (var value in listValue)
                    {
                        str = (this.ValueTagDataType == AttributeValueTagDataType.UByte) ? ((byte)value).ToString(PCLXLAttributeItem.FormatHex2Digits) : value.ToString();

                        listConvertedValue.Add(str);
                    }

                    return string.Join(", ", listConvertedValue);
                }
                catch
                {
                    return string.Empty;
                }
            }
        }

        #endregion Properties



        #region Constructors

        public PCLXLAttributeItem () : base(PCLXLItemType.Attribute)
        {
            this.ValueTag       = AttributeValueTagType.None;
            this.ValueByte      = null;
            this.ValueUInt16    = null;
            this.ValueUInt32    = null;
            this.ValueSInt16    = null;
            this.ValueSInt32    = null;
            this.ValueReal32    = null;
            this.ValueTextData  = string.Empty;
            this.ValueOriginal  = null;
            this.ArrayLengthTag = AttributeValueTagType.None;
            this.Tag            = AttributeTagType.None;

            this.Attribute = (byte)0;
            
            this.Offset = -1;
        }

        #endregion Constructors



        #region Methods :: Write

        public override byte[] ToBinary ()
        {
            // [Count of Bytes]
            // AttrValueTag = 1
            // AttrValue = 1~n
            // AttrTag = 1 (F8 / F9)
            // Attr = 1
            // => 3 + 1~n

            byte[] arrWritten = new byte[] { (byte)this.ValueTag };

            byte[] arrWrittenAttrValue = null;
            int cntValue = 0;

            switch (this.ValueTagDataType)
            {
                case AttributeValueTagDataType.UByte:
                    arrWrittenAttrValue = this.ValueByte;
                    cntValue = this.ValueByte.Length;
                    break;

                case AttributeValueTagDataType.UInt16:
                    {
                        arrWrittenAttrValue = new byte[this.ValueUInt16.Length * sizeof(ushort)];
                        Buffer.BlockCopy(this.ValueUInt16, 0, arrWrittenAttrValue, 0, arrWrittenAttrValue.Length);
                        cntValue = this.ValueUInt16.Length;
                    }
                    break;

                case AttributeValueTagDataType.UInt32:
                    {
                        arrWrittenAttrValue = new byte[this.ValueUInt32.Length * sizeof(uint)];
                        Buffer.BlockCopy(this.ValueUInt32, 0, arrWrittenAttrValue, 0, arrWrittenAttrValue.Length);
                        cntValue = this.ValueUInt32.Length;
                    }
                    break;

                case AttributeValueTagDataType.SInt16:
                    {
                        arrWrittenAttrValue = new byte[this.ValueSInt16.Length * sizeof(short)];
                        Buffer.BlockCopy(this.ValueSInt16, 0, arrWrittenAttrValue, 0, arrWrittenAttrValue.Length);
                        cntValue = this.ValueSInt16.Length;
                    }
                    break;

                case AttributeValueTagDataType.SInt32:
                    {
                        arrWrittenAttrValue = new byte[this.ValueSInt32.Length * sizeof(int)];
                        Buffer.BlockCopy(this.ValueSInt32, 0, arrWrittenAttrValue, 0, arrWrittenAttrValue.Length);
                        cntValue = this.ValueSInt32.Length;
                    }
                    break;

                case AttributeValueTagDataType.Real32:
                    {
                        arrWrittenAttrValue = new byte[this.ValueReal32.Length * sizeof(float)];
                        Buffer.BlockCopy(this.ValueReal32, 0, arrWrittenAttrValue, 0, arrWrittenAttrValue.Length);
                        cntValue = this.ValueReal32.Length;
                    }
                    break;

                default:
                    break;
            }
            
            byte[] arrCount = null;

            if (this.ValueTagSizeType == AttributeValueTagSizeType.Array)
            {
                arrWritten = BufferProcessing.AttachBufferArray(new byte[] { (byte)this.ArrayLengthTag }, arrWritten);

                switch (this.ArrayLengthTag)
                {
                    case AttributeValueTagType.SingleUByte:
                        arrCount = new byte[] { (byte)cntValue };
                        break;

                    case AttributeValueTagType.SingleUInt16:
                        arrCount = BitConverter.GetBytes((ushort)cntValue);
                        break;

                    case AttributeValueTagType.SingleUInt32:
                        arrCount = BitConverter.GetBytes((uint)cntValue);
                        break;

                    case AttributeValueTagType.SingleSInt16:
                        arrCount = BitConverter.GetBytes((short)cntValue);
                        break;

                    case AttributeValueTagType.SingleSInt32:
                        arrCount = BitConverter.GetBytes((int)cntValue);
                        break;

                    case AttributeValueTagType.SingleReal32:
                        arrCount = BitConverter.GetBytes((float)cntValue);
                        break;
                    case AttributeValueTagType.ArrayUByte:
                        arrCount = new byte[] { (byte)cntValue };
                        break;

                    default:
                        throw new InvalidCastException("This Attribute Value is not supported.");
                }
            }

            if (arrCount != null)
            {
                arrWritten = BufferProcessing.AttachBufferArray(arrCount, arrWritten);
            }

            if (arrWrittenAttrValue != null)
            {
                arrWritten = BufferProcessing.AttachBufferArray(arrWrittenAttrValue, arrWritten);
            }

            arrWritten = BufferProcessing.AttachBufferArray(new byte[] { (byte)this.Tag, this.Attribute }, arrWritten);
            
            return arrWritten;
        }

        #endregion Methods :: Write
        
        
        
        #region Methods :: Check Tag

        public static AttributeValueTagType CheckValueTag (byte tag)
        {
            AttributeValueTagType type = (AttributeValueTagType)tag;

            switch (type)
            {
                case AttributeValueTagType.SingleUByte:
                case AttributeValueTagType.SingleUInt16:
                case AttributeValueTagType.SingleUInt32:
                case AttributeValueTagType.SingleSInt16:
                case AttributeValueTagType.SingleSInt32:
                case AttributeValueTagType.SingleReal32:
                case AttributeValueTagType.XYUByte:
                case AttributeValueTagType.XYUInt16:
                case AttributeValueTagType.XYUInt32:
                case AttributeValueTagType.XYSInt16:
                case AttributeValueTagType.XYSInt32:
                case AttributeValueTagType.XYReal32:
                case AttributeValueTagType.BoxUByte:
                case AttributeValueTagType.BoxUInt16:
                case AttributeValueTagType.BoxUInt32:
                case AttributeValueTagType.BoxSInt16:
                case AttributeValueTagType.BoxSInt32:
                case AttributeValueTagType.BoxReal32:
                case AttributeValueTagType.ArrayUByte:
                case AttributeValueTagType.ArrayUInt16:
                case AttributeValueTagType.ArrayUInt32:
                case AttributeValueTagType.ArraySInt16:
                case AttributeValueTagType.ArraySInt32:
                case AttributeValueTagType.ArrayReal32:
                    return type;

                default:
                    return AttributeValueTagType.None;
            }
        }

        public static AttributeValueTagType CheckArrayLengthTag (byte tag)
        {
            AttributeValueTagType type = (AttributeValueTagType)tag;

            switch (type)
            {
                case AttributeValueTagType.SingleUByte:
                case AttributeValueTagType.SingleUInt16:
                case AttributeValueTagType.SingleUInt32:
                case AttributeValueTagType.SingleSInt16:
                case AttributeValueTagType.SingleSInt32:
                case AttributeValueTagType.SingleReal32:
                    return type;

                default:
                    return AttributeValueTagType.None;
            }
        }

        public static AttributeTagType CheckAttributeTag (byte tag)
        {
            switch (tag)
            {
                case Constants.PCLXLAttributeTag.UByte:
                    return AttributeTagType.UByte;

                case Constants.PCLXLAttributeTag.UInt16:
                    return AttributeTagType.UInt16;

                default:
                    return AttributeTagType.None;
            }
        }

        #endregion Methods :: Check Tag



        #region Method :: Get Demand for Reading Attribute

        public static int GetDemandForReadingAttributeValue (PCLXLAttributeItem.AttributeValueTagType tag)
        {
            int cntLength = 0;

            // Count for Data Type (Unsigned Byte, Unsigned Integer16-32, Signed Integer16-32, Real32)
            switch (tag)
            {
                case AttributeValueTagType.SingleUByte:
                case AttributeValueTagType.XYUByte:
                case AttributeValueTagType.BoxUByte:
                    cntLength = Constants.PCLXLAttribute.CountUByte;
                    break;

                case AttributeValueTagType.SingleUInt16:
                case AttributeValueTagType.XYUInt16:
                case AttributeValueTagType.BoxUInt16:
                    cntLength = Constants.PCLXLAttribute.CountUInt16;
                    break;

                case AttributeValueTagType.SingleUInt32:
                case AttributeValueTagType.XYUInt32:
                case AttributeValueTagType.BoxUInt32:
                    cntLength = Constants.PCLXLAttribute.CountUInt32;
                    break;

                case AttributeValueTagType.SingleSInt16:
                case AttributeValueTagType.XYSInt16:
                case AttributeValueTagType.BoxSInt16:
                    cntLength = Constants.PCLXLAttribute.CountSInt16;
                    break;

                case AttributeValueTagType.SingleSInt32:
                case AttributeValueTagType.XYSInt32:
                case AttributeValueTagType.BoxSInt32:
                    cntLength = Constants.PCLXLAttribute.CountSInt32;
                    break;

                case AttributeValueTagType.SingleReal32:
                case AttributeValueTagType.XYReal32:
                case AttributeValueTagType.BoxReal32:
                    cntLength = Constants.PCLXLAttribute.CountReal32;
                    break;
            }

            // Count for Value Type (Single, XY, Box) 
            // Count for Length Tag (Array: read more in other methods)
            switch (tag)
            {
                case AttributeValueTagType.SingleUByte:
                case AttributeValueTagType.SingleUInt16:
                case AttributeValueTagType.SingleUInt32:
                case AttributeValueTagType.SingleSInt16:
                case AttributeValueTagType.SingleSInt32:
                case AttributeValueTagType.SingleReal32:
                    cntLength *= Constants.PCLXLAttribute.CountSingle;
                    break;

                case AttributeValueTagType.XYUByte:
                case AttributeValueTagType.XYUInt16:
                case AttributeValueTagType.XYUInt32:
                case AttributeValueTagType.XYSInt16:
                case AttributeValueTagType.XYSInt32:
                case AttributeValueTagType.XYReal32:
                    cntLength *= Constants.PCLXLAttribute.CountXY;
                    break;

                case AttributeValueTagType.BoxUByte:
                case AttributeValueTagType.BoxUInt16:
                case AttributeValueTagType.BoxUInt32:
                case AttributeValueTagType.BoxSInt16:
                case AttributeValueTagType.BoxSInt32:
                case AttributeValueTagType.BoxReal32:
                    cntLength *= Constants.PCLXLAttribute.CountBox;
                    break;

                case AttributeValueTagType.ArrayUByte:
                case AttributeValueTagType.ArrayUInt16:
                case AttributeValueTagType.ArrayUInt32:
                case AttributeValueTagType.ArraySInt16:
                case AttributeValueTagType.ArraySInt32:
                case AttributeValueTagType.ArrayReal32:
                    cntLength = Constants.PCLXLAttribute.CountArrayTag;
                    break;

                default:
                    cntLength = -1;
                    break;
            }

            return cntLength;
        }

        public static int GetDemandForReadingAttributeArrayLength (PCLXLAttributeItem.AttributeValueTagType tag)
        {
            int cntLength = 0;

            switch (tag)
            {
                case AttributeValueTagType.SingleUByte:
                    cntLength = Constants.PCLXLAttribute.CountUByte;
                    break;

                case AttributeValueTagType.SingleUInt16:
                    cntLength = Constants.PCLXLAttribute.CountUInt16;
                    break;

                case AttributeValueTagType.SingleUInt32:
                    cntLength = Constants.PCLXLAttribute.CountUInt32;
                    break;

                case AttributeValueTagType.SingleSInt16:
                    cntLength = Constants.PCLXLAttribute.CountSInt16;
                    break;

                case AttributeValueTagType.SingleSInt32:
                    cntLength = Constants.PCLXLAttribute.CountSInt32;
                    break;

                case AttributeValueTagType.SingleReal32:
                    cntLength = Constants.PCLXLAttribute.CountReal32;
                    break;

                default:
                    cntLength = -1;
                    break;
            }

            return cntLength;
        }

        public static int GetDemandForReadingAttributeArray (PCLXLAttributeItem.AttributeValueTagType tag)
        {
            int cntLength = 0;

            switch (tag)
            {
                case AttributeValueTagType.ArrayUByte:
                    cntLength = Constants.PCLXLAttribute.CountUByte;
                    break;

                case AttributeValueTagType.ArrayUInt16:
                    cntLength = Constants.PCLXLAttribute.CountUInt16;
                    break;

                case AttributeValueTagType.ArrayUInt32:
                    cntLength = Constants.PCLXLAttribute.CountUInt32;
                    break;

                case AttributeValueTagType.ArraySInt16:
                    cntLength = Constants.PCLXLAttribute.CountSInt16;
                    break;

                case AttributeValueTagType.ArraySInt32:
                    cntLength = Constants.PCLXLAttribute.CountSInt32;
                    break;

                case AttributeValueTagType.ArrayReal32:
                    cntLength = Constants.PCLXLAttribute.CountReal32;
                    break;

                default:
                    cntLength = -1;
                    break;
            }

            return cntLength;
        }

        #endregion Methods :: Get Demand for Reading Attribute



        #region Methods :: Write Value

        public void IncreaseCharacterCode ()
        {
            if (this.Attribute != Constants.PCLXLAttribute.CharCode)
            {
                return;
            }

            switch (this.ValueTag)
            {
                case AttributeValueTagType.SingleUByte:
                    {
                        if (this.ValueByte == null || this.ValueByte.Length < 1)
                        {
                            return;
                        }

                        if (this.ValueByte[0] == 0xFF)
                        {
                            return;
                        }

                        this.ValueByte[0]++;
                    }
                    break;

                case AttributeValueTagType.SingleUInt16:
                    {
                        if (this.ValueUInt16 == null || this.ValueUInt16.Length < 1)
                        {
                            return;
                        }

                        if (this.ValueUInt16[0] == 0xFFFF)
                        {
                            return;
                        }

                        this.ValueUInt16[0]++;
                    }
                    break;

                default:
                    return;
            }
        }

        public void IncreaseTextData (long standard = -1)
        {
            if (this.Attribute != Constants.PCLXLAttribute.TextData)
            {
                return;
            }

            switch (this.ValueTag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                    for (int idx = 0; idx < this.ValueByte.Length; idx++)
                    {
                        if (this.ValueByte[idx] < standard)
                        {
                            continue;
                        }

                        this.ValueByte[idx]++;
                    }
                    break;

                case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                    for (int idx = 0; idx < this.ValueUInt16.Length; idx++)
                    {
                        if (this.ValueUInt16[idx] < standard)
                        {
                            continue;
                        }

                        this.ValueUInt16[idx]++;
                    }
                    break;

                default:
                    break;
            }
        }

        public void ChangeTextData (long value, IEnumerable<uint> listChangedIndex)
        {
            if (listChangedIndex == null || listChangedIndex.Count() < 1)
            {
                return;
            }

            byte   valueByte   = 0;
            ushort valueUShort = 0;

            switch (this.ValueTag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                    valueByte = (byte)value;
                    break;

                case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                    valueUShort = (ushort)value;
                    break;

                default:
                    throw new InvalidDataException("Value Tag of PCL-XL Attribute is invalid");
            }

            foreach (uint idx in listChangedIndex)
            {
                switch (this.ValueTag)
                {
                    case PCLXLAttributeItem.AttributeValueTagType.ArrayUByte:
                        this.ValueByte[idx] = valueByte;
                        break;

                    case PCLXLAttributeItem.AttributeValueTagType.ArrayUInt16:
                        this.ValueUInt16[idx] = valueUShort;
                        break;

                    default:
                        continue;
                }
            }
        }

        public bool SetPoint (Point point)
        {
            switch (this.ValueTag)
            {
                case PCLXLAttributeItem.AttributeValueTagType.XYUByte:
                    this.ValueByte[0] = (byte)point.X;
                    this.ValueByte[1] = (byte)point.Y;
                    break;

                case PCLXLAttributeItem.AttributeValueTagType.XYUInt16:
                    this.ValueUInt16[0] = (ushort)point.X;
                    this.ValueUInt16[1] = (ushort)point.Y;
                    break;

                case PCLXLAttributeItem.AttributeValueTagType.XYSInt16:
                    this.ValueSInt16[0] = (short)point.X;
                    this.ValueSInt16[1] = (short)point.Y;
                    break;

                case AttributeValueTagType.XYReal32:
                    this.ValueReal32[0] = (float)point.X;
                    this.ValueReal32[1] = (float)point.Y;
                    break;

                default:
                    return false;
            }

            return true;
        }

        public bool SetPoint (float x, float y)
        {
            if (this.ValueTag != AttributeValueTagType.XYReal32)
            {
                return false;
            }

            this.ValueReal32[0] = x;
            this.ValueReal32[1] = y;

            return true;
        }

        #endregion Methods :: Write Value



        #region Methods :: To String

        public override string ToString ()
        {
            return string.Format("{0} [ATTRIBUTE] {1}, {2}, {3}", this.OffsetHex, this.TypeRepresentation, this.TagRepresentation, this.Representation);
        }

        #endregion Methods :: To String
    }
}
