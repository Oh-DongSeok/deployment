namespace FXKIS.SmartWhere.Receive.Mac
{
    using System;
    using System.Net.Sockets;




    public class ReceiveClientInfo
    {

        public TcpClient Client      { get; set; }
        public DateTime  ReceiveTime { get; set; }

      
        public ReceiveClientInfo ()
        {
            this.InitializeProperties();
        }


        private void InitializeProperties ()
        {
            this.Client      = null;
            this.ReceiveTime = DateTime.MinValue;
        }
    }
}
