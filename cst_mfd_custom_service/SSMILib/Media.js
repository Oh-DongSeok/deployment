/**
 * @fileoverview メディアの情報取得、設定するクラス定義<br>
 * 以下のメソッドを提供する<br>
 * GetMediaInformation<br>
 * GetMediaPrintMode<br>
 * SetMediaPrintMode<br>
 * StartMediaScan<br>
 * GetMediaContentCount<br>
 * GetMediaResourceInformation<br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/**
 * @fileoverview Defines classes that retrieve information on media and set the mode<br>
 * Provides the following methods.<br>
 * GetMediaInformation<br>
 * GetMediaPrintMode<br>
 * SetMediaPrintMode<br>
 * StartMediaScan<br>
 * GetMediaContentCount<br>
 * GetMediaResourceInformation<br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2012 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class メディアプリントサービスモードを定義するクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines Media Print service mode
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.MEDIA_SERVICEMODE = function(){};

/**
 * プリントサービスモードが文書プリントモードであることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that Print service mode is printing of documents input from external media
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_SERVICEMODE.TEXTPRINT = "TextPrint";

/**
 * プリントサービスモードがデジカメプリントモードであることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that Print service mode is printing of pictures input from a digital camera.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_SERVICEMODE.PHOTOPRINT = "PhotoPrint";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class リソースタイプを定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines resource type
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.MEDIA_RESOURCETYPE = function(){};

/**
 * リソースタイプがディレクトリであることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that resource type is directory
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_RESOURCETYPE.DIRECTORY = "Directory";

/**
 * リソースタイプがファイルであることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that resource type is file
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_RESOURCETYPE.FILE = "File";

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class メディア内リソースに対するソートキーを定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines the sort key for resources in media
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 */
SSMILib.MEDIA_SORTKEY = function(){};

/**
 * ソートキーがファイルのインデックス番号であることを表す。<br>
 * ディレクトリに対しては使用できない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that sort key is index numbers of files
 * This cannot be used for directory
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_SORTKEY.INDEX = "Index";

/**
 * ソートキーが名前であることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that sort key is name.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_SORTKEY.NAME = "Name";

/**
 * ソートキーが更新日時であることを表す。
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Represents that sort key is updated date and time.
 * @final
 * @type String
 * @constant
 * @lang en
 */
SSMILib.MEDIA_SORTKEY.DATETIME = "DateTime";

/**
 * MediaInformationインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class メディア自体の情報を取得するためのクラス
 * @lang ja
 */
/**
 * Creates MediaInformation instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class retrieves information on media
 * @lang en
 */
SSMILib.MediaInformation = function(){};

/**
 * @private
 */
Extend(SSMILib.MediaInformation.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.MediaInformation.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mediaNs = "http://www.fujixerox.co.jp/2012/05/ssm/management/media";
	xml.addNSPrefix(mediaNs, "md");

	var mediaInfoNode = body.appendChild(xml.createElementNS(mediaNs, "GetMediaInformation"));
	xml.addNSDeclaration(mediaNs, mediaInfoNode, true);
	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * メディア自体の情報を取得する
 * 取得に成功すると、メディア自体の情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「02-12 SESAMi Service Management Interface Specification_Media」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する
 * @static
 * @lang ja
 */
/**
 * Retrieves information on media
 * If information is retrieved successfully, object with information on media as its properties is returned in an array.
 * See "02-12 SESAMi Service Management Interface Specification_Media" for details.
 * @param {Bool} auth  Whether device requires authentication or not.
 * @static
 * @lang en
 */
SSMILib.GetMediaInformation = function(auth)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.GetMediaInformation.successCb;
	ws.errorHandler = SSMILib.GetMediaInformation.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#GetMediaInformation"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		SSMILib.onEvent("GetMediaInformation", true, {TotalCapacity:"1000", RemainingCapacity:"500"});
		return;
	}

	var mediaInfo = new SSMILib.MediaInformation();
	var msg = mediaInfo.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaInformation.successCb = function(res)
{
	var mediaInfo = null;
	var result = false;
	if(!res.responseXML){
		SSMILib.onEvent("GetMediaInformation", result, null);
		return;
	}

	var resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "GetMediaInformationResponse");
	if(resNode && resNode[0].hasChildNodes()){
		var resNodeLen = resNode[0].childNodes.length;
		mediaInfo = new Object();
		for(var i=0; i<resNodeLen; i++){
			var childNode = resNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text) , 4(CDATA)....
			if(childNode.nodeType != 1 || !childNode.hasChildNodes()){//ELEMENT_NODE以外、不要なノードを飛ばす
				continue;
			}
			var property = childNode.localName;
			var value = childNode.firstChild.nodeValue;
			mediaInfo[property] = value;
		}
		result = true;
	}

	SSMILib.onEvent("GetMediaInformation", result, mediaInfo);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaInformation.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("GetMediaInformation", false, fault);
	return;
};

/**
 * MediaPrintインスタンスを作成する
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class プリントサービスモードを取得、設定するためのクラス
 * @lang ja
 */
/**
 * Creates MediaPrint instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class retrieves and sets Print service mode
 * @lang en
 */
SSMILib.MediaPrint = function(type)
{
	/**
	 * 動作方式(メディアサービスモードの取得あるいは設定)を指定する。
	 * @type String
	 * @default なし
	 * @private
	 * @lang ja
	 */
	this.type = (type)? type : "";

	/**
	 * プリントサービスモードを指定する。
	 * @type SSMILib.MEDIA_SERVICEMODE
	 * @default null
	 * @lang ja
	 */
	/**
	 * Print Service mode
	 * @type SSMILib.MEDIA_SERVICEMODE
	 * @default null
	 * @lang en
	 */
	this.mode = "";
};

/**
 * @private
 */
Extend(SSMILib.MediaPrint.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.MediaPrint.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mediaNs = "http://www.fujixerox.co.jp/2012/05/ssm/management/media";
	xml.addNSPrefix(mediaNs, "md");

	var mediaServiceModeNode = body.appendChild(xml.createElementNS(mediaNs, this.type));

	if(this.type == "SetMediaServiceMode" && this.mode){
		mediaServiceModeNode.appendChild(xml.createElementNSwithText(mediaNs, "ServiceMode", this.mode));
	}

	xml.addNSDeclaration(mediaNs, mediaServiceModeNode, true);
	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * プリントサービスモードを取得する。
 * 取得に成功すると、プリントサービスモードの情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「02-12 SESAMi Service Management Interface Specification_Media.doc」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @static
 * @lang ja
 */
/**
 * Retrieves Print Service mode.
 * If retrieval succeeds, object with information on Print service mode as its properties is returned in an array.
 * See "02-12 SESAMi Service Management Interface Specification_Media" for details.
 * @param {Bool} auth  Whether device requires authentication or not.
 * @static
 * @lang en
 */
SSMILib.GetMediaPrintMode = function(auth)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.GetMediaPrintMode.successCb;
	ws.errorHandler = SSMILib.GetMediaPrintMode.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#GetMediaServiceMode"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		SSMILib.onEvent("GetMediaPrintMode", true, "TextPrint");
		return;
	}

	var mediaPrint = new SSMILib.MediaPrint("GetMediaServiceMode");
	var msg = mediaPrint.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaPrintMode.successCb = function(res)
{
	var serviceMode = null;
	var result = false;
	if(!res.responseXML){
		SSMILib.onEvent("GetMediaPrintMode", result, null);
		return;
	}

	var resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "ServiceMode");
	if(resNode.length){
		serviceMode = resNode[0].firstChild.nodeValue;
		result = true;
	}

	SSMILib.onEvent("GetMediaPrintMode", result, serviceMode);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaPrintMode.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("GetMediaPrintMode", false, fault);
	return;
};

/**
 * メディアを利用するプリントサービスモードを指定する。
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @param {SSMILib.MediaPrint} obj プリントサービスモードを設定するためのクラス。
 * @static
 * @lang ja
 */
/**
 * Print Service mode that uses media.
 * @param {Bool} auth  Whether device requires authentication or not.
 * @param {SSMILib.MediaPrint} obj This class sets Print Service mode.
 * @static
 * @lang en
 */
SSMILib.SetMediaPrintMode = function(auth, obj)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.SetMediaPrintMode.successCb;
	ws.errorHandler = SSMILib.SetMediaPrintMode.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#SetMediaServiceMode"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		SSMILib.onEvent("SetMediaPrintMode", true, null);
		return;
	}

	var mediaPrint = new SSMILib.MediaPrint("SetMediaServiceMode");
	mediaPrint.mode = obj.mode;

	var msg = mediaPrint.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.SetMediaPrintMode.successCb = function(res)
{
	var result = false;
	if(!res.responseXML){
		SSMILib.onEvent("SetMediaPrintMode", result, null);
		return;
	}

	var resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "SetMediaServiceModeResponse");
	if(resNode.length){
		result = true;
	}

	SSMILib.onEvent("SetMediaPrintMode", result, null);
	return;	
};

/**
 * @private
 */
SSMILib.SetMediaPrintMode.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("SetMediaPrintMode", false, fault);
	return;
};

/**
 * MediaScanインスタンスを作成する。
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class メディアに文書をスキャンするために用いられるクラス
 * @lang ja
 */
/**
 * Creates MediaScan instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class is used for scanning and storing document to media.
 * @lang en
 */
SSMILib.MediaScan = function(){};

/**
 * @private
 */
Extend(SSMILib.MediaScan.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.MediaScan.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mediaNs = "http://www.fujixerox.co.jp/2012/05/ssm/management/media";
	xml.addNSPrefix(mediaNs, "md");

	var mediaScanServiceNode = body.appendChild(xml.createElementNS(mediaNs, "StartMediaScanService"));
	xml.addNSDeclaration(mediaNs, mediaScanServiceNode, true);
	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * メディアへのスキャンサービスの開始を宣言する。<br>
 * メディアへのスキャン開始前にコールする必要がある
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @static
 * @lang ja
 */
/**
 * Announces to start Scan service of which the scanned image is stored to media.<br>
 * This element must be called before Scan service of which the scanned image is stored to media is started.
 * @param {Bool} auth  Whether device requires authentication or not.
 * @static
 * @lang en
 */
SSMILib.StartMediaScan = function(auth)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.StartMediaScan.successCb;
	ws.errorHandler = SSMILib.StartMediaScan.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#StartMediaScanService"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		SSMILib.onEvent("StartMediaScan", true, null);
		return;
	}

	var mediaScan = new SSMILib.MediaScan();
	var msg = mediaScan.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.StartMediaScan.successCb = function(res)
{
	var result = false;
	if(!res.responseXML){
		SSMILib.onEvent("StartMediaScan", result, null);
		return;
	}

	var resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "StartMediaScanServiceResponse");
	if(resNode.length){
		result = true;
	}

	SSMILib.onEvent("StartMediaScan", result, null);
	return;	
};

/**
 * @private
 */
SSMILib.StartMediaScan.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("StartMediaScan", false, fault);
	return;
};

/**
 * MediaContentCountインスタンスを作成する。
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class メディアのコンテンツ数を取得するためのクラス。
 * @lang ja
 */
/**
 * Creates MediaContentCount instance.
 * @constructor
 * @extends XMLLib.SOAPMsg
 * @class This class retrieves the number of contents in media.
 * @lang en
 */
SSMILib.MediaContentCount = function(){};

/**
 * @private
 */
Extend(SSMILib.MediaContentCount.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.MediaContentCount.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mediaNs = "http://www.fujixerox.co.jp/2012/05/ssm/management/media";
	xml.addNSPrefix(mediaNs, "md");

	var mediaContentCountNode = body.appendChild(xml.createElementNS(mediaNs, "GetMediaContentCount"));
	xml.addNSDeclaration(mediaNs, mediaContentCountNode, true);
	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * メディア内のコンテンツ数を取得する。
 * 取得に成功すると、メディア内のコンテンツ数をプロパティとしてもつオブジェクトが返る。
 * プロパティ詳細については「02-12 SESAMi Service Management Interface Specification_Media.doc」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @static
 * @lang ja
 */
/**
 * Retrieves number of contents in media.
 * If retrieval succeeds, object with the number of contents in media as its properties is returned as an array.
 * See "02-12 SESAMi Service Management Interface Specification_Media" for details.
 * @param {Bool} auth Whether deivce is in authentication mode
 * @static
 * @lang en
 */
SSMILib.GetMediaContentCount = function(auth)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.GetMediaContentCount.successCb;
	ws.errorHandler = SSMILib.GetMediaContentCount.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#GetMediaContentCount"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		SSMILib.onEvent("GetMediaContentCount", true, 32);
		return;
	}

	var mediaContentCount = new SSMILib.MediaContentCount();
	var msg = mediaContentCount.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaContentCount.successCb = function(res)
{
	var mediaContentCount = null;
	var result = false;
	if(!res.responseXML){
		SSMILib.onEvent("GetMediaContentCount", result, null);
		return;
	}

	var resNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "Count");
	if(resNode.length){
		mediaContentCount = resNode[0].firstChild.nodeValue;
		result = true;
	}

	SSMILib.onEvent("GetMediaContentCount", result, mediaContentCount);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaContentCount.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("GetMediaContentCount", false, fault);
	return;
};

/**
 * MediaResourceインスタンスを作成する。
 * @constructor
 * @public
 * @extends XMLLib.SOAPMsg
 * @class メディア内のディレクトリ/ファイルの情報を取得するためのクラス。
 * @lang ja
 */
/**
 * Creates MediaResource instance.
 * @constructor
 * @public
 * @extends XMLLib.SOAPMsg
 * @class This class retrieves information on directory/file in media.
 * @lang en
 */
SSMILib.MediaResource = function()
{
	/**
	 * メディア内の情報を取得するディレクトリを指定する。
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Directory from which to retrieve information in media.
	 * @type String
	 * @default null
	 * @lang en
	 */
	this.directoryPath = "";

	/**
	 * メディア内の情報を取得するパラメタを1つもしくは2つ指定する。<br>
	 * 1つめはディレクトリ情報を取得するためのパラメタ、2つめはファイル情報を取得するためのパラメタである。
	 * @type Array(SSMILib.MediaResource.Query)
	 * @default new Array()
	 * @lang ja
	 */
	/**
	 * One or two parameters from which to retrieve information in media.<br>
	 * One is a parameter for retrieving information on directory and the other is for retrieving information on file.
	 * @type Array(SSMILib.MediaResource.Query)
	 * @default new Array()
	 * @lang en
	 */
	this.queries = new Array();
};

/**
 * Queryインスタンスを作成する。
 * @constructor
 * @public
 * @class メディア内の情報を取得するパラメタを設定するためのクラス。
 * @lang ja
 */
/**
 * Creates Query instance.
 * @constructor
 * @public
 * @class This class sets parameters for retrieving information in media.
 * @lang en
 */
SSMILib.MediaResource.Query = function()
{
	/**
	 * リソースタイプを指定する。
	 * @type SSMILib.MEDIA_RESOURCETYPE
	 * @default null
	 * @lang ja
	 */
	/**
	 * Specifies resource type.
	 * @type SSMILib.MEDIA_RESOURCETYPE
	 * @default null
	 * @lang en
	 */
	this.resource = "";

	/**
	 * ソートキーを指定する。
	 * @type SSMILib.MEDIA_SORTKEY
	 * @default なし
	 * @lang ja
	 */
	/**
	 * Specifies sort key.
	 * @type SSMILib.MEDIA_SORTKEY
	 * @default null
	 * @lang en
	 */
	this.sortKey = "";

	/**
	 * ソート順を指定する。
	 * @type SSMILib.SORTORDER
	 * @default SSMILib.SORTORDER.ASC
	 * @lang ja
	 */
	/**
	 * Specifies sorting order.
	 * @type SSMILib.SORTORDER
	 * @default SSMILib.SORTORDER.ASC
	 * @lang en
	 */
	this.sortOrder = SSMILib.SORTORDER.ASC;

	/**
	 * 取得を開始する位置を指定する。
	 * 先頭は0であり、省略された場合は0が指定されたものとする。
	 * @type Int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Position to start retrieval.
	 * The top is 0, and if designation is omitted, it is deemed that 0 is specified. 
	 * @type Int
	 * @default null
	 * @lang en
	 */
	this.scopeOffset = null;

	/**
	 * 取得するリソースの最大数を指定する。
	 * 省略された場合は全てのリソースを取得する。
	 * @type Int
	 * @default null
	 * @lang ja
	 */
	/**
	 * Maximum number of resources to retrieve. 
	 * If designation is omitted, all resources are retrieved.  
	 * @type Int
	 * @default null
	 * @lang en
	 */
	this.scopeLimit = null;
};

/**
 * @private
 */
Extend(SSMILib.MediaResource.prototype, XMLLib.SOAPMsg.prototype);

/**
 * @private
 */
SSMILib.MediaResource.prototype.createMsg = function()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

	var mediaNs = "http://www.fujixerox.co.jp/2012/05/ssm/management/media";
	xml.addNSPrefix(mediaNs, "md");
	var mediaResourceNode = body.appendChild(xml.createElementNS(mediaNs, "GetMediaResourceInformation"));
	xml.addNSDeclaration(mediaNs, mediaResourceNode, true);

	if(this.directoryPath){
		mediaResourceNode.appendChild(xml.createElementNSwithText(mediaNs, "DirectoryPath", this.directoryPath));
	}

	var maxQuery = 2;
	if(this.queries.length > 0){
		var queriesLength = (this.queries.length > maxQuery)? maxQuery : this.queries.length;
		for(var i=0; i<queriesLength; i++){
			if(this.queries[i]){
				var queryNode = mediaResourceNode.appendChild(xml.createElementNS(mediaNs, "Query"));
				var query = this.queries[i];
				if(query.resource){
					queryNode.appendChild(xml.createElementNSwithText(mediaNs, "Resource", query.resource));
				}

				if(query.sortKey){
					var sortByNode = queryNode.appendChild(xml.createElementNSwithText(mediaNs, "SortBy", query.sortKey));
					if(query.sortOrder){
						sortByNode.setAttribute("order", query.sortOrder);
					}
				}

				//AR160332 
				/*if(query.scopeOffset || query.scopeLimit){
					var scopeNode = queryNode.appendChild(xml.createElementNS(mediaNs, "Scope"));
					if(query.scopeOffset){
						scopeNode.appendChild(xml.createElementNSwithText(mediaNs, "Offset", query.scopeOffset));
					}
					if(query.scopeLimit){
						scopeNode.appendChild(xml.createElementNSwithText(mediaNs, "Limit", query.scopeLimit));
					}
				}*/
				if(query.scopeOffset != null || query.scopeLimit != null){
					var scopeNode = queryNode.appendChild(xml.createElementNS(mediaNs, "Scope"));
					if(query.scopeOffset != null){
						scopeNode.appendChild(xml.createElementNSwithText(mediaNs, "Offset", query.scopeOffset));
					}
					if(query.scopeLimit != null){
						scopeNode.appendChild(xml.createElementNSwithText(mediaNs, "Limit", query.scopeLimit));
					}
				}
			}
		}
	}

	env.appendChild(body);
	var soapMsg = xml.rootElement;
	return soapMsg;
};

/**
 * メディア内のディレクトリ/ファイルの情報を取得する。
 * 取得に成功すると、メディア内のディレクトリ/ファイルの情報をプロパティとしてもつオブジェクトが配列で返る。
 * プロパティ詳細については「02-12 SESAMi Service Management Interface Specification_Media.doc」を参照
 * @param {Bool} auth デバイスが認証モードか否かを指定する。
 * @param {SSMILib.MediaResource} obj メディア内のディレクトリ/ファイルの情報を取得するためのクラス。
 * @static
 * @lang ja
 */
/**
 * Retrieves information on directory/file in media. 
 * If retrieval succeeds, object with information on directory/file in media as its properties is returned as an array. 
 * See "02-12 SESAMi Service Management Interface Specification_Media" for details.
 * @param {Bool} auth   Whether device requires authentication or not.
 * @param {SSMILib.MediaResource} obj 
 * @static
 * @lang en
 */
SSMILib.GetMediaResourceInformation = function(auth, obj)
{
	var ws = new WebServiceLib.Communicator();
	ws.async = SSMILib.async;
	ws.successHandler = SSMILib.GetMediaResourceInformation.successCb;
	ws.errorHandler = SSMILib.GetMediaResourceInformation.errorCb;
	ws.soapAction = '"http://www.fujixerox.co.jp/2012/05/ssm/management/media#GetMediaResourceInformation"';
	ws.isDeviceReq = true;

	var targetURL = "";
	if(auth){
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Media";
	}else{
		targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/Anonymous/Media";
	}

	if(SSMILib.dummy){
		var mediaResourceInfo = new Array();
		var dirs = new Array({DirectoryPath : '/', Name : "test1", DateTime : "2012-05-11"}, {DirectoryPath : '/', Name : "test2", DateTime : "2012-05-12"});
		mediaResourceInfo.push(dirs);
		mediaResourceInfo.push(new Array());
		SSMILib.onEvent("GetMediaResourceInformation", true, mediaResourceInfo);
		return;
	}

	var mediaResource = obj;
	var msg = mediaResource.serializeToString();
	ws.send(targetURL, msg);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaResourceInformation.successCb = function(res)
{
	var directories = new Array();
	var files = new Array();
	var mediaResourceInfo = null;
	var result = false;

	if(!res.responseXML){
		SSMILib.onEvent("GetMediaResourceInformation", result, null);
		return;
	}

	var directoriesNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "Directories");
	if((directoriesNode.length > 0) && (directoriesNode[0].hasChildNodes())){
		var directoriesNodeLen = directoriesNode[0].childNodes.length;
		for(var i = 0; i < directoriesNodeLen; i++){
			var directory = directoriesNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text), 4(CDATA)....
			if(directory.nodeType != 1 || !directory.hasChildNodes()){//ELEMENT_NODE以外、不要なノードは除外
				continue;
			}
			directories.push(SSMILib.childNodeToProperty(directory));
		}
	}

	var filesNode = res.responseXML.getElementsByTagNameNS("http://www.fujixerox.co.jp/2012/05/ssm/management/media", "Files");
	if((filesNode.length > 0) && (filesNode[0].hasChildNodes())){
		var filesNodeLen = filesNode[0].childNodes.length;
		for(var i = 0; i < filesNodeLen; i++){
			var file = filesNode[0].childNodes[i];
			//nodeType = 1(element), 2(attribute), 3(text), 4(CDATA)....
			if(file.nodeType != 1 || !file.hasChildNodes()){//ELEMENT_NODE以外、不要なノードは除外
				continue;
			}
			files.push(SSMILib.childNodeToProperty(file));
		}
	}

	result = true;
	mediaResourceInfo = new Array();
	mediaResourceInfo.push(directories);
	mediaResourceInfo.push(files);

	SSMILib.onEvent("GetMediaResourceInformation", result, mediaResourceInfo);
	return;
};

/**
 * @private
 */
SSMILib.GetMediaResourceInformation.errorCb = function(res)
{
	var fault = SSMILib.CreateSoapFaultObj(res);
	SSMILib.onEvent("GetMediaResourceInformation", false, fault);
	return;
};