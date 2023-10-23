namespace FXKIS.SmartWhere.CommonIF
{
    using System;

    using Common.Extension;



    /// <summary>
    /// PageDatabase.xaml에 대한 상호 작용 논리
    /// </summary>
    public partial class PageDatabase : PageBase
    {
        #region Constructors

        public PageDatabase ()
        {
            this.InitializeComponent();

            this.InitializeControls();
        }

        #endregion Constructors



        #region Methods

        public override void InitializeControls ()
        {
        }

        public override bool VerifyInputValue (ref string message)
        {
            // Host
            if (string.IsNullOrWhiteSpace(this.TxtHost.Text) == true)
            {
                message = @"""Host"" of DatabaseEnvironment is empty";
                return false;
            }

            // Port
            if (this.NumPort.HasValue == false)
            {
                message = @"""Port"" of DatabaseEnvironment is empty";
                return false;
            }

            // Name
            if (string.IsNullOrWhiteSpace(this.TxtName.Text) == true)
            {
                message = @"""Name"" of DatabaseEnvironment is empty";
                return false;
            }

            // ID
            if (string.IsNullOrWhiteSpace(this.TxtID.Text) == true)
            {
                message = @"""ID"" of DatabaseEnvironment is empty";
                return false;
            }

            // Password
            if (string.IsNullOrWhiteSpace(this.TxtPassword.Password) == true)
            {
                message = @"""Password"" of DatabaseEnvironment is empty";
                return false;
            }

            return true;
        }

        public override T GetConfigurationData<T> (string secretKey = null)
        {
            if (typeof(T) != typeof(DatabaseEnvironment))
            {
                throw new InvalidCastException("Generic type is invalid - not DatabaseEnvironment");
            }

            DatabaseEnvironment db = new DatabaseEnvironment(secretKey);

            db.Host = this.TxtHost.Text;
            db.Port = this.NumPort.Port;
            db.Name = this.TxtName.Text;
            db.SetCredentials(this.TxtID.Text, this.TxtPassword.Password);

            return db.ChangeType<T>();
        }

        public override void SetConfigurationData<T> (T env, string secretKey = null)
        {
            if (env == null)
            {
                throw new ArgumentNullException("T env");
            }

            if ((env is DatabaseEnvironment) == false)
            {
                throw new InvalidCastException("Parameter type is invalid - not DatabaseEnvironment");
            }

            DatabaseEnvironment db = env as DatabaseEnvironment;

            this.TxtHost.Text         = db.Host;
            this.NumPort.Port         = db.Port;
            this.TxtName.Text         = db.Name;
            this.TxtID.Text           = CryptographyEx.AESDecrypt256FromBase64(db.ID,       secretKey);
            this.TxtPassword.Password = CryptographyEx.AESDecrypt256FromBase64(db.Password, secretKey);
        }

        public override void Clear ()
        {
            this.TxtHost.Text         = string.Empty;
            this.TxtName.Text         = string.Empty;
            this.TxtID.Text           = string.Empty;
            this.TxtPassword.Password = string.Empty;

            this.NumPort.Clear();
        }

        #endregion Methods
    }
}
