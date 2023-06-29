/** 
 * @fileoverview ジョブフローにおけるInternetFax配送ジョブを扱うクラスを定義する<br>
 * IFaxクラス<br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefIFax.js
 * </ul>
 * のロードが必要となる。<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる。<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang ja
 */
/** 
 * @fileoverview Defines classes handling Internet Fax distribution jobs in Job Flow.<br>
 * IFax class.
 * To use these classes,
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefIFax.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this file is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.0
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefIFax.jsのロード
JFLib.JSInclude("JfsDefIFax");

/**
 * IFax インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *		var ifax = new JFLib.IFax();
 *		ifax.address = jobflow@xxx.xxx;
 *		ifax.subject = "これは件名です";
 *		ifax.comment = "これは本文です";
 * @class InternetFaxジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates IFax instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE:  
 *		var ifax = new JFLib.IFax();
 *		ifax.address = jobflow@xxx.xxx;
 *		ifax.subject = "Subject";
 *		ifax.comment = "Content";
 * @class This class sets Internet Fax job settings. <br>
 * This class is handled as output operations. <br>
 * Output settings are set using <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * Subclass of <a href="JFLib.OutputProcess.html#">OutputProcess</a>.
 * @lang en
 */
JFLib.IFax = function()
{
	/**
	 *	ジョブ実行時に表示する宛先名を設定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Destination name to display upon job run.<br> IMPLIED.
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
	 *	Email destination address.<br> <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.address = "";
	/**
	 *	オフランプ送信を指定する<br> 設定 - 任意
	 *	@type JFLib.TM
	 *	@default G3自動
	 *  @lang ja
	 */	
	/**
	 *	Off-ramp send<br> IMPLIED.
	 *	@type JFLib.TM
	 *	@default G3 Auto.
	 *  @lang en
	 */	
	this.offRamp = JFLib.TM.G3;
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
	 *	InternetFaxのプロファイルを示す値を指定する<br> 設定 - 任意
	 *	@type JFLib.IFAXPROF
	 *	@default TIFF-S
	 *  @lang ja
	 */	
	/**
	 *	Value representing Internet Fax profile.<br> IMPLIED.
	 *	@type JFLib.IFAXPROF
	 *	@default TIFF-S
	 *  @lang en
	 */	
	this.profile = JFLib.IFAXPROF.TS;
	/**
	 *	送信元記録の出力を設定する<br> 設定 - 任意
	 *	@type JFLib.SR
	 *	@default デバイスのシステムデータ設定に従う
	 *  @lang ja
	 */	
	/**
	 *	Sender record output settings.<br> IMPLIED.
	 *	@type JFLib.SR
	 *	@default Operations are as specified by device system data.
	 *  @lang en
	 */	
	this.senderRecord = JFLib.SR.DEFAULT;
	/**
	 *	通信障害時の再送を指定する<br> 設定 - 任意
	 *	@type JFLib.Distribute.Retry
	 *	@default 再送しない
	 *  @lang ja
	 */	
	/**
	 *	Settings on retry upon communication failure.<br> IMPLIED.
	 *	@type JFLib.Distribute.Retry
	 *	@default Do not retry.
	 *  @lang en
	 */	
	this.retry = new JFLib.Distribute.Retry("0", "30");

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
JFLib.IFax.prototype.toXmlNode = function (xml) 
{
	var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'container', 'Document');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'numberOfRetry', this.retry.num);
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'retryInterval', this.retry.interval);
	
	dist.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Subject', this.subject));
	dist.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Comment', this.comment));
	var profile = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Serialization'));
	profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Compression', this.profile));
	profile.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', JFLib.DOCFORMAT.TIFF_FX));

	if(this.skewCorrection && this.skewCorrection.enable){
		profile.appendChild(this.skewCorrection.toXmlNode(xml));
	}

	var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var ifax = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'IFax'));
	ifax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	ifax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Address', this.address));
	ifax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'OffRampTransmissionMode', this.offRamp));
	
	var senderRecord = ifax.appendChild(xml.createElementNS(XMLLib.NS.JT, 'SenderRecord'));
	xml.setAttributeNS(senderRecord, XMLLib.NS.JT, 'style', this.senderRecord);

	return dist;

};
/**
 * @private
 */
Extend(JFLib.IFax.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.IFax.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.IFAX));
};

JFLib.JSIncluded("JfsIFax");
