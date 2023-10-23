namespace FXKIS.SmartWhere.PrintingModule.Mac
{
    using FXKIS.SmartWhere.CommonIF;
    using log4net;
    using System;
    using System.IO;


    public class Program
    {
        #region Constants
        
        public const string LogConfigFileName = @"LogConfig-PrintingModule_Mac.xml";

        #endregion Constants


        #region Properties

        public static SmartWhereEnvironment Environment { get; set; }

        #endregion Properties


        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Program));

        #endregion Variables :: Log4net


        #region Methods

        public static void Main(string[] args)
        {
            try
            {
                Program.Initialize();

                Program.InitializeLogger();

                // 파라미터
                if (args.Length != 1)
                {
                    throw new FormatException("Error in parameter format");
                }

                // PrintJobInformation 파일
                string jobInfoName = args[0];

                string jobInfoPath = Path.Combine(Program.Environment.Common.PathSmartWhereDataRootDirectory, Program.Environment.Common.PathPrintJobDirectory, jobInfoName);

                Logger.InfoFormat("SmartWhere_PrintingModule_Mac START");

                PrintProcessor processor = new PrintProcessor(Program.Environment);
                processor.PrintJob(jobInfoName);

            }
            catch (Exception ex)
            {
                Logger.Fatal(ex);
            }

            Logger.InfoFormat("SmartWhere_PrintingModule_Mac STOP");
        }


        static void Initialize()
        {
            // 설정파일
            Program.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);

            if (Program.Environment == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment is empty or invalid");
            }
        }


        private static void InitializeLogger()
        {
            // Set a Log Directory to Logger
            Program.Environment.ApplyLogDirectory();

            // Configure by XML Config file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Program.LogConfigFileName)));

            // Set a Log Level to Logger
            Program.Environment.ApplyLogLevel();
        }        

        #endregion Methods
    }
}
