namespace FXKIS.PDL
{
    using System.Collections.Generic;

    public class PJLData
    {
        #region Properties

        public List<PJLItem> Items { get; private set; }

        #endregion Properties



        #region Constructors

        public PJLData ()
        {
            this.Items = new List<PJLItem>();
        }

        #endregion Constructors



        #region Methods

        public string GetHeaderString()
        {
            string result = string.Empty;

            result += "********************************************************************* \n";
            result += "                            PJL COMMAND \n";
            result += "********************************************************************* \n";

            return result;

        }

        public override string ToString ()
        {
            string result = string.Empty;

            result += GetHeaderString();

            if (this.Items != null)
            {
                foreach (PJLItem item in this.Items)
                {
                    result += item.ToString() + "\n";
                }
            }

            return result;
        }

        #endregion Methods
    }
}
