/**
 * @fileoverview デバイスからTCP/IP情報を取得するためのクラス定義<br>
 * TCP/IP情報取得に関して以下のメソッドを提供する<br>
 * GetTcpIpInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/**
 * @fileoverview Defines classes for retrieving TCP/IP setting information from device. <br>
 * Provides the following methods for retrieving TCP/IP setting information.<br>
 * GetTcpIpInfo
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */

/**
 * TCP/IP設定の情報を取得する。<br>
 * 情報取得に成功すると、TCP/IP設定に関する情報をプロパティとしてもつオブジェクトが返される。<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102」を参照
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves TCP/IP setting information.<br>
 * If retrieval is successful, object with TCP/IP setting information as properties is returned.<br>
 * See "01-02 SESAMi Service Management Interface Specification_Object.xls" for details.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetTcpIpInfo = function()
{
	var _obj = ["TCPIP"];
	var dev = new SSMILib.DeviceInfo(_obj, null);

	dev.requester.successHandler = SSMILib.GetTcpIpInfo.successCb;
	dev.requester.errorHandler = SSMILib.GetTcpIpInfo.errorCb;

	if (SSMILib.dummy) {
		var responseXML = new Object();

		SSMILib.onEvent("GetTcpIpInfo", true, _returnObj);
		return;
	}

	dev.getDeviceInfo(true);
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
	var _returnObj = SSMILib.attrNodeToObject(res.responseXML);

	if(_returnObj){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetTcpIpInfo", _result, _returnObj);

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
