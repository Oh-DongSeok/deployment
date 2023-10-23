namespace FXKIS.PDL
{
    using System;
    using System.Threading.Tasks;

    using Event;



    public class PrnDocument
    {
        #region Enumerations

        public enum PrnWriteMode
        {
            None,
            Text,
            Prn
        }

        #endregion Enumerations



        #region Events

        public event EventHandler<ItemUpdatedEventArgs> ItemUpdated;

        #endregion Events



        #region Properties

        public PJLData   PJL          { get; private set; }
        public PCLXLData PCLXL        { get; private set; }
        public long      StreamLength { get; set; }
        public string    Name         { get; set; }

        #endregion Properties



        #region Constructors

        public PrnDocument()
        {
            this.PJL          = new PJLData();
            this.PCLXL        = new PCLXLData();
            this.Name         = string.Empty;
            this.StreamLength = 0;
        }

        public PrnDocument(string name) : this()
        {
            this.Name = name;
        }

        #endregion Constructors



        #region Methods

        public override string ToString ()
        {
            string result = string.Empty;

            if (this.PJL != null)
            {
                result += this.PJL.ToString();
            }

            result += "\n";

            if (this.PCLXL != null)
            {
                result += this.PCLXL.ToString();
            }

            return result;
        }

        public void AddPJL (PJLItem item)
        {
            this.PJL.Items.Add(item);

            uint frequency = Properties.Settings.Default.UpdateFrequencyForPJL;

            if (frequency < 1)
            {
                frequency = 1;
            }

            if (this.ItemUpdated != null && this.PJL.Items.Count % frequency == 0)
            {
                this.ItemUpdated(this, new ItemUpdatedEventArgs(item.Offset, this.StreamLength, item));
            }
        }

        public void AddPCLXLItem (PCLXLItem item)
        {
            this.PCLXL.Items.Add(item);

            uint frequency = Properties.Settings.Default.UpdateFrequencyForPCLXL;

            if (frequency < 1)
            {
                frequency = 1;
            }

            if (this.ItemUpdated != null && this.PCLXL.Items.Count % frequency == 0)
            {
                this.ItemUpdated(this, new ItemUpdatedEventArgs(item.Offset, this.StreamLength, item));
            }
        }

        public void SetPCLXLHeader (PCLXLHeader header)
        {
            this.PCLXL.Header = header;

            if (this.ItemUpdated != null)
            {
                this.ItemUpdated(this, new ItemUpdatedEventArgs(header.Offset, this.StreamLength, header));
            }
        }

        public string ReadUserID ()
        {
            if (this.PJL == null || this.PJL.Items.Count < 1)
            {
                return string.Empty;
            }

            foreach (PJLItem item in this.PJL.Items)
            {
                string token = item.Variable.ToUpper();

                if (item.Command != PJLItem.PJLCommandType.Set)
                {
                    continue;
                }

                if (token != Constants.PJLVariable.JobAttribute)
                {
                    continue;
                }

                if (item.JobAttributeCommand.ToUpper() == Constants.PJLVariable.JobAccountingUserName)
                {
                    return item.JobAttributeParameter;
                }
            }

            return string.Empty;
        }

        public static implicit operator Task<object>(PrnDocument v)
        {
            throw new NotImplementedException();
        }

        #endregion Methods
    }
}
