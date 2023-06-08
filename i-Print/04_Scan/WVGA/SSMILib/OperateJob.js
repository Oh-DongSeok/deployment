/** 
 * @fileoverview ジョブ情報取得のためのクラス定義<br>
 * ジョブ情報取得の為に必要な基本的な以下のクラスが定義される<br>
 * JobInfoクラス
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang ja
 */
 /** 
 * @fileoverview Class definition for retrieving job information.<br>
 * Defines basic classes required for retrieving job information.<br>
 * JobInfo Class.
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.2
 * @lang en
 */


//DefJobInfo.jsのロード
document.write('<script type="text/javascript" src="./SSMILib/DefJobInfo.js" charset="UTF-8"></script>');

/**
 * SSMILib.JobOperate インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @param {String} jid リクエストメッセージ生成時に用いるジョブID名
 * @param {String} op リクエストメッセージ生成時に用いるジョブ操作内容
 * @param {Bool} auth リクエストメッセージ送付先のデバイスが認証モードか否か
 * @return なし
 * @class ジョブ操作要求のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * SSMILib.JobOperate Creates instance
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @param {String} jid Job ID to use upon creating request message
 * @param {String} op Job operation details to use upon creating request messages
 * @param {Bool} auth Whether request message destination device requires authentication or not.
 * @return None.
 * @class "Class for requesting job operation.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLibSOAPMsg.</a>
 * @lang en
 */


SSMILib.JobOperate = function(jid, op, auth)
{
	/**
	 * ジョブIDを指定する
	 * @type String
	 * @lang ja
	 */
 	/**
	 * Job ID.
	 * @type String
	 * @lang en
	 */

	this.jobID = "";
	if(jid){ this.jobID = jid; }
	/**
	 * ジョブ操作内容を指定する
	 * @type String
	 * @lang ja
	 */
	 /**
	 * Job operation details.
	 * @type String
	 * @lang en
	 */
	this.operate = "";
	if(op){ this.operate = op; }
	/**
	 * リクエストメッセージ送付先のデバイスが認証モードか否か設定する
	 * @type Bool
	 * @lang ja
	 */
	 /**
	 * Sets whether request message destination device requires authentication or not.
	 * @type Bool
	 * @lang en
	 */
	this.auth = false;
	if(auth) { this.auth = auth; }
	/**
	 * リクエストメッセージ送付先のデバイスが認証モードか否か設定する
	 * @type WebServiceLib.Communicator
	 * @private
	 * @lang ja
	 */
	/**
	 * Sets whether request message destination device requires authentication or not.
	 * @type WebServiceLib.Communicator
	 * @private
	 * @lang en
	 */
	this.requester = new WebServiceLib.Communicator();

};
/**
 * @private
 */
Extend(SSMILib.JobOperate.prototype, XMLLib.SOAPMsg.prototype);
/**
 * @private
 */
SSMILib.JobOperate.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var jobNS	=	"http://www.fujifilm.com/fb/2021/03/ssm/management/job";
	xml.addNSPrefix(jobNS, "job");

	var _operateJobNode = body.appendChild(xml.createElement( "job:" + "OperateJob"));
	xml.addNSDeclaration(jobNS, _operateJobNode, true);
	
	var _childNode = _operateJobNode.appendChild(xml.createElement(this.operate));
	_childNode.appendChild(xml.createTextNode(this.jobID));
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * 指定したジョブIDのジョブを操作する<br>
 * オプションとして引数に非同期通信の際の成功時/失敗時のコールバック関数をそれぞれ設定可能<br>
 * 同期呼び出しを行う場合はnullを設定する<br>
 * 　　　　　　　　 また成功時のコールバック関数は、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 * 　　　　　　　　 また失敗時のコールバック関数は、、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth リクエストメッセージ送付先のデバイスが認証モードか否か
 * @lang ja
 */
/**
 * Operates job of specified job ID.<br>
 * Callback functions upon success/failure can optionally be specified as arguments.<br>
 * For synchrnous processing, set null.<br>
 * Callback function upon success must be JavaScript function of the following format:<br>
 * BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 * Callback function upon failure must be JavaScript function of the following format:<br>
 * BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth Whether request message destination device requires authentication or not.
 * @lang en
 */

SSMILib.JobOperate.prototype.execute = function(auth)
{
	this.requester.soapAction = '"http://www.fujifilm.com/fb/2021/03/ssm/management/job#OperateJob"';
	this.auth = auth;
	this.requester.async = SSMILib.async;
	this.requester.isDeviceReq = true;

	if(this.auth){
		var _path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Job";
	} else{
		var _path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Job";
	}
	
	var _msg = this.serializeToString();

	this.requester.send(_path,_msg);
	return;
};

/**
 * 指定されたジョブを操作する<br>
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {String} jobId ジョブIDを指定する
 * @param {SSMILib.JOBOPERATION} operation 操作内容を指定する<br>
 * @returns なし
 * @addon
 * @static
 * @lang ja
 */
/**
 * Operates on specified job<br>
 * @param {Bool} auth Whether device requires authentication or not.
 * @param {String} jobId Job ID.
 * @param {SSMILib.JOBOPERATION} operation Job operation details.<br>
 * @returns None.
 * @addon
 * @static
 * @lang en
 */
SSMILib.OperateJob = function(auth, jobId, operation)
{
	var _opJob = new SSMILib.JobOperate(jobId, auth);
	_opJob.requester.successHandler = SSMILib.OperateJob.successCb;
	_opJob.requester.errorHandler = SSMILib.OperateJob.errorCb;
	_opJob.requester.isDeviceReq = true;
	
	_opJob.operate = operation ? operation : "";

	if (SSMILib.dummy) {
		var _opJobInfo = new Object();
		_opJobInfo = {Identifier:"00000001-aaaa-bbbb-0000-0123456789ab"};

		SSMILib.onEvent("OperateJob", true, _opJobInfo);
		return;
	}
	
	_opJob.execute(auth);
	return;

};
/**
 * @private
 */
SSMILib.OperateJob.successCb = function(res)
{
	var _opJobInfo = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("OperateJob", _result, _opJobInfo);
		return;
	}

	var _opJobResNode = res.responseXML.getElementsByTagName("OperateJobResponse");
	if(_opJobResNode.length == 0){
		SSMILib.onEvent("OperateJob", _result, _opJobInfo);
		return;
	}
	_opJobInfo = SSMILib.childNodeToProperty(_opJobResNode[0]);
	_result = true;

	SSMILib.onEvent("OperateJob", _result, _opJobInfo);
	return;
};

/**
 * @private
 */
SSMILib.OperateJob.errorCb = function(res)
{
	var _opJobInfo = null;
	var _result = false;

	SSMILib.onEvent("OperateJob", _result, _opJobInfo);

	return;
};
