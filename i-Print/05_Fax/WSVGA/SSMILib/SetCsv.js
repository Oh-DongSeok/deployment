/**
 * @fileoverview カスタムサービス属性変更のためのクラス定義<br>
 * 以下のメソッドを提供する<br>
 * SetCsv<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Defines classes for setting Custom Service settings.<br>
 * Provides the following methods:<br>
 * SetCsv<br>
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */
 
/**
 * CsvSetインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class カスタム・サービスの属性変更のためのクラス
 * @lang ja
 */
/**
 * Creates CsvSet instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class Class for setting Custom Service settings
 * @lang en
 */
SSMILib.CsvSet = function()
{
	/**
	 * カスタム・サービスの名前<br>
	 * デバイスに登録済みのカスタム・サービス名でなければならない
	 * @type String
	 * @lang ja
	 */
	/**
	 * Custom Service name.<br>
	 * Service name must match that already registered to device.
	 * @type String
	 * @lang en
	 */
	this.name = "";
	
	/**
	 * カスタム・サービスを説明する文字列
	 * @type String
	 * @lang ja
	 */
	/**
	 * Custom Service description string.
	 * @type String
	 * @lang en
	 */
	this.description = "";
	
	/**
	 * カスタム・サービスの供給者を特定する文字列
	 * @type String
	 * @lang ja
	 */
	/**
	 * Custom Service supplier string.
	 * @type String
	 * @lang en
	 */
	this.vendorName = "";
	
	/**
	 * デバイスが保持するサービスを示す
	 * @type Boolean
	 * @private
	 * @lang ja
	 */
	/**
	 * Whether service is device-native.
	 * @type Boolean
	 * @private
	 * @lang en
	 */
	this.isNative = false;
	
	/**
	 * 小サイズアイコンへのURLパス
	 * @type String
	 * @lang ja
	 */
	/**
	 * Small icon URL path
	 * @type String
	 * @lang en
	 */
	this.smallIconUrl = "";
	
	/**
	 * 大サイズアイコンへのURLパス
	 * @type String
	 * @lang ja
	 */
	/**
	 * Large icon URL path
	 * @type String
	 * @lang en
	 */
	this.largeIconUrl = "";
	
	/**
	 * カスタム・サービスの起動時アクセス先URL
	 * @type String
	 * @lang ja
	 */
	/**
	 * Top URL of Custom Service 
	 * @type String
	 * @lang en
	 */
	this.url = "";
	
	/**
	 * カスタム・サービスのデスクリプションファイルへのURLパス
	 * @type String
	 * @lang ja
	 */
	/**
	 * Custom Service description file URL path
	 * @type String
	 * @lang en
	 */
	this.descriptionUrl = "";
	
	/**
	 * カスタム・サービスを無効化する
	 * @type Boolean
	 * @private
	 * @lang ja
	 */
	/**
	 * Disable Custom Service 
	 * @type Boolean
	 * @private
	 * @lang en
	 */
	this.isDisabled = false;
	
	/**
	 * 将来のための拡張用
	 * @type String
	 * @private
	 * @lang ja
	 */
	/**
	 * For future extension
	 * @type String
	 * @private
	 * @lang en
	 */
	this.provides = "";
	
	/**
	 * カスタム・サービスの起動タイミング 、複数指定可能<br>
	 * 		Authentication 			: 認証時<br>
	 * 		Opening 				: TOP画面表示時<br>
	 * 		ServicesHome 			: メニュー画面表示時<br>
	 * @type Array
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service start timing; multiple timings can be specified.<br>
	 * 		Authentication: In place of authentication screen<br>
	 * 		Opening: Preceding initial screen<br>
	 * 		ServicesHome: In place of Services Home screen<br>
	 * @type Array
	 * @default null
	 * @lang en
	 */
	this.timing = null;
	
	/**
	 * カスタム・サービスの画面表示上の設定<br>
	 * 		none 		: ツールバーとステータスバーを表示しない<br>
	 * 		toolbar		: ツールバーを表示する<br>
	 * 		statusbar	: ステータスバーを表示する<br>
	 * @type String
	 * @default none
	 * @lang ja
	 */
	/**
	 * Custom Service screen display mode<br>
	 * 		none: Hide both toolbar and status bar<br>
	 * 		toolbar: Show toolbar<br>
	 * 		statusbar: Show status bar<br>
	 * @type String
	 * @default none
	 * @lang en
	 */
	this.displayMode = "none";
	
	/**
	 * カスタム・サービスが外部Webサービスにアクセスする際に使用する認証情報設定
	 * @type SSMILib.CsvSet.AuthInformation
	 * @default SSMILib.CsvSet.AuthInformation()
	 * @lang ja
	 */
	/**
	 * Authentication information settings to use upon Custom Service access to external Web service
	 * @type SSMILib.CsvSet.AuthInformation
	 * @default SSMILib.CsvSet.AuthInformation()
	 * @lang en
	 */
	this.authInformation = new SSMILib.CsvSet.AuthInformation();
	
	/**
	 * カスタム・サービスから外部Webサービスへの情報送信設定
	 * @type SSMILib.CsvSet.SendInformation
	 * @default SSMILib.CsvSet.SendInformation()
	 * @lang ja
	 */
	/**
	 * Settings for sending information from Custom Service to external Web service
	 * @type SSMILib.CsvSet.SendInformation
	 * @default SSMILib.CsvSet.SendInformation()
	 * @lang en
	 */
	this.sendInformation = new SSMILib.CsvSet.SendInformation();
	
	/**
	 * カスタム・サービスが外部Webサービスへユーザーの権限情報を送信するかどうかの設定
	 * @type Boolean
	 * @lang_ja
	 */
	/**
	 * Whether to send authorized right information to external Web service
	 * @type Boolean
	 * @lang_en
	 */
	this.sendAuthorizedRight = false;
	
	/**
	 * カスタム・サービスへのアクセス制限設定
	 * @type SSMILib.CsvSet.ServiceAccessRule
	 * @default SSMILib.CsvSet.ServiceAccessRule()
	 * @lang ja
	 */
	/**
	 * Custom Service access settings
	 * @type SSMILib.CsvSet.ServiceAccessRule
	 * @default SSMILib.CsvSet.ServiceAccessRule()
	 * @lang en
	 */
	this.serviceAccessRule = new SSMILib.CsvSet.ServiceAccessRule();
}

/**
 * AuthInformationインスタンスを作成する<br>
 * 本クラスはCsvSetクラスのAuthInformation設定として扱う<br>
 * @constructor
 * @class カスタム・サービスが外部Webサービスにアクセスする際に使用する認証情報設定のためのクラス
 * @lang ja
 */
/**
 * Creates AuthInformation instance.<br>
 * This class handled as AuthInformation settings for CsvSet class.<br>
 * @constructor
 * @class Class for setting authentication information upon Custom Service access to external Web service
 * @lang en
 */
SSMILib.CsvSet.AuthInformation = function()
{
	/**
	 * カスタム・サービスが外部Webサービスにアクセスする際に使用する認証情報源<br>
	 * 		RegisteredInfo 	: カスタム・サービスに予め設定した認証情報を使用する<br>
	 * 		UserInput		: 認証時にユーザが入力した認証情報を使用する
	 * @type  String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Source of authentication information to use upon Custom Service access to external Web service<br>
	 * 		RegisteredInfo: Use authentication information set in advance to Custom Service<br>
	 * 		UserInput: Use authentication information entered by user upon authentication
	 * @type  String
	 * @default null
	 * @lang en
	 */
	this.source = "";
	
	/**
	 * ユーザ名<br>
	 * source(認証情報源)がRegisteredInfoである場合に使用する。
	 * @type String
	 * @lang ja
	 */
	/**
	 * User name.<br>
	 * Valid only when "source" (authentication information source) is set to RegisteredInfo.
	 * @type String
	 * @lang en
	 */
	this.user = "";
	
	/**
	 * パスワード<br>
	 * source(認証情報源)がRegisteredInfoである場合に使用する。
	 * @type String
	 * @lang ja
	 */
	/**
	 * Password.<br>
	 * Valid only when "source" (authentication information source) is set to RegisteredInfo.
	 * @type String
	 * @lang en
	 */
	this.password = "";
}

/**
 * @private
 */
SSMILib.CsvSet.AuthInformation.prototype.toXmlNode = function(xml)
{
	var _authInfo = null;
	if(this.source){
		_authInfo = xml.createElement("AuthInformation");
		var _source = _authInfo.appendChild(xml.createElement("Source"));
		_source.appendChild(xml.createTextNode(this.source));
		if(this.source == "RegisteredInfo"){
			var _user = _authInfo.appendChild(xml.createElement("User"));
			_user.appendChild(xml.createTextNode(this.user));
			var _password = _authInfo.appendChild(xml.createElement("Password"));
			_password.appendChild(xml.createTextNode(this.password));
		}
	}
	return _authInfo;
}

/**
 * SendInformationインスタンスを作成する<br>
 * 本クラスはCsvSetクラスのSendInformation設定として扱う 
 * @constructor
 * @class カスタム・サービスから外部Webサービスへの情報送信設定のためのクラス
 * @lang ja
 */
/**
 * Creates SendInformation instance.<br>
 * This class handled as SendInformation settings for CsvSet class.
 * @constructor
 * @class Class for setting information send settings upon Custom Service access to external Web service
 * @lang en
 */
SSMILib.CsvSet.SendInformation = function()
{
	/**
	 * 外部Webサービスへデバイス識別情報や認証情報を送信するかどうかの設定
	 * @type Boolean
	 * @lang ja
	 */
	/**
	 * Whether to send device identification information and/or authentication information to external Web service.
	 * @type Boolean
	 * @lang en
	 */
	this.status = false;
	
	/**
	 * 外部Webサービスへ送信する情報のタイプ<br>
	 * status(認証情報を送信する）場合に設定される。
	 * 		Private			: FXサービス形式<br>
	 * 		Public			: 公開形式(ICカードIDを含まない)<br>
	 * 		PublicICCardID	: 公開形式(ICカードIDを含む)<br>
	 * 
	 * statusがtrueの時に本要素が省略された場合、Privateが設定されたと見なす。<br>
	 * @type String
	 * @lang ja
	 */
	/**
	 * Format of information to send to external Web service.<br>
	 * 		Private: FX service format<br>
	 * 		Public: Public format (does not include IC card ID)<br>
	 * 		PublicICCardID:  Public format (includes IC card ID)<br>
	 * If this element is omitted and "status" is set to true, operations are as when "Private" is set.<br>
	 * @type String
	 * @lang en
	 */
	this.type = "";
}

/**
 * @private
 */
SSMILib.CsvSet.SendInformation.prototype.toXmlNode = function(xml)
{
	var _sendInfo = xml.createElement("SendInformation");
	var _status = _sendInfo.appendChild(xml.createElement("Status"));
	_status.appendChild(xml.createTextNode(this.status));
	if(this.status){
		var _type = _sendInfo.appendChild(xml.createElement("Type"));
		if(this.type){
			_type.appendChild(xml.createTextNode(this.type));
		}else{//Statusがtrueの時に本要素が省略された場合、Privateを意味する
			_type.appendChild(xml.createTextNode("Private"));
		}
	}
	return _sendInfo;
}

/**
 * ServiceAccessRuleインスタンスを作成する<br>
 * 本クラスはCsvSetクラスのServiceAccessRule設定として扱う
 * @constructor
 * @class カスタム・サービスへのアクセス制限設定のためのクラス
 * @lang ja
 */
/**
 * Creates ServiceAccessRule instance.
 * This class handled as ServiceAccessRule settings for CsvSet class.<br>
 * @constructor
 * @class Class for setting Custom Service access restrictions
 * @lang en
 */
SSMILib.CsvSet.ServiceAccessRule = function()
{
	/**
	 * カスタム･サービス利用時の認証要・不要
	 * @type Boolean
	 * @lang ja
	 */
	/**
	 * Whether authentication is required to use Custom Service
	 * @type Boolean
	 * @lang en
	 */
	this.authenticate = true;
	
	/**
	 * 未認証時のデバイストップメニュー上でのボタン表示
	 * @type Boolean
	 * @lang ja
	 */
	/**
	 * Whether to show Custom Service icon on All Services screen when user is not authenticated to device
	 * @type Boolean
	 * @lang en
	 */
	this.visible = true;
}

/**
 * @private
 */
SSMILib.CsvSet.ServiceAccessRule.prototype.toXmlNode = function(xml)
{
	var _serviceAccessRule = xml.createElement("ServiceAccessRule");
	var _authenticate = _serviceAccessRule.appendChild(xml.createElement("Authenticate"));
	_authenticate.appendChild(xml.createTextNode(this.authenticate));
	var _visible = _serviceAccessRule.appendChild(xml.createElement("Visible"));
	_visible.appendChild(xml.createTextNode(this.visible));

	return _serviceAccessRule;
}

/**
 * @private
 */
Extend(SSMILib.CsvSet.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.CsvSet.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;
	
	var csvNs = "http://www.fujifilm.com/fb/2021/01/ssm/management/csv";
	xml.addNSPrefix(csvNs, "csv");
	
	var _setCsvNode = body.appendChild(xml.createElementNS(csvNs, "SetCsv"));
	xml.addNSDeclaration(csvNs, _setCsvNode, true);

	var _name = _setCsvNode.appendChild(xml.createElement("Name"));
	_name.appendChild(xml.createTextNode(this.name));

	var _description = _setCsvNode.appendChild(xml.createElement("Description"));
	_description.appendChild(xml.createTextNode(this.description));

	var _vendorName = _setCsvNode.appendChild(xml.createElement("VendorName"));
	_vendorName.appendChild(xml.createTextNode(this.vendorName));
	
	var _isNative = _setCsvNode.appendChild(xml.createElement("IsNative"));
	_isNative.appendChild(xml.createTextNode(this.isNative));
	
	var _smallIcon = _setCsvNode.appendChild(xml.createElement("SmallIconUrl"));
	_smallIcon.appendChild(xml.createTextNode(this.smallIconUrl));
	
	var _largeIcon = _setCsvNode.appendChild(xml.createElement("LargeIconUrl"));
	_largeIcon.appendChild(xml.createTextNode(this.largeIconUrl));
	
	var _url = _setCsvNode.appendChild(xml.createElement("URL"));
	_url.appendChild(xml.createTextNode(this.url));
	
	var _descriptionUrl = _setCsvNode.appendChild(xml.createElement("DescriptionUrl"));
	_descriptionUrl.appendChild(xml.createTextNode(this.descriptionUrl));
	
	var _isDisabled = _setCsvNode.appendChild(xml.createElement("IsDisabled"));
	_isDisabled.appendChild(xml.createTextNode(this.isDisabled ));
	
	var _provides = _setCsvNode.appendChild(xml.createElement("Provides"));
	_provides.appendChild(xml.createTextNode(this.provides));
	
	//カスタム・サービスの起動タイミング、複数のタイミングを指定可能
	var _startTiming = _setCsvNode.appendChild(xml.createElement("StartTiming"));
	if(this.timing && this.timing.length > 0){
		for(var i=0; i<this.timing.length; i++){
			if(this.timing[i]){
				var _timing = _startTiming.appendChild(xml.createElement("Timing"));
				_timing.appendChild(xml.createTextNode(this.timing[i]));
			}
		}
	}
	
	var _displayNode = _setCsvNode.appendChild(xml.createElement("DisplayMode"));
	var _toolbar = _displayNode.appendChild(xml.createElement("ToolBar"));
	var _statusBar = _displayNode.appendChild(xml.createElement("StatusBar"));
	if(this.displayMode == "toolbar"){
		_toolbar.appendChild(xml.createTextNode("true"));
		_statusBar.appendChild(xml.createTextNode("false"));
	}else if(this.displayMode == "statusbar"){
		_toolbar.appendChild(xml.createTextNode("false"));
		_statusBar.appendChild(xml.createTextNode("true"));
	}else{
		_toolbar.appendChild(xml.createTextNode("false"));
		_statusBar.appendChild(xml.createTextNode("false"));
	}
	
	var _authInfoNode = this.authInformation.toXmlNode(xml);
	if(_authInfoNode){
		_setCsvNode.appendChild(_authInfoNode);
	}
	
	_setCsvNode.appendChild(this.sendInformation.toXmlNode(xml))
	
	var _sendAuthorizeRight = _setCsvNode.appendChild(xml.createElement("SendAuthorizedRight"));
	_sendAuthorizeRight.appendChild(xml.createTextNode(this.sendAuthorizedRight));
	
	_setCsvNode.appendChild(this.serviceAccessRule.toXmlNode(xml));
	
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;
}

/**
 * カスタム・サービスの属性を変更する。<br>
 * 使用できるユーザーは管理者(KO)のみである。<br>
 * 詳細は「02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf 1.カスタム・サービス・スクリプト管理機能」を参照<br>
 * @param {CsvSet} obj カスタム・サービスの属性変更のためのクラス
 * @lang ja
 */
 /**
 * Changes Custom Service settings.<br>
 * Only system administrator (KO user) can use this method.<br>
 * See "02-06 SESAMi Service Management Interface
 * Specification_CustomServiceScript.pdf" for details.<br>
 * @param {CsvSet} obj Class for changing Custom Service settings.
 * @lang en
 */
SSMILib.SetCsv = function(obj)
{
	var _ws = new WebServiceLib.Communicator();
	_ws.async = SSMILib.async;
	_ws.successHandler = SSMILib.SetCsv.successCb;
	_ws.errorHandler = SSMILib.SetCsv.errorCb;
	_ws.soapAction = '"http://www.fujifilm.com/fb/2021/01/ssm/management/csv#SetCsv"';
	_ws.isDeviceReq = true;
	
	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Csv";
	
	var _csvSetObj = new SSMILib.CsvSet();
	
	if(obj.name){
		_csvSetObj.name = obj.name;
	}
	
	if(obj.description){
		_csvSetObj.description = obj.description;
	}
	
	if(obj.vendorName){
		_csvSetObj.vendorName = obj.vendorName;
	}
	
	_csvSetObj.isNative = obj.isNative;
	
	if(obj.smallIconUrl){
		_csvSetObj.smallIconUrl = obj.smallIconUrl;
	}
	
	if(obj.largeIconUrl){
		_csvSetObj.largeIconUrl = obj.largeIconUrl;
	}
	
	if(obj.url){
		_csvSetObj.url = obj.url;
	}
	
	if(obj.descriptionUrl){
		_csvSetObj.descriptionUrl = obj.descriptionUrl;
	}
	
	_csvSetObj.isDisabled = obj.isDisabled;
	
	if(obj.provides){
		_csvSetObj.provides = obj.provides;
	}
	
	if(obj.timing && obj.timing.length > 0){
		_csvSetObj.timing = obj.timing;
	}
	
	if(obj.displayMode){
		_csvSetObj.displayMode = obj.displayMode;
	}
	
	_csvSetObj.authInformation = obj.authInformation;
	_csvSetObj.sendInformation = obj.sendInformation;
	_csvSetObj.sendAuthorizedRight = obj.sendAuthorizedRight;
	_csvSetObj.serviceAccessRule = obj.serviceAccessRule;
	
	var _msg = _csvSetObj.serializeToString();
	_ws.send(_targetURL, _msg);
	return;
}

/**
 * @private
 */
SSMILib.SetCsv.successCb = function(res)
{
	var _result = false;
	
	if(!res.responseXML){
		SSMILib.onEvent("SetCsv", _result, null);
		return;
	}
	
	var _resNode = res.responseXML.getElementsByTagNameNS("http://www.fujifilm.com/fb/2021/01/ssm/management/csv", "SetCsvResponse");
	
	if(_resNode.length){
		_result = true;
	}
	
	SSMILib.onEvent("SetCsv", _result, null);
	return;	
}

/**
 * @private
 */
SSMILib.SetCsv.errorCb = function(res)
{
	var _result = false;
	
	SSMILib.onEvent("SetCsv", _result, null);
	return;
}