/** 
 * @fileoverview 指示書操作用のユーティリティクラス
 *
 * これらのクラスを使用するには、XML.jsのロードが必要となる<br>
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.1.1
 * @lang ja 
 * 
 */
/** 
 * @fileoverview Utility classes for Job Flow Sheet operation.
 *
 * XML.js must be included to use these classes.<br>
 * @author Copyright(C) 2007-2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.1.1
 * @lang en 
 * 
 */

//JfsDefUtil.jsのロード
JFLib.JSInclude("JfsDefUtil");

 /**
 * 指示書操作用ユーティリティクラスのための名前空間定義
 * @namespace 指示書の操作を行う
 * @static
 * @lang ja
 * 
 */
 /**
 * Namespace definition for utility classes for Job Flow Sheet operation.
 * @namespace For handling Job Flow Sheets.
 * @static
 * @lang en
 * 
 */
var JfsUtil = {};

/**
 * MailBox インスタンスを作成する
 * @constructor
 * @return Mailboxオブジェクト <br><br>
 * @class ボックス起点ジョブを設定する為のクラス<br>
 * @lang ja 
 */
 /**
 * Creates MailBox instance.
 * @constructor
 * @return Mailbox object <br><br>
 * @class Class for setting job flow from Mailbox<br>
 * @lang en 
 */
JfsUtil.MailBox = function(){
	/**
	 *	親展ボックス番号<br>設定 - 必須<br>
	 *	@type string
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Mailbox ID.<br>REQUIRED<br>
	 *	@type string
	 *	@default null
	 *  @lang en
	 */
	this.Identifier = "";
	/**
	 *	親展ボックスパスワード<br>設定 - 任意<br>
	 *	@type string
	 *	@default null
	 *  @lang ja
	 */
	 /**
	 *	Mailbox password.<br>REQUIRED<br>
	 *	@type string
	 *	@default null
	 *  @lang en
	 */
	this.Password = "";
};

/**
 * Document インスタンスを作成する
 * @constructor
 * @return Documentオブジェクト <br><br>
 * @class ボックス起点指示書の実行に必要となる文書情報を設定するクラス<br>
 * IdentifierかSelectionTypeの一方のみ指定可。<br>両方を設定した場合はIdentifierが優先される。
 * @lang ja 
 */
/**
 * Creates Document instance.
 * @constructor
 * @return Document object.<br><br>
 * @class Class for setting document information required for Mailbox Job Flow Sheets.<br>
 * Either Identifier or SelectionType to be set.<br>If both are set, Identifier is prioritized.
 * @lang en 
 */
JfsUtil.Document = function(){
	/**
	 *	親展ボックス内文書番号<br>設定 - 任意<br>
	 *	@type string
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Document ID for document in Mailbox.<br>OPTIONAL<br>
	 *	@type string
	 *	@default null
	 *  @lang en
	 */
	this.Identifier = "";
	/**
	 *	親展ボックス内文書の指定方法<br>設定 - 任意<br>
	 *	@type JFLibSSMI.SELECTIONTYPE()
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	How to specify document in Mailbox. <br>OPTIONAL<br>
	 *	@type string
	 *	@default null
	 *  @lang en
	 */
	this.SelectionType = "";
};

/**
 * 指示書SOAPメッセージ操作用インスタンス<br>
 * このコンストラクタを明示的に呼び出す必要はない
 * @class 指示書SOAPメッセージを操作するためのクラス
 * @constructor
 * @lang ja
 */
/**
 * Instance for creating Job Flow Sheet SOAP message.<br>
 * This constructor need not be explicitly called.
 * @class Class for handling SOAP message for Job Flow Sheet.
 * @constructor
 * @lang en
 */
 
JfsUtil.Msg = function(){};

/**
 * 即時実行メッセージ作成用インスタンス
 * @param {JFLib.JobTemplate} jobtemplate
 * @class  即時実行メッセージを作成するためのクラス
 * @lang ja
 */
/**
 * Instance for creating message for immediate run.
 * @param {JFLib.JobTemplate} jobtemplate
 * @class Class required for creating message for immediate run.
 * @lang en
 */
JfsUtil.Msg.Execute = function(jobtemplate){
	
	/**
	 *	指示書即時実行メッセージ作成に必要なJobTemplateクラス設定する<br>設定 - <font color = "#ff0000">必須</font><br>
	 *	@type JFLib.JobTemplate
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	Sets JobTemplate class required for creating message for immediate run.<br><font color = "#ff0000">REQUIRED</font><br>
	 *	@type JFLib.JobTemplate
	 *	@default null
	 *  @lang en
	 */
	this.jobtemplate = "";
	if (jobtemplate) {
		this.jobtemplate = jobtemplate;
	}

	/**
	 *	即時実行の起点に親展ボックスを指定する<br>設定 - 任意<br>
	 *	@type JfsUtil.MailBox()
	 *	@default new JfsUtil.MailBox
	 *  @lang ja
	 */
	/**
	 *	Specifies Mailbox for which Job Flow Sheet is to be run.<br>OPTIONAL<br>
	 *	@type JfsUtil.MailBox()
	 *	@default new JfsUtil.MailBox
	 *  @lang en
	 */
	this.MailBox = new JfsUtil.MailBox();
	
	/**
	 *	親展ボックス内の文書クラス<br>設定 - 任意<br>
	 *	@type JfsUtil.Document()
	 *	@default new JfsUtil.Document
	 *  @lang ja
	 */
	/**
	 *	Class representing document in Mailbox.<br>OPTIONAL<br>
	 *	@type JfsUtil.Document()
	 *	@default new JfsUtil.Document
	 *  @lang en
	 */
	this.Document = new JfsUtil.Document();

};

/**
 * @private
 */
Extend(JfsUtil.Msg.Execute.prototype, JFLib.JobTemplate.prototype);
Extend(JfsUtil.Msg.Execute.prototype, XMLLib.SOAPMsg.prototype);

/**
 * jobtemplateクラスから指示書SOAPメッセージを生成する
 * @return 指示書SOAPメッセージ(DOMNode）
 * @private
 * @lang ja
 */
/**
 * Creates Job Flow Sheet SOAP message from jobtemplate class.
 * @return  Job Flow Sheet SOAP message (DOMNode）
 * @private
 * @lang en
 */
JfsUtil.Msg.Execute.prototype.createJobTemplate = function () {

	var coname = "Acquire";
	var isCopy = false;

	if(this.jobtemplate.input[0] != null && this.jobtemplate.input[0].toXmlNode2 != null) {
	//if(!this.output.length) {
		isCopy = true;
		coname = "Copy";
	}
	
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var header = xml.header;
	var body = xml.body;

	xml.addNSDeclaration(XMLLib.NS.JT, root, false);
	xml.addNSDeclaration(XMLLib.NS.JTM, root, false);
	var env = xml.createElementNS(XMLLib.NS.SOAP, 'Envelope');
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);
	xml.addNSDeclaration(XMLLib.NS.XENC, env, true);

	header = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Header'));
	
	body = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Body'));
	
	var jt = this.jobtemplate.header.toXmlNode(xml, this.jobtemplate);
	if (header != null) header.appendChild(jt);
	
	var pr = body.appendChild(this.jobtemplate.createProcessRequest(xml));
	
	var dp = pr.appendChild(xml.createElementNS(XMLLib.NS.JT, 'DocumentProcess'));
	if(this.jobtemplate.input[0] != null) {
		var input = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, coname));
		xml.setAttributeNS(input, XMLLib.NS.JT, 'container', 'Document');
		input.appendChild(this.jobtemplate.input[0].toXmlNode(xml));
		if(isCopy) {
			input.appendChild(this.jobtemplate.input[0].toXmlNode2(xml));
		} else {
			if(this.jobtemplate.input[0].ocr && this.jobtemplate.input[0].ocr.enable){
				var tf = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, "Transform"));
				tf.appendChild(this.jobtemplate.input[0].ocr.toXmlNode(xml));
			}
		}
	}
	if(this.jobtemplate.output != null) {
		var len = this.jobtemplate.output.length;
		var ctrlelem = dp;
		var pconc = false;
		for (var i = 0; i < len; i++) {	
			var conc = this.jobtemplate.output[i].getConcurrence();
			if ((i == 0 && len > 1) || conc != pconc) {
				var nodename = 'Sequence';
				if (conc) { nodename = 'Concurrence'; }
				ctrlelem = dp.appendChild(xml.createElementNS(XMLLib.NS.JT, nodename)); 
			}
			if(this.jobtemplate.output[i].workSpace) {
				if(typeof(this.jobtemplate.output[i].workSpace) == 'string') {
					var wsxml = XMLLib.createXMLObject(this.jobtemplate.output[i].workSpace);
					if(wsxml && wsxml.firstChild) {
						XMLLib.importNode(xml, ctrlelem, wsxml.firstChild);
					}
				} else {
					XMLLib.importNode(xml, ctrlelem, this.jobtemplate.output[i].workSpace);
				}
			}
			var fAssign = null;
			var bAssign = null;
			if(this.jobtemplate.output[i].frontAssign) {
				var assignLen = this.jobtemplate.output[i].frontAssign.length;
				if(assignLen) {
					fAssign = xml.createElementNS(XMLLib.NS.JT, 'Assign');
					for(var j = 0; j < assignLen; j++) {
						var fAssignNode = this.jobtemplate.output[i].frontAssign[j];
						if(fAssignNode.asNameSpace && fAssignNode.asPrefix) {
							var nsLen = fAssignNode.asNameSpace.length;
							for(var k=0; k< nsLen; k++) {
								xml.addNSPrefix(fAssignNode.asNameSpace[k], fAssignNode.asPrefix[k]);
								xml.addNSDeclaration(fAssignNode.asNameSpace[k], fAssign, true);
							}
						}
						fAssign.appendChild(fAssignNode.toXmlNode(xml));
					}
				}
			}
			if(this.jobtemplate.output[i].backAssign) {
				var assignLen = this.jobtemplate.output[i].backAssign.length;
				if(assignLen) {
					bAssign = xml.createElementNS(XMLLib.NS.JT, 'Assign');
					for(var j = 0; j < assignLen; j++) {
						var bAssignNode = this.jobtemplate.output[i].backAssign[j];
						if(bAssignNode.asNameSpace && bAssignNode.asPrefix) {
							var nsLen = bAssignNode.asNameSpace.length;
							for(var k=0; k< nsLen; k++) {
								xml.addNSPrefix(bAssignNode.asNameSpace[k], bAssignNode.asPrefix[k]);
								xml.addNSDeclaration(bAssignNode.asNameSpace[k], bAssign, true);
							}
						}
						bAssign.appendChild(bAssignNode.toXmlNode(xml));
					}
				}
			}
			if(fAssign) {
				ctrlelem.appendChild(fAssign);
			}
			var n = this.jobtemplate.output[i].toXmlNode(xml);
			if (n) ctrlelem.appendChild(n);	
			if(bAssign) {
				ctrlelem.appendChild(bAssign);
			}			
			if(this.jobtemplate.output[i].notify) {
				var notifyLen = this.jobtemplate.output[i].notify.length;
				if(notifyLen) {
					for(var j = 0; j < notifyLen; j++) {
						ctrlelem.appendChild(this.jobtemplate.output[i].notify[j].toXmlNode(xml));
					}
				}
			}
			pconc = conc;
		}
		if (this.jobtemplate.notification) {
			for (var i=0; i<this.jobtemplate.notification.length; i++) {
				dp.appendChild(this.jobtemplate.notification[i].toXmlNode(xml));
			}
		}
	}
	
	var soapMsg = env;
	return soapMsg;
};

/**
 * 指示書即時実行用のSOAPメッセージを作成する
 * @return 指示書即時実行用のSOAPメッセージ(DOMNode)
 * @private
 * @lang ja
 */
/**
 * Creates SOAP message for Job Flow Sheet immediate run.
 * @return SOAP message for Job Flow Sheet immediate run (DOMNode).
 * @private
 * @lang en
  */
JfsUtil.Msg.Execute.prototype.createMsg = function () 
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var header = xml.header;
	var body = xml.body;

	xml.addNSDeclaration(XMLLib.NS.JT, root, false);
	xml.addNSDeclaration(XMLLib.NS.JTM, root, false);
	var env = xml.createElementNS(XMLLib.NS.SOAP, 'Envelope');
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);

	header = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Header'));

	var excjt = body.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'ExecuteJobTemplate'));

	var sjt = excjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplate'));
	var jth = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplateHeader'));

	var jt = this.jobtemplate.header.toXmlNode(xml, this.jobtemplate);
	if (jth != null) jth.appendChild(jt);

	var node = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplate'));
	node.appendChild(this.jobtemplate.header.toXmlNode(xml, this.jobtemplate));
	var rawdataNode = node.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'RawData'));

	XMLLib.importNode(xml,rawdataNode,this.createJobTemplate());

	if (this.MailBox && this.MailBox.Identifier) {
		var ds = xml.createElementNS(XMLLib.NS.JTM2,'DocumentSource');
		var mbox = ds.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'MailBox'));
		mbox.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Identifier',this.MailBox.Identifier));
		if (this.MailBox.Password ) {
			mbox.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Password',this.MailBox.Password));
		}
		var dc = ds.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'Document'));
		if (this.Document.Identifier ) {
			dc.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Identifier',this.Document.Identifier));
		}
		else if ( this.Document.SelectionType ){
			dc.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'SelectionType', this.Document.SelectionType));
		}
		excjt.appendChild(ds);
	}
	
	var soapMsg = xml.rootElement;
	return soapMsg;
};

JFLib.JSIncluded("JfsUtil");

