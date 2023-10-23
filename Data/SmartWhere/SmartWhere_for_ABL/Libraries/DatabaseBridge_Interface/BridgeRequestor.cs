namespace FXKIS.SmartWhere.DBBridge
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Sockets;
    using System.Text;
    using System.Threading;

    using Common.Extension;



    public class BridgeRequestor : IDisposable
    {
        #region Constants

        private const string DefaultSecretKeyForAES256 = "<//SmartWhere_Database_Bridge_Service//>";

        #endregion Constants



        #region Properties

        private TcpClient Connection { get; set; }
        public  string    Host       { get; set; }
        public  int       Port       { get; set; }

        #endregion Properties



        #region Constructors

        public BridgeRequestor (string host, int port)
        {
            this.InitializeProperties();

            if (string.IsNullOrWhiteSpace(host) == true)
            {
                throw new ArgumentNullException("string host");
            }

            if (port < 0)
            {
                throw new ArgumentOutOfRangeException("int port", port, string.Format("Port value is less than 0 ({0} < {1})", port, 0));
            }

            if (port > 65535)
            {
                throw new ArgumentOutOfRangeException("int port", port, string.Format("Port value is greater than 65535 ({0} > {1})", port, 65535));
            }

            this.Host = host;
            this.Port = port;
        }

        #endregion Constructors



        #region Methods :: Request to Response


        public BridgeResponse RequestToResponse (BridgeRequest request, string secretKey = null, int timeout = -1)
        {
            if (request == null)
            {
                throw new ArgumentNullException("BridgeRequest request");
            }

            if (request.Type == BridgeRequest.RequestType.Unknown)
            {
                throw new InvalidDataException(string.Format("Request Type is invalid (TYPE: {0})", request.Type.ToString()));
            }

            if (string.IsNullOrWhiteSpace(request.Message) == true)
            {
                throw new InvalidDataException("Message is empty");
            }

            if (string.IsNullOrWhiteSpace(secretKey) == true)
            {
                secretKey = BridgeRequestor.DefaultSecretKeyForAES256;
            }

            string jsonRequest  = string.Empty;
            string jsonResponse = string.Empty;

            string encryptedRequest  = string.Empty;
            string encryptedResponse = string.Empty;

            jsonRequest = SerializationEx.ObjectToJson(request);

            encryptedRequest = CryptographyEx.AESEncrypt256ToBase64(jsonRequest, secretKey);
            encryptedRequest += '\n';

            using (this.Connection = new TcpClient(this.Host, this.Port))
            {
                using (NetworkStream ns = this.Connection.GetStream())
                {
                    ns.ReadTimeout = timeout;
                    ns.WriteTimeout = timeout;

                    BinaryWriter bw = null;

                    try
                    {
                        bw = new BinaryWriter(ns);

                        bw.Write(Encoding.Default.GetBytes(encryptedRequest));

                        ////////////////////////////////////////////////////////////////////////////////////////////
                        
                        encryptedResponse = ns.ReadLine();

                        if (string.IsNullOrWhiteSpace(encryptedResponse) == true)
                        {
                            return null;
                        }

                        jsonResponse = CryptographyEx.AESDecrypt256FromBase64(encryptedResponse, secretKey);

                        if (string.IsNullOrWhiteSpace(jsonResponse) == true)
                        {
                            return null;
                        }

                        return SerializationEx.JsonToObject<BridgeResponse>(jsonResponse);
                    }
                    catch
                    {
                        return null;
                    }
                    finally
                    {
                        try
                        {
                            if (bw != null)
                            {
                                bw.Close();
                            }
                        }
                        catch { }
                    }
                }
            }
        }

        public BridgeResponse RequestToResponseContinuously (BridgeRequest request, string secretKey = null)
        {
            if (request == null)
            {
                throw new ArgumentNullException("BridgeRequest request");
            }

            if (request.Type == BridgeRequest.RequestType.Unknown)
            {
                throw new InvalidDataException(string.Format("Request Type is invalid (TYPE: {0})", request.Type.ToString()));
            }

            if (string.IsNullOrWhiteSpace(request.Message) == true)
            {
                throw new InvalidDataException("Message is empty");
            }

            if (string.IsNullOrWhiteSpace(secretKey) == true)
            {
                secretKey = BridgeRequestor.DefaultSecretKeyForAES256;
            }

            string jsonRequest  = string.Empty;
            string jsonResponse = string.Empty;

            string encryptedRequest  = string.Empty;
            string encryptedResponse = string.Empty;

            jsonRequest = SerializationEx.ObjectToJson(request);

            encryptedRequest = CryptographyEx.AESEncrypt256ToBase64(jsonRequest, secretKey);
            encryptedRequest += '\n';

            if (this.Connection == null || this.Connection.Connected == false)
            {
                this.Connection = new TcpClient(this.Host, this.Port);
            }

            using (NetworkStream ns = this.Connection.GetStream())
            {
                BinaryWriter bw = null;

                try
                {
                    bw = new BinaryWriter(ns);

                    bw.Write(Encoding.Default.GetBytes(encryptedRequest));

                    ////////////////////////////////////////////////////////////////////////////////////////////

                    encryptedResponse = ns.ReadLine();

                    if (string.IsNullOrWhiteSpace(encryptedResponse) == true)
                    {
                        return null;
                    }

                    jsonResponse = CryptographyEx.AESDecrypt256FromBase64(encryptedResponse, secretKey);

                    if (string.IsNullOrWhiteSpace(jsonResponse) == true)
                    {
                        return null;
                    }

                    return SerializationEx.JsonToObject<BridgeResponse>(jsonResponse);
                }
                catch
                {
                    return null;
                }
                finally
                {
                    try
                    {
                        if (bw != null)
                        {
                            bw.Close();
                        }
                    }
                    catch { }
                }
            }
        }

        #endregion Methods :: Request to Response



        #region Methods

        private void InitializeProperties ()
        {
            this.Host = string.Empty;
            this.Port = 0;
        }

        public void Dispose ()
        {
            try
            {
                if (this.Connection != null)
                {
                    this.Connection.Close();
                }
            }
            catch { }
        }

        public void Close ()
        {
            this.Dispose();
        }

        #endregion Methods
    }



    /// <summary>
    /// static class :: BridgeRequestorUtility (for Extension Methods)
    /// </summary>
    public static class BridgeRequestorUtility
    {
        public static string ReadLineByStream (Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream");
            }

            if (stream.CanRead == false)
            {
                throw new InvalidOperationException("This stream can not read");
            }

            string strLine = string.Empty;
            int ch = -1;

            List<byte> listBinary = new List<byte>();

            while (true)
            {
                ch = stream.ReadByte();

                if (ch == '\n')
                {
                    break;
                }

                if (ch == '\r')
                {
                    continue;
                }

                if (ch < 0)
                {
                    Thread.Sleep(1);
                    continue;
                }

                listBinary.Add((byte)ch);
            }

            return Encoding.Default.GetString(listBinary.ToArray());
        }

        public static string ReadLine (this Stream stream)
        {
            if (stream == null)
            {
                throw new ArgumentNullException("Stream stream");
            }

            return BridgeRequestorUtility.ReadLineByStream(stream);
        }
    }
}
