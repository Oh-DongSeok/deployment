/**
 * @fileoverview デバイスからTCP/IP情報を取得するためのクラス定義<br>
 * TCP/IP情報取得に関して以下のメソッドを提供する<br>
 * GetTcpIpInfo<br>
 * 使用するためには
 * <ul>
 * <li>GetDeviceInfo.js
 * </ul>
 * のロードが必要となる<br>
 * <br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.2.0
 * @lang ja
 */
/**
 * @fileoverview Defines classes for retrieving TCP/IP setting information from device. <br>
 * Provides the following methods for retrieving TCP/IP setting information.<br>
 * GetTcpIpInfo
 * To use this file,
 * <ul>
 * <li>GetDeviceInfo.js
 * </ul>
 * must be loaded.<br>
 * <br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.2.0
 * @lang en
 */

/**
 * TCP/IP設定の情報を取得する。<br>
 * 情報取得に成功すると、TCP/IP設定情報、IPv6手動設定情報、IPv6自動設定アドレス、IPv6自動設定情報をプロパティとしてもつオブジェクトが返される。<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102」を参照
 * @addon
 * @static
 * @param {Bool} auth デバイスが認証モードか否かを指定する。CSLibVer 3.5.0以降有効。指定がないときはtrueが指定されたものとして動作する。
 * @lang ja
 */
/**
 * Retrieves TCP/IP setting information.<br>
 * If retrieval is successful, object that has TCP/IP setting information, IPv6 manual setting information, IPv6 auto set address, and IPv6 auto setting information as properties is returned.<br>
 * See "01-02 SESAMi Service Management Interface Specification_Object.xls" for details.
 * @addon
 * @static
 * @param {Bool} auth Specifies whether device is in authentication mode. Valid from CSLibVer 3.5.0 and later. If nothing is specified, it is deemed that true is specified.
 * @lang en
 */
SSMILib.GetTcpIpInfo = function(auth)
{
	//AR149790(IpV6対応) Start
	var _obj = ["TCPIP","IPv6ManualConfig","IPv6AutoAddress","IPv6AutoAddress","IPv6AutoAddress","IPv6AutoInfo"];
	var _identifier = [, ,1,2,3, , , ];
	//AR149790(IpV6対応) End

	var dev = new SSMILib.DeviceInfo(_obj, null);
	dev.identifier = _identifier;
	dev.requester.successHandler = SSMILib.GetTcpIpInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetTcpIpInfo.errorCb;

	if (SSMILib.dummy) {
		var _returnObj = new Object();

		SSMILib.onEvent("GetTcpIpInfo", true, _returnObj);
		return;
	}

	if (auth === null || auth === undefined)
		dev.getDeviceInfo(true);
	else
		dev.getDeviceInfo(auth);

	return;
};

/**
 * @private
 */
SSMILib.GetTcpIpInfo.successCb = function(res)
{
	if(!res.responseXML) {
		SSMILib.onEvent("GetTcpIpInfo", false, null);
		return;
	}
	var _result = false;
	var _tcpIpInfoSet = new Array(); //AR149790(IpV6対応)
	var _objNodes = res.responseXML.getElementsByTagName("Object");
	for (var i = 0; i < _objNodes.length; i++) {
		var _node = _objNodes.item(i);
		if (_node.hasChildNodes()) {
			_tcpIpInfoSet[i] = SSMILib.attrNodeToObject(_node);
		}
	}

	if(_tcpIpInfoSet.length){
		_result = true;
	} else {
		_result = false;
	}
	SSMILib.onEvent("GetTcpIpInfo", _result, _tcpIpInfoSet);

	return;
};

/**
 * @private
 */
SSMILib.GetTcpIpInfo.errorCb = function(res)
{
	var _returnObj = null;

	SSMILib.onEvent("GetTcpIpInfo", false, _returnObj);

	return;
};

