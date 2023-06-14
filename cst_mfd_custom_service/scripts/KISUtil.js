/**
 * @fileoverview デバッグ用のクラスの定義
 * @author 張廣豕ｫ FXKIS
 * @version 1.0.0
 * @lang ja
 */
 /**
 * @fileoverview Set a Debug Mode.
 * @author JANG KWANG-HYUN FXKIS
 * @version 1.0.1
 * @lang en
 */

/**
 * KISUtilの使用してデバッグを行うための名前空間定義
 * @namespace KISUtilを使用しデバッグを行う
 * @static
 * @lang ja
 */
/**
 * Definition for KISUtil to use and debug a program
 * @namespace
 * @static
 * @lang en
 */
var KISUtil = {
	/**
	 * KISUtilのバージョンを表す
	 * @constant
	 * @type String
	 * @lang ja
	 */
	version : "1.0.0"
}

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
	MACHINE_RELEASE : "MACHINE_TEST_MODE_WITHOUT_DEBUG",
	MACHINE_DEBUG 	: "MACHINE_TEST_MODE_WITH_DEBUG",
	FIREFOX_DEBUG 	: "FIREFOX_TEST_MODE_WITH_DEBUG",
	FIREFOX_DUMMY 	: "FIREFOX_TEST_MODE_WITH_DEBUG_WITH_DUMMY_DATA"
};

var SET_SCREEN_TYPE 	= BrowserLib.ScreenType.WSVGA_ALL_SCREEN;
var REMOTE_MACHINE 		= "10.97.4.108";
//var REMOTE_MACHINE 		= "10.97.4.222";
//var CS_OPERATION_MODE 	= CONDITION.FIREFOX_DEBUG;
//var REMOTE_MACHINE 	= "localhost";
var CS_OPERATION_MODE = CONDITION.FIREFOX_DUMMY;

switch(CS_OPERATION_MODE){
	case CONDITION.MACHINE_RELEASE:
		var gDummyFlag 		= false;
		var flg_Dummy_Beep 	= false;
		var glb_debug_mode 	= false;
		break;
	case CONDITION.MACHINE_DEBUG:
		var gDummyFlag 		= false;
		var flg_Dummy_Beep 	= false;
		var glb_debug_mode 	= true;
		break;
	case CONDITION.FIREFOX_DEBUG:
		var gDummyFlag	 	= false;
		var flg_Dummy_Beep 	= true;
		var glb_debug_mode 	= true;
		break;
	case CONDITION.FIREFOX_DUMMY:
		var gDummyFlag 		= true;
		var flg_Dummy_Beep 	= true;
		var glb_debug_mode 	= true;
		break;
	default:
		break;
}

if(gDummyFlag){
	gHost 			= "127.0.0.1";
	SSMILib.dummy 	= true;
}else{
	if(flg_Dummy_Beep){
		gHost = REMOTE_MACHINE;
	}else{
		gHost = "127.0.0.1";
	}
}

SSMILib.host = gHost;

/**
 * デバイス側で実行可能な関数をFireFoxで実行されるように再定義
 * @lang ja
 */
/**
 * Redefinition of function which execution is possible on the device
 * @lang en
 */
if(flg_Dummy_Beep)
{
	BrowserExt.Beep = function(type){
		if (type != 0) {
			alert("BEEP :type" + type);
		}
	};

	BrowserExt.GetAcceptLanguage = function(){
		return "ko";
	};

	BrowserExt.SetScreenChange = function(param){
		if(param){
			alert(param);
		}else{
			alert("go to device menu");
		}
		return false;
	};

	BrowserExt.GetHardKey = function(){};

	BrowserLib.getScreenType = function()
	{
		return SET_SCREEN_TYPE;
	}
}

/**
 * Sysログ関連関数をFireFoxで実行されるように再定義<br>
 * logLevel 0 Error<br>
 * logLevel 1 Warning<br>
 * logLevel 2 Information<br>
 * logLevel 3 Debug
 */
if(glb_debug_mode)
{
	LogLib.write = function(str, logLevel){
		KISUtil.writeLog(str, logLevel);
	}
	ContentsLib._getCsProp=function(){}
}

/**
 * デバッグ用の画面エリアを初期化する。
 * @param {string} body_ID　body elementのID
 * @lang ja
 */
/**
 * Initialization of debug display area
 * @param {string} body_ID The id of the body element
 * @lang en
 */
KISUtil.initDebug = function(body_ID)
{
	if(glb_debug_mode){
		var debugElement = document.createElement("div");
		debugElement.setAttribute("id","debug");
		debugElement.setAttribute("style","position:absolute;top:0px;left:1030px;" +
				"background-color:#f0f0f0;width:500px;height:600px;font-family:Tahoma;" +
				"border:2px solid #b0b0b0;overflow:auto;");
		body = document.getElementById(body_ID);
		body.appendChild(debugElement);

		if(flg_Dummy_Beep){
			document.onkeydown = KISUtil.keyCheck;
		}
	}
}

/**
 * デバッグコードを画面に表示する。(一ラインごとに表示される）
 * @param {string} title　デバッグするオブジェクト名及びデータ名
 * @param {string} string　デバッグするオブジェクトの値及びデータ値
 * @lang ja
 */
/**
 * Display a debug line
 * @param {string} title
 * @param {string} string
 * @lang en
 */
KISUtil.debug = function(title, string)
{
	if(glb_debug_mode){
		var element = document.getElementById("debug");
		var textNode = document.createTextNode( "["+title+"]"+" = ["+string+"]");
		element.appendChild(textNode);
		element.appendChild( document.createElement( "br" ) );
	}
}

/**
 * ContentsLibのデバッグコードを画面に表示する。
 * @param {string} message　デバッグコード
 * @lang ja
 */
/**
 * Display a debug line(ContentsLib)
 * @param {string} message
 * @lang en
 */
KISUtil.writeLog = function(str, logLevel)
{
	if(glb_debug_mode){
		var prefix = LogLib.PREFIX[logLevel];
		var message = prefix + ":"+ str;
		var element = document.getElementById("debug");
		if(element){
			var textNode = document.createTextNode(message);
			element.appendChild(textNode);
			element.appendChild(document.createElement("br"));
		}
	}
}

/**
 * キーボードのキーをデバイスのテンキーのように処理する(デバッグ用)<br>
 * CS別に関数内のコードが修正される場合がある。
 * @param {event object} e イベント
 * @lang ja
 */
/**
 * A function to replace some event handling of hard keys on EWB(For debugging)<br>
 * sometimes corrects CS separately.
 * @param {event object} e event
 * @lang en
 */
KISUtil.keyCheck = function(e)
{
	if (!e){
		e = event;
	}
	var keyCode = e.keyCode;
	if(keyCode < 48 || (keyCode > 57 && keyCode < 96) || keyCode > 105){
		if(keyCode == 46){//Delete key == Clear key == FX_VK_BACK_SPACE(C)
			keyCode = 8;
		}else if(keyCode == 35){//End key == FX_VK_CLEAR(reset key);
			keyCode = 57344;
		}else if(keyCode == 34){//PageDown == FX_VK_START
			keyCode = 57346;
		}else if(keyCode == 37){//<- == FX_VK_MULTIPLY
			keyCode = 42;
		}else if(keyCode == 39){// -> == FX_VK_NUMBER
			keyCode = 35;
		}else if(keyCode == 80){// p == FX_VK_PAUSE
			keyCode = 44;
		}else{
			return;
		}
	}
	if(keyCode >= 96 && keyCode <= 105){
		keyCode -= 48;
	}

	ContentsLib._onHardKeyEvent(keyCode);
};

(function(){
	if(!flg_Dummy_Beep){
		if(!window.console) window.console = {};
		window.console.log = function(msg){
			KISUtil.debug(null, msg);
		};
	};
})();
