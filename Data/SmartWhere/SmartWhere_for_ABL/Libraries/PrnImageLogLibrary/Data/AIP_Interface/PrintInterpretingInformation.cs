namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class PrintInterpretingInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "PrintInterpretingInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string Nup = "Nup";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties

        public Types.NupType Nup { get; set; }

        #endregion Properties



        #region Constructors

        public PrintInterpretingInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Nup = Types.NupType.Unknown;
        }

        public void SetNup (int nup)
        {
            if (nup < 0)
            {
                throw new ArgumentOutOfRangeException("int nup", nup, string.Format("value is less than 0 ({0} < 0)", nup));
            }

            switch (nup)
            {
                case 0:
                    this.Nup = Types.NupType.Unspecified;
                    break;

                case 1:
                    this.Nup = Types.NupType._1up;
                    break;

                case 2:
                    this.Nup = Types.NupType._2up;
                    break;

                case 3:
                    this.Nup = Types.NupType._3up;
                    break;

                case 4:
                    this.Nup = Types.NupType._4up;
                    break;

                case 5:
                    this.Nup = Types.NupType._5up;
                    break;

                case 6:
                    this.Nup = Types.NupType._6up;
                    break;

                case 7:
                    this.Nup = Types.NupType._7up;
                    break;

                case 8:
                    this.Nup = Types.NupType._8up;
                    break;

                case 9:
                    this.Nup = Types.NupType._9up;
                    break;

                case 16:
                    this.Nup = Types.NupType._16up;
                    break;

                case 32:
                    this.Nup = Types.NupType._32up;
                    break;

                default:
                    throw new NotSupportedException(string.Format("Property N-up is not supported in the n-up value (VALUE: {0})", nup));
            }
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + PrintInterpretingInformation.XML.Root.Name,
                new XElement(ns + PrintInterpretingInformation.XML.Element.Name.Nup, this.Nup.ToXmlString())
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