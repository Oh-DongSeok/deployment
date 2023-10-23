namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class PrintInputTrayInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "PrintInputTrayInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string InputTray       = "InputTray";
                    public const string InputTrayNumber = "InputTrayNo";
                }

                public struct Value
                {
                    public const string InputTray = "tray";
                }
            }
        }

        #endregion Constants :: XML



        #region Constants :: Default Values

        public struct DefaultValue
        {
            public const uint InputTrayNumber = 1;
        }

        #endregion Constants :: Default Values



        #region Properties
        
        public uint InputTrayNumber { get; set; }

        #endregion Properties



        #region Constructors

        public PrintInputTrayInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.InputTrayNumber = PrintInputTrayInformation.DefaultValue.InputTrayNumber;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + PrintInputTrayInformation.XML.Root.Name,
                new XElement(ns + PrintInputTrayInformation.XML.Element.Name.InputTray,      PrintInputTrayInformation.XML.Element.Value.InputTray),
                new XElement(ns + PrintInputTrayInformation.XML.Element.Name.InputTrayNumber, this.InputTrayNumber)
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