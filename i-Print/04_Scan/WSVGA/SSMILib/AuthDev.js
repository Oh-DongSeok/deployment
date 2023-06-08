/** 
 * @fileoverview デバイスへの認証を行うためのクラス定義<br>
 * ログイン/ログアウト処理に関して以下のメソッドを提供する<br>
 * Login/Logout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for authenticating to device.<br>
 * Provides the following methods for login/logout processing:<br>
 * Login/Logout<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang en
 */
 
/**
 * Login インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class デバイスに対してログインするためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates Login instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for logging into device.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>
 * @lang en
 */
SSMILib.Login = function()
{
	/**
	 * ユーザ識別子を設定する
	 * @type String
	 * @lang ja
	 */
	/**
	 * User ID.
	 * @type String
	 * @lang en
	 */
	this.userId = "";
	/**
	 * パスワードを設定する
	 * @type String
	 * @lang ja
	 */
	/**
	 * Password.
	 * @type String
	 * @lang en
	 */
	this.password = "";
	/**
	 * 外部認証時に利用するレルムを設定する
	 * @type String
	 * @lang ja
	 */
	 /**
	 * Realm for external authentication.
	 * @type String
	 * @lang en
	 */
	this.realm = "";
	/**
	 * ゲストやCEユーザーを指定する場合設定する
	 * @type String
	 * @lang ja
	 */
	 /**
	 * Specifies guest users / Service Rep users.
	 * @type String
	 * @lang en
	 */
	this.builtinUser = "";
	/**
	 * KOを指定する場合設定する
	 * @type bool
	 * @lang ja
	 */
	 /**
	 * Specifies whether user is System Administrator.
	 * @type bool
	 * @lang en
	 */	
	this.isKeyOperator = false;
};
/**
 * @private
 */
Extend(SSMILib.Login.prototype, XMLLib.SOAPMsg.prototype);
/**
 * @private
 */
SSMILib.Login.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var localNS = "http://www.fujifilm.com/fb/2021/01/ssm/management/local";

	xml.addNSPrefix(localNS, "lcl");

	var _loginNode = body.appendChild(xml.createElementNS(localNS, "Login"));
	xml.addNSDeclaration(localNS, true);

	if(this.userId) {
		var _userNode = _loginNode.appendChild(xml.createElementNS(localNS, "UserID"));
		_userNode.appendChild(xml.createTextNode(this.userId));
		if (this.isKeyOperator) _userNode.setAttribute("hint", "KeyOperator");
	}

	var _passNode = _loginNode.appendChild(xml.createElementNS(localNS, "Password"));
	_passNode.appendChild(xml.createTextNode(this.password));
//	var _passNode = _loginNode.appendChild(xml.createElement("Password"));
//	_passNode.appendChild(xml.createTextNode(this.password));

	if(this.realm) {
		var _realmNode = _loginNode.appendChild(xml.createElement("Realm"));
		_realmNode.appendChild(xml.createTextNode(this.realm));
	}

	if(!this.userId && !this.realm && this.builtinUser) {
		var _bltinUserNode = _loginNode.appendChild(xml.createElementNS(localNS, "BuiltinUserID"));
		_bltinUserNode.appendChild(xml.createTextNode(this.builtinUser));
	}

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * デバイスに対してログインする<br>
 * userId, bltinUser両方を指定した場合、userIdの指定が優先される。
 * @param {String} userId ログインするユーザの識別子を指定する
 * @param {String} [password] ログインするユーザのパスワードを指定する<br>
 * @param {String} [realm] ログインするユーザのレルムを指定する<br>
 * @param {String} [bltinUser] ログインするユーザのビルトインユーザーを指定する<br>
 * @param {bool}   [isKeyOperator] 外部認証時、KOとしてログインする場合に指定する
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Authenticates to device.<br>
 * <br>
 * @param {String} userId User ID of user to authenticate.
 * @param {String} [password] Password of user to authenticate.<br>
 * @param {String} [realm] Realm of user to authenticate.<br>
 * @param {String} [bltinUser] Built-in user of user to authenticate.<br>
 * @param {bool}   [isKeyOperator] Whether to log in as System Administrator upon external authentication
 * @addon
 * @static
 * @lang en
 */
SSMILib.LoginDev = function(userId, password, realm, bltinUser, isKeyOperator)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.LoginDev.successCb;
	_ws.errorHandler = SSMILib.LoginDev.errorCb;
	//_ws.timeoutHandler = SSMILib.LoginDev.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/local#Login"';
	_ws.isDeviceReq = true;
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Local";

	if (SSMILib.dummy) {
		SSMILib.onEvent("LoginDev", true, null);
		return;
	}
	
	var _loginObj = new SSMILib.Login();
	_loginObj.userId = userId ? userId : "";
	_loginObj.password = password ? password : "";
	_loginObj.realm = realm ? realm : "";
	_loginObj.builtinUser = bltinUser ? bltinUser : "";
	_loginObj.isKeyOperator = isKeyOperator ? isKeyOperator : false;
//	_loginObj.bltinUser = bltinUser ? bltinUser : "";
	var _msg = _loginObj.serializeToString();

	_ws.send(_targetURL, _msg);

};
/**
 * @private
 */
SSMILib.LoginDev.successCb = function(res)
{
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("LoginDev", _result, null);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagName("LoginResponse");
	if(_resNode.length){
		_result = true;
	}
	SSMILib.onEvent("LoginDev", _result, null);

	return
};
/**
 * @private
 */
SSMILib.LoginDev.errorCb = function(res)
{
	SSMILib.onEvent("LoginDev", false, null);

	return
};

/**
 * Logout インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class デバイスの認証からログアウトするためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
 /**
 * Creates Logout instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for logging out from device.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.Logout = function(){};
/**
 * @private
 */
Extend(SSMILib.Logout.prototype, XMLLib.SOAPMsg.prototype);
/**
 * @private
 */
SSMILib.Logout.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var localNS = "http://www.fujifilm.com/fb/2021/01/ssm/management/local";

	xml.addNSPrefix(localNS, "lcl");

	var _loginNode = body.appendChild(xml.createElementNS(localNS, "Logout"));
	xml.addNSDeclaration(localNS, true);

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * デバイスからログアウトする<br>
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Log out from device.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.LogoutDev = function()
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.LogoutDev.successCb;
	_ws.errorHandler = SSMILib.LogoutDev.errorCb;
	//_ws.timeoutHandler = SSMILib.LogoutDev.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/local#Logout"';
	_ws.isDeviceReq = true;
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Local";

	if (SSMILib.dummy) {
		SSMILib.onEvent("LogoutDev", true, null);
		return;
	}
	
	var _logoutObj = new SSMILib.Logout();
	var _msg = _logoutObj.serializeToString();
	_ws.send(_targetURL, _msg);
};
/**
 * @private
 */
SSMILib.LogoutDev.successCb = function(res)
{
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("LogoutDev", _result, null);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagName("LogoutResponse");
	if(_resNode.length){
		_result = true;
	}
	SSMILib.onEvent("LogoutDev", _result, null);

	return
};
SSMILib.LogoutDev.errorCb = function(res)
{
	SSMILib.onEvent("LogoutDev", false, null);

	return
};

/**
 * AuthStatus インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class デバイスの認証状態を取得するためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
 /**
 * Creates AuthStatus instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving device authentication status.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.AuthStatus = function(){};
/**
 * @private
 */
Extend(SSMILib.AuthStatus.prototype, XMLLib.SOAPMsg.prototype);
/**
 * @private
 */
SSMILib.AuthStatus.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var local2NS = "http://www.fujifilm.com/fb/2021/02/ssm/management/local";

	xml.addNSPrefix(local2NS, "lcl2");

	var _loginNode = body.appendChild(xml.createElementNS(local2NS, "GetAuthenticationStatus"));
	xml.addNSDeclaration(local2NS, true);

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * デバイスの認証状態を取得する<br>
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves device authentication status.<br>
 * @param {Bool} auth Whether device requires authentication or not.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetAuthStatus = function(auth)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetAuthStatus.successCb;
	_ws.errorHandler = SSMILib.GetAuthStatus.errorCb;
	//_ws.timeoutHandler = SSMILib.LogoutDev.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/02/ssm/management/local#GetAuthenticationStatus"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Local";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Local";
	}

	if (SSMILib.dummy) {
		var _authStsObj = new Object();
		_authStsObj["Status"] = "success";
		_authStsObj["User"] = {
			"UserID"	:	"0001",
			"ICCardID"	:	"0000001",
			"CardID"	:	"0000001"
		};
		
		SSMILib.onEvent("GetAuthStatus", true, _authStsObj);
		return;
	}
	
	var _authSts = new SSMILib.AuthStatus();
	var _msg = _authSts.serializeToString();
	_ws.send(_targetURL, _msg);
};
/**
 * @private
 */
SSMILib.GetAuthStatus.successCb = function(res)
{
	var _authStsObj = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetAuthStatus", _result, _authStsObj);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetAuthenticationStatusResponse");
	if(_resNode &&_resNode.length && _resNode[0].hasChildNodes()){
		_authStsObj = SSMILib.childNodeToProperty(_resNode[0]);
		_result = true;
	}
	SSMILib.onEvent("GetAuthStatus", _result, _authStsObj);


};
/**
 * @private
 */
SSMILib.GetAuthStatus.errorCb = function(res)
{
	SSMILib.onEvent("GetAuthStatus", false, null);

	return
};
