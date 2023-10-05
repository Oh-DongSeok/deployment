/**
 * @fileoverview Webサービスを呼び出すためのJavaScriptライブラリ<br>
 * 本ライブラリの利用には、XML.jsのロードが必要<br>
 * また、本ライブラリのロードに当たって、Base64.jsがロードされる<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.2.0
 * @lang ja
 */
 
/**
 * @fileoverview JavaScript library for calling Web services.<br>
 * To use this library, XML.js must be loaded.<br>
 * Also, upon using loading this library, Base64.js is loaded as well.<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.2.0
 * @lang en
 */

//Base64.jsのロード
document.write('<script type="text/javascript" src="./ToolsLib/Base64.js" charset="UTF-8"></script>');
/**
 * Webサービスを呼び出す為の名前空間定義
 * @namespace
 * @static
 * @lang ja
 */
/**
 * Definition of namespace for calling Web services.
 * @namespace
 * @static
 * @lang en
 */
var WebServiceLib =
{
	/**
	 *	XMLHttpRequestの親オブジェクト<br>通信中の場合には、プロパティとして各リクエストを持つ
	 *	@type Object
	 *	@default Object
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Parent object of XMLHttpRequest.<br>When communication is in process, has requests as properties.
	 *	@type Object
	 *	@default Object
	 *	@private
	 *  @lang en
	 */
	objects			:	new Object(),
	/**
	 *	XMLHttpRequestのオブジェクトID<br>
	 *	@type Int
	 *	@default 1
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	XMLHttpRequest object ID<br>
	 *	@type Int
	 *	@default 1
	 *	@private
	 *  @lang en
	 */
	id				:	1
};
/**
 * 起動したブラウザによりXMLHttpRequestの生成方法を判断し、XMLHttpRequestオブジェクトを生成する(クロスブラウザ対応)
 * @returns {XMLHttpRequest} オブジェクト生成失敗：null<br>
 * @returns {XMLHttpRequest} オブジェクト生成成功：requester
 * @addon
 * @static
 * @lang ja
 */
/**
 * Determines how to create XMLHttpRequest based on the browser started and creates XMLHttpRequest object (cross-browser method).
 * @returns {XMLHttpRequest} Null if object creation fails.<br>
 * @returns {XMLHttpRequest} requester if object is successfully created.
 * @addon
 * @static
 * @lang en
 */
WebServiceLib.createXMLHttpRequest = function()
{
	var reqId = WebServiceLib.id++;

	if( window.XMLHttpRequest) {
		this.objects[reqId] = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		try {
			this.objects[reqId] = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e) {
			this.objects[reqId] = new ActiveXObject("Microsoft.XMLHTTP");
		}
	} else {
		return null;
	}
	this.objects[reqId].objId = reqId;
	return this.objects[reqId];
};

/**
 * 現在通信中のXMLHttpObjectのonreadystatechangeを空にする
 * @addon
 * @static
 * @lang ja
 */

/**
 * Clears onreadystatechange of XMLHttpObject in current transaction.
 * @addon
 * @static
 * @lang en
 */
WebServiceLib.invalidActiveRequest = function()
{
	for(var id in this.objects) {
		this.objects[id].onreadystatechange = function() {};
		WebServiceLib.deleteXMLHttpRequest(id);
	}

	return;
};

/**
 * 生成したリクエストを削除する<br>V3ブラウザの場合は、一次領域に設定されたCommunicatorインスタンスの削除も行う
 * @param {XMLHttpObject} xhr XMLHttpObjectを指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Deletes created request.<br>If browser is V3 browser, Communication instance created in temporary domain is deleted as well.
 * @param {XMLHttpObject} xhr XMLHttpObject
 * @addon
 * @static
 * @lang en
 */
WebServiceLib.deleteXMLHttpRequest = function(objId)
{
	if (this.objects[objId] != undefined) {
		this.objects[objId] = null;
		delete this.objects[objId];
		if(this._tmpCommObj && BrowserLib.browser == BrowserLib.BrowserType.INSPIRIUM) {
			this._tmpCommObj[objId] = null;
			delete this._tmpCommObj[objId];
		}
	}
	return;
};

/**
 * 現在ActiveになっているXMLHttpObjectの数を取得する
 * @return {Int} XMLHttpObject数<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves number of active XMLHttpObjects.
 * @return {Int} Number of XMLHttpObjects.<br>
 * @addon
 * @static
 * @lang en
 */
WebServiceLib.getActiveRequestCount = function()
{
	var count = 0;

	for(var id in WebServiceLib.objects) {
		count++;
	}
	return count;
};
/**
 * Communicatorインスタンスを作成する
 * @constructor
 * @addon
 * @base WebServiceLib
 * @public
 * @lang ja
 */
/**
 * Creates Communicator instance.
 * @constructor
 * @addon
 * @base WebServiceLib
 * @public
 * @lang en
 */
WebServiceLib.Communicator = function()
{
	/**
	 *	成功時コールバック関数<br>
	 *	@type Function
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Callback function to be called upon success.<br>
	 *	@type Function
	 *	@default null
	 *  @lang en
	 */
	this.successHandler = null;
	/**
	 *	エラー時コールバック関数<br>
	 *	@type Function
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Callback function to be called upon error.<br>
	 *	@type Function
	 *	@default null
	 *  @lang en
	 */
	this.errorHandler = null;
	/**
	 *	タイムアウト時コールバック関数<br>
	 *	@type Function
	 *	@default null
	 *  @lang ja
	 */
	 /**
	 *	Callback function to be called upon timeout.<br>
	 *	@type Function
	 *	@default null
	 *  @lang en
	 */
	this.timeoutHandler = null;
	/**
	 *	非同期通信を表す真偽値<br>
	 *	@type Bool
	 *	@default true
	 *  @lang ja
	 */
	/**
	 *	Boolean value representing whether communication is asynchronous or not.<br>
	 *	@type Bool
	 *	@default true
	 *  @lang en
	 */
	this.async = true;
	/**
	 *	HTTPメソッドを表す文字列<br>
	 *	@type String
	 *	@default "POST"
	 *  @lang ja
	 */
	/**
	 *	String representing HTTP method.<br>
	 *	@type String
	 *	@default "POST"
	 *  @lang en
	 */
	this.method = "POST";
	/**
	 *	SOAPActionを表す文字列<br>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	String representing SOAPAction.<br>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.soapAction = null;
	/**
	 *	メディアタイプを表す文字列<br>
	 *	@type String
	 *	@default "text/xml; charset=utf-8"
	 *  @lang ja
	 */
	/**
	 *	String representing media type.<br>
	 *	@type String
	 *	@default "text/xml; charset=utf-8"
	 *  @lang en
	 */
	this.contentType = "text/xml; charset=utf-8";
	/**
	 *	SSMIメソッドでデバイスに対する通信を表す真偽値<br>
	 *  localhostでSSMIメソッドを使用する場合にtrueを指定する<br>
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */
	/**
	 *	Boolean value representing whether communication is with MFD.<br>
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.isDeviceReq = false;
	/**
	 *	認証が必要なHTTPリクエストを送信する場合のユーザ名<br>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Username for HTTP request which requires authentication.<br>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.user = null;
	/**
	 *	認証が必要なHTTPリクエストを送信する場合のパスワード<br>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Password for HTTP request which requires authentication.<br>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.password = null;
	/**
	 *	ユーザが任意に設定できるHTTPHeaderオブジェクト<br>
	 *	必ず、key1, val1, key2, val2, ...の形式で設定し、要素数が偶数となるように設定する
	 *	@type Array
	 *	@default new Array()
	 *  @lang ja
	 */
	/**
	 *	HTTPHeader objects that can be set by user.<br>
	 *  Must be set in the following format and so that an even number of <br>
	 *  elements are specified: key1, val1, key2, val2, ...<br>
	 *	@type Array
	 *	@default new Array()
	 *  @lang en
	 */
	this.headers = new Array();
	/**
	 *	通信のタイムアウト(ミリ秒)<br>
	 *	@type Int
	 *	@default 5000
	 *  @lang ja
	 */
	/**
	 *	Communication timeout (millisecs)<br>
	 *	@type Int
	 *	@default 5000
	 *  @lang en
	 */
	this.timeout = 5000;
	/**
	 *	通信終了時に設定される各種情報<br>
	 *	@type WebServiceLib.ResponseObj
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Information set upon communication end.<br>
	 *	@type WebServiceLib.ResponseObj
	 *	@default null
	 *  @lang en
	 */
	this.response = null;
	/**
	 *	SOAPFault発生時に設定される各種情報<br>
	 *	@type WebServiceLib.FaultObj
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Information set upon SOAPFault.<br>
	 *	@type WebServiceLib.FaultObj
	 *	@default null
	 *  @lang en
	 */
	this.fault = null;

	//Modification for AuthorizedToekn handling between Reote MFDs ([FXKIS] Kwanghyun, Jang)
	this.token = "";
};
/**
 * 通信完了時の情報を格納するインスタンスを作成する
 * @constructor
 * @addon
 * @lang ja
 */
/**
 * Creates instance of object for holding information upon communication end.
 * @constructor
 * @addon
 * @lang en
 */
WebServiceLib.ResponseObj = function()
{
	/**
	 *	要求に対して得られたHTTPのステータスコード<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	HTTP status code for request.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.statusCode = null;
	/**
	 *	要求に対して得られたHTTPのステータスコードに対応する文字列<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	String corresponding to HTTP status code for request.br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.statusText = null;
	/**
	 *	要求に対して得られたレスポンスメッセージ(DOM形式)<br>
	 *	@property
	 *	@type Message
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Response message for request, in DOM format.<br>
	 *	@property
	 *	@type Message
	 *	@default null
	 *  @lang en
	 */
	this.responseXML = null;
	/**
	 *	要求に対して得られたレスポンスメッセージ(テキスト形式)<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Response message for request, in text format.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.responseText = null;
};
/**
 * SOAPFault発生時の情報を格納するインスタンスを作成する
 * @constructor
 * @addon
 *  @lang ja
 */
 /**
 * Creates instance of object for holding information upon SOAPFault occurrence.
 * @constructor
 * @addon
 *  @lang en
 */
WebServiceLib.FaultObj = function()
{
	/**
	 *	エラーの発生原因を示すコード<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Code representing error reason.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.code = null;
	/**
	 *	エラーの発生原因を示すSubコード<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Subcode representing error reason.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.subcode = null;
	/**
	 *	エラーの発生原因を示すSubSubコード<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Subsubcode representing error reason.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.subSubcode = null;
	/**
	 *	エラーの原因を示す文字列<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	String representing error reason.<br>
	 *	@property
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.reason = null;
};

/**
 * 通信完了時の情報をインスタンスに設定する
 * @param {Object(XMLHttpObject)} res XMLHttpObjectを引数として渡す
 * @private
 * @static
 * @returns {WebServiceLib.ResponseObj} response 完了時情報が格納されたインスタンス<br>
 * @lang ja
 */

/**
 * Sets information upon communication end to instance.
 * @param {Object(XMLHttpObject)} res Sets XMLHttpObject as instance.
 * @private
 * @static
 * @returns {WebServiceLib.ResponseObj} response Instance with information upon communication end.<br>
 * @lang en
 */
WebServiceLib.Communicator.prototype.getResponseInfo = function(res)
{
	var _response = new WebServiceLib.ResponseObj();

	_response.statusCode = res.status ? res.status : null;
	_response.statusText = res.statusText ? res.statusText : null;
	_response.responseXML = res.responseXML ? res.responseXML : null;
	_response.responseText = res.responseText? res.responseText : null;

	return _response;
};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfoNS2 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _faultTag = node.getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Fault");
	if(!_faultTag.length) {	// Not Fault
		return null;
	}

	var _codeTag = _faultTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Code");
	if(!_codeTag.length) {		// Not Fault
		return null;
	}
	var _valTag = _codeTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Value");
	if (_valTag.length) {
		_fault.code = _valTag[0].firstChild.nodeValue;
	}
	var _subTag = _codeTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Subcode");
	if(_subTag.length) {
		_valTag = _subTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Value");
		if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

		var _subSubTag = _subTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Subcode");
		if(_subSubTag.length) {
			_valTag = _subSubTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Value");
			if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
		}
	}

	return _fault;

};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfoNS1 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _valTag = node.getElementsByTagName("faultcode");
	if(!_valTag.length) {	// Not Fault
		return null;
	}
	_fault.code = _valTag[0].firstChild.nodeValue;

	var _detailTag = node.getElementsByTagName("detail");
	if(_detailTag.length) {
		var _subTag = _detailTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Subcode");
		if(_subTag.length) {
			_valTag = _subTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Value");
			if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

			var _subSubTag = _subTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Subcode");
			if(_subSubTag.length) {
				_valTag = _subSubTag[0].getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Value");
				if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
			}
		}
		//Append flt NS Handling, 2011/6/20, FXKIS Kwanghyun, Jang START
		if(!_fault.subcode) {
			var _subTag = _detailTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");
			if(_subTag.length) {
				_valTag = _subTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Value");
				if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;
	
				var _subSubTag = _subTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");
				if(_subSubTag.length) {
					_valTag = _subSubTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Value");
					if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
				}
			}
		}
		//Append flt NS, 2011/6/20, FXKIS Kwanghyun, Jang END
	}
	return _fault;

};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfoAsNS1 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _valTag = node.getElementsByTagName("faultcode");
	if(!_valTag.length) {
		return null;
	}
	_fault.code = _valTag[0].firstChild.nodeValue;

	var _detailTag = node.getElementsByTagName("detail");
	if(_detailTag.length) {
		var _subTag = _detailTag[0].getElementsByTagName("env:Subcode");
		if(_subTag.length) {
			_valTag = _subTag[0].getElementsByTagName("env:Value");
			if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

			var _subSubTag = _subTag[0].getElementsByTagName("env:Subcode");
			if(_subSubTag.length) {
				_valTag = _subSubTag[0].getElementsByTagName("env:Value");
				if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
			}
		}
		//Append flt NS Handling, 2011/6/20, FXKIS Kwanghyun, Jang START
		if(!_fault.subcode) {
			var _subTag = _detailTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");
			if(_subTag.length) {
				_valTag = _subTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Value");
				if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;
	
				var _subSubTag = _subTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");
				if(_subSubTag.length) {
					_valTag = _subSubTag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Value");
					if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
				}
			}
		}
		//Append flt NS, 2011/6/20, FXKIS Kwanghyun, Jang END
	}
	return _fault;

};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfoAsNS2 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _codeTag = node.getElementsByTagName("env:Code");
	if(!_codeTag.length) {	// Not Fault
		return null;
	}
	var _valTag = _codeTag[0].getElementsByTagName("env:Value");
	if (_valTag.length) _fault.code = _valTag[0].firstChild.nodeValue;

	var _subTag = _codeTag[0].getElementsByTagName("env:Subcode");
	if(_subTag.length) {
		var _valTag = _subTag[0].getElementsByTagName("env:Value");
		if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

		var _subSubTag = _subTag[0].getElementsByTagName("env:Subcode");
		if(_subSubTag.length) {
			_valTag = _subSubTag[0].getElementsByTagName("env:Value");
			if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
		}
	}

	return _fault;

};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfo1 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _valTag = node.getElementsByTagName("faultcode");
	if(!_valTag.length) {	// Not Fault
		return null;
	}
	_fault.code = _valTag[0].firstChild.nodeValue;

	var _detailTag = node.getElementsByTagName("detail");
	if(_detailTag.length) {
		var _subTag = _detailTag[0].getElementsByTagName("Subcode");
		if(_subTag.length) {
			_valTag = _subTag[0].getElementsByTagName("Value");
			if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

			var _subSubTag = _subTag[0].getElementsByTagName("Subcode");
			if(_subSubTag.length) {
				_valTag = _subSubTag[0].getElementsByTagName("Value");
				if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
			}
		}
	}

	return _fault;

};
/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultInfo2 = function(node)
{
	var _fault = new WebServiceLib.FaultObj();

	var _valTag = node.getElementsByTagName("Value");
	if (_valTag.length) {
		_fault.code = _valTag[0].firstChild.nodeValue;
	}
	var _subTag = node.getElementsByTagName("Subcode");
	if(_subTag.length) {
		_valTag = _subTag[0].getElementsByTagName("Value");
		if (_valTag.length) _fault.subcode = _valTag[0].firstChild.nodeValue;

		var _subSubTag = _subTag[0].getElementsByTagName("Subcode");
		if(_subSubTag.length) {
			_valTag = _subSubTag[0].getElementsByTagName("Value");
			if (_valTag.length) _fault.subSubcode = _valTag[0].firstChild.nodeValue;
		}
	}

	return _fault;
};

/**
 * @private
 */
WebServiceLib.Communicator.prototype._getSoapFaultReason = function(node, isSoap2)
{
	var _reasonNode = null;
	var _reasonValue = null;

	if(!node) {
		return _reasonValue;
	}
	if(isSoap2) {
		if(node.getElementsByTagNameNS) {
			_reasonNode = node.getElementsByTagNameNS(XMLLib.NS.SOAPENV,"Reason");
		} else {
			_reasonNode = node.getElementsByTagName("env:Reason");
			if(!_reasonNode.length) {
				_reasonNode = node.getElementsByTagName("Reason");
			}
		}
	} else {
		_reasonNode = node.getElementsByTagName("faultstring");
	}

	if(_reasonNode.length && _reasonNode[0].firstChild) {
		_reasonValue =  _reasonNode[0].firstChild.nodeValue;
	}
	
	return _reasonValue;
};
/**
 * SOAPFault発生時の情報をインスタンスに設定する
 * @param {Object(XMLHttpObject)} res XMLHttpObjectを引数として渡す
 * @private
 * @static
 * @returns {WebServiceLib.FaultObj} fault SOAPFault発生時の情報が格納されたインスタンス<br>
 * @lang ja
 */
/**
 * Sets information upon SOAPFault to instance.
 * @param {Object(XMLHttpObject)} res Sets XMLHttpObject as argument.
 * @private
 * @static
 * @returns {WebServiceLib.FaultObj} fault Intance with information upon SOAPFault.
 * @lang en
 */
WebServiceLib.Communicator.prototype.getSoapFaultInfo = function(res)
{
	//var _fault = new WebServiceLib.FaultObj();
	var _fault = null;
	var _faultTag = null;
	var _codeTag = null;
	var _isSoap2 = false;

	if(res.responseXML) {
		var _xmlObj = res.responseXML;
	} else {
		return null;
	}

	if(_xmlObj.getElementsByTagNameNS) {
		_faultTag = _xmlObj.getElementsByTagNameNS(XMLLib.NS.SOAP,"Fault");
		if(!_faultTag.length) {			// SOAP V1.2
			_fault = this._getSoapFaultInfoNS2(_xmlObj);
			_isSoap2 = true;
		} else {				// SOAP V1.1
			_fault = this._getSoapFaultInfoNS1(_faultTag[0]);
		}
	} else {
		_faultTag = _xmlObj.getElementsByTagName("Fault");
		if(!_faultTag.length) {		// Next Type
			_faultTag = _xmlObj.getElementsByTagName("SOAP:Fault");
			if(!_faultTag.length) {		// Next Type
				_faultTag = _xmlObj.getElementsByTagName("env:Fault");
				if(!_faultTag.length) {	// Not Fault
					return null;
				} else {		// SOAP V1.2
					_fault = this._getSoapFaultInfoAsNS2(_xmlObj);
					_isSoap2 = true;
				}
			} else {			// SOAP V1.1
				_fault = this._getSoapFaultInfoAsNS1(_faultTag[0]);
			}
		} else {				// SOAP V1.1 or V1.2
			_codeTag = _xmlObj.getElementsByTagName("Code");
			if(!_codeTag.length) {		// SOAP V1.1 or Not Fault
				_fault = this._getSoapFaultInfo1(_faultTag[0]);
			} else {			// SOAP V1.2
				_fault = this._getSoapFaultInfo2(_codeTag[0]);
				_isSoap2 = true;
			}
		}
	}
	//HTTP Status Bad GateWay(502) Handling, FXKIS, KWANG-HYUN, JANG
	if(_faultTag.length) {
		_fault.reason = this._getSoapFaultReason(_faultTag[0], _isSoap2);
	}
	return _fault;
};

/**
 * プロパティとして設定された情報を元に、通信を行い、各種コールバック関数を呼び出す<br>
 * ■補足<br>
		通信完了後にリクエストオブジェクトは初期化される。<br>
		通信が完了すると、responseプロパティにResponseObjのインスタンスが設定される。<br>
		SOAPFault発生時に、faultプロパティにFaultObjのインスタンスが設定される。<br>
 * @param {String} url 通信先のURIを設定する
 * @param {String/SOAPMsg} msg リクエストボディーの文字列を設定する/または、SOAPMsgクラスのインスタンスを設定する。
 * @returns {Bool} 通信が正常に実行された場合は、true
 * @returns {Bool} urlの指定がないなど、通信が正常に実行できない場合はfalse
 * @base WebServiceLib.Communicator
 * @public
 * @lang ja
 */
 
 
/**
 * Attempts communication based on information set as properties and calls callback functions.<br>
 * NOTES:<br>
 * Request object is initialized upon communication end.<br>
 * When communication is complete, ResponseObj instance is set to response property.<br>
 * FaultObj instance is set to fault property upon SOAPFault.<br>
 * @param {String} url Destination URI.
 * @param {String/SOAPMsg} msg Request body string, or instance of SOAPMsg class.
 * @returns {Bool} true if communication is successful.
 * @returns {Bool} false is returned when communication cannot be successfully established, e.g. when URL is not specified.
 * @base WebServiceLib.Communicator
 * @public
 * @lang en
 */
WebServiceLib.Communicator.prototype.send = function(url, msg)
{
	if(!url) {
		return false;
	}

	var _requester = WebServiceLib.createXMLHttpRequest();

	if(msg == 'undefined') {
		return false;
	}
	
	if(msg && typeof(msg) == 'object' && 'serializeToString' in msg) {
		var _data = msg.serializeToString();
	} else {
		var _data = msg;
	}

	if(typeof(netscape) != 'undefined') {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	}

	_requester.open(this.method, url, this.async);

	if(this.soapAction) {
		_requester.setRequestHeader("SOAPAction", this.soapAction);
	}
	
	if(this.contentType) {
		_requester.setRequestHeader("Content-Type", this.contentType);
	}
	//Modification for AuthorizedToekn handling between Reote MFDs ([FXKIS] Kwanghyun, Jang)
	if(this.token) {
		_requester.setRequestHeader("X-FX-Authorization", "token " + this.token);
	}else 	if(this.isDeviceReq) {
		_requester.setRequestHeader("X-FX-Authorization", "panel");
	}

	if(this.user) {
		var _b64 = new Base64Lib();
		var _b64str = this.password ? this.user + ':' + this.password : this.user;
		var _enstr = _b64.encode(_b64str);
		_requester.setRequestHeader("Authorization", "Basic " + _enstr);
	}

	var _headersLen = this.headers.length;
	if(_headersLen) {
		for(var i =0; i < _headersLen; i += 2) {
			if(this.headers[i] && this.headers[i+1]) {
				_requester.setRequestHeader(this.headers[i], this.headers[i+1]);
			}
		}
	}
	
	if(this.async) {
		var _thisCommObj = this;
		if(BrowserLib.browser == BrowserLib.BrowserType.INSPIRIUM) {
			if(!('_tmpCommObj' in  WebServiceLib)) {
				WebServiceLib._tmpCommObj = new Object();
			}
			var _tmpCommObjIndex = _requester.objId;
			WebServiceLib._tmpCommObj[_tmpCommObjIndex] = _thisCommObj;
			if(this.timeout && this.timeoutHandler) {
				WebServiceLib._reqAbort = function (objId) {
					for(var id in WebServiceLib.objects) {
						var _targetReq = WebServiceLib.objects[id];
						var _targetObj = WebServiceLib._tmpCommObj[id];
						if( _targetObj && _targetReq && id == objId) {
							if(_targetObj._timerId) {
								clearTimeout(_targetObj._timerId);
								_targetObj._timerId = null;
							}

							if(typeof(_targetObj.timeoutHandler) == 'function') {
								_targetObj.timeoutHandler(_targetReq);
							}
							_targetReq.abort();
							_targetReq.onreadystatechange = null;
							WebServiceLib.deleteXMLHttpRequest(objId);
						}
					}
				};
				WebServiceLib._tmpCommObj[_tmpCommObjIndex]._timerId = window.setTimeout("WebServiceLib._reqAbort(" + _tmpCommObjIndex + ")", this.timeout);

			}

			_requester.onreadystatechange = function () {
				for(var id in WebServiceLib.objects) {
					var _targetReq = WebServiceLib.objects[id];
					var _targetObj = WebServiceLib._tmpCommObj[id];
					if(_targetReq && _targetObj && _targetReq.readyState == 4) {
						if(_targetObj._timerId) {
							clearTimeout(_targetObj._timerId);
							_targetObj._timerId = null;
						}
						
						_targetObj.response = _targetObj.getResponseInfo(_targetReq);
						// tajima for webdav
						if((200 <= _targetReq.status  && _targetReq.status < 300) && typeof(_targetObj.successHandler) == 'function') {
							_targetObj.successHandler(_targetReq);
						} else {
							if(_targetReq.status == 500 && _targetObj.soapAction) { // 20101206
								_targetObj.fault = _targetObj.getSoapFaultInfo(_targetReq);
							}
							if(typeof(_targetObj.errorHandler) == 'function') {
								_targetObj.errorHandler(_targetReq);
							}
						}
						WebServiceLib.deleteXMLHttpRequest(id);
						return true;
					}
				}
			};
		} else { //ANT or その他ブラウザ
			if(this.timeout && this.timeoutHandler) {
				var _timerId = window.setTimeout(function() {
					if(_timerId != null) { // 2010.09.13 Tajima ANT setTimeout() returns timerId starts from 0.
						clearTimeout(_timerId);
						_timerId = null;
					}

					if(typeof(_thisCommObj.timeoutHandler) == 'function') {
						_thisCommObj.timeoutHandler(_requester);
					}
					// ANTの不具合によりabort()のコールは推奨されない 2010.09.13時点
					// abort()の代わりに、errorHandler,successHanlderをnullに設定する
					_thisCommObj.successHandler = null;
					_thisCommObj.errorHandler = null;
					//_requester.abort();
					//_requester.onreadystatechange = null;
					//WebServiceLib.deleteXMLHttpRequest(_requester.objId);
					return true;
				}, this.timeout);
			}
			
			_requester.onreadystatechange = function() {
				if (_requester.readyState==4) {
					if(_timerId != null) {// 2010.09.13 Tajima 
						clearTimeout(_timerId);
						_timerId = null;
					}

					_thisCommObj.response = _thisCommObj.getResponseInfo(_requester);

					if((200 <= _requester.status  && _requester.status < 300) && typeof(_thisCommObj.successHandler) == 'function') {
						_thisCommObj.successHandler(_requester);
					} else {
						if(_requester.status == 500 && _thisCommObj.soapAction) { // 20101206
							_thisCommObj.fault = _thisCommObj.getSoapFaultInfo(_requester);
						}
						if(typeof(_thisCommObj.errorHandler) == 'function') {
							_thisCommObj.errorHandler(_requester);
						}
					}
					WebServiceLib.deleteXMLHttpRequest(_requester.objId);
					return true;
				}
			};
		}
	}

	_requester.send(_data);

	if(!this.async) {
		if(_requester.readyState == 4) {
			this.response = this.getResponseInfo(_requester);

			if((200 <= _requester.status  && _requester.status < 300) && typeof(this.successHandler) == 'function') {
				this.successHandler(_requester);
			} else {
				if(_requester.status == 500 && this.soapAction) {
					this.fault = this.getSoapFaultInfo(_requester);
				}
				if(typeof(this.errorHandler) == 'function') {
					this.errorHandler(_requester);
				}
			}
			WebServiceLib.deleteXMLHttpRequest(_requester.objId);
			return true;
		}
	}
	return false;
};

/**
 * 指定されたホストに対して、ジョブの即時実行を要求する
 * @param {String/SOAPMsg} jobTemplate JobTemplate本体のシリアライズ化したものを設定する<br>または、JobTemplateクラスのインスタンスを設定する。
 * @param {String} [host] 通信先のホスト名を設定する<br>指定無しの場合は、localhostが設定される
 * @public
 * @lang ja
 */
 
 /**
 * Requests immediate job run to specified host.
 * @param {String/SOAPMsg} jobTemplate Serialized JobTemplate, or JobTemplate class instance.<br>
 * @param {String} [host] Destination hostname.<br>When not specified, localhost is set.
 * @public
 * @lang en
 */
WebServiceLib.Communicator.prototype.callJobExecService = function(jobTemplate, host)
{
	var _host = host ? host : "localhost";
	//var _host = host ? host : gHost;
	//var _protocol = gProtocol ? gProtocol : "http://";

	this.isDeviceReq = true;
	this.soapAction = '"' + XMLLib.NS.JTM2 + '#ExecuteJobTemplate' + '"';
	//return this.send(_protocol + _host + "/ssm/Management/JobTemplate/Execution", jobTemplate);
	return this.send("http://" + _host + "/ssm/Management/JobTemplate/Execution", jobTemplate);
};

/**
 * 指定されたurlに対して、CGI通信を行う
 * @param {String} url 通信先のurlを設定する
 * @param {String} data CGI通信時に設定するクエリー文字列を設定する
 * @public
 * @lang ja
 */
 
 /**
 * Communicates by CGI with specified URL.
 * @param {String} url Communication destination URL.
 * @param {String} data Sets query string to be set upon CGI communication.
 * @public
 * @lang en
 */
WebServiceLib.Communicator.prototype.callCGIModule = function(url, data)
{
	this.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
	return this.send(url, data);
};
