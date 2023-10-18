namespace FXKIS.SmartWhere
{
    using System;
    using System.Net;


    public class GateEnvironment
    {
        #region Constants :: Default Value

        public const string DefaultTempSpoolDirectoryPath     = @"spool\";

        public const int    DefaultPortNumber                 = 515;

        public const int    DefaultThreadManagingCycleMS      = 1000;    //  1.0 sec
        public const int    DefaultLogManagingCycleMS         = 3600000; // 1 hours
        public const int    DefaultConnectionWaitingTimeoutMS = 500;     //  0.5 sec
        public const int    DefaultForcedTerminatedTimeoutMS  = 60000;   // 60.0 sec
        public const int    DefaultBufferSize                 = 1048576; // 1 MB
        public const int    DefaultLogRemainDays              = 365;     // 1 years
        public const int    DefaultRemainTempSpoolFileDays    = 1;       // 1 days

        #endregion Constants :: Default Value



        #region Constants :: Range

        public const int MinThreadManagingCycleMS      = 500;      //  0.5 sec
        public const int MaxThreadManagingCycleMS      = 60000;    // 60.0 sec

        public const int MinLogManagingCycleMS         = 5000;     //  5.0 sec
        public const int MaxLogManagingCycleMS         = 3600000;  // 1 hours

        public const int MinConnectionWaitingTimeoutMS = 100;      //  0.1 sec
        public const int MaxConnectionWaitingTimeoutMS = 5000;     //  5.0 sec

        public const int MinForcedTerminatedTimeoutMS  = 1000;     //  1.0 sec
        public const int MaxForcedTerminatedTimeoutMS  = 3600000;  // 1 hours

        public const int MinBufferSize                 = 524288;   // 512 KB
        public const int MaxBufferSize                 = 67108864; // 64 MB

        public const int MinLogRemainDays              = 0;        //    0 days (0: no limit)
        public const int MaxLogRemainDays              = 1000;     // 1000 days

        #endregion Constants :: Range



        #region Properties

        public  long      ID                          { get; set; }
        public  bool      IsEnabled                   { get; set; }
        public  DateTime  Date                        { get; set; }
        public  string    Name                        { get; set; }
        public  IPAddress ServiceIpAddress            { get; set; }
        public  int       ServicePort                 { get; set; }
        public  IPAddress SmartWhereIpAddress         { get; set; }
        public  int       SmartWherePort              { get; set; }

        private int       _ThreadManagingCycleMS      = GateEnvironment.DefaultThreadManagingCycleMS;
        public  int       ThreadManagingCycleMS
        {
            get
            {
                return _ThreadManagingCycleMS;
            }
            set
            {
                if (GateEnvironment.MinThreadManagingCycleMS > value)
                {
                    this._ThreadManagingCycleMS = MinThreadManagingCycleMS;
                }
                else if (GateEnvironment.MaxThreadManagingCycleMS < value)
                {
                    this._ThreadManagingCycleMS = MaxThreadManagingCycleMS;
                }
                else
                {
                    this._ThreadManagingCycleMS = value;
                }
            }
        }

        private int       _LogManagingCycleMS         = GateEnvironment.DefaultLogManagingCycleMS;
        public  int       LogManagingCycleMS
        {
            get
            {
                return _LogManagingCycleMS;
            }
            set
            {
                if (GateEnvironment.MinLogManagingCycleMS > value)
                {
                    this._LogManagingCycleMS = MinLogManagingCycleMS;
                }
                else if (GateEnvironment.MaxLogManagingCycleMS < value)
                {
                    this._LogManagingCycleMS = MaxLogManagingCycleMS;
                }
                else
                {
                    this._LogManagingCycleMS = value;
                }
            }
        }

        private int       _ConnectionWaitingTimeoutMS = GateEnvironment.DefaultConnectionWaitingTimeoutMS;
        public  int       ConnectionWaitingTimeoutMS
        {
            get
            {
                return _ConnectionWaitingTimeoutMS;
            }
            set
            {
                if (GateEnvironment.MinConnectionWaitingTimeoutMS > value)
                {
                    this._ConnectionWaitingTimeoutMS = MinConnectionWaitingTimeoutMS;
                }
                else if (GateEnvironment.MaxConnectionWaitingTimeoutMS < value)
                {
                    this._ConnectionWaitingTimeoutMS = MaxConnectionWaitingTimeoutMS;
                }
                else
                {
                    this._ConnectionWaitingTimeoutMS = value;
                }
            }
        }

        private int       _ForcedTerminatedTimeoutMS  = GateEnvironment.DefaultForcedTerminatedTimeoutMS;
        public  int       ForcedTerminatedTimeoutMS
        {
            get
            {
                return _ForcedTerminatedTimeoutMS;
            }
            set
            {
                if (GateEnvironment.MinForcedTerminatedTimeoutMS > value)
                {
                    this._ForcedTerminatedTimeoutMS = MinForcedTerminatedTimeoutMS;
                }
                else if (GateEnvironment.MaxForcedTerminatedTimeoutMS < value)
                {
                    this._ForcedTerminatedTimeoutMS = MaxForcedTerminatedTimeoutMS;
                }
                else
                {
                    this._ForcedTerminatedTimeoutMS = value;
                }
            }
        }

        private int       _BufferSize                 = GateEnvironment.DefaultBufferSize;
        public  int       BufferSize
        {
            get
            {
                return _BufferSize;
            }
            set
            {
                if (GateEnvironment.MinBufferSize > value)
                {
                    this._BufferSize = MinBufferSize;
                }
                else if (GateEnvironment.MaxBufferSize < value)
                {
                    this._BufferSize = MaxBufferSize;
                }
                else
                {
                    this._BufferSize = value;
                }
            }
        }

        public  bool      IsJobLogging                { get; set; }

        private int       _LogRemainDays              = GateEnvironment.DefaultLogRemainDays;
        public  int       LogRemainDays
        {
            get
            {
                return _LogRemainDays;
            }
            set
            {
                if (GateEnvironment.MinLogRemainDays > value)
                {
                    this._LogRemainDays = MinLogRemainDays;
                }
                else if (GateEnvironment.MaxLogRemainDays < value)
                {
                    this._LogRemainDays = MaxLogRemainDays;
                }
                else
                {
                    this._LogRemainDays = value;
                }
            }
        }

        public  bool      AllowedDiskIO               { get; set; }
        public  bool      CalculateLprByteSize        { get; set; }
        public  string    TempSpoolDirectoryPath      { get; set; }

        #endregion Properties



        #region Constructors

        public GateEnvironment ()
        {
            this.ID                         = -1;
            this.IsEnabled                  = false;
            this.Date                       = DateTime.Now;
            this.Name                       = string.Empty;
            this.ServiceIpAddress           = IPAddress.None;
            this.ServicePort                = GateEnvironment.DefaultPortNumber;
            this.SmartWhereIpAddress        = IPAddress.None;
            this.SmartWherePort             = GateEnvironment.DefaultPortNumber;
            this.ThreadManagingCycleMS      = GateEnvironment.DefaultThreadManagingCycleMS;
            this.LogManagingCycleMS         = GateEnvironment.DefaultLogManagingCycleMS;
            this.ConnectionWaitingTimeoutMS = GateEnvironment.DefaultConnectionWaitingTimeoutMS;
            this.ForcedTerminatedTimeoutMS  = GateEnvironment.DefaultForcedTerminatedTimeoutMS;
            this.BufferSize                 = GateEnvironment.DefaultBufferSize;
            this.IsJobLogging               = false;
            this.LogRemainDays              = GateEnvironment.DefaultLogRemainDays;
            this.CalculateLprByteSize       = false;
            this.AllowedDiskIO              = false;
            this.TempSpoolDirectoryPath     = GateEnvironment.DefaultTempSpoolDirectoryPath;
        }

        #endregion Constructors



        #region Methods

        public override string ToString ()
        {
            return string.Format("[GateEnvironment: " +
                                 "ID:{0}," +
                                 "IsEnabled:{1}," +
                                 "Date:{2}," +
                                 "Name:{3}," +
                                 "ServiceEntry:{4}:{5}," +
                                 "SmartWhereEntry:{6}:{7}," +
                                 "ThreadManagingCycleMS:{8}," +
                                 "LogManagingCycleMS:{9}," +
                                 "ConnectionWaitingTimeoutMS:{10}," +
                                 "ForcedTerminatedTimeoutMS:{11}," +
                                 "BufferSize:{12}," +
                                 "IsJobLogging:{13}," +
                                 "LogRemainDays:{14}," +
                                 "CalculateLprByteSize:{15}," +
                                 "AllowedDiskIO:{16}," +
                                 "TempSpoolDirectoryPath:{17}]",
                                 this.ID,
                                 this.IsEnabled,
                                 this.Date.ToString("yyyy/MM/dd HH:mm:ss"),
                                 this.Name,
                                 this.ServiceIpAddress, this.ServicePort,
                                 this.SmartWhereIpAddress, this.SmartWherePort,
                                 this.ThreadManagingCycleMS,
                                 this.LogManagingCycleMS,
                                 this.ConnectionWaitingTimeoutMS,
                                 this.ForcedTerminatedTimeoutMS,
                                 this.BufferSize,
                                 this.IsJobLogging,
                                 this.LogRemainDays,
                                 this.CalculateLprByteSize,
                                 this.AllowedDiskIO,
                                 this.TempSpoolDirectoryPath);
        }

        #endregion Methods
    }
}