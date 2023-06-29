/**
 * @fileoverview 指示書操作用のSSMILibクラス
 *
 * これらのクラスを使用するには、XML.js/WewbServiceLib.jsのロードが必要となる<br>
 * @author Copyright(C) 2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.0.1
 * @lang ja
 *
 */
/**
 * @fileoverview SSMILIb classes for Job Flow Sheet operation.
 *
 * XML.js must be included to use these classes.<br>
 * @author Copyright(C) 2011 FujiXerox Co., Ltd. All rights reserved.
 * @version 1.0.1
 * @lang en
 */

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
SSMILib.ExecuteJFS = function(jobtemplate){
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
//	The code differ from JfsUtil.js
//	node.appendChild(this.jobtemplate.header.toXmlNode(xml, this.jobtemplate));
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
	xml.addNSDeclaration(XMLLib.NS.JT, env, true);
	xml.addNSDeclaration(XMLLib.NS.SOAP, env, true);
	xml.addNSDeclaration(XMLLib.NS.XSI, env, true);

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
 * @private
 * @lang ja
 */
 /**
 * <br>
 * Immediate run for a job<br>
 * @param {exeJfsObj} Set a Job Flow Sheet (Job Template) to run.
 * @param {timeout} Set the timeout for the communication.
 * @private
 * @lang en
 */
SSMILib.ExecuteJFS.Send = function(exeJfsObj, timeout){
	/* Run Job Flow Sheet */
	var _ws = new WebServiceLib.Communicator();
	_ws.successHandler = SSMILib.ExecuteJFS.successCb;
	_ws.errorHandler = SSMILib.ExecuteJFS.errorCb;

	if(timeout){
		_ws.timeout = timeout;
		_ws.timeoutHandler = SSMILib.ExecuteJFS.errorCb; //AR147115
	}
	if(!exeJfsObj)
		var executeJfsObj = new SSMILib.ExecuteJFS();
	else
		var executeJfsObj = exeJfsObj;

	_ws.token = SSMILib.RemoteAccess.Interceptor("WebService", _ws);

	if (SSMILib.dummy) {
		var _returnObj = null;
		//TODO Need to define dummy data
		SSMILib.onEvent("ExecuteJFS", true, _returnObj);
		return;
	}

	var _msg = executeJfsObj.serializeToString();
	_ws.send(_targetURL, _msg);
};

/**
 * @private
 */
SSMILib.ExecuteJFS.successCb = function(res){
	var _result = false;
	var jobId = null;
	var jobId = res.responseXML.getElementsByTagNameNS("" +
			"http://www.fujixerox.co.jp/2003/12/ssm/management/job",'JobID')[0].firstChild.nodeValue;
	if(jobId) _result = true;
		var jobId = SSMILib.RemoteAccess.Interceptor("SuccessCb", res, jobId);
		SSMILib.onEvent("ExecuteJFS", _result, jobId);
};

/**
 * @private
 */
SSMILib.ExecuteJFS.errorCb = function(res){
	var _result = false;
	var soapFaultObj = null;
	soapFaultObj  = SSMILib.RemoteAccess.Interceptor("ErrorCb", res, soapFaultObj);
	if(!soapFaultObj){ //For local print Soapfault handling
		soapFaultObj = SSMILib.CreateSoapFaultObj(res)
	}
	SSMILib.onEvent("ExecuteJFS", _result, soapFaultObj);
};

