/** 
 * @fileoverview ジョブフロー作成のためのクラス定義
 * JobTemplateクラス<br>
 * Headerクラス<br>
 * 共通で使用される各種クラス<br>
 * これらのクラスを使用するには
 * <ul>
 * <li>ToolsLib/XML.js
 * </ul>
 * のロードが必要となる。<br><br>
 * 本ファイルをロードすると、
 * <ul>
 * <li>JfsDefCom.js
 * </ul>
 * が自動的にロードされる<br><br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.3.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for creating job flows, e.g.:
 * JobTemplate Class<br>
 * Header Class<br>
 * Other classes used commonly for this purpose<br>
 * To use these classes,
 * <ul>
 * <li>ToolsLib/XML.js
 * </ul>
 * must be loaded.<br><br>
 * When this file is loaded,
 * <ul>
 * <li>JfsDefCom.js
 * </ul>
 * is loaded automatically.<br><br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.3.0
 * @lang en
 */
 
 /**
 * ジョブフロー作成のための名前空間定義
 * @namespace ジョブフロー作成を行う
 * @static
 * @lang ja
 */
/**
 * Definition of namespace for creating Job Flow Sheets
 * @name JFLib
 * @namespace Namespace for Job Flow creation
 * @static
 * @lang en
 */
var JFLib = {
	/** @private **/
	_JfsCom: "",
	/**
	 *	イベントハンドラの登録先
	 *	@property
	 *	@type function
	 *	@private
	 */	
	listener		:	null
};

/** @private **/
JFLib.JSInclude = function(jsname)
{
	if (eval("JFLib._" + jsname) == undefined) {
//		eval("JFLib._" + jsname + " = 1;");
		document.write('<script type="text/javascript" src="./JFLib/' + jsname  + '.js" charset="UTF-8"></script>');
	}
};

//JfsDefCom.jsのロード
//document.write('<script type="text/javascript" src="./JFLib/JfsDefCom.js" charset="UTF-8"></script>');
JFLib.JSInclude("JfsDefCom");
/**
 * JFLibで通知するイベントの型
 * @private
 */
JFLib.eventType = {
	NONE		:	0,
	NOTSET		:	1,
	SET			:	2,
	VALIDATE	:	3
};



/** @private **/
JFLib.JSIncluded = function(jsname)
{
	eval("JFLib._" + jsname + " = 1;");
	//alert("includeJS " +jsname);
};

/**
 * イベントハンドラを登録する
 * @param {Function} func イベントハンドラを指定する
 * @returns なし
 * @addon
 * @static
 */
JFLib.setEventListener = function(func)
{
	JFLib.listener = func;
	return;
};

/**
 * 設定済みのイベントハンドラを実行する
 * @param {String} msgId イベントIDを指定する
 * @param {Bool} result 設定処理の成功可否を指定する
 * @param {Object} obj 設定処理によって変更のあったパラメータを指定する
 * @returns なし
 * @addon
 * @static
 * @private
 */
JFLib.onEvent = function(msgId, result, obj)
{
	if (JFLib.listener) {
		JFLib.listener(msgId, result, obj);
	}
	return;
};

/**
 * 各プロパティから値を取得する
 * @param {String} property 出力処理の各プロパティ名
 * @returns {Object/String/Number} 指定したプロパティの値
 * @returns {Objext} null 指定したプロパティが存在しない場合
 */
JFLib.getParam = function(property)
{
	if(!(property in this)) {
		return null;
	}
	if(typeof(this[property]) == 'object') {
		return	XMLLib.deepObjCopy(this[property]);
	} else {
		return this[property];
	}
};

/**
 * 各プロパティに対して値を設定する
 * @param {String} property 出力処理の各プロパティ名
 * @param {Object/String/Int/Bool} value 設定する値
 * @returns {Bool} 指定したパラメータの値が変更された場合はtrue
 * @returns {Bool} 変更不可もしくは、変更前と同様の状態の場合はfalse
 */
JFLib.setParam = function(property, value)
{
	if(!(property in this)) {
		return false;
	}

	var valueType = JFLib.getValueType(value);
	switch(valueType) {

		case 'object':
			return JFLib.setObjParam(this[property], value);
		case 'array':
			var aryLen = value.length;
			if (!(this[property] instanceof Array)) {
				this[property] = new Array();
			}
			for (var i = 0; i < aryLen; i++) {
				this[property].push(value[i]);
			}
			return true;
		case 'number':
		case 'string':
		case 'boolean':
			if (this[property] != value) {
				this[property] = value;
				return true;
			}
			else {
				return false;
			}
	}
};
/**
 * 各プロパティに対して値を設定する
 * @param {String} propertyObj 出力処理の各プロパティ名
 * @param {Object/String/Int/Bool} value 設定する値
 * @returns {Bool} 指定したパラメータの値が変更された場合はtrue
 * @returns {Bool} 変更不可もしくは、変更前と同様の状態の場合はfalse
 * @private
 */
JFLib.setObjParam = function(propertyObj, value)
{
	var isChangedParam = false; //階層内のパラメータに変更があるか否か
	for(var i in value) {
		if(i in propertyObj) {
			var valueType = JFLib.getValueType(value[i]);
			switch(valueType) {
				case 'object':
					if(JFLib.setObjParam(propertyObj[i], value[i])) {
						isChangedParam = true;	//階層内のパラメータに変更があれば、通知
					}	
					break;
				case 'array':
					var aryLen = value.length;
					if (!(propertyObj instanceof Array)) {
						propertyObj[i] = new Array();
					}
					for (var j = 0; j < aryLen; j++) {
						propertyObj[i].push(value[i][j]);
					}
					isChangedParam = true;
					break;
				case 'number':
				case 'string':
				case 'boolean':
					if (propertyObj[i] != value[i]) {
						propertyObj[i] = value[i];
						isChangedParam = true;
					}
					break;
			}
		}
	}
	return isChangedParam;
};
/**
 * 指定された値の型を返す
 * @param {Object/String/Int/Bool} value 設定する値
 * @returns {Bool} 指定したパラメータの型(object/array/string/number/boolean)
 * @private
 */
JFLib.getValueType = function(value)
{
	var valueType = typeof(value);
	//if(valueType == 'object' && value instanceof Array) {
	if(valueType == 'object' && 'length' in value) {
		valueType = 'array';
	}
	return valueType;
};

 /**
 * Assign インスタンスを作成する
 * @constructor
 * @addon
 * @public
 * @param {String} from コピー元のxpathの初期値
 * @param {String} to コピー先のxpathの初期値
 * @param {bool} append コピー時の追加/置換の初期値
 * @param {bool} back 文書操作処理をジョブの前に行うか、後に行うかの初期値null
 * @example 
 * ■使用例 
 *		var from = "//" + XMLLib.NSPREFIX.JT + ":Scan/" + XMLLib.NSPREFIX.JT + ":ColorMode";
 *		var to = "//" + XMLLib.NSPREFIX.JT + ":Invoke/" + XMLLib.NSPREFIX.JT + ":Profile/" + XMLLib.NSPREFIX.JT + ":Description";
 *		var assign = new JFLib.Assign(from, to, true, false);
 * @class 文書操作処理を指定するクラス<br>
 * 本クラスは文書操作処理として扱う<br>
 * <a href="JFLib.OutputProcess.html#addAssign">addAssign</a>にて各ジョブに設定する
 * @lang ja
 */
/**
 * Creates Assign instance.
 * @constructor
 * @addon
 * @public
 * @param {String} from Default source node xpath.
 * @param {String} to Default destination (target) node xpath.
 * @param {bool} append Default append/replace settings
 * @param {bool} back Default pre-/post-job settings
 * @example 
 * EXAMPLE: 
 *		var from = "//" + XMLLib.NSPREFIX.JT + ":Scan/" + XMLLib.NSPREFIX.JT + ":ColorMode";
 *		var to = "//" + XMLLib.NSPREFIX.JT + ":Invoke/" + XMLLib.NSPREFIX.JT + ":Profile/" + XMLLib.NSPREFIX.JT + ":Description";
 *		var assign = new JFLib.Assign(from, to, true, false);
 * @class This class specifies Assign operations.
<br>
 * This class handled as Assign process, <br>
 * and is set to jobs using <a href="JFLib.OutputProcess.html#addAssign">addAssign</a>.
 * @lang en
 */
JFLib.Assign = function(from , to, append, back)
{
	/**
	 *	コピー元のxpathを設定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String(xpath)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Xpath of source node.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type String(xpath)
	 *	@default null
	 *  @lang en
	 */	
	this.from = "";
	if(from) { this.from = from;	}
	/**
	 *	コピー先のxpathを設定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String(xpath)
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Xpath of destination (target) node.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type String(xpath)
	 *	@default null
	 *  @lang en
	 */	
	this.to = "";
	if(to) {	this.to = to; }
	/**
	 *	コピー時の追加/置換をtrue/falseで設定する<br>設定 - <font color = "#ff0000">必須</font><br>
	 *	trueの場合には追加として動作し、falseの場合には置換として動作する
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */	
	/**
	 *	Sets whether to append to or replace specified target node.<br><font color = "#ff0000">REQUIRED.</font><br>
	 *  When true is specified, node is appended; when false is specified, node is replaced.
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */	
	this.append = false;
	if(append) {	this.append = append; }
	/**
	 *	文書操作処理をジョブの前に行うか、後に行うかをtrue/falseで設定する<br>設定 - <font color = "#ff0000">必須</font><br>
	 *	falseの場合にはジョブの前の処理として追加し、trueの場合には後の処理として追加する
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */	
	/**
	 *	"Sets whether to perform Assign before or after job.<br><font color = "#ff0000">REQUIRED.</font><br>
	 *  When false is specified, Assign is performed preceding job; when true is specified, Assign is performed after job.
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */	
	this.back = false;
	if(back) { this.back = back;	}
};

/**
 * @private
 */	
JFLib.Assign.prototype.toXmlNode = function (xml) 
{
	//var assign = xml.createElementNS(XMLLib.NS.JT, "Assign");
	var xsiType = this.append? "jt:Append" : "jt:Replace";
	var duplicate = xml.createElementNS(XMLLib.NS.JT, 'Duplicate');
	xml.setAttributeNS(duplicate, XMLLib.NS.XSI, 'type', xsiType);
	
	var source = duplicate.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Source'));
	xml.setAttributeNS(source, XMLLib.NS.JT, 'xpath', this.from);
	var dest = duplicate.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destination'));
	xml.setAttributeNS(dest, XMLLib.NS.JT, 'xpath', this.to);
	
	//return assign;
	return duplicate;
};
/**
 * Assign要素において、xpathで参照する要素/属性に対して、未定義の名前空間を定義する
 * @param {String} ns 名前空間の文字列
 * @param {String} prefix 名前空間のプレフィクス
 * @lang ja
 */
/**
 * Sets namespace that is yet undefined to element/attribute referenced by xpath in Assign element.
 * @param {String} ns String representing namespace
 * @param {String} prefix Namespace prefix
 * @lang en
 */
JFLib.Assign.prototype.addNameSpace = function(ns, prefix)
{
	if(ns) {
		if(!this.asNameSpace) {
			this.asNameSpace = new Array();
		}
		this.asNameSpace.push(ns);
	}
	if(prefix) {
		if(!this.asPrefix) {
			this.asPrefix = new Array();
		}
		this.asPrefix.push(prefix);
	}
	return;
};
/**
 * MailNotify インスタンスを作成する
 * @constructor
 * @param {bool} enable メール通知処理をする/しないの初期値
 * @param {String} sub メール通知の件名の初期値
 * @param {String} com メール通知の本文の初期値
 * @param {String} adrs メール通知アドレスの初期値
 * @example 
 * ■使用例 
 *		var notfy = new MailNotify(true, "メール通知", "これはメール通知です", "test@test.co.jp");
 * @class メール通知処理を設定する為のクラス
 * 本クラスはメール通知処理として扱う
 * <a href="OutputProcess.html#addMailNotify">addMailNotify</a>にて各ジョブに設定する 
 * @lang ja
 */
/**
 * Creates MailNotify instance.

 * @constructor
 * @param {bool} enable Default settings as to wheher to perform email notification.
 * @param {String} sub Default subject of notification email.
 * @param {String} com Default content of notification email.
 * @param {String} adrs Default destination address of notification email.
 * @example 
 * EXAMPLE: 
 *		var notfy = new MailNotify(true, "Email notification", "This is a notification email", "test@test.co.jp");
 * @class Class for setting email notification feature.<br>
 * This class is handled as email notification process, <br>
 * and is set to jobs using <a href="OutputProcess.html#addMailNotify">addMailNotify</a>.
 * @lang en
 */
JFLib.MailNotify = function(enable, sub , com, adrs)
{
	/**
	 *	メール通知をする/しないを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */
	/**
	 *	Whether to perform email notification.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.enable = false;
	if(enable) { this.enable = enable; }
	/**
	 *	メール通知先アドレスを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Notification email destination address.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.address = '';
	if(adrs) { this.address = adrs; }
	/**
	 *	メール通知元情報を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	From address.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.fromAddress = '';
	/**
	 *	メール通知件名を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Subject of notification email.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.subject = '';
	if(sub) { this.subject = sub; }
	/**
	 *	メール通知本文を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Content of notification email.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.comment = '';
	if(com) { this.comment = com; }
};
/**
 * @private
 */	
JFLib.MailNotify.prototype.toXmlNode = function (xml) 
{
	var message = xml.createElementNS(XMLLib.NS.JT, 'Message');
	message.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Enabled', this.enable));
	message.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Subject', this.subject));
	message.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Comment', this.comment));
	var notify = message.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Smtp'));
	notify.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Address', this.address));
	notify.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MailFrom', this.fromAddress));
	return message;
};

/**
 * Transaction インスタンスを作成する
 * @class トランザクション処理を行うためのクラス
 * @constructor
 * トランザクション処理中であれば<a href="JFLib.Transaction.html#!s!commit>commit</a>で処理を確定するまでは、<br>
 * <a href="JFLib.Transaction.html#!s!rollback>rollback</a>によりトランザクション前の値に戻す事ができる<br><br>
 * @example 
 * ■使用例 
 *		var copy = new JFLib.Copy();
 *		copy.beginTransaction();	//パラメータを一時保存
 *		copy.inputMedium.size = MS.A4LEF;
 *		copy.rollback();	//パラメータを変更前の状態に戻す
 * @lang ja
 */
/**
 * Transaction Creates Transaction instance.
 * @class Class for processing transactions.
 * @constructor
 * If active transaction is in process, transaction can be rolled back using <a href="JFLib.Transaction.html#!s!rollback>rollback</a>, <br>
 * until transaction is committed using <a href="JFLib.Transaction.html#!s!commit>commit</a>.<br><br>
 * @example 
 * EXAMPLE: 
 *		var copy = new JFLib.Copy();
 *		copy.beginTransaction();	//Temporarily store parameter.
 *		copy.inputMedium.size = MS.A4LEF;
 *		copy.rollback();	//Rollback parameter change.
 * @lang en
 */

JFLib.Transaction = function()
{
	/**
	 * パラメータを保存するためのバックアップ領域
	 * @type Object(DOM)
	 * @default null
	 * @private
	 * @lang ja
	 */
	/**
	 * Backup area for parameter.
	 * @type Object(DOM)
	 * @default null
	 * @private
	 * @lang en
	 */
	this.backup = null;
	/**
	 * トランザクション処理中であることを示すフラグ
	 * @type Bool
	 * @default false
	 * @private
	 * @lang ja
	 */
	/**
	 * Flag indicating whether transaction is in process.
	 * @type Bool
	 * @default false
	 * @private
	 * @lang en
	 */
	this.transaction = false;
};

/**
 * トランザクション処理の開始を宣言する<br>現在のパラメータのスナップショットを保存する
 * @lang ja
 */
/**
 * Declares start of transaction. <br>Stores snapshot of current parameters.
 * @lang en
 */

JFLib.Transaction.prototype.beginTransaction = function()
{
	this.transaction = true;

	
	//スナップショットを保存
	if(this.transaction) {
		this.backup = "";
	}
	this.backup = XMLLib.deepObjCopy(this); 
};

/**
 * パラメータの値を確定する<br>保持されていた変更前の値は破棄される
 * @lang ja
 */
/**
 * Commits parameter value.<br>Original value is discarded.
 * @lang en
 */

JFLib.Transaction.prototype.commit = function ()
{
	if (this.transaction && this.backup != null) { this.backup = 'undefined'; }
};

/**
 * パラメータの値を破棄し、保持されていた変更前の値に戻す
 * @lang ja
 */

/**
 * Parameter change is discarded and parameter is set back to original value.
 * @lang en
 */

JFLib.Transaction.prototype.rollback = function ()
{
	//保存しておいたスナップショット(this.backup)を現在のObjectにコピー
	XMLLib.deepObjRecovery(this.backup, this);
};

/**
 * 処理の各プロパティに対して値を設定する
 * @param {String} property 出力処理の各プロパティ名
 * @param {String/Int/Bool/Object} value 設定する値
 * @returns {Object} 成功時、true
 * @returns {Object} 失敗時、false
 */
JFLib.Transaction.prototype.setParam = JFLib.setParam;
/**
 * 処理の各プロパティから値を取得する
 * @param {String} property 出力処理の各プロパティ名
 * @returns {Object} 成功時、プロパティの値(Object)
 * @returns {Object} 失敗時、null
 */
JFLib.Transaction.prototype.getParam = JFLib.getParam;

/**
 * OutputProcess インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @return なし <br>
 * @class 出力処理の並列実行処理/文書操作処理/メール通知処理/一時領域を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates OutputProcess instance.
 * @constructor
 * @extends JFLib.Transaction
 * @class This class specifies concurrent processing, document handling, and temporary workspace for for output processes.
<br>
 * @lang en
 */
JFLib.OutputProcess = function()
{
	/**
 	 *	出力処理の並列実行を設定する<br>設定 - 任意
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */	
	/**
 	 *	Whether output processes are to be run concurrently.<br>IMPLIED.
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */	
	this.concurrence = false;
	/**
 	 *	出力処理の前に文書操作処理を設定する<br> 設定 - 任意
	 *	複数の文書操作処理を設定することができる
	 *	@type JFLib.Assign
	 *	@default null
	 *	@private
	 *  @lang ja
	 */	
	/**
 	 *	Whether to perform Assign before output.<br> IMPLIED.
	 *	Multiple Assign processes can be set.
	 *	@type JFLib.Assign
	 *	@default null
	 *	@private
	 *  @lang en
	 */	
	this.frontAssign = "";
	/**
 	 *	出力処理の後に文書操作処理を設定する<br> 設定 - 任意
	 *	複数の文書操作処理を設定することができる
	 *	@type JFLib.Assign
	 *	@default null
	 *	@private
	 *  @lang ja
	 */	
	/**
 	 *	Whether to perform Assign after output.<br> IMPLIED.
	 *	Multiple Assign processes can be set.
	 *	@type JFLib.Assign
	 *	@default null.
	 *	@private
	 *  @lang en
	 */	
	this.backAssign = "";
	/**
 	 *	メール通知処理を設定する<br> 設定 - 任意
	 *	複数のメール通知処理を設定することができる
	 *	@type JFLib.MailNotify
	 *	@default null
	 *	@private
	 *  @lang ja
	 */	
	/**
 	 *	Email notification process.<br> IMPLIED.
	 *	Multiple email notification processes can be set.
	 *	@type JFLib.MailNotify
	 *	@default null
	 *	@private
	 *  @lang en
	 */	
	this.notify = "";
	/**	一時的に処理対象となる情報を格納するためのノード(XML形式の文字列も可)を設定する<br>設定 - 任意<br> 初期値 - なし<br>
	 *	ノードを設定する場合は、ルート要素として＜jt:Workspace xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate" ＞を設定し、その子要素として任意に設定すること<br>
	 *	@example
	 *	■使用例 
	 *		--文字列の場合--
	 *		this.workSpace = '<jt:Workspace xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate" >
	 *					<jt:Name>name</jt:Name>
	 *					<jt:Description>this is a test.</jt:Description>
	 *				</jt:Workspace>'
	 *		のように指定する
	 *	■制限事項 
	 *		EWBV3ブラウザでは例えば「abc-」など、半角英数後のハイフンがある要素が含まれている場合、パースに失敗することがあるため、ノードの形式での設定を推奨する
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang ja
	 */	
	 
	/**	Node serving as workspace; i.e. that storing temporary information (may be XML string) for processing.<br>IMPLIED.<br> No default value. <br>
	 *	Root element of node specified must be <jt:Workspace xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate" >; child elements shall be set accordingly.<br>
	 *	@example
	 *	EXAMPLE: 
	 *		--When specifying XML string--
	 *		this.workSpace = '<jt:Workspace xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate" ><jt:Name>name</jt:Name><jt:Description>This is a test.</jt:Description></jt:WorkSpace>'
	 *	RESTRICTIONS: 
	 *		When using EWBV3, parse may fail when element with value of alphanumerics + hyphen (e.g. "abc-") is present. 
	 * 		It is therefore recommended that a node be first created and set to workSpace.
	 *	@type Object(Node) / String(XML)
	 *	@default null
	 *  @lang en
	 */	
	this.workSpace = "";
};

/**
 * 出力処理の並列実行を設定する<br> 
 * @param {Bool} b 出力処理の並列実行をtrue/falseで指定する
 * @return {Bool} concurrence
 * @lang ja
 */
/**
 * Whether output processes are to be run concurrently.<br> 
 * @param {Bool} b Boolean value specifying whether output processes are to be performed concurrently.
 * @return {Bool} concurrence
 * @lang en
 */
JFLib.OutputProcess.prototype.setConcurrence = function (b)
{

	if(b) {
		this.concurrence = b;
	}
	return this.concurrence;
};
/**
 * @private
 */
JFLib.OutputProcess.prototype.getConcurrence = function ()
{
	/**
	 * @private
	 */
	return this.concurrence;
};
/**
 * 出力処理に対して文書操作処理を設定する<br> 
 * @param {JFLib.Assign} as 文書操作処理を指定する
 * @param {bool} back 文書操作処理を出力処理の後ろに設定するか否かを指定する
 * @return {JFLib.Assign} 文書操作処理
 * @lang ja
 */
/**
 * Sets Assign processing to output.<br> 
 * @param {JFLib.Assign} as Assign process.
 * @param {bool} back Whether to perform Assign after output.
 * @return {JFLib.Assign} Assign process.
 * @lang en
 */
JFLib.OutputProcess.prototype.addAssign = function(as, back)
{
	//var assign;
	var position;

	//LibVer2.0.8との互換性のため、引数がない場合は指定されたAssignに設定されているbackを利用する
	if(arguments.length == 1) {
		position = as.back;
	} else {
		position = back;
	}
	
	if (!position) {
		if(!this.frontAssign) {
			this.frontAssign = 	new Array();
		}
		this.frontAssign.push(as);
		return this.frontAssign[this.frontAssign.length-1];
	} else {
		if(!this.backAssign) {
			this.backAssign = 	new Array();
		}
		this.backAssign.push(as);
		return this.backAssign[this.backAssign.length-1];
	}
};
/**
 * 出力処理に対して文書操作処理を位置を指定して設定する
 * @param {JFLib.Assign} as 文書操作処理を指定する
 * @param {Int} index 処理を設定する位置を指定する
 * @param {bool} back 文書操作処理を出力処理の後ろに設定するか否かを指定する
 * @return {JFLib.Assign} 文書操作処理
 * @lang ja
 */
/**
 * Inserts Assign process to specified position of output process.
 * @param {JFLib.Assign} as Assign 
 * @param {Int} index Position index for insertion.
 * @param {bool} back Whether to perform Assign after output.
 * @return {JFLib.Assign} Assign process 
 * @lang en
 */
JFLib.OutputProcess.prototype.insertAssign = function (as, index, back) 
{
//	var assign;
	var position;

	if(arguments.length == 2) {
		position = as.back;
	} else {
		position = back;
	}
	if(!position){
		this.frontAssign = JFLib._insertAssign(this.frontAssign, as, index);
		return this.frontAssign[index];
	} else {
		this.backAssign = JFLib._insertAssign(this.backAssign, as, index);
		return this.backAssign[index];
	}
	
};
/*
 * @private
 */
JFLib._insertAssign = function(p_as, as, index)
{
	if (p_as == null) {
		p_as = new Array();
		p_as.push(as);
	} else {
		var s_ary = new Array();
		var e_ary = new Array();

		if(index != 0) {
			s_ary = p_as.slice(0,index);
		}

		s_ary.push(as);
		e_ary = p_as.slice(index,p_as.length);
		p_as = s_ary.concat(e_ary);
	}
	return p_as;
};


/**
 * 出力処理に対して設定されている文書操作処理を削除する
 * @param {JFLib.Assign} as 文書操作処理を指定する
 * @param {bool} back 出力処理の後ろに設定した文書操作処理か否かを指定する
 * @return {JFLib.Assign} 文書操作処理
 * @lang ja
 */
/**
 * Deletes Assign process set to output process.
 * @param {JFLib.Assign} as Assign process. 
 * @param {bool} back Whether Assign process was set to be performed after output.
 * @return {JFLib.Assign} Assign process. 
 * @lang en
 */
JFLib.OutputProcess.prototype.deleteAssign = function (as, back) 
{
//	var assign;
	var position;

	if(arguments.length == 1) {
		position = as.back;
	} else {
		position = back;
	}
	if(!position) {
		this.frontAssign = JFLib._deleteAssign(this.frontAssign, as);
		return this.frontAssign;
	} else {
		this.backAssign = JFLib._deleteAssign(this.backAssign, as);
		return this.backAssign;
	}

};

/*
 * @private
 */
JFLib._deleteAssign = function(p_as, as)
{
	var asLen = p_as.length;
	for(var i=0; i< asLen; i++) {
		if(p_as[i] == as) {
			break;
		}
	}

	var s_ary = new Array();
	var e_ary = new Array();

	if(i != asLen) {
		if(i == 0) {
			e_ary = p_as.slice(1,asLen);
		} else {
			s_ary = p_as.slice(0,i);
			e_ary = p_as.slice(i+1,asLen);
		}
		p_as = s_ary.concat(e_ary);
	}

	return p_as;


};
/**
 * 出力処理に対してメール通知処理を設定する<br> 
 * @param {JFLib.MailNotify} notify メール通知処理を指定する
 * @return {JFLib.MailNotify} メール通知処理
 * @lang ja
 */
/**
 * Sets email notification to output process.<br>
 * @param {JFLib.MailNotify} notify Email notification.
 * @return {JFLib.MailNotify} Email notification.
 * @lang en
 */
JFLib.OutputProcess.prototype.addMailNotify = function(notify)
{
	if(!this.notify) {
		this.notify = new Array();
	}
	if(notify) {
		this.notify.push(notify);
	}
	return this.notify[this.notify.length-1];
};
/**
 * 出力処理に対してメール通知処理を位置を指定して設定する
 * @param {JFLib.MailNotify} mn メール通知処理を指定する
 * @param {Int} index 処理を設定する位置を指定する
 * @return {JFLib.MailNotify} メール通知処理
 * @lang ja
 */
/**
 * Inserts email notification to specified position of output process.
 * @param {JFLib.MailNotify} mn Email notification.
 * @param {Int} index Position index for insertion.
 * @return {JFLib.MailNotify} Email notification.
 * @lang en
 */
JFLib.OutputProcess.prototype.insertMailNotify = function (mn,index) 
{
	if (this.notify == null) {
		this.notify = new Array();
		this.notify.push(mn);
	} else {
		var s_ary = new Array();
		var e_ary = new Array();

		if(index != 0) {
			s_ary = this.notify.slice(0,index);
		}

		s_ary.push(mn);
		e_ary = this.notify.slice(index,this.notify.length);
		this.notify = s_ary.concat(e_ary);
	}

	return this.notify[index];
};

/**
 * 出力処理に対して設定されているメール通知処理を削除する
 * @param {JFLib.MailNotify} mn メール通知処理を指定する
 * @return {JFLib.MailNotify} メール通知処理
 * @lang ja
 */
/**Output process.
 * Deletes email notification set to output process.
 * @param {JFLib.MailNotify} mn Email notification.
 * @return {JFLib.MailNotify} Email notification.
 * @lang en
 */
JFLib.OutputProcess.prototype.deleteMailNotify = function (mn) 
{
	if (this.notify == null) return this.notify;

	var mnLen = this.notify.length;
	for(var i=0; i< mnLen; i++) {
		if(this.notify[i] == mn) {
			break;
		}
	}

	var s_ary = new Array();
	var e_ary = new Array();

	if(i != mnLen) {
		if(i == 0) {
			e_ary = this.notify.slice(1,mnLen);
		} else {
			s_ary = this.notify.slice(0,i);
			e_ary = this.notify.slice(i+1,mnLen);
		}
		this.notify = s_ary.concat(e_ary);
	}
	return this.notify;
};

/**
 * 変数workSpaceに任意のノード(XML形式の文字列も可)を設定する<br> 
 * @param {Object(Node) / String(XML)} ws 任意のXML文字列またはノードオブジェクトを指定する
 * @return {Object(Node) / String(XML)} 任意のXML文字列またはノードオブジェクト
 * @lang ja
 */
/**
 * Sets node (XML string allowed) to workSpace parameter.<br> 
 * @param {Object(Node) / String(XML)} ws XML string / node
 * @return {Object(Node) / String(XML)} XML string / node
 * @lang en
 */
JFLib.OutputProcess.prototype.setWorkSpace = function(ws)
{
	if(ws){
		this.workSpace = ws;
	}
	return this.workSpace;
};
/**
 * @private
 */
Extend(JFLib.OutputProcess.prototype, JFLib.Transaction.prototype);

// Header部

/**
 * @private
 */
JFLib.getDateTime = function() 
{
	var _val = "";
	var date = new Date();
	var yy = date.getFullYear();
	var mm = date.getMonth() + 1;
	if(mm < 10)mm = "0" + mm;
	var dd = date.getDate();
	if(dd < 10)dd = "0" + dd;
	var h = date.getHours();
	if(h < 10)h = "0" + h;
	var m = date.getMinutes();
	if(m < 10)m = "0" + m;
	var s = date.getSeconds();
	if(s < 10)s = "0" + s ;
	
	_val = yy.toString();
	
	_val += "-" + mm + "-" + dd;
	_val += "T" + h + ":" +m + ":" + s;
	var tz = date.getTimezoneOffset();
	if (tz > 0) {
		_val += "-";
	} else {
		_val += "+";
		tz = -tz;
	}
	tz = tz / 60;
	if (tz < 10) tz = "0" + tz;
	_val += tz + ":00";
	return _val;
};

/**
 * Keyword インスタンスを作成する
 * @constructor
 * @param {String} v 検索キーワードの初期値を設定する
 * @param {JFLib.KEY} scope 検索キーワードの利用対象をあらわす定数を設定するs
 * @class ジョブフローの検索キーワードを設定する為のクラス<br>
 * キーワードは複数設定することが可能
 * @lang ja
 */
/**
 * Creates Keyword instance.
 * @constructor
 * @param {String} v Deafult search keyword.
 * @param {JFLib.KEY} scope Constant specifying scope of search keyword.
 * @class This class sets search keyword for Job Flow Sheet. <br>
Multiple keywords may be specified.
 * @lang en
 */
JFLib.Keyword = function(v, scope) 
{
	/**
	 * 検索キーワードを設定する
	 * @type String
	 * @default null
	 *  @lang ja
	 */
	/**
	 * Search keyword.
	 * @type String
	 * @default null
	 *  @lang en
	 */
	this.val = "";
	if (v) { this.val = v; }	
	/**
	 * 検索キーワードの利用対象をあらわす定数を設定する<br> 設定 - 任意
	 * @type JFLib.KEY
	 * @default システムが機械的に検索する場合に用いる
	 * @lang ja
	 */	
	/**
	 * Constant specifying scope of search keyword.<br> IMPLIED.
	 * @type JFLib.KEY
	 * @default System default. (Search performed by system.)
	 * @lang en
	 */	
	this.scope = JFLib.KEY.SYSTEM;
	if (v) { this.scope = scope; }
	
};

/**
 * @class ジョブフローのHeader情報を設定する為のクラス
 * @constructor
 * @return A new Header
 * @lang ja
 */
/**
 * @class This class sets Header of Job Flow Sheet.
 * @constructor
 * @return A new Header
 * @lang en
 */
JFLib.Header = function()
{
	/**
	 * ジョブフローの名称を設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow name.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.name =					'';
	/**
	 * ジョブフローの内容詳細を設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow description.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.description =			'';
	/**
	 * ジョブフローの言語仕様のバージョンを設定する<br> 設定 - 任意
	 * @type String
	 * @default '3.0.9'
	 * @lang ja
	 */
	/**
	 * Job Flow Language Specification version.<br> IMPLIED.
	 * @type String
	 * @default '3.0.9'
	 * @lang en
	 */
	this.version =				'3.0.9';
	/**
	 * ジョブフローの言語要素構成の範囲を設定する<br> 設定 - 任意
	 * @type JFLib.LANGPROFILE
	 * @default 全ての言語要素を使用して記述
	 * @lang ja
	 */
	/**
	 * Job Flow language range.<br> IMPLIED.
	 * @type JFLib.LANGPROFILE
	 * @default All elements.
	 * @lang en
	 */
	this.profile =				JFLib.LANGPROFILE.ALL;
	/**
	 * ジョブフローの著作権を設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow copyright.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.copyright =			'';
	/**
	 * ジョブフローの著作者を設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow author.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.author =				'';
	/**
	 * ジョブフローを作成したアプリケーションを設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Application that created Job Flow.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.createdby =			'';
	/**
	 * ジョブフローを作成したベンダの識別子を設定する<br> 設定 - 任意
	 * @type String
	 * @default 0
	 * @lang ja
	 */
	/**
	 * Job Flow supplier identifier.<br> IMPLIED.
	 * @type String
	 * @default 0
	 * @lang en
	 */
	this.identifier =			0;
	/**
	 * ジョブフローの作成日時を設定する<br> 設定 - 任意
	 * @type String(YYYY-MM-DD T HH:MM:SS+HH:MMの形式)
	 * @default 作成した日時
	 * @lang ja
	 */
	/**
	 * Job Flow created date.<br> IMPLIED.
	 * @type String (format: YYYY-MM-DD T HH:MM:SS+HH:MM)
	 * @default Created date.
	 * @lang en
	 */
	this.creationDateTime =		JFLib.getDateTime();
	/**
	 * ジョブフローの更新日時を設定する<br> 設定 - 任意
	 * @type String(YYYY-MM-DDTHH:MM:SS+HH:MMの形式)
	 * @default 作成した日時
	 * @lang ja
	 */
	/**
	 * Job Flow modified date.<br> IMPLIED.
	 * @type String (format: YYYY-MM-DDTHH:MM:SS+HH:MM)
	 * @default Created date.
	 * @lang en
	 */
	this.modificationDateTime =	JFLib.getDateTime();
	/**
	 * ジョブフローの対象機種種別を設定する<br> 設定 - 任意
	 * @type String(Array)
	 * @default "1.3.6.1.4.1"
	 * @lang ja
	 */
	/**
	 * OID of target device model.<br> IMPLIED.
	 * @type String(Array)
	 * @default "1.3.6.1.4.1"
	 * @lang en
	 */
	this.machineoid =			new Array("1.3.6.1.4.1");
	/**
	 * ジョブフローの検索キーワードを設定する<br> 設定 - 任意
	 * キーワードはpushメソッドにより複数設定することが可能
	 * @type JFLib.KEY(Array)
	 * @default なし
	 * @lang ja
	 */
	/**
	 * Job Flow search keyword.<br> IMPLIED. <br>
	 * Multiple keywords may be specified using push method.
	 * @type JFLib.KEY (Array)
	 * @default None.
	 * @lang en
	 */
	this.keyword =				new Array(); 
};
/**
 * @private
 */
JFLib.Header.prototype.toXmlNode = function (xml, jobtemplate)
{
	var jt = xml.createElementNS(XMLLib.NS.JT, 'JobTemplate');

	xml.setAttributeNS(jt, XMLLib.NS.JT, 'version', this.version);
	xml.setAttributeNS(jt, XMLLib.NS.JT, 'profile', this.profile);
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Description', this.description));
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Copyright', this.copyright));
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Author', this.author));
	var createby = jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'CreatedBy', this.createdby));
	xml.setAttributeNS(createby, XMLLib.NS.JT, 'identifier', this.identifier);
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'CreationDateTime', this.creationDateTime));
	jt.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ModificationDateTime', this.modificationDateTime));
	var ti = jt.appendChild(xml.createElementNS(XMLLib.NS.JT, 'TargetInterpreters'));
	var oidLen = this.machineoid.length;
	for(var i = 0; i < oidLen; i++) {
		ti.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MachineOID', this.machineoid[i]));
	}

	var node = jt.appendChild(xml.createElementNS(XMLLib.NS.JT, 'ExecutionHints'));
	var rsnode = node.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Resources'));
	var len = jobtemplate.input.length;
	for (var i = 0; i < len; i++) {
		jobtemplate.input[i].addRscNode(xml, rsnode);
	}
	if(jobtemplate.output != null) {
		len = jobtemplate.output.length;
		for (var i = 0; i < len; i++) {
			jobtemplate.output[i].addRscNode(xml, rsnode);
		}
	}
	if(jobtemplate.notification && jobtemplate.notification.length > 0) {
		len = jobtemplate.notification.length;
		for (var i=0; i<len; i++){
			jobtemplate.notification[i].addRscNode(xml,rsnode);
		}
	}
	var jobat = node.appendChild(xml.createElementNS(XMLLib.NS.JT, 'JobAttributes'));
	if(jobtemplate.name) {
		jobat.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', jobtemplate.name));
	}
	if(jobtemplate.category) {
		var cate = jobat.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Categories'));
		cate.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Category', jobtemplate.category));
	}
	var kws = jt.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Keywords'));
	var keyLen = this.keyword.length;
	if (keyLen) {
		for(var i = 0; i < keyLen; i++) {
			var key = kws.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Keyword', this.keyword[i].val));
			xml.setAttributeNS(key, XMLLib.NS.JT, 'scope', this.keyword[i].scope);
		}
	}

	return jt;

};
/**
 * JobTemplate インスタンスを作成する
 * @class ジョブフロー作成の基本となるクラス<br>
 * Envelope要素では以下の名前空間がデフォルトで定義される<br>
 * xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate"<br>
 * xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"<br>
 * xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @return A new JobTemplate
 * @lang ja
 */
/**
 * Creates JobTemplate instance.
 * @class This class is a basis for Job Flow Sheet creation. <br>
 * By default, the following namespaces are defined in Envelope element:<br>
 * xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate"
 * xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
 * xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @return A new JobTemplate
 * @lang en
 */

JFLib.JobTemplate = function(name) 
{
	/**
	 * ジョブフローのHeader情報を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 * @type JFLib.Header
	 * @default new JFLib.Header()
	 * @lang ja
	 */
	/**
	 * Job Flow Header information.<br> <font color = "#ff0000">REQUIRED.</font><br>
	 * @type JFLib.Header
	 * @default new JFLib.Header()
	 * @lang en
	 */
	this.header = new JFLib.Header();
	/**
	 * ジョブフローの入力処理を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 * @type Object(Array)
	 * @default new Array()
	 * @lang ja
	 */
	/**
	 * Input process in Job Flow.<br> <font color = "#ff0000">REQUIRED.</font><br>
	 * @type Object(Array)
	 * @default new Array()
	 * @lang en
	 */
	this.input = new Array();
	/**
	 * ジョブフローの出力処理を設定する<br> 設定 - <font color = "#ff0000">必須</font><br>
	 * @type JFLib.OutputProcess
	 * @default new Array()
	 * @lang ja
	 */
	/**
	 * Output process in Job Flow.<br> <font color = "#ff0000">REQUIRED.</font><br>
	 * @type JFLib.OutputProcess
	 * @default new Array()
	 * @lang en
	 */
	this.output = new Array();
	/**
	 * ジョブフローのジョブの名称を設定する<br> 設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow job name.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.name = "";
	if (name) this.header.name = name;
	/**
	 * ジョブフローのジョブのカテゴリを設定する<br> 設定 - 任意
	 * @type JFLib.JOBCATEGORY
	 * @default null
	 * @lang ja
	 */
	/**
	 * Job Flow job category.<br> IMPLIED.
	 * @type JFLib.JOBCATEGORY
	 * @default null
	 * @lang en
	 */
	this.category = "";
	/**
	 * ジョブフローで実行されたジョブに対する例外の処理方法を設定する<br> 設定 - 任意
	 * @type JFLib.PROCESS
	 * @default エラーを検知した時点で処理中断し、ジョブを異常終了させる
	 * @lang ja
	 */
	/**
	 * Behavior upon failure of job run in Job Flow.<br> IMPLIED.
	 * @type JFLib.PROCESS
	 * @default Processes are aborted upon error detection and job is aborted.
	 * @lang en
	 */
	this.process = JFLib.PROCESS.ABORT;
	
	/**
	* ユーザ通知処理を指定する<br>設定 - 任意
	* @type JFLib.Notification
	* @default new Array()
	* @lang ja
	*/
	/**
	* Specifies user notification.<br> IMPLIED.
	* @type JFLib.Notification
	* @default new Array()
	* @lang en
	*/
	this.notification = new Array();
};
/**
 * MachineOIDを設定する
 * @param {String} name MachineOIDを指定する
 * @return {String(Array)} MachineOID
 * @lang ja
 */
/**
 * Machine OID of device.
 * @param {String} name MachineOID.
 * @return {String(Array)} MachineOID.
 * @lang en
 */
JFLib.JobTemplate.prototype.setOids = function (name)
{
	if (!this.header.machineoid) {
		this.header.machineoid = new Array();
	}
	return this.header.machineoid.push(name);
};
/**
 * 作成アプリケーション/ベンダの識別子を設定する
 * @param {String} cb 作成アプリケーションを指定する
 * @param {Int} id ベンダの識別子を指定する
 * @return {Array} [createby, identifier] 作成アプリケーション/ベンダの識別子
 * @lang ja
 */
/**
 * Application that created Job Flow / Job Flow supplier identifier.
 * @param {String} cb Application that created Job Flow.
 * @param {Int} id Job Flow supplier identifier.
 * @return {Array} [createby, identifier] Application that created Job Flow / Job Flow supplier identifier.
 * @lang en
 */

JFLib.JobTemplate.prototype.setCreatedby = function (cb, id)
{
	if(cb) { this.header.createdby = cb;}
	if(id) { this.header.identifier = id;}
	return [this.header.createdby, this.header.identifier];
};

/**
 * キーワード（可読）を設定する
 * @param {String} kw キーワード（可読）を指定する
 * @return {String(Array)} キーワード（可読）
 * @lang ja
 */
/**
 * Keyword (readable)
 * @param {String} kw Keyword (readable)
 * @return {String(Array)} Keyword (readable)
 * @lang en
 */
JFLib.JobTemplate.prototype.setKeyword = function (kw)
{
	if (!this.header.keyword) {
		this.header.keyword = new Array();
	}
	var key = new Keyword(kw);
	key.scope = KEY.HUMAN;
	return this.header.keyword.push(key);
};
/**
 * キーワード（システム）を設定する
 * @param {String} kw キーワード（システム）を指定する
 * @return {String(Array)} キーワード（システム）
 * @lang ja
 */
/**
 * Keyword (system)
 * @param {String} kw Keyword (system)
 * @return {String(Array)} Keyword (system)
 * @lang en
 */
JFLib.JobTemplate.prototype.setSystemKeyword = function (kw)
{
	if (!this.header.keyword) {
		this.header.keyword = new Array();
	}
	var key = new Keyword(kw);
	key.scope = KEY.SYSTEM;
	return this.header.keyword.push(key);
};
/**
 * 変数inputに入力処理を設定する
 * @param {Object} ip 入力処理を指定する
 * @return {Object} 入力処理
 * @lang ja
 */
/**
 * Sets input process to input variable.
 * @param {Object} ip Input process.
 * @return {Object} Input process.
 * @lang en
 */
JFLib.JobTemplate.prototype.setInputProcess = function (ip) 
{
	if (this.input == null) {
		this.input = new Array();
	}
	//this.input.push(ip);
	this.input[0] = ip;
	return this.input[0];
};
/**
 * Sets outputに複数の出力処理を設定する 
 * @param {Object} op 出力処理を指定する
 * @return {JFLib.OutputProcess} 出力処理
 * @lang ja
 */
/**
 * Sets output process to output variable.
 * @param {Object} op Output process.
 * @return {JFLib.OutputProcess} Output process.
 * @lang en
 */

JFLib.JobTemplate.prototype.addOutputProcess = function (op) 
{
	if (this.output == null) {
		this.output = new Array();
	}
	this.output.push(op);
	return this.output[this.output.length-1];
};
/**
 * 出力処理の型の指定により、変数outputに出力処理を設定する
 * @param {JFLib.OutputProcessType} type 出力処理の型を指定する
 * @return {JFLib.OutputProcess} 出力処理
 * @lang ja
 */
/**
 * Sets output process to output variable by specifying ouptut process type.
 * @param {JFLib.OutputProcessType} type Output process type.
 * @return {JFLib.OutputProcess} Output process.
 * @lang en
 */
JFLib.JobTemplate.prototype.setOutputProcess = function (type) 
{
	if (this.output == null) {
		this.output = new Array();
	}
	var obj=null;
	switch( type ) {
		case JFLib.OutputProcessType.Print:
			obj = new JFLib.Print();
			break;
		case JFLib.OutputProcessType.Fax:
			obj = new JFLib.Fax();
			break;
		case JFLib.OutputProcessType.FileTransfer:
			obj = new JFLib.FileTransfer();
			break;
		case JFLib.OutputProcessType.Email:
			obj = new JFLib.Email();
			break;
		case JFLib.OutputProcessType.IFax:
			obj = new JFLib.IFax();
			break;
		case JFLib.OutputProcessType.PBox:
			obj = new JFLib.PBox();
			break;
		case JFLib.OutputProcessType.ESR:
		case JFLib.OutputProcessType.ESRWithDoc:
			obj = new JFLib.Invoke();
			break;
	}
	this.output.push(obj);
	return this.output[this.output.length-1];
};
/**
 * 変数outputに出力処理を位置を指定して設定する
 * @param {Object} op 出力処理を指定する
 * @param {Int} index 処理を設定する位置を指定する
 * @return {JFLib.OutputProcess} Output process
 * @lang ja
 */
/**
 * Inserts output process to specified position of output parameter.
 * @param {Object} op Output process.
 * @param {Int} index Position index for insertion.
 * @return {JFLib.OutputProcess} Output process.
 * @lang en
 */
JFLib.JobTemplate.prototype.insertOutputProcess = function (op,index) 
{
	if (this.output == null) {
		this.output = new Array();
		this.output.push(op);
	} else {
		var s_ary = new Array();
		var e_ary = new Array();

		if(index != 0) {
			s_ary = this.output.slice(0,index);
		}

		s_ary.push(op);
		e_ary = this.output.slice(index,this.output.length);
		this.output = s_ary.concat(e_ary);
	}

	return this.output[index];
};
/**
 * 変数outputに設定されている出力処理を削除する
 * @param {Object} op 出力処理を指定する
 * @return {JFLib.OutputProcess} 出力処理
 * @lang ja
 */
/**
 *  Deletes output process set to output variable.
 * @param {Object} op Output process.
 * @return {JFLib.OutputProcess} Output process.
 * @lang en
 */
JFLib.JobTemplate.prototype.deleteOutputProcess = function (op) 
{
	if (this.output == null) return this.output;

	var opLen = this.output.length;
	for(var i=0; i< opLen; i++) {
		if(this.output[i] == op) {
			break;
		}
	}

	var s_ary = new Array();
	var e_ary = new Array();

	if(i != opLen) {
		if(i == 0) {
			e_ary = this.output.slice(1,opLen);
		} else {
			s_ary = this.output.slice(0,i);
			e_ary = this.output.slice(i+1,opLen);
		}
		this.output = s_ary.concat(e_ary);
	}
	return this.output;
};

/**
 * ユーザ通知を追加する
 * @param {Object} JFLib.Notification  ユーザ通知オブジェクトを指定する
 * @return {Object} JFLib.Notification
 * @lang ja
 */
JFLib.JobTemplate.prototype.addNotification = function(nt)
{
	if(!this.notification) {
		this.notification = new Array();
	}
	if(nt) {
		this.notification.push(nt);
	}
	return this.notification[this.notification.length-1];
};
/**
 * @private
 */
JFLib.JobTemplate.prototype.createProcessRequest = function (xml) 
{
	var pr = xml.createElementNS(XMLLib.NS.JT, 'ProcessRequest');
	var setup = pr.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Setup'));
	//setup.appendChild(xml.createElementNS(XMLLib.NS.JT, "OperatorInputs"));
	var eh = setup.appendChild(xml.createElementNS(XMLLib.NS.JT, 'ExceptionHandler'));
	var ca = eh.appendChild(xml.createElementNS(XMLLib.NS.JT, 'CatchAll'));
	xml.setAttributeNS(ca, XMLLib.NS.JT, 'action', this.process);
	return pr;
};

/**
 * @private
 */
Extend(JFLib.JobTemplate.prototype, XMLLib.SOAPMsg.prototype);
/**
 * 指示書即時実行用のSOAPメッセージを作成する
 * @return 指示書即時実行用のSOAPメッセージ(DOMNode)
 * @private
 * @lang ja
 */
/**
 * Creates SOAP message for immediate Job Flow run.
 * @return SOAP message (DOMNode) for immediate Job Flow run.
 * @private
 * @lang en
 */
JFLib.JobTemplate.prototype.createMsg = function () 
{
	var coname = "Acquire";
	var isCopy = false;

	if(this.input[0] != null && this.input[0].toXmlNode2 != null) {
	//if(!this.output.length) {
		isCopy = true;
		coname = "Copy";
	}

	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var header = xml.header;
	var body = xml.body;

	xml.addNSDeclaration(XMLLib.NS.JT, root, false);
	xml.addNSDeclaration(XMLLib.NS.JTM, root, false);
	var env = xml.createElementNS(XMLLib.NS.SOAP, 'Envelope');
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);
	xml.addNSDeclaration(XMLLib.NS.XENC, env, true);

	header = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Header'));

	var node = body.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'ExecuteJobTemplate'));
	var sjt = node.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplate'));
	node = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplateHeader'));
	node.appendChild(this.header.toXmlNode(xml, this));
	node = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplate'));

	var encoded = node.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'RawData'));
	
	body = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Body'));
	
	var jt = this.header.toXmlNode(xml, this);
	if (header != null) header.appendChild(jt);
	
	var pr = body.appendChild(this.createProcessRequest(xml));
	
	var dp = pr.appendChild(xml.createElementNS(XMLLib.NS.JT, 'DocumentProcess'));
	if(this.input[0] != null) {
		var input = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, coname));
		xml.setAttributeNS(input, XMLLib.NS.JT, 'container', 'Document');
		input.appendChild(this.input[0].toXmlNode(xml));

		if(isCopy) {
			input.appendChild(this.input[0].toXmlNode2(xml));
		} else {
			if(this.input[0].ocr && this.input[0].ocr.enable){
				var tf = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, "Transform"));
				tf.appendChild(this.input[0].ocr.toXmlNode(xml));
			}
		}
	}

	if(this.output != null) {
		var len = this.output.length;
		var ctrlelem = dp;
		var pconc = false;
		for (var i = 0; i < len; i++) {	
			var conc = this.output[i].getConcurrence();
			if ((i == 0 && len > 1) || conc != pconc) {
				var nodename = 'Sequence';
				if (conc) { nodename = 'Concurrence'; }
				ctrlelem = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, nodename)); 
			}
			if(this.output[i].workSpace) {
				if(typeof(this.output[i].workSpace) == 'string') {
					var wsxml = XMLLib.createXMLObject(this.output[i].workSpace);
					if(wsxml && wsxml.firstChild) {
						XMLLib.importNode(xml, ctrlelem, wsxml.firstChild);
					}
				} else {
					XMLLib.importNode(xml, ctrlelem, this.output[i].workSpace);
				}
			}
			var fAssign = null;
			var bAssign = null;
			if(this.output[i].frontAssign) {
				var assignLen = this.output[i].frontAssign.length;
				if(assignLen) {
					fAssign = xml.createElementNS(XMLLib.NS.JT, 'Assign');
					for(var j = 0; j < assignLen; j++) {
						var fAssignNode = this.output[i].frontAssign[j];
						if(fAssignNode.asNameSpace && fAssignNode.asPrefix) {
							var nsLen = fAssignNode.asNameSpace.length;
							for(var k=0; k< nsLen; k++) {
								xml.addNSPrefix(fAssignNode.asNameSpace[k], fAssignNode.asPrefix[k]);
								xml.addNSDeclaration(fAssignNode.asNameSpace[k], fAssign, true);
							}
						}
						fAssign.appendChild(fAssignNode.toXmlNode(xml));
					}
				}
			}
			if(this.output[i].backAssign) {
				var assignLen = this.output[i].backAssign.length;
				if(assignLen) {
					bAssign = xml.createElementNS(XMLLib.NS.JT, 'Assign');
					for(var j = 0; j < assignLen; j++) {
						var bAssignNode = this.output[i].backAssign[j];
						if(bAssignNode.asNameSpace && bAssignNode.asPrefix) {
							var nsLen = bAssignNode.asNameSpace.length;
							for(var k=0; k< nsLen; k++) {
								xml.addNSPrefix(bAssignNode.asNameSpace[k], bAssignNode.asPrefix[k]);
								xml.addNSDeclaration(bAssignNode.asNameSpace[k], bAssign, true);
							}
						}
						bAssign.appendChild(bAssignNode.toXmlNode(xml));
					}
				}
			}
			if(fAssign) {
				ctrlelem.appendChild(fAssign);
			}
			var n = this.output[i].toXmlNode(xml);
			if (n) ctrlelem.appendChild(n);	
			if(bAssign) {
				ctrlelem.appendChild(bAssign);
			}			
			if(this.output[i].notify) {
				var notifyLen = this.output[i].notify.length;
				if(notifyLen) {
					for(var j = 0; j < notifyLen; j++) {
						ctrlelem.appendChild(this.output[i].notify[j].toXmlNode(xml));
					}
				}
			}
			pconc = conc;
		}
		if (this.notification) {
			for (var i=0; i<this.notification.length; i++) {
				dp.appendChild(this.notification[i].toXmlNode(xml));
			}
		}
	}

	encoded.appendChild(env);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
};

JFLib.JSIncluded("JfsCom");

