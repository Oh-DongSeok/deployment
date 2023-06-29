/** 
 * @fileoverview ジョブフローにおけるファイル転送配送ジョブを扱うクラスを定義する<br>
 * FileTransferクラス
 * 
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes used in file distribution jobs in Job Flow:<br>
 * FileTransfer class
 * 
 * @author Copyright(C) 2007-2009 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang en
 */

//JfsDistribute.jsのロード
JFLib.JSInclude("JfsDistribute");
//JfsDefFileTransfer.jsのロード
JFLib.JSInclude("JfsDefFileTransfer");

/**
 * FileTransfer インスタンスを作成する
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * ■使用例 
 *		var ft = new JFLib.FileTransfer();
 *		ft.url = "ftp://192.168.0.1/share_directory";
 *		ft.docFormat = JFLib.DOCFORMAT.XDW;
 *		ft.loginName = "testname";
 *		ft.password = "testpass";
 * @class FileTransferジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates FileTransfer instance.
 * @constructor
 * @extends JFLib.OutputProcess
 * @example
 * EXAMPLE: 
 *		var ft = new JFLib.FileTransfer();
 *		ft.url = "ftp://192.168.0.1/share_directory";
 *		ft.docFormat = DOCFORMAT.XDW;
 *		ft.loginName = "testname";
 *		ft.password = "testpass";
 * @class This class sets file transfer job settings. <br>
 * This class is handled as output operations. Output settings are set using <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>.<br>
 * Subclass of <a href="JFLib.OutputProcess.html#">OutputProcess</a>.
<br>
 * @lang en
 */
JFLib.FileTransfer = function()
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
	 *	転送先フォルダ名を指定する<br> 設定 - 任意
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Destination folder name.<br> IMPLIED.
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.folderName = "";
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
	 *	転送先URLを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	File transfer destination URL.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.url = "";
	/**
	 *	転送フォーマットを指定する<br> 設定 - 任意
	 *	@type JFLib.DOCFORMAT
	 *	@default 指定なし
	 *  @lang ja
	 */
	/**
	 *	Transfer document format.<br> IMPLIED.
	 *	@type JFLib.DOCFORMAT
	 *	@default Not specified.
	 *  @lang en
	 */
	this.docFormat = JFLib.DOCFORMAT.NOTSPEC;
	/**
	 *	転送先サーバーログイン名を指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Login user name of destination server.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.loginName = "";
	/**
	 *	転送先サーバーパスワードを指定する<br> 設定 - <font color = "#ff0000">必須</font>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Login password for destination server.<br>  <font color = "#ff0000">REQUIRED.</font>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	this.password = "";
	/**
	 *	ファイリングポリシーを指定する<br> 設定 - 任意
	 *	@type JFLib.FILEPOLICY
	 *	@default 重複の場合は機械的に決定
	 *  @lang ja
	 */
	/**
	 *	Filing policy.<br> IMPLIED.
	 *	@type JFLib.FILEPOLICY
	 *	@default New Auto Generate.
	 *  @lang en
	 */
	this.filepolicy = JFLib.FILEPOLICY.NEWAUTOGEN;
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
JFLib.FileTransfer.prototype.toXmlNode = function (xml) 
{
	var dist = xml.createElementNS(XMLLib.NS.JT, 'Distribute');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'container', 'Document');
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'numberOfRetry', this.retry.num);
	xml.setAttributeNS(dist, XMLLib.NS.JT, 'retryInterval', this.retry.interval);

	var serialize = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Serialization'));
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Compression', 'NotSpecified'));
	serialize.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Format', this.docFormat));

	var dests = dist.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Destinations'));
	var file = dests.appendChild(xml.createElementNS(XMLLib.NS.JT, 'FileTransfer'));
	file.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name', this.name));
	file.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FilingPolicy', this.filepolicy));
	file.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Repository', encodeURI(this.url)));
	var auth = file.appendChild(xml.createElementNS(XMLLib.NS.JT, 'AuthInfo'));
	auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Method', 'OperatornamePassword'));
	auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'OperatorName', this.loginName));
	auth.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Password', this.password));
	file.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'FolderName', this.folderName));
	file.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentName', this.docName));

	return dist;

};
/**
 * @private
 */
Extend(JFLib.FileTransfer.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.FileTransfer.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.FILETARANSFER));
};

JFLib.JSIncluded("JfsFileTransfer");
