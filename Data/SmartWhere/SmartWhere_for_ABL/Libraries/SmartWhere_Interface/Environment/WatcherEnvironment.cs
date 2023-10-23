namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Collections.Concurrent;



    public class WatcherEnvironment : EnvironmentBase
    {
        #region Constants :: Ranges

        // PROPERTY "IntervalMS" :: default 3.0 sec (range: 0.1 ~ 3,600.0 sec)
        public const int MinimumIntervalMS =       1; //    0.001 sec
        public const int DefaultIntervalMS =    3000; //    3.000 sec
        public const int MaximumIntervalMS = 3600000; // 3600.000 sec (1 hr)

        #endregion Constants :: Ranges



        #region Properties

        public int IntervalMS
        {
            get
            {
                return this._IntervalMS;
            }
            set
            {
                if (value < WatcherEnvironment.MinimumIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, WatcherEnvironment.MinimumIntervalMS));
                }

                if (value > WatcherEnvironment.MaximumIntervalMS)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, WatcherEnvironment.MaximumIntervalMS));
                }

                this._IntervalMS = value;
            }
        }
        private int _IntervalMS = WatcherEnvironment.DefaultIntervalMS;

        #endregion Properties



        #region Collections

        public ConcurrentDictionary<string, ServiceInformation> DictionaryService { get; private set; }

        #endregion Collections



        #region Constructors

        public WatcherEnvironment ()
        {
            this.InitializeProperties();
            this.InitializeCollections();
        }

        #endregion Constructors



        #region Methods

        private void InitializeProperties ()
        {
            this.IntervalMS = WatcherEnvironment.DefaultIntervalMS;
        }

        private void InitializeCollections ()
        {
            this.DictionaryService = new ConcurrentDictionary<string, ServiceInformation>();
        }

        #endregion Methods
    }
}