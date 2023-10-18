namespace FXKIS.SmartWhere
{
    using System;
    using System.IO;

    using Newtonsoft.Json;

    using Properties.Resources;



    [Serializable]
    public class ConfigurationData
    {
        #region Properties

        public string DatabaseIP       { get; set; }
        public int    DatabasePort     { get; set; }
        public string DatabaseID       { get; set; }
        public string DatabasePassword { get; set; }
        public string DatabaseName     { get; set; }

        #endregion Properties



        #region Constructors

        public ConfigurationData ()
        {
            this.DatabaseIP       = "127.0.0.1";
            this.DatabasePort     = 3306;
            this.DatabaseID       = "root";
            this.DatabasePassword = "admin";
            this.DatabaseName     = "SmartWhereGate";
        }

        #endregion Constructors



        #region Methods

        public override string ToString ()
        {
            return string.Format("[ConfigurationData: {2}:{3}@{0}:{1}/{4}]", this.DatabaseID, this.DatabasePassword, this.DatabaseIP, this.DatabasePort, this.DatabaseName);
        }

        #endregion Methods
    }



    public class ServiceConfiguration
    {
        #region Constants

        public const string ServiceConfigurationFileName = @"ServiceConfiguration.json";

        #endregion Constants



        #region Properties

        public ConfigurationData Configuration { get; set; }
        public string            FilePath      { get; set; }

        #endregion Properties



        #region Constructors

        public ServiceConfiguration (string fileName = null)
        {
            this.Configuration = new ConfigurationData();

            string path = (string.IsNullOrEmpty(fileName) == true) ? ServiceConfiguration.ServiceConfigurationFileName : fileName;

            if (Path.IsPathRooted(path) == false)
            {
                path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
            }

            this.FilePath = path;
        }

        #endregion Constructors



        #region Methods

        public void Load ()
        {
            if (!File.Exists(this.FilePath))
            {
                throw new FileNotFoundException(GlobalMessageResource.MsgServiceConfigurationFileIsNotFound);
            }

            using (StreamReader sr = new StreamReader(this.FilePath))
            {
                this.Configuration = JsonConvert.DeserializeObject<ConfigurationData>(sr.ReadToEnd());
            }
        }

        public void Save ()
        {
            JsonSerializer serializer = new JsonSerializer()
            {
                NullValueHandling = NullValueHandling.Ignore
            };

            using (StreamWriter sw = new StreamWriter(this.FilePath))
            {
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    serializer.Serialize(writer, this.Configuration);
                }
            }
        }

        public string GetConnectionString ()
        {
            return string.Format("server={0};port={1};userid={2};password={3};database={4};SslMode=Preferred;Charset=utf8;",
                                 Global.ServiceConfig.Configuration.DatabaseIP,
                                 Global.ServiceConfig.Configuration.DatabasePort,
                                 Global.ServiceConfig.Configuration.DatabaseID,
                                 Global.ServiceConfig.Configuration.DatabasePassword,
                                 Global.ServiceConfig.Configuration.DatabaseName);
        }

        public string GetConnectionString (string secretKey)
        {
            return string.Format("server={0};port={1};userid={2};password={3};database={4};SslMode=Preferred;Charset=utf8;",
                                 Global.ServiceConfig.Configuration.DatabaseIP,
                                 Global.ServiceConfig.Configuration.DatabasePort,
                                 Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabaseID,       secretKey),
                                 Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabasePassword, secretKey),
                                 Global.ServiceConfig.Configuration.DatabaseName);
        }

        public string GetConnectionStringWithoutDatabase ()
        {
            return string.Format("server={0};port={1};userid={2};password={3};SslMode=Preferred;Charset=utf8;",
                                 Global.ServiceConfig.Configuration.DatabaseIP,
                                 Global.ServiceConfig.Configuration.DatabasePort,
                                 Global.ServiceConfig.Configuration.DatabaseID,
                                 Global.ServiceConfig.Configuration.DatabasePassword);
        }

        public string GetConnectionStringWithoutDatabase (string secretKey)
        {
            return string.Format("server={0};port={1};userid={2};password={3};SslMode=Preferred;Charset=utf8;",
                                 Global.ServiceConfig.Configuration.DatabaseIP,
                                 Global.ServiceConfig.Configuration.DatabasePort,
                                 Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabaseID, secretKey),
                                 Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabasePassword, secretKey));
        }

        #endregion Methods
    }
}