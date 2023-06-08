/** 
 * @fileoverview ジョブフローにおける親展ボックスジョブを扱うクラスを定義する<br>
 * Mailboxクラス<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.0
 * @lang ja
 * 
 */
 /** 
 * @fileoverview Defines classes handling Mailbox jobs in Job Flow:<br>
 * Mailbox Class
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.0
 * @lang en
 * 
 */

/**
 * Mailbox インスタンスを作成する
 * @constructor
 * @extends JFLib.Transaction
 * @return Mailboxオブジェクト <br><br>
 * @class ボックス起点ジョブを設定する為のクラス<br>
 * 本クラスは入力処理として扱う<br>
 * <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a>にて入力処理を設定する <br>
 * <a href="JFLib.Transaction.html#">Transaction</a>のサブクラス <br>
 * @lang ja 
 */
/**
 * Creates Mailbox instance.
 * @constructor
 * @extends JFLib.Transaction
 * @return Mailbox object<br><br>
 * @class Class for setting job flow from Mailbox.<br>
 * This class handled as input process.<br>
 * Input process set using <a href="JFLib.JobTemplate.html#setInputProcess">setInputProcess</a> method. <br>
 * Subclass of <a href="JFLib.Transaction.html#">Transaction</a>.<br>
 * @lang en 
 */

JFLib.Mailbox = function () {

	/**
	 *	指示書の処理対象とする文書を指定する。<br>設定 - 必須<br>
	 *	@type Object(Array)
	 *	@default new Array()
	 *  @lang ja
	 */
	/**
	 *	Specifies document to be handled in job flow.<br>REQUIRED.<br>
	 *	@type Object(Array)
	 *	@default new Array()
	 *  @lang en
	 */
	this.targetOrigin = new Array();
	/**
	 *	処理対象にスキャン文書を指定するか否か<br>設定 - 任意<br>
	 *	@type Bool
	 *	@default true
	 *  @lang ja
	 */
	/**
	 *	Whether to include Scan documents as target documents.<br>OPTIONAL.<br>
	 *	@type Bool
	 *	@default true
	 *  @lang en
	 */
	this.targetOrigin.scan = true;
	
	/**
	 *	処理対象にファクス系文書を指定するか否か<br>設定 - 任意<br>
	 *	@type Bool
	 *	@default true
	 *  @lang ja
	 */
	 /**
	 *	Whether to include Fax-type documents (Fax, Internet Fax, IP Fax) as target documents.<br>OPTIONAL.<br>
	 *	@type Bool
	 *	@default true
	 *  @lang en
	 */
	this.targetOrigin.fax = true;
	
	/**
	 *	処理対象にプリント蓄積文書を指定するか否か<br>設定 - 任意<br>
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */
	/**
	 *	Whether to include documents printed to Mailbox as target documents.<br>OPTIONAL.<br>
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.targetOrigin.print = false;

	//Modification for Remote Print FXKIS(Kwanghyun, Jang ) START
	/**
	 *	処理対象にPDL蓄積文書を指定するか否か<br>設定 - 任意<br>
	 *	@type Bool
	 *	@default false
	 *  @lang ja
	 */
	/**
	 *	Whether to include documents stored as PDL as target documents.<br>OPTIONAL.<br>
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.targetOrigin.pdl = false;

	/**
	 *	ボックス文書の排他制御を行うか否かを指定する<br>
	 *	true:排他制御する, false:排他制御しない<br>
	 *	trueを指定して実行したジョブフローの実行中に、同一文書を他のジョブフローで実行することはできない。
	 *	@type Bool
	 *	@default true(許可しない）
	 *  @lang ja
	 */
	/**
	 *	Whether to lock target document from access by other Job Flow Sheets.
	 *	true: lock, false: do not lock.<br>
	 *	When set to "true," target document cannot be handled by any other Job Flow Sheet while processed by the specified Job Flow Sheet.
	 *	@type Bool
	 *	@type Bool
	 *	@default true
	 *  @lang en
	 */
	this.lockDocuments = true;

	/**
	 *	指示書転送後の文書処理を指定する<br>
	 *	@type JFLib.DocumentHandling
	 *	@default true
	 *  @lang ja
	 */
	/**
	 *	Specifies document handling after job run.<br>
	 *	@type JFLib.DocumentHandling
	 *	@default true
	 *  @lang en
	 */
	this.documentHandling = new JFLib.DocumentHandling();
	//Modification for PDL Setting by FXKIS(Kwanghyun, Jang ) END
};

/**
 *	複数文書印刷（MailboFlowジョブ)を指定するか否か<br>設定 - 任意<br>
 *	@type Bool
 *	@default false(しない)
 *  @lang ja
 */
JFLib.Mailbox.MailboxFlow = false;

/**
 * @private
 */
Extend(JFLib.Mailbox.prototype, JFLib.Transaction.prototype);

/**
 * @private
 */
JFLib.Mailbox.prototype.addRscNode = function(xml, node){
	if(JFLib.Mailbox.MailboxFlow) node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.MAILBOXFLOW ));
	node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.MAILBOX));
};

 /**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class DocumentHandlingに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in DocumentHandling.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.DH = function() {};

/**
 * 文書を削除する
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Delete document.
 * @constant
 * @type String
 * @lang en
 */
JFLib.DH.DELETE = "Delete";

/**
 * 文書を削除しない
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Retain document.
 * @constant
 * @type String
 * @lang en
 */
JFLib.DH.RETAIN = "Retain";

/**
 * 親展ボックスの設定に従う
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Delete/retain document according to Mailbox settings.
 * @constant
 * @type String
 * @lang en
 */
JFLib.DH.DEFAULT = "Default";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class DocumentHandlingのJob statusに用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in job status in DocumentHandling
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
JFLib.JS = function() {};

/**
 * ジョブフロージョブが正常終了した場合のみ、指定の処理を行う。<br>
 * それ以外の場合は、親展ボックスの設定に従った処理となる。
 * @constant
 * @type String
 * @lang ja
 */
/**
 * Delete/retain document only when Job Flow job is successful;<br>
 * otherwise, document is deleted/retained according to Mailbox settings.
 * @constant
 * @type String
 * @lang en
 */
 JFLib.JS.SUCCESS = "success";

/**
 * ジョブフロージョブが異常終了した場合のみ、指定の処理を行う。<br>
 * それ以外の場合は、親展ボックスの設定に従った処理となる。
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Delete/retain document only when Job Flow job fails;<br>
 * otherwise, document is deleted/retained according to Mailbox settings.
 * @constant
 * @type String
 * @lang en
 */
JFLib.JS.FAIL = "fail";

/**
 * ジョブフロージョブの実行結果に関わらず、指定の処理を行う。
 * @constant
 * @type String
 * @lang ja
 */
 /**
 * Delete/retain document regardless of Job Flow Job success/failure.
 * @constant
 * @type String
 * @lang en
 */
JFLib.JS.ALL = "all";

/**
 * DocumentHandling インスタンスを作成する
 * @constructor
 * @class DocumentHandlingのクラス<br>
 * @lang ja
 */
/**
 * Creates DocumentHandling instance.
 * @constructor
 * @class DocumentHandling<br>
 * @lang en
 */
JFLib.DocumentHandling = function () {

	/**
	 *	ジョブ実行後の処理を指定する。<br>
	 *	@type JFLib.DH
	 *	@default ""
	 *  @lang ja
	 */
	/**
	 *	Specifies document handling after job run.<br>
	 *	@type JFLib.DH
	 *	@default ""
	 *  @lang en
	 */
	this.action = "";

	/**
	 *	実施条件を指定する<br>
	 *	@type JFLib.JS
	 *	@default JFLib.JS.ALL
	 *  @lang ja
	 */
	/**
	 *	Specifies conditions for action (delete/retain)<br>
	 *	@type JFLib.JS
	 *	@default JFLib.JS.ALL
	 *  @lang en
	 */
	this.jobstatus= JFLib.JS.ALL;
};

/**
 * @private
 */
JFLib.Mailbox.prototype.toXmlNode = function(xml){
	var mailbox = xml.createElementNS(XMLLib.NS.JT,'Mailbox');
	//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) START
	xml.setAttributeNS(mailbox, XMLLib.NS.JT, 'lockDocuments', this.lockDocuments);
	//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) END

	if ( this.targetOrigin ) {
		var to = xml.createElementNS(XMLLib.NS.JT,'TargetOrigin');
		if ( this.targetOrigin.scan ) {
			to.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Scanner'));
		}
		if ( this.targetOrigin.fax ) {
			to.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Fax'));
		}
		if ( this.targetOrigin.print ) {
			var print = xml.createElementNS(XMLLib.NS.JT, 'Print');
			//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) START
			if ( this.targetOrigin.pdl )
				print.appendChild(xml.createElementNS(XMLLib.NS.JT, 'PDL'));
			to.appendChild(print);
			//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) END
		}
		mailbox.appendChild(to);
	}
	//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) START
	if(this.documentHandling && this.documentHandling.action){
		var dh = xml.createElementNSwithText(XMLLib.NS.JT, 'DocumentHandling',this.documentHandling.action);
		if(this.documentHandling.jobstatus)
			xml.setAttributeNS(dh, XMLLib.NS.JT, 'jobstatus', this.documentHandling.jobstatus);
		mailbox.appendChild(dh);
	}
	//Modification for Remote Print by FXKIS(Kwanghyun, Jang ) END
	return mailbox;
};
