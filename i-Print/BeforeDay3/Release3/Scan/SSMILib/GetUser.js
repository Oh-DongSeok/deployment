/** 
 * @fileoverview デバイスからユーザの基本情報を取得するためのクラス定義<br>
 * ログイン中のユーザの基本情報取得に関して以下のメソッドを提供する<br>
 * GetUser<br>
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving basic user information from device.<br>
 * Provides the following methods for retrieving basic information on currently authenticated user:<br>
 * GetUser<br>
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

 /**
 * User インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class ログイン中のユーザの基本情報取得のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates User instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class is for retrieving basic information on user currently authenticated.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */

SSMILib.User = function(){};
/**
 * @private
 */
Extend(SSMILib.User.prototype, XMLLib.SOAPMsg.prototype);
/**
 * @private
 */
SSMILib.User.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mgtNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management";
	var userNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management/user";
	var user3NS	=	"http://www.fujixerox.co.jp/2008/08/ssm/management/user";

	xml.addNSPrefix(userNS, "usr");
	xml.addNSPrefix(mgtNS, "mgt");
	xml.addNSPrefix(user3NS, "usr3");

	var userTag = body.appendChild(xml.createElementNS(userNS, "GetUser"));
	xml.addNSDeclaration(userNS, userTag, true);

	var filterTag = userTag.appendChild(xml.createElementNS(userNS, "Filters"));

	var incTag = filterTag.appendChild(xml.createElementNS(mgtNS, "Inclusion"));
	xml.addNSDeclaration(mgtNS, incTag, true);

	var loginTag = incTag.appendChild(xml.createElementNS(user3NS, "Login"));
	xml.addNSDeclaration(user3NS, loginTag, true);
	loginTag.appendChild(xml.createTextNode("true"));

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * ログイン中のユーザの基本情報を取得する<br>
 * 情報が取得できた場合、ユーザ名等をプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「02-01 SESAMi Service Management Interface Specification_ServiceExtensions.doc 4.ユーザ管理」を参照
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves basic informaiton on authenticated user. <br>
 * If information is successfully received, objects with properties representing attributes such as username are returned in array form.<br>
 See 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc for property details.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetUser = function()
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetUser.successCb;
	_ws.errorHandler = SSMILib.GetUser.errorCb;
	//_ws.timeoutHandler = SSMILib.GetUser.errorCb;
	_ws.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/user#GetUser"';
	_ws.isDeviceReq = true;
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/User";

	if (SSMILib.dummy) {
		var _userList = new Array();
		_userList[0] = {UserID:"11111", DisplayName:"Adiministrator", CardId:"11111", Index: "-1"};
		SSMILib.onEvent("GetUser", true, _userList);
		return;
	}
	
	var _userObj = new SSMILib.User();
	var _msg = _userObj.serializeToString();
	_ws.send(_targetURL, _msg);
};
/**
 * @private
 */
SSMILib.GetUser.successCb = function(res)
{
	var _userList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetUser", _result, _userList);
		return;
	}

	var _resNode = res.responseXML.getElementsByTagName("GetUserResponse");
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_userList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _userNode = _resNode[0].childNodes[i];

			if (_userNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_userNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_userList.push(SSMILib.childNodeToProperty(_userNode));
		}
		_result = true;
	}
	SSMILib.onEvent("GetUser", _result, _userList);
};
SSMILib.GetUser.errorCb = function(res)
{
	var _userList = null;
	SSMILib.onEvent("GetUser", false, _userList);
};
