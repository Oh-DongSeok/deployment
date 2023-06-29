/** 
 * @fileoverview デバイスからトレイ情報を取得するためのクラス定義<br>
 * トレイ情報取得に関して以下のメソッドを提供する<br>
 * GetTrayInfo
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving Tray information from device.<br>
 * Provides the following methods for retrieving Tray information:<br>
 * GetTrayInfo
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

 /**
 * トレイ情報を取得する<br>
 * If information is 情報が取得できた場合、トレイごとにサイズ等をプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 PaperTray」を参照
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Tray information.<br>
 * If information is successfully received, objects with properties representing attributes such as paper size is returned. These objects are created per Tray and returned as an array. <br>
 * See 01-02 SESAMi Service Management Interface Specification_Object.xls for property details.
 * @addon
 * @static
 * @lang en
 */

SSMILib.GetTrayInfo = function()
{
	var _obj = ["PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray","PaperTray"];
	//var _identifier = [6,7,1,2,3,4,5,8];
	var _identifier = [1,2,3,4,5,6,7,8];

	var dev = new SSMILib.DeviceInfo(_obj, null);
	dev.identifier = _identifier;
	dev.requester.successHandler = SSMILib.GetTrayInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetTrayInfo.errorCb;
	
	if (SSMILib.dummy) {
		var _trayCollect = new Array();
		_trayCollect[0] = {Status:"READY", MediumSize:"A4", FeedDirection:"LEF", CurrentLevel: "25", Name:"TRAY1"};
		_trayCollect[1] = {Status:"READY", MediumSize:"A4", FeedDirection:"SEF", CurrentLevel: "100", Name:"TRAY2"};
		_trayCollect[2] = {Status:"READY", MediumSize:"A3", FeedDirection:"SEF", CurrentLevel: "50", Name:"TRAY3"};
		_trayCollect[3] = {Status:"EMPTY", MediumSize:"JIS_B5", FeedDirection:"LEF", CurrentLevel: "0", Name:"TRAY4"};
		_trayCollect[4] = {Status:"READY", MediumSize:"Unknown", FeedDirection:"Unknown", CurrentLevel: "-2", Name:"TRAY5(Bypass)"};
		_trayCollect[5] = {Status:"READY", MediumSize:"A4", FeedDirection:"SEF", CurrentLevel: "100", Name:"TRAY6"};
		_trayCollect[6] = {Status:"READY", MediumSize:"A5", FeedDirection:"LEF", CurrentLevel: "100", Name:"TRAY7"};
		_trayCollect[7] = {Status:"NOTEXIST", MediumSize:"Unknown", FeedDirection:"Unknown", CurrentLevel: "-2", Name:""};

		SSMILib.onEvent("GetTrayInfo", true, _trayCollect);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetTrayInfo.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetTrayInfo", false, null);
		return;
	}

	var _trayCollect = new Array();
	var _objNodes = res.responseXML.getElementsByTagName("Object");
	for (var i = 0; i < _objNodes.length; i++) {
		var _trayNode = _objNodes.item(i);
		if (_trayNode.hasChildNodes()) {
			_trayCollect[i] = SSMILib.attrNodeToObject(_trayNode);
		}
	}
	SSMILib.onEvent("GetTrayInfo", true, _trayCollect);
		
	return;
};

/**
 * @private
 */
SSMILib.GetTrayInfo.errorCb = function(res)
{
	var _trayCollect = null;

	SSMILib.onEvent("GetTrayInfo", false, _trayCollect);

	return;
};
