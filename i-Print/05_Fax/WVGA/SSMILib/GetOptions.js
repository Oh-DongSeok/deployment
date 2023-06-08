/** 
 * @fileoverview デバイスからオプションリストを取得するためのクラス定義<br>
 * オプションリスト取得に関して以下のメソッドを提供する<br>
 * GetOptions
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving device options list.<br>
 * Provides the following method for retrieving device options list:<br>
 * GetOptions
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */
 

/* Kisyu/Tarzan3-PL-FXベース */
SSMILib.OPTLIST = 
{
	COPY_APPLICATION 				:	1,
	EPC_COPY						:	2,
	PROGRAM_SCAN_AHEAD				:	3,
	SIMPLE_ANNOTATION_COPY			:	4,
	EXT_ANNOTATION_COPY				:	5,
	VISIBLE_TRUSTMARK				:	6,
	SIGNATURE_COPY					:	7,
	FAX								:	8,
	FAX_PBOX						:	9,
	PAPERLESS_FAX					:	10,
	FAX_BOX_COMMAND					:	11,
	NET_BOX_COMMAND					:	12,
	DIRECT_FAX						:	13,
	IFAX							:	14,
	FAX_ADDRESS_BOOK				:	15,
	SCAN_ADDRESS_BOOK				:	16,
	EXT_ADDRESS_BOOK				:	17,
	PRINT							:	18,
	PRINT_APPLICATION				:	19,
	SSL								:	20,
	EMAIL_TO_PRINT					:	21,
	SCAN							:	22,
	PBOX							:	23,
	SCAN_TO_EMAIL					:	24,
	SCAN_TO_SERVER					:	25,
	JOB_FLOW_SERVICE				:	26,
	SCAN_ACS						:	27,
	COLOR_SCAN						:	28,
	JPEG_ACCELERATOR				:	29,
	ANALOG_WATERMARK				:	30,
	HDD_OVER_WRITING				:	31,
	HDD_ENCRYPTION					:	32,
	REMOTE_AUTHENTICATION			:	33,
	SCAN_HIGH_COMPRESSION			:	34,
	SMIME							:	35,
	MEDIA_PRINT_CAMERA				:	36,
	SECURITY						:	37,
	WEB_UI							:	38,
	SEC_SCAN_PASSWORD				:	39,
	SSL_AUTH						:	40,
	AUTH_AGENT						:	41,
	PROXY							:	42,
	HWM								:	43,
	HWM_PRINT						:	44,
	IMAGE_LOG						:	45,
	THUMBNAIL						:	46,
	PREVIEW							:	47,
	REMOTE_ADDRESS_BOOK_SERVICE		:	48,
	UUID_ANNOTATION_PRINT			:	49,
	UUID_HWM_PRINT					:	50,
	BOX_TO_EMAIL					:	51,
	IC_CARD_REMOTE_AUTHENTICATION	:	52,
	SCAN_PKI_SIG					:	53,
	SCAN_PKI_ENC					:	54,
	BMLINKS_SCAN					:	55,
	BMLINKS_PULL_PRINT				:	56,
	XPS_SCAN						:	57,
	IPSEC_PSK						:	58,
	IPSEC_PKI						:	59,
	_8021X							:	60,
	SCAN_OCR						:	61,
	XCP_SMARTCARD					:	62,
	CERT_CHECKLEVEL					:	63,
	CUSTOM_SERVICE					:	64,
	JOB_FLOW_SERVICE_CORE			:	65,
	IP_FAX_SIP						:	66,/* 以下、DMP2008機種から */
	SCAN_TO_URL						:	67,
	MEDIA_PRINT_DOCUMENT			:	68,
	XCP								:	69,
	FORCE_EXT_ANNOTATION			:	70,
	SCAN_TO_MEDIA					:	71, 
	SCAN_N_COLOR_COMPRESSION		:	72, /* 以下、DMP2009機種から */
	XCP_ICCG						:	73,
	ALL								:	74

};

/**
 * オプションリストを取得する<br>
 * 情報が取得できた場合、各オプション名をプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls オプション一覧」を参照
 * @param {String/Array} serviceName サービス名称を表す定数を指定する。配列での指定も可。
 * @addon
 * @static
 * @lang ja
 */
/**
 * "Retrieves option list.<br>
 * If information is successfully received, object with properties named after the respective options is returned. <br>
 * See "01-02 SESAMi Service Management Interface Specification_Object.xls" for property details.
 * @param {String/Array} serviceName Constant representing service name. May be specified as array.
 * @addon
 * @static
 * @lang en
 */
 
 
SSMILib.GetOptions = function(serviceName)
{
	var _obj = null;
	var _identifier = null;
	if(serviceName == SSMILib.OPTLIST.ALL){
		_obj = new Array();
		_identifier = new Array();
		for(var i=1; i< SSMILib.OPTLIST.ALL; i++){
			_obj.push("Option");
			_identifier.push(i);
		}
	} else if(serviceName instanceof Array){
		_obj = new Array();
		_identifier = new Array();
		for(var i=0; i< serviceName.length; i++){
			_obj.push("Option");
			_identifier.push(serviceName[i]);
		}
	} else {
		_obj = "Option";
		_identifier = serviceName;
	}
	var dev = new SSMILib.DeviceInfo(_obj, "");
	
	dev.identifier = _identifier;
	dev.requester.successHandler = SSMILib.GetOptions.successCb;
	dev.requester.errorHandler = SSMILib.GetOptions.errorCb;

	if (SSMILib.dummy) {
		var _optList = new Object();
		_optList.EPC_COPY = true;
		_optList.FAX = true;
		_optList.SCAN = true;
		_optList.PBOX = true;
		SSMILib.onEvent("GetOptions", true, _optList);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetOptions.successCb = function(res)
{
	var _optList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetOptions", _result, _optList);
		return;
	}
	var _objNode = res.responseXML.getElementsByTagName("Object");
	if(_objNode.length == 0) {
		SSMILib.onEvent("GetOptions", _result, _optList);
		return;
	}
	var _optList = new Object();
	var _objNodeLen = _objNode.length;
	var _attrNode = null;
	var _attrLen = 0;
	var _optName = null;
	var _optStatus = null;
	var _attrName = null;

	for(var i=0; i < _objNodeLen; i++){
		_attrNode = _objNode[i].getElementsByTagName("Attribute");
		_attrLen = _attrNode.length;
		for(var j=0; j < _attrLen; j++){
			_attrName = _attrNode[j].getAttribute("name");
			if(_attrNode[j].nodeType == 1 && _attrName){ // ELEMENT_NODE
				if(_attrNode[j].firstChild){
					if(_attrName == "Name"){
						_optName = _attrNode[j].firstChild.nodeValue;
					} else if(_attrName == "Status"){
						_optStatus = (_attrNode[j].firstChild.nodeValue == "ACTIVE") ? true : false;
					}
				}
			}
		}
		if(_optName){
			_optList[_optName] = _optStatus;
		}
	}
	_result = true;
	if(_objNodeLen == 1){
		_optList = _optStatus;
	}

	SSMILib.onEvent("GetOptions", _result, _optList);
	return;
};

/**
 * @private
 */
SSMILib.GetOptions.errorCb = function(res)
{
	var _optList = null;

	SSMILib.onEvent("GetOptions", false, _optList);

	return;
};