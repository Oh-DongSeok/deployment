/* 
 * Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.
 *
 * Java Script Library for Apeos Intrgration Plus.
 * ver2.0.0
 */

var WebServiceReq;
if(!WebServiceReq) WebServiceReq = {};

(function() {
/**
 * public class: WebService
 */
WebService = function() {
	this.UseSSL = false;
	this.Host = "";
	this.Port = "";
}

WebService.prototype.CallJobExecService = function(userName, password, msg, success_CB, error_CB) {
	try {
		var _req = new XMLHttpRequest();
		
		var _protcol = "";

		if (this.UseSSL) {
			_protcol = "https://";
		}
		else {
			_protcol = "http://";
		}
		
		if (typeof(netscape) != 'undefined') {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		}
		
		var _op_path = "";
		
		if (this.Port) {
			_op_path = _protcol + this.Host + ":" + this.Port + "/ssm/Management/JobTemplate/Execution";
		}
		else {
			_op_path = _protcol + this.Host + "/ssm/Management/JobTemplate/Execution";
		}
		
		_req.open("POST", _op_path, true);

		_req.setRequestHeader("SOAPAction", '"http://www.fujifilm.com/fb/2021/04/ssm/management/jobTemplate#ExecuteJobTemplate"');
		
		_req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		_req.setRequestHeader("X-FX-Authorization", "panel");

		if((userName) || (password)) {
			var _b64 = new Base64();
			var _b64str = userName + ':' + password;
			var _enstr = _b64.encode(_b64str);
			_req.setRequestHeader("Authorization", "Basic " + _enstr);
		}
		
		var _f = function() {
			if (_req.readyState==4) {
				if (_req.status/100 != 2) {
					if (error_CB != null) {
						error_CB(new ErrorHandling(_req));
					}
				}
				else if(_req.responseXML != null
						|| (_req.responseText != null && _req.responseText != "")){
					success_CB(_req);
				}
				else if(error_CB != null) {
					error_CB(new ErrorHandling(_req));
				}
			}
		}
		_req.onreadystatechange = _f;
		_req.send(msg);
	}
	catch (err) {
		error_CB(new ErrorHandling(err));
	}
}

WebService.prototype.CallMgmtService = function (path, userName, password, soapAction, msg, success_CB, error_CB) {
	try {
		var _req = new XMLHttpRequest();
		
		var _protcol = "";

		if(this.UseSSL) {
			_protcol = "https://";
		}
		else {
			_protcol = "http://";
		}
		
		if (typeof(netscape) != 'undefined') {
			 netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		}
		
		var _op_path = "";
		
		if (this.Port) {
			_op_path = _protcol + this.Host + ":" + this.Port + path;
		}
		else {
			_op_path = _protcol + this.Host + path;
		}
		
		_req.open("POST", _op_path, true);
		_req.setRequestHeader("SOAPAction", soapAction);
		_req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		_req.setRequestHeader("X-FX-Authorization", "panel");

		if(!(userName instanceof AnonymousUser) && ((userName) || (password))) {
			var _b64 = new Base64();
			var _b64str = userName + ':' + password;
			var _enstr = _b64.encode(_b64str);
			_req.setRequestHeader("Authorization", "Basic " + _enstr);
		}
		var _f = function() {
			if (_req.readyState==4) {
				if (_req.status/100 != 2) {
					if (error_CB != null) {
						error_CB(new ErrorHandling(_req));
					}
				}
				else if(_req.responseXML != null
						|| (_req.responseText != null && _req.responseText != "")){
					success_CB(_req);
				}
				else if(error_CB != null) {
					error_CB(new ErrorHandling(_req));
				}
			}
		}
		_req.onreadystatechange = _f;
		
		_req.send(msg);
	}
	catch (err) {
		error_CB(new ErrorHandling(err));
	}
}

WebService.LoadTemplate = function(template, success_CB, error_CB) { 
	try {
		var _self = this;
		var _req = new XMLHttpRequest();

		_req.open("GET", template, true);
		_req.onreadystatechange = function() {
			if (_req.readyState==4) {
				if (_req.status/100 != 2) {
					if (error_CB != null) {		
						error_CB(new ErrorHandling(_req));
					}
				}
				else if(_req.responseXML != null
						|| (_req.responseText != null && _req.responseText != "")){
					success_CB.call(_self, _req);

				}
				else if(error_CB != null) {

					error_CB(new ErrorHandling(_req));
				}
			}
		}
		_req.send(null);
	}
	catch (err) {
		error_CB(new ErrorHandling(err));
	}
}

WebService.GetSoapFaultInfo = function(resXML) {
	var _errinfo = new Array();
	var _tag = null;
	var _sub_tag = null;
	var _sub_sub_tag = null;
	var _valtag = null;

	_errinfo["Code"] = null;
	_errinfo["Subcode"] = null;
	_errinfo["SubSubcode"] = null;

	var _xmlobj = resXML;

	if(!_xmlobj)
	{
		return _errinfo;
	}

	if(_xmlobj.getElementsByTagNameNS)
	{
		_tag = _xmlobj.getElementsByTagNameNS("http://schemas.xmlsoap.org/soap/envelope/","Fault");
		if( _tag.length == 0 )
		{	// SOAP V1.2
			_tag = _xmlobj.getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Fault");
			if( _tag.length == 0 )
			{	// Not Fault
				return null;
			}

			_tag = _tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Code");
			if( _tag.length == 0 )
			{	// Not Fault
				return null;
			}
			_valtag = _tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Value");
			_errinfo["Code"] = _valtag[0].firstChild.nodeValue;
			_sub_tag = _tag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");

			if( _sub_tag.length != 0 )
			{
				_valtag = _sub_tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Value");
				_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

				_sub_sub_tag = _sub_tag[0].getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/04/ssm/management/fault","Subcode");

			
				if( _sub_sub_tag.length != 0 )
				{
					_valtag = _sub_sub_tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Value");
					_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
				}
			}
		}
		else
		{	// SOAP V1.1
			_valtag = _tag[0].getElementsByTagName("faultcode");
			if( _valtag.length == 0 )
			{	// Not Fault
				return null;
			}
			_errinfo["Code"] = _valtag[0].firstChild.nodeValue;

			_tag = _tag[0].getElementsByTagName("detail");
			if( _tag.length != 0 )
			{
				_sub_tag = _tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Subcode");
				if( _sub_tag.length != 0 )
				{
					_valtag = _sub_tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Value");
					_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

					_sub_sub_tag = _sub_tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Subcode");
					if( _sub_sub_tag.length != 0 )
					{
						_valtag = _sub_sub_tag[0].getElementsByTagNameNS("http://www.w3.org/2003/05/soap-envelope","Value");
						_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
					}
				}
			}
		}

	}
	else
	{
		_tag = _xmlobj.getElementsByTagName("Fault");
		if( _tag.length == 0 )
		{	// Next Type
			_tag = _xmlobj.getElementsByTagName("SOAP:Fault");
			if( _tag.length == 0 )
			{	// Next Type
				_tag = _xmlobj.getElementsByTagName("env:Fault");
				if( _tag.length == 0 )
				{	// Not Fault
					return null;
				}
				else
				{	// SOAP V1.2
					_tag = _xmlobj.getElementsByTagName("env:Code");
					if( _tag.length == 0 )
					{	// Not Fault
						return null;
					}
					_valtag = _tag[0].getElementsByTagName("env:Value");
					_errinfo["Code"] = _valtag[0].firstChild.nodeValue;

					_sub_tag = _tag[0].getElementsByTagName("env:Subcode");
					if( _sub_tag.length != 0 )
					{
						_valtag = _sub_tag[0].getElementsByTagName("env:Value");
						_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

						_sub_sub_tag = _sub_tag[0].getElementsByTagName("env:Subcode");
						if( _sub_sub_tag.length != 0 )
						{
							_valtag = _sub_sub_tag[0].getElementsByTagName("env:Value");
							_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
						}
					}
				}
			}
			else
			{	// SOAP V1.1
				_valtag = _tag[0].getElementsByTagName("faultcode");
				if( _valtag.length == 0 )
				{
					return null;
				}
				_errinfo["Code"] = _valtag[0].firstChild.nodeValue;

				_tag = _tag[0].getElementsByTagName("detail");
				if( _tag.length != 0 )
				{
					_sub_tag = _tag[0].getElementsByTagName("env:Subcode");
					if( _sub_tag.length != 0 )
					{
						_valtag = _sub_tag[0].getElementsByTagName("env:Value");
						_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

						_sub_sub_tag = _sub_tag[0].getElementsByTagName("env:Subcode");
						if( _sub_sub_tag.length != 0 )
						{
							_valtag = _sub_sub_tag[0].getElementsByTagName("env:Value");
							_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
						}
					}
				}
			}
		}
		else
		{	// SOAP V1.1 or V1.2
			_tag = _xmlobj.getElementsByTagName("Code");
			if( _tag.length == 0 )
			{	// SOAP V1.1 or Not Fault
				_valtag = _tag[0].getElementsByTagName("faultcode");
				if( _valtag.length == 0 )
				{	// Not Fault
					return null;
				}
				_errinfo["Code"] = _valtag[0].firstChild.nodeValue;

				_tag = _tag[0].getElementsByTagName("detail");
				if( _tag.length != 0 )
				{
					_sub_tag = _tag[0].getElementsByTagName("Subcode");
					if( _sub_tag.length != 0 )
					{
						_valtag = _sub_tag[0].getElementsByTagName("Value");
						_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

						_sub_sub_tag = _sub_tag[0].getElementsByTagName("Subcode");
						if( _sub_sub_tag.length != 0 )
						{
							_valtag = _sub_sub_tag[0].getElementsByTagName("Value");
							_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
						}
					}
				}
			}
			else
			{	// SOAP V1.2
				_valtag = _tag[0].getElementsByTagName("Value");
				_errinfo["Code"] = _valtag[0].firstChild.nodeValue;

				_sub_tag = _tag[0].getElementsByTagName("Subcode");
				if( _sub_tag.length != 0 )
				{
					_valtag = _sub_tag[0].getElementsByTagName("Value");
					_errinfo["Subcode"] = _valtag[0].firstChild.nodeValue;

					_sub_sub_tag = _sub_tag[0].getElementsByTagName("Subcode");
					if( _sub_sub_tag.length != 0 )
					{
						_valtag = _sub_sub_tag[0].getElementsByTagName("Value");
						_errinfo["SubSubcode"] = _valtag[0].firstChild.nodeValue;
					}
				}
			}
		}
	}

	return _errinfo;
}


ErrorHandling = function(param) {
	var _isSoapFault = false;
	var _isMessage = false;
	var _description = null;
	
	if (typeof(param) == "string") {
		_isMessage = true;
		_description = param;
	}
	else if (typeof(param) == "object" && param.responseXML) {
		var _info = WebService.GetSoapFaultInfo(param.responseXML);
		
		if (_info) {
			_isSoapFault = true;
			_description = _info;
		}
	}
	
	this.IsSoapFault = function() {
		return _isSoapFault;
	}
	
	this.IsErrorMessage = function() {
		return _isMessage;
	}
	
	this.Description = _description;
}


AnonymousUser = function() {}


var ns = WebServiceReq;
ns.WebService = WebService;
ns.ErrorHandling = ErrorHandling;
ns.AnonymousUser = AnonymousUser;
})();