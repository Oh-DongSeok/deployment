/**
 * @fileoverview Copy Main Page
 * @author FBKR Oh Dongseok
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var CopyMainPage = new TemplatePage();

CopyMainPage.ID = "page_copy_main";

/**
 * 개별 페이지의 Data정의
 */
CopyMainPage._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id: "copy_setting_start_btn", 				type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_copy_setting_start_btn", offImg: Img.PRINT_BTN_OFF, pressImg: Img.PRINT_BTN_PRESS, disableImg: Img.PRINT_BTN_DIS } },
			{id: "copy_setting_copies_plus_btn", 		type: WidgetLib.ButtonType.NORMAL},
			{id: "copy_setting_copies_minus_btn", 		type: WidgetLib.ButtonType.NORMAL},
			{id: "copy_setting_mag_plus_btn",			type: WidgetLib.ButtonType.NORMAL},
			{id: "copy_setting_mag_minus_btn",			type: WidgetLib.ButtonType.NORMAL},
			{id: "copy_setting_manual_mag_plus_btn",	type: WidgetLib.ButtonType.NORMAL},
			{id: "copy_setting_manual_mag_minus_btn",	type: WidgetLib.ButtonType.NORMAL}
		],
		imageList:[
		],
		textList:[
			{id: "copy_setting_src_duplex_label",		text:Msg.COPY_MAIN_MENU.SRC_DUPLEX_LABEL	},
			{id: "copy_setting_duplex_label",			text:Msg.COPY_MAIN_MENU.DUPLEX_LABEL		},
			{id: "copy_setting_color_label",			text:Msg.COPY_MAIN_MENU.COLOR_LABEL			},
			{id: "copy_setting_dpi_label",				text:Msg.COPY_MAIN_MENU.DPI_LABEL			},
			{id: "copy_setting_mag_label",				text:Msg.COPY_MAIN_MENU.RATIO_LABEL			},
			{id: "copy_setting_output_size_label", 		text:Msg.COPY_MAIN_MENU.OUTPUT_SIZE_LABEL	},
			{id: "copy_setting_copies_label", 			text:Msg.COPY_MAIN_MENU.COPIES_LABEL		},
			{id: "lbl_copy_setting_start_btn", 			text:Msg.COPY_MAIN_MENU.COPY_START			},
			{id: "copy_setting_mag_manual_label",		text:Msg.COPY_MAIN_MENU.MANUAL_MAG_LABEL	}
		]
	};
};

CopyMainPage._onPageChange = function(){
	initScanOptions();
	document.getElementById("box_copy_setting_manual_mag").disabled = true;
	this.updateDisplay();
	SSMILib.GetTrayInfo();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
CopyMainPage.updateDisplay = function(){
	var obj 			= document.getElementById("page_copy_main");
	obj.style.height 	= glbInfo.pageHeight.toString() + "px";
	obj.style.width 	= glbInfo.screenWidth.toString() + "px";
	if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("lyr_copy_main_wrapper", "left", "112px");
	 }
	displayScanSettingPage();
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
CopyMainPage.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			switch(id)
			{
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		case "onhardkeydown":
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_PAUSE:
					break;
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		default:
			break;
	}
};

/************************************************************
 * Display the scan setting page
 *************************************************************/
 function displayScanSettingPage(){
	 setPaperOptions();
	 setPlexOptions();
	 setColorOptions();
	 setResOptions();
	 setMagOptions();
	 saveScanSelection();
}
/************************************************************
 * Set the 2Sided/1Sided options for display in scan setting page
 *************************************************************/
 function setPaperOptions(){
	 var selElement = document.getElementById("copy_setting_output_size");
	 for(var i = 0; glbInfo.trayInfo.length > i; i++){
		 var feedDirection = " " + glbInfo.trayInfo[i].FeedDirection;
		 selElement.appendChild(createOptionElement(sizeCheck(glbInfo.trayInfo[i].MediumSize) + feedDirection, glbInfo.trayInfo[i].MediumSize));
	 }
 }
/************************************************************
 * Set the 2Sided/1Sided options for display in scan setting page
 *************************************************************/
function setPlexOptions(){
	var selElement = document.getElementById("copy_setting_duplex");
	if(selElement.options.length == 0){
		for(var i=0, j=glbPlexOptions.length; i<j; i++){
			selElement.appendChild(createOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
			if(glbConfig.default_scan_plex == glbPlexOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.plex = i;
			}
		}
	} else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.plexIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.plexIndex;
	}

	var selSrcElement = document.getElementById("copy_setting_src_duplex");
	if(selSrcElement.options.length == 0){
		for(var i=0, j=glbPlexOptions.length; i<j; i++){
			selSrcElement.appendChild(createOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
			if(glbConfig.default_scan_plex == glbPlexOptions[i].value){
				selSrcElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.plex = i;
			}
		}
	} else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.plexIndex){
		selSrcElement.selectedIndex = glbSetting.selectScanSettings.plexIndex;
	}

}
/************************************************************
 * Set the color mode options for display in scan setting page
 *************************************************************/
function setColorOptions(){
	var selElement = document.getElementById("copy_setting_color");
	if(selElement.options.length == 0){
		for (var i=0, j=glbColorModeOptions.length; i<j; i++){
			selElement.appendChild(createOptionElement(glbColorModeOptions[i].text, glbColorModeOptions[i].value));
			if(glbConfig.default_scan_color == glbColorModeOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.color = i;
			}
		}
	} else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.colorIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.colorIndex;
	}
}
/************************************************************
 * Set the resolution options for display in scan setting page
 *************************************************************/
function setResOptions(){
	var selElement = document.getElementById("copy_setting_dpi");
	if(selElement.options.length == 0){
		for(var i=0, j=glbResOptions.length; i<j; i++){
			selElement.appendChild(createOptionElement(glbResOptions[i].text, glbResOptions[i].value));
			if(glbConfig.default_scan_res == glbResOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.res = i;
			}
		}
	}else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.resIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.resIndex;
	}
}
/************************************************************
 * Set the reduce/enlarge options for display in scan setting page
 *************************************************************/
function setMagOptions(){
	var selElement = document.getElementById("copy_setting_mag");
	if(selElement.options.length == 0){
		for(var i=0, j=glbMagOptions.length; i<j; i++){
			selElement.appendChild(createOptionElement(glbMagOptions[i].text, glbMagOptions[i].value));
			if(glbConfig.default_scan_mag == glbMagOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.mag = i;
			}
		}
	}else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.magIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.magIndex;
	}
}
function MagOptionCheck(){
	var selElement = document.getElementById("copy_setting_mag");
	if(selElement.value == MAG_OPTION.MANUAL){
		document.getElementById("box_copy_setting_manual_mag").disabled = false;
	}else{
		//document.getElementById("box_copy_setting_manual_mag").disabled = true;
		var result = parseInt(selElement.value);
		document.getElementById("box_copy_setting_manual_mag").value 	= result;
		document.getElementById("box_copy_setting_manual_mag").disabled = true;
	}
}
function MagValueChange(){
	var result = parseInt(document.getElementById("box_copy_setting_manual_mag").value);
	var chk = isNumeric(result, 3);
	if(!chk){
		result = 100;
	}
	if(result > 400){
		document.getElementById("box_copy_setting_manual_mag").value 	= 400;
	}else{
		if(result < 30){
			document.getElementById("box_copy_setting_manual_mag").value = 30;
		}else{
			document.getElementById("box_copy_setting_manual_mag").value = result;
		}
	}
}

/************************************************************
 * create the filer options
 *************************************************************/
 function createOptionElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

/************************************************************
 * Save scan settings select status
 *************************************************************/
function saveScanSelection(){
	glbSetting.selectScanSettings.plexSrcIndex 		= document.getElementById("copy_setting_src_duplex"		).selectedIndex;
	glbSetting.selectScanSettings.plexIndex 		= document.getElementById("copy_setting_duplex"			).value;
	glbSetting.selectScanSettings.colorIndex 		= document.getElementById("copy_setting_color"			).selectedIndex;
	glbSetting.selectScanSettings.resIndex 			= document.getElementById("copy_setting_dpi"			).selectedIndex;
	glbSetting.selectScanSettings.magIndex 			= document.getElementById("copy_setting_mag"			).selectedIndex;
	glbSetting.selectScanSettings.magIndexVal 		= document.getElementById("copy_setting_mag"			).value;
	glbSetting.selectScanSettings.manualMag 		= document.getElementById("box_copy_setting_manual_mag"	).value;
	//glbSetting.selectScanSettings.outputMediumSize = document.getElementById("copy_setting_output_size").selectedIndex;
	glbSetting.selectScanSettings.outputMediumSize 	= document.getElementById("copy_setting_output_size"	).value;
	
	//glbSetting.selectScanSettings.FeedDirection 	= glbInfo.trayInfo[document.getElementById("copy_setting_output_size").selectedIndex].FeedDirection;
	glbSetting.selectScanSettings.FeedDirection 	= 0;
	
	glbSetting.selectScanSettings.outputCopiese 	= document.getElementById("box_copy_setting_copies"		).value;
	glbSetting.selectScanSettings.copies 			= document.getElementById("box_copy_setting_copies"		).value;
}

function doScanJobStart(){
	saveScanSelection();
	var scanOptions 		= {};
	glbScanDocName 			= getScanFileName();
	scanOptions.docName 	= glbScanDocName + ".pdf";
	scanOptions.plex 		= glbPlexOptions[glbSetting.selectScanSettings.plexSrcIndex].value;
	scanOptions.colorMode 	= glbColorModeOptions[glbSetting.selectScanSettings.colorIndex].value;
	scanOptions.docFormat 	= JFLib.DOCFORMAT.PDF;
	//getJobTemplate(scanOptions);
	scanOptions.resolution 	= glbResOptions[glbSetting.selectScanSettings.resIndex].value;
	//scanOptions.magnification = glbMagOptions[glbSetting.selectScanSettings.magIndex].value;
	if(glbMagOptions[glbSetting.selectScanSettings.magIndex].value == MAG_OPTION.MANUAL){
		scanOptions.magnification = glbSetting.selectScanSettings.manualMag;
	}else{
		scanOptions.magnification = glbMagOptions[glbSetting.selectScanSettings.magIndex].value;
	}
	var jobTemplate = getJobTemplate(scanOptions);
	KISUtil.debug("GetCopyScanStart:", "startScanJob()");
	startCopyScanJob(jobTemplate);
}

/************************************************************
 * Get the job template object
 *************************************************************/
function getJobTemplate(scanOptions){
	var jobTemplate 				= new JFLib.JobTemplate();
	jobTemplate.category 			= JFLib.JOBCATEGORY.COPY;
	jobTemplate.name 				= "Billing Copy";
	jobTemplate.header.name 		= "Scan to MailBox";
	jobTemplate.header.description 	= ContentsLib.contentsId + " " + ContentsLib.contentsVersion;
	jobTemplate.header.identifier 	= "1";
	jobTemplate.process 			= JFLib.PROCESS.ABORT;
	jobTemplate.setInputProcess(getScanObj(scanOptions));
	jobTemplate.addOutputProcess(createPcObj(scanOptions));
	//jobTemplate.addOutputProcess(getBoxObj());
	return jobTemplate;
}
/************************************************************
 * Get the invoke object
 *************************************************************/
function getBoxObj(scanOptions){
	var boxObj 		= new JFLib.Pbox();
	boxObj.boxNo 	= 200;
	boxObj.docName 	= glbScanDocName + ".pdf";
	//boxObj.docName = getScanFileName();
	return boxObj;
}
/************************************************************
 * Get the scan object
 *************************************************************/
function getScanObj(scanOptions){
	var scanObj 				= new JFLib.Scan();
	scanObj.plex 				= scanOptions.plex;
	scanObj.colorMode 			= scanOptions.colorMode;
	scanObj.resolution 			= scanOptions.resolution;
	scanObj.magnification.x 	= scanOptions.magnification;
	scanObj.magnification.y 	= scanOptions.magnification;
	scanObj.outputMedium.size 	= getOutTraySize(glbSetting.selectScanSettings.outputMediumSize, glbSetting.selectScanSettings.FeedDirection);
	//scanObj.headposition = JFLib.HP.LEFT;
	return scanObj;
}
/************************************************************
 * Function to start scan job
 *************************************************************/
function startCopyScanJob(jobTemplate){
	KISUtil.debug("GetCopyScanStart:", "startCopyScanJob()");
	gComm 					= new WebServiceLib.Communicator();
	gComm.successHandler 	= onScanJobSuccess;
	gComm.errorHandler 		= onScanJobError;
	KISUtil.debug("GetCopyScanStart:", "gHost:" + gHost);
	//KISUtil.debug("GetCopyScanStart:", jobTemplate);
	//gComm.callJobExecService(jobTemplate, gHost);
	KISUtil.debug("test:ExecuteJFS", "Send");
	var exeJfsObj = new SSMILib.ExecuteJFS(jobTemplate);
	SSMILib.ExecuteJFS.Send(exeJfsObj);
}
/************************************************************
 * Success event for starting scan job
 *************************************************************/
function onScanJobSuccess(res){
	var jobId = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/03/ssm/management/job",'JobID')[0].firstChild.nodeValue;
	if(jobId){
		glbInfo.jobId = jobId;
		//goToPage(SCREEN_LIST.SCAN_STATUS_PAGE);
		clearInterval(glbInterval);
		glbInterval = setInterval('getJobInfo()', 2000);
	}
}
/************************************************************
 * Error event for starting scan job
 *************************************************************/
function onScanJobError(res){
	var title;
	var message;
	var popup_type;
	var yellow_popup = false;

	if (gComm.fault && gComm.fault.code && gComm.fault.code == "SOAP:Server"){
		if(gComm.fault.subcode && gComm.fault.subcode == "flt:ServiceFailure"){
			if(gComm.fault.subSubcode) {
				ContentsLib.writeLog("[onJobError] result:" + gComm.fault.subSubcode);
				switch (gComm.fault.subSubcode) {
					case "flt:TooManyJobs":
						title 			= glbTexts["TOO_MANY_JOBS"				].TITLE;
						message 		= glbTexts["TOO_MANY_JOBS"				].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
					case "flt:AuditronLimitExceeded":
						title 			= glbTexts["AUDITRON_LIMIT_EXCEEDED"	].TITLE;
						message 		= glbTexts["AUDITRON_LIMIT_EXCEEDED"	].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
					case "flt:ServiceLimitReached":
						title 			= glbTexts["SERVICE_LIMIT_REACHED"		].TITLE;
						message 		= glbTexts["SERVICE_LIMIT_REACHED"		].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
					case "flt:ScanAheadRestriction":
						title 			= glbTexts["SCAN_AHEAD_RESTRICTION"		].TITLE;
						message 		= glbTexts["SCAN_AHEAD_RESTRICTION"		].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
					case "flt:PagePrintLimitExceeded":
						title 			= glbTexts["PAGE_PRINT_LIMIT_EXCEEDED"	].TITLE;
						message 		= glbTexts["PAGE_PRINT_LIMIT_EXCEEDED"	].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
					case "flt:AccessoryError":
						title 			= glbTexts["ACCESSORY_ERROR"			].TITLE;
						message 		= glbTexts["ACCESSORY_ERROR"			].MSG;
						popup_type 		= POPUP_TYPE.ALERT;
						yellow_popup 	= true;
						break;
				}
			}
		}
	}
	if(yellow_popup){
		//changePageView(SCREEN_LIST.YELLOW_POPUP, onPopupPageEvent);
		//openAlertPopup(popup_type, title, message);
	} else {
		//changePageView(SCREEN_LIST.RED_POPUP, onPopupPageEvent);
		//openCriticalErrorPopup(glbTexts["RED_ERR_MSG"].TITLE + "Scan_Job", glbTexts["RED_ERR_MSG"].MSG, [glbConfig.contact]);
	}
}
/************************************************************
 * Events for print queue page
 *************************************************************/
/************************************************************
 * Get the quick scan information from client
 *************************************************************/
function getQuickScanInfo(userObj){
	var target 			= userObj.clientid;
	// domain은 사용하지 않는 것으로 제거함.
	//if(userObj.domain && userObj.domain != "")
	//	target = target + "." + userObj.domain;
	target 				= target+":"+userObj.port;
	var url 			= HTTP_PROTOCOL + target + "/bridgeapp/quickscan/settings";
	var ws 				= new WebServiceLib.Communicator();
	ws.async 			= true;
	ws.method 			= 'POST';
	ws.successHandler 	= onGetQuickScanInfoSuccess;
	ws.errorHandler 	= onGetQuickScanInfoError;
	ws.timeoutHandler 	= onGetQuickScanInfoError;
	ws.send(url,JSON.stringify(glbDeviceInfo));
}
/************************************************************
 * Success event for getting the user information from client
 *************************************************************/
function onGetQuickScanInfoSuccess(res){
	var obj = res.responseText;
	SSMILib.onEvent("GetQuickScanInfo", true, obj);
	return;
}
/************************************************************
 * Error event for getting the user information from client
 *************************************************************/
function onGetQuickScanInfoError(res){
	var obj = res;
	SSMILib.onEvent("GetQuickScanInfo", false, obj);
	return;
}
/************************************************************
 * Timeout event for getting the user information from client
 *************************************************************/
function onGetQuickScanInfoTimeout(){
	SSMILib.onEvent("GetQuickScanInfo", false, null);
	return;
}
/************************************************************
 * Get the invoke profile object
 *************************************************************/
function getInvokeProfileObj(){
	var invokeProfile 	= new JFLib.Invoke.Profile();
	var target 			= HTTP_PROTOCOL + glbSetting.selectUser.clientid;
	//if(glbSetting.selectUser.domain && glbSetting.selectUser.domain != "")
	//	target = target + "." + glbSetting.selectUser.domain;
	target 				= target+":"+glbSetting.selectUser.port+ "/bridgeapp/scan/scanjob";
	//target = "http://10.97.1.98:9001/api/interface/Scan";
	invokeProfile.target = target;
	return invokeProfile;
}
/************************************************************
 * Get the invoke request object
 *************************************************************/
function getInvokeRequestObj(scanOptions){
	var invokeRequest 			= new JFLib.Invoke.Request();
	invokeRequest.attach 		= getInvokeAttach(scanOptions.docFormat);
	invokeRequest.messageBody 	= getMessageBody(scanOptions.docName);
	invokeRequest.timeOut 		= 300;
	return invokeRequest;
}
/************************************************************
 * Get the message body
 *************************************************************/
function getMessageBody(docName){
	var xml 		= new XMLLib.XMLSOAP();
	var root 		= xml.createSOAPEnvelope();
	var env 		= root;
	var body 		= xml.body;
	var bridgeappNS = "http://fujixerox.com/bridgeapp/scanjob";
	xml.addNSPrefix(bridgeappNS, "bridgeapp");
	var _loginNode 	= body.appendChild(xml.createElementNSwithText(bridgeappNS, "title", docName));
	xml.addNSDeclaration(bridgeappNS, true);
	env.appendChild(body);
	var soapMsg 	= xml.rootElement;
	return soapMsg;
}
/************************************************************
 * Get the invoke attach object
 *************************************************************/
function getInvokeAttach(docFormat){
	var invokeAttach 		= new JFLib.Invoke.Attach();
	invokeAttach.docFormat 	= docFormat;
	invokeAttach.enable 	= true;
	return invokeAttach;
}
/************************************************************
 * Get the job information from device
 *************************************************************/
function getJobInfo(){
	SSMILib.GetJobInfo(glbDeviceInfo.isDeviceAuth, glbInfo.jobId,"DeviceJobInformation");
}

// Copy JobMonitor
var CopyJobMonitor = (function(){
    var EVENT_NAME = "GetJob",
    	_jobFound,
    	_jobInfo,
    	_poolingCnt,
    	_poolingCntBackup = 0,
    	_poolingTerm = 400,
    	_isEventAttached,
    	_successCallback,
    	_errorCallback,
    	_timeoutCallback,
    	_cancelCallback,
    	_foundCallback,
    	_eventOrigin;

    return {
        init: function(term){
        	_init(term);
        },
        startMonitor : function(jobObj,cnt){
            _startMonitor(jobObj,cnt);
        },
        stopMonitor : function(jobObj){
            _stopMonitor(jobObj);
        },
        getJobInfo : function(uuid){
			//glbJobLogInfo.uuid = uuid;
        	_doPooling({uuid:uuid});
        }
    };

    function _init(term){
        _jobFound = false;
    	_isEventAttached = false;
    	_poolingTerm = term || 400;
        _attachEventHandler();
    }

    function _attachEventHandler(){
    	if(!_isEventAttached){
	        _isEventAttached = true;
			_eventOrigin = SSMILib.listener;
			SSMILib.listener = function(event, result, obj){
				if(!_onSSMIEvent(event, result, obj)){
					_eventOrigin(event, result, obj);
				}
			};
    	}
    }

    function _dettachEventHandler(){
    	if(_isEventAttached){
	        _isEventAttached = false;
			SSMILib.listener = _eventOrigin;
    	}
    }

    function _onSSMIEvent(event, result, obj){
    	var objCnt = 1;
    	if(event == EVENT_NAME){
			if((obj)&&(result)){
				if(!glbJobLogInfo.uuid){
					glbJobLogInfo.uuid = obj.JobID;
				}
				_poolingCnt = _poolingCntBackup;
				_jobFound = true;
				if(typeof obj.length == "number"){
					objCnt = obj.length;
				}
				for(var i=0; i<objCnt; i++){
					var tmpObj = (objCnt == 1)? obj : obj[i];
					switch(tmpObj.Status){
						case "canceled":
						case "canceledByUser":
						case "canceledBySystem":
						case "paused":
						case "unknown":
						//case "pending":
						case "terminating":
							_stopMonitor(obj);
							LogLib.write("[CS] IPrint Print job : " + tmpObj.JobID + ", " + tmpObj.Status, LogLib.LEVEL.WRN);
							//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
							//Common.doPrintRefundReq(tmpObj.Status);
							//Common.displayPrintRefundPopup(tmpObj.Status);
							glbNoticeInfo.type = NOTICE.WARN;
							glbNoticeInfo.message = Msg.NoticePopup.Msg_Other;
							PageManager.changePage(NoticePopup, PageManager.type.NORMAL);
							//currentPage = PageManager.getCurrentPage();
							return;
						default:
							break;
					}
				}

				setTimeout("CopyJobMonitor.getJobInfo()", _poolingTerm);

			}else{//잡 미발견
				if(_jobFound){//이전에 잡이 있었고 다시 잡 모니터링시 잡이 없는 경우 - 잡이 다 실시된 걸로 판단하여 잡 모니터링 중지
					LogLib.write("Job Monitoring Completed", LogLib.LEVEL.WRN);
					_successCallback();
					_stopMonitor();
					return;
				}

				_poolingCnt--;
				setTimeout("CopyJobMonitor.getJobInfo()", _poolingTerm);
			}
		}else{
			return false;
		}
	}

    function _startMonitor(jobObj, _cnt){
    	_jobFound 			= false;
    	_poolingCnt 		= _cnt || 10;
    	_poolingCntBackup 	= _cnt || 10;
    	_successCallback 	= jobObj.successCallback;
		_errorCallback 		= jobObj.errorCallback;
		_cancelCallback 	= jobObj.cancelCallback;
        _doPooling();
    }

    function _stopMonitor(){
    	_jobFound 			= false;
        _successCallback 	= null;
		_errorCallback 		= null;
		_cancelCallback 	= null;
	}

    function _doPooling(){
    	if(_poolingCnt > 0){
			if(!_jobInfo){
				_jobInfo 			= new SSMILib.JobInfo(null, true);
				_jobInfo.listType 	= SSMILib.JOBLISTTYPE.ACTIVE;
				_jobInfo.sortKeys 	= [{element : SSMILib.JOBDETAIL.STARTTIME, order : SSMILib.SORTORDER.ASC}];
			}
	        SSMILib.GetJob(_jobInfo);
		}else{
			LogLib.write("doPooing _poolingCnt 0", LogLib.LEVEL.WRN);
    		if(_errorCallback)_errorCallback();
			_stopMonitor();
    	}
    }
})();


function getOutTraySize(_size, _direction)
{
	_size = _size.toUpperCase();
	if(_size.indexOf("B4") != -1){
		_size = "B4";
	}
	var result = JFLib.MS.NOTSPEC;
	switch(_size){
		case "A4":
			if(_direction){
				if(_direction == "LEF"){
					result = JFLib.MS.A4LEF;
				}else{
					result = JFLib.MS.A4SEF;
				}
			}else{
				// SEF/LEF 혼용가능 용지
				result = JFLib.MS.NOTSPEC;
			}
			break;
		case "B5":
			if(_direction){
				if(_direction == "LEF"){
					result = JFLib.MS.B5LEF;
				}else{
					result = JFLib.MS.B5SEF;
				}
			}else{
				// SEF/LEF 혼용가능 용지
				result = JFLib.MS.NOTSPEC;
			}
			break;
		case "A3":
			// SEF Only 용지
			result = JFLib.MS.A3SEF;
			break;
		case "B4":
			// SEF Only 용지
			result = JFLib.MS.B4SEF;
			break;
	}

	return result;
}