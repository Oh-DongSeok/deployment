/**
 * @fileoverview CS기본동작과 공통기능을 정의하는 파일
 * @author FXK System Engineering Team DongSeok.Oh
 * @version 1.0.0
 */
var Common = {};

/**
 * Contents기동시의 초기설정을 실행한다.
 */
Common.onLoadBody = function()
{
	// Contents Initialization
	ContentsLib.init();
	ContentsLib.contentsIcon = "./info/smallicon.png";
	ContentsLib.contentsName = DATA.TITLE_NAME;
	// Event setting
	ContentsLib.setListener(Common.onLoadEvent);
	JFLib.setEventListener(Common.onLoadEvent);
	SystemEventLib.AddNotify("AuthEvent", this.onLoadEvent);
	// Browser 동작 Setting
	//BrowserExt.EnablePrivilege(); // 확인 필요
	BrowserExt.Initialize();
	BrowserExt.SetScreenChange("popup:faultAll");
	//초기화
	PageManager.init("pageWrapper");

	//복합기 언어설정에 따른 문자열과 이미지셋 선택
	var lang = BrowserExt.GetAcceptLanguage();
	var arrLang = lang.split(",");
	var _lang = arrLang[0]||"en";
	glbInfo.setLanguage = _lang;
	switch(_lang){
		case "ko":
		case "en":
			Msg = Msg_lang[_lang];
			break;
		default:
			Msg = Msg_lang["en"];
			break;
	}

	KISUtil.initDebug("body");

	//init
	initInfo();
	resetInfo();
	//setScreenType();
	//KISUtil.debug("EWB Size:", glbInfo.screenType);

	Common.displayTitleArea();	//CS타이틀 영역 표시

	if(flg_Dummy_Beep){
		SSMILib.GetAccountConfig();
	}
	else{	// 인증모드 취득
		//SSMILib.GetAuthStatus(true);
		SSMILib.GetAccountConfig();
	}
	//SSMILib.GetBillingPolicy(6000, DATA.SERVER_URL);
	SSMILib.setEventListener(Common.onLoadEvent);
	setScreenType();
	KISUtil.debug("EWB Size:", glbInfo.screenType);
	KISUtil.debug("GetAccountConfig", "Initial Complete");

	PageManager.changePage(WaitingPage, PageManager.type.NORMAL);

}

/**
 * 공통 이벤트 처리 메소드
 * 이곳에 정의 되지 않은 경우 각 페이지에서 이벤트가 처리됨
 * @param {event} event
 * @param {string} id
 */
Common.onLoadEvent = function(event, id)
{
	switch(event){
		/* Common Used Case *******************************************************************************************************/
		case "GetAccountConfig":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var accountConfig = arguments[RESPONSE.DATA];
				glbInfo.authMode = SSMILib.isDeviceAuth(accountConfig);
				glbInfo.AuditronMode = accountConfig.AuditronMode;
				if(glbInfo.AuditronMode = "Internal Auditron")
				{
					SSMILib.GetUser();
				}else{
					glbNoticeInfo.type = NOTICE.INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth + " (GA)";
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}

			}else{
				KISUtil.debug("GetAccountConfig:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GA)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "GetProductInformation":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var productInfo = arguments[RESPONSE.DATA];
				glbDeviceInfo.serialNumber = productInfo.serialNumber;
				glbDeviceInfo.productCode = productInfo.productCode;
				glbDeviceInfo.regKey = md5("CST_" + glbDeviceInfo.productCode + "_" + glbDeviceInfo.serialNumber);
				SSMILib.GetTcpIpInfo(false);
				SSMILib.GetTrayInfo();
			}else{
				/*-----------------------------------------------------------------------------*/
				jobSelecter = JOB_TYPE.COPY;
				PageManager.changePage(CopyMainPage, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
				currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
				/*-----------------------------------------------------------------------------*/
				/*
				KISUtil.debug("GetProductInformation:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GP)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
				*/
			}
			break;
		case "GetUser":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var users = arguments[RESPONSE.DATA];
				if(users){
					glbDeviceInfo.User = {};
					glbDeviceInfo.User.id = users[0]["UserID"];
					glbDeviceInfo.User.index = users[0]["Index"];
					glbDeviceInfo.User.displayName = users[0]["DisplayName"];
					glbDeviceInfo.User.relatedUserId = users[0]["RelatedUserID"];

					glbInfo.userInfo = {};
					glbInfo.userInfo.isAdmin = isSytemAdmin(users[0]);
					if(glbInfo.userInfo.isAdmin){
						if(flg_Dummy_Beep||glbDeviceInfo.User.id == DATA.LOGIN_INFO.ID){//TODO: 실 코드로
							//SSMILib.GetTcpIpInfo(false);
							SSMILib.GetProductInformation();
							SSMILib.GetPrinterCapability();	// 복합기 컬러/흑백 출력 확인용
						}
						else{
							BrowserExt.SetScreenChange("menuto:native_menu");		//관리자는 네이티브 메뉴로 천이
						}
						break;
					}else{
						if(flg_Dummy_Beep){
							//SSMILib.GetTcpIpInfo(false);
							if(glbDeviceInfo.User.index == "-2"){
								glbNoticeInfo.type = NOTICE.INFO;
								glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth;
								PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							}else{
								SSMILib.GetProductInformation();
								SSMILib.GetPrinterCapability();	// 복합기 컬러/흑백 출력 확인용
							}
							return;
						}
						//일반유저이므로 지정유저일 수 없으므로 무조건 로그아웃후 재로그인 처리
						if(glbDeviceInfo.User.index == "-2"){
							if(glbDeviceInfo.User.DisplayName == "CE"){
								BrowserExt.SetScreenChange("menuto:native_menu");		//CE는 네이티브 메뉴로 천이
							}else{
								glbNoticeInfo.type = NOTICE.INFO;
								glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth + " (-2)";
								PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							}
						}else{
							glbInfo.loginCount=DATA.LOGIN_INFO.COUNTER;
							SSMILib.LogoutDev();
						}
						break;
					}
				}
			}else{
				if(glbInfo.authMode){	// 인증모드에 미인증유저 또는 CE유저인 경우
					if(flg_Dummy_Beep){
						//SSMILib.GetTcpIpInfo(false);
						SSMILib.GetProductInformation();
						SSMILib.GetPrinterCapability();	// 복합기 컬러/흑백 출력 확인용
					}else{
						//var ceUser = new ToolsLib.user();
						//ceUser.isCELogin();
						glbInfo.loginCount=DATA.LOGIN_INFO.COUNTER;
						SSMILib.LoginDev(DATA.LOGIN_INFO.ID, DATA.LOGIN_INFO.PASSWORD);
					}
					break;
				}else{
					if(flg_Dummy_Beep){
						//SSMILib.GetTcpIpInfo(false);
						SSMILib.GetProductInformation();
						SSMILib.GetPrinterCapability();	// 복합기 컬러/흑백 출력 확인용
						break;
					}
				}
				KISUtil.debug("GetUser:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GU)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "GetPrinterCapability":
			if(arguments[RESPONSE.STATUS] == true){
				var printerCapability = arguments[RESPONSE.DATA];
				if(flg_Dummy_Beep){
					//glbDeviceInfo.colorMode = "monochrome";
					glbDeviceInfo.colorMode = printerCapability.ColorMode;
				}else{
					glbDeviceInfo.colorMode = printerCapability.ColorMode; // color: 컬러출력가능, monochrome: 흑백출력만 가능
				}
			}else{
				KISUtil.debug("GetPrinterCapability:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GPC)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "isCELogin":
			if(arguments[RESPONSE.STATUS]==true){
        		//CE유저
        		glbDevInfo.isCeLogin = true;
				BrowserExt.SetScreenChange("menuto:native_menu");
				return;
			}else{
				//CE가 아니고 인증모드인 경우
				if(glbInfo.authMode){
					if(!flg_Dummy_Beep) {
						glbInfo.loginCount=DATA.LOGIN_INFO.COUNTER;
						SSMILib.LoginDev(DATA.LOGIN_INFO.ID, DATA.LOGIN_INFO.PASSWORD);
					}
					//SSMILib.GetTrayInfo(false);
					SSMILib.GetProductInformation();
					SSMILib.GetPrinterCapability();	// 복합기 컬러/흑백 출력 확인용
					//PageManager.changePage(LoginPage,PageManager.type.NORMAL);
				}
				else{
					glbNoticeInfo.type = NOTICE.INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth + " (CE)";
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
				break;
			}
			break;
		case "GetTcpIpInfo"://2016.09.28 KIS Chone 복합기 IP 자동 취득 기능의 추가 refs #4065
	    	if(arguments[RESPONSE.STATUS] == true){
				var tcpInfoObj = arguments[RESPONSE.DATA];
				glbInfo.PRINTER_IP = tcpInfoObj.IPAddress;
				glbSubNet = subNetsplit();
				if(DATA.DEFAULT_CHECK == true){
					var spliceStr = DATA.SERVER_URL.replace(":9001/", "");
					FAX_SERVER = spliceStr + FAX_SCAN_ADD;
					//SSMILib.GetBillingPolicy(1000, DATA.SERVER_URL);
					SSMILib.GetRegiDeviceInfo(300, DATA.SERVER_URL);
				}else{
					PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GTII)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			//SSMILib.GetBillingPolicy(6000, DATA.SERVER_URL);
			break;
		case "LogoutDev":
			if (arguments[1] === true) {
				KISUtil.debug("LogoutDev", "Success");
				clearTimeout(WaitingPage.timer);
				glbInfo.loginCount=DATA.LOGIN_INFO.COUNTER;
				SSMILib.LoginDev(DATA.LOGIN_INFO.ID, DATA.LOGIN_INFO.PASSWORD);
			} else {
				KISUtil.debug("LogoutDev", "Failed"+ glbInfo.loginCount);
				if(--glbInfo.loginCount>0){
					glbInfo.loginTimer = setTimeout("Common.retryLogInOut(false)",60000);
				}
				else{
					//error
					glbNoticeInfo.type = NOTICE.INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth + " (LOD)";
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}
			break;
		case "LoginDev":
			if(arguments[1] === true){
				KISUtil.debug("LoginDev", "Success");
				SSMILib.GetUser();
			}else{
				KISUtil.debug("LogoutDev", "Failed" + glbInfo.loginCount);

				//error
				BrowserExt.SetScreenChange("menuto:native_menu");
				/*
				glbNoticeInfo.type = NOTICE.INFO;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_Auth + " (LID)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
				*/
			}
			break;
		case "GetTrayInfo":
			if(arguments[RESPONSE.STATUS] == true)
			{
				//glbInfo.trayInfo = arguments[RESPONSE.DATA];
				var resultCnt = arguments[RESPONSE.DATA].length;
				for(var i = COUNT_INIT; i < resultCnt; i++)
				{
					if((arguments[RESPONSE.DATA][i].Status != "NOTEXIST") && (isCheckNormalTray(arguments[RESPONSE.DATA][i].Name)))
					{
						glbInfo.trayInfo[i] = arguments[RESPONSE.DATA][i];
					}
				}

				glbInfo.trayCount = glbInfo.trayInfo.length;
				if(glbInfo.trayCount > TRAY_FULL){
					glbInfo.trayCount = TRAY_FULL;
				}
			}else{
				KISUtil.debug("GetTrayInfo:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GTI)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			Common.updateDisplayTrayIcon();
			if(DATA.DEFAULT_CHECK == true){
				Common.UpdateSetTrayInfo();
				Common.checkEmptyTrayInfo();
			}

			function isCheckNormalTray(name)
			{
				var result = true;
				if(name.indexOf('Bypass') != -1)
				{
					result = false;
				}
				return result;
			}
			break;
		case "SetTrayInfo":
			if(arguments[RESPONSE.STATUS] == true){
				KISUtil.debug("SetTrayInfo:", "Success");
				return;
			}else{
				KISUtil.debug("SetTrayInfo:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_SERVER_Fail + " (STI)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "RegiDeviceInfo":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var DeviceInfoAll = arguments[RESPONSE.DATA].devices;
				glbJobLogInfo.deviceGroup  = null;
				for(var i = 0; i < DeviceInfoAll.length; i++){
					if(DeviceInfoAll[i].compositeMachineIp == glbInfo.PRINTER_IP){
						var tableInUse 				= DeviceInfoAll[i].tableInUse;
						glbJobLogInfo.deviceId 		= DeviceInfoAll[i].deviceId;
						glbJobLogInfo.deviceGroup 	= DeviceInfoAll[i].deviceGroup;
						glbJobLogInfo.setupId 		= DeviceInfoAll[i].setupId;

					}
				}
				if(tableInUse){
					var temp = replaceAll(tableInUse, "-", "");
					var serverKey = temp.toLowerCase();
					if(flg_Dummy_Beep) {
						// Test시에는 넘어가도록 설정
						serverKey = glbDeviceInfo.regKey;
					}
					if(serverKey == glbDeviceInfo.regKey){
						// Fax 조회용 QR Code 이미지 Url생성
						var spliceStr = DATA.SERVER_URL.replace(":9001/", "");
						var qrcodeUrl = spliceStr + "/qr/qr_" + glbJobLogInfo.setupId + ".png";
						var qrcode = new Image();
						qrcode.onload=function(){
							glbJobLogInfo.qrcodeUrl = qrcodeUrl;
						}
						qrcode.onerror=function(){
							// qrcode 파일이 없을 경우
							glbJobLogInfo.qrcodeUrl = "NO_IMAGE";
						}
						qrcode.src = qrcodeUrl;

						SSMILib.GetBillingPolicy(1000, DATA.SERVER_URL, glbJobLogInfo.deviceGroup);
					}else{
						glbJobLogInfo.qrcodeUrl = "NO_IMAGE";
						glbNoticeInfo.type = NOTICE.WARN;
						glbNoticeInfo.message = Msg.NoticePopup.Msg_RegiFail;
						PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}
				}else{
					glbNoticeInfo.type = NOTICE.WARN;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_RegiFail;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				// 인증을 확인할 수 없습니다.
				glbNoticeInfo.type = NOTICE.WARN;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_RegiResFail;
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			//SSMILib.GetBillingPolicy(1000, DATA.SERVER_URL);
			break;
		case "BillingPolicy":
			if(arguments[RESPONSE.STATUS] == true)
			{
				// ToDo: Interface의 Status 확인츨 추가...
				if(arguments[RESPONSE.DATA].status == "success"){
					var resultCnt = arguments[RESPONSE.DATA].billingPolicies.length;
					var tempTable = {};
					for(var i = COUNT_INIT; i < resultCnt; i++)
					{
						var result = arguments[RESPONSE.DATA].billingPolicies[i.toString()];
						if(result.billingGroupId == glbJobLogInfo.deviceGroup){
							glbBillingTable = arguments[RESPONSE.DATA].billingPolicies[i.toString()];
						}
						if(result.useStatus == IN_USED)
						{	// Table Data Stored
							tempTable = arguments[RESPONSE.DATA].billingPolicies[i.toString()];
						}
					}
					if(!glbBillingTable.billingGroupId){
						if(tempTable.billingGroupId){
							glbBillingTable = tempTable;
							getScanToPcCheck();
							PageManager.changePage(MenuPage, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
						}else{
							glbNoticeInfo.type = NOTICE.WARN;
							glbNoticeInfo.message = Msg.NoticePopup.Msg_BillFail;
							PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
						}
					}else{
						getScanToPcCheck();
						PageManager.changePage(MenuPage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
					}
				}else{
					glbNoticeInfo.type = NOTICE.WARN;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_BillFail;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				glbNoticeInfo.type = NOTICE.WARN;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_BillFail;
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		/* Print Used Case *******************************************************************************************************/
		case "PrintInformation":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var printJobInfo = arguments[RESPONSE.DATA];
				if(printJobInfo.status == STS_SUCCESS){
					jobList = getPrintJobList(printJobInfo.printInformations);
					if(jobList.length > 0){
						PageManager.changePage(FileListPage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						//currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
						
					}else{
						glbNoticeInfo.type = NOTICE.INFO;
						glbNoticeInfo.message = printJobInfo.reason;
						PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}
				}else{
					glbNoticeInfo.type = NOTICE.WARN;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_DocEmpty;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				KISUtil.debug("PrintInformation:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ListFail;
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "PrintSelected":
			if(arguments[RESPONSE.STATUS] == true)
			{
				if((arguments[RESPONSE.DATA].status == "success")&&(!priceZero)){
					// JobMonitor
					PrintJobMonitor.init(300);
					PrintJobMonitor.startMonitor(
						{
							successCallback:function(){
								setJobLogSave(true);
								KISUtil.debug("successCallback", "");
								if(flg_Dummy_Beep) {
									PageManager.changePage(MenuPage, PageManager.type.NORMAL);
									currentPage = PageManager.getCurrentPage();
								}else{
									BrowserExt.Beep(0);
									BrowserExt.SetScreenChange("allservice");
								}
							},
							errorCallback:function(){
								setJobLogSave(false);
								KISUtil.debug("errorCallback", "");
								glbNoticeInfo.type = NOTICE.FAIL;
								glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (PS)";
								PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							},
							cancelCallback:function(){KISUtil.debug("cancelCallback", "");},
							jobcount: 1
						},
						100);
				}else{
					KISUtil.debug("PrintSelected:", "Job Fail");
					glbNoticeInfo.type = NOTICE.FAIL;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_ListFail + " (JP)";
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				KISUtil.debug("PrintSelected:", "Response Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (PS)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "DeleteSelected":
			if(arguments[RESPONSE.STATUS] == true)
			{
				WidgetLib.setWidgetStatus("btn_FL_DeleteFile", { enable: true });
				SSMILib.GetPrintInformation(6000, DATA.SERVER_URL, glbInfo.userId);
			}else{
				KISUtil.debug("DeleteSelected:", "Response Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (DS)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "PriceRequest":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var response = "";
				if(arguments[RESPONSE.DATA].status){
					response = arguments[RESPONSE.DATA].status;
				}
				if(arguments[RESPONSE.DATA].payment){
					response = arguments[RESPONSE.DATA].payment.result;
					glbPriceRes = arguments[RESPONSE.DATA];
				}
				if((response == STS_SUCCESS)||(response == true)){
					//출력 개시
					switch(jobSelecter){
						case JOB_TYPE.PRINT:
							Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
							var jobSeq=[];
							var _lst = FileListPage.docListManager.getCheckedItems();
							for(var i in _lst){
								jobSeq.push(_lst[i].uuid);
							}
							var printingObj = new SSMILib.SelectedPrnInfo4Print();
							printingObj.ip = glbInfo.PRINTER_IP;
							printingObj.uuid = jobSeq;

							SSMILib.PrintSelectedPrnInfo(printingObj, 59000, DATA.SERVER_URL);
							SSMILib.setEventListener(Common.onLoadEvent);
							break;
						case JOB_TYPE.COPY:
							Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
							doBoxPrintJobStart();
							break;
						case JOB_TYPE.SCAN:
							Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblInTransit);
							doMediaStoredJobStart();
							break;
						case JOB_TYPE.FAX:
							Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblInTransit);
							doBoxFaxJobStart();
							break;
						default:
							break;
					}
					break;
				}else{
					if(flg_Dummy_Beep){
						switch(jobSelecter){
							case JOB_TYPE.PRINT:
								Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
								var jobSeq=[];
								var _lst = FileListPage.docListManager.getCheckedItems();
								for(var i in _lst){
									jobSeq.push(_lst[i].uuid);
								}
								var printingObj = new SSMILib.SelectedPrnInfo4Print();
								printingObj.ip = glbInfo.PRINTER_IP;
								printingObj.uuid = jobSeq;
	
								SSMILib.PrintSelectedPrnInfo(printingObj, 59000, DATA.SERVER_URL);
								SSMILib.setEventListener(Common.onLoadEvent);
								break;
							case JOB_TYPE.COPY:
								Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
								doBoxPrintJobStart();
								break;
							case JOB_TYPE.SCAN:
								Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblInTransit);
								doMediaStoredJobStart();
								break;
							case JOB_TYPE.FAX:
								Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblInTransit);
								doBoxFaxJobStart();
								break;
							default:
								break;
						}
						/*
						KISUtil.debug("PriceRequest:", "Fail");
						glbNoticeInfo.type = NOTICE.INFO;
						glbNoticeInfo.message = Msg.NoticePopup.Msg_ChargeFail;
						PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
						*/
					}else{
						KISUtil.debug("PriceRequest:", "Fail");
						/*
						glbNoticeInfo.type = NOTICE.INFO;
						glbNoticeInfo.message = Msg.NoticePopup.Msg_ChargeFail;
						if(arguments[RESPONSE.DATA].reason){
							glbNoticeInfo.message = glbNoticeInfo.message + " " + arguments[RESPONSE.DATA].reason;
						}
						if(arguments[RESPONSE.DATA].payment){
							glbNoticeInfo.message = glbNoticeInfo.message + " " + arguments[RESPONSE.DATA].payment.reason;
						}
						PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
						*/
						PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}
				}
			}else{
				KISUtil.debug("PriceRequest:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (PR)" + glbConfigData.CHARGE_MODE.CHARGE_URL;
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}

			break;
		/* Copy Used Case *******************************************************************************************************/
		case "GetJobInfo":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var jobInfo = arguments[RESPONSE.DATA];
				if(jobInfo.Status=="completed")
				{
					if(jobInfo.StateReason){
						switch(jobInfo.StateReason){
							case "successfulCompletion":
								clearInterval(glbInterval);
								SSMILib.GetChildJobInfo(glbInfo.authMode, glbInfo.jobId, "DeviceJobInformation");
								break;
							default:
								clearInterval(glbInterval);
								//displayScanStatusPage(glbTexts["SCAN_STATUS_MSG"].ERROR);
								break;
						}
					}
				}
				else{

					//PageManager.changePage(MenuPage, PageManager.type.NORMAL);
					//currentPage = PageManager.getCurrentPage();
				}
			}else{
				KISUtil.debug("GetJobInfo:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (GJI)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "SetJobLog":
			if(arguments[RESPONSE.STATUS] == true)
			{
				var jobInfo = arguments[RESPONSE.DATA];
				if(jobInfo.status=="success"){
					BrowserExt.SetScreenChange("allservice");
				}else{
					PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
				}
			}else{
				KISUtil.debug("SetJobLog:", "Fail");
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (SJL)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "GetChildJobInfo":
			if(arguments[RESPONSE.STATUS] == true){
				var jobInfo = arguments[RESPONSE.DATA];
				for(var i = 0; jobInfo.length > i; i++){
					if(jobInfo[i].JobID && (jobInfo[i].JobType == "Scan")){
						glbJobLog.DeviceJobInformation = jobInfo[i];
						SSMILib.GetChildJobInfo(glbInfo.authMode, glbInfo.jobId, "MailBoxJobInformation");
					}
					if(jobInfo[i].DocumentID){
						glbJobLog.MailBoxJobInformation = jobInfo[i];
						SSMILib.GetChildJobInfo(glbInfo.authMode, glbInfo.jobId, "ScanImageInformation");
					}
					if(jobInfo[i].Sheets){
						glbJobLog.ScanImageInformation = jobInfo[i];
						SSMILib.GetChildJobInfo(glbInfo.authMode, glbInfo.jobId, "ScanImageDetailInformation");
					}
					if(jobInfo[i].ColorMode){
						glbJobLog.ScanImageDetailInformation = jobInfo[i];
						//jobSelecter = JOB_TYPE.COPY;
						PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						//currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
						Common.UpdateSetTrayInfo();
					}
				}
			}
			break;
		case "StartMediaScan":
			if(arguments[RESPONSE.STATUS] == true){
				SSMILib.GetMediaInformation(true);
			}else{
				glbMediaChkCnt--;
				if(glbMediaChkCnt > 0){
					setTimeout("SSMILib.StartMediaScan(true)", 1000)
					//SSMILib.StartMediaScan(true);
					break;
				}
				Common.setText("txt_CP_msg0", Msg.ChargeInfoPopup.scan_msg3);
				Common.setText("txt_CP_msg1", Msg.ChargeInfoPopup.scan_msg4);
			}
			break;
		case "GetMediaInformation":
			if(arguments[RESPONSE.STATUS] == true){
				WidgetLib.setWidgetStatus("btn_confirm",{enable:true});
				var result = Msg.ChargeInfoPopup.scan_msg5 + " " + arguments[2].RemainingCapacity + Msg.ChargeInfoPopup.GBYTE;
				Common.setText("txt_CP_msg0", result);
				Common.setText("txt_CP_msg1", Msg.ChargeInfoPopup.scan_msg6);
			}else{
				Common.setText("txt_CP_msg0", Msg.ChargeInfoPopup.scan_msg3);
				Common.setText("txt_CP_msg1", Msg.ChargeInfoPopup.scan_msg4);
			}
			break;
		case "ExecuteJFS":
			if(arguments[RESPONSE.STATUS] == true){
				var JobID = arguments[RESPONSE.DATA];
				//SSMILib.GetJobInfo(glbDeviceInfo.isDeviceAuth, JobID, "DeviceJobInformation");
				CopyJobMonitor.init(300);
				CopyJobMonitor.startMonitor(
					{
						successCallback:function(){
							setJobLogSave(true);
							KISUtil.debug("successCallback", "");
							if(flg_Dummy_Beep) {
								PageManager.changePage(MenuPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							}else{
								BrowserExt.Beep(0);
								BrowserExt.SetScreenChange("allservice");
							}
						},
						errorCallback:function(){
							setJobLogSave(false);
							KISUtil.debug("errorCallback", "");
						},
						cancelCallback:function(){
							setJobLogSave(false);
							KISUtil.debug("cancelCallback", "");
						},
						jobcount: 1
					},
					100);
			}else{
				KISUtil.debug("ExecuteJFS:", "Fail");
				if(arguments[RESPONSE]){
					KISUtil.debug("ExecuteJFS:", arguments[RESPONSE.DATA]);
				}else{
					KISUtil.debug("ExecuteJFS:", "no response");
				}
				glbNoticeInfo.type = NOTICE.FAIL;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (EJ)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "GetBridgeUserInfo":
			if(arguments[RESPONSE.STATUS] == true){
				for(var i = 0; i < 5; i++ ){
					if(glbConfigData.SCAN_PC_IP[i] == arguments[RESPONSE.DATA].clientid){
						if(arguments[RESPONSE.DATA].username != ""){
							glbConfigData.SCAN_PC_NAME[i] = arguments[RESPONSE.DATA].username;
						}
					}
				}
			}
			break;
		case "GetClientStatus":
			if(arguments[RESPONSE.STATUS] == true){
				PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
				currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
			}else{
				glbNoticeInfo.type = NOTICE.INFO;
				glbNoticeInfo.message = Msg.NoticePopup.Msg_NONE_PC + " (NP)";
				PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
				currentPage = PageManager.getCurrentPage();
			}
			break;
		case "onbuttonup":
			BrowserExt.Beep(0);
			if(id.indexOf("btn_MP_func_") != -1){
				var idArray= id.split("_");
				var _idx = idArray[3];
				id = "btn_MP_func";
			}
			switch(id)
			{
				case "btn_num_key0":
				case "btn_num_key1":
				case "btn_num_key2":
				case "btn_num_key3":
				case "btn_num_key4":
				case "btn_num_key5":
				case "btn_num_key6":
				case "btn_num_key7":
				case "btn_num_key8":
				case "btn_num_key9":
					//var fn = new Function("event_ID", "return event_ID.substring(9,10);");
					var _num = id.substring(11,12);
					//var _result = this.prnCntManager.insertNum(_num);
					switch(jobSelecter){
						case JOB_TYPE.PRINT:
							document.getElementById("tbx_OTID").value += _num;
							break;
						case JOB_TYPE.FAX:
							document.getElementById("tbx_faxnumber_input").value += _num;
							glbSetting.selectFaxSettings.areaCodeIndex = document.getElementById("tbx_faxarea_input").selectedIndex;
							var area_no = glbFaxAreaCodeOption[glbSetting.selectFaxSettings.areaCodeIndex].value;
							if(area_no == "direct"){
								Common.setText("faxnumber_input_info2", Msg.FAX_MAIN_MENU.FAX_NUMBER_INFO2 + document.getElementById("tbx_faxnumber_input").value + ")");
							}else{
								var input_no = document.getElementById("tbx_faxnumber_input").value;
								Common.setText("faxnumber_input_info2", Msg.FAX_MAIN_MENU.FAX_NUMBER_INFO2 + area_no + input_no + ")");
							}
							break;
						default:
							break;
					}
					break;
				case "btn_mul_key":	// * Clear
					switch(jobSelecter){
						case JOB_TYPE.PRINT:
							document.getElementById("tbx_OTID").value = "";
							break;
						case JOB_TYPE.FAX:
							document.getElementById("tbx_faxnumber_input").value = "";
							Common.setText("faxnumber_input_info2", Msg.FAX_MAIN_MENU.FAX_NUMBER_INFO2 + ")");
							break;
						default:
							break;
					}
					break;
				case "btn_sharp_key": // # Backspace
					switch(jobSelecter){
						case JOB_TYPE.PRINT:
							var _otid = document.getElementById("tbx_OTID").value;
							document.getElementById("tbx_OTID").value = _otid.substring(0, _otid.length - 1);
							break;
						case JOB_TYPE.FAX:
							var _faxNum = document.getElementById("tbx_faxnumber_input").value;
							document.getElementById("tbx_faxnumber_input").value = _faxNum.substring(0, _faxNum.length - 1);
							break;
						default:
							break;
					}
					break;
				case "btn_MP_faxinfo":
					glbNoticeInfo.type = NOTICE.FAX_INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_FAX_Send_Search_Guide;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					break;
				case "btn_PF_setting_save":
					BrowserExt.Beep(0);
					if(chk_content_to_option()){
						glbConfigData.DEFAULT_CHECK = true;		// 기본값에서 변경
						save_content_to_file(set_content_to_data(), CONFIG_DATA_FILE_NAME);
					}else{
						break;
					}
					glbNoticeInfo.type = NOTICE.INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_PowerOff;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					break;
				case "btn_PF2_setting_save":
					BrowserExt.Beep(0);
					if(chk_content_to_option()){
						glbConfigData.DEFAULT_CHECK = true;		// 기본값에서 변경
						save_content_to_file(set_content_to_data(), CONFIG_DATA_FILE_NAME);
					}else{
						break;
					}
					glbNoticeInfo.type = NOTICE.INFO;
					glbNoticeInfo.message = Msg.NoticePopup.Msg_PowerOff;
					PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					break;
				case "btn_PF_setting_cancel":
					BrowserExt.Beep(1);
					BrowserExt.SetScreenChange("allservice");
					break;
				case "btn_PF2_setting_cancel":
					BrowserExt.Beep(1);
					BrowserExt.SetScreenChange("allservice");
					break;
				case "btn_NT_confirm":
					BrowserExt.Beep(0);
					if(glbNoticeInfo.message == Msg.NoticePopup.Msg_BillFail){
						PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}else{
						BrowserExt.SetScreenChange("allservice");
					}
					break;
				case "btn_NT_retry":
					BrowserExt.Beep(0);
					/*
					if(glbNoticeInfo.message == Msg.NoticePopup.Msg_ChargeFail){
						PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}else{
						if(glbNoticeInfo.message == Msg.NoticePopup.Msg_Auth){
							PageManager.changePage(PreferencePage, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
						}else{
							BrowserExt.SetScreenChange("allservice");
						}
					}*/
					if(glbNoticeInfo.message == Msg.NoticePopup.Msg_NONE_PC  + " (NP)"){
						switch(DATA.SERVICE.SCAN_TYPE){
							case SCAN_TYPE_CHECK.USB:
								PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
								currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
								break;
							case SCAN_TYPE_CHECK.PC:
								PageManager.changePage(ScanTypeSelectPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
								currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
								break;
							case SCAN_TYPE_CHECK.USB_PC:
								PageManager.changePage(ScanTypeSelectPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
								currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
								break;
						}
					}
					//PageManager.changePage(PageManager.getPrevPage(), PageManager.type.ROLLBACK);
					//BrowserExt.Beep(0);
					break;
				case "btn_NT_admin":
					if((glbInfo.AuditronMode == "Internal Auditron")||(glbInfo.userInfo.displayName == "CE")){
						jobSelecter = JOB_TYPE.PRINT;
						PageManager.changePage(OTIDPopup, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					}else{
						BrowserExt.SetScreenChange("menuto:native_menu");
					}
					break;
				case "btn_MP_func":
					SSMILib.GetTrayInfo();
					switch(_idx)
					{
						case "Print":
							jobSelecter = JOB_TYPE.PRINT;
							PageManager.changePage(OTIDPopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
							break;
						case "Copy":
							jobSelecter = JOB_TYPE.COPY;
							PageManager.changePage(CopyMainPage, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
							break;
						case "Scan":
							if(glbConfigData.SERVICE.SCAN){
								jobSelecter = JOB_TYPE.SCAN;
								switch(DATA.SERVICE.SCAN_TYPE){
									case SCAN_TYPE_CHECK.USB:
										PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
										currentPage = PageManager.getCurrentPage();
										currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
										break;
									case SCAN_TYPE_CHECK.PC:
										PageManager.changePage(ScanTypeSelectPage, PageManager.type.NORMAL);
										currentPage = PageManager.getCurrentPage();
										currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
										break;
									case SCAN_TYPE_CHECK.USB_PC:
										PageManager.changePage(ScanTypeSelectPage, PageManager.type.NORMAL);
										currentPage = PageManager.getCurrentPage();
										currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
										break;
								}
								//PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
								//currentPage = PageManager.getCurrentPage();
								//currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
							}else{
								BrowserExt.SetScreenChange("menuto:" + glbConfigData.SERVICE.NATIVE_SCAN);
							}
							break;
						case "Fax":
							if(glbConfigData.SERVICE.FAX){
								jobSelecter = JOB_TYPE.FAX;
								PageManager.changePage(FaxMainPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
								currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
							}else{
								BrowserExt.SetScreenChange("menuto:" + glbConfigData.SERVICE.NATIVE_FAX);
							}
							break;
					}
					break;
				case "btn_scan_to_usb":
					BrowserExt.Beep(0);
					glbScanType = "usb";
					PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					break;
				case "btn_scan_to_pc0":
				case "btn_scan_to_pc1":
				case "btn_scan_to_pc2":
				case "btn_scan_to_pc3":
				case "btn_scan_to_pc4":
					BrowserExt.Beep(0);
					glbScanType = "pc";
					glbScanPcIdx = parseInt(id.substring(id.length, id.length - 1));

					getClientStatus(glbConfigData.SCAN_PC_IP[glbScanPcIdx]);
					/*
					PageManager.changePage(ScanMainPage, PageManager.type.NORMAL);
					currentPage = PageManager.getCurrentPage();
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					*/
					break;
				case "btn_OTID_confirm":
	            	BrowserExt.Beep(0);
	            	var tbxOTID = document.getElementById("tbx_OTID");
	                if (!tbxOTID.value) {
	                	BrowserExt.Beep(1);
	                    return;
	                }
	                if (tbxOTID.value == "x-admin") {
					//if (tbxOTID.value == "9434") {
	                    PageManager.changePage(PreferencePage, PageManager.type.NORMAL); //관리자 설정화면으로 이동
						currentPage = PageManager.getCurrentPage();
	                    tbxOTID.value = "";
						//SSMILib.GetPrintInformation(6000, DATA.SERVER_URL, glbInfo.userId);
	                    return;
	                }
	                WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: false });
	                glbInfo.userId = tbxOTID.value;
					SSMILib.GetPrintInformation(6000, DATA.SERVER_URL, glbInfo.userId);
	                tbxOTID.value = "";
	                break;
	            case "btn_OTID_cancel":
	                BrowserExt.Beep(0);
	                var tbxOTID = document.getElementById("tbx_OTID");
	                tbxOTID.value = "";
	                PageManager.changePage(PageManager.getPrevPage(), PageManager.type.ROLLBACK);
	                break;
				case "btnDocItem0":
				case "btnDocItem1":
				case "btnDocItem2":
				case "btnDocItem3":
				case "btnDocItem4":
				case "btnDocItem5":
				case "btnDocItem6"://TODO 확장시를 고려
					BrowserExt.Beep(0);
					var idx = parseInt(id.substring(id.length, id.length - 1));
					FileListPage.docListManager.selectItem(idx);
					//var _selectedDoc = FileListPage.docListManager.getSelectedDocInfo();						//TODO:delete???
					//chkDocPrintPossible();
					Common.UpdateSetTrayInfo();
					break;
				case "btn_FL_pageFirst":
					BrowserExt.Beep(0);
					FileListPage.docListManager.goFirstPage();
					break;
				case "btn_FL_pageUp":
					BrowserExt.Beep(0);
					FileListPage.docListManager.goPrevPage();
					break;
				case "btn_FL_pageDown":
					BrowserExt.Beep(0);
					FileListPage.docListManager.goNextPage();
					break;
				case "btn_FL_pageLast":
					BrowserExt.Beep(0);
					FileListPage.docListManager.goLastPage();
					break;
				case "btn_FL_SelectAll":
					BrowserExt.Beep(0);
					//인쇄매수 변경분 반영
					FileListPage.docListManager.selectAllItems();
					//chkDocPrintPossible();
					break;
				case "btn_FL_DeleteFile":
					BrowserExt.Beep(0);
					var _lst = FileListPage.docListManager.getCheckedItems();
					if(_lst.length>0){
						WidgetLib.setWidgetStatus("btn_FL_DeleteFile",{enable:false});		//버튼 연타를 막기위한 조치
						var printingObj = new SSMILib.SelectedPrnInfo4Delete();
						for(var i in _lst){
							printingObj.uuid = _lst[i].uuid;
							SSMILib.DeleteSelectedPrnInfo(printingObj, 59000, DATA.SERVER_URL);
							SSMILib.setEventListener(Common.onLoadEvent);
						}
					}else{
						BrowserExt.Beep(1);
						KISUtil.debug("FileListPage.EventHandler/onbuttonup/btn_FL_Print/lst.length",_lst.length);
						// ToDo: 임시로 메인 메뉴로...
						PageManager.changePage(MenuPage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
					}
					break;
				case "btn_FL_Print":
					//인쇄 가능여부 판단
					var _lst = FileListPage.docListManager.getCheckedItems();
					if(_lst.length>0){
						WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});		//버튼 연타를 막기위한 조치
						//Run Job
						BrowserExt.Beep(0);
						Common.calculateCharge(_lst);
						//jobSelecter = JOB_TYPE.PRINT;
						PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
					}
					else{
						BrowserExt.Beep(1);
						KISUtil.debug("FileListPage.EventHandler/onbuttonup/btn_FL_Print/lst.length",_lst.length);
						// ToDo: 임시로 메인 메뉴로...
						PageManager.changePage(MenuPage, PageManager.type.NORMAL);
						currentPage = PageManager.getCurrentPage();
						currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
					}
					break;
				case "btn_confirm"://선결제
					switch(jobSelecter){
						case JOB_TYPE.PRINT:
							var _lst = FileListPage.docListManager.getCheckedItems();
							var data = {};
							if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								var date = new Date();
								var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
								data = {
									"payment" : {
										"type": "charge",
										"cost": priceInfoObj.price
									},
									"device" : {
										"mfd": glbDeviceInfo.serialNumber
									},
									"job":{
										"no": timestamp,
										"type": JOB_TYPE.PRINT,
										"total_pages": glbDataSet.printSelectedCnt.toString()
									}
								};

							}else{
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								priceInfoObj.type = "request";
								priceInfoObj.MFIP = glbInfo.PRINTER_IP;
							}
							if(priceInfoObj.price == 0){
								//Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
								priceZero = true;
								var jobSeq=[];
								//var _lst = FileListPage.docListManager.getCheckedItems();
								for(var i in _lst){
									jobSeq.push(_lst[i].uuid);
								}
								var printingObj = new SSMILib.SelectedPrnInfo4Print();
								printingObj.ip = glbInfo.PRINTER_IP;
								printingObj.uuid = jobSeq;

								// JobMonitor
								PrintJobMonitor.init(300);
								PrintJobMonitor.startMonitor(
									{
										successCallback:function(){
											setJobLogSave(true);
											KISUtil.debug("successCallback", "");
											if(flg_Dummy_Beep) {
												PageManager.changePage(MenuPage, PageManager.type.NORMAL);
												currentPage = PageManager.getCurrentPage();
											}else{
												BrowserExt.Beep(0);
												BrowserExt.SetScreenChange("allservice");
											}
										},
										errorCallback:function(){
											setJobLogSave(false);
											KISUtil.debug("errorCallback", "");
											glbNoticeInfo.type = NOTICE.FAIL;
											glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (PS)";
											PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
											currentPage = PageManager.getCurrentPage();
										},
										cancelCallback:function(){KISUtil.debug("cancelCallback", "");},
										jobcount: 1
									},
									100);

								SSMILib.PrintSelectedPrnInfo(printingObj, 59000, DATA.SERVER_URL);
								SSMILib.setEventListener(Common.onLoadEvent);
							}else{
								if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
									var priceObj = data && JSON.stringify(data);
									SSMILib.PriceJetWorksRequest(priceObj, 60000, DATA.CHARGE_MODE.CHARGE_URL, "Payment");
								}else{
									SSMILib.PriceRequest(priceInfoObj, 100000, DATA.SERVER_URL, "Payment");
								}
							}
							PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							break;
						case JOB_TYPE.COPY:
							var data = {};
							if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								var date = new Date();
								var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
								data = {
									"payment" : {
										"type": "charge",
										"cost": priceInfoObj.price
									},
									"device" : {
										"mfd": glbDeviceInfo.serialNumber
									},
									"job":{
										"no": timestamp,
										"type": JOB_TYPE.COPY,
										"total_pages": glbJobLog.ScanImageInformation.Impressions
									}
								};
							}else{
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								priceInfoObj.type = "request";
								priceInfoObj.MFIP = glbInfo.PRINTER_IP;
							}
							if(priceInfoObj.price == 0){
								//Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
								priceZero = true;
								doBoxPrintJobStart();
							}else{
								if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
									var priceObj = data && JSON.stringify(data);
									SSMILib.PriceJetWorksRequest(priceObj, 60000, DATA.CHARGE_MODE.CHARGE_URL, "Payment");
								}else{
									SSMILib.PriceRequest(priceInfoObj, 100000, DATA.SERVER_URL, "Payment");
								}
							}
							PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							break;
						case JOB_TYPE.SCAN:
							var data = {};
							if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								var date = new Date();
								var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
								data = {
									"payment" : {
										"type": "charge",
										"cost": priceInfoObj.price
									},
									"device" : {
										"mfd": glbDeviceInfo.serialNumber
									},
									"job":{
										"no": timestamp,
										"type": JOB_TYPE.SCAN,
										"total_pages": glbJobLog.ScanImageInformation.Impressions
									}
								};
							}else{
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								priceInfoObj.type = "request";
								priceInfoObj.MFIP = glbInfo.PRINTER_IP;
							}
							if(priceInfoObj.price == 0){
								//Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblInTransit);
								priceZero = true;
								doMediaStoredJobStart();
							}else{
								if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
									var priceObj = data && JSON.stringify(data);
									SSMILib.PriceJetWorksRequest(priceObj, 60000, glbConfigData.CHARGE_MODE.CHARGE_URL, "Payment");
								}else{
									SSMILib.PriceRequest(priceInfoObj, 100000, glbConfigData.SERVER_URL, "Payment");
								}
							}
							PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							break;
						case JOB_TYPE.FAX:
							var data = {};
							if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								var date = new Date();
								var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
								data = {
									"payment" : {
										"type": "charge",
										"cost": priceInfoObj.price
									},
									"device" : {
										"mfd": glbDeviceInfo.serialNumber
									},
									"job":{
										"no": timestamp,
										"type": JOB_TYPE.FAX,
										"total_pages": glbJobLog.ScanImageInformation.Impressions
									}
								};
							}else{
								var priceInfoObj = new SSMILib.PriceInfo();
								priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
								priceInfoObj.type = "request";
								priceInfoObj.MFIP = glbInfo.PRINTER_IP;
							}
							if(priceInfoObj.price == 0){
								//Common.setText("lbl_printing_progress", Msg.PrintingPopup.lblPrinting);
								priceZero = true;
								doBoxFaxJobStart();
							}else{
								if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
									var priceObj = data && JSON.stringify(data);
									SSMILib.PriceJetWorksRequest(priceObj, 60000, DATA.CHARGE_MODE.CHARGE_URL, "Payment");
								}else{
									SSMILib.PriceRequest(priceInfoObj, 100000, DATA.SERVER_URL, "Payment");
								}
							}
							PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							break;
						default:
							glbNoticeInfo.type = NOTICE.FAIL;
							glbNoticeInfo.message = Msg.NoticePopup.Msg_ChargeInfoFail;
							PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
							currentPage = PageManager.getCurrentPage();
							// 과금 실패
					}
					/* ToDo 나중에 손유승 대표용으로 사용할 필요성이 있는 코드임.
					if(jobSelecter == JOB_TYPE.PRINT){
						var _lst = FileListPage.docListManager.getCheckedItems();
					}
					if(DATA.CHARGE_MODE.CHARGE_TYPE == "RELAY"){
						var priceInfoObj = new SSMILib.PriceInfo();
						priceInfoObj.price = glbDataSet.priceInfo.totalPrice;
						priceInfoObj.type = "request";
						priceInfoObj.MFIP = glbInfo.PRINTER_IP;
						SSMILib.PriceRequest(priceInfoObj, 100000, DATA.SERVER_URL, "Payment");
						PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
					}else{
						var priceInfoObj = new SSMILib.PriceJetWorkInfo();
						priceInfoObj.jobType = "Copy";
						priceInfoObj.totalAmount = parseInt(glbDataSet.priceInfo.totalPrice);

						priceInfoObj.totalPages = 2;
						priceInfoObj.color = true;
						priceInfoObj.paperSize = "A4";
						SSMILib.PriceJetWorkRequest(priceInfoObj, 100000, DATA.CHARGE_MODE.CHARGE_URL, "Payment");
						PageManager.changePage(PrintingPopup, PageManager.type.NORMAL);
					}
					*/
					break;
				case "btn_DP_CP_cancel":
					// 작업취소 초기화 합니다.
					BrowserExt.Beep(1);
					BrowserExt.SetScreenChange("allservice");
					break;
				case "copy_setting_copies_plus_btn":
					var copies_cnt = parseInt(document.getElementById("box_copy_setting_copies").value);
					copies_cnt++;
					if(copies_cnt > 100){
						copies_cnt = 100;
					}
					document.getElementById("box_copy_setting_copies").value = copies_cnt.toString();
					glbSetting.selectScanSettings.outputCopiese = document.getElementById("box_copy_setting_copies").value;
					break;
				case "copy_setting_copies_minus_btn":
					var copies_cnt = parseInt(document.getElementById("box_copy_setting_copies").value);
					copies_cnt--;
					if(copies_cnt < 1){
						copies_cnt = 1;
					}
					document.getElementById("box_copy_setting_copies").value = copies_cnt.toString();
					glbSetting.selectScanSettings.outputCopiese = document.getElementById("box_copy_setting_copies").value;
					break;
				case "copy_setting_manual_mag_plus_btn":
					document.getElementById("copy_setting_mag").selectedIndex = 11;
					document.getElementById("copy_setting_mag").value = MAG_OPTION.MANUAL;
					document.getElementById("box_copy_setting_manual_mag").disabled = false;
					var copies_cnt = parseInt(document.getElementById("box_copy_setting_manual_mag").value);
					copies_cnt++;
					if(copies_cnt > 400){
						copies_cnt = 400;
					}
					document.getElementById("box_copy_setting_manual_mag").value = copies_cnt.toString();
					//glbSetting.selectScanSettings.outputCopiese = document.getElementById("box_copy_setting_copies").value;
					break;
				case "copy_setting_manual_mag_minus_btn":
					document.getElementById("copy_setting_mag").selectedIndex = 11;
					document.getElementById("copy_setting_mag").value = MAG_OPTION.MANUAL;
					document.getElementById("box_copy_setting_manual_mag").disabled = false;
					var copies_cnt = parseInt(document.getElementById("box_copy_setting_manual_mag").value);
					copies_cnt--;
					if(copies_cnt < 30){
						copies_cnt = 30;
					}
					document.getElementById("box_copy_setting_manual_mag").value = copies_cnt.toString();
					//glbSetting.selectScanSettings.outputCopiese = document.getElementById("box_copy_setting_copies").value;
					break;
				case "copy_setting_start_btn":
					WidgetLib.setWidgetStatus("copy_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
					// Copy START
					KISUtil.debug("CopyStart", "MailBox");
					testScanJobStart();
					/*
					KISUtil.debug("GetCopyScanStart:", "doMediaScanJobStart()");
					doScanJobStart();
					PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
					*/
					break;
				case "scan_setting_start_btn":
					WidgetLib.setWidgetStatus("scan_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
					// Scan START
					doMediaScanJobStart();
					PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
					break;
				case "fax_setting_start_btn":
					// Fax START
					var tbxFaxNumber = document.getElementById("tbx_faxnumber_input");
					glbSetting.selectFaxSettings.areaCodeIndex = document.getElementById("tbx_faxarea_input").selectedIndex;
					var area_no = glbFaxAreaCodeOption[glbSetting.selectFaxSettings.areaCodeIndex].value;
					if(area_no != "direct"){
						var input_no = document.getElementById("tbx_faxnumber_input").value;
						if (!tbxFaxNumber.value) {
							BrowserExt.Beep(1);
							return;
						}
						tbxFaxNumber.value = area_no + input_no;
					}

                    if (!tbxFaxNumber.value) {
                        BrowserExt.Beep(1);
                        return;
                    }
                    WidgetLib.setWidgetStatus("copy_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
                    glbInfo.faxNumber = tbxFaxNumber.value;
                    tbxFaxNumber.value = "";
					doFaxScanJobStart();
					PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
					break;
				case "btn_PF_find_scan_pc":
					/*
					Common.setText("btn_PF_find_scan_msg", Msg.PreferencePage.SCAN_PC_SERCH_MSG1);
					glbSerchLimit = glbSerchLimit + 10;
					var ip = glbSerchLimit - 10;
					var clientid = glbSubNet + ip.toString();
					getBridgeUserInfo(clientid);
					*/
					glbScanPcSet = true;
					PageManager.changePage(PreferencePage2 , PageManager.type.NORMAL);
					break;
				case "btn_PF_mfd_home":
					BrowserExt.SetScreenChange("menuto:native_menu");
					break;
				case "btn_PF2_mfd_home":
					BrowserExt.SetScreenChange("menuto:native_menu");
					break;
				case "btn_MP_language_ko":
					WidgetLib.setWidgetStatus("btn_MP_language_ko",{on:true});
					WidgetLib.setWidgetStatus("btn_MP_language_en",{on:false});
					if(glbInfo.setLanguage != "ko"){
						// 한국어가 아닐 경우에만
						Msg = Msg_lang["ko"];
						glbInfo.setLanguage = "ko";
						Common.changeLanguage();
					}
					break;
				case "btn_MP_language_en":
					WidgetLib.setWidgetStatus("btn_MP_language_en",{on:true});
					WidgetLib.setWidgetStatus("btn_MP_language_ko",{on:false});
					if(glbInfo.setLanguage != "en"){
						// 영어가 아닐 경우에만
						Msg = Msg_lang["en"];
						glbInfo.setLanguage = "en";
						Common.changeLanguage();
					}
					break;
				default:
			}
			break;
		case "onhardkeydown":
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_START:
					var currrent_page = PageManager.getCurrentPage();
					switch(currrent_page.ID){
						case FileListPage.ID:
							//인쇄 가능여부 판단
							var _lst = FileListPage.docListManager.getCheckedItems();
							if(_lst.length>0){
								WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});		//버튼 연타를 막기위한 조치
								//Run Job
								BrowserExt.Beep(0);
								Common.calculateCharge(_lst);
								//jobSelecter = JOB_TYPE.PRINT;
								PageManager.changePage(ChargeInfoPopup , PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							}
							else{
								BrowserExt.Beep(1);
								KISUtil.debug("FileListPage.EventHandler/onbuttonup/btn_FL_Print/lst.length",_lst.length);
								// ToDo: 임시로 메인 메뉴로...
								PageManager.changePage(MenuPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
								currentPage.EventHandler(arguments[RESPONSE.ID], arguments[RESPONSE.STATUS], arguments[RESPONSE.DATA]);
							}
							break;
						case CopyMainPage.ID:
							WidgetLib.setWidgetStatus("copy_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
							// Copy START
							doScanJobStart();
							PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
							break;
						case ScanMainPage.ID:
							WidgetLib.setWidgetStatus("scan_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
							// Scan START
							doMediaScanJobStart();
							PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
							break;
						case FaxMainPage.ID:
							// Fax START
							var tbxFaxNumber = document.getElementById("tbx_faxnumber_input");
							glbSetting.selectFaxSettings.areaCodeIndex = document.getElementById("tbx_faxarea_input").selectedIndex;
							var area_no = glbFaxAreaCodeOption[glbSetting.selectFaxSettings.areaCodeIndex].value;
							if(area_no != "direct"){
								var input_no = document.getElementById("tbx_faxnumber_input").value;
								if (!tbxFaxNumber.value) {
									BrowserExt.Beep(1);
									return;
								}
								tbxFaxNumber.value = area_no + input_no;
							}
                    		if (!tbxFaxNumber.value) {
                        		BrowserExt.Beep(1);
                        		return;
                    		}
                    		WidgetLib.setWidgetStatus("copy_setting_start_btn",{enable:false});		//버튼 연타를 막기위한 조치
                    		glbInfo.faxNumber = tbxFaxNumber.value;
                    		tbxFaxNumber.value = "";
							doFaxScanJobStart();
							PageManager.changePage(ScanningPopup , PageManager.type.NORMAL);
							break;
						default:
							BrowserExt.Beep(1);
					}
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
	}
}

/**
 * 로그인 정보를 만료시키고 로그인 페이지표시하기위한 메소드
 */
Common.LogOut = function(){
	//데이터 초기화(로그인후 취득한)
	delete glbInfo.userId;
	delete glbInfo.userPw;
	delete glbInfo.cardId; //TODO 이후 카드ID대응시
	//만일 서비스가 기동중인경우 서비스창 닫기 실행
	//로그인 페이지로 천이
	SSMILib.GetTrayInfo();
};

Common.retryLogInOut = function(isLogin){

	glbInfo.loginCount=DATA.LOGIN_INFO.COUNTER;

	if(glbInfo.loginCount>0){
		if(isLogin){
			SSMILib.LoginDev(DATA.LOGIN_INFO.ID, DATA.LOGIN_INFO.PASSWORD);
		}else{
			SSMILib.LogoutDev();
		}
		WaitingPage.count--;
	}else{
		clearTimeout(glbInfo.loginTimer);
		WaitingPage.count=DATA.LOGIN_INFO.COUNTER;
		if(isLogin){ //timeout
			KISUtil.debug("retryLogInOut:", "Fail");
			glbNoticeInfo.type = NOTICE.FAIL;
			glbNoticeInfo.message = Msg.NoticePopup.Msg_ResFail + " (RL)";
			PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
		}else{
			glbNoticeInfo.type = NOTICE.FAIL;
			glbNoticeInfo.message = Msg.NoticePopup.Msg_Other;
			PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
			currentPage = PageManager.getCurrentPage();
		}
		PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
	}
};

/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function()
{
	Common.setImage("icn_TB_logo", Img.TOP_BAR_LOGO_ICON);
	Common.setImage("icn_TB_trayStatus_0", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_1", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_2", Img.TOP_BAR_TRAY_000_ICON);
	Common.setImage("icn_TB_trayStatus_3", Img.TOP_BAR_TRAY_000_ICON);
	//Common.setText("lbl_TB_csTitle", Msg.TOP_BAR.TITLE_NAME);
	Common.setText("lbl_TB_csTitle", glbConfigData.BAR_TITLE);
	Common.setText("lbl_TB_traySize_0", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_1", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_2", Msg.TOP_BAR.DEFAULT_SIZE);
	Common.setText("lbl_TB_traySize_3", Msg.TOP_BAR.DEFAULT_SIZE);
};
/**
 * Tray 잔량 표시 Update
 */
Common.updateDisplayTrayIcon = function()
{
	var icon_Index = TRAY_FULL - glbInfo.trayCount;
	// Not exist tray icon delete
	for(var i = COUNT_INIT; i < icon_Index; i++)
	{
		var iconId = "icn_TB_trayStatus_" + i.toString();
		var txtId = "lbl_TB_traySize_" + i.toString();
		Common.changeVisibility(iconId, 'none');
		Common.changeVisibility(txtId, 'none');

	}
	// tray remaining icon change
	for(var i = icon_Index; i < TRAY_FULL ; i++)
	{
		var iconId = "icn_TB_trayStatus_" + i.toString();
		var txtId = "lbl_TB_traySize_" + i.toString();
		image = Img.TOP_BAR_TRAY_000_ICON;
		switch(levelCheck(glbInfo.trayInfo[i - icon_Index].CurrentLevel))
		{
			case "100%":
				image = Img.TOP_BAR_TRAY_100_ICON;
				break;
			case "75%":
				image = Img.TOP_BAR_TRAY_075_ICON;
				break;
			case "50%":
				image = Img.TOP_BAR_TRAY_050_ICON;
				break;
			case "25%":
				image = Img.TOP_BAR_TRAY_025_ICON;
				break;
			case "0%":
			default:
		}
		Common.setImage(iconId, image);
		// tray size text change
		Common.setText(txtId, sizeCheck(glbInfo.trayInfo[i - icon_Index].MediumSize))
		KISUtil.debug(glbInfo.trayInfo[i - icon_Index].Name + " = ", glbInfo.trayInfo[i - icon_Index].CurrentLevel + "%");
	}


	function levelCheck(CurrentLevel)
	{
		var result;
		var level = parseInt(CurrentLevel);
		if((level <= 100)&&(level > 75) ){
			result = "100%";
		}else if ((level <= 75)&&(level > 50)) {
			result = "75%";
		}else if ((level <= 50)&&(level > 25)) {
			result = "50%";
		}else if ((level <= 25)&&(level > 0)) {
			result = "25%";
		}else{
			if(level < 0){
				result = "50%";
			}else{
				result = "0%";
			}
		}
		return result;
	};
	function sizeCheck(size)
	{
		// A4, A3, B5, B4 총 4가지 용지만 지원함, 이외의 용지는 "?"처리
		var result = "A4:";
		if(size.length > 2){
			if(size.indexOf("B4") == -1)
			{
				if(size.indexOf("B5") == -1)
				{
					result = "?:";
				}else{
					result = "B5:";
				}
			}else{
				result = "B4:";
			}
		}else{
			if((size == "A4")||(size == "A3"))
			{
				result = size + ":";
			}else{
				result = "?:";
			}
		}
		return result;
	};
}

Common.UpdateSetTrayInfo = function()
{
	var objTrays = new SSMILib.TrayInfo();
	objTrays.ipAddress = glbInfo.PRINTER_IP;
	objTrays.serialNo = glbDeviceInfo.serialNumber;
	for(var i = 0; glbInfo.trayInfo.length > i; i++){
		objTrays.trays.push({"residualQuantity":glbInfo.trayInfo[i].CurrentLevel, "paperSize": sizeCheck(glbInfo.trayInfo[i].MediumSize)});
	}
	SSMILib.SetTrayInfo(objTrays, 2000, DATA.SERVER_URL);
}

Common.checkEmptyTrayInfo = function()
{
	if(chkTrayInfo == false){
		for(var i = 0; glbInfo.trayInfo.length > i; i++){
			if(glbInfo.trayInfo[i].Status == "EMPTY"){
				SSMILib.ReqTrayInfo(1000, DATA.SERVER_URL);
				chkTrayInfo = true;
				return;
			}
		}
	}
}

Common.changeLanguage = function()
{
	//Common.setText("lbl_TB_csTitle", Msg.TOP_BAR.TITLE_NAME);
	Common.setText("lbl_TB_csTitle", glbConfigData.BAR_TITLE);
	MenuPage.changeLanguage();
}


/**************************************************************** 共通 ****************************************************************/
/**
 * 화면 Object의 문자열 표시 처리
 * @param {string} id :Object의 ID
 * @param {string} string :표시할 문자열
 */
Common.setText = function(id, str)
{
	var textNode
	if(typeof id === String||typeof id === "string"){
		textNode = document.getElementById(id);
		if(!textNode || str == undefined){
			alert("id=" + id + " : string=" + str);
			return;
		}
	}
	else if(typeof id === Object){
		textNode = id;
	}
	else{
		return;
	}
	switch(textNode.nodeName.toLowerCase())
	{
		case "div":
		case "textarea":
		case "option":
		case "span":
		case "p":
			while(textNode.firstChild){
				textNode.removeChild(textNode.firstChild);
			}
			if(str instanceof Array)
			{
				var tmp;
				for(var i = 0, il = str.length; i < il; i++)
				{
					tmp=document.createElement("p");
					tmp.innerHTML=str[i];
					textNode.appendChild(tmp);
				}
			}
			else
			{
				textNode.appendChild(document.createTextNode(str));
			}
			break;
		case "input":
			//textNode.setAttribute("value",str);
			textNode["value"] = str;				//textbox의 값 갱신 오류 대응
			break;
		default:
			break;
	}
};

/**
 * 화면 Object의 Image표시 처리
 * @param {string} id : Object ID
 * @param {string} src : Image의 Hendle
 */
Common.setImage = function (id, src)
{
	var imgNode = document.getElementById(id);
	if(!imgNode || !src || imgNode.src == src){
		alert("id=" + id + " : src=" + src);
		return;
	}
	imgNode.setAttribute("src", src);
};

/**
 * Text를 취득 한다.
 * @param {string} id : Text를 취득하는 Object ID
 * @return {string} : 지정된 ID의 Text
 */
Common.getText = function (id)
{
	var obj = document.getElementById(id);
	if(!obj || !id){
		return;
	}
	return obj.firstChild.nodeValue;
};

/**
 * 화면 Object의 Text Color변경 처리<br>
 * Off의 경우, #000000지정
 * disable의 경우, #ADAAAD지정
 * @param {string} id : Object의 ID
 * @param {string} color : Text의 Color
 */
Common.setTextColor = function(id, color)
{
	if(!id || !color){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		obj.style.color = color;
	}
};

/**
 * Object의 표시/비표시를 처리
 * @param {string} id : 표시를 변경하는 Object ID
 * @param {string} attr : display를 지정하는 문자열(none, block)
 */
Common.changeVisibility = function(id, attr)
{
	var obj = document.getElementById(id);
	if(!id || !attr || !obj){
		return;
	}
	if(obj.style.display != attr) {
		obj.style.display = attr;
	}
};

/**
 * HTML Element를 작성
 * @param {string} tag : Tag명
 * @param {object} attrs: Teg에 할당된 속성
 * @return 작성된 Tag의 Element
 */
Common.getNewElement = function(tag,attrs)
{
	var result = null;
	if(tag)
	{
		result=document.createElement(tag);

		if(attrs.id){	result.setAttribute("id",attrs.id);	}
		if(attrs.className){	result.setAttribute("class",attrs.className);	}
	}
	return result;
};

/**
 * Event를 할당한다.（사용되지 않고 있다)
 * @param {string} id : Tag ID
 * @param {string} eventName : Event의 종류
 * @param {event} event : 할당된 Event
 */
Common.setEvent=function(id,eventName,event)
{
	var obj=document.getElementById(id);
	if(obj&&eventName&&event){
		if(obj.attachEvent)obj.attachEvent(eventName,event);
		else if(obj.addEventListener)obj.addEventListener(eventName,event,false);
	}
};

/**
 * 문자열의 Bytes수를 계산한다.
 * @param {string} str : 문자열
 * @return {int} cnt : 문자열의 Byte수(반각 기준)
 */
//Common.getStringByteNumber=function(str)
Common.getStringSize = function(str)
{
	var cnt = 0;
	var c;
	for(var i=0; i<str.length; i++){
		c = str.charCodeAt(i);
		//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
		//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
		if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
			cnt++;
		}else{
			cnt += 2;
		}
	}
	return cnt;
};

/**
 * 지정된 문자열을 잘라 문자열을 분할 한다.
 * @param {string} str : 문자열
 * @param {int} num : 잘라낼 문자열 Bytes수
 * @return {array} strArray : 분할한 문자열 배열
 */

Common.splitString=function (str, num, cnt)
{
	var strArray = [];
	var tmp = [];

	var nowByte = 0;
	var i = 0,iMax=str.length;
	var c;

	var step=0;
	for(i=0;i<iMax;i++){
		c = str.charCodeAt(i);
	//while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step < num)		//이하의 내용일 경우
		{
			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
		}
		else if(nowByte+step == num)	//상한에 도달한 경우
		{
			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;
		}
		else if(nowByte+step > num)	//상한을 초과하는 경우
		{
			//문자열을 격납하고, tmp를 초기화
			strArray[strArray.length] = tmp.join("");
			tmp = [];
			nowByte = 0;

			//문자열을 Copy
			//tmp[tmp.length] = str.substr(i++, 1);
			tmp[tmp.length] = str.substr(i, 1);
			nowByte+=step;
		}
	}

	if(tmp.length > 0){
		strArray[strArray.length] = tmp.join("");
	}
	tmp = null;

	if(cnt&&strArray.length<cnt)
	{
		for(var i=strArray.length;i<cnt;i++)
		{
			strArray[i]="";
		}
	}
	return strArray;
};

Common.splitStr = function (str, chunkSize){
	var chunks = [];
	while (str) {
	    if (str.length < chunkSize) {
	        chunks.push(str);
	        break;
	    }
	    else {
	        chunks.push(str.substr(0, chunkSize));
	        str = str.substr(chunkSize);
	    }
	}
	return chunks;
};

Common.getIdx=function(id){return parseInt(id.substring(id.length, id.length-1));};

/**
 * 문자의 폭을 판단한다.
 * @param {string} c : 문자열
 * @return {bool} true: 전각, false:반각
 */
Common.isEmSizeCharacter = function(c)
{
	var width = true;
	//Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
	//Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
	if((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)){
		width = false;
	}
	return width;
};

/**
 * 문자열을 지정된 Bytes수로 자른다
 * @param {string} str : 문자열
 * @param {int} bytes : 잘라낼 Bytes수
 * @return {string} : 지정 Bytes수로 잘라낸 문자열
 */
Common.cutStringWidth = function(str, num)
{
	var tmp = [];

	var nowByte = 0;
	var i = 0;
	var c;

	var step=0;
	while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step <= num)
		{
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte += step;
		}
		else
		{
			break;
		}
	}
	return tmp.join("");
};

/**
 * List에서 Index를 반환 /Lib문제로 Prototype대신 별도의 Function으로 작성
 * @param {Array} collection
 * @param {object} obj
 * @return {int} idx : 대상이 없는 경우는 -1
 */
Common.indexOf = function(collection,obj)
{
	var idx = -1;
	if(collection instanceof Array)
	{
		for(var i = 0,il = collection.length; i < il; i++)
		{
			if(collection[i] == obj)
			{
				idx=i;
				break;
			}
		}
	}
	return idx;
};

Common.contains = function(collection,obj){
	return (this.indexOf(collection,obj) > -1);
};

/**
 * 해당 Element의 CSS Class를 설정
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 해당하는 Class의 이름
 */
Common.setClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.className = arg;
	}
};

Common.getClassList = function(obj){
	return obj.className.split(" ");
};

Common.setClassList = function(obj, lst){
	obj.className = lst.join(" ");
};

/**
 * 해당 Element의 CSS Class를 추가
 * @param {string} id : 추가할 Object의 ID
 * @param {string} arg : 추가된 Class의 이름
 */
Common.addClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList) {
			obj.classList.add(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			if(idx == -1) {
				lst.push(arg);
				Common.setClassList(obj, lst);
			}
		}
	}
};

/**
 * 해당 Element의 CSS Class를 제거
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 제거된 Class의 이름
 */
Common.removeClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		if(obj.classList){
			obj.classList.remove(arg);
		}
		else{
			var lst = Common.getClassList(obj);
			var idx = Common.indexOf(lst, arg);
			while(idx > -1) {
				lst.splice(idx, 1);
				idx = Common.indexOf(lst, arg);
			}
			Common.setClassList(obj, lst);
		}
	}
};
/**
 * 해당 Element의 CSS Class를 Toggle
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : Toggle된 Class의 이름
 */
Common.toggleClass = function(id, arg)
{
	var obj = document.getElementById(id);
	if(obj)
	{
		obj.classList2.toggle(arg);
	}
};


Common.compareStr = function(strInput, strOutput)
{
	var i;
	for( i = strOutput.length, il = 0; i > il; --i) {
		if(strInput[i] == strOutput[i]) {
			break;
		}
	}
	return i+1;
};

Common.trimByEncodingSize = function(str, size)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, size)
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult)
};
Common.getDecode = function(str)
{
	var result;
	try
	{
		result = decodeURIComponent(str);
	}
	catch(ex)
	{
		var pattern = /%[^%]+$/;
		var trimStr = str.replace(pattern,'');
		result = Common.getDecode(trimStr);
	}
	return result;
};

Common.trimEncodedString = function(str, length)
{
	var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
	var trimedStr = encodedStr.substr(0, length)
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult)
};

/**
 * Page를 Click할 때의 Event/현재의 Page의 OnPageClick Event
 */
function onPageClick()
{
	var currentPage = PageManager.getCurrentPage();
	if(currentPage){
		if(currentPage.onPageClick)currentPage.onPageClick();
	}
};

/**
 * Object가 Null 또는 Empty상태일 때의 판별
 */
Common.isNullOrEmpty = function(obj){
	var result = false;
	switch(typeof obj){
		case "undefined":
			result = true;
			break;
		case "object":
			if(obj === null){
				result = true;
			}
			break;
		case "string":
			if(obj === null || obj === ""){
				result = true;
			}
			break;
		default:
			//console.log(obj);
			break;
	}
	return result;
};

Common.removePrefix = function(str){
	var pattern = /([^:]+)$/;
	var result = str.match(pattern);
	return result[1];
};

// Changes XML to JSON
Common.xmlToJson = function(xml)
{
	// Create the return object
	var obj = {};
	// do children
	if (xml.hasChildNodes()) {
		for (var i = 0, iMax = xml.childNodes.length; i < iMax; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = this.removePrefix(item.nodeName);
			if (item.nodeType == 1) {//object
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = this.xmlToJson(item);
				}
				else {
					if (typeof (obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
						obj.flg=true;
					}
					obj[nodeName].push(this.xmlToJson(item));
				}
			}
			else if (item.nodeType == 3) {// text
				obj = item.nodeValue;
			}
		}
		if(obj.flg == true){
			var old = obj[nodeName];
			obj = old;
		}
	}
	return obj;
};

Common.getIndex = function(collection,_value){
	var idx = -1;
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			idx = i;
			break;
		}
	}
	return idx;
};

Common.getKey = function(collection,_value){
	var key = "";
	var tmp;
	for(var i = 0, iMax = collection.length; i < iMax; i++){
		tmp = collection[i];
		if(tmp.value == _value){
			key = tmp.key;
			break;
		}
	}
	return key;
};

Common.setIndex = function(_id,_idx){
	var obj = document.getElementById(_id);
	if(obj && obj.tagName.toLowerCase() == "select"){
		obj.selectedIndex=_idx;
	}
};

Common.replaceStrAtArray = function(_collection,_key,_value){
	var _result = new Array(_collection.length);
	for(var i = 0, iMax = _collection.length, _msg; i < iMax; i++){
		_result[i] = _collection[i].replace(_key,_value);
	}
	return _result;
};

Common.setPosition = function(id, margin, arg)
{
	if(!id || !margin){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		switch(margin){
			case 'left':
				obj.style.left = arg;
				break;
			case 'right':
				obj.style.right = arg;
				break;
			case 'top':
				obj.style.top = arg;
				break;
			case 'bottom':
				obj.style.bottom = arg;
				break;
			case 'width':
				obj.style.width = arg;
				break;
			case 'height':
				obj.style.height = arg;
				break;
			default:
				break;
		}
	}
};

/**
 * 화면 Object의 enable, disable처리
 * @param id {string} : Object의 ID
 * @param enable {boolean} true:enable한다, false:disable한다.
 */
Common.setObjectEnable = function(id, enable){
	if(!id){
		return;
	}
	if(enable){
		WidgetLib.setWidgetStatus(id, {enable:true});
	}else{
		WidgetLib.setWidgetStatus(id, {enable:false});
	}
};


/**
 * 과금결제내용 표시를 위한 함수
 * @ param {string} docInfo : 가격결제를 위한 document정보
 */
 Common.calculateCharge = function(docInfo){
	glbDataSet.priceInfo = _calculateCharge(docInfo);
	glbDataSet.printSelectedCnt = docInfo.length;

	/**
	 * 과금금액 연산 (TraySelectionPopup에서도 사용해야하므로 이동 필요 )
	 */
	function _calculateCharge(docInfo){
		KISUtil.debug("_calculateCharge",JSON.stringify(docInfo));
		var priceInfo = {totalPrice:0};

		try{
			for (var i in docInfo){
				priceInfo.totalPrice = priceInfo.totalPrice + docInfo[i].price;
			}
			return priceInfo;
		}
		catch(ex){
			//console.log(ex);
			KISUtil.debug("_calculateCharge/exception",ex);
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_ENV};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
		}
		return null;
	}
};

function doBoxPrintJobStart(){
	KISUtil.debug("startBoxPrintJob","excute");
	var mailBox = new SSMILib.ExecuteJFS.MailBox();
	//boxID設定
	var jftMailbox = new JfsUtil.MailBox();
	var boxesInfo = new Array();
	jftMailbox.Identifier = glbJobLog.MailBoxJobInformation.Number;
	mailBox.MailBox = jftMailbox;
	//DocumentID設定
	var jftDocument = new JfsUtil.Document();
	jftDocument.Identifier = glbJobLog.MailBoxJobInformation.DocumentID;
	KISUtil.debug("docId", glbJobLog.MailBoxJobInformation.DocumentID);
	mailBox.Document = jftDocument;
	boxesInfo.push(mailBox);

	//Set Information of  JobTemplate
	var  jobTemplate = new JFLib.JobTemplate();

	//카테고리 설정
	jobTemplate.category = JFLib.JOBCATEGORY.COPY;
	//명칭
	jobTemplate.name = "Billing Copy";
	//지시서명
	jobTemplate.header.name = "Print to MailBox";

	jobTemplate.setInputProcess(createMailboxObj());
	jobTemplate.addOutputProcess(createPrintObj());

	var exeJfsObj = new SSMILib.ExecuteJFS(jobTemplate);
	exeJfsObj.boxesInfo = boxesInfo;

	glbJobLog.DeviceJobInformation.JobType = "";

	SSMILib.RemoteAccess.Interceptor = function (type, resp, arg){
		return arg;
	};

	SSMILib.ExecuteJFS.Send(exeJfsObj);
};

function createPrintObj(){
	KISUtil.debug("createPrintObj","excute");
	var printObj = new JFLib.Print();
	printObj.copies = parseInt(glbSetting.selectScanSettings.outputCopiese);
	printObj.outPlex = glbSetting.selectScanSettings.plexIndex;
	//printObj.colorMode = getDocColorMode(glbJobLog.ScanImageDetailInformation.ColorMode, "JFLib");
	printObj.colorMode = "";
	printObj.inputTray = traySelect();
	//printObj.inputTray = JFLib.INTRAY.TRAY2;		//TODO
	if(flg_Dummy_Beep){
		printObj.pageSet.enable = true;
		printObj.pageSet.shift = JFLib.NUPSHIFT;
		printObj.pageSet.nup = JFLib.NUPFACES.TWO;
	}
	printObj.outputMedium = glbSetting.selectScanSettings.outputMediumSize;

	return printObj;
};

function traySelect(){
	var result = JFLib.INTRAY.AUTO;
	if((glbJobLog.ScanImageDetailInformation.Size == glbSetting.selectScanSettings.outputMediumSize)&&(glbSetting.selectScanSettings.magIndexVal == MAG_OPTION.MAG100)){
		result = JFLib.INTRAY.AUTO;
	}else{
		for(var i = 0; glbInfo.trayInfo.length > i; i++){
			if(glbInfo.trayInfo[i].MediumSize == glbSetting.selectScanSettings.outputMediumSize){
				switch(glbInfo.trayInfo[i].Name){
					case "TRAY1":
						result = JFLib.INTRAY.TRAY1;
						return result;
					case "TRAY2":
						result = JFLib.INTRAY.TRAY2;
						return result;
					case "TRAY3":
						result = JFLib.INTRAY.TRAY3;
						return result;
					case "TRAY4":
						result = JFLib.INTRAY.TRAY4;
						return result;
					default:
				}
				
			}
		}
	}
	return result;
}

function createMailboxObj(){
	KISUtil.debug("createMailboxObj","excute");
	var mailboxObj = new JFLib.Mailbox();
	mailboxObj.targetOrigin.scan = true;
	mailboxObj.documentHandling.action = JFLib.DH.DELETE;

	return mailboxObj;
};

function isSytemAdmin(userInfo){
	if(userInfo&&userInfo.Roles&&userInfo.Roles.Role&&userInfo.Roles.Role=="SystemAdministrator"){
		return true;
	}
	else{
		return false;
	}
}

function doMediaStoredJobStart(){
	var mailBox = new SSMILib.ExecuteJFS.MailBox();
	//boxID設定
	var jftMailbox = new JfsUtil.MailBox();
	var boxesInfo = new Array();
	jftMailbox.Identifier = glbJobLog.MailBoxJobInformation.Number;
	mailBox.MailBox = jftMailbox;
	//DocumentID設定
	var jftDocument = new JfsUtil.Document();
	jftDocument.Identifier = glbJobLog.MailBoxJobInformation.DocumentID;
	KISUtil.debug("docId", glbJobLog.MailBoxJobInformation.DocumentID);
	mailBox.Document = jftDocument;
	boxesInfo.push(mailBox);

	//Set Information of  JobTemplate
	var  jobTemplate = new JFLib.JobTemplate();

	//카테고리 설정
	jobTemplate.category = JFLib.JOBCATEGORY.SCAN;
	//명칭
	jobTemplate.name = "Billing Scan";
	//지시서명
	jobTemplate.header.name = "USB to MailBox";

	jobTemplate.setInputProcess(createMailboxObj());
	if(glbScanType == "usb"){
		jobTemplate.addOutputProcess(createMediaObj());
	}else{
		var scanOptions = {};
		scanOptions.docName = glbScanDocName;
    	scanOptions.docFormat = JFLib.DOCFORMAT.PDF;
		jobTemplate.addOutputProcess(createPcObj(scanOptions));
	}

	var exeJfsObj = new SSMILib.ExecuteJFS(jobTemplate);
	exeJfsObj.boxesInfo = boxesInfo;

	glbJobLog.DeviceJobInformation.JobType = "";

	SSMILib.RemoteAccess.Interceptor = function (type, resp, arg){
		return arg;
	};

	SSMILib.ExecuteJFS.Send(exeJfsObj);
};

function createMediaObj(){
	KISUtil.debug("createPrintObj","excute");
	var mediaObj = new JFLib.MediaStore();
	mediaObj.repository = "/";
	mediaObj.docFormat = JFLib.DOCFORMAT.PDF;
	mediaObj.docName = glbScanDocName;
	return mediaObj;
};

function createPcObj(scanOptions){
	KISUtil.debug("createPrintObj","excute");
	var invokeObj = new JFLib.Invoke();
	invokeObj.profile = getInvokePcProfileObj();
	invokeObj.request = getInvokePcRequestObj(scanOptions);
	return invokeObj;
};

/************************************************************
 * Get the invoke profile object
 *************************************************************/
 function getInvokePcProfileObj(){
    // http://gwebfax.faxbiz.co.kr/cloudAction.do?process=cloudSendFax
	glbSelectPcIP = "192.168.0.61";
	var invokeProfile = new JFLib.Invoke.Profile();
	var target = "http://" + glbSelectPcIP + ":9090/bridgeapp/scan/scanjob";
	KISUtil.debug("target:",target);
	invokeProfile.target = target;
	return invokeProfile;
}

/************************************************************
 * Get the invoke request object
 *************************************************************/
 function getInvokePcRequestObj(scanOptions){
	var invokeRequest = new JFLib.Invoke.Request();
	invokeRequest.attach = getInvokePcAttach(scanOptions.docFormat);
	invokeRequest.messageBody = getPcMessageBody(scanOptions.docName);
	invokeRequest.timeOut = 300;
	return invokeRequest;
}

/************************************************************
 * Get the invoke attach object
 *************************************************************/
 function getInvokePcAttach(docFormat){
	var invokeAttach = new JFLib.Invoke.Attach();
	invokeAttach.docFormat = docFormat;
	invokeAttach.enable = true;
	return invokeAttach;
}

/************************************************************
 * Get the message body
 *************************************************************/
 function getPcMessageBody(docName){
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	var bridgeappNS = "http://fujixerox.com/bridgeapp/scanjob";
	xml.addNSPrefix(bridgeappNS, "bridgeapp");
	var _loginNode = body.appendChild(xml.createElementNSwithText(bridgeappNS, "title", docName));
	xml.addNSDeclaration(bridgeappNS, true);
	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
}

function setJobLogSave(_flag){
	var logRequest = {};

	// 공통항목
	var date = new Date();
	logRequest.deviceId = glbJobLogInfo.deviceId;
	logRequest.Date = date.format("yyyy-MM-dd");
	logRequest.Time = date.format("hh:mm:ss");
	logRequest.uuid = glbJobLogInfo.uuid;
	if(DATA.CHARGE_MODE.CHARGE_TYPE == "jetwork"){
		if(glbPriceRes.device){
			logRequest.cat = glbPriceRes.device.cat;
			logRequest.tid = glbPriceRes.device.tid;
		}else{
			logRequest.cat = "none";
			logRequest.tid = "none";
		}
		if(glbPriceRes.payment){
			logRequest.approval = glbPriceRes.payment.approval;
		}else{
			logRequest.approval = date.format("yyyyMMddHHhhmmss");
		}
	}else{
		logRequest.cat = "none";
		logRequest.tid = "none";
		logRequest.approval = date.format("yyyyMMddHHhhmmss");
	}
	logRequest.price = glbDataSet.priceInfo.totalPrice;
	if(_flag){
		logRequest.flag = "Y";
	}else{
		logRequest.flag = "N";
	}


	switch(jobSelecter){
		case JOB_TYPE.PRINT:
			logRequest.jobType = "Print";
			var _lst = FileListPage.docListManager.getCheckedItems();
			if(_flag){
				var _info = "건의 문서 출력";
			}else{
				var _info = "건의 문서 출력 실패";
			}
			var msg = _lst.length.toString() + _info;
			logRequest.description = msg;
			break;
		case JOB_TYPE.COPY:
			logRequest.jobType = "Copy";
			if(_flag){
				var msg = glbJobLog.ScanImageInformation.Impressions + " Page, " + glbSetting.selectScanSettings.copies + " 부 출력";
			}else{
				var msg = "복사 출력 실패";
			}
			logRequest.description = msg;
			break;
		case JOB_TYPE.SCAN:
			logRequest.jobType = "Scan";
			if(_flag){
				var msg = glbJobLog.ScanImageInformation.Impressions + " Page 스캔완료";
			}else{
				var msg = "스캔 실패";
			}
			logRequest.description = msg;
			break;
		case JOB_TYPE.FAX:
			logRequest.jobType = "Fax";
			break;
	}
	var data = {
		"logRequest": [
			{
			  "id": 0,
			  "flag": logRequest.flag,
			  "deviceId": logRequest.deviceId,
			  "Date":logRequest.Date,
			  "Time":logRequest.Time,
			  "jobType": logRequest.jobType,
			  "uuid": logRequest.uuid,
			  "terminalId": 0,
			  "price": logRequest.price,
			  "cat": logRequest.cat,
			  "tid": logRequest.tid,
			  "approval": logRequest.approval,
			  "description": logRequest.description
			}
		  ]
	}

	SSMILib.SetJobLog(data, 3000, DATA.SERVER_URL);
}

function chkDocPaperTraySize(_size, _color){
	
	var sizeResult = false;

	for(var i = 0; glbInfo.trayInfo.length > i; i++){
		if(glbInfo.trayInfo[i].MediumSize == _size){
			sizeResult = true;
		}
	}

	return result;

}

function chkDocPrintPossible(){
	var _lst = FileListPage.docListManager.getCheckedItems();
	var sizeResult = false;
	var colorResult = false;

	if(_lst.length == 0){
		Common.setText("txt_FL_SelectInfo1", " ");
		Common.setText("txt_FL_SelectInfo2", " ");
		WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});
		if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
			Common.setPosition("btn_FL_Print","left","713px");
		}
		return;
	}


	for(var l = 0; _lst.length > l; l++){
		// 출력불가 용지사이즈 Job 확인
		var sizeCheck = false;
		for(var i = 0; glbInfo.trayInfo.length > i; i++){
			if(glbInfo.trayInfo[i].MediumSize.indexOf(_lst[l].paperSize) != -1){
				sizeCheck = true;
			}
		}
		if(!sizeCheck){
			sizeResult = true;
		}
		// 출력불가 
		if(glbDeviceInfo.colorMode == "color"){
			colorResult = false;
		}else{
			if(_lst[l].colorIdx == 1){
				colorResult = true;
			}
		}
	}


	if(sizeResult && colorResult){
		Common.setText("txt_FL_SelectInfo1", Msg.FILELIST.SELECT_INFO_0);
		Common.setText("txt_FL_SelectInfo2", Msg.FILELIST.SELECT_INFO_3);
		WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});
	}else{
		if(sizeResult){
			Common.setText("txt_FL_SelectInfo1", Msg.FILELIST.SELECT_INFO_0);
			Common.setText("txt_FL_SelectInfo2", Msg.FILELIST.SELECT_INFO_2);
			WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});
		}
		if(colorResult){
			Common.setText("txt_FL_SelectInfo1", Msg.FILELIST.SELECT_INFO_0);
			Common.setText("txt_FL_SelectInfo2", Msg.FILELIST.SELECT_INFO_1);
			WidgetLib.setWidgetStatus("btn_FL_Print",{enable:false});
		}
		if(!sizeResult && !colorResult){
			Common.setText("txt_FL_SelectInfo1", " ");
			Common.setText("txt_FL_SelectInfo2", " ");
			WidgetLib.setWidgetStatus("btn_FL_Print",{enable:true});
		}
	}
	if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("btn_FL_Print","left","713px");
	}
}
function loadScript(loc){
	var tag = document.createElement("script");
	tag.setAttribute("type", "text/javascript");
	tag.setAttribute("src", loc);
	tag.setAttribute("charset", "UTF-8");
	document.getElementsByTagName("head")[0].appendChild(tag);
}

function testScanJobStart(){
	/*
	var jobTemplate 				= new JFLib.JobTemplate();
	jobTemplate.category 			= "Scan Jobtemplate Test";
	jobTemplate.name 				= "Scan Jobtemplate Test";
	jobTemplate.header.name 		= "Scan Jobtemplate";
	jobTemplate.header.description 	= "Scan to BridgeApp";
	jobTemplate.header.identifier 	= "1";
	jobTemplate.process 			= JFLib.PROCESS.SCAN;
	var scanObj 					= new JFLib.Scan();
	scanObj.outputMedium.size 		= JFLib.MS.A4LEF;
	jobTemplate.setInputProcess(scanObj);
	glbFileTran 			= new JFLib.FileTransfer();
	glbFileTran.url 		= "ftp://10.97.4.42/";
	glbFileTran.loginName 	= "cst";
	glbFileTran.password 	= "fujixerox1!";
	glbFileTran.docName 	= "testScanJobStart";
	glbFileTran.docFormat 	= JFLib.DOCFORMAT.PDF;
	glbFileTran.folderName 	= "Spool";
	jobTemplate.addOutputProcess(glbFileTran);
	var exeJfsObj 			= new SSMILib.ExecuteJFS(jobTemplate);
	SSMILib.ExecuteJFS.Send(exeJfsObj);
	*/

	CopyJobMonitor.init(300);
				CopyJobMonitor.startMonitor(
					{
						successCallback:function(){
							setJobLogSave(true);
							KISUtil.debug("successCallback", "");
							if(flg_Dummy_Beep) {
								PageManager.changePage(MenuPage, PageManager.type.NORMAL);
								currentPage = PageManager.getCurrentPage();
							}else{
								BrowserExt.Beep(0);
								BrowserExt.SetScreenChange("allservice");
							}
						},
						errorCallback:function(){
							setJobLogSave(false);
							KISUtil.debug("errorCallback", "");
						},
						cancelCallback:function(){
							setJobLogSave(false);
							KISUtil.debug("cancelCallback", "");
						},
						jobcount: 1
					},
					100);
}
