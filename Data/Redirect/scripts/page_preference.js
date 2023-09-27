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
			{id: "btn_PF_setting_cancel", 	type: WidgetLib.ButtonType.NORMAL}
		],
		imageList:[
		],
		textList:[
		]
	};
};
//Css 보정 (TODO 이후 언어별 css파일로 관리필요)
PreferencePage.cssChange = function()
{
    document.getElementById("lyr_PF_wrapper").style.height = glbInfo.screenHeight.toString() + "px";
	document.getElementById("lyr_PF_wrapper").style.width = glbInfo.screenWidth.toString() + "px";
}
PreferencePage._onPageChange = function(){
	KISUtil.debug("Preference Page:","excute");
	initDataTypeOption();
	this.cssChange();
	this.updateDisplay();
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
PreferencePage.updateDisplay = function(){
	var selElement = document.getElementById("type_use_setting");
	for(var i=0, j=glbDataTypeOption.length; i<j; i++){
		if(glbConfigData.DATA_TYPE == glbDataTypeOption[i].value){
			selElement.selectedIndex = i;
		}
	}
	document.getElementById("view_time_setting").selectedIndex 		= glbConfigData.VIEW_TIME;
	document.getElementById("view_change_setting").selectedIndex 	= glbConfigData.VIEW_CHANGE - 1;
	document.getElementById("view_mode_setting").selectedIndex 		= glbConfigData.VIEW_MODE - 1;
	document.getElementById("txt_PF_html_url").value	= glbConfigData.HTML_URL;
	document.getElementById("txt_PF_img1").value 		= glbConfigData.IMG_URL[0];
	document.getElementById("txt_PF_img2").value 		= glbConfigData.IMG_URL[1];
	document.getElementById("txt_PF_img3").value 		= glbConfigData.IMG_URL[2];
	document.getElementById("txt_PF_img4").value 		= glbConfigData.IMG_URL[3];
	document.getElementById("txt_PF_img5").value 		= glbConfigData.IMG_URL[4];
};


function set_content_to_data(){
	glbConfigData.TITLE_NAME 	= glbConfigData.TITLE_NAME;
	glbConfigData.DATA_TYPE 	= document.getElementById("type_use_setting").value;
	glbConfigData.VIEW_CHANGE 	= document.getElementById("view_change_setting").value;
	glbConfigData.VIEW_TIME 	= document.getElementById("view_time_setting").value;
	glbConfigData.VIEW_MODE 	= document.getElementById("view_mode_setting").value;
	glbConfigData.HTML_URL 		= document.getElementById("txt_PF_html_url").value;
	glbConfigData.IMG_URL[0] 	= document.getElementById("txt_PF_img1").value;
	glbConfigData.IMG_URL[1] 	= document.getElementById("txt_PF_img2").value;
	glbConfigData.IMG_URL[2] 	= document.getElementById("txt_PF_img3").value;
	glbConfigData.IMG_URL[3] 	= document.getElementById("txt_PF_img4").value;
	glbConfigData.IMG_URL[4] 	= document.getElementById("txt_PF_img5").value;

	var temp 	= "var DATA = " + JSON.stringify(glbConfigData);
	var temp 	= temp.replace('"TITLE_NAME"', 'TITLE_NAME');
	var temp 	= temp.replace('"DATA_TYPE"', 'DATA_TYPE');
	var temp 	= temp.replace('"VIEW_CHANGE"', 'VIEW_CHANGE');
	var temp 	= temp.replace('"VIEW_TIME"', 'VIEW_TIME');
	var temp 	= temp.replace('"VIEW_MODE"', 'VIEW_MODE');
	var temp 	= temp.replace('"HTML_URL"', 'HTML_URL');
	var result	= temp.replace('"IMG_URL"', 'IMG_URL');
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
	alert("저장되었습니다.");
}

saveSetting = function(){
	var content = set_content_to_data();
	save_content_to_file(content, ".data/data.js");
}
cancelSetting = function(){
	BrowserExt.SetScreenChange("menuto:native_menu");
}