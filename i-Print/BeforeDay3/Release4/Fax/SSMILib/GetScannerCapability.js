/** 
 * @fileoverview デバイスからスキャナー構成を取得するためのクラス定義<br>
 * スキャナー構成取得に関して以下のメソッドを提供する<br>
 * GetScannerCapability<br><br>
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving scanner configuration information from device.<br>
 * Provides the following methods for retrieving scanner configuration:<br>
 * GetScannerCapability<br><br>
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * スキャナー構成を取得する<br>
 * 情報が取得できた場合、両面スキャン可否などをプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 scannerCapability」を参照
 * @addon
 * @static
 * @lang ja
 */
 
 /**
 * Retrieves Scanner configuration.<br>
 * If information is successfully received, object with properties representing attributes such as Duplex scan capability is returned. 
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetScannerCapability = function()
{
	var dev = new SSMILib.DeviceInfo("scannerCapability", "");
	dev.requester.successHandler = SSMILib.GetScannerCapability.successCb;
	dev.requester.errorHandler = SSMILib.GetScannerCapability.errorCb;
	
	if (SSMILib.dummy) {
		var _scanConf = new Object();
		_scanConf["ColorMode"]			=	"color";
		_scanConf["Duplex"]				=	"true";
		_scanConf["FileFormat"]			=	"";
		SSMILib.onEvent("GetScannerCapability", true, _scanConf);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetScannerCapability.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetScannerCapability", false, null);
		return;
	}
	var _scanConf = SSMILib.attrNodeToObject(res.responseXML);
	
	if(_scanConf){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetScannerCapability", _result, _scanConf);
		
	return;
};

/**
 * @private
 */
SSMILib.GetScannerCapability.errorCb = function(res)
{
	var _scanConf = null;

	SSMILib.onEvent("GetScannerCapability", false, _scanConf);

	return;
};
/*
SSMILib.GetScannerCapability._isNeedInfo = function(name)
{
	switch(name)
	{
		case "ColorMode":
		case "Duplex":
		case "FileFormat":
			return true;
		
		default:
			return false;
	}
}
*/
