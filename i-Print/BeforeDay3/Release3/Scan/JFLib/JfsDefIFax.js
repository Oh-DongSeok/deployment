/** 
 * @fileoverview ジョブフローにおけるInternetFax配送ジョブを扱うクラスで使用される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2009 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in classes handling Internet Fax distribution jobs in Job Flow.
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2009 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang en
 */

JFLib.JSInclude("JfsDefCom");
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.RESOURCE.IFAX = 'Distribute/IFax';
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang ja
 */
/**
 * @final
 * @type String
 * @private
 * @constant
 * @lang en
 */
JFLib.RESOURCE.IFAXSEC = 'Distribute/IFax/Secure';


/**
 * InternetFax配送
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Internet Fax distribution
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.IFax = 5;

/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class <a href="JFLib.IFax.html#profile">profile</a>変数に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in <a href="JFLib.IFax.html#profile">profile</a> variable.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.IFAXPROF = function() {};

/**
 * 圧縮しない
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * No compression.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IFAXPROF.NOTSPEC = 'NotSpecified';
/**
 * TIFF_S
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * TIFF_S
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IFAXPROF.TS = 'MH';
/**
 * TIFF_F
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * TIFF_F
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IFAXPROF.TF = 'MMR';
/**
 * TIFF_J
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * TIFF_J
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.IFAXPROF.TJ = 'JBIG';

JFLib.JSIncluded("JfsDefIFax");

