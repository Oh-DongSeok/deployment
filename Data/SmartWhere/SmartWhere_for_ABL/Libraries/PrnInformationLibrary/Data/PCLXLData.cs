namespace FXKIS.PDL
{
    using System.Collections.Generic;
    
    public class PCLXLData
    {
        #region Properties

        public PCLXLHeader     Header { get; set; }
        public List<PCLXLItem> Items  { get; private set; }

        #endregion Properties



        #region Constructors

        public PCLXLData()
        {
            this.Items = new List<PCLXLItem>();
        }

        #endregion Constructors



        #region Methods

        public string GetHeadersHeaderString()
        {
            string result = string.Empty;

            result += "********************************************************************* \n";
            result += "                           PCL-XL Headers \n";
            result += "********************************************************************* \n";

            return result;
        }

        public string GetItemsHeaderString()
        {
            string result = string.Empty;

            result += "********************************************************************* \n";
            result += "                            PCL-XL Items \n";
            result += "********************************************************************* \n";

            return result;
        }

        public override string ToString ()
        {
            string result = string.Empty;

            result += this.GetHeadersHeaderString();

            if (this.Header != null)
            {
                result += this.Header.ToString();
            }

            result += "\n";

            result += this.GetItemsHeaderString();

            if (this.Items != null)
            {
                foreach (PCLXLItem item in this.Items)
                {
                    result += item.ToString() + "\n";
                }
            }

            return result;
        }

        #endregion Methods
    }
}
