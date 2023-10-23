namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class ApprovalEnvironment
    {
        #region Constants :: Default Values

        public const string DefaultPathPdfConverterExecutable = "";
        public const string DefaultPathPdfConverterReference  = "";
        public const string DefaultWebServiceURI              = "http://127.0.0.1/approve/apprinter.do?method=approvalDraft";

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
        public string WebServiceURI              { get; set; }

        public int    ConvertRetryCount
        {
            get
            {
                return this._ConvertRetryCount;
            }
            set
            {
                if (value < ApprovalEnvironment.MinimumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ApprovalEnvironment.MinimumConvertRetryCount));
                }

                if (value > ApprovalEnvironment.MaximumConvertRetryCount)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ApprovalEnvironment.MaximumConvertRetryCount));
                }

                this._ConvertRetryCount = value;
            }
        }
        private int _ConvertRetryCount = ApprovalEnvironment.DefaultConvertRetryCount;

        public int    ConvertRetryIntervalMS
        {
            get
            {
                return this._ConvertRetryIntervalMS;
            }
            set
            {
                if (value < ApprovalEnvironment.MinimumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ApprovalEnvironment.MinimumConvertRetryIntervalMS));
                }

                if (value > ApprovalEnvironment.MaximumConvertRetryIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ApprovalEnvironment.MaximumConvertRetryIntervalMS));
                }

                this._ConvertRetryIntervalMS = value;
            }
        }
        private int _ConvertRetryIntervalMS = ApprovalEnvironment.DefaultConvertRetryIntervalMS;

        public int    HttpTimeoutMS
        {
            get
            {
                return this._HttpTimeoutMS;
            }
            set
            {
                if (value < ApprovalEnvironment.MinimumHttpTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, ApprovalEnvironment.MinimumHttpTimeoutMS));
                }

                if (value > ApprovalEnvironment.MaximumHttpTimeoutMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, ApprovalEnvironment.MaximumHttpTimeoutMS));
                }

                this._HttpTimeoutMS = value;
            }
        }
        private int _HttpTimeoutMS = ApprovalEnvironment.DefaultHttpTimeoutMS;

        #endregion Properties



        #region Constructors

        public ApprovalEnvironment ()
        {
            this.InitializeProperties();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.PathPdfConverterExecutable = ApprovalEnvironment.DefaultPathPdfConverterExecutable;
            this.PathPdfConverterReference  = ApprovalEnvironment.DefaultPathPdfConverterReference;
            this.WebServiceURI              = ApprovalEnvironment.DefaultWebServiceURI;
            this.ConvertRetryCount          = ApprovalEnvironment.DefaultConvertRetryCount;
            this.ConvertRetryIntervalMS     = ApprovalEnvironment.DefaultConvertRetryIntervalMS;
            this.HttpTimeoutMS              = ApprovalEnvironment.DefaultHttpTimeoutMS;
        }

        #endregion Methods
    }
}