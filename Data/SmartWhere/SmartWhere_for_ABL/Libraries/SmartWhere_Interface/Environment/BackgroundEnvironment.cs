namespace FXKIS.SmartWhere.CommonIF
{
    using System;



    public class BackgroundEnvironment : EnvironmentBase
    {
        #region Constants

        public const int DefaultCleaningIntervalMinutes = 10;
        public const int MinimumCleaningIntervalMinutes = 1;
        public const int MaximumCleaningIntervalMinutes = 1440;

        #endregion Constants



        #region Properties

        public int CleaningIntervalMinutes
        {
            get
            {
                return this._CleaningIntervalMinutes;
            }
            set
            {
                if (value < BackgroundEnvironment.MinimumCleaningIntervalMinutes)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is less than Minimum ({0} < {1})", value, BackgroundEnvironment.MinimumCleaningIntervalMinutes));
                }

                if (value > BackgroundEnvironment.MaximumCleaningIntervalMinutes)
                {
                    throw new ArgumentOutOfRangeException("int value", value, string.Format("value is greater than Maximum ({0} > {1})", value, BackgroundEnvironment.MaximumCleaningIntervalMinutes));
                }

                this._CleaningIntervalMinutes = value;
            }
        }
        private int _CleaningIntervalMinutes = BackgroundEnvironment.DefaultCleaningIntervalMinutes;

        #endregion Properties



        #region Constructors

        public BackgroundEnvironment ()
        {
            this.CleaningIntervalMinutes = BackgroundEnvironment.DefaultCleaningIntervalMinutes;
        }

        #endregion Constructors
    }
}