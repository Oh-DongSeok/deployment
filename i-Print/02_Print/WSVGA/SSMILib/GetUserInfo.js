/** 
 * @fileoverview デバイスからユーザの詳細情報を取得するためのクラス定義<br>
 * ユーザの詳細情報取得に関して以下のメソッドを提供する<br>
 * GetUserInfo<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving user information details from device.<br>
 * Provides the following methods for retrieving user informatio details.<br>
 * GetUserInfo<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */
 
 /**
 * UserInfo インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class ユーザの詳細情報取得のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates UserInfo instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving user information details.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */

SSMILib.UserInfo = function()
{
	/**
	 *	取得するユーザを設定する
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	 /**
	 *	User on whom to retrieve information details.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.userId = "";
	/**
	 *	取得する情報のキーを設定する
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	 /**
	 *	Key of information to retrieve.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.respond = "";
	/**
	 *	リソース情報の取得する数を設定する
	 *	@type Int
	 *	@default null
	 *  @lang ja
	 */	
	 /**
	 *	Number of resource information sets to retrieve.
	 *	@type Int
	 *	@default null
	 *  @lang en
	 */	
	this.scopeCount = "";
	/**
	 *	リソース情報範囲の開始位置を設定する。
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	 /**
	 *	Start position of resource information range.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.scopeFrom = "";
	/**
	 *	リソース情報範囲の終了位置を設定する
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	 /**
	 *	End position of resource information range.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.scopeTo = "";
};

/**
 * @private
 */
Extend(SSMILib.UserInfo.prototype, XMLLib.SOAPMsg.prototype);
//SSMIの名前空間定義

/**
 * @private
 */
SSMILib.UserInfo.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mgtNS	=	"http://www.fujifilm.com/fb/2020/12/ssm/management";
	var userNS	=	"http://www.fujifilm.com/fb/2021/01/ssm/management/user";
	var usiNS	=	"http://www.fujifilm.com/fb/2021/01/ssm/management/user/information";

	xml.addNSPrefix(usiNS, "usi");
	xml.addNSPrefix(mgtNS, "mgt");

	var _usiNode = body.appendChild(xml.createElementNS(usiNS, "GetUserInformation" ));
	xml.addNSDeclaration(usiNS, _usiNode, true);

	if(this.userId){
		var _usrNode = _usiNode.appendChild(xml.createElement("UserID"));
		_usrNode.appendChild(xml.createTextNode(this.userId));
	} else {
		if(this.scopeFrom || this.scopeTo || this.scopeCount){
			var _scopeNode = _usiNode.appendChild(xml.createElementNS(mgtNS, "Scope"));
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
	}

	if(this.respond){
		var _respondNode = _usiNode.appendChild(xml.createElementNS(usiNS, "Respond"));
		_respondNode.appendChild(xml.createElement(this.respond));
	}

	env.appendChild(body);

	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * ログイン中のユーザの詳細情報を取得する
 * 情報が取得できた場合、レルム等をプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「02-01 SESAMi Service Management Interface Specification_ServiceExtensions.doc 5.ユーザ情報管理」を参照
 * @param {String} [start] 取得する対象のユーザ識別子、もしくは取得開始位置を指定する<br>指定がない場合は取得可能なユーザ全てを対象とする
 * @param {String} [key] 取得する情報の要素名を指定する
 * @param {String} [count] 取得件数を指定する
 * @param {String} [end] 取得終了位置を指定する
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Retrieves detailed information on authenticated user.
 * If information is successfully received, objects with properties representing attributes such as realm is returned. <br>
 * See 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc for property details.
 * @param {String} [start] User ID or start position of information retrieval.<br>If none is specified, information on all users that can be retrieved is retrieved.
 * @param {String} [key] Name of element representing attribute information to be retrieved.
 * @param {String} [count] Number of users on whom information is to be retrived.s
 * @param {String} [end] End position.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetUserInfo = function(start, key, count, end)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetUserInfo.successCb;
	_ws.errorHandler = SSMILib.GetUserInfo.errorCb;
	//_ws.timeoutHandler = SSMILib.GetUserInfo.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/user/information#GetUserInformation"';
	_ws.isDeviceReq = true;
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/UserInformation";

	if (SSMILib.dummy) {
		var _userInfoList = new Array();
		_userInfoList[0] = {
			UserID						:	"0001",
			AuthorizedRightForInternal	:	[{
				Service					:	"copy",
				ColorModeRestriction	:	"noRestriction",
				ImpressionsLimit		:	[{
					colorMode			:	"color",
					value				:	"9999999"
				},
				{
					colorMode			:	"monochrome",
					value				:	"9999999"
				}]
			}],
			AccountRecord				:	{
				CopyRecord : {
					Sheets				:	"2",
					Impressions			:	[{
						colorMode		:	"color",
						value			:	"1"
					},
					{
						colorMode		:	"monochrome",
						value			:	"1"
					}]
				}
			},
			UserNameForPoolService		:	"",
			MailAddress					:	"",
			Accounting					:	{
				UserID					:	"0001",
				AccountID				:	""
			}
		};
		SSMILib.onEvent("GetUserInfo", true, _userInfoList);
		return;
	}
	var _usiObj = new SSMILib.UserInfo();


	if(count <= 0){
		SSMILib.onEvent("GetUserInfo", false, null);
		return;
	} else if(count == 1){
		_usiObj.userId = start;
	} else {
		var _usiObj = new SSMILib.UserInfo();
		_usiObj.scopeCount = count;
		_usiObj.scopeFrom = start;
		_usiObj.scopeTo = end ? end : "";
	}

	_usiObj.respond = key ? key : "";

	var _msg = _usiObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.GetUserInfo.successCb = function(res)
{
	var _userInfoList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetUserInfo", _result, _userInfoList);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetUserInformationResponse");
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_userInfoList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _userNode = _resNode[0].childNodes[i];

			if (_userNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_userNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_userInfoList.push(SSMILib.GetUserInfo.childNodeToProperty(_userNode));
		}
		_result = true;
	}

	SSMILib.onEvent("GetUserInfo", _result, _userInfoList);
};

/**
 * @private
 */
SSMILib.GetUserInfo.errorCb = function(res)
{
	var _userInfoList = null;
	SSMILib.onEvent("GetUserInfo", false, _userInfoList);
};

/**
 * 指定したノードからオブジェクトを再帰的に生成する(GetUserInfo用)
 * 同名の要素が複数ある場合はその要素名の配列が生成され、値はvalueというプロパティで生成される。
 * @example
 * &lt;Parent&gt;&lt;Child number="1"&gt;val1&lt;/Child&gt;&lt;Child number="2"&gt;val2&lt;/Child&gt;&lt;/Parent&gt;という要素は以下のオブジェクトとなる。<br>
 * var parent = Child : [{number: "1", value: "val1"}, {number: "2", value: "val2"}];
 * @param {Node} node ノードを指定する
 * @returns {Object} XML形式のレスポンスを要素/属性をプロパティとして持つオブジェクトに変換
 * @addon
 * @static
 * @private
 * @lang ja
 */
 /**
 * Recursively creates objects from specified node (for GetUserInfo).
 * If multiple elements with the same name exist, array is created for elements of that name and value is represented by "value" property.
 * @example
 * Element:<br>
 * &lt;Parent&gt;&lt;Child number="1"&gt;val1&lt;/Child&gt;&lt;Child number="2"&gt;val2&lt;/Child&gt;&lt;/Parent&gt;<br>
 * Returned object: <br>
 * var parent = Child : [{number: "1", value: "val1"}, {number: "2", value: "val2"}];
 * @param {Node} node Node
 * @returns {Object} Object converted from XML response, with properties representing XML elements/attributes.
 * @addon
 * @static
 * @private
 * @lang en
 */
SSMILib.GetUserInfo.childNodeToProperty = function(node)
{
	var _aryNodeName = null;
	var _aryIndex = 0;

	if(!node){
		return "";
	}
	var _childNodeLen = node.childNodes.length;
	if(_childNodeLen==1 && node.firstChild && node.firstChild.nodeType == 3){ //TEXT_NODE
		if(node.attributes.length){
			var _object = new Object();
			var _attrLen = node.attributes.length;
			for(var j=0; j < _attrLen; j++){
				_object[node.attributes[j].nodeName] = node.attributes[j].nodeValue;
			}
			_object["value"] = node.firstChild.nodeValue;
			return _object;
		} else {
			return node.firstChild.nodeValue;
		}
	} else {
		var _childNode = null;
		var _childNodeName = null;
		var _object = new Object();
		for(var i=0; i < _childNodeLen; i++){
			_childNode = node.childNodes[i];
			_childNodeName = _childNode.nodeName;
			if(_childNode.nodeType == 1 && _childNodeName){ //ELEMENT_NODE
				if(_childNodeName != _aryNodeName){
					if(node.childNodes[i+1] && node.childNodes[i+1].nodeName == _childNodeName){
						_aryNodeName = _childNodeName;
						_object[_aryNodeName] = new Array();
					} else {
						_aryNodeName = null;
						_aryIndex = 0;
					}
				}
				//子ノードがある場合は、再帰処理し、ない場合は、値が空のプロパティを生成
				if(_childNodeName == _aryNodeName){
					_object[_aryNodeName][_aryIndex++] = _childNode.firstChild ? SSMILib.GetUserInfo.childNodeToProperty(_childNode) : "";
				} else {
					_object[_childNodeName] = _childNode.firstChild ? SSMILib.GetUserInfo.childNodeToProperty(_childNode) : "";
				}
			}
		}
		if(node.attributes.length){
			var _attrLen = node.attributes.length;
			for(var j=0; j < _attrLen; j++){
				if(node.attributes[j].nodeName != "xmlns"){
					_object[node.attributes[j].nodeName] = node.attributes[j].nodeValue;
				}
			}
		}
		return _object;
	}
};

/**
 * @private
 */
SSMILib.GetUserInfo.getImpression = function(obj, service, color, postProcess)
{
	var impression = obj["AccountRecord"][service]["Impressions"];
	var impressiosLen = impression.length;
	for(var i=0; i< impressiosLen; i++){
		if(impression[i]["colorMode"] == color){
			if(postProcess) {
				if(impression[i]["postProcessing"] == postProcess){
					return impression[i]["value"];
				}
			} else {
				return impression[i]["value"];
			}
		}
	}

	return null;
};
/**
 * @private
 */
SSMILib.GetUserInfo.getImpressionLimit = function(obj, service, color)
{
	var authInternal = obj["AuthorizedRightForInternal"];
	var authInternalLen = authInternal.length;
	for(var i=0; i< authInternalLen; i++){
		var authObj = obj["AuthorizedRightForInternal"][i];
		if(authObj["Service"] == service) {
			for(var j=0; j < 2; j++) {
				var impressionsLimit = authObj["ImpressionsLimit"][j];
				if(impressionsLimit["colorMode"] == color){
					return impressionsLimit["value"];
				}
			}
		}
	}

	return null;
};
