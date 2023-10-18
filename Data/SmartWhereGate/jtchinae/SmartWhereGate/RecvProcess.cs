namespace FXKIS.SmartWhere.Gate
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;
    using System.Threading;
    using System.Linq;
    using log4net;

    using Events;
    using Properties.Resources;



    public class RecvProcess
    {
        #region Enumerations

        public enum LpdCommandType : byte
        {
            None                = 0,
            PrintAnyWaitingJobs = 1,
            ReceivePrinterJob   = 2,
            SendQueueStateShort = 3,
            SendQueueStateLong  = 4,
            RemoveJobs          = 5
        }

        public enum LpdSubcommandType : byte
        {
            None               = 0,
            AbortJob           = 1,
            ReceiveControlFile = 2,
            ReceiveDataFile    = 3
        }

        #endregion Enumerations



        #region Event

        public event CancelEventHandler CancelProcess;
        public event EventHandler     TimeUpdated;
        public event GateEventHandler RecvSuccess;
        public event GateEventHandler RecvEnd;

        #endregion Event



        #region Properties

        private TcpClient               Client           { get; set; }
        private string ClientIP { get; set; }
        private int ClientEndPointPort { get; set; }
        private ConcurrentQueue<byte[]> QueueRequest     { get; set; }
        private ConcurrentQueue<byte[]> QueueResponse    { get; set; }
        private int                     ConnHashcode     { get; set; }
        private CancellationToken       CancelToken      { get; set; }
        private bool                    SendProcessIsEnd { get; set; }

        #endregion Properties



        #region Variables

        public static readonly ILog Logger = LogManager.GetLogger(typeof(RecvProcess));
        public const long NonByteCheck = 125899906843000;

        #endregion Variables



        #region Constructors

        public RecvProcess (TcpClient client, ConcurrentQueue<byte[]> queueRequest, ConcurrentQueue<byte[]> queueResponse, int connHashcode)
        {
            if (client == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "TcpClient", "client"));
            }

            if (queueRequest == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "ConcurrentQueue<byte[]>", "queueRequest"));
            }

            if (queueResponse == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "ConcurrentQueue<byte[]>", "queueResponse"));
            }

            this.Client           = client;
            this.QueueRequest     = queueRequest;
            this.QueueResponse    = queueResponse;
            this.ConnHashcode     = connHashcode;
            this.CancelToken      = CancellationToken.None;
            this.SendProcessIsEnd = false;
            this.ClientIP = ((IPEndPoint)client.Client.RemoteEndPoint).Address.ToString();
        }

        public RecvProcess (TcpClient socket, ConcurrentQueue<byte[]> queueRequest, ConcurrentQueue<byte[]> queueResponse, int connHashcode, int ePPort, CancellationToken token) : this(socket, queueRequest, queueResponse, connHashcode)
        {
            this.CancelToken = token;
            this.ClientEndPointPort = ePPort;
        }

        #endregion Constructors



        #region Event Handler Methods

        public void Sp_SendSuccess (object sender, GateEventArgs e)
        {
            this.SendProcessIsEnd = true;
        }

        #endregion Event Handler Methods



        #region Methods

        public void Start()
        {
            try
            {               

                Logger.DebugFormat($@"=============== ""RecvProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) START !!! ===============");

                using (NetworkStream ns = this.Client.GetStream())
                {                    
                    using (BinaryReader br = new BinaryReader(ns))
                    {
                        using (BinaryWriter bw = new BinaryWriter(ns))
                        {
                            byte[]   data   = null;
                            string[] values = null;

                            LpdCommandType command = LpdCommandType.None;

                            // Command 수신 (Client -> [Gate]) & 분석
                            this.RecvLinePrinterCommand(br, out data, out command, out values);

                            // 처음 주는 값 변경. (LPR 큐 이름 -> client ip)
                            char stx = '\u0002';
                            Socket c = Client.Client;
                            IPEndPoint ip_point = (IPEndPoint)c.RemoteEndPoint;
                            string ip = $"{stx}{ip_point.Address.ToString()}\n";

                            //Logger.DebugFormat($"LPR Q name change ( [{string.Join("", values)}] -> [{ip}] )");
                            data = Encoding.ASCII.GetBytes(ip);

                            if (this.IsExitCondition() == true)
                            {
                                return;
                            }

                            // Command 전송 ([Gate] -> SmartWhere)
                            this.RequestToSendProcess(data);

                            if (this.IsExitCondition() == true)
                            {
                                return;
                            }

                            // Command 전송에 대한 ACK 중계 (SmartWhere -> [Gate] -> Client)
                            this.ResponseToClient(bw);

                            switch (command)
                            {
                                case LpdCommandType.ReceivePrinterJob:
                                    this.ProcessLinePrinterJob(br, bw);
                                    break;

                                case LpdCommandType.SendQueueStateShort:
                                case LpdCommandType.SendQueueStateLong:
                                case LpdCommandType.PrintAnyWaitingJobs:
                                case LpdCommandType.RemoveJobs:
                                default:
                                    this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                                    return;
                            }
                        }
                    }
                }
            }
            catch (ThreadAbortException)
            {
                Logger.WarnFormat(GlobalMessageResource.MsgThreadWasAbortedDuringConnection, Thread.CurrentThread.Name, this.ConnHashcode);
            }
            catch (Exception ex)
            {
                Logger.Fatal($"{GlobalMessageResource.MsgUnhandledExceptionOccured} ({this.ConnHashcode})", ex);
                this.CancelProcess?.Invoke(this, new CancelEventArgs("RecvProcess", ConnHashcode));
            }
            finally
            {
                if (this.Client != null)
                {
                    this.Client.Close();
                    Logger.DebugFormat($"CONNECTION CLOSE : {ClientIP}:{ClientEndPointPort}({ConnHashcode})");
                }

                this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                Logger.DebugFormat($@"=============== ""RecvProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) END !!! ===============");
            }
        }

        private void ProcessLinePrinterJob (BinaryReader br, BinaryWriter bw)
        {
            byte[]   data   = null;
            string[] values = null;

            LpdSubcommandType subcommand = LpdSubcommandType.None;

            string   strControlFile = string.Empty;
            FileInfo fileTempSpool  = null;
            bool     successJobSend = false;

            try
            {
                while (true)
                {
                    // SubCommand 수신 (Client -> [GATE]) & 분석
                    this.RecvLinePrinterSubcommand(br, out data, out subcommand, out values);

                    if (data == null)
                    {
                        this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                        return;
                    }

                    if (this.IsExitCondition() == true)
                    {
                        return;
                    }

                    switch (subcommand)
                    {
                        case LpdSubcommandType.ReceiveControlFile:
                            {
                                // "Receive Control File" - SubCommand 전송 ([GATE] -> SmartWhere)
                                this.RequestToSendProcess(data);

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }

                                // "Receive Control File" - SubCommand 전송에 대한 ACK 중계 (SmartWhere -> [GATE] -> Client)
                                this.ResponseToClient(bw);

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }

                                // "Receive Control File" - 데이터(cf) 수신 (Client -> [GATE]) :: 끝에 null이 있기 때문에, Command 크기보다 1 더 받아야 함
                                data = br.ReadBytes(int.Parse(values[0]) + 1);

                                // "Receive Control File" - 데이터(cf) 축적 (로그 기록용)
                                strControlFile = Encoding.Default.GetString(data);

                                // "Receive Control File" - 데이터(cf) 전송 ([GATE] -> SmartWhere)
                                this.RequestToSendProcess(data);

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }

                                // "Receive Control File" - 데이터(cf) 전송에 대한 ACK 중계 (SmartWhere -> [GATE] -> Client)
                                this.ResponseToClient(bw);

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }
                            }
                        break;

                        case LpdSubcommandType.ReceiveDataFile:
                            {
                                // 바이트 계산 필요없음(lpr 바이트 계산 사용 : 체크됨)
                                if (Global.Environment.CalculateLprByteSize == false)
                                {
                                    int lengthDataFile = 0;

                                    if (int.TryParse(values[0], out lengthDataFile) == false || lengthDataFile < 1)
                                    {
                                        throw new GateException("Value of Subcommand \"ReceiveDataFile\" is invalid.");
                                    }

                                    // "Receive Data File" - SubCommand 전송 ([GATE] -> SmartWhere)
                                    this.RequestToSendProcess(data);

                                    if (this.IsExitCondition() == true)
                                    {
                                        return;
                                    }

                                    // "Receive Data File" - SubCommand 전송에 대한 ACK 중계 (SmartWhere -> [GATE] -> Client)
                                    this.ResponseToClient(bw);

                                    if (this.IsExitCondition() == true)
                                    {
                                        return;
                                    }

                                    // "Receive Data File" - 데이터(df) 중계 (Client -> [GATE] -> SmartWhere)
                                    this.RequestToSendProcess(br, lengthDataFile);

                                    this.RequestToSendProcess(new byte[] { 0 });
                                }
                                else
                                {
                                    // "Receive Data File" - SubCommand에 대한 ACK 생성하여 Client에 전송 ([GATE] -> Client) (not receiving from SmartWhere)
                                    this.SendLinePrinterAcknowledgement(bw, true);

                                    byte[] binaryDataFile = null;
                                    long    lengthDataFile = 0;

                                    // "Receive Data File" - 데이터(df) 수신 (Client -> [GATE])
                                    if (Global.Environment.AllowedDiskIO == false)
                                    {
                                        // "데이터(df) 수신 :: 메모리
                                        binaryDataFile = this.RecvLinePrinterDataFile(br);

                                        if (binaryDataFile == null)
                                        {
                                            throw new GateException("Fail to Get DataFile :: Memory");
                                        }

                                        lengthDataFile = binaryDataFile.Length;
                                    }
                                    else
                                    {
                                        lengthDataFile = NonByteCheck;
                                    }

                                    // "Receive Data File" - 데이터(df) 크기 측정
                                    values[0] = lengthDataFile.ToString();

                                    // "Receive Data File" - SubCommand의 데이터(df) 크기를 측정량으로 변경
                                    // (IF 'LPR 설정'->'LPR 크기 측정' 사용, THEN 데이터(df) 크기를 int 최대치로 전송)
                                    byte[] binarySubcommand = this.CreateLinePrinterSubcommand(subcommand, values);

                                    if (this.IsExitCondition() == true)
                                    {
                                        return;
                                    }

                                    // "Receive Data File" - (크기가 변경된) SubCommand 전송 ([GATE] -> SmartWhere)
                                    this.RequestToSendProcess(binarySubcommand);

                                    if (this.IsExitCondition() == true)
                                    {
                                        return;
                                    }

                                    // "Send Data File" - 데이터(df) 전송 ([GATE] -> SmartWhere)
                                    Logger.DebugFormat($"Global.Environment.AllowedDiskIO = {Global.Environment.AllowedDiskIO}");
                                    if (Global.Environment.AllowedDiskIO == false)
                                    {
                                        this.RequestToSendProcess(binaryDataFile);
                                    }
                                    else
                                    {
                                        //this.RequestToSendProcess(fileTempSpool);
                                        this.RequestToSendProcess(br, lengthDataFile);
                                    }

                                    //Logger.DebugFormat(">>> QueueRequest에 0 데이터 담기 2");
                                    this.RequestToSendProcess(new byte[] { 0 });
                                }

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }

                                // "Receive Data File" - 데이터(df) 전송에 대한 ACK 중계 (SmartWhere -> [GATE] -> Client)
                                this.ResponseToClient(bw);

                                successJobSend = true;
                                this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                            }
                            return;

                        case LpdSubcommandType.AbortJob:
                        default:
                            {
                                // "Abort Job" - SubCommand 전송 ([GATE] -> SmartWhere)
                                this.RequestToSendProcess(data);

                                if (this.IsExitCondition() == true)
                                {
                                    return;
                                }

                                // "Abort Job" - SubCommand 전송에 대한 ACK 중계 (SmartWhere -> [GATE] -> Client)
                                this.ResponseToClient(bw);

                                successJobSend = false;
                                this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                            }
                            return;
                    }
                }
            }
            catch (Exception ex)
            {
                this.RecvEnd?.Invoke(this, GateEventArgs.Empty);
                Logger.Error(string.Format(GlobalMessageResource.MsgExceptionOccured, @"LPD Subcommand Receiving"), ex);

                this.SendLinePrinterAcknowledgement(bw, false);
            }
            finally
            {
                try
                {
                    if (string.IsNullOrEmpty(strControlFile) == false && Global.Environment.IsJobLogging == true)
                    {
                        // Control 파일 해석
                        LinePrinterControlData controls = new LinePrinterControlData(strControlFile);

                        IPEndPoint clientIP = this.Client?.Client?.RemoteEndPoint as IPEndPoint;

                        // Line Printer Job에 대한 Log 설정
                        GateJobLog jobLog = new GateJobLog()
                        {
                            IsSuccess     = successJobSend,
                            ClientAddress = clientIP.Address,
                            ClientPort    = clientIP.Port,
                            ServerAddress = Global.Environment.SmartWhereIpAddress,
                            ServerPort    = Global.Environment.SmartWherePort,
                            Connection    = this.ConnHashcode,
                            FileName      = controls.GetFileName(),
                            Description   = string.Empty
                        };

                        // Line Printer Job에 대한 Log 기록
                        DatabaseHandler db = new DatabaseHandler();

                        db.InsertJobLog(jobLog);
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format(GlobalMessageResource.MsgExceptionOccured, @"Line Printer Job's Log Writing"), ex);
                }

                try
                {
                    if (fileTempSpool != null && fileTempSpool.Exists == true)
                    {
                        fileTempSpool.Delete();

                        Logger.DebugFormat($"Delete Temp Spool File (conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) - {fileTempSpool.FullName} (length: {fileTempSpool.Length})");
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format(GlobalMessageResource.MsgExceptionOccured, @"Delete to Temp Spool File"), ex);
                }
            }
        }

        private bool IsExitCondition ()
        {
            if (this.CancelToken.IsCancellationRequested == true)
            {
                Logger.DebugFormat($@"=============== ""RecvProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) is CLOSED (TIMED OUT) ===============", this.ConnHashcode);
                return true;
            }

            return false;
        }

        private byte[] CreateLinePrinterSubcommand (LpdSubcommandType subcommand, string[] values)
        {
            if (values == null || values.Length < 1)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "string[]", "values"));
            }

            if (Enum.IsDefined(typeof(LpdSubcommandType), subcommand) == false || subcommand == LpdSubcommandType.None)
            {
                throw new ArgumentException("Line Printer Subcommand is invalid - ", subcommand.ToString());
            }

            string str = string.Join(" ", values);

            byte[] bytesValues = Encoding.ASCII.GetBytes(str);

            byte[] result = new byte[bytesValues.Length + 1];

            result[0] = (byte)subcommand;

            Array.Copy(bytesValues, 0, result, 1, bytesValues.Length);

            return result;
        }

        private void RecvLinePrinterCommand (BinaryReader reader, out byte[] data, out LpdCommandType command, out string[] values)
        {
            if (reader == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryReader", "reader"));
            }

            if (reader.BaseStream.CanRead == false)
            {
                data    = null;
                command = LpdCommandType.None;
                values  = null;
            }

            List<byte> listByte = new List<byte>();

            byte b = 0;

            try
            {
                while (true)
                {
                    b = reader.ReadByte();

                    listByte.Add(b);

                    if (b == (byte)0x0A)
                    {
                        break;
                    }
                }

                if (listByte.Count < 2)
                {
                    throw new Exception("Fail to Get Line Printer Command");
                }

                if (Enum.IsDefined(typeof(LpdCommandType), listByte[0]) == false)
                {
                    throw new InvalidDataException(string.Format("LPD Command is invalid - {0}", listByte[0]));
                }

                string strValues = Encoding.ASCII.GetString(listByte.GetRange(1, listByte.Count - 1).ToArray());

                
                data    = listByte.ToArray();
                command = (LpdCommandType)listByte[0];
                values  = strValues.Split(' ');
            }
            catch (EndOfStreamException)
            {
                Logger.Debug("Client Data stream is end");

                data    = null;
                command = LpdCommandType.None;
                values  = null;
            }
            catch (Exception ex)
            {
                Logger.Debug(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);

                data    = null;
                command = LpdCommandType.None;
                values  = null;
            }
        }

        public void RecvLinePrinterSubcommand (BinaryReader reader, out byte[] data, out LpdSubcommandType command, out string[] values)
        {
            if (reader == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryReader", "reader"));
            }

            if (reader.BaseStream.CanRead == false)
            {
                data    = null;
                command = LpdSubcommandType.None;
                values  = null;
            }

            List<byte> listByte = new List<byte>();

            byte b = 0;

            try
            {
                while (true)
                {
                    b = reader.ReadByte();

                    listByte.Add(b);

                    if (b == (byte)0x0A)
                    {
                        break;
                    }
                }

                if (listByte.Count < 2)
                {
                    throw new Exception("Fail to Get Line Printer Subcommand");
                }

                if (Enum.IsDefined(typeof(LpdSubcommandType), listByte[0]) == false)
                {
                    throw new InvalidDataException(string.Format("LPD SubCommand is invalid - {0}", listByte[0]));
                }

                string strValues = Encoding.ASCII.GetString(listByte.GetRange(1, listByte.Count - 1).ToArray());

                data    = listByte.ToArray();
                command = (LpdSubcommandType)listByte[0];
                values  = strValues.Split(' ');
            }
            catch (EndOfStreamException)
            {
                Logger.Debug("Client Data stream is end");

                data    = null;
                command = LpdSubcommandType.None;
                values  = null;
            }
            catch (Exception ex)
            {
                Logger.Debug(GlobalMessageResource.MsgUnhandledExceptionOccured, ex);

                data    = null;
                command = LpdSubcommandType.None;
                values  = null;
            }
        }

        private void SendLinePrinterAcknowledgement (BinaryWriter bw, bool ack)
        {
            if (bw == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryWriter", "bw"));
            }

            if (ack == true)
            {
                // Positive ACK
                bw.Write(new byte[] { 0x00, 0x00, 0x00, 0x00 });
            }
            else
            {
                // Negative ACK
                bw.Write(new byte[] { 0x00, 0x00, 0x00, 0x01 });
            }
        }

        private byte[] RecvLinePrinterDataFile (BinaryReader br)
        {
            if (br == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryReader", "br"));
            }

            byte[] result = null;

            // "LOOP for REQ" START
            do
            {
                byte[] data = null;

                try
                {
                    data = br.ReadBytes(Global.Environment.BufferSize);
                }
                catch (Exception ex)
                {
                    Logger.Debug($@"Action for ""Connection reset by peer"" ({this.ConnHashcode}) : " + ex.Message, ex);

                    Thread.Sleep(1);
                }

                if (this.CancelToken.IsCancellationRequested == true)
                {
                    return null;
                }

                this.TimeUpdated?.Invoke(this, EventArgs.Empty);

                if (data != null && data.Length > 0)
                {
                    result = Global.Combine(result, data);
                }
                else
                {
                    break;
                }

                if (this.CancelToken.IsCancellationRequested == true)
                {
                    return null;
                }
            }
            while (true);

            return result;
        }

        private void RequestToSendProcess (byte[] data)
        {
            this.QueueRequest.Enqueue(data);

            this.RecvSuccess?.Invoke(this, new GateEventArgs(data.Length));
        }

        private void RequestToSendProcess (BinaryReader br, long lengthDataFile)
        {
            if (br == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryReader", "br"));
            }

            long lengthRequest = 0;
            bool isBufferSize = (lengthDataFile < Global.Environment.BufferSize);
            long bufferSize = isBufferSize ? lengthDataFile : Global.Environment.BufferSize;

            // "LOOP for REQ" START
            do
            {
                byte[] data = null;

                try
                {
                    long remainSize = lengthDataFile - lengthRequest;
                    bool isRemainSize = (remainSize >= bufferSize);
                    data = br.ReadBytes((int)(isRemainSize ? bufferSize : remainSize));
                }
                catch (Exception ex)
                {
                    Logger.Debug(@"Action for ""Connection reset by peer"" : " + ex.Message, ex);

                    Thread.Sleep(1);
                }

                if (this.CancelToken.IsCancellationRequested == true)
                {
                    return;
                }

                this.TimeUpdated?.Invoke(this, EventArgs.Empty);

                if (data != null && data.Length > 0)
                {
                    lengthRequest += data.Length;

                    this.QueueRequest.Enqueue(data);
                    //Logger.DebugFormat($">>> QueueRequest에 Spool 데이터 담기 {QueueRequest.Count}");

                    if (lengthRequest >= lengthDataFile)
                    {
                        Logger.DebugFormat($@"=============== ""RecvProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) EVENT ""RecvSuccess"" Occured (Length: {lengthRequest}) ===============");

                        // "LOOP for REQ" END
                        this.RecvSuccess?.Invoke(this, new GateEventArgs(lengthRequest));
                        break;
                    }
                }
                else
                {
                    Logger.DebugFormat($@"=============== ""RecvProcess"" THREAD(conn: {ConnHashcode}, EndPointPort: {ClientEndPointPort}) EVENT ""RecvSuccess"" Occured data null or length 0 -(Length: {lengthRequest}) ===============");

                    // "LOOP for REQ" END
                    this.RecvSuccess?.Invoke(this, new GateEventArgs(lengthRequest));
                    break;
                }

                if (this.CancelToken.IsCancellationRequested == true)
                {
                    return;
                }
            }
            while (true);
        }

        private void ResponseToClient (BinaryWriter bw)
        {
            if (bw == null)
            {
                throw new ArgumentNullException(string.Format(GlobalMessageResource.MsgArgumentIsNull, "BinaryWriter", "bw"));
            }

            int lengthResponse = 0;

            // "LOOP for RES" START
            do
            {
                if (this.CancelToken.IsCancellationRequested == true)
                {
                    return;
                }

                if (this.QueueResponse.IsEmpty == true || this.QueueResponse.TryDequeue(out byte[] data) == false)
                {
                    if (this.SendProcessIsEnd == true)
                    {
                        // "LOOP for RES" END
                        this.SendProcessIsEnd = false;
                        return;
                    }

                    Thread.Sleep(1);
                    continue;
                }

                if (data == null || data.Length < 1)
                {
                    continue;
                }

                lengthResponse += data.Length;

                bw.Write(data);

                this.TimeUpdated?.Invoke(this, EventArgs.Empty);
            }
            while (true);
        }

        #endregion Methods
    }
}