namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class PrintMediumInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name       = "PrintMediumInformation";
                public const string NameDetail = "PrintMediumDetailInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string Copies       = "Copies";
                    public const string ColorMode    = "ColorMode";
                    public const string Size         = "Size";
                    public const string Type         = "Type";
                    public const string BillingMeter = "BillingMeter";
                    public const string Sheets       = "Sheets";
                    public const string Impressions  = "Impressions";
                }
            }
        }

        #endregion Constants :: XML



        #region Constants :: Default Values

        public struct DefaultValue
        {
            public const uint                   Copies       = 1;
            public const Types.ColorType        ColorMode    = Types.ColorType.FullColor_4Colors;
            public const Types.SizeType         Size         = Types.SizeType.A4;
            public const Types.PaperType        PaperType    = Types.PaperType.Stationary;
            public const Types.BillingMeterType BillingMeter = Types.BillingMeterType.Meter3;
            public const uint                   Sheets       = 1;
            public const uint                   Impressions  = 5;
        }

        #endregion Constants :: Default Values



        #region Properties

        public uint                   Copies       { get; set; }
        public Types.ColorType        ColorMode    { get; set; }
        public Types.SizeType         Size         { get; set; }
        public Types.PaperType        Type         { get; set; }
        public Types.BillingMeterType BillingMeter { get; set; }
        public uint                   Sheets       { get; set; }
        public uint                   Impressions  { get; set; }

        #endregion Properties



        #region Constructors

        public PrintMediumInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Copies       = PrintMediumInformation.DefaultValue.Copies;
            this.ColorMode    = PrintMediumInformation.DefaultValue.ColorMode;
            this.Size         = PrintMediumInformation.DefaultValue.Size;
            this.Type         = PrintMediumInformation.DefaultValue.PaperType;
            this.BillingMeter = PrintMediumInformation.DefaultValue.BillingMeter;
            this.Sheets       = PrintMediumInformation.DefaultValue.Sheets;
            this.Impressions  = PrintMediumInformation.DefaultValue.Impressions;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + PrintMediumInformation.XML.Root.Name,
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Sheets,      this.Sheets),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Impressions, this.Impressions),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Copies,      this.Copies)
                );

            listXml.Add(xmlRoot);

            XElement xmlRootDetail = new XElement(ns + PrintMediumInformation.XML.Root.NameDetail,
                new XElement(ns + PrintMediumInformation.XML.Element.Name.ColorMode,    this.ColorMode.ToXmlString()),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Size,         this.Size.ToXmlString()),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Type,         this.Type.ToXmlString()),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.BillingMeter, this.BillingMeter.ToXmlString()),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Sheets,       this.Sheets),
                new XElement(ns + PrintMediumInformation.XML.Element.Name.Impressions,  this.Impressions)
                );

            listXml.Add(xmlRootDetail);

            /////////////////////////////////////////////////////////////////////

            if (listXml.Count < 1)
            {
                return null;
            }

            return listXml.ToArray();
        }

        #endregion Methods
    }
}