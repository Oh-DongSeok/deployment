/**
 * @fileoverview デバイスから各種ステータス・コンフィグを取得、設定するためのクラス定義<br>
 * 本ライブラリはデバイスから情報を取得する雛形定義のための以下に示すクラスを提供する<br>
 * DeviceInfoクラス<br>
 * また、以下のメソッドを提供する<br>
 * GetAttribute<br>
 * SetAttribute<br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2010-2014 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving and setting device configuration status information.<br>
 * This library is a template definition for retrieving device information, and provides only those classes defined below.<br>
 * DeviceInfo Class <br>
 * Also, the following methods are provided.<br>
 * GetAttribute<br>
 * SetAttribute<br>
 * To use these files, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2010-2014 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.1.1
 * @lang en
 */

/**
 * Construct DeviceInfo インスタンスを作成する
 * @class デバイス情報取得・設定のためのクラス
 * @constructor
 * @param {Array/String} obj リクエストメッセージ生成時に用いるオブジェクト名
 * @param {Array/String} attr リクエストメッセージ生成時に用いる属性名
 * @param {Bool} auth リクエストメッセージ送付先のデバイスが認証モードか否か
 * @lang ja
 */
 /**
 * Creates Construct DeviceInfo instance.
 * @class Class for retrieving and setting device information.
 * @constructor
 * @param {Array/String} obj Object name to use upon creating request message.
 * @param {Array/String} attr Attribute name to use upon creating request message.
 * @param {Bool} auth Whether request message destination device requires authentication or not.
 * @lang en
 */
SSMILib.DeviceInfo = function(obj, attr, auth)
{
	/**
	 *	リクエストメッセージ生成時に用いるオブジェクト名を設定する
	 *	@type Array/String
	 *	@default なし
	 *  @lang ja
	 */
	 /**
	 *	Sets object name to use upon creating request message.
	 *	@type Array/String
	 *	@default None.
	 *  @lang en
	 */
	this.obj = obj;
	/**
	 *	リクエストメッセージ生成時に用いる属性名を設定する<br>
	 *	@type Array/String
	 *	@default なし
	 *  @lang ja
	 */
	 /**
	 *	Sets attribute name to use upon creating request message.<br>
	 *	@type Array/String
	 *	@default None.
	 *  @lang en
	 */
	this.attr = attr;
	/**
	 *	複数のインスタンスがある場合に、インスタンスを指定するために使用する<br>
	 *	複数のインスタンスがある場合に、identifierを省略すると、先頭のインスタンスを取得できる<br>
	 *	インスタンスが一つしかない場合に、identifier指定すると、指定は無視される<br>
	 *	【指定方法】<br>
	 *	オブジェクトを配列で指定(複数指定)した場合には、identifierも配列で指定する。<br>
	 *	ただし、インスタンスが一つしかないオブジェクトに対しては"0"を指定するものとする。<br>
	 *	オブジェクトを単独で指定した場合には、整数で指定する。
	 *	@type Array/String
	 *	@default null
	 *  @lang ja
	 */
	 /**
	 *	Specifies instance when multiple instances exist.<br>
	 *  If identifier is omitted in such cases, the first instance is retrieved.<br>
	 *  If only one instance exists, identifier is ignored.<br>
	 *  How to specify:<br>
	 *  If an array of objects are specified, identifiers should correspondingly be specified as an array. <br>
	 *  If object only has 1 instance, "0" should be specified as identifier.<br>
	 *  If a single object has been specified, identifier should be specified as an integer.
	 *	@type Array/String
	 *	@default null
	 *  @lang en
	 */
	this.identifier = "";
	/**
	 *	リクエストメッセージ生成時に用いる認証情報のユーザ名を設定する
	 *	@type String
	 *	@default null
	 *	@private
	 *  @lang ja
	 */
	 /**
	 *	Sets user name of authentication information upon creating request message.
	 *	@type String
	 *	@default null
	 *	@private
	 *  @lang en
	 */
	this.user = "";
	/**
	 *	リクエストメッセージ生成時に用いる認証情報のパスワードを設定する
	 *	@type String
	 *	@default null
	 *	@private
	 *  @lang ja
	 */
	 /**
	 *	Sets password of authentication information upon creating request message.
	 *	@type String
	 *	@default null
	 *	@private
	 *  @lang en
	 */
	this.pass = "";
	/**
	 *	リクエストメッセージ送付先のデバイスが認証モードか否か設定する
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */
	 /**
	 *	Sets whether request message destination device requires authentication or not.
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.auth = false;
	if(auth) { this.auth = auth; }
	/**
	 *	リクエストメッセージ送付先のデバイスが認証モードか否か設定する
	 *	@type WebServiceLib.Communicator
	 *	@default new WebServiceLib.Communicator()
	 *  @lang ja
	 */
	 /**
	 *	Sets whether request message destination device requires authentication or not.
	 *	@type WebServiceLib.Communicator
	 *	@default new WebServiceLib.Communicator()
	 *  @lang en
	 */
	this.requester = new WebServiceLib.Communicator();
	
	/**
	 * メソッドの種別を指定する。指定可能な値は"GetAttribute"または"SetAttribute"
	 * @type String
	 * @default GetAttribute
	 * @lang ja
	 */
	/**
	 * Specifies the type of methods. The value that can be set is "GetAttribute" or "SetAttribute".
	 * @type String
	 * @default GetAttribute
	 * @lang en
	 */
	this.type = "GetAttribute"; 
	
	/**
	 * 属性の設定時に用いる属性値を設定する。SetAttribute時のみ指定可能。
	 * @type String
	 * @default なし
	 * @lang ja
	 */
	/**
	 * Specifies the value of an attribute to use when setting the attribute. The value can be set only for SetAttribute methods.
	 * @type String
	 * @default None
	 * @lang en
	 */
	this.value = "";
	
	/**
	 * SSMILib.CreateExclusiveContextで取得した排他制御用のContextを設定する。SetAttribute時のみ指定可能。
	 * @type String
	 * @default なし
	 * @lang ja
	 */
	/**
	 * Specifies Context for exclusive control obtained using SSMILib.CreateExclusiveContext. The value can be set only for SetAttribute methods.
	 * @type String
	 * @default None
	 * @lang en
	 */
	this.context = "";
};
/**
 * @private
 */
Extend(SSMILib.DeviceInfo.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.DeviceInfo.prototype.createMsg = function ()
{
	if(!this.obj){ return ""; }

	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = null;
	var body = xml.body;
	var soapMsg = null;
	
	var _objNode = null;
	var _attrNode = null;
	var _objLen = null;
	var cfgNS = "";
	
	if(this.type == "SetAttribute"){
		env = xml.createElementNS(XMLLib.NS.SOAP, 'Envelope');
		xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	
		var header = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Header'));
		body = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Body'));

		var ec = header.appendChild(xml.createElement("ExclusiveContext"));
		ec.setAttribute("xmlns", "http://www.fujixerox.co.jp/2007/07/ssm/management/exclusion");
	
		var id = ec.appendChild(xml.createElement('Identifier'));
		id.appendChild(xml.createTextNode(this.context));
		
		cfgNS = "http://www.fujixerox.co.jp/2003/12/ssm/management/statusConfig";
		xml.addNSPrefix(cfgNS, "cfg");
	
		var _setAttrNode = body.appendChild(xml.createElementNS(cfgNS, this.type));
		xml.addNSDeclaration(cfgNS, _setAttrNode, true);
		
		if(this.obj instanceof Array){
			_objLen = this.obj.length;
			for(var j=0; j<_objLen; j++){
				_objNode = _setAttrNode.appendChild(xml.createElement("Object"));
				_objNode.setAttribute("name", "urn:fujixerox:names:ssm:1.0:management:" + this.obj[j]);
				if (this.attr) {
					_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
					if (this.attr instanceof Array){
						_attrNode.setAttribute("name", this.attr[j]);
						_attrNode.appendChild(xml.createTextNode(this.value[j]));
					} else {
						_attrNode.setAttribute("name", this.attr);
						_attrNode.appendChild(xml.createTextNode(this.value));
					}
				}
			}
		}else{
			_objNode = _setAttrNode.appendChild(xml.createElement("Object"));
			_objNode.setAttribute("name", "urn:fujixerox:names:ssm:1.0:management:" + this.obj);
			
			_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
			_attrNode.setAttribute("name", this.attr);
			_attrNode.appendChild(xml.createTextNode(this.value));
		}
				
		soapMsg = env;
	}else{
		env = root;
		cfgNS = "http://www.fujixerox.co.jp/2003/12/ssm/management/statusConfig";
		xml.addNSPrefix(cfgNS, "cfg");
		var _getAttrNode = body.appendChild(xml.createElementNS(cfgNS, this.type));
		xml.addNSDeclaration(cfgNS, _getAttrNode, true);
		
		/* クラス名が配列として渡されていた時 */
		if (this.obj instanceof Array){
			_objLen = this.obj.length;
			for (var i = 0; i < _objLen; i++){
				_objNode = _getAttrNode.appendChild(xml.createElement("Object"));
				_objNode.setAttribute("name", "urn:fujixerox:names:ssm:1.0:management:" + this.obj[i]);
				if(this.identifier && this.identifier[i]){
					_objNode.setAttribute("identifier", this.identifier[i]);
				}
				if (this.attr && this.attr[i]){//AR192720 Start
					if (this.attr[i] instanceof Array){
						for(var j=0; j<this.attr[i].length; j++){
							_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
							_attrNode.setAttribute("name", this.attr[i][j]);
						}
					} else {
						_attrNode = _objNode.appendChild(xml.createElement("Attribute"));//AR192720 End
						_attrNode.setAttribute("name", this.attr[i]);
					}
				}
			}
		/*クラス名が1つ引数として渡されていた時*/
		} else {
			_objNode = _getAttrNode.appendChild(xml.createElement("Object"));
			_objNode.setAttribute("name", "urn:fujixerox:names:ssm:1.0:management:" + this.obj);
			if(this.identifier){
				_objNode.setAttribute("identifier", this.identifier);
			}
			if (this.attr){
				if (this.attr instanceof Array){
					var _attrLen = this.attr.length;
					for (var i = 0; i < _attrLen; i++){
						_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
						_attrNode.setAttribute("name", this.attr[i]);
					}
				} else {
					_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
					_attrNode.setAttribute("name", this.attr);
				}
			}
		}
		
		env.appendChild(body);
		soapMsg = xml.rootElement;
	}

	return soapMsg;
};

/**
 * 指定したオブジェクトと属性によりデバイス情報を取得する<br>
 * @param {Bool} auth ジョブ情報を取得するデバイスが認証モードであるか否か
 * @lang ja
 */
 /**
 * Retrieves device information based on object and attribute specified.<br>
 * @param {Bool} auth Whether device from which to retrieve information requires authentication or not.
 * @lang en
 */
SSMILib.DeviceInfo.prototype.getDeviceInfo = function(auth)
{
    var _path = "";

	this.requester.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/statusConfig#GetAttribute"';
	this.requester.isDeviceReq = true;
	this.requester.async = SSMILib.async;
	this.auth = auth;

	if(this.auth){
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/StatusConfig";
	} else{
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/StatusConfig";
	}

	var _msg = this.serializeToString();
	this.requester.send(_path, _msg);

	return;
};

/**
 * 指定したオブジェクトと属性によりデバイス情報を取得する<br>
 * 複数のオブジェクト/属性を一度のリクエストで取得することができる<br>
 * @param {Bool} auth 情報を取得するデバイスが認証モードであるか否か
 * @param {Array/String} obj 情報を取得したいオブジェクト名
 * @param {Array/String} attr 情報を取得したい属性名
 * @lang ja
 * @public
 */
/**
 * Retrieves device information using the specified object and attribute.<br>
 * Multiple objects/attributes can be retrieved in one request.<br>
 * @param {Bool} auth Whether the device of which information is to be retrieved requires authentication or not
 * @param {Array/String} obj The name of the object of which information is to be retrieved
 * @param {Array/String} attr The name of the attribute of which information is to be retrieved
 * @lang en
 * @public
 */
SSMILib.DeviceInfo.GetAttribute = function(auth, obj, attr){
	
	var _path = "";
	
	var dev = new SSMILib.DeviceInfo(obj, attr, auth);
	dev.requester.successHandler = SSMILib.DeviceInfo.getSuccessCb;
	dev.requester.errorHandler = SSMILib.DeviceInfo.getErrorCb;
	dev.requester.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/statusConfig#GetAttribute"';
	dev.requester.isDeviceReq = true;
	dev.requester.async = SSMILib.async;
	dev.requester.token = SSMILib.RemoteAccess.Interceptor("WebService", dev.requester);
	dev.requester.headers[0] = "Connection";
	dev.requester.headers[1] = "close";
	dev.type = "GetAttribute";
	
	if(dev.auth){
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/StatusConfig";
	} else{
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/StatusConfig";
	}

	var _msg = dev.serializeToString();
	dev.requester.send(_path, _msg);

	return;
};

/**
 * @private
 */
SSMILib.DeviceInfo.getSuccessCb = function(res)
{
	var _getAttrConf = new Array();
	var _result = false;
	
	if(!res.responseXML) {
		SSMILib.onEvent("GetAttribute", false, null);
		return;
	}
	
	_getAttrConf = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, _getAttrConf);
	if(typeof _getAttrConf == "undefined"){
		_getAttrConf = new Array();
	}
	_getAttrConf.push(SSMILib.attrNodeToObject(res.responseXML));

	if(_getAttrConf.length > 0){
		_result = true;
	}else{
		_result = false;
	}
	
	SSMILib.onEvent("GetAttribute", _result, _getAttrConf);

	return;
};

/**
 * @private
 */
SSMILib.DeviceInfo.getErrorCb = function(res)
{
	var soapFaultObj = null;
	soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
	SSMILib.onEvent("GetAttribute", false, soapFaultObj);
	return;
};

/**
 * 指定したオブジェクトと属性によりデバイス情報を設定する<br>
 * 複数のオブジェクト/属性を一度のリクエストで設定することができる<br>
 * @param {Bool} auth 情報を設定するデバイスが認証モードであるか否か	
 * @param {Array/String} obj 情報を設定したいオブジェクト名
 * @param {Array/String} attr 情報を設定したい属性名
 * @param {Array/String} value 情報を設定したい属性の属性値
 * @param {String} context SSMILib.CreateExclusiveContextで取得した排他制御用のContextを指定する
 * @lang ja
 * @public
 */
/**
 * Sets device information using the specified object and attribute.<br>
 * Multiple objects/attributes can be set in one request.<br>
 * @param {Bool} auth Whether the device of which information is to be set requires authentication or not
 * @param {Array/String} obj The name of the object of which information is to be set
 * @param {Array/String} attr The name of the attribute of which information is to be set
 * @param {Array/String} value The value of the attribute of which information is to be set
 * @param {String} context Specifies Context for exclusive control obtained using SSMILib.CreateExclusiveContext.
 * @lang en
 * @public
 */
SSMILib.DeviceInfo.SetAttribute = function(auth, obj, attr, value, context){
	var _path = "";
	var dev = new SSMILib.DeviceInfo(obj, attr, auth);
	dev.requester.successHandler = SSMILib.DeviceInfo.setSuccessCb;
	dev.requester.errorHandler = SSMILib.DeviceInfo.setErrorCb;
	
	dev.requester.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/statusConfig#SetAttribute"';
	dev.requester.isDeviceReq = true;
	dev.requester.async = SSMILib.async;
	dev.value = value;
	dev.context = context;
	dev.type = "SetAttribute";	
			
	if(dev.auth){
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/StatusConfig";
	} else{
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/StatusConfig";
	}
	
	var _msg = dev.serializeToString();
	dev.requester.send(_path, _msg);

	return;
};

/**
 * @private
 */
SSMILib.DeviceInfo.setSuccessCb = function(res){
	var _setAttrConf = null;
	var _result = false;
	
	if(!res.responseXML) {
		SSMILib.onEvent("SetAttribute", false, null);
		return;
	}
	
	_setAttrConf = SSMILib.attrNodeToObject(res.responseXML);
	
	var _attrNode = res.responseXML.getElementsByTagName("SetAttributeResult");
	var _attrValue = _attrNode[0].getAttribute("status");
	_setAttrConf["status"] = _attrValue; 

	if(_setAttrConf){
		_result = true;
	}
	
	SSMILib.onEvent("SetAttribute", _result, _setAttrConf);

	return;
};

/**
 * @private
 */
SSMILib.DeviceInfo.setErrorCb = function(res){
	SSMILib.onEvent("SetAttribute", false, null);
	return;
};
