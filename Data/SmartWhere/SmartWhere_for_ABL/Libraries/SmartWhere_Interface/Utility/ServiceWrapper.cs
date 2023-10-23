namespace FXKIS.SmartWhere.CommonIF
{
    using System;
    using System.Reflection;
    using System.ServiceProcess;
    using System.Threading;


    public class ServiceWrapper
    {
        #region Constants

        public const string MethodNameForOnStart  = @"OnStart";
        public const string MethodNameForOnStop   = @"OnStop";
        public const int    KeepAliveBeforeStopMS = 1000;

        #endregion Constants



        #region Properties

        public ServiceBase Service { get; private set; }

        #endregion Properties



        #region Constructors

        public ServiceWrapper (ServiceBase service)
        {
            if (service == null)
            {
                throw new ArgumentNullException("ServiceBase service");
            }

            this.Service = service;
        }

        #endregion Constructors



        #region Methods

        public void Start ()
        {
            AppDomain.CurrentDomain.UnhandledException += this.CurrentDomain_UnhandledException;

            ServiceBase[] servicesToRun = new ServiceBase[]
            {
                this.Service
            };

            if (Environment.UserInteractive)
            {
                // Console Application for "DEBUG" - must modify to Project output type
                ServiceWrapper.RunInteractive(servicesToRun);
            }
            else
            {
                // Windows Application for "RELEASE" - must modify to Project output type
                ServiceBase.Run(servicesToRun);
            }
        }

        public static void RunInteractive (ServiceBase[] servicesToRun)
        {
            ConsoleKeyInfo quitkey;

            Console.WriteLine("[DEBUG CONSOLE] Services running in \"Interactive\" mode.");

            MethodInfo onStartMethod = typeof(ServiceBase).GetMethod(ServiceWrapper.MethodNameForOnStart, BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("[DEBUG CONSOLE] Starting Service \"{0}\"...", service.ServiceName);

                onStartMethod.Invoke(service, new object[] { new string[] { } });

                Console.WriteLine("[DEBUG CONSOLE] Started Service \"{0}\"", service.ServiceName);
            }

            Console.WriteLine("[DEBUG CONSOLE] Press any key to stop the services and end the process...");

            
            quitkey = Console.ReadKey(true);
            

             Console.WriteLine();

            MethodInfo onStopMethod = typeof(ServiceBase).GetMethod(ServiceWrapper.MethodNameForOnStop, BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("[DEBUG CONSOLE] Stopping \"{0}\"...", service.ServiceName);

                onStopMethod.Invoke(service, null);

                Console.WriteLine("[DEBUG CONSOLE] Stopped \"{0}\"", service.ServiceName);
            }

            Console.WriteLine("[DEBUG CONSOLE] All services stopped.");

            // Keep the console alive for a second to allow the user to see the message.
            Thread.Sleep(ServiceWrapper.KeepAliveBeforeStopMS);
        }

        public void CurrentDomain_UnhandledException (object sender, UnhandledExceptionEventArgs e)
        {
            ServiceController service = new ServiceController(this.Service.ServiceName);

            service.Stop();
        }

        #endregion Methods
    }
}
