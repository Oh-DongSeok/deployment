namespace FXKIS.SmartWhere.Receive
{
    using System;
    using System.Net.Sockets;
    using System.Text;
    using System.Threading;
    using FXKIS.SmartWhere.CommonIF;
    using log4net;
    using EmailSender;


    public class AnalyzerSender
    {
        #region Constants

        public const int WriteTimeout = 3000;
        public const int ReadTimeout  = 3000;
        public const int IntervalMS   = 10000;

        #endregion Constants



        #region Properties

        public ReceiveSpoolInfo ReceiveSpool        { get; set; }
        public TcpClient        Client              { get; set; }
        public int              AttemptNum          { get; set; }
        public SmartWhereEnvironment Environment    { get; private set; }
        public bool isAbortSize                     { get; private set; }

        #endregion Properties



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(AnalyzerSender));

        #endregion Variables :: Log4net



        #region Constructors

        public AnalyzerSender ()
        {
            this.ReceiveSpool = null;
            this.Client       = null;
            this.AttemptNum   = 0;
        }

        public AnalyzerSender (ReceiveSpoolInfo spool) : this()
        {
            this.ReceiveSpool = spool;
        }

        #endregion Constructors



        #region Methods

        public void Send (object sender)
        {
            this.Environment = new SmartWhereEnvironment(SmartWhereEnvironment.EnvironmentFileName);

            try
            {
                int port = 0;
                for (this.AttemptNum = 0; this.AttemptNum < ReceiveService.Environment.Recv.SendAttemptCount; this.AttemptNum++)
                {
                    if (ReceiveService.CancelSource.IsCancellationRequested == true)
                    {
                        continue;
                    }

                    try
                    {
                        if (this.ReceiveSpool.SpoolFile.Length > ReceiveService.Environment.Analyzer.SizeLimit)
                        {
                            port = ReceiveService.Environment.Analyzer.PortHeavy;   
            
                        }
                        else
                        {
                            port = ReceiveService.Environment.Analyzer.Port;
                        }
                        using (this.Client = new TcpClient(ReceiveService.Environment.Analyzer.Host, port))
                        {
                            using (NetworkStream ns = this.Client.GetStream())
                            {
                                ns.WriteTimeout = AnalyzerSender.WriteTimeout;
                                ns.ReadTimeout  = AnalyzerSender.ReadTimeout;

                                // Send a Spoolfile Full path (+ LF)
                                ns.WriteString(this.ReceiveSpool.SpoolFile.FullName);

                                // Send a Client IP Address (+ LF)
                                ns.WriteString(this.ReceiveSpool.ClientIPAddress);

                                // Send a Receive Start Time (yyyyMMddHHmmssfff) (+ LF)
                                ns.WriteString(this.ReceiveSpool.ReceiveStartTime.ToString("yyyy/MM/dd HH:mm:ss.fff"));

                                // Read a Acknowledge
                                int ack = ns.ReadByte();

                                if (ack != 0)
                                {
                                    throw new Exception();
                                }

                                Logger.DebugFormat("AnalyzerSender Success , File name: {0}\n File Size: {1}", this.ReceiveSpool.SpoolFile.Name, this.ReceiveSpool.SpoolFile.Length);
                                break;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.ErrorFormat("{0} \n\t{1}", ex.Message, ex.StackTrace);

                        Thread.Sleep(AnalyzerSender.IntervalMS);

                        continue;
                    }
                }

                if (this.AttemptNum >= ReceiveService.Environment.Recv.SendAttemptCount)
                {
                    Logger.ErrorFormat("AnalyzerSender Fail , File name: {0}", this.ReceiveSpool.SpoolFile.Name);
                }
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("{0} \n\t{1}", ex.Message, ex.StackTrace);
            }
        }

        #endregion Methods
    }



    /// <summary>
    /// static class :: AnalyzerSenderUtility (for Extension Methods)
    /// </summary>
    public static class AnalyzerSenderUtility
    {
        public static void WriteString (this NetworkStream ns, string str, Encoding encoding = null)
        {
            if (ns == null)
            {
                throw new ArgumentNullException("this NetworkStream ns");
            }

            if (string.IsNullOrWhiteSpace(str) == true)
            {
                throw new ArgumentNullException("string str");
            }

            if (encoding == null)
            {
                encoding = Encoding.UTF8;
            }

            byte[] arr = null;

            arr = encoding.GetBytes(str + '\n');

            ns.Write(arr, 0, arr.Length);
        }
    }
}