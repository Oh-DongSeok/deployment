/** 
 * @fileoverview ジョブフローにおけるファクス配送ジョブを扱うクラスで使用される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2007-2010 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in classes handling Fax distribution jobs in Job Flow.
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2007-2010 Fuji Xerox Co., Ltd. All rights reserved.
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
JFLib.RESOURCE.FAXG3 = 'Distribute/Fax/G3';
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
JFLib.RESOURCE.FAXG4 = 'Distribute/Fax/G4';

/**
 * Fax配送
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Fax distribution.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.Fax = 2;


/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class Faxの回線設定に用いられる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * There is no need to explicitly call this constructor.
 * @class This class defines constants used in Fax line setting.
 * @constructor There is no need to explicitly call this constructor.
 * @lang en
 *
 */
JFLib.LT = function() {};

/**
 * 公衆回線を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Public line.
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LT.PUBLIC = 'Public';
/**
 * 構内回線を表す
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * PBX.
 * @final
 * @type String
 * @constant
 * @lang ja
 */
JFLib.LT.PBX = 'PBX';

JFLib.JSIncluded("JfsDefFax");

