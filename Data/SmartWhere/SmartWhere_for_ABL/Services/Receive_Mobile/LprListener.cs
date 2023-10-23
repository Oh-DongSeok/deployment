namespace FXKIS.SmartWhere.Receive.Mobile
{
    using log4net;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Runtime.InteropServices;
    using System.Text;
    using System.Threading;



    public class LprListener
    {
        public static readonly ILog Logger = LogManager.GetLogger(typeof(LprListener));

        public event EventHandler<EventArgs> ListenFailed;

        public static ManualResetEvent                   ClientConnected = new ManualResetEvent(false);
        public static ConcurrentQueue<ReceiveClientInfo> ClientQueue     = new ConcurrentQueue<ReceiveClientInfo>();
        public static ConcurrentQueue<ReceiveSpoolInfo>  SpoolQueue      = new ConcurrentQueue<ReceiveSpoolInfo>();
        public static ConcurrentQueue<Thread>            ThreadQueue     = new ConcurrentQueue<Thread>();

        public static ReceiveClientInfo ClientInfo = null;
        public static ReceiveSpoolInfo  SpoolInfo  = null;

        public const int  ReceivePrintJob = 2;
        public const long NonByteCheck    = 125899906843000;


        public enum SubcommandType
        {
            None               = 0,
            ReceiveControlFile = 2,
            ReceiveDataFile    = 3
        }

        public TcpListener Listener = null;

        public void Start()
        {
            Thread threadReceiveClient = null;
            Thread threadManageFile    = null;

            threadReceiveClient = new Thread(this.ReceiveClient);
            threadReceiveClient.Start();

            threadManageFile = new Thread(this.ManageFile);
            threadManageFile.Start();

            // TCP Listener Initialize & Start
            bool isSuccess = this.TryTcpListen();

            if (isSuccess == false)
            {
                return;
            }

            Logger.InfoFormat("STANDBY PORT {0}", ReceiveServiceMobile.Environment.Mobile.Port);

            while (ReceiveServiceMobile.CancelSource.IsCancellationRequested == false)
            {
                this.DoBeginAcceptTcpClient(this.Listener);
                Thread.Sleep(1);
            }
            try
            {
                Thread outThread = null;
                int threadCount = LprListener.ThreadQueue.Count;
                for (int i = 0; i < threadCount; i++)
                {
                    LprListener.ThreadQueue.TryDequeue(out outThread);
                    outThread.Abort();
                }
            }
            catch (Exception) { }
        }

        private bool TryTcpListen ()
        {
            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new TcpListener(IPAddress.Any, ReceiveServiceMobile.Environment.Mobile.Port);

                    if (retryCount > 1)
                    {
                        this.Listener.Server.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                    }

                    // Normal Listen Start
                    this.Listener.Start();
                    break;
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Try to Start TcpListener"), ex);

                    //  IF exception occured, THEN retry
                    retryCount++;

                    this.Listener = null;

                    if (retryCount < ReceiveServiceMobile.Environment.Mobile.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, ReceiveServiceMobile.Environment.Mobile.Port);

                        Thread.Sleep(ReceiveServiceMobile.Environment.Mobile.ListenRetryIntervalMS);

                        continue;
                    }

                    ///////////////////////////////////////////////////////////////////////////

                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", ReceiveServiceMobile.Environment.Mobile.Port);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (ReceiveServiceMobile.CancelSource.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", ReceiveServiceMobile.Environment.Mobile.Port, retryCount);

            return true;
        }

        public void DoBeginAcceptTcpClient(TcpListener listener)
        {
            try
            {
                LprListener.ClientConnected.Reset();

                listener.BeginAcceptTcpClient(new AsyncCallback(this.DoAcceptTcpClientCallback), listener);

                LprListener.ClientConnected.WaitOne(ReceiveServiceMobile.Environment.Mobile.WaitTimeoutMS);
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "BeginAccept TcpListener"), ex);
            }
        }

        public void DoAcceptTcpClientCallback(IAsyncResult ar)
        {
            try
            {
                if (ReceiveServiceMobile.CancelSource.IsCancellationRequested == false)
                {
                    TcpListener listener = (TcpListener)ar.AsyncState;

                    TcpClient client = listener.EndAcceptTcpClient(ar);

                    ReceiveClientInfo clientInfo = new ReceiveClientInfo
                    {
                        Client = client,
                        ReceiveTime = DateTime.Now
                    };

                    /////////////////////////////////////////////////////////////////////////rcdtime
                    LprListener.ClientQueue.Enqueue(clientInfo);

                    LprListener.ClientConnected.Set();
                }
            }
            catch (ObjectDisposedException) { }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for MobileLprListener");
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Accept TCP Client Callback for MobileLprListener"), ex);
                return;
            }
        }

        public void ReceiveClient()
        {
            try
            {
                while (ReceiveServiceMobile.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (LprListener.ClientQueue.Count < 1)
                        {
                            continue;
                        }

                        ReceiveClientInfo clientInfo = null;

                        bool isDequeue = LprListener.ClientQueue.TryDequeue(out clientInfo);
                        
                        if (isDequeue == false)
                        {
                            continue;
                        }

                        Thread clientThread = new Thread(new ParameterizedThreadStart(this.ReceiveData));

                        clientThread.Start(clientInfo);

                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
            catch (ThreadAbortException taex)
            {
                Logger.WarnFormat("LprListener ThreadAbortException: {0}\n{1}", taex.Message, taex.StackTrace);
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
        }

        public void ReceiveData(object objClient)
        {
            try
            {
                ReceiveClientInfo clientInfo = (ReceiveClientInfo)objClient;

                IPEndPoint ipEndPoint = (IPEndPoint)clientInfo.Client.Client.RemoteEndPoint;

                string remoteEndPoint = ipEndPoint.Address.ToString();


                ReceiveSpoolInfo spoolInfo = new ReceiveSpoolInfo
                {
                    ReceiveStartTime = clientInfo.ReceiveTime,
                    ClientIPAddress = remoteEndPoint
                };

                using (NetworkStream ns = clientInfo.Client.GetStream())
                {
                    ns.ReadTimeout = ReceiveServiceMobile.Environment.Mobile.ReadTimeoutMS;

                    using (BinaryReader br = new BinaryReader(ns))
                    using (BinaryWriter bw = new BinaryWriter(ns))
                    {
                        if (clientInfo.Client.Available == 0)
                        {
                            return;
                        }

                        Logger.DebugFormat("Receive job START");

                        int command = this.AnalyzeCommand(br);

                        if (command != LprListener.ReceivePrintJob)
                        {

                            Logger.DebugFormat("AnalyzeCommand code : {0}", command);
                            this.SendAcknowledgement(bw, false);
                            Logger.ErrorFormat("Receive job Fail : Invalid Command");
                            return;
                        }
                        Logger.DebugFormat("AnalyzeCommand code : {0} Receive a printer job", command);

                        this.SendAcknowledgement(bw, true);

                        string errorStr = string.Empty;

                        bool isSuccess = this.DoPrinterJob(br, bw, spoolInfo, ref errorStr);

                        if (isSuccess == true)
                        {
                            Logger.DebugFormat("Receive job Success");
                        }
                        else
                        {
                            Logger.ErrorFormat("Receive job Fail : {0}", errorStr);
                        }
                    }
                }
            }
            catch (EndOfStreamException eosex)
            {
                Logger.ErrorFormat("LprListener EndOfStreamException : {0}\n{1}", eosex.Message, eosex.StackTrace);
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
        }

        public bool DoPrinterJob(BinaryReader br, BinaryWriter bw, ReceiveSpoolInfo spoolInfo, ref string errorStr)
        {
            while (true)
            {
                string[] value = null;

                SubcommandType subcommand = SubcommandType.None;

                this.AnalyzeSubcommand(br, out subcommand, out value);

                switch (subcommand)
                {
                    case SubcommandType.None:
                        this.SendAcknowledgement(bw, false);
                        errorStr = "Invalid Subcommand";
                        return false;

                    case SubcommandType.ReceiveControlFile:
                        this.SendAcknowledgement(bw, true);

                        this.ReceiveControlFile(br, value);

                        byte isFinish = br.ReadByte();

                        if (isFinish != 0)
                        {
                            this.SendAcknowledgement(bw, false);
                            errorStr = "ReceiveControlFile Fail";
                            return false;
                        }

                        this.SendAcknowledgement(bw, true);
                        break;

                    case SubcommandType.ReceiveDataFile:
                        this.SendAcknowledgement(bw, true);

                        bool isSuccess = this.ReceiveDataFile(br, value, spoolInfo);

                        if (isSuccess == false)
                        {
                            this.SendAcknowledgement(bw, false);
                            errorStr = "ReceiveDataFile Fail";
                            return false;
                        }

                        this.SendAcknowledgement(bw, true);

                        return true;

                    default:
                        errorStr = "Invalid Subcommand";
                        return false;
                }
            }
        }


        public int AnalyzeCommand(BinaryReader br)
        {
            int command = 0;

            byte read = 0;

            List<byte> byteList = new List<byte>();

            do
            {
                read = br.ReadByte();
                byteList.Add(read);

            }
            while (read != (byte)0x0A);

            if (byteList.Count < 1)
            {
                return command;
            }

            byte[] data = byteList.ToArray();

            command = data[0];

            return command;
        }

        public void AnalyzeSubcommand(BinaryReader br, out SubcommandType subcommand, out string[] value)
        {
            List<byte> byteList = new List<byte>();
            byte read = 0;
            do
            {
                read = br.ReadByte();
                byteList.Add(read);

            } while (read != (byte)0x0A);

            if (byteList.Count < 1)
            {
                subcommand = SubcommandType.None;
                value = null;
                return;
            }

            string strValue = Encoding.ASCII.GetString(byteList.GetRange(1, byteList.Count - 1).ToArray());
            byte[] data = byteList.ToArray();
            subcommand = (SubcommandType)data[0];
            value = strValue.Split(' ');

            Logger.DebugFormat("AnalyzeSubcommand code : {0}, File Size : {1}, File Name: {2}", subcommand, value[0], value[1]);
        }

        public void ReceiveControlFile(BinaryReader br, string[] value)
        {
            int fileSize = 0;

            bool isConvert = int.TryParse(value[0], out fileSize);

            if (isConvert == false)
            {
                return;
            }

            byte[] data = br.ReadBytes(fileSize);
        }

        public bool ReceiveDataFile(BinaryReader br, string[] value, ReceiveSpoolInfo spoolInfo)
        {            
            string fileName = value[1];
            string dirPath = string.Empty;
            long fileSize = 0;

            bool isConvert = long.TryParse(value[0], out fileSize);

            if (isConvert == false)
            {
                return false;
            }

            Logger.DebugFormat("Receive File");

            spoolInfo.SpoolFile = this.SaveFile(fileSize, fileName.Trim(), spoolInfo.ClientIPAddress, br);

            if (spoolInfo.SpoolFile == null || spoolInfo.SpoolFile.Exists == false)
            {
                Logger.DebugFormat("존재하지 않는 파일");
                return false;
            }

            if (spoolInfo.SpoolFile.Length == 0)
            {
            //    file.Delete();
            //    Logger.DebugFormat("빈파일 삭제 : File name: {0} ", file.Name);

                File.Move(spoolInfo.SpoolFile.Name, Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, spoolInfo.ClientIPAddress, spoolInfo.SpoolFile.Name));
                Logger.DebugFormat("빈파일 : File name: {0} ", spoolInfo.SpoolFile.Name);

                return false;
            }

            if (spoolInfo.SpoolFile.Length > int.MaxValue)
            {
                //file.Delete();
                //Logger.DebugFormat("큰파일 삭제 : File name: {0} ", file.Name);

                File.Move(spoolInfo.SpoolFile.Name, Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, spoolInfo.ClientIPAddress, spoolInfo.SpoolFile.Name));
                Logger.DebugFormat("큰파일 : File name: {0} ", spoolInfo.SpoolFile.Name);

                return true;
            }


            Logger.DebugFormat("LprListener File FullName :: {0}, file Length: {1}", spoolInfo.SpoolFile.FullName, spoolInfo.SpoolFile.Length);

            LprListener.SpoolQueue.Enqueue(spoolInfo);

            Logger.DebugFormat("SpoolQueue Enqueue : {0}({1})", spoolInfo.SpoolFile.Name, spoolInfo.SpoolFile.Length);

            return true;
        }

        public FileInfo SaveFile(long size, string name, string remoteEndPoint, BinaryReader br)
        {
            FileStream fs = null;
            try
            {
                string dirPath = Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathSpoolDirectory, remoteEndPoint);

                DirectoryInfo dirInfo = new DirectoryInfo(dirPath);
                if (dirInfo.Exists == false)
                {
                    dirInfo.Create();
                }

                //string path = Path.Combine(dirPath, DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Guid.NewGuid().ToString());
                string path = Path.Combine(dirPath, name + "_" + Guid.NewGuid().ToString());

                using (fs = new FileStream(path, FileMode.CreateNew, FileAccess.Write))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        byte[] data = null;

                        if (size == LprListener.NonByteCheck)
                        {
                            do
                            {
                                data = br.ReadBytes(ReceiveServiceMobile.Environment.Mobile.BufferSize);
                                bw.Write(data);

                            }
                            while (data != null && data.Length > 0);
                        }
                        else
                        {
                            long length = size;

                            while (length > 0)
                            {
                                int cntRead = 0;

                                if (length > int.MaxValue)
                                {
                                    cntRead = ReceiveServiceMobile.Environment.Mobile.BufferSize;
                                }
                                else
                                {
                                    cntRead = (ReceiveServiceMobile.Environment.Mobile.BufferSize < length) ? ReceiveServiceMobile.Environment.Mobile.BufferSize : (int)length;
                                }

                                data = br.ReadBytes(cntRead);
                                bw.Write(data);

                                length -= cntRead;
                            }

                            byte ack = br.ReadByte();
                            if (ack != 0)
                            {
                                return null;
                            }
                        }

                        FileInfo fi = new FileInfo(fs.Name);
                        return fi;
                    }
                }
            }
            catch (Exception)
            {
                File.Move(fs.Name, Path.Combine(ReceiveServiceMobile.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveServiceMobile.Environment.Common.PathErrorSpoolDirectory, remoteEndPoint, fs.Name));
                //File.Delete(fs.Name);
                throw;
            }
        }

        public void SendAcknowledgement(BinaryWriter bw, bool isPositive)
        {
            byte positive = 0;
            byte negative = 1;

            if (isPositive == true)
            {
                bw.Write(positive);
                Logger.DebugFormat("Send ACK");

                return;
            }

            bw.Write(negative);
            Logger.DebugFormat("Send NAK");
        }

        public void ManageFile()
        {
            try
            {
                while (ReceiveServiceMobile.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1000);

                        int nQueue = LprListener.SpoolQueue.Count;
        
                        if (nQueue < 1)
                        {
                            continue;
                        }
        
                        for (int i = 0; i < nQueue; i++)
                        {
                            try
                            {
                                ReceiveSpoolInfo spoolInfo = null;

                                bool isDequeue = LprListener.SpoolQueue.TryDequeue(out spoolInfo);
        
                                if (isDequeue == false)
                                {
                                    continue;
                                }

                                if (spoolInfo.SpoolFile.Exists == false)
                                {
                                    continue;
                                }
            
                                SpoolAnalyze analyze = new SpoolAnalyze();
                                Thread analyzeThread = new Thread(new ParameterizedThreadStart(analyze.Start));
                                LprListener.ThreadQueue.Enqueue(analyzeThread);
                                analyzeThread.Start(spoolInfo);        
                            }
                            catch (ThreadAbortException)
                            {
                                throw;
                            }
                            catch (Exception) { }
                        }

                        try
                        {
                            int threadCount = LprListener.ThreadQueue.Count;

                            if (threadCount > 0)
                            {
                                Thread outThread = null;
                                for (int i = 0; i < threadCount; i++)
                                {
                                    LprListener.ThreadQueue.TryDequeue(out outThread);

                                    if (outThread.ThreadState == System.Threading.ThreadState.Running)
                                    {
                                        LprListener.ThreadQueue.Enqueue(outThread);
                                    }

                                }
                            }               
                        }
                        catch (ThreadAbortException)
                        {
                            throw;
                        }
                        catch (Exception) { }
                        
                    }
                    catch (ThreadAbortException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
                    }
                }
            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
        }

        public void FlushMemory ()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                LprListener.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        // refs: http://itstalker.tistory.com/27
        [DllImportAttribute("kernel32.dll", EntryPoint = "SetProcessWorkingSetSize", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern int SetProcessWorkingSetSize (IntPtr process, int minimumWorkingSetSize, int maximumWorkingSetSize);
    }
}

