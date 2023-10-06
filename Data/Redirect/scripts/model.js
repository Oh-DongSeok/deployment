/**
 * @fileoverview : Data정의
 * @author FXK Dongseok Oh
 * @version 1.0.0
 */
var gProtocol 				= "http://";
var CONFIG_DATA_FILE_NAME 	= "./data/data.js";
var PREFERENCE_PASSWORD 	= "6789"

var glbConfigData 	= {
	TITLE_NAME		: DATA.TITLE_NAME,
	DATA_TYPE		: DATA.DATA_TYPE,
	VIEW_CHANGE		: DATA.VIEW_CHANGE,
	VIEW_TIME		: DATA.VIEW_TIME,
	VIEW_MODE		: DATA.VIEW_MODE,
	HTML_URL 		: DATA.HTML_URL,
	IMG_URL 		: DATA.IMG_URL,
	SERVER_URL		: DATA.SERVER_URL
};
var glbInterval;
var glbConfig 			= {};
var glbInfo 			= {};
var glbDataTypeOption   = [];
var glbimgList 			= [];
var glbImageCnt 		= 0;
var glbCount 			= 0;

function initInfo()
{
	
}
/**
 * Server 주소 취득
 * @return string
 */
function getServerUrl()
{
	// address : "http://192.168.0.100:9001/"
	var temp = glbConfigData.SERVER_URL.split("/");
	var address = temp[2].split(":");
	var url = "ftp://" + address[0] + "/";
	return url;
}
/**
 * 화면 표시와 관련된 Flag를 재초기화 한다.
 * @return
 */
function resetInfo()
{

}
/************************************************************
 * Initialize service settings
 *************************************************************/
function initSetting(){
}


function initDataTypeOption(){
	glbDataTypeOption.push({"text": "HTML", 	"value": "html"});
	glbDataTypeOption.push({"text": "IMAGE", 	"value": "img"});
}