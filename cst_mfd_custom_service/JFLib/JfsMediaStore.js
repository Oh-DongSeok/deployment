/** 
 * @fileoverview ジョブフローにおけるメディア配送ジョブを扱うクラスを定義する<br>
 * MediaStoreクラス<br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefCom.js
 * </ul>
 * のロードが必要となる<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.1.0
 * @lang ja
 */
/** 
 * @fileoverview Defines classes handling media transfer job in job flow<br>
 * MediaStore class<br>
 * To use there classes, 
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefCom.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.1.0
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefComのロード
JFLib.JSInclude("JfsDefCom");

/**
 * メディア媒体への格納
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
JFLib.RESOURCE.MEDIA_STORE = 'Distribute/Media/Store';

/**
 * MediaStore インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 *		var mediaStore = new JFLib.MediaStore();
 *		mediaStore.format = JFLib.DOCFORMAT.PDF;
 *		mediaStore.filingPolicy = JFLib.FILEPOLICY.NEWAUTOGEN;
 * @class メディア配送ジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う<br>
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates MediaStore instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * 		var mediaStore = new JFLib.MediaStore();
 *		mediaStore.format = JFLib.DOCFORMAT.PDF;
 *		mediaStore.filingPolicy = JFLib.FILEPOLICY.NEWAUTOGEN;
 * @class This class sets media transfer job<br>
 * This class is handled as output operations. Output settings are set using <a href="JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * Subclass of <a href="OutputProcess.html#">OutputProcess</a>.
 * @lang en
 */
JFLib.MediaStore = function()
{
	/**
	 * フォーマットを指定する<br>設定 - 任意
	 * @type JFLib.DOCFORMAT
	 * @default 指定なし
	 * @lang ja
	 */
	/**
	 * Document format.<br>IMPLIED.
	 * @type JFLib.DOCFORMAT
	 * @default Not specified.
	 * @lang en
	 */
	this.docFormat = JFLib.DOCFORMAT.NOTSPEC;

	/**
	 * ファイリングポリシーを指定する<br>設定 - 任意
	 * @type JFLib.FILEPOLICY
	 * @default JFLib.FILEPOLICY.NEWAUTOGEN
	 * @lang ja
	 */
	/**
	 * Filing policy.<br>IMPLIED.
	 * @type JFLib.FILEPOLICY
	 * @default JFLib.FILEPOLICY.NEWAUTOGEN
	 * @lang en
	 */
	this.filingPolicy = JFLib.FILEPOLICY.NEWAUTOGEN;

	/**
	 * ファイル配送先を指定する<br>
	 * 設定 - <font color = "#ff0000">必須</font>
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Transfer destination of file<br>
	 * <font color = "#ff0000">REQUIRED.</font>
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.repository = "";

	/**
	 * 配送先フォルダ名を指定する<br>設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Destination folder name.<br> IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.folderName = "";

	/**
	 * 配送する文書名を指定する<br>設定 - 任意
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Document name.<br>IMPLIED.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.docName = "";

	/**
	 * 通信障害時の再送を指定する<br>設定 - 任意
	 * @type JFLib.Distribute.Retry
	 * @default 再送しない
	 * @lang ja
	 */
	/**
	 * Retrying upon communication failure.<br> IMPLIED.
	 * @type JFLib.Distribute.Retry
	 * @default Do not retry.
	 * @lang en
	 */
	this.retry = new JFLib.Distribute.Retry("0", "30");

	/**
	 * MRC（Mixed Raster Content）方式を指定する。
	 * @type JFLib.Distribute.MrcType
	 * @default null
	 * @lang ja
	 */
	this.mrcType = "";

	/**
	 * スキャン文書の正立を指定する。
	 * @type JFLib.Distribute.Orientation
	 * @default 正立方法を指定しない
	 * @lang ja
	 */
	this.orientation = "";

	/**
	 * 文書のスキュー補正（傾き補正）の方式を指定する。
	 * @type JFLib.Distribute.SkewCorrection
	 * @default スキュー補正をしない
	 * @lang ja
	 */
	this.skewCorrection = "";
};

/**
 * @private
 */
JFLib.MediaStore.prototype.toXmlNode = function (xml) 
{
	var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'container', 'Document');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'numberOfRetry', this.retry.num);
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'retryInterval', this.retry.interval);

	var serialize = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Serialization'));
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

	var destinations = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var media = destinations.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Media'));
	media.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FilingPolicy', this.filingPolicy));
	media.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Repository', encodeURI(this.repository)));
	media.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FolderName', this.folderName));
	media.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentName', this.docName));

	return dist;
};

/**
 * @private
 */
Extend(JFLib.MediaStore.prototype, new JFLib.OutputProcess());

/**
 * @private
 */
JFLib.MediaStore.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.MEDIA_STORE));
};
