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
	document.getElementById("btn_position_setting").selectedIndex 	= glbConfigData.BTN_POSITION - 1;
	document.getElementById("txt_PF_html_url").value	= glbConfigData.HTML_URL;
	document.getElementById("txt_PF_img1").value 		= glbConfigData.IMG_URL[0];
	document.getElementById("txt_PF_img2").value 		= glbConfigData.IMG_URL[1];
	document.getElementById("txt_PF_img3").value 		= glbConfigData.IMG_URL[2];
	document.getElementById("txt_PF_img4").value 		= glbConfigData.IMG_URL[3];
	document.getElementById("txt_PF_img5").value 		= glbConfigData.IMG_URL[4];
	document.getElementById("txt_PF_server_url").value 	= glbConfigData.SERVER_URL;
};


function set_content_to_data(){
	glbConfigData.TITLE_NAME 	= glbConfigData.TITLE_NAME;
	glbConfigData.DATA_TYPE 	= document.getElementById("type_use_setting").value;
	glbConfigData.VIEW_CHANGE 	= document.getElementById("view_change_setting").value;
	glbConfigData.VIEW_TIME 	= document.getElementById("view_time_setting").value;
	glbConfigData.BTN_POSITION 	= document.getElementById("btn_position_setting").value;
	glbConfigData.HTML_URL 		= document.getElementById("txt_PF_html_url").value;
	glbConfigData.IMG_URL[0] 	= document.getElementById("txt_PF_img1").value;
	glbConfigData.IMG_URL[1] 	= document.getElementById("txt_PF_img2").value;
	glbConfigData.IMG_URL[2] 	= document.getElementById("txt_PF_img3").value;
	glbConfigData.IMG_URL[3] 	= document.getElementById("txt_PF_img4").value;
	glbConfigData.IMG_URL[4] 	= document.getElementById("txt_PF_img5").value;
	glbConfigData.SERVER_URL 	= document.getElementById("txt_PF_server_url").value;

	var temp 	= "var DATA = " + JSON.stringify(glbConfigData);
	var temp 	= temp.replace('"TITLE_NAME"', 'TITLE_NAME');
	var temp 	= temp.replace('"DATA_TYPE"', 'DATA_TYPE');
	var temp 	= temp.replace('"VIEW_CHANGE"', 'VIEW_CHANGE');
	var temp 	= temp.replace('"VIEW_TIME"', 'VIEW_TIME');
	var temp 	= temp.replace('"BTN_POSITION"', 'BTN_POSITION');
	var temp 	= temp.replace('"HTML_URL"', 'HTML_URL');
	var temp	= temp.replace('"SERVER_URL"', 'SERVER_URL');
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
    var httpRequest = createXMLHttpRequest();
    httpRequest.open("PUT", filename, true);
    httpRequest.onreadystatechange = onReadyStateChangeEventHandler["setData"];
    httpRequest.send(content);
}
saveSetting = function(){
	var mode = document.getElementById("view_change_setting").value;
	if(mode == "server"){
		var serverUrl = document.getElementById("txt_PF_server_url").value;
		if(serverUrl == ""){
			alert("서버 주소를 입력해주세요.");
		}else{
			dataSetting(serverUrl);
			alert("data 설정 완료");
		}		
	}else{
		var content = set_content_to_data();
		setData(content);
		alert("저장되었습니다.");
	}
}
cancelSetting = function(){
	BrowserExt.SetScreenChange("menuto:native_menu");
}
function dataSetting(url){
	var xhr 		= new XMLHttpRequest();
	var setScript 	= "";
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState === xhr.DONE) {
			if (xhr.status === 200 || xhr.status === 201) {
				setScript = xhr.responseText;
				setData(setScript);
			} else {
				alert("data 설정 오류");
			}
		}
	};
	xhr.open('GET', url, true);
	xhr.send();
}

function setData(data){
	var filepath = "./data/data.js";
	var httpRequest = createXMLHttpRequest();
	httpRequest.open("PUT", filepath, true);
	httpRequest.onreadystatechange = onReadyStateChangeEventHandler["setData"];
	httpRequest.send(data);
}
var onReadyStateChangeEventHandler = {
	setData:function(){
		if (this.readyState == 4){
			if (this.status == 200){
				
			} else{
				alert("data.js 설정 오류");
			}
		}else{
			
		}
	}
};