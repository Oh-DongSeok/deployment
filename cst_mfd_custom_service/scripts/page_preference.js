/**
 * @fileoverview Preference Page
 * @author FBKR Oh Dongseok
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var PreferencePage = new TemplatePage();
PreferencePage.ID = "page_preference";

/**
 * 개별 페이지의 Data정의
 */
PreferencePage._initModel=function()
{
	this._data=
	{
		buttonList:[
			{id: "btn_PF_setting_save", 	type: WidgetLib.ButtonType.NORMAL},
			{id: "btn_PF_setting_cancel", 	type: WidgetLib.ButtonType.NORMAL},
			{id: "btn_PF_mfd_home", 		type: WidgetLib.ButtonType.NORMAL},
			{id: "btn_PF_find_scan_pc", 	type: WidgetLib.ButtonType.NORMAL}
		],
		imageList:[
		],
		textList:[
			{id:"tit_PF_title",     		text:Msg.PreferencePage.LBL_Title},
			{id:"lbl_PF_bar_title",			text:Msg.PreferencePage.LBL_BAR_TITLE},
			{id:"lbl_PF_server_url",    	text:Msg.PreferencePage.LBL_SERVER_URL},
			{id:"lbl_PF_service_scan",  		text:Msg.PreferencePage.LBL_CHECK_SCAN},
			{id:"lbl_PF_service_native_scan",  	text:Msg.PreferencePage.LBL_NATIVE_SCAN},
			{id:"lbl_PF_service_fax",   		text:Msg.PreferencePage.LBL_CHECK_FAX},
			{id:"lbl_PF_service_native_fax",   	text:Msg.PreferencePage.LBL_NATIVE_FAX},
			{id:"lbl_PF_scan_type_setting",   	text:Msg.PreferencePage.LBL_SCAN_TYPE},
			{id:"lbl_PF_charge_mode",   	    text:Msg.PreferencePage.LBL_CHARGE_MODE},
			{id:"lbl_PF_charge_url",   	    	text:Msg.PreferencePage.LBL_CHARGE_URL}
		]
	};
};
//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
PreferencePage.cssChange = function()
{
    document.getElementById(PreferencePage.ID).style.height = glbInfo.pageHeight.toString() + "px";
	if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		document.getElementById(PreferencePage.ID).style.width = glbInfo.screenWidth.toString() + "px";
		document.getElementById("btn_PF_setting_save").style.left = "809px";
		document.getElementById("btn_PF_setting_cancel").style.left = "914px";
	}
}
PreferencePage._onPageChange = function(){
	KISUtil.debug("Preference Page:","excute");
	initScanUsedOption();
	initFaxUsedOption();
	initScanNativeOption();
	initFaxNativeOption();
	initChargeModeOption();
	initScanTypeSetOption();
	this.cssChange();
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
PreferencePage.updateDisplay = function(){
	document.getElementById("tbx_PF_server_url").value = glbConfigData.SERVER_URL;
	document.getElementById("tbx_PF_bar_title").value = glbConfigData.BAR_TITLE;
	document.getElementById("tbx_PF_charge_url").value = glbConfigData.CHARGE_MODE.CHARGE_URL;

	setScanUsedOptions();
	setFaxUsedOptions();
	setScanType();
	setChargeMode();
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
PreferencePage.EventHandler = function(event, id)
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
 * Scan 사용여부 메뉴
 *************************************************************/
function setScanUsedOptions(){
	var selElement = document.getElementById("scan_use_setting");
	if(selElement.options.length == 0){
		for(var i=0, j=glbScanUsedOption.length; i<j; i++){
			selElement.appendChild(createScanUsedOptionElement(glbScanUsedOption[i].text, glbScanUsedOption[i].value));
			if(glbConfigData.SERVICE.SCAN == glbScanUsedOption[i].value){
				selElement.selectedIndex = i;
			}
		}
	}

	var selElement2 = document.getElementById("scan_native_setting");
	if(selElement2.options.length == 0){
		for(var i=0, j=glbScanNativeOption.length; i<j; i++){
			selElement2.appendChild(createScanUsedOptionElement(glbScanNativeOption[i].text, glbScanNativeOption[i].value));
			if(glbConfigData.SERVICE.NATIVE_SCAN == glbScanNativeOption[i].value){
				selElement2.selectedIndex = i;
			}
		}
	}
}

/************************************************************
 * create the filer options
 *************************************************************/
 function createScanUsedOptionElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

/************************************************************
 * Fax 사용여부 메뉴
 *************************************************************/
function setFaxUsedOptions(){
	var selElement = document.getElementById("fax_use_setting");
	if(selElement.options.length == 0){
		for(var i=0, j=glbFaxUsedOption.length; i<j; i++){
			selElement.appendChild(createFaxUsedOptionElement(glbFaxUsedOption[i].text, glbFaxUsedOption[i].value));
			if(glbConfigData.SERVICE.FAX == glbFaxUsedOption[i].value){
				selElement.selectedIndex = i;
			}
		}
	}

	var selElement2 = document.getElementById("fax_native_setting");
	if(selElement2.options.length == 0){
		for(var i=0, j=glbFaxNativeOption.length; i<j; i++){
			selElement2.appendChild(createFaxUsedOptionElement(glbFaxNativeOption[i].text, glbFaxNativeOption[i].value));
			if(glbConfigData.SERVICE.NATIVE_FAX == glbFaxNativeOption[i].value){
				selElement2.selectedIndex = i;
			}
		}
	}

}
/************************************************************
 * create the filer options
 *************************************************************/
 function createFaxUsedOptionElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

/************************************************************
 * 카드 단말기 선택 메뉴
 *************************************************************/
 function setChargeMode(){
	var selElement = document.getElementById("select_PF_charge_mode");
	if(selElement.options.length == 0){
		for(var i=0, j=glbChargeMode.length; i<j; i++){
			selElement.appendChild(createChargeModeElement(glbChargeMode[i].text, glbChargeMode[i].value));
			if(glbConfigData.CHARGE_MODE.CHARGE_TYPE == glbChargeMode[i].value){
				selElement.selectedIndex = i;
			}
		}
	}
}

/************************************************************
 * create the filer options
 *************************************************************/
 function createChargeModeElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

/************************************************************
 * Scan Type 선택 메뉴
 *************************************************************/
 function setScanType(){
	var selElement = document.getElementById("select_scan_type_setting");
	if(selElement.options.length == 0){
		for(var i=0, j=glbScanTypeOption.length; i<j; i++){
			selElement.appendChild(createScanTypeElement(glbScanTypeOption[i].text, glbScanTypeOption[i].value));
			if(glbConfigData.SERVICE.SCAN_TYPE == glbScanTypeOption[i].value){
				selElement.selectedIndex = i;
			}
		}
	}
}

/************************************************************
 * Scan Type create the filer options
 *************************************************************/
 function createScanTypeElement(text, value){
	var optElement =  document.createElement("option");
	optElement.setAttribute("value", value);
	optElement.appendChild(document.createTextNode(text))
	return optElement;
}

function chk_content_to_option(){
	var result = true;
	Common.setText("msg_PF_fax_set_fail", "");
	Common.setText("msg_PF_scan_set_fail", "");
	if(document.getElementById("fax_use_setting").value == "true"){
		if(document.getElementById("fax_native_setting").value != "unused"){
			// 동시사용 불가 메시지
			Common.setText("msg_PF_fax_set_fail", Msg.PreferencePage.MSG_SETTING_FAIL);
			result = false;
		}
	}
	if(document.getElementById("scan_use_setting").value == "true"){
		if(document.getElementById("scan_native_setting").value != "unused"){
			// 동시사용 불가 메시지
			Common.setText("msg_PF_scan_set_fail", Msg.PreferencePage.MSG_SETTING_FAIL);
			if(result){
				result = false;
			}
		}
	}

	return result;
}

function set_content_to_data(){
	glbConfigData.BAR_TITLE = document.getElementById("tbx_PF_bar_title").value;
	if(document.getElementById("fax_use_setting").value == "true"){
		glbConfigData.SERVICE.FAX = true;
	}else{
		glbConfigData.SERVICE.FAX = false;
		glbConfigData.SERVICE.NATIVE_FAX = document.getElementById("fax_native_setting").value; 
	}
	if(document.getElementById("scan_use_setting").value == "true"){
		glbConfigData.SERVICE.SCAN = true;
	}else{
		glbConfigData.SERVICE.SCAN = false;
		glbConfigData.SERVICE.NATIVE_SCAN = document.getElementById("scan_native_setting").value;
	}
	glbConfigData.SERVER_URL = document.getElementById("tbx_PF_server_url").value;
	glbConfigData.CHARGE_MODE.CHARGE_TYPE = document.getElementById("select_PF_charge_mode").value;
	glbConfigData.CHARGE_MODE.CHARGE_URL = document.getElementById("tbx_PF_charge_url").value;
	glbConfigData.SERVICE.SCAN_TYPE = document.getElementById("select_scan_type_setting").value;

	if(glbScanPcSet){
		for(var i = 0; i < 5;i++){
			glbConfigData.SCAN_PC_IP[i] = document.getElementById("tbx_PF2_pc_ip"+i.toString()).value;
			glbConfigData.SCAN_PC_NAME[i] = document.getElementById("tbx_PF2_pc_name"+i.toString()).value;
		}
	}

	var temp = "var DATA = " + JSON.stringify(glbConfigData);
	var temp = temp.replace('"DEFAULT_CHECK"', 'DEFAULT_CHECK');
	var temp = temp.replace('"BAR_TITLE"', 'BAR_TITLE');
	var temp = temp.replace('"TITLE_NAME"', 'TITLE_NAME');
	var temp = temp.replace('"SERVER_URL"', 'SERVER_URL');
	var temp = temp.replace('"SERVICE"', 'SERVICE');
	var temp = temp.replace('"SCAN"', 'SCAN');
	var temp = temp.replace('"FAX"', 'FAX');
	var temp = temp.replace('"NATIVE_SCAN"', 'NATIVE_SCAN');
	var temp = temp.replace('"NATIVE_FAX"', 'NATIVE_FAX');
	var temp = temp.replace('"SCAN_TYPE"', 'SCAN_TYPE');
	var temp = temp.replace('"CHARGE_MODE"', 'CHARGE_MODE');
	var temp = temp.replace('"CHARGE_TYPE"', 'CHARGE_TYPE');
	var temp = temp.replace('"CHARGE_URL"', 'CHARGE_URL');
	var temp = temp.replace('"LOGIN_INFO"', 'LOGIN_INFO');
	var temp = temp.replace('"ID"', 'ID');
	var temp = temp.replace('"PASSWORD"', 'PASSWORD');
	var temp = temp.replace('"COUNTER"', 'COUNTER');
	var temp = temp.replace('"SCAN_PC_IP"', 'SCAN_PC_IP');
	var temp = temp.replace('"SCAN_PC_NAME"', 'SCAN_PC_NAME');
	var temp = temp.replace('"false"', 'false');
	var temp = temp.replace('"true"', 'true');
	var result = temp.replace('"TIMEOUTS"', 'TIMEOUTS');
	return result;
}

/**************************************************************
 * @contents set data in config folder
 * @public
 * @return
 * @Lang EN
 **************************************************************/
function save_content_to_file(content, filename){
	KISUtil.debug("save_content_to_file/"+content, filename);
	//if(flg_Dummy_Beep) return; //개발중엔 동작하지 않도록
    var httpRequest = createXMLHttpRequest();
    httpRequest.open("PUT", filename, true);
    httpRequest.onreadystatechange = onReadyStateChangeEventHandler();
    httpRequest.send(content);
}
