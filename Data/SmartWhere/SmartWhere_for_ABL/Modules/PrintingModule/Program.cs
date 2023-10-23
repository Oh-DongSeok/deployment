namespace FXKIS.SmartWhere.PrintingModule
{
    using System;
    using System.IO;

    using log4net;

    using CommonIF;



    public class Program
    {
        #region Enumerations
        
        public enum MessageType
        {
            Unknown,
            Success,
            Failure,
            Exception
        }
        
        #endregion Enumerations
        
        
        
        #region Constants
        
        private const string ResultSuccess   = @"SUCCESS";
        private const string ResultFailure   = @"FAILURE";
        private const string ResultException = @"EXCEPTION:{0}";
        
        private const string MessageArgumentIsEmpty  = @"ARGUMENT_IS_EMPTY";
        private const string MessageFailedToGetPaths = @"FAILED_TO_GET_PATHS";
        
        private const string LogConfigFileName = @"LogConfig-PrintingModule.xml";
        
        #endregion Constants
        
        
        
        #region Properties

        public static SmartWhereEnvironment Environment { get; private set; }
        
        #endregion Properties
        
        
        
        #region Variables :: Log4net
        
        public static readonly ILog Logger = LogManager.GetLogger(typeof(Program));
        
        #endregion Variables :: Log4net
        
        
        
        #region Methods :: Main
        
        public static void Main (string[] args)
        {
            if (args == null || args.Length != 1)
            {
                Program.WriteMessage(MessageType.Exception, Program.MessageArgumentIsEmpty);
                return;
            }

            string pathJobInfo = args[0];

            try
            {
                // Load a Environment
                Program.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);
                
                // Initialize a Logger
                Program.InitializeLogger();

                // Print Processing
                PrintProcessor processor = new PrintProcessor(Program.Environment);

                bool isSuccess = processor.Process(pathJobInfo);

                Program.WriteMessage(isSuccess);
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("Unhandled Exception Occured (PRINTJOB_PATH: {0})", pathJobInfo), ex);

                Program.WriteMessage(MessageType.Exception, ex.Message);
            }
        }

        #endregion Methods :: Main



        #region Methods :: Initialize

        private static void InitializeLogger ()
        {
            // Set a Log Directory to Logger
            Program.Environment.ApplyLogDirectory();
            
            // Configure by XML Configuration file
            log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, Program.LogConfigFileName)));
            
            // Set a Log Level to Logger
            Program.Environment.ApplyLogLevel();
        }
        
        #endregion Methods :: Initialize
        
        
        
        #region Methods

        private static void WriteMessage(bool result)
        {
            if (result == true)
            {
                Program.WriteMessage(MessageType.Success);
            }
            else
            {
                Program.WriteMessage(MessageType.Failure);
            }
        }
        
        private static void WriteMessage (MessageType type, string msg = null)
        {
            if (type == MessageType.Exception && string.IsNullOrWhiteSpace(msg) == true)
            {
                throw new ArgumentNullException("string msg");
            }

            string strType = string.Empty;

            switch (type)
            {
                case MessageType.Success:
                    strType = Program.ResultSuccess;
                    break;

                case MessageType.Failure:
                    strType = Program.ResultFailure;
                    break;

                case MessageType.Exception:
                    {
                        if (msg.IndexOf(' ') >= 0)
                        {
                            msg = msg.Replace(' ', '_');
                        }

                        Console.WriteLine(Program.ResultException, msg);
                    }
                    return;
                
                default:
                    throw new ArgumentException("Message type is invalid");
            }
            
            Console.WriteLine(strType);
        }
        
        #endregion Methods
    }
}