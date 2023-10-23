namespace FXKIS.SmartWhere.PdfReceive
{
    using log4net;
    using System;
    using System.Reflection;
    using System.ServiceProcess;
    using System.Threading;


    public static class Program
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(Program));

        public const string MethodNameForOnStart  = @"OnStart";
        public const string MethodNameForOnStop   = @"OnStop";
        public const int    KeepAliveBeforeStopMS = 1000;

        static void Main()
        {
            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new PdfReceiveService()
            };

            if (Environment.UserInteractive)
            {
                // Console Application for "DEBUG" - must modify to Project output type
                Program.RunInteractive(ServicesToRun);
            }
            else
            {
                // Windows Application for "RELEASE" - must modify to Project output type
                ServiceBase.Run(ServicesToRun);
            }
        }

        public static void RunInteractive(ServiceBase[] servicesToRun)
        {
            ConsoleKeyInfo quitkey;

            Console.WriteLine("[DEBUG CONSOLE] Services running in \"Interactive\" mode.");

            MethodInfo onStartMethod = typeof(ServiceBase).GetMethod(Program.MethodNameForOnStart, BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("[DEBUG CONSOLE] Starting Service \"{0}\"...", service.ServiceName);

                onStartMethod.Invoke(service, new object[] { new string[] { } });

                Console.WriteLine("[DEBUG CONSOLE] Started Service \"{0}\"", service.ServiceName);
            }

            Console.WriteLine("[DEBUG CONSOLE] Press any key to stop the services and end the process...");

            quitkey = Console.ReadKey(true);

            Console.WriteLine();

            MethodInfo onStopMethod = typeof(ServiceBase).GetMethod(Program.MethodNameForOnStop, BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("[DEBUG CONSOLE] Stopping \"{0}\"...", service.ServiceName);

                onStopMethod.Invoke(service, null);

                Console.WriteLine("[DEBUG CONSOLE] Stopped \"{0}\"", service.ServiceName);
            }

            Console.WriteLine("[DEBUG CONSOLE] All services stopped.");

            // Keep the console alive for a second to allow the user to see the message.
            Thread.Sleep(Program.KeepAliveBeforeStopMS);
        }
    }
}