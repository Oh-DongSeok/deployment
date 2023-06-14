 /** 
 * @fileoverview デバイスからプリンター構成を取得するためのクラス定義<br>
 * プリンター構成取得に関して以下のメソッドを提供する<br>
 * GetPrinterCapability<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */

/** 
 * @fileoverview Defines classes for retrievingi printer configuration information from device.<br>
 * Provides the following methods for retrieving printer configuration information:<br>
 * GetPrinterCapability<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */


/**
 * プリンター構成を取得する<br>
 * 情報が取得できた場合、カラー印刷可否などをプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 printerCapability」を参照
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves printer configuration.<br>
 * If information is successfully received, object with properties representing attributes such as Color print capability is returned. <br
 * See 01-02 SESAMi Service Management Interface Specification_Object.xls for property details.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetPrinterCapability = function()
{
	var dev = new SSMILib.DeviceInfo("printerCapability", "");
	dev.requester.successHandler = SSMILib.GetPrinterCapability.successCb;
	dev.requester.errorHandler = SSMILib.GetPrinterCapability.errorCb;
	
	if (SSMILib.dummy) {
		var _prtConf = new Object();

		_prtConf["ColorMode"]			=	"color";
		_prtConf["Duplex"]				=	"true";
		_prtConf["Punch"]				=	"true";
		_prtConf["Staple"]				=	"true";
		_prtConf["Sorter"]				=	"true";
		_prtConf["Mailbox"]				=	"false";
		_prtConf["OffsetCatchTray"]		=	"false";
		_prtConf["SideTray"]			=	"false";
		_prtConf["Stacker"]				=	"false";
		_prtConf["SecondaryCenterTray"]	=	"false";
		_prtConf["MSI"]					=	"true";
		SSMILib.onEvent("GetPrinterCapability", true, _prtConf);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetPrinterCapability.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetPrinterCapability", false, null);
		return;
	}
	var _prtConf = SSMILib.attrNodeToObject(res.responseXML);
	
	if(_prtConf){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetPrinterCapability", _result, _prtConf);
		
	return;
};

/**
 * @private
 */
SSMILib.GetPrinterCapability.errorCb = function(res)
{
	var _prtConf = null;

	SSMILib.onEvent("GetPrinterCapability", false, _prtConf);

	return;
};
/*
SSMILib.GetPrinterCapability._isNeedInfo = function(name)
{
	switch(name)
	{
		case "ColorMode":
		case "Duplex":
		case "Punch":
		case "Staple":
		case "Sorter":
		case "Mailbox":
		case "OffsetCatchTray":
		case "SideTray":
		case "Stacker":
		case "SecondaryCenterTray":
		case "MSI":
			return true;
		
		default:
			return false;
	}
}
*/
