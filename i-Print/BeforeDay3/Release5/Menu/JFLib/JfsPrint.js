﻿/** 
 * @fileoverview ジョブフローにおけるプリント出力を扱うクラスを定義する<br>
 * Printクラス
 * 
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes handling document print output in Job Flow:<br>
 * Print class
 * 
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang en
 */

//JfsDefPrint.jsのロード
JFLib.JSInclude("JfsDefPrint");

//JfsComPrint.jsのロード
JFLib.JSInclude("JfsComPrint");

/**
 * Print インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @return Printオブジェクト <br><br>
 * @example
 * ■使用例 
 *		var print = new JFLib.Print();
 *		print.copies = 2;
 *		print.collate = false;
 *		print.inputTray = JFLib.INTRAY.TRAY1;
 *		print.staple.enable = true;
 *		print.staple.position = JFLib.STAPLEPOS.LEFT;
 *		print.staple.num = 2;
 * @class プリントジョブを設定する為のクラス<br>
 * 本クラスは出力処理として扱う
 * <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>にて出力処理を設定する <br>
 * <a href="JFLib.OutputProcess.html#">OutputProcess</a>のサブクラス <br>
 * @lang ja
 */
/**
 * Creates Print instance.
 * @constructor
 * @extends JFLib.Transaction
 * @return Print object. <br><br>
 * @example
 * EXAMPLE:  
 *		var print = new Print();
 *		print.copies = 2;
 *		print.collate = false;
 *		print.inputTray = INTRAY.TRAY1;
 *		print.staple.enable = true;
 *		print.staple.position = STAPLEPOS.LEFT;
 *		print.staple.num = 2;
 * @class This class sets Print job settings. <br>
 * This class is handled as output operations. Output settings are set using <a href="JFLib.JobTemplate.html#addOutputProcess">addOutputProcess</a>. <br>
 * This class is handled as output operations. Subclass of <a href="JFLib.OutputProcess.html#">OutputProcess</a>.
 * @lang en
 */
JFLib.Print = function()
{
	/**
	 *	コピー部数を指定する<br> 設定 - 任意
	 *	@type Int
	 *	@default 1
	 *  @lang ja
	 */	
	/**
	 *	Number of Copy sets.<br> IMPLIED.
	 *	@type Int
	 *	@default 1
	 *  @lang en
	 */	
	this.copies = 1;
	/**
	 *	仕分けを指定する<br> 設定 - 任意
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */	
	/**
	 *	Collate (true) / uncollate (false).<br> IMPLIED.
	 *	@type Bool
	 *	@default Uncollate (false)
	 *  @lang en
	 */	
	this.collate = false;
	/**
	 *	片面･両面プリントを指定する<br> 設定 - 任意
	 *	@type JFLib.OUTPLEX
	 *	@default 片面
	 *  @lang ja
	 */	
	/**
	 *	Simplex/Duplex output.<br> IMPLIED.
	 *	@type JFLib.OUTPLEX
	 *	@default Simplex.
	 *  @lang en
	 */	
	this.outPlex = JFLib.OUTPLEX.SIMPLEX;
	/**
	 *	入力トレイを指定する<br> 設定 - 任意
	 *	@type JFLib.INTRAY
	 *	@default トレイ自動
	 *  @lang ja
	 */	
	/**
	 *	Input Tray.<br> IMPLIED.
	 *	@type JFLib.INTRAY
	 *	@default Auto Tray selection.
	 *  @lang en
	 */	
	this.inputTray = JFLib.INTRAY.AUTO;
	/**
	 *	出力トレイを指定する<br> 設定 - 任意
	 *	@type JFLib.OUTTRAY
	 *	@default トレイ自動
	 *  @lang ja
	 */	
	/**
	 *	Output Tray.<br> IMPLIED.
	 *	@type JFLib.OUTTRAY
	 *	@default Auto Tray selection.
	 *  @lang en
	 */	
	this.outputTray = JFLib.OUTTRAY.AUTO;
	/**
	 *	ステープルを指定する<br> 設定 - 任意
	 *	@type JFLib.ComPrint.Staple
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Staple.<br> IMPLIED.
	 *	@type JFLib.ComPrint.Staple
	 *	@default Do not Staple.
	 *  @lang en
	 */	
	this.staple = new JFLib.ComPrint.Staple();
	/**
	 *	パンチを指定する<br> 設定 - 任意
	 *	@type JFLib.ComPrint.Punch
	 *	@default しない
	 *  @lang ja
	 */	
	/**
	 *	Punch.<br> IMPLIED.
	 *	@type JFLib.ComPrint.Punch
	 *	@default Do not Punch.
	 *  @lang en
	 */	
	this.punch = new JFLib.ComPrint.Punch();

	//Modification for Remote Print (FXKIS : Kwang-Hyun, Jang ) START
	/**
	 *	リモートプリントモードを指定するか否か。<br> 設定 - 任意
	 *	@type Boolean
	 *	@default false
	 *  @lang ja
	 */
	/**
	 *	Whether to specify remote print mode<br> IMPLIED.
	 *	@type Boolean
	 *	@default false
	 *  @lang en
	 */
	this.isRemotePrint = false;

	/**
	 *	リモートプリントの出力カラーモードを設定する。白黒のみ指定可。<br> 設定 - 任意
	 *	@type JFLib.CM
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Color Mode in Remote Print mode. Only Black and White can be specified.<br> IMPLIED.
	 *	@type JFLib.CM
	 *	@default ""
	 *  @lang en
	 */
	this.colorMode = "";

	/**
	 *	出力先デバイスのアドレスを指定する。<br> 設定 - 任意
	 *	@type Array
	 *	@default
	 *  @lang ja
	 */
	/**
	 *	Remote print target device address.<br> IMPLIED.
	 *	@type Array
	 *	@default
	 *  @lang en
	 */
	this.targets = new Array();

	/**
	 *	リモートプリントのジョブチケットデータを設定する。<br> 設定 - 任意
	 *	@type String
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Job Ticket data for Remote Print.<br> IMPLIED.
	 *	@type String
	 *	@default ""
	 *  @lang en
	 */
	this.jobTicket = "";

	/**
	 *	リモートプリントにおける転送プロトコルを指定する。<br> 設定 - 任意
	 *	@type String
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Protocol for Remote Print.<br> IMPLIED.
	 *	@type String
	 *	@default ""
	 *  @lang en
	 */
	this.method = "";

	/**
	 *	リモートプリントのリトライ回数を指定する<br> 設定 - 任意
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Number of retries for Remote Print.<br> IMPLIED.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.numberOfRetry = 0;

	/**
	 *	リモートプリントのリトライ間隔を指定する。<br> 設定 - 任意
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Retry interval for Remote Print.<br> IMPLIED.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.retryInterval = 0;

	/**
	 *	リモートプリントで使用する指示書名<br> 設定 - 任意
	 *	@type String
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Job Flow Sheet name for Remote Print.<br> IMPLIED.
	 *	@type String
	 *	@default ""
	 *  @lang en
	 */
	this.jfsName = "";

	/**
	 *	リモートプリントで使用する、ジョブの実行ユーザ名<br> 設定 - 任意
	 *	@type String
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Requesting user name for Remote Print.<br> IMPLIED.
	 *	@type String
	 *	@default ""
	 *  @lang en
	 */
	this.requestingUserName = "";
	/**
	 *	リモートプリントで使用する、IPP転送先のファイル名(job-nameオプション）を示す文字列を指定する<br>
	 *	設定 - 任意
	 *	@type String
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	String representing File name at IPP transfer destination (job-name option), upon using Remote Print<br> IMPLIED.
	 *	@type String
	 *	@default ""
	 *  @lang en
	 */
	this.jobNameAtTarget = "";
	//Modification for Remote Print (FXKIS : Kwang-Hyun, Jang ) END
};

/**
 * ステープルを設定する
 * @param {Bool} enable ステープルする/しない
 * @param {JFLib.STAPLEPOS} [pos] ステープル位置
 * @param {String} [num] ステープル数
 * @return {JFLib.ComPrint.Staple} staple
 * @private
 * @lang ja
 */
/**
 * Sets Staple settings.
 * @param {Bool} enable Whether to Staple.
 * @param {JFLib.STAPLEPOS} [pos] Staple position.
 * @param {String} [num] Number of Staples.
 * @return {JFLib.ComPrint.Staple} staple
 * @private
 * @lang en
 */
JFLib.Print.prototype.setStaple = function (enable, pos, num)
{
	this.staple.enable = enable;
	if(pos) { this.staple.position = pos; }
	if(num) { this.staple.num = num; }
	return this.staple;
};

/**
 * パンチを設定する
 * @param {Bool} enable パンチする/しない
 * @param {JFLib.PUNCHPOS} [pos] パンチ位置
 * @param {String} [num] パンチ穴数
 * @return {JFLib.ComPrint.Punch} punch
 * @private
 * @lang ja
 */
/**
 * Punch settings.
 * @param {Bool} enable Whether to Punch.
 * @param {JFLib.PUNCHPOS} [pos] Punch position.
 * @param {String} [num] Number of holes.
 * @return {JFLib.ComPrint.Punch} punch
 * @private
 * @lang en
 */
JFLib.Print.prototype.setPunch = function (enable, pos, num)
{
	this.punch.enable = enable;
	if(pos) { this.punch.position = pos; }
	if(num) { this.punch.num = num; }
	return this.punch;
};

/**
 * @private
 */
JFLib.Print.prototype.toXmlNode = function (xml) 
{
	var print = xml.createElementNS(XMLLib.NS.JT, 'Print');
	xml.setAttributeNS(print, XMLLib.NS.JT, 'container', 'Document');

	//Modification for Remote Print (FXKIS : Kwang-Hyun, Jang ) START
	if(this.isRemotePrint){
		var rp = xml.createElementNS(XMLLib.NS.JT, 'RemotePrint');
		print.appendChild(rp);

		if(this.copies) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Copies', this.copies));
		if(this.outPlex) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Plex', this.outPlex));
		if(this.colorMode) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'ColorMode', this.colorMode));
		if(this.jobTicket) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'JobTicket', this.jobTicket));
		if(this.requestingUserName) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'RequestingUserName', this.requestingUserName));
		if(this.jobNameAtTarget) rp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'JobNameAtTarget', this.jobNameAtTarget));

		var targetsNode = xml.createElementNS(XMLLib.NS.JT, 'Targets');
		rp.appendChild(targetsNode);

		for(var iIndex in this.targets){
			var targetNode = xml.createElementNS(XMLLib.NS.JT, 'Target');
			targetNode.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Address',this.targets[iIndex]));
			targetsNode.appendChild(targetNode);

		}
		if(this.method) xml.setAttributeNS(rp, XMLLib.NS.JT, 'method',this.method);
		if(this.numberOfRetry) xml.setAttributeNS(rp, XMLLib.NS.JT, 'numberOfRetry',this.numberOfRetry);
		if(this.retryInterval) xml.setAttributeNS(rp, XMLLib.NS.JT, 'retryInterval',this.retryInterval);

		if(this.jfsName){
			var jaNode = xml.createElementNS(XMLLib.NS.JT, 'JobAttributes');
			jaNode.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Name',this.jfsName));
			rp.appendChild(jaNode);
		}
	}else{
		var lp = xml.createElementNS(XMLLib.NS.JT, 'LocalPrint');
		print.appendChild(lp);

		lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Copies', this.copies));
		lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'EnableCollation', this.collate));
		lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Plex', this.outPlex));
		lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'InputTray', this.inputTray));
		lp.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'OutputTray', this.outputTray));
		var finishing = lp.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Finishing'));
		if(this.staple.enable){
			finishing.appendChild(this.staple.toXmlNode(xml));
		}
		if(this.punch.enable){
			finishing.appendChild(this.punch.toXmlNode(xml));
		}
	}
	//Modification for Remote Print (FXKIS : Kwang-Hyun, Jang ) END
	return print;
};

/**
 * @private
 */
Extend(JFLib.Print.prototype, new JFLib.OutputProcess());
/**
 * @private
 */
JFLib.Print.prototype.addRscNode = function (xml, node)
{
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.PRINT));
};

JFLib.JSIncluded("JfsPrint");

