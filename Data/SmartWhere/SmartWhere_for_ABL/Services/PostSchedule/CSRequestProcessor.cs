namespace FXKIS.SmartWhere.PostSchedule.CSIF
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.IO;
    using System.Linq;

    using log4net;
    
    using Common.Environment;
    using Common.Extension;

    using CommonIF;
    using FXKIS.SmartWhere.DBBridge;
    using System.DirectoryServices.AccountManagement;

    public class CSRequestProcessor
    {
        #region Constants :: Response

        private const string StatusSuccess        = @"success";
        private const string StatusFail           = @"fail";
        private const string StatusException      = @"fail";
        private const string StatusNoResult       = @"noResult";
        private const string StatusUserIdIsNull   = @"useridNull";
        private const string StatusDeviceIpIsNull = @"deviceIpNull";
        private const string StatusWsIpIsNull     = @"wsIpNull";

        private const string ResultForceBlack     = @"forcedBlack";
        private const string ResultLimitBlack     = @"limitBlack";
        private const string ResultLimitColor     = @"limitColor";
        private const string ResultLimitCount     = @"limitCount";

        #endregion Constants :: Response



        #region Constants :: Values

        private const string ValueSimplex         = @"S";
        private const string ValueDuplexLongEdge  = @"DL";
        private const string ValueDuplexShortEdge = @"DS";
        private const string ValueColor           = @"C";
        private const string ValueBlackWhite      = @"B";
        private const string ValueImageLogLinkage = @"M";
        private const string ValueFlagYes         = @"Y";
        private const string ValueFlagNo          = @"N";

        #endregion Constants :: Values



        #region Constants :: about PrintJob File

        private const string ExtensionJSON  = ".json";
        private const string ExtensionPDF   = ".pdf";
        private const string FormatJsonName = "{0}_{1}_{2}_{3:00}.json";

        #endregion Constants :: about PrintJob File



        #region Constants

        private const string SecretKeyForAES256 = "<//SmartWhere_for_ABL//_developed_by_[FXKIS_SEC]>";

        private const int    MaximumPrintJobInINI  = 40;
        private const int    MaximumPrintJobInJson = 40;

        private const string FileNameHeaderControlFile = @"cf";
        private const string FileNameHeaderDataFile    = @"df";

        #endregion Constants



        #region Events

        public event EventHandler<PrintEventArgs> PrintExecuted;

        #endregion Events



        #region Properties

        public SmartWhereEnvironment Environment { private get; set; }

        #endregion Properties



        #region Variables :: Logger (Log4net)

        public static readonly ILog Logger = LogManager.GetLogger(typeof(CSHttpProcess));

        #endregion Variables :: Logger (Log4net)



        #region Constructors

        public CSRequestProcessor (SmartWhereEnvironment env)
        {
            if (env == null)
            {
                throw new ArgumentNullException("ServiceEnvironment env");
            }

            this.Environment = env;
        }

        #endregion Constructors



        #region Methods :: Process

        public void Process (CSMessage message, string jobTicket = null)
        {
            if (message == null)
            {
                throw new ArgumentNullException("CSMessage message");
            }

            // ===================================================================================
            //  INTERACT from MFD (EWB Browser: JSON message)
            // ===================================================================================
            //   - GetUsagePrnCnt   : CSRequestCommon
            //   - GetPrnListPolicy : CSRequestCommon
            //   - RegisterCard     : CSRequestRegisterCard
            //   - DeleteSelected   : CSRequestDeleteSelected
            //   - PrintSelected    : CSRequestPrintSelected
            //   - PrintAll         : CSRequestPrintAll
            // ===================================================================================

            switch (message.Type)
            {
                case CSMessage.RequestType.GetUsagePrnCnt:
                    message.Response = this.ProcessGetUsagePrnCnt   (message.Request);
                    break;

                case CSMessage.RequestType.GetPrnListPolicy:
                    message.Response = this.ProcessGetPrnListPolicy (message.Request);
                    break;                                              

                case CSMessage.RequestType.RegisterCard:
                    message.Response = this.ProcessRegisterCard     (message.Request);
                    break;

                case CSMessage.RequestType.DeleteSelected:
                    message.Response = this.ProcessDeleteSelected   (message.Request);
                    break;

                case CSMessage.RequestType.PrintSelected:
                    message.Response = this.ProcessPrintSelected    (message.Request, jobTicket);
                    break;

                case CSMessage.RequestType.PrintAll:
                    message.Response = this.ProcessPrintAll         (message.Request, jobTicket);
                    break;

                default:
                    throw new NotSupportedException(string.Format("METHOD {0} is not supported in this service.", message.Type.ToString()));
            }
        }

        private CSResponseGetUsagePrnCnt ProcessGetUsagePrnCnt (CSRequestBase objRequest)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestCommon objRequest");
            }

            if ((objRequest is CSRequestCommon) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestCommon          request  = objRequest as CSRequestCommon;
            CSResponseGetUsagePrnCnt response = new CSResponseGetUsagePrnCnt();

            try
            {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, StoredProcedure.GetUsagePrnCnt.Name);

                /////////////////////////////////////////////////////////
                // PART of QUERY (userID/deviceIP -> UsageInformation)
                /////////////////////////////////////////////////////////

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.InputUserID ,         BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.InputDeviceIP,        BridgeParameterInfo.ParameterType.Input) { Value = request.deviceIp });
                                                                                                                        
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputUserID,         BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputPrnCount,       BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputFunctionCtrl,   BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputUsedColor,      BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputUsedGray,       BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputLimitColor,     BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputLimitGray,      BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputOverCountPrint, BridgeParameterInfo.ParameterType.Output));

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputStatus,         BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetUsagePrnCnt.OutputResultMsg,      BridgeParameterInfo.ParameterType.Output));

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, CSRequestProcessor.SecretKeyForAES256);

                    if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                    {
                        response.status = CSRequestProcessor.StatusFail;

                        return response;
                    }

                    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    response.result = new UsageInformation()
                    {
                        userId         = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputUserID].ToString(),
                        prnCount       = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputPrnCount].ToInteger(),
                        functionCtrl   = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputFunctionCtrl].ToInteger(),
                        usedColor      = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputUsedColor].ToInteger(),
                        usedGray       = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputUsedGray].ToInteger(),
                        limitColor     = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputLimitColor].ToInteger(),
                        limitGray      = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputLimitGray].ToInteger(),
                        overCountPrint = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputOverCountPrint].ToString()
                    };

                    response.status = responseBridge.Parameters[StoredProcedure.GetUsagePrnCnt.OutputStatus].ToString();
                }
                return response;
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            }
            catch
            {
                response.status = CSRequestProcessor.StatusException;
            }

            return response;
        }


        public CSResponseGetPrnListPolicy ProcessGetPrnListPolicy(CSRequestBase objRequest)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestBase objRequest");
            }

            if ((objRequest is CSRequestCommon) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestCommon            request  = objRequest as CSRequestCommon;
            CSResponseGetPrnListPolicy response = new CSResponseGetPrnListPolicy();

            int  limit         = this.Environment.PostScheduler.DocumentListLimitCount;
            bool isDescending  = this.Environment.PostScheduler.IsListDescending;
            int  sorting       = (isDescending == true ? 0 : 1);
            uint serviceIdx    = (uint)this.Environment.PostScheduler.ServerIndex;

            try
            {
                PrintFile prn = null;

                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadFromStoredProcedure, StoredProcedure.GetPrnListPolicy.Name);

                ////////////////////////////////////////////////////////////
                // PART of QUERY (userID/deviceIP -> PrintListInformation)
                ////////////////////////////////////////////////////////////

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.InputUserID,       BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.InputDeviceIP,     BridgeParameterInfo.ParameterType.Input) { Value = request.deviceIp });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.InputLimitCount,   BridgeParameterInfo.ParameterType.Input) { Value = limit });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.InputSorting,      BridgeParameterInfo.ParameterType.Input) { Value = sorting });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.InputServiceIndex, BridgeParameterInfo.ParameterType.Input) { Value = serviceIdx });

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputDefaultBlack, BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputForcedBlack,  BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputForcedDuplex, BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputForced2Up,    BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputPrintAgain,   BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputFunctionCtrl, BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputPrnCount,     BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputUserID,       BridgeParameterInfo.ParameterType.Output));

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputStatus,    BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.GetPrnListPolicy.OutputResultMsg, BridgeParameterInfo.ParameterType.Output));

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, CSRequestProcessor.SecretKeyForAES256);

                    if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                    {
                        response.status = CSRequestProcessor.StatusFail;

                        return response;
                    }

                    foreach (ResponseRowData row in responseBridge.ListRowData)
                    {
                        try
                        {
                            prn = new PrintFile()
                            {
                                uuId       = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnUUID       ].ToString(),
                                docName    = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnDocName    ].ToString(),
                                printDate  = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnRcdTime    ].ToString(),
                                pageCnt    = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnTotalPages ].ToInteger(),
                                printCnt   = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnCopies     ].ToInteger(),
                                prnType    = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnPrnType    ].ToString(),
                                driverType = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnDriverType ].ToString(),
                                SRCnUp     = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnSrcNup     ].ToInteger(),
                                nUp        = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnDestNup    ].ToInteger(),
                                color      = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnSrcColor   ].ToString(),
                                destColor  = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnDestColor  ].ToString(),
                                duplex     = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnSrcDuplex  ].ToString(),
                                useYn      = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnUseYN      ].ToString(),
                                jobStatus  = row.DictionaryRowData[StoredProcedure.GetPrnListPolicy.ColumnJobStatus  ].ToInteger()
                            };

                            response.result.prnList.Add(prn);
                        }
                        catch
                        {
                            continue;
                        }
                    }

                    response.result.userInfo = new UserInformation()
                    {
                        userId       = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputUserID       ].ToString(),
                        prnCount     = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputPrnCount     ].ToInteger(),
                        functionCtrl = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputFunctionCtrl ].ToInteger(),
                        defaultBlack = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputDefaultBlack ].ToString(),
                        forcedBlack  = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputForcedBlack  ].ToString(),
                        forcedDuplex = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputForcedDuplex ].ToString(),
                        forced2Up    = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputForced2Up    ].ToString(),
                        printAgain   = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputPrintAgain   ].ToString(),
                        serverIdx    = serviceIdx
                    };

                    // 강제 양면 일괄 설정
                    this.ApplyForcedDuplex(response.result.userInfo.forcedDuplex, response.result.prnList);

                    // 강제 2up 일괄 설정
                    this.Apply2up(response.result.userInfo.forced2Up, response.result.prnList);

                    response.status = responseBridge.Parameters[StoredProcedure.GetPrnListPolicy.OutputStatus].ToString();
                }
            }
            catch
            {
                response.status = CSRequestProcessor.StatusException;
            }

            return response;
        }


        private CSResponseBase ProcessRegisterCard (CSRequestBase objRequest)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestBase objRequest");
            }

            if ((objRequest is CSRequestRegisterCard) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestRegisterCard  request  = objRequest as CSRequestRegisterCard;
            CSResponseRegisterCard response = new CSResponseRegisterCard();

            try
            {
                BridgeRequest requestBridge = null;

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // AD 계정 검증 추가 (for ABL)
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                bool isValidAD = false;

                try
                {
                    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, this.Environment.PostScheduler.ActiveDirectoryDomain))
                    {
                        // compute hase for user pw
                        string pw = string.Empty;

                        switch (this.Environment.PostScheduler.ActiveDirectoryHashMode)
                        {
                            case PostSchedulerEnvironment.ActiveDirectoryHashType.Normal:
                                pw = request.userPw;
                                break;

                            case PostSchedulerEnvironment.ActiveDirectoryHashType.MD5:
                                pw = CryptographyEx.ComputeHashFromStringToHex(request.userPw, CryptographyEx.HashAlgorithmType.MD5);
                                break;

                            case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA1:
                                pw = CryptographyEx.ComputeHashFromStringToHex(request.userPw, CryptographyEx.HashAlgorithmType.SHA1);
                                break;

                            case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA256:
                                pw = CryptographyEx.ComputeHashFromStringToHex(request.userPw, CryptographyEx.HashAlgorithmType.SHA256);
                                break;

                            case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA512:
                                pw = CryptographyEx.ComputeHashFromStringToHex(request.userPw, CryptographyEx.HashAlgorithmType.SHA512);
                                break;

                            case PostSchedulerEnvironment.ActiveDirectoryHashType.SHA384:
                                pw = CryptographyEx.ComputeHashFromStringToHex(request.userPw, CryptographyEx.HashAlgorithmType.SHA384);
                                break;

                            default:
                                throw new NotSupportedException(string.Format("Hash mode is not supported (TYPE: {0})", this.Environment.PostScheduler.ActiveDirectoryHashMode));
                        }

                        // validate the credentials
                        // (refs: https://stackoverflow.com/questions/326818/how-to-validate-domain-credentials )

                        if (this.Environment.PostScheduler.ActiveDirectoryUsedSSL == false)
                        {
                            isValidAD = pc.ValidateCredentials(request.userId, pw);
                        }
                        else
                        {
                            isValidAD = pc.ValidateCredentials(request.userId, pw, ContextOptions.SecureSocketLayer);
                        }

                        if (isValidAD == true)
                        {
                            Logger.DebugFormat("Result of ACTIVE DIRECTORY Account Verification :: SUCCESS (ID: {0}, DOMAIN: {1}, HASH: {2}, SSL: {3})", request.userId, this.Environment.PostScheduler.ActiveDirectoryDomain, this.Environment.PostScheduler.ActiveDirectoryHashMode.ToString(), this.Environment.PostScheduler.ActiveDirectoryUsedSSL.ToString());
                        }
                        else
                        {
                            Logger.DebugFormat("Result of ACTIVE DIRECTORY Account Verification :: FAILED (ID: {0}, DOMAIN: {1}, HASH: {2}, SSL: {3})", request.userId, this.Environment.PostScheduler.ActiveDirectoryDomain, this.Environment.PostScheduler.ActiveDirectoryHashMode.ToString(), this.Environment.PostScheduler.ActiveDirectoryUsedSSL.ToString());
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(string.Format("Exception occured during ACTIVE DIRECTORY Account Verification (ID: {0}, DOMAIN: {1}, HASH: {2}, SSL: {3})", request.userId, this.Environment.PostScheduler.ActiveDirectoryDomain, this.Environment.PostScheduler.ActiveDirectoryHashMode.ToString(), this.Environment.PostScheduler.ActiveDirectoryUsedSSL.ToString()), ex);
                }

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                string nameSP = (isValidAD == false) ? StoredProcedure.RegisterCard.Name : StoredProcedure.RegisterCard.NameForActiveDirectory;

                requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, nameSP);

                /////////////////////////////////////////////////////////
                // PART of QUERY (userID/userPW/CardID -> ())
                /////////////////////////////////////////////////////////

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.RegisterCard.InputUserID, BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.RegisterCard.InputUserPW, BridgeParameterInfo.ParameterType.Input) { Value = request.userPw });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.RegisterCard.InputCardID, BridgeParameterInfo.ParameterType.Input) { Value = request.cardId });

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.RegisterCard.OutputStatus,    BridgeParameterInfo.ParameterType.Output));
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.RegisterCard.OutputResultMsg, BridgeParameterInfo.ParameterType.Output));

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, CSRequestProcessor.SecretKeyForAES256);

                    if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                    {
                        response.status = CSRequestProcessor.StatusFail;

                        return response;
                    }

                    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    response.status = responseBridge.Parameters[StoredProcedure.RegisterCard.OutputStatus].ToString();
                }
            }
            catch
            {
                response.status = CSRequestProcessor.StatusException;
            }

            return response;
        }


        private CSResponseCommon ProcessDeleteSelected(CSRequestBase objRequest)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestBase objRequest");
            }

            if ((objRequest is CSRequestDeleteSelected) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestDeleteSelected request  = objRequest as CSRequestDeleteSelected;
            CSResponseCommon        response = new CSResponseCommon();

            ////////////////////////////////////////////////////////////////////////////////

            if (string.IsNullOrEmpty(request.userId) == true)
            {
                response.status = CSRequestProcessor.StatusUserIdIsNull;
                return response;
            }

            if (string.IsNullOrEmpty(request.wsIp) == true)
            {
                response.status = CSRequestProcessor.StatusWsIpIsNull;
                return response;
            }
            
            try
            {
                BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadFromStoredProcedure, StoredProcedure.DeleteSelected.Name);

                ////////////////////////////////////////////////////////////
                // PART of QUERY (userID/listSelected -> ())
                ////////////////////////////////////////////////////////////

                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.DeleteSelected.InputUserID,      BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
                requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.DeleteSelected.InputCommaString, BridgeParameterInfo.ParameterType.Input) { Value = string.Join(",", request.listSelected) });

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                bool isFailed = false;

                using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
                {
                    BridgeResponse responseBridge = requestor.RequestToResponse(requestBridge, CSRequestProcessor.SecretKeyForAES256);

                    if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                    {
                        response.status = CSRequestProcessor.StatusFail;

                        return response;
                    }

                    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    foreach (ResponseRowData row in responseBridge.ListRowData)
                    {
                        try
                        {
                            string spoolNm       = row.DictionaryRowData[StoredProcedure.DeleteSelected.ColumnSpoolName  ].ToString();
                            string userIP        = row.DictionaryRowData[StoredProcedure.DeleteSelected.ColumnUserIP     ].ToString();
                            string strDriverType = row.DictionaryRowData[StoredProcedure.DeleteSelected.ColumnDriverType ].ToString();
                            string queue         = string.Empty;

                            PrintJobData.PrintDriverType driverType;

                            if (row.DictionaryRowData.ContainsKey(StoredProcedure.DeleteSelected.ColumnQueue) == true && row.DictionaryRowData[StoredProcedure.DeleteSelected.ColumnQueue] != null)
                            {
                                queue = row.DictionaryRowData[StoredProcedure.DeleteSelected.ColumnQueue].ToString();
                            }

                            switch (strDriverType.ToUpper())
                            {
                                case CommonIF.Constants.DriverType.MMD2:
                                    driverType = PrintJobData.PrintDriverType.MMD2;
                                    break;

                                case CommonIF.Constants.DriverType.Mobile:
                                    driverType = PrintJobData.PrintDriverType.Mobile;
                                    break;

                                case CommonIF.Constants.DriverType.MobilePCL:
                                    driverType = PrintJobData.PrintDriverType.MobilePCL;
                                    break;

                                case CommonIF.Constants.DriverType.MacOS:
                                    driverType = PrintJobData.PrintDriverType.MacOS;
                                    break;

                                default:
                                    driverType = PrintJobData.PrintDriverType.Unknown;
                                    break;
                            }

                            bool isSuccess = this.DeletePrnFiles(spoolNm, userIP, driverType);

                            if (isSuccess == true)
                            {
                                Logger.InfoFormat("Spool file Delete Success (SPOOL_NAME: {0}, USER_IP: {1})", spoolNm, userIP);
                            }
                            else
                            {
                                Logger.ErrorFormat("Spool file Delete Failed (SPOOL_NAME: {0}, USER_IP: {1})", spoolNm, userIP);
                                isFailed = true;
                            }                            
                        }
                        catch
                        {
                            continue;
                        }
                    }

                    if (isFailed == false)
                    {
                        response.status = CSRequestProcessor.StatusSuccess;
                    }
                    else
                    {
                        response.status = CSRequestProcessor.StatusException;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error(string.Format("EXCEPTION Occured :: during {0}", "Delete a Local Print file(s)"), ex);

                response.status = CSRequestProcessor.StatusException;
            }

            return response;
        }


        private CSResponseBase ProcessPrintSelected (CSRequestBase objRequest, string jobTicket = null)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestBase objRequest");
            }

            if ((objRequest is CSRequestPrintSelected) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestPrintSelected request  = objRequest as CSRequestPrintSelected;
            CSResponseCommon       response = new CSResponseCommon();

            ////////////////////////////////////////////////////////////////////////////////

            if (string.IsNullOrEmpty(request.userId) == true)
            {
                response.status = CSRequestProcessor.StatusUserIdIsNull;
                return response;
            }

            if (string.IsNullOrEmpty(request.deviceIp) == true)
            {
                response.status = CSRequestProcessor.StatusDeviceIpIsNull;
                return response;
            }

            if (string.IsNullOrEmpty(request.wsIp) == true)
            {
                response.status = CSRequestProcessor.StatusWsIpIsNull;
                return response;
            }

            ////////////////////////////////////////////////////////////////////////////////

            List<ExecutedPrintFile> listPrn  = new List<ExecutedPrintFile>();
            ExecutedPrintFile       prn = null;


            ////////////////////////////////////////////////////////////
            // PART of QUERY (userID/UUID -> ())
            ////////////////////////////////////////////////////////////

            using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
            {
                foreach (PrintSelectedFile selectPrn in request.listSelected)
                {
                    try
                    {
                        BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadFromStoredProcedure, StoredProcedure.PrintSelected.Name);

                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.InputUserID,      BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.InputFileUUID,    BridgeParameterInfo.ParameterType.Input) { Value = selectPrn.uuId });
                                                                                                                           
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputUUID,       BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputSpoolName,  BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputDocName,    BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputTotalPages, BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputColorMode,  BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputDuplex,     BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputNUp,        BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputCopies,     BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputQueue,      BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputUserIP,     BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputDriverType, BridgeParameterInfo.ParameterType.Output));

                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputStatus,     BridgeParameterInfo.ParameterType.Output));
                        requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintSelected.OutputResultMsg,  BridgeParameterInfo.ParameterType.Output));

                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        BridgeResponse responseBridge = requestor.RequestToResponseContinuously(requestBridge, CSRequestProcessor.SecretKeyForAES256);

                        if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
                        {
                            Logger.WarnFormat("PRN data reading fail - Response is null (UUID: {0})", selectPrn.uuId);

                            // 출력할 수 있는 문서가 하나라도 있는 경우에는 정상 동작 (불가능 문서에 대한 처리는 고려하지 않음)
                            continue;
                        }

                        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        response.status = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputStatus].ToString();

                        prn = new ExecutedPrintFile()
                        {
                            UUID       = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputUUID      ].ToString(),
                            SpoolName  = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputSpoolName ].ToString(),
                            DocName    = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputDocName   ].ToString(),
                            ColorMode  = selectPrn.color,
                            Duplex     = selectPrn.duplex,
                            NUp        = selectPrn.nUp.ToString(),
                            PageCount  = selectPrn.pageCnt.ToString(),
                            PrintCount = selectPrn.printCnt.ToString(),
                            ClientIP   = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputUserIP     ].ToString(),
                            DriverType = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputDriverType ].ToString(),
                            PrnSave    = (string.Compare(selectPrn.prnSave, CSRequestProcessor.ValueFlagYes, true) == 0)
                        };

                        // Request Value Verifying
                        if (responseBridge.Parameters.ContainsKey(StoredProcedure.PrintSelected.OutputQueue) == true
                            &&
                            responseBridge.Parameters[StoredProcedure.PrintSelected.OutputQueue] != null
                            &&
                            string.IsNullOrWhiteSpace(responseBridge.Parameters[StoredProcedure.PrintSelected.OutputQueue].ToString()) == false)
                        {
                            prn.Queue = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputQueue].ToString();
                        }

                        if (string.IsNullOrWhiteSpace(prn.ColorMode) == true)
                        {
                            prn.ColorMode = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputColorMode].ToString();
                        }

                        if (string.IsNullOrWhiteSpace(prn.Duplex) == true)
                        {
                            prn.Duplex = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputDuplex].ToString();
                        }

                        string originalNup = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputNUp].ToString();

                        if (selectPrn.nUp < 1)
                        {
                            prn.NUp = originalNup;
                        }

                        if (selectPrn.pageCnt < 1)
                        {
                            prn.PageCount = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputTotalPages].ToString();
                        }

                        if (selectPrn.printCnt < 1)
                        {
                            prn.PrintCount = responseBridge.Parameters[StoredProcedure.PrintSelected.OutputCopies].ToString();
                        }
                        
                        // ADD
                        listPrn.Add(prn);
                    }
                    catch (Exception ex)
                    {
                        Logger.WarnFormat("PRN data reading fail (UUID: {0}, MESSAGE: {1])", selectPrn.uuId, ex.Message);

                        // 출력할 수 있는 문서가 하나라도 있는 경우에는 정상 동작 (불가능 문서에 대한 처리는 고려하지 않음)
                        continue;
                    }
                }

                ///////////////////////////////////////////////////////////////

                if (listPrn.Count < 1)
                {
                    response.status = CSRequestProcessor.StatusNoResult;
                    return response;
                }
                
                List<PrintJobFileInformation> listPrintJob = this.WritePrintJobs(request, listPrn, false, jobTicket);

                if (listPrintJob == null || listPrintJob.Count < 1)
                {
                    response.status = CSRequestProcessor.StatusFail;
                    return response;
                }

                // Event 발생
                if (this.PrintExecuted != null)
                {
                    var listPrnSavedUUID = (from execPrn in listPrn
                                            where execPrn.PrnSave == false
                                            select execPrn.UUID);

                    this.PrintExecuted(this, new PrintEventArgs(listPrintJob, listPrnSavedUUID));
                }

                return response;
            }            
        }

        private CSResponseBase ProcessPrintAll (CSRequestBase objRequest, string jobTicket = null)
        {
            if (objRequest == null)
            {
                throw new ArgumentNullException("CSRequestBase objRequest");
            }

            if ((objRequest is CSRequestPrintAll) == false)
            {
                throw new InvalidDataException("Request data or type is invalid.");
            }

            CSRequestPrintAll request  = objRequest as CSRequestPrintAll;
            CSResponseCommon  response = new CSResponseCommon();

            ////////////////////////////////////////////////////////////////////////////////

            List<ExecutedPrintFile> listPrn = new List<ExecutedPrintFile>();

            UserInformation        userInfo        = null;
            LimitedUUIDInformation limitedUUIDInfo = null;

            string result = string.Empty;

            bool isColor        = false;
            int  printableCount = 0;

            using (BridgeRequestor requestor = new BridgeRequestor(this.Environment.Database.Host, this.Environment.Database.Port))
            {
                // PRN 목록 획득
                response.status = this.RequestGetPrnListForPrintAll(requestor, request, out listPrn, out userInfo);

                if (string.IsNullOrWhiteSpace(response.status) == true || response.status.ToUpper() != CSRequestProcessor.StatusSuccess.ToUpper())
                {
                    return response;
                }

                // 사용가능 색상 Count 획득
                limitedUUIDInfo = this.RequestGetAvailableColorCount(requestor, request);

                // 사용가능 색상의 흑백/컬러 여부 획득
                if (string.IsNullOrWhiteSpace(request.deviceColor) == false)
                {
                    isColor = request.deviceColor.ToUpper() != CSRequestProcessor.ValueBlackWhite;
                }

                // 프린트 가능여부 확인
                bool isPrintable = limitedUUIDInfo.CheckPrintable(userInfo, isColor, ref listPrn); // TODO : 18.06.25

                // 실패 원인 및 UUID를 response의 result 항목에 기입
                if (isPrintable == false)
                {
                    List<string> listFailedUUID = new List<string>();

                    if (limitedUUIDInfo.ListForcedBlack.Count > 0)
                    {
                        response.result = CSRequestProcessor.ResultForceBlack;
                        listFailedUUID.AddRange(limitedUUIDInfo.ListForcedBlack);
                    }
                    else if (limitedUUIDInfo.ListLimitBlack.Count > 0)
                    {
                        response.result = CSRequestProcessor.ResultLimitBlack;
                        listFailedUUID.AddRange(limitedUUIDInfo.ListLimitBlack);
                    }
                    else if (limitedUUIDInfo.ListLimitColor.Count > 0)
                    {
                        response.result = CSRequestProcessor.ResultLimitColor;
                        listFailedUUID.AddRange(limitedUUIDInfo.ListLimitColor);
                    }
                    else if (limitedUUIDInfo.ListLimitCount.Count > 0)
                    {
                        response.result = CSRequestProcessor.ResultLimitCount;
                        listFailedUUID.AddRange(limitedUUIDInfo.ListLimitCount);
                    }

                    foreach (string failUUID in listFailedUUID)
                    {
                        response.result += failUUID;
                    }
                }

                if ((printableCount = listPrn.Count(P => P.IsPrintable)) < 1)
                {
                    response.status = CSRequestProcessor.StatusFail;
                    return response;
                }

                // PrintJob 파일 작성                
                List<PrintJobFileInformation> listJobFile = this.WritePrintJobs(request, listPrn, request.imageLog, jobTicket);

                if (listJobFile == null || listJobFile.Count < 1)
                {
                    response.status = CSRequestProcessor.StatusFail;
                    return response;
                }

                // Event 발생
                if (this.PrintExecuted != null)
                {
                    var listPrnSavedUUID = (from   execPrn in listPrn
                                            where  execPrn.PrnSave == false
                                            select execPrn.UUID);

                    this.PrintExecuted(this, new PrintEventArgs(listJobFile, listPrnSavedUUID));
                }

                return response;
            }
        }

        #endregion Methods :: Process


        #region Methods :: Request to Database Bridge

        private bool RequestIsLinkedToImageLog(BridgeRequestor requestor, string deviceIp)
        {
            if (requestor == null)
            {
                throw new ArgumentNullException("BridgeRequestor requestor");
            }

            if (string.IsNullOrWhiteSpace(deviceIp) == true)
            {
                throw new ArgumentNullException("string deviceIp");
            }

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, StoredProcedure.PrintAll.NameForIsLinkedToImageLog);

            ////////////////////////////////////////////////////////////
            // PART of QUERY
            ////////////////////////////////////////////////////////////

            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputDeviceIP,   BridgeParameterInfo.ParameterType.Input) { Value = deviceIp });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputModelCode, BridgeParameterInfo.ParameterType.Output));

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            BridgeResponse responseBridge = requestor.RequestToResponseContinuously(requestBridge, CSRequestProcessor.SecretKeyForAES256);

            if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
            {
                return false;
            }

            string modelCode = responseBridge.Parameters[StoredProcedure.PrintAll.OutputModelCode].ToString();

            if (string.IsNullOrWhiteSpace(modelCode) == true)
            {
                return false;
            }

            if (modelCode.ToUpper() == CSRequestProcessor.ValueImageLogLinkage)
            {
                return true;
            }

            return false;
        }

        private LimitedUUIDInformation RequestGetAvailableColorCount(BridgeRequestor requestor, CSRequestPrintAll request)
        {
            if (requestor == null)
            {
                throw new ArgumentNullException("BridgeRequestor requestor");
            }

            if (request == null)
            {
                throw new ArgumentNullException("CSRequestPrintAll request");
            }

            LimitedUUIDInformation info = null;

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ExecuteStoredProcedure, StoredProcedure.PrintAll.NameForGetAvailableColorCnt);

            ////////////////////////////////////////////////////////////
            // PART of QUERY
            ////////////////////////////////////////////////////////////

            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputUserID,   BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputDeviceIP, BridgeParameterInfo.ParameterType.Input) { Value = request.deviceIp });

            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputLimitColor, BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputLimitGray,  BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputUsedColor,  BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputUsedGray,   BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputPrnCount,   BridgeParameterInfo.ParameterType.Output));

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            BridgeResponse responseBridge = requestor.RequestToResponseContinuously(requestBridge, CSRequestProcessor.SecretKeyForAES256);

            if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success)
            {
                return null;
            }

            info = new LimitedUUIDInformation()
            {
                LimitColor = responseBridge.Parameters[StoredProcedure.PrintAll.OutputLimitColor ].ToInteger(),
                LimitGray  = responseBridge.Parameters[StoredProcedure.PrintAll.OutputLimitGray  ].ToInteger(),
                UsedColor  = responseBridge.Parameters[StoredProcedure.PrintAll.OutputUsedColor  ].ToInteger(),
                UsedGray   = responseBridge.Parameters[StoredProcedure.PrintAll.OutputUsedGray   ].ToInteger()
            };

            return info;
        }

        private string RequestGetPrnListForPrintAll(BridgeRequestor requestor, CSRequestPrintAll request, out List<ExecutedPrintFile> listExecPrn, out UserInformation userInfo)
        {
            if (requestor == null)
            {
                throw new ArgumentNullException("BridgeRequestor requestor");
            }

            if (request == null)
            {
                throw new ArgumentNullException("CSRequestPrintAll request");
            }

            List<ExecutedPrintFile> listPrn = new List<ExecutedPrintFile>();

            ExecutedPrintFile prn = null;

            uint serviceIdx = (uint)this.Environment.PostScheduler.ServerIndex;

            string status = string.Empty;

            BridgeRequest requestBridge = new BridgeRequest(BridgeRequest.RequestType.ReadFromStoredProcedure, StoredProcedure.PrintAll.NameForGetPrnList);

            ////////////////////////////////////////////////////////////
            // PART of QUERY
            ////////////////////////////////////////////////////////////

            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputUserID,       BridgeParameterInfo.ParameterType.Input) { Value = request.userId });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputDeviceIP,     BridgeParameterInfo.ParameterType.Input) { Value = request.deviceIp });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputWsIp,         BridgeParameterInfo.ParameterType.Input) { Value = request.wsIp });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputDeviceColor,  BridgeParameterInfo.ParameterType.Input) { Value = request.deviceColor });
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.InputServiceIndex, BridgeParameterInfo.ParameterType.Input) { Value = serviceIdx });

            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputDefaultBlack, BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputForcedBlack,  BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputForcedDuplex, BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputForced2Up,    BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputPrintAgain,   BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputFunctionCtrl, BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputPrnCount,     BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputUserID,       BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputStatus,       BridgeParameterInfo.ParameterType.Output));
            requestBridge.AddParameter(new BridgeParameterInfo(StoredProcedure.PrintAll.OutputResultMsg,    BridgeParameterInfo.ParameterType.Output));

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            BridgeResponse responseBridge = requestor.RequestToResponseContinuously(requestBridge, CSRequestProcessor.SecretKeyForAES256);

            if (responseBridge == null || responseBridge.Status != BridgeResponse.StatusType.Success || responseBridge.ListRowData == null)
            {
                listExecPrn = null;
                userInfo    = null;

                return CSRequestProcessor.StatusFail;
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            foreach (ResponseRowData row in responseBridge.ListRowData)
            {
                try
                {

                    prn = new ExecutedPrintFile()
                    {
                        UUID       = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnUUID       ].ToString(),
                        SpoolName  = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnSpoolName  ].ToString(),
                        ColorMode  = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnColorMode  ].ToString(),
                        Duplex     = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnDuplex     ].ToString(),
                        NUp        = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnNUp        ].ToString(),
                        PageCount  = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnTotalPages ].ToString(),
                        PrintCount = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnCopies     ].ToString(),
                        PrnType    = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnPrnType    ].ToString(),
                        ClientIP   = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnUserIP     ].ToString(),
                        DriverType = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnDriverType ].ToString(),
                        DocName    = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnDocName    ].ToString(),
                        PrnSave    = false  //fixed to "N" then print all
                    };

                    if (row.DictionaryRowData.ContainsKey(StoredProcedure.PrintAll.ColumnQueue) == true
                        &&
                        row.DictionaryRowData[StoredProcedure.PrintAll.ColumnQueue] != null
                        &&
                        string.IsNullOrWhiteSpace(row.DictionaryRowData[StoredProcedure.PrintAll.ColumnQueue].ToString()) == false)
                    {
                        prn.Queue = row.DictionaryRowData[StoredProcedure.PrintAll.ColumnQueue].ToString();
                    }

                    // about 1page's nup (PrintSelected: 강제2-up 또는 사용자n-up이더라도 전체 페이지가 1page일 경우 1up으로 변경)
                    // if (int.Parse(prn.NUp) > 1 && int.Parse(prn.PageCount) < 2)
                    // {
                    //     Logger.InfoFormat("N-up forced change for 1 page document ({0}-up => 1-up // UUID: {1})", prn.NUp, prn.UUID);
                    //     prn.NUp = "1";
                    // }

                    listPrn.Add(prn);
                }
                catch
                {
                    continue;
                }
            }

            UserInformation user = new UserInformation()
            {
                defaultBlack = responseBridge.Parameters[StoredProcedure.PrintAll.OutputDefaultBlack ].ToString(),
                forcedBlack  = responseBridge.Parameters[StoredProcedure.PrintAll.OutputForcedBlack  ].ToString(),
                forcedDuplex = responseBridge.Parameters[StoredProcedure.PrintAll.OutputForcedDuplex ].ToString(),
                forced2Up    = responseBridge.Parameters[StoredProcedure.PrintAll.OutputForced2Up    ].ToString(),
                printAgain   = responseBridge.Parameters[StoredProcedure.PrintAll.OutputPrintAgain   ].ToString(),
                functionCtrl = responseBridge.Parameters[StoredProcedure.PrintAll.OutputFunctionCtrl ].ToInteger(),
                prnCount     = responseBridge.Parameters[StoredProcedure.PrintAll.OutputPrnCount     ].ToInteger(),
                userId       = responseBridge.Parameters[StoredProcedure.PrintAll.OutputUserID       ].ToString()
            };

            // 강제 양면 일괄 설정
            this.ApplyForcedDuplex(user.forcedDuplex, listPrn);

            // 강제 2up 일괄 설정
            this.Apply2up(user.forced2Up, listPrn);

            // Status 확인
            status = responseBridge.Parameters[StoredProcedure.PrintAll.OutputStatus].ToString();

            // Output Parameters 설정
            listExecPrn = listPrn;
            userInfo = user;

            return status;
        }

        #endregion Methods :: Request to Database Bridge
       

        #region Methods :: IO

        private bool DeletePrnFiles (string spoolNm, string userIP, PrintJobData.PrintDriverType driver)
        {
            if (string.IsNullOrWhiteSpace(spoolNm) == true)
            {
                throw new ArgumentNullException("string spoolNm");
            }

            if (string.IsNullOrWhiteSpace(userIP) == true)
            {
                throw new ArgumentNullException("string userIP");
            }

            bool isSuccess = false;

            // [Spool] Directory (Spoolfile)
            string pathSpoolFile = Path.Combine(this.Environment.Common.PathSpoolDirectory, userIP, spoolNm);

            if (Path.IsPathRooted(pathSpoolFile) == false)
            {
                pathSpoolFile = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathSpoolFile);
            }

            isSuccess = this.DeletePrnFile(pathSpoolFile);

            if (isSuccess == false)
            {
                return false;
            }

            // [Metadata] Directory (.JSON)
            string pathMetadata  = Path.Combine(this.Environment.Common.PathMetadataDirectory, userIP, spoolNm + CSRequestProcessor.ExtensionJSON);

            if (Path.IsPathRooted(pathMetadata) == false)
            {
                pathMetadata = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathMetadata);
            }

            isSuccess = this.DeletePrnFile(pathMetadata);

            if (isSuccess == false)
            {
                return false;
            }

            switch (driver)
            {
                case PrintJobData.PrintDriverType.Mobile:
                case PrintJobData.PrintDriverType.MacOS:
                {
                    // [Spool] Directory (.PDF)
                    string pathPDF  = Path.Combine(this.Environment.Common.PathSpoolDirectory, userIP, spoolNm + CSRequestProcessor.ExtensionPDF);

                    if (Path.IsPathRooted(pathPDF) == false)
                    {
                        pathPDF = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathPDF);
                    }

                    return this.DeletePrnFile(pathPDF);
                }

                case PrintJobData.PrintDriverType.MMD2:
                case PrintJobData.PrintDriverType.MobilePCL:
                default:
                    return isSuccess;
            }
        }

        private bool DeletePrnFile (string path)
        {
            try
            {
                if (File.Exists(path) == true)
                {
                    File.Delete(path);
                }
                else
                {
                    throw new FileNotFoundException("File delete failed", path);
                }

                return true;
            }
            catch (Exception ex)
            {
                Logger.Warn("Spool file delete failed.", ex);

                return false;
            }
        }

        private List<PrintJobFileInformation> WritePrintJobs (CSRequestBase objRequest, List<ExecutedPrintFile> listPrn, bool imageLogLinkage, string jobTicket)
        {
            ///////////////////////////////////////////////////////////////////////////////////
            // Initialize & Validation
            ///////////////////////////////////////////////////////////////////////////////////

            if (listPrn == null || listPrn.Count < 1)
            {
                throw new ArgumentNullException("List<ExecutedPrintFile> listPrn");
            }

            string userID      = string.Empty;
            string deviceIP    = string.Empty;

            if (objRequest is CSRequestPrintAll)
            {
                CSRequestPrintAll requestPrintAll = objRequest as CSRequestPrintAll;

                userID      = requestPrintAll.userId;
                deviceIP    = requestPrintAll.deviceIp;
            }
            else if (objRequest is CSRequestPrintSelected)
            {
                CSRequestPrintSelected requestPrintSelected = objRequest as CSRequestPrintSelected;

                userID   = requestPrintSelected.userId;
                deviceIP = requestPrintSelected.deviceIp;
            }
            else
            {
                throw new InvalidCastException("Request type is invalid.");
            }

            ///////////////////////////////////////////////////////////////////////////////////
            // Processing
            ///////////////////////////////////////////////////////////////////////////////////

            try
            {
                List<ExecutedPrintFile> listPrintable = new List<ExecutedPrintFile>();

                listPrintable.AddRange(listPrn.Where(P => P.IsPrintable));

                if (listPrintable.Count < 1)
                {
                    return null;
                }

                //////////////////////////////////////////////////////////////////

                Dictionary<PrintJobData, PrintJobData.PrintDriverType> dictionaryJobData = new Dictionary<PrintJobData, PrintJobData.PrintDriverType>();

                List<PrintJobFileInformation> listJobFile = new List<PrintJobFileInformation>();

                string strJsonTime = DateTime.Now.ToString("yyyyMMddHHmmssfff");

                //////////////////////////////////////////////////////////////////

                foreach (ExecutedPrintFile prn in listPrintable)
                {
                    try
                    {
                        PrintJobData job = new PrintJobData()
                        {
                            UUID            = prn.UUID,
                            SpoolFileName   = prn.SpoolName,
                            ClientIPAddress = prn.ClientIP,
                            DocumentName    = prn.DocName,
                            DriverType      = prn.DriverType,
                            PrnSave         = prn.PrnSave
                        };

                        //////////////////////////////////////////////////////////////////

                        switch (prn.ColorMode.ToUpper())
                        {
                            case CSRequestProcessor.ValueColor:
                                job.Color = PrintJobData.ColorType.Color;
                                break;

                            case CSRequestProcessor.ValueBlackWhite:
                                job.Color = PrintJobData.ColorType.BlackWhite;
                                break;

                            default:
                                job.Color = PrintJobData.ColorType.Unknown;
                                break;
                        }

                        switch (prn.Duplex.ToUpper())
                        {
                            case CSRequestProcessor.ValueSimplex:
                                job.Duplex = PrintJobData.DuplexType.Simplex;
                                break;

                            case CSRequestProcessor.ValueDuplexLongEdge:
                                job.Duplex = PrintJobData.DuplexType.DuplexLongEdge;
                                break;

                            case CSRequestProcessor.ValueDuplexShortEdge:
                                job.Duplex = PrintJobData.DuplexType.DuplexShortEdge;
                                break;

                            default:
                                job.Duplex = PrintJobData.DuplexType.Unknown;
                                break;
                        }

                        int value;

                        if (int.TryParse(prn.NUp, out value) == true)
                        {
                            job.Nup = value;
                        }

                        if (int.TryParse(prn.PrintCount, out value) == true)
                        {
                            job.Copies = value;
                        }

                        //////////////////////////////////////////////////////////////////

                        dictionaryJobData.Add(job, job.Driver);
                    }
                    catch
                    {
                        continue;
                    }
                }

                //////////////////////////////////////////////////////////////////

                PrintJobInformation jobInfoMMD2   = null;
                PrintJobInformation jobInfoMobile = null;
                PrintJobInformation jobInfoMacOS  = null;

                string pathJsonMMD2   = string.Empty;
                string pathJsonMobile = string.Empty;
                string pathJsonMacOS  = string.Empty;

                int    idxJsonMMD2   = 0;
                int    idxJsonMobile = 0;
                int    idxJsonMacOS  = 0;

                foreach (var pair in dictionaryJobData)
                {
                    try
                    {
                        PrintJobData                 jobData = pair.Key;
                        PrintJobData.PrintDriverType driver  = pair.Value;

                        switch (driver)
                        {
                            case PrintJobData.PrintDriverType.MMD2:
                                {
                                    // New Json
                                    if (jobInfoMMD2 == null)
                                    {
                                        jobInfoMMD2 = new PrintJobInformation()
                                        {
                                            JobTicket       = jobTicket,
                                            UserID          = userID,
                                            PrintIPAddress  = deviceIP,
                                            ImageLogLinkage = imageLogLinkage,
                                            Contingency     = false
                                        };

                                        pathJsonMMD2 = Path.Combine(this.Environment.Common.PathPrintJobDirectory,
                                                                    string.Format(CSRequestProcessor.FormatJsonName, userID, PrintJobData.PrintDriverType.MMD2.ToString(), strJsonTime, idxJsonMMD2 + 1));

                                        if (Path.IsPathRooted(pathJsonMMD2) == false)
                                        {
                                            pathJsonMMD2 = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathJsonMMD2);
                                        }
                                    }

                                    // Add a each Job data
                                    jobInfoMMD2.JobList.Add(jobData);

                                    if (jobInfoMMD2.JobList.Count >= CSRequestProcessor.MaximumPrintJobInJson)
                                    {
                                        // Save
                                        FileObjectManagement.SaveJson(pathJsonMMD2, jobInfoMMD2);

                                        // Add
                                        if (File.Exists(pathJsonMMD2) == true)
                                        {
                                            PrintJobFileInformation jobFile = new PrintJobFileInformation()
                                            {
                                                Path   = pathJsonMMD2,
                                                Driver = PrintJobData.PrintDriverType.MMD2
                                            };

                                            listJobFile.Add(jobFile);
                                        }

                                        // Clear
                                        jobInfoMMD2  = null;
                                        pathJsonMMD2 = string.Empty;
                                        idxJsonMMD2++;
                                    }
                                }
                                break;

                            case PrintJobData.PrintDriverType.Mobile:
                            case PrintJobData.PrintDriverType.MobilePCL:
                                {
                                    // New Json
                                    if (jobInfoMobile == null)
                                    {
                                        jobInfoMobile = new PrintJobInformation()
                                        {
                                            JobTicket       = jobTicket,
                                            UserID          = userID,
                                            PrintIPAddress  = deviceIP,
                                            ImageLogLinkage = imageLogLinkage,
                                            Contingency     = false
                                        };

                                        pathJsonMobile = Path.Combine(this.Environment.Common.PathPrintJobDirectory,
                                                                    string.Format(CSRequestProcessor.FormatJsonName, userID, PrintJobData.PrintDriverType.Mobile.ToString(), strJsonTime, idxJsonMobile + 1));

                                        if (Path.IsPathRooted(pathJsonMobile) == false)
                                        {
                                            pathJsonMobile = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathJsonMobile);
                                        }
                                    }

                                    // Add a each Job data
                                    jobInfoMobile.JobList.Add(jobData);

                                    if (jobInfoMobile.JobList.Count >= CSRequestProcessor.MaximumPrintJobInJson)
                                    {
                                        // Save
                                        FileObjectManagement.SaveJson(pathJsonMobile, jobInfoMobile);

                                        // Add
                                        if (File.Exists(pathJsonMobile) == true)
                                        {
                                            PrintJobFileInformation jobFile = new PrintJobFileInformation()
                                            {
                                                Path   = pathJsonMobile,
                                                Driver = PrintJobData.PrintDriverType.Mobile
                                            };

                                            listJobFile.Add(jobFile);
                                        }

                                        // Clear
                                        jobInfoMobile = null;
                                        pathJsonMobile = string.Empty;
                                        idxJsonMobile++;
                                    }
                                }
                                break;

                            case PrintJobData.PrintDriverType.MacOS:
                                {
                                    // New Json
                                    if (jobInfoMacOS == null)
                                    {
                                        jobInfoMacOS = new PrintJobInformation()
                                        {
                                            JobTicket       = jobTicket,
                                            UserID          = userID,
                                            PrintIPAddress  = deviceIP,
                                            ImageLogLinkage = imageLogLinkage,
                                            Contingency     = false
                                        };

                                        pathJsonMacOS = Path.Combine(this.Environment.Common.PathPrintJobDirectory,
                                                                    string.Format(CSRequestProcessor.FormatJsonName, userID, PrintJobData.PrintDriverType.MacOS.ToString(), strJsonTime, idxJsonMacOS + 1));

                                        if (Path.IsPathRooted(pathJsonMacOS) == false)
                                        {
                                            pathJsonMacOS = Path.Combine(this.Environment.Common.PathSmartWhereDataRootDirectory, pathJsonMacOS);
                                        }
                                    }

                                    // Add a each Job data
                                    jobInfoMacOS.JobList.Add(jobData);

                                    if (jobInfoMacOS.JobList.Count >= CSRequestProcessor.MaximumPrintJobInJson)
                                    {
                                        // Save
                                        FileObjectManagement.SaveJson(pathJsonMacOS, jobInfoMacOS);

                                        // Add
                                        if (File.Exists(pathJsonMacOS) == true)
                                        {
                                            PrintJobFileInformation jobFile = new PrintJobFileInformation()
                                            {
                                                Path   = pathJsonMacOS,
                                                Driver = PrintJobData.PrintDriverType.MacOS
                                            };

                                            listJobFile.Add(jobFile);
                                        }

                                        // Clear
                                        jobInfoMacOS = null;
                                        pathJsonMacOS = string.Empty;
                                        idxJsonMacOS++;
                                    }
                                }
                                break;

                            default:
                                continue;
                        }
                    }
                    catch
                    {
                        continue;
                    }
                }
                
                //////////////////////////////////////////////////////////////////

                if (jobInfoMMD2 != null && jobInfoMMD2.JobList.Count > 0)
                {
                    // Save
                    FileObjectManagement.SaveJson(pathJsonMMD2, jobInfoMMD2);

                    // Add
                    if (File.Exists(pathJsonMMD2) == true)
                    {
                        PrintJobFileInformation jobFile = new PrintJobFileInformation()
                        {
                            Path   = pathJsonMMD2,
                            Driver = PrintJobData.PrintDriverType.MMD2
                        };

                        listJobFile.Add(jobFile);
                    }
                }

                if (jobInfoMobile != null && jobInfoMobile.JobList.Count > 0)
                {
                    // Save
                    FileObjectManagement.SaveJson(pathJsonMobile, jobInfoMobile);

                    // Add
                    if (File.Exists(pathJsonMobile) == true)
                    {
                        PrintJobFileInformation jobFile = new PrintJobFileInformation()
                        {
                            Path   = pathJsonMobile,
                            Driver = PrintJobData.PrintDriverType.Mobile
                        };

                        listJobFile.Add(jobFile);
                    }
                }

                if (jobInfoMacOS != null && jobInfoMacOS.JobList.Count > 0)
                {
                    // Save
                    FileObjectManagement.SaveJson(pathJsonMacOS, jobInfoMacOS);

                    // Add
                    if (File.Exists(pathJsonMacOS) == true)
                    {
                        PrintJobFileInformation jobFile = new PrintJobFileInformation()
                        {
                            Path   = pathJsonMacOS,
                            Driver = PrintJobData.PrintDriverType.MacOS
                        };

                        listJobFile.Add(jobFile);
                    }
                }

                return listJobFile;
            }
            catch
            {
                return null;
            }
        }

        #endregion Methods :: IO



        #region Methods


        private void ApplyForcedDuplex<T> (string forcedDuplex, IEnumerable<T> listPrn)
        {
            if (string.IsNullOrWhiteSpace(forcedDuplex) == true)
            {
                return;
            }

            forcedDuplex = forcedDuplex.ToUpper();

            if (forcedDuplex != CSRequestProcessor.ValueDuplexLongEdge && forcedDuplex != CSRequestProcessor.ValueDuplexShortEdge)
            {
                return;
            }

            if (listPrn == null || listPrn.Count() < 1)
            {
                return;
            }

            foreach (T file in listPrn)
            {
                try
                {
                    if (file is PrintFile)
                    {
                        PrintFile prn = file as PrintFile;

                        if (prn.duplex.ToUpper() == CSRequestProcessor.ValueSimplex)
                        {
                            prn.duplex = forcedDuplex;
                        }
                    }
                    else if (file is ExecutedPrintFile)
                    {
                        ExecutedPrintFile prn = file as ExecutedPrintFile;

                        if (prn.Duplex.ToUpper() == CSRequestProcessor.ValueSimplex)
                        {
                            prn.Duplex = forcedDuplex;
                        }
                    }
                    else
                    {
                        continue;
                    }
                }
                catch
                {
                    continue;
                }
            }
        }


        private void Apply2up<T>(string forced2Up, IEnumerable<T> listPrn)
        {
            if (string.IsNullOrWhiteSpace(forced2Up) == true)
            {
                return;
            }

            forced2Up = forced2Up.ToUpper().Trim();

            if (forced2Up != CSRequestProcessor.ValueFlagYes)
            {
                return;
            }

            if (listPrn == null || listPrn.Count() < 1)
            {
                return;
            }

            foreach (T file in listPrn)
            {
                try
                {
                    if (file is PrintFile)
                    {
                        PrintFile prn = file as PrintFile;

                        if (prn.nUp > 1 && prn.pageCnt < 2 && prn.SRCnUp < 2)
                        {
                            prn.nUp = 1;
                        }
                        else if (prn.nUp < 2 && prn.pageCnt > 1)
                        {
                            prn.nUp = 2;
                        }
                    }
                    else if (file is ExecutedPrintFile)
                    {
                        ExecutedPrintFile prn = file as ExecutedPrintFile;

                        if (string.IsNullOrWhiteSpace(prn.NUp) == true)
                        {
                            prn.NUp = "2";
                        }
                        else
                        {
                            int nup = 2;

                            if (int.TryParse(prn.NUp, out nup) == false || nup < 2)
                            {
                                if (int.Parse(prn.PageCount) > 1)
                                {
                                    prn.NUp = "2";
                                }
                            }
                        }
                    }
                    else
                    {
                        continue;
                    }
                }
                catch
                {
                    continue;
                }
            }
        }
        #endregion Methods
    }

    /// <summary>
    /// static class :: CSRequestProcessorUtility (for Extension Methods)
    /// </summary>
    public static class CSRequestProcessorUtility
    {
        public static int ToInteger(this object obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException("this object obj");
            }

            if (obj is int)
            {
                return (int)obj;
            }

            if (obj is uint)
            {
                return (int)((uint)obj);
            }

            if (obj is short)
            {
                return (int)((short)obj);
            }

            if (obj is ushort)
            {
                return (int)((ushort)obj);
            }

            if (obj is long)
            {
                return (int)((long)obj);
            }

            if (obj is ulong)
            {
                return (int)((ulong)obj);
            }

            if (obj is decimal)
            {
                return (int)((decimal)obj);
            }

            if (obj is float)
            {
                return (int)Math.Round((float)obj);
            }

            if (obj is double)
            {
                return (int)Math.Round((double)obj);
            }

            if (obj is bool)
            {
                return ((bool)obj == true) ? 1 : 0;
            }

            return int.Parse(obj.ToString());
        }
    }
}