namespace FXKIS.SmartWhere.ImageLog
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;
    using System.Threading.Tasks;

    using Common.Environment;
    using Common.Extension;

    using CommonIF;
    using Metadata;
    using PDF;



    public static class ImageLogRequestor
    {
        #region Enumerations

        public enum ResultType
        {
            Unknown,

            Success,
            Failed,
            Skip,
            Exception
        }

        #endregion Enumerations



        #region Constants

        private const int BufferSize               = 10240;
        private const int SoapObjectExpectedLength = 12;

        #endregion Constants



        #region Static Methods

        public static ResultType RequestImageLog (this PrnMetadata metadata, SmartWhereEnvironment env, ref string message)
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            string pathPDF = string.Empty;

            try
            {
                ////////////////////////////////////////////////////////////////////////
                // Check PDF Converter
                ////////////////////////////////////////////////////////////////////////

                if (ImageLogRequestor.ExistsConverter(env.ImageLog.PathPdfConverterExecutable, ref message) == false)
                {
                    return ResultType.Skip;
                }



                ////////////////////////////////////////////////////////////////////////
                // Convert Spool to PDF
                ////////////////////////////////////////////////////////////////////////

                PclToPdfConverter converter = ImageLogRequestor.CreatePdfConverter(PclToPdfConverter.ConvertingType.PageTech, env, metadata.PrnInfo.UserIPAddress);

                pathPDF = converter.Convert(metadata.PrnInfo.SpoolName);

                if (string.IsNullOrWhiteSpace(pathPDF) == true || File.Exists(pathPDF) == false)
                {
                    message = string.Format("Failed to Converting PCL-PDF (SPOOL: {0}, CLIENT: {1})", metadata.PrnInfo.SpoolName, metadata.PrnInfo.UserIPAddress);
                    return ResultType.Failed;
                }



                ////////////////////////////////////////////////////////////////////////
                // XML + PDF
                ////////////////////////////////////////////////////////////////////////

                Task<bool> taskImageLog = ImageLogRequestor.SendImageLog(env, metadata, pathPDF);

                taskImageLog.Wait(env.ImageLog.HttpTimeoutMS);

                if (taskImageLog.IsCompleted == false)
                {
                    throw new TimeoutException("ImageLog Request is timed out");
                }

                bool isSuccess = taskImageLog.Result;

                if (isSuccess == false)
                {
                    if (taskImageLog.Exception == null)
                    {
                        message = "Failed to Request an ImageLog data";
                        return ResultType.Failed;
                    }
                    else
                    {
                        message = string.Format("Unhandled Exception Occured during Request to ImageLog (EX: {0})", taskImageLog.Exception.Message);
                        return ResultType.Exception;
                    }
                }

                return ResultType.Success;

                ////////////////////////////////////////////////////////////////////////
            }
            catch (Exception ex)
            {
                message = string.Format("Unhandled Exception Occured during Request to ImageLog (EX: {0})", ex.Message);
                return ResultType.Exception;
            }
            finally
            {
                if (string.IsNullOrWhiteSpace(pathPDF) == false && File.Exists(pathPDF) == true)
                {
                    try
                    {
                        File.Delete(pathPDF);
                    }
                    catch (Exception ex)
                    {
                        message = string.Format("{0}\n{1}\n{2}\n", message, "Failed to Delete an ImageLog PDF file", ex.Message);
                    }
                }
            }
        }

        public static ResultType RequestImageLogWithPDF (this PrnMetadata metadata, SmartWhereEnvironment env, string pathPDF, ref string message)
        {
            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (string.IsNullOrWhiteSpace(pathPDF) == true)
            {
                throw new ArgumentNullException("string pathPDF");
            }

            try
            {
                ////////////////////////////////////////////////////////////////////////
                // Check PDF files
                ////////////////////////////////////////////////////////////////////////

                if (File.Exists(pathPDF) == false)
                {
                    message = string.Format("PDF file is not exists (PATH: {0})", pathPDF);
                    return ResultType.Failed;
                }



                ////////////////////////////////////////////////////////////////////////
                // XML + PDF
                ////////////////////////////////////////////////////////////////////////

                Task<bool> taskImageLog = ImageLogRequestor.SendImageLog(env, metadata, pathPDF);

                taskImageLog.Wait(env.ImageLog.HttpTimeoutMS);

                if (taskImageLog.IsCompleted == false)
                {
                    throw new TimeoutException("ImageLog Request is timed out");
                }

                bool isSuccess = taskImageLog.Result;

                if (isSuccess == false)
                {
                    if (taskImageLog.Exception == null)
                    {
                        message = "Failed to Request an ImageLog data";
                        return ResultType.Failed;
                    }
                    else
                    {
                        message = string.Format("Unhandled Exception Occured during Request to ImageLog (EX: {0})", taskImageLog.Exception.Message);
                        return ResultType.Exception;
                    }
                }

                return ResultType.Success;

                ////////////////////////////////////////////////////////////////////////
            }
            catch (Exception ex)
            {
                message = string.Format("Unhandled Exception Occured during Request to ImageLog (EX: {0})", ex.Message);
                return ResultType.Exception;
            }
            finally
            {
                if (string.IsNullOrWhiteSpace(pathPDF) == false && File.Exists(pathPDF) == true)
                {
                    try
                    {
                        File.Delete(pathPDF);
                    }
                    catch (Exception ex)
                    {
                        message = string.Format("{0}\n{1}\n{2}\n", message, "Failed to Delete an ImageLog PDF file", ex.Message);
                    }
                }
            }
        }

        public static async Task<bool> SendImageLog (SmartWhereEnvironment env, PrnMetadata metadata, string pathPDF)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (metadata == null)
            {
                throw new ArgumentNullException("PrnMetadata metadata");
            }

            if (string.IsNullOrWhiteSpace(pathPDF) == true)
            {
                throw new ArgumentNullException("string pathPDF");
            }

            if (File.Exists(pathPDF) == false)
            {
                throw new FileNotFoundException("ImageLog PDF file is not exists", pathPDF);
            }
            
            string localIPAddress = ImageLogRequestor.GetLocalIPAddress();



            ////////////////////////////////////////////////////////////////////////
            // Create a ImageLog Information data
            ////////////////////////////////////////////////////////////////////////

            ImageLogInformation imagelogInfo = new ImageLogInformation();

            if (imagelogInfo == null)
            {
                throw new InvalidOperationException("Failed to Create an ImageLog Information data");
            }

            imagelogInfo.DeviceHostAddress = localIPAddress;



            ////////////////////////////////////////////////////////////////////////
            // Create a ImageLog Information data
            ////////////////////////////////////////////////////////////////////////

            JobLogInformation joblog = JobLogInformation.Create(Guid.NewGuid().CreateString(), metadata);

            if (joblog == null)
            {
                throw new InvalidOperationException("Failed to Create an JobLog Information data");
            }

            joblog.NetInJobInfo.HostAddress = localIPAddress;



            ////////////////////////////////////////////////////////////////////////
            // Send a HTTP Request & Receive a HTTP Response
            ////////////////////////////////////////////////////////////////////////

            string contentID  = string.Format("ImageLog{0}", Guid.NewGuid().CreateString(false, true));
            string contentID1 = contentID + "-1";
            string contentID2 = contentID + "-2";

            string boundary = string.Format(Constants.SOAP.Format.Boundary, Guid.NewGuid().CreateString(false, true));

            imagelogInfo.ListContentID.Add(contentID1);
            imagelogInfo.ListContentID.Add(contentID2);



            ////////////////////////////////////////////////////////////////////////
            // Create a HTTP SOAP Message
            ////////////////////////////////////////////////////////////////////////

            string headerSOAP      = string.Empty;

            string headerAttribute = HTTP.ContentHeader.CreateAttributes().ToString(boundary);
            string bodyAttribute   = imagelogInfo.ToXmlString();

            string headerPDF       = HTTP.ContentHeader.CreatePDF(contentID1).ToString(boundary);
            byte[] binaryPDF       = FileObjectManagement.LoadBinary(pathPDF);
            byte[] endPDF          = new byte[] { (byte)0x0D, (byte)0x0A };

            string headerJobLog    = HTTP.ContentHeader.CreateJobLog(contentID2).ToString(boundary);
            string bodyJobLog      = joblog.ToXmlString();

            string endSOAP         = string.Format(Constants.SOAP.Format.End, boundary);



            ////////////////////////////////////////////////////////////////////////
            // HTTP SOAP :: Request & Response
            ////////////////////////////////////////////////////////////////////////

            long contentLength = ImageLogRequestor.SoapObjectExpectedLength + headerAttribute.Length + bodyAttribute.Length + headerPDF.Length + binaryPDF.Length + headerJobLog.Length + bodyJobLog.Length + endSOAP.Length;

            using (TcpClient client = new TcpClient(env.ImageLog.ServerHost, env.ImageLog.ServerPort))
            {
                IPEndPoint local = (IPEndPoint)client.Client.LocalEndPoint;

                headerSOAP = ImageLogRequestor.CreateHttpHeaderString(boundary, env.ImageLog.ServerHost, env.ImageLog.ServerPort, contentLength);

                using (NetworkStream ns = client.GetStream())
                {
                    using (BinaryWriter bw = new BinaryWriter(ns))
                    using (BinaryReader br = new BinaryReader(ns))
                    {
                        // Send a SOAP Message
                        bw.Write(Encoding.UTF8.GetBytes(headerSOAP));
                        {
                            // Attributes
                            bw.Write(Encoding.UTF8.GetBytes(headerAttribute));
                            bw.Write(Encoding.UTF8.GetBytes(bodyAttribute));

                            // PDF
                            bw.Write(Encoding.UTF8.GetBytes(headerPDF));
                            bw.Write(binaryPDF);
                            bw.Write(endPDF);

                            // Job Log
                            bw.Write(Encoding.UTF8.GetBytes(headerJobLog));
                            bw.Write(Encoding.UTF8.GetBytes(bodyJobLog));
                        }
                        bw.Write(Encoding.UTF8.GetBytes(endSOAP));

                        // Receive a Response result
                        byte[] result = br.ReadBytes(ImageLogRequestor.BufferSize);

                        string str = Encoding.UTF8.GetString(result);

                        if (string.IsNullOrWhiteSpace(str) == true)
                        {
                            return false;
                        }

                        str = str.Trim();

                        if (string.Compare(str, Constants.SOAP.Result.Success, true) != 0)
                        {
                            return false;
                        }

                        return true;
                    }
                }
            }

            ////////////////////////////////////////////////////////////////////////
        }

        private static string GetLocalIPAddress ()
        {
            string localIP = string.Empty;

            List<IPAddress> listIP = IPAddressEx.GetLocalIPv4Addresses();

            if (listIP == null || listIP.Count < 1)
            {
                localIP = "127.0.0.1";
            }
            else
            {
                foreach (IPAddress ip in listIP)
                {
                    if (ip.AddressFamily != AddressFamily.InterNetwork)
                    {
                        continue;
                    }

                    string strIP = ip.ToString();

                    if (strIP == "127.0.0.1" || strIP == "0.0.0.0")
                    {
                        continue;
                    }

                    localIP = strIP;
                    break;
                }

                if (string.IsNullOrWhiteSpace(localIP) == true)
                {
                    localIP = "127.0.0.1";
                }
            }

            return localIP;
        }

        private static bool ExistsConverter (string pathConverter, ref string message)
        {
            if (string.IsNullOrWhiteSpace(pathConverter) == true)
            {
                message = "Path of PDF Converter is empty";
                return false;
            }

            string pathPdfConverter = pathConverter;

            if (Path.IsPathRooted(pathPdfConverter) == false)
            {
                pathPdfConverter = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathPdfConverter);
            }

            if (File.Exists(pathPdfConverter) == false)
            {
                message = string.Format("PDF Converter is not exists (PATH: {0})", pathPdfConverter);
                return false;
            }

            return true;
        }

        private static string CreateHttpHeaderString (string boundary, string host, int port, long contentLength)
        {
            if (string.IsNullOrWhiteSpace(boundary) == true)
            {
                throw new ArgumentNullException("string boundary");
            }

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

            if (contentLength < 1)
            {
                throw new ArgumentOutOfRangeException("int contentLength", contentLength, string.Format("Content-length is less than 1 ({0} < 1)", contentLength));
            }

            string header =
                "POST /axis/capture/jf HTTP/1.1\r\n" +
                string.Format("Host: {0}:{1}\r\n", host, port) +
                "Accept: */*\r\n" +
                "SOAPAction: putRecord\r\n" +
                "Content-Transfer-Encoding: 8bit\r\n" +
                "MIME-Version: 1.0\r\n" +
                "Content-Type: multipart/related; type=\"text/xml\"; boundary=\"" + boundary + "\"\r\n" +
                "Connection: close\r\n" +
                string.Format("Content-Length: {0}\r\n", contentLength) +
                "Expect: 100-continue\r\n\r\n\r\n";

            return header;
        }

        private static PclToPdfConverter CreatePdfConverter (PclToPdfConverter.ConvertingType type, SmartWhereEnvironment env, string userIP)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (string.IsNullOrWhiteSpace(userIP) == true)
            {
                throw new ArgumentNullException("string userIP");
            }



            ////////////////////////////////////////////////////////////////////////

            string pathSpoolDir    = Path.Combine(env.Common.PathSpoolDirectory,              userIP);
            string pathImageLogDir = Path.Combine(env.Common.PathImageLogProcessingDirectory, userIP);

            if (Path.IsPathRooted(pathSpoolDir) == false)
            {
                pathSpoolDir = Path.Combine(env.Common.PathSmartWhereDataRootDirectory, pathSpoolDir);
            }

            if (Path.IsPathRooted(pathImageLogDir) == false)
            {
                pathImageLogDir = Path.Combine(env.Common.PathSmartWhereDataRootDirectory, pathImageLogDir);
            }

            ////////////////////////////////////////////////////////////////////////

            PclToPdfConverter converter = new PclToPdfConverter(type);

            converter.PathConverterExecutable = env.ImageLog.PathPdfConverterExecutable;
            converter.PathConverterReference  = env.ImageLog.PathPdfConverterReference;
            converter.PathSpoolDirectory      = pathSpoolDir;
            converter.PathProcessingDirectory = pathImageLogDir;
            converter.RetryCount              = env.ImageLog.ConvertRetryCount;
            converter.RetryIntervalMS         = env.ImageLog.ConvertRetryIntervalMS;
            
            ////////////////////////////////////////////////////////////////////////

            return converter;
        }

        #endregion Static Methods
    }



    /// <summary>
    /// static class :: ImageLogRequestorUtility (for Extension Methods)
    /// </summary>
    public static class ImageLogRequestorUtility
    {
        public static string CreateString (this Guid guid, bool isExistsDash = true, bool isUpper = false)
        {
            if (guid == null)
            {
                throw new ArgumentNullException("this Guid guid");
            }

            string uuid = string.Empty;

            if (isExistsDash == true)
            {
                uuid = guid.ToString();
            }
            else
            {
                uuid = guid.ToString("N");
            }

            if (isUpper == true)
            {
                uuid = uuid.ToUpper();
            }

            return uuid;
        }
    }
}