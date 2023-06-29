/** 
 * @fileoverview デバイスからジョブ情報を取得するためのクラス定義<br>
 * ジョブ情報取得に関して以下のメソッドを提供する<br>
 * GetJobInfo  ジョブ情報取得<br>
 * GetChildJobInfo  親ジョブを含めた子ジョブの情報取得<br>
 * 使用するためには
 * <ul>
 * <li>SSMILib/DefJobInfo.js
 * </ul>
 * のロードが必要となる<br>
 * <br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes for retrieving job information from device.<br>
 * Provides the following methods for retrieving job information:s<br>
 * GetJobInfo - Retrieves job information.<br>
 * GetChildJobInfo - Retrieves information on parent job and its child jobs.<br>
 * To use this file,
 * <ul>
 * <li>SSMILib/DefJobInfo.js
 * </ul>
 * must be loaded.<br>
 * <br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.1
 * @lang en
 */

//DefJobInfo.jsのロード
document.write('<script type="text/javascript" src="./SSMILib/DefJobInfo.js" charset="UTF-8"></script>');
/**
 * JobInfo インスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @param {String} jobId リクエストメッセージ生成時に用いるジョブID名
 * @param {Bool} auth リクエストメッセージ送付先のデバイスが認証モードか否か
 * @class ジョブ情報取得のためクラス<br>
 * <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>のサブクラス
 * @lang ja
 */
/**
 * JobInfo Creates JobInfo instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @param {String} jobId Job ID to use upon creating request message
 * @param {Bool} auth Whether request message destination device requires authentication or not.
 * @class Class for retrieving job information.<br>
 * Subclass of <a href="XMLLib.SOAPMsg.html#">XMLLib.SOAPMsg</a>.
 * @lang en
 */

SSMILib.JobInfo = function(jobId, auth)
{
	/**
	 *	<a href="SSMILib.JOBLISTTYPE.html">ジョブの状態</a>を指定する
	 *	@type SSMILib.JOBLISTTYPE
	 *  @lang ja
	 */
	/**
	 *	<a href="SSMILib.JOBLISTTYPE.html">Job status</a>.
	 *	@type SSMILib.JOBLISTTYPE
	 *  @lang en
	 */
	this.listType = "";
	/**
	 *	ジョブのユーザを指定する
	 *	@type String
	 *  @lang ja
	 */
	/**
	 *	Job user.
	 *	@type String
	 *  @lang en
	 */
	this.jobUser = "";
	/**
	 *	ジョブIDを指定する
	 *	@type String(JobID)
	 *  @lang ja
	 */
	/**
	 *	Job ID.
	 *	@type String(JobID)
	 *  @lang en
	 */
	this.jobID = "";
	if(jobId){ this.jobID = jobId; }
	/**
	 *	リソースの範囲を指定する
	 *	@type SSMILib.JobInfo.Scope
	 *  @lang ja
	 */
	/**
	 *	Resource range.
	 *	@type SSMILib.JobInfo.Scope
	 *  @lang en
	 */
	this.scope = new this.ExtScope();
	/**
	 *	ジョブのClientIDを指定する
	 *	@type String
	 *  @lang ja
	 */
	/**
	 *	Job Client ID.
	 *	@type String
	 *  @lang en
	 */
	this.jobClientID = "";
	/**
	 *	取得する<a href="SSMILib.JOBDETAIL.html">ジョブ情報詳細</a>を指定する
	 *	@type SSMILib.JOBDETAIL
	 *  @lang ja
	 */
	/**
	 *	<a href="SSMILib.JOBDETAIL.html">Job details</a> to retrieve.
	 *	@type SSMILib.JOBDETAIL
	 *  @lang en
	 */

	this.respond = "";
	/**
	 *	ソートのためのソートキーを指定する
	 *	@type SSMILib.JobInfo.SortKey (Array)
	 *  @lang ja
	 */
	/**
	 *	Sort key for sorting.
	 *	@type SSMILib.JobInfo.SortKey (Array)
	 *  @lang en
	 */
	this.sortKeys = new Array();
	/**
	 *	ソートした結果の範囲をJobIDで指定する
	 *	@type SSMILib.JobInfo.Scope
	 *  @lang ja
	 */
	/**
	 *	Job ID specifying range within sort details.
	 *	@type SSMILib.JobInfo.Scope
	 *  @lang en
	 */
	this.scopeAfterSort = new this.Scope();
	/**
	 *	子ジョブのジョブ情報取得の有無を指定する
	 *	@type Bool
	 *  @lang ja
	 */
	/**
	 *	Whether or not to retrieve child information.
	 *	@type Bool
	 *  @lang en
	 */
	this.childInfo = false;
	/**
	 *	ジョブに付随するジョブ画像取得の有無を指定する
	 *	@type Bool
	 *  @lang ja
	 */
	/**
	 *	Whether or not to retrieve job image.
	 *	@type Bool
	 *  @lang en
	 */
	this.jobImage = false;
	/**
	 *	取得する<a href="SSMILib.JOBDETAIL.html">子ジョブ情報詳細</a>を指定する
	 *	@type SSMILib.JOBDETAIL
	 *  @lang ja
	 */
	/**
	 *	<a href="SSMILib.JOBDETAIL.html">Child job details</a> to retrieve.
	 *	@type SSMILib.JOBDETAIL
	 *  @lang en
	 */
	this.respondChild = "";
	/**
	 *	リクエストメッセージ送付先のデバイスが認証モードか否か設定する
	 *	@type Bool
	 *  @lang ja
	 */
	/**
	 *	Sets whether request message destination device requires authentication or not.
	 *	@type Bool
	 *  @lang en
	 */
	this.auth = false;
	if(auth) { this.auth = auth; }
	/**
	 *	リクエストオブジェクト
	 *	@type WebServiceLib.Communicator
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Request object.
	 *	@type WebServiceLib.Communicator
	 *	@private
	 *  @lang en
	 */
	this.requester = new WebServiceLib.Communicator();
};
/**
 * @private
 */
Extend(SSMILib.JobInfo.prototype, XMLLib.SOAPMsg.prototype);
/**
 * Scope インスタンスを作成する
 * @class リソース情報取得時に、対象となるリソースの範囲を指定するためのクラス<br>
 * @lang ja
 */
/**
 * Creates Scope instance.
 * @class Class for specifying target resource range upon retrieving resource information.<br>
 * @lang en
 */
SSMILib.JobInfo.prototype.Scope = function()
{
	/**
	 *	リソース情報の取得する数を設定する
	 *	@type Int
	 *  @lang ja
	 */	
	/**
	 *	Number of resource information sets to retrieve.
	 *	@type Int
	 *  @lang en
	 */	
	this.count = "";
	/**
	 *	リソース情報範囲の開始位置を設定する。
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	Start position of resource information range.
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.from = "";
	/**
	 *	リソース情報範囲の終了位置を設定する
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	End position of resource information range.
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.to = "";

};
/**
 * ExtScope インスタンスを作成する
 * @class リソース情報取得時に、対象となるリソースの範囲を指定するためのクラス<br>
 * <font color = "#ff0000">getChildJobResponseXMLメソッドのみ使用可能</font>
 * @lang ja
 */
/**
 * Creates ExtScope instance.
 * @class Class for specifying target resource range upon retrieving resource information.<br>
 * <font color = "#ff0000">Available only for getChildJobResponseXML method.</font>
 * @lang en
 */
SSMILib.JobInfo.prototype.ExtScope = function()
{
	/**
	 *	リソース情報の取得する数を設定する
	 *	@type Int
	 *  @lang ja
	 */	
	/**
	 *	Number of resource information sets to retrieve.
	 *	@type Int
	 *  @lang en
	 */	
	this.count = "";
	/**
	 *	リソース情報範囲の開始位置を設定する。
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	Start position of resource information range.
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.from = "";
	/**
	 *	リソース情報範囲の終了位置を設定する
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	End position of resource information range.
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.to = "";
	/**
	 *	リソース情報範囲の開始位置を設定する<br>
	 *	指定されたリソースの直後のリソースを範囲の先頭とする(<font color = "#ff0000">from指定とは排他</font>)<br>
	 *	<font color = "#ff0000">getChildJobResponseXMLメソッドのみ使用可能</font>
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	Start position of resource information range.<br>
	 *	First resource is that immediately after that specified. (<font color = "#ff0000">Cannot be specified together with "from."</font>)<br>
	 *	<font color = "#ff0000">Available only for getChildJobResponseXML method.</font>
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.after = "";
	/**
	 *	リソース情報範囲の終了位置を設定する<br>
	 *	指定されたリソースの直前のリソースを範囲の最後とする(<font color = "#ff0000">to指定とは排他</font>)<br>
	 *	<font color = "#ff0000">getChildJobResponseXMLメソッドのみ使用可能</font>
	 *	@type String(JobID)
	 *  @lang ja
	 */	
	/**
	 *	End position of resource information range.<br>
	 *	Last resource is that immediately preceding that specified. (<font color = "#ff0000">Cannot be specified together with "to."</font>)<br>
	 *	<font color = "#ff0000">Available only for getChildJobResponseXML method.</font>
	 *	@type String(JobID)
	 *  @lang en
	 */	
	this.before = "";

};
/**
 * SortKey インスタンスを作成する
 * @class ソートキーを指定するためのクラス<br>
 * @lang ja
 */
/**
 * Creates SortKey instance.
 * @class Class for specifying sort key.<br>
 * @lang en
 */
SSMILib.JobInfo.prototype.SortKey = function()
{
	/**
	 *	昇順/降順を設定する
	 *	@type SSMILib.SORTORDER
	 *  @lang ja
	 */	
	/**
	 *	Sort order; descending or ascending.
	 *	@type SSMILib.SORTORDER
	 *  @lang en
	 */
	this.order = SSMILib.SORTORDER.ASC;
	/**
	 *	ソートするキーとなる、elementを設定する
	 *	@type SSMILib.JOBDETAIL
	 *  @lang ja
	 */	
	/**
	 *	Element to serve as sort key.
	 *	@type SSMILib.JOBDETAIL
	 *  @lang en
	 */	
	this.element = SSMILib.JOBDETAIL.COMPLETETIME;
};

/**
 * @private
 */
SSMILib.JobInfo.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var _childNode;
	var _getJobListNode;

	var jobNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management/job";
	var job2NS	=	"http://www.fujixerox.co.jp/2007/07/ssm/management/job";
	var mgtNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management";
	var mgt3NS	=	"http://www.fujixerox.co.jp/2007/07/ssm/management";

	var body = xml.body;

	xml.addNSPrefix(jobNS, "job");
	xml.addNSPrefix(mgtNS, "mgt");

	if(this.childInfo){
		xml.addNSPrefix(job2NS, "job2");
		_getJobListNode = body.appendChild(xml.createElementNS(job2NS, "GetJobListEx"));
		xml.addNSDeclaration(job2NS, _getJobListNode, true);
	} else {
		_getJobListNode = body.appendChild(xml.createElementNS(jobNS, "GetJobList"));
	}

	xml.addNSDeclaration(mgtNS, _getJobListNode, true);
	xml.addNSDeclaration(jobNS, _getJobListNode, true);
	
	/* <GetJobList>/<GetJobListEx>以下のノード作成 */
	if(this.listType) {
		_childNode = _getJobListNode.appendChild(xml.createElementNS(jobNS, "ListType"));
		_childNode.appendChild(xml.createTextNode(this.listType));
	}
	if(this.jobUser){
		_childNode = _getJobListNode.appendChild(xml.createElement("User"));
		_childNode.appendChild(xml.createTextNode(this.jobUser));
	}
	if(this.jobID){
		_childNode = _getJobListNode.appendChild(xml.createElement("JobID"));
		_childNode.appendChild(xml.createTextNode(this.jobID));
	} else if(!this.jobID && (this.scope.from || this.scope.to || this.scope.count || this.scope.after || this.scope.before)){
		if(this.childInfo){
			xml.addNSPrefix(mgt3NS, "mgt3");
			_childNode = _getJobListNode.appendChild(xml.createElementNS(mgt3NS, "Scope"));
			xml.addNSDeclaration(mgt3NS, _childNode, true);
		} else{
			_childNode = _getJobListNode.appendChild(xml.createElementNS(mgtNS, "Scope"));
		}

		if(this.scope.count){
			_childNode.setAttribute("count", this.scope.count);
		}
		
		if(this.scope.after){
			_childNode.setAttribute("after", this.scope.after);
		}
		else if(this.scope.from && !this.scope.after){
			_childNode.setAttribute("from", this.scope.from);
		}

		if(this.scope.before){
			_childNode.setAttribute("before", this.scope.before);
		}
		else if(this.scope.to && !this.scope.before){
			_childNode.setAttribute("to", this.scope.to);
		}
	}
	// jobClientID
	if(this.jobClientID){
		_childNode = _getJobListNode.appendChild(xml.createElement("JobClientID"));
		_childNode.appendChild(xml.createTextNode(this.jobClientID));
	}

	//	namespace定義(job)
	if(this.respond){
		if(this.childInfo){
			_childNode = _getJobListNode.appendChild(xml.createElementNS(jobNS, "RespondSelf"));
		} else {
			_childNode = _getJobListNode.appendChild(xml.createElementNS(jobNS, "Respond"));
		}
		_childNode.appendChild(xml.createElement(this.respond));
	}
	
	//	namespace定義(mgt)
	if(this.childInfo){
		_childNode = _getJobListNode.appendChild(xml.createElement("ChildrenInfo"));
		_childNode.appendChild(xml.createTextNode(this.childInfo));
		if(this.jobImage){
			_childNode = _getJobListNode.appendChild(xml.createElement("JobImage"));
			_childNode.appendChild(xml.createTextNode(this.jobImage));
		}
		//	namespace定義(job)
		if(this.respondChild){
			_childNode = _getJobListNode.appendChild(xml.createElementNS(jobNS, "RespondChildren"));
			_childNode.appendChild(xml.createElement(this.respondChild));
		}
	}

	//	namespace定義(mgt)
	if(this.sortKeys.length){
		var keysNode = _getJobListNode.appendChild(xml.createElementNS(mgtNS, "SortKeys"));
		var keyLen = this.sortKeys.length;
		for(var i = 0; i < keyLen; i++){
			var keyNode = keysNode.appendChild(xml.createElementNS(mgtNS, "SortKey"));
			keyNode.appendChild(xml.createElement(this.sortKeys[i].element));
			keyNode.setAttribute("order", this.sortKeys[i].order);
		}
	}

	if(this.scopeAfterSort.from || this.scopeAfterSort.to || this.scopeAfterSort.count){
		_childNode = _getJobListNode.appendChild(xml.createElementNS(mgtNS, "ScopeAfterSort"));
		if(this.scopeAfterSort.count){
			_childNode.setAttribute("count", this.scopeAfterSort.count);
		}
		if(this.scopeAfterSort.from){
			_childNode.setAttribute("from", this.scopeAfterSort.from);
		}
		if(this.scopeAfterSort.to){
			_childNode.setAttribute("to", this.scopeAfterSort.to);
		}
	}

	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
};
/**
 * 指定したジョブIDによりジョブ情報を取得する<br>
 * オプションとして引数に非同期通信の際の成功時/失敗時のコールバック関数をそれぞれ設定可能<br>
 * 同期呼び出しを行う場合はnullを設定する<br>
 * 　　　　　　　　 また成功時のコールバック関数は、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 * 　　　　　　　　 また失敗時のコールバック関数は、、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth ジョブ情報を取得するデバイスが認証モードであるか否か
 * @lang ja
 */
 /**
 * Retrieves job information of job specified by job ID.<br>
 * Callback functions upon success/failure can optionally be specified as arguments.<br>
 * For synchronous processing, set null.<br>
 * Callback function upon success must be JavaScript function of the following format:<br>
 * BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 * Callback function upon failure must be JavaScript function of the following format:<br>
 * BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth Whether device from which to retrieve information requires authentication or not.
 * @lang en
 */
SSMILib.JobInfo.prototype.getJobList = function(auth)
{
	this.requester.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/job#GetJobList"';
	this.requester.isDeviceReq = true;
	this.requester.async = SSMILib.async;
	if (auth) this.auth = auth;
	/* 不要なプロパティを初期化 */
	this.scope.after = "";
	this.scope.before = "";
	this.childInfo = false;
	this.respondChild = "";
	this.jobImage = false;
	
	var _path;
	
	if(this.auth){
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Job";
	} else{
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Job";
	}
	
	var _msg = this.serializeToString();

	this.requester.send(_path, _msg);

	return;
};

/**
 * 指定したジョブIDとインデックスにより子ジョブを含むジョブからジョブ情報を取得する<br>
 * オプションとして引数に非同期通信の際の成功時/失敗時のコールバック関数をそれぞれ設定可能<br>
 * 同期呼び出しを行う場合はnullを設定する<br>
 * 　　　　　　　　 また成功時のコールバック関数は、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 * 　　　　　　　　 また失敗時のコールバック関数は、、以下の形のJavaScript関数である必要がある<br>
 * 　　　　　　　　 BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth ジョブ情報を取得するデバイスが認証モードであるか否か
 * @lang ja
 */
 /**
 *  Retrieves job information of job with child jobs, based on specified job ID and index.<br>
 *  Callback functions upon success/failure can optionally be specified as arguments.<br>
 *  For synchronous processing, set null.<br>
 *  Callback function upon success must be JavaScript function of the following format:<br>
 *  BOOL success_cb<font color = "#ff0000">(XMLHttpRequest)</font><br><br>
 *  Callback function upon failure must be JavaScript function of the following format:<br>
 *  BOOL error_cb<font color = "#ff0000">(XMLHttpRequest)</font>
 * @param {Bool} auth Whether device from which to retrieve information requires authentication or not.
 * @lang en
 */
SSMILib.JobInfo.prototype.getChildJobList = function(auth)
{
	this.requester.soapAction = '"http://www.fujixerox.co.jp/2007/07/ssm/management/job#GetJobListEx"';
	this.requester.isDeviceReq = true;
	this.auth = auth;
	this.requester.async = SSMILib.async;

	var _path;

	if(this.auth){
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Job";
	} else{
		_path = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Job";
	}

	/* 子ジョブのジョブIDを取得 */
	this.childInfo = true;

	var _msg = this.serializeToString();

	this.requester.send(_path,_msg);
	return;
};

/**
 * ジョブ情報取得の応答のreponseTextからジョブ情報部分を切り出す
 * @param {String} responseText ジョブIDを指定する
 * @param {Int} index 何番目の子ジョブの情報を切り出すか指定する<br>
 * index = 0 の場合は、親ジョブの情報を含めた、全てのジョブの情報<br>
 * index = 1...の場合は、指定した子ジョブの情報
 * @returns {Node} 切り出しに成功した場合は、指定したジョブ情報のノードが返る
 * @returns {Null} 切り出しに失敗した場合は、nullが返る
 * @addon
 * @static
 * @lang ja
 */
/**
 * Extracts job information from job information retrieval response.
 * @param {String} responseText Job ID
 * @param {Int} index Child job index.<br>
 * If index = 0, information on all jobs including parent job are retrieved.<br>
 * Otherwise, information on job of specified index position is retrieved.
 * @returns {Node} If extraction is successful, node with information on specified node is returned.
 * @returns {Null} Otherwise, null is returned.
 * @addon
 * @static
 * @lang en
 */
SSMILib.JobInfo.extractChildJobInfo = function(responseText, index)
{
	var _resText = responseText;
	var _startElementStr = '<rj:RelatedJobs';	//先頭文字列
	var _endElementStr = '</rj:RelatedJobs>';	//終端文字列

	var _start = _resText.indexOf(_startElementStr, 0);
	var _end = _resText.lastIndexOf(_endElementStr);
	
	var _node = null;
	var _childNode;
	var _childNodeList;

	if(_start == -1 || _end == -1){
		return null;
	}
	var _elementStr = _resText.substring(_start, _end+_endElementStr.length);
	if(_elementStr){

		if(BrowserLib.browser != BrowserLib.BrowserType.INSPIRIUM){
			_elementStr = _elementStr.replace(/  /g, "");
		} else {
			_elementStr = _elementStr.split("  ").join("");
		}

		_node = XMLLib.createXMLObject(_elementStr);
		if(index){
			_childNodeList = _node.getElementsByTagName("JobInfo");
			if(_childNodeList.length){
				_childNode = _childNodeList.item(index);
				if(_childNode){
					return _childNode;
				}
			}
		}
	}

	return _node;
};

/**
 * 指定された条件に合致するジョブ情報の配列を取得する<br>
 * 情報が取得できた場合、指定した要素に子要素が存在する場合は、(子要素名がプロパティの)オブジェクトの形で返り、存在しない場合は、その要素の値が返る。<br>
 * プロパティ詳細については「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照
 * @param {SSMILib.JobList} jobInfo SSMILib.JobListオブジェクトを指定する
 * @param {String} [key] 取得する情報の要素名を指定する<br>
 * 「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照のこと<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves array of information on specified job.<br>
 * If information is successfully received, and specified element has child element, object is returned with child elements named after the respective properties. <br>
 * If specified element has no child elements, element value is returned.<br>
 * See 01-03 SESAMi Service Management Interface Specification_JobAttriute.xls for property details.<br>
 * @param {SSMILib.JobList} SSMILib.JobList object.
 * @param {String} [key] Element name representing information to retrieve.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetJobList = function(jobInfo, key)
{
	
	var job = null;
	if (jobInfo) { job = jobInfo; } else { job = new SSMILib.JobInfo(null); }
	job.requester.successHandler = SSMILib.GetJobList.successCb;
	job.requester.errorHandler = SSMILib.GetJobList.errorCb;
	SSMILib.GetJobList._key = null;

	if(key){
		job.respond = key;
		SSMILib.GetJobList._key = key;
	}
	if (SSMILib.dummy) {
		var _jobInfo = new Array();
		_jobInfo[0] = new Object();
		_jobInfo[0] = {JobID:"00000001-aaaa-bbbb-0000-0123456789ab",
					Status:"completed", 
					StartTime:"2009-11-19T19:58:32+08:00", 
					CompleteTime: "2009-11-19T19:59:15+08:00", 
					User:"0001", 
					Name:"ユーザ0001", 
					FaultReason:""};

		SSMILib.onEvent("GetJobList", true, _jobInfo);
		return;
	}
	
	job.getJobList();
	return;
};

/**
 * @private
 */
SSMILib.GetJobList.successCb = function(res)
{
	var _jobInfo = null;
	var _result = false;
	if(!res.responseXML) {
		SSMILib.onEvent("GetJobList", _result, _jobInfo);
		return;
	}

	var _jobInfoNode = res.responseXML.getElementsByTagName("JobInfo");
	if(!_jobInfoNode){
		SSMILib.onEvent("GetJobList", _result, _jobInfo);
		return;
	}
	if(SSMILib.GetJobList._key){
		var _key = SSMILib.GetJobList._key;
		var _keyNodes = _jobInfoNode[0].getElementsByTagName(_key);

		if(_keyNodes){
			_jobInfo = new Array();
			for (var i = 0; i < _jobInfo.length; i++) {
				_jobInfo = SSMILib.childNodeToProperty(_keyNodes[0]);
			}
			_result = true;
		}
	} else {
		_jobInfo = new Array();
		for (var i = 0; i < _jobInfoNode.length; i++) {
			_jobInfo[i] = SSMILib.childNodeToProperty(_jobInfoNode[i]);
		}
		_result = true;
	}

	
	SSMILib.onEvent("GetJobList", _result, _jobInfo);
	return;
};

/**
 * @private
 */
SSMILib.GetJobList.errorCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	SSMILib.onEvent("GetJobList", _result, _jobInfo);

	return;
};


/**
 * 指定されたジョブの情報を取得する<br>
 * GetJobInfo()に変わるAPI。GetJobInfo()の使用は推奨しない。
 * 情報が取得できた場合、指定した要素に子要素が存在する場合は、(子要素名がプロパティの)オブジェクトの形で返り、存在しない場合は、その要素の値が返る。<br>
 * プロパティ詳細については「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照
 * @param {SSMILib.JobList} SSMILib.JobList object.
 * @param {String} jobId ジョブIDを指定する
 * @param {String} [key] 取得する情報の要素名を指定する<br>
 * 「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照のこと<br>
 * 
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves information on specified job.<br>
 * If information is successfully received, and specified element has child element, object is returned with child elements named after the respective properties. <br>
 * If specified element has no child elements, element value is returned.<br>
 * See 01-03 SESAMi Service Management Interface Specification_JobAttriute.xls for property details.<br>
 * @param {SSMILib.JobList} SSMILib.JobList object.
 * @param {String} jobId Job ID.
 * @param {String} [key] Element name representing information to retrieve.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetJob = function(jobInfo, jobId, key)
{
	var job = null;
	if (jobInfo) { job = jobInfo; } else { job = new SSMILib.JobInfo(jobId); }
	job.requester.successHandler = SSMILib.GetJob.successCb;
	job.requester.errorHandler = SSMILib.GetJob.errorCb;
	SSMILib.GetJob._key = null;

	if(key){
		job.respond = key;
		SSMILib.GetJob._key = key;
	}

	if (SSMILib.dummy) {
		var _jobInfo = new Object();
		_jobInfo = {JobID:"00000001-aaaa-bbbb-0000-0123456789ab",
					Status:"completed", 
					StartTime:"2009-11-19T19:58:32+08:00", 
					CompleteTime: "2009-11-19T19:59:15+08:00", 
					User:"0001", 
					Name:"ユーザ0001", 
					FaultReason:""};

		SSMILib.onEvent("GetJob", true, _jobInfo);
		return;
	}
	
	job.getJobList();
	return;
};

/**
 * @private
 */
/*
SSMILib.GetJob.successCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("GetJob", _result, _jobInfo);
		return;
	}

	var _jobInfoNode = res.responseXML.getElementsByTagName("JobInfo");
	if(!_jobInfoNode){
		SSMILib.onEvent("GetJob", _result, _jobInfo);
		return;
	}
	if(SSMILib.GetJob._key){
		var _key = SSMILib.GetJob._key;
		var _keyNodes = _jobInfoNode[0].getElementsByTagName(_key);

		if(_keyNodes){
			_jobInfo = SSMILib.childNodeToProperty(_keyNodes[0]);
			_result = true;
		}
	} else {
		_jobInfo = SSMILib.childNodeToProperty(_jobInfoNode[0]);
		_result = true;
	}

	
	SSMILib.onEvent("GetJob", _result, _jobInfo);
	return;
};
*/

SSMILib.GetJob.successCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("GetJob", _result, _jobInfo);
		return;
	}

	var _jobInfoNode = res.responseXML.getElementsByTagName("JobInfo");
	if(!_jobInfoNode || _jobInfoNode.length == 0){//2016.09.05 FXKIS CHONE 프린트 환불 처리 - JobInfo 노드가 없을 경우(length가 0인 경우) 에러 리턴
		SSMILib.onEvent("GetJob", _result, _jobInfo);
		return;
	}
	if(SSMILib.GetJob._key){
		var _key = SSMILib.GetJob._key;
		var _keyNodes = _jobInfoNode[i].getElementsByTagName(_key);

		if(_keyNodes){
			_jobInfo = SSMILib.childNodeToProperty(_keyNodes[0]);
			_result = true;
		}
	} else {
		//2016.09.05 FXKIS CHONE 프린트 환불 처리 - 프린트 active 잡 모니터링 실시, active 잡이 여러개일 경우 배열로 리턴하도록 수정함.
		//_jobInfo = SSMILib.childNodeToProperty(_jobInfoNode[0]);
		//_result = true;

		if(_jobInfoNode.length > 1){
			_jobInfo = [];
			for(var i=0; i<_jobInfoNode.length; i++){
				var tmpJobInfo = SSMILib.childNodeToProperty(_jobInfoNode[i]);
				_jobInfo.push(tmpJobInfo);
			}
		}else{
			_jobInfo = SSMILib.childNodeToProperty(_jobInfoNode[0]);
		}
		_result = true;
	}

	SSMILib.onEvent("GetJob", _result, _jobInfo);
	return;
};
/**
 * @private
 */
SSMILib.GetJob.errorCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	SSMILib.onEvent("GetJob", _result, _jobInfo);

	return;
};

/**
 * 指定されたジョブの情報を取得する<br>
 * 非推奨API。GetJob()の利用を推奨する。
 * 情報が取得できた場合、指定した要素に子要素が存在する場合は、(子要素名がプロパティの)オブジェクトの形で返り、存在しない場合は、その要素の値が返る。<br>
 * プロパティ詳細については「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {String} jobId ジョブIDを指定する
 * @param {String} [key] 取得する情報の要素名を指定する<br>
 * 「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照のこと<br>
 * 
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves information on specified job.<br>
 * If information is successfully received, and specified element has child element, object is returned with child elements named after the respective properties. <br>
 * If specified element has no child elements, element value is returned.<br>
 * See 01-03 SESAMi Service Management Interface Specification_JobAttriute.xls for property details.<br>
 * @param {Bool} auth Whether device requires authentication or not.
 * @param {String} jobId Job ID.
 * @param {String} [key] Element name representing information to retrieve.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetJobInfo = function(auth, jobId, key)
{

	var job = new SSMILib.JobInfo(jobId, auth);
	job.requester.successHandler = SSMILib.GetJobInfo.successCb;
	job.requester.errorHandler = SSMILib.GetJobInfo.errorCb;
	SSMILib.GetJobInfo._key = null;

	if(key){
		job.respond = key;
		SSMILib.GetJobInfo._key = key;
	}

	if (SSMILib.dummy) {
		var _jobInfo = new Object();
		_jobInfo = {JobID:"00000001-aaaa-bbbb-0000-0123456789ab",
					Status:"completed", 
					StartTime:"2009-11-19T19:58:32+08:00", 
					CompleteTime: "2009-11-19T19:59:15+08:00", 
					User:"0001", 
					Name:"ユーザ0001", 
					FaultReason:""};

		SSMILib.onEvent("GetJobInfo", true, _jobInfo);
		return;
	}
	
	job.getJobList(auth);
	return;
};

/**
 * @private
 */
SSMILib.GetJobInfo.successCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	if(!res.responseXML) {
		SSMILib.onEvent("GetJobInfo", _result, _jobInfo);
		return;
	}

	var _jobInfoNode = res.responseXML.getElementsByTagName("JobInfo");
	if(_jobInfoNode.length == 0){
		SSMILib.onEvent("GetJobInfo", _result, _jobInfo);
		return;
	}
	if(SSMILib.GetJobInfo._key){
		var _key = SSMILib.GetJobInfo._key;
		var _keyNodes = _jobInfoNode[0].getElementsByTagName(_key);

		if(_keyNodes.length){
			_jobInfo = SSMILib.childNodeToProperty(_keyNodes[0]);
			_result = true;
		}
	} else {
		_jobInfo = SSMILib.childNodeToProperty(_jobInfoNode[0]);
		_result = true;
	}

	
	SSMILib.onEvent("GetJobInfo", _result, _jobInfo);
	return;
};

/**
 * @private
 */
SSMILib.GetJobInfo.errorCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	SSMILib.onEvent("GetJobInfo", _result, _jobInfo);

	return;
};

/**
 * 指定された子ジョブの情報を取得する
 * 情報が取得できた場合、指定した要素に子要素が存在する場合は、(子要素名がプロパティの)オブジェクトの形で返り、存在しない場合は、その要素の値が返る。<br>
 * プロパティ詳細については「01-03 SESAMi Service Management Interface Specification_JobAttriute.xls」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @param {String} jobId ジョブIDを指定する
 * @param {String} [key] 取得する情報の要素名を指定する<br>
 * @param {Int} [index] 何番目の子ジョブの情報か指定する<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves information on specified job.<br>
 * If information is successfully received, and specified element has child element, object is returned with child elements named after the respective properties.<br>
 * If specified element has no child elements, element value is returned.<br>
 * See 01-03 SESAMi Service Management Interface Specification_JobAttriute.xls for property details.
 * @param {Bool} auth Whether device requires authentication or not.
 * @param {String} jobId Job ID.
 * @param {String} [key] Element name representing information to retrieve.<br>
 * @param {Int} [index] Child job index.<br>
 * @addon
 * @static
 * @lang en
 */
SSMILib.GetChildJobInfo = function(auth, jobId, key, index)
{

	var job = new SSMILib.JobInfo(jobId, auth);
	job.requester.successHandler = SSMILib.GetChildJobInfo.successCb;
	job.requester.errorHandler = SSMILib.GetChildJobInfo.errorCb;
	SSMILib.GetChildJobInfo._key = null;
	SSMILib.GetChildJobInfo._index = null;

	if(key){
		job.respondChild = key;
		SSMILib.GetChildJobInfo._key = key;
	}

	if(index){
		SSMILib.GetChildJobInfo._index = index;
	}

	if (SSMILib.dummy) {
		var _cJobInfo = new Object();
		_cJobInfo = {ColorMode:"monochrome",
					Size:"A4", 
					Type:"stationary", 
					BillingMeter: "METER_1", 
					Sheets:"1", 
					Impressions:"1"};

		SSMILib.onEvent("GetChildJobInfo", true, _cJobInfo);
		return;
	}
	
	job.getChildJobList(auth);
	return;
};

/**
 * @private
 */
SSMILib.GetChildJobInfo.successCb = function(res)
{
	//SSMILib.onEvent("GetChildJobInfo", true, "");　//Dummy用
	var _jobInfo = null;
	var _result = false;

	if(!res.responseText) {
		SSMILib.onEvent("GetChildJobInfo", _result, _jobInfo);
		return;
	}
	var _jobIndex = SSMILib.GetChildJobInfo._index;
	var _resNode = SSMILib.JobInfo.extractChildJobInfo(res.responseText, _jobIndex);
	if(_resNode){
		var _key = SSMILib.GetChildJobInfo._key;
		if(_key){
			var _keyNodes = _resNode.getElementsByTagName(_key);
			if(_keyNodes.length){
				var _keyNodesLen = _keyNodes.length;
				_jobInfo = new Array();
				for(var i=0; i<_keyNodesLen; i++){
					if (_keyNodes[i].nodeType != 1 || !_keyNodes[i].hasChildNodes()) {	//不要なノードを飛ばす
						continue;
					}
					_jobInfo.push(SSMILib.childNodeToProperty(_keyNodes[i]));
				}
				_result = true;
			}
		} else {
			if(_jobIndex){
				_jobInfo = SSMILib.childNodeToProperty(_resNode);
			} else {
				var _jobInfoNode = _resNode.getElementsByTagName("JobInfo");
				if(_jobInfoNode.length){
					var _jobInfoNodeLen = _jobInfoNode.length;
					_jobInfo = new Array();
					for(var i=0; i<_jobInfoNodeLen; i++){
						if (_jobInfoNode[i].nodeType != 1 || !_jobInfoNode[i].hasChildNodes()) {	//不要なノードを飛ばす
							continue;
						}
						_jobInfo.push(SSMILib.childNodeToProperty(_jobInfoNode[i]));
					}
				}
			}
			_result = true;
		}
	}
	SSMILib.onEvent("GetChildJobInfo", _result, _jobInfo);
		
	return;
};

/**
 * @private
 */
SSMILib.GetChildJobInfo.errorCb = function(res)
{
	var _jobInfo = null;
	var _result = false;

	SSMILib.onEvent("GetChildJobInfo", _result, _jobInfo);

	return;
};