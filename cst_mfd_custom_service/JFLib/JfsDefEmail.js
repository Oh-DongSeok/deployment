/** 
 * @fileoverview ジョブフローにおけるSMTPメール配送ジョブを扱うクラスで使用される定数を定義する<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.0.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines constants for classes handling SMTP mail distribution in Job Flow.
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.
 * @version 2.0.0
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
JFLib.RESOURCE.SMTP = 'Distribute/SMTP';
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
JFLib.RESOURCE.SMTPSEC = 'Distribute/SMTP/Secure';

/**
 * SMTP配送
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * SMTP distribution.
 * @final
 * @type String
 * @constant
 * @lang en
 */
JFLib.OutputProcessType.Email = 4;

JFLib.JSIncluded("JfsDefEmail");

