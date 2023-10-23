namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class PrintFinishingInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "PrintFinishingInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string OutputTray       = "OutputTray";
                    public const string OutputTrayNumber = "OutputTrayNo";
                    public const string Staple           = "Staple";
                    public const string StapleCount      = "StapleCount";
                    public const string Fold             = "Fold";
                    public const string FoldCount        = "FoldCount";
                    public const string Punch            = "Punch";
                    public const string PunchCount       = "PunchCount";
                    public const string BindCount        = "BindCount";
                    public const string SquareFoldCount  = "SquareFoldCount";
                    public const string TrimmingCount    = "TrimmingCount";
                    public const string DFAProfileNumber = "DFAProfileNo";
                }
            }
        }

        #endregion Constants :: XML



        #region Constants :: Default Values

        public struct DefaultValue
        {
            public const Types.OutputTrayType OutputTray       = Types.OutputTrayType.Bin;
            public const uint                 OutputTrayNumber = 1;
            public const string               Staple           = "unspecified";
            public const uint                 StapleCount      = 0;
            public const string               Fold             = "unspecified";
            public const uint                 FoldCount        = 0;
            public const string               Punch            = "unspecified-0";
            public const uint                 PunchCount       = 0;
            public const uint                 BindCount        = 0;
            public const uint                 SquareFoldCount  = 0;
            public const uint                 TrimmingCount    = 0;
            public const uint                 DFAProfileNumber = 0;
        }

        #endregion Constants :: Default Values



        #region Properties

        public Types.OutputTrayType OutputTray       { get; set; }
        public uint                 OutputTrayNumber { get; set; }
        public string               Staple           { get; set; }
        public uint                 StapleCount      { get; set; }
        public string               Fold             { get; set; }
        public uint                 FoldCount        { get; set; }
        public string               Punch            { get; set; }
        public uint                 PunchCount       { get; set; }
        public uint                 BindCount        { get; set; }
        public uint                 SquareFoldCount  { get; set; }
        public uint                 TrimmingCount    { get; set; }
        public uint                 DFAProfileNumber { get; set; }

        #endregion Properties



        #region Constructors

        public PrintFinishingInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.OutputTray       = DefaultValue.OutputTray;
            this.OutputTrayNumber = DefaultValue.OutputTrayNumber;
            this.Staple           = DefaultValue.Staple;
            this.StapleCount      = DefaultValue.StapleCount;
            this.Fold             = DefaultValue.Fold;
            this.FoldCount        = DefaultValue.FoldCount;
            this.Punch            = DefaultValue.Punch;
            this.PunchCount       = DefaultValue.PunchCount;
            this.BindCount        = DefaultValue.BindCount;
            this.SquareFoldCount  = DefaultValue.SquareFoldCount;
            this.TrimmingCount    = DefaultValue.TrimmingCount;
            this.DFAProfileNumber = DefaultValue.DFAProfileNumber;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + PrintFinishingInformation.XML.Root.Name,
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.OutputTray,       this.OutputTray.ToXmlString()),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.OutputTrayNumber, this.OutputTrayNumber),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.Staple,           this.Staple),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.StapleCount,      this.StapleCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.Fold,             this.Fold),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.FoldCount,        this.FoldCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.Punch,            this.Punch),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.PunchCount,       this.PunchCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.BindCount,        this.BindCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.SquareFoldCount,  this.SquareFoldCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.TrimmingCount,    this.TrimmingCount),
                new XElement(ns + PrintFinishingInformation.XML.Element.Name.DFAProfileNumber, this.DFAProfileNumber)
                );

            listXml.Add(xmlRoot);

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