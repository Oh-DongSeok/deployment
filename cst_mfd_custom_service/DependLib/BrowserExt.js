/** 
 * @fileoverview Browser拡張機能利用のためのJavaScriptライブラリ(V3,V4,V5,XC向けANT=V0共通）
 *
 * @author Copyright(C) 2013 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 2.4.4
 * @lang ja
 */
/** 
 * @fileoverview JavaScript library for using extended browser features (for V3, V4, V5, and ANT=V0 for XC)
 *
 * @author Copyright(C) 2013 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 2.4.4
 * @lang en
 */
 
 /** 
 * カスタムサービスコンテンツでブラウザ拡張機能を利用するための名前空間定義
 * @namespace ブラウザの拡張機能の利用を可能にする。
 * @static
 * @lang ja
 */ 
 /** 
 * Namespace definition for providing extended browser features.
 * @namespace Enables use of extended browser features.
 * @static
 * @lang en
 */
/** 
 * デバイスの組み込みブラウザ固有機能の名前空間定義
 * @namespace デバイスの組み込みブラウザの提供する固有機能
 * @static
 * @lang ja
 */
 /** 
 * Namespace definition for 
 * @namespace Determines browser / UI panel type.
 * @static
 * @lang en
 */
var BrowserExt = 
{	
	/**
	 *	デバイスの組み込みブラウザのバージョンを表す文字列 <br>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	String Device-embedded browser version.<br>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */

  browserVersion: 5
};
BrowserExt.OnloadFunc = null;
BrowserExt.CaptreFunc = null;
BrowserExt.keyCode = {};

BrowserExt.keyCode.FX_VK_0 = 48;
BrowserExt.keyCode.FX_VK_1 = 49;
BrowserExt.keyCode.FX_VK_2 = 50;
BrowserExt.keyCode.FX_VK_3 = 51;
BrowserExt.keyCode.FX_VK_4 = 52;
BrowserExt.keyCode.FX_VK_5 = 53;
BrowserExt.keyCode.FX_VK_6 = 54;
BrowserExt.keyCode.FX_VK_7 = 55;
BrowserExt.keyCode.FX_VK_8 = 56;
BrowserExt.keyCode.FX_VK_9 = 57;
BrowserExt.keyCode.FX_VK_MULTIPLY = 42;
BrowserExt.keyCode.FX_VK_NUMBER = 35;
BrowserExt.keyCode.FX_VK_PAUSE = 44;
BrowserExt.keyCode.FX_VK_BACK_SPACE = 8;
BrowserExt.keyCode.FX_VK_ENTER = 5;
BrowserExt.keyCode.FX_VK_START = 0;
BrowserExt.keyCode.FX_VK_CLEAR = 0;

/**
 * ライブラリの初期化 
 * 
 *■補足<br>
 * 　　【 呼び出しタイミングと条件】<br>
 * 　　・本関数は、ユーザーのonloadイベント処理内で実行されること。<br>
 * 　　・本関数を実行して初期化しても、onloadコンテキスト内では、他関数は使用できない。<br>
 * 　　・他関数を使用する場合にはwindow.setTimeout()を利用し100msec以降に呼び出すこと。<br>
 * @lang ja
 */
 
 /**
 * Initializes library. 
 * 
 * NOTE: <br>
 * This method can be called when the following conditions are met:<br>
 * - In user onload event processing<br>
 * - Other methods cannot be called within the "onload" context, <br>
 *   even when library is initialized using this method. <br>
 * - To use other methods, call after an interval of at least 100 msec <br>
 *   using window.setTimeout().<br>
 * @lang en
 */
 
BrowserExt.Init = function()
{
    if( navigator.userAgent.indexOf("ANTGalio/",0) >= 0 ) {
      this.browserVersion = 0;
    }
    else {
      var pos = navigator.userAgent.indexOf("FX-EWB/",0);
      if( pos >= 0 ){
        this.browserVersion = navigator.userAgent.substr(pos+7,1);
      }
    }
    this.browserVersion = 5; // 고정값으로 함
    if( document.EwbClass == null && this.browserVersion !=0 && this.browserVersion !=5 ) {
         var object = document.createElement("object");
         object.setAttribute("classid","EwbClass");
         object.setAttribute("name","EwbClass");
         object.setAttribute("width","0");
         object.setAttribute("height","0");
         document.body.appendChild(object);
    }
    if( this.browserVersion == 3 ) {
         var link = document.createElement("a");
         link.setAttribute("href","mailto:");
         link.setAttribute("id","EwbA");
         document.body.insertBefore(link, document.body.firstChild);
         BrowserExt.keyCode.FX_VK_START = 57346;
         BrowserExt.keyCode.FX_VK_CLEAR = 57344;
    }
    else {
         BrowserExt.keyCode.FX_VK_START = 4098;
         BrowserExt.keyCode.FX_VK_CLEAR = 4096;
    }
    if( this.browserVersion == 5 ) {
      var str0 = "document.EwbClass=new Object();document.EwbClass.setCommand=function(command){return EwbClass.setCommand(command);};document.EwbClass.playPhraseVoice=function(){var id=new Array();for(i=0;i<arguments.length;i++){id[i]=arguments[i];}return EwbClass.playPhraseVoice(id);};document.EwbClass.getVoiceStatus=function(){return EwbClass.getVoiceStatus();};document.EwbClass.playVoice=function(n){return EwbClass.playVoice(n);};document.EwbClass.stopVoice=function(){return EwbClass.stopVoice();};document.EwbClass.setVoiceSpeed=function(speed){return EwbClass.setVoiceSpeed(speed);};document.EwbClass.getVoiceSpeed=function(){return EwbClass.getVoiceSpeed();};document.EwbClass.setDeviceVoice=function(state){return EwbClass.setDeviceVoice(state);};document.EwbClass.getVoiceVersion=function(type){return EwbClass.getVoiceVersion(type);};";
      eval(str0);
      //BrowserExt.DisableDrag();
    }
};
/**
 * @private
 */
BrowserExt.DisableDrag = function()
{
    if( this.browserVersion == 5 ) {
      var elems = document.getElementsByTagName('img');
      for(var i=0; i<elems.length; i++) {
        if(!elems[i].hasAttribute("draggable")){
          elems[i].setAttribute("draggable", "false");
        }
      }
      elems = document.getElementsByTagName('a');
      for(var i=0; i<elems.length; i++) {
        if(!elems[i].hasAttribute("draggable")){
          elems[i].setAttribute("draggable", "false");
        }
      }
    }
};

/**
 * ブザーを鳴らす 
 * @param {int} type ブザー音の種類（0：Valid(許可）音、1：Invalid(禁止）音）を示す数値<br>
 * 
 *■補足<br>
 * 　　・MNテリトリー向け製品では、この機能は使用できない。<br>
 * @lang ja
 */
 
 /**
 * Sounds buzzer.
 * @param {int} type Integer specifying buzzer sound type (0 for valid, 1 for invalid sound)<br>
 * 
 * NOTE: <br>
 * This feature not available for MN devices<br>
 * @lang en
 */
 
BrowserExt.Beep = function(type)
{
    if( this.browserVersion == 3 || this.browserVersion == 4 ) {
        if( type == 0 ) {
            document.EwbClass.setBeep(0);
        }
        else if( type == 1 ) {
            document.EwbClass.setBeep(1);
        }
    }
    else if(this.browserVersion == 5) {
        if( type == 0 ) {
            EwbClass.setBeep(0);
        }
        else if( type == 1 ) {
            EwbClass.setBeep(1);
        }
    }
};
/**
 * 現在のAcceptLanguage情報を得る 

 * @returns {String} 取得したAcceptLanguageの文字列。取得できなかった場合はnullを返す。
 *■補足<br>
 *      [注意]EWB V4,V5は現在の表示言語が格納される。EWB V3は以下の情報が格納される。
 * 	･FXテリトリーでは”ja”,”en”の中から、IBGテリトリーでは”ja”,”en”,”ko”,”zh-tw”,”zh-cn”,”th”の中から、以下のように設定される。<br>
 *	①,②,③<br>
 *	①＝表示言語<br>
 *	②＝初期表示言語<br>
 *	③＝en<br>
 *	なお、重複した場合は①②③の優先順位で省略される。<br>
 *	例1）①：en、②：ja、③：enの場合は”en,ja”になる。<br>
 *	例2）①：ja、②：ja、③：enの場合は“ja,en”になる。<br>
 *	※「表示言語」は、現在の操作パネル表示言語。「初期表示言語」は、製品の出荷時に設定される<br>
 *	Default言語を示す。<br>
 * 　　・MNテリトリー向け製品では、表示言語のみサポート。<br>
 * @lang ja
 */
 
 /**
 * Retrieves information on current AcceptLanguage settings. 
 * @returns {String} String representing retrieved AcceptLanguage settings. <br>
 * If AcceptLanguage settings could not be retrieved, returns NULL. <br>
 * NOTE:<br>
 * In FX devices, format is as follows:<br>
 * Display language, initial display language, en<br>
 * If any two of the above are the same, whichever comes first<br>
 * in the list is prioritized.<br>
 *  Example 1: Display language is "en," initial display language is "ja"<br>
 *              -> String returned is "en, ja"<br>
 *  Example 2: Display language is "ja," initial display language is "ja" <br>
 *              -> String returned is "ja,en"<br>
 * "Display language" refers to language currently set for display; <br>
 * "initial display language" refers to default language set upon product shipping.<br>
 * In MN devices, only display language is supported.<br>
 * @lang en
 */

BrowserExt.GetAcceptLanguage = function()
{
    if( this.browserVersion == 3 ) {
        return document.EwbClass.getAcceptLang();
    }
    else if(this.browserVersion == 5) {
        if(navigator.language == "zh-CN") {
            return("zh-cn");
        }
        else if(navigator.language == "zh-TW") {
            return("zh-tw");
        }
        else {
            return navigator.language.substring(0,2);
        }
    }
    else {
        return navigator.language;
    }
};
/**
 * @private
 */
BrowserExt.IsExistanceCsv = function(fname)
{
    return false;
};
/**
 * @private
 */
BrowserExt.InstallCsv = function(fname,body)
{
    return false;
};
/**
 * 再度、ハードキー押下イベントを取得するためにFocusを当てる 

 * 
 *■補足<br>
 *      ・現在、仕様により、以下の動作を行った場合は、ハードキー押下<br>
 *	イベントが取得できなくなるため、この関数を呼び出すことで、<br>
 *	イベント取得を再度有効にする。<br>
 *	・A,TEXTAREA,INPUT,SELECTの操作を行って、Focusが移動した場合。<br>
 * @lang ja
 */
 
 /**
 * Sets focus to capture hardware key press event.
 * 
 * NOTE: <br>
 * - In the event of any of the following, current specifications <br>
 * require that this function be called to resume ability to capture <br>
 * hardware key press events:<br>
 * When focus is moved upon A, TEXTAREA, INPUT, and SELECT tags.<br>
 * @lang en
 */
BrowserExt.FocusKeyEvent = function()
{
    window.setTimeout("BrowserExt.Focus()",100);
};

/**
 * ハードーキー押下イベント通知関数を登録する 
 * @param {Function} callback 通知関数は、以下の形式のJavaScript関数である。<br>
 * BOOL callback（keyCode）
 * 
 *■補足<br>
 * 　　・keyCodeは押下されたハードキーの種類により以下の定数がセットされる。<br>
 *     キー種別       定数
 *     0                 BrowserExt.keyCode.FX_VK_0<br>
 *     1                 BrowserExt.keyCode.FX_VK_1<br>
 *     2                 BrowserExt.keyCode.FX_VK_2<br>
 *     3                 BrowserExt.keyCode.FX_VK_3<br>
 *     4                 BrowserExt.keyCode.FX_VK_4<br>
 *     5                 BrowserExt.keyCode.FX_VK_5<br>
 *     6                 BrowserExt.keyCode.FX_VK_6<br>
 *     7                 BrowserExt.keyCode.FX_VK_7<br>
 *     8                 BrowserExt.keyCode.FX_VK_8<br>
 *     9                 BrowserExt.keyCode.FX_VK_9<br>
 *     *                 BrowserExt.keyCode.FX_VK_MULTIPLY<br>
 *     #                 BrowserExt.keyCode.FX_VK_NUMBER<br>
 *     -(DIAL_PAUSE)     BrowserExt.keyCode.FX_VK_PAUSE<br>
 *     C                 BrowserExt.keyCode.FX_VK_BACK_SPACE<br>
 *     スタート          BrowserExt.keyCode.FX_VK_START<br>
 *     Clear All（1回目）BrowserExt.keyCode.FX_VK_CLEAR<br>
 * @lang ja
 *
 */
 
 /**
 * Registers function for hardware key press event notification.
 * @param {Function} callback Function for notification should be JavaScript function of following format:<br>
 * BOOL callback（keyCode）<br>
 * 
 * NOTE:<br>
 * 　　For keyCode, the following constants are set per hardware key type:<br>
 *     Key type       Constant <br>
 *     0                 BrowserExt.keyCode.FX_VK_0<br>
 *     1                 BrowserExt.keyCode.FX_VK_1<br>
 *     2                 BrowserExt.keyCode.FX_VK_2<br>
 *     3                 BrowserExt.keyCode.FX_VK_3<br>
 *     4                 BrowserExt.keyCode.FX_VK_4<br>
 *     5                 BrowserExt.keyCode.FX_VK_5<br>
 *     6                 BrowserExt.keyCode.FX_VK_6<br>
 *     7                 BrowserExt.keyCode.FX_VK_7<br>
 *     8                 BrowserExt.keyCode.FX_VK_8<br>
 *     9                 BrowserExt.keyCode.FX_VK_9<br>
 *     *                 BrowserExt.keyCode.FX_VK_MULTIPLY<br>
 *     #                 BrowserExt.keyCode.FX_VK_NUMBER<br>
 *     -(DIAL_PAUSE)     BrowserExt.keyCode.FX_VK_PAUSE<br>
 *     C                 BrowserExt.keyCode.FX_VK_BACK_SPACE<br>
 *     Start             BrowserExt.keyCode.FX_VK_START<br>
 *     Clear All (once) BrowserExt.keyCode.FX_VK_CLEAR<br>
 * @lang en
 *
 */
BrowserExt.SetCaptureEvent = function(callback)
{
    BrowserExt.CaptreFunc = callback;
    if( this.browserVersion == 3 ) {
        var node = document.getElementById("EwbA");
        if( node.getAttributeNode("onkeydown") != null ) {
            var okd = node.getAttribute("onkeydown");
            node.setAttribute("onkeydown","BrowserExt.GetHardKey();"+okd+" return false;");
        }
        else {
            node.setAttribute("onkeydown","BrowserExt.GetHardKey()");
        }
        BrowserExt.FocusNode = node;
        BrowserExt.FocusKeyEvent();
    }
    else {
        document.onkeypress = BrowserExt.GetHardKey;
        document.onkeydown = function () {
            if ( event.which == 8 ) {
                BrowserExt.GetHardKey();
                return false;
            }
        };
    }
};
/**
 * @private
 */
BrowserExt.Focus = function()
{
    if( this.browserVersion == 3 ) {
        if(BrowserExt.FocusNode.focus != null) {
            BrowserExt.FocusNode.focus();
        }
    }
    else {
        window.focus();
    }
};
/**
 * @returns {Int} 以下の情報を返す<br>☆
 * bit0：カスタムサービススクリプトがDawnloadインストール可能の場合は１、<br>
 * そうでない場合は０がセットされる<br>
 *■補足<br>
 * 　　・MNテリトリー向け製品では、この機能は使用できない。<br>
 * @private
 * @lang ja
 */
 
 /**
 * Retrieves device-specific information. 
 * @returns {Int} Returns the following information:<br>
 * bit0: 0 is set if Custom Service Script can be installed via <br>
 * download to device; otherwise, 1 is set.<br>
 * NOTE: This feature not available for MN devices.<br>
 * @private
 * @lang en
 */
BrowserExt.GetDeviceInformations = function()
{
    if( this.browserVersion == 0 ) {
      return 0;
    }
    if( this.browserVersion == 5 ) {
      return EwbClass.getDeviceInfo();
    }
    return document.EwbClass.getDeviceInfo();
};
/**
 * 特定のサービス画面に遷移する 
 * @param {String} service サービス画面名称。名称はEWB外部仕様書を参照。<br>
 * @returns {Bool} 以下の情報を返す<br>
 * サービスへの画面遷移が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
 
 /**
 * Changes screen to display specific service screen. 
 * @param {String} service Service screen name. See EWB external specification document for details.<br>
 * @returns {Bool} Returns "true" if screen change to service screen is <br>
 * successfully set; otherwise returns "false."<br>
 * @lang en
 */
 
BrowserExt.SetScreenChange = function(service)
{
    var name = service;
    if( service == null || service == "" ) {
        name = "allservice";
    }
    if( this.browserVersion == 0 ) {
      ExitCUIMode(name);
      return true;
    }
    if( this.browserVersion == 5 ) {
      return EwbClass.screenChange(name);
    }
    return document.EwbClass.screenChange(name);
};

 /**
 * HTTPの通信タイムアウト値を指定する  
 * @param {Int} time1 再送毎のタイムアウト値（秒）。<br>
 * @param {Int} time2 再送毎のタイムアウト値（秒）。<br>
 * @param {Int} time3 再送毎のタイムアウト値（秒）。<br>
 * @param {Int} time4 再送毎のタイムアウト値（秒）。<br>
 * @returns {Bool} 以下の情報を返す<br>
 * タイムアウト値の設定が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */

/**
 * Sets HTTP communication timeout value.
 * @param {Int} time1 Timemout value per resend, in seconds.<br>
 * @param {Int} time2 Timemout value per resend, in seconds.<br>
 * @param {Int} time3 Timemout value per resend, in seconds.<br>
 * @param {Int} time4 Timemout value per resend, in seconds.<br>
 * @returns {Bool} Returns "true" if timeout value is successfully set; <br>
 * otherwise returns "false."<br>
 * @lang en
 */

BrowserExt.SetSocketTimeout = function(time1,time2,time3,time4)
{
    if ( this.browserVersion == 4 ) {
      if( ANTEx.setSocketTimeout ) {
        return(ANTEx.setSocketTimeout(time1,time2,time3,time4));
      }
    }
    if ( this.browserVersion == 5 ) {
      return EwbClass.setSocketTimeout(time1,time2,time3,time4);
    }
    return false;
};
/**
 * 特権モードを指定する 。<br>
 * @returns {Bool} 以下の情報を返す<br>
 * 特権モードの設定が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
 
 /**
 * Specifies privilege mode.
 * @returns {Bool} Returns "true" if privilege mode is successfully set; otherwise returns "false."<br>
 * @lang en
 */
BrowserExt.EnablePrivilege = function()
{
    if ( this.browserVersion == 4 ) {
      if( ANTEx.enablePrivilege  ) {
        return(ANTEx.enablePrivilege());
      }
    }
    if ( this.browserVersion == 5 ) {
      return EwbClass.enablePrivilege();
    }
    return false;
};
/**
 * エラー画面URLを指定する 
 * @param {String} errorId 以下のエラー種別情報のいづれかを指定する<br>
 * dns,local,connect,verify,request,timeout,filter<br>
 * @param {String} URL エラー画面URL
 * @returns {Bool} 以下の情報を返す<br>
 * 画面表示用URLの設定が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
 
 /**
 * Specifies URL for error screen. 
 * @param {String} errorId Specifies error type information; error types are as follows:<br>
 * dns, local, connect, verify, request, timeout, filter<br>
 * @param {String} URL representing URL for error screen.
 * @returns {Bool} Returns "true" if URL is successfully set; otherwise returns "false."<br>
 * @lang en
 */
BrowserExt.SetErrorPageUrl = function( errorId,URL )
{
    if ( this.browserVersion == 4 ) {
      if( ANTEx.setErrorPageUrl ) {
        if( URL == "" || URL == null ) {
          return false;
        }
        return( ANTEx.setErrorPageUrl( errorId,URL) );
      }
    }
    if ( this.browserVersion == 5 ) {
      if( URL == "" || URL == null ) {
        return false;
      }
      return( EwbClass.setErrorPageUrl( errorId,URL) );
    }
    return false;
};

/**
 * HTTPプロトコルとしてHTTP1.1の使用を設定する。<br>
 * 設定変更後に開始した通信から適用される。<br>
 * @return {Bool} 以下の情報を返す<br>
 * 設定が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
/**
 * Sets HTTP1.1 as HTTP protocol. <br>
 * Settings are valid from communication after settings are set using this method.<br>
 * @return {Bool} Returns true when settings are successfully set; otherwise returns false.<br>
 * @lang en
 */
BrowserExt.EnableHttp11 = function( )
{
    if ( this.browserVersion == 4 ) {
      ANTEx.config_http_11_enabled = 1;
      return true;
    }
    if ( this.browserVersion == 5 ) {
      EwbClass.config_http_11_enabled = 1;
      return true;
    }
    return false;
};

/**
 * 現在の認証ユーザーのサービス利用権限情報を取得する。<br>
 * @return {String} 以下の情報を返す<br>
 * "①,②,③,④"<br>
 * ①～④は次のサービスに対する権限情報を示し、<br>
 * full color、limited color 、black and whiteの順に各許可情報を、<br>
 * 次の３つの数値で表します。 <br>
 *  <br>
 * ０：no（不許可）<br> 
 * １：yes（許可） <br>
 * ２：N/A <br>
 *  <br>
 * ①：Copy<br> 
 * ②：Print <br>
 * ③：Scan <br>
 * ④：Fax/インターネットfax<br> 
 * <br>
 * 例）"111,111,111,111" = 全サービス使用許可 
 * @lang ja
 */
BrowserExt.getPermitInfo = function( )
{
    if ( this.browserVersion == 4 ) {
      return document.EwbClass.getPermitInfo();
    }
    if ( this.browserVersion == 5 ) {
      return EwbClass.getPermitInfo();
    }
    return "222,222,222,222";
};

/**
 * ファイルプリント状態画面を制御する。<br>
 * @param {Bool} visible 画面表示の場合はtrue、表示しない場合はfalseを指定する。<br>
 *■補足<br>
 * 　　・EWB V5以外は、この機能は使用できない。<br>
 * @lang ja
 */
BrowserExt.setVisibleForPrintHistory = function(visible)
{
  if( this.browserVersion == 5 ) {
    return EwbClass.setVisibleForPrintHistory(visible);
  }
};

/**
 * メモリーの消費量情報の取得をする。<br>
 * @returns {Int} 消費メモリー（Byte)を返す<br>
 *■補足<br>
 * 　　・EWB V4,V5以外は、この機能は使用できない。<br>
 * @lang ja
 */
BrowserExt.getAllocatedMemorySize = function()
{
    if( this.browserVersion == 4 ) {
      return ( debug.flexAllocated + debug.heapAllocated );
    }
    if( this.browserVersion == 5 ) {
      return EwbClass.getAllocatedMemorySize();
    }
};

/**
 * メモリーの空き容量情報の取得をする。<br>
 * @returns {Int} 空きメモリー（Byte)を返す<br>
 *■補足<br>
 * 　　・EWB V4,V5以外は、この機能は使用できない。<br>
 * @lang ja
 */
BrowserExt.getFreeMemorySize = function()
{
    if( this.browserVersion == 4 ) {
      return ( debug.flexFree + debug.heapFree );
    }
    if( this.browserVersion == 5 ) {
      return EwbClass.getFreeMemorySize();
    }
};

/**
 * オートクリア許可指定をする。<br>
 *■補足<br>
 * 　　・EWB V5以外は、この機能は使用できない。<br>
 * @lang ja
 */
BrowserExt.setAutoClearEnable = function()
{
    if( this.browserVersion == 5 ) {
      EwbClass.setAutoClearEnable ();
    }
};

/**
 * 製品のDisplay幅を取得をする。<br>
 * @returns {Int} Display幅（Pixel)を返す<br>
 * @lang ja
 */
BrowserExt.getDisplayWidth = function()
{
    if( this.browserVersion == 5 ) {
      if(navigator.platform.indexOf("Win32",0) >= 0 ) {
        return window.outerWidth;
      }
      return screen.width;
    }
    else {
      return screen.width;
    }
};

/**
 * 製品のDisplay高さを取得をする。<br>
 * @returns {Int} Display高さ（Pixel)を返す<br>
 * @lang ja
 */
BrowserExt.getDisplayHeight = function()
{
  if( this.browserVersion == 5 ) {
      if(navigator.platform.indexOf("Win32",0) >= 0 ) {
        if(window.outerHeight == 440 || window.outerHeight == 480) {
          return 480;
        }
        return 600;
      }
      return screen.height;
    }
    else {
      return screen.height;
  }
};

/**
 * 汎用デバイス指示をする。<br>
 *■補足<br>
 * 　　・EWB V4,V5以外は、この機能は使用できない。<br>
 * @returns {String} デバイスから返される任意の文字列を返す<br>
 * @lang ja
 */
BrowserExt.setCommand = function(command)
{
  if( this.browserVersion == 5 ) {
    return EwbClass. setCommand(command);
  }
  if( this.browserVersion == 4 ) {
    return document.EwbClass. setCommand(command);
  }
  return "";
}

/**
 * @private
 */
BrowserExt.SetLogMessage = function(msg,point)
{
    if( this.browserVersion == 3 || this.browserVersion == 4 ) {
      return document.EwbClass.print(msg,point);
    }
    if( this.browserVersion == 5 ) {
      return EwbClass.print(msg,point);
    }
};
/**
 * @private
 */
BrowserExt.GetHardKey = function()
{
    var kcode = event.which;
    if( this.browserVersion == 3 ) {
        kcode = event.keyCode;
    }
    //alert(kcode);
    if( BrowserExt.CaptreFunc != null ) {
        BrowserExt.CaptreFunc(kcode);
    } 
};
/**
 * @private
 */
//BrowserExt.OnloadFunc = window.onload;
BrowserExt.Main = function()
{
    BrowserExt.Init();
    if(BrowserExt.OnloadFunc != null) {
        BrowserExt.OnloadFunc();
    }
};
//window.onload = BrowserExt.Main;



