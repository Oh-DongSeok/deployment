/**
 * @fileoverview 指示書操作用のSSMILibクラス<br>
 * 以下のメソッドを提供する<br>
 * ExecuteJFS.Send<br>
 * <br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.1
 * @lang ja
 *
 */
/**
 * @fileoverview SSMILIb classes for Job Flow Sheet operation.<br>
 * Provides the following methods:<br>
 * ExecuteJFS.Send<br>
 * <br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.1
 * @lang en
 */

//Modification for Media Print START
/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class MediaDocumentScopeに用いる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in MediaDocumentScope.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.SCOPE = function(){};

/**
 * 先頭の文書を指す。
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Indicates the document at the top.
 * @type String
 * @constant
 * @lang en
 */
SSMILib.SCOPE.START = "start";

/**
 * 終端の文書を指す。
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Indicates the document at the bottom.
 * @type String
 * @constant
 * @lang en
 */
SSMILib.SCOPE.END = "end";

//Modification for Media Print END

/**
 * ExecuteJFS インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class 指示書即時実行のためのクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @param {JFLib.JobTemplate} jobtemplate 即時実行のための指示書クラス
 * @lang ja
 */
/**
 * Creates ExecuteJFS instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class 
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */
SSMILib.ExecuteJFS = function(jobtemplate)
{
	/**
	 * 指示書即時実行メッセージ作成に必要なJobTemplateクラス設定する<br>設定 - <font color = "#ff0000">必須</font><br>
	 * @type JFLib.JobTemplate
	 * @default null
	 * @lang ja
	 */
	/**
	 * Sets JobTemplate class required for creating message for immediate run.<br><font color = "#ff0000">REQUIRED</font><br>
	 * @type JFLib.JobTemplate
	 * @default null
	 * @lang en
	 */
	this.jobtemplate = "";
	if (jobtemplate) {
		this.jobtemplate = jobtemplate;
	}

	/**
	 * 即時実行の起点となる親展ボックス情報を配列で指定する<br>設定 - 任意
	 * @type Array(SSMILib.ExecuteJFS.MailBox)
	 * @default new Array()
	 * @lang ja
	 */
	/**
	 * Specifies Mailbox information in array form for Mailbox of which Job Flow Sheet is to be run.<br>OPTIONAL
	 * @type Array(SSMILib.ExecuteJFS.MailBox)
	 * @default new Array()
	 * @lang en
	 */
	this.boxesInfo = new Array();

	/**
	 * メディアドキュメントの情報を指定する<br>
	 * boxesInfoを指定した場合は、boxesInfoの指定が優先される
	 * <br>設定 - 任意
	 * @type SSMILib.ExecuteJFS.MediaDocument
	 * @default new SSMILib.ExecuteJFS.MediaDocument()
	 * @lang ja
	 */
	/**
	 * Specifies information on documents in media<br>
	 * If boxesInfo is specified, designation for boxesInfo is given priority
	 * <br>IMPLIED.
	 * @type SSMILib.ExecuteJFS.MediaDocument
	 * @default new SSMILib.ExecuteJFS.MediaDocument()
	 * @lang en
	 */
	this.mediaDocument = new SSMILib.ExecuteJFS.MediaDocument();
};

/**
 * 即時実行の起点となるMailBoxインスタンスを生成する
 * @constructor
 * @class 即時実行の起点にMailBoxを指定するクラス
 * @lang ja
*/
/**
 * Creates Mailbox instance of Mailbox for which Job Flow Sheet is to be run.
 * @constructor
 * @class Class that specifies Mailbox for which Job Flow Sheet is to be run.
 * @lang en
*/
SSMILib.ExecuteJFS.MailBox = function()
{
	/**
	 * 即時実行の起点に親展ボックスを指定する<br>設定 - 任意<br>
	 * @type JfsUtil.MailBox()
	 * @default new JfsUtil.MailBox
	 * @lang ja
	 */
	/**
	 * Specifies Mailbox for which Job Flow Sheet is to be run.<br>OPTIONAL<br>
	 * @type JfsUtil.MailBox()
	 * @default new JfsUtil.MailBox
	 * @lang en
	 */
	this.MailBox = new JfsUtil.MailBox();

	/**
	 * 親展ボックス内の文書クラス<br>設定 - 任意<br>
	 * @type JfsUtil.Document()
	 * @default new JfsUtil.Document
	 * @lang ja
	 */
	/**
	 * Class representing document in Mailbox.<br>OPTIONAL<br>
	 * @type JfsUtil.Document()
	 * @default new JfsUtil.Document
	 * @lang en
	 */
	this.Document = new JfsUtil.Document();
};

//Modification for Media Print START
/**
 * MediaDocumentインスタンスを作成する
 * @constructor
 * @return MediaDocument オブジェクト
 * @class メディアドキュメントを設定する為のクラス<br>
 * @lang ja 
 */
/**
 * Creates MediaDocument Instance.
 * @constructor
 * @return MediaDocument object
 * @class This class sets documents in media<br>
 * @lang en 
 */
SSMILib.ExecuteJFS.MediaDocument = function()
{
	/**
	 * メディア内文書のインデックスを指定する。
	 * @type Array(int)
	 * @default new Array
	 * @lang ja
	 */
	/**
	 * Index of document in media.
	 * @type Array(int)
	 * @default new Array
	 * @lang en
	 */
	this.indices = new Array();

	/**
	 * メディア内文書を範囲で指定する
	 * @type Array(SSMILib.ExecuteJFS.MediaDocumentScope)
	 * @default new Array
	 * @lang ja
	 */
	/**
	 * Scope of documents in media
	 * @type Array(SSMILib.ExecuteJFS.MediaDocumentScope)
	 * @default new Array
	 * @lang en
	 */
	this.scopes = new Array();
};

/**
 * MediaDocumentScopeインスタンスを作成する
 * @constructor
 * @return MediaDocumentScope オブジェクト
 * @class メディア内文書を範囲で指定する為のクラス
 * @lang ja
 */
/**
 * Creates MediaDocumentScope instance.
 * @constructor
 * @return MediaDocumentScope object
 * @class This class specifies scope of documents in media
 * @lang en
 */
SSMILib.ExecuteJFS.MediaDocumentScope = function()
{
	/**
	 * メディア内文書を範囲で指定する際の開始インデックスを指定する<br>
	 * <a href="ssmilib.scope_2.html#START">SSMILib.SCOPE.START</a>も指定可能であり、その場合は先頭の文書を指す。
	 * @type Int/SSMILib.SCOPE.START
	 * @default 0
	 * @lang ja
	 */
	/**
	 * Start index for designation of scope of documents in media<br>
	 * <a href="ssmilib.scope_2.html#START">SSMILib.SCOPE.START</a> can be specified, <br>
	 * which indicates the document at the top.
	 * @type Int/SSMILib.SCOPE.START
	 * @default 0
	 * @lang en
	 */
	this.from = 0;

	/**
	 * メディア内文書を範囲で指定する際の終了インデックスを指定する<br>
	 * <a href="ssmilib.scope_2.html#END">SSMILib.SCOPE.END</a>も指定可能であり、その場合は終端の文書を指す。
	 * @type Int/SSMILib.SCOPE.END
	 * @default 0
	 * @lang ja
	 */
	/**
	 * End index for designation of scope of documents in media<br>
	 * <a href="ssmilib.scope_2.html#END">SSMILib.SCOPE.END</a> can be specified, <br>
	 * which indicates the document at the bottom. 
	 * @type Int/SSMILib.SCOPE.END
	 * @default 0
	 * @lang en
	 */
	this.to = 0;
};
//Modification for Media Print END

/**
 * @private
 */
Extend(SSMILib.ExecuteJFS.prototype, XMLLib.SOAPMsg.prototype);

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
SSMILib.ExecuteJFS.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
//	var header = xml.header;
	var body = xml.body;

	root.setAttribute("xmlns:xs", XMLLib.NS.XS);
	root.setAttribute("xmlns:jtm", XMLLib.NS.JTM);
	//xml.addNSDeclaration(XMLLib.NS.JTM, root, false);
	xml.addNSDeclaration(XMLLib.NS.JTM2, root, false);

	var env = xml.createElementNS(XMLLib.NS.SOAP, 'Envelope');
	//env.setAttribute("xml:lang","en");
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);
	env.setAttribute("xml:lang","en");
	

//	header = env.appendChild(xml.createElementNS(XMLLib.NS.SOAP, 'Header'));

	var excjt = body.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'ExecuteJobTemplate'));

	var sjt = excjt.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'JobTemplate'));
	var jth = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplateHeader'));
	var jt = this.jobtemplate.header.toXmlNode(xml, this.jobtemplate);
	if (jth != null) jth.appendChild(jt);
	
	var node = sjt.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'JobTemplate'));
	//The code differ from JfsUtil.js
	//node.appendChild(this.jobtemplate.header.toXmlNode(xml, this.jobtemplate));
	// <jtm:RawData xmlns:soapENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jt="http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate">
	var rawdataNode = node.appendChild(xml.createElementNS(XMLLib.NS.JTM, 'RawData'));
	rawdataNode.setAttribute("xmlns:soapENV", "http://schemas.xmlsoap.org/soap/envelope/");
	rawdataNode.setAttribute("xmlns:jt", "http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate");

	XMLLib.importNode(xml, rawdataNode, this.createJobTemplate());

	if(this.boxesInfo.length){
		for(idx in this.boxesInfo){
			if (this.boxesInfo[idx].MailBox && this.boxesInfo[idx].MailBox.Identifier) {
				var ds = xml.createElementNS(XMLLib.NS.JTM2,'DocumentSource');
				var mbox = ds.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'MailBox'));
				mbox.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Identifier',this.boxesInfo[idx].MailBox.Identifier));
				if (this.boxesInfo[idx].MailBox.Password ) {
					mbox.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Password',this.boxesInfo[idx].MailBox.Password));
				}
				var dc = ds.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'Document'));
				if (this.boxesInfo[idx].Document.Identifier) {
					dc.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'Identifier',this.boxesInfo[idx].Document.Identifier));
				}
				else if ( this.boxesInfo[idx].Document.SelectionType ){
					dc.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'SelectionType', this.boxesInfo[idx].Document.SelectionType));
				}
				excjt.appendChild(ds);
			}
		}
	}else{
		//Modification for Media Print START
		if(this.mediaDocument.indices.length > 0 || this.mediaDocument.scopes.length > 0){
			if(this.mediaDocument.indices.length > 0){
				for(var i=0; i<this.mediaDocument.indices.length; i++){
					var ds = xml.createElementNS(XMLLib.NS.JTM2, 'DocumentSource');
					ds.appendChild(xml.createElementNSwithText(XMLLib.NS.JTM2, 'MediaDocumentIndex', this.mediaDocument.indices[i]));
					excjt.appendChild(ds);
				}
			}else{
				for(var i=0; i<this.mediaDocument.scopes.length; i++){
					var ds = xml.createElementNS(XMLLib.NS.JTM2, 'DocumentSource');
					var scope = ds.appendChild(xml.createElementNS(XMLLib.NS.JTM2, 'MediaDocumentScope'));
					//AR159994
					//xml.setAttributeNS(scope, XMLLib.NS.JTM2, "from", this.mediaDocument.scopes[i].from);
					//xml.setAttributeNS(scope, XMLLib.NS.JTM2, "to", this.mediaDocument.scopes[i].to);
					scope.setAttribute("from", this.mediaDocument.scopes[i].from);
					scope.setAttribute("to", this.mediaDocument.scopes[i].to);
					excjt.appendChild(ds);
				}
			}
		}//Modification for Media Print END
	}

	var soapMsg = xml.rootElement;
	return soapMsg;
};

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
SSMILib.ExecuteJFS.prototype.createJobTemplate = function () {

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
	//env.setAttribute("xml:lang","en");
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);
	env.setAttribute("xml:lang","en");

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
	}

	var soapMsg = env;
	return soapMsg;
};

/**
 * 指示書の即時実行を行う。<br>
 * 実行に成功すると、ジョブIDが返る
 * @param {SSMILib.ExecuteJFS} exeJfsObj JFS指示書を指定する。
 * @param {Int} [timeout] 通信のタイムアウト値を設定する。
 * @return {Bool} true:即時実行成功、false:失敗
 * @lang ja
 */
/**
 * Immediate run for a job<br>
 * @param {SSMILib.ExecuteJFS} exeJfsObj Set a Job Flow Sheet (Job Template) to run.
 * @param {Int} [timeout] Set the timeout for the communication.
 * @return {Bool} true:success, false:error
 * @lang en
 */
SSMILib.ExecuteJFS.Send = function(exeJfsObj, timeout){
	/* Run Job Flow Sheet */
	var executeJfsObj;
	var _ws = new WebServiceLib.Communicator();
	_ws.successHandler = SSMILib.ExecuteJFS.successCb;
	_ws.errorHandler = SSMILib.ExecuteJFS.errorCb;
	_ws.isDeviceReq = true;
	_ws.soapAction = '"' + XMLLib.NS.JTM2 + '#ExecuteJobTemplate' + '"';
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/JobTemplate/Execution";

	if(timeout){
		_ws.timeout = timeout;
		_ws.timeoutHandler = SSMILib.ExecuteJFS.errorCb; //AR147115
	}

	if(!exeJfsObj)
		executeJfsObj = new SSMILib.ExecuteJFS();
	else
		executeJfsObj = exeJfsObj;

	_ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

	SSMILib.dummy = false;
	if (SSMILib.dummy) {
		var _returnObj = null;
		//TODO Need to define dummy data
		SSMILib.onEvent("ExecuteJFS", true, _returnObj);
		return;
	}

	var _msg = executeJfsObj.serializeToString();

	/*AR185294*/
	_ws.headers[0] = "Connection";
	_ws.headers[1] = "close";

	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.ExecuteJFS.successCb = function(res){
	var _result = false;
	var jobId = null;
	jobId = res.responseXML.getElementsByTagNameNS("" +
			"http://www.fujifilm.com/fb/2021/03/ssm/management/job",'JobID')[0].firstChild.nodeValue;
	if(jobId) _result = true;
	jobId = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, jobId);
	SSMILib.onEvent("ExecuteJFS", _result, jobId);
};

/**
 * @private
 */
SSMILib.ExecuteJFS.errorCb = function(res){
	var _result = false;
	var soapFaultObj = null;
	soapFaultObj = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
	if(!soapFaultObj){ //For local print Soapfault handling
		soapFaultObj = SSMILib.CreateSoapFaultObj(res);
	}
	SSMILib.onEvent("ExecuteJFS", _result, soapFaultObj);
};

