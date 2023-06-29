/**
 * @fileoverview : Data정의
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var glbInfo = {};					//설정치 참조용 Data
var glbDevInfo = {permitInfo:["1","1","1"]};				//유저 정보 격납처
var glbConfig = {};					//조정 가능 항목의 격납처
var glbDataSet = null;				//Scan 에 사용되는 설정정보의 전역 Data
var glbConfigError=false;			//환경설정파일 에러체크 Flag정보
var SERVICE_CODE = {
	PRINT:"print",
	PRINT_CHARGE:"printCharge",
	PRINT_CANCEL:"printCancel",
	COPY_PRICE:"copyPrice",
	COPY_CHARGE:"copyCharge",
	SCAN:"scan",
	FAX:"fax",
	USER:"user"
};
var PRINT_JOB_TYPE = {
	PRINT:"1",
	CANCEL:"2"
};
var SORT_TYPE = {
	NONE:0,
	ASC:1,
	DESC:2
};
/**********************************************************************************/

var gProtocol = "http://";
SSMILib.protocol = "http://";

/**********************************************************************************/

/**
 * Data의 초기화를 한다.
 */
function initModel()
{
	initConfig();
	initData();
	initInfo();
	initObject();
}

/**
 * 조정가능 항목의 초기화(미사용)
 */
function initConfig()
{
	try{
		glbConfig.Mode = {};
		//glbConfig.SERVER_URL = CONFIG.SERVER_URL||"";
		if(CONFIG.ENV){
			if(CONFIG.ENV.LOGIN_INFO){
			// TODO 추가 작성
			}
			if(CONFIG.ENV.TIMEOUTS){
			
			}
			if(CONFIG.ENV.COUNTER){
			
			}
			if(CONFIG.ENV.LANG){
				glbConfig.language=(CONFIG.ENV.LANG.length!=0)?CONFIG.ENV.LANG:['ko'];
				glbConfig.langCount=0;
			}
			if(CONFIG.ENV.SECURE){
				glbConfig.isSHA = CONFIG.ENV.SECURE.isSHA||false;
			}
			if(CONFIG.ENV.SERVER){
				//glbConfig.SERVER_URL = CONFIG.ENV.SERVER.URL||"";
				glbConfig.SERVER_IP = CONFIG.ENV.SERVER.IP||"",
				glbConfig.SERVER_PORT = CONFIG.ENV.SERVER.PORT||"",
				glbConfig.SERVER_SSL = CONFIG.ENV.SERVER.SSL||false
			}
			if(CONFIG.ENV.SERVICES){
				glbConfig.Services = CONFIG.ENV.SERVICES||[];			//TODO:추후 읽어들인 서비스를 기준으로 메뉴를 만들도록 추가개발
			}
			/*if(CONFIG.MODE.PRINTER_IP){//2016.09.28 KIS Chone 복합기 IP 자동 취득 기능의 추가 refs #4065
				glbConfig.PRINTER_IP = CONFIG.MODE.PRINTER_IP||"";
			}*/
		}
		if(CONFIG.MODE){
			//MODE._8BIT_DISPLAY
			glbConfig.ADMIN_USABLE = CONFIG.MODE.ADMIN_USABLE;
			glbConfig.DRCT_PRINT_ENABLE = CONFIG.MODE.DRCT_PRINT_ENABLE;
			glbConfig.SERVICE_CALL_MODE = (CONFIG.MODE.SERVICE_CALL_MODE == "iframe");
		}
		glbConfig.isCreditPayment = CONFIG.CREDIT_PAYMENT || false;
		glbConfig.isIMoneyPayment = CONFIG.I_MONEY_PAYMENT || false;
		glbConfig.isPrintUse = CONFIG.PRINT_USE || false;
		glbConfig.isCopyUse = CONFIG.COPY_USE || false;
	}
	catch(ex){
		KISUtil.debug("initConfig",ex.message);
		var param = {type:"startup",title:Msg_lang[glbConfig.language[0]].WarnPopup.title,message:Msg_lang[glbConfig.language[0]].ERROR_MESSAGE.FAIL_ENV,targetPage:false};
		WarnPopup._param = param;
		PageManager.changePage(WarnPopup,PageManager.type.NORMAL);
		glbConfigError=true;
	}
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
	
	//서버로부터 받은 유저명(TODO)
	glbInfo.displayName = null;
}

/**
 * Scan, Mail Object의 초기화
 */
function initObject()
{
}

/**
 * 페이지로 사용되는 Data의 격납용 Class
 */
var DataSet = function()
{
};

/**
 * コンテンツ上から調整可能な内容初期化
 */
function initData()
{
	glbConfig.SERVER_IP = (DATA.ADDRESS)?DATA.ADDRESS:CONFIG.ENV.SERVER.IP;
	glbConfig.SERVER_PORT = (DATA.PORT)?DATA.PORT:CONFIG.ENV.SERVER.PORT;
	glbConfig.isCreditPayment = (DATA.CREDIT_PAYMENT)?((parseInt(DATA.CREDIT_PAYMENT)==1)?true:false):CONFIG.CREDIT_PAYMENT;
	glbConfig.isIMoneyPayment = (DATA.I_MONEY_PAYMENT)?((parseInt(DATA.I_MONEY_PAYMENT)==1)?true:false):CONFIG.I_MONEY_PAYMENT;
	glbConfig.isPrintUse = (DATA.PRINT_USE)?((parseInt(DATA.PRINT_USE)==1)?true:false):CONFIG.PRINT_USE;
	glbConfig.isCopyUse = (DATA.COPY_USE)?((parseInt(DATA.COPY_USE)==1)?true:false):CONFIG.COPY_USE;
	/*if(DATA.CREDIT_PAYMENT){
		glbConfig.isCreditPayment = (parseInt(DATA.CREDIT_PAYMENT)==1)?true:false;
	}else{
		glbConfig.isCreditPayment = CONFIG.CREDIT_PAYMENT;
	}

	if(DATA.I_MONEY_PAYMENT){
		glbConfig.isIMoneyPayment = (parseInt(DATA.I_MONEY_PAYMENT)==1)?true:false;
	}else{
		glbConfig.isIMoneyPayment = CONFIG.I_MONEY_PAYMENT;
	}

	if(DATA.PRINT_USE){
		glbConfig.isPrintUse = (parseInt(DATA.PRINT_USE)==1)?true:false;
	}else{
		glbConfig.isPrintUse = CONFIG.PRINT_USE;
	}

	if(DATA.COPY_USE){
		glbConfig.isCopyUse = (parseInt(DATA.COPY_USE)==1)?true:false;
	}else{
		glbConfig.isCopyUse = CONFIG.COPY_USE;
	}*/
}

/**
 * ファイル存在チェック
 */
function isExistDevciesData()
{
	var isExist = true;
	//data.jsが存在しない場合
	if (DATA == undefined){
		isExist = false;
	}

	return isExist;
}