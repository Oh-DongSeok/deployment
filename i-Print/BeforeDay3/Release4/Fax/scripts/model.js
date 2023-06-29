/**
 * @fileoverview データ定義
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var glbInfo = {};					//設定値参照用データ
var glbDevInfo = {};				//ユーザ情報格納先
var glbConfig = {};					//調整可能項目の格納先
var glbScan = {};					//Job実行に使うスキャンObject
var glbJobTemplate = null;			//Job実行用テンプレート
var glbDataSet = null;				//スキャンに使う設定情報の全域データの
var glbDataSetBackup = null;		//スキャンに使う設定情報の全域データのバックアップ
var glbComm = {};					//通信用Object
var SERVICE_CODE = {
	USER:"user",
	PRINT:"print",
	SCAN:"scan",
	FAX:"fax",
	COPY_REFUND : "faxRefund",
	FAX_PRICE : "faxPrice",
	FAX_CHARGE: "faxCharge"
};
var glbUserInfo = {};

var gProtocol = "http://";
SSMILib.protocol = "http://";

//과금 결제방식 선택 (직과금/i-Money결제방식)
var PAYMENT_METHOD = {
	CREDIT:"typeA",
	CYBER_MONEY:"typeB"
};

var WARN_TYPE = {
	ERROR:"error",
	WARN:"warn"
};

var glbChargePriceChkInit = {
	"service":'',
	"docInfo":{
		"resolution":'',
		"pages":'',
		"colormode":1, // 0/1 (Color/Black&White)
		"fileName":'',
		"fileType":'',
	},
	//"userId":'',
	"ipAddress":'',
	"serialNo":'',
	"language":''
};

var glbChargeInit = {
	"service":'',
	"docInfo":{
		"resolution":'',
		"colormode":1, // 0/1 (Color/Black&White)
		"pages":'',
		"fileName":'',
		"fileType":'',
		//"destAdd":'',
	},
	"userInfo":{
		"userId":'',
		"faxNumber":'',
		"telNumber":'',
		"informingConsent":''
	},
	"paymentMethods":'',//payType 직과금/사이버머니 
	"ipAddress":'',
	"serialNo":'',
	"language":''
};

var glbConfigData =
{
	headPosition : {
		value : [ "Top", "Left" ],
		defaultValue : "Top"
	},
	inplex : {
		value : [ "Simplex", "Duplex", "Tumble" ],
		defaultValue : "Simplex"
	},
	resolution : {
		value : [JFLib.RES.R200, JFLib.RES.R300, JFLib.RES.R400, JFLib.RES.R600],
		defaultValue : JFLib.RES.R300
	},
	imageMode : {
		value : [ "mixed", "text", "image" ],
		defaultValue : "mixed"
	},
	docFormat : {
		value : [JFLib.DOCFORMAT.PDF, JFLib.DOCFORMAT.JPEG],
		defaultValue : JFLib.DOCFORMAT.PDF
	},
	colorMode : {
		value : [ "C", "B" ],
		defaultValue : "C"
	},
	bgElimination : {
		value : [ false, true ],
		defaultValue : false
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
function initConfig()
{
	glbConfig = {
		CSInfo:{
			title:""//Msg_default.Common.CSName
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
	};
	
	glbConfig.CSInfo.title = CONFIG.TITLE_NAME;
	if(typeof CONFIG.defaultValue.resolution != "undefined"){
		glbConfig.resolution = CONFIG.defaultValue.resolution;
	}else{
		glbConfig.resolution = JFLib.RES.R300;
	}

	for(var i in glbConfigData){
		if(typeof CONFIG.defaultValue[i] != "undefined" 
			&& Common.indexOf(glbConfigData[i].value, CONFIG.defaultValue[i]) != -1){
			glbConfig[i] = CONFIG.defaultValue[i];
		}else{
			glbConfig[i] = glbConfigData[i].defaultValue;
		}
	}
	
	glbConfig.PAGE_SPLIT_USABLE = CONFIG.MODE.PAGE_SPLIT_USABLE || false;
	glbConfig.DADF_ONLY = CONFIG.MODE.DADF_ONLY || false;
	glbConfig.isSHA = CONFIG.MODE.isSHA || false;
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

	//컬러모드
	/*glbInfo.colorMode = [];
	glbInfo.colorMode[0] = JFLib.CM.COLOR;				//フルカラー
	glbInfo.colorMode[1] = JFLib.CM.BW;					//白黒（2階調）
	*/
	
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
	
	glbInfo.resolution = [];
	glbInfo.resolution[0] = JFLib.RES.R200;
	glbInfo.resolution[1] = JFLib.RES.R300;
	glbInfo.resolution[2] = JFLib.RES.R400;
	glbInfo.resolution[3] = JFLib.RES.R600;
	
	/*glbInfo.docFormat = [];
	glbInfo.docFormat[0] = JFLib.DOCFORMAT.PDF;
	glbInfo.docFormat[1] = JFLib.DOCFORMAT.JPEG;*/

	glbInfo.bgElimination = [];
	glbInfo.bgElimination[0] = false;
	glbInfo.bgElimination[1] = true;
	
	glbInfo.Img={};

	//スライトポップアップメッセージの表示時間
	glbInfo.MSG_TIMEOUT_LENGTH = 7000;

	//複合機のホスト名
	glbInfo.hostName="";
	glbInfo.JobID = "";

	/*glbInfo.splitScan = [];
	glbInfo.splitScan[0] = {value:JFLib.SPLITBOUND.LEFT, extract:[JFLib.SPLITEXTRACT.BOTH, JFLib.SPLITEXTRACT.LEFT, JFLib.SPLITEXTRACT.RIGHT]};
	glbInfo.splitScan[1] = {value:JFLib.SPLITBOUND.RIGHT, extract:[JFLib.SPLITEXTRACT.BOTH, JFLib.SPLITEXTRACT.LEFT, JFLib.SPLITEXTRACT.RIGHT]};
	glbInfo.splitScan[2] = {value:JFLib.SPLITBOUND.TOP, extract:[JFLib.SPLITEXTRACT.BOTH, JFLib.SPLITEXTRACT.TOP, JFLib.SPLITEXTRACT.BOTTOM]};
	*/

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
	glbScan.scanFrom = glbConfig.DADF_ONLY ? JFLib.INDEVICE.DADF : JFLib.INDEVICE.BOTH;

	glbFileTran = new JFLib.FileTransfer();
	var p_glbConfig = window.parent["glbConfig"];
    if (p_glbConfig.SERVER_IP) {
		glbFileTran.url = "ftp://" + p_glbConfig.SERVER_IP + ":11199";
	}
	glbFileTran.loginName = CONFIG.ENV.FTPServer.ID;
	glbFileTran.password = CONFIG.ENV.FTPServer.PW;

	glbDataSet = new DataSet();//ユーザの設定項目
	glbDataSetBackup = new DataSet();
	deepCopyDataSet(glbDataSet, glbDataSetBackup);

	setHeadPosition();
	setInplexIdx();
	setResolutionIdx();
	setImageModeIdx();
	//setDocFormatIdx();
	setColorModeIdx();
	setDarknessIdx();
	setBgElimination();
	setNextOriginal();
	//setPageSplit();
	//setCenterErase();
}

/**
 * Jobテンプレートを構成
 */
function initJobTemplate()
{
	glbJobTemplate = new JFLib.JobTemplate();
	glbJobTemplate.header.description = ContentsLib.contentsId + " V" + ContentsLib.contentsVersion;
	glbJobTemplate.header.identifier = Jfs_Msg.VENDOR_IDENTIFIER;
	console.log(Jfs_Msg.FAX_JOB_NAME);
	glbJobTemplate.category = Jfs_Msg.FAX_CATEGORY;
	glbJobTemplate.name = Jfs_Msg.FAX_JOB_NAME;
	glbJobTemplate.header.name = Jfs_Msg.FAX_TEMPLATE_NAME;

	glbJobTemplate.setInputProcess(glbScan);
	glbJobTemplate.addOutputProcess(glbFileTran);
}

function setDocFormatIdx()
{
	//glbFileTran.docFormat = glbInfo.docFormat[glbDataSet.docFormatIdx];
	// FAX의 경우 Server의 요구로 PDF Only
	glbFileTran.docFormat = JFLib.DOCFORMAT.PDF;
}

function setResolutionIdx()
{
	//glbScan.resolution = glbInfo.resolution[glbDataSet.resolutionIdx];
	glbScan.resolution = JFLib.RES.R300;
}

function setInputMediumSize()
{
	glbScan.inputMedium.size = (glbInfo.magnification.inputMS) ? glbInfo.magnification.inputMS : JFLib.MS.AUTO;
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
	//glbScan.colorMode = glbInfo.colorMode[glbDataSet.colorModeIdx];
	glbScan.colorMode = JFLib.CM.BW;
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
	glbScan.headposition = glbInfo.headPosition[glbDataSet.headPositionIdx];
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
	//glbScan.bgelimination = glbDataSet.bgElimination;
	glbScan.bgelimination = glbInfo.bgElimination[glbDataSet.bgEliminationIdx];
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
	glbScan.nextoriginal = true;
}

function setCenterErase()
{
	var centerErase = new JFLib.ComScan.CenterErase();
	if(glbDataSet.splitScan.enable){
		centerErase.center = glbDataSet.centerErase;
	}
	glbScan.centerErase = centerErase;
}

/**
 * ページで使うデータ格納用クラス
 */
var DataSet = function()
{
	this.headPositionIdx = Common.indexOf(glbConfigData.headPosition.value, glbConfig.headPosition);
	this.inplexIdx = Common.indexOf(glbConfigData.inplex.value, glbConfig.inplex);
	this.resolutionIdx = Common.indexOf(glbConfigData.resolution.value, glbConfig.resolution);
	this.imageModeIdx = Common.indexOf(glbConfigData.imageMode.value, glbConfig.imageMode);
	this.docFormatIdx = Common.indexOf(glbConfigData.docFormat.value, glbConfig.docFormat);
	this.colorModeIdx = Common.indexOf(glbConfigData.colorMode.value, glbConfig.colorMode);
	this.darknessIdx = Common.indexOf(glbConfigData.darkness.value, glbConfig.darkness);
	this.bgEliminationIdx = Common.indexOf(glbConfigData.bgElimination.value, glbConfig.bgElimination);
	this.splitScan = {enable:false, boundAt:"", extract:""};
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
	setHeadPosition();
	setInplexIdx();
	setResolutionIdx();
	setImageModeIdx();
	setDocFormatIdx();
	setColorModeIdx();
	setDarknessIdx();
	setBgElimination();
	setNextOriginal();
	//setPageSplit();
	//setCenterErase();
}

/**
 * データのコピーを行う。
 * ページデータのStoreやRollbackとして利用
 * @param {object} origin SourceObject
 * @param {object} obj TargetObject
 */
function deepCopyDataSet(origin, obj)
{
	obj.headPositionIdx = origin.headPositionIdx;
	obj.inplexIdx = origin.inplexIdx;
	obj.resolutionIdx = origin.resolutionIdx;
	obj.imageModeIdx = origin.imageModeIdx;
	obj.docFormatIdx = origin.docFormatIdx;
	//obj.colorModeIdx = origin.colorModeIdx;
	obj.darknessIdx = origin.darknessIdx;
	obj.bgElimination = origin.bgElimination;
	obj.splitScan.enable = origin.splitScan.enable;
	/*obj.splitScanIdx = origin.splitScanIdx;
	obj.splitScan.enable = origin.splitScan.enable;
	obj.splitScan.boundAt = origin.splitScan.boundAt;
	obj.splitScan.extract = origin.splitScan.extract;
	obj.centerErase = origin.centerErase;*/
}