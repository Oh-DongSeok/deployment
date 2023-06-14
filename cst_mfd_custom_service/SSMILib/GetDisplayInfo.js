/** 
 * @fileoverview デバイスからUIパネル情報を取得するためのクラス定義<br>
 * UIパネル情報取得に関して以下のメソッドを提供する<br>
 * GetDisplayInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving UI panel information from device.<br>
 * Provides the following methods for retrieving UI panel information:<br>
 * GetDisplayInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * UIパネル情報を取得する<br>
 * 情報が取得できた場合、パネルサイズ等をプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 Display」を参照
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves UI panel informaiton.<br>
 * If information is retrieved, object with attributes such as panel size as properties is returned.<br>
 * See "01-02 SESAMi Service Management Interface Specification_Object.xls" for property details.
 * @addon
 * @static
 * @lang en
 */
 
SSMILib.GetDisplayInfo = function()
{
	var dev = new SSMILib.DeviceInfo("Display", "");
	dev.requester.successHandler = SSMILib.GetDisplayInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetDisplayInfo.errorCb;
	
	if (SSMILib.dummy) {
		var _dispInfo = new Object();
		_dispInfo["Width"]				=	"800";
		_dispInfo["Height"]				=	"480";
		_dispInfo["Resolution"]			=	"133";
		_dispInfo["ColorDepth"]			=	"8";
	
		SSMILib.onEvent("GetDisplayInfo", true, _dispInfo);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};
/**
 * @private
 */
SSMILib.GetDisplayInfo.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetDisplayInfo", false, null);
		return;
	}
	var _dispInfo = SSMILib.attrNodeToObject(res.responseXML);
	
	if(_dispInfo){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetDisplayInfo", _result, _dispInfo);
		
	return;
};
/**
 * @private
 */
SSMILib.GetDisplayInfo.errorCb = function(res)
{
	var _dispInfo = null;

	SSMILib.onEvent("GetDisplayInfo", false, _dispInfo);

	return;
};
