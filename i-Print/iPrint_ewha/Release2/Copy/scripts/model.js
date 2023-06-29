/**
 * @fileoverview データ定義
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var glbInfo = {};					//設定値参照用データ
var glbDevInfo = {};				//ユーザ情報格納先
var glbScannerInfo = null;
var glbConfig = {};					//調整可能項目の格納先
var glbScan = {};					//Job実行に使うスキャンObject
var glbFile = {};					//Job実行に使うFileObject
var glbBox = {};					//Job実行に使うBoxObject
var glbJobTemplate = null;			//Job実行用テンプレート
var glbDataSet = null;				//スキャンに使う設定情報の全域データの
var glbDataSetBackup = null;		//スキャンに使う設定情報の全域データのバックアップ
var glbComm = {};					//通信用Object
var glbJobLog = {};
var SERVICE_CODE = {
	USER:"user",
	COPY_PRICE:"copyPrice",
	COPY_CHARGE:"copyCharge",
	PRINT:"print",
	SCAN:"scan",
	FAX:"fax",
	COPY_REFUND : "copyRefund"
};

var gProtocol = "http://";
SSMILib.protocol = "http://";

//2017.02.02 FXKIS 카피 환불 통신 실패(http status 0 발생 등)시 리트라이 실시 refs #4191
glbInfo.refundCount = 0;
var MAX_REFUND_COUNT = 10;

//과금 결제방식 선택 (직과금/i-Money결제방식)
var PAYMENT_METHOD = {
	CREDIT:"typeA",
	CYBER_MONEY:"typeB"
};

JFLib.MAG.B5toA3= 163.0;

var WARN_TYPE = {
		ERROR:"error",
		WARN:"warn"
};
var glbChargeInit = {
	"service":'',
	"docInfo":{
		"outplex":0, // 0/1/2 (Simplex/Duplex/Tumble)
		"outputmediumsize":'',
		"colormode":0, // 0/1 (Color/Black&White)
		"pages":1,
		"copies":1,
	},
	"paymentMethods":'',//payType 직과금/사이버머니
	"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};
var glbChargePriceChkInit = {
	"service":'',
	"docInfo":{
		"outplex":0, // 0/1/2 (Simplex/Duplex/Tumble)
		"outputmediumsize":'',
		"colormode":0, // 0/1 (Color/Black&White)
		"pages":1,
		"copies":1,
	},
	"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};
var THANK_SCREEN_STATE = {
	DAY					:	"DAY",
	EVENING				:	"EVENING",
	NIGHT				:	"NIGHT"
};
var glbConfigData = {
	pageType : {
		value : [ "Portrait", "Landscape" ],
		defaultValue : "Portrait"
	},
	inplex : {
		value : [ "Simplex", "Duplex", "Tumble" ],
		defaultValue : "Simplex"
	},
	outplex : {
		value : [ "Simplex", "Duplex", "Tumble" ],
		defaultValue : "Simplex"
	},
	magnification : {
		value : [ "100", "Auto" ],
		defaultValue : "100"
	},
	nup : {
		value : [ "1", "2", "4", "8" ],
		defaultValue : "1"
	},
	colorMode : {
		value : [ "C", "B" ],
		defaultValue : "C"
	},
	headPosition : {
		value : [ "Top", "Left" ],
		defaultValue : "Top"
	},
	bgElimination : {
		value : [ false, true ],
		defaultValue : false
	},
	imageMode : {
		value : [ "mixed", "text", "image" ],
		defaultValue : "mixed"
	},
	darkness : {
		value : [ -3, -2, -1, 0, 1, 2, 3 ],
		defaultValue : 0
	}
};

/**
 * データの初期化を行う
 */
function initModel()
{
	initConfig();
	initInfo();
	initObject();
	initJobTemplate();
}

/**
 * 調整可能項目の初期化を行う
 */
function initConfig()		//TODO:정리하기
{
	glbConfig = {
		CSInfo:{
			title:""//Msg_default.Common.CSName
		},
		Quantity:{
			Min:1,
			Max:999,
			Default:1
		},
		Magnification:{
			Min:25,
			Max:400,
			Default:100
		},
		CenterErase:{
			Min:0,
			Max:50,
			Default:0
		},
		Timeout:{
			Min:5,
			Max:999,
			Default:10
		},
		GetJob:{
			count:CONFIG.ENV.COUNTER.GETJOB_DELAY,
			term:CONFIG.ENV.TIMEOUTS.GETJOB_DELAY,
			timer:null
		},
		mediumSizes : ["A3", "B4", "A4", "B5"]//,
		//enableInputMediumSizes : ["A3", "B4", "A4", "B5"]
	};
	SUPPORT_PAPER_SIZE = extendDeep(CONFIG.ENV.SUPPORT_PAPER_SIZE,[]);

	glbConfig.CSInfo.title = CONFIG.TITLE_NAME;
	if(typeof CONFIG.defaultValue.resolution != "undefined"){
		glbConfig.resolution = CONFIG.defaultValue.resolution;
	}else{
		glbConfig.resolution = JFLib.RES.R300;
	}
	if(CONFIG.ENV){
		if(CONFIG.ENV.LOGIN_INFO){
			glbConfig.mailboxId = CONFIG.ENV.LOGIN_INFO.ID;
		}
		if(CONFIG.ENV.MAILBOX){
			glbConfig.mailboxNo = CONFIG.ENV.MAILBOX.BOX_NO||1;
			//glbConfig.mailboxId = CONFIG.ENV.MAILBOX.ID;
			glbConfig.mailboxPassword = CONFIG.ENV.MAILBOX.PASSWORD;
		}
	}

	for(var i in glbConfigData){
		if(typeof CONFIG.defaultValue[i] != "undefined"
			&& Common.indexOf(glbConfigData[i].value, CONFIG.defaultValue[i]) != -1){
			glbConfig[i] = CONFIG.defaultValue[i];
		}else{
			glbConfig[i] = glbConfigData[i].defaultValue;
		}
	}

	//glbComm.url = "http://" + CONFIG.ENV.PRINT_SERVER.IP + ":" + CONFIG.ENV.PRINT_SERVER.PORT;
	//glbComm.externalUrl = "http://" + CONFIG.ENV.CARD_READER.IP + ":" + CONFIG.ENV.CARD_READER.PORT;

	glbConfig.MAGNIFICATION_ENABLE = CONFIG.MODE.MAGNIFICATION_ENABLE || false;
	glbConfig.PAGE_SPLIT_USABLE = CONFIG.MODE.PAGE_SPLIT_USABLE || false;
	glbConfig.DADF_ONLY = CONFIG.MODE.DADF_ONLY || false;
	glbConfig.isSHA = CONFIG.MODE.isSHA || false;
	glbConfig.chkMailBoxJobFlg = false;
	glbConfig.campaignImg = [];
	//glbConfig.FileServer = CONFIG.ENV.FILE_SERVER;
	//glbConfig.FileServerSSL = CONFIG.ENV.FILE_SERVER_SSL;
	//glbConfig.FileServerPort = CONFIG.ENV.FILE_SERVER_PORT;
	for(i in CONFIG.ENV.CAMPAIGN_IMG){
		glbConfig.campaignImg.push(CONFIG.ENV.CAMPAIGN_IMG[i]);
	}
}
(function(){
	window.Img = getImages(CONFIG.MODE._8BIT_DISPLAY?"_8":"");
})();

/**
 * コンテンツが扱いデータの初期化を行う
 */
function initInfo()
{
	//원고 양단면
	glbInfo.inplex = [];
	glbInfo.inplex[0] = JFLib.PLEX.SIMPLEX;				//片面原稿
	glbInfo.inplex[1] = JFLib.PLEX.DUPLEX;				//両面(左右開き)
	glbInfo.inplex[2] = JFLib.PLEX.TUMBLE;				//両面(上下開き)

	//출력 양단면
	glbInfo.outplex = [];
	glbInfo.outplex[0] = JFLib.PLEX.SIMPLEX;			//片面原稿
	glbInfo.outplex[1] = JFLib.PLEX.DUPLEX;				//両面(左右開き)
	glbInfo.outplex[2] = JFLib.PLEX.TUMBLE;				//両面(上下開き)

	//배율
	glbInfo.magnification = [];
	glbInfo.magnification[0] = JFLib.MAG.FIX100;
	glbInfo.magnification[1] = JFLib.MAG.AUTO;
	glbInfo.magnification[2] = "";						//예외대응해야할듯

	//컬러모드
	glbInfo.colorMode = [];
	glbInfo.colorMode[0] = JFLib.CM.COLOR;				//フルカラー
	glbInfo.colorMode[1] = JFLib.CM.BW;					//白黒（2階調）

	//nup
	glbInfo.nup = [];
	glbInfo.nup[0] = JFLib.NUPNUM.ONE;				//선택안함
	glbInfo.nup[1] = JFLib.NUPNUM.TWO;			//2up
	glbInfo.nup[2] = JFLib.NUPNUM.FOUR;				//4up
	glbInfo.nup[3] = JFLib.NUPNUM.EIGHT;				//8up

	//원고종류
	glbInfo.imageMode = [];
	glbInfo.imageMode[0] = JFLib.IM.MIXED;				//文字/写真
	glbInfo.imageMode[1] = JFLib.IM.TEXT;				//文字
	glbInfo.imageMode[2] = JFLib.IM.HALFTONE;			//写真

	//原稿セットの向き(天の向き)
	glbInfo.headPosition = [];
	glbInfo.headPosition[0] = JFLib.HP.TOP;				//読める向き
	glbInfo.headPosition[1] = JFLib.HP.LEFT;			//左向き

	//濃度
	glbInfo.darkness = [];
	glbInfo.darkness[0] = {value:JFLib.DARK.D3, cls:"d3"};				//Level3の濃さ	:100
	glbInfo.darkness[1] = {value:JFLib.DARK.D2, cls:"d2"};				//Level2の濃さ	:60
	glbInfo.darkness[2] = {value:JFLib.DARK.D1, cls:"d1"};				//Level1の濃さ	:30
	glbInfo.darkness[3] = {value:JFLib.DARK.NORMAL, cls:""};			//普通			:0
	glbInfo.darkness[4] = {value:JFLib.DARK.L1, cls:"l1"};				//Level1の薄さ	:-30
	glbInfo.darkness[5] = {value:JFLib.DARK.L2, cls:"l2"};				//Level2の薄さ	:-60
	glbInfo.darkness[6] = {value:JFLib.DARK.L3, cls:"l3"};				//Level3の薄さ	:-100

	//image
	glbInfo.Img={};

	//スライトポップアップメッセージの表示時間
	glbInfo.MSG_TIMEOUT_LENGTH=7000;

	//複合機のホスト名
	glbInfo.hostName="";
	glbInfo.JobID = "";

	glbInfo.splitScan = [];
	glbInfo.splitScan[0] = {value:JFLib.SPLITBOUND.LEFT,
							extract:[JFLib.SPLITEXTRACT.BOTH,JFLib.SPLITEXTRACT.LEFT,JFLib.SPLITEXTRACT.RIGHT]};
	glbInfo.splitScan[1] = {value:JFLib.SPLITBOUND.RIGHT,
							extract:[JFLib.SPLITEXTRACT.BOTH,JFLib.SPLITEXTRACT.LEFT,JFLib.SPLITEXTRACT.RIGHT]};
	glbInfo.splitScan[2] = {value:JFLib.SPLITBOUND.TOP,
							extract:[JFLib.SPLITEXTRACT.BOTH,JFLib.SPLITEXTRACT.TOP,JFLib.SPLITEXTRACT.BOTTOM]};

	glbInfo.boxId = 1;
	glbInfo.docId = "";
	glbInfo.tray = [];
}

/**
 * スキャン、メールオブジェクトの初期化を行う
 */
function initObject()
{
	glbScan = new JFLib.Scan();

	glbDataSet = new DataSet();//ユーザの設定項目
	glbDataSetBackup = new DataSet();
	deepCopyDataSet(glbDataSet,glbDataSetBackup);

	glbFileTran = new JFLib.FileTransfer();
	glbFileTran.url = CONFIG.ENV.FTPServer.URL;
	glbFileTran.loginName = CONFIG.ENV.FTPServer.ID;
	glbFileTran.password = CONFIG.ENV.FTPServer.PW;

	glbScan.resolution = glbConfig.resolution;
	glbScan.scanFrom = glbConfig.DADF_ONLY?JFLib.INDEVICE.DADF:JFLib.INDEVICE.BOTH;
	setInplexIdx();
	setColorModeIdx();
	setImageModeIdx();
	setHeadPosition();
	setDarknessIdx();
	setBgElimination();
	setNextOriginal();
	setPageSplit();
	setCenterErase();
	setMagnification();
	setDocFormatIdx();

}

/**
 * Jobテンプレートを構成
 */
function initJobTemplate()
{

	glbJobTemplate = new JFLib.JobTemplate();
	//指示書説明
	glbJobTemplate.header.description = ContentsLib.contentsId + " V" + ContentsLib.contentsVersion;
	//ベンダ識別子
	glbJobTemplate.header.identifier = Jfs_Msg.VENDOR_IDENTIFIER;

	glbJobTemplate.setInputProcess(glbScan);
}

function setInputMediumSize()
{
	glbScan.inputMedium.size = (glbInfo.magnification.inputMS)?glbInfo.magnification.inputMS:JFLib.MS.AUTO;
	//glbScan.outputMedium.size
	//glbDataSet.outputMediumSize
	if(glbDataSet.trayIdx == 0){
		glbScan.outputMedium.size = JFLib.MS.NOTSPEC;
	}
	else{
		var temp = glbInfo.tray[glbDataSet.trayIdx-1].outputMediumSize;
		if(temp == JFLib.MS.B4SEF){
			glbScan.outputMedium.size = glbInfo.tray[glbDataSet.trayIdx-1].outputMediumSize;
			glbScan.outputMedium.size = JFLib.MS.B4SEF;
		}
	}
}

/**
 * Jobテンプレートにデータに値をセット（原稿の片・両面）
 * @param {boolean} byPassConflict true:conflictせずにデータをセット/false:conflictチェックをしながらデータをセット
 */
function setInplexIdx()
{
	if(glbDataSet.inplexIdx > glbInfo.inplex.length-1){
		glbScan.plex = glbInfo.inplex[0];
	}else{
		glbScan.plex = glbInfo.inplex[glbDataSet.inplexIdx];
	}
}

/**
 * Jobテンプレートにデータに値をセット（カラーモード）
 * @param {boolean} byPassConflict true:conflictせずにデータをセット/false:conflictチェックをしながらデータをセット
 */
function setColorModeIdx()
{
	glbScan.colorMode = glbInfo.colorMode[glbDataSet.colorModeIdx];
}

/**
 * Jobテンプレートにデータに値をセット（イメージモード）
 */
function setImageModeIdx()
{
	glbScan.imageMode = glbInfo.imageMode[glbDataSet.imageModeIdx];
}

/**
 * Jobテンプレートにデータに値をセット（原稿向き）
 * @param {boolean} byPassConflict true:conflictせずにデータをセット/false:conflictチェックをしながらデータをセット
 */
function setHeadPosition()
{
	glbScan.headposition = glbInfo.headPosition[glbDataSet.headpositionIdx];
}

/**
 * Jobテンプレートにデータに値をセット（濃度）
 */
function setDarknessIdx()
{
	glbScan.darkness = glbInfo.darkness[glbDataSet.darknessIdx].value;
}

/**
 * Jobテンプレートにデータに値をセット（地色除去）
 */
function setBgElimination()
{
	glbScan.bgelimination = glbDataSet.bgElimination;
}

function setMagnification()
{
	if(glbDataSet.magnification.value != glbInfo.magnification[1]){
		if(glbDataSet.magnification.value == glbInfo.magnification[0]){
			glbScan.magnification.x=JFLib.MAG.FIX100;
			glbScan.magnification.y=JFLib.MAG.FIX100;
		}else{
			if(glbDataSet.magnification.inputMS && glbDataSet.magnification.outputMS){
				glbScan.magnification.x=JFLib.MAG[glbDataSet.magnification.inputMS + "to" + glbDataSet.magnification.outputMS];
				glbScan.magnification.y=JFLib.MAG[glbDataSet.magnification.inputMS + "to" + glbDataSet.magnification.outputMS];
			}else{
				glbScan.magnification.x=glbDataSet.magnification.value;
				glbScan.magnification.y=glbDataSet.magnification.value;
			}
		}
	}else{
		glbScan.magnification.x=JFLib.MAG.AUTO;
		glbScan.magnification.y=JFLib.MAG.AUTO;
	}
}

function setOutputMediumSize()
{
	/*if(glbDataSet.trayIdx == 0){
		glbScan.outputMedium.size = JFLib.MS.NOTSPEC;
	}
	else{
		if(glbDataSet.magnification.value == glbInfo.magnification[1]){	//auto
			//note: 문제는 여기서 방향이 원고의 방향과 안맞게 되면 스캔될때 문서가 잘리게 되는듯..
			glbScan.outputMedium.size = glbInfo.tray[glbDataSet.trayIdx-1].outputMediumSize;
		}
		else{
			glbScan.outputMedium.size = JFLib.MS.NOTSPEC;
		}
	}*/
	if(glbDataSet.trayIdx == 0){
		glbScan.outputMedium.size = JFLib.MS.NOTSPEC;
	}
	else{
		//note: 문제는 여기서 방향이 원고의 방향과 안맞게 되면 스캔될때 문서가 잘리게 되는듯..
		glbScan.outputMedium.size = glbInfo.tray[glbDataSet.trayIdx-1].outputMediumSize;
	}
	/*
	if(glbDataSet.nupIdx != 0){
		glbScan.outputMedium.size = JFLib.MS.NOTSPEC;
	}else{
		glbScan.outputMedium.size = (glbDataSet.trayIdx==0)?JFLib.MS.NOTSPEC:glbInfo.tray[glbDataSet.trayIdx-1].outputMediumSize;
	}*/
	//console.log("glbScan.outputMedium.size");
	//console.log(glbScan.outputMedium.size);
}

function setPageSplit()
{
	var splitScan  = new JFLib.ComScan.SplitScan();
	splitScan.enable = glbDataSet.splitScan.enable;
	if(glbDataSet.splitScan.enable){
		var valObj = glbInfo.splitScan[glbDataSet.splitScan.boundAt-1];
		splitScan.boundAt = valObj.value;
		splitScan.extract = valObj.extract[glbDataSet.splitScan.extract];
	}
	glbScan.splitScan = splitScan;
}

function setNextOriginal()
{
	//glbScan.nextoriginal = glbDataSet.splitScan.enable;
	glbScan.nextoriginal = true;	// Scan속도 때문에 다음원고 버튼 누를 시간이 부족해 항상 있음으로 설정
}

function setCenterErase()
{
	var centerErase = new JFLib.ComScan.CenterErase();
	if(glbDataSet.splitScan.enable){
		centerErase.center = glbDataSet.centerErase;
	}
	glbScan.centerErase = centerErase;
}
/*
function setCopies()
{
	//var copies = Common.getText("lbl_MP_pages");
	//glbDataSet.copies = copies.substring(0, copies.length-1);
}*/
/**
 * ページで使うデータ格納用クラス
 */
var DataSet = function()
{
	this.inplexIdx = Common.indexOf(glbConfigData.inplex.value, glbConfig.inplex);
	this.outplexIdx = Common.indexOf(glbConfigData.outplex.value, glbConfig.outplex);
	this.magnificationIdx =Common.indexOf(glbConfigData.magnification.value, glbConfig.magnification);
	this.magnification = {value:(glbConfig.magnification == "Auto")?JFLib.MAG.AUTO:JFLib.MAG.FIX100, inputMS:"", outputMS:""};
	this.nupIdx = Common.indexOf(glbConfigData.nup.value, glbConfig.nup);
	this.trayIdx = 0;
	this.colorModeIdx = Common.indexOf(glbConfigData.colorMode.value, glbConfig.colorMode);
	this.headpositionIdx = Common.indexOf(glbConfigData.headPosition.value, glbConfig.headPosition);
	this.bgElimination = (glbConfig.bgElimination)?true:false;
	this.imageModeIdx = Common.indexOf(glbConfigData.imageMode.value, glbConfig.imageMode);
	this.darknessIdx = Common.indexOf(glbConfigData.darkness.value, glbConfig.darkness);
	this.orientation = Common.indexOf(glbConfigData.pageType.value, glbConfig.pageType);
	this.copies = glbConfig.Quantity.Default;
	this.outputMediumSize = null;
	this.inputMediumSize = null;
	this.splitScan = {enable:false,boundAt:"", extract:""};
	this.splitScanIdx = 0;
	this.centerErase = JFLib.DEFAULT;
};

/**
 * glbScan/glbEmailのデータをマッピング
 * ページの遷移時のデータ補正のため
 * @param {boolean} byPassConflict true:conflictせずにデータをセット/false:conflictチェックをしながらデータをセット
 */
function remappingTemplate()
{
	setInplexIdx();
	setColorModeIdx();
	setImageModeIdx();
	setHeadPosition();
	setDarknessIdx();
	setInputMediumSize();
	setDocFormatIdx();
	setBgElimination();
	setMagnification();
	setOutputMediumSize();
	setNextOriginal();
	setPageSplit();
	setCenterErase();
	//setCopies();
}

function setDocFormatIdx()
{
	glbFileTran.docFormat = JFLib.DOCFORMAT.PDF;
}

/**
 * データのコピーを行う。
 * ページデータのStoreやRollbackとして利用
 * @param {object} origin SourceObject
 * @param {object} obj TargetObject
 */
function deepCopyDataSet(origin, obj){
	obj.inplexIdx = origin.inplexIdx;
	obj.outplexIdx = origin.outplexIdx;
	obj.nupIdx = origin.nupIdx;
	obj.colorModeIdx = origin.colorModeIdx;
	obj.imageModeIdx = origin.imageModeIdx;
	obj.darknessIdx = origin.darknessIdx;
	obj.bgElimination = origin.bgElimination;
	obj.trayIdx = origin.trayIdx;
	obj.orientation = origin.orientation;
	obj.headpositionIdx = origin.headpositionIdx;
	obj.copies = origin.copies;
	obj.magnificationIdx = origin.magnificationIdx;
	obj.magnification.value = origin.magnification.value;
	obj.magnification.inputMS = origin.magnification.inputMS;
	obj.magnification.outputMS = origin.magnification.outputMS;
	obj.inputMediumSize = origin.inputMediumSize;
	obj.copies = origin.copies;
	obj.outputMediumSize = origin.outputMediumSize;
	obj.splitScanIdx = origin.splitScanIdx;
	obj.splitScan.enable = origin.splitScan.enable;
	obj.splitScan.boundAt = origin.splitScan.boundAt;
	obj.splitScan.extract = origin.splitScan.extract;
	obj.centerErase = origin.centerErase;
}

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
function calcEcoLevel(){
	return (glbDataSet.inplexIdx==0&&glbDataSet.outplexIdx!=0) ? glbDataSet.nupIdx + 1 : glbDataSet.nupIdx;
}