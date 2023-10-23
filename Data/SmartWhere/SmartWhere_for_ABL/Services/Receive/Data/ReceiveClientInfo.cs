namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.Net.Sockets;



    public class ReceiveClientInfo
    {
        #region Properties

        public TcpClient Client      { get; set; }
        public DateTime  ReceiveTime { get; set; }

        #endregion Properties



        #region Constructors

        public ReceiveClientInfo ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.Client      = null;
            this.ReceiveTime = DateTime.MinValue;
        }

        #endregion Methods
    }
}
