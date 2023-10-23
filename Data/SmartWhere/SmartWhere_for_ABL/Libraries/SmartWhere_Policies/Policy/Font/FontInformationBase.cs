namespace FXKIS.SmartWhere.Policy
{
    using System;
    using System.Drawing;
    using System.Globalization;
    using System.IO;

    using Common.Extension;



    #region Abstract Class

    public abstract class FontInformationBase
    {
        #region Enumerations

        public enum FontUsedType
        {
            Unknown,
            HeaderFooter,
            Watermark
        }

        #endregion Enumerations



        #region Constants :: Default Values

        public const string DefaultName       = "Batang";
        public const int    DefaultSize       = 8;
        public const string DefaultColorValue = "#000000";

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        public const int MinimumFontSizeForHeaderFooter = 1;
        public const int MaximumFontSizeForHeaderFooter = 50;

        public const int MinimumFontSizeForWatermark    = 8;
        public const int MaximumFontSizeForWatermark    = 200;

        #endregion Constants :: Ranges



        #region Properties

        public FontUsedType UsedType   { get; private set; }
        public string       Name       { get; set; }
        public string       ColorValue { get; set; }
        public int          Size
        {
            get
            {
                return this._Size;
            }
            set
            {
                int min = int.MinValue;
                int max = int.MaxValue;

                switch (this.UsedType)
                {
                    case FontUsedType.HeaderFooter:
                        min = FontInformationBase.MinimumFontSizeForHeaderFooter;
                        max = FontInformationBase.MaximumFontSizeForHeaderFooter;
                        break;

                    case FontUsedType.Watermark:
                        min = FontInformationBase.MinimumFontSizeForWatermark;
                        max = FontInformationBase.MaximumFontSizeForWatermark;
                        break;

                    default:
                        throw new NotSupportedException(string.Format("Property \"UsedType\" is invalid (VALUE: {0})", this.UsedType.ToString()));
                }

                if (value < min)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum value ({0} < {1})", value, min));
                }

                if (value > max)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum value ({0} > {1})", value, max));
                }

                this._Size = value;
            }
        }
        private int _Size = FontInformationBase.DefaultSize;

        #endregion Properties



        #region Constructors

        public FontInformationBase (FontUsedType usedType = FontUsedType.Unknown)
        {
            this.UsedType   = usedType;
            this.Name       = FontInformationBase.DefaultName;
            this.ColorValue = FontInformationBase.DefaultColorValue;
            this.Size       = FontInformationBase.DefaultSize;
        }

        public FontInformationBase (string name, string color, int size, FontUsedType usedType = FontUsedType.Unknown) : this(usedType)
        {
            if (string.IsNullOrWhiteSpace(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            if (string.IsNullOrWhiteSpace(color) == true)
            {
                throw new ArgumentNullException("string color");
            }

            this.Size = size;
        }

        #endregion Constructors



        #region Abstract Methods

        public abstract FontStyle GetFontStyle ();

        #endregion Abstract Methods



        #region Methods

        public Color GetColorObject ()
        {
            if (string.IsNullOrWhiteSpace(this.ColorValue) == true)
            {
                throw new InvalidDataException("Color value is empty");
            }

            string strColorCode = this.ColorValue.Replace("#", "");

            int   argb  = int.Parse(strColorCode, NumberStyles.HexNumber);
            Color color = Color.FromArgb(argb);

            // The Alpha value is implcitly 255 (fully opaque)
            return Color.FromArgb(color.R, color.G, color.B);
        }

        public SolidBrush GetSolidBrush ()
        {
            return new SolidBrush(this.GetColorObject());
        }

        public Font GetFontObject ()
        {
            return new Font(this.Name, this.Size, this.GetFontStyle(), GraphicsUnit.Pixel);
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }

    #endregion Abstract Class



    #region Extended Class

    /// <summary>
    /// class :: HeaderFooterFontInformation
    /// </summary>
    public class HeaderFooterFontInformation : FontInformationBase
    {
        #region Constructors

        public HeaderFooterFontInformation () : base(FontUsedType.HeaderFooter) { }

        public HeaderFooterFontInformation (string name, string color, int size) : base(name, color, size, FontUsedType.HeaderFooter) { }

        #endregion Constructors



        #region Methods

        public override FontStyle GetFontStyle ()
        {
            return FontStyle.Regular;
        }

        #endregion Methods
    }

    /// <summary>
    /// class :: WatermarkFontInformation
    /// </summary>
    public class WatermarkFontInformation : FontInformationBase
    {
        #region Constants

        public const bool DefaultBold   = false;
        public const bool DefaultItalic = false;

        #endregion Constants



        #region Properties

        public bool Bold   { get; set; }
        public bool Italic { get; set; }

        #endregion Properties



        #region Constructors

        public WatermarkFontInformation () : base(FontUsedType.Watermark)
        {
            this.Bold   = WatermarkFontInformation.DefaultBold;
            this.Italic = WatermarkFontInformation.DefaultItalic;
        }
        
        public WatermarkFontInformation (string name, string color, int size, bool bold = WatermarkFontInformation.DefaultBold, bool italic = WatermarkFontInformation.DefaultItalic) : base(name, color, size, FontUsedType.Watermark)
        {
            this.Bold   = bold;
            this.Italic = italic;
        }

        #endregion Constructors



        #region Methods

        public override FontStyle GetFontStyle ()
        {
            if (this.Bold == true && this.Italic == true)
            {
                return FontStyle.Bold | FontStyle.Italic;
            }
            else if (this.Bold == true && this.Italic == false)
            {
                return FontStyle.Bold;
            }
            else if (this.Bold == false && this.Italic == true)
            {
                return FontStyle.Italic;
            }
            else
            {
                return FontStyle.Regular;
            }
        }

        #endregion Methods
    }

    #endregion Extended Class
}
