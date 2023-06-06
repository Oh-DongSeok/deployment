/**
 * @fileoverview Scan Main Page
 * @author FBKR Oh Dongseok
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var ScanMainPage = new TemplatePage();

ScanMainPage.ID = "page_scan_main";

/**
 * 개별 페이지의 Data정의
 */
ScanMainPage._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id: "scan_setting_start_btn", 			type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_setting_start_btn", offImg: Img.PRINT_BTN_OFF, pressImg: Img.PRINT_BTN_PRESS, disableImg: Img.PRINT_BTN_DIS } }
		],
		imageList:[
		],
		textList:[
			{id:"scan_setting_src_duplex_label",	text:Msg.SCAN_MAIN_MENU.SRC_DUPLEX_LABEL	},
			{id:"scan_setting_color_label",			text:Msg.SCAN_MAIN_MENU.COLOR_LABEL			},
			{id:"scan_setting_dpi_label",			text:Msg.SCAN_MAIN_MENU.DPI_LABEL			},
			{id:"scan_setting_mag_label",			text:Msg.SCAN_MAIN_MENU.RATIO_LABEL			},
			{id:"lbl_scan_setting_start_btn", 		text:Msg.SCAN_MAIN_MENU.SCAN_START			},
			{id:"txt_scan_to_pc_setting", 			text:Msg.SCAN_MAIN_MENU.SCAN_PC_NUMBER		}
		]
	};
};

ScanMainPage._onPageChange = function(){
	initScanOptions();
	var msg = "";
	if(glbScanType == "usb"){
		msg = Msg.SCAN_TYPE_SELECT.TYPE_USB;
	}else{
		switch(glbScanPcIdx){
			case 0:
				msg = Msg.SCAN_TYPE_SELECT.TYPE_PC0;
				break;
			case 1:
				msg = Msg.SCAN_TYPE_SELECT.TYPE_PC1;
				break;
			case 2:
				msg = Msg.SCAN_TYPE_SELECT.TYPE_PC2;
				break;
			case 3:
				msg = Msg.SCAN_TYPE_SELECT.TYPE_PC3;
				break;
			case 4:
				msg = Msg.SCAN_TYPE_SELECT.TYPE_PC4;
				break;
		}
	}
	glbSelectPcIP = glbConfigData.SCAN_PC_IP[glbScanPcIdx];
	if(glbScanType != "usb"){
		if(glbConfigData.SCAN_PC_NAME[glbScanPcIdx] == ""){
			var saveInfo = Msg.SCAN_MAIN_MENU.SCAN_PC_NUMBER + msg;
		}else{
			var saveInfo = Msg.SCAN_MAIN_MENU.SCAN_PC_NUMBER + glbConfigData.SCAN_PC_NAME[glbScanPcIdx];
		}
	}else{
		var saveInfo = msg;
	}
	//Common.setText("txt_scan_to_pc_setting", saveInfo );
	this.updateDisplay();
	Common.setText("txt_scan_to_pc_setting", saveInfo );
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
ScanMainPage.updateDisplay = function(){
	var obj = document.getElementById(ScanMainPage.ID);
	obj.style.height = glbInfo.pageHeight.toString() + "px";
	obj.style.width = glbInfo.screenWidth.toString() + "px";
	if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("lyr_scan_main_wrapper", "left", "112px");
	}
	
	displayMediaScanSettingPage();
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
ScanMainPage.EventHandler = function(event, id)
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
 function displayMediaScanSettingPage(){
	 setScanPlexOptions();
	 setScanColorOptions();
	 setScanResOptions();
	 setScanMagOptions();
	 saveMediaScanSelection();
}
/************************************************************
 * Set the 2Sided/1Sided options for display in scan setting page
 *************************************************************/
 function setScanPaperOptions(){
	 var selElement = document.getElementById("scan_setting_output_size");
	 for(var i = 0; glbInfo.trayInfo.length > i; i++){
		 selElement.appendChild(createScanOptionElement(sizeCheck(glbInfo.trayInfo[i].MediumSize), glbInfo.trayInfo[i].MediumSize));
	 }
 }
/************************************************************
 * Set the 2Sided/1Sided options for display in scan setting page
 *************************************************************/
function setScanPlexOptions(){
	var selElement = document.getElementById("scan_setting_src_duplex");
	if(selElement.options.length == 0){
		for(var i=0, j=glbPlexOptions.length; i<j; i++){
			selElement.appendChild(createScanOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
			if(glbConfig.default_scan_plex==glbPlexOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.plex = i;
			}
		}
	} else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.plexIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.plexIndex;
	}

	var selSrcElement = document.getElementById("scan_setting_src_duplex");
	if(selSrcElement.options.length == 0){
		for(var i=0, j=glbPlexOptions.length; i<j; i++){
			selSrcElement.appendChild(createScanOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
			if(glbConfig.default_scan_plex==glbPlexOptions[i].value){
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
function setScanColorOptions(){
	var selElement = document.getElementById("scan_setting_color");
	if(selElement.options.length == 0){
		for (var i=0, j=glbColorModeOptions.length; i<j; i++){
			selElement.appendChild(createScanOptionElement(glbColorModeOptions[i].text, glbColorModeOptions[i].value));
			if(glbConfig.default_scan_color==glbColorModeOptions[i].value){
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
function setScanResOptions(){
	var selElement = document.getElementById("scan_setting_dpi");
	if(selElement.options.length == 0){
		for(var i=0, j=glbResOptions.length; i<j; i++){
			selElement.appendChild(createScanOptionElement(glbResOptions[i].text, glbResOptions[i].value));
			if(glbConfig.default_scan_res==glbResOptions[i].value){
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
function setScanMagOptions(){
	var selElement = document.getElementById("scan_setting_mag");
	if(selElement.options.length == 0){
		for(var i=0, j=glbMagOptions.length; i<j; i++){
			selElement.appendChild(createScanOptionElement(glbMagOptions[i].text, glbMagOptions[i].value));
			if(glbConfig.default_scan_mag==glbMagOptions[i].value){
				selElement.selectedIndex = i;
				glbSetting.scanDefaultIndex.mag = i;
			}
		}
	}else if(glbSetting.selectScanSettings && glbSetting.selectScanSettings.magIndex){
		selElement.selectedIndex = glbSetting.selectScanSettings.magIndex;
	}
}

/************************************************************
 * create the filer options
 *************************************************************/
 function createScanOptionElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

/************************************************************
 * Save scan settings select status
 *************************************************************/
function saveMediaScanSelection(){
	glbSetting.selectScanSettings.plexSrcIndex = document.getElementById("scan_setting_src_duplex").selectedIndex;
	//glbSetting.selectScanSettings.plexIndex = document.getElementById("scan_setting_duplex").selectedIndex;
	glbSetting.selectScanSettings.colorIndex = document.getElementById("scan_setting_color").selectedIndex;
	glbSetting.selectScanSettings.resIndex = document.getElementById("scan_setting_dpi").selectedIndex;
	glbSetting.selectScanSettings.magIndex = document.getElementById("scan_setting_mag").selectedIndex;
}

function doMediaScanJobStart(){
	saveMediaScanSelection();
	var scanOptions = {};
	glbScanDocName = getScanFileName();
	scanOptions.docName = glbScanDocName + ".pdf";
	scanOptions.plex = glbPlexOptions[glbSetting.selectScanSettings.plexSrcIndex].value;
	scanOptions.colorMode = glbColorModeOptions[glbSetting.selectScanSettings.colorIndex].value;
	scanOptions.docFormat = JFLib.DOCFORMAT.PDF;
	//getScanJobTemplate(scanOptions);
	scanOptions.resolution = glbResOptions[glbSetting.selectScanSettings.resIndex].value;
	scanOptions.magnification = glbMagOptions[glbSetting.selectScanSettings.magIndex].value;
	var jobTemplate = getScanJobTemplate(scanOptions);
	KISUtil.debug("GetCopyScanStart:", "startScanJob()");
	startScanJob(jobTemplate);
}

/************************************************************
 * Get the job template object
 *************************************************************/
function getScanJobTemplate(scanOptions){
	var jobTemplate = new JFLib.JobTemplate();
	jobTemplate.category = JFLib.JOBCATEGORY.SCAN;
	jobTemplate.name = "Billing Scan";
	jobTemplate.header.name = "Scan to MailBox";
	jobTemplate.header.description = ContentsLib.contentsId + " " + ContentsLib.contentsVersion;
	jobTemplate.header.identifier = "1";
	jobTemplate.process = JFLib.PROCESS.ABORT;
	jobTemplate.setInputProcess(getMediaScanObj(scanOptions));
	jobTemplate.addOutputProcess(getBoxObj());
	return jobTemplate;
}
/************************************************************
 * Get the invoke object
 *************************************************************/
function getBoxObj(scanOptions){
	var boxObj = new JFLib.Pbox();
	boxObj.boxNo = 200;
	boxObj.docName = glbScanDocName + ".pdf";
	//boxObj.docName = getScanFileName();
	return boxObj;
}
/************************************************************
 * Get the scan object
 *************************************************************/
function getMediaScanObj(scanOptions){
	var scanObj = new JFLib.Scan();
	scanObj.plex = scanOptions.plex;
	scanObj.colorMode = scanOptions.colorMode;
	scanObj.resolution = scanOptions.resolution;
	scanObj.magnification.x = scanOptions.magnification;
	scanObj.magnification.y = scanOptions.magnification;
	//scanObj.headposition = JFLib.HP.LEFT;
	return scanObj;
}
/************************************************************
 * Function to start scan job
 *************************************************************/
function startScanJob(jobTemplate){
	gComm = new WebServiceLib.Communicator();
	gComm.successHandler = onScanJobSuccess;
	gComm.errorHandler = onScanJobError;
	gComm.callJobExecService(jobTemplate, gHost);
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
						title = glbTexts["TOO_MANY_JOBS"].TITLE;
						message = glbTexts["TOO_MANY_JOBS"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
						break;
					case "flt:AuditronLimitExceeded":
						title = glbTexts["AUDITRON_LIMIT_EXCEEDED"].TITLE;
						message = glbTexts["AUDITRON_LIMIT_EXCEEDED"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
						break;
					case "flt:ServiceLimitReached":
						title = glbTexts["SERVICE_LIMIT_REACHED"].TITLE;
						message = glbTexts["SERVICE_LIMIT_REACHED"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
						break;
					case "flt:ScanAheadRestriction":
						title = glbTexts["SCAN_AHEAD_RESTRICTION"].TITLE;
						message = glbTexts["SCAN_AHEAD_RESTRICTION"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
						break;
					case "flt:PagePrintLimitExceeded":
						title = glbTexts["PAGE_PRINT_LIMIT_EXCEEDED"].TITLE;
						message = glbTexts["PAGE_PRINT_LIMIT_EXCEEDED"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
						break;
					case "flt:AccessoryError":
						title = glbTexts["ACCESSORY_ERROR"].TITLE;
						message = glbTexts["ACCESSORY_ERROR"].MSG;
						popup_type = POPUP_TYPE.ALERT;
						yellow_popup = true;
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
	var target = userObj.clientid;
	// domain은 사용하지 않는 것으로 제거함.
	//if(userObj.domain && userObj.domain != "")
	//	target = target + "." + userObj.domain;
	target = target+":"+userObj.port;
	var url = HTTP_PROTOCOL + target + "/bridgeapp/quickscan/settings";
	var ws = new WebServiceLib.Communicator();
	ws.async = true;
	ws.method = 'POST';
	ws.successHandler = onGetQuickScanInfoSuccess;
	ws.errorHandler = onGetQuickScanInfoError;
	ws.timeoutHandler = onGetQuickScanInfoError;
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
	var invokeProfile = new JFLib.Invoke.Profile();
	var target = HTTP_PROTOCOL + glbSetting.selectUser.clientid;
	//if(glbSetting.selectUser.domain && glbSetting.selectUser.domain != "")
	//	target = target + "." + glbSetting.selectUser.domain;
	target = target+":"+glbSetting.selectUser.port+ "/bridgeapp/scan/scanjob";
	//target = "http://10.97.1.98:9001/api/interface/Scan";
	invokeProfile.target = target;
	return invokeProfile;
}
/************************************************************
 * Get the invoke request object
 *************************************************************/
function getInvokeRequestObj(scanOptions){
	var invokeRequest = new JFLib.Invoke.Request();
	invokeRequest.attach = getInvokeAttach(scanOptions.docFormat);
	invokeRequest.messageBody = getMessageBody(scanOptions.docName);
	invokeRequest.timeOut = 300;
	return invokeRequest;
}
/************************************************************
 * Get the message body
 *************************************************************/
function getMessageBody(docName){
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
/************************************************************
 * Get the invoke attach object
 *************************************************************/
function getInvokeAttach(docFormat){
	var invokeAttach = new JFLib.Invoke.Attach();
	invokeAttach.docFormat = docFormat;
	invokeAttach.enable = true;
	return invokeAttach;
}
/************************************************************
 * Get the job information from device
 *************************************************************/
function getJobInfo(){
	SSMILib.GetJobInfo(glbDeviceInfo.isDeviceAuth, glbInfo.jobId,"DeviceJobInformation");
}
