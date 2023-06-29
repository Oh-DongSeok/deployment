/**
 *  @fileoverview 指示書においてユーザ通知指定を扱うためのクラス定義<br>
 *  これらのクラスを使うためには
 *  <ul>
 *  <li>JfsDefNotification.js
 *  </ul>
 *  のロードが必要となる<br>
 *  <br>
 *  使用するには<b>JFLib/JfsCom.js</b>を参照すること
 *  @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.
 *  @version 1.0.0
 *  @lang ja
 */
/**
 *  @fileoverview Defines classes for handling user notification designation in Job Flow Sheet.<br>
 *  To use these classes,
 *  <ul>
 *  <li>JfsDefNotification.js
 *  </ul>
 *  must be loaded.<br>
 *  <br>
 *  To use this file, see <b>JFLib/JfsCom.js</b>.
 *  @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.
 *  @version 1.0.0
 *  @lang en
 */
//JfsDefNotification.jsのロード
JFLib.JSInclude("JfsDefNotification");

/**
 * Notification インスタンスを作成する
 * @constructor
 * extends JFLib.JobTemplate
 * @return Notificationオブジェクト <br><br>
 * @class ユーザ通知を設定する為のクラス<br>
 * <a href="JFLib.JobTemplate.html#addNotification>addNotification</a>により通知処理を設定する。
 * @example 
 * ■使用例 
 *		var notification = new JFLib.Notification();
 *		notification.invoke = new JFLib.Invoke();
 *		
 *		var jobtemplate = new JFLib.JobTemplate();
 *		jobtemplate.addNotification(notification);
 * @lang ja 
 */
 /**
 * Creates Notification instance.
 * @constructor
 * extends JFLib.JobTemplate
 * @return Notificationオブジェクト <br><br>
 * @class Class for setting user notification.<br>
 * Sets notification using <a href="JFLib.JobTemplate.html#addNotification>addNotification</a>.
 * @example 
 * Example: 
 *		var notification = new JFLib.Notification();
 *		notification.invoke = new JFLib.Invoke();
 *		
 *		var jobtemplate = new JFLib.JobTemplate();
 *		jobtemplate.addNotification(notification);
 * @lang en 
 */
JFLib.Notification = function () {
	/**
    * 通知の条件を指定する
    * @type JFLib.CONDITION
    * @default JFLib.CONDITION.NEVER
    * @lang ja
    */
    /**
    * Sets conditions for notification.
    * @type JFLib.CONDITION
    * @default JFLib.CONDITION.NEVER
    * @lang en
    */
	this.condition = JFLib.CONDITION.NEVER;

	/**
    * 通知先に外部サービス呼び出しを指定する
    * @type JFLib.Invoke
    * @default null
    * @lang ja
    */
    /**
    * Sets external Web service for notification.
    * @type JFLib.Invoke
    * @default null
    * @lang en
    */
	this.invoke = null;
};

/* @private */
JFLib.Notification.prototype.toXmlNode = function(xml) {
	var notification = xml.createElementNS(XMLLib.NS.JT, 'Notification');
	if ( this.condition ) {
		notification.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Condition', this.condition));
	}

	if ( this.invoke && this.invoke.toXmlNode != null ){
		notification.appendChild(this.invoke.toXmlNode(xml));
	}
	return notification;
};

/* @private */
Extend(JFLib.Notification.prototype, JFLib.JobTemplate);

/* @private */
JFLib.Notification.prototype.addRscNode = function(xml, node) {
	if(this.invoke) {
		node.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Resource', JFLib.RESOURCE.NTFYYESR));
	}
};

JFLib.JSIncluded("JfsNotification");