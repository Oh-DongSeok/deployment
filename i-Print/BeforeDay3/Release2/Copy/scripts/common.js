/**
 * @fileoverview CS기본동작과 공통기능을 정의하는 파일
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var Common = {};
/**
 * Contents기동시의 초기설정을 실행한다.
 */
Common.onLoadBody = function()
{
	ContentsLib.init();
	ContentsLib.contentsIcon = "./info/smallicon.png";
	ContentsLib.setListener(Common.onLoadEvent);
	JFLib.setEventListener(Common.onLoadEvent);

	LogLib.setLogLevel(LogLib.LEVEL.INF);

	//SystemEventLib.AddNotify("AuthEvent", this.onLoadEvent);

	BrowserExt.EnablePrivilege();	//타서버에의 접근 권한 부여

	KISUtil.initDebug("body");

	//Msg = extendDeep(Msg_default, {});
	//var arrLang = lang.split(",");
	//var _lang = arrLang[0]||"en";
	if(flg_Dummy_Beep){//Chrome Dummy용
		glbInfo.lang = "ko";
	}else{
		var p_glbConfig = window.parent["glbConfig"];
		glbInfo.lang = p_glbConfig.language[p_glbConfig.langCount];
	}
	switch(glbInfo.lang){
		case "ko":
		case "en":
		case "ja":
		case "ch":
			Msg = extendDeep(Msg_lang[glbInfo.lang],extendDeep(Msg_default, {}));
			break;
		default:
			Msg = extendDeep(Msg_lang["en"],extendDeep(Msg_default, {}));
			break;
	}

	//조절가능값 설정
	//initConfig();
	initModel();

	ContentsLib.contentsName = Msg_lang[glbInfo.lang].CommonLbl.title;

	BrowserExt.SetScreenChange("popup:faultAll"); //2016.05.17 Chone 디바이스 에러 화면을 표시함

	quoteParentModule();
	LogLib.write("IPrint Copy --- PRINTER_IP : " + glbConfig.PRINTER_IP, LogLib.LEVEL.INF);

	//메뉴CS에서 호출되지 않은경우 재기동
	if(!flg_Dummy_Beep&&!SecureManager){//TODO revive debug
		BrowserExt.SetScreenChange("");
		return;
	}

	//초기화
	PageManager.init("pageWrapper");

	//잡 모니터 초기화
	JobMonitor.init(glbConfig.GetJob.term);

	//대기 페이지로 전환
	PageManager.changePage(WaitingPage, PageManager.type.NORMAL);

	//슬라이드 메시지 초기화
	MessageManager.init();

	//CS타이틀 영역 표시
	Common.displayTitleArea();

	//정보취득
	SSMILib.GetCustomizeDeviceInfo();
	//SSMILib.GetProductInformation();
	//SSMILib.GetScannerCapability();
	//SSMILib.GetPrinterCapability();
	SSMILib.GetTrayInfo();
	//SSMILib.GetProductInformation();			//시리얼넘버 취득 요청

	/**
	 * 메뉴CS에 정의된 모듈 및 데이터를 인용
	 */
	function quoteParentModule(){
		SecureManager = (!flg_Dummy_Beep)?window.parent["SecureManager"]:"";
		var p_glbInfo = (!flg_Dummy_Beep)?window.parent["glbInfo"]:"";
		var p_glbConfig = window.parent["glbConfig"];
		var p_glbDevInfo = window.parent["glbDevInfo"];
		glbInfo.userId = (!flg_Dummy_Beep)?p_glbInfo.userId:'12345';
		glbInfo.userPw = (!flg_Dummy_Beep)?p_glbInfo.userPw:'12345';
		glbInfo.displayName = (!flg_Dummy_Beep)?p_glbInfo.displayName:'';
		glbInfo.productCode = (!flg_Dummy_Beep)?p_glbInfo.productCode:'TC101049';
		glbInfo.serialNumber = (!flg_Dummy_Beep)?p_glbInfo.serialNumber:'478009';
		glbInfo.authMode = (!flg_Dummy_Beep)?p_glbDevInfo.authMode:true;
		//glbInfo.serialNumber = '000013';
		glbConfig.PRINTER_IP = (!flg_Dummy_Beep)?p_glbConfig.PRINTER_IP:'192.168.200.200';
		glbConfig.FileServer = p_glbConfig.SERVER_IP;
		glbConfig.FileServerPort = p_glbConfig.SERVER_PORT;
		glbConfig.FileServerSSL = p_glbConfig.SERVER_SSL;
		glbFileTran.url = "ftp://" + p_glbConfig.SERVER_IP + ":11199";
		//glbFileTran.url = "ftp://" + p_glbConfig.SERVER_IP;
	}
};

/**
 * 공통 이벤트 처리 메소드
 * 이곳에 정의 되지 않은 경우 각 페이지에서 이벤트가 처리됨
 * @param {event} event
 * @param {string} id
 */
Common.onLoadEvent = function(event, id)
{
	KISUtil.debug("Common.onLoadEvent","event:"+event+"/id:"+id);
	switch(event){
		case "GetCustomizeDeviceInfo":
			//console.log(arguments);
			if(arguments[1]==true){
				var obj = arguments[2];
				if(obj.productInformation){
					glbDevInfo.serialNo = obj.productInformation.serialNumber;
					glbDevInfo.productCode = obj.productInformation.productCode;
				}
				if(obj.scannerCapability){
					/*
					 더미데이터 {ColorMode: "color",
					 Duplex: "true",
					 FileFormat: "TIFF V6/TTN2; JFIF 1.02; XDW V4; PDF V1.3; XPS V0.95",
					 Resolution: "600 DPI"}
					 */
					//원고크기 정보는 어디에??
					//glbDevInfo.scanColorMode = obj.scannerCapability.ColorMode
					//glbDevInfo.scanColorMode = obj.scannerCapability.Duplex
					//glbDevInfo.scanColorMode = obj.scannerCapability.FileFormat//변조할까??
					//glbDevInfo.scanColorMode = obj.scannerCapability.Resolution
					glbDevInfo.scanInfo = obj.scannerCapability;
				}
				if(obj.printerCapability){
					glbDevInfo.printInfo = obj.printerCapability;
					//glbDevInfo.isMono = true//TODO Dummy
					glbDevInfo.isMono = arguments[2].printerCapability.ColorMode=="monochrome"; //[isMono] default:false
				}
			}
			else{
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};		//TODO 카피서비스 기동중 정보 취득 실패
				var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}

			//PageManager.changePage(MainPage, PageManager.type.NORMAL);
			break;
		case "GetDateTime":
			if (arguments[1] == true) {
				var dateTime = arguments[2];
				setDateTime(dateTime.DateTime);
				PageManager.changePage(ResultPopup,PageManager.type.NORMAL);
			} else {
				KISUtil.debug("GetDateTime Fail", "");
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};		//TODO DateTime 취득 실패
				var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "GetTrayInfo":
			if (arguments[1] == true) {
				for(var i=0,iMax=arguments[2].length;i<iMax;i++){
					arguments[2][i].MediumSize = Common.paperSizeNameReplace(arguments[2][i].MediumSize,"JIS_",""); //JIS_B4,JIS_B5 -> B4,B5
					arguments[2][i].MediumSize = Common.paperSizeNameReplace(arguments[2][i].MediumSize,"LETTER","8.5x11"); //LETTER -> 8.5x11
					arguments[2][i].MediumSize = Common.paperSizeNameReplace(arguments[2][i].MediumSize,"FOLIO","8.5x13"); //FOLIO -> 8.5x13
					arguments[2][i].MediumSize = Common.paperSizeNameReplace(arguments[2][i].MediumSize,"LEGAL","8.5x14"); //LEGAL -> 8.5x14
					arguments[2][i].MediumSize = Common.paperSizeNameReplace(arguments[2][i].MediumSize,"LEDGER","11x17"); //LEDGER -> 11x17
				}

				Common.setTrayInfo(arguments[2]);

				var currentPage = PageManager.getCurrentPage();
				if(currentPage)
				{
					currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
					//currentPage.EventHandler.apply(this,arguments);
				}
			}else{
				KISUtil.debug("GetTrayInfo Fail", "");
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};		//TODO 트레이정보 취득 실패
				var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		/*case "GetProductInformation":
			if(arguments[1] == true){
				var productInfo = arguments[2];
				glbInfo.serialNo = productInfo.serialNumber;
				Common.sendRequestCardLogIn(Common.getCardLogIn);
			}else{
				KISUtil.debug("GetProductInformation Error/cnt",glbInfo.tcpipFailCnt);
				WarnPopup._errCode = "NF-00";
				WarnPopup._param = Msg.ERROR_MSG["NF-00"];
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "GetScannerCapability" :
			if(arguments[1]==true){
				glbScannerInfo = arguments[2];
				KISUtil.debug("MaxPaperSize", glbScannerInfo.MaxPaperSize);
				//glbScannerInfo.MaxPaperSize ="A4";								//A4전용기 테스트용 코드
				if(glbScannerInfo.MaxPaperSize == "A4"){
					glbConfig.enableInputMediumSizes = ["A4", "B5"];
				}
			}
			break;
		case "GetPrinterCapability" :
			if(arguments[1]==true){
				glbDevInfo = arguments[2];
			}
			break;*/
		//case "GetJob": //waiting //현재 진행 혹은 오류 상태로 남은 Job 체크
		case "ScanJobFound":
			if(arguments[1] === true){
				var _page = PageManager.getCurrentPage();
				if(_page.ID != SizeInfoPopup.ID){
					PageManager.changePage(SizeInfoPopup,PageManager.type.NORMAL);
				}
				break;
			}else{
				//TODO error log
			}
			break;
		case "ScanJobComplete":
			JobMonitor.stopMonitor({uuid : glbInfo.scanJobID});
			if(arguments[1] === true){
				//문서정보 취득 call
				//getStoredDocument();
				//Common.doChargePrice();
				
				// JobInfo 추가
				SSMILib.GetChildJobInfo(glbInfo.authMode, glbInfo.scanJobID, "ScanImageDetailInformation");
				break;
			}else{
				//TODO error log
			}
			break;
		case "ScanJobCancel":
			JobMonitor.stopMonitor({uuid : glbInfo.scanJobID});
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.INTERUPTED_SCAN_JOB};
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "ScanJobError":
			JobMonitor.stopMonitor({uuid : glbInfo.scanJobID});
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_SCAN_JOB};
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "ScanJobTimeout":
			// ScanJobTimeout인 경우 사용자 Check를 한번 추가한다.
			var arg=arguments[2];
			JobMonitor.stopMonitor(arg);
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_TIMEOUT};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "GetChildJobInfo":
			if(arguments[1] == true){
				var jobInfo = arguments[2];
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
						Common.doChargePrice();
					}
				}
			}
			break;
		/*case "GetStoredDocument":
			alert("GetStoredDocument");
			if(arguments[1] === true){
				var docInfoObj = arguments[2], tmp;
				for(var i in docInfoObj){
					tmp =docInfoObj[i];
					//console.log(tmp.Name);
					if(tmp.Name == glbBox.docName){
						//glbInfo.docId = tmp.Identifier;
						glbInfo.docInfo = {
							docId : tmp.Identifier,
							inputMediumSize : tmp.MediumSize,
							pages : parseInt(tmp.NumberOfPages),
							outputMediumSize : null
						};
						//SizeInfoPopup._dataSet.inputMediumSize = tmp.MediumSize;
						//SizeInfoPopup._dataSet.pages = tmp.NumberOfPages;
						//SizeInfoPopup._dataSet.outputMediumSize = tmp.MediumSize;
						//this.setMailboxDocSize(tmp.MediumSize);
						//진행여부 판단필요시점
						checkPreceedToCharge(glbInfo.docInfo);*/
						/**
						 * unknown이면 트레이 지정팝업으로
						 * 비정형이면 정형으로 변환
						 * 정형이면 그대로 계승
						 * 과금이 잔고를 초과시
						 * 		에러팝업으로
						 * 과금 만족시
						 * 		과금 팝업으로
						 */
						/*function checkPreceedToCharge(docInfo){
							KISUtil.debug("checkPreceedToCharge/docInfo",docInfo);
							glbDataSet.pages = docInfo.pages;
							switch(docInfo.inputMediumSize){
								case"A3":
								//case"B4":
								case"A4":
								//case"B5":
									glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = docInfo.inputMediumSize;
									break;
								case "unknown":
								//	PageManager.changePage(TraySelectionPopup , PageManager.type.NORMAL);
								//	return;
								//others랑 unknown을 같이 처리할까 고민중
								default:	//others
									//PageManager.changePage(TraySelectionPopup , PageManager.type.NORMAL);
									PageManager.changePage(TraySelectionPopup , PageManager.type.MODAL);
									return;
									//glbDataSet.outputMediumSize = "A4";
									//break;
							}
							Common.calculateCharge(docInfo);
							if(glbDataSet.priceInfo.totalPrice <= window.parent.glbInfo.userBalance){
								PageManager.changePage( ChargeInfoPopup , PageManager.type.NORMAL);
							}
							else{
								var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.NOT_ENOUGH_BALANCE};
								var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
								WarnPopup._param = param;
								PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
							}
						}
						return;
					}
				}
				KISUtil.debug("GetStoredDocument","notfound");
			}else{
				KISUtil.debug("getStoreDocument", "error");
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};
				var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;*/
		case "WDlistMailbox":
			if(arguments[1] == true){
				var _folderList = arguments[2];
				if(_folderList && _folderList.length > 0){
					var index = 0;
					for(var i=0; i<glbConfig.folders.length; i++){
						for(var j=0; j<_folderList.length; j++){
							var pathArray = _folderList[j].prop.path.split("/");
							var length = pathArray.length;
							var boxId = pathArray[length-2];
							if(boxId == glbConfig.folders[i].DEVICEBOXID){
								glbInfo.folderList[index] = _folderList[j];
								glbInfo.folderList[index].boxId = glbConfig.folders[i].BOXID;

								if(glbConfig.folders[i].DISPLAYNAME){
									//文書一覧画面のフォルダ名（フォルダ選択ボタンのフォルダ名の1行と2行の文字列が文書一覧画面には1行で表示される）
									glbInfo.folderList[index].displayName = glbConfig.folders[i].DISPLAYNAME;
									//フォルダ一覧画面のフォルダ選択ボタンのフォルダ名（1行、2行）
									glbInfo.folderList[index].displayName1 = glbConfig.folders[i].DISPLAYNAME1;
									glbInfo.folderList[index].displayName2 = glbConfig.folders[i].DISPLAYNAME2;
								}else{
									glbInfo.folderList[index].displayName = _folderList[j].prop.displayname;
									if(_folderList[j].prop.displayname){
										if(Common.getStringSize(_folderList[j].prop.displayname) > 26){
											var displayNameArray = omitString(_folderList[j].prop.displayname, 26);
											glbInfo.folderList[index].displayName1 = displayNameArray[0];
											glbInfo.folderList[index].displayName2 = displayNameArray[1];
										}else{
											glbInfo.folderList[index].displayName1 = _folderList[j].prop.displayname;
											glbInfo.folderList[index].displayName2 = "";
										}
									}else{
										glbInfo.folderList[index].displayName1 = "";
										glbInfo.folderList[index].displayName2 = "";
									}
								}

								glbInfo.folderList[index].deviceBoxId = glbConfig.folders[i].DEVICEBOXID;
								glbInfo.folderList[index].deviceBoxNumber = glbConfig.folders[i].DEVICEBOX_NUMBER;
								glbInfo.folderList[index].isDefault = glbConfig.folders[i].IS_DEFAULT;
								//AR137971 Handling
								glbInfo.folderList[index].permission = true;
								index++;
							}
						}
					}

					if(glbInfo.folderList.length == 0){
						//フォルダーはありません画面: 調整可能項目で指定される表示対象親展ボックスで、コンテンツがアクセス可能な親展ボックスが複合機上に存在しない
						//"No folder" display page : On MFD, There isn't any accessible mailbox from contets which is specified in Configurable Settings.
						//changePageView("folder_page", onFolderPageEvent);
						//displayFolderNotExistPage();
					}else{
						//ログインしたユーザが親展ボックスに権限があるのかチェックする。
						var j=0;
						if(glbInfo.authenticationMode == "Off") {
							SSMILib.GetMailbox(null, 1, glbInfo.folderList[j].deviceBoxNumber, null, null);
						}else{
							SSMILib.GetMailbox(glbInfo.authenticationMode, 1, glbInfo.folderList[j].deviceBoxNumber, null, null);
						}
						/*
						for(var j=0; j<glbInfo.folderList.length; j++){
							if(glbInfo.authenticationMode == "Off") {
								//SSMILib.GetMailbox(null, 1, glbInfo.folderList[j].deviceBoxNumber, null, null);
							}else{
								//SSMILib.GetMailbox(glbInfo.authenticationMode, 1, glbInfo.folderList[j].deviceBoxNumber, null, null);
							}
							KISUtil.debug("GetMailbox", glbInfo.folderList[j].deviceBoxId);
						}*/
					}
				}else{
					//フォルダ一覧表示エラーポップアップ : 親展ボックス一覧が取得できない
					//Folder List display pop-up error: can not get a list of Mailbox
					//changePageView("yellow_popup", onPopupPageEvent);
					//openAlertPopup(POPUP_TYPE.ALERT, POPUP_LIST.FOLDER_ERROR , ERROR_TYPE.GET_ERROR);
					return;
				}
			}else{
				//フォルダ一覧表示エラーポップアップ : その他
				//Folder list display error popup: Other
				//changePageView("red_popup", onPopupPageEvent);
				//openCriticalErrorPopup(POPUP_TYPE.ERROR, POPUP_LIST.FOLDER_ERROR , ERROR_TYPE.OTHER_ERRORS);
				return;
			}
			break;
		case "GetMailbox":
			if(arguments[1] == true){
				var _mboxList = arguments[2];
				if(_mboxList){
					var boxIdentifier = _mboxList[0].Identifier;
					KISUtil.debug("boxIdentifier", boxIdentifier);
					var j=0;
					var targetFolder = glbInfo.folderList[j];
					//console.log(targetFolder);
					//targetFolder.listDocs(CONFIG.ENV.MAIL_BOX.ID, CONFIG.ENV.MAIL_BOX.PASSWORD);
					//targetFolder.listDocs(glbConfig.mailboxId, glbConfig.mailboxPassword);
					targetFolder.listDocs();
					/*
					for(var i=0; i<glbInfo.folderList.length; i++){
						if(boxIdentifier == glbInfo.folderList[i].deviceBoxNumber){
							if(_mboxList[0].Permissions){
								var permission = eval(_mboxList[0].Permissions.Read);
								KISUtil.debug("permission", permission);
								glbInfo.folderList[i].permission = permission;
								glbFolderListCount++;
								break;
							}else{
								KISUtil.debug("permission", "false");
								glbInfo.folderList[i].permission = false;
								glbFolderListCount++;
								break;
							}
						}
					}*/
				}else{
					glbFolderListCount++;
				}

				if(glbFolderListCount == glbInfo.folderList.length){
					KISUtil.debug("permission setting", "complete");
					//resetFolderListArray();
				}
			}else{
				KISUtil.debug("GetMailbox", "GetMailbox Error");
				//changePageView("red_popup", onPopupPageEvent);
				//openCriticalErrorPopup(POPUP_TYPE.ERROR, POPUP_LIST.SSMI_ERROR, ERROR_TYPE.OTHER_ERRORS);
				return;
			}
			break;

		case "WDlistDocs":
			if(arguments[1] == true){
				var _doc = null, _tmp, _docList = arguments[2];
				if(_docList){
					if(_docList.length == 0){
						//文書はありません画面 : 該親展ボックス内にコンテンツがアクセス可能な文書が存在しない
						//"No files in Folder" display screen: there are no documents in the box which the content is accessible.
						//changePageView("file_page", onFilePageEvent);
						//initFileListPage();
						//displayFileNotExistPage();
						//TODO:retry
						return;
					}
					//setDeviceBoxFileList(_docList);
					KISUtil.debug(id,JSON.stringify(_docList));
					for(var i=0,iMax=_docList.length;i<iMax;i++){
						_tmp=_docList[i];
						if(_tmp.prop.displayname == glbBox.docName){
							_doc=_tmp;
							KISUtil.debug(id+"/matched",_tmp);
							break;
						}
					}
					if(_doc!=null){
						//glbInfo.docId = _doc.prop.identifier;
						glbInfo.docInfo = {};
						glbInfo.docInfo.docId = _doc.prop.identifier;
						//glbInfo.docInfo.Origin = _doc.prop.Origin;
						//glbInfo.docInfo.displayname = _doc.prop.displayname;
						//glbInfo.docInfo.path = _doc.prop.path;
						_doc.getProperties();
					}
					else{
						//retry 5times
						glbInfo.retryCount++;
						KISUtil.debug(id+"/retry",glbInfo.retryCount+"/"+glbConfig.sizeInfoRetryCount);
						if(glbInfo.retryCount<glbConfig.sizeInfoRetryCount){
							setTimeout("getStoredDocument();",glbConfig.sizeInfoRetryTerm);
						}
						else{
							glbInfo.retryCount=0;
							//TODO:error popup
						}
					}
				}else{
					//文書一覧表示エラーポップアップ : 上記以外
					//Documents list display error popup: Other
					//changePageView("red_popup", onPopupPageEvent);
					//openCriticalErrorPopup(POPUP_TYPE.ERROR, POPUP_LIST.FILE_LIST_ERROR , ERROR_TYPE.OTHER_ERRORS);
				}
			}else{
				var _status = arguments[2];
				if(_status && _status == 401){
					//文書一覧表示エラーポップアップ : アクセス権限がないため親展ボックスにアクセスできない
					//Documents list display error popup: The content couldn't access Mailbox because it doesn't have enough right to access.
					//changePageView("yellow_popup", onPopupPageEvent);
					//openAlertPopup(POPUP_TYPE.ALERT, POPUP_LIST.FILE_LIST_ERROR, ERROR_TYPE.ACCESS_ERROR);
				}else if(_status && _status == 404){
					//文書一覧表示エラーポップアップ : 該親展ボックスが削除されるなどして存在しないため親展ボックス内文書一覧が取得できない
					//Documents list display error popup: No documents exist because the Mailbox of the MFD doesn't have one. (i.e. when the Mailbox is deleted from MFD)
					//changePageView("yellow_popup", onPopupPageEvent);
					//openAlertPopup(POPUP_TYPE.ERROR, POPUP_LIST.FILE_LIST_ERROR, ERROR_TYPE.GET_ERROR);
				}else{
					//文書一覧表示エラーポップアップ : 上記以外
					//Documents list display error popup : Other
					//changePageView("red_popup", onPopupPageEvent);
					//openCriticalErrorPopup(POPUP_TYPE.ERROR, POPUP_LIST.FILE_LIST_ERROR , ERROR_TYPE.OTHER_ERRORS);
				}
				return;
			}
			break;
		case"WDgetProperties":
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};
			if(arguments[1] == true){
				var prop = arguments[2];
				if(prop){
					KISUtil.debug(id,JSON.stringify(prop));
					glbDataSet.inputMediumSize = prop.OutputMediumSize;
					glbDataSet.pages = prop.Pages;
					glbDataSet.PixelSize = prop.PixelSize;
					//"{"creationdate":"2014-11-11T21:24:55+09:00",
					//"displayname":"20141111_21091912541S_AUTO_C_1"
					//"getcontenttype":"image/tiff",
					//"getetag":"fb5462001705",
					//"getlastmodified":"Tue, 11 Nov 2014 12:24:55 GMT",
					//"resourcetype":"",
					//"ColorDepth":"8",
					//"ColorMode":"Color",
					//"ColorSpace":"YCbCr",
					//"Compression":"JPEG",
					//"CSOrg":"IEC",
					//"DocStatusCode":"",
					//"Origin":"Scanner",
					//"OutputMediumSize":"ISO-A4LEF",
					//"Pages":"1",
					//"PixelSize":"3510x2482",
					//"Resolution":"300x300/dpi"}"

					var sizeInfo = _getSizeInfo(prop.OutputMediumSize);
					glbInfo.docInfo.inputMediumSize = sizeInfo.size;
					glbInfo.docInfo.direction = sizeInfo.direction;
					glbInfo.docInfo.pages = parseInt(prop.Pages);
					glbInfo.docInfo.outputMediumSize = null;
					tmp = prop.PixelSize.split("x");
					glbInfo.docInfo.PixelSize = [parseInt(tmp[0]),parseInt(tmp[1])] ;
					glbInfo.docInfo.DPI = prop.Resolution;
					//SEF기준으로 맞추기
					if(glbInfo.docInfo.PixelSize && (glbInfo.docInfo.direction=="LEF" || glbInfo.docInfo.PixelSize[0]>glbInfo.docInfo.PixelSize[1])) glbInfo.docInfo.PixelSize.reverse();
					//진행여부 판단필요시점
					var chkResult = checkPreceedToCharge(glbInfo.docInfo);
					if(chkResult){
						Common.doChargePrice(); //카피할 설정내용을 서버에 전송(Request)후, 가격정보를 받는 처리가 필요.
						return;
					}
					else{
						PageManager.changePage(TraySelectionPopup , PageManager.type.MODAL);
						return;
					}

					/**
					 * 전달받은 용지크기 정보를 사이즈와 방향으로 변환하는 메소드
					 * @param {string} ms 용지크기 정보 ex.ISO-A4LEF
					 * @return {object} 원고사이즈, 원고방향을 포함한 정보
					 */
					function _getSizeInfo(ms){
						sizeMap = {
							"Auto" : { size:"AUTO", direction:"-"},
							"NotSpecified" : { size:"NOTSPEC", direction:"-"},
							"Other" : { size:"NONSTANDARD", direction:"-"},
							"ISO-A3SEF" : { size:"A3", direction:"SEF"},
							"ISO-A4SEF" : { size:"A4", direction:"SEF"},
							"ISO-A4LEF" : { size:"A4", direction:"LEF"},
							"ISO-A5SEF" : { size:"A5", direction:"SEF"},
							"ISO-A5LEF" : { size:"A5", direction:"LEF"},
							"ISO-A6SEF" : { size:"A6", direction:"SEF"},
							"ISO-A6LEF" : { size:"A6", direction:"LEF"},
							"JIS-B4SEF" : { size:"B4", direction:"SEF"},
							"JIS-B5SEF" : { size:"B5", direction:"SEF"},
							"JIS-B5LEF" : { size:"B5", direction:"LEF"},
							"JIS-B6SEF" : { size:"B6", direction:"SEF"},
							"JIS-B6LEF" : { size:"B6", direction:"LEF"},
							"NA-8.5x11LEF" : { size:"LETTER", direction:"LEF"},
							"NA-8.5x11SEF" : { size:"LETTER", direction:"SEF"},
							"NA-8.5x14SEF" : { size:"LEGAL", direction:"SEF"},
							"NA-11x17SEF" : { size:"LEDGER", direction:"SEF"},
							"Mixed" : { size:"MIXED", direction:"-"}
						};
						var size=sizeMap[ms];
						if(!size){
							size={size:"unknown",direction:"-"};
						}
						return size;
					}
					/**
					 * 과금으로 진행가능여부를 판단하는 로직
					 * 만일 출력용지의 크기를 특정하지 못할경우
					 * 용지선택팝업으로 천이하여 유저의 입력을 기다리도록 함
					 * @param {object} docInfo 문서의 정보가 담긴 객체
					 * @return
					 */
					function checkPreceedToCharge(docInfo){
						KISUtil.debug("checkPreceedToCharge",JSON.stringify(docInfo));
						//unknown이면 트레이 지정팝업으로
						//비정형이면 정형으로 변환
						//정형이면 그대로 계승
						//과금이 잔고를 초과시
						//	에러팝업으로
						//과금 만족시
						//	과금 팝업으로
						var result = false;
						glbDataSet.pages = docInfo.pages;
						switch(docInfo.inputMediumSize){
							case"A3":
							case"B4":
								if(isA3Available()){
									glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "A3";
								}
								else{
									//2016.08.16 KIS Chone B4 사이즈 대응(트레이에서 B4 용지 선택했을 때 결제정보화면(ChargeInfoPopup)에서 문자열 에러 대응)
									//docInfo.inputMediumSize이 A3 또는 B4인데 트레이에 A4나 B4 용지가 없을 때는 A4로 강제 설정
									if(isB4Available()){
										glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "B4";
									}else{
										glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "A4";
									}
								}
								function isA3Available(){
									var i,len, tmp, result=false;
									for(var i = 0,len=glbInfo.tray.length; i<len; i++){
										tmp = glbInfo.tray[i];
										if(isSupportPaperSize(tmp.MediumSize) && tmp.MediumSize=="A3"){
											result=true;
											break;
										}
									}
									function isSupportPaperSize(size){
										//console.log(size);
										return (SUPPORT_PAPER_SIZE.indexOf(size)!=-1);
									}
									return result;
								}

								//2016.08.16 KIS Chone B4 사이즈 대응
								function isB4Available(){
									var i,len, tmp, result=false;
									for(var i = 0,len=glbInfo.tray.length; i<len; i++){
										tmp = glbInfo.tray[i];
										if(isSupportPaperSize(tmp.MediumSize) && tmp.MediumSize=="B4"){
											result=true;
											break;
										}
									}
									function isSupportPaperSize(size){
										return (SUPPORT_PAPER_SIZE.indexOf(size)!=-1);
									}
									return result;
								}
								result = true;
								break;
							case"A4":
							case"B5":
								glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "A4";
								result = true;
								break;
							//others랑 unknown을 같이 처리할까 고민중
							case "unknown":
							default:	//others
								//간주처리
								//console.log("docInfo:"+JSON.stringify(docInfo));
								var _size = getSize(docInfo.PixelSize,docInfo.DPI);
								//console.log("_size:"+_size);
								if(_size){
									glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = _size;
									result = true;
								}
						}
						return result;
					}
					/**
					 * 저장파일의 크기를 받아 출력가능한 용지크기를 찾아주는 메소드
					 * @param {array} _pixels 첫번째가 단변 두번째가 장변, 단위는 pixel
					 * @param {string} _dpi
					 * @return {string} 용지크기명 ex.A4
					 */
					function getSize(_pixels,_dpi){
						var result = null, tmp;
						//var arrWH = [ [29700,42000],[25700,36400],[21000,29700], [18200,25700]];
						//var arrName = [ "A3", "B4","A4", "B5"];
						var arrWH = [[827, 1170], [1014, 1433], [1170, 1655]]; //2016.08.16 KIS Chone B4 사이즈 대응 //mm to inches //2016.09.29 B4 사이즈 수정
						var arrName = [ "A4", "B4", "A3"];
						var res = -1;
						switch(_dpi){
							case JFLib.RES.R200:
								res = 2;
								break;
							case JFLib.RES.R300:
								res = 3;
								break;
							case JFLib.RES.R400:
								res = 4;
								break;
							case JFLib.RES.R600:
								res = 6;
								break;
							default:
								//사이즈 검출 불가
								KISUtil.debug("getSize/getSize",_dpi+"/_pixels:"+JSON.stringify(pixels));
						}
						if(res!= -1){
							var unitSize = [];
							unitSize[0] = Math.round(_pixels[0]/res);
							unitSize[1] = Math.round(_pixels[1]/res);

							for(var i=0,len=arrWH.length;i<len;i++){
								tmp = arrWH[i];
								if(tmp[0]>=unitSize[0]&&tmp[1]>=unitSize[1]){
									result = arrName[i];
									break;
								}
							}
						}
						return result;
					}
				}
				else{
					msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};
				}
			}
			else{
				msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_COMM};
			}
			var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "ExecuteJFS":
			if(arguments[1] === true){
				var jobID = arguments[2];
				if(jobID){
					//if(obj.JobID){
					glbInfo.printJobID = jobID;
					JobMonitor.startMonitor({uuid : glbInfo.printJobID, type:"print", successCallback:function(){
						KISUtil.debug("successCallback",jobID);
						SSMILib.onEvent("PrintJobComplete", true, {uuid:jobID, type:"print"});
					}, errorCallback:function(){
						KISUtil.debug("errorCallback",jobID);
						SSMILib.onEvent("PrintJobError", 	true, {uuid:jobID, type:"print"});
					}, timeoutCallback:function(){
						KISUtil.debug("timeoutCallback",jobID);
						SSMILib.onEvent("PrintJobTimeout", 	true, {uuid:jobID, type:"print"});
					}, cancelCallback:function(){
						KISUtil.debug("cancelCallback",jobID);
						SSMILib.onEvent("PrintJobCancel", 	true, {uuid:jobID, type:"print"});
					}, foundCallback:function(){
						KISUtil.debug("foundCallback",jobID);
						SSMILib.onEvent("PrintJobFound", 	true, {uuid:jobID, type:"print"});
					}}, glbConfig.GetJob.count);
				}
				else{
					KISUtil.debug("Charge", "error");

					var param = {type:"job",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_PRINT_JOB,targetPage:false};
					WarnPopup._param = param;
					PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
				}
			}
			else{
				KISUtil.debug("Charge", "error");
				var param = {type:"job",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "PrintJobFound":
		case "PrintJobComplete":
			var arg=arguments[2];
			JobMonitor.stopMonitor(arg);
			if(arguments[1] === true){
				if(glbConfig.campaignImg.length!=0){//켐페인이미지가 존재할 경우 탄소결과 화면을 표시
					getDateTime();
				}else{
					var _page = PageManager.getCurrentPage();
					if(_page.ID != MainPage.ID){
						//PageManager.changePage(MainPage,PageManager.type.NORMAL);
						SSMILib.GetTrayInfo();
					}
				}
				//document.location.reload();
				break;
			}else{
				var param = {type:"job",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
			break;
		case "PrintJobCancel":
			var arg				= arguments[2];
			JobMonitor.stopMonitor(arg);
			var msg 			= {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.INTERUPTED_PRINT_JOB};
			var param 			= {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param 	= param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "PrintJobError":
			var arg=arguments[2];
			JobMonitor.stopMonitor(arg);
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_PRINT_JOB};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "PrintJobTimeout":
			var arg=arguments[2];
			JobMonitor.stopMonitor(arg);
			var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_TIMEOUT};
			var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			break;
		case "onbuttonup":
			switch(id)
			{
				case "btn_serviceSelect":
					BrowserExt.Beep(0);
					//excuteToParent("ServiceManager.removeService");
					ConfirmPopup.popupType = "SERVICE_SELECT";
					ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_SEVICE_SELECT;
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
				break;
				case "btn_logout":
					BrowserExt.Beep(0);
					//excuteToParent("Common.LogOut",[true]);
					ConfirmPopup.popupType = "LOGOUT";
					ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_LOGOUT;
					//PageManager.changePage(PageManager.getPrevPage(),PageManager.type.MODAL);
					PageManager.changePage(ConfirmPopup,PageManager.type.MODAL);
				break;
			}
		default:
			var currentPage = PageManager.getCurrentPage();
			if(currentPage)
			{
				currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
			}
			break;
	}
};
Common.calculateCharge = function(docInfo){
	glbDataSet.priceInfo = _calculateCharge(docInfo);
	if(glbDataSet.priceInfo){
		var sizeInfo = getTraySize(glbScan.outputMedium.size);
		docInfo.outputMediumSize 		= sizeInfo.size;
		glbDataSet.priceInfo.oms 		= docInfo.outputMediumSize;
		glbDataSet.priceInfo.colorMode 	= Msg.Func.colorMode[(glbDataSet.colorModeIdx==0)?"color":"bw"];
		glbDataSet.priceInfo.pages 		= glbDataSet.pages + " " + Msg.UNIT.PAGE;
		glbDataSet.priceInfo.outplex 	= Msg.Func.plex[["simplex","duplex","tumble"][glbDataSet.outplexIdx]];
		glbDataSet.priceInfo.copies 	= glbDataSet.copies + " " + Msg.UNIT.PRN_SET;
	}

	/**
	 * 과금금액 연산 (TraySelectionPopup에서도 사용해야하므로 이동 필요 )
	 */
	function _calculateCharge(docInfo){
		KISUtil.debug("_calculateCharge",JSON.stringify(docInfo));
		//scanInfo에서 가져온 과금 룰을 이용하여계산
		//glbDataSet.outplexIdx//0,1,2
		//glbDataSet.colorModeIdx//0,1
		//glbDataSet.copies//1-n
		//glbDataSet.outputMediumSize//A3/B4/A4/B5
		var priceInfo = {copiesPrice:0,unitPrice:0,totalPrice:0};

		try{
			if(glbInfo.copiesPrice&&glbInfo.unitPrice&&glbInfo.totalPrice){
				priceInfo.copiesPrice 	= glbInfo.copiesPrice;
				priceInfo.unitPrice 	= glbInfo.unitPrice;
				priceInfo.totalPrice 	= glbInfo.totalPrice;
				return priceInfo;
			}
			else{
				var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_ENV};
				var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
			}
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
/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function()
{
	Common.setImage("icn_title", CONFIG.ENV.LOGO_PATH||Img.COMMON.ICN_TITLE);
	Common.setText("txt_title",Msg.CommonLbl.title);
	var obj = {id:"btn_logout", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.UIPARTS.BTN_LOGOUT_OFF, pressImg: Img.UIPARTS.BTN_LOGOUT_PRESS}};
	WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
	obj = {id:"btn_serviceSelect", type:WidgetLib.ButtonType.NORMAL, attr:{offImg: Img.UIPARTS.BTN_SERVICE_SELECT_OFF, pressImg: Img.UIPARTS.BTN_SERVICE_SELECT_PRESS}};
	WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
	Common.changeVisibility("btn_logout", "block");
	Common.changeVisibility("btn_serviceSelect", "block");
};

/**
 * 화면에 표시할 유저명을 취득<br>
 * 우선순위<br>
 * 1.정보취득중과 화면표시중에 취득된 유저명<br>
 * 2.1이 아닌 경우, 유저의 RelatedUserID<br>
 * 3.1,2이 아닌 경우, 「일반유저」<br>
 * @return {string} name 화면에 표시할 유저명
 */
Common.getUserName = function()
{
	var name = "";
	if(glbInfo.userInfo){
		if(glbInfo.userInfo.RelatedUserID){
			name = glbInfo.userInfo.RelatedUserID;
		}
		else{
			name = "";
		}
	}
	return name;
};

/**
 * 화면에 표시할 유저명의 길이 설정<br>
 * 유저명의 길이가 길경우 표시 폭에 마추어 잘라내기 한다.
 * @return {string} name 화면에 표시할 유저명
 */
Common.getUserDisplayName = function(name)
{
	if(name){
		var byteNum = this.getStringSize(name);
		if(byteNum > glbInfo.userNameLength)
		{
			name = this.cutStringWidth(name, glbInfo.userNameLength);
		}
	}
	return name;
};

/**
 *풀다운의 HTML을 작성
 * @param {string) _page : 적용될 페이지의 Key
 * @param {string} _key : 풀다운의 Key (각 Element의 ID를 작성해 사용한다.)
 * @param {int} _length : 항목 (항목을 나누어 HTML을 작성)
 * @return Full down HTML Element
 */
Common.createHTMLPulldown = function(_page,_key,_length,_isDouble){
	var _popup 	= Common.getNewElement("div",{id:"pul_" + _page + "_" + _key + "_popup", className:"pullPop hide"}),
		_bg 	= Common.getNewElement("img",{id:"img_" + _page + "_" + _key + "_popup_bg", className:"pullBg"}),
		_body 	= Common.getNewElement("div",{id:"lst_" + _page + "_" + _key + "_popup"}),
		_list 	= document.createElement("ul"),
		_btn, _item, _node, _tmp;
	_bg.setAttribute("src", Img.BG["BG_PUL_" + _length]||Img.BG["BG_PUL_5"]);
	_bg.style.top=0;
	_body.style.zIndex = "100";

	for(var i = 0; i < _length; i++)
	{
		_item 	= Common.getNewElement("li",{id:"item" + i});
		_btn 	= Common.getNewElement("div",{id:"btn_" + _page + "_" + _key + "_menu_" + i, className:"btn"});
		_btn.appendChild(Common.getNewElement("img",{id:"img_" + _page + "_" + _key + "_menu_" + i, className:"bg"}));		//bg
		_btn.appendChild(Common.getNewElement("img",{id:"icn_" + _page + "_" + _key + "_menu_" + i, className:"icon"}));	//icon
		//_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i, className:"lbl"}));	//label
		if(glbInfo.lang=='en' && (_key=='inplex'||_key=='outplex') && (i==1||i==2)){
			_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i + "_1", className:"lbl"}));	//label
			_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i + "_2", className:"lbl"}));	//label
		}else{
			_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i, className:"lbl"}));	//label
		}
		if(_isDouble){
			_btn.appendChild(Common.getNewElement("div",{id:"lbl_" + _page + "_" + _key + "_menu_" + i + "_0", className:"lbl1"}));	//label
		}
		_item.appendChild(_btn);
		_list.appendChild(_item);
	}
	_body.appendChild(_list);
	_popup.appendChild(_body);
	_popup.appendChild(_bg);

	return _popup;
};

/**
 * List를 입수시 Widget의 Status를 변경
 * @param {Array} list Widget Object Array
 * @param {boolean} flag Enable/Disable
 */
Common.changeStatus = function(list,flag)
{
	for(var i=0,il=list.length;i<il;i++)
	{
		WidgetLib.setWidgetStatus(list[i], {enable:flag});
	}
};

Common.getWsIp = function(){
	var regex = /^http:\/\/([A-Za-z0-9-]+\.)+[A-Za-z0-9-]{2,4}/;
	var result = regex.exec(glbConfig.DATA.SERVER_URL);
	KISUtil.debug("Common.getWsIp/glbConfig.DATA.SERVER_URL",glbConfig.DATA.SERVER_URL);
	return (result!=null)?result[0].replace("http://",""):"";
};

/**************************************************************** 共通 ****************************************************************/
/**
 * 화면 Object의 문자열 표시 처리
 * @param {string} id :Object의 ID
 * @param {string} string :표시할 문자열
 */
Common.setText = function(id, str)
{
	var textNode;
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
			if(typeof str == "string")
			{
				//textNode.innerText = str;
				//textNode.appendChild(document.createTextNode((str=="")?"&nbsp;":str));
				textNode.innerHTML=(str=="")?"&nbsp;":str;
			}
			else if(typeof str == "number")
			{
				textNode.innerHTML = str;
			}
			else if(str instanceof Array)
			{
				var tmp;
				for(var i = 0, il = str.length; i < il; i++)
				{
					tmp=document.createElement("p");
					tmp.innerHTML=(str[i]=="")?"&nbsp;":str[i];
					textNode.appendChild(tmp);
				}
			}
			else{
				KISUtil.debug("Common.setText:",id+"/"+str);
			}
			break;
		case "input":
			if(textNode["type"]==="image"){
				textNode.appendChild(document.createTextNode((str=="")?"&nbsp;":str));
			}
			else{
				textNode.setAttribute("value",str);
			}
			break;
		default:
			KISUtil.debug("Common.setText:",id+"/"+str);
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
	return obj.firstChild?obj.firstChild.nodeValue:obj.innerText;
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
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} margin : Text의 margin 위치 (left/right/top/bottom)
 * @param {string} margin : Text의 margin 위치값
 */
Common.setMargin = function(id, margin, arg)
{
	if(!id || !margin){
		return;
	}
	var obj = document.getElementById(id);
	if(obj){
		switch(margin){
			case 'marginLeft':
				obj.style.marginLeft = arg;
				break;
			case 'marginRight':
				obj.style.marginRight = arg;
				break;
			case 'marginTop':
				obj.style.marginTop = arg;
				break;
			case 'marginBottom':
				obj.style.marginBottom = arg;
				break;
			default:
				break;
		}
	}
};

/**
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} margin : Text의 margin 위치 (left/right/top/bottom)
 * @param {string} margin : Text의 margin 위치값
 */
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
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} indent : Text의 indent 위치값
 */
Common.setIndent = function(id, indent)
{
	if(!id || !indent){
		return;
	}
	var obj = document.getElementById(id);
	obj.style.textIndent = indent;
};
/**
 * 용지 사이즈명을 변경 처리
 * @param {string} paperSize : 용지 사이즈
 * @param {string} beforeName : 변경전 용지명
 * @param {string} AfterName : 변경후 용지명
 */
Common.paperSizeNameReplace = function (paperSize,beforeName,AfterName)
{
	return paperSize.replace(beforeName,AfterName);
}

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
 * 지정된 문자열을 잘라 문자열을 분활 한다.
 * @param {string} str : 문자열
 * @param {int} num : 잘라낼 문자열 Bytes수
 * @return {array} strArray : 분할한 문자열 배열
 */

Common.splitString=function (str, num, cnt)
{
	var strArray = [];
	var tmp = [];

	var nowByte = 0;
	var i = 0;
	var c;

	var step=0;
	while(c = str.charCodeAt(i)){
		step = this.isEmSizeCharacter(c)?2:1;		//refactoring(문자의 폭을 판단)

		if(nowByte + step < num)		//이하의 내용일 경우
		{
			//문자열을 Copy
			tmp[tmp.length] = str.substr(i++, 1);
			nowByte+=step;
		}
		else if(nowByte+step == num)	//상한에 도달한 경우
		{
			//문자열을 Copy
			tmp[tmp.length] = str.substr(i++, 1);
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
			tmp[tmp.length] = str.substr(i++, 1);
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
	var trimedStr = encodedStr.substr(0, size);
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult);
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
	var trimedStr = encodedStr.substr(0, length);
	var pattern = /%[^%]?$/;
	var regexResult = trimedStr.replace(pattern,'');
	return Common.getDecode(regexResult);
};

/**
 * 유저 제한 정보의 취득ユ?ザの制限情報の取得
 * -사양 변경(V1.5.0)
 * -Step2.1에 Refactoring(Copy/Print와 공통화)
 */
Common.getUserPermitInfo = function()
{
	KISUtil.debug("Common.getUserPermitInfo","excute");
	var tempInfo = BrowserExt.getPermitInfo();
	glbDevInfo.permitInfo = [];
	glbDevInfo.permitInfo[PERMIT_CHK.FULL_COLOR] = tempInfo.slice(8,9);
	glbDevInfo.permitInfo[PERMIT_CHK.LIMITED_COLOR] = tempInfo.slice(9,10);
	glbDevInfo.permitInfo[PERMIT_CHK.BW] = tempInfo.slice(10,11);
};

/**
 * 유저의 Color이용 제한 의 판별
 * -Step2.1에 Refactoring
 */
Common.setCmType = function()
{
	with(glbDevInfo)
	{
		if(permitInfo[PERMIT_CHK.FULL_COLOR]==0)
		{
			if(permitInfo[PERMIT_CHK.BW]==0)
			{
				glbDevInfo.cmType = CMType.None;
			}
			else if(permitInfo[PERMIT_CHK.BW]==1)
			{
				glbDevInfo.cmType = CMType.BNW;
			}
		}
		else if(permitInfo[PERMIT_CHK.FULL_COLOR]==1)
		{
			if(permitInfo[PERMIT_CHK.BW]==0)
			{
				glbDevInfo.cmType = CMType.Color;
			}
			else if(permitInfo[PERMIT_CHK.BW]==1)
			{
				glbDevInfo.cmType = CMType.All;
			}
		}
	}
};

/**
 * 유저의 기준ColorMode를 취득
 * -사양변경(V1.5.0) Start
 */
Common.getColorModeDefault = function(){
	var result = 0;
	switch(glbDevInfo.cmType)
	{
		case CMType.All:
			result = 0;		//Color Auto
			break;
		case CMType.Color:
			result = 1;		//Full Color
			break;
		case CMType.BNW:
			result = 2;		//GrayScale
			break;
		case CMType.None:
			result = -1;	//대상외
			break;
		default:
			//error
			break;
	}
	return result;
};

/**
 * 유저의 Color Mode를 확인
 * -사양변경(V1.5.0)
 */
Common.chkColorMode = function(idx){
	var modes = Common.chkColorModes();
	var result = {forbid:modes.status[idx],msg:modes.msg};
	return result;
};
/**
 * 유저의 Color Mode를 확인
 * -사양변경(V1.5.0)
 */
Common.chkColorModes = function()
{
	var result = {};
	switch(glbDevInfo.cmType)
	{
		case CMType.All:
			result = {status:[false,false,false,false],msg:""};
			break;
		case CMType.Color:
			result = {status:[true,false,true,true],msg:Msg.CONFLICT.MSG_R2};
			break;
		case CMType.BNW:
			result = {status:[true,true,false,false],msg:Msg.CONFLICT.MSG_R1};
			break;
		case CMType.None:
			result = {status:[true,true,true,true],msg:""};	//invalid parameter
			LogLib.write("Common.chkColorModes/invalid parameter:0_0",LogLib.LEVEL.WRN);
			break;
		default:
			LogLib.write("Common.chkColorModes/invalid parameter:" + glbDevInfo.cmType, LogLib.LEVEL.WRN);		//error
			break;
	}
	return result;
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
	/*if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
		for (var j = 0; j < xml.attributes.length; j++) {
			var attribute = xml.attributes.item(j);
			obj["@attributes"][this.removePrefix(attribute.nodeName)] = attribute.nodeValue;
		}
	}*/
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
Common.getObjLength = function(obj){
	var cnt=0;
	for(var tmp in obj){
		cnt++;
	}
	return cnt;
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

function parseBool(value) {
    return (typeof value === "undefined") ?
           false :
           // trim using jQuery.trim()'s source
           value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
}
function loadScript(loc){
	var tag = document.createElement("script");
	tag.setAttribute("type", "text/javascript");
	tag.setAttribute("src", loc);
	tag.setAttribute("charset", "UTF-8");
	document.getElementsByTagName("head")[0].appendChild(tag);
}

Common.replaceStrAtArray = function(_collection,_key,_value){
	var _result = new Array(_collection.length);
	for(var i = 0, iMax = _collection.length, _msg; i < iMax; i++){
		_result[i] = _collection[i].replace(_key,_value);
	}
	return _result;
};

Common.isSytemAdmin = function(userInfo)
{
	KISUtil.debug("Common.isSytemAdmin","excute");
	if(userInfo.Index < 0 || (typeof userInfo.Roles != 'undefined' && userInfo.Roles.Role == 'SystemAdministrator')){
		return true;
	}
	return false;
};

Common.setTrayInfo = function(trayInfo){
	glbInfo.tray = [];
	//var length = (trayInfo.length > 4) ? 4:trayInfo.length;
	var length = trayInfo.length, tmp;
	for(var i = 0; i<length; i++){
		tmp = trayInfo[i];
		if(isSupportPaperSize(tmp.MediumSize)){
			//tmp.MediumSize = tmp.MediumSize.substr(tmp.length - 2, 2);
			// JFLib.MS.B6SEF
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"8.5x11","LETTER"); //8.5x11 -> LETTER
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"8.5x13","FOLIO"); //8.5x13 -> FOLIO
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"8.5x14","LEGAL"); //8.5x14 -> LEGAL
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"11x17","LEDGER"); //11x17 -> LEDGER
			tmp.outputMediumSize = JFLib.MS[tmp.MediumSize + tmp.FeedDirection];
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"LETTER","8.5x11"); //LETTER -> 8.5x11
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"FOLIO","8.5x13"); //FOLIO -> 8.5x13
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"LEGAL","8.5x14"); //LEGAL -> 8.5x14
			tmp.MediumSize = Common.paperSizeNameReplace(tmp.MediumSize,"LEDGER","11x17"); //LEDGER -> 11x17
			glbInfo.tray[glbInfo.tray.length] = tmp;
		}
		else{
			//pass
		}
		//console.log("MediumSize:"+tmp.MediumSize);
	}
	function isSupportPaperSize(size){
		//console.log(size);
		return (SUPPORT_PAPER_SIZE.indexOf(size)!=-1);
	}
};

Common.indexOf=function(collection,obj)
{
	var idx=-1;
	if(collection instanceof Array)
	{
		for(var i=0,il=collection.length;i<il;i++)
		{
			if(collection[i]==obj)
			{
				idx=i;
				break;
			}
		}
	}
	return idx;
};

/**
 * 과금 결제 처리 함수(과금기본정보 생성)
 * @param {string} 과금 결제 Type (직과금/사이버머니)
 */
Common.doCharge = function(payType){
	// 과금시 금액 확인용
	var size 	= glbDataSet.outputMediumSize;
	var color;
	var duplex;
	var page 	= glbDataSet.pages;
	var copies 	= glbDataSet.copies;
	if(glbDataSet.colorModeIdx == 0){
		color 	= "Color";
	}else{
		color 	= "MonochromeGrayscale";
	}
	switch(glbDataSet.outplexIdx){
		case 0:
			duplex = "OneSided";
			break;
		case 1:
			duplex = "TwoSidedLongEdge";
			break;
		case 2:
			duplex = "TwoSidedShortEdge";
			break;
		default:
			duplex = "OneSided";
	}
	
	var charge = {
		"service"	: SERVICE_CODE.COPY_CHARGE,
		"docInfo"	: {
			"outplex"			: glbDataSet.outplexIdx.toString(), // 0/1/2 (Simplex/Duplex/Tumble)
			//"outputmediumsize": glbDataSet.outputMediumSize,
			"outputmediumsize"	: size,
			"colormode"			: glbDataSet.colorModeIdx.toString(), // 0/1 (Color/Black&White)
			"pages"				: glbDataSet.pages.toString(),//원고매수
			"copies"			: glbDataSet.copies.toString(),//부수
		},
		"copyPrint"	: {
			"fileName"			: glbFileTran.docName + ".pdf",
			"copies" 			: copies,
			"sides" 			: duplex,
			"color" 			: color,
			"scalingFactorX"	: "100",
			"scalingFactorY"	: "100",
			"printQuality"		: "Normal"
		},
		"paymentMethods"		: payType,//payType 직과금/사이버머니
		"userId"				: glbInfo.userId,
		"ipAddress"				: glbConfig.PRINTER_IP,
		"serialNo"				: glbInfo.serialNumber||"000000",
		"language"				: glbInfo.lang
	};

	KISUtil.debug("Common.doCharge/charge",JSON.stringify(charge));

	//charge.userId = (glbConfig.isSHA)? SecureManager_Hash(charge.userId) : charge.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	charge = extendDeep(charge,glbChargeInit);
	Common.DoChargeReq(charge,Common.DoChargeResp);
};

function doScanJobStart()
{
	KISUtil.debug("doJobStart", "excute");

	glbFileTran.docName = getScanFileName();
	remappingTemplate();
	glbJobTemplate.setInputProcess(glbScan);
	glbJobTemplate.addOutputProcess(glbFileTran);

	glbComm = new WebServiceLib.Communicator();
	glbComm.successHandler = onScanJobSuccess;
	glbComm.errorHandler = onScanJobError;
 
	//카테고리 설정
	glbJobTemplate.category = Jfs_Msg.SCAN_CATEGORY;
	//명칭
	glbJobTemplate.name = Jfs_Msg.SCAN_JOB_NAME;
	//지시서명
	glbJobTemplate.header.name = Jfs_Msg.SCAN_TEMPLATE_NAME;

  	glbComm.callJobExecService(glbJobTemplate, gHost);
	/*
	KISUtil.debug("doJobStart","excute");
	//return;		//TODO 실행제한
	glbComm = new WebServiceLib.Communicator();
	glbComm.successHandler = onScanJobSuccess;
	glbComm.errorHandler = onScanJobError;
	//glbComm.user = CONFIG.ENV.LOGIN_INFO.ID;
	//glbComm.password = CONFIG.ENV.LOGIN_INFO.PASSWORD;
	//glbComm.user = "11111";
	//glbComm.password = "x-admin";

	glbComm.user = CONFIG.ENV.LOGIN_INFO.KO_ID;
	glbComm.password = CONFIG.ENV.LOGIN_INFO.KO_PASSWORD;

	//glbComm.url = "http://" + CONFIG.ENV.PRINT_SERVER.IP + ":" + CONFIG.ENV.PRINT_SERVER.PORT;
	//glbComm.externalUrl = "http://" + CONFIG.ENV.CARD_READER.IP + ":" + CONFIG.ENV.CARD_READER.PORT;

	//getScanFileName();
	remappingTemplate();
	setJobOutputProcess();

	//카테고리 설정
	glbJobTemplate.category = Jfs_Msg.SCAN_CATEGORY;
	//명칭
	glbJobTemplate.name = Jfs_Msg.SCAN_JOB_NAME;
	//지시서명
	glbJobTemplate.header.name = Jfs_Msg.SCAN_TEMPLATE_NAME;

	glbComm.callJobExecService(glbJobTemplate, gHost);
	*/
};


function setJobOutputProcess()
{
	KISUtil.debug("setJobOutputProcess","excute");
	//delete glbJobTemplate.output;
	glbJobTemplate.output = [];
	KISUtil.debug("glbJobTemplate.output.length",glbJobTemplate.output.length);
	KISUtil.debug("glbConfig.mailBoxUseFlg",glbConfig.mailBoxUseFlg);
	KISUtil.debug("glbDataSet.nupIdx",glbDataSet.nupIdx);
	//if(glbConfig.mailBoxUseFlg && glbDataSet.nupIdx == 0){

	glbConfig.chkMailBoxJobFlg = true;
	glbBox = new JFLib.Pbox();
	glbBox.boxNo = glbConfig.mailboxNo;
	glbBox.docName = getScanFileName();

	/*
	glbBox.authInfo.method = JFLib.AUTH.NAMEPASS;
	glbBox.authInfo.loginName = glbConfig.mailboxId;
	glbBox.authInfo.password = mailboxPassword;
	*/

	//glbBox.format = JFLib.DOCFORMAT.JPEG;
	//glbBox.format = JFLib.DOCFORMAT.PDF;
	glbJobTemplate.addOutputProcess(glbBox);

	KISUtil.debug("glbJobTemplate.output",JSON.stringify(glbJobTemplate.output));
};

function doBoxPrintJobStart(){
	KISUtil.debug("startBoxPrintJob","excute");
	var mailBox = new SSMILib.ExecuteJFS.MailBox();
	//boxID設定
	var jftMailbox = new JfsUtil.MailBox();
	var boxesInfo = new Array();
	jftMailbox.Identifier = glbConfig.mailboxNo;
	mailBox.MailBox = jftMailbox;
	//DocumentID設定
	var jftDocument = new JfsUtil.Document();
	jftDocument.Identifier = glbInfo.docInfo.docId;
	KISUtil.debug("docId", glbInfo.docInfo.docId);
	mailBox.Document = jftDocument;
	boxesInfo.push(mailBox);

	//Set Information of  JobTemplate
	var  jobTemplate = new JFLib.JobTemplate();

	//카테고리 설정
	jobTemplate.category = Jfs_Msg.SCAN_CATEGORY;
	//명칭
	jobTemplate.name = Jfs_Msg.SCAN_JOB_NAME;
	//지시서명
	jobTemplate.header.name = Jfs_Msg.SCAN_TEMPLATE_NAME;

	jobTemplate.setInputProcess(createMailboxObj());
	jobTemplate.addOutputProcess(createPrintObj());

	var exeJfsObj = new SSMILib.ExecuteJFS(jobTemplate);
	exeJfsObj.boxesInfo = boxesInfo;

	SSMILib.RemoteAccess.Interceptor = function (type, resp, arg){
		return arg;
	};

	SSMILib.ExecuteJFS.Send(exeJfsObj);
};

function createPrintObj(){
	KISUtil.debug("createPrintObj","excute");
	var printObj = new JFLib.Print();
	// printObj.jfsName = glbJobInfoTexts["JOB_INFO_CHILD_JOB_NAME"];
	//console.log(glbDataSet.copies);
	printObj.copies = glbDataSet.copies;
	printObj.outPlex = glbInfo.outplex[glbDataSet.outplexIdx];
	//printObj.colorMode = glbInfo.colorMode[glbDataSet.colorModeIdx];
	printObj.colorMode = "";
	printObj.inputTray = (glbDataSet.trayIdx == 0)?JFLib.INTRAY.AUTO:JFLib.INTRAY["TRAY" + glbDataSet.trayIdx];		//TODO
	//만약 트레이가
	/*if(glbDataSet.trayIdx == 0){
		printObj.inputTray = JFLib.INTRAY.AUTO;
	}
	else{
		printObj.inputTray = JFLib.INTRAY.AUTO;
		printObj.outputMedium.size = _getOMS();
	}*/
	return printObj;

	/*
	function _getOMS(){
		console.log("_getOMS");
		var _size="";
		//var direction = _getDirection();
		var direction = glbInfo.docInfo.direction;
		switch(direction){
			case "SEF":
			case "LEF":
				_size = "ISO-"+glbDataSet.outputMediumSize+direction;
				break;
			default:
				KISUtil.debug("_getOMS/glbDataSet.outputMediumSize",glbDataSet.outputMediumSize);
				KISUtil.debug("_getOMS/glbDataSet.PixelSize",glbDataSet.PixelSize);
				//로그기록
				//간주처리해야할듯
				_size = "ISO-"+glbDataSet.outputMediumSize+"SEF";
				break;
		}
		console.log(_size);
		return _size;
	}
	function _getDirection(){
		console.log("_getDirection");
		var direction = "OTHER";
		if(glbDataSet.inputMediumSize.indexOf("SEF")>-1){
			direction = "SEF";
		}
		else if(glbDataSet.inputMediumSize.indexOf("LEF")>-1){
			direction = "LEF";
		}
		else{
			try{
				var pixelArr = glbDataSet.PixelSize.split("x");
				if(pixelArr.length==2){
					var _x = parseInt(pixelArr[0]);
					var _y = parseInt(pixelArr[1]);
					direction = (_x>_y)?"LEF":"SEF";
				}
			}
			catch(ex){
				KISUtil.debug("_getDirection",JSON.stringify(ex));
			}
		}
		return direction;
		console.log(direction);
	}*/
};

function createMailboxObj(){
	KISUtil.debug("createMailboxObj","excute");
	var mailboxObj = new JFLib.Mailbox();
	mailboxObj.targetOrigin.scan = true;
	//mailboxObj.documentHandling.action = JFLib.DH.DELETE;
	mailboxObj.documentHandling.action = (flg_Dummy_Beep)?JFLib.DH.RETAIN:JFLib.DH.DELETE;

	return mailboxObj;
};

function getStoredDocument(){
	/*
	KISUtil.debug("getStoredDocument","excute");
	if(glbInfo.targetFolder == null){
		glbInfo.targetFolder = new WebDAVLib.Mailbox();
		glbInfo.targetFolder.prop.identifier = glbConfig.mailboxNo;
		glbInfo.targetFolder.prop.path = "http://" + (flg_Dummy_Beep?REMOTE_MACHINE:"localhost") + "/dav/box-" + ((glbConfig.mailboxNo)?glbConfig.mailboxNo:"1") + "/";
	}
	//console.log(glbInfo.targetFolder);
	glbInfo.targetFolder.listDocs(glbConfig.mailboxId, glbConfig.mailboxPassword);
  */
	var info = {
      "jobType": "copy",
      "command": "FILE_CHECK",
      "fileName": glbFileTran.docName + ".pdf",
      "fileType": "pdf"
  }
	Common.DoGetDocumentChkReq(info, Common.DoGetDocumentChkResp);
};

/**
 * 과금 정보 요청 Request함수
 * @param {Function} callback 과금결제 표시처리 Response함수
 * @param {Array} data 과금결제 표시를 위해 필요데이터
 */
Common.DoGetDocumentChkReq = function(data, callback) {
    KISUtil.debug("Common.DoGetDocumentChkReq", "excute");

    var httpRequest = createXMLHttpRequest();

    var url = (glbConfig.FileServerSSL) ? "https://" : "http://";
    url = url + glbConfig.FileServer + ":" + glbConfig.FileServerPort + "/fileCheck";
		//url = url + glbConfig.FileServer + ":" + glbConfig.FileServerPort;

    httpRequest.onreadystatechange = function() {
        KISUtil.debug("onreadystatechange", "excute");
        if (this.readyState === 4) {
            if (this.status === 200) {
                callback.call(this);
            } else {
                KISUtil.debug("DoGetDocumentChkReq Ajax Fail", this.status);
                clearTimeout(glbInfo.loginTimer);
                WarnPopup._param = { type: "startup", title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_COMM, targetPage: false };
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout = ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 과금 정보 요청 Response함수
 */
Common.DoGetDocumentChkResp = function() {
    KISUtil.debug("Common.DoChargePriceChkResp", "excute");

    try {
        var data = JSON.parse(this.responseText);
    } catch (error) {
        var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS };
        WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
        return;
    }

    if (data.status == "success") {
		if(!glbDataSet.inputMediumSize){
			glbDataSet.inputMediumSize = "ISO-A4LEF";
		}
		glbDataSet.pages = data.pages;
		glbInfo.docInfo = {};

		if(!glbInfo.docInfo.inputMediumSize){
			glbInfo.docInfo.inputMediumSize = "A4";
		}
		//glbDataSet.priceInfo.oms = glbInfo.docInfo.outputMediumSize;
		//glbDataSet.priceInfo.oms = "A4";
		if(!glbInfo.docInfo.direction){
			glbInfo.docInfo.direction = "LEF";
		}
		glbInfo.docInfo.pages = parseInt(data.pages);
		if(!glbInfo.docInfo.outputMediumSize){
			var sizeInfo = getTraySize(glbScan.outputMedium.size);
			glbInfo.docInfo.outputMediumSize = sizeInfo.size;
		}
		glbDataSet.outputMediumSize = glbInfo.docInfo.outputMediumSize;
		//var targetPopup = ChargeInfoPopup;

    } else {
        var msg = (data.reason) ? { title: Msg.Page.WarnPopup.title, message: data.reason } : { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS };
        WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        var targetPopup = WarnPopup;
				PageManager.changePage(targetPopup, PageManager.type.NORMAL);
    }
		//Common.DoChargePriceChkResp();
		Common.doChargePrice();
};

/**
 * Job実行成功処理
 */
function onScanJobSuccess(resp)
{
	KISUtil.debug("onScanJobSuccess","excute");
	//console.log(resp);

	WidgetLib.setWidgetStatus("btn_MP_Start",{enable:true});		//버튼 활성화
	WidgetLib.setWidgetStatus("btn_EP_Start",{enable:true});		//버튼 활성화

	if(resp.responseXML){
		//console.log(resp.responseXML);
		var ids = resp.responseXML.getElementsByTagName("JobID");
		var arr = [], arr2;
		for(var i=0;i<ids.length;i++){
			tmp = ids[i].childNodes;
			arr2 =[];
			for(var j=0;j<ids.length;j++){
				arr2[arr2.length] = tmp[j].nodeValue;
			}
			arr[arr.length]=arr2.join('');
		}
		//스캔잡이므로 하나여야함
		glbInfo.scanJobID = arr[0];
		PageManager.changePage(SizeInfoPopup, PageManager.type.NORMAL);

		JobMonitor.startMonitor({uuid : glbInfo.scanJobID, type:"scan", successCallback:function(){
			console.log("successCallback");
			SSMILib.onEvent("ScanJobComplete", true, {uuid:glbInfo.scanJobID, type:"scan"});
		}, errorCallback:function(){
			console.log("errorCallback");
			SSMILib.onEvent("ScanJobError", true, {uuid:glbInfo.scanJobID, type:"scan"});
		}, timeoutCallback:function(){
			console.log("timeoutCallback");
			SSMILib.onEvent("ScanJobTimeout", true, {uuid:glbInfo.scanJobID, type:"scan"});
		}, cancelCallback:function(){
			console.log("cancelCallback");
			SSMILib.onEvent("ScanJobCancel", true, {uuid:glbInfo.scanJobID, type:"scan"});
		}, foundCallback:function(){
			console.log("foundCallback");
			SSMILib.onEvent("ScanJobFound", true, {uuid:glbInfo.scanJobID, type:"scan"});
		}}, glbConfig.GetJob.count);
	}
	else{
		//TODO:Job실행중에러
	}
};

function onScanJobError()
{
	KISUtil.debug("onScanJobError","excute");

	WidgetLib.setWidgetStatus("btn_MP_Start",{enable:true});		//버튼 활성화
	WidgetLib.setWidgetStatus("btn_EP_Start",{enable:true});		//버튼 활성화

	var msg = {title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_SCAN_JOB};
	BrowserExt.Beep(1);
	if(glbComm && glbComm.fault){
		KISUtil.debug("onScanJobError/subcode",glbComm.fault.subcode);
		if(glbComm.fault.subcode == "flt:UnauthorizedUser"){
			msg = {title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_ENV};//JOB_EXCUTE_WITH_UNAUTHORIZED_USER
			KISUtil.debug(glbComm.fault.subcode,glbComm.fault.subSubcode);
		}
		else{
			KISUtil.debug("onScanJobError/subSubcode",glbComm.fault.subSubcode);
			switch(glbComm.fault.subSubcode){
				case "flt:TooManyJobs":
					MessageManager.displayMessage(MessageManager.MessageType.JOB_START, MessageManager.START_DETAIL.TOO_MANY_JOB_ERROR, Msg.ERROR_MSG.TOO_MANY_JOBS);
					return;
				case "flt:InvalidJobFlow":
					if(glbComm.fault.description)
					{
						switch(glbComm.fault.description)
						{
							case "Conflict:PageSplit and ScanFrom":
								MessageManager.displayMessage(MessageManager.MessageType.JOB_START, MessageManager.START_DETAIL.JOB_CONFLICT_PAGESPLIT_SCANFORM, Msg.ERROR_MSG.USE_GLASS_FOR_PAGESPLIT);
								return;
						}
					}
					break;
				case "flt:AuditronLimitExceeded":
				case "flt:ServiceLimitReached":
				case "flt:PagePrintLimitExceeded": 			//발생치 않음
				case "flt:AccessyError":
					msg = {title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_ENV};
					break;
				default:
					KISUtil.debug(glbComm.fault.subcode,glbComm.fault.subSubcode);
					break;
			}
		}
	}
	var param = {type:"job",title:msg.title,message:msg.message,targetPage:false};
	WarnPopup._param = param;
	PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
};


function getScanFileName()
{
	KISUtil.debug("getScanFileName","excute");
	//20140202_235959999_13_197_1_73_D_2_A4_C_1.xdw
	var date = new Date();
	var timestamp = date.format("yyyyMMdd_HHhhmmssfff");

	var fileObj = [];

	//IP정보
	//var ipObj = glbInfo.ipAddress.split(".");
	//for(var i in ipObj){
	//	fileObj.push(ipObj[i]);
	//}
	//outPlex
	fileObj.push(glbInfo.outplex[glbDataSet.outplexIdx].substr(0,1).toUpperCase());
	//Nup
	//fileObj.push(glbInfo.nup[glbDataSet.nupIdx]);
	//tray
	fileObj.push((glbDataSet.trayIdx == 0)?(JFLib.INTRAY.AUTO).toUpperCase():glbInfo.tray[glbDataSet.trayIdx-1].MediumSize);
	//colormode
	fileObj.push(glbDataSet.colorModeIdx==0?"C":"B");
	//부수
	fileObj.push(glbDataSet.copies);

	//glbFile.docName = timestamp + fileObj.join("_");
	return timestamp + fileObj.join("_");
};

function updatePreviewImg(page)
{
	KISUtil.debug("updatePreviewImg","excute");
	var _pathObj = [];
	var filePath = "./image/";

	var fileName = {
		prefix : "PRV",
		colorMode:["C", "B"],
		orientation:["POT","LAN"],
		outPlex:["SIM","DUP","TUM"],
		nup:["1","2","4","8"]
	};

	_pathObj.push(fileName.prefix);
	_pathObj.push(fileName.colorMode[glbDataSet.colorModeIdx]);
	_pathObj.push(fileName.orientation[glbDataSet.orientation]);
	_pathObj.push(fileName.outPlex[glbDataSet.outplexIdx]);
	_pathObj.push(fileName.nup[glbDataSet.nupIdx]);

	filePath = filePath + _pathObj.join("_") + ".png";

	Common.setImage("img_" + page +"_preview", filePath);

};

/**
 * 결제 금액을 표시하는 함수
 */
Common.doChargePrice = function(){
	
	//if(!glbDataSet.outputMediumSize){
	// 출력용지가 A4로 고정되는 현상 대응으로 값이 있든 없든 설정값을 확인하아 Price 확인
	var sizeInfo = getTraySize(glbScan.outputMedium.size);
	glbDataSet.outputMediumSize 		= sizeInfo.size;
	glbInfo.docInfo 					= {};
	glbInfo.docInfo.inputMediumSize 	= sizeInfo.size;
	glbInfo.docInfo.direction 			= sizeInfo.direction;
	glbInfo.docInfo.pages 				= glbDataSet.pages;
	glbInfo.docInfo.outputMediumSize 	= sizeInfo.size;
	//}
	
	var info = {
		"service"	: SERVICE_CODE.COPY_PRICE,
		"docInfo"	: {
			"outplex"			: glbDataSet.outplexIdx.toString(), // 0/1/2 (Simplex/Duplex/Tumble)
			//"outputmediumsize": glbDataSet.outputMediumSize,
			"outputmediumsize"	: glbInfo.docInfo.outputMediumSize,
			"colormode"			: glbDataSet.colorModeIdx.toString(), // 0/1 (Color/Black&White)
			//"pages"			: glbDataSet.pages.toString(),
			"copies"			: glbDataSet.copies.toString(),
			"fileName"			: glbFileTran.docName + ".pdf"
			//"scanToUSB":glbInfo.scanToUSB,//ScanToUSB여부(true/false) TODO
		},
		"userId"	:glbInfo.userId,
		"ipAddress"	:glbConfig.PRINTER_IP,
		"serialNo"	:glbInfo.serialNumber||"000000",
		'language'	:glbInfo.lang
	};

	info.userId = (glbConfig.isSHA)? SecureManager_Hash(info.userId) : info.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	info 		= extendDeep(info,glbChargePriceChkInit);
	Common.DoChargePriceChkReq(info,Common.DoChargePriceChkResp);
};

 /**
 * 결제금액을 표시를 위해 서버전송 Request함수
 * @param {Function} callback 과금결제 표시처리 Response함수
 * @param {Array} data 과금결제 표시를 위해 필요데이터
 */
Common.DoChargePriceChkReq = function(data,callback){
	KISUtil.debug("Common.DoChargePriceChkReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoChargePriceChkReq Ajax Fail",this.status);
	        	clearTimeout(glbInfo.loginTimer);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 서버로부터 결제가격 표시가 완료된 Response함수
 */
Common.DoChargePriceChkResp = function(){
	KISUtil.debug("Common.DoChargePriceChkResp","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}

	if(data.status=='success'){
		glbInfo.copiesPrice = parseInt(data.copiesPrice);//복사시 부수당 단가 (1부당)
		glbInfo.unitPrice 	= parseInt(data.unitPrice);//복사시 Size에 따른 1부당 단가
		glbInfo.totalPrice 	= parseInt(data.totalPrice); //복사시 총가격
		glbDataSet.pages 	= parseInt(data.pages);
		//glbDataSet.outputMediumSize = glbInfo.docInfo.outputMediumSize;

		var chkResult 		= checkPreceedToCharge(glbInfo.docInfo);//진행여부 판단필요시점
		(chkResult)?Common.calculateCharge(glbInfo.docInfo):"";
		var targetPopup 	= (chkResult)? ChargeInfoPopup : TraySelectionPopup;
		var pageType 		= (chkResult)? PageManager.type.NORMAL : PageManager.type.MODAL;
	}else{
		var msg 			 = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};//충전잔액 부족등
		var param 			 = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup 	 = WarnPopup;
		var pageType 		 = PageManager.type.NORMAL;
	}
	PageManager.changePage(targetPopup,pageType);

	/**
	 * 과금으로 진행가능여부를 판단하는 로직
	 * 만일 출력용지의 크기를 특정하지 못할경우
	 * 용지선택팝업으로 천이하여 유저의 입력을 기다리도록 함
	 * @param {object} docInfo 문서의 정보가 담긴 객체
	 * @return
	 */
	function checkPreceedToCharge(docInfo){
		KISUtil.debug("checkPreceedToCharge",JSON.stringify(docInfo));
		//unknown이면 트레이 지정팝업으로
		//비정형이면 정형으로 변환
		//정형이면 그대로 계승
		//과금이 잔고를 초과시
		//	에러팝업으로
		//과금 만족시
		//	과금 팝업으로
		var result = false;
		if(!glbDataSet.pages){
			glbDataSet.pages = docInfo.pages;
		}
		switch(docInfo.inputMediumSize){
			case"A3":
			case"B4":
				if(isA3Available()){
					glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "A3";
				}
				else{

				}
				function isA3Available(){
					var i,len, tmp, result=false;
					for(var i = 0,len = glbInfo.tray.length; i < len; i++){
						tmp = glbInfo.tray[i];
						if(isSupportPaperSize(tmp.MediumSize) && tmp.MediumSize=="A3"){
							result=true;
							break;
						}
					}
					function isSupportPaperSize(size){
						//console.log(size);
						return (SUPPORT_PAPER_SIZE.indexOf(size)!=-1);
					}
					return result;
				}
				result = true;
				break;
			case"A4":
			case"B5":
				glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = "A4";
				result = true;
				break;
			//others랑 unknown을 같이 처리할까 고민중
			case "unknown":
			default:	//others
				//간주처리
				//console.log("docInfo:"+JSON.stringify(docInfo));
				var _size = getSize(docInfo.PixelSize,docInfo.DPI);
				//console.log("_size:"+_size);
				if(_size){
					glbInfo.docInfo.outputMediumSize = glbDataSet.outputMediumSize = _size;
					result = true;
				}
		}
		return result;
	}
	/**
	 * 저장파일의 크기를 받아 출력가능한 용지크기를 찾아주는 메소드
	 * @param {array} _pixels 첫번째가 단변 두번째가 장변, 단위는 pixel
	 * @param {string} _dpi
	 * @return {string} 용지크기명 ex.A4
	 */
	function getSize(_pixels,_dpi){
		var result = null, tmp;
		//var arrWH = [ [29700,42000],[25700,36400],[21000,29700], [18200,25700]];
		//var arrName = [ "A3", "B4","A4", "B5"];
		var arrWH = [[827, 1170], [1014, 1433], [1170, 1655]]; //2016.08.16 KIS Chone B4 사이즈 대응 //mm to inches //결제 정보 화면에 표시되는 priceInfo.oms 데이터 처리 추가 //2016.09.29 B4 사이즈 수정
		var arrName = [ "A4", "B4", "A3"];
		var res = -1;
		switch(_dpi){
			case JFLib.RES.R200:
				res = 2;
				break;
			case JFLib.RES.R300:
				res = 3;
				break;
			case JFLib.RES.R400:
				res = 4;
				break;
			case JFLib.RES.R600:
				res = 6;
				break;
			default:
				//사이즈 검출 불가
				KISUtil.debug("getSize/getSize",_dpi+"/_pixels:"+JSON.stringify(pixels));
		}
		if(res!= -1){
			var unitSize = [];
			unitSize[0] = Math.round(_pixels[0]/res);
			unitSize[1] = Math.round(_pixels[1]/res);

			for(var i=0,len=arrWH.length;i<len;i++){
				tmp = arrWH[i];
				if(tmp[0]>=unitSize[0]&&tmp[1]>=unitSize[1]){
					result = arrName[i];
					break;
				}
			}
		}
		return result;
	}
};

/**
 * 과금 결제 처리를 위해 서버전송 Request함수
 * @param {Function} callback 과금결제처리 Response함수
 * @param {Array} data 과금결제를 위해 필요데이터
 */
Common.DoChargeReq = function(data,callback){
	KISUtil.debug("Common.DoChargeReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoChargeReq Ajax Fail",this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 서버로부터 과금 결제 처리 완료된 Response함수
 */
Common.DoChargeResp = function(){
	KISUtil.debug("Common.DoChargeResp:","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}
	if(data.status=='success'){
		KISUtil.debug("Charge_data:",JSON.stringify(data));
		console.log("Charge_data:",JSON.stringify(data));

		var _balance = parseInt(data.chargeRemains);
		(_balance)?	excuteToParent("Common.updateUserBalance",[_balance]):"";
		PageManager.changePage(PrintingPopup , PageManager.type.NORMAL);
		//doBoxPrintJobStart();
		//Common.DoSelectPrint();
		//excuteToParent("ServiceManager.removeService");
		JobMonitor.startMonitor({successCallback:function(){
			KISUtil.debug("successCallback", "");
			excuteToParent("ServiceManager.removeService");
			//Common.afterJobProcess();
		}, 
		errorCallback:function(){//지정된 횟수만큼 잡 모니터링 했으나 프린트 잡 미발견 시
			KISUtil.debug("errorCallback", "");
			Common.displayWarnPopup("logout");
		}, 
		cancelCallback:function(){
			KISUtil.debug("cancelCallback", "");
			Common.displayWarnPopup("logout");
		}, 
		jobCount : 1}, 50);
		return;
	}
	else{
		var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};//결제 오류등
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	}
};

Common.DoSelectPrint = function(){
	var size = glbDataSet.outputMediumSize;
	var color;
	var duplex;
	var page = glbDataSet.pages;
	var copies = glbDataSet.copies;
	if(glbDataSet.colorModeIdx == 0){
		color = "Color";
	}else{
		color = "MonochromeGrayscale";
	}
	switch(glbDataSet.outplexIdx){
		case 0:
			duplex = "OneSided";
			break;
		case 1:
			duplex = "TwoSidedLongEdge";
			break;
		case 2:
			duplex = "TwoSidedShortEdge";
			break;
		default:
			duplex = "OneSided";
	}

	var info = {
		"fileName" : glbFileTran.docName,
		"copies" : copies,
		"sides" : duplex,
		"color" : color,
		"scalingFactorX": "100",
		"scalingFactorY": "100",
		"printQuality": "Normal"
	};

	//info.userId = (glbConfig.isSHA)? SecureManager_Hash(info.userId) : info.userId;//SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
	//info = extendDeep(info,glbChargePriceChkInit);
	Common.DoSelectPrintReq(info,Common.DoSelectPrintResp);
}
/**
 * 과금 결제 처리를 위해 서버전송 Request함수
 * @param {Function} callback 과금결제처리 Response함수
 * @param {Array} data 과금결제를 위해 필요데이터
 */
Common.DoSelectPrintReq = function(data,callback){
	KISUtil.debug("Common.DoSelectPrintReq","excute");
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}
	var httpRequest = createXMLHttpRequest();

	//var url = (p_glbConfig.SERVER_SSL)?"https://":"http://";
	//url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT + "/api/printer/copy_charge";
	var url = (glbConfig.FileServerSSL) ? "https://" : "http://";
	url = url + glbConfig.FileServer + ":" + glbConfig.FileServerPort + "/copyPrint";

	httpRequest.onreadystatechange = function() {
		KISUtil.debug("onreadystatechange","excute");
        if (this.readyState === 4){
        	if(this.status === 200) {
	            callback.call(this);
	        }
			else{
				KISUtil.debug("DoChargeReq Ajax Fail",this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	        }
        }
    };
    httpRequest.open("POST", url, true);
    httpRequest.timeout=ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 서버로부터 과금 결제 처리 완료된 Response함수
 */
Common.DoSelectPrintResp = function(){
	KISUtil.debug("Common.DoChargeResp:","excute");
	try{
		var data = JSON.parse(this.responseText);
	} catch(error){//서버로부터 JSON형식으로 오지 않았을 경우
		var msg = {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
		var targetPopup = WarnPopup;
		PageManager.changePage(targetPopup,PageManager.type.NORMAL);
		return;
	}
	if(data.status == "success"){
		KISUtil.debug("Charge_data:",JSON.stringify(data));
		console.log("Charge_data:",JSON.stringify(data));

		//var _balance = parseInt(data.credit_remains);
		//(_balance)?	excuteToParent("Common.updateUserBalance",[_balance]):"";
		//PageManager.changePage(PrintingPopup , PageManager.type.NORMAL);
		//doBoxPrintJobStart();
		excuteToParent("ServiceManager.removeService");
		return;
	}
	else{
		var msg = (data.reason)?{title : Msg.Page.WarnPopup.title, message : data.reason} : {title : Msg.Page.WarnPopup.title, message : Msg.ERROR_MSG.FAIL_OTHERS};//결제 오류등
		var param = {type:"startup",title:msg.title,message:msg.message,targetPage:false};
			WarnPopup._param = param;
			PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
	}
	
};

Common.updateUserBalance = function(_balance){
	glbInfo.userBalance = _balance;
	//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE +  formatWithRemainders(_balance) + " " + Msg.UNIT.WON);
	//Common.setText("lbl_SS_Balance", Msg.SERVICE_SELECT.LBL_BALANCE + new Number(_balance).zf()+" "+Msg.UNIT.WON);
};

//2016.08.30 KIS Chone 카피/프린트 환불 관련 대응 Start
Common.doCopyRefundReq = function()
{
	var p_glbConfig = window.parent["glbConfig"];
	if(!p_glbConfig.SERVER_IP){
		return;
	}

	var url = (p_glbConfig.SERVER_SSL) ? "https://" : "http://";
	url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

	var data = {
		"service" : SERVICE_CODE.COPY_REFUND,
		"jobStatus" : glbInfo.jobStatus,//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		"paymentMethods" : glbChargeInit.paymentMethods,
		"userId" : glbInfo.userId,
		"ipAddress" : glbConfig.PRINTER_IP,
		"serialNo" : glbInfo.serialNumber||"000000",
		'language' : glbInfo.lang
	}

	var httpRequest = createXMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (this.readyState === 4){
			LogLib.write("[CS]--status : " + this.status, LogLib.LEVEL.INF);
        	if(this.status === 200) {
        		//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
        		//(Common.doCopyRefundRes).call(this);
        		LogLib.write("[CS] Common.doCopyRefundReq Succeed", LogLib.LEVEL.INF);
        		Common.copyRefundPostProc();//2017.02.02 FXKIS 카피 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
	        }else{
	        	//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
				/*KISUtil.debug("Common.doCopyRefundReq ajax failed", this.status);
				var param = {type:"startup",title:Msg.Page.WarnPopup.title,message:Msg.ERROR_MSG.FAIL_COMM,targetPage:false};
				WarnPopup._param = param;
				PageManager.changePage(WarnPopup,PageManager.type.NORMAL);*/
	        	//2017.02.02 FXKIS 카피 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
	        	glbInfo.refundCount++;
	        	if(glbInfo.refundCount == MAX_REFUND_COUNT){
	        		LogLib.write("[CS] Common.doCopyRefundReq Failed", LogLib.LEVEL.INF);
	        		Common.copyRefundPostProc();
	        	}else{
	        		LogLib.write("[CS] Common.doCopyRefundReq() retry glbInfo.refundCount : " + glbInfo.refundCount, LogLib.LEVEL.INF);
	        		Common.doCopyRefundReq();
	        	}
	        }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout = ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

//2017.02.02 FXKIS 카피 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
Common.copyRefundPostProc = function()
{
	SSMILib.LogoutDev();
	BrowserExt.SetScreenChange("allservice");
};

//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
/*Common.doCopyRefundRes = function()
{
	var data = null;
	try{
		data = JSON.parse(this.responseText);
	}catch(error){//JSON 형식이 아닐 경우
		var param = {type:"refund", title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MSG.FAIL_OTHERS, targetPage:false};
		WarnPopup._param = param;
		PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
		return;
	}

	var param = {type:"refund", title:Msg.Page.WarnPopup.title, message:((data.reason) ? data.reason : Msg.ERROR_MSG.FAIL_OTHERS), targetPage:false, type:"logout"};
	WarnPopup._param = param;
	PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
};*/

//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
Common.displayCopyRefundPopup = function(status)
{
	glbInfo.jobStatus = status;
	var param = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MSG.FAIL_PRINT_REFUND, targetPage:false, type:"logout", detail:"refund"};
	WarnPopup._param = param;
	PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
};
//2016.08.30 KIS Chone 카피/프린트 환불 관련 대응 End

/**
 * 디바이스로 부터 날짜/시간을 취득하는 함수
 */
function getDateTime(){
	var dev = new SSMILib.DeviceInfo("systemInformation", "DateTime");
	dev.requester.successHandler = onGetDateTimeSuccess;
	dev.requester.errorHandler = onGetDateTimeError;
	dev.getDeviceInfo(false);
	return;
}

/**
 * getDateTime의 성공 이벤트 함수
 */
function onGetDateTimeSuccess(res){
	var _dateTimeConf = null;
	if(!res.responseXML) {
		SSMILib.onEvent("GetDateTime", false, _dateTimeConf);
		return;
	}
	_dateTimeConf = SSMILib.attrNodeToObject(res.responseXML);

	if(_dateTimeConf){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetDateTime", _result, _dateTimeConf);

	return;
}

/**
 * getDateTime의 실패 이벤트 함수
 */
function onGetDateTimeError(res){
	var _dateTimeConf = null;
	SSMILib.onEvent("GetDateTime", false, _dateTimeConf);
	return;
}

 /**
 * 일정 기간을 설정하는 함수
 */
function setDateTime(dateTime){
	var start = dateTime.indexOf("T", 0);
	var end = dateTime.indexOf(":");

	var hours = dateTime.substring(start+1, end);
	if( (hours >= 5) && (hours <= 16) ){
		glbInfo.thankScreenState = THANK_SCREEN_STATE.DAY;
	}else if( (hours >= 17) && (hours <= 18) ){
		glbInfo.thankScreenState = THANK_SCREEN_STATE.EVENING;
	}else{
		glbInfo.thankScreenState = THANK_SCREEN_STATE.NIGHT;
	}
}

Common.displayWarnPopup = function(warningType, detailInfo)
{
	var param = {title:Msg.Page.WarnPopup.title, message:Msg.ERROR_MESSAGE.FAIL_PRINT_REFUND, targetPage:false, type:warningType, detail:((detailInfo)? detailInfo : "")};
	WarnPopup._param = param;
	PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
};

function getTraySize(traySize){
	var result = {
		size : "",
		direction : ""
	};
	switch(traySize){
		case JFLib.MS.A3SEF:
			result.size = "A3";
			result.direction = "SEF";
			break;
		case JFLib.MS.A4SEF:
			result.size = "A4";
			result.direction = "SEF";
			break;
		case JFLib.MS.A4LEF:
			result.size = "A4";
			result.direction = "LEF";
			break;
		case JFLib.MS.B4SEF:
			result.size = "B4";
			result.direction = "SEF";
			break;
		case JFLib.MS.B5SEF:
			result.size = "B5";
			result.direction = "SEF";
			break;
		case JFLib.MS.B5LEF:
			result.size = "B5";
			result.direction = "LEF";
			break;
		case JFLib.MS.AUTO:
		case JFLib.MS.NOTSPEC:
		case JFLib.MS.NONSTANDARD:
			result.size = paperSizeNameChk(glbJobLog.ScanImageDetailInformation.Size);
			if((result.size == "A3")||(result.size == "B4")){
				result.direction = "SEF";
			}else{
				result.direction = "LEF";
			}
			break;
		default:
			result.size = "A4";
			result.direction = "LEF";
	}
	return result;
}

function paperSizeNameChk(chkSize){
	var result = chkSize;
	switch(chkSize){
		case "JIS_B4":
			result = "B4";
			break;
		case "ISO_A3":
			result = "A3";
			break;
		case "ISO_A4":
			result = "A4";
			break;
		case "JIS_B5":
			result = "B5";
			break;
		default:
			result = chkSize;
	}
	return result;
}