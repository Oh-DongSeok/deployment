/**
 * @fileoverview コンテンツを簡易に扱うためのフレームワークを記述するファイル<br><br>
 * フレームワークとしてコンテンツ共通の以下の動作が用意される<br>
 * ・保守情報ポップアップ表示<br>
 * ・イベントログ表示<br>
 * 使用にはWidgetLib/SSMILib/BrowserExt/BrowserLibのインクルードが必要となる。<br>
 * また、WebDAVLibを利用する場合には、ContentsLib.jsの前にWebDAVLib.jsをインクルードする必要がある。<br>
 *
 * @author Copyright(C) 2009-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.2.1
 * @lang ja
 */
/**
 * @fileoverview This file contains description on framework for handling Custom Service applications.<br><br>
 * The following are prepared as features common to all Custom Service applications:<br>
 * - Maintenance information popup display<br>
 * - Event log display<br>
 * To use these features, WidgetLib/SSMILib/BrowserExt must be included.<br>
 * To use WebDAVLib, WebDAVLib.js must be included before ContentsLib.js.<br>
 *
 * @author Copyright(C) 2009-2011 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.2.1
 * @lang en
 */
/**
 * ContentsLib自身を表すクラス
 * @namespace
 * @static
 * @lang ja
 */
/**
 * Class representing ContentsLib itself.
 * @namespace
 * @static
 * @lang en
 */
var ContentsLib = {
	
	/**
	 * カスタムサービススクリプトライブラリ(CSLib)のバージョンを表す
	 *	@constant
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * CSLib version.
	 *	@constant
	 * @type String
	 * @default null
	 * @lang en
	 */
	CSLibVersion: "3.2.6",
	
	/**
	 * コンテンツフレームワークのバージョンを表す
	 *	@constant
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Contents framework version.
	 *	@constant
	 * @type String
	 * @default null
	 * @lang en
	 */
	version: "1.2.1",
	
	/**
	 * コンテンツ識別子を表す
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service application ID.
	 * @type String
	 * @default null
	 * @lang en
	 */
	contentsId: "",

	/**
	 * コンテンツのバージョンを表す
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service application version.
	 * @type String
	 * @default null
	 * @lang en
	 */
	contentsVersion: "",

	/**
	 * コンテンツ名を表す
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service application name.
	 * @type String
	 * @default null
	 * @lang en
	 */
	contentsName: "",

	/**
	 * コンテンツのCopyright情報を表す
	 * @type String
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service application Copyright information.
	 * @type String
	 * @lang en
	 */
	contentsCopyRight: "Copyright(C) 2023 FUJIFILM Business Innovation Korea Co., Ltd. All rights reserved.",

	/**
	 * コンテンツのアイコンURLを表す
	 * @type String
	 * @default null
	 * @default null
	 * @lang ja
	 */
	/**
	 * Custom Service application icon URL.
	 * @type String
	 * @default null
	 * @lang en
	 */
	contentsIcon: "",

	/** @private 
	 *  @constant
	**/
	nsCsProp: "http://www.fujixerox.co.jp/2008/01/cmfp/prop",

	serialNumber: "",
	trackingId: "",
	debug: false
};


/**
 * 初期化処理を行う<br>
 * <br>
 * 本関数をコールすることでフレームワークの各関数が使用可能となる。<br>
 * 本関数内でBrowserExt/WidgetLib/SSMILibの初期化が自動で行われるため、
 * 別途初期化処理は不要である。<br>
 * 本フレームワークでは、イベントをフレームワークでまとめて受けるため、
 * 以下のAPIは使用してはならない<br>
 * BrowserExt.SetCaptureEvent()<br>
 * WidgetLib.setEventListener()<br>
 * SSMILib.setEventListener()<br>
 * WebDAVLib.setEventListener()<br>
 * 
 * 
 * 
 * @addon
 * @static
 * @lang ja
 */
/**
 * Initializes Custom Service application information.<br>
 * By calling this function, framework functions are made available.<br>
 * BrowserExt/WidgetLib/SSMILib are automatically initialized as well in this function; these, therefore, need not be separately initialized.<br>
 * In this framework, events are captured by the framework; therefore, the following API must not be used:<br>
 * BrowserExt.SetCaptureEvent()<br>
 * WidgetLib.setEventListener()<br>
 * SSMILib.setEventListener()<br>
 * WebDAVLib.setEventListener()<br>
 * 
 * @addon
 * @static
 * @lang en
 */
 
ContentsLib.init = function()
{
	this._infoCount = 0;
	this._displayInfo = false;
	this._displayLog = false;
	this._eventLogs = new Array();

	BrowserExt.Init();
	BrowserExt.SetCaptureEvent(ContentsLib._onHardKeyEvent);

	WidgetLib.init();
	WidgetLib.setEventListener(ContentsLib._onWidgetEvent);

	SSMILib.init();
	SSMILib.setEventListener(ContentsLib._onSSMIEvent);

	//Event handling for WebDAVLib added; M. Yamada 20101109
	if(typeof WebDAVLib != 'undefined'){	//Checking whether WebDAVLib included; M. Yamada 20110113
	    WebDAVLib.init(gHost);
	    WebDAVLib.setEventListener(ContentsLib._onWebDAVEvent);
	}

	var _lang = "en";
	if (BrowserLib.getBrowserType() != BrowserLib.BrowserType["ETC"]) {
		_lang = BrowserExt.GetAcceptLanguage();
	}
	
	ContentsLib._initTexts(_lang);
	
	BrowserExt.FocusKeyEvent();
	if (WebServiceLib.Communicator != undefined) {
		ContentsLib._getCsProp();
	}
	ContentsLib.writeLog("ContentsLib initialized.");
};

/**
 * ハードキー/SSMIメッセージ/ウィジェットのイベントリスナーを登録する<br>
 * <br>
 * 登録されたリスナーに各種イベントが通知される。<br>
 * すでにリスナーが登録されている場合、リスナーを上書きする。<br>
 * リスナーの第一引数にイベント種別が設定され、第二引数以降には
 * イベント種別に応じて異なる型が設定される<br>
 * ハードキー：イベント種別は"onhardkeydown"、第二引数はkeyCode<br>
 * SSMIメッセージ：<a href = "SSMILib.html#">SSMILib</a>参照のこと<br>
 * ウィジェット：<a href = "WidgetLib.html#">WidgetLib</a>参照のこと<br>
 * WebDAV：<a href = "WebDAVLib.html#">WebDAVLib</a>参照のこと<br>
 * @param {Function} func イベントの通知を受ける関数
 * 
 * @addon
 * @static
 * @lang ja
 */
 /**
 * "Sets event listeners for hardware keys, SSMI messages, and widgets.<br>
 * Events are notified to the respective listeners.<br>
 * Any existing listeners are overwritten.<br>
 * Event type is set as the first argument of the listener, and data types corresponding to the event type is set as the second argument and onward. <br>
 * Hardware key event listeners: event type is "onhardkeydown," and second argument is keyCode<br>
 * SSMI message listeners: See <a href = "SSMILib.html#">SSMILib</a><br>
 * Widget listeners: See <a href = "WidgetLib.html#">WidgetLib</a><br>
 * WebDAV listeners：See <a href = "WebDAVLib.html#">WebDAVLib</a><br>
 * @param {Function} func Function to receive event notification.
 * 
 * @addon
 * @static
 * @lang en
 */
ContentsLib.setListener = function(func)
{
	ContentsLib._hardKeyEventListener = func;
	ContentsLib._ssmiEventListener = func;
	ContentsLib._widgetEventListener = func;
	//Event handling for WebDAVLib added; M. Yamada 20101109
	ContentsLib._webDAVEventListener = func;
};

/**
 * ログを書き込む
 *
 * @param {String} logMessage
 * 
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Writes log.
 *
 * @param {String} logMessage
 * 
 * @addon
 * @static
 * @lang en
 */

ContentsLib.writeLog = function(logMessage)
{
	if (ContentsLib._eventLogs.length > 100) {
		ContentsLib._eventLogs.shift();
	}

	if (logMessage.length < 80) {
		ContentsLib._eventLogs.push(logMessage + "\n");
	} else {
		ContentsLib._eventLogs.push(logMessage.slice(0,79) + "\n");
	}
};

/**
 * BrowserExtからハードキーイベントの通知を受ける
 *
 * @param {String} keyCode
 * 
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Receives hardware key events from BrowserExt.
 *
 * @param {String} keyCode
 * 
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onHardKeyEvent = function(keyCode)
{
	if (ContentsLib._displayInfo) {
		ContentsLib._onInfoPopup("hard_key", keyCode);
		return;
	}

	if (ContentsLib._displayLog) {
		ContentsLib._onLogPopup("hardkey", keyCode);
	}
	
	// ポーズを一定期間押下で情報表示
	if (keyCode == BrowserExt.keyCode.FX_VK_PAUSE) {
		// 2010.12.06 added by A.Orimoto
		if (ContentsLib._infoCount == 0){
			BrowserExt.Beep(0);
		}
		if (ContentsLib._infoCount > 10) {
			ContentsLib._infoCount = 0;
			ContentsLib._startDisplayInfo();
			return;
		} else {
			ContentsLib._infoCount++;
		}
	} else {
		ContentsLib._infoCount = 0;
	}

	if (ContentsLib._hardKeyEventListener) {
		if (ContentsLib._infoCount <= 1) {
			ContentsLib.writeLog("[onhardkeydown] id" + keyCode);
		}
		ContentsLib._hardKeyEventListener("onhardkeydown", keyCode);
	}
};

/**
 * WidgetLibからウィジェットイベントの通知を受ける
 *
 * @param {String} eventType イベント種別
 * @param {String} id イベント発生したウィジェットのID
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Receives widget events from WidgetLib.
 *
 * @param {String} eventType Event type.
 * @param {String} id ID of event origin widget.
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onWidgetEvent = function(eventType, id)
{
	//情報表示中はポップアップの処理を行う
	if (ContentsLib._displayInfo) {
		ContentsLib._onInfoPopup(eventType, id);
		return;
	}

	//ログ表示中はログの処理を行う
	if (ContentsLib._displayLog) {
		ContentsLib._onLogPopup(eventType, id);
		return;
	}

	ContentsLib.writeLog("[" + eventType + "] id:" + id);
	
	if (ContentsLib._widgetEventListener) {
		ContentsLib._widgetEventListener(eventType, id);
	}
};
/**
 * SSMILibからイベントの通知を受ける
 *
 * @param {String} eventType イベント種別
 * @param {String} result true:成功 false:失敗
 * @param {Object} SSMIの結果オブジェクト
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Receives hardware events from SSMILib.
 *
 * @param {String} eventType Event type.
 * @param {String} result true when successful; otherwise false.
 * @param {Object} SSMI result object.
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onSSMIEvent = function(event, result, obj)
{
	//情報表示中
	if (ContentsLib._displayInfo) {
		ContentsLib._onInfoPopup(event, result, obj);
		return;
	}

	//ログ表示中
	if (ContentsLib._displayLog) {
		ContentsLib._onLogPopup(event, result, obj);
		return;
	}

	if (ContentsLib._ssmiEventListener) {
		ContentsLib.writeLog("[" + event + "]" + result);
		ContentsLib._ssmiEventListener(event, result, obj);
	}
};

/**
 * WebDAVLibからイベントの通知を受ける
 *
 * @param {String} eventType イベント種別
 * @param {String} result true:成功 false:失敗
 * @param {Object} WebDAVの結果オブジェクト
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Receives events from WebDAVLib
 *
 * @param {String} eventType Event type.
 * @param {String} result true when successful; otherwise false.
 * @param {Object} WebDAV result object.
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onWebDAVEvent = function(event, result, obj)	//Event handling for WebDAVLib added; M. Yamada 20101109
{
	//情報表示中
	if (ContentsLib._displayInfo) {
		ContentsLib._onInfoPopup(event, result, obj);
		return;
	}

	//ログ表示中
	if (ContentsLib._displayLog) {
		ContentsLib._onLogPopup(event, result, obj);
		return;
	}

	if (ContentsLib._webDAVEventListener) {
		ContentsLib.writeLog("[" + event + "]" + result);
		ContentsLib._webDAVEventListener(event, result, obj);
	}
};
/**
 * 保守情報ポップアップ表示開始
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Starts maintenance information popup display.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._startDisplayInfo = function()
{
	if (WidgetLib.getWidgetNode("maintenance_popup") == null) {
		ContentsLib._registerInfoPopup();
		
	}

	ContentsLib._displayInfo = true;
	document.body.appendChild(WidgetLib.getWidgetNode("maintenance_popup"));
};
/**
 * 保守情報ポップアップ時のイベント
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Event upon maintenance information popup.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onInfoPopup = function(event, id)
{
	if (event == "onbuttonup") {
		switch (id) {
		case "maintenance_close_button":
			BrowserExt.Beep(0);  // AR137884 2010.12.16 added by A.Orimoto
			document.body.removeChild(WidgetLib.getWidgetNode("maintenance_popup"));
			ContentsLib._displayInfo = false;
			return;
		}
	}
	if (event == "hard_key") {
		if (id == BrowserExt.keyCode.FX_VK_MULTIPLY && ContentsLib.debug) {
			document.body.removeChild(WidgetLib.getWidgetNode("maintenance_popup"));
			ContentsLib._displayInfo = false;
			ContentsLib._startDisplayLog();
			return;
		}
	}
};

/**
 * 言語依存情報の設定
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Language-dependent information.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._initTexts = function(lang)
{
	this.texts = new Array();
	switch (lang){
	  case "ja" :
		this.texts["title"] = "カスタム・サービス詳細情報";
		this.texts["close"] = "閉じる";
		this.texts["log_title"] = "ログ情報";
		break;

	  case "ko" :
		this.texts["title"] = "Custom Service 상세 정보";
		this.texts["close"] = "닫기";
		this.texts["log_title"] = "Log Information";
		break;

	  case "zh-tw":
		this.texts["title"] = "自訂服務資訊";
		this.texts["close"] = "關閉";
		this.texts["log_title"] = "Log Information";
		break;
		
	  case "zh" :
	  case "zh-cn" :
		this.texts["title"] = "Custom Service 信息";
		this.texts["close"] = "关闭";
		this.texts["log_title"] = "Log Information";
		break;
		
	  case "th" :
		this.texts["title"] = "Custom Service Information";
		this.texts["close"] = "ปิด";
		this.texts["log_title"] = "Log Information";
		break;
		
	  case "en":
	  default:
		this.texts["title"] = "Custom Service Information";
		this.texts["close"] = "Close";
		this.texts["log_title"] = "Log Information";
		break;
	}
};

/**
 * 保守情報ポップアップの作成
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Creates maintenance information popup.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._registerInfoPopup = function()
{
	/* 表示領域の取得 */
	var _scrType = null;
	if ( BrowserLib ) {
		_scrType = BrowserLib.getScreenType();
	}
	/* 表示開始位置 */
	var closeBtnTop = 0;
	var bgSrc = "./ContentsLib/Base_VerInfo_800-480.png";
	if ( _scrType && _scrType == BrowserLib.ScreenType.WVGA_STATUS_MESSAGE ){
		closeBtnTop = 70;
		bgSrc = "./ContentsLib/Base_VerInfo_800-403.png";
	}
	else if ( _scrType && _scrType == BrowserLib.ScreenType.WVGA_WITH_MENUBAR ){
		closeBtnTop = 40;
		bgSrc = "./ContentsLib/Base_VerInfo_800-440.png";
	}
	
	var _popupElem = document.createElement("div");
	_popupElem.setAttribute("id", "maintenance_popup");
	
	var _lang = "en";
	if (BrowserLib.getBrowserType() != BrowserLib.BrowserType["ETC"]) {
		_lang = BrowserExt.GetAcceptLanguage();
	}
	_popupElem.setAttribute("lang", _lang);

	var _backElem = document.createElement("img");
	_backElem.setAttribute("src", bgSrc);
	_backElem.style.position = "absolute";
	_backElem.style.top = "0px";
	_backElem.style.left = "0px";
	_backElem.style.backgroundRepeat = "no-repeat";
	_popupElem.appendChild(_backElem);

	if (ContentsLib.contentsIcon) {
		var _iconElem = document.createElement("img");
		_iconElem.setAttribute("src", ContentsLib.contentsIcon);
		_iconElem.style.position = "absolute";
		_iconElem.style.top = "81px";
		_iconElem.style.left = "67px";
		_iconElem.style.backgroundRepeat = "no-repeat";
		_popupElem.appendChild(_iconElem);
	}
	
	var _titleElem = document.createElement("div");
	_titleElem.style.position = "absolute";
	_titleElem.style.top = "17px";
	_titleElem.style.left = "60px";
	_titleElem.style.backgroundRepeat = "no-repeat";

	_titleElem.appendChild(document.createTextNode(ContentsLib.texts["title"]));
	_popupElem.appendChild(_titleElem);

	var _idElem = document.createElement("div");
	_idElem.style.position = "absolute";
	_idElem.style.top = "90px";
	_idElem.style.left = "130px";	
	_idElem.style.fontSize = "30px";
	_idElem.style.fontWeight = "bold";
	_idElem.appendChild(document.createTextNode(ContentsLib.contentsId));
	_popupElem.appendChild(_idElem);

	var _verElem = document.createElement("div");
	_verElem.style.position = "absolute";
	_verElem.style.top = "90px";
	_verElem.style.left = "340px";
	_verElem.style.fontSize = "30px";
	_verElem.style.fontWeight = "bold";
	_verElem.appendChild(document.createTextNode(ContentsLib.contentsVersion));
	_popupElem.appendChild(_verElem);

	var _nameElem = document.createElement("div");
	_nameElem.style.position = "absolute";
	_nameElem.style.top = "150px";
	_nameElem.style.left = "70px";
	_nameElem.style.fontSize = "20px";
	_nameElem.style.fontWeight = "bold";
	_nameElem.appendChild(document.createTextNode(ContentsLib.contentsName));
	_popupElem.appendChild(_nameElem);
	
	var _crElem = document.createElement("div");
	_crElem.style.position = "absolute";
	_crElem.style.top = "190px";
	_crElem.style.left = "70px";
	_crElem.style.fontSize = "20px";
	_crElem.style.fontWeight = "bold";
	_crElem.appendChild(document.createTextNode(ContentsLib.contentsCopyRight));
	_popupElem.appendChild(_crElem);


	/* SerialNo, TrackingId領域 */
	if(ContentsLib.trackingId || ContentsLib.serialNumber)
	{
		var _stElem = document.createElement("div");
		_stElem.style.position = "absolute";
		_stElem.style.top = "230px";
		_stElem.style.left = "70px";
		_stElem.style.fontSize = "20px";
		_stElem.style.fontWeight = "bold";
		if (ContentsLib.serialNumber) {
			_stElem.appendChild(document.createTextNode("SN:" + ContentsLib.serialNumber));
		} else {
			_stElem.appendChild(document.createTextNode("TN:" + ContentsLib.trackingId));
		}
		_popupElem.appendChild(_stElem);
	}

	if(ContentsLib.trackingId && ContentsLib.serialNumber)
	{
		var _tnElem = document.createElement("div");
		_tnElem.style.position = "absolute";
		_tnElem.style.top = "270px";
		_tnElem.style.left = "70px";
		_tnElem.style.fontSize = "20px";
		_tnElem.style.fontWeight = "bold";
		_tnElem.appendChild(document.createTextNode("TN:" + ContentsLib.trackingId));
		_popupElem.appendChild(_tnElem);
	}

	var _buttonElem = document.createElement("div");
	_buttonElem.setAttribute("id", "maintenance_close_button");
	_buttonElem.style.position = "absolute";
	_buttonElem.style.top = (400 - closeBtnTop)+ "px";
	_buttonElem.style.left = "330px";
	_buttonElem.style.width = "140px";
	_buttonElem.style.height = "32px";

	var _imgElem = document.createElement("img");
	_imgElem.setAttribute("id", "maintenance_close_button_img");
	_imgElem.setAttribute("src", "./ContentsLib/Com_VerInfo_Off_140-32.png");
	_buttonElem.appendChild(_imgElem);

	var _textElem = document.createElement("div");
	_textElem.style.position = "absolute";
	_textElem.style.width = "140px";
	_textElem.style.textAlign = "center";
	_textElem.style.top = "6px";
//	_textElem.style.left = "40px";
	_textElem.style.fontSize = "20px";
	_textElem.style.fontWeight = "bold";
	_textElem.appendChild(document.createTextNode(ContentsLib.texts["close"]));
	_buttonElem.appendChild(_textElem);
	
	_popupElem.appendChild(_buttonElem);
	
	var _buttonAttr = {targetImgId: "maintenance_close_button_img", offImg: "./ContentsLib/Com_VerInfo_Off_140-32.png", pressImg: "./ContentsLib/Com_VerInfo_Press_140-32.png"};
	WidgetLib.registerButtonWidget(_buttonElem, WidgetLib.ButtonType.NORMAL, _buttonAttr);
	WidgetLib.registerWidget(_popupElem);
	
};

/**
 * ログ情報表示開始
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Starts log information display.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._startDisplayLog = function()
{
	if (WidgetLib.getWidgetNode("log_popup") == null) {
		ContentsLib._registerLogPopup();
	}

	if (!ContentsLib._displayInfo) {
		document.body.appendChild(WidgetLib.getWidgetNode("log_popup"));
		
		var _logText = "";
		for (var i in ContentsLib._eventLogs) {
			_logText += ContentsLib._eventLogs[i];
		}
		var _logElem = document.getElementById("log");
		_logElem.removeChild(_logElem.firstChild);
		_logElem.appendChild(document.createTextNode(_logText));
	}

	ContentsLib._displayLog = true;
};

/**
 * ログ情報ポップアップ時のイベント
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Log information popup event.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._onLogPopup = function(event, id)
{
	if (event == "onbuttonup") {
		switch (id) {
		case "log_close_button":
			document.body.removeChild(WidgetLib.getWidgetNode("log_popup"));
			ContentsLib._displayLog = false;
			return;
		}
	}
};

/**
 * ログ情報ポップアップの作成
 *
 * @addon
 * @static
 * @private
 * @lang ja
 */
/**
 * Creates log information popup.
 *
 * @addon
 * @static
 * @private
 * @lang en
 */
ContentsLib._registerLogPopup = function()
{
	var _popupElem = document.createElement("div");
	_popupElem.setAttribute("id", "log_popup");

	var _backElem = document.createElement("img");
	_backElem.setAttribute("src", "./ContentsLib/Base_VerInfo_800-480.png");
	_backElem.style.position = "absolute";
	_backElem.style.top = "0px";
	_backElem.style.left = "0px";
	_backElem.style.backgroundRepeat = "no-repeat";
	_popupElem.appendChild(_backElem);
	
	var _titleElem = document.createElement("div");
	_titleElem.style.position = "absolute";
	_titleElem.style.top = "17px";
	_titleElem.style.left = "60px";
	_titleElem.style.backgroundRepeat = "no-repeat";
	_titleElem.appendChild(document.createTextNode(ContentsLib.texts["log_title"]));
	_popupElem.appendChild(_titleElem);
	
	var _logElem = document.createElement("pre");
	_logElem.setAttribute("id", "log");
	_logElem.style.position = "absolute";
	_logElem.style.top = "60px";
	_logElem.style.left = "20px";
	_logElem.style.width = "700px";
	_logElem.style.height = "320px";
	_logElem.style.overflow = "scroll";
	_logElem.style.fontSize = "20px";
	_logElem.style.backgroundColor = "#d0d0d0";
	_popupElem.appendChild(_logElem);
	_logElem.appendChild(document.createTextNode(""));
	
	var _buttonElem = document.createElement("div");
	_buttonElem.setAttribute("id", "log_close_button");
	_buttonElem.style.position = "absolute";
	_buttonElem.style.top = "420px";
	_buttonElem.style.left = "330px";
	_buttonElem.style.width = "140px";
	_buttonElem.style.height = "32px";

	var _imgElem = document.createElement("img");
	_imgElem.setAttribute("id", "log_close_button_img");
	_imgElem.setAttribute("src", "./ContentsLib/Com_VerInfo_Off_140-32.png");
	_buttonElem.appendChild(_imgElem);

	var _textElem = document.createElement("div");
	_textElem.style.position = "absolute";
	_textElem.style.top = "6px";
	_textElem.style.left = "40px";
	_textElem.style.fontSize = "20px";
	_textElem.style.fontWeight = "bold";
	_textElem.appendChild(document.createTextNode(ContentsLib.texts["close"]));
	_buttonElem.appendChild(_textElem);
	_popupElem.appendChild(_buttonElem);
	
	var _buttonAttr = {targetImgId: "log_close_button_img", offImg: "./ContentsLib/Com_VerInfo_Off_140-32.png", pressImg: "./ContentsLib/Com_VerInfo_Press_140-32.png"};
	WidgetLib.registerButtonWidget(_buttonElem, WidgetLib.ButtonType.NORMAL, _buttonAttr);
	
	WidgetLib.registerWidget(_popupElem);
};



ContentsLib._getCsPropHandler = function(res)
{
	var _resXML = res.responseXML;

	//ファイル取得通信が正常終了しなかった場合、値の取得はしない
	if(!_resXML)
	{
		return;
	}

	var _tag = _resXML.getElementsByTagNameNS(ContentsLib.nsCsProp,"Id");
	if( !_tag || _tag.length == 0 ) { return; }
	if(_tag[0].firstChild){
		ContentsLib.contentsId = _tag[0].firstChild.nodeValue;
	}

	_tag = _resXML.getElementsByTagNameNS(ContentsLib.nsCsProp,"Version");
	if(_tag && _tag.length > 0 && _tag[0].firstChild){
		ContentsLib.contentsVersion = _tag[0].firstChild.nodeValue;
	}

	_tag = _resXML.getElementsByTagNameNS(ContentsLib.nsCsProp,"Copyright");
	if(_tag && _tag.length > 0 && _tag[0].firstChild){
		ContentsLib.contentsCopyRight = _tag[0].firstChild.nodeValue;
	}
	_tag = _resXML.getElementsByTagNameNS(ContentsLib.nsCsProp,"TrackingId");
	if(_tag && _tag.length > 0 && _tag[0].firstChild){
		ContentsLib.trackingId = _tag[0].firstChild.nodeValue;
	}
	_tag = _resXML.getElementsByTagNameNS(ContentsLib.nsCsProp,"SerialNumber");
	if(_tag && _tag.length > 0 && _tag[0].firstChild){
		ContentsLib.serialNumber = _tag[0].firstChild.nodeValue;
	}

	return;
};

ContentsLib._getCsProp = function()
{
	var _ws = new WebServiceLib.Communicator();
	_ws.method = 'GET';
	_ws.async = true;
	_ws.successHandler = ContentsLib._getCsPropHandler;
	_ws.send("./csProp.xml", null);
	return;
};

