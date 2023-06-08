/** 
 * @fileoverview デバイスからファクス構成を取得するためのクラス定義<br>
 * ファクス構成取得に関して以下のメソッドを提供する<br>
 * GetFaxInfo<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving Fax configuration from device.<br>
 * Provides the following methods for retrieving Fax configuration:<br>
 * GetFaxInfo<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * ファクス構成を取得する<br>
 * 情報が取得できた場合、IFAX可否などをプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 faxCapability/fax」を参照
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves Fax configuration information.<br>
 * If information is successfully received, object with Fax configuration properties, such as whether Internet Fax is available, is returned. <br>
 * See 01-02 SESAMi Service Management Interface Specification_Object.xls for details on Fax configuration properties.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetFaxInfo = function()
{
	var faxObj = ["faxCapability", "fax"];
	var dev = new SSMILib.DeviceInfo(faxObj, "");
	dev.requester.successHandler = SSMILib.GetFaxInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetFaxInfo.errorCb;
	
	if (SSMILib.dummy) {
		var _faxConf = new Object();
		_faxConf["IFAX"]			=	"true";
		_faxConf["G3"]				=	"true";
		_faxConf["G4"]				=	"false";
		_faxConf["LocalName"]		=	"ApeosPort-IV C3370";
		_faxConf["CompanyLogo"]		=	"FujiXerox ApeosPort";
		_faxConf["NeedRemoteID"]	=	"true";
		_faxConf["CardType"]		=	"Type2";
		SSMILib.onEvent("GetFaxInfo", true, _faxConf);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetFaxInfo.successCb = function(res)
{
	var _faxConf = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetFaxInfo", _result, _faxConf);
		return;
	}
	var _objNode = res.responseXML.getElementsByTagName("Object");
	if(_objNode.length == 0) {
		SSMILib.onEvent("GetFaxInfo", _result, _faxConf);
	}

	var _tmpFaxConf = new Array();
	var _objNodeLen = _objNode.length;
	for(var i=0; i < _objNodeLen; i++){
		_tmpFaxConf[i] = SSMILib.attrNodeToObject(_objNode[i]);
	}
		
	if(_tmpFaxConf[0]){
		_faxConf = new Object();
		_result = true;
		Extend(_faxConf, _tmpFaxConf[0]);
	}
	if(_tmpFaxConf[1]){
		Extend(_faxConf, _tmpFaxConf[1]);
	}

	SSMILib.onEvent("GetFaxInfo", _result, _faxConf);
		
	return;
};

/**
 * @private
 */
SSMILib.GetFaxInfo.errorCb = function(res)
{
	var _faxConf = null;

	SSMILib.onEvent("GetFaxInfo", false, _faxConf);

	return;
};