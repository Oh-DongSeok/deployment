namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Windows.Controls;



    /// <summary>
    /// NetworkPortUpDown.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class NetworkPortUpDown : UserControl
    {
        #region Properties

        public int Port
        {
            get
            {
                if (this.NumPort == null || this.NumPort.Value == null || this.NumPort.Value.HasValue == false)
                {
                    return -1;
                }

                return this.NumPort.Value.Value;
            }
            set
            {
                if (value < 0)
                {
                    throw new ArgumentOutOfRangeException("this.Port", value, "Port value is less than 0");
                }

                if (value > 65535)
                {
                    throw new ArgumentOutOfRangeException("this.Port", value, "Port value is greater than 65535");
                }

                this.NumPort.Value = value;
            }
        }

        public bool HasValue
        {
            get
            {
                if (this.NumPort == null || this.NumPort.Value == null || this.NumPort.Value.HasValue == false)
                {
                    return false;
                }

                return true;
            }
        }

        #endregion Properties



        #region Constructors

        public NetworkPortUpDown ()
        {
            this.InitializeComponent();
        }

        #endregion Constructors



        #region Methods

        public void Clear ()
        {
            try
            {
                this.NumPort.Value = null;
            }
            catch { }
        }

        #endregion Methods
    }
}
