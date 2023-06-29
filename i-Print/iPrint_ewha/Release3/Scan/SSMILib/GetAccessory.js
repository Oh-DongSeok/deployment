/** 
 * @fileoverview デバイスからアクセサリ情報を取得するためのクラス定義<br>
 * アクセサリ情報取得に関して以下のメソッドを提供する<br>
 * GetAccessory
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving Accessory information from device.<br>
 * Provides the following for retrieving Accessory information:<br>
 * GetAccessory
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */

/**
 * アクセサリを取得する<br>
 * @param {String/Array} serviceName サービス名称を表す定数を指定する。配列での指定も可。
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves Accessory information.<br>
 * @param {String/Array} serviceName Constant representing service name. May be specified as array.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetAccessory = function(identifier)
{
	var _obj = null;
	var _identifier = null;
/*
	var dev = new SSMILib.DeviceInfo("", "");
	if(!identifier){

		dev.obj = "AccessoryCollection";
		//全てのアクセサリ情報を取得する
		dev.requester.successHandler = function(res) {
			var _accessoryList = null;
			var _result = false;
			if(!res.responseXML) {
				SSMILib.onEvent("GetAccessory", _result, _accessoryList);
				return;
			}
			var _attrNode = res.responseXML.getElementsByTagName("Attribute");
			if(_attrNode.length == 0) {
				SSMILib.onEvent("GetAccessory", _result, _accessoryList);
				return;
			}
			var _attrName = _attrNode[0].getAttribute("name");
			if(_attrName != "Count") {
				SSMILib.onEvent("GetAccessory", _result, _accessoryList);
				return;
			}
			if(_attrNode[0].firstChild) {
				var _count = _attrNode[0].firstChild.nodeValue;
			} else {
				SSMILib.onEvent("GetAccessory", _result, _accessoryList);
				return;
			}

			_obj = new Array();
			_identifier = new Array();
			for(var i=1; i<= _count; i++){
				_obj.push("Accessory");
				_identifier.push(serviceName[i]);
				dev.requester.successHandler = SSMILib.GetAccessory.successCb;
				dev.requester.errorHandler = SSMILib.GetAccessory.errorCb;
				var dev = new SSMILib.DeviceInfo(_obj, "");
				dev.identifier = _identifier;
			}
			if(SSMILib.dummy) {
				var _accessoryList = new Array();
				_accessoryList[0].Name = "IC_CARD_BOX";
				_accessoryList[0].ProductCode = "T1234567";
				_accessoryList[0].SoftwareVersion = "001.000.003";
				_accessoryList[0].InUse = true;
				SSMILib.onEvent("GetAccessory", true, _accessoryList);
				return;
			}
			dev.getDeviceInfo(false);
			return;
		};
		return;
	} else {
		dev.obj = "Accessory";
		dev.identifier = identifier;
		dev.requester.successHandler = SSMILib.GetAccessory.successCb;
	}
*/
	var dev = new SSMILib.DeviceInfo("Accessory", "");
	dev.identifier = identifier;
	if (SSMILib.dummy) {
		var _accessoryList = new Array();
		_accessoryList[0] = {Name : "VOICE_NAVI", ProductCode : "T2345678", SoftwareVersion : "001.000.000", InUse : true};
		_accessoryList[1] = {Name : "IC_CARD_BOX", ProductCode : "T1234567", SoftwareVersion : "001.000.003", InUse : true};
		SSMILib.onEvent("GetAccessory", true, _accessoryList);
		return;
	}
	
	dev.requester.successHandler = SSMILib.GetAccessory.successCb;
	dev.requester.errorHandler = SSMILib.GetAccessory.errorCb;
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetAccessory.successCb = function(res)
{
	var _accessoryList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetAccessory", _result, _accessoryList);
		return;
	}
	var _objNode = res.responseXML.getElementsByTagName("Object");
	if(!_objNode || _objNode.length == 0) {
		SSMILib.onEvent("GetAccessory", _result, _accessoryList);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetAttributeResponse");
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_accessoryList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _accessoryNode = _resNode[0].childNodes[i];

			if (_accessoryNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_accessoryNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_accessoryList.push(SSMILib.attrNodeToObject(_accessoryNode));
		}
		_result = true;
	}

	SSMILib.onEvent("GetAccessory", _result, _accessoryList);
	return;
};

/**
 * @private
 */
SSMILib.GetAccessory.errorCb = function(res)
{
	var _accessoryList = null;

	SSMILib.onEvent("GetAccessory", false, _accessoryList);

	return;
};