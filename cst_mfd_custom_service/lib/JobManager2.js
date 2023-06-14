/* 
 * Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.
 *
 * Java Script Library for Apeos Intrgration Plus.
 * ver2.0.0
 */

var JobManagement;
if(!JobManagement) JobManagement = {};

(function(){

/**
 * public class: JobManager
 */
JobManager = function(userName, password) {
	var _template = "template/GetJobListTemplate2.xml";
	
	var _userName = userName;
	var _password = password;
	
	var _hostNameOrIpAddress = "127.0.0.1";
	var _portNumber = "80";
	var _useSSL = false;
	var _jobID = null;
	var _listType = null;
	var _success_CB = null;
	var _error_CB = null;
	var _self_GetJobInfo = null;
	var _self_CheckJobStatus = null;
	
	var _self = this;
	
	this.GetJobInfo = function(jobID, success_CB, error_CB) {
		_self_GetJobInfo = this;
		_jobID = jobID;
		_success_CB = success_CB;
		_error_CB = error_CB;
		
		WebServiceReq.WebService.LoadTemplate(_template, _self.LoadTemplate_CB, _error_CB);
	}
	
	this.LoadTemplate_CB = function(req) {
		var _soap = req.responseXML;
		
		var _targetElement = _soap.getElementsByTagName("GetJobList");
		var _make = _soap.createElementNS("http://www.fujifilm.com/fb/2021/03/ssm/management/job", "JobID");
		var _jobIDNode = _soap.createTextNode(_jobID);
		_make.appendChild(_jobIDNode);
		_targetElement[0].appendChild(_make);
		
		var _xmlSerializer = new XMLSerializer();
		var _msg = _xmlSerializer.serializeToString(_soap);
		
		var createPath = function() {
			if (_userName instanceof WebServiceReq.AnonymousUser) {
				return "/ssm/Management/Anonymous/Job";
			}
			else {
				return "/ssm/Management/Job";
			}
		}
		
		var _path = createPath();
		var _soapAction = '"http://www.fujifilm.com/fb/2021/03/ssm/management/job#GetJobList"';
		
		var _ws = new WebServiceReq.WebService();
		if (_hostNameOrIpAddress) {
			_ws.Host = _hostNameOrIpAddress;
		}
		if (_portNumber) {
			_ws.Port = _portNumber;
		}
		if (_useSSL) {
			_ws.UseSSL = _useSSL;
		}
		_ws.CallMgmtService(_path, _userName, _password, _soapAction, _msg, _self.GetJobInfo_CB, _error_CB);
	}
	
	this.GetJobInfo_CB = function(req) {
		var _jobInfo = null;
		var _tag = null;
		var _item = null;
		
		var _xml = req.responseXML;
		
		_tag = _xml.getElementsByTagName("GetJobListResponse");
		if (!_tag) {
			_error_CB(null);
			return;
		}
		
		_tag = _tag[0].getElementsByTagName("JobInfo");
		if (_tag.length == 0) {
			_error_CB(null);
			return;
		}
		
		for (i = 0; i < _tag.length; i++) {
			_jobInfo = new JobInfo();
			_item = _tag[i].getElementsByTagName("JobID");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.JobID = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("Status");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.Status = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("StartTime");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.StartTime = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("CompletedTime");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.CompletedTime = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("User");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.User = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("Name");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.Name = _item[0].firstChild.nodeValue;
			}
			_item = _tag[i].getElementsByTagName("FaultReason");
			if (_item.length > 0 && _item[0].hasChildNodes()) {
				_jobInfo.FaultReason = _item[0].firstChild.nodeValue;
			}
		}
		
		_success_CB.call(_self_GetJobInfo, _jobInfo);
	}

	this.CheckJobStatus = function(listType, success_CB, error_CB) {
		_self_CheckJobStatus = this;
		_success_CB = success_CB;
		_error_CB = error_CB;
		_listType = listType;
		
		WebServiceReq.WebService.LoadTemplate(_template, _self.LoadTemplateAc_CB, _error_CB);
	}
	
	this.LoadTemplateAc_CB = function(req) {
		var _soap = req.responseXML;
		var _targetElement = _soap.getElementsByTagName("GetJobList");
		var _make = _soap.createElementNS("http://www.fujifilm.com/fb/2021/03/ssm/management/job", "ListType");
		var _text = _soap.createTextNode(_listType);
		_make.appendChild(_text);
		_targetElement[0].appendChild(_make);

		var _xmlSerializer = new XMLSerializer();

		var _msg = _xmlSerializer.serializeToString(_soap);
		
		var createPath = function() {
			if (_userName instanceof WebServiceReq.AnonymousUser) {
				return "/ssm/Management/Anonymous/Job";
			}
			else {
				return "/ssm/Management/Job";
			}
		}
		
		var _path = createPath();
		var _soapAction = '"http://www.fujifilm.com/fb/2021/03/ssm/management/job#GetJobList"';
		
		var _ws = new WebServiceReq.WebService();
		if (_hostNameOrIpAddress) {
			_ws.Host = _hostNameOrIpAddress;
		}
		if (_portNumber) {
			_ws.Port = _portNumber;
		}
		if (_useSSL) {
			_ws.UseSSL = _useSSL;
		}
		_ws.CallMgmtService(_path, _userName, _password, _soapAction, _msg, _self.GetJobInfoAc_CB, _error_CB);
	}
	
	this.GetJobInfoAc_CB = function(req) {
		var _tags = null;
		var _item = null;
		var _xml = req.responseXML;
		
		_tags = _xml.getElementsByTagName("GetJobListResponse");
		if (!_tags) {
			_error_CB(null);
			return;
		}
		
		for(i = 0; i < _tags.length; i++) {
			_tag = _tags[i].getElementsByTagName("JobInfo");
			if (_tag.length > 0) {
				_success_CB.call(_self_CheckJobStatus, true);
				return;
			}
		}
		_success_CB.call(_self_CheckJobStatus, false);
	}
}

/**
 * public class: JobInfo
 */
JobInfo = function() {
	this.JobID = null;
	this.Status = null;
	this.StartTime = null;
	this.CompletedTime = null;
	this.User = null;
	this.Name = null;
	this.FaultReason = null;
}


/**
 * public class: JobStatus
 */
JobStatus = function(value) {
	var _value = value;
	
	this.ToString = function() {
		return _value;
	}
}

JobStatus.ValueOf = function(value) {
	switch (trim(value).toLowerCase()) {
		case "other":
			return JobStatus.Other;
		case "unknown":
			return JobStatus.Unknown;
		case "created":
			return JobStatus.Created;
		case "pending":
			return JobStatus.Pending;
		case "processing":
			return JobStatus.Processing;
		case "interrupted":
			return JobStatus.Interrupted;
		case "retained":
			return JobStatus.Retained;
		case "held":
			return JobStatus.Held;
		case "paused":
			return JobStatus.Paused;
		case "terminating":
			return JobStatus.Terminating;
		case "completed":
			return JobStatus.Completed;
		case "completedwitherror":
			return JobStatus.CompletedWithError;
		case "completedwithwarning":
			return JobStatus.CompletedWithWarning;
		case "canceled":
			return JobStatus.Canceled;
		case "canceledbyuser":
			return JobStatus.CanceledByUser;
		case "canceledbysystem":
			return JobStatus.CanceledBySystem;
		default:
			return JobStatus.Unknown;
	}
}

JobStatus.Other = new JobStatus("other");
JobStatus.Unknown = new JobStatus("unknown");
JobStatus.Created = new JobStatus("created");
JobStatus.Pending = new JobStatus("pending");
JobStatus.Processing = new JobStatus("processing");
JobStatus.Interrupted = new JobStatus("interrupted");
JobStatus.Retained = new JobStatus("retained");
JobStatus.Held = new JobStatus("held");
JobStatus.Paused = new JobStatus("paused");
JobStatus.Terminating = new JobStatus("terminating");
JobStatus.Completed = new JobStatus("completed");
JobStatus.CompletedWithError = new JobStatus("completedWithError");
JobStatus.CompletedWithWarning = new JobStatus("completedWithWarning");
JobStatus.Canceled = new JobStatus("canceled");
JobStatus.CanceledByUser = new JobStatus("canceledByUser");
JobStatus.CanceledBySystem = new JobStatus("canceledBySystem");


trim = function(str) {
	return str.replace(/^\s+|\s+$/g, "");
}


var ns = JobManagement;
ns.JobManager = JobManager;
ns.JobInfo = JobInfo;
ns.JobStatus = JobStatus;

})();