/** 
 * @fileoverview ジョブフローにおけるメディアプリントジョブを扱うクラスを定義する<br>
 * Mediaクラス<br><br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDefCom.js
 * </ul>
 * のロードが必要となる<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.0
 * @lang ja
 */
/**
 * @fileoverview Defines classes that handle Media Print job in job flow<br>
 * Media class.<br><br>
 * To use these classes,
 * <ul>
 * <li>JfsDefCom.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this file is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.0
 * @lang en
 */

//JfsDefCom.jsのロード
JFLib.JSInclude("JfsDefCom");

/**
 * メディア起点の文書プリントを指す
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
JFLib.RESOURCE.MEDIA_PRINT_DOC = 'MediaPrint/Document';

/**
 * メディア起点の文書インデックスプリントを指す
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
JFLib.RESOURCE.MEDIA_INDEX_PRINT_DOC = 'MediaIndexPrint/Document';

/**
 * メディア起点のデジカメプリントを指す
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
JFLib.RESOURCE.MEDIA_PRINT_DCF = 'MediaPrint/DCF';

/**
 * メディア起点のデジカメインデックスプリントを指す
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
JFLib.RESOURCE.MEDIA_INDEX_PRINT_DCF = 'MediaIndexPrint/DCF';

/**
 * Media インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @class メディアジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う<br>
 * <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a>にて入力処理を設定する <br>
 * <a href="JFLib.Transaction.html#">Transaction</a>のサブクラス <br>
 * @private
 * @lang ja
 **/
JFLib.Media = function()
{
	/**
	 * メディアプリントのタイプを指定する
	 * @type JFLib.RESOURCE
	 * @default 指定なし
	 * @lang ja
	 * @private
	 */
	this.type = "";
};

/**
 * @private
 */
Extend(JFLib.Media.prototype, JFLib.Transaction.prototype);

/**
 * @private
 */
JFLib.Media.prototype.toXmlNode = function(xml)
{
	var media = xml.createElementNS(XMLLib.NS.JT, 'Media');
	return media;
}

/**
 * @private
 */
JFLib.Media.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', this.type));
};

/**
 * MediaDocumentPrint インスタンスを作成する
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDocumentPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 出力パラメータを適宜設定する
 *    jt.addOutputProcess(print);
 *    
 * @class 文書プリントジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * @lang ja
 */
/**
 * Creates MediaDocumentPrint instance.
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDocumentPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // Sets parameters for output as necessary
 *    jt.addOutputProcess(print);
 * @class <br> This class sets job of printing documents input from external media<br>
 * This class is handled as input operations. 
 * @lang en
 */
JFLib.MediaDocumentPrint = function()
{
	/**
	 * 文書プリントを指定する
	 * @constant JFLib.RESOURCE.MEDIA_PRINT_DOC
	 * @lang ja
	 * @private
	 */
	this.type = JFLib.RESOURCE.MEDIA_PRINT_DOC;
};

/**
 * @private
 */
Extend(JFLib.MediaDocumentPrint.prototype, JFLib.Media.prototype);

/**
 * MediaDocumentIndexPrint インスタンスを作成する
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDocumentIndexPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 出力パラメータを適宜設定する
 *    jt.addOutputProcess(print);
 * @class 文書インデックスプリントジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * @lang ja
 */
/**
 * Creates MediaDocumentIndexPrint instance.
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDocumentIndexPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 
 *    jt.addOutputProcess(print);
 * @class <br> This class sets job of index printing of documents input from external media<br>
 * This class is handled as input operations.
 * @lang en
 */
JFLib.MediaDocumentIndexPrint = function()
{
	/**
	 * 文書インデックスプリントを指定する
	 * @final JFLib.RESOURCE.MEDIA_INDEX_PRINT_DOC
	 * @lang ja
	 * @private
	 */
	this.type = JFLib.RESOURCE.MEDIA_INDEX_PRINT_DOC;
};

/**
 * @private
 */
Extend(JFLib.MediaDocumentIndexPrint.prototype, JFLib.Media.prototype);

/**
 * MediaDCFPrint インスタンスを作成する
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDCFPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 出力パラメータを適宜設定する
 *    jt.addOutputProcess(print);
 * @class デジカメプリントジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * @lang ja
 */
/**
 * Create MediaDCFPrint instance.
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDCFPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 
 *    jt.addOutputProcess(print);
 * @class <br> This class sets job of printing pictures input from a digital camera<br>
 * This class is handled as input operations.<br>
 * @lang en
 */
JFLib.MediaDCFPrint = function()
{
	/**
	 * デジカメプリントを指定する
	 * @constant JFLib.RESOURCE.MEDIA_PRINT_DCF
	 * @lang ja
	 * @private
	 */
	this.type = JFLib.RESOURCE.MEDIA_PRINT_DCF;
};

/**
 * @private
 */
Extend(JFLib.MediaDCFPrint.prototype, JFLib.Media.prototype);

/**
 * MediaDCFIndexPrint インスタンスを作成する
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDCFIndexPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 出力パラメータを適宜設定する
 *    jt.addOutputProcess(print);
 * @class デジカメインデックスプリントジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う
 * @lang ja
 */
/**
 * Create MediaDCFIndexPrint instance.
 * @constructor
 * @extends JFLib.Media
 * @example
 *    var jt = new JFLib.JobTemplate();
 *    var media = new JFLib.MediaDCFIndexPrint();
 *    jt.setInputProcess(media);
 *    var print = new JFLib.Print();
 *    // 
 *    jt.addOutputProcess(print);
 * @class <br> This dlass sets job of index printing of pictures input from a digital camera<br>
 * This class is handled as input operations.<br>
 * @lang en
 */
JFLib.MediaDCFIndexPrint = function()
{
	/**
	 * デジカメインデックスプリントを指定する
	 * @constant JFLib.RESOURCE.MEDIA_INDEX_PRINT_DCF
	 * @lang ja
	 * @private
	 */
	this.type = JFLib.RESOURCE.MEDIA_INDEX_PRINT_DCF;
};

/**
 * @private
 */
Extend(JFLib.MediaDCFIndexPrint.prototype, JFLib.Media.prototype);

