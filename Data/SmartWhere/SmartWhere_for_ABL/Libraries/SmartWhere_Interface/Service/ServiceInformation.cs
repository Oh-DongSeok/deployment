namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class ServiceInformation
    {
        #region Properties

        public string Name        { get; set; }

        public int    Port
        {
            get
            {
                return this._Port;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is less than 0 ({0} < {1})", value, 0));
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("Port value is greater than 65535 ({0} > {1})", value, 65535));
                }

                this._Port = value;
            }
        }
        private int _Port = 0;

        public bool   UseNetwork  { get; set; }
        public string ProcessName { get; set; }

        #endregion Properties



        #region Constructors

        public ServiceInformation ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Name        = string.Empty;
            this.Port        = 0;
            this.UseNetwork  = false;
            this.ProcessName = string.Empty;
        }

        #endregion Methods
    }
}