/** 
 * @fileoverview デバイスからアカウンティング情報を取得するためのクラス定義<br>
 * アカウンティング情報取得に関して以下のメソッドを提供する<br>
 * GetAccountConfig
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines class for retrieving accounting information from device.<br>
 * Provides the following methods for retrieving accounting information.<br>
 * GetAccountConfig
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */
 
/**
 * アカウンティング情報を取得する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves accounting information.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetAccountConfig = function()
{
	var dev = new SSMILib.DeviceInfo("AccountConfiguration", "");
	dev.requester.successHandler = SSMILib.GetAccountConfig.successCb;
	dev.requester.errorHandler = SSMILib.GetAccountConfig.errorCb;
	
	if (SSMILib.dummy) {
		var _accConf = new Object();
		_accConf["AuthenticationMode"]			=	"Remote";
		_accConf["AuditronMode"]				=	"RemoteAuthentication";
		_accConf["UserInformationLocation"]		=	"NVRAM";
		_accConf["PasswordMode"]				=	"true";
		_accConf["CopyAuditron"]				=	"true";
		_accConf["PrintAuditron"]				=	"true";
		_accConf["NoAccountUserPrint"]			=	"true";
		_accConf["ScanAuditron"]				=	"true";
		_accConf["FAXAuditron"]					=	"true";
		_accConf["UserValidation"]				=	"true";
		_accConf["UserIDDisplayString"]			=	"UserID";
		_accConf["AccountIDDisplayString"]		=	"AccountID";
		_accConf["copyLimitedColorSupported"]	=	"true";
		_accConf["printLimitedColorSupported"]	=	"true";
		_accConf["PasswordModeForAccessory"]	=	"false";
		_accConf["UseValidationServer"]			=	"true";
		_accConf["RequiredAuthInfo"]			=	"Both";
		_accConf["RemoteUserValidation"]		=	"true";
		_accConf["CaseInsensitiveUserID"]		=	"true";
		_accConf["PasswordMinLength"]			=	"0";
		SSMILib.onEvent("GetAccountConfig", true, _accConf);
		return;
	}
	
	dev.getDeviceInfo(false);
	return;
};

/**
 * @private
 */
SSMILib.GetAccountConfig.successCb = function(res)
{
	var _accConf = null;
	if(!res.responseXML) {
		SSMILib.onEvent("GetAccountConfig", false, _accConf);
		return;
	}
	_accConf = SSMILib.attrNodeToObject(res.responseXML);

	if(_accConf){
		var _result = true;
	} else {
		var _result = false;
	}
	SSMILib.onEvent("GetAccountConfig", _result, _accConf);
		
	return;
};

/**
 * @private
 */
SSMILib.GetAccountConfig.errorCb = function(res)
{
	var _accConf = null;

	SSMILib.onEvent("GetAccountConfig", false, _accConf);

	return;
};

/**
 * デバイスが認証モードか否かを判定する<br>
 * 情報が取得できた場合、認証モードなどをプロパティとして持つオブジェクトが返される<br>
 * プロパティ詳細については「01-02 SESAMi Service Management Interface Specification_Object.xls SSMI-0102 共通・属性編 AccountConfiguration」を参照
 * @param {Object} accConf GetAccountConfigメソッドで取得した、アカウンティング情報のオブジェクトを指定する
 * @returns {Bool} true デバイスが認証モードで運用されている<br>
 * 	               false デバイスが未認証モードで運用されている
 * @addon
 * @static
 * @lang ja
 */
/**
 * Determines whether device requires authentication.<br>
 * If information is successfully received, object with properties representing attributes such as authentication mode is returned.<br>
 * See 01-02 SESAMi Service Management Interface Specification_Object.xls for property details.
 * @param {Object} accConf Accounting information object retrieved using GetAccountConfig method.
 * @returns {Bool} true if device requires authentications.
 * @returns {Bool} false if device does not require authentications.
 * @addon
 * @static
 * @lang en
 */

SSMILib.isDeviceAuth = function(accConf)
{
	var _isAuth = false;
	
	if(accConf && accConf.AuthenticationMode && accConf.AuthenticationMode != "Off"){
		return true;
	} else {
		return false;
	}
};