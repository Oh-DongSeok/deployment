/**
 * @fileoverview Fax Main Page
 * @author FBKR Oh Dongseok
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
 var FaxMainPage = new TemplatePage();

 FaxMainPage.ID = "page_fax_main";
 
 /**
  * 개별 페이지의 Data정의
  */
  FaxMainPage._initModel=function()
 {
    this._data=
    {
        buttonList:[
            {id: "fax_setting_start_btn", 			type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_fax_setting_start_btn", offImg: Img.PRINT_BTN_OFF, pressImg: Img.PRINT_BTN_PRESS, disableImg: Img.PRINT_BTN_DIS } }
        ],
        imageList:[
        ],
        textList:[
            {id:"faxarea_input_label",  	        text:Msg.FAX_MAIN_MENU.AREA_CODE  	        },
            {id:"faxnumber_input_label",	        text:Msg.FAX_MAIN_MENU.FAX_NUMBER   	    },
            {id:"faxnumber_input_info",	            text:Msg.FAX_MAIN_MENU.FAX_NUMBER_INFO 	    },
            {id:"faxnumber_input_info2",	        text:"" 	                                },
            {id:"fax_setting_src_duplex_label",	    text:Msg.FAX_MAIN_MENU.SRC_DUPLEX_LABEL	    },
            {id:"fax_setting_dpi_label",			text:Msg.FAX_MAIN_MENU.DPI_LABEL			},
            {id:"fax_setting_color_label",			text:Msg.FAX_MAIN_MENU.DOC_TYPE	    		},
            {id:"lbl_fax_setting_start_btn", 		text:Msg.FAX_MAIN_MENU.SCAN_START			}
        ]
    };
};

 
FaxMainPage._onPageChange = function(){
    initFaxOptions();
    createSoftKeypadHtml();
    initSoftKeypadData();
    this.updateDisplay();
};

 
 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
 FaxMainPage.updateDisplay = function(){
    var obj = document.getElementById("page_fax_main");
	obj.style.height = glbInfo.pageHeight.toString() + "px";
    obj.style.width = glbInfo.screenWidth.toString() + "px";
    if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("lyr_fax_main_wrapper", "left", "112px");
	}
    displayMediaFaxSettingPage();
    var objInput = document.getElementById("tbx_faxnumber_input");
    //objInput.focus();
 };
 
 /**
  * 개별 페이지의 Event처리
  * @param {string} event : Event종류
  * @param {string} id : Event발생원
  */
FaxMainPage.EventHandler = function()
{
    document.getElementById("tbx_faxnumber_input").value = "";
    Common.setText("faxnumber_input_info2", Msg.FAX_MAIN_MENU.FAX_NUMBER_INFO2 + ")");
};

 
 /************************************************************
  * Display the fax setting page
  *************************************************************/
function displayMediaFaxSettingPage(){
    setFaxAreaCodeOptions();
    setFaxPlexOptions();
    setFaxResOptions();
    setFaxColorOptions();
    saveFaxScanSelection();
}
/**
 * Soft core keypad용 HTML Tag생성
 */
function createSoftKeypadHtml()
{
    var softKeypad = document.getElementById("soft_core_keypad");
	// 숫자키
	for(var i=0; i<10; i++){
		var numKey = document.createElement("div");
		numKey.setAttribute("id", "btn_num_key" + i);
		numKey.setAttribute("class", "btn");
		_img = document.createElement("img");
		_img.setAttribute("id", "img_num_key" + i);
		_img.setAttribute("class", "img");
		numKey.appendChild(_img);
		softKeypad.appendChild(numKey);
	}

    // * 키(Clear)
	var mulKey = document.createElement("div");
	mulKey.setAttribute("id", "btn_mul_key");
	mulKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_mul_key");
	_img.setAttribute("class", "img");
	mulKey.appendChild(_img);
	softKeypad.appendChild(mulKey); 

	// # 키(Backspace)
	var sharpKey = document.createElement("div");
	sharpKey.setAttribute("id", "btn_sharp_key");
	sharpKey.setAttribute("class", "btn");
	_img = document.createElement("img");
	_img.setAttribute("id", "img_sharp_key");
	_img.setAttribute("class", "img");
	sharpKey.appendChild(_img);
	softKeypad.appendChild(sharpKey); 

}
function initSoftKeypadData()
{
	var attr = {};
	for(var i=0; i<10; i++){
		attr.targetImgId = "img_num_key" + i;
		attr.offImg = "./image/btn_num_key" + i + "_off.png";
		attr.pressImg = Img.BTN_SCK_NUM_PRESS;
		WidgetLib.registerButtonWidgetById("btn_num_key"+i, WidgetLib.ButtonType.NORMAL, attr);
	}
	
	attr = {targetImgId:"img_mul_key", offImg:Img.BTN_SCK_MUL_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_mul_key", WidgetLib.ButtonType.NORMAL, attr);
	attr = {targetImgId:"img_sharp_key", offImg:Img.BTN_SCK_SHARP_OFF, pressImg:Img.BTN_SCK_NUM_PRESS};
	WidgetLib.registerButtonWidgetById("btn_sharp_key", WidgetLib.ButtonType.NORMAL, attr);

	
}
function setFaxAreaCodeOptions(){
    var selElement = document.getElementById("tbx_faxarea_input");
    if(selElement.options.length == 0){
        for(var i=0, j=glbFaxAreaCodeOption.length; i<j; i++){
            selElement.appendChild(createScanOptionElement(glbFaxAreaCodeOption[i].text, glbFaxAreaCodeOption[i].value));
            if(glbConfigData.SERVICE.DEFAULT_FAX_AREA_CODE == glbFaxAreaCodeOption[i].value){
                selElement.selectedIndex = i;
                glbSetting.faxDefaultIndex.areaCode = i;
            }
        }
    }
}
 /************************************************************
  * Set the 2Sided/1Sided options for display in fax setting page (원고 양단면)
  *************************************************************/
 function setFaxPlexOptions(){
     var selElement = document.getElementById("fax_setting_src_duplex");
     if(selElement.options.length == 0){
         for(var i=0, j=glbPlexOptions.length; i<j; i++){
             selElement.appendChild(createScanOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
             if(glbConfig.default_fax_plex==glbPlexOptions[i].value){
                 selElement.selectedIndex = i;
                 glbSetting.faxDefaultIndex.plex = i;
             }
         }
     } else if(glbSetting.selectFaxSettings && glbSetting.selectFaxSettings.plexIndex){
         selElement.selectedIndex = glbSetting.selectFaxSettings.plexIndex;
     }
 
     var selSrcElement = document.getElementById("fax_setting_src_duplex");
     if(selSrcElement.options.length == 0){
         for(var i=0, j=glbPlexOptions.length; i<j; i++){
             selSrcElement.appendChild(createScanOptionElement(glbPlexOptions[i].text, glbPlexOptions[i].value));
             if(glbConfig.default_fax_plex==glbPlexOptions[i].value){
                 selSrcElement.selectedIndex = i;
                 glbSetting.faxDefaultIndex.plex = i;
             }
         }
     } else if(glbSetting.selectFaxSettings && glbSetting.selectFaxSettings.plexIndex){
         selSrcElement.selectedIndex = glbSetting.selectFaxSettings.plexIndex;
     }
 
 }

 /************************************************************
  * Set the resolution options for display in fax setting page
  *************************************************************/
 function setFaxResOptions(){
     var selElement = document.getElementById("fax_setting_dpi");
     if(selElement.options.length == 0){
         for(var i=0, j=glbResOptions.length; i<j; i++){
             selElement.appendChild(createScanOptionElement(glbResOptions[i].text, glbResOptions[i].value));
             if(glbConfig.default_fax_res==glbResOptions[i].value){
                 selElement.selectedIndex = i;
                 glbSetting.faxDefaultIndex.res = i;
             }
         }
     }else if(glbSetting.selectFaxSettings && glbSetting.selectFaxSettings.resIndex){
         selElement.selectedIndex = glbSetting.selectFaxSettings.resIndex;
     }
 }
 /************************************************************
 * Set the color mode options for display in scan setting page
 *************************************************************/
function setFaxColorOptions(){
	var selElement = document.getElementById("fax_setting_color");
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
  * create the filer options
  *************************************************************/
  function createFaxOptionElement(text, value){
     var optElement =  document.createElement("option");
     optElement.setAttribute("value", value);
     optElement.appendChild(document.createTextNode(text))
     return optElement;
 }
 
 /************************************************************
  * Save scan settings select status
  *************************************************************/
function saveFaxScanSelection(){
    glbSetting.selectFaxSettings.areaCodeIndex  = document.getElementById("tbx_faxarea_input").selectedIndex;
    glbSetting.FaxNumber                       = glbInfo.faxNumber;
    glbSetting.selectFaxSettings.plexSrcIndex  = document.getElementById("fax_setting_src_duplex").selectedIndex;
    glbSetting.selectFaxSettings.resIndex      = document.getElementById("fax_setting_dpi").selectedIndex;
    glbSetting.selectFaxSettings.colorIndex    = document.getElementById("fax_setting_color").selectedIndex;
}
 
function doFaxScanJobStart(){
    saveFaxScanSelection();
    var faxOptions             = {};
    glbFaxDocName              = getFaxFileName();
    faxOptions.docName         = glbFaxDocName + ".tif";
    faxOptions.plex            = glbPlexOptions[glbSetting.selectFaxSettings.plexSrcIndex].value;
    //faxOptions.colorMode     = JFLib.CM.BW;
    faxOptions.colorMode       = glbColorModeOptions[glbSetting.selectFaxSettings.colorIndex].value;
    faxOptions.docFormat       = JFLib.DOCFORMAT.TIFF_MULTI;
    //faxOptions.headposition  = JFLib.HP.LEFT;
    faxOptions.resolution      = glbResOptions[glbSetting.selectFaxSettings.resIndex].value;
    faxOptions.magnification   = JFLib.MAG.FIX100;
    var jobTemplate            = getFaxJobTemplate(faxOptions);
    startFaxJob(jobTemplate);
}

 
 /************************************************************
  * Get the job template object
  *************************************************************/
 function getFaxJobTemplate(faxOptions){
     var jobTemplate = new JFLib.JobTemplate();
     jobTemplate.category = JFLib.JOBCATEGORY.SCAN;
     jobTemplate.name = "Billing Fax";
     jobTemplate.header.name = "Fax to MailBox";
     jobTemplate.header.description = ContentsLib.contentsId + " " + ContentsLib.contentsVersion;
     jobTemplate.header.identifier = "1";
     jobTemplate.process = JFLib.PROCESS.ABORT;
     jobTemplate.setInputProcess(getMediaFaxObj(faxOptions));
     jobTemplate.addOutputProcess(getBoxFaxJobObj());
     return jobTemplate;
 }
 /************************************************************
  * Get the invoke object
  *************************************************************/
 function getBoxFaxJobObj(faxOptions){
     var boxObj = new JFLib.Pbox();
     boxObj.boxNo = 200;
     boxObj.docName = glbFaxDocName + ".tif";
     //boxObj.docName = getScanFileName();
     return boxObj;
 }
 /************************************************************
  * Get the scan object
  *************************************************************/
 function getMediaFaxObj(faxOptions){
     var scanObj = new JFLib.Scan();
     scanObj.plex = faxOptions.plex;
     scanObj.colorMode = faxOptions.colorMode;
     scanObj.resolution = faxOptions.resolution;
     scanObj.magnification.x = faxOptions.magnification;
     scanObj.magnification.y = faxOptions.magnification;
     //scanObj.outputMedium.size = JFLib.MS.A4LEF;
     //scanObj.headposition = JFLib.HP.LEFT;
     return scanObj;
 }
 /************************************************************
  * Function to start Fax job
  *************************************************************/
 function startFaxJob(jobTemplate){
     gComm = new WebServiceLib.Communicator();
     gComm.successHandler = onFaxJobSuccess;
     gComm.errorHandler = onFaxJobError;
     gComm.callJobExecService(jobTemplate, gHost);
 }
 /************************************************************
  * Success event for starting Fax job
  *************************************************************/
 function onFaxJobSuccess(res){
     var jobId = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/03/ssm/management/job",'JobID')[0].firstChild.nodeValue;
     if(jobId){
         glbInfo.jobId = jobId;
         //goToPage(SCREEN_LIST.SCAN_STATUS_PAGE);
         clearInterval(glbInterval);
         glbInterval = setInterval('getJobInfo()', 2000);
     }
 }
 /************************************************************
  * Error event for starting Fax job
  *************************************************************/
 function onFaxJobError(res){
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
 function getQuickFaxInfo(userObj){
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
 function onGetQuickFaxInfoSuccess(res){
     var obj = res.responseText;
     SSMILib.onEvent("GetQuickScanInfo", true, obj);
     return;
 }
 /************************************************************
  * Error event for getting the user information from client
  *************************************************************/
 function onGetQuickFaxInfoError(res){
     var obj = res;
     SSMILib.onEvent("GetQuickScanInfo", false, obj);
     return;
 }
 /************************************************************
  * Timeout event for getting the user information from client
  *************************************************************/
 function onGetQuickFaxInfoTimeout(){
     SSMILib.onEvent("GetQuickScanInfo", false, null);
     return;
 }
 
 /************************************************************
  * Get the job information from device
  *************************************************************/
 function getFaxJobInfo(){
     SSMILib.GetJobInfo(glbDeviceInfo.isDeviceAuth, glbInfo.jobId,"DeviceJobInformation");
 }
 

 function doBoxFaxJobStart(){
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
	jobTemplate.name = "Billing Fax";
	//지시서명
	jobTemplate.header.name = "Fax Server to MailBox";

    var scanOptions = {};
    scanOptions.docName = glbFaxDocName;
    scanOptions.docFormat = JFLib.DOCFORMAT.TIFF_MULTI;

	jobTemplate.setInputProcess(createMailboxObj());
	jobTemplate.addOutputProcess(getInvokeObj(scanOptions));

	var exeJfsObj = new SSMILib.ExecuteJFS(jobTemplate);
	exeJfsObj.boxesInfo = boxesInfo;

	glbJobLog.DeviceJobInformation.JobType = "";

	SSMILib.RemoteAccess.Interceptor = function (type, resp, arg){
		return arg;
	};

	SSMILib.ExecuteJFS.Send(exeJfsObj);
 }

 /************************************************************
 * Get the invoke object
 *************************************************************/
function getInvokeObj(scanOptions){
	var invokeObj = new JFLib.Invoke();
	invokeObj.profile = getInvokeProfileObj();
	invokeObj.request = getInvokeRequestObj(scanOptions);
	return invokeObj;
}

/************************************************************
 * Get the invoke profile object
 *************************************************************/
 function getInvokeProfileObj(){
    // http://gwebfax.faxbiz.co.kr/cloudAction.do?process=cloudSendFax
	var invokeProfile = new JFLib.Invoke.Profile();
	var target = FAX_SERVER;
	invokeProfile.target = target;
	return invokeProfile;
}

/************************************************************
 * Get the invoke request object
 *************************************************************/
 function getInvokeRequestObj(scanOptions){
	var invokeRequest = new JFLib.Invoke.Request();
	invokeRequest.attach = getInvokeAttach(scanOptions.docFormat);
	invokeRequest.messageBody = getMessageBody(getFaxFileName());
    //var test = "{\"machineid\":\"fxkissec\",\"receivenb\":\"023108666\",\"jobid\":\"testId\"}";
    //invokeRequest.messageBody = getMessageBody(test);
	invokeRequest.timeOut = 300;
	return invokeRequest;
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