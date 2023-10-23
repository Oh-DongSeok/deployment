namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class PrintSecurityInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "PrintSecurityInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string ForcedWatermarkCancel = "ForcedWMCancel";
                    public const string AnalogWatermark       = "AnalogWaterMark";
                    public const string TrustMasking          = "TrustMarking";
                    public const string HybridWatermark       = "HybridWaterMark";
                    public const string UUID                  = "UUID";
                    public const string LoginID               = "LoginID";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties
        
        public bool ForcedWatermarkCancel { get; set; }
        public bool AnalogWatermark       { get; set; }
        public bool TrustMasking          { get; set; }
        public bool HybridWatermark       { get; set; }
        public bool UUID                  { get; set; }
        public bool LoginID               { get; set; }

        #endregion Properties



        #region Constructors

        public PrintSecurityInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.ForcedWatermarkCancel = false;
            this.AnalogWatermark       = false;
            this.TrustMasking          = false;
            this.HybridWatermark       = false;
            this.UUID                  = false;
            this.LoginID               = false;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + PrintSecurityInformation.XML.Root.Name,
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.ForcedWatermarkCancel, this.ForcedWatermarkCancel),
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.AnalogWatermark,       this.AnalogWatermark),
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.TrustMasking,          this.TrustMasking),
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.HybridWatermark,       this.HybridWatermark),
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.UUID,                  this.UUID),
                new XElement(ns + PrintSecurityInformation.XML.Element.Name.LoginID,               this.LoginID)
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