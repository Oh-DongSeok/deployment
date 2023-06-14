/** 
 * @fileoverview デバイスからファクスG3IDを取得するためのクラス定義<br>
 * ファクスG3ID取得に関して以下のメソッドを提供する<br>
 * GetG3Channels
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving G3ID from device.<br>
 * Provides the following methods for retrieving Fax G3ID:<br>
 * GetG3Channels
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * ファクスG3IDを取得する<br>
 * 情報が取得できた場合、G3IDをプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 fax_G3Channel」を参照
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves Fax G3ID. <br>
 * If information is successfully retreived, object holding G3ID information is returned. <br>
 * See 01-02 SESAMi Service Management Interface Specification_Object.xls for property details.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetG3Channels = function()
{
	var _obj = new Array();
	var _identifier = new Array();
	for(var i=1; i<SSMILib.MAX_G3CHANNEL; i++){
		_obj.push("fax_G3Channel");
		_identifier.push(i);
	}
	var dev = new SSMILib.DeviceInfo(_obj, "");
	dev.identifier = _identifier;
	dev.requester.successHandler = SSMILib.GetG3Channels.successCb;
	dev.requester.errorHandler = SSMILib.GetG3Channels.errorCb;
	
	if (SSMILib.dummy) {
		var _faxG3IDList = new Object();
		_faxG3IDList[0]	=	{ID: "0123456789"};
		_faxG3IDList[1]	=	{ID: "0129876543"};
		SSMILib.onEvent("GetG3Channels", true, _faxG3IDList);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};
/**
 * @private
 */
SSMILib.MAX_G3CHANNEL = 7;

/**
 * @private
 */
SSMILib.GetG3Channels.successCb = function(res)
{
	var _faxG3IDList = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("GetG3Channels", _result, _faxG3IDList);
		return;
	}
	var _objNode = res.responseXML.getElementsByTagName("Object");
	if(_objNode.length == 0) {
		SSMILib.onEvent("GetG3Channels", _result, _faxG3IDList);
	}

	_faxG3IDList = new Array();
	var _objNodeLen = _objNode.length;
	for(var i=0; i < _objNodeLen; i++){
		_faxG3IDList[i] = SSMILib.attrNodeToObject(_objNode[i]);
	}
	if(_faxG3IDList.length){
		_result = true;
	}
	SSMILib.onEvent("GetG3Channels", _result, _faxG3IDList);
		
	return;
};

/**
 * @private
 */
SSMILib.GetG3Channels.errorCb = function(res)
{
	var _faxG3IDList = null;

	SSMILib.onEvent("GetG3Channels", false, _faxG3IDList);

	return;
};
