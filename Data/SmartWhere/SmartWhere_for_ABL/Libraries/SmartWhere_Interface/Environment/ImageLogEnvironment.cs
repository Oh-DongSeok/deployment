namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class ImageLogEnvironment
    {
        #region Constants :: Default Values

        public const string DefaultPathPdfConverterExecutable = "";
        public const string DefaultPathPdfConverterReference  = "";
        public const string DefaultServerHost                 = "127.0.0.1";
        public const int    DefaultServerPort                 = 80;

        #endregion Constants :: Default Values



        #region Constants :: Ranges

        // PROPERTY "ConvertRetryCount" :: default 3 cnt (range: 1 ~ 20 cnt)
        public const int MinimumConvertRetryCount =  1;
        public const int DefaultConvertRetryCount =  3;
        public const int MaximumConvertRetryCount = 20;

        // PROPERTY "ConvertRetryIntervalMS" :: default 1.0 sec (range: 0.1 ~ 10.0 sec)
        public const int MinimumConvertRetryIntervalMS =   100; //  0.1 sec
        public const int DefaultConvertRetryIntervalMS =  1000; //  1.0 sec
        public const int MaximumConvertRetryIntervalMS = 10000; // 10.0 sec

        // PROPERTY "HttpTimeoutMS" :: default 3.0 sec (range: 1.0 ~ 60.0 sec)
        public const int MinimumHttpTimeoutMS =  1000; //  1.0 sec
        public const int DefaultHttpTimeoutMS =  3000; //  3.0 sec
        public const int MaximumHttpTimeoutMS = 60000; // 60.0 sec

        #endregion Constants :: Ranges



        #region Properties

        public string PathPdfConverterExecutable { get; set; }
        public string PathPdfConverterReference  { get; set; }
        public string ServerHost                 { get; set; }
        public int    ServerPort
        {
            get
            {
                return this._ServerPort;
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

                this._ServerPort = value;
            }
        }
        private int _ServerPort = ImageLogEnvironment.DefaultServerPort;


        public int    ConvertRetryCount
        {
            get
            {
                return this._ConvertRetryCount;
            }
            set
            {
                if (value < ImageLogEnvironment.MinimumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ImageLogEnvironment.MinimumConvertRetryCount));
                }

                if (value > ImageLogEnvironment.MaximumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ImageLogEnvironment.MaximumConvertRetryCount));
                }

                this._ConvertRetryCount = value;
            }
        }
        private int _ConvertRetryCount = ImageLogEnvironment.DefaultConvertRetryCount;

        public int    ConvertRetryIntervalMS
        {
            get
            {
                return this._ConvertRetryIntervalMS;
            }
            set
            {
                if (value < ImageLogEnvironment.MinimumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ImageLogEnvironment.MinimumConvertRetryIntervalMS));
                }

                if (value > ImageLogEnvironment.MaximumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ImageLogEnvironment.MaximumConvertRetryIntervalMS));
                }

                this._ConvertRetryIntervalMS = value;
            }
        }
        private int _ConvertRetryIntervalMS = ImageLogEnvironment.DefaultConvertRetryIntervalMS;

        public int    HttpTimeoutMS
        {
            get
            {
                return this._HttpTimeoutMS;
            }
            set
            {
                if (value < ImageLogEnvironment.MinimumHttpTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ImageLogEnvironment.MinimumHttpTimeoutMS));
                }

                if (value > ImageLogEnvironment.MaximumHttpTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ImageLogEnvironment.MaximumHttpTimeoutMS));
                }

                this._ConvertRetryIntervalMS = value;
            }
        }
        private int _HttpTimeoutMS = ImageLogEnvironment.DefaultHttpTimeoutMS;

        #endregion Properties



        #region Constructors

        public ImageLogEnvironment ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.PathPdfConverterExecutable = ImageLogEnvironment.DefaultPathPdfConverterExecutable;
            this.PathPdfConverterReference  = ImageLogEnvironment.DefaultPathPdfConverterReference;
            this.ServerHost                 = ImageLogEnvironment.DefaultServerHost;
            this.ServerPort                 = ImageLogEnvironment.DefaultServerPort;
            this.ConvertRetryCount          = ImageLogEnvironment.DefaultConvertRetryCount;
            this.ConvertRetryIntervalMS     = ImageLogEnvironment.DefaultConvertRetryIntervalMS;
            this.HttpTimeoutMS              = ImageLogEnvironment.DefaultHttpTimeoutMS;
        }

        #endregion Methods
    }
}