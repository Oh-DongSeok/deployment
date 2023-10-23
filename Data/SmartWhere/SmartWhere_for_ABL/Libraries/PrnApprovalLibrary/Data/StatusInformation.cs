namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;

    using Metadata;



    public class StatusInformation
    {
        #region Constants

        public struct XML
        {
            public struct Element
            {
                public struct Name
                {
                    public const string MassCheckedStatus    = "mass_checked_yn";
                    public const string MassCheckedCount     = "mass_checked_cnt";
                    public const string ColorCheckedStatus   = "color_checked_yn";
                    public const string ColorCheckedCount    = "color_checked_cnt";
                    public const string PatternCheckedStatus = "pattern_checked_yn";
                }

                public struct Value
                {
                    public const string Yes = "Y";
                    public const string No  = "N";
                }
            }
        }

        #endregion Constants



        #region Properties

        public bool MassCheckedStatus    { get; set; }
        public int  MassCheckedCount     { get; set; }
        public bool ColorCheckedStatus   { get; set; }
        public int  ColorCheckedCount    { get; set; }
        public bool PatternCheckedStatus { get; set; }

        #endregion Properties



        #region Constructors

        public StatusInformation ()
        {
            this.InitializeProperties();
        }

        public StatusInformation (PrnMetadata metadata) : this()
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            this.MassCheckedStatus    = metadata.IsOverMassLimit;
            this.ColorCheckedStatus   = metadata.IsOverColorLimit;
            this.PatternCheckedStatus = metadata.IsDetectedSecurity;

            if (this.MassCheckedStatus == true)
            {
                this.MassCheckedCount = metadata.PageCount;
            }
            else
            {
                this.MassCheckedCount = 0;
            }

            if (this.ColorCheckedStatus == true)
            {
                this.ColorCheckedCount = metadata.ColorPageCount;
            }
            else
            {
                this.ColorCheckedCount = 0;
            }
        }

        #endregion Constructors



        #region Methods :: Initialize

        private void InitializeProperties ()
        {
            this.MassCheckedStatus    = false;
            this.MassCheckedCount     = 0;
            this.ColorCheckedStatus   = false;
            this.ColorCheckedCount    = 0;
            this.PatternCheckedStatus = false;
        }

        #endregion Methods :: Initialize



        #region Methods

        public XElement[] ToXML ()
        {
            List<XElement> listElement = new List<XElement>();

            listElement.Add(new XElement(StatusInformation.XML.Element.Name.MassCheckedStatus,    this.MassCheckedStatus.ToXmlString()));
            listElement.Add(new XElement(StatusInformation.XML.Element.Name.MassCheckedCount,     this.MassCheckedCount));
            listElement.Add(new XElement(StatusInformation.XML.Element.Name.ColorCheckedStatus,   this.ColorCheckedStatus.ToXmlString()));
            listElement.Add(new XElement(StatusInformation.XML.Element.Name.ColorCheckedCount,    this.ColorCheckedCount));
            listElement.Add(new XElement(StatusInformation.XML.Element.Name.PatternCheckedStatus, this.PatternCheckedStatus.ToXmlString()));

            return listElement.ToArray();
        }

        #endregion Methods
    }



    /// <summary>
    /// static class :: StatusInformationUtility (for Extension Methods)
    /// </summary>
    public static class StatusInformationUtility
    {
        public static string ToXmlString (this bool value)
        {
            if (value == true)
            {
                return StatusInformation.XML.Element.Value.Yes;
            }
            else
            {
                return StatusInformation.XML.Element.Value.No;
            }
        }
    }
}
