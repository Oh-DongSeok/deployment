/** 
 * @fileoverview デバイスから主情報を取得するためのクラス定義<br>
 * 主情報取得に関して以下のメソッドを提供する<br>
 * GetRoot, GetProductInformation, GetSystemInformation
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines class for retrieving root information from device.<br>
 * Provides the following methods for retrieving root information.<br>
 * GetRoot, GetProductInformation, GetSystemInformation
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * root情報を取得する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves root information.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetRoot = function()
{
	var dev = new SSMILib.DeviceInfo("root", "");
	dev.requester.successHandler = SSMILib.GetRoot.successCb;
	dev.requester.errorHandler = SSMILib.GetRoot.errorCb;

	if (SSMILib.dummy) {
		var responseXML = new Object();

		_returnObj["Type"]			=	"RAM";
		_returnObj["Size"]				=	"2097152";
		SSMILib.onEvent("GetRoot", true, _returnObj);
		return;
	}

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetRoot.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetRoot", false, null);
		return;
	}
	var _returnObj = SSMILib.attrNodeToObject(res.responseXML);

	if(_returnObj){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetRoot", _result, _returnObj);

	return;
};

/**
 * @private
 */
SSMILib.GetRoot.errorCb = function(res)
{
	var _returnObj = null;

	SSMILib.onEvent("GetRoot", false, _returnObj);

	return;
};

/**
 * 商品情報を取得する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves product information.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetProductInformation = function()
{
	var dev = new SSMILib.DeviceInfo("productInformation", "");
	dev.requester.successHandler = SSMILib.GetProductInformation.successCb;
	dev.requester.errorHandler = SSMILib.GetProductInformation.errorCb;

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetProductInformation.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetProductInformation", false, null);
		return;
	}
	var _returnObj = SSMILib.attrNodeToObject(res.responseXML);

	if(_returnObj){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetProductInformation", _result, _returnObj);

	return;
};

/**
 * @private
 */
SSMILib.GetProductInformation.errorCb = function(res)
{
	var _returnObj = null;

	SSMILib.onEvent("GetProductInformation", false, _returnObj);

	return;
};

/**
 * システム情報を取得する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves system information.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetSystemInformation = function()
{
	var dev = new SSMILib.DeviceInfo("systemInformation", "");
	dev.requester.successHandler = SSMILib.GetSystemInformation.successCb;
	dev.requester.errorHandler = SSMILib.GetSystemInformation.errorCb;

	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetSystemInformation.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetSystemInformation", false, null);
		return;
	}
	var _returnObj = SSMILib.attrNodeToObject(res.responseXML);

	if(_returnObj){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetSystemInformation", _result, _returnObj);

	return;
};

/**
 * @private
 */
SSMILib.GetSystemInformation.errorCb = function(res)
{
	var _returnObj = null;

	SSMILib.onEvent("GetSystemInformation", false, _returnObj);

	return;
};

