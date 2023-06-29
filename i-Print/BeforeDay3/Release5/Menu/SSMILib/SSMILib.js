/**
 * @fileoverview SESAMiI/F利用のためのクラス定義<br>
 * SESAMiI/F利用のために必要な基本となるクラスが定義される<br>
 * SSMILibを使用する際には、本ライブラリを必ず最初にロードすること
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.1.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for using SESAMiI/F.<br>
 * Defines basic classes necessary for using SESAMiI/F.<br>
 * To use SSMILib, this library must be loaded first.
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.1.0
 * @lang en
 */
document.write('<script type="text/javascript" src="./SSMILib/GetDeviceInfo.js" charset="UTF-8"></script>');

 /**
 * SSMIを利用したデバイスからの各種情報を取得するクラスための名前空間定義
 * @namespace SSMIを利用したデバイスからの各種情報を取得を行う
 * @static
 * @lang ja
 */
 /**
 * Namespace definition for classes for retrieving device information using SSMI.
 * @namespace Retrieves device information using SSMI.
 * @static
 * @lang en
 */

var SSMILib = {
	/**
	 *	SSMILibのバージョンを表す
	 *	@constant
	 *	@type String
	 *  @lang ja
	 */
	 /**
	 *	SSMILib version.
	 *	@constant
	 *	@type String
	 *  @lang en
	 */
	version		:	"1.1.0",
	/**
	 *	通信先のホストを設定する<br>
	 *	ポート番号を指定したい場合はホストに含める必要がある。
	 *	@type String
	 *	@default "localhost"
	 *  @lang ja
	 */

	/**
	 *	Destination host.<br>
	 *	Port number should be specified as part of host string.
	 *	@type String
	 *	@default "localhost"
	 *  @lang en
	 */
	host		:	"localhost",
	/**
	 *	通信プロトコルを設定する
	 *	@type String
	 *	@default "http://"
	 *  @lang ja
	 */

	/**
	 *	Communication protocol.
	 *	@type String
	 *	@default "http://"
	 *  @lang en
	 */
	protocol	:	"http://",
	/**
	 *	非同期か否かを設定する
	 *	@type Bool
	 *	@default 非同期
	 *  @lang ja
	 */

	 /**
	 *	Whether communication is asynchronous or not.
	 *	@type Bool
	 *	@default Asynchronous (true)
	 *  @lang en
	 */
	async		:	true
};
/**
 * 初期化処理
 * @param {String} host 通信先のIPアドレスを指定する
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Initialization
 * @param {String} host IP address of desitnation host.
 * @addon
 * @static
 * @lang en
 */
SSMILib.init = function(host)
{
	SSMILib.listener = null;

	if(host){
		SSMILib.host = host;
	}

	//SSMILib.auth = false;
	return;
};

/**
 * イベントハンドラを登録する。<br>
 * イベントハンドラは以下の形式の関数である必要がある。<br>
 * ContentsLibを利用する場合には、ContentsLibに登録したイベントハンドラに通知されるため設定不要。<br>
 * function(<i>msgID</i>, <i>result</i>, <i>obj</i>)<br>
 * ここで<i>msgID</i>はイベント名を表す文字列、<i>result</i>は処理の成否を表す真偽値、<br>
 * <i>obj</i>は通信の結果返されるオブジェクトを表す。<br>
 * なお、ContentsLibを利用する場合には、ContentsLibのイベントを利用すること。
 * @param {Function} func イベントハンドラを指定する
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Sets event handler.<br>
 * When using ContentsLib, events are notified to ContentsLib event handler; <br>
 * therefore event handler need not be set using this method.<br>
 * Event handler must be function of the following format.
 * function(<i>msgID</i>, <i>result</i>, <i>obj</i>)<br>
 * Here, <i>msgID</i> is string representing event ID, <br>
 * <i>result</i> is boolean representing success/failure, <br>
 * and <i>obj</i> is object returned as a result of communication.<br>
 * When using ContentsLib, use events defined in ContentsLib.
 * @param {Function} func Event handler.
 * @addon
 * @static
 * @lang en
 */
SSMILib.setEventListener = function(func)
{
	SSMILib.listener = func;
	return;
};

/**
 * 設定済みのイベントハンドラを実行する。<br>
 * なお、ContentsLibを利用する場合には、ContentsLibのイベントを利用すること。
 * @param {String} msgId イベントIDを指定する
 * @param {Bool} result 通信処理の成功可否を指定する
 * @param {Object} obj 通信結果によって得られたオブジェクトを指定する
 * @addon
 * @static
 * @private
 * @lang ja
 */
 /**
 * Runs set event handler.<br>
 * When using ContentsLib, use events defined in ContentsLib.
 * @param {String} msgId Event ID.s
 * @param {Bool} result Whether communcation was successful or not.
 * @param {Object} obj Object obtained by communication.
 * @addon
 * @static
 * @private
 * @lang en
 */
SSMILib.onEvent = function(msgId, result, obj)
{
	if (SSMILib.listener) {
		SSMILib.listener(msgId, result, obj);
	}
	return;
};

/**
 * Attribute要素を子要素に持つノードから属性名を抽出し、同名のプロパティを持つオブジェクトを生成する
 * @param {Node} node Attribute要素を子要素に持つノードを指定する
 * @returns {Object} _object Attribute要素の属性名をプロパティに持つ、オブジェクト
 * @addon
 * @static
 * @private
 * @lang ja
 */
 /**
 * Extracts attribute name from node with Attribute element as child element, and creates object with property of same name.
 * @param {Node} node Node with Attribute element as child element.
 * @returns {Object} _object Object with property named after Attribute element attribute name.
 * @addon
 * @static
 * @private
 * @lang en
 */
SSMILib.attrNodeToObject = function(node)
{
	var _tmpAttrName = null;
	var _attrNode = node.getElementsByTagName("Attribute");
	var _attrLen = _attrNode.length;
	var _object = new Object();

	for(var i=0; i < _attrLen; i++){
		_tmpAttrName = _attrNode[i].getAttribute("name");
		if(_attrNode[i].nodeType == 1 && _tmpAttrName){ // ELEMENT_NODE
			if(_attrNode[i].firstChild){
				_object[_tmpAttrName] = _attrNode[i].firstChild.nodeValue;
			} else {
				_object[_tmpAttrName] = "";
			}
		}
	}
	return _object;
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
SSMILib.childNodeToProperty = function(node)
{
	//Modified to reference XMLLib.childeNodeToProperty, which uses localnames of child nodes. M. Yamada, 11/10/2010
	/*if(!node){
		return "";
	}
	var _childNodeLen = node.childNodes.length;
	var _childNode = null;
	//子ノードがテキストノードの場合は値を返す
	if(_childNodeLen==1 &&  node.firstChild && node.firstChild.nodeType == 3){
		return node.firstChild.nodeValue;
	} else {
		var object = new Object();
		for(var i=0; i < _childNodeLen; i++){
			_childNode = node.childNodes[i];
			if(_childNode.nodeType == 1  && _childNode.nodeName){ //ELEMENT_NODE
				if(_childNode.firstChild){
					//子ノードがある場合は、再帰処理
					object[_childNode.nodeName] = SSMILib.childNodeToProperty(_childNode);
				} else {
					//子ノードがない場合は、値が空のプロパティを生成
					object[_childNode.nodeName] = "";
				}
				//object[_childNode.nodeName] = _childNode.firstChild ? SSMILib.childNodeToProperty(_childNode) : "";
			}
		}
		return object;
	}*/
	return XMLLib.childNodeToProperty(node);
};
/**
 * 指定したプロパティがオブジェクトに存在するか判断する
 * @param {Object} object オブジェクトを指定する
 * @param {Object} object オブジェクトを指定する
 * @returns {Bool} 真偽値
 * @addon
 * @static
 */
/*
SSMILib.isProperty = function(object, name)
{
	return name in object;
}
SSMILib.getProperty(object, propName){
	return SSMILib.isProperty(object, propName) ? object[propName] : null;
}
*/

/**
 * @Abstract class 抽象クラス(Constructor)の定義
 **/
SSMILib.RemoteAccess = function(){};

/**
 * @Abstract Method 抽象メソッド定義であり、<br>
 * このメソッドについて同名のメソッドを定義する必要がある
 **/
SSMILib.RemoteAccess.Interceptor = function(){
	if(arguments[2]) return arguments[2];
};

/**
 * @static
 */
SSMILib.CreateSoapFaultObj = function (res)
{
	var comm = new WebServiceLib.Communicator();
	var faultObj = comm.getSoapFaultInfo(res);
	if(faultObj){
		return faultObj;
	}else
		return new Object();
};

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class FILTERに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in FILTER.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.FILTER = function(){};

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class filterに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used for filtering.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.FILTER.OPTION = function(){};

/**
 * 等しい
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Equal
 * @constant
 * @type  String
 * @lang en
 */
SSMILib.FILTER.OPTION.EQUAL = "Equal";

/**
 * 以上
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Greater than or equal
 * @constant
 * @type  String
 * @lang en
 */
SSMILib.FILTER.OPTION.GT_EQUAL =	"GreaterThanEqual";

/**
 * 以下
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Less than or equal
 * @constant
 * @type  String
 * @lang en
 */
SSMILib.FILTER.OPTION.LT_EQUAL =	"LessThanEqual";

/**
 * パターンマッチ
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Like
 * @constant
 * @type  String
 * @lang en
 */
SSMILib.FILTER.OPTION.LIKE =	"Like";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class FILTER.TYPEに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in FILTER.TYPE</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.FILTER.TYPE = function() {};

/**
 * 条件を含んで絞込みを行う
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Inclusion
 * @constant
 * @type  String
 * @lang en
 */
SSMILib.FILTER.TYPE.IN = "Inclusion";

/**
 * 条件を含まず絞込みを行う
 * @constant
 * @type  String
 * @lang ja
 */
/**
 * Exclusion
 * @final
 * @type  String
 * @constant
 * @lang en
 */
SSMILib.FILTER.TYPE.EX = "Exclusion";

/**
 * Filters インスタンスを作成する
 * @constructor
 * @class Filters扱うためのクラス<br>
 * @lang ja
 */
/**
 * Creates Filters instance.
 * @constructor
 * @class This class is for handling Filters.<br>
 * @lang en
 */
SSMILib.Filters = function(){

	/**
	 *	Filterのタイプを設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Filter type.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.filterType = SSMILib.FILTER.TYPE.IN;

	/**
	 *	FilterのOptionを設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Filter options.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.filterOption = SSMILib.FILTER.OPTION.EQUAL;

	/**
	 *	検索する文字列を設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	String for pattern matching.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.matchingPattern = null;

	/**
	 *	検索対象のエレメント名を指定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Name of element to search.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.elementId = null;

	/**
	 *	検索対象エレメントのNamespaceを設定する。
	 *	@type String
	 *	@default なし
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Namespace of element to search.
	 *	@type String
	 *	@default None.
	 *	@private
	 *  @lang en
	 */
	this.idNS= null;
};

/**
 * @private
 */
SSMILib.Filters.prototype.toXmlNode = function (xml)
{
	if(this.filterType){
		var mgtNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management";
		xml.addNSPrefix(mgtNS, "mgt");
		var filters = xml.createElementNS(mgtNS, 'Filters');
		var filter = xml.createElementNS(mgtNS, this.filterType);
		if(this.filterOption){
			xml.setAttributeNS(filter, null, 'extent', this.filterOption);
			if(this.matchingPattern){
				var idTag = xml.createElementNS(this.idNS, this.elementId);
				var text = xml.createTextNode(this.matchingPattern);
				idTag.appendChild(text);
				filter.appendChild(idTag);
			}
			filters.appendChild(filter);
		}
		return filters;
	}
};
