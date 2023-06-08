/** 
 * @fileoverview デバイスからアドレス帳管理情報を取得するためのクラス定義<br>
 * アドレス帳管理情報取得に関して以下のメソッドを提供する<br>
 * GetAdrsBookMgtInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving Address Book management information from device.<br>
 * Provides the following methods for retrieving Address Book management information.<br>
 * GetAdrsBookMgtInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */
 
/**
 * アドレス帳管理情報を取得する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Address Book management information.<br>
 * @addon
 * @static
 * @lang en
 */

SSMILib.GetAdrsBookMgtInfo = function()
{
	var dev = new SSMILib.DeviceInfo("addressBookManagementService", "");
	dev.requester.successHandler = SSMILib.GetAdrsBookMgtInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetAdrsBookMgtInfo.errorCb;
	
	if (SSMILib.dummy) {
		var _addrBookInfo = new Object();
		_addrBookInfo["MaxCount"]					=	999;
		_addrBookInfo["CurrentCount"]				=	300;
		_addrBookInfo["EditableByUser"]				=	true;
		SSMILib.onEvent("GetAdrsBookMgtInfo", true, _addrBookInfo);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetAdrsBookMgtInfo.successCb = function(res)
{
	var _addrBookInfo = null;
	if(!res.responseXML) {
		SSMILib.onEvent("GetAdrsBookMgtInfo", false, _addrBookInfo);
		return;
	}
	_addrBookInfo = SSMILib.attrNodeToObject(res.responseXML);

	if(_addrBookInfo){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetAdrsBookMgtInfo", _result, _addrBookInfo);
		
	return;
};

/**
 * @private
 */
SSMILib.GetAdrsBookMgtInfo.errorCb = function(res)
{
	var _addrBookInfo = null;

	SSMILib.onEvent("GetAdrsBookMgtInfo", false, _addrBookInfo);

	return;
};