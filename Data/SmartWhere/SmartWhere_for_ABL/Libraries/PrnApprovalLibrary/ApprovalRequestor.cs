namespace FXKIS.SmartWhere.Approval
{
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;

    using Common.Extension;

    using CommonIF;
    using Metadata;
    using PDF;



    public static class ApprovalRequestor
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



        #region Static Methods

        public static ResultType RequestApproval (this PrnMetadata metadata, SmartWhereEnvironment env, ref string message)
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

                if (ApprovalRequestor.ExistsConverter(env.Approval.PathPdfConverterExecutable, ref message) == false)
                {
                    return ResultType.Skip;
                }



                ////////////////////////////////////////////////////////////////////////
                // Create a Approval Information data
                ////////////////////////////////////////////////////////////////////////

                ApprovalInformation approvalInfo = new ApprovalInformation(metadata);

                if (approvalInfo == null)
                {
                    message = "Failed to Create an Approval Information data";
                    return ResultType.Failed;
                }



                ////////////////////////////////////////////////////////////////////////
                // Convert Spool to PDF
                ////////////////////////////////////////////////////////////////////////

                PclToPdfConverter converter = ApprovalRequestor.CreatePdfConverter(PclToPdfConverter.ConvertingType.PageTech, env, metadata.PrnInfo.UserIPAddress);

                pathPDF = converter.Convert(metadata.PrnInfo.SpoolName);

                if (string.IsNullOrWhiteSpace(pathPDF) == true || File.Exists(pathPDF) == false)
                {
                    message = string.Format("Failed to Converting PCL-PDF (SPOOL: {0}, CLIENT: {1})", metadata.PrnInfo.SpoolName, metadata.PrnInfo.UserIPAddress);
                    return ResultType.Failed;
                }



                ////////////////////////////////////////////////////////////////////////
                // XML + PDF
                ////////////////////////////////////////////////////////////////////////

                Task<bool> taskApproval = ApprovalRequestor.SendApproval(env, approvalInfo, pathPDF);

                taskApproval.Wait(env.Approval.HttpTimeoutMS);

                if (taskApproval.IsCompleted == false)
                {
                    throw new TimeoutException("Approval Request is timed out");
                }

                bool isSuccess = taskApproval.Result;

                if (isSuccess == false)
                {
                    if (taskApproval.Exception == null)
                    {
                        message = "Failed to Request an Approval data";
                        return ResultType.Failed;
                    }
                    else
                    {
                        message = string.Format("Unhandled Exception Occured during Request to Approval (EX: {0})", taskApproval.Exception.Message);
                        return ResultType.Exception;
                    }
                }

                message = SerializationEx.ObjectToJson(approvalInfo);            
                return ResultType.Success;

                ////////////////////////////////////////////////////////////////////////
            }
            catch (Exception ex)
            {
                message = string.Format("Unhandled Exception Occured during Request to Approval (EX: {0})", ex.Message);
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
                        message = string.Format("{0}\n{1}\n{2}\n", message, "Failed to Delete an Approval PDF file", ex.Message);
                    }
                }
            }
        }

        public static async Task<bool> SendApproval (SmartWhereEnvironment env, ApprovalInformation approvalInfo, string pathPDF)
        {
            if (env == null)
            {
                throw new ArgumentNullException("SmartWhereEnvironment env");
            }

            if (approvalInfo == null)
            {
                throw new ArgumentNullException("ApprovalInformation approvalInfo");
            }

            if (string.IsNullOrWhiteSpace(pathPDF) == true)
            {
                throw new ArgumentNullException("string pathPDF");
            }

            if (File.Exists(pathPDF) == false)
            {
                throw new FileNotFoundException("Approval PDF file is not exists", pathPDF);
            }



            ////////////////////////////////////////////////////////////////////////
            // Create a XML string
            ////////////////////////////////////////////////////////////////////////

            string strApprovalXML = approvalInfo.ToXmlString();



            ////////////////////////////////////////////////////////////////////////
            // Send a HTTP Request & Receive a HTTP Response
            ////////////////////////////////////////////////////////////////////////

            FileInfo filePDf = new FileInfo(pathPDF);

            using (MemoryStream ms = new MemoryStream())
            {
                byte[] binaryXML = Encoding.UTF8.GetBytes(strApprovalXML);

                ms.Write(binaryXML, 0, binaryXML.Length);
                ms.Seek(0, SeekOrigin.Begin);

                ////////////////////////////////////////////////////////////////////////

                using (FileStream fs = filePDf.OpenRead())
                {
                    using (HttpClient client = new HttpClient())
                    {
                        using (MultipartFormDataContent multipart = new MultipartFormDataContent())
                        {
                            ////////////////////////////////////////////////////////////////////////

                            string pathXML = string.Format("{0}{1}", Path.GetFileNameWithoutExtension(pathPDF), Constants.Extension.XML);

                            // Approval WebService에서 Full Path를 요구함. (XML 저장하지 않으므로 가상의 Full Path를 적용)
                            pathXML = Path.Combine(env.Common.PathApprovalProcessingDirectory, pathXML);

                            if (Path.IsPathRooted(pathXML) == false)
                            {
                                pathXML = Path.Combine(env.Common.PathSmartWhereDataRootDirectory, pathXML);
                            }

                            ////////////////////////////////////////////////////////////////////////

                            using (StreamContent xml = new StreamContent(ms))
                            {
                                using (StreamContent pdf = new StreamContent(fs))
                                {
                                    xml.Headers.Add(Constants.HTML.Header.ContentType, Constants.HTML.MediaType.OctetStream);
                                    pdf.Headers.Add(Constants.HTML.Header.ContentType, Constants.HTML.MediaType.OctetStream);

                                    multipart.Add(xml, Constants.HTML.ContentDisposition.Name.XML,       pathXML);
                                    multipart.Add(pdf, Constants.HTML.ContentDisposition.Name.Attribute, filePDf.FullName);

                                    using (HttpResponseMessage response = await client.PostAsync(env.Approval.WebServiceURI, multipart))
                                    {
                                        if (response == null)
                                        {
                                            return false;
                                        }

                                        string strResponse = await response.Content.ReadAsStringAsync();

                                        if (string.IsNullOrEmpty(strResponse) == true)
                                        {
                                            return false;
                                        }

                                        if (string.Compare(strResponse.Trim(), Constants.SOAP.Result.Success, true) != 0)
                                        {
                                            return false;
                                        }

                                        return true;
                                    }
                                }
                            }

                            ////////////////////////////////////////////////////////////////////////
                        }
                    }
                }

                ////////////////////////////////////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////
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
            string pathApprovalDir = Path.Combine(env.Common.PathApprovalProcessingDirectory, userIP);

            if (Path.IsPathRooted(pathSpoolDir) == false)
            {
                pathSpoolDir = Path.Combine(env.Common.PathSmartWhereDataRootDirectory, pathSpoolDir);
            }

            if (Path.IsPathRooted(pathApprovalDir) == false)
            {
                pathApprovalDir = Path.Combine(env.Common.PathSmartWhereDataRootDirectory, pathApprovalDir);
            }

            ////////////////////////////////////////////////////////////////////////

            PclToPdfConverter converter = new PclToPdfConverter(type);

            converter.PathConverterExecutable = env.Approval.PathPdfConverterExecutable;
            converter.PathConverterReference  = env.Approval.PathPdfConverterReference;
            converter.PathSpoolDirectory      = pathSpoolDir;
            converter.PathProcessingDirectory = pathApprovalDir;
            converter.RetryCount              = env.Approval.ConvertRetryCount;
            converter.RetryIntervalMS         = env.Approval.ConvertRetryIntervalMS;

            return converter;
        }

        #endregion Static Methods
    }
}