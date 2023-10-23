namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageBackground.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageBackground : PageBase
    {
        #region Constructors

        public PageBackground () : base()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
            this.NumCleaningInterval.Minimum = BackgroundEnvironment.MinimumCleaningIntervalMinutes;
            this.NumCleaningInterval.Maximum = BackgroundEnvironment.MaximumCleaningIntervalMinutes;
        }

        public override bool VerifyInputValue (ref string message)
        {
            // CleaningIntervalMinutes
            if (this.NumCleaningInterval.Value == null || this.NumCleaningInterval.Value.HasValue == false)
            {
                message = @"""CleaningIntervalMinutes"" of BackgroundEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string param = null)
        {
            if (typeof(T) != typeof(BackgroundEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not BackgroundEnvironment");
            }

            BackgroundEnvironment env = new BackgroundEnvironment();
            
            env.CleaningIntervalMinutes = this.NumCleaningInterval.Value.Value;

            return env.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string param = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is BackgroundEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not BackgroundEnvironment");
            }

            BackgroundEnvironment bg = env as BackgroundEnvironment;
            
            this.NumCleaningInterval.Value = bg.CleaningIntervalMinutes;
        }

        public override void Clear ()
        {
            this.NumCleaningInterval.Value = null;
        }

        #endregion Methods
    }
}
