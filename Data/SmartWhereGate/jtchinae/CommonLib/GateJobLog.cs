namespace FXKIS.SmartWhere
{
    using System;
    using System.Net;


    public class GateJobLog
    {
        #region Properties

        public long      ID            { get; set; }
        public DateTime  Date          { get; set; }
        public bool      IsSuccess     { get; set; }
        public IPAddress ClientAddress { get; set; }
        public int       ClientPort    { get; set; }
        public IPAddress ServerAddress { get; set; }
        public int       ServerPort    { get; set; }
        public int       Connection    { get; set; }
        public string    FileName      { get; set; }
        public string    Description   { get; set; }

        #endregion Properties



        #region Constructors

        public GateJobLog ()
        {
            this.ID            = -1;
            this.Date          = DateTime.Now;
            this.IsSuccess     = false;
            this.ClientAddress = IPAddress.None;
            this.ClientPort    = GateEnvironment.DefaultPortNumber;
            this.ServerAddress = IPAddress.None;
            this.ServerPort    = GateEnvironment.DefaultPortNumber;
            this.Connection    = -1;
            this.FileName      = string.Empty;
            this.Description   = string.Empty;
        }

        #endregion Constructors



        #region Methods

        public override string ToString ()
        {
            return string.Format("[GateJobLog: " +
                                 "ID:{0}," +
                                 "Date:{1}," +
                                 "IsSuccess:{2}," +
                                 "ClientEntry:{3}:{4}," +
                                 "ServerEntry:{5}:{6}," +
                                 "Connection:{7}," +
                                 "FileName:{8}," +
                                 "Description:{9}]",
                                 this.ID, this.Date.ToString("yyyy/MM/dd HH:mm:ss"), this.IsSuccess, this.ClientAddress, this.ClientPort,
                                 this.ServerAddress, this.ServerPort, this.Connection, this.FileName, this.Description);
        }

        #endregion Methods
    }
}