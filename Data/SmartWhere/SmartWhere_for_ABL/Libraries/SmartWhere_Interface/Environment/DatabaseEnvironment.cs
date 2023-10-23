namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Data;
    using System.Data.SqlClient;

    using Common.Extension;



    public class DatabaseEnvironment : EnvironmentBase
    {
        #region Constants

        private const string DefaultSecretKeyForAES256    = "<//SmartWhere_Background_Service//>";
        private const string FormatNormalConnectionString = @"Data Source={0},{1};Initial Catalog={2};User ID={3};Password={4}";

        public const string DefaultHost     = "127.0.0.1";
        public const int    DefaultPort     = 1433;
        public const string DefaultName     = "ANYWHERE";
        public const string DefaultID       = "uNboIeOiGxuDCALFSoEYQQ==";
        public const string DefaultPassword = "lX4pLAw/gb0jDXVvf7jnQi5xjvHGUpWl3R+sD4clo94=";
        public const int DefaultTimeoutMS = 10000;

        #endregion Constants



        #region Properties

        public string Host      { get; set; }
        public int    Port
        {
            get
            {
                return this._Port;
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

                this._Port = value;
            }
        }
        private int _Port = DatabaseEnvironment.DefaultPort;

        public string Name      { get; set; }
        public string ID        { get; set; }
        public string Password  { get; private set; }
        public string SecretKey { private get; set; }
        public int TimeoutMS { get; set; }

        #endregion Properties



        #region Constructors

        public DatabaseEnvironment (string secretKey = null)
        {
            this.Host      = DatabaseEnvironment.DefaultHost;
            this.Port      = DatabaseEnvironment.DefaultPort;
            this.Name      = DatabaseEnvironment.DefaultName;
            this.ID        = DatabaseEnvironment.DefaultID;
            this.Password  = DatabaseEnvironment.DefaultPassword;
            this.TimeoutMS = DatabaseEnvironment.DefaultTimeoutMS;

            if (string.IsNullOrEmpty(secretKey) == true)
            {
                this.SecretKey = DatabaseEnvironment.DefaultSecretKeyForAES256;
            }
            else
            {
                this.SecretKey = secretKey;
            }
        }

        public DatabaseEnvironment (string host, string name, int port = DatabaseEnvironment.DefaultPort, string secretKey = null) : this(secretKey)
        {
            if (string.IsNullOrEmpty(host) == true)
            {
                throw new ArgumentNullException("string host");
            }

            if (string.IsNullOrEmpty(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            this.Host = host;
            this.Name = name;
            this.Port = port;
        }

        public DatabaseEnvironment (string host, string name, string plainID, string plainPassword, string secretKey = null) : this(secretKey)
        {
            if (string.IsNullOrEmpty(host) == true)
            {
                throw new ArgumentNullException("string host");
            }

            if (string.IsNullOrEmpty(name) == true)
            {
                throw new ArgumentNullException("string name");
            }

            if (string.IsNullOrEmpty(plainID) == true)
            {
                throw new ArgumentNullException("string plainID");
            }

            if (string.IsNullOrEmpty(plainPassword) == true)
            {
                throw new ArgumentNullException("string plainPassword");
            }

            this.Host = host;
            this.Name = name;

            this.SetID(plainID);
            this.SetPassword(plainPassword);
        }

        public DatabaseEnvironment (string host, int port, string name, string plainID, string plainPassword, string secretKey = null) : this(host, name, plainID, plainPassword, secretKey)
        {
            this.Port = port;
        }

        #endregion Constructors



        #region Methods :: Create a Connection

        public SqlConnection CreateSqlConnection (string secretKey = null)
        {
            if (string.IsNullOrEmpty(this.SecretKey) == true)
            {
                this.SecretKey = DatabaseEnvironment.DefaultSecretKeyForAES256;
            }

            if (string.IsNullOrEmpty(secretKey) == false)
            {
                this.SecretKey = secretKey;
            }

            string id = CryptographyEx.AESDecrypt256FromBase64(this.ID,       this.SecretKey);
            string pw = CryptographyEx.AESDecrypt256FromBase64(this.Password, this.SecretKey);

            string conn = string.Format(DatabaseEnvironment.FormatNormalConnectionString, this.Host, this.Port, this.Name, id, pw);

            SqlConnection connection = new SqlConnection(conn);

            connection.Open();

            if (connection.State == ConnectionState.Closed || connection.State == ConnectionState.Broken)
            {
                throw new Exception("SQL Connection failed - " + connection.State.ToString());
            }

            return connection;
        }

        #endregion Methods :: Create a Connection



        #region Methods :: Set ID/Password

        public void SetID (string plainID, string secretKey = null)
        {
            if (string.IsNullOrEmpty(plainID) == true)
            {
                throw new ArgumentNullException("string plainID");
            }

            if (string.IsNullOrEmpty(secretKey) == false)
            {
                this.SecretKey = secretKey;
            }

            this.ID = CryptographyEx.AESEncrypt256ToBase64(plainID, this.SecretKey);
        }

        public void SetEncryptedID (string encryptedID)
        {
            if (string.IsNullOrEmpty(encryptedID) == true)
            {
                throw new ArgumentNullException("string encryptedID");
            }

            this.ID = encryptedID;
        }

        public void SetPassword (string plainPassword, string secretKey = null)
        {
            if (string.IsNullOrEmpty(plainPassword) == true)
            {
                throw new ArgumentNullException("string plainPassword");
            }

            if (string.IsNullOrEmpty(secretKey) == false)
            {
                this.SecretKey = secretKey;
            }

            this.Password = CryptographyEx.AESEncrypt256ToBase64(plainPassword, this.SecretKey);
        }

        public void SetEncryptedPassword (string encryptedPassword)
        {
            if (string.IsNullOrEmpty(encryptedPassword) == true)
            {
                throw new ArgumentNullException("string encryptedPassword");
            }

            this.Password = encryptedPassword;
        }

        public void SetCredentials (string plainID, string plainPassword, string secretKey = null)
        {
            this.SetID(plainID, secretKey);
            this.SetPassword(plainPassword, secretKey);
        }

        public void SetEncryptedCredentials (string encryptedID, string encryptedPassword)
        {
            this.SetEncryptedID(encryptedID);
            this.SetEncryptedPassword(encryptedPassword);
        }

        #endregion Methods :: Set ID/Password
    }
}
