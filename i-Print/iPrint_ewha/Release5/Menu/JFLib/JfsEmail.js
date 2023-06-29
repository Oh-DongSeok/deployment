/** 
 * @fileoverview ジョブフローにおけるSMTPメール配送ジョブを扱うクラスを定義する<br>
 * Emailクラス
 * 
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines the following classes used in SMTP distribution jobs in Job Flow:<br>
 * Email Class.
 * 
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
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
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.docFormat));
	
	var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var email = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Smtp'));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Address', this.address));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'MailFrom', this.fromAddress));
	email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentName', this.docName));
	if(this.smtpServer){
		email.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "TransferAgent",this.smtpServer));
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

