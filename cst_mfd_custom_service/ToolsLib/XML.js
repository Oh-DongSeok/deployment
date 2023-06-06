/** 
 * @fileoverview XML関連の処理に関するクラスを定義する<br>
 * XMLBaseクラス<br>
 * XMLSoapクラス<br>
 * SOAPMsgクラス<br>
 * 
 * @author Copyright(C) 2007-2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for XML-related processing.<br>
 * XMLBase class<br>
 * XMLSoap class<br>
 * SOAPMsg class<br>
 * 
 * @author Copyright(C) 2007-2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang en
 */
/* ---------- Extend ---------- */
/**
 * オブジェクトの継承を行う
 * @param {Object} destination 継承先オブジェクトを指定する
 * @param {Object} source 継承元オブジェクトを指定する
 * @return {Object} 継承されたオブジェクト
 * @private
 * @lang ja
 */
/**
 * Extends objects.
 * @param {Object} destination Extended object.
 * @param {Object} source Origin object.
 * @return {Object} Extended object.
 * @private
 * @lang en
 */
function Extend (destination, source) {
	for (property in source) {
		destination[property] = source[property];
	}
	return destination;
}
/**
 * XML関連の処理に関するクラスのための名前空間定義
 * @namespace XML関連の処理を行う
 * @static
 * @lang ja
 */
/**
 * Namespace for classes for XML-related processing.
 * @namespace Performs XML-related processing.
 * @static
 * @lang en
 */
var XMLLib = {};
/* ---------- Namespace ---------- */
/**
 * このコンストラクタを明示的に呼び出す必要はない。
 * @class Namespacesクラスで使用される名前空間を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない。
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines namespaces used in Namespaces class.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
XMLLib.NS = function() {};
/**
 * SOAPの要素・属性の名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Namespace URI of SOAP elements and attributes.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.SOAP = 'http://schemas.xmlsoap.org/soap/envelope/';
/**
 * 名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Namespace URI.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.SOAPENV = 'http://www.w3.org/2003/05/soap-envelope';
/**
 * デバイス指示書の名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Device Job Flow Sheet namespace URI.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.JT = 'http://www.fujixerox.co.jp/2003/12/ssm/jobTemplate';
/**
 * SESAMi Service Managementでの指示書管理機能の名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Namespace URI of Job Flow Sheet Management by SESAMi Service Management.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.JTM = 'http://www.fujixerox.co.jp/2003/12/ssm/management/jobTemplate';
/**
 * SESAMi Service Managementでの指示書実行機能の名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Namespace URI of Job Flow Sheet execution by SESAMi Service Management.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.JTM2 = 'http://www.fujixerox.co.jp/2005/12/ssm/management/jobTemplate';
/**
 * XMLスキーマインスタンス名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * XML schema instance namespace URI.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.XSI = 'http://www.w3.org/2001/XMLSchema-instance';
/**
 * SOAPFault名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * SOAPFault namespace URI.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.FAULT = 'http://www.fujixerox.co.jp/2003/12/ssm/management/fault';
/**
 * XMLEncrypt名前空間URI
 * @final
 * @type String
 * @constant
 * @lang ja
 */
 /**
 * XMLEncrypt namespace URI
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NS.XENC = 'http://www.w3.org/2001/04/xmlenc';
/**
 * このコンストラクタを明示的に呼び出す必要はない。
 * @class Namespacesクラスで使用される名前空間接頭辞を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない。
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines namespace prefixes used in class Namespaces.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
XMLLib.NSPREFIX = function() {};
/**
 * <a href="XMLLib.NS.html#s!SOAP">XMLLib.NS.SOAP</a>の接頭辞
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Prefix for <a href="XMLLib.NS.html#s!SOAP">XMLLib.NS.SOAP</a>.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NSPREFIX.SOAP = 'soap';
/**
 * <a href="XMLLib.NS.html#s!JT">XMLLib.NS.JT</a>の接頭辞
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Prefix for <a href="XMLLib.NS.html#s!JT">XMLLib.NS.JT</a>.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NSPREFIX.JT = 'jt';
/**
 * <a href="XMLLib.NS.html#s!JTM">XMLLib.NS.JTM</a>の接頭辞
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Prefix for <a href="XMLLib.NS.html#s!JTM">XMLLib.NS.JTM</a>.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NSPREFIX.JTM = 'jtm';
/**
 * <a href="XMLLib.NS.html#s!JTM2">XMLLib.NS.JTM2</a>の接頭辞
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Prefix for <a href="XMLLib.NS.html#s!JTM2">XMLLib.NS.JTM2</a>.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NSPREFIX.JTM2 = 'jtm2';
/**
 * <a href="XMLLib.NS.html#s!XSI">XMLLib.NS.XSI</a>の接頭辞
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Prefix for <a href="XMLLib.NS.html#s!XSI">XMLLib.NS.XSI</a>.
 * @final
 * @type String
 * @constant
 * @lang en
 */
XMLLib.NSPREFIX.XSI = 'xsi';
/**
 * <a href="XMLLib.NS.html#s!XENC">XMLLib.NS.XENC</a>の接頭辞
 * @final
 * @type String
 */
XMLLib.NSPREFIX.XENC = 'xenc';

/**
 * XMLBase インスタンスを作成する
 * @constructor
 * @class XMLBaseドキュメントを作成するクラス<br>
 * @lang ja
 */
/**
 * Creates XMLBase instance.
 * @constructor
 * @class This class creates XMLBase documents.<br>
 * @lang en
 */
XMLLib.XMLBase = function()
{
	/**
 	 *	@private
	 */
	this._initialize();
};
/**
 * @private
 */
XMLLib.XMLBase.prototype._initialize = function ()
{
	this.xmlDoc = XMLLib.createXMLObject("");
	this.rootElement = null;
	this.nss = new XMLLib.Namespaces();
};
/**
 * 指定した名前でルート要素を作成する
 * @param {String} namespace 名前空間を指定する
 * @param {String} nodename ルート要素名を指定する
 * @return {Object(DOM)} ルート要素オブジェクト
 * @lang ja
 */

/**
 * Creates root element with specified name.
 * @param {String} namespace Namespace.
 * @param {String} nodename Root element name.
 * @return {Object(DOM)} Root element object.
 * @lang en
 */
XMLLib.XMLBase.prototype.createDocumentElement = function (namespace,nodename) 
{
    //指定された名前空間で新規に要素を作成する
	var root = this.createElementNS(namespace, nodename);
	//ルート要素を格納
	this.rootElement = root;
	return root;
};
/**
 * 新規に要素を作成する
 * @param {String} name 要素名を指定する
 * @return {Object(DOM)} 要素オブジェクト
 * @lang ja
 */
/**
 * Newly creates element.
 * @param {String} name Element name.
 * @return {Object(DOM)} Element object.
 * @lang en
 */
XMLLib.XMLBase.prototype.createElement = function ( name )
{
	return this.xmlDoc.createElement( name );
};
/**
 * 指定された名前空間で新規に要素を作成する
 * @param {String} namespace 名前空間を指定する
 * @param {String} name 要素名を指定する
 * @return {Object(DOM)} 要素オブジェクト
 * @lang ja
 */
/**
 * Newly creates element in the specified namespace
 * @param {String} namespace Namespace.
 * @param {String} name Element name.
 * @return {Object(DOM)} Element object.
 * @lang en
 */
 
 /*
 最終的に下記例のような1つの要素をかえす(例)
<cfg:GetAttribute xmlns:cfg="http://www.fujixerox.co.jp/2003/12/ssm/management/****">
  */
XMLLib.XMLBase.prototype.createElementNS = function ( namespace, name )
{
    //引数namespaceがnamespace配列に格納されているものであれば返す(検査目的の処理？）
	var ns = this.nss.get(namespace);
	//もし上記でnsがnullであれば、name要素を新規に作成し、返す）
	if (ns == null) {
		return this.xmlDoc.createElement( name );
	}
	//指定namespeceのプレフィクス:要素nameの要素を生成
	//例： adrs:GetAddress
  	var node = this.xmlDoc.createElement( ns.prefix + ":" + name );

    //要素へ属性を追加する（属性には属性値となるnamespace値も格納)
    //例 : xmlns:adrs="http://www.fujixerox.co.jp/2003/12/ssm/management/addressBook"
	if (! ns.defined) {
	    //属性を追加する
	    //例 : xmlns:adrs
		var attrnode = this.xmlDoc.createAttribute("xmlns:"+ns.prefix);
		//属性値としてnamespaceのurlを格納する
		// xmlns:adrs="http://www.fujixerox.co.jp/2003/12/ssm/management/addressBook"
		attrnode.nodeValue = ns.url;
		//属性を要素ノードへ追加する
		node.setAttributeNode(attrnode);
		ns.defined = true;
	}
	return node;
};

/**
 * 新規に属性を作成し、値を設定する
 * @param {Object} node 作成先のノードを指定する
 * @param {String} namespace 名前空間を指定する
 * @param {String} name 属性名を指定する
 * @param {String} value 設定値を指定する
 * @lang ja
 */
/**
 * Newly creates attribute and sets value.
 * @param {Object} node Node for which to create attribute.
 * @param {String} namespace Namepace.
 * @param {String} name Attribute name.
 * @param {String} value Attribute value.
 * @lang en
 */
XMLLib.XMLBase.prototype.setAttributeNS = function (node, namespace, name, value)
{
	var ns = this.nss.get(namespace);

	if (ns != null && ns.defined) {
		name = ns.prefix + ':' + name;
	}
	var attrnode = this.xmlDoc.createAttribute(name);
	attrnode.nodeValue = value;
	node.setAttributeNode(attrnode);

};
/**
 * 新規にテキストノードを作成する
 * @param {String} name テキストノードにセットする値を指定する
 * @return {Node} テキストノード
 * @lang ja
 */
/**
 * Newly creates text node.
 * @param {String} name Value to set to text node.
 * @return {Node} Text node.
 * @lang en
 */
XMLLib.XMLBase.prototype.createTextNode = function ( name )
{
	return this.xmlDoc.createTextNode( name );
};
/**
 * 新規に要素を作成し、テキストノードに値を設定する
 * @param {String} ns 名前空間を指定する
 * @param {String} name 要素名を指定する
 * @param {String} text テキストノードにセットする値を指定する
 * @return {Node} ノード
 * @lang ja
 */
/**
 * Newly creates element and sets value to text node.
 * @param {String} ns Namespace.
 * @param {String} name Element name.
 * @param {String} text Value to set to text node.
 * @return {Node} Node.
 * @lang en
 */
XMLLib.XMLBase.prototype.createElementNSwithText = function (ns, name, text) 
{
	var node = this.createElementNS(ns, name);
	var tn = this.createTextNode(text);
	node.appendChild(tn);
	return node;
};
/**
 * 指定したノードに対して名前空間を定義する
 * @param {String} namespace 名前空間となる文字列を指定する
 * @param {Object} node 定義先のノードを指定する
 * @param {Bool} force 名前空間がすでに定義されていた場合も、強制的に定義するか否かを指定する
 * @return {Node} ノード
 * @lang ja
 */
/**
 * Defines namespace to specified node.
 * @param {String} namespace String representing namespace.
 * @param {Object} node Node for which to define namespace.
 * @param {Bool} force Whether to force definition even if namespace has already been defined.
 * @return {Node} Node.
 * @lang en
 */
XMLLib.XMLBase.prototype.addNSDeclaration = function ( namespace, node , force)
{
    //引数namespaceの名前空間を持つか確認し、nsへ格納
	var ns = this.nss.get(namespace);

    //nsがblank or forceがONの場合は、強制的に名前空間参照属性を加える
    //例:xmlns:cfg="http://www.fujixerox.co.jp/2003/12/ssm/management/****"
	if (! ns.defined || force){
		var attrnode = this.xmlDoc.createAttribute("xmlns:"+ns.prefix);
		attrnode.nodeValue = ns.url;
		node.setAttributeNode(attrnode);
		ns.defined = true;
	}
	
	return node;
};
/**
 * 引数で指定された名前空間とそのプレフィクスを追加する
 * @param {String} namespace 名前空間の文字列
 * @param {String} prefix 名前空間のプレフィクス
 * @lang ja
 */
/**
 * Adds namespace specified by argument and its prefix.
 * @param {String} namespace String representing namespace.
 * @param {String} prefix Namespace prefix.
 * @lang en
 */
XMLLib.XMLBase.prototype.addNSPrefix = function (namespace, prefix)
{

	var ns = new XMLLib.Namespace(namespace, prefix);
	this.nss.nss.push(ns);
};
/**
 * @private
 */
XMLLib.XMLBase.createRootElement = function ( ns, name )
{
	var velement = XMLLib.createXMLObject("<" + name + ' xmlns="' + ns + '"/>');
	return velement;
};
/**
 * @private
 */
XMLLib.XMLBase.escapeString = function ( str )
{
	return escape(str);
};
/**
 * @private
 */
 //urlとprefixの紐付け関係を示すためのペアオブジェクトの生成(ただの格納処理)
XMLLib.Namespace = function(url, prefix)
{
	this.url = url;
	this.prefix = prefix;
	this.defined = false;
};

/**
 * Namespaces インスタンスを作成する
 * @constructor
 * @class 名前空間を定義するクラス
 * @lang ja
 */
 /**
 * Creates Namespaces instance.
 * @constructor
 * @class Class for defining namespaces.
 * @lang en
 */

//生成する配列nssには、
//各必要NameSpaceごとにNamespace名とそのプレフィクスのペアをそれぞれ格納する
XMLLib.Namespaces = function()
{
	/**
	 *	名前空間の定義
	 *	@type Namespace (Array)
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Namespace definition.
	 *	@type Namespace (Array)
	 *	@private
	 *  @lang en
	 */
	this.nss = new Array();
	
	//配列nssへ下記各名前空間/プレフィクスのペアをpushする
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.SOAP, XMLLib.NSPREFIX.SOAP));
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.JT, XMLLib.NSPREFIX.JT));
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.JTM, XMLLib.NSPREFIX.JTM));
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.JTM2, XMLLib.NSPREFIX.JTM2));
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.XSI, XMLLib.NSPREFIX.XSI));
	this.nss.push(new XMLLib.Namespace(XMLLib.NS.XENC, XMLLib.NSPREFIX.XENC));
};
/**
 * @private
 */
XMLLib.Namespaces.prototype.get = function (url) 
{
    //配列nssの要素数を格納
	var len = this.nss.length;
	//namespace格納の配列に、引数指定のnamespaceがマッチしていれば、
	//urlをそのままかえす
	for (var i = 0; i < len; i++) {
		if (this.nss[i].url == url){
		    return this.nss[i];
		}
	}
	//
	return null;
};
/**
 * @private
 */
XMLLib.Namespaces.prototype.getPrefix = function (url)
{
	var ns = this.get(url);
	
	if (ns != null) { return ns.prefix; }
	return null;
};
/**
 * @private
 */
XMLLib.Namespaces.prototype.isDefined = function (url)
{
	var ns = this.get(url);
	
	if (ns != null) { return ns.defined; }
	return false;
};

/**
 * XMLSOAP インスタンスを作成する
 * @constructor
 * @extends XMLLib.XMLBase
 * @class XMLドキュメントを作成するクラス<br>
 * @lang ja
 */
/**
 * Creates XMLSOAP instance.
 * @constructor
 * @extends XMLLib.XMLBase
 * @class This class creates XML document class.<br>
 * @lang en
 */
XMLLib.XMLSOAP = function()
{
	/**
	 *	@private
	 */
	 //空文字列をXMLDOMに変換する
	this.xmlDoc = XMLLib.createXMLObject("");
	/**
	 *	@private
	 */
	 //
	this.rootElement = null;
	/**
	 *	@private
	 */
	 //名前空間とプレフィクスのペア
	this.nss = new XMLLib.Namespaces();
	/**
	 *	@private
	 */
	this.header = null;
	/**
	 *	@private
	 */
	this.body = null;
};
Extend(XMLLib.XMLSOAP.prototype, XMLLib.XMLBase.prototype);
/**
 * SOAPメッセージのルート要素となるSOAPエンベロープを作成する
 * @param {Bool} withHeader SOAPヘッダの有無をtrue/falseで指定する
 * @return {Object(DOM)} SOAPエンベロープ
 * @lang ja
 */
/**
 * Creates SOAP Envelope, root element of SOAP mesasage.
 * @param {Bool} withHeader Whether or not to include SOAP header.
 * @return {Object(DOM)} SOAP Envelope.
 * @lang en
 */
XMLLib.XMLSOAP.prototype.createSOAPEnvelope = function (withHeader)
{
    //Envelope要素をルート要素として生成
	var envelope = this.createDocumentElement( XMLLib.NS.SOAP, "Envelope" );

    //Header要素を生成
	if (withHeader) {
	    //指定された名前空間で新規に要素を作成する
		var soapHeader = this.createElementNS(XMLLib.NS.SOAP, "Header" );
		this.header = soapHeader;
		envelope.appendChild( soapHeader );
	}
	
	//body要素を生成
	//指定された名前空間で新規に要素を作成する
	var soapBody = this.createElementNS(XMLLib.NS.SOAP, "Body" );
	this.body = soapBody;
	envelope.appendChild( soapBody );
	
	return envelope;
};
/*-------CommonFunction-------*/
/**
 * 指定されたXMLノードをシリアライズし、文字列に変換する
 * @param {XMLNode} node XMLノード
 * @returns {String} シリアライズされたXML文字列
 * @lang ja
 */
/**
 * Serializes specified XML node and converts to string.
 * @param {XMLNode} node XML node.
 * @returns {String} Serialized XML string.
 * @lang en
 */
XMLLib.XMLToString = function(node) {
	var str=null;
	var slzr = null;
	if(window.XMLSerializer)
	{
		slzr = new XMLSerializer();
		str = slzr.serializeToString(node);
	}
	else
	{
		slzr = node.xml;
		str = slzr;
	}
	return str;
};
/**
 * 起動したブラウザによりDOMParserの生成方法を判断し、XMLオブジェクトを生成する(クロスブラウザ対応)
 * @param {String} XMLStr:XML文字列(空文字可)
 * @returns {Object(DOM)} DOMオブジェクト生成失敗：null<br>
 * DOMオブジェクト生成成功：xmlobj<br>
 * 【注記】XML形式でない文字列を引数として渡した場合には、パースに失敗し、不正なDOMオブジェクトが生成される
 * @lang ja
 */
/**
 * Determines DOM parser creation method based on browser started, and creates XML object (cross-browser).s
 * @param {String} XMLStr: XML string (null string permitted).
 * @returns {Object(DOM)} null: DOM object creation failed<br>
 * xmlobj: DOM object successfully created.
 * NOTE: If non-XML string is specified as argument, parsing fails and invalid DOM object is created.<br>
 * @lang en
 */
 //DOMParser
XMLLib.createXMLObject = function(XMLStr)
{
    
	var xmlobj = null;

    //IE系のブラウザ構成の場合は下記
	if(window.DOMParser)
	{
	    //XMLテキストをXMLDOMに変換する
		xmlobj = new DOMParser().parseFromString(XMLStr, 'text/xml');
	}
	//FireFox系のブラウザ構成の場合は下記
	else if(window.ActiveXObject)
	{
		try
		{
			xmlobj = new ActiveXObject("Msxml2.XMLDOM");
		}
		catch(e)
		{
			xmlobj = new ActiveXObject('Microsoft.XMLDOM');
		}
		xmlobj.loadXML(XMLStr);
	}
	return xmlobj;
};
/**
 * 異なるDOMオブジェクト間でノードをインポートする
 * @param {Object} doc インポート先のDOMドキュメントを指定する
 * @param {Object} target インポート先のノードを指定する
 * @param {Object} node インポート元のノードを指定する
 * @return {Node} インポート先のノード
 * @lang ja
 */
/**
 * Imports node between different DOM objects.
 * @param {Object} doc Destination DOM document. 
 * @param {Object} target Destination node.
 * @param {Object} node Source node.
 * @return {Node} Destination node.
 * @lang en
 */
XMLLib.importNode = function(doc, target, node)
{
	var newnode = null;
	if (node.nodeType == 1 /* ELEMENT_NODE */) {
		newnode = doc.createElement(node.nodeName);
		var attrs = node.attributes;
		var i = 0;
		while (attrs.item(i) != null) {
			newnode.setAttribute(attrs.item(i).nodeName, attrs.item(i).nodeValue);
			i++;
		}
		for (var n = node.firstChild; n != null; n = n.nextSibling)
		{
			newnode = XMLLib.importNode(doc, newnode, n);
		}
	} else if (node.nodeType == 3 /* TEXT_NODE */) {
		newnode = doc.createTextNode(node.nodeValue);
	} else if (node.nodeType == 8 /* COMMENT_NODE */) {
		newnode = doc.createComment(node.nodeValue);
	} else {
		//alert("NodeType: " + node.nodeType + " not supported val: "+node.nodeValue);
	}
	if (target != null && newnode != null) {
		target.appendChild(newnode);
	}
	return target;
};
/**
 * 再帰的にオブジェクトをコピーする
 * @param {Object} dupeObj コピー元のオブジェクトを指定する
 * @return {Object} コピーしたオブジェクト
 * @lang ja
 */
/**
 * Recursively copies objects.
 * @param {Object} dupeObj Copy source object.
 * @return {Object} Copied object.
 * @lang en
 */
XMLLib.deepObjCopy = function(dupeObj) {
	var retObj = new Object();
	if (typeof(dupeObj) == 'object') {
		//if (typeof(dupeObj.length) != 'undefined' )
		if (dupeObj && typeof(dupeObj.length))
			retObj = new Array();
		for (var objInd in dupeObj) {
			if (typeof(dupeObj[objInd]) == 'object') {
				retObj[objInd] = XMLLib.deepObjCopy(dupeObj[objInd]);
			} else if (typeof(dupeObj[objInd]) == 'string') {
				retObj[objInd] = dupeObj[objInd];
			} else if (typeof(dupeObj[objInd]) == 'number') {
				retObj[objInd] = dupeObj[objInd];
			} else if (typeof(dupeObj[objInd]) == 'boolean') {
				((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
			}
		}
	}
	return retObj;
};
/**
 * 指定したオブジェクトに同一構造のオブジェクトをコピーする
 * @param {Object} dupeObj コピー元のオブジェクトを指定する
 * @param {Object} retObj コピー先のオブジェクトを指定する
 * @lang ja
 */
/**
 * Copies object of same structure to specified object.
 * @param {Object} dupeObj Copy source object.
 * @param {Object} retObj Copy destination object.
 * @lang en
 */
XMLLib.deepObjRecovery = function(dupeObj, retObj) {
	//if (typeof(dupeObj.length) != 'undefined') {
	if (dupeObj && typeof(dupeObj.length)){
		for (var objInd in retObj) {
			if (typeof(retObj[objInd]) == 'object') {
				if(typeof(dupeObj[objInd]) != 'undefined') {
					XMLLib.deepObjRecovery(dupeObj[objInd], retObj[objInd], objInd);
				} else {
					if(arguments[2]) {
						if(objInd != 0)	{
							while(retObj.length > objInd) {
								retObj.pop();
							}
						} else {
							while(retObj.length > 0) {
								retObj.pop();
							}
						}
					}
				}
			} else if (typeof(retObj[objInd]) == 'string') {
				retObj[objInd] = dupeObj[objInd];
			} else if (typeof(retObj[objInd]) == 'number') {
				retObj[objInd] = dupeObj[objInd];
			} else if (typeof(retObj[objInd]) == 'boolean') {
				((dupeObj[objInd] == true) ? retObj[objInd] = true : retObj[objInd] = false);
			}
		}
	}
};

/**
 * SOAPMsg インスタンスを作成する
 * @constructor
 * @example
 * ■使用例 
 *		①指示書作成クラスを定義する
 *		function JobTemplate ()
 *		  {
 *			クラスの定義
 *		  }
 *		②SOAPMsgクラスを継承する
 *		  Extend(JFLib.JobTemplate.prototype, XMLLib.SOAPMsg.prototype);
 *		③メッセージ構築メソッドを定義する
 *		  JobTemplate.prototype.createMsg = function () 
 *		④serializeToStringメソッドを呼び出すことで、文字列の形にシリアライズされたSOAPメッセージを生成する
 *		  JobTemplate.serializeToString();
 * @class SOAPメッセージを作成するクラス<br>
 * @lang ja
 */
/**
 * Creates SOAPMsg instance.
 * @constructor
 * @example
 * EXAMPLE 
 *    1. Define class for creating Job Flow Sheet
 *     function JobTemplate ()
 *      {
 *     Define class
 *      }
 *    2. Extend SOAPMsg class
 *      Extend(JFLib.JobTemplate.prototype, XMLLib.SOAPMsg.prototype);
 *    3. Define method for message construction
 *      JobTemplate.prototype.createMsg = function () 
 *    4. Call serializeToString method to create SOAP message serialized to string form
 *      JobTemplate.serializeToString();
 * @class This class creates SOAP messages.<br>
 * @lang en
 */
XMLLib.SOAPMsg = function() {};
/**
 * SOAPメッセージ本体を構築する<br>
 * SOAPMsgインスタンス作成時点での仮メソッド定義であり、<br>
 * このメソッドについては継承先の各クラスにてそれぞれ同名のメソッドを定義する必要がある
 * @lang ja
 */
/**
 * Creates SOAP message. <br>
 * This method is temporarily defined for use upon SOAPMsg instance creation; <br>
 * method of the same name must be defined for each class extended from SOAPMsg class.
 * @lang en
 */
XMLLib.SOAPMsg.prototype.createMsg = function ()
{
	return false;
};
/**
 * 作成されたSOAPメッセージを文字列の形にシリアライズする
 * @return {String} 文字列の形にシリアライズされたSOAPメッセージ
 * @lang ja
 */
/**
 * Serializes created SOAP message to string form.
 * @return {String} SOAP message serialized to string form.
 * @lang en
 */
XMLLib.SOAPMsg.prototype.serializeToString = function ()
{
	var msg = this.createMsg();

	var strMsg = XMLLib.XMLToString(msg);

	return strMsg;
};

/**
 * 指定したノードからオブジェクトを再帰的に生成する
 * @param {Node} node ノードを指定する
 * @returns {Object} 指定したノードにテキストノード以外の複数の子要素が存在する場合
 * @returns {String} 指定したノードにテキストノードしか存在しない場合
 * @addon
 * @static
 * @private
 * @lang ja
 */
 /**
 * Recursively creates objects from specified node.
 * @param {Node} node Node
 * @returns {Object} When specified node contains multiple child elements.
 * @returns {String} When specified node contains only text node.
 * @addon
 * @static
 * @private
 * @lang en
 */
 //Author: Miho Yamada, Fuji Xerox Co., Ltd.
XMLLib.childNodeToProperty = function(node)	
{
	if(!node){
		return "";
	}
	var _childNodeLen = node.childNodes.length;
	var _childNode = null;
	//Returns text if child node is text node
	if(_childNodeLen==1 &&  node.firstChild && node.firstChild.nodeType == 3){
		return node.firstChild.nodeValue;
	} else {
		var object = new Object();
		for(var i=0; i < _childNodeLen; i++){
			_childNode = node.childNodes[i];
			if(_childNode.nodeType == 1  && _childNode.nodeName){ //ELEMENT_NODE
				if(_childNode.firstChild){
					//Recursive processing if child node exists
					object[_childNode.localName] = XMLLib.childNodeToProperty(_childNode);	//Prefix causes error; hence localName
				} else {
					//子ノードがない場合は、値が空のプロパティを生成
					object[_childNode.localName] = "";
				}
			}
		}
		return object;
	}
};