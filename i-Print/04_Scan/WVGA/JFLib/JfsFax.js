/** 
 * @fileoverview ジョブフローにおけるファクス配送ジョブを扱うクラスを定義する<br>
 * Faxクラス<br>
 * これらのクラスを使うためには
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefFax.js
 * </ul>
 * のロードが必要となる。<br>
 * 本ファイルをロードするとこれらのファイルは自動でロードされる。<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.3.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for Fax distribution jobs in Job Flow.<br>
 * Fax Class
 * To use these classes,
 * <ul>
 * <li>JfsDistribute.js
 * <li>JfsDefDistribute.js
 * <li>JfsDefFax.js
 * </ul>
 * must be loaded.<br>
 * These files are loaded automatically when this file is loaded.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.3.0
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefFax.jsのロード
JFLib.JSInclude("JfsDefFax");

/**
 * Fax インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *		var fax = new JFLib.Fax();
 *		fax.dialNumber = 012-345-6789;
 *		fax.mode = JFLib.TM.G3;
 *		fax.linetype = JFLib.LT.PUBLIC;
 * @class ファクスジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates Fax instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE:  
 *		var fax = new JFLib.Fax();
 *		fax.dialNumber = 012-345-6789;
 *		fax.mode = TM.G3;
 *		fax.linetype = LT.PUBLIC;
 * @class This class sets Fax job settings.<br>
 * This class is handled as output operations. Output settings are set using <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>.<br>
 * Subclass of OutputProcess.<br>
 * @lang en
 */
JFLib.Fax = function()
{
	/**
	 *	ジョブ実行時に表示する宛先名を設定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Destination name to be displayed upon job run.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.name = "";
	/**
	 *	ファクス配送先番号を指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Destination Fax number.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.dialNumber = "";
	/**
	 *	ファクス通信モードを指定する<br> 設定 - 任意
	 *	@type JFLib.TM
	 *	@default G3自動
	 *  @lang ja
	 */	
	/**
	 *	Fax communication mode.<br> IMPLIED.
	 *	@type JFLib.TM
	 *	@default G3 Auto.
	 *  @lang en
	 */	
	this.mode = JFLib.TM.G3;
	/**
	 *	ファクス回線種別を指定する<br> 設定 - 任意
	 *	@type JFLib.LT
	 *	@default 公衆回線
	 *  @lang ja
	 */	
	/**
	 *	Fax line type.<br> IMPLIED.
	 *	@type JFLib.LT
	 *	@default Public line.
	 *  @lang en
	 */	
	this.linetype = JFLib.LT.PUBLIC;
	/**
	 *	ファクス短縮ダイヤル番号を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */	
	/**
	 *	Fax speed dial number.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */	
	this.keyNumber = "";
	/**
	 *	送信元記録の出力を設定する<br> 設定 - 任意
	 *	@type JFLib.SR
	 *	@default デバイスのシステムデータ設定に従う
	 *  @lang ja
	 */	
	/**
	 *	Whether to outoput sender record.<br> IMPLIED.
	 *	@type JFLib.SR
	 *	@default Operation is according to device system data.
	 *  @lang en
	 */	
	this.senderRecord = JFLib.SR.DEFAULT;
	/**
	 *	ファクス親展通信を指定する<br> 設定 - 任意
	 *	@type JFLib.Fax.RemoteMailbox
	 *	@default ファクス親展通信しない
	 *  @lang ja
	 */	
	/**
	 *	Remote Mailbox distribution.<br> IMPLIED.
	 *	@type JFLib.Fax.RemoteMailbox
	 *	@default Do not specify remote Mailbox distribution.
	 *  @lang en
	 */	
	this.remoteMailbox = new JFLib.Fax.RemoteMailbox();
	/**
	 *	時刻指定送信を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default しない
	 *	@lang ja
	 */	
	/**
	 *	Delay Fax Send.<br> IMPLIED.
	 *	@type String
	 *	@default Do not specify delay Fax send
	 *	@lang en
	 */
	this.timeSpecified = "";

	/**
	 *	送信解像度を指定する。JFLib.RES.R200_100のみ指定可能<br> 設定 - 任意
	 *	@type JFLib.RES.R200_100
	 *	@default null
	 *	@lang ja
	 */	
	/**
	 *	Send resolution. Only JFLib.RES.R200_100 can be specified.<br> IMPLIED.
	 *	@type JFLib.RES.R200_100
	 *	@default null
	 *	@lang en
	 */
	this.resolution = "";
};
/**
 * ファクス親展通信を設定する
 * @param {String} boxId 配送先の親展ボックス識別子を指定する
 * @param {String} [password] 親展ボックスにパスワードが設定されている場合は指定する
 * @return {JFLib.Fax.RemoteMailbox} remoteMailbox
 * @private
 * @lang ja
 */
/**
 * Sets Remote Mailbox distribution settings.
 * @param {String} boxId Target Mailbox ID.
 * @param {String} [password] Password for target Mailbox.
 * @return {JFLib.Fax.RemoteMailbox} remoteMailbox
 * @private
 * @lang en
 */
JFLib.Fax.prototype.setRemoteMbox = function(boxId, password)
{
	if(boxId) {
		this.remoteMailbox.boxIdentifier = boxId;
		if(password) {
			this.remoteMailbox.method = JFLib.AUTH.PASSONLY;
			this.remoteMailbox.authInfo.password = password;
		}
	}
	return this.remoteMailbox;
};
/**
 * @private
 */
JFLib.Fax.prototype.toXmlNode = function (xml) 
{
	var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
	xml.setAttributeNS(dist, XMLLib.NS.JT, "container", 'Document');

	dist.appendChild((new JFLib.Distribute.Serialization()).toXmlNode(xml));
	
	var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var fax = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Fax'));
	fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'LineType', this.linetype));
	fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DialNumber', this.dialNumber));
	fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'TransmissionMode', this.mode));
	if(this.keyNumber) {
		fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'KeyNumber', this.keyNumber));
	}

	if (this.remoteMailbox.boxIdentifier) {
		fax.appendChild(this.remoteMailbox.toXmlNode(xml));
	}
	
	var senderRecord = fax.appendChild(xml.createElementNS(XMLLib.NS.JT, 'SenderRecord'));
	xml.setAttributeNS(senderRecord, XMLLib.NS.JT, 'style', this.senderRecord);

	if(this.timeSpecified) {
		fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "TimeSpecified",this.timeSpecified));
	}
	/*送信側での解像度は200x100dpiのみ指定可能*/
	if (this.resolution && this.resolution == JFLib.RES.R200_100) {
		fax.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, "Resolution", this.resolution));
	}
	return dist;

};
/**
 * RemoteMailbox インスタンスを作成する
 * @constructor
 * @class Fax 親展ボックス配信を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates RemoteMailbox instance.
 * @constructor
 * @class Fax Class for specifying Mailbox for Fax.<br>
 * @lang en
 */
JFLib.Fax.RemoteMailbox = function()
{
	/**
	 * 配信先の親展ボックス番号を指定する
	 * @type Int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Target Remote Mailbox ID.
	 * @type Int
	 * @default null
	 * @lang en
	 */
	this.boxIdentifier = "";
	/**
	 * 配信先の親展ボックス認証情報を指定する
	 * @type JFLib.Distribute.AuthInfo
	 * @lang ja
	 */
	/**
	 * Authentication information for target Remote Mailbox.
	 * @type JFLib.Distribute.AuthInfo
	 * @lang en
	 */
	this.authInfo = new JFLib.Distribute.AuthInfo();
};
/**
 * @private
 * RemoteMailboxオブジェクトをxml node化する
 * @lang ja
 */
 /**
 * @private
 * Creates xml node from RemoteMailbox object.
 * @lang en
 */
JFLib.Fax.RemoteMailbox.prototype.toXmlNode = function(xml)
{
	var remoteMailbox = xml.createElementNS(XMLLib.NS.JT, 'RemoteMailbox');
	remoteMailbox.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'BoxIdentifier', this.boxIdentifier));
	remoteMailbox.appendChild(this.authInfo.toXmlNode(xml));
	return remoteMailbox;
};

/**
 * @private
 */
Extend(JFLib.Fax.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.Fax.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.FAXG3));
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.FAXG4));
};

JFLib.JSIncluded("JfsFax");

