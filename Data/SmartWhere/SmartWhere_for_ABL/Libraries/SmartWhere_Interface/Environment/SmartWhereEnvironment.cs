namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.IO;

    using Common.Environment;
    using Common.Extension;



    public class SmartWhereEnvironment
    {
        #region Constants

        public  const string EnvironmentFileName     = "SmartWhere_Environment.json";
        private const string PropNameForLogDirectory = "LogDirectory";

        #endregion Constants



        #region Properties

        public DatabaseEnvironment       Database       { get; private set; }
        public CommonEnvironment         Common         { get; private set; }
        public ReceiveEnvironment        Recv           { get; private set; }
        public AnalyzeEnvironment        Analyzer       { get; private set; }
        public PostSchedulerEnvironment  PostScheduler  { get; private set; }
        public PrintingModuleEnvironment PrintingModule { get; private set; }
        public ApprovalEnvironment       Approval       { get; private set; }
        public ImageLogEnvironment       ImageLog       { get; private set; }
        public MobileEnvironment         Mobile         { get; private set; }
        public BackgroundEnvironment     Background     { get; private set; }
        public WatcherEnvironment        Watcher        { get; private set; }
        public MacOSEnvironment          MacOS          { get; private set; }
        public EmailEnvironment          Email          { get; private set; }
        

        #endregion Properties



        #region Constructors

        public SmartWhereEnvironment ()
        {
            this.Database       = new DatabaseEnvironment();
            this.Common         = new CommonEnvironment();
            this.Recv           = new ReceiveEnvironment();
            this.Analyzer       = new AnalyzeEnvironment();
            this.PostScheduler  = new PostSchedulerEnvironment();
            this.PrintingModule = new PrintingModuleEnvironment();
            this.Approval       = new ApprovalEnvironment();
            this.ImageLog       = new ImageLogEnvironment();
            this.Mobile         = new MobileEnvironment();
            this.Background     = new BackgroundEnvironment();
            this.Watcher        = new WatcherEnvironment();
            this.MacOS          = new MacOSEnvironment();
            this.Email          = new EmailEnvironment();
        }

        public SmartWhereEnvironment (string path) : this()
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            this.Load(path);
        }

        public SmartWhereEnvironment (DatabaseEnvironment   db,       CommonEnvironment        common,   ReceiveEnvironment        recv,
                                      AnalyzeEnvironment    analyzer, PostSchedulerEnvironment post,     PrintingModuleEnvironment module,
                                      ApprovalEnvironment   approval, ImageLogEnvironment      imagelog, MobileEnvironment         mobile,
                                      BackgroundEnvironment bg,       WatcherEnvironment       watch,    MacOSEnvironment          macOS,   EmailEnvironment email = null) : this()
        {
            if (db == null)
            {
                throw new ArgumentNullException("DatabaseEnvironment db");
            }

            if (common == null)
            {
                throw new ArgumentNullException("CommonEnvironment common");
            }

            if (recv == null)
            {
                throw new ArgumentNullException("ReceiveEnvironment recv");
            }

            if (analyzer == null)
            {
                throw new ArgumentNullException("AnalyzeEnvironment analyzer");
            }

            if (post == null)
            {
                throw new ArgumentNullException("PostSchedulerEnvironment post");
            }

            if (module == null)
            {
                throw new ArgumentNullException("PrintingModuleEnvironment module");
            }

            if (approval == null)
            {
                throw new ArgumentNullException("ApprovalEnvironment approval");
            }

            if (imagelog == null)
            {
                throw new ArgumentNullException("ImageLogEnvironment imagelog");
            }

            if (mobile == null)
            {
                throw new ArgumentNullException("MobileEnvironment mobile");
            }

            if (bg == null)
            {
                throw new ArgumentNullException("BackgroundEnvironment bg");
            }

            if (watch == null)
            {
                throw new ArgumentNullException("WatcherEnvironment watch");
            }

            if (macOS == null)
            {
                throw new ArgumentNullException("MacOSEnvironment mac");
            }

            if (email == null)
            {
                throw new ArgumentNullException("EmailEnvironment email");
            }

            this.Database       = db;
            this.Common         = common;
            this.Recv           = recv;
            this.Analyzer       = analyzer;
            this.PostScheduler  = post;
            this.PrintingModule = module;
            this.Approval       = approval;
            this.ImageLog       = imagelog;
            this.Mobile         = mobile;
            this.Background     = bg;
            this.Watcher        = watch;
            this.MacOS          = macOS;
            this.Email          = email;
        }

        #endregion Constructors



        #region Methods

        public bool Save (string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            return FileObjectManagement.SaveJson(path, this, true);
        }

        public void Load (string path)
        {
            if (string.IsNullOrWhiteSpace(path) == true)
            {
                throw new ArgumentNullException("string path");
            }

            SmartWhereEnvironment env = FileObjectManagement.LoadJson<SmartWhereEnvironment>(path);

            if (env == null)
            {
                throw new ArgumentException("Environment File is empty or invalid.");
            }

            this.Database       = env.Database;
            this.Common         = env.Common;
            this.Recv           = env.Recv;
            this.Analyzer       = env.Analyzer;
            this.PostScheduler  = env.PostScheduler;
            this.PrintingModule = env.PrintingModule;
            this.Approval       = env.Approval;
            this.ImageLog       = env.ImageLog;
            this.Mobile         = env.Mobile;
            this.Background     = env.Background;
            this.Watcher        = env.Watcher;
            this.MacOS          = env.MacOS;
            this.Email          = env.Email;

            if (string.IsNullOrWhiteSpace(this.Common.PathFontDataDirectory) == false)
            {
                WindowsFontEnvironment.PathFontDataDirectory = this.Common.PathFontDataDirectory;

                if (Path.IsPathRooted(WindowsFontEnvironment.PathFontDataDirectory) == false)
                {
                    WindowsFontEnvironment.PathFontDataDirectory = Path.Combine(this.Common.PathSmartWhereDataRootDirectory, WindowsFontEnvironment.PathFontDataDirectory);
                }
            }
        }

        public void ApplyLogLevel ()
        {
            try
            {
                object objLogRepository = log4net.LogManager.GetRepository();

                if (objLogRepository == null)
                {
                    return;
                }

                if ((objLogRepository is log4net.Repository.Hierarchy.Hierarchy) == false)
                {
                    return;
                }

                log4net.Repository.Hierarchy.Hierarchy repository = objLogRepository as log4net.Repository.Hierarchy.Hierarchy;

                if (repository.Root == null)
                {
                    return;
                }

                if (this.Common == null)
                {
                    return;
                }

                switch (this.Common.LogLevel)
                {
                    case CommonEnvironment.LogLevelType.Debug:
                        repository.Root.Level = log4net.Core.Level.Debug;
                        break;

                    case CommonEnvironment.LogLevelType.Information:
                        repository.Root.Level = log4net.Core.Level.Info;
                        break;

                    case CommonEnvironment.LogLevelType.Warning:
                        repository.Root.Level = log4net.Core.Level.Warn;
                        break;

                    case CommonEnvironment.LogLevelType.Error:
                        repository.Root.Level = log4net.Core.Level.Error;
                        break;

                    case CommonEnvironment.LogLevelType.Fatal:
                        repository.Root.Level = log4net.Core.Level.Fatal;
                        break;

                    case CommonEnvironment.LogLevelType.None:
                    default:
                        repository.Root.Level = log4net.Core.Level.Off;
                        break;
                }

                repository.RaiseConfigurationChanged(EventArgs.Empty);
            }
            catch { }
        }

        public void ApplyLogDirectory()
        {
            // Combine a Path of Log Directory
            string pathLogDirectory = this.Common.PathLogDirectory;

            if (Path.IsPathRooted(pathLogDirectory) == false)
            {
                pathLogDirectory = Path.Combine(this.Common.PathSmartWhereDataRootDirectory, pathLogDirectory);
            }

            // Set a Path of Log Directory
            log4net.GlobalContext.Properties[SmartWhereEnvironment.PropNameForLogDirectory] = pathLogDirectory;
        }

        public override string ToString ()
        {
            return SerializationEx.ObjectToJson(this);
        }

        #endregion Methods
    }
}