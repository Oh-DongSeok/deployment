/** 
 * @fileoverview 親展ボックス情報取得のためのクラス定義<br>
 * 親展ボックス情報取得に関して以下のメソッドを提供する<br>
 * GetMailbox<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving Mailbox information.<br>
 * Provides the following methods for retrieving Mailbox information:<br>
 * GetMailbox<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang en
 */

/**
 * Mailbox インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class 親展ボックス情報取得のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
 /**
 * Creates Mailbox instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving Mailbox information.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.Mailbox = function()
{
	/**
	 *	リソース情報の取得する数を設定する
	 *	@type Int
	 *  @lang ja
	 */	
	 /**
	 *	Number of resource information sets to retrieve.
	 *	@type Int
	 *  @lang en
	 */	
	this.scopeCount = "";
	/**
	 *	リソース情報範囲の開始位置を設定する。
	 *	@type String
	 *  @lang ja
	 */	
	 /**
	 *	Start position of resource information range.
	 *	@type String
	 *  @lang en
	 */	
	this.scopeFrom = "";
	/**
	 *	リソース情報範囲の終了位置を設定する
	 *	@type String
	 *  @lang ja
	 */	
	/**
	 *	End position of resource information range.
	 *	@type String
	 *  @lang en
	 */	
	this.scopeTo = "";
	/**
	 *	親展ボックス番号
	 *	@type String
	 *  @lang ja
	 */	
	/**
	 *	Mailbox number.
	 *	@type String
	 *  @lang en
	 */	
	this.identifier = "";
	/**
	 *	パスワード
	 *	@type String
	 *  @lang ja
	 */	
	/**
	 *	Password.
	 *	@type String
	 *  @lang en
	 */	
	this.password = "";
};
/**
 * @private
 */
Extend(SSMILib.Mailbox.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.Mailbox.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mbNS	=	"http://www.fujifilm.com/fb/2021/03/ssm/management/mailbox";
	var mgtNS	=	"http://www.fujifilm.com/fb/2020/12/ssm/management";

	xml.addNSPrefix(mbNS, "mb");
	xml.addNSPrefix(mgtNS, "mgt");

	var _getMboxNode = body.appendChild(xml.createElementNS(mbNS, "GetMailBox"));
	xml.addNSDeclaration(mbNS, _getMboxNode, true);

	if(this.identifier){
		var _mboxNode = xml.createElementNS(mbNS, "MailBox");
		var _idNode = _mboxNode.appendChild(xml.createElement("Identifier"));
		_idNode.appendChild(xml.createTextNode(this.identifier));

		if(this.password){
			var _passNode = _mboxNode.appendChild(xml.createElement("Password"));
			_passNode.appendChild(xml.createTextNode(this.password));
		}
		_getMboxNode.appendChild(_mboxNode);
	}
	
	if(this.scopeFrom || this.scopeTo || this.scopeCount){
		var _scopeNode = _getMboxNode.appendChild(xml.createElementNS(mgtNS, "Scope"));
		xml.addNSDeclaration(mgtNS, _scopeNode, true);
		if(this.scopeCount){
			_scopeNode.setAttribute("count", this.scopeCount);
		}
		if(this.scopeFrom){
			_scopeNode.setAttribute("from", this.scopeFrom);
		}
		if(this.scopeTo){
			_scopeNode.setAttribute("to", this.scopeTo);
		}
	}

	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * 親展ボックスの情報を取得する<br>
 * 情報が取得できた場合、親展ボックス名等をプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「02-01 SESAMi Service Management Interface Specification_ServiceExtensions.doc 10.親展ボックス管理」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {Int} count 取得件数を指定する
 * @param {String} start 取得開始位置を指定する
 * @param {String} [end] 取得終了位置を指定する
 * @param {String} [password] パスワードを指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Mailbox information.<br>
 * If information is successfully received, objects representing properties such as Mailbox name are returned in array form. <br>
 * If specified element has no child elements, element value is returned.<br>
 * See 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc for details on properties.
 * @param {Bool} auth Whether device requires authentication or not.
 * @param {Int} count Number of Mailboxes on which information is to be retrived.
 * @param {String} start Start position.
 * @param {String} [end] End position.
 * @param {String} [password] Password.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetMailbox = function(auth, count, start, end, password)
{

	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetMailbox.successCb;
	_ws.errorHandler = SSMILib.GetMailbox.errorCb;
	//_ws.timeoutHandler = SSMILib.GetUser.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/03/ssm/management/mailbox#GetMailBox"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/MailBox";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/MailBox";
	}

	if (SSMILib.dummy) {
		var _mboxList = new Array();
		_mboxList = [{
			Identifier				:	"1",
			Name					:	"Mailbox_001",
			Permissions				:	
			{
				Read				:	"true",
				Write				:	"true"
			},
			PasswordMode			:	"None",
			DocumentAutoDelete		:	"true",
			DocumentTimeLimitDelete	:	"true",
			Owner					:	"001",
			JobTemplateID			:	"100",
			JobTemplateAutoRun		:	"true",
			NumberOfDocument		:	"0"

		},
		{
			Identifier				:	"2",
			Name					:	"Mailbox_002",
			Permissions				:	
			{
				Read				:	"true",
				Write				:	"true"
			},
			PasswordMode			:	"Always",
			DocumentAutoDelete		:	"false",
			DocumentTimeLimitDelete	:	"false",
			Owner					:	"002",
			JobTemplateID			:	"101",
			JobTemplateAutoRun		:	"false",
			NumberOfDocument		:	"1"
		}];

		SSMILib.onEvent("GetMailbox", true, _mboxList);
		return;
	}
	if(count <= 0){
		SSMILib.onEvent("GetMailbox", false, null);
		return;
	} else if(count == 1){
		var _mboxObj = new SSMILib.Mailbox();
		_mboxObj.identifier = start;
		if(password){
			_mboxObj.password = password;
		}
	} else {
		var _mboxObj = new SSMILib.Mailbox();
		_mboxObj.scopeCount = count;
		_mboxObj.scopeFrom = start;
		//_mboxObj.scopeTo = start+count;
		if(end){
			_mboxObj.scopeTo = end;
		}
	}
	
	var _msg = _mboxObj.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
};

/**
 * @private
 */
SSMILib.GetMailbox.successCb = function(res)
{
	var _mboxList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetMailbox", _result, _mboxList);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetMailBoxResponse");
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_mboxList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _mboxNode = _resNode[0].childNodes[i];

			if (_mboxNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_mboxNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_mboxList.push(SSMILib.childNodeToProperty(_mboxNode));
		}
		_result = true;
	}
	SSMILib.onEvent("GetMailbox", _result, _mboxList);
		
	return;
};

/**
 * @private
 */
SSMILib.GetMailbox.errorCb = function(res)
{
	var _mboxList = null;
	var _result = false;

	SSMILib.onEvent("GetMailbox", _result, _mboxList);

	return;
};
