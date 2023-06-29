/** 
 * @fileoverview ジョブフローにおける文書配送処理の共通クラスを定義する<br>
 * 共通で使用される各種クラス<br>
 *
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes common to document distribution processes in Job Flow.<br>
 * Classes used in common are defined.<br>
 *
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang en
 */

//JfsDefDistribute.jsのロード
JFLib.JSInclude("JfsDefDistribute");

/**
 * ジョブフローにおける出力処理の共通クラスのための名前空間定義
 * @namespace ジョブフローにおける出力処理を扱う
 * @static
 * @lang ja
 */
/**
 * Namespace definition for classes used in common by output processes in Job Flow.
 * @namespace Namespace for output processes in Job Flow.
 * @static
 * @lang en
 */
JFLib.Distribute = {};
/**
 * Serialization インスタンスを作成する
 * @constructor
 * @class 文書フォーマット/圧縮形式を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Serialization instance.
 * @constructor
 * @class This class specifies document format / compression method.<br>
 * @lang en
 */
JFLib.Distribute.Serialization = function ()
{
	/**
	 * 文書フォーマットをあらわす定数を設定する
	 * @type JFLib.DOCFORMAT
	 * @default 指定なし
	 * @lang ja
	 */
	/**
	 * Constant representing document format.
	 * @type JFLib.DOCFORMAT
	 * @default Not specified.
	 * @lang en
	 */
	this.format = JFLib.DOCFORMAT.NOTSPEC;
	/**
	 * 圧縮形式をあらわす定数を設定する <br>
	 * IFaxジョブを指定する場合のみ使用でき、IFaxジョブを含まない場合は初期値固定
	 * @type JFLib.COMPRESSION
	 * @default 指定なし
	 * @lang ja
	 */
	/**
	 * Constant representing compression method.<br>
	 * Can be specified only when specifying IFax job; otherwise, default value is applied.
	 * @type JFLib.COMPRESSION
	 * @default Not specified.
	 * @lang en
	 */
	this.compression = "NotSpecified";
};
/**
 * @private
 * Serializationオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from Serialization object.
 * @lang en
 */
JFLib.Distribute.Serialization.prototype.toXmlNode = function (xml)
{
	var ser = xml.createElementNS(XMLLib.NS.JT, 'Serialization');
	ser.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Compression', this.compression));
	ser.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.format));
	return ser;
};
/**
 * AuthInfo インスタンスを作成する
 * @constructor
 * @class 認証情報を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates AuthInfo instance.
 * @constructor
 * @class Class for specifying authentication information.<br>
 * @lang en
 */
JFLib.Distribute.AuthInfo = function () 
{	
	/**
	 * 認証方法をあらわす定数を設定する
	 * @type JFLib.AUTH
	 * @default 認証しない
	 * @lang ja
	 */
	/**
	 * Constant representing authentication method.
	 * @type JFLib.AUTH
	 * @default No authentication.
	 * @lang en
	 */
	this.method = JFLib.AUTH.NONE;
	/**
	 * 認証したユーザーのユーザー名を設定する
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Name of user to authenticate.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.loginName = "";
	/**
	 * 認証したユーザーのパスワードを設定する
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Password of user to authenticate.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.password = "";
};
/**
 * @private
 * AuthInfoオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from AuthInfo object.
 * @lang en
 */
JFLib.Distribute.AuthInfo.prototype.toXmlNode = function (xml)
{
	var auth = xml.createElementNS(XMLLib.NS.JT, 'AuthInfo');

	auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Method', this.method));
	if(this.method != JFLib.AUTH.NONE){
		auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'OperatorName', this.loginName));
		if(this.password && typeof(this.password) != 'string') {
			XMLLib.importNode(xml, auth, this.password);
		} else {
			auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Password', this.password));
		}
	}
	return auth;
};

/**
 * Retry インスタンスを作成する
 * @constructor
 * @param {int} num 再送回数の初期値
 * @param {int} intval 再送間隔の初期値
 * @class 通信障害時の再送を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Retry instance.
 * @constructor
 * @param {int} num Default number of retries.
 * @param {int} intval Default retry interval.
 * @class This class specifies retry settings upon communication failure.<br>
 * @lang en
 */
JFLib.Distribute.Retry = function(num, intval) {
	/**
	 * 再送回数(0～5)を設定する
	 * @type Int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Number of retries (0-5).
	 * @type Int
	 * @default null
	 * @lang en
	 */
	this.num = "";
	if(num) { this.num = num; }
	/**
	 * 再送間隔(0～300)を設定する
	 * @type Int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Retry interval, in seconds (0-300).
	 * @type Int
	 * @default null
	 * @lang en
	 */
	this.interval = "";
	if(intval) { this.interval = intval; }
	
};

JFLib.JSIncluded("JfsDistribute");
