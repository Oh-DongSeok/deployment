using System;
using System.Collections.Generic;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;

using log4net;
using log4net.Appender;
using log4net.Repository.Hierarchy;

using FXKIS.SmartWhere.Properties.Resources;
using MySql.Data.MySqlClient;

namespace FXKIS.SmartWhere
{
    public static class Global
    {
        #region Properties

        public static string SecretKeyForCryptography { private get; set; }

        #endregion Properties



        #region Variables

        public static ServiceConfiguration ServiceConfig = null;
        public static GateEnvironment      Environment   = null;

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Global));

        #endregion Variables



        #region Methods

        public static bool InitializeServiceConfiguration ()
        {
            Global.LoadServiceConfigurationFromFile();

            Global.SetLogDatabaseConnection();

            Logger.Debug(Global.ServiceConfig.Configuration.ToString());

            if (Global.LoadServiceEnvironmentValueFromDatabase() == false)
            {
                Logger.Error("Please insert server information to database");
                return false;
            }

            Logger.Debug(Global.Environment.ToString());
            Logger.InfoFormat("PREPARED to {0}", GlobalStringResource.AppNameSmartWhereGate);
            return true;
        }

        public static void LoadServiceConfigurationFromFile ()
        {
            Global.ServiceConfig = new ServiceConfiguration();

            Global.ServiceConfig.Load();
        }

        public static MySqlConnection CreateDatabaseConnection ()
        {
            try
            {
                MySqlConnection conn = new MySqlConnection(Global.ServiceConfig.GetConnectionString(Global.SecretKeyForCryptography));
                conn.Open();

                return conn;
            }
            catch (Exception ex)
            {
                Logger.Fatal(ex.Message);
                return null;
            }
        }

        public static MySqlConnection CreateDatabaseConnectionWithoutDatabase ()
        {
            try
            {
                MySqlConnection conn = new MySqlConnection(Global.ServiceConfig.GetConnectionStringWithoutDatabase(Global.SecretKeyForCryptography));
                conn.Open();

                return conn;
            }
            catch (Exception ex)
            {
                Logger.Fatal(ex.Message);
                return null;
            }
        }

        public static bool SetLogDatabaseConnection ()
        {
            if (Global.ServiceConfig == null || Global.ServiceConfig.Configuration == null)
            {
                return false;
            }

            try
            {
                // Log4net DB ConnectionString 설정 : 이하 아래링크 참조
                // http://stackoverflow.com/questions/9723051/how-i-can-use-the-connectionstring-of-the-current-website-for-log4net-instead-of
                Hierarchy hierarchy = LogManager.GetRepository() as Hierarchy;

                if (hierarchy != null && hierarchy.Configured)
                {
                    string connStr = string.Format("server={0};port={1};userid={2};password={3};database={4};SslMode=Preferred;Charset=utf8;",
                                                   Global.ServiceConfig.Configuration.DatabaseIP,
                                                   Global.ServiceConfig.Configuration.DatabasePort,
                                                   Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabaseID,       Global.SecretKeyForCryptography),
                                                   Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabasePassword, Global.SecretKeyForCryptography),
                                                   Global.ServiceConfig.Configuration.DatabaseName);

                    foreach (IAppender appender in hierarchy.GetAppenders())
                    {
                        if (appender is AdoNetAppender)
                        {
                            AdoNetAppender dbAppender = appender as AdoNetAppender;

                            dbAppender.ConnectionString = connStr;
                            dbAppender.UseTransactions = true;

                            // Refresh AdoNetAppenders Settings
                            dbAppender.ActivateOptions();
                        }
                    }

                    return true;
                }
            }
            catch { }

            return false;
        }

        public static bool LoadServiceEnvironmentValueFromDatabase ()
        {
            try
            {
                List<IPAddress> listIpAddress = Global.GetLocalIpList();

                if (listIpAddress == null || listIpAddress.Count < 1)
                {
                    throw new NetworkInformationException();
                }

                DatabaseHandler db = new DatabaseHandler();

                Global.Environment = db.GetGateEnvironment(listIpAddress);

                if (Global.Environment == null)
                {
                    Logger.Error("Please Input Gate Environment value in Database.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Logger.Fatal(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);
                return false;
            }

            return true;
        }

        public static List<IPAddress> GetLocalIpList()
        {
            List<IPAddress> listIpAddress = new List<IPAddress>();

            string strIpAddressList = string.Empty;

            if (NetworkInterface.GetIsNetworkAvailable() == false)
            {
                Logger.Error("Please Check a local network adapter.");

                listIpAddress.Add(IPAddress.Parse("127.0.0.1"));
            }
            else
            {
                listIpAddress.Add(IPAddress.Parse("0"));

                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());

                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork)
                    {
                        listIpAddress.Add(ip);
                    }
                }
            }

            return listIpAddress;
        }

        public static byte[] Combine (byte[] a, byte[] b)
        {
            int lengthA = (a == null) ? 0 : a.Length;
            int lengthB = (b == null) ? 0 : b.Length;

            if (lengthA + lengthB < 1)
            {
                return null;
            }

            byte[] result = new byte[lengthA + lengthB];

            if (a != null)
            {
                Buffer.BlockCopy(a, 0, result, 0, lengthA);
            }

            if (b != null)
            {
                Buffer.BlockCopy(b, 0, result, lengthA, lengthB);
            }

            return result;
        }

        #endregion Methods
    }
}
