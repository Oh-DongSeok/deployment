/** 
 * @fileoverview アドレス帳情報取得のためのクラス定義<br>
 * アドレス帳情報取得に関して以下のメソッドを提供する<br>
 * GetAddress<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving Address book information.<br>
 * Provides the following methods for retrieving Address book information:<br>
 * GetAddress<br><br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

/**
 * Address インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class アドレス帳情報取得のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * Creates Address instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for retrieving Address book inforamtion.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.Address = function()
{
	/**
	 *	リソース情報の取得する数を設定する
	 *	@type Int
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */	
	/**
	 *  Number of resource information sets to retrieve.
	 *	@type Int
	 *	@default None.
	 *	@private
	 *  @lang en
	 */	
	this.scopeCount = "";
	/**
	 *	リソース情報範囲の開始位置を設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */	
	/**
	 *	Start position of resource information range.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */	
	this.scopeFrom = "";
	/**
	 *	リソース情報範囲の終了位置を設定する
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */	
	/**
	 *	End position of resource information range.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */	
	this.scopeTo = "";
	/**
	 *	リソース情報の取得する識別子を設定する
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */	
	/**
	 *	Resource information identifier.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */	
	this.identifier = "";
};
/**
 * @private
 */
Extend(SSMILib.Address.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.Address.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var adrsNS	=	"http://www.fujifilm.com/fb/2021/03/ssm/management/addressBook";
	var mgtNS	=	"http://www.fujifilm.com/fb/2020/12/ssm/management";

	xml.addNSPrefix(adrsNS, "adrs");
	xml.addNSPrefix(mgtNS, "mgt");

	var _adrsNode = body.appendChild(xml.createElementNS(adrsNS, "GetAddress"));
	xml.addNSDeclaration(adrsNS, _adrsNode, true);
	
	if(this.identifier){
		var _idNode = _adrsNode.appendChild(xml.createElement("Identifier"));
		_idNode.appendChild(xml.createTextNode(this.identifier));
	}
		
	if(this.scopeFrom || this.scopeTo || this.scopeCount){
		var _scopeNode = _adrsNode.appendChild(xml.createElementNS(mgtNS, "Scope"));
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
 * アドレス帳の情報を取得する<br>
 * 情報が取得できた場合、宛先名等をプロパティとして持つオブジェクトが配列の形式で返される<br>
 * プロパティ詳細については「02-01 SESAMi Service Management Interface Specification_ServiceExtensions.doc 7.アドレス帳管理」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {Int} count 取得件数を指定する
 * @param {String} start 取得開始位置を指定する
 * @param {String} [end] 取得終了位置を指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves Address Book information.<br>
 * If information is successfully retrieved, objects representing address book properties such as destination name are returned in array form. 
 * See 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc for details on address book properties.
 * @param {Bool} auth Whether device requires authentication or not.
 * @param {Int} count Number of address book entries on which information is to be received.

 * @param {String} start Start position.
 * @param {String} [end] End position.
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetAddress = function(auth, count, start, end)
{

	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.GetAddress.successCb;
	_ws.errorHandler = SSMILib.GetAddress.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/03/ssm/management/addressBook#GetAddress"';
	_ws.isDeviceReq = true;

	if(auth){
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/AddressBook";
	} else{
		var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/AddressBook";
	}
	
	if (SSMILib.dummy) {
		var _addressList = new Array();
		_addressList = [{
			Identifier			:	"0001",
			AddressType			:	"fax",
			Name				:	"テストFAX",
			FAX					:	{
				LineType			:	"PBX",
				RecipientNumber		:	"012-345-6789"
			}
		},
		{
			Identifier			:	"0002",
			AddressType			:	"server",
			Name				:	"テストサーバ",
			Server				:	{
				Type				:	"SMB",
				Address				:	"192.168.0.1",
				Port1				:	"80",
				UserName			:	"testuser",
				Password			:	"*****",
				Volume				:	"testdir",
				Path				:	"\\\\192.168.0.1\\testdir"
			}
		}];

		SSMILib.onEvent("GetAddress", true, _addressList);
		return;
	}
	if(count <= 0){
		SSMILib.onEvent("GetAddress", false, null);
		return;
	} else if(count == 1){
		var _addrObj = new SSMILib.Address();
		_addrObj.identifier = start;
	} else {
		var _addrObj = new SSMILib.Address();
		_addrObj.scopeCount = count;
		_addrObj.scopeFrom = start;
		//_addrObj.scopeTo = start+count;
		_addrObj.scopeTo = end ? end : "";
	}

	var _msg = _addrObj.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
};
/**
 * @private
 */
SSMILib.GetAddress.successCb = function(res)
{
	var _addressList = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetAddress", _result, _addressList);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetAddressResponse");
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_addressList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _addressNode = _resNode[0].childNodes[i];

			if (_addressNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_addressNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_addressList.push(SSMILib.childNodeToProperty(_addressNode));
		}
		_result = true;
	}
	SSMILib.onEvent("GetAddress", _result, _addressList);
		
	return;
};

/**
 * @private
 */
SSMILib.GetAddress.errorCb = function(res)
{
	var _addressList = null;
	var _result = false;

	SSMILib.onEvent("GetAddress", _result, _addressList);

	return;
};
