/** 
 * @fileoverview デバイスから各種ステータス・コンフィグを取得するためのクラス定義<br>
 * 本ライブラリはデバイスから情報を取得するための雛形定義であり、以下に示すクラスのみ提供し、<br>
 * 各メソッドは別ファイルとして定義される<br>
 * DeviceInfoクラス<br>
 * 
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes for retrieving device configuration status information.<br>
 * This library is a template definition for retrieving device information, and provides only those classes defined below.<br>
 * Methods are defined as separate files.<br>
 * DeviceInfo Class <br>
 * 
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.0.1
 * @lang en
 */

/**
 * Construct DeviceInfo インスタンスを作成する
 * @class デバイス情報取得のためのクラス
 * @constructor
 * @param {Array/String} obj リクエストメッセージ生成時に用いるオブジェクト名
 * @param {Array/String} attr リクエストメッセージ生成時に用いる属性名
 * @param {Bool} auth リクエストメッセージ送付先のデバイスが認証モードか否か
 * @lang ja
 */
 /**
 * Construct DeviceInfo Creates instance.
 * @class Class for retrieving device information.
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
	var env = root;
	var body = xml.body;
	
	var cfgNS = "http://www.fujifilm.com/fb/2021/04/ssm/management/statusConfig";
	xml.addNSPrefix(cfgNS, "cfg");

	var _getAttrNode = body.appendChild(xml.createElementNS(cfgNS, "GetAttribute"));
	xml.addNSDeclaration(cfgNS, _getAttrNode, true);
	
	var _objNode = null;
	var _attrNode = null;
	
	/* クラス名が配列として渡されていた時 */
	if (this.obj instanceof Array){
		var _objLen = this.obj.length;
		for (var i = 0; i < _objLen; i++){
			_objNode = _getAttrNode.appendChild(xml.createElement("Object"));
			_objNode.setAttribute("name", "urn:fujifilm:names:ssm:1.0:management:" + this.obj[i]);
			if(this.identifier && this.identifier[i]){
				_objNode.setAttribute("identifier", this.identifier[i]);
			}
			if (this.attr){
				_attrNode = _objNode.appendChild(xml.createElement("Attribute"));
				if (this.attr instanceof Array){
					_attrNode.setAttribute("name", this.attr[i]);
				} else {
					_attrNode.setAttribute("name", this.attr);
				}
			}
		}
	/*クラス名が1つ引数として渡されていた時*/
	} else {
		_objNode = _getAttrNode.appendChild(xml.createElement("Object"));
		_objNode.setAttribute("name", "urn:fujifilm:names:ssm:1.0:management:" + this.obj);
		if(this.identifier){
			_objNode.setAttribute("identifier", this.identifier);
		}
		if (this.attr){
			if (this.attr instanceof Array){
				var _attrLen = this.attr.length;
				for (i = 0; i < _attrLen; i++){
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
	
	var soapMsg = xml.rootElement;
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
SSMILib.DeviceInfo.prototype.getDeviceInfo = function(auth){

	this.requester.soapAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/statusConfig#GetAttribute"';
	this.requester.isDeviceReq = true;
	this.requester.async = SSMILib.async;
	this.auth = auth;

	if(this.auth){
		var _path = SSMILib.protocol + SSMILib.host + "/ssm/Management/StatusConfig";
	} else{
		var _path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/StatusConfig";
	}

	var _msg = this.serializeToString();
	this.requester.send(_path, _msg);

	return;
};