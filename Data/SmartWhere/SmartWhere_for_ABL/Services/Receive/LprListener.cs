namespace FXKIS.SmartWhere.Receive
{
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

    using log4net;

    using Common.Extension;



    public class LprListener
    {
        #region Enumerations

        public enum SubcommandType
        {
            None               = 0,
            ReceiveControlFile = 2,
            ReceiveDataFile    = 3
        }

        #endregion Enumerations



        #region Constants

        public const int  Port               = 515;
        public const int  ReceivePrintJob    = 2;
        public const int  ThreadMaxTimeoutMS = 100;
        public const long NonByteCheck       = 125899906843000;

        #endregion Constants



        #region Events

        public event EventHandler<EventArgs> ListenFailed;

        public static ManualResetEvent ClientConnected = new ManualResetEvent(false);

        #endregion Events



        #region Variables

        public static ConcurrentQueue<ReceiveClientInfo> ClientQueue = new ConcurrentQueue<ReceiveClientInfo>();

        public ConcurrentQueue<ClientThread> ThreadQueue = new ConcurrentQueue<ClientThread>();
        public TcpListener                   Listener    = null;

        #endregion Variables



        #region Variables :: Log4net

        public static readonly ILog Logger = LogManager.GetLogger(typeof(LprListener));

        #endregion Variables :: Log4net



        #region Method

        public void Start()
        {
            Thread threadReceiveClient = null;
            Thread threadManageClient  = null;

            try
            {
                threadReceiveClient = new Thread(this.ReceiveClient);
                threadReceiveClient.Start();

                threadManageClient = new Thread(this.ManageClient);
                threadManageClient.Start();

                // TCP Listener Initialize & Start
                bool isSuccess = this.TryTcpListen();

                if (isSuccess == false)
                {
                    return;
                }

                Logger.InfoFormat("STANDBY PORT {0}", LprListener.Port);

                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    this.DoBeginAcceptTcpClient(this.Listener);
                    Thread.Sleep(1);
                }

                this.AbortClientThread();
            }
            catch (ThreadAbortException)
            {
                try
                {
                    if (threadReceiveClient != null)
                    {
                        threadReceiveClient.Abort();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("LprListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }

                try
                {
                    if (threadManageClient != null)
                    {
                        threadManageClient.Abort();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("LprListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }

                this.AbortClientThread();
            }
            catch (Exception ex)
            {
                Logger.FatalFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }
            finally
            {
                try
                {
                    if (this.Listener != null)
                    {
                        this.Listener.Stop();
                    }
                }
                catch (Exception e)
                {
                    Logger.WarnFormat("LprListener Exception: {0}\n{1}", e.Message, e.StackTrace);
                }
            }
        }

        private bool TryTcpListen ()
        {
            int retryCount = 0;

            do
            {
                try
                {
                    this.Listener = new TcpListener(IPAddress.Any, LprListener.Port);

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

                    if (retryCount < ReceiveService.Environment.Recv.ListenRetryCount)
                    {
                        Logger.WarnFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> Re-Try to Listen (PORT: {1})", retryCount, LprListener.Port);

                        Thread.Sleep(ReceiveService.Environment.Recv.ListenRetryIntervalMS);

                        continue;
                    }

                    ///////////////////////////////////////////////////////////////////////////

                    Logger.FatalFormat("HTTP Connection Listener - LISTEN START :: FAILED #{0} -> EVENT \"{1}\" Occured (PORT: {2})", retryCount, "ListenFailed", LprListener.Port);

                    this.FlushMemory();

                    if (this.ListenFailed != null)
                    {
                        this.ListenFailed(this, EventArgs.Empty);
                    }

                    return false;
                }
            }
            while (ReceiveService.CancelSource.IsCancellationRequested == false);

            Logger.InfoFormat("HTTP Connection Listener - LISTEN START :: SUCCESS (PORT: {0}, RetryCount: {1})", LprListener.Port, retryCount);

            return true;
        }

        public void AbortClientThread()
        {
            try
            {
                foreach (ClientThread clientThread in this.ThreadQueue)
                {
                    try
                    {
                        clientThread.ClientInfo.Client.Close();
                        clientThread.ReceiveThread.Abort();
                    }
                    catch (Exception) { }
                }
            }
            catch (Exception e)
            {
                Logger.WarnFormat("LprListener Exception: {0}\n{1}", e.Message, e.StackTrace);
            }
        }



        public void DoBeginAcceptTcpClient(TcpListener listener)
        {
            try
            {
                LprListener.ClientConnected.Reset();

                listener.BeginAcceptTcpClient(new AsyncCallback(this.DoAcceptTcpClientCallback), listener);

                LprListener.ClientConnected.WaitOne(ReceiveService.Environment.Recv.ConnectTimeoutMS);

            }
            catch (ThreadAbortException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "BeginAccept LprListener"), ex);
            }
        }

        public void DoAcceptTcpClientCallback(IAsyncResult ar)
        {
            try
            {
                if (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    TcpListener listener = (TcpListener)ar.AsyncState;

                    TcpClient client = listener.EndAcceptTcpClient(ar);

                    //if (client.Available <= 0)
                    //{
                    //    LprListener.ClientConnected.Set();
                    //    Thread.Sleep(1);
                    //    return;
                    //}

                    ReceiveClientInfo clientInfo = new ReceiveClientInfo()
                    {
                        Client      = client,
                        ReceiveTime = DateTime.Now
                    };

                    Logger.DebugFormat("LprListener : Do Accept Client");

                    LprListener.ClientQueue.Enqueue(clientInfo);

                    LprListener.ClientConnected.Set();

                }
            }
            catch (ObjectDisposedException) { }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat("THREAD \"{0}\" was aborted.", "Accept TCP Client Callback for LprListener");
                return;
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Accept TCP Client Callback for LprListener"), ex);
                return;
            }
        }

        public void ReceiveClient()
        {
            try
            {
                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(1);

                        if (LprListener.ClientQueue.Count < 1)
                        {
                            continue;
                        }

                        if (this.ThreadQueue.Count >= ReceiveService.Environment.Recv.ListenThreadCount)
                        {
                            Thread.Sleep(LprListener.ThreadMaxTimeoutMS);
                            continue;
                        }

                        ReceiveClientInfo client = null;

                        bool isDequeue = LprListener.ClientQueue.TryDequeue(out client);

                        if (isDequeue == false || client == null)
                        {
                            continue;
                        }

                        ClientThread clientThread = new ClientThread(new Thread(new ParameterizedThreadStart(this.ReceiveData)), client);

                        clientThread.Start();

                        this.ThreadQueue.Enqueue(clientThread);
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
            catch (ThreadAbortException ex)
            {
                Logger.WarnFormat("LprListener ThreadAbortException: {0}\n{1}", ex.Message, ex.StackTrace);

            }
            catch (Exception ex)
            {
                Logger.ErrorFormat("LprListener Exception : {0}\n{1}", ex.Message, ex.StackTrace);
            }

        }

        public void ManageClient()
        {
            try
            {
                while (ReceiveService.CancelSource.IsCancellationRequested == false)
                {
                    try
                    {
                        Thread.Sleep(ReceiveService.Environment.Recv.CleanIntervalMS);

                        int nQueue = this.ThreadQueue.Count;

                        if (nQueue < 1)
                        {
                            continue;
                        }

                        for (int i = 0; i < nQueue; i++)
                        {
                            try
                            {
                                ClientThread clientThread = null;
                                bool isDequeue = this.ThreadQueue.TryDequeue(out clientThread);

                                if (isDequeue == false || clientThread == null)
                                {
                                    continue;
                                }

                                if (clientThread.IsAlive == false)
                                {
                                    continue;
                                }

                                if (clientThread.CreateTime.IsOverThanNow(0, 0, ReceiveService.Environment.Recv.CleanTimeoutMin, 0) == true) 
                                {
                                    clientThread.ClientInfo.Client.Close();
                                    clientThread.ReceiveThread.Abort();
                                    continue;
                                }

                                this.ThreadQueue.Enqueue(clientThread);
                            }
                            catch (ThreadAbortException)
                            {
                                throw;
                            }
                            catch (Exception) { }
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


        public void ReceiveData (object objClient)
        {
            try
            {
                ReceiveClientInfo clientInfo = objClient as ReceiveClientInfo;

                IPEndPoint ipEndPoint = (IPEndPoint)clientInfo.Client.Client.RemoteEndPoint;

                string remoteEndPoint = ipEndPoint.Address.ToString();

                using (NetworkStream ns = clientInfo.Client.GetStream())
                {
                    ns.ReadTimeout = ReceiveService.Environment.Recv.ReadTimeoutMS; 

                    using (BinaryReader br = new BinaryReader(ns))
                    using (BinaryWriter bw = new BinaryWriter(ns))
                    {
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

                        bool isSuccess = this.DoPrinterJob(br, bw, remoteEndPoint, clientInfo.ReceiveTime, ref errorStr);

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

        public bool DoPrinterJob(BinaryReader br, BinaryWriter bw, string remoteEndPoint, DateTime recvTime, ref string errorStr)
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

                        bool isSuccess = this.ReceiveDataFile(br, value, remoteEndPoint, recvTime);
                        
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

        public bool ReceiveDataFile(BinaryReader br, string[] value, string remoteEndPoint, DateTime recvTime)
        {
            FileInfo fi       = null;
            string   fileName = value[1];
            string   dirPath  = string.Empty;
            long     fileSize = 0;

            bool isConvert = long.TryParse(value[0], out fileSize);

            if (isConvert == false)
            {
                return false;
            }

            Logger.DebugFormat("Receive File");

            fi = this.SaveFile(fileSize, fileName.Trim(), remoteEndPoint, br);

            if (fi == null || fi.Exists == false)
            {
                Logger.DebugFormat("존재하지 않는 파일");
                return false;
            }

            if (fi.Length == 0)
            {
                fi.Delete();
                Logger.DebugFormat("빈파일 삭제 : File name: {0} ", fi.Name);
                return false;
            }

            if (fi.Length > int.MaxValue)
            {
                fi.Delete();
                Logger.DebugFormat("큰파일 삭제 : File name: {0} ", fi.Name);
                return true;
            }

            Logger.DebugFormat("LprListener File FullName :: {0}, file Length: {1}", fi.FullName, fi.Length);

            ReceiveSpoolInfo spoolInfo = new ReceiveSpoolInfo()
            {
                SpoolFile        = fi,
                ClientIPAddress  = remoteEndPoint,
                ReceiveStartTime = recvTime,
                ReceiveEndTime   = DateTime.Now
            };

            ReceiveService.SpoolQueue.Enqueue(spoolInfo);

            Logger.DebugFormat("SpoolQueue Enqueue : {0}({1})", fi.Name, fi.Length);

            return true;
        }

        public FileInfo SaveFile(long size, string name, string remoteEndPoint, BinaryReader br)
        {
            FileStream fs = null;

            try
            {
                bool includedRoot = Path.IsPathRooted(ReceiveService.Environment.Common.PathSpoolDirectory);

                if (includedRoot == false)
                {
                    ReceiveService.Environment.Common.PathSpoolDirectory = Path.Combine(ReceiveService.Environment.Common.PathSmartWhereDataRootDirectory, ReceiveService.Environment.Common.PathSpoolDirectory);
                }

                string dirPath = Path.Combine(ReceiveService.Environment.Common.PathSpoolDirectory, remoteEndPoint);

                DirectoryInfo dirInfo = new DirectoryInfo(dirPath);

                if (dirInfo.Exists == false)
                {
                    dirInfo.Create();
                }

                string path = Path.Combine(dirPath, DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + Guid.NewGuid().ToString());

                using (fs = new FileStream(path, FileMode.CreateNew, FileAccess.Write))
                {
                    using (BinaryWriter bw = new BinaryWriter(fs))
                    {
                        byte[] data = null;

                        if (size == LprListener.NonByteCheck)
                        {
                            do
                            {
                                data = br.ReadBytes(ReceiveService.Environment.Recv.BufferSize);
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
                                    cntRead = ReceiveService.Environment.Recv.BufferSize;
                                }
                                else
                                {
                                    cntRead = (ReceiveService.Environment.Recv.BufferSize < length) ? ReceiveService.Environment.Recv.BufferSize : (int)length;
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
                File.Delete(fs.Name);
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

        public void FlushMemory ()
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();

            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                LprListener.SetProcessWorkingSetSize(Process.GetCurrentProcess().Handle, -1, -1);
            }
        }

        #endregion Methods



        #region Methods :: Win32 Native Methods

        // refs: http://itstalker.tistory.com/27
        [DllImportAttribute("kernel32.dll", EntryPoint = "SetProcessWorkingSetSize", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
        private static extern int SetProcessWorkingSetSize (IntPtr process, int minimumWorkingSetSize, int maximumWorkingSetSize);

        #endregion Methods :: Win32 Native Methods
    }
}