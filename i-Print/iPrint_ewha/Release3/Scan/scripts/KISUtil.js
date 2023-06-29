 /**
  * @fileoverview デバッグ用のクラスの定義
  * @version 1.0.0
  * @lang ja
  */

 /**
  * KISUtilの使用してデバッグを行うための名前空間定義
  * @namespace KISUtilを使用しデバッグを行う
  * @static
  * @lang ja
  */
 var KISUtil = {
     /**
      * KISUtilのバージョンを表す
      * @constant
      * @type String
      * @lang ja
      */
     version: "1.0.0"
 };

 /**
  * デバッグモードを指定する。
  * MACHINE_RELEASE	:	デバイスに実行し、リリースするモード
  * MACHINE_DEBUG 	:	デバイスに実行し、デバッグを行うモード
  * FIREFOX_DEBUG 	:	FireFoxで実行し、デバイスの実際のデータを取得するモード
  * FIREFOX_DUMMY 	:	FireFoxで実行し、ダミーデータを利用するモード
  * @lang ja
  */
 /**
  * Set a Debug Mode
  * MACHINE_RELEASE	:	The mode for install on the MFD
  * MACHINE_DEBUG 	:	The mode for debugging on the MFD
  * FIREFOX_DEBUG 	:	The mode for debugging on the Web browser(FireFox) with real data
  * FIREFOX_DUMMY 	:	The mode for debugging on the Web browser(FireFox) with dummy data
  * @lang en
  */
 var CONDITION = {
     MACHINE_RELEASE: "MACHINE_TEST_MODE_WITHOUT_DEBUG",
     MACHINE_DEBUG: "MACHINE_TEST_MODE_WITH_DEBUG",
     FIREFOX_DEBUG: "FIREFOX_TEST_MODE_WITH_DEBUG",
     FIREFOX_DUMMY: "FIREFOX_TEST_MODE_WITH_DEBUG_WITH_DUMMY_DATA"
 };

 var gHost;

 //var REMOTE_MACHINE = "192.168.200.200";
 //var REMOTE_MACHINE = "192.168.0.200";
 //var CS_OPERATION_MODE = CONDITION.FIREFOX_DEBUG;
 var REMOTE_MACHINE = "localhost";
 var CS_OPERATION_MODE = CONDITION.MACHINE_RELEASE;
 //var CS_OPERATION_MODE = CONDITION.MACHINE_DEBUG;
 var glb_logwrite_mode = LogLib.LEVEL.ERR;

 switch (CS_OPERATION_MODE) {
     case CONDITION.MACHINE_RELEASE:
         var gDummyFlag = false;
         var flg_Dummy_Beep = false;
         var glb_debug_mode = false;
         break;
     case CONDITION.MACHINE_DEBUG:
         var gDummyFlag = false;
         var flg_Dummy_Beep = false;
         var glb_debug_mode = true;
         break;
     case CONDITION.FIREFOX_DEBUG:
         var gDummyFlag = false;
         var flg_Dummy_Beep = true;
         var glb_debug_mode = true;
         break;
     case CONDITION.FIREFOX_DUMMY:
         var gDummyFlag = true;
         var flg_Dummy_Beep = true;
         var glb_debug_mode = true;
         break;
     default:
         break;
 }

 if (gDummyFlag) {
     gHost = "127.0.0.1";
     SSMILib.dummy = true;
 } else {
     if (flg_Dummy_Beep) {
         gHost = REMOTE_MACHINE;
     } else {
         gHost = "127.0.0.1";
     }
 }

 SSMILib.host = gHost;

 /**
  * デバイス側で実行可能な関数をFireFoxで実行されるように再定義
  * @lang ja
  */
 if (flg_Dummy_Beep) {
     BrowserExt.Beep = function(type) {};

     BrowserExt.GetAcceptLanguage = function() {
         return "ko";
     };

     BrowserExt.SetScreenChange = function(param) {
         if (param) {
             alert(param);
         } else {
             alert("go to device menu");
         }
         return false;
     };

     BrowserExt.GetHardKey = function() {};
 }

 /**
  * Sysログ関連関数をFireFoxで実行されるように再定義<br>
  * logLevel 0 Error<br>
  * logLevel 1 Warning<br>
  * logLevel 2 Information<br>
  * logLevel 3 Debug
  */
 if (glb_debug_mode) {
     LogLib.write = function(str, logLevel) {
         KISUtil.writeLog(str, logLevel);
     };
     ContentsLib._getCsProp = function() {};
 }

 /**
  * デバッグ用の画面エリアを初期化する。
  * @param {string} body_ID　body elementのID
  * @lang ja
  */
 KISUtil.initDebug = function(body_ID) {
     if (glb_debug_mode) {
         var debugElement = document.createElement("div");
         debugElement.setAttribute("id", "debug");
         debugElement.setAttribute("style", "position:absolute;top:0px;left:810px;" +
             "background-color:rgba(255,255,255,0.5);width:800px;height:480px;font-family:Tahoma;" +
             "border:2px solid #b0b0b0;overflow:auto;box-sizing: border-box;z-index:11;");
         document.body.appendChild(debugElement);

         if (flg_Dummy_Beep) {
             document.onkeydown = KISUtil.keyCheck;
         }
     }
 };

 /**
  * デバッグコードを画面に表示する。(一ラインごとに表示される）
  * @param {string} title　デバッグするオブジェクト名及びデータ名
  * @param {string} string　デバッグするオブジェクトの値及びデータ値
  * @lang ja
  */
 KISUtil.debug = function(title, string) {
     if (glb_debug_mode) {
         var element = document.getElementById("debug");
         var textNode = document.createTextNode("[" + title + "]" + " = [" + string + "]");
         element.appendChild(textNode);
         element.appendChild(document.createElement("br"));
     } else {
         var str = "[CS_Scan]" + title + ":" + string;
         var level = (typeof lvl == "undefined") ? LogLib.LEVEL.DBG : lvl;

         switch (level) {
             case "LogLib.LEVEL.ERR":
                 LogLib.write(str, LogLib.LEVEL.ERR);
                 break;
             case "LogLib.LEVEL.WRN":
                 LogLib.write(str, LogLib.LEVEL.WRN);
                 break;
             case "LogLib.LEVEL.INF":
                 LogLib.write(str, LogLib.LEVEL.INF);
                 break;
             default:
                 LogLib.write(str, LogLib.LEVEL.DBG);
         }
     }
 };

 /**
  * ContentsLibのデバッグコードを画面に表示する。
  * @param {string} message　デバッグコード
  * @lang ja
  */
 KISUtil.writeLog = function(str, logLevel) {
     if (glb_debug_mode) {
         var prefix = LogLib.PREFIX[logLevel];
         var message = prefix + ":" + str;
         var element = document.getElementById("debug");
         if (element) {
             var textNode = document.createTextNode(message);
             element.appendChild(textNode);
             element.appendChild(document.createElement("br"));
         }
     }
 };

 /**
  * キーボードのキーをデバイスのテンキーのように処理する(デバッグ用)<br>
  * CS別に関数内のコードが修正される場合がある。
  * @param {event object} e イベント
  * @lang ja
  */
 KISUtil.keyCheck = function(e) {
     if (!e) {
         e = event;
     }
     var keyCode = e.keyCode;
     if (keyCode < 48 || (keyCode > 57 && keyCode < 96) || keyCode > 105) {
         if (keyCode == 46) { //Delete key == Clear key == FX_VK_BACK_SPACE(C)
             keyCode = 8;
         } else if (keyCode == 35) { //End key == FX_VK_CLEAR(reset key);
             keyCode = 57344;
         } else if (keyCode == 34) { //PageDown == FX_VK_START
             keyCode = 57346;
         } else if (keyCode == 37) { //<- == FX_VK_MULTIPLY
             keyCode = 42;
         } else if (keyCode == 39) { // -> == FX_VK_NUMBER
             keyCode = 35;
         } else if (keyCode == 40) { // | == FX_VK_PAUSE
             keyCode = 44;
         } else {
             return;
         }
     }
     if (keyCode >= 96 && keyCode <= 105) {
         keyCode -= 48;
     }

     ContentsLib._onHardKeyEvent(keyCode);
 };

 (function() {
     if (!flg_Dummy_Beep) {
         if (!window.console) window.console = {};
         window.console.log = function(msg) {
             KISUtil.debug(null, msg);
         };
     };
 })();
