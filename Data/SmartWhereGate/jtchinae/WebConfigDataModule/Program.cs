namespace FXKIS.SmartWhere.Gate.WebConfig
    {
    using System;



    public class Program
    {
        #region Constants

        private const string SecretKey      = @"!SmartWhereGate_develop_by_<FXKIS_SEC_chosm>_20161021!";
        private const string SecretArgument = "/FXKISSEC";

        #endregion Constants



        #region Methods

        public static void Main (string[] args)
        {
            try
            {
                if (args == null || args.Length != 1)
                {
                    return;
                }

                if (args[0].ToUpper() != Program.SecretArgument)
                {
                    return;
                }

                Global.ServiceConfig = new ServiceConfiguration();

                Global.ServiceConfig.Load();

                if (Global.ServiceConfig == null || Global.ServiceConfig.Configuration == null)
                {
                    return;
                }

                Console.WriteLine(Global.ServiceConfig.Configuration.DatabaseIP);
                Console.WriteLine(Global.ServiceConfig.Configuration.DatabasePort);
                Console.WriteLine(Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabaseID,       Program.SecretKey));
                Console.WriteLine(Cryptography.AESDecrypt256(Global.ServiceConfig.Configuration.DatabasePassword, Program.SecretKey));
                Console.WriteLine(Global.ServiceConfig.Configuration.DatabaseName);
            }
            catch
            {
            }
        }

        #endregion Methods
    }
}