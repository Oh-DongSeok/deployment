/* 
 * Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.
 *
 * Java Script Library for Apeos Intrgration Plus.
 * ver2.0.2
 */

var JFCreator;
if (!JFCreator) JFCreator = {};
var newLinkageWS;
(function() {

/**
 * abstract class: BaseClass
 */
BaseClass = function(value) {
	this.ToString = function() {
		return value;
	}
}


/**
 * abstract class: BaseClassHasJobFlowValue
 */
BaseClassHasJobFlowValue = function(value) {
	this.ToString = function() {
		return value;
	}
	this.JobFlowValue = value;
}


/**
 * public class: ScanFileTransferInvoke
 */
ScanFileTransferInvoke = function(deviceInfo, requiredParameter, userName, password) {
	if (newLinkageWS) {
		var _jobFlowTemplate = "template/ScanFileTransferInvoke22.xml";
	} else {
		var _jobFlowTemplate = "template/ScanFileTransferInvoke22.xml";
	}
	var _soapTemplate = "template/ExecuteJobTemplate2.xml";
	
	var _userName = userName;
	var _password = password;
	var _hostNameOrIpAddress = "127.0.0.1";
	var _portNumber = "80";
	var _useSSL = false;
	var _jobFlow = null;
	var _success_CB = null;
	var _error_CB = null;
	
	var _deviceInfo = deviceInfo;
	var _header = new Header(requiredParameter.CreatorID, deviceInfo);
	var _invoke = new Invoke(requiredParameter.FileFormat, requiredParameter.ServiceID,
														requiredParameter.WebServiceUrl, requiredParameter.FtpUrl,
														requiredParameter.FtpPhysicalPath, "LinkFileTransfer", requiredParameter.IsTargetLibrary);
	var _message = new Message(requiredParameter.MailAddress, requiredParameter.EnableSendMessage);
	var _fileTransfer = new FileTransfer(requiredParameter.FileFormat, requiredParameter.FtpUrl);
	var _ocr = new OCR(requiredParameter.FileFormat);
	var _scanner = new Scanner(deviceInfo, requiredParameter.FileFormat);
	
	var _self = this;
	
	if (!deviceInfo) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentDeviceInfo.Value);
	}
	if (!requiredParameter) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentRequiredParameter.Value);
	}
	if (!_hostNameOrIpAddress) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentHostNameOrIpAddress.Value);
	}
	if ((_useSSL == null) || (typeof(_useSSL) != "boolean")) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentUseSSL.Value);
	}

	this.WriteTo = function(success_CB, error_CB) {
		_success_CB = success_CB;
		_error_CB = error_CB;
		
		try {
			
			if (_deviceInfo.MachineOID.match(/^1\.3\.6\.1\.4\.1\.297\.1\.11\.93\.1\.35\.20\.\d+\.1$/) != null
				&& _deviceInfo.SoftwareVersion.match(/^1\.\d\.|^1\.4\d\.|^1\.10\d\./) != null) {
				var _jobManager = new JobManager(_userName, _password);
				_jobManager.CheckJobStatus.call(_self, "active", _self.getJobStatus, _error_CB);
			}
			else {
				this.NextLoadTemplate();
			}
		}
		catch (e) {
			_error_CB(e);
		}
	}

	this.getJobStatus = function(req) {
		
		if(req == false) {
			this.NextLoadTemplate();
		}
		else {
			_error_CB(new ErrorHandling(ErrorCode.ProcessingJobError.Value));
		}
	}

	this.NextLoadTemplate = function() {
		try {
			(new JobFlowValidator(this.RequiredParameter.FileFormat, _scanner.ScanParameter, _deviceInfo)).Validate();
			WebServiceReq.WebService.LoadTemplate.call(this, _jobFlowTemplate, this.CreateJobFlow_CB, _error_CB);
		}
		catch (e) {
			_error_CB(e);
		}
	}
		
	this.CreateJobFlow_CB = function(req) {
		_jobFlow = req.responseXML;
		_invoke.UserString = this.UserString;
		_header.ApplicationName = this.ApplicationName;
		_invoke.Authenticate = this.Authenticate;
		_message.Comment = this.Comment;
		_fileTransfer.OperatorName = this.FileTransferOperatorName;
		_fileTransfer.Password = this.FileTransferPassword;
		_invoke.OperatorName = this.InvokeOperatorName;
		_invoke.Password = this.InvokePassword;
		_header.JobFlowName = this.JobFlowName;
		_fileTransfer.Linearize = this.Linearize;
		_ocr.Compression = this.OCRCompression;
		_ocr.Language = this.OCRLanguage;
		_scanner.ScanParameter = this.ScanParameter;
		_message.Subject = this.Subject;
		
		try {
			_header.Write(_jobFlow);
			_scanner.Write(_jobFlow);
			_ocr.Write(_jobFlow);
			_fileTransfer.Write(_jobFlow);
			_invoke.Write(_jobFlow);
			_message.Write(_jobFlow);
			
			WebServiceReq.WebService.LoadTemplate.call(_self, _soapTemplate, _self.CreateSoapMessage_CB, _error_CB);
		}
		catch (e) {
			_error_CB(e);
		}
	}
	
	this.CreateSoapMessage_CB = function(req) {
		var _soap = req.responseXML;
		
		var _jthExt = _jobFlow.getElementsByTagName("JobTemplate")[0];
		var _jthLcl = _soap.getElementsByTagName("JobTemplateHeader")[0];
		var _jth = importNode(_soap, _jthLcl, _jthExt);

		var _jtbLcl = _soap.getElementsByTagName("RawData")[0];
		importNode(_soap, _jtbLcl, _jobFlow.documentElement);

		xmlSerializer = new XMLSerializer();
		_msg = xmlSerializer.serializeToString(_soap);
		
		var _ws = new WebServiceReq.WebService();
		_ws.Host = _hostNameOrIpAddress;
		_ws.Port = _portNumber;
		_ws.UseSSL = _useSSL;
		_ws.CallJobExecService(_userName, _password, _msg, _self.WriteTo_CB, _error_CB);
	}
	
	this.WriteTo_CB = function(req) {
		var _resXML = req.responseXML;
		
		var _jobInfo = new JobInfo();
		var _tag = null;

		this.jt_ns = "http://www.fujifilm.com/fb/2021/03/ssm/management/job";

		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "JobID");
		if (_tag.length > 0) {
			_jobInfo.JobID = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "Status");
		if (_tag.length > 0) {
			_jobInfo.Status = new JobStatus(_tag[0].firstChild.nodeValue);
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "StartTime");
		if (_tag.length > 0) {
			_jobInfo.StartTime = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "CompletedTime");
		if (_tag.length > 0) {
			_jobInfo.CompletedTime = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "User");
		if (_tag.length > 0) {
			_jobInfo.User = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "Name");
		if (_tag.length > 0) {
			_jobInfo.Name = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "FaultReason");
		if (_tag.length > 0) {
			_jobInfo.FaultReason = _tag[0].firstChild.nodeValue;
		}
		
		_success_CB(_jobInfo);
	}
	
	this.ApplicationName = _header.ApplicationName;
	this.Authenticate = _invoke.Authenticate;
	this.Comment = _message.Comment;
	this.FileTransferOperatorName = _fileTransfer.OperatorName;
	this.FileTransferPassword = _fileTransfer.Password;
	this.InvokeOperatorName = _invoke.OperatorName;
	this.InvokePassword = _invoke.Password;
	this.JobFlowName = _header.JobFlowName;
	this.Linearize = _fileTransfer.Linearize;
	this.OCRCompression = _ocr.Compression;
	this.OCRLanguage = _ocr.Language;
	this.RequiredParameter = requiredParameter;
	this.ScanParameter = _scanner.ScanParameter;
	this.Subject = _message.Subject;
	this.UserString = _invoke.UserString;
}


/**
 * public class: ScanInvokeSwA
 */
ScanInvokeSwA = function(deviceInfo, requiredParameter, userName, password) {
	if (newLinkageWS) {
		var _jobFlowTemplate = "template/ScanInvokeSwA22.xml";
	} else {
		var _jobFlowTemplate = "template/ScanInvokeSwA22.xml";
	}

	var _soapTemplate = "template/ExecuteJobTemplate2.xml";
	
	var _userName = userName;
	var _password = password;
	var _hostNameOrIpAddress = "127.0.0.1";
	var _portNumber = "80";
	var _useSSL = false;
	var _jobFlow = null;
	var _success_CB = null;
	var _error_CB = null;
	
	var _deviceInfo = deviceInfo;
	var _header = new Header(requiredParameter.CreatorID, deviceInfo);
	var _scanner = new Scanner(deviceInfo, requiredParameter.FileFormat);
	var _ocr = new OCR(requiredParameter.FileFormat);
	var _invoke = new Invoke(requiredParameter.FileFormat, requiredParameter.ServiceID, requiredParameter.WebServiceUrl, "", "", "LinkSwA", requiredParameter.IsTargetLibrary);
	var _attachment = new Attachment(requiredParameter.FileFormat);
	var _message = new Message(requiredParameter.MailAddress, requiredParameter.EnableSendMessage);
	
	var _self = this;
	
	if (!deviceInfo) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentDeviceInfo.Value);
	}
	if (!requiredParameter) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentRequiredParameter.Value);
	}
	if (!_hostNameOrIpAddress) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentHostNameOrIpAddress.Value);
	}
	if ((_useSSL == null) || (typeof(_useSSL) != "boolean")) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentUseSSL.Value);
	}
	
	this.WriteTo = function(success_CB, error_CB) {
		_success_CB = success_CB;
		_error_CB = error_CB;
		
		try {
			if (_deviceInfo.MachineOID.match(/^1\.3\.6\.1\.4\.1\.297\.1\.11\.93\.1\.35\.20\.\d+\.1$/) != null
				&& _deviceInfo.SoftwareVersion.match(/^1\.\d\.|^1\.4\d\.|^1\.10\d\./) != null) {
				var _jobManager = new JobManager(_userName, _password);
				_jobManager.CheckJobStatus.call(_self, "active", _self.getJobStatus, _error_CB);
			}
			else {
				this.NextLoadTemplate();
			}
		}
		catch (e) {
			_error_CB(e);
		}
	}

	this.getJobStatus = function(req) {
		if(req == false) {
			this.NextLoadTemplate();
		}
		else {
			_error_CB(new ErrorHandling(ErrorCode.ProcessingJobError.Value));
		}
	}
	
	this.NextLoadTemplate = function() {
		try {
			(new JobFlowValidator(this.RequiredParameter.FileFormat, _scanner.ScanParameter, _deviceInfo)).Validate();
			WebServiceReq.WebService.LoadTemplate.call(_self, _jobFlowTemplate, _self.CreateJobFlow_CB, _error_CB);
		}
		catch (e) {
			_error_CB(e);
		}
	}
	
	this.CreateJobFlow_CB = function(req) {
		_jobFlow = req.responseXML;
		_header.ApplicationName = this.ApplicationName;
		_invoke.Authenticate = this.Authenticate;
		_message.Comment = this.Comment;
		_invoke.OperatorName = this.InvokeOperatorName;
		_invoke.Password = this.InvokePassword;
		_header.JobFlowName = this.JobFlowName;
		_attachment.Linearize = this.Linearize;
		_ocr.Compression = this.OCRCompression;
		_ocr.Language = this.OCRLanguage;
		_scanner.ScanParameter = this.ScanParameter;
		_message.Subject = this.Subject;
		_invoke.UserString = this.UserString;
		
		try {
			_header.Write(_jobFlow);
			_scanner.Write(_jobFlow);
			_ocr.Write(_jobFlow);
			_invoke.Write(_jobFlow);
			_attachment.Write(_jobFlow);
			_message.Write(_jobFlow);
			
			WebServiceReq.WebService.LoadTemplate.call(_self, _soapTemplate, _self.CreateSoapMessage_CB, _error_CB);
		}
		catch (e) {
			_error_CB(e);
		}
	}
	
	this.CreateSoapMessage_CB = function(req) {
		var _soap = req.responseXML;
		
		var _jthExt = _jobFlow.getElementsByTagName("JobTemplate")[0];
		var _jthLcl = _soap.getElementsByTagName("JobTemplateHeader")[0];
		var _jth = importNode(_soap, _jthLcl, _jthExt);
		
		var _jtbLcl = _soap.getElementsByTagName("RawData")[0];
		importNode(_soap, _jtbLcl, _jobFlow.documentElement);
		
		var xmlSerializer = new XMLSerializer();
		var _msg = xmlSerializer.serializeToString(_soap);
		
		var _ws = new WebServiceReq.WebService();
		_ws.Host = _hostNameOrIpAddress;
		_ws.Port = _portNumber;
		_ws.UseSSL = _useSSL;
		_ws.CallJobExecService(_userName, _password, _msg, _self.WriteTo_CB, _error_CB);
	}
	
	this.WriteTo_CB = function(req) {
		var _resXML = req.responseXML;
		
		var _jobInfo = new JobInfo();
		var _tag = null;

		this.jt_ns = "http://www.fujifilm.com/fb/2021/03/ssm/management/job";

		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "JobID");
		if (_tag.length > 0) {
			_jobInfo.JobID = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "Status");
		if (_tag.length > 0) {
			_jobInfo.Status = new JobStatus(_tag[0].firstChild.nodeValue);
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "StartTime");
		if (_tag.length > 0) {
			_jobInfo.StartTime = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "CompletedTime");
		if (_tag.length > 0) {
			_jobInfo.CompletedTime = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "User");
		if (_tag.length > 0) {
			_jobInfo.User = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "Name");
		if (_tag.length > 0) {
			_jobInfo.Name = _tag[0].firstChild.nodeValue;
		}
		_tag = _resXML.getElementsByTagNameNS(this.jt_ns, "FaultReason");
		if (_tag.length > 0) {
			_jobInfo.FaultReason = _tag[0].firstChild.nodeValue;
		}		
		_success_CB(_jobInfo);
	}
	
	this.ApplicationName = _header.ApplicationName;
	this.Authenticate = _invoke.Authenticate;
	this.Comment = _message.Comment;
	this.InvokeOperatorName = _invoke.OperatorName;
	this.InvokePassword = _invoke.Password;
	this.JobFlowName = _header.JobFlowName;
	this.Linearize = _attachment.Linearize;
	this.OCRCompression = _ocr.Compression;
	this.OCRLanguage = _ocr.Language;
	this.RequiredParameter = requiredParameter;
	this.ScanParameter = _scanner.ScanParameter;
	this.Subject = _message.Subject;
	this.UserString = _invoke.UserString;
}


/**
 * public class: FtpFolderCreator
 */
FtpFolderCreator = function(userName, password, hostNameOrIpAddress, portNumber, useSSL, webServiceUrl) {
	if (newLinkageWS) {
		var _createTemplate = "template/CreateFolderTemplate2.xml";
	} else {
		var _createTemplate = "template/CreateFolderTemplate.xml";
	}
	if (newLinkageWS) {
		var _deleteTemplate = "template/DeleteFolderTemplate2.xml";
	} else {
		var _deleteTemplate = "template/DeleteFolderTemplate.xml";
	}
	
	var _userName = userName;
	var _password = password;
	var _hostNameOrIpAddress = hostNameOrIpAddress;
	var _portNumber = portNumber;
	var _useSSL = useSSL;
	var _webServiceUrl = webServiceUrl;
	var _ftpPhysicalPath = null;
	var _success_CB = null;
	var _error_CB = null;
	
	var _self = this;
	
	if (!hostNameOrIpAddress) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentHostNameOrIpAddress.Value);
	}
	if ((useSSL == null) || (typeof(useSSL) != "boolean")) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentUseSSL.Value);
	}
	if (!webServiceUrl) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentWebServiceUrl.Value);
	}
	
	this.CreateFolder = function(success_CB, error_CB) {
		_success_CB = success_CB;
		_error_CB = error_CB;
	
		WebServiceReq.WebService.LoadTemplate.call(this, _createTemplate, this.LoadCreateTemplate_CB, _error_CB);
	}
	
	this.DeleteFolder = function(ftpPhysicalPath, success_CB, error_CB) {
		_success_CB = success_CB;
		_error_CB = error_CB;
		_ftpPhysicalPath = ftpPhysicalPath;
		
		WebServiceReq.WebService.LoadTemplate.call(this, _deleteTemplate, this.LoadDeleteTemplate_CB, _error_CB);
	}
	
	this.LoadCreateTemplate_CB = function(req) {		
		if (newLinkageWS) {
			var _soapAction = '"http://www.fujifilm.com/fb/2021/04/aip/library/linkageService/CreateFolder"';
		} else {
			var _soapAction = '"http://www.fujifilm.com/fb/2021/04/aip/library/linkageService/CreateFolder"'; 
		}
		
		var _msg = req.responseText;
		var _ws = new WebService();
		_ws.Host = _hostNameOrIpAddress;
		_ws.Port = _portNumber;
		_ws.UseSSL = _useSSL;
		_ws.CallMgmtService(_webServiceUrl, _userName, _password, _soapAction, _msg, _self.CreateFolder_CB, _error_CB);
	}
	
	this.CreateFolder_CB = function(req) {
		var _xml = req.responseXML;
		var _ftpUrl = null;
		var _ftpPhysicalPath = null;
		if (_xml.getElementsByTagName("FtpUrl").length != 0) {
			_ftpUrl = _xml.getElementsByTagName("FtpUrl")[0].firstChild.nodeValue;
		}
		if (_xml.getElementsByTagName("FtpPhysicalPath").length != 0) {
			_ftpPhysicalPath = _xml.getElementsByTagName("FtpPhysicalPath")[0].firstChild.nodeValue;
		}
		_success_CB(new FtpPath(_ftpUrl, _ftpPhysicalPath));
	}
	
	this.LoadDeleteTemplate_CB = function(req) {
		var _soap = req.responseXML;
		
		var _physicalPathNode = _soap.createTextNode(_ftpPhysicalPath);
		var _targetElement = _soap.getElementsByTagName("ftpPhysicalPath");
		_targetElement[0].appendChild(_physicalPathNode);
		var _xmlSerializer = new XMLSerializer();
		var _msg = _xmlSerializer.serializeToString(_soap);
		if (newLinkageWS) {
			var _soapAction = '"http://www.fujifilm.com/fb/2021/04/aip/library/linkageService/DeleteFolder"';
		} else {
			var _soapAction = '"http://www.fujifilm.com/fb/2021/04/aip/library/linkageService/DeleteFolder"';
		}
		var _ws = new WebServiceReq.WebService();
		_ws.Host = _hostNameOrIpAddress;
		_ws.Port = _portNumber;
		_ws.UseSSL = _useSSL;
		_ws.CallMgmtService(_webServiceUrl, _userName, _password, _soapAction, _msg, _success_CB, _error_CB);
	}
}


/**
 * public class: FileTransferInvokeRequiredParameter
 */
FileTransferInvokeRequiredParameter = 
	function(fileFormat, creatorID, ftpUrl, ftpPhysicalPath, webServiceUrl, serviceID, enableSendMessage, mailAddress) {
	
	if (!fileFormat || typeof(fileFormat) != "object") {
		throw new ErrorHandling(ErrorCode.InvalidArgumentFileFormat.Value);
	}
	if (!creatorID) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentCreatorID.Value);
	}
	if (!ftpUrl) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentFtpUrl.Value);
	}
	if (!ftpPhysicalPath) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentFtpPhysicalPath.Value);
	}
	if (!webServiceUrl) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentWebServiceUrl.Value);
	}
	if (!serviceID) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentServiceID.Value);
	}
	if (enableSendMessage && (!mailAddress)) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentMailAddress.Value);
	}
	
	this.FileFormat = fileFormat;
	this.CreatorID = creatorID;
	this.FtpUrl = ftpUrl;
	this.FtpPhysicalPath = ftpPhysicalPath;
	this.WebServiceUrl = webServiceUrl;
	this.ServiceID = serviceID;
	this.EnableSendMessage = enableSendMessage;
	this.MailAddress = mailAddress;
	this.IsTargetLibrary = true;
}


/**
 * public class: InvokeSwARequiredParameter
 */
InvokeSwARequiredParameter = function(fileFormat, creatorID, webServiceUrl, serviceID, enableSendMessage, mailAddress) {
	if (!fileFormat) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentFileFormat.Value);
	}
	if (!creatorID) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentCreatorID.Value);
	}
	if (!webServiceUrl) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentWebServiceUrl.Value);
	}
	if (!serviceID) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentServiceID.Value);
	}
	if (enableSendMessage && (!mailAddress)) {
		throw new ErrorHandling(ErrorCode.InvalidArgumentMailAddress.Value);
	}
	
	this.CreatorID = creatorID;
	this.EnableSendMessage = enableSendMessage;
	this.FileFormat = fileFormat;
	this.MailAddress = mailAddress;
	this.ServiceID = serviceID;
	this.WebServiceUrl = webServiceUrl;
	this.IsTargetLibrary = true;
}


/**
 * public class: ScanParameter
 */
ScanParameter = function() {
	this.ColorMode = ColorMode.Auto;
	this.Duplex = Duplex.Simplex;
	this.EnableNextOriginal = false;
	this.HeadPosition = HeadPosition.Left;
	this.ImageMode = ImageMode.Mixed;
	this.InputMediumSize = DocumentSize.Auto;
	this.Magnification = Magnification.ToObject(100);
	this.OutputMediumSize = DocumentSize.NotSpecified;
	this.Resolution = Resolution.Dpi200x200;
	this.WithThumbnails = null;
	this.Bilevel = null;
	this.Darkness = null;
	this.LossyLevel = null;
	this.Multilevel = null;
}


/**
 * public class: ExScanParameter
 */
ExScanParameter = function() {
	this.Parameters = new Object();
}

ExScanParameter.prototype.SetParameter = function(str) {
	
	if (!str) {
		return false;
	}
	
	var _resGraterThan = str.match(/>/g);
	var _graterThanCount = _resGraterThan ? _resGraterThan.length : -1;
	
	var _resLessThan = str.match(/</g);
	var _lessThanCount = _resLessThan ? _resLessThan.length : -1;
	
	if ((_graterThanCount == -1) || (_lessThanCount == -1) || (_graterThanCount != _lessThanCount)) {
		return false;
	}
	
	var _matches = str.match(/^<(([^0-9-][\w-]+:)?([^0-9-][\w-]+))\/?/);
	if ((_matches) && (_matches.length != 0)) {
		var _resFirstTagName = _matches[1];
	} else {
		return false;
	}
	
	_matches = str.match(/<\/?(([^0-9-][\w-]+:)?([^0-9-][\w-]+))([^>]*)\/?>$/);
	if ((_matches) && (_matches.length != 0)) {
		var _resLastTagName = _matches[1];
	} else {
		return false;
	}
	
	if (!_resFirstTagName || !_resLastTagName || (_resFirstTagName != _resLastTagName)) {
		return false;
	}
	
	this.Parameters[_resFirstTagName] = str;
	
	return true;
}

ExScanParameter.prototype.ClearParameter = function() {
	this.Parameters = new Object();
}


/**
 * public class: Authenticate
 */
Authenticate = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

Authenticate.prototype = new BaseClassHasJobFlowValue()

Authenticate.Rfc2617 = new Authenticate("Rfc2617");
Authenticate.Unauthenticated = new Authenticate("Unauthenticated");


/**
 * public class: Bilevel
 */
Bilevel = function(value) {
	BaseClass.call(this, value);
}

Bilevel.prototype = new BaseClass();

Bilevel.Auto = new Bilevel("Auto");
Bilevel.Default = new Bilevel("Default");
Bilevel.JBIG2A = new Bilevel("JBIG2A");
Bilevel.JBIG2H = new Bilevel("JBIG2H");
Bilevel.MH = new Bilevel("MH");
Bilevel.MMR = new Bilevel("MMR");

Bilevel.ValueOf = function(value) {
	switch(trim(value).toLowerCase()) {
		case "default":
			return Bilevel.Default;
		case "mh":
			return Bilevel.MH;
		case "mmr":
			return Bilevel.MMR;
		case "jbig2a":
			return Bilevel.JBIG2A;
		case "jbig2h":
			return Bilevel.JBIG2H;
		default:
			return Bilevel.Auto;
	}
}


/**
 * public class: ColorMode
 */
ColorMode = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

ColorMode.prototype = new BaseClassHasJobFlowValue();

ColorMode.Auto = new ColorMode("Auto");
ColorMode.BlackAndWhite = new ColorMode("BlackAndWhite");
ColorMode.FullColor = new ColorMode("FullColor");
ColorMode.Grayscale = new ColorMode("Grayscale");


/**
 * public class: Darkness
 */
Darkness = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

Darkness.prototype = new BaseClassHasJobFlowValue();

Darkness.D100 = new Darkness("100");
Darkness.D30 = new Darkness("30");
Darkness.D60 = new Darkness("60");
Darkness.Default = new Darkness("Default");
Darkness.L100 = new Darkness("-100");
Darkness.L30 = new Darkness("-30");
Darkness.L60 = new Darkness("-60");
Darkness.Medium = new Darkness("0");

Darkness.ValueOf = function(d) {
	if (d > 80) {
		return Darkness.D100;
	}
	if (d > 0x2d) {
		return Darkness.D60;
	}
	if (d > 15) {
		return Darkness.D30;
	}
	if (d >= -15) {
		return Darkness.Medium;
	}
	if (d >= -45) {
		return Darkness.L30;
	}
	if (d >= -80) {
		return Darkness.L60;
	}
	return Darkness.L100;
}


/**
 * public class: DocumentSize
 */
DocumentSize = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

DocumentSize.prototype = new BaseClassHasJobFlowValue();

DocumentSize.Auto = new DocumentSize("Auto");
DocumentSize.ISO_A3LEF = new DocumentSize("ISO-A3LEF");
DocumentSize.ISO_A3SEF = new DocumentSize("ISO-A3SEF");
DocumentSize.ISO_A4LEF = new DocumentSize("ISO-A4LEF");
DocumentSize.ISO_A4SEF = new DocumentSize("ISO-A4SEF");
DocumentSize.ISO_A5LEF = new DocumentSize("ISO-A5LEF");
DocumentSize.ISO_A5SEF = new DocumentSize("ISO-A5SEF");
DocumentSize.ISO_A6LEF = new DocumentSize("ISO-A6LEF");
DocumentSize.ISO_A6SEF = new DocumentSize("ISO-A6SEF");
DocumentSize.ISO_B4LEF = new DocumentSize("ISO-B4LEF");
DocumentSize.ISO_B4SEF = new DocumentSize("ISO-B4SEF");
DocumentSize.ISO_B5LEF = new DocumentSize("ISO-B5LEF");
DocumentSize.ISO_B5SEF = new DocumentSize("ISO-B5SEF");
DocumentSize.JIS_B4LEF = new DocumentSize("JIS-B4LEF");
DocumentSize.JIS_B4SEF = new DocumentSize("JIS-B4SEF");
DocumentSize.JIS_B5LEF = new DocumentSize("JIS-B5LEF");
DocumentSize.JIS_B5SEF = new DocumentSize("JIS-B5SEF");
DocumentSize.JIS_B6LEF = new DocumentSize("JIS-B6LEF");
DocumentSize.JIS_B6SEF = new DocumentSize("JIS-B6SEF");
DocumentSize.JP_PostCard_LEF = new DocumentSize("JP-PostCardLEF");
DocumentSize.JP_PostCard_SEF = new DocumentSize("JP-PostCardSEF");
DocumentSize.Ledger_LEF = new DocumentSize("NA-11x17LEF");
DocumentSize.Ledger_SEF = new DocumentSize("NA-11x17SEF");
DocumentSize.Legal_LEF = new DocumentSize("NA-8.5x14LEF");
DocumentSize.Legal_SEF = new DocumentSize("NA-8.5x14SEF");
DocumentSize.Folio_LEF = new DocumentSize("NA-8.5x13LEF");
DocumentSize.Folio_SEF = new DocumentSize("NA-8.5x13SEF");
DocumentSize.Letter_LEF = new DocumentSize("NA-8.5x11LEF");
DocumentSize.Letter_SEF = new DocumentSize("NA-8.5x11SEF");
DocumentSize.Mixed = new DocumentSize("Mixed");
DocumentSize.NotSpecified = new DocumentSize("NotSpecified");
DocumentSize.CN_16KaiLEF = new DocumentSize("CN-16KaiLEF");
DocumentSize.CN_16KaiSEF = new DocumentSize("CN-16KaiSEF");
DocumentSize.CN_8KaiLEF = new DocumentSize("CN-8KaiLEF");
DocumentSize.CN_8KaiSEF = new DocumentSize("CN-8KaiSEF");
DocumentSize.TW_16KaiLEF = new DocumentSize("TW-16KaiLEF");
DocumentSize.TW_16KaiSEF = new DocumentSize("TW-16KaiSEF");
DocumentSize.TW_8KaiLEF = new DocumentSize("TW-8KaiLEF");
DocumentSize.TW_8KaiSEF = new DocumentSize("TW-8KaiSEF");
DocumentSize.PictureL_LEF = new DocumentSize("NA-3.5x5LEF");
DocumentSize.PictureL_SEF = new DocumentSize("NA-3.5x5SEF");
DocumentSize.Postcard_LEF = new DocumentSize("NA-3.5x5.5LEF");
DocumentSize.Postcard_SEF = new DocumentSize("NA-3.5x5.5SEF");
DocumentSize.US_Postcard_LEF = new DocumentSize("NA-4x6LEF");
DocumentSize.US_Postcard_SEF = new DocumentSize("NA-4x6SEF");
DocumentSize.Picture2L_LEF = new DocumentSize("NA-5x7LEF");
DocumentSize.Picture2L_SEF = new DocumentSize("NA-5x7SEF");
DocumentSize.Statement_Invoice_LEF = new DocumentSize("NA-5.5x8.5LEF");
DocumentSize.Statement_Invoice_SEF = new DocumentSize("NA-5.5x8.5SEF");
DocumentSize.Postcard6x9_LEF = new DocumentSize("NA-6x9LEF");
DocumentSize.Postcard6x9_SEF = new DocumentSize("NA-6x9SEF");
DocumentSize.Executive_LEF = new DocumentSize("NA-7.25x10.5LEF");
DocumentSize.Executive_SEF = new DocumentSize("NA-7.25x10.5SEF");
DocumentSize.NA_8x10_LEF = new DocumentSize("NA-8x10LEF");
DocumentSize.NA_8x10_SEF = new DocumentSize("NA-8x10SEF");
DocumentSize.Spanish_Folio_LEF = new DocumentSize("NA-8.46x12.4LEF");
DocumentSize.Spanish_Folio_SEF = new DocumentSize("NA-8.46x12.4SEF");
DocumentSize.UK_11x15_LEF = new DocumentSize("UK-11x15LEF");
DocumentSize.UK_11x15_SEF = new DocumentSize("UK-11x15SEF");

DocumentSize.A4Cover_LEF = new DocumentSize("A4CoverLEF");
DocumentSize.A4Cover_SEF = new DocumentSize("A4CoverSEF");
DocumentSize.LetterCover_LEF = new DocumentSize("LetterCoverLEF");
DocumentSize.LetterCover_SEF = new DocumentSize("LetterCoverSEF");



/**
 * public class: Duplex
 */
Duplex = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

Duplex.prototype = new BaseClassHasJobFlowValue();

Duplex.Default = new Duplex("Default");
Duplex.Duplex = new Duplex("Duplex");
Duplex.Simplex = new Duplex("Simplex");
Duplex.Tumble = new Duplex("Tumble");


/**
 * public class: ErrorCode
 */
ErrorCode = function(value) {
	this.Value = value;
}

ErrorCode.InvalidArgumentCreatorID = new ErrorCode("InvalidArgumentCreatorID");
ErrorCode.InvalidArgumentDeviceInfo = new ErrorCode("InvalidArgumentDeviceInfo");
ErrorCode.InvalidArgumentFileFormat = new ErrorCode("InvalidArgumentFileFormat");
ErrorCode.InvalidArgumentFtpPhysicalPath = new ErrorCode("InvalidArgumentFtpPhysicalPath");
ErrorCode.InvalidArgumentFtpUrl = new ErrorCode("InvalidArgumentFtpUrl");
ErrorCode.InvalidArgumentHostNameOrIpAddress = new ErrorCode("InvalidArgumentHostNameOrIpAddress");
ErrorCode.InvalidArgumentMailAddress = new ErrorCode("InvalidArgumentMailAddress");
ErrorCode.InvalidArgumentRequiredParameter = new ErrorCode("InvalidArgumentRequiredParameter");
ErrorCode.InvalidArgumentServiceID = new ErrorCode("InvalidArgumentServiceID");
ErrorCode.InvalidArgumentUseSSL = new ErrorCode("InvalidArgumentUseSSL");
ErrorCode.InvalidArgumentWebServiceUrl = new ErrorCode("InvalidArgumentWebServiceUrl");
ErrorCode.InvalidApplicationNameLength = new ErrorCode("InvalidApplicationNameLength");
ErrorCode.InvalidCommentLength = new ErrorCode("InvalidCommentLength");
ErrorCode.InvalidHighCompressionColorMode = new ErrorCode("InvalidHighCompressionColorMode");
ErrorCode.InvalidHighCompressionOrOCRMagnification = new ErrorCode("InvalidHighCompressionOrOCRMagnification");
ErrorCode.InvalidHighCompressionResolution = new ErrorCode("InvalidHighCompressionResolution");
ErrorCode.InvalidInputMediumSize = new ErrorCode("InvalidInputMediumSize");
ErrorCode.InvalidJobFlowName = new ErrorCode("InvalidJobFlowName");
ErrorCode.InvalidJobFlowNameLength = new ErrorCode("InvalidJobFlowNameLength");
ErrorCode.InvalidOCRImageMode = new ErrorCode("InvalidOCRImageMode");
ErrorCode.InvalidOCRResolution = new ErrorCode("InvalidOCRResolution");
ErrorCode.InvalidOperatorNameLength = new ErrorCode("InvalidOperatorNameLength");
ErrorCode.InvalidOutPutDocumentSize = new ErrorCode("InvalidOutPutDocumentSize");
ErrorCode.InvalidAuthenticate = new ErrorCode("InvalidAuthenticate");
ErrorCode.InvalidPasswordLength = new ErrorCode("InvalidPasswordLength");
ErrorCode.InvalidScannerColorMode = new ErrorCode("InvalidScannerColorMode");
ErrorCode.InvalidSubjectLength = new ErrorCode("InvalidSubjectLength");
ErrorCode.ScannerCompressionNotSupported = new ErrorCode("ScannerCompressionNotSupported");
ErrorCode.ThumbnailsNotAvailable = new ErrorCode("ThumbnailsNotAvailable");
ErrorCode.UnsupportFileFormat = new ErrorCode("UnsupportFileFormat");
ErrorCode.ProcessingJobError = new ErrorCode("ProcessingJobError");


/**
 * public class: FileFormat
 */
FileFormat = function(stringValue, jobFlowValue) {
	this.ToString = function() {
		return stringValue;
	}
	this.JobFlowValue = jobFlowValue;
}

FileFormat.prototype = {
	IsHighCompressionFormat: function() {
		return this == FileFormat.High_Compression_XPS
			|| this == FileFormat.High_Compression_DocuWorks
			|| this == FileFormat.High_Compression_PDF
			|| this == FileFormat.High_Compression_PDFA
			|| this == FileFormat.High_Compression_OCR_DocuWorks
			|| this == FileFormat.High_Compression_OCR_PDF
			|| this == FileFormat.High_Compression_OCR_PDFA;
	},
	
	IsOCRFormat: function() {
		return this == FileFormat.OCR_PDF
			|| this == FileFormat.High_Compression_OCR_PDF
			|| this == FileFormat.OCR_PDFA
			|| this == FileFormat.High_Compression_OCR_PDFA
			|| this == FileFormat.OCR_DocuWorks
			|| this == FileFormat.High_Compression_OCR_DocuWorks;
	}
}

FileFormat.DocuWorks = new FileFormat("DocuWorks", "DocuWorks");
FileFormat.High_Compression_DocuWorks = new FileFormat("High_Compression_DocuWorks", "DocuWorks");
FileFormat.High_Compression_OCR_DocuWorks = new FileFormat("High_Compression_OCR_DocuWorks", "DocuWorks");
FileFormat.High_Compression_OCR_PDF = new FileFormat("High_Compression_OCR_PDF", "PDF");
FileFormat.High_Compression_OCR_PDFA = new FileFormat("High_Compression_OCR_PDFA", "PDF/A");
FileFormat.High_Compression_PDF = new FileFormat("High_Compression_PDF", "PDF");
FileFormat.High_Compression_PDFA = new FileFormat("High_Compression_PDFA", "PDF/A");
FileFormat.High_Compression_XPS = new FileFormat("High_Compression_XPS", "XPS");
FileFormat.NotSpecified = new FileFormat("NotSpecified", "NotSpecified");
FileFormat.OCR_DocuWorks = new FileFormat("OCR_DocuWorks", "DocuWorks");
FileFormat.OCR_PDF = new FileFormat("OCR_PDF", "PDF");
FileFormat.OCR_PDFA = new FileFormat("OCR_PDFA", "PDF/A");
FileFormat.PDF = new FileFormat("PDF", "PDF");
FileFormat.PDFA = new FileFormat("PDFA", "PDF/A");
FileFormat.TIFF_FX = new FileFormat("TIFF/FX", "TIFF/FX");
FileFormat.TIFF_Multi = new FileFormat("TIFF/Multi", "TIFF/Multi");
FileFormat.TIFF_Single = new FileFormat("TIFF/Single", "TIFF/Single");
FileFormat.XPS = new FileFormat("XPS", "XPS");


/**
 * public class: FtpPath
 */
FtpPath = function(ftpUrl, ftpPhysicalPath) {
	this.FtpPhysicalPath = ftpPhysicalPath;
	this.FtpUrl = ftpUrl;
}


/**
 * public class: HeadPosition
 */
HeadPosition = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

HeadPosition.prototype = new BaseClassHasJobFlowValue();

HeadPosition.Left = new HeadPosition("Left");
HeadPosition.Top = new HeadPosition("Top");
HeadPosition.Default = new HeadPosition("Default");


/**
 * public class: ImageMode
 */
ImageMode = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

ImageMode.prototype = new BaseClassHasJobFlowValue();

ImageMode.Default = new ImageMode("Default");
ImageMode.Halftone = new ImageMode("Halftone");
ImageMode.Mixed = new ImageMode("Mixed");
ImageMode.Text = new ImageMode("Text");


/**
 * public class: Linearize
 */
Linearize = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

Linearize.prototype = new BaseClassHasJobFlowValue();

Linearize.Default = new Linearize("Default");
Linearize.False = new Linearize("false");
Linearize.True = new Linearize("true");


/**
 * public class: LossyLevel
 */
LossyLevel = function(level) {
	this.ToString = function() {
		return level;
	}
}

LossyLevel.ValueOf = function(l) {
	if (l > 80) {
		return LossyLevel.L100;
	}
	if (l > 60) {
		return LossyLevel.L70;
	}
	if (l > 40) {
		return LossyLevel.L50;
	}
	if (l > 20) {
		return LossyLevel.L30;
	}
	return LossyLevel.L0;
}

LossyLevel.Default = new LossyLevel("Default");
LossyLevel.L0 = new LossyLevel("0");
LossyLevel.L30 = new LossyLevel("30");
LossyLevel.L50 = new LossyLevel("50");
LossyLevel.L70 = new LossyLevel("70");
LossyLevel.L100 = new LossyLevel("100");


/**
 * public class: Magnification
 */
Magnification = function(value) {
	var _value = null;
	
	if ("number" == typeof(value)) {
		_value = Parse(value);
	}
	else {
		_value = value;
	}
	
	this.ToString = function() {
		return _value;
	}
	
	function Parse(val) {
		var _str = String(val);
		var _num = 0x19;
		var _num2 = 400;
		if ((_num > val) || (val > _num2)) {
			throw "Argument Exception: UnsupportMagnificationRange";
		}
		if ((_str.search(/\./) > 0) && ((_str.length - _str.indexOf(".")) != 2)) {
			throw "Argument Exception: UnsupportMagnificationRange";
		}
		return _str;
	}
}

Magnification.ToObject = function(value) {
	return new Magnification(value);
}

Magnification.Auto = new Magnification("Auto");


/**
 * public class: Multilevel
 */
Multilevel = function(value) {
	BaseClass.call(this, value);
}

Multilevel.ValueOf = function(value) {
	switch (trim(value).toLowerCase()) {
		case "jpeg":
			return Multilevel.JPEG;
		case "flate_jpeg":
			return Multilevel.FLATE_JPEG;
		default:
			return Multilevel.Default;
	}
}

Multilevel.Default = new Multilevel("Default");
Multilevel.FLATE_JPEG = new Multilevel("FLATE_JPEG");
Multilevel.JPEG = new Multilevel("JPEG");


/**
 * public class: OCRCompression
 */
OCRCompression = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

OCRCompression.prototype = new BaseClassHasJobFlowValue();

OCRCompression.Default = new OCRCompression("default");
OCRCompression.None = new OCRCompression("none");
OCRCompression.System = new OCRCompression("system");


/**
 * public class: OCRLanguage
 */
OCRLanguage = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

OCRLanguage.prototype = new BaseClassHasJobFlowValue();

OCRLanguage.EN = new OCRLanguage("en");
OCRLanguage.JA = new OCRLanguage("ja");
OCRLanguage.KO = new OCRLanguage("ko");
OCRLanguage.ZH_CN = new OCRLanguage("zh-cn");
OCRLanguage.ZH_TW = new OCRLanguage("zh-tw");


/**
 * public class: Resolution
 */
Resolution = function(value) {
	BaseClassHasJobFlowValue.call(this, value);
}

Resolution.prototype = new BaseClassHasJobFlowValue();

Resolution.Dpi200x200 = new Resolution("200x200/dpi");
Resolution.Dpi300x300 = new Resolution("300x300/dpi");
Resolution.Dpi400x400 = new Resolution("400x400/dpi");
Resolution.Dpi600x600 = new Resolution("600x600/dpi");


/**
 * internal class: Attachment
 */
Attachment = function(fileFormat) {
	var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:Prototype/jt:Attachment";
	var _serialization = new Serialization(_xpath, fileFormat);
	
	this.Write = function(document) {
		_serialization.Linearize = this.Linearize;
		_serialization.WriteSerialization(document);
	}
	this.Linearize = _serialization.Linearize;
}


/**
 * internal class: FileTransfer
 */
FileTransfer = function(fileFormat, ftpUrl) {
	var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Distribute";
	var _serialization = new Serialization(_xpath, fileFormat);
	this.FileFormat = fileFormat;
	this.FtpUrl = ftpUrl;
	this.Linearize = _serialization.Linearize;
	this.OperatorName = "Anonymous";
	this.Password = "";
	this.Serialization = _serialization;
}

FileTransfer.prototype = {
	Validate: function() {
		if (!this.ValidateOperatorName()) {
			throw new ErrorHandling(ErrorCode.InvalidOperatorNameLength.Value);
		}
		if (!this.ValidatePassword()) {
			throw new ErrorHandling(ErrorCode.InvalidPasswordLength.Value);
		}
	},
	
	ValidateOperatorName: function() {
		return (this.OperatorName.length <= 0x10);
	},
	
	ValidatePassword: function() {
		return (this.Password.length <= 0x10);
	},
	
	Write: function(document) {
		this.Serialization.Linearize = this.Linearize;
		
		this.Validate();
		this.Serialization.WriteSerialization(document);
		this.WriteFTPUrl(document);
		this.WriteAuthInfo(document);
	},
	
	WriteAuthInfo: function(document) {
		var _xpathName = "//jt:ProcessRequest/jt:DocumentProcess/jt:Distribute/jt:Destinations/jt:FileTransfer/jt:AuthInfo/jt:OperatorName";
		var _xpathPass = "//jt:ProcessRequest/jt:DocumentProcess/jt:Distribute/jt:Destinations/jt:FileTransfer/jt:AuthInfo/jt:Password";
		var _node = JFScriptOperator.GetNode(document, _xpathName);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.OperatorName);
		}
		
		_node = JFScriptOperator.GetNode(document, _xpathPass);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.Password);
		}
	},
	
	WriteFTPUrl: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Distribute/jt:Destinations/jt:FileTransfer/jt:Repository";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.FtpUrl);
		}
	}
}


/**
 * internal class: Header
 */
Header = function(creatorID, deviceInfo) {
	this.ApplicationName = "UserApplication";
	this.CreatorID = creatorID;
	this.JobFlowName = "ExtWebLibJobFlow";
	this.DeviceInfo = deviceInfo;
}

Header.prototype = {
	DeleteColorResource: function(document) {
		if (!this.DeviceInfo.IsSupportScanColorMode(DeviceColorMode.FullColor) && !this.DeviceInfo.IsSupportScanColorMode(DeviceColorMode.GrayScale)) {
			var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate/jt:ExecutionHints/jt:Resources/jt:Resource[.='Acquire/Scanner/Color']";
			var _oldChild = JFScriptOperator.GetNode(document, _xpath);
			if (_oldChild) {
				_oldChild.parentNode.removeChild(_oldChild);
			}
		}
	},

	GetModificationDateTime: function() {
		var _nowdate = new Date();
		var _year = _nowdate.getFullYear();
		var _mon = _nowdate.getMonth() + 1;
		var _day = _nowdate.getDate();
		var _hour = _nowdate.getHours();
		var _min  = _nowdate.getMinutes();
		var _sec  = _nowdate.getSeconds();
		if (_mon < 10) { _mon = "0" + _mon; }
		if (_day < 10) { _day = "0" + _day; }
		if (_hour < 10) { _hour = "0" + _hour; }
		if (_min < 10) { _min = "0" + _min; }
		if (_sec < 10) { _sec = "0" + _sec; }
		var _str = _year + "-" + _mon + "-" + _day + "T" + _hour + ":" + _min + ":" + _sec;
		var _timeDiff = _nowdate.getTimezoneOffset();
		var _timeDiff_abs = Math.abs(_timeDiff);
		var _str2 = "-";
		if (_timeDiff >= 0) { _str2 = "-"; }
		var _timeDiff_min = _timeDiff_abs % 60;
		var _timeDiff_hour = (_timeDiff_abs-_timeDiff_min) / 60;
		if (_timeDiff_hour < 10) { _timeDiff_hour = "0" + _timeDiff_hour; }
		if (_timeDiff_min < 10) { _timeDiff_min = "0" + _timeDiff_min; }
		var _str3 = _timeDiff_hour + ":" + _timeDiff_min;
		
		return (_str + _str2 + _str3);
	},

	ValidateApplicationNameLength: function() {
		return (this.ApplicationName.length <= 50);
	},

	ValidateName: function() {
		return (this.JobFlowName.search(/^[ -~]+$/) != -1);
	},
	
	ValidateNameLength: function() {
		return (this.JobFlowName.length <= 50);
	},

	Write: function(document) {
		if (!this.ValidateName()) {
			throw new ErrorHandling(ErrorCode.InvalidJobFlowName.Value);
		}
		if (!this.ValidateNameLength()) {
			throw new ErrorHandling(ErrorCode.InvalidJobFlowNameLength.Value);
		}
		if (!this.ValidateApplicationNameLength()) {
			throw new ErrorHandling(ErrorCode.InvalidApplicationNameLength.Value);
		}
		this.DeleteColorResource(document);
		this.WriteModificationDateTime(document);
		this.WriteJFScriptVersion(document);
		this.WriteJFName(document);
		this.WriteCreatorID(document);
		this.WriteApplicationName(document);
	},

	WriteApplicationName: function(document) {
		var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate/jt:CreatedBy";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ApplicationName);
		}
	},
	
	WriteCreatorID: function(document) {
		var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate/jt:CreatedBy[@jt:identifier]";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var _namedItem = _node.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "identifier");
			if (_namedItem) {
				_namedItem.Value = this.CreatorID;
			}
		}
	},
	
	WriteJFName: function(document) {
		var _nowdate = new Date();
		var _year = _nowdate.getFullYear();
		var _mon = _nowdate.getMonth() + 1;
		var _day = _nowdate.getDate();
		var _hour = _nowdate.getHours();
		var _min  = _nowdate.getMinutes();
		var _sec  = _nowdate.getSeconds();
		if (_mon < 10) { _mon = "0" + _mon; }
		if (_day < 10) { _day = "0" + _day; }
		if (_hour < 10) { _hour = "0" + _hour; }
		if (_min < 10) { _min = "0" + _min; }
		if (_sec < 10) { _sec = "0" + _sec; }
		var _nowStr = _year + _mon + _day + _hour + _min + _sec;
		
		var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate//jt:Name";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.JobFlowName + _nowStr);
		}
	},
	
	WriteJFScriptVersion: function(document) {
		var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var _namedItem = _node.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "version");
			if (_namedItem) {
				_namedItem.Value = this.DeviceInfo.SJFI;
			}
		}
	},
	
	WriteModificationDateTime: function(document) {
		var _xpath = "//soapENV:Envelope/soapENV:Header/jt:JobTemplate/jt:ModificationDateTime";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.GetModificationDateTime());
		}
	}
}


/**
 * internal class: Invoke
 */
Invoke = function(fileFormat, serviceID, webServiceUrl, ftpUrl, ftpPhysicalPath, webMethodName, isTargetLibrary) {
	this.Authenticate = Authenticate.Unauthenticated;
	this.FileFormat = fileFormat;
	this.FtpPhysicalPath = ftpPhysicalPath;
	this.FtpUrl = ftpUrl;
	this.OperatorName = "";
	this.Password = "";
	this.ServiceID = serviceID;
	this.UserString = "";
	this.WebServiceUrl = webServiceUrl;
	this.WebMethodName = webMethodName;
	this.IsTargetLibrary = isTargetLibrary;
}

Invoke.prototype = {
	ValidateAuthenticate: function() {
		return true;
	},
	
	ValidateOperatorName: function() {
		return (this.OperatorName.length <= 0x10);
	},
	
	ValidatePassword: function() {
		return (this.Password.length <= 0x10);
	},
	
	Write: function(document) {
		this.WriteServiceID(document);
		this.WriteTarget(document);
		this.WriteLocation(document);
		this.WriteAuthInfo(document);
		this.WriteParam(document);
	},
	
	WriteAuthInfo: function(document) {
		
		if (!this.ValidateAuthenticate()) {
			throw new ErrorHandling(ErrorCode.InvalidAuthenticate.Value);
		}
		if (!this.ValidateOperatorName()) {
			throw new ErrorHandling(ErrorCode.InvalidOperatorNameLength.Value);
		}
		if (!this.ValidatePassword()) {
			throw new ErrorHandling(ErrorCode.InvalidPasswordLength.Value);
		}
		
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:AuthInfo/jt:Method";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			if (this.Authenticate == Authenticate.Rfc2617) {
				var elem = new CompInnerText(_node);
				elem.set(this.Authenticate.JobFlowValue);
				this.WriteOperatorName(document);
				this.WritePassword(document);
			}
		}
	},
	
	WriteFileFormat: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:Prototype/jt:Message//ls:" + this.WebMethodName + "/ls:param/ls:FileFormat";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.FileFormat.JobFlowValue);
		}
	},
	
	WriteFtpPhysicalPath: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:Prototype/jt:Message//ls:" + this.WebMethodName + "/ls:param/ls:FtpPhysicalPath";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set((new Base64()).encode(this.FtpPhysicalPath.replace(/\\/g, "\\\\")));
		}
	},
	
	WriteFtpUrl: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:Prototype/jt:Message//ls:" + this.WebMethodName + "/ls:param/ls:FtpUrl";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set((new Base64()).encode(this.FtpUrl));
		}
	},
	
	WriteLocation: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Profile/jt:Schema/jt:Location";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			if (this.IsTargetLibrary == true) {
				elem.set(combinePath(this.WebServiceUrl, "LinkageService.asmx?WSDL"));
			} else {
				elem.set(this.WebServiceUrl.replace(/\/$/, "") + "?WSDL");
			}
		}
	},
	
	WriteOperatorName: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:AuthInfo/jt:OperatorName";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.OperatorName);
		}
	},
	
	WriteParam: function(document) {
		this.WriteUserString(document);
		this.WriteFileFormat(document);
		this.WriteFtpUrl(document);
		this.WriteFtpPhysicalPath(document);
	},
	
	WritePassword: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:AuthInfo/jt:Password";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.Password);
		}
	},
	
	WriteServiceID: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Profile/jt:Description[@jt:identifier]";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var _namedItem = _node.attributes.getNamedItem("identifier");
			if (_namedItem) {
				_namedItem.Value = this.ServiceID;
			}
		}
	},
	
	WriteTarget: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Profile/jt:Target";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			if (this.IsTargetLibrary) {
				elem.set(combinePath(this.WebServiceUrl, "LinkageService.asmx"));
			} else {
				elem.set(this.WebServiceUrl);
			}
		}
	},
	
	WriteUserString: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Invoke/jt:Request/jt:Prototype/jt:Message//ls:" + this.WebMethodName + "/ls:param/ls:UserString";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set((new Base64()).encode(this.UserString));
		}
	}
}


/**
 * internal class: JFScriptOperator
 */
JFScriptOperator = function() {}

JFScriptOperator.GetNode = function(document, xpath) {
	var PATH_DESCENDANT = "//";
	var PATH_CHILD = "/";
	var PREDICATE_TYPE_ATTRIBUTE = "@";
	var PREDICATE_TYPE_SELF = ".";
	var PREDICATE_START = "[";
	var PREDICATE_END = "]";
	var OPERATOR = "=";
	
	var _tokens = xpath.match(/\/\/|((?![0-9-])[\w-]+:)?(?![0-9-])[\w-]+|"[^"]*"|'[^']*'|./g);
	
	var _steps = _getSteps(_tokens);
	
	var _targetNodes = new Array();
	
	_targetNodes[0] = document;
	
	for (m = 0; m < _steps.length; m++) {
		_targetNodes = _getTargetNodes(_targetNodes, _steps[m]);
	}
	
	if (_targetNodes.length == 0) {
		return null;
	}
	else {
		return _targetNodes[0];
	}
	
	
	function _getSteps(tokens) {
		var _index = 0;
		var _steps = new Array();
		
		var _step = _createStep();
		
		while (tokens[_index]) {
			_step = _setToken(tokens[_index], _step);
			
			if (_checkNextToken(tokens, _index)) {
				_steps[_steps.length] = _step;
				_step = _createStep();
			}
			
			_index++;
		}
		
		return _steps;
		
		function _createStep() {
			var _step = new Object();
			
			_step["PATH"] = null;
			_step["NODE_TEST"] = null;
			_step["PREDICATE_TYPE"] = null;
			_step["PREDICATE_KEY"] = null;
			_step["PREDICATE_VALUE"] = null;
			
			return _step;
		}
		
		function _setToken(token, step) {
			switch(token) {
				case PATH_DESCENDANT:
				case PATH_CHILD:
					step["PATH"] = token;
					break;
				case PREDICATE_TYPE_ATTRIBUTE:
				case PREDICATE_TYPE_SELF:
					step["PREDICATE_TYPE"] = token;
					break;
				case PREDICATE_START:
				case PREDICATE_END:
				case OPERATOR:
					break;
				default:
					if (!step["PREDICATE_TYPE"]) {
						step["NODE_TEST"] = token.replace(/'/g, "");
					}
					else if (!step["PREDICATE_VALUE"]) {
						step["PREDICATE_VALUE"] = token.replace(/'/g, "");
					}
					else {
						step["PREDICATE_KEY"] = step["PREDICATE_VALUE"];
						step["PREDICATE_VALUE"] = token.replace(/'/g, "");
					}
			}
			return step;
		}
		
		function _checkNextToken(tokens, index) {
			return (((index + 1) == tokens.length) || (tokens[index + 1] == PATH_DESCENDANT) || (tokens[index + 1] == PATH_CHILD));
		}
	}
	
	function _getTargetNodes(targetNodes, step) {
		var _resultNodes = new Array();

		if (step["PATH"] == PATH_DESCENDANT) {
			for (i = 0; i < targetNodes.length; i++) {
				var _getNodes = targetNodes[i].getElementsByTagName(_removePrefix(step["NODE_TEST"]));
				for (j = 0; j < _getNodes.length; j++) {
					if (_checkPredicate(_getNodes[j], step)) {
						_resultNodes[_resultNodes.length] = _getNodes[j];
					}
				}
			}
		}
		else {
			for (k = 0; k < targetNodes.length; k++) {
				for (l = 0; l < targetNodes[k].childNodes.length; l++) {
					if (targetNodes[k].childNodes[l].nodeName == step["NODE_TEST"]) {
						if (_checkPredicate(targetNodes[k].childNodes[l], step)) {
							_resultNodes[_resultNodes.length] = targetNodes[k].childNodes[l];
						}
					}
				}
			}
		}
		
		return _resultNodes;


		function _checkPredicate(targetNode, step) {
			if (!step["PREDICATE_TYPE"]) {
				return true;
			}
			
			if (step["PREDICATE_TYPE"] == PREDICATE_TYPE_ATTRIBUTE) {
				if (!step["PREDICATE_KEY"]) {
					return targetNode.hasAttribute(_removePrefix(step["PREDICATE_VALUE"]));
				}
				else {
					for (n = 0; n < targetNode.attributes.length; n++) {
						return ((targetNode.attributes[n].nodeName == step["PREDICATE_KEY"]) && (targetNode.attributes[n].nodeValue == step["PREDICATE_VALUE"]));
					}
					return false;
				}
			}
			else {
				return (targetNode.firstChild.nodeValue == step["PREDICATE_VALUE"]);
			}
		}
		
		function _removePrefix(value) {
			if (value.search(/:/)) {
				return value.split(":")[1];
			}
			return value;
		}
	}
}


/**
 * internal class: JobFlowValidator
 */
JobFlowValidator = function(fileFormat, scanParameter, deviceInfo) {
	var _validateFileFormat = function() {
		if (((fileFormat == FileFormat.XPS) || (fileFormat == FileFormat.High_Compression_XPS)) && !deviceInfo.EnableXPS) {
			return false;
		}
		if ((fileFormat.IsHighCompressionFormat() && !deviceInfo.IsSupportScanColorMode(DeviceColorMode.FullColor)) && !deviceInfo.IsSupportScanColorMode(DeviceColorMode.GrayScale)) {
			return false;
		}
		return true;
	}
	
	var _validateHighCompressionColorMode = function() {
		if (fileFormat.IsHighCompressionFormat() && (scanParameter.ColorMode == ColorMode.BlackAndWhite)) {
			return false;
		}
		return true;
	}
	
	var _validateHighCompressionResolution = function() {
		if ((fileFormat.IsHighCompressionFormat() && (scanParameter.Resolution != Resolution.Dpi200x200)) && (scanParameter.Resolution != Resolution.Dpi300x300)) {
			return false;
		}
		return true;
	}
	
	var _validateMagnification = function() {
		if ((fileFormat.IsHighCompressionFormat() || fileFormat.IsOCRFormat()) && (scanParameter.Magnification.ToString() != Magnification.ToObject(100).ToString())) {
			return false;
		}
		return true;
	}
	
	var _validateOCRImageMode = function() {
		if (fileFormat.IsOCRFormat() && (scanParameter.ImageMode == ImageMode.Default)) {
			return false;
		}
		return true;
	}
	
	var _validateOCRResolution = function() {
		if ((fileFormat.IsOCRFormat() && (scanParameter.Resolution != Resolution.Dpi200x200)) && (scanParameter.Resolution != Resolution.Dpi300x300)) {
			return false;
		}
		return true;
	}
	
	this.Validate = function() {
		if (!_validateFileFormat()) {
			throw new ErrorHandling(ErrorCode.UnsupportFileFormat.Value);
		}
		if (!_validateOCRResolution()) {
			throw new ErrorHandling(ErrorCode.InvalidOCRResolution.Value);
		}
		if (!_validateOCRImageMode()) {
			throw new ErrorHandling(ErrorCode.InvalidOCRImageMode.Value);
		}
		if (!_validateHighCompressionResolution()) {
			throw new ErrorHandling(ErrorCode.InvalidHighCompressionResolution.Value);
		}
		if (!_validateMagnification()) {
			throw new ErrorHandling(ErrorCode.InvalidHighCompressionOrOCRMagnification.Value);
		}
		if (!_validateHighCompressionColorMode()) {
			throw new ErrorHandling(ErrorCode.InvalidHighCompressionColorMode.Value);
		}
	}
}


/**
 * internal class: Message
 */
Message = function(address, enableSendMessage) {
	this.Address = address;
	this.Comment = "error";
	this.Subject = "error";
	this.EnableSendMessage = enableSendMessage;
}

Message.prototype = {
	ChangeAbortProcess: function(document) {
		var _node = JFScriptOperator.GetNode(document, "//jt:ProcessRequest/jt:Setup/jt:ExceptionHandler/jt:CatchAll");
		if (_node) {

			var _namedItem = _node.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "action");
			if (_namedItem) {
				_namedItem.Value = "AbortProcess";
			}
		}
	},
	
	DeleteAssignNode: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Distribute";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			this.DeleteFtpResultStringAssignNode(document);
		}
		this.DeleteInvokeResultStringAssignNode(document);
	},
	
	DeleteFtpResultStringAssignNode: function(document) {
		var _ftpStringToWorkspaceXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Assign[@jt:name='FtpStringToWorkspace']";
		var _ftpResultStringXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Workspace[@jt:name='FtpResultString']";
		var _ftpStringToCommnetXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Assign[@jt:name='FtpStringToComment']";

		var _oldChild = JFScriptOperator.GetNode(document, _ftpStringToWorkspaceXpath);
		var _node = JFScriptOperator.GetNode(document, _ftpResultStringXpath);
		var _node3 = JFScriptOperator.GetNode(document, _ftpStringToCommnetXpath);

		if (_oldChild) {
			_oldChild.parentNode.removeChild(_oldChild);
		}
		if (_node) {
			_node.parentNode.removeChild(_node);
		}
		if (_node3) {
			_node3.parentNode.removeChild(_node3);
		}
	},
	
	DeleteInvokeResultStringAssignNode: function(document) {
		var _invokeStringToWorkspaceXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Assign[@jt:name='InvokeStringToWorkspace']";
		var _invokeResultStringXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Workspace[@jt:name='InvokeResultString']";
		var _invokeStringToCommnetXpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Assign[@jt:name='InvokeStringToComment']";
	
		var _oldChild = JFScriptOperator.GetNode(document, _invokeStringToWorkspaceXpath);
		var _node = JFScriptOperator.GetNode(document, _invokeResultStringXpath);
		var _node3 = JFScriptOperator.GetNode(document, _invokeStringToCommnetXpath);
		
		if (_oldChild) {
			_oldChild.parentNode.removeChild(_oldChild);
		}
		if (_node) {
			_node.parentNode.removeChild(_node);
		}
		if (_node3) {
			_node3.parentNode.removeChild(_node3);
		}
	},
	
	DeleteMessageNode: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Message";
		
		var _oldChild = JFScriptOperator.GetNode(document, _xpath);
		
		this.ChangeAbortProcess(document);
		if (_oldChild) {
			_oldChild.parentNode.removeChild(_oldChild);
		}
	},
	
	ValidateComment: function() {
		return (this.Comment.length <= 100);
	},
	
	ValidateSubject: function() {
		return (this.Subject.length <= 50);
	},
	
	Write: function(document) {
		if (this.EnableSendMessage) {
			if (!this.ValidateSubject()) {
				throw new ErrorHandling(ErrorCode.InvalidSubjectLength.Value);
			}
			if (!this.ValidateComment()) {
				throw new ErrorHandling(ErrorCode.InvalidCommentLength.Value);
			}
			
			this.WriteSubject(document);
			this.WriteComment(document);
			this.WriteAddress(document);
		}
		else {
			this.DeleteMessageNode(document);
			this.DeleteAssignNode(document);
		}
	},
	
	WriteAddress: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Message/jt:Smtp/jt:Address";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.Address);
		}
	},
	
	WriteComment: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Message/jt:Comment";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.Comment);
		}
	},
	
	WriteSubject: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Message/jt:Subject";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.Subject);
		}
	}
}


/**
 * internal class: OCR
 */
OCR = function(fileFormat) {
	this.Compression = OCRCompression.None;
	this.FileFormat = fileFormat;
	this.Language = OCRLanguage.EN;
}

OCR.prototype = {
	Write: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Transform/jt:OCR";
		var _ocrNode = JFScriptOperator.GetNode(document, _xpath);
		if (_ocrNode) {
			if (this.FileFormat.IsOCRFormat()) {
				this.WriteLanguage(_ocrNode);
				this.WriteCompression(_ocrNode);
			}
			else {
				_ocrNode.parentNode.parentNode.removeChild(_ocrNode.parentNode);
			}
		}
	},
	
	WriteCompression: function(ocrNode) {
		var _namedItem = ocrNode.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "compression");
		if (_namedItem) {
			if ((this.FileFormat == FileFormat.OCR_DocuWorks) || (this.FileFormat == FileFormat.High_Compression_OCR_DocuWorks)) {
				_namedItem.Value = OCRCompression.None.JobFlowValue;
			}
			else {
				_namedItem.Value = this.Compression.JobFlowValue;
			}
		}
	},
	
	WriteLanguage: function(ocrNode) {
		var _namedItem = ocrNode.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "lang");
		if (_namedItem) {
			_namedItem.Value = this.Language.JobFlowValue;
		}
	}
}


/**
 * internal class: Scanner
 */
Scanner = function(deviceInfo, fileFormat) {
	this.DeviceInfo = deviceInfo;
	this.FileFormat = fileFormat;
	this.ScanParameter = new ScanParameter();
	this.ExScanParameter = new ExScanParameter();
}

Scanner.prototype = {
	ValidateColorMode: function() {
		if (!this.DeviceInfo.IsSupportScanColorMode(DeviceColorMode.FullColor) && (this.ScanParameter.ColorMode == ColorMode.FullColor)) {
			return false;
		}
		if (!this.DeviceInfo.IsSupportScanColorMode(DeviceColorMode.GrayScale) && (this.ScanParameter.ColorMode == ColorMode.Grayscale)) {
			return false;
		}
		return true;
	},
	
	ValidateInputMediumSize: function() {
		if (this.ScanParameter.InputMediumSize == DocumentSize.ISO_A3SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A4SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A4LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A5SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A5LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A6SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_A6LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_B4SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_B5SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.ISO_B5LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JIS_B4SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JIS_B5SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JIS_B5LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JIS_B6SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JIS_B6LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JP_PostCard_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.JP_PostCard_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.CN_16KaiSEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.CN_16KaiLEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.CN_8KaiSEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.TW_16KaiSEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.TW_16KaiLEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.TW_8KaiSEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.PictureL_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.PictureL_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Postcard_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.US_Postcard_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.US_Postcard_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Picture2L_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Picture2L_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Statement_Invoice_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Statement_Invoice_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Postcard6x9_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Executive_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Executive_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.NA_8x10_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.NA_8x10_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Spanish_Folio_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Letter_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Letter_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Folio_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Legal_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Ledger_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.UK_11x15_SEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.A4Cover_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.LetterCover_LEF
			|| this.ScanParameter.InputMediumSize == DocumentSize.Auto
			|| this.ScanParameter.InputMediumSize == DocumentSize.Mixed) {
			return true;
		}
		return false;
	},
	
	ValidateOutPutDocumentSize: function() {
		if ((this.ScanParameter.Magnification == Magnification.Auto) && (this.ScanParameter.OutputMediumSize == DocumentSize.NotSpecified)) {
			return false;
		}
		return true;
	},
	
	Write: function(document) {
		if (!this.ValidateInputMediumSize()) {
			throw new ErrorHandling(ErrorCode.InvalidInputMediumSize.Value);
		}
		if (!this.ValidateColorMode()) {
			throw new ErrorHandling(ErrorCode.InvalidScannerColorMode.Value);
		}
		if (!this.ValidateOutPutDocumentSize()) {
			throw new ErrorHandling(ErrorCode.InvalidOutPutDocumentSize.Value);
		}
		
		this.WriteInputMediumSize(document);
		this.WriteHeadPosition(document);
		this.WriteMagnification(document);
		this.WriteColorMode(document);
		this.WriteImageMode(document);
		this.WriteEnableNextOriginal(document);
		this.WriteDuplex(document);
		this.WriteResolution(document);
		this.WriteOutputMediumSize(document);
		this.WriteDarkness(document);
		this.WriteCompression(document);
		this.WriteExScanParameter(document);
		this.WriteMultiLayer(document);
	},
	
	WriteColorMode: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:ColorMode";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.ColorMode.JobFlowValue);
		}
	},
	
	WriteCompression: function(document) {
		var _auto = Bilevel.Auto;
		var _lossyLevel = LossyLevel.Default;
		var _jpeg = Multilevel.JPEG;
		
		if (this.ScanParameter.Bilevel) {
			_auto = this.ScanParameter.Bilevel;
		}
		if (this.ScanParameter.LossyLevel) {
			_lossyLevel = this.ScanParameter.LossyLevel;
		}
		if (this.ScanParameter.Multilevel) {
			_jpeg = this.ScanParameter.Multilevel;
		}

		if ((this.FileFormat == FileFormat.High_Compression_PDF) || (this.FileFormat == FileFormat.High_Compression_OCR_PDF)
				|| (this.FileFormat == FileFormat.High_Compression_PDFA) || (this.FileFormat == FileFormat.High_Compression_OCR_PDFA)) {
			if ((((_auto != Bilevel.Default) && (_auto != Bilevel.Auto)) 
				&& ((_auto != Bilevel.MMR) && (_auto != Bilevel.JBIG2A))) 
				&& (_auto != Bilevel.JBIG2H)) {
				_auto = Bilevel.Auto;
			}
		}
		else if ((this.FileFormat != FileFormat.PDF) && (this.FileFormat != FileFormat.OCR_PDF) && (this.FileFormat != FileFormat.PDFA)
							&& (this.FileFormat != FileFormat.OCR_PDFA)) {
			if ((this.FileFormat == FileFormat.High_Compression_DocuWorks) || (this.FileFormat == FileFormat.High_Compression_OCR_DocuWorks)) {
				if (((_auto != Bilevel.Default) && (_auto != Bilevel.Auto)) && (_auto != Bilevel.MMR)) {
					_auto = Bilevel.Auto;
				}
				if ((_jpeg != Multilevel.Default) && (_jpeg != Multilevel.JPEG)) {
					_jpeg = Multilevel.JPEG;
				}
			}
			else if (this.FileFormat == FileFormat.High_Compression_XPS) {
				if ((_auto != Bilevel.Default) && (_auto != Bilevel.Auto)) {
					_auto = Bilevel.Auto;
				}
				if ((_jpeg != Multilevel.Default) && (_jpeg != Multilevel.JPEG)) {
					_jpeg = Multilevel.JPEG;
				}
			}
			else if ((((this.FileFormat == FileFormat.DocuWorks) || (this.FileFormat = FileFormat.OCR_DocuWorks)) 
								|| ((this.FileFormat == FileFormat.XPS) || (this.FileFormat == FileFormat.TIFF_Single))) 
								|| (((this.FileFormat == FileFormat.TIFF_Multi) || (this.FileFormat == FileFormat.TIFF_FX)) 
								|| (this.FileFormat == FileFormat.NotSpecified))) {
				if (((_auto != Bilevel.Default) && (_auto != Bilevel.Auto)) && ((_auto != Bilevel.MH) && (_auto != Bilevel.MMR))) {
					_auto = Bilevel.Auto;
				}
				if ((_jpeg != Multilevel.Default) && (_jpeg != Multilevel.JPEG)) {
					_jpeg = Multilevel.JPEG;
				}
			}
			else {
				_auto = Bilevel.Auto;
				_jpeg = Multilevel.JPEG;
			}
		}

		var _node = JFScriptOperator.GetNode(document, "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Compression/jt:Bilevel");
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(_auto.ToString());
		}
		
		_node = JFScriptOperator.GetNode(document, "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Compression/jt:LossyLevel");
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(_lossyLevel.ToString());
		}
		
		_node = JFScriptOperator.GetNode(document, "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Compression/jt:Multilevel");
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(_jpeg.ToString());
		}
	},
	
	WriteDarkness: function(document) {
		var _darkness = Darkness.Default;
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Darkness";
		
		if (this.ScanParameter.Darkness != null) {
			_darkness = this.ScanParameter.Darkness;
		}
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(_darkness.ToString());
		}
	},
	
	WriteDuplex: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Duplex";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.Duplex.JobFlowValue);
		}
	},
	
	WriteEnableNextOriginal: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:EnableNextOriginal";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.EnableNextOriginal);
		}
	},
	
	WriteHeadPosition: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:HeadPosition";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.HeadPosition.JobFlowValue);
		}
	},
	
	WriteImageMode: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:ImageMode";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			if (this.FileFormat.IsOCRFormat() && (this.ScanParameter.ImageMode == ImageMode.Halftone)) {
				var elem = new CompInnerText(_node);
				elem.set(ImageMode.Mixed.JobFlowValue);
			}
			else {
				var elem = new CompInnerText(_node);
				elem.set(this.ScanParameter.ImageMode.JobFlowValue);
			}
		}
	},
	
	WriteInputMediumSize: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:InputMediumSize/jt:StandardMediumSize";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.InputMediumSize.JobFlowValue);
		}
	},
	
	WriteMagnification: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Magnification/jt:Isotropic";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.Magnification.ToString());
		}
	},
	
	WriteMultiLayer: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:CreateMultiLayers";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			if (this.FileFormat.IsHighCompressionFormat()) {
				var elem = new CompInnerText(_node);
				elem.set("ObjectSeparation");
				var _namedItem = _node.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "withThumbnails");
				if (_namedItem) {
					var _withThumbnails = this.ScanParameter.WithThumbnails;
					if (_withThumbnails) {
						_namedItem.Value = _withThumbnails.toLowerCase();
					}
				}
			}
			else {
				var elem = new CompInnerText(_node);
				elem.set("None");
				if (((this.FileFormat == FileFormat.DocuWorks) || (this.FileFormat == FileFormat.OCR_DocuWorks)) || (this.FileFormat == FileFormat.XPS)) {
					var _attribute2 = _node.attributes.getNamedItemNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", "withThumbnails");
					if (_attribute2) {
						var _withThumbnails = this.ScanParameter.WithThumbnails;
						if (_withThumbnails) {
							_attribute2.Value = _withThumbnails.toLowerCase();
						}
					}
				}
			}
		}
	},
	
	WriteOutputMediumSize: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:OutputMediumSize/jt:StandardMediumSize";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.OutputMediumSize.JobFlowValue);
		}
	},
	
	WriteResolution: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner/jt:Resolution";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.ScanParameter.Resolution.JobFlowValue);
		}
	},
	
	WriteExScanParameter: function(document) {
		var _xpath = "//jt:ProcessRequest/jt:DocumentProcess/jt:Acquire/jt:Scanner";
		var _node = JFScriptOperator.GetNode(document, _xpath);
		if (_node) {
			for (var key in this.ExScanParameter.Parameters) {
				var _targets = _node.getElementsByTagName(_removePrefix(key));
				for (var i = 0; i < _targets.length; i++) {
					_node.removeChild(_targets[i]);
				}
				
				var _prefix = "xmlns:jt=\"http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate\"";
				var _param = this.ExScanParameter.Parameters[key].replace("<" + key, "<" + key + " " + _prefix);
				
				var p = new DOMParser();
				var _dom = p.parseFromString(_param, "text/xml");
				var _tmp = document.importNode(_dom.firstChild, true);
				_node.appendChild(_tmp);
			}
			
			function _removePrefix(value) {
				if (value.search(/:/)) {
					return value.split(":")[1];
				}
				return value;
			}
		}
	}
}


/**
 * internal class: Serialization
 */
Serialization = function(parentXPath, fileFormat) {
	this.Linearize = Linearize.False;
	this.ParentXPath = parentXPath;
	this.FileFormat = fileFormat;
}

Serialization.prototype = {
	WriteFileFormat: function(document) {
		var _xpath = "/jt:Serialization/jt:Format";
		var _node = JFScriptOperator.GetNode(document, this.ParentXPath + _xpath);
		if (_node) {
			var elem = new CompInnerText(_node);
			elem.set(this.FileFormat.JobFlowValue);
		}
	},
	
	WriteLinearize: function(document) {
		var _xpath = "/jt:Serialization/jt:Format";
		var _node = JFScriptOperator.GetNode(document, this.ParentXPath + _xpath);
		if (_node) {
			var _namedItem = _node.attributes.getNamedItem("linearize");
			if (_namedItem) {
				_namedItem.Value = this.Linearize.JobFlowValue;
			}
		}
	},
	
	WriteSerialization: function(document) {
		this.WriteFileFormat(document);
		this.WriteLinearize(document);
	}
}


/**
 * internal class: CompInnerText
 */
CompInnerText = function(obj_htmlElement) {
	this.obj = obj_htmlElement;
}

CompInnerText.prototype.get = function () {
	var resText = "";

	if ( this.obj.childNodes.length != 0 ) {
		resText = this.obj.childNodes[0].nodeValue;
	}

	return resText;
} 

CompInnerText.prototype.set = function (str) {
	if(str == null) {
		this.obj.removeChild(this.obj.childNodes[0]);
	}
	else {
		if ( this.obj.childNodes.length != 0 ) {
			this.obj.childNodes[0].nodeValue = str;
		}
		else {
			this.obj.appendChild(this.obj.ownerDocument.createTextNode(str));
		}
	}

	return;
}


function combinePath(path1, path2) {
	var _newPath = path1.replace(/\/$/, "") + "/" + path2;
	return _newPath;
}


function importNode(doc, target, node) {
	var newnode = null;
	if (node.nodeType == 1 /* ELEMENT_NODE */) {
		var _prefix = node.nodeName.split(":")[0];
		if (_prefix == "jt") {
			newnode = doc.createElementNS("http://www.fujifilm.com/fb/2021/04/ssm/jobTemplate", node.tagName);
		}
		else if (_prefix == "soapENV") {
			newnode = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/", node.tagName);
		}
		else if (_prefix == "soap") {
			newnode = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/", node.tagName);
		}
		else {
			newnode = doc.createElement(node.tagName);
		}

		var attrs = node.attributes;
		var i = 0;
		while (attrs.item(i) != null) {
			newnode.setAttribute(attrs.item(i).nodeName, attrs.item(i).nodeValue);
			i++;
		}
		for (var n = node.firstChild; n != null; n = n.nextSibling)
		{
			newnode = importNode(doc, newnode, n);
		}
	} else if (node.nodeType == 3 /* TEXT_NODE */) {
		newnode = doc.createTextNode(node.nodeValue);
	} else if (node.nodeType == 8 /* COMMENT_NODE */) {
		newnode = doc.createComment(node.nodeValue);
	} else {
		alert("NodeType: " + node.nodeType + " not supported val: "+node.nodeValue);
	}
	if (target != null && newnode != null) {
		target.appendChild(newnode);
	}
	return target;
}


trim = function(str) {
	return str.replace(/^\s+|\s+$/g, "");
}

var ns = JFCreator;
ns.ScanFileTransferInvoke = ScanFileTransferInvoke;
ns.ScanInvokeSwA = ScanInvokeSwA;
ns.FtpFolderCreator = FtpFolderCreator;
ns.FileTransferInvokeRequiredParameter = FileTransferInvokeRequiredParameter;
ns.InvokeSwARequiredParameter = InvokeSwARequiredParameter;
ns.ScanParameter = ScanParameter;
ns.Authenticate = Authenticate;
ns.Bilevel = Bilevel;
ns.ColorMode = ColorMode;
ns.Darkness = Darkness;
ns.DocumentSize = DocumentSize;
ns.Duplex = Duplex;
ns.ErrorCode = ErrorCode;
ns.FileFormat = FileFormat;
ns.FtpPath = FtpPath;
ns.HeadPosition = HeadPosition;
ns.ImageMode = ImageMode;
ns.Linearize = Linearize;
ns.LossyLevel = LossyLevel;
ns.Magnification = Magnification;
ns.Multilevel = Multilevel;
ns.OCRCompression = OCRCompression;
ns.OCRLanguage = OCRLanguage;
ns.Resolution = Resolution;
})();

