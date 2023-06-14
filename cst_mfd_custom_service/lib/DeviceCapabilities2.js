/* 
 * Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.
 *
 * Java Script Library for Apeos Intrgration Plus.
 * ver2.0.1
 */
 
var DeviceCapabilities;
if (!DeviceCapabilities) DeviceCapabilities = {};

(function() {
	DeviceAccess = function(userName, password) {
		var _hostNameOrIpAddress = "127.0.0.1";
		var _portNumber = "80";
		var _useSSL = false;
		
		if ((_hostNameOrIpAddress == null) || (typeof(_hostNameOrIpAddress) != "string") || (trim(_hostNameOrIpAddress).length == 0)) {
			throw new ErrorHandling("InvalidArgumentHostNameOrIpAddress");
		}
		if ((_useSSL == null) || (typeof(_useSSL) != "boolean")) {
			throw new ErrorHandling("InvalidArgumentUseSSL");
		}
		var _getAttributeAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/statusConfig#GetAttribute"';
		var _getDescriptionAction = '"http://www.fujifilm.com/fb/2021/04/ssm/management/statusConfig#GetDescription"';

		
		var _self = this;
		
		var _successCB = null;
		var _errorCB = null;
		
		var webService = new WebService();
		webService.Host = _hostNameOrIpAddress;
		webService.Port = _portNumber;
		webService.UseSSL = _useSSL;
		
		this.UseAuthentication = !(userName instanceof WebServiceReq.AnonymousUser);
		var createPath = function() {
			if (this.UseAuthentication) {
				return "/ssm/Management/StatusConfig";
			}
			else {
				return "/ssm/Management/Anonymous/StatusConfig";
			}
		}
		
		var _path = createPath.call(this);
		
		this.GetAttribute = function(req, success_CB, error_CB) {
			var _userName = null;
			var _password = null;
			if (this.UseAuthentication) {
				_userName = userName;
				_password = password;
			}
			if (typeof(req) == "object") {
				webService.CallMgmtService(_path, _userName, _password, _getAttributeAction, req.responseText, success_CB, error_CB);
			}
			else {
				webService.CallMgmtService(_path, _userName, _password, _getAttributeAction, req, success_CB, error_CB);
			}
		}
		
		this.GetDescription = function(req, success_CB, error_CB) {
			webService.CallMgmtService(_path, null, null, _getDescriptionAction, req.responseText, success_CB, error_CB);
		}
		
		var _successGetOptCB = null;
		var _errorGetOptCB = null;
		this.GetOptions = function(success_CB, error_CB) {
			_successGetOptCB = success_CB;
			_errorGetOptCB = error_CB;
				WebService.LoadTemplate("template/GetOptionCollectionTemplate2.xml", _self.CallGetDescription_CB, _errorGetOptCB);
		}
		
		this.CallGetDescription_CB = function(req) {
			_self.GetDescription(req, _self.CallLoadTemplateGetOptions_CB, _errorGetOptCB);
		}
		
		var _optCollection = null;
		this.CallLoadTemplateGetOptions_CB = function(req) {
			_optCollection = req.responseXML;
			WebService.LoadTemplate("template/GetOptionsTemplate2.xml", _self.CallGetAttrOptions_CB, _errorGetOptCB);
		}
		
		this.CallGetAttrOptions_CB = function(req) {
			var _reqText = createOptionRequest(req);
			_self.GetAttribute(_reqText, _successGetOptCB, _errorGetOptCB);
		}
		
		var createOptionRequest = function(req) {
			var _reqDoc = req.responseXML;	
			var _target = _reqDoc.getElementsByTagName("GetAttribute")[0];		
			var _getObjects = _optCollection.getElementsByTagName("ObjectList")[0].getElementsByTagName("Object");
			var _num = _getObjects.length;
			for (var i = 0; i < _num; i++) {
				var newElem = createCloneNodeOption(_reqDoc, _target.namespaceURI, _getObjects[i]);
				_target.appendChild(newElem);
			}
			var _xmlSerializer = new XMLSerializer();
			var _reqText = _xmlSerializer.serializeToString(_reqDoc);
			
			return _reqText;
		}
		
		var createCloneNodeOption = function(resXML, NS, node) {
			var _createNode = resXML.createElementNS(NS, node.tagName);
			var _nameValue = node.getAttribute("name");
			var _identifierValue = node.getAttribute("identifier");
			
			_createNode.setAttribute("name", _nameValue);
			_createNode.setAttribute("identifier", _identifierValue);
			
			return _createNode;
		}
		
		var _devInfoObj = null;
		this.GetDeviceInformation = function(success_CB, error_CB) {
			_successCB = success_CB;
			_errorCB = error_CB;
		WebService.LoadTemplate("template/GetDeviceInformationTemplate2.xml", _self.CallGetAttrDevInfo_CB, _errorCB);
		}
		
		this.CallGetAttrDevInfo_CB = function(req) {
			_self.GetAttribute(req, _self.GetOptionsOrGetSSLPort_CB, _errorCB);
		}
		
		this.GetOptionsOrGetSSLPort_CB = function(req) {
			_devInfoObj = req;
			var _sslStatus = getValue(_devInfoObj.responseXML.getElementsByTagName("Object")[0], Constants.ROOT_SSL_STATUS_ATTRIBUTE);
			if (_sslStatus == "available") {
				WebService.LoadTemplate("template/GetSSLPortTemplate2.xml", _self.CallGetAttrSSLPort_CB, _errorCB);
			}
			else {
				_self.GetOptions(_self.SuccessGetOptions_CB, _errorCB);
			}
		}
		
		this.CallGetAttrSSLPort_CB = function(req) {
			_self.GetAttribute(req, _self.CallGetOptionsDevInfo_CB, _errorCB);
		}
		
		this.CallGetOptionsDevInfo_CB = function(req) {
			var _createResponse = createResponseIfSSL(_devInfoObj.responseXML, req.responseXML);
			_devInfoObj = _createResponse;
			_self.GetOptions(_self.SuccessGetOptions_CB, _errorCB);
		}
		
		var _options = null;
		this.SuccessGetOptions_CB = function(req) {
			_options = req;
			
			if (_devInfoObj.responseXML) {
				_successCB(new DeviceInformation(_devInfoObj.responseXML, _options.responseXML));
			}
			else {
				_successCB(new DeviceInformation(_devInfoObj, _options.responseXML));
			}
		}
		
		var createResponseIfSSL = function(defXml, portXml) {
			var _target = defXml.getElementsByTagName("Attribute")[0];
			
			var _createSSLNode = defXml.createElementNS(_target.namespaceURI, "Attribute");
			_createSSLNode.setAttribute("name", "SSLPort");
			var _portValue = portXml.getElementsByTagName("Attribute")[0].firstChild.nodeValue;
			_createSSLNode.appendChild(defXml.createTextNode(_portValue));
			
			return defXml;
		}
		
		var _devInfo = null;
		var _scannerSuccessCB = null;
		this.GetScannerCapabilities = function(success_CB, error_CB) {
			_scannerSuccessCB = success_CB;
			_errorCB = error_CB;
			_self.GetDeviceInformation(_self.SuccessGetDevInfoScanner_CB, error_CB);
		}
		
		this.SuccessGetDevInfoScanner_CB = function(req) {
			_devInfo = req;
		WebService.LoadTemplate("template/GetScannerCapabilitiesTemplate2.xml", _self.CallGetAttrScanner_CB, _errorCB);
		}
		
		this.CallGetAttrScanner_CB = function(req) {
			_self.GetAttribute(req, _self.SuccessGetAttrScanner_CB, _errorCB);
		}
		
		this.SuccessGetAttrScanner_CB = function(req) {
			_scannerSuccessCB(new ScannerCapability(req.responseXML, _options.responseXML));
		}
		
		var _distSuccessCB = null;
		this.GetDistributionCapabilities = function(success_CB, error_CB) {
			_distSuccessCB = success_CB;
			_errorCB = error_CB;
			_self.GetDeviceInformation(_self.SuccessGetDevInfoDist_CB, _errorCB);
		}
		
		this.SuccessGetDevInfoDist_CB = function(req) {
			_devinfo = req;
			
			WebService.LoadTemplate("template/GetDistributionCapabilitiesSupportedTemplate2.xml", _self.CallGetAttrDistributionSupported_CB, _errorCB);
		}
		
		this.CallGetAttrDistributionSupported_CB = function(req) {
			_self.GetAttribute(req, _self.SuccessGetAttrDistributionSupported_CB, _errorCB);
		}
		
		var _smimeSupported = false;
		var _smbSupported = false;
		this.SuccessGetAttrDistributionSupported_CB = function(req) {
			IsSupported(req);
			
		WebService.LoadTemplate("template/GetDistributionCapabilitiesTemplate2.xml", _self.CallGetAttrDist_CB, _errorCB);
		}
		
		var IsSupported = function(req) {
			var _xml = req.responseXML;
			var _objects = _xml.getElementsByTagName("Object");
			var _length = _objects.length;
			for (var i=0; i<_length; i++) {
				var _target = _objects[i];
				var _nameAttrValue = _target.getAttributeNode("name").nodeValue;
				if (_nameAttrValue == Constants.MAIL_PROTOCOL_OBJECT) {
					_smimeSupported = IsSupportedSMIME(_target)
				}
				else if (_nameAttrValue == Constants.DISTRIBUTION_CAPABILITY_OBJECT) {
					_smbSupported = IsSupportedSMB(_target);
				}
			}
		}
		
		var IsSupportedSMIME = function(target) {
			var _value = getValue(target, "SMIMESupported");
			return ((_value != null) && (trim(_value) == "true"));
		}
		
		var IsSupportedSMB = function(target) {
			var _value = getValue(target, "SMBSupported");
			return ((_value != null) && (trim(_value) == "available"));
		}
		
		this.CallGetAttrDist_CB = function(req) {
			var _xml = req.responseXML;
			
			if (_smimeSupported) {
				var _target = _xml.getElementsByTagName("Object")[0];
				var _smimeElem = _xml.createElementNS(_target.namespaceURI, "Attribute");
				_smimeElem.setAttribute("name", Constants.MAIL_PROTOCOL_SMIME_STATUS_ATTRIBUTE);
				_target.appendChild(_smimeElem);
			}
			
			if (_smbSupported) {
				var _target = _xml.getElementsByTagName("GetAttribute")[0];
				var _smbObjectElem = _xml.createElementNS(_target.namespaceURI, "Object");
				_smbObjectElem.setAttribute("name", Constants.SMB_DISTRIBUTION_OBJECT);
				var _smbElem = _xml.createElementNS(_smbObjectElem.namespaceURI, "Attribute");
				_smbElem.setAttribute("name", Constants.SMB_DISTRIBUTION_STATUS_ATTRIBUTE);
				_smbObjectElem.appendChild(_smbElem);
				_target.appendChild(_smbObjectElem);
			}
			
			var _xmlSerializer = new XMLSerializer();
			var _reqText = _xmlSerializer.serializeToString(_xml);
			
			_self.GetAttribute(_reqText, _self.SuccessGetAttrDist_CB, _errorCB);
		}
		
		this.SuccessGetAttrDist_CB = function(req) {
			_distSuccessCB(new DistributionCapability(req.responseXML, _options.responseXML));
		}
		
		var _printSuccessCB = null;
		this.GetPrintCapabilities = function(success_CB, error_CB) {
			_printSuccessCB = success_CB;
			_errorCB = error_CB;
			_self.GetDeviceInformation(_self.SuccessGetDevInfoPrint_CB, _errorCB);
		}
		
		this.SuccessGetDevInfoPrint_CB = function(req) {
			_devinfo = req;
		WebService.LoadTemplate("template/GetPrintCapabilitiesTemplate2.xml", _self.CallGetAttrPrint_CB, _errorCB);
		}
		
		this.CallGetAttrPrint_CB = function(req) {
			_self.GetAttribute(req, _self.SuccessGetAttrPrint_CB, _errorCB);
		}
		
		this.SuccessGetAttrPrint_CB = function(req) {
			_printSuccessCB(new PrintCapability(req.responseXML, _options.responseXML));
		}
	}
	
	var getValue = function(target, attrName) {
		if (target == null){
			return null;
		}
		var _attrs = target.getElementsByTagName("Attribute");
		
		var _len = _attrs.length;
		
		for (var i=0; i < _len; i++) {
			var _attr = _attrs[i];
			if (_attr.getAttributeNode("name").nodeValue == attrName) {
				var _child = _attr.firstChild;
				if (_child != null) {
					return _child.nodeValue;
				}
				return null;
			}
		}
		return null;
	}
	
	var createOptionArray = function(res) {
		var _nodes = res.getElementsByTagName("Attribute");
		
		var _optionArray = {};
		var _nodelength = _nodes.length;
		for (var i = 0; i < _nodelength; i+=2 ) {
			if (_nodes[i].hasChildNodes() && _nodes[i+1].hasChildNodes()) {
				var _key = _nodes[i].firstChild.nodeValue;
				var _value = _nodes[i+1].firstChild.nodeValue;
				
				_optionArray[_key] = _value;
			}
		}
		return _optionArray;
	}
	
	GetFirstElementByName = function(result, tagName, attrName) {
		var _tags = result.getElementsByTagName(tagName);
		for(var i = 0; i < _tags.length; i++){
			var nvalue = _tags[i].getAttributeNode("name").nodeValue;
			if(nvalue == attrName){
				return _tags[i];
			}
		}
		return null;
	}
	
	DeviceInformation = function(res, options) {
		if (!res || !options) {
			this.ModelName = "";
			this.ProductCode = "";
			this.SoftwareVersion = "";
			this.MachineOID = "";
			this.SerialNumber = "";
			this.SSLStatus = false;
			this.SSLPort = "";
			this.SSMI = ""
			this.SJFI = "";
			this.Name = "";
			this.Location = "";
			this.Contact = "";
			this.Comment = "";
			this.Locale = "";
			
			this.EnableDownloadPrint = false;
			this.EnableJBIG2Compression = false;
			this.EnableThumbnailOnly = false;
			this.EnableLinearize = false;
			this.EnableOCR = false;
			this.MaxDocumentSize = "";
			
			this.EnableXPS = false;
			
			this.EnableCompression = false;
			this.EnableCompressionMultilevel = false;
			
			this.ScanSupportColorMode = new Array();
			this.PrintSupportColorMode = new Array();
			
			this.DADFOption = false;

			this.IsScannerAvailable = false;
		}
		else {
			var _basics   = GetFirstElementByName(res, "Object", Constants.ROOT_OBJECT);
			var _proInfos = GetFirstElementByName(res, "Object", Constants.PRODUCT_INFORMATION_OBJECT);
			var _sysInfos = GetFirstElementByName(res, "Object", Constants.SYSTEM_INFORMATION_OBJECT);
			var _scanCapa = GetFirstElementByName(res, "Object", Constants.SCANNER_CAPABILITY_OBJECT);
			var _prinCapa = GetFirstElementByName(res, "Object", Constants.PRINTER_CAPABILITY_OBJECT);
			
			this.ModelName = getValue(_basics, Constants.ROOT_NAME_ATTRIBUTE);
			this.ProductCode = getValue(_proInfos, Constants.PRODUCT_INFORMATION_PRODUCT_CODE_ATTRIBUTE);
			this.SoftwareVersion = getValue(_basics, Constants.ROOT_VERSION_ATTRIBUTE);
			this.MachineOID = getValue(_basics, Constants.ROOT_SERVICE_IDENTIFIER_ATTRIBUTE);
			this.SerialNumber = getValue(_proInfos, Constants.PRODUCT_INFORMATION_SERIAL_NUMBER_ATTRIBUTE);
			this.SSLStatus = (function() {
				var _sslStatus = getValue(_basics, Constants.ROOT_SSL_STATUS_ATTRIBUTE);
				return ((_sslStatus != null) && (_sslStatus == "available"));
			})();
			this.SSLPort = null;
			if (this.SSLStatus) {
				this.SSLPort = getValue(_basics, Constants.ROOT_SSL_PORT_ATTRIBUTE);
			}
			
			this.SSMI = getValue(_basics, Constants.ROOT_SSMI_VERSION_ATTRIBUTE);
			this.SJFI = getValue(_basics, Constants.ROOT_SJFI_VERSION_ATTRIBUTE);
			
			this.Name = getValue(_sysInfos, Constants.SYSTEM_INFORMATION_NAME_ATTRIBUTE);
			this.Location = getValue(_sysInfos, Constants.SYSTEM_INFORMATION_LOCATION_ATTRIBUTE);
			this.Contact = getValue(_sysInfos, Constants.SYSTEM_INFORMATION_CONTACT_ATTRIBUTE);
			this.Comment = getValue(_sysInfos, Constants.SYSTEM_INFORMATION_COMMENT_ATTRIBUTE);
			this.Locale = getValue(_sysInfos, Constants.SYSTEM_INFORMATION_LOCALE_ATTRIBUTE);
			
			this.EnableDownloadPrint = true;
			this.EnableJBIG2Compression = true;
			this.EnableThumbnailOnly = true;
			this.EnableLinearize = true;
			this.MaxDocumentSize = "ISO_A3SEF";
			
			var _optionArray = createOptionArray(options);
			this.EnableOCR = (function() {
				var _ocr = _optionArray[Constants.SCAN_OCR_OPTION];
				return ((_ocr != null) && (trim(_ocr) == Constants.OPTION_ACTIVE));
			})();
			this.EnableXPS = (function() {
				var _xps = _optionArray[Constants.XPS_SCAN_OPTION];
				return ((_xps != null) && (_xps == Constants.OPTION_ACTIVE));
			})();
			
			if (_scanCapa){
				var _scanColorMode = getValue(_scanCapa, Constants.SCANNER_CAPABILITY_COLOR_MODE_ATTRIBUTE);
			}

			var _printColorMode = getValue(_prinCapa, Constants.PRINTER_CAPABILITY_COLOR_MODE_ATTRIBUTE);
			
			this.EnableCompression = true;
			this.EnableCompressionMultilevel = (function() {
				if (_scanColorMode == "color") {
					return true;
				}
				return false;
			})();
			
			var createColorModeList = function(colorMode) {
				var _list = new Array();
				if (colorMode == null) {
					return _list;
				}
				_list.push(DeviceColorMode.BlackAndWhite);
				if (colorMode == "color") {
					_list.push(DeviceColorMode.GrayScale);
					_list.push(DeviceColorMode.FullColor);
				}
				return _list;
			}
			
			this.ScanSupportColorMode = createColorModeList(_scanColorMode);
			this.PrintSupportColorMode = createColorModeList(_printColorMode);
			
			this.DADFOption = (function() {
				var _dadfOption = GetFirstElementByName(res, "Object", Constants.SCANNER_STATUS_OBJECT);
				if (!_dadfOption) {
					return false;
				}
				var _dadf = getValue(_dadfOption, Constants.DADF_ORIGINAL_EXIST);
				return ((_dadf != null) && (_dadf == "true"));
			})();

			this.IsScannerAvailable = (function() {
				if (_scanCapa) {
					return true;
				}else{
					return false;
				}
			})();
		}
		
		var IsSupportColorMode = function(colorModeList, colorMode) {
			if (colorMode == null) {
				throw new ErrorHandling("InvalidArgumentPrintColorMode");
			}
			var _listLength = colorModeList.length;
			for (var i = 0; i< _listLength; i++) {
				if (colorModeList[i] == colorMode) {
					return true;
				}
			}
			return false;
		}
		
		this.IsSupportPrintColorMode = function(colorMode) {
			return IsSupportColorMode(this.PrintSupportColorMode, colorMode);
		}
		
		this.IsSupportScanColorMode = function(colorMode) {
			return IsSupportColorMode(this.ScanSupportColorMode, colorMode);
		}
		
		this.EnableHighCompression = 
			(this.IsSupportScanColorMode.call(this, DeviceColorMode.FullColor) || this.IsSupportScanColorMode.call(this, DeviceColorMode.GrayScale));
	}
	
	ScannerCapability = function(res, options) {
		if (GetFirstElementByName(res, "Object", Constants.SCANNER_CAPABILITY_OBJECT)){
			this.ColorScan = (function() {
				var _color = getValue(res, Constants.SCANNER_CAPABILITY_COLOR_MODE_ATTRIBUTE);
				return ((_color != null) && (trim(_color) == "color"));
			})();
			this.DuplexScan = (function() {
				var _duplex = getValue(res, Constants.SCANNER_CAPABILITY_DUPLEX_ATTRIBUTE);
				return ((_duplex != null) && (trim(_duplex) == "true"));
			})();

			var _optionArray = createOptionArray(options);
			this.MultiLayerScan = (function() {
				var _highComp = _optionArray[Constants.SCAN_HIGH_COMPRESSION_OPTION];
				return ((_highComp != null) && (trim(_highComp) == Constants.OPTION_ACTIVE));
			})();
			this.ScanOCR = (function() {
				var _ocr = _optionArray[Constants.SCAN_OCR_OPTION];
				return ((_ocr != null) && (trim(_ocr) == Constants.OPTION_ACTIVE));
			})();
			this.XPSScan = (function() {
				var _xps = _optionArray[Constants.XPS_SCAN_OPTION];
				return ((_xps != null) && (trim(_xps) == Constants.OPTION_ACTIVE));
			})();
			this.ScanPreview = (function() {
				var _preview = _optionArray[Constants.PREVIEW_OPTION];
				return ((_preview != null) && (trim(_preview) == Constants.OPTION_ACTIVE));
			})();
			this.IsAvailable = true;
		}else{
			this.ColorScan = false;
			this.DuplexScan = false;
			this.MultiLayerScan = false;
			this.ScanOCR = false;
			this.XPSScan = false;
			this.ScanPreview = false;
			this.IsAvailable = false;
		}
	}
	
	DistributionCapability = function(res, options) {
		var checkSMIMEStatus = function() {
			var _objectNodes = res.getElementsByTagName("Object");
			var _len = _objectNodes.length;
			if (_len == 0) {
				return false;
			}
			var _target = _objectNodes[0];
			var _smime = getValue(_target, Constants.MAIL_PROTOCOL_SMIME_STATUS_ATTRIBUTE);
			
			return ((_smime != null) && (trim(_smime) == "true"));
		}
		
		var checkSMTPStatus = function() {
			var _objectNodes = res.getElementsByTagName("Object");
			var _len = _objectNodes.length;
			if (_len == 0) {
				return SMTPStatus.unknown;
			}
			var _target = _objectNodes[0];
			var _smtp = getValue(_target, Constants.MAIL_PROTOCOL_OUTGOING_STATUS_ATTRIBUTE);
			
			if (_smtp == null) {
				return SMTPStatus.unknown;
			}
			else if (trim(_smtp) == "true") {
				return SMTPStatus.enabled;
			}
			return SMTPStatus.disabled;
		}
		
		var checkFTPStatus = function() {
			var _objectNodes = res.getElementsByTagName("Object");
			var _len = _objectNodes.length;
			if (_len == 0) {
				return FTPStatus.unknown;
			}
			var _target = _objectNodes[1];
			var _ftp = getValue(_target, Constants.FTP_STATUS_ATTRIBUTE);
			
			if (_ftp == null) {
				return FTPStatus.unknown;
			}
			else if (trim(_ftp) == "true") {
				return FTPStatus.enabled;
			}
			return FTPStatus.disabled;
		}
		
		var checkSMBStatus = function() {
			var _objectNodes = res.getElementsByTagName("Object");
			var _len = _objectNodes.length;
			if (_len == 0) {
				return SMBStatus.unknown;
			}
			if (_len == 2) {
				return SMBStatus.disabled;
			}
			var _target = _objectNodes[2];
			var _smb = getValue(_target, Constants.SMB_DISTRIBUTION_STATUS_ATTRIBUTE);
			if (_smb == null) {
				return SMBStatus.unknown;
			}
			else if (trim(_smb) == "true") {
				return SMBStatus.enabled;
			}
			return SMBStatus.disabled;
		}
		
		this.FTPDistribution = checkFTPStatus();
		this.SMBDistribution = checkSMBStatus();
		this.SMTPDistribution = checkSMTPStatus();
		this.SMIME = checkSMIMEStatus();
		
		var _optionArray = createOptionArray(options);
		this.DocumentSignature = (function() {
			var _pkiSig = _optionArray[Constants.SCAN_PKI_SIG_OPTION];
			return ((_pkiSig != null) && (trim(_pkiSig) == Constants.OPTION_ACTIVE));
		})();
		this.DocumentPasswordProtection = (function() {
			var _secScanPass = _optionArray[Constants.SEC_SCAN_PASSWORD_OPTION];
			return ((_secScanPass != null) && (trim(_secScanPass) == Constants.OPTION_ACTIVE));
		})();
		this.DocumentPKIProtection = (function() {
			var _pkiEnc = _optionArray[Constants.SCAN_PKI_ENC_OPTION];
			return ((_pkiEnc != null) && (trim(_pkiEnc) == Constants.OPTION_ACTIVE));
		})();
		this.XPSDocument = (function() {
			var _xps = _optionArray[Constants.XPS_SCAN_OPTION];
			return ((_xps != null) && (trim(_xps) == Constants.OPTION_ACTIVE));
		})();
	}
	
	PrintCapability = function(res, options) {
		var _target = res.getElementsByTagName("Object")[0];
		
		this.ColorPrint = (function() {
			var _color = getValue(_target, Constants.PRINTER_CAPABILITY_COLOR_MODE_ATTRIBUTE);
			return ((_color != null) && (trim(_color) == "color"));
		})();
		this.DuplexPrint = (function() {
			var _duplex = getValue(_target, Constants.PRINTER_CAPABILITY_DUPLEX_ATTRIBUTE);
			return ((_duplex != null) && (trim(_duplex) == "true"));
		})();
		this.ManualFeed = (function() {
			var _feed = getValue(_target, Constants.PRINTER_CAPABILITY_MSI_ATTRIBUTE);
			return ((_feed != null) && (trim(_feed) == "true"));
		})();
		this.Stacker = (function() {
			var _stacker = getValue(_target, Constants.PRINTER_CAPABILITY_STACKER_ATTRIBUTE);
			return ((_stacker != null) && (trim(_stacker) == "true"));
		})();
		
		var _optionArray = createOptionArray(options);
		this.WaterMark = (function() {
			var _mark = _optionArray[Constants.ANALOG_WATERMARK_OPTION];
			return ((_mark != null) && (trim(_mark) === Constants.OPTION_ACTIVE));
		})();
		this.UUIDPrint = (function() {
			var _uuid = _optionArray[Constants.UUID_ANNOTATION_PRINT_OPTION];
			return ((_uuid != null) && (trim(_uuid) === Constants.OPTION_ACTIVE));
		})();
		this.XPSPrint = (function() {
			var _xps = _optionArray[Constants.XPS_SCAN_OPTION];
			return ((_xps != null) && (trim(_xps) === Constants.OPTION_ACTIVE));
		})();
	}
	
	Constants = function() { }
	var _urn_nid;
      	_urn_nid = "urn:fujifilm:names:ssm:1.0:management:";
	Constants.ROOT_OBJECT = _urn_nid + "root";
	Constants.ROOT_NAME_ATTRIBUTE = "Name";
	Constants.ROOT_SERVICE_IDENTIFIER_ATTRIBUTE = "ServiceIdentifier";
	Constants.ROOT_VERSION_ATTRIBUTE = "Version";
	Constants.ROOT_SSL_STATUS_ATTRIBUTE = "SSLStatus";
	Constants.ROOT_SSL_PORT_ATTRIBUTE = "SSLPort";
	Constants.ROOT_SSMI_VERSION_ATTRIBUTE = "SSMIVersion";
	Constants.ROOT_SJFI_VERSION_ATTRIBUTE = "SJFIVersion";
	Constants.PRODUCT_INFORMATION_OBJECT = _urn_nid + "productInformation";
	Constants.PRODUCT_INFORMATION_SERIAL_NUMBER_ATTRIBUTE = "serialNumber";
	Constants.PRODUCT_INFORMATION_PRODUCT_CODE_ATTRIBUTE = "productCode";
	Constants.SYSTEM_INFORMATION_OBJECT = _urn_nid + "systemInformation";
	Constants.SYSTEM_INFORMATION_NAME_ATTRIBUTE = "Name";
	Constants.SYSTEM_INFORMATION_CONTACT_ATTRIBUTE = "Contact";
	Constants.SYSTEM_INFORMATION_LOCATION_ATTRIBUTE = "Location";
	Constants.SYSTEM_INFORMATION_COMMENT_ATTRIBUTE = "Comment";
	Constants.SYSTEM_INFORMATION_LOCALE_ATTRIBUTE = "Locale";
	Constants.PRINTER_CAPABILITY_OBJECT = _urn_nid + "printerCapability";
	Constants.PRINTER_CAPABILITY_COLOR_MODE_ATTRIBUTE = "ColorMode";
	Constants.PRINTER_CAPABILITY_DUPLEX_ATTRIBUTE = "Duplex";
	Constants.PRINTER_CAPABILITY_STACKER_ATTRIBUTE = "Stacker";
	Constants.PRINTER_CAPABILITY_MSI_ATTRIBUTE = "MSI";
	Constants.SCANNER_CAPABILITY_OBJECT = _urn_nid + "scannerCapability";
	Constants.SCANNER_CAPABILITY_COLOR_MODE_ATTRIBUTE = "ColorMode";
	Constants.SCANNER_CAPABILITY_DUPLEX_ATTRIBUTE = "Duplex";
	Constants.SCANNER_CAPABILITY_FILE_FORMAT_ATTRIBUTE = "FileFormat";
	Constants.MAIL_PROTOCOL_OBJECT = _urn_nid + "mailProtocol";
	Constants.MAIL_PROTOCOL_OUTGOING_STATUS_ATTRIBUTE = "OutgoingStatus";
	Constants.MAIL_PROTOCOL_SMIME_STATUS_ATTRIBUTE = "SMIMEStatus";
	Constants.FTP_OBJECT = _urn_nid + "FTP";
	Constants.FTP_STATUS_ATTRIBUTE = "Status";
	Constants.DISTRIBUTION_CAPABILITY_OBJECT = _urn_nid + "distributionCapability";
	Constants.DISTRIBUTION_CAPABILITY_SMB_SUPPORTED_ATTRIBUTE = "SMBSupported";
	Constants.SMB_DISTRIBUTION_OBJECT = _urn_nid + "SMBDistribution";
	Constants.SMB_DISTRIBUTION_STATUS_ATTRIBUTE = "Status";
	Constants.OPTION_COLLECTION_OBJECT = _urn_nid + "optionCollection";
	Constants.OPTION_OBJECT = _urn_nid + "Option";
	Constants.OPTION_NAME_ATTRIBUTE = "Name";
	Constants.OPTION_STATUS_ATTRIBUTE = "Status";
	Constants.OPTION_ACTIVE = "ACTIVE";
	Constants.SCANNER_STATUS_OBJECT = _urn_nid + "scannerStatus";
	
	Constants.SCAN_HIGH_COMPRESSION_OPTION = "SCAN_HIGH_COMPRESSION";
	Constants.SCAN_OCR_OPTION = "SCAN_OCR";
	Constants.XPS_SCAN_OPTION = "XPS_SCAN";
	Constants.PREVIEW_OPTION = "PREVIEW";
	Constants.SEC_SCAN_PASSWORD_OPTION = "SEC_SCAN_PASSWORD";
	Constants.SCAN_PKI_SIG_OPTION = "SCAN_PKI_SIG";
	Constants.SCAN_PKI_ENC_OPTION = "SCAN_PKI_ENC";
	Constants.ANALOG_WATERMARK_OPTION = "ANALOG_WATERMARK";
	Constants.UUID_ANNOTATION_PRINT_OPTION = "UUID_ANNOTATION_PRINT";
	
	Constants.DADF_ORIGINAL_EXIST = "DADFOriginalExist";
	
	FTPStatus = function() { }
	FTPStatus.unknown = "unknown";
	FTPStatus.disabled = "disabled";
	FTPStatus.enabled = "enabled";
	
	SMBStatus = function() { }
	SMBStatus.unknown = "unknown";
	SMBStatus.disabled = "disabled";
	SMBStatus.enabled = "enabled";
	
	SMTPStatus = function() { }
	SMTPStatus.unknown = "unknown";
	SMTPStatus.disabled = "disabled";
	SMTPStatus.enabled = "enabled";
	
	DeviceColorMode = function() { }
	DeviceColorMode.BlackAndWhite = "BlackAndWhite";
	DeviceColorMode.FullColor = "FullColor";
	DeviceColorMode.GrayScale = "GrayScale";
	
	EWBScreen = function() {
		var _width = screen.width;
		var _height = screen.height;
		
		this.Width = _width;
		this.Height = _height;
		this.WidthAndHeight = _width + "*" + _height;
		
		this.Size = (function() {
			if (_height == 600) {
				return "SVGA";
			}
			else if(_height == 480) {
				return "WVGA";
			}
			return null;
		})();
	}
	
	trim = function(str) {
		return str.replace(/^\s+|\s+$/g, "");
	}
	
	var ns = DeviceCapabilities;
	ns.DeviceAccess = DeviceAccess;
	ns.DeviceInformation = DeviceInformation;
	ns.ScannerCapability = ScannerCapability;
	ns.DistributionCapability = DistributionCapability;
	ns.PrintCapability = PrintCapability;
	ns.DeviceColorMode = DeviceColorMode;
	ns.EWBScreen = EWBScreen;
})();

