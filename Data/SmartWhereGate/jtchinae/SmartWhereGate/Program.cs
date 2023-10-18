namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Reflection;
    using System.ServiceProcess;
    using System.Threading;

    using log4net;



    public class Program
    {
        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(Program));

        #endregion Variables



        #region Methods

        /// <summary>
        /// 해당 응용 프로그램의 주 진입점입니다.
        /// </summary>
        public static void Main ()
        {
            AppDomain currentDomain = AppDomain.CurrentDomain;
            currentDomain.UnhandledException += currentDomain_UnhandledException;

            ServiceBase[] servicesToRun = new ServiceBase[]
            {
                new SmartWhereGate()
            };

            if (Environment.UserInteractive)
            {
                Program.RunInteractive(servicesToRun);
            }
            else
            {
                ServiceBase.Run(servicesToRun);
            }
        }

        public static void RunInteractive (ServiceBase[] servicesToRun)
        {
            ConsoleKeyInfo quitkey;

            Console.WriteLine("Services running in interactive mode.");
            Console.WriteLine();

            MethodInfo onStartMethod = typeof(ServiceBase).GetMethod("OnStart", BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("Starting {0}...", service.ServiceName);

                onStartMethod.Invoke(service, new object[] { new string[] { } });

                Console.WriteLine("Started");
            }

            Console.WriteLine();
            Console.WriteLine();
            Console.WriteLine("Press any key to stop the services and end the process...");

            quitkey = Console.ReadKey(true);

            Console.WriteLine();

            MethodInfo onStopMethod = typeof(ServiceBase).GetMethod("OnStop", BindingFlags.Instance | BindingFlags.NonPublic);

            foreach (ServiceBase service in servicesToRun)
            {
                Console.WriteLine("Stopping {0}...", service.ServiceName);

                onStopMethod.Invoke(service, null);

                Console.WriteLine("Stopped");
            }

            Console.WriteLine("All services stopped.");

            // Keep the console alive for a second to allow the user to see the message.
            Thread.Sleep(1000);
        }

        static void currentDomain_UnhandledException (object sender, UnhandledExceptionEventArgs e)
        {
            ServiceController service = new ServiceController("SmartWhere Gate");
            service.Stop();
        }

        #endregion Methods
    }
}
