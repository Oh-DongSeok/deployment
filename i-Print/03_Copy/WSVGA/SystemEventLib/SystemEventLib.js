/**
 * @fileoverview デバイス内部で発生したイベント受信・通知のためのクラス定義<br>
 * デバイス内部で発生したイベントをDOMイベントとして受信し、<br>
 * 通知するためのJavaScriptライブラリ<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.0
 * @lang ja
 */

/**
 * @fileoverview Defines classes for retrieving/notifying events in device.<br>
 * JavaScript library for retrieving device events as DOM events and notifying<br>
 * these events.<br>
 *
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.2.0
 * @lang en
 */


 /**
 * デバイス内部で発生したイベント受信/通知のための名前空間定義
 * @namespace DOMイベント受信/通知のための名前空間定義
 * @static
 * @lang ja
 */
  /**
 * Namespace definition for retrieving/notifyiing events in device.
 * @namespace Namespace definition for retrieving/notifyiing DOM events.
 * @static
 * @lang en
 */

var SystemEventLib = {
	/**
	 *	SystemEventLibのバージョンを表す
	 *	@constant
	 *	@type String
	 *  @lang ja
	 */
	 /**
	 *	SystemEventLib version
	 *	@constant
	 *	@type String
	 *  @lang en
	 */
  	version : "1.2.0",


/**
 * 各イベント種別。プロパティはlistenerのみ
 * @private
 */
  AuthEvent: {listener : null},

  CstmAuthAccEvent : {listener : null},

  ChgScreenResultEvent : {listener : null},

  CstmSvcDispEvent : {listener : null }

};

/**
 * ライブラリからのイベントを受け取るための通知登録を行う。<br>
 * 各イベント種別に対し、登録可能なイベントハンドラの数は１つだけである。<br>
 * 同一イベント種別の登録指示の場合は、後から指示された
 * イベントハンドラにより上書きされる。<br>
 *
 * @param {String} eventname イベント種別<br>
 * AuthEvent:認証/集計状態に関するイベント(カスタム認証以外)<br>
 * CstmAuthAccEvent:カスタム認証時のアクセサリ有効・無効の通知、カスタム認証時の認証状態の通知<br>
 * ChgScreenResultEvent:画面切り替え指示の結果通知<br>
 * CstmSvcDispEvent:表示画面（カスタムサービス画面/デバイスが提供する画面）の検知結果通知<br>
 *
 * @param {Function} callback
 * 登録されたイベントの更新が発生したときに呼び出されるコールバック関数<br>
 * 本コールバック関数は、以下の形のJavaScript関数である必要がある。<br>
 * void	callback ( <i>eventname</i> , <i>obj</i> ) <br>
 * eventname : イベント種別<br>
 * obj : イベント発生時に返されるオブジェクト。プロパティ詳細と取りうる値は以下。<br><br>
 *
 * obj(AuthEvent)のプロパティ
 * <blockquote><b>State</b> デバイス内部の認証状態を示す<br>
 * Enbl : 認証済み<br>
 * Dsbl : 未認証（デバイス内部でのキャンセル完了含む)<br>
 * PwdReq : パスワード待ち<br>
 * AuthNg : 認証失敗<br>
 * Proc : 照合中<br>
 * CnclProc : キャンセル中<br>
 *
 * </blockquote>
 * <blockquote><b>FailCh</b> アクセサリ状態のChain番号</blockquote>
 * <blockquote><b>FailLk</b> アクセサリ状態のLink番号</blockquote>
 * <blockquote><b>UsrType</b> ユーザ種別<br>
 *  CO : 一般ユーザ<br>
 *  KO : 機械管理者 <font color="#ff0000">(CSLibVersion V3.5.0以降 State/UsrType/Reasonのみ通知)</font><br>
 * </blockquote>
 * <blockquote><b>Reason</b> 状態通知の要因を示す<br>
 * Login : 認証された<br>
 * VerifyNg : 認証失敗<br>
 * </blockquote>
 * <blockquote><b>UsrId</b> 未認証モード+ICCG接続時のみ通知される、カードのID<br></blockquote>
 * <blockquote><b>IccdId</b> ICカードID<br></blockquote>
 * <blockquote><b>NgRsn</b> 認証失敗の理由<br>
 * InputWrong：入力不正(認証失敗)<br>
 * ServerNotAvailable：外部認証サーバーへの接続失敗<br>
 * AccountLostInfo：ユーザーアカウントが登録されていない<br>
 * InvalidSetup：デバイスまたは外部認証サーバの設定が不正<br>
 * NoAuth：デバイスの使用権限無し<br>
 * Other：致命的エラー<br>
 * NoSpace：デバイスにユーザーを作る領域がない<br>
 * CableProblem：ケーブル抜け<br>
 * NotInitNetStack:プロトコルスタックが未初期化<br>
 * NotActiveComm:認証サーバとの通信（能動的通信）が不可能<br>
 * </blockquote>
 * <blockquote><b>ExtSvrFailCh</b> 外部認証失敗時のChain番号<br></blockquote>
 * <blockquote><b>ExtSvrFailLk</b> 外部認証失敗時のLink番号<br></blockquote>
 * <blockquote><b>PrevState</b> デバイス内部の前回の認証状態を示す(とりうる値はStateプロパティを参照のこと)</blockquote>
 *
 * obj(CstmAuthAccEvent)のプロパティ<br>
 * #AccountState/AuthStateいずれかのプロパティのみ存在する<br>
 *
 * <blockquote><b>AccountState</b>アクセサリ有効・無効通知<br>
 * Enbl : アクセサリ有効<br>
 * Dsbl : アクセサリ無効<br>
 * </blockquote>
 * <blockquote><b>AuthState</b> 認証状態<br>
 * None : 未認証<br>
 * Enbl : 認証済み<br>
 * Proc : 認証照合中<br>
 * CnclProc : 照合キャンセル中
 * </blockquote>
 *
 * obj(ChgScreenResultEvent)のプロパティ
 * <blockquote><b>Cmd</b> リクエストされたコマンド文字列<br>
 * popup : ポップアップ要求<br></blockquote>
 * <blockquote><b>Param</b> コマンドに対するパラメータ<br>
 * lang : 表示言語切り替え画面<br>
 * tools_menu : 仕様設定画面<br>
 * printer_mode : プリンターモード画面<br>
 * fax_recv_mode : ファクス受信モード画面<br>
 * activity_report : 通信管理レポート画面<br>
 *
 * </blockquote>
 * <blockquote><b>Rslt</b> 実行結果<br>
 * OK : 成功<br>
 * NG : 失敗<br></blockquote>
 * <blockquote><b>NgRsn</b> 失敗時の理由(RsltがNGの場合のみ存在する）<br>
 * FatalErr : 致命的内部エラー発生<br>
 * NoPermission : 実行ユーザに操作権限がない<br>
 * TmpRefuse : デバイスが要求を受け付けられる状態にない<br>
 * InvalidParam : 要求した画面は無効である
 * </blockquote>
 *
 * obj(CstmSvcDispEvent)のプロパティ
 * <blockquote>
 * true : カスタムサービスの画面表示<br>
 * false : デバイスが提供する画面表示<br>
 * </blockquote>
 *
 * @returns {Bool} true:登録成功<br>
 * false:登録失敗(eventnameが不正)
 *
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Sets event notifications for retrieving library events.<br>
 * Only one event handler can be set per event.<br>
 * If more than one event handler is set to a single event type,<br>
 * the event handler that is set last applies.<br>
 *
 * @param {String} eventname Event type<br>
 * AuthEvent: Events pertaining to authentication/accounting status (not available for Custom Authentication)<br>
 * CstmAuthAccEvent: For Custom Authentication. Events for notifying Accessory status (enabled/disabled) and authentication status<br>
 * ChgScreenResultEvent: Event for notifying screen change request result<br>
 * CstmSvcDispEvent: Event for retrieving displayed screen information (i.e. whether screen displayed is Custom Service screen or device-native screen)<br>
 *
 * @param {Function} callback
 * Callback function called when event is updated.<br>
 * Callback function must be JavaScript function; format and arguments are as follows.<br>
 * void	callback( <i>eventname</i> , <i>obj</i> ) <br>
 * eventname: event type<br>
 * obj: Object returned upon event. Object properties and values they may take are as follows.<br><br>
 *
 * obj (AuthEvent) properties:
 * <blockquote><b>State</b> Authentication status in device.<br>
 * Enbl: Authenticated<br>
 * Dsbl: Not authenticated (includes when authentication has been cancelled in device)<br>
 * PwdReq: Waiting for password<br>
 * AuthNg: Authentication failed<br>
 * Proc: Processing (validating)<br>
 * CnclProc: Cancelling<br>
 *
 * </blockquote>
 * <blockquote><b>FailCh</b> Chain number of Accessory status</blockquote>
 * <blockquote><b>FailLk</b> Link number of Accessory status</blockquote>
 * <blockquote><b>UsrType</b> User type<br>
 *  CO: General user<br>
 *  KO : Device administrator <font color="#ff0000">(CSLibVersion V3.5.0 and later, only State/UsrType/Reason notified)</font><br>
 * </blockquote>
 * <blockquote><b>Reason</b> Cause of status notification<br>
 * Login : Authentication succeeded<br>
 * VerifyNg : Authentication failed<br>
 * </blockquote>
 * <blockquote><b>UsrId</b> Card ID. Returned only when device is not in authentication mode and has ICCG connected.<br></blockquote>
 * <blockquote><b>IccdId</b> IC card ID<br></blockquote>
 * <blockquote><b>NgRsn</b> Reason for authentication failure<br>
 * InputWrong: Entered authentication information invalid (authentication failed)<br>
 * ServerNotAvailable: Could not connect to remote authentication server<br>
 * AccountLostInfo: User account not registered<br>
 * InvalidSetup: Device or remote authentication server settings invalid<br>
 * NoAuth: User not authorized to use device<br>
 * Other: Fatal error<br>
 * NoSpace: Device has no space for creating user<br>
 * CableProblem: Cable disconnected<br>
 * NotInitNetStack: Protocol stack not initialized<br>
 * NotActiveComm: Cannot (actively) communicate with authentication server<br>
 * </blockquote>
 * <blockquote><b>ExtSvrFailCh</b> Chain number for remote authentication failure<br></blockquote>
 * <blockquote><b>ExtSvrFailLk</b> Link number for remote authentication failure<br></blockquote>
 * <blockquote><b>PrevState</b> Status of previous authentication in device (see State property for values)</blockquote>
 *
 * obj (CstmAuthAccEvent) properties:<br>
 * #Only either AccountState or AuthState property is returned; never both<br>
 *
 * <blockquote><b>AccountState</b> Accessory status (enabled/disabled)<br>
 * Enbl: Accessory enabled<br>
 * Dsbl : Accessory disabled<br>
 * </blockquote>
 * <blockquote><b>AuthState</b> Authentication status<br>
 * None: Not authenticated<br>
 * Enbl: Authenticated<br>
 * Proc: Processing (validating)<br>
 * CnclProc: Cancelling processing
 * </blockquote>
 *
 * obj (ChgScreenResultEvent) properties:
 * <blockquote><b>Cmd</b> Request character string<br>
 * popup: Popup request<br></blockquote>
 * <blockquote><b>Param</b> Parameters<br>
 * lang: Display language switch screen<br>
 * tools_menu: Tools screen
 * printer_mode: Printer mode screen<br>
 * fax_recv_mode: Fax receive mode screen<br>
 * activity_report: Activity report screen<br>
 </blockquote>
 * <blockquote><b>Rslt</b> Request result<br>
 * OK: Successful<br>
 * NG : Failed<br></blockquote>
 * <blockquote><b>NgRsn</b> Reason for failure (returned only when Rslt is "NG")<br>
 * FatalErr: Fatal internal error<br>
 * NoPermission: User is not authorized for operation<br>
 * TmpRefuse: Device is not of status in which it can accept request<br>
 * InvalidParam : Requested screen is invalid
 * </blockquote>
 *
 * obj (CstmSvcDispEvent) properties:
 * <blockquote>
 * true: Custom Service screen displayed<br>
 * false: Device native screen displayed<br>
 * </blockquote>
 *
 * @returns {Bool} true: Event handler registration success<br>
 * false: Event handler registration failed (eventname invalid)
 *
 * @addon
 * @static
 * @lang en
 */
SystemEventLib.AddNotify = function (eventname, callback) {

	if ( !SystemEventLib[eventname] ) {
		return false;
	}

	SystemEventLib.setEventListener(eventname, callback);
	return true;
};

/**
 * ライブラリからのイベント通知登録の解除を行う。<br>
 *
 * @param {String} eventname イベント種別<br>
 * AuthEvent:カスタム認証以外の認証/集計状態に関するイベント<br>
 * CstmAuthAccEvent:カスタム認証時のアクセサリ有効・無効の通知、カスタム認証時の認証状態の通知<br>
 * ChgScreenResultEvent:画面切り替え指示の結果通知<br>
 * CstmSvcDispEvent:表示画面（コンテンツの画面/デバイスが提供する画面）の検知結果通知
 *
 * @returns {Bool} true:登録解除成功<br>
 * false:登録解除に失敗(eventnameが不正)
 *
 * @addon
 * @static
 * @lang ja
 */
 /**
 * Unregisters event notifiction from library.<br>
 *
 * @param {String} eventname Event type<br>
 * AuthEvent: Events pertaining to authentication/accounting status (not available for Custom Authentication)<br>
 * CstmAuthAccEvent: For Custom Authentication. Events for notifying Accessory status (enabled/disabled) and authentication status<br>
 * ChgScreenResultEvent: Event for notifying screen change request result<br>
 * CstmSvcDispEvent: Event for retrieving displayed screen information (i.e. whether screen displayed is Custom Service screen or device-native screen)
 *
 * @returns {Bool} true: Event handler unregistration success<br>
 * false: Event handler unregistration failed (eventname invalid)
 *
 * @addon
 * @static
 * @lang en
 */
SystemEventLib.RemoveNotify = function(eventname){

	if ( !SystemEventLib[eventname] ) {
		return false;
	}
	SystemEventLib.removeEventListener(eventname);
	return true;
};

/**
 * eventnameに応じてイベントターゲットにリスナーを登録する
 * @private
 */
SystemEventLib.setEventListener = function(eventname, callback) {
	if ( eventname == "CstmSvcDispEvent" ) {
		document.addEventListener("suspend", SystemEventLib.onDisplayEvent, false);
		document.addEventListener("resume", SystemEventLib.onDisplayEvent, false);
	}
	else {
		document.addEventListener("FxSystemEvent", SystemEventLib.onSystemEvent, false);
	}
	SystemEventLib[eventname].listener = callback;
	return;
};

/**
 * eventnameに応じてイベントターゲットのリスナー登録を解除する
 * @private
 */
SystemEventLib.removeEventListener = function(eventname) {
	if ( eventname == "CstmSvcDispEvent" ) {
		document.removeEventListener("suspend", SystemEventLib.onDisplayEvent, false);
		document.removeEventListener("resume", SystemEventLib.onDisplayEvent, false);
	}
	else {
		document.removeEventListener("FxSystemEvent", SystemEventLib.onSystemEvent, false);
	}
	SystemEventLib[eventname].listener = null;
	return;
};


/**
 * 登録済みのイベントハンドラを実行する
 * @private
 */
SystemEventLib.onEvent = function (eventname, obj) {

	if ( SystemEventLib[eventname].listener && obj != null) {
		SystemEventLib[eventname].listener(eventname, obj);
	}
	return;
};

/**
 * @private
 */
SystemEventLib.onSystemEvent = function (event){

	var _attrName;
	_attrName = event.detail.attrName;

	if ( !_attrName ) {
		return;
	}
	var _attrVal;
	_attrVal = event.detail.attrValue;
	if ( !_attrVal ) {
		return;
	}
	_attrVal = eval('('+_attrVal+')');
	var _obj = new Object();

	switch ( _attrName ){
	  case "AAAAccountState" :
		var _category = _attrVal["Ctgry"];

		if ( _category == "All" ) {
			_obj = SystemEventLib._getAuthObj(_attrVal);
			SystemEventLib.onEvent("AuthEvent", _obj);
		}
		if ( _category == "Acc" ) {
			_obj = SystemEventLib._getCstmAuthAccObj(_attrVal);
			SystemEventLib.onEvent("CstmAuthAccEvent", _obj);
		}
		break;

	  case "AAAAuthenticationState" :
		var _client = _attrVal["Client"];
		var _usrType = _attrVal["UsrType"];

		if ( _client == "Xcp" ) {
			_obj = SystemEventLib._getCstmAuthXcpObj(_attrVal);
			SystemEventLib.onEvent("CstmAuthAccEvent", _obj);
		} else if (_client == "FCW" && _usrType == "KO") {//パネルからのログイン　かつ　KOのみサポート
			_obj = SystemEventLib._getKOAuthObj(_attrVal);
			SystemEventLib.onEvent("AuthEvent", _obj);
		}
		break;

	  case "ChangeScreenResult" :
		_obj = SystemEventLib._getChgScreenResultObj(_attrVal);
		SystemEventLib.onEvent("ChgScreenResultEvent", _obj);
		break;

	  default:
		/* そのほかのイベントが来ても何もしない */
		break;
	}

};

/**
 * @private
 * @param {Object} event イベントオブジェクト
 * @param {Bool} obj 通知結果
 */
SystemEventLib.onDisplayEvent = function(event){

	var _obj = null;

	if ( event.type == "resume" ) {
		_obj = true;
	}
	if ( event.type == "suspend" ) {
		_obj = false;
	}
	SystemEventLib.onEvent("CstmSvcDispEvent", _obj);
	return;
};

/**
 * AuthEvent用にフィルタリングしたオブジェクトを返す
 * @private
 */
SystemEventLib._getAuthObj = function(attrValue) {

	var _state = attrValue["State"];
	if ( _state && _state == "Lost") {
		return null;
	}

	/* Dsblが2回連続した場合は、2回目の通知は行われない*/
	var _prevState = attrValue["PrevState"];
	if ( _state && _state == "Dsbl" && _prevState && _prevState == "Dsbl") {
		return null;
	}

	var _usrType = attrValue["UsrType"];
	if ( _usrType && _usrType != "CO"){
		return null;
	}

	var _retObj = new Object();

	for (var prop in attrValue){
		switch(prop){
		  case "State":
		  case "PrevState":

			/* Cnslの場合はDsblとして扱う*/
			if ( attrValue[prop] == "Cncl" ){
				_retObj[prop] = "Dsbl";
			} else {
				_retObj[prop]= attrValue[prop];
			}

			break;
		  case "NgRsn":
			_retObj[prop] = SystemEventLib.AccountStateNgRsn[attrValue[prop]];
			break;

		  case "FailCh" :
		  case "FailLk" :
		  case "UsrType":
		  case "UsrId":
		  case "IccdId":
		  case "ExtSvrFailCh":
		  case "ExtSvrFailLk":
			_retObj[prop] = attrValue[prop];
			break;

		  default:
			/* その他のパラメータは無視 */
			break;
		}
	}

	return _retObj;
};

/**
 * AuthEvent（KO限定）用にフィルタリングしたオブジェクトを返す
 * (AAAAuthenticationEvent)
 * @private
 */
SystemEventLib._getKOAuthObj = function(attrValue)
{
	var _retObj = new Object();

	if (attrValue && attrValue["UsrType"] && attrValue["UsrType"] != "KO") {
		return null;
	}

	/* 通知するオブジェクト */
	/* UsrType, State, Reason */
	for (var prop in attrValue){
		switch(prop){
			case "State":
			case "UsrType":
			case "Reason":
				_retObj[prop] = attrValue[prop];
				break;
			default:
				break;
		}
	}
	return _retObj;
};

/**
 * CstmAuthAccEvent用にフィルタリングしたオブジェクトを返す
 * (AccountState)
 * @private
 */
SystemEventLib._getCstmAuthAccObj = function(attrValue){

	var _retObj = new Object();
	for ( var prop in attrValue ){
		switch ( prop ) {
		  case "State" :
			switch ( attrValue["State"] ) {
			  case "Enbl" :
			  case "Dsbl":
				_retObj["AccountState"] = attrValue[prop];
				break;

			  default:
				break;
			}
			break;

		  default:
			break;
		}
	}
	return _retObj;
};

/**
 * CstmAuthAccEvent用にフィルタリングしたオブジェクトを返す
 * (AuthState)
 * @private
 */

SystemEventLib._getCstmAuthXcpObj = function(attrValue){
	var _retObj = new Object();
	for ( var prop in attrValue ){
		switch ( prop ) {
		  case "State" :
			switch( attrValue["State"] ) {
			  case "None":
			  case "Ok":
			  case "Processing":
			  case "CancelProc":
				_retObj["AuthState"] = SystemEventLib.AuthStateVal[attrValue[prop]];
				break;

			  default:
				break;
			}
		}
	}
	return _retObj;
};

/**
 * ChgScreenResultEvent用にフィルタリングしたオブジェクトを返す
 * @private
 */
SystemEventLib._getChgScreenResultObj = function(attrValue){

	var _retObj = new Object();
	for (var prop in attrValue){
		switch( prop ){
		  case "Cmd" :
			switch( attrValue["Cmd"] ) {
			  case "popup" :
				_retObj[prop] = attrValue[prop];
				break;

			  default:
				break;
			}
			break;

		  case "Param":
			switch( attrValue["Param"] ) {
			  case "lang":
			  case "tools_menu":
			  case "printer_mode" :
			  case "fax_recv_mode":
			  case "activity_report":
				_retObj[prop] = attrValue[prop];
				break;

			  default:
				/* Unknownなど */
				break;
			}
			break;

		  case "Rslt":
			_retObj[prop] = attrValue[prop];
			break;

		  case "NgRsn":
			_retObj[prop] = SystemEventLib.PopupNgRsn[attrValue[prop]];
			break;

		  default:
			break;
		}
	}
	return _retObj;
};

/**
 * AccountStateEventのNgRsn読み替え
 * @private
 */
SystemEventLib.AccountStateNgRsn = {
	InpWrng : "InputWrong",
	SvrErr: "ServerNotAvailable",
	AccLost: "AccountLostInfo",
	Invalid:"InvalidSetup",
	NoAuth:"NoAuth",
	Other:"Other",
	NoSpace:"NoSpace",
	CablePrblm:"CableProblem",
	NetNoInit:"NotInitNetStack",
	CommInactive:"NotActiveComm"
};

/**
 * ChgScreenResultEventのNgRsn読み替え
 * @private
 */
SystemEventLib.PopupNgRsn = {
	NgInternal:"FatalErr",
	NgOnTools:"FatalErr",
	NgChangModeFail:"TmpRefuse",
	NgNoPermission:"NoPermission",
	NgInvalid:"InvalidParam"
};


/**
 * CstmAuthAccEvent ( AAAAuthenticationStateEvent ) のState読み替え
 * @private
 */
SystemEventLib.AuthStateVal = {
	None : "None",
	Ok : "Enbl",
	Processing : "Proc",
	CancelProc : "CnclProc"
};