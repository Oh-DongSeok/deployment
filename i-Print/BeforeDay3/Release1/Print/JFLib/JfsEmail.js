/** 
 * @fileoverview ジョブフローにおけるSMTPメール配送ジョブを扱うクラスを定義する<br>
 * Emailクラス<br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefEmail.js
 * </ul>
 * のロードが必要となる。<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる。<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.3.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines the following classes used in SMTP distribution jobs in Job Flow:<br>
 * Email Class.
 * To use these classes,
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefEmail.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this file is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.3.0
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefEmail.jsのロード
JFLib.JSInclude("JfsDefEmail");

/**
 * Email インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *		var mail = new JFLib.Email();
 *		mail.address = jobflow@xxx.xxx;
 *		mail.subject = "これは件名です";
 *		mail.comment = "これは本文です";
 * @class Emailジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う<br>
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates Email instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE: 
 *		var mail = new JFLib.Email();
 *		mail.address = jobflow@xxx.xxx;
 *		mail.subject = "Subject";
 *		mail.comment = "Message";
 * @class This class sets email job settings. <br>
 * This class is handled as output operations. <br>
 * Output settings are set using  <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * Subclass of <a href="JFLib.OutputProcess.html#">OutputProcess</a>.
 * @lang en
 */
JFLib.Email = function()
{
	/**
	 *	ジョブ実行時に表示する宛先名を設定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Destinatino name to display upon job run.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.name = "";
	/**
	 *	メール配送先アドレスを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Destination address. <br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.address = "";
	/**
	 *	メール送信元情報を指定する<br> 設定 - 任意
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
	this.fromAddress = "";
	/**
	 *	メール件名を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Email subject.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.subject = "";
	/**
	 *	メール本文を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Email content.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.comment = "";
	/**
	 *	メール配送フォーマットを指定する<br> 設定 - 任意
	 *	@type JFLib.DOCFORMAT
	 *	@default 指定なし
	 *  @lang ja
	 */
	/**
	 *	Document format.<br> IMPLIED.
	 *	@type JFLib.DOCFORMAT
	 *	@default Not specified.
	 *  @lang en
	 */
	this.docFormat = JFLib.DOCFORMAT.NOTSPEC;
	/**
	 *	ドキュメント名を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Document name.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.docName = "";
	/**
	 *	SMTPサーバアドレスを指定する<br> 設定 - 任意
	 *	@type String
	 *	@default なし
	 *	@lang ja
	 */
	/**
	 *	SMTP server address.<br> IMPLIED.
	 *	@type String
	 *	@default None
	 *	@lang en
	 */
	this.smtpServer = "";
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

	/**
	 *	メールに添付する文書の最大サイズを指定する。単位はMBである。<br>
	 *	文書のサイズが指定以下の場合はメール添付、指定以上の場合はURL送信となる。<br>
	 *	0を指定した場合は、常にURL送信となる。<br> 設定 - 任意
	 *	@type String(0～200)/JFLib.DEFAULT
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Maximum size of document that can be attached to e-mail. Unit: MB<br>
	 *	When the document size is equal to or smaller than the specified size, it is attached to e-mail. Otherwise, URL of the stored file is sent by e-mail.<br>
	 *	If 0 is specified, the URL is always sent.<br> IMPLIED.
	 *	@type String(0～200)/JFLib.DEFAULT
	 *	@default null
	 *  @lang en
	 */
	this.maxAttachmentSize = "";
	/**
	 *	URL送信の場合の文書の保存期間を指定する。
	 *	@type String(1～168)/JFLib.DEFAULT
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Retention period of storing file when URL of the stored file is sent.
	 *	@type String(1～168)/JFLib.DEFAULT
	 *	@default null
	 *  @lang en
	 */
	this.duration = "";

	/**
	 * マルチページファイルのシングルページファイル分割を指定する。
	 * @type Bool/JFLib.DEFAULT
	 * @default 分割しない
	 * @lang ja
	 */
	/**
	 * Single page file division of a multi-page file。
	 * @type Bool/JFLib.DEFAULT
	 * @default Do not divide
	 * @lang en
	 */
	this.filePerPage = false;

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
JFLib.Email.prototype.toXmlNode = function (xml) 
{
	var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'container', 'Document');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'numberOfRetry', this.retry.num);
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'retryInterval', this.retry.interval);
	dist.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Subject', this.subject));
	dist.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Comment', this.comment));
	var serialize = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Serialization'));
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Compression', 'NotSpecified'));
	//filePerPageプロパティ追加
	//serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.docFormat));
	var format = serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.docFormat));
	xml.setAttributeNS(format, XMLLib.NS.JT, 'filePerPage', this.filePerPage);

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

	var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var email = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Smtp'));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Address', this.address));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MailFrom', this.fromAddress));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentName', this.docName));
	if(this.smtpServer){
		email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "TransferAgent",this.smtpServer));
	}

	// 空文字列の場合はエレメントを作成しない
	// 0が指定されている場合はエレメントを作成する
	if(this.maxAttachmentSize.length) {
		email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "MaxAttachmentSize", this.maxAttachmentSize));
	}
	if (this.duration.length) {
		email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "Duration", this.duration));
	}
	return dist;
};
/**
 * @private
 */
Extend(JFLib.Email.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.Email.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.SMTP));
};

JFLib.JSIncluded("JfsEmail");