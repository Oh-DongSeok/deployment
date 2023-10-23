namespace FXKIS.SmartWhere.PdfReceive
{
    using ABL_Environment;
    using FXKIS.SmartWhere.CommonIF;
    using log4net;
    using System;
    using System.IO;
    using System.Runtime.InteropServices;
    using System.ServiceProcess;
    using System.Threading;

    
    public partial class PdfReceiveService : ServiceBase
	{

		public const string LogConfigFileName = "Log-ABLPdfReceive.xml";
		public const int    ThreadSleepMS     = 1000;

		public static readonly ILog Logger = LogManager.GetLogger(typeof(PdfReceiveService));

		public static CancellationTokenSource CancelSource = new CancellationTokenSource();

		public static Thread Listener = null;
		
		
		public static SmartWhereEnvironment Environment    = null;

		public static PdfReceiveEnvironment PdfEnvironment = null;

		public PdfReceiveService()
		{
			InitializeComponent();
			
		}
		
		public void InitializeConfig()
		{
			PdfReceiveService.Environment    = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);
			PdfReceiveService.PdfEnvironment = new PdfReceiveEnvironment(PdfReceiveEnvironment.EnvironmentFileName);
		}

		Listen httpListen = null;

		protected override void OnStart(string[] args)
		{
			try
			{
				this.InitializeConfig();

				this.InitializeLogger();

				Logger.Debug("PdfReceiveService START");

				httpListen = new Listen();

				httpListen.ListenFailed += HttpListen_ListenFailed;

				PdfReceiveService.Listener = new Thread(httpListen.Start);
				PdfReceiveService.Listener.Start();
			}
			catch (Exception ex)
			{
				Logger.Fatal(string.Format("EXCEPTION Occured :: during {0}", "OnStart()"), ex);

				this.ExitCode = (int)GetLastError();
				this.Stop();
				throw;
			}
		}

		protected override void OnStop()
		{
			if (PdfReceiveService.CancelSource != null)
			{
				PdfReceiveService.CancelSource.Cancel();
			}
			Thread.Sleep(PdfReceiveService.ThreadSleepMS);

			Logger.Debug("PdfReceiveService STOP");

			try
			{
				PdfReceiveService.Listener.Abort();
			}
			catch { }
		}

		private void HttpListen_ListenFailed (object sender, EventArgs e)
		{
			this.Stop();
		}

		private void InitializeLogger()
		{
			// Set a Log Directory to Logger
			PdfReceiveService.Environment.ApplyLogDirectory();

			// Configure by XML Config file
			log4net.Config.XmlConfigurator.Configure(new FileInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, PdfReceiveService.LogConfigFileName)));

			// Set a Log Level to Logger
			PdfReceiveService.Environment.ApplyLogLevel();
		}

		[DllImport("kernel32.dll")]
		public static extern uint GetLastError ();
	}
}
