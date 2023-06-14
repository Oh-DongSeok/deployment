/**
 * @fileoverview カスタムサービスコンテンツでブラウザ/パネル種別を判別する為のJavaScriptライブラリ<br>
 * 以下のメソッドを提供する<br>
 * getBrowserType<br>
 * getScreenType<br>
 * getScreenWidth<br>
 * initialize
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.1.0
 * @lang ja
 */

/**
 * @fileoverview JavaScript library for determining browser / UI panel type from Custom Service application.<br>
 * Provides the following methods:<br>
 * getBrowserType<br>
 * getScreenType<br>
 * getScreenWidth<br>
 * initialize
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 1.1.0
 * @lang en
 */

/** 
 * カスタムサービスコンテンツでブラウザ/パネル種別を判別するための名前空間定義
 * @namespace ブラウザ/パネル種別を判別する
 * @static
 * @lang ja
 */
 
 /** 
 * Namespace definition for determining browser / UI panel type from Custom Service application.
 * @namespace Determines browser / UI panel type.
 * @static
 * @lang en
 */
 
 
var BrowserLib = {
	/**
	 *	デバイスの組み込みブラウザのタイプを表す文字列 <br>
	 *	@type String
	 *	@default null
	 *  @lang ja
	 */
	/**
	 *	String representing device-embedded browser type.<br>
	 *	@type String
	 *	@default null
	 *  @lang en
	 */
	browser	:	null,
	/**
	 *	コンテンツを表示可能な領域を表す文字列
	 *	@type String
	 *	@default null
	 * @lang ja
	 */
	 /**
	 *	String representing displayable area for Custom Service. 
	 *	@type String
	 *	@default null
     * @lang en
	 */
	screen	:	null
};

/**
 * このコンストラクタを明示的に呼び出す必要はない。
 * @class <a href="BrowserLib.html#browser">BrowserLib.browser</a>に設定される定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない。
 * @static
 * @lang ja
 */
 
 /**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants to set to <a href="BrowserLib.html#browser">BrowserLib.browser</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @static
 * @lang en
 */
BrowserLib.BrowserType =
{	
	/**
	 *	EWBV3ブラウザを表す
	 *	@type String
	 *	@static
	 *  @constant
     * @lang ja
	 */
	 
	/**
	 *	EWBV3 browser.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	INSPIRIUM	:			"Inspirium",
	/**
	 *	EWBV4ブラウザを表す
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	 
	/**
	 *	EWBV4 browser.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	ANT			:			"Ant",
	/**
	 *	EWBV5ブラウザを表す
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	QT			:			"Qt",
	/**
	 *	その他のブラウザを表す
	 *	@type String
	 *  @static
	 *	@constant
	 *  @lang ja
	 */
	 
	/**
	 *	Other browser.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	ETC			:			"etc"
};
/**
 * このコンストラクタを明示的に呼び出す必要はない。
 * @class <a href="BrowserLib.html#screen">BrowserLib.screen</a>に設定される定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない。
 * @static
 * @lang ja
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants set to <a href="BrowserLib.html#screen">BrowserLib.screen</a>.
 * @constructor There is no need to explicitly call this constructor.
 * @static
 * @lang en
 */

BrowserLib.ScreenType =
{
	/**
	 *	800×480の大きさでコンテンツが全面に表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service is displayed on entire 800×480 area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	WVGA_ALL_SCREEN				:	"wvga_all",
	/**
	 *	800×480の大きさでコンテンツがメニューバー付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service is displayed on 800×480 area with menu bar.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	WVGA_WITH_MENUBAR			:	"wvga_menu",
	
	/**
	 *	800×480の大きさでコンテンツがメッセージエリア付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service is displayed on 800×480 area with message area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	WVGA_STATUS_MESSAGE			:	"wvga_status",
	/**
	 *	800×600の大きさでコンテンツがメッセージエリア付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service application is displayed on entire 800×600 area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	SVGA_ALL_SCREEN				:	"svga_all",
	/**
	 *	800×600の大きさでコンテンツがメニューバー付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service application is dipslayed on 800×600 area with menu bar.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	/**
	 *	1024×600の大きさでコンテンツがメッセージエリア付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service application is displayed on entire 1024×600 area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	WSVGA_ALL_SCREEN				:	"wsvga_all",
	SVGA_WITH_MENUBAR			:	"svga_menu",
	/**
	 *	800×600の大きさでコンテンツがメッセージエリア付きで表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	 /**
	 *	Custom Service application is dipslayed on 800×600 area with message area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	SVGA_STATUS_MESSAGE			:	"svga_status",
	/**
	 *	800×532の大きさでコンテンツが全面に表示される
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang ja
	 */
	/**
	 *	Custom Service application is dipslayed on entire 800×532 area.
	 *	@type String
	 *	@static
	 *	@constant
	 *  @lang en
	 */
	SVGA_STATUS_MESSAGE_2008	:	"svga_status_2008"
};
/**
 * ブラウザで表示されているWindowのwidth領域を取得する
 * @static
 * @privates
 * @return window.innerWidth
 * @lang ja
 */
/**
 * Retrieves width of Window displayed on browser.
 * @static
 * @private
 * @return window.innerWidth
 * @lang en
 */
BrowserLib.getScreenWidth = function()
{
	if( window.innerWidth )
	{
		return window.innerWidth;
	}
	return 0;
};
/**
 * ブラウザで表示されているWindowのheight領域を取得する
 * @static
 * @private
 * @return window.innerHeight
 * @lang ja
 */
 
 /**
 * Retrieves height of Window displayed on browser.
 * @static
 * @private
 * @return window.innerHeight
 * @lang en
 */
BrowserLib.getScreenHeight = function()
{
	if( window.innerHeight )
	{
		return window.innerHeight;
	}
	return 0;
};

/**
 * userAgentよりブラウザの種類を判別する
 * @static
 * @return BrowserLib.browser
 * @lang ja
 */
  /**
 * Determines browser type from userAgent.
 * @static
 * @return BrowserLib.browser
 * @lang en
 */
BrowserLib.getBrowserType = function()
{
	if( navigator.userAgent == "Mozilla/5.0 (compatible; FX-EWB/3.0)" )
	{
		BrowserLib.browser = BrowserLib.BrowserType.INSPIRIUM;
	}
	else if( navigator.userAgent == "Mozilla/5.0 (compatible; FX-EWB/4.0)" )
	{
		BrowserLib.browser = BrowserLib.BrowserType.ANT;
	}
	else if( navigator.userAgent.indexOf("FX-EWB/5") !=  -1)
	{
		BrowserLib.browser = BrowserLib.BrowserType.QT;
	}
	else
	{
		BrowserLib.browser = BrowserLib.BrowserType.ETC;
	}
	return BrowserLib.browser;
};
/**
 * width領域、height領域により利用可能な画面領域の種類を判別する
 * @static
 * @return {String} BrowserLib.screen
 * @lang ja
 */
 
 /**
 * Determines available screen display area from width/height attributes.
 * @static
 * @return {BrowserLib.ScreenType} BrowserLib.screen
 * @lang en
 */
BrowserLib.getScreenType = function()
{
	var x = BrowserLib.getScreenWidth();
	var y = BrowserLib.getScreenHeight();

	if( (x == 800) && (y == 600) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.SVGA_ALL_SCREEN;
	}
	else if( (x == 800) && (y == 523) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.SVGA_STATUS_MESSAGE;
	}
	else if( ((x == 800) && (y == 532)) || (BrowserLib.browser == BrowserLib.BrowserType.INSPIRIUM) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.SVGA_STATUS_MESSAGE_2008;
	}
	else if( (x == 800) && (y == 560) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.SVGA_WITH_MENUBAR;
	}
	else if( (x == 800) && (y == 480) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.WVGA_ALL_SCREEN;
	}
	else if( (x == 800) && (y == 403) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.WVGA_STATUS_MESSAGE;
	}
	else if( (x == 800) && (y == 440) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.WVGA_WITH_MENUBAR;
	}
	else if( (x == 1024) && (y == 600) )
	{
		BrowserLib.screen = BrowserLib.ScreenType.WSVGA_ALL_SCREEN;
	}
	else
	{ 
		BrowserLib.screen = false;
	}

	return BrowserLib.screen;
};

/**
 * ライブラリの初期化
 * @static
 * @lang ja
 */

/**
 * Initializes library.
 * @static
 * @lang en
 */
BrowserLib.initialize = function()
{
	BrowserLib.getBrowserType();
	BrowserLib.getScreenType();
	return;
};

/*----------------------------------------------------------------------------
 * Call functions
 ----------------------------------------------------------------------------*/
BrowserLib.initialize();
/*-History---------------------------------------------------------------------
 * Name         Date            Description
 *-----------------------------------------------------------------------------
 * ochiai		2009/03/06		First Create
 * satou		2009/11/04		名前空間化
 ----------------------------------------------------------------------------*/
