/** 
 * @fileoverview Browser拡張機能利用のためのJavaScriptライブラリ<共通編>
 *
 * @author Copyright (C) FUJIFILM Business Innovation Corp. 2021<br>
 * @version 1.1.0
 * @lang ja
 */
/** 
 * @fileoverview JavaScript library for using extended browser features <Community Edition>
 *
 * @author Copyright (C) FUJIFILM Business Innovation Corp. 2021<br>
 * @version 1.1.0
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

var BrowserExt = 
{
  /**
   *  デバイスの組み込みブラウザのバージョンを表す数値 <br>
   *  @type Int
   *  @default null
   *  @lang ja
   */
  /**
   *  String Device-embedded browser version.<br>
   *  @type Int
   *  @default null
   *  @lang en
   */

  browserVersion: null,
  /**
   *    デバイスのプラットフォームバージョンを示す数値 <br>
   *    @type Int
   *    @default null
   *  @lang ja
   */
  /**
   *    Integer Device platform version.<br>
   *    @type Int
   *    @default null
   *  @lang en
   */
  pfVersion: null,

   /**
   * @private
   */
  uiGeneration: -1,

   /**
   * @private
   */
  argChkFlg: false
};
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
BrowserExt.keyCode.FX_VK_LOG_IN_OUT = 137;

/**
 * ライブラリの初期化 
 *<br>
 *■補足<br>
 * 　　【 呼び出しタイミングと条件】<br>
 * 　　・本関数は、ユーザーのonloadイベント処理内で実行されること。<br>
 * 　　・本関数を実行して初期化しても、onloadコンテキスト内では、他関数は使用できない。<br>
 * @lang ja
 */
 
 /**
 * Initializes library. 
 * <br>
 * NOTE: <br>
 * This method can be called when the following conditions are met:<br>
 * - In user onload event processing<br>
 * - Other methods cannot be called within the "onload" context, <br>
 *   even when library is initialized using this method. <br>
 * @lang en
 */
 
BrowserExt.Initialize = function()
{
    var pos = navigator.userAgent.indexOf("PFVer:",0);
    if( pos >= 0 ) {
        BrowserExt.pfVersion = navigator.userAgent.substr(pos+6,1);
        var verStr = navigator.userAgent.substring(pos).match(/[0-9.]+/);
        if (navigator.userAgent.substring(pos+6).indexOf(verStr) == 0) {
            BrowserExt.pfVersion = Number(verStr);
        }
    }
    var pos = navigator.userAgent.indexOf("FX-EWB/",0);
    if( pos >= 0 ){
      BrowserExt.browserVersion = navigator.userAgent.substr(pos+7,1);
      var verStr = navigator.userAgent.substring(pos).match(/[0-9.]+/);
      if (navigator.userAgent.substring(pos+7).indexOf(verStr) == 0) {
          BrowserExt.browserVersion = Number(verStr);
      }
    }
    BrowserExt.argChkFlg = true;

    /* for MIF */
    if( ( BrowserExt.pfVersion == null ) || ( BrowserExt.pfVersion < 2.2 ) ) {
      BrowserExt.keyCode.FX_VK_LOG_IN_OUT = 4104;
    }
};

/**
 * 音を鳴らす 
 * <br>
 * @param {int} type 音の種類（0：Valid(許可）音、1：Invalid(禁止）音）を示す数値<br>
 * @lang ja
 */
 
 /**
 * Make sounds.
 * <br>
 * @param {int} type Integer specifying sound type (0 for valid, 1 for invalid sound)<br>
 * @lang en
 */
 
BrowserExt.Beep = function(type)
{
  if( parseInt(BrowserExt.browserVersion) >= 5 ) {
    if( type == 0 ) {
        EwbClass.setBeep(0);
    }
    else if( type == 1 ) {
        EwbClass.setBeep(1);
    }
    return;
  }
  if( type == 0 ) {
      document.EwbClass.setBeep(0);
  }
  else if( type == 1 ) {
      document.EwbClass.setBeep(1);
  }
};
/**
 * 現在のAcceptLanguage情報を得る 
 * @returns {String} 取得したAcceptLanguageの文字列。取得できなかった場合はnullを返す。<br>
 * @lang ja
 */
 
/**
 * Retrieves information on current AcceptLanguage settings. 
 * @returns {String} String representing retrieved AcceptLanguage settings. <br>
 * If AcceptLanguage settings could not be retrieved, returns NULL. <br>
 * @lang en
 */

BrowserExt.GetAcceptLanguage = function()
{
    if( parseInt(BrowserExt.browserVersion) >= 5 ) {
        if( navigator.language == "zh-CN" ) {
            return("zh-cn");
        }
        else if( navigator.language == "zh-TW" ) {
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
 * デバイスUIに汎用指示をする
 * @param {String} service デバイスUIへの指示内容。<br>
 * @returns {Bool} 以下の情報を返す<br>
 * デバイスUIへの指示が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
 
 /**
 * Executes the method common to device UI. 
 * @param {String} service Method to device UI. <br>
 * @returns {Bool} Returns "true" if the method common to device UI is <br>
 * successfully set; otherwise returns "false."<br>
 * @lang en
 */
 
 BrowserExt.SetScreenChange = function(service)
 {
   var name = service;
   if( service == null || service == "" ) {
       name = "allservice";
   }
   /*
   if( this.browserVersion == 0 ) {
     ExitCUIMode(name);
     return true;
   }
   */
   BrowserExt.browserVersion = 5;
   if( BrowserExt.browserVersion >= 5 ) {
     return EwbClass.screenChange(name);
   }
   return document.EwbClass.screenChange(name);
 };

/**
 * キーイベントを送出する<br>
 *■補足<br>
 * 　　・この機能は、EWB V5.1以降で使用可能である。<br>
 * @param {Int} code 送信するキーコードを指定する。<br>
 * @returns {Bool} 以下の情報を返す<br>
 * デバイスUIへの指示が成功したらtrue、<br>
 * そうでない場合はfalseがセットされる<br>
 * @lang ja
 */
/**
 * Send key event.<br>
 *NOTE:<br>
 * 　　- This feature is available for EWB V5.1 and later.<br>
 * @param {Int} code Specify key code to send.<br>
 * @returns {Bool} Returns "true" if the method common to device UI is <br>
 * successfully set; otherwise returns "false."<br>
 * @lang en
 */
BrowserExt.SendKeyCode = function(code)
{
    if( BrowserExt.browserVersion >= 5.1 ) {
      var argList= [
        BrowserExt.keyCode.FX_VK_LOG_IN_OUT,
      ];
      if( BrowserExt.argChkFlg && argList.indexOf(code) == -1 ) return false;
      return EwbClass.sendKeyCode (code);
    }
    return false;
};
