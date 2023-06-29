/**
 * @fileoverview : Data정의
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var glbInfo = {};					//설정치 참조용 Data
var glbDevInfo = {permitInfo:["1","1","1"]};				//유저 정보 격납처
var glbConfig = {};					//조정 가능 항목의 격납처
var glbDataSet = null;				//Scan 에 사용되는 설정정보의 전역 Data

/**********************************************************************************/

var gProtocol = "http://";
SSMILib.protocol = "http://";

var glbSetting = {};

var glbPrtQuantity = {//부수의 최대치, 최소치
	Min	: 1,
	Max	: 9999
};

var CON_TIMEOUT = {//서버연결시간 
	Min : 5,
	Max : 999,
	Default : 10
};

var SORT_TYPE = {
	NONE:0,
	ASC:1,
	DESC:2
};

/**
 * ユーザの色別使用権限確認用
 * -仕様変更対応(V1.5.0)
 */
var PERMIT_CHK ={
	FULL_COLOR		: 0,
	LIMITED_COLOR	: 1,
	BW				: 2
};

/**
 * ユーザの色別使用権限の種類
 * -仕様変更対応(V1.5.0)
 */
var CMType ={
	All				: 0,
	Color			: 1,
	BNW				: 2,
	None			: 3
};

var SERVICE_CODE = {
	USER:"user",
	COPY_PRICE:"copyPrice",
	COPY_CHARGE:"copyCharge",
	PRINT:"print",
	PRINT_CHARGE:"printCharge",
	PRINT_CANCEL:"printCancel",
	SCAN:"scan",
	FAX:"fax",
	PRINT_REFUND : "printRefund" //2016.09.01 FXKIS CHONE 프린트 환불 처리
};
//과금 결제방식 선택 (직과금/i-Money결제방식/선결제)
var PAYMENT_METHOD = {
	CREDIT:"typeA",
	CYBER_MONEY:"typeB",
	PREPAID:"typeC"	
};
var PRINT_JOB_TYPE = {
	PRINT:"1",
	CANCEL:"2"
};
var glbChargeInit = {
	"service":'',
	"selectedJobSeq":[],
	"paymentMethods":'', 
	"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};
var glbJobCancelInit = {
	"service":'',
	"selectedJobSeq":[],
	"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};
var PAYMENT_TYPE = {
	BEFORE : "before",
	AFTER : "after"
};
var THANK_SCREEN_STATE = {
	DAY					:	"DAY",
	EVENING				:	"EVENING",
	NIGHT				:	"NIGHT"
};
var DOC_PRINT_TIMEOUT = 1000*glbConfig.TIMEOUT;//문서출력후 Response받을 때 가지의 설정 시간
var MAX_GET_STORED_DOCUMENT = 100;//RemoteHost + 문서 99건
var MAX_ASYN = 3; //PDL정보 취득, 유저 정보 취득, PrintCapavility정보 취득 비동기 처리 판별
var MAX_ASYN_JOB = 3; //JobTicket생성, TCPIP정보 취득, 초기 표시언어 취득의 비동기 처리 판별

var OWNER_CHK = {
	USER_ID			: 1,
	IC_CARD_ID		: 2,
	RELATED_USER_ID	: 4,
	SUB_USER_ID		: 8,
};

var PERMIT_CHK ={
	FULL_COLOR		: 0,
	LIMITED_COLOR	: 1,
	BW				: 2,
};

//연결 TimeOut시간
var ACCESS_TIMEOUT = {
	MIN	:	5,
	MAX	:	999
};

//Port 번호
var PORT_NUMBER = {
	MIN	:	1,
	MAX	:	65535
};

var PRINTABLE_VALID_TYPE = {none : 0, info : 1, alert : 2};

//메뉴페이지 즉시/선택인쇄버튼 초기치 관련 정의
var DEFAULT_PRN_BTN_TYPES = {
	PROMPT : "prompt",
	SELECT : "select",
	NONE : "none",
	LAST : "last"
};
var AUTH_DATA_OPTION_LOC = "./config/auth.js";
var PRINT_DATA_OPTION_LOC = "./config/last.js";
var PREFERENCE_DATA_LOC = "./config/data.js";

//유저 제한 정보
var NO_PRINT = "0";		// Print금지
var YES_PRINT = "1";	// Print가능
var NONE_ACCESS = "2";	// 관련 기능 없음

var glbPrintBtnStatus = false;
var glbMpsPrintBtnStatus = false;

var glbPrintListInit = {
	"service":'',
	"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};

//2017.02.02 FXKIS 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
glbInfo.refundCount = 0;
var MAX_REFUND_COUNT = 10;

/**
 * 화면 표시와 관련된 Flag를 재초기화 한다.
 * @return
 */
function resetInfo()
{
	glbInfo.popupType = "";
	glbInfo.currentFLPage = 1;
	glbInfo.totalFLPage = 0;
	glbInfo.printCompletedNum = 0;
	glbInfo.deletedFileNum = 0;
	glbInfo.changePrtQuantity = false;
	glbInfo.hardKeyInput = false;
	glbInfo.isLoading = false;
	glbDevInfo.docList = [];
}

/**
 * User의 제한 정보를 취득
 */
function getUserPermitInfo()
{
	//var glbDevInfo = {permitInfo:["1","1","1"]};
	//return;
	var tempInfo = (flg_Dummy_Beep)? "111,111,111,111": document.EwbClass.getPermitInfo();
	
	glbDevInfo.permitInfo = [];
	glbDevInfo.permitInfo[PERMIT_CHK.FULL_COLOR] = tempInfo.slice(4,5);
	glbDevInfo.permitInfo[PERMIT_CHK.LIMITED_COLOR] = tempInfo.slice(5,6);
	glbDevInfo.permitInfo[PERMIT_CHK.BW] = tempInfo.slice(6,7);
}

/**
 * Print금지 유저를 확인
 */
function getPrintPermitInfo()
{
	var isEnable = true;
	if(( glbDevInfo.permitInfo[PERMIT_CHK.FULL_COLOR] == NO_PRINT )&&(glbDevInfo.permitInfo[PERMIT_CHK.LIMITED_COLOR] == NO_PRINT )&&( glbDevInfo.permitInfo[PERMIT_CHK.BW] == NO_PRINT )){
		isEnable = false;
	}
	return isEnable;
}

/**
 * Devece의 보안 설정정보 취득(Port정보)
 */
function getHostAddress(host)
{
	var resultHost;
	if(host == gHost){
		//子機의 설정값을 반환한다.
		resultHost = gHost;
	}else{
		//親機의 설정값을 반환한다.
		for(var i=0;i<glbConfig.devices.length;i++){
			if(glbConfig.devices[i] == host){
				resultHost = glbConfig.devices[i];
			}
		}
	}
	return resultHost;
}
/**********************************************************************************/

/**
 * Data의 초기화를 한다.
 */
function initModel()
{
	initConfig();
	initInfo();
	initObject();
}

/**
 * 조정가능 항목의 초기화(미사용)
 */
function initConfig()
{
	glbConfig.Mode = {};
	glbConfig.isSHA = CONFIG.isSHA||false;
	glbConfig.TITLE_NAME = CONFIG.TITLE_NAME;
	if(CONFIG.PRINTER_IP) glbConfig.PRINTER_IP = CONFIG.PRINTER_IP;
	glbConfig.COLOR_SUPPORT = CONFIG.COLOR_SUPPORT;
	glbConfig.ENABLE_DOC_DELETE = CONFIG.ENABLE_DOC_DELETE;
	glbConfig.ENABLE_DOC_PRINT_SET = CONFIG.ENABLE_DOC_PRINT_SET;
	glbConfig.ADMIN_USABLE = CONFIG.ADMIN_USABLE;
	glbConfig.isSortingDocNoForPrint = (typeof CONFIG.PRINT_DOCNO_SORT == "undefined")? "":CONFIG.PRINT_DOCNO_SORT;
	glbConfig.docListSortType = SORT_TYPE[CONFIG.DOC_LIST_SORT]||SORT_TYPE.NONE;

	glbConfig.JobRunTimeout = null;
	glbConfig.JobRunPageDisplayDistance = CONFIG.JOB_RUN_PAGE_DISPLAY_DISTANCE||3000;
	glbConfig.paymentType = CONFIG.PAYMENT_TYPE||PAYMENT_TYPE.BEFORE; //선결제 후결제 방식결정
	glbConfig.campaignImg = [];
	for(i in CONFIG.ENV.CAMPAIGN_IMG){
		glbConfig.campaignImg.push(CONFIG.ENV.CAMPAIGN_IMG[i]);
	}
	glbConfig.nup = CONFIG.FUNCTION_CHECK.NUP||false;
	glbConfig.outPlex = CONFIG.FUNCTION_CHECK.OUTPLEX||false;

	//2016.09.01 프린트 환불 처리
	glbConfig.GetJob = {term : CONFIG.ENV.COUNTER.GETJOB_DELAY, count : CONFIG.ENV.COUNTER.GETJOB_COUNT};
}

/**
 * Contents가 취급하는 Data의 초기화
 */
function initInfo()
{	
	//image
	glbInfo.Img={};

	//슬라이드 팝업 메시지 표시시간
	glbInfo.MSG_TIMEOUT_LENGTH=7000;

	//복합기의 호스트명
	glbInfo.hostName="";
	
	//유저명 표시 사이즈(전각：2/반각：1)
	glbInfo.userNameLength = 14;

	glbInfo.userInfo = null;
	
	glbInfo.isJobExcuted = false;
	
	glbInfo.color = [];
	//glbInfo.color.Index=["B","C"];
	glbInfo.color[0] = {
		key			: "B",
		text 		: Msg.Page.FILELIST.FILE_LIST_BTN_COLOR_MODE_BW_MSG,
		iconOff		: Img.ICN_PS_CM_GRAY_OFF,
		value		: JFLib.CM.BW
	};
	glbInfo.color[1] = {
		key			: "C",
		text 		: Msg.Page.FILELIST.FILE_LIST_BTN_COLOR_MODE_AUTO_MSG,
		iconOff		: Img.ICN_PS_CM_COLOR_OFF,
		value		: JFLib.CM.AUTO
	};
	//Nup/Outplex추가
	glbInfo.outPlex = [];
	glbInfo.outPlex[0] = {//Simplex
		text 		: Msg.Page.FILELIST.FILE_LIST_BTN_OUTPUT_SIMPLEX
	};
	glbInfo.outPlex[1] = {//Duplex
		text 		: Msg.Page.FILELIST.FILE_LIST_BTN_OUTPUT_DUPLEX
	};
	glbInfo.outPlex[2] = {//Tumble
		text 		: Msg.Page.FILELIST.FILE_LIST_BTN_OUTPUT_TUMBLE
	};
	glbInfo.MS = [];
	//glbInfo.plex.Index=["S","DL","DS"];
	glbInfo.MS[0] = {
		key			: "A4",
		text		: Msg.Page.FILELIST.FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG,
		value		: JFLib.MS.A4LEF
	};
	glbInfo.MS[1] = {
		key			: "A3",
		text		: Msg.Page.FILELIST.FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG,
		value		: JFLib.MS.A3SEF
	};
	/******************************************/
	glbInfo.docList = [];
}

/**
 * Scan, Mail Object의 초기화
 */
function initObject()
{
	//console.log("initObject");
	glbDevInfo.docList = [];
	glbDevInfo.pdlList = [];
}

/**
 * 페이지로 사용되는 Data의 격납용 Class
 */
var DataSet = function()
{
	//userInfo
	this.userInfo = {};
	//doclist
	this.docList = null;
	//selectedDoc
	this.selectedDoc = {};
	//printSetting
	this.userPolicyInfo = {};
};

/**
 * 절약한 용지수를 계산하는 함수(scan용지수/부수/출력용지수로 판별)
 * @return {string} eco_num : 절약 용지수
 */
function calcEcoSheetsNum(impression, sheets, copies){
	var sheets_num = sheets / copies;
	var eco_num = (impression - sheets_num) * copies;
	return eco_num;
}

/**
 * Eco level을 계산하는 함수(nup/양면출력으로 판별)
 * @return {string} eco level 
 */
function calcEcoLevel(index){
	var nup = glbDataSet.selectedDoc[index].Nup;
	return (glbDataSet.outplex!=0) ? nupToIndex(nup) + 1 : nupToIndex(nup);
}
 
/**
 * Eco Level 결정을 위한 Nup을 Index로 변환하는 함수(TODO)
 */
function nupToIndex(arg){
	if (arg == 1){
		return 0;
	}else if(arg == 2){
		return 1;
	}else{ //4up이상
		return 2;
	}	
}

/**
 * 절약용지수 결정을 위한 출력 용지수 계산하는 함수(TODO)
 */
function outputSheetCnt(index){
	return Math.ceil((glbDataSet.selectedDoc[index].pageCnt/glbDataSet.selectedDoc[index].Nup)/((glbDataSet.selectedDoc[index].outPlex>=1)?2:1));
}