/** 
 * @fileoverview ジョブフローにおける外部サービス連携処理を扱うクラスを定義する<br>
 * Invokeクラス<br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 2.2.1 Invoke要素を参照<br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefInvoke.js
 * </ul>
 * のロードが必要となる。<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる。<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang ja
 * 
 */
/** 
 * @fileoverview Defines classes used in External Service Requests (ESR) in Job Flow: <br>
 * Invoke class<br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * To use these classes,
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefInvoke.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this file is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang en
 * 
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefInvoke.jsのロード
JFLib.JSInclude("JfsDefInvoke");

/**
 * Invoke インスタンスを作成する<br>
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *		var invoke = new JFLib.Invoke("sample");
 *		invoke.profile.description = "これは外部サービス呼び出しを行うジョブです";
 * @class 外部サービス呼び出しを行うジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う<br>
 * <a href="JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates Invoke instance.<br>
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE: 
 *		var invoke = new JFLib.Invoke("sample");
 *		invoke.profile.description = "This is an ESR job.";
 * @class This class sets external servie request job settings. <br>
 * This class is handled as output operations. Output settings are set using <a href="JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * Subclass of <a href="OutputProcess.html#">OutputProcess</a>.
 * @lang en
 */
JFLib.Invoke = function()
{
	/**
	 *	呼び出される側のサービスに関する全体情報を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 *	@type JFLib.Invoke.Profile
	 *	@default new JFLib.Invoke.Profile()
	 *  @lang ja
	 */	
	/**
	 *	Profile of servie called.<br>  <font color = "#ff0000">REQUIRED.</font><br>
	 *	@type JFLib.Invoke.Profile
	 *	@default new JFLib.Invoke.Profile()
	 *  @lang en
	 */	
	this.profile = new JFLib.Invoke.Profile();
	/**
	 *	要求メッセージを作成するための情報を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 *	@type JFLib.Invoke.Request
	 *	@default new JFLib.Invoke.Request()
	 *  @lang ja
	 */	
	/**
	 *	Information for creating request message.<br>  <font color = "#ff0000">REQUIRED.</font><br>
	 *	@type JFLib.Invoke.Request
	 *	@default new JFLib.Invoke.Request()
	 *  @lang en
	 */	
	this.request = new JFLib.Invoke.Request();
	/**
	 *	応答メッセージに関する情報を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 *	@type JFLib.Invoke.Response
	 *	@default new JFLib.Invoke.Response()
	 *  @lang ja
	 */	
	/**
	 *	Response message information.<br>  <font color = "#ff0000">REQUIRED.</font><br>
	 *	@type JFLib.Invoke.Response
	 *	@default new JFLib.Invoke.Response()
	 *  @lang en
	 */	
	this.response = new JFLib.Invoke.Response();
	/**
	 *	通信障害時の再送を指定する<br> 設定 - 任意
	 *	@type JFLib.Distribute.Retry
	 *	@default 再送しない
	 *  @lang ja
	 */	
	/**
	 *	Retry settings upon communication failure.<br> IMPLIED.
	 *	@type JFLib.Distribute.Retry
	 *	@default Do not retry.
	 *  @lang en
	 */	
	this.retry = new JFLib.Distribute.Retry("0", "30");
};
/**
 * @param {String/Object(Node)} mbody 外部サービス呼び出しメッセージであるXMLノード/文字列を設定する
 * @return {String(XML)/Object(Node)} XMLノード/文字列
 * @lang ja
 */
/**
 * @param {string} mbody XML string representing ESR message.
 * @return {String(XML)} XML文字列
 * @lang en
 */
JFLib.Invoke.prototype.setMessageBodyXML = function(mbody)
{
	if(mbody){
		this.request.messageBody = mbody;
	}
	return this.request.messageBody;
};
/**
 * @private
 */
JFLib.Invoke.prototype.toXmlNode = function (xml)
{
	var invoke = xml.createElementNS(XMLLib.NS.JT, 'Invoke');
	xml.setAttributeNS(invoke, XMLLib.NS.JT, 'container', 'Document');
	xml.setAttributeNS(invoke, XMLLib.NS.JT, 'numberOfRetry', this.retry.num);
	xml.setAttributeNS(invoke, XMLLib.NS.JT, 'retryInterval', this.retry.interval);

	invoke.appendChild(this.profile.toXmlNode(xml));
	invoke.appendChild(this.request.toXmlNode(xml));
	invoke.appendChild(this.response.toXmlNode(xml));
	return invoke;
};
/**
 * Profile インスタンスを作成する
 * @constructor
 * @class 外部サービス連携における呼び出される側のサービスに関する全体情報を設定する為のクラス<br>
 * 本クラスはInvokeクラスのProfile設定として扱う<br>
 * 指示書では//Invoke/Profile element in Job Flow Sheet.<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 3.2.2 Profile要素についての記述を参照
 * @lang ja
 */
/**
 * Creates Profile instance.
 * @constructor
 * @class This class is used to set profile of servie called in ESR.<br>
 * This class is used as Profile settings in Invoke class, and<br>
 * corresponds to //Invoke/Profile element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */
JFLib.Invoke.Profile = function()
{
	/**
	 *	ユーザに表示するための外部サービスに関する記述を指定する
	 *	指示書では//Invoke/Profile/Description element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	ESR description to display to users.
	 *	Corresponds to //Invoke/Profile/Description element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.description = "";
	/**
	 *	呼び出し先のサービスを一意に示す識別子(正の整数値)を指定する
	 *	Corresponds to //Invoke/Profile/Description/identifier属性に相当する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	ID to uniquely identify service called, specified as positive integer.
	 *	Corresponds to //Invoke/Profile/Description/identifier attribute.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.identifier = 0;
	/**
	 *	呼び出し先のURIを指定する
	 *	指示書では//Invoke/Profile/Target element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Target URI.
	 *	Corresponds to //Invoke/Profile/Target element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.target = "";
	/**
	 *	スキーマの情報(名前空間))を指定する
	 *	指示書では//Invoke/Profile/Schema/Namespace element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Schema information (namespace),
	 *	Corresponds to //Invoke/Profile/Schema/Namespace element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.namespace = "";
	/**
	 *	スキーマの情報(呼び出すサービスの定義)を指定する
	 *	指示書では//Invoke/Profile/Schema/Location element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Schema information (location).
	 *	Corresponds to //Invoke/Profile/Schema/Location element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.location = "";
	/**
	 *	呼び出すメソッドの名称を指定する
	 *	指示書では//Invoke/Profile/Schema/MethodName element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Method name.
	 *	Corresponds to //Invoke/Profile/Schema/MethodName element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.methodName = "";
	/**
	 *	外部サービス呼び出しのジョブ名を設定する
	 *	指示書では//Invoke/Profile/JobAttributes/Name element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	ESR job name.
	 *	Corresponds to //Invoke/Profile/JobAttributes/Name element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.jobName = "";
};
/**
 * @private
 */
JFLib.Invoke.Profile.prototype.toXmlNode = function(xml)
{
	var profile = xml.createElementNS(XMLLib.NS.JT, 'Profile');

	var description = profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Description', this.description));
	xml.setAttributeNS(description, XMLLib.NS.JT, 'identifier', this.identifier);
	profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Target', this.target));
	profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Type', 'SOAP/1.1'));

	var schema = profile.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Schema'));
	schema.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Namespace', this.namespace));
	schema.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Location', this.location));
	profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MethodName', this.methodName));
	var attributes = profile.appendChild(xml.createElementNS(XMLLib.NS.JT, 'JobAttributes'));
	attributes.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.jobName));
	return profile;
};
/**
 * Reference インスタンスを作成する
 * @constructor
 * @class 外部サービス呼び出しメッセージの添付文書の埋め込み情報を設定する為のクラス<br>
 * 指示書では//Invoke/Request/Attachment element in Job Flow Sheet.<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 4.2.9 Reference要素についての記述を参照
 * @lang ja
 */
/**
 * Creates Reference instance.
 * @constructor
 * @class This class sets attachment information.<br>
 * Corresponds to //Invoke/Request/Attachment element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */
JFLib.Invoke.Reference = function()
{
	/**
	 *	添付文書のContent-IDの埋め込み先を示すXPath式を設定する
	 *	指示書では//Invoke/Request/Attachment/Reference/Point/xpath属性に相当する
	 *	@type String(xpath)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Xpath specifyiing point attachment Content-ID insertion.
	 *	Corresponds to //Invoke/Request/Attachment/Reference/Point/xpath attribute in Job Flow Sheet.
	 *	@type String(xpath)
	 *	@default null
	 *  @lang en
	 */	
	this.path = "";
	/**
	 *	Content-IDを埋め込むための一時的なノード(XML形式の文字列も可)を設定する
	 *	指示書では//Invoke/Request/Attachment/Reference/Source element in Job Flow Sheet.<br><br>
	 *	■制限事項 <br>
	 *	EWBV3ブラウザでは例えば「abc-」など、半角英数後のハイフンがある要素が含まれている場合、パースに失敗することがあるため、ノードの形式での設定を推奨する
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Node (may be XML string) for temporarily inserting Content-ID. 
	 *	Corresponds to //Invoke/Request/Attachment/Reference/Source element in Job Flow Sheet.<br><br>
	 *	RESTRICTIONS: <br>
	 *	When using EWBV3, parse may fail when element with value of alphanumerics + hyphen (e.g. "abc-") is present. 
	 *  It is therefore recommended that a node be first created and set to src.
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang en
	 */	
	this.src = "";
	/**
	 *	Source要素で指定されるノードの埋め込み先を示すXPath式を設定する
	 *	指示書では//Invoke/Request/Attachment/Reference/Destination/xpath属性に相当する
	 *	@type String(xpath)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Xpath of node to which to insert node specified by Source element.
	 *	Corresponds to //Invoke/Request/Attachment/Reference/Destination/xpath attribute in Job Flow Sheet.
	 *	@type String(xpath)
	 *	@default null
	 *  @lang en
	 */	
	this.dest = "";
	/**
	 *	ノードの埋め込み方法を設定する
	 *	指示書では//Invoke/Request/Attachment/Reference/Destination/operation属性に相当する
	 *	@type JFLib.OPTYPE
	 *	@default 追加処理
	 *  @lang ja
	 */	
	/**
	 *	Node insertion method.
	 *	Corresponds to //Invoke/Request/Attachment/Reference/Destination/operation attribute in Job Flow Sheet.
	 *	@type JFLib.OPTYPE
	 *	@default Append.
	 *  @lang en
	 */	
 	this.operation = JFLib.OPTYPE.APPEND;
};
/**
 * Reference要素において、xpathで参照する要素/属性に対して、未定義の名前空間を定義する
 * @param {String} ns 名前空間の文字列
 * @param {String} prefix 名前空間のプレフィクス
 * @lang ja
 */
/**
 * Defines namespace for element/attribute referenced by xpath in Reference element.
 * @param {String} ns String representing namespace.
 * @param {String} prefix Prefix for namespace.
 * @lang en
 */
JFLib.Invoke.Reference.prototype.addNameSpace = function(ns, prefix)
{
	if(ns){
		if(!this.refNameSpace){
			this.refNameSpace = new Array();
		}
		this.refNameSpace.push(ns);
	}
	if(prefix){
		if(!this.refPrefix){
			this.refPrefix = new Array();
		}
		this.refPrefix.push(prefix);
	}
	return;
};
/**
 * @private
 */
JFLib.Invoke.Reference.prototype.toXmlNode = function(xml)
{
	var ref = xml.createElementNS(XMLLib.NS.JT, 'Reference');
	if(this.refNameSpace && this.refPrefix){
		var nsLen = this.refNameSpace.length;
		for(var i=0; i< nsLen; i++){
			xml.addNSPrefix(this.refNameSpace[i], this.refPrefix[i]);
			xml.addNSDeclaration(this.refNameSpace[i], ref, true);
		}
	}
	var point = ref.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Point'));
	xml.setAttributeNS(point, XMLLib.NS.JT, 'xpath', this.path);
	if(this.src){
		var source = ref.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Source'));
		if(typeof(this.src) == 'string'){
			var srcxml = XMLLib.createXMLObject(this.src);
			if(srcxml && srcxml.firstChild){
				XMLLib.importNode(xml, source, srcxml.firstChild);
			}
		} else {
			XMLLib.importNode(xml, source, this.src);
		}
	}
	if(this.dest){
		var dest = ref.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destination'));
		xml.setAttributeNS(dest, XMLLib.NS.JT, 'xpath', this.dest);
		xml.setAttributeNS(dest, XMLLib.NS.JT, 'operation', this.operation);
	}
	return ref;
};

/**
 * Attach インスタンスを作成する
 * @constructor
 * 
 * @class 外部サービス呼び出しメッセージの添付文書に関する情報を設定する為のクラス<br>
 * 指示書では//Invoke/Request/Attachment element in Job Flow Sheet.<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 4.2.7 Attachment要素についての記述を参照
 * @lang ja
 */
/**
 * Creates Attach instance.
 * @constructor
 * 
 * @class This class sets information on attachment to ESR message.<br>
 * Corresponds to //Invoke/Request/Attachment element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */
JFLib.Invoke.Attach = function()
{
	/**
	 *	外部サービス呼び出しメッセージの添付文書の有無を設定する
	 *	指示書では//Invoke/Request/Attachment/transfer属性に相当する
	 *	@type Bool
	 *	@default なし
	 *  @lang ja
	 */	
	/**
	 *	Whether ESR message has attachment.
	 *	Corresponds to //Invoke/Request/Attachment/transfer attribute in Job Flow Sheet.
	 *	@type Bool
	 *	@default No attachment.
	 *  @lang en
	 */	
	this.enable = false;
	/**
	 *	外部サービス呼び出しメッセージの添付文書の埋め込み情報を設定する
	 *	指示書では//Invoke/Request/Attachment/Reference element in Job Flow Sheet.
	 *	@type JFLib.Invoke.Reference
	 *	@default new JFLib.Invoke.Reference()
	 *  @lang ja
	 */	
	/**
	 *	Object representing information inserted to ESR message attachment.
	 *	Corresponds to //Invoke/Request/Attachment/Reference element in Job Flow Sheet.
	 *	@type JFLib.Invoke.Reference
	 *	@default new JFLib.Invoke.Reference()
	 *  @lang en
	 */	
	this.reference = new JFLib.Invoke.Reference();
	/**
	 *	外部サービス呼び出しメッセージの添付文書のフォーマットを設定する
	 *	指示書では//Invoke/Request/Attachment/Serialization/Format element in Job Flow Sheet.
	 *	@type JFLib.DOCFORMAT
	 *	@default 指定なし
	 *  @lang ja
	 */	
	/**
	 *	ESR message attachment document format.
	 *	Corresponds to //Invoke/Request/Attachment/Serialization/Format element in Job Flow Sheet.
	 *	@type JFLib.DOCFORMAT
	 *	@default Not specified.
	 *  @lang en
	 */	
	this.docFormat = JFLib.DOCFORMAT.NOTSPEC;
	/**
	 *	外部サービス呼び出しメッセージの添付文書の送信形式を設定する
	 *	指示書では//Invoke/Request/Attachment/ContentTransferEncoding element in Job Flow Sheet.
	 *	@type JFLib.ENCODE
	 *	@default バイナリ形式
	 *  @lang ja
	 */	
	/**
	 *	Format in whicn to send ESR message attachment.
	 *	Corresponds to //Invoke/Request/Attachment/ContentTransferEncoding element in Job Flow Sheet.
	 *	@type JFLib.ENCODE
	 *	@default Binary.
	 *  @lang en
	 */	
	this.encode = JFLib.ENCODE.BINARY;

	/**
	 * MRC（Mixed Raster Content）方式を指定する。
	 * @type JFLib.Distribute.MrcType
	 * @default null
	 * @lang ja
	 */
	/**
	 * Specifies the MRC (Mixed Raster Content) method.
	 * @type JFLib.Distribute.MrcType
	 * @default null
	 * @lang en
	 */
	this.mrcType = "";

	/**
	 * スキャン文書の正立を指定する。
	 * @type JFLib.Distribute.Orientation
	 * @default 正立方法を指定しない
	 * @lang ja
	 */
	/**
	 * Specifies whether or not to correct the orientation of scanned documents.
	 * @type JFLib.Distribute.Orientation
	 * @default Do not correct the orientation
	 * @lang en
	 */
	this.orientation = "";

	/**
	 * 文書のスキュー補正（傾き補正）の方式を指定する。
	 * @type JFLib.Distribute.SkewCorrection
	 * @default スキュー補正をしない
	 * @lang ja
	 */
	/**
	 * Specifies the skew correction (deskew) method.
	 * @type JFLib.Distribute.SkewCorrection
	 * @default Do not correct skews
	 * @lang en
	 */
	this.skewCorrection = "";
};
/**
 * @private
 */
JFLib.Invoke.Attach.prototype.toXmlNode = function(xml)
{
	var attach = xml.createElementNS(XMLLib.NS.JT, 'Attachment');
	xml.setAttributeNS(attach, XMLLib.NS.JT, 'transfer', this.enable);
	attach.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Regulation', 'SOAPMessagesWithAttachments'));
	if(this.reference.path){
		attach.appendChild(this.reference.toXmlNode(xml));
	}
	var serialize = attach.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Serialization'));
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Compression', 'NotSpecified'));
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.docFormat));

	if(this.mrcType && this.mrcType.method != JFLib.MRCTYPE.PLAIN){
		var mrcNode = this.mrcType.toXmlNode(xml);
		if(mrcNode){
			serialize.appendChild(mrcNode);
		}
	}

	if(this.orientation && this.orientation.method != JFLib.ORIENTATION.NULL){
		serialize.appendChild(this.orientation.toXmlNode(xml));
	}

	if(this.skewCorrection && this.skewCorrection.enable){
		serialize.appendChild(this.skewCorrection.toXmlNode(xml));
	}

	attach.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ContentTransferEncoding', this.encode));
	
	return attach;
};

/**
 * Request インスタンスを作成する
 * @constructor
 * 
 * @class 外部サービス連携における要求メッセージを作成するための情報を設定する為のクラス<br>
 * 本クラスはInvokeクラスのRequest設定として扱う<br>
 * 指示書では//Invoke/Request要素に相当する<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 4.2.1 Request要素についての記述を参照
 * @lang ja
 */
/**
 * Creates Request instance.
 * @constructor
 * 
 * @class This class sets information for creating ESR request message.<br>
 * This class is handled as Request settings of Invoke class.<br>
 * Corresponds to //Invoke/Request element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */
JFLib.Invoke.Request = function()
{
	/**
	 *	メッセージ通信方法をあらわす定数を設定する
	 *	指示書では//Invoke/Request/MessageType要素に相当する
	 *	@type JFLib.REQ
	 *	@default 同期型呼び出し
	 *  @lang ja
	 */	
	/**
	 *	Constant representing communication type.
	 *	Corresponds to //Invoke/Request/MessageType element in Job Flow Sheet.
	 *	@type JFLib.REQ
	 *	@default Synchronous call.
	 *  @lang en
	 */	
	this.messageType = JFLib.REQ.SYNC;
	/**
	 *	認証情報を設定する
	 *	指示書では//Invoke/Request/AuthInfo要素に相当する
	 *	@type JFLib.Distribute.AuthInfo
	 *	@default 認証しない
	 *  @lang ja
	 */	
	/**
	 *	Authentication information.
	 *	Corresponds to //Invoke/Request/AuthInfo element in Job Flow Sheet.
	 *	@type JFLib.Distribute.AuthInfo
	 *	@default Do not authenticate.
	 *  @lang en
	 */	
	this.authInfo = new JFLib.Distribute.AuthInfo();
	/**
	 *	メッセージの雛型を設定する
	 *	指示書では//Invoke/Request/SoapAction要素に相当する
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Message template.
	 *	Corresponds to //Invoke/Request/SoapAction element in Job Flow Sheet.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.soapAction = "";
	/**
	 *	メッセージに添付する文書に関する情報を設定する
	 *	指示書では//Invoke/Request/SOAPAction要素に相当する
	 *	@type JFLib.Invoke.Attach
	 *	@default new JFLib.Invoke.Attach()
	 *  @lang ja
	 */	
	/**
	 *	Message attachment information.
	 *	Corresponds to //Invoke/Request/SOAPAction element in Job Flow Sheet.
	 *	@type JFLib.Invoke.Attach
	 *	@default new JFLib.Invoke.Attach()
	 *  @lang en
	 */	
	this.attach = new JFLib.Invoke.Attach();
	/**
	 *	外部サービス呼び出しメッセージのノード(XML形式の文字列も可)を設定する
	 *	指示書では//Invoke/Request/Prototype/Message element in Job Flow Sheet.<br><br>
	 *	■制限事項 <br>
	 *	<font color = "#ff0000">EWBV3ブラウザでは例えば「abc-」など、半角英数後のハイフンがある要素が含まれている場合、パースに失敗することがあるため、ノードの形式での設定を推奨する</font>
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Node (may be XML string) representing ESR message.
	 *	Corresponds to //Invoke/Request/Prototype/Message element in Job Flow Sheet.<br><br>
	 *	RESTRICTIONS: <br>
	 *	<font color = "#ff0000">When using EWBV3, parse may fail when element with value of alphanumerics + hyphen (e.g. "abc-") is present. <br>
	 *  It is therefore recommended that a node be first created and set to messageBody.</font>
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang en
	 */	
	this.messageBody = "";
	/**
	 *	予想ジョブ終了時間を設定する
	 *	指示書では//Invoke/Request/TimeoutValue要素に相当する
	 *	@type int
	 *	@default 60秒
	 *  @lang ja
	 */	
	/**
	 *	Response timeout interval; in seconds.
	 *	Corresponds to //Invoke/Request/TimeoutValue element in Job Flow Sheet.
	 *	@type int
	 *	@default 60 (seconds).
	 *  @lang en
	 */	
	this.timeOut = 60;
};
/**
 * @private
 */
JFLib.Invoke.Request.prototype.toXmlNode = function(xml)
{
	var request = xml.createElementNS(XMLLib.NS.JT, 'Request');

	request.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MessageType', this.messageType));
	request.appendChild(this.authInfo.toXmlNode(xml));
	request.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'SOAPAction', this.soapAction));
	
	var prototype = request.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Prototype'));	
	var message = prototype.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Message'));
	prototype.appendChild(this.attach.toXmlNode(xml));

	if(this.messageBody){
		if(typeof(this.messageBody) == 'string'){
			var msgXML = XMLLib.createXMLObject(this.messageBody);
			if(msgXML && msgXML.firstChild){
				XMLLib.importNode(xml, message, msgXML.firstChild);
			}
		} else {
			XMLLib.importNode(xml, message, this.messageBody);
		}
	}
	request.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'TimeoutValue', this.timeOut));
	return request;
};
/**
 * JudgementValue インスタンスを作成する
 * @constructor
 * 
 * @class 外部サービス連携における応答の成否判断方法を設定する為のクラス<br>
 * 指示書では//Invoke/Request要素に相当する<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 5.2.3 Judgement要素についての記述を参照
 * @lang ja
 */
/**
 * Creates JudgementValue instance.
 * @constructor
 * 
 * @class This class is used to set how to determine whether response indicates ESR success or failure.<br>
 * Corresponds to //Invoke/Request element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */

JFLib.Invoke.JudgementValue = function()
{
	/**
	 *	応答の成否判断方法を設定する
	 *	指示書では//Invoke/Response/Judgement/Value要素以下の要素名(&lt;Failed&gt;|&lt;Succeeded&gt;)に相当する<br>
	 *	handlingの値がHANDLING.FAULT/HANDLING.MESSAGEの場合、設定が必須
	 *	@type JFLib.JUDGEVALUE
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	How to determine success/failure from ESR response.
	 *	Corresponds to child element names of //Invoke/Response/Judgement/Value (&lt;Failed&gt;|&lt;Succeeded&gt;).<br>
	 *	If handling value is set to HANDLING.FAULT/HANDLING.MESSAGE, this parameter must be set.
	 *	@type JFLib.JUDGEVALUE
	 *	@default null
	 *  @lang en
	 */	
	this.type = "";
	/**
	 *	応答の成否判断の値を設定する
	 *	指示書では//Invoke/Response/Judgement/Value要素以下の要素(&lt;Failed&gt;|&lt;Succeeded&gt;)の子ノードの値に相当する<br>
	 *	handlingの値がHANDLING.MESSAGEの場合に、応答の成否が<a href="Invoke.Response.html#judgementKey.html">judgementKey</a>で指定されるノードの値との比較によって決定される<br>
	 *	handlingの値がHANDLING.MESSAGE以外の場合には指定は無視される
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Value for determining whether ESR response indicated success/failure.
	 *	Corresponds to values of child elements of //Invoke/Response/Judgement/Value (&lt;Failed&gt;|&lt;Succeeded&gt;).<br>
	 *	If handling value is set to HANDLING.MESSAGE,、whether ESR was sucessful is determined by referencing value of node specified by <a href="Invoke.Response.html#judgementKey.html">judgementKey</a>.
	 *	Ignored if handling is NOT set to HANDLING.MESSAGE.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.val = "";
};
/**
 * @private
 */
JFLib.Invoke.JudgementValue.prototype.toXmlNode = function(xml)
{
	var judgeValue = xml.createElementNS(XMLLib.NS.JT, 'Value');
	judgeValue.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, this.type, this.val));
	return judgeValue;
};
/**
 * Response インスタンスを作成する
 * @constructor
 * @class 外部サービス連携における応答メッセージに関する情報を設定する為のクラス<br>
 * 本クラスはInvokeクラスのResponse設定として扱う<br>
 * 指示書では//Invoke/Response要素に相当する<br><br>
 * 詳細については、「デバイス指示書言語仕様 外部サービス呼び出し編」 5.2.1 Response要素についての記述を参照
 * @lang ja
 */
/**
 * Creates Response instance.
 * @constructor
 * @class This class sets sets information on ESR response message.<br>
 * This class is handled as Response setting of Invoke class.<br>
 * Corresponds to //Invoke/Response element in Job Flow Sheet.<br><br>
 * See Job Flow Sheet Language Specifications document on External Service Request (JSLS-0711) for details.
 * @lang en
 */
JFLib.Invoke.Response = function()
{
	/**
	 *	応答メッセージの取り扱い方法を設定する
	 *	指示書では//Invoke/Response/Handling要素に相当する
	 *	@type JFLib.HANDLING
	 *	@default 判断しない
	 *  @lang ja
	 */	
	/**
	 *	How to handle response message.
	 *	Corresponds to //Invoke/Response/Handling element in Job Flow Sheet.
	 *	@type JFLib.HANDLING
	 *	@default No handling.
	 *  @lang en
	 */	
	this.handling = JFLib.HANDLING.NONE;
	/**
	 *	応答メッセージ内の成否の判断に必要な要素へのパスを設定する
	 *	指示書では//Invoke/Response/Judgement/Key/xpath属性に相当する<br>
	 *	handlingの値がHANDLING.JOBID/HANDLING.MESSAGEの場合に設定が必須<br>それ以外の場合設定は無視される
	 *	@type String(xpath)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Xpath of element to be referenced to determine whether response message indicates success/failure.
	 *	Corresponds to //Invoke/Response/Judgement/Key/xpath attribute in Job Flow Sheet.<br>
	 *	If handling is set to HANDLING.JOBID/HANDLING.MESSAGE, setting is required.<br> Otherwise, judgementKey is ignored.
	 *	@type String(xpath)
	 *	@default null
	 *  @lang en
	 */	
	this.judgementKey = "";
	/**
	 *	応答の成否判断の値を設定する
	 *	指示書では//Invoke/Response/Judgement/Value要素に相当する<br>
	 *	handlingの値がHANDLING.FAULT/HANDLING.MESSAGEの場合に設定が必須<br>それ以外の場合設定は無視される
	 *	@type JFLib.Invoke.JudgementValue
	 *	@default new JFLib.Invoke.JudgementValue
	 *  @lang ja
	 */	
	/**
	 *	Value for determining whether response message indicates success/failure.
	 *	Corresponds to //Invoke/Response/Judgement/Value element in Job Flow Sheet.<br>
	 *	If handling is set to HANDLING.JOBID/HANDLING.MESSAGE, setting is required.<br> Otherwise, judgementValue is ignored.
	 *	@type JFLib.Invoke.JudgementValue
	 *	@default new JFLib.Invoke.JudgementValue
	 *  @lang en
	 */	
	this.judgementValue = new JFLib.Invoke.JudgementValue();
	/**
	 *	呼び出し先のジョブ管理に使用するURLの情報を設定する
	 *	指示書では//Invoke/Response/JobManager要素に相当する<br>
	 *	非同期呼び出しでhandlingがHANDLING.JOBIDの場合に、judgementKeyにて抽出されたジョブIDを対象としてジョブを操作するURLを設定する
	 *	@type String(URL)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *  URL used for job management at ESR destination.
	 *	Corresponds to //Invoke/Response/JobManager element in Job Flow Sheet.<br>
	 *	If asynchronous call is set and handling is set to HANDLING.JOBID, URI for operating job of job ID retrieved using judgementKey is set.
	 *	@type String(URL)
	 *	@default null
	 *  @lang en
	 */	
	this.jobmanager = "";
};
/**
 * @private
 */
JFLib.Invoke.Response.prototype.toXmlNode = function(xml)
{
	var response = xml.createElementNS(XMLLib.NS.JT, 'Response');
	response.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Handling', this.handling));

	var handling = this.handling;
	if(handling != JFLib.HANDLING.NONE){
		var judgement = response.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Judgement'));
		if(handling != JFLib.HANDLING.FAULT){
			var key = judgement.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Key'));
			xml.setAttributeNS(key, XMLLib.NS.JT, 'xpath', this.judgementKey);
		}
		if(handling == JFLib.HANDLING.FAULT || handling == JFLib.HANDLING.MESSAGE){
			judgement.appendChild(this.judgementValue.toXmlNode(xml));
		}
		response.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'JobManager', this.jobmanager));
	}

	return response;
};

/**
 * @private
 */
Extend(JFLib.Invoke.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.Invoke.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.ESR));
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.ESRWITHDOC));
};

JFLib.JSIncluded("JfsInvoke");
