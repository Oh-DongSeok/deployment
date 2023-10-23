namespace FXKIS.SmartWhere.ImageLog.Interface
{
    using System.Collections.Generic;
    using System.Xml.Linq;



    public class AccountingInformation : JobInformationBase
    {
        #region Constants :: XML

        public struct XML
        {
            public struct Root
            {
                public const string Name = "AccountingInformation";
            }

            public struct Element
            {
                public struct Name
                {
                    public const string UserName      = "UserName";
                    public const string UserID        = "UserID";
                    public const string AccountID     = "AccountID";
                    public const string CardID        = "CardID";
                    public const string AccountUserID = "AccountUserID";
                }
            }
        }

        #endregion Constants :: XML



        #region Properties
        
        public string UserName      { get; set; }
        public string UserID        { get; set; }
        public string AccountID     { get; set; }
        public string CardID        { get; set; }
        public string AccountUserID { get; set; }

        #endregion Properties



        #region Constructors

        public AccountingInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.UserName      = string.Empty;
            this.UserID        = string.Empty;
            this.AccountID     = string.Empty;
            this.CardID        = string.Empty;
            this.AccountUserID = string.Empty;
        }

        public override XElement[] ToXMLs (XNamespace ns)
        {
            List<XElement> listXml = new List<XElement>();

            /////////////////////////////////////////////////////////////////////

            XElement xmlRoot = new XElement(ns + AccountingInformation.XML.Root.Name,
                new XElement(ns + AccountingInformation.XML.Element.Name.UserName,      this.UserName),
                new XElement(ns + AccountingInformation.XML.Element.Name.UserID,        this.UserID),
                new XElement(ns + AccountingInformation.XML.Element.Name.AccountID,     this.AccountID),
                new XElement(ns + AccountingInformation.XML.Element.Name.CardID,        this.CardID),
                new XElement(ns + AccountingInformation.XML.Element.Name.AccountUserID, this.AccountUserID)
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