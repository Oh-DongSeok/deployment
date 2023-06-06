/**
 * @fileoverview : Data정의
 * @author FXK Dongseok Oh
 * @version 1.0.0
 */
var gProtocol 				= "http://";
SSMILib.protocol 			= "http://";
var HTTP_PROTOCOL 			= "http://";
var CLIENT_PORT 			= "9200";
var FAX_SERVER 				= ""; // fax server주소
var FAX_SCAN_ADD 			= ":9090/bridgeapp/scan/ScanJob";
var CONFIG_DATA_FILE_NAME 	= "./data/data.js";
// Job Type Constant
var JOB_TYPE = {
	PRINT	: 0,
	COPY	: 1,
	SCAN	: 2,
	FAX		: 3,
	ETC		: 4
};

// Unit price type check Constant
var UNIT_PRICE_TYPE = {
	PRINT	: "Print",
	COPY	: "Copy",
	SCAN	: "Scan",
	FAX		: "Fax"
};

// Scan Type
var SCAN_TYPE_CHECK = {
	USB 	: "u",
	PC  	: "p",
	USB_PC 	: "up"
}

// 과금관련 Constant
var NO_PRICE 	= 0;	// 무료과금.
var IN_USED 	= 1;	// 과금 테이블 Status
var RESPONSE 	= {
	ID		: 0,	// event id
	STATUS	: 1,	// 상태정보 위치
	DATA	: 2		// DATA 위치
};
var COUNT_INIT 		= 0;
var TRAY_FULL 		= 4;
var SERVICE_COUNT 	= 2;
var TIMEOUT_1MIN 	= 6000;
var STS_SUCCESS 	= "success";

// Notice Constant
var NOTICE = {
	INFO 		: 0,
	WARN 		: 1,
	FAIL 		: 2,
	FAX_INFO 	: 3,
};

var gComm 			= null;
var jobSelecter 	= JOB_TYPE.PRINT;
var priceZero 		= false;
var chkTrayInfo 	= false;
var glbConfigData 	= {
	DEFAULT_CHECK	: DATA.DEFAULT_CHECK,
	BAR_TITLE		: DATA.BAR_TITLE,
	TITLE_NAME		: DATA.TITLE_NAME,
	SERVER_URL		: DATA.SERVER_URL,
	SERVICE			: DATA.SERVICE,
	CHARGE_MODE   	:{
		CHARGE_TYPE	: DATA.CHARGE_MODE.CHARGE_TYPE,	// RELAY, EXCLUSIVE
		CHARGE_URL 	: DATA.CHARGE_MODE.CHARGE_URL
	},
	LOGIN_INFO:{
		ID			: DATA.LOGIN_INFO.ID,
		PASSWORD	: DATA.LOGIN_INFO.PASSWORD,
		COUNTER		: DATA.LOGIN_INFO.COUNTER,
		TIMEOUTS 	: DATA.LOGIN_INFO.TIMEOUTS
	},
	SCAN_PC_IP 		: DATA.SCAN_PC_IP,
	SCAN_PC_NAME 	: DATA.SCAN_PC_NAME
};
var glbInterval;
var jobInfo 			= {};
var jobList 			= {};
var glbBillingTable 	= {};
var glbConfig 			= {};
var glbInfo 			= {};
var glbDeviceInfo 		= {};
var glbPlexOptions 		= {};
var glbColorModeOptions = {};
var glbResOptions 		= [];
var glbMagOptions 		= [];
var glbSetting 			= {};
var glbJobLog 			= {};
var glbStatusConfig 	= {};
var glbNoticeInfo 		= {};
var glbMediaChkCnt 		= 100;
var glbScanDocName 		= "";
var glbScanUsedOption 	= [];
var glbFaxUsedOption 	= [];
var glbScanNativeOption = [];
var glbFaxNativeOption 	= [];
var glbScanTypeOption 	= [];
var glbFaxAreaCodeOption= [];
var glbChargeMode 		= [];
var glbJobLogInfo 		= {};
var glbScanType 		= "usb";
var glbScanPcIdx 		= 0;
var glbSelectPcIP 		= "";
var glbSubNet 			= "";
var glbSelectPcCnt 		= 0;
var glbSelectPcName 	= [];
var glbSerchPcCnt 		= 0;
var glbSerchLimit 		= 0;
var glbScanPcSet 		= false;
var glbPriceRes 		= [];

var MAG_OPTION = {
	MIN		: "30.0",
	MAG100	: "100.0",
	MAG61	: "61.1",
	MAG70	: "70.7",
	MAG81	: "81.6",
	MAG86	: "86.6",
	MAG115	: "115.4",
	MAG122	: "122.5",
	MAG141	: "141.4",
	MAG200	: "200.0",
	MAX		: "400.0",
	MANUAL	: "Manual"
}

function initInfo()
{
	// MFD Status config
	glbStatusConfig.root={
		name 						: "",
		Vendor						: "",
		VendorURL					: "",
		ServiceIdentifier			: "",
		Version						: "",
		SSLStatus					: "",
		SSLPort						: "",
		SSLKeyType					: "",
		SSMIVersion					: "",
		SJFIVersion					: ""
	};
	glbStatusConfig.productInformation={
		serialNumber				: "",
		productCode					: "",
		familyCode					: "",
		DocumentRawFormatVersion	: "",
		GenerationNumber			: "",
		ProviderAssetNumber			: "",
		CustomerAssetNumber			: ""
	};
	glbStatusConfig.systemInformation={
		Name						: "",
		Contact						: "",
		Location					: "",
		Locale						: "",
		DateTime					: "",
		Comment						: "",
		DaylightSavingOffset		: "",
		DaylightSavingStart			: "",
		DaylightSavingEnd			: ""
	};
	glbStatusConfig.status={
		Message						: "",
		Message2					: "",
		Message3					: "",
	};
	glbStatusConfig.serviceCollection={
		Count						: "",
	};
	//Notice 정보용
	glbNoticeInfo.type 			= "",
	glbNoticeInfo.title 		= "",

	//image
	glbInfo.Img					= {};

	//복합기의 호스트명
	glbInfo.hostName			= "";

	glbInfo.isJobExcuted 		= false;

	glbDeviceInfo.duplex 		= true;
	glbDeviceInfo.colorMode 	= "color";
	glbDeviceInfo.resolution 	= 600;

	// fax qr code default
	glbInfo.faxQRCodeUrl		= "";
	glbInfo.color 				= [];
	//glbInfo.color.Index=["B","C"];
	glbInfo.color[0] = {
		key			: "B",
		text 		: Msg.FILELIST.FILE_LIST_BTN_COLOR_MODE_BW_MSG,
		iconOff		: Img.ICN_PS_CM_GRAY_OFF,
		value		: JFLib.CM.BW
	};
	glbInfo.color[1] = {
		key			: "C",
		text 		: Msg.FILELIST.FILE_LIST_BTN_COLOR_MODE_AUTO_MSG,
		iconOff		: Img.ICN_PS_CM_COLOR_OFF,
		value		: JFLib.CM.AUTO
	};
	glbInfo.color[2] = {
		key			: "G",
		text 		: Msg.FILELIST.FILE_LIST_BTN_COLOR_MODE_GRAYSCALE_MSG,
		iconOff		: Img.ICN_PS_CM_GRAY_OFF,
		value		: JFLib.CM.GRAY
	}
	//Nup/Outplex추가
	glbInfo.outPlex = [];
	glbInfo.outPlex[0] = {//Simplex
		text 		: Msg.FILELIST.FILE_LIST_BTN_OUTPUT_SIMPLEX
	};
	glbInfo.outPlex[1] = {//Duplex
		text 		: Msg.FILELIST.FILE_LIST_BTN_OUTPUT_DUPLEX
	};
	glbInfo.outPlex[2] = {//Tumble
		text 		: Msg.FILELIST.FILE_LIST_BTN_OUTPUT_TUMBLE
	};
	glbInfo.MS = [];
	//glbInfo.plex.Index=["S","DL","DS"];
	glbInfo.MS[0] = {
		key			: "A4",
		text		: Msg.FILELIST.FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG,
		value		: JFLib.MS.A4LEF
	};
	glbInfo.MS[1] = {
		key			: "A3",
		text		: Msg.FILELIST.FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG,
		value		: JFLib.MS.A3SEF
	};
	/******************************************/
	glbInfo.docList = [];

	initSetting();
	initScanDefault();
}

/**
 * 화면 표시와 관련된 Flag를 재초기화 한다.
 * @return
 */
function resetInfo()
{
	glbInfo.popupType 			= "";
	glbInfo.currentFLPage 		= 1;
	glbInfo.totalFLPage 		= 0;
	glbInfo.printCompletedNum 	= 0;
	glbInfo.trayInfo 			= [];
	glbInfo.trayCount 			= 0;
	glbInfo.docList 			= [];
	glbInfo.authMode 			= "";
	glbInfo.AuditronMode 		= "";
	glbInfo.PRINTER_IP 			= "";
	glbInfo.screenType 			= "";
	glbInfo.screenWidth 		= 800;
	glbInfo.screenHeight 		= 480;
	glbInfo.pageHeight 			= 440;
	glbInfo.setLanguage 		= "ko";
	glbInfo.faxNumber 			= "";
}
/************************************************************
 * Initialize service settings
 *************************************************************/
function initSetting(){
	glbSetting.selectUser 			= null;
	glbSetting.selectUserList 		= new Array();
	glbSetting.selectClientList 	= new Array();
	glbSetting.selectUserNum 		= 0;
	glbSetting.selectClientNum 		= 0;
	glbSetting.selectFilter 		= ".";
	glbSetting.selectFileList 		= new Array();
	glbSetting.inputClientId 		= "";
	glbSetting.selectScanSettings 	= {};
	glbSetting.selectFaxSettings 	= {};
	glbSetting.scanDefaultIndex 	= {};
	glbSetting.faxDefaultIndex 		= {};
	glbSetting.FaxNumber 			= "";
}
/************************************************************
 * Initialize scan settings select status
 *************************************************************/
function initScanDefault(){
	glbSetting.selectScanSettings.plexSrcIndex 	= glbSetting.scanDefaultIndex.plex;
	glbSetting.selectScanSettings.plexIndex 	= glbSetting.scanDefaultIndex.plex;
	glbSetting.selectScanSettings.colorIndex 	= glbSetting.scanDefaultIndex.color;
	glbSetting.selectScanSettings.magIndex 		= glbSetting.scanDefaultIndex.mag;
	glbSetting.selectScanSettings.resIndex 		= glbSetting.scanDefaultIndex.res;
	glbSetting.selectScanSettings.formatIndex 	= glbSetting.scanDefaultIndex.format;
}

/************************************************************
 * Initialize fax settings select status
 *************************************************************/
 function initFaxDefault(){
	glbSetting.selectFaxSettings.plexSrcIndex 	= glbSetting.faxDefaultIndex.plex;
	glbSetting.selectFaxSettings.plexIndex 		= glbSetting.faxDefaultIndex.plex;
	glbSetting.selectFaxSettings.colorIndex 	= glbSetting.faxDefaultIndex.color;
	glbSetting.selectFaxSettings.magIndex 		= glbSetting.faxDefaultIndex.mag;
	glbSetting.selectFaxSettings.resIndex 		= glbSetting.faxDefaultIndex.res;
	glbSetting.selectFaxSettings.formatIndex 	= glbSetting.faxDefaultIndex.format;
}

/**
 * 페이지로 사용되는 Data의 격납용 Class
 */
var DataSet = function()
{
	//userInfo
	this.userInfo 		= {};
	//doclist
	this.docList 		= null;
	//selectedDoc
	this.selectedDoc 	= {};
	//printSetting
	this.userPolicyInfo = {};
};

/************************************************************
 * Initialize scan options
 *************************************************************/
 function initScanOptions(){
	initPlexOptions();
	initColorModeOptions();
	initResOptions();
	initMagOptions();
}

/************************************************************
 * Initialize fax options
 *************************************************************/
 function initFaxOptions(){
	initFaxAreaCodeOption();
	initPlexOptions();
	initColorModeOptions();
	initResOptions();
	initMagOptions();
}

/************************************************************
 * Initialize 2Sided/1Sided options
 * Based on the device supported duplex information
 *************************************************************/
function initPlexOptions(){
	if(glbDeviceInfo.duplex){
		glbPlexOptions = [
			{ "text" : Msg.COPY_MAIN_MENU.PLEX_OPTION_SIM, "value" : JFLib.PLEX.SIMPLEX},
			{ "text" : Msg.COPY_MAIN_MENU.PLEX_OPTION_DUP, "value" : JFLib.PLEX.DUPLEX},
			{ "text" : Msg.COPY_MAIN_MENU.PLEX_OPTION_TUM, "value" : JFLib.PLEX.TUMBLE}
		];
	} else {
		glbPlexOptions = [
			{ "text" : Msg.COPY_MAIN_MENU.PLEX_OPTION_SIM, "value" : JFLib.PLEX.SIMPLEX}
		];
	}
}
/************************************************************
 * Initialize color mode options
 * Based on the device supported color mode information
 *************************************************************/
function initColorModeOptions(){
	if(!glbDeviceInfo.colorMode || glbDeviceInfo.colorMode=="color"){
		if(jobSelecter == JOB_TYPE.SCAN){
			glbColorModeOptions = [
				{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_COLOR,		"value" : JFLib.CM.COLOR},
				{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_GRAY, 		"value" : JFLib.CM.GRAY	},
				{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_BW, 		"value" : JFLib.CM.BW	}
			];
		}else{
			if(jobSelecter != JOB_TYPE.FAX){
				glbColorModeOptions = [
					// 흑백이 우선되도록 변경
					{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_BW, 	"value" : JFLib.CM.BW	},
					{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_GRAY, 	"value" : JFLib.CM.GRAY	},
					{ "text" : Msg.COPY_MAIN_MENU.CM_OPTION_COLOR, 	"value" : JFLib.CM.COLOR}
				];
			}else{
				glbColorModeOptions = [
					{"text": Msg.FAX_MAIN_MENU.CM_OPTION_BW, 		"value" : JFLib.CM.BW},
					{"text": Msg.FAX_MAIN_MENU.CM_OPTION_GRAY, 		"value" : JFLib.CM.GRAY}
				];
			}
		}
	} else {
		if(jobSelecter == JOB_TYPE.SCAN){
			glbColorModeOptions = [
				{"text": Msg.COPY_MAIN_MENU.CM_OPTION_COLOR, 		"value" : JFLib.CM.COLOR},
				{"text": Msg.COPY_MAIN_MENU.CM_OPTION_GRAY, 		"value" : JFLib.CM.GRAY},
				{"text": Msg.COPY_MAIN_MENU.CM_OPTION_BW, 			"value" : JFLib.CM.BW}
			];
		}else{
			if(jobSelecter != JOB_TYPE.FAX){
				glbColorModeOptions = [
					{"text": Msg.COPY_MAIN_MENU.CM_OPTION_BW, 		"value" : JFLib.CM.BW},
					{"text": Msg.COPY_MAIN_MENU.CM_OPTION_GRAY, 	"value" : JFLib.CM.GRAY}
				];
			}else{
				glbColorModeOptions = [
					{"text": Msg.FAX_MAIN_MENU.CM_OPTION_BW, 		"value" : JFLib.CM.BW},
					{"text": Msg.FAX_MAIN_MENU.CM_OPTION_GRAY, 		"value" : JFLib.CM.GRAY}
				];
			}
		}
	}
}
/************************************************************
 * Initialize resolution options
 * Based on the device supported resolution information
 *************************************************************/
function initResOptions(){
	if(glbDeviceInfo.resolution){
		if(glbDeviceInfo.resolution>=200){
			glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R200, "value": JFLib.RES.R200});
		}
		if(glbDeviceInfo.resolution>=300){
			glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R300, "value": JFLib.RES.R300});
		}
		if(glbDeviceInfo.resolution>=400){
			glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R400, "value" : JFLib.RES.R400});
		}
		if(glbDeviceInfo.resolution>=600){
			glbResOptions.push({"text":Msg.COPY_MAIN_MENU.RES_OPTION_R600, "value" : JFLib.RES.R600});
		}
	} else {
		glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R200, "value": JFLib.RES.R200});
		glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R300, "value": JFLib.RES.R300});
		glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R400, "value": JFLib.RES.R400});
		glbResOptions.push({"text": Msg.COPY_MAIN_MENU.RES_OPTION_R600, "value": JFLib.RES.R600});
	}
}
/************************************************************
 * Initialize magnification options
 *************************************************************/
function initMagOptions(){
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_100, 	"value": MAG_OPTION.MAG100});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_61, 	"value": MAG_OPTION.MAG61});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_70, 	"value": MAG_OPTION.MAG70});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_81, 	"value": MAG_OPTION.MAG81});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_86, 	"value": MAG_OPTION.MAG86});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_115, 	"value": MAG_OPTION.MAG115});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_122, 	"value": MAG_OPTION.MAG122});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_141, 	"value": MAG_OPTION.MAG141});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_OPTION_200, 	"value": MAG_OPTION.MAG200});
	glbMagOptions.push({"text": Msg.COPY_MAIN_MENU.MAG_MANUAL, 		"value": MAG_OPTION.MANUAL});
}

function initScanUsedOption(){
	glbScanUsedOption.push({"text": Msg.PreferencePage.SELECT_UNUSED, 	"value": false});
	glbScanUsedOption.push({"text": Msg.PreferencePage.SELECT_USED, 	"value": true});
}

function initScanNativeOption(){
	glbScanNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_SCAN_OPT0, "value": "unused"});
	glbScanNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_SCAN_OPT1, "value": "scan_pc"});
	glbScanNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_SCAN_OPT2, "value": "scan_mbox"});
	glbScanNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_SCAN_OPT3, "value": "scan_email"});
}

function initFaxUsedOption(){
	glbFaxUsedOption.push({"text": Msg.PreferencePage.SELECT_UNUSED, "value": false});
	glbFaxUsedOption.push({"text": Msg.PreferencePage.SELECT_USED, "value": true});
}

function initFaxNativeOption(){
	glbFaxNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_FAX_OPT0, "value": "unused"});
	glbFaxNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_FAX_OPT1, "value": "fax"});
	glbFaxNativeOption.push({"text": Msg.PreferencePage.SELECT_NATIVE_FAX_OPT2, "value": "fax_easy"});
}

function initChargeModeOption(){
	glbChargeMode.push({"text": Msg.PreferencePage.SELECT_TECHREADER, "value": "techreader"});
	glbChargeMode.push({"text": Msg.PreferencePage.SELECT_JWORKS, "value": "jetwork"});
}

function initScanTypeSetOption(){
	glbScanTypeOption.push({"text": Msg.PreferencePage.SELECT_SCAN_TYPE_OPT0, "value": SCAN_TYPE_CHECK.USB});
	glbScanTypeOption.push({"text": Msg.PreferencePage.SELECT_SCAN_TYPE_OPT1, "value": SCAN_TYPE_CHECK.PC});
	glbScanTypeOption.push({"text": Msg.PreferencePage.SELECT_SCAN_TYPE_OPT2, "value": SCAN_TYPE_CHECK.USB_PC});
}
function initFaxAreaCodeOption(){
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[0],  "value": Msg.FAX_AREA_CODE.AREA_CODE[0] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[1],  "value": Msg.FAX_AREA_CODE.AREA_CODE[1] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[2],  "value": Msg.FAX_AREA_CODE.AREA_CODE[2] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[3],  "value": Msg.FAX_AREA_CODE.AREA_CODE[3] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[4],  "value": Msg.FAX_AREA_CODE.AREA_CODE[4] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[5],  "value": Msg.FAX_AREA_CODE.AREA_CODE[5] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[6],  "value": Msg.FAX_AREA_CODE.AREA_CODE[6] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[7],  "value": Msg.FAX_AREA_CODE.AREA_CODE[7] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[8],  "value": Msg.FAX_AREA_CODE.AREA_CODE[8] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[9],  "value": Msg.FAX_AREA_CODE.AREA_CODE[9] });
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[10], "value": Msg.FAX_AREA_CODE.AREA_CODE[10]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[11], "value": Msg.FAX_AREA_CODE.AREA_CODE[11]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[12], "value": Msg.FAX_AREA_CODE.AREA_CODE[12]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[13], "value": Msg.FAX_AREA_CODE.AREA_CODE[13]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[14], "value": Msg.FAX_AREA_CODE.AREA_CODE[14]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[15], "value": Msg.FAX_AREA_CODE.AREA_CODE[15]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[16], "value": Msg.FAX_AREA_CODE.AREA_CODE[16]});
	glbFaxAreaCodeOption.push({"text": Msg.FAX_AREA_CODE.AREA_NAME[17], "value": Msg.FAX_AREA_CODE.AREA_CODE[17]});
}