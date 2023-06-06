/**
 * @fileoverview DOMノードをウィジェットとして扱うためのライブラリを記述するファイル<br>
 * <br>
 * 登録したDOMノードは、ライブラリからID属性で取り出すことが出来る。
 * ウィジェットの種別に応じて、ポップアップやボタンとして扱うことができる。
 * 本ライブラリでウィジェットとして扱うノードには必ずID属性が必要になる。<br>
 * 
 * @author Copyright(C) 2009-2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.2
 * @lang ja
 */
 /**
 * @fileoverview This file contains library for handling DOM nodes as widgets.<br>
 * <br>
 * Registered DOM nodes can be retrieved via this library by specifying their ID attributes.
 * They can be handled as popups or buttons, according to widget type.
 * ID attributes are required for nodes to be handled as widgets.<br>
 * 
 * @author Copyright(C) 2009-2012 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.2
 * @lang en
 */

/**
 * WidgetLib自身を表すクラス
 * @namespace
 * @static
 * @lang ja
 */
/**
 * This class represents WidgetLib itself.
 * @namespace
 * @static
 * @lang en
 */
var WidgetLib = {
	/**
	 * ライブラリのバージョンを表す
	 * @property
	 * @type String
	 * @lang ja
	 */
	/**
	 * Library version.
	 * @property
	 * @type String
	 * @lang en
	 */
	version: "1.0.0"
};

/**
 * ポップアップ種別を表す
 * @namespace
 * @lang ja
 */
 /**
 * Popup type.
 * @namespace
 * @lang en
 */
WidgetLib.PopupType = {
	
	/**
	 * ノーマルポップアップを表す
	 * ポップアップ中にウィンドウ外をクリックするとポップアップを閉じる
	 * @constant
	 * @lang ja
	 */
	 /**
	 * Normal popup.
	 * This type of popup is closed when area outside it is clicked.
	 * @constant
	 * @lang en
	 */
	NORMAL : "normal_popup",

	/**
	 * モーダルポップアップを表す
	 * ポップアップ中はウィンドウ外は反応しない
	 * @constant
	 * @lang ja
	 */
	 /**
	 * Modal popup.
	 * As long as this type of popup is popped up, any area oustide it does not respond to clicking/touch.
	 * @constant
	 * @lang en
	 */

	MODAL : "modal_popup"
};

/**
 * ボタン種別を表す
 * @namespace
 * @lang ja
 */
 /**
 * Button type.
 * @namespace
 * @lang en
 */
WidgetLib.ButtonType = {

	/**
	 * プッシュボタンを表す
	 * @constant
	 * @lang ja
	 */
	 /**
	 * Normal (push) button.
	 * @constant
	 * @lang en
	 */
	NORMAL : "normal_button",

	/**
	 * トグルボタンを表す
	 * @constant
	 * @lang ja
	 */
	/**
	 * Toggle button.
	 * @constant
	 * @lang en
	 */
	TOGGLE : "toggle_button",

	/**
	 * ポップアップボタンを表す
	 * ボタン押下時にattr.popupIdで表されるポップアップWidgetを開く
	 * @constant
	 * @lang ja
	 */
	 /**
	 * Popup button.
	 * When this button is pressed, popup widget specified by attr.popupId is popped up.
	 * @constant
	 * @lang en
	 */
	POPUP : "popup_button",

	/**
	 * ラジオボタンを表す
	 * ボタン押下時に同じattr.groupIdで登録された、他のラジオボタンをOFFにする
	 * @constant
	 * @lang ja
	 */
	 /**
	 * Radio button.
	 * When button is pressed, other buttons specified by attr.groupId are turned "off."
	 * @constant
	 * @lang en
	 */
	RADIO : "radio_button"
};

/**
 * ボタンの属性を表します
 * 
 * @class ボタンの属性を表すクラスです
 * @lang ja
 */
/**
 * Button attributes.
 * 
 * @class This class represents button attributes.
 * @lang en
 */
WidgetLib.ButtonAttr = function() {
	/**
	 * Off状態時のボタン画像のURL
	 * @type String
	 * @lang ja
	 */
	/**
	 * URL for image for button in "off" state.
	 * @type String
	 * @lang en
	 */
	this.offImg = "";

	/**
	 * On状態時のボタン画像のURL
	 * @type String
	 * @lang ja
	 */
	/**
	 * URL for image for button in "on" state.
	 * @type String
	 * @lang en
	 */
	this.onImg = "";

	/**
	 * Press状態時のボタン画像のURL
	 * @type String
	 * @lang ja
	 */
	/**
	 * URL of image for button in "pressed" state.
	 * @type String
	 * @lang en
	 */
	this.pressImg = "";

	/**
	 * Disable状態時のボタン画像のURL
	 * @type String
	 * @lang ja
	 */
	/**
	 * URL of image for button in "disabled" state.
	 * @type String
	 * @lang en
	 */
	this.disableImg = "";

	/**
	 * ボタン画像を設定するノードID。省略時はボタン自身のノードID<br><br>
	 * ライブラリは状態に応じたボタン画像をこのDOMノードIDに設定する
	 * 画像の優先順位は以下の通り
	 * disableImg > pressImg > onImg/offImg
	 *
	 * @type int
	 * @lang ja
	 */
	/**
	 * Node ID specifying button image. When omitted, node ID of button itself.<br><br>
	 * Library sets button image coresponding to button status to DOM node of this ID. Image priority is as follows:<br>
	 * disableimg > pressimg > onimg/offimg
	 *
	 * @type int
	 * @lang en
	 */
	this.targetImgId = null;

	/**
	 * ボタン押下時にポップアップ表示するwidgetId。ポップアップボタンのみ有効
	 * @type int
	 * @lang ja
	 */
	/**
	 * ID of widget to pop up when button is pressed. Valid only for popup buttons.
	 * @type int
	 * @lang en
	 */
	this.popupId = null;

	/**
	 * ラジオボタンのグループを識別する識別子。ラジオボタンのみ有効
	 * @type int
	 * @lang ja
	 */
	/**
	 * Radio button group identifier. Valid only for radio buttons.
	 * @type int
	 * @lang en
	 */
	this.groupId = null;
};

/**
 * ボタンの状態を表します
 *
 * @class ボタンの状態を表すクラスです。<br>
 * @lang ja
 */
/**
 * Button status.
 *
 * @class This class represents button status.<br>
 * @lang en
 */
WidgetLib.ButtonStatus = function()
{
	/**
	 * On状態かどうか
	 * @type Bool
	 * @lang ja
	 */
	/**
	 * Whether button is "on" or not.
	 * @type Bool
	 * @lang en
	 */
	this.on = false;

	/**
	 * Press状態かどうか
	 * @type Bool
	 * @lang ja
	 */
	/**
	 * Whether button is "pressed" or not.
	 * @type Bool
	 * @lang en
	 */
	this.press = false;
	
	/**
	 * Enable状態かどうか
	 * @type Bool
	 * @lang ja
	 */
	/**
	 * Whether button is "enabled" or not.
	 * @type Bool
	 * @lang en
	 */
	this.enable = true;
};

/**
 * ポップアップの状態を表します
 *
 * @class ポップアップの状態を表すクラスです。<br>
 * @lang ja
 */
/**
 * Popup status.
 *
 * @class This class represents popup status.<br>
 * @lang en
 */
WidgetLib.PopupStatus = function()
{
	/**
	 * Popup状態かどうか
	 * @type Bool
	 * @lang ja
	 */
	/**
	 * Whether widget is popped up or not.
	 * @type Bool
	 * @lang en
	 */
	this.popup = false;
};

/**
 * 初期化処理を行う<br>
 * 本関数をコールすることでライブラリの各関数を使用可能となる。<br>
 * 関数内部で、bodyノードのonmouseup属性にコールバック関数が登録されるが、
 * 前記関数はライブラリ内部で利用するため、本属性を変更してはならない。<br>
 * @addon
 * @static
 * @lang ja
 */
/**
 * Initializes widget information.<br>
 * By calling this function, library functions are made available.<br>
 * In this function, callback function is set to onmouseup attribute of body node. <br>
 * This attribute must not be modified, for this callback function is used internally in the library.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.init = function()
{
	// 通常ウィジェットの配列
	WidgetLib._widgets = new Array();
	// ポップアップウィジェットの配列
	WidgetLib._popups = new Array();
	// ボタンウィジェットの配列
	WidgetLib._buttons = new Array();
	// 押下中ボタンのID
	WidgetLib._downedButtonId = null;
	// ポップアップ中のウィジェットのID
	WidgetLib._popupId = null;
	// ポップアップ中のウィジェットを開かせたボタンのID
	WidgetLib._popupBaseButtonId = null;
	
	document.body.setAttribute("onmouseup", "WidgetLib._onEvent('onmouseup', 'body')");
};
/**
 * ライブラリからのイベントを受け取るイベントハンドラを設定する<br>
 * 登録されたボタン、ポップアップからのイベント通知先を設定する。
 * イベントハンドラは func(eventType, id) の形式で、イベント発生時は
 * eventTypeにイベント種別、idにイベント発生したウィジェットのIDが通知される。<br>
 * イベント種別は以下の通り<br>
 * onbuttondown:ボタンが押されたとき<br>
 * onbuttonup:ボタンが離されたとき<br>
 * onpopupopen:ポップアップが表示されたとき<br>
 * onpopupclose:ポップアップが閉じたとき<br> * 
 * @param {Function} func イベントハンドラを指定する
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets event handler to receive events from library.<br>
 * Sets destination for events notified by popups. Format of event handlers is func(eventType,id). <br>
 * When event occurs, event type is set to eventType and widget id is set to id.<br>
 * Event types are as follows:<br>
 * onbuttondown: button press<br>
 * onbuttonup:button release<br>
 * onpopupopen: popup open<br>
 * onpopupclose: popup close 
 * @param {Function} func Event handler.
 * @addon
 * @static
 * @lang en
 */

WidgetLib.setEventListener = function(func)
{
	WidgetLib._listener = func;
};

/**
 * 指定されたノードを、ウィジェットとして登録する<br>
 * 登録されたウィジェットに対しては、ノードのIDを引数として各種操作が可能となる。<br>
 * ノードにID属性がない場合、すでに同じIDがウィジェットとして登録済みの場合は、エラーとなる。<br>
 *
 * @param {Node} node 登録するDOMノード
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Registers specified node as widget.<br>
 * Registered widgets can be operated by specifying node ID.<br>
 * If node has no ID attribute, or if same ID has been already registered as widget, error occurs.<br> 
 * @param {Node} node DOM node to set
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerWidget = function(node)
{
	if (!node || !node.id) {
		return false;
	}

	if (WidgetLib._hasWidget(node.id)) {
		return false;
	}

	WidgetLib._widgets[node.id] = {node: node, type: "normal", status: {}};
	
	return true;
};

/**
 * 指定されたIDを持つdocumentツリー上のノードを、ウィジェットとして登録する<br>
 * 詳細はregisterWidget()を参照のこと
 *
 * @param {String} id 登録するdocumentツリー上のDOMノードのID
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets node on document tree with specified ID as widget.<br>
 * See registerWidget() for details.<br>
 * 
 * @param {String} id ID of DOM node on document tree to be registered.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerWidgetById = function(id)
{
	var _node = document.getElementById(id);
		
	if (!WidgetLib.registerWidget(_node)) {
		return false;
	}

	return true;
};

/**
 * 指定されたノードを、ポップアップウィジェットとして登録する<br>
 * 登録したウィジェットはopenPopup()によりポップアップが可能である。
 * 本関数が成功時は登録されたノードは親ノードからremoveされる。
 * ノードにID属性がない場合、すでに同じIDがウィジェットとして登録済みの場合はエラーとなる。<br>
 *
 * @param {Node} node 登録するDOMノード
 * @param {WidgetLib.PopupType} type ポップアップ種別 NORMAL:通常ポップアップ、MODAL:モーダルポップアップ
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets specified node as popup widget.<br>
 * Widget can be popped up using openPopup(). If this function is successful, the set node is removed from its parent node. <br>
 * If node has no ID attribute, or if same ID has been already registered as widget, error occurs.
 *
 * @param {Node} node DOM node to register.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerPopupWidget = function(node, type)
{
	if (!node || !node.id) {
		return false;
	}

	if (WidgetLib._hasWidget(node.id)) {
		return false;
	}

	var _type;
	if (type == null) {
		_type = WidgetLib.PopupType.NORMAL;
	} else {
		if (!WidgetLib._isValidPopupType(type)) {
			return false;
		}
		_type = type;
	}
	
	WidgetLib._popups[node.id] = {node:node, type: _type, status:{popup: false}};
	
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
	
	return true;
};

/**
 * 指定されたIDを持つdocumentツリー上のノードを、ポップアップウィジェットとして登録する<br>
 * 詳細はregisterPopupWidget()を参照のこと
 *
 * @param {String} id 登録するdocumentツリー上のDOMノードのID
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets node on document tree with specified ID as popup widget.<br>
 * See registerPopupWidget() for details.
 *
 * @param {String} id ID of DOM node on document tree to be registered.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerPopupWidgetById = function(id, type)
{
	var _node = document.getElementById(id);

	if (!WidgetLib.registerPopupWidget(_node, type)) {
		return false;
	}

	return true;
};

/**
 * 指定されたウィジェットを、ポップアップする。<br>
 * ポップアップしたウィジェットはbody直下に追加される。
 * ポップアップを閉じるには以下のいづれかが必要となる。<br>
 * ・ポップアップのウィジェット下のボタンウィジェットが押下されること<br>
 * ・ポップアップのウィジェットに対してclosePopupWidget()をコールすること<br>
 * ・ポップアップのウィジェット外が押下されること（通常ポップアップのみ）<br>
 * すでにポップアップ中のウィジェットが存在する場合、
 * 対象のウィジェットに親ノードが存在する場合、はエラーとなる。<br>
 * 
 * @param {String} id 対象となるポップアップウィジェットのID
 * @returns {Bool} true:成功、false:失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Pops up specified widget.<br>
 * The widget popped up is added as child of body node. <br>
 * In order to close this popup, one of the following operations are necessary:<br>
 * - Pressing button widgets in popup widget<br>
 * - Calling closePopupWidget() for popup widget<br>
 * - If popup widget is "Normal" popup (i.e. if WidgetLib.PopupType = "NORMAL"), pressing area outside popup widget.<br>
 * If a popped-up widget already exists, or this widget has a parent node, error occurs.
 * 
 * @param {String} id ID of popup widget to specify.
 * @returns {Bool} true if popup is successfully opened; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.openPopupWidget = function(id)
{
	if (!id || WidgetLib._popupId) {
		return false;
	}
	
	var _widget = WidgetLib._popups[id];
	if (!_widget) {
		return false;
	}
	
	document.body.appendChild(_widget.node);
	WidgetLib._popupId = id;

	_widget.status.popup = true;

	if (WidgetLib._listener) {
		WidgetLib._listener("onpopupopen", id);
	}
	
	return true;
};

/**
 * 指定されたポップアップウィジェットを閉じる<br>
 * 本関数により対象のウィジェットはbodyノードからremoveされる。
 * @param {String} id 対象となるポップアップウィジェットのID
 * @returns {Bool} true:成功、false:失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Closes specified popup widget.<br>
 * This function removes specified widget from body node.
 * @param {String} id ID of popup widget to specify.
 * @returns {Bool} true if widget is successfully closed; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.closePopupWidget = function(id)
{
	if (!id || !WidgetLib._popupId) {
		return false;
	}

	if (WidgetLib._popupId != id) {
		return false;
	}
	
	var _widget = WidgetLib._popups[id];
	if (!_widget) {
		return false;
	}

	_widget.node.parentNode.removeChild(_widget.node);

	WidgetLib._popupId = null;
	if (WidgetLib._popupBaseButtonId) {
		WidgetLib._buttons[WidgetLib._popupBaseButtonId].status.on = false;
		WidgetLib._onButtonChanged(WidgetLib._buttons[WidgetLib._popupBaseButtonId]);
	}

	_widget.status.popup = false;
	
	if (WidgetLib._listener) {
		WidgetLib._listener("onpopupclose", id);
	}
	
	return true;
};

/**
 * 指定されたウィジェットのDOMノードを返す<br>
 * 存在しないIDを指定した場合はNULLが返る
 *
 * @param {String} id 対象となるウィジェットのID
 * @returns {Node} 対象となるウィジェットのDOMノード
 * @addon
 * @static
 * @lang ja
 */
/**
 * Returns DOM node of specified widget. <br>
 * If specified ID does not exist, NULL is returned.
 *
 * @param {String} id Widget ID
 * @returns {Node} DOM node of specified widget
 * @addon
 * @static
 * @lang en
 */
WidgetLib.getWidgetNode = function(id)
{
	var _widget = WidgetLib._getWidget(id);
	if (!_widget) {
		return null;
	}
	return _widget.node;
};

/**
 * 指定されたノードを、ボタンウィジェットとして登録する。<br>
 * 指定したノードが押下されると、type, attrに従って、
 * ボタン画像・状態の変更が自動で行われ、イベントハンドラに通知される。
 * 関数内部で、ノードのonmousedown属性にコールバック関数が登録される。
 * コールバック関数はライブラリ内部で使用するため、本属性を変更しないこと。<br>
 * ノードにID属性がない場合、すでに同じIDがウィジェットとして登録済みの場合は、エラーとなる。<br>
 * 
 * @param {Node} node 登録するDOMノード
 * @param {WidgetLib.ButtonType} type ボタン種別 NORMAL:通常ボタン、TOGGLE:トグルボタン、
 * POPUP:ポップアップボタン、RADIO:ラジオボタン
 * @param {WidgetLib.ButtonAttr} attr ボタン属性
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets specified node as button widget.<br>
 * When specified node is pressed, button image/status is changed automatically according to type/attr, <br>
 * and further notified to event handler. <br>
 * In this function, callback function is set to onmousedown attribute of node. <br>
 * This attribute must not be modified, for this callback function is used internally in the library.<br>
 * If node has no ID attribute, or if same ID has been already registered as widget, error occurs.
 * 
 * @param {Node} node DOM node to set.
 * @param {WidgetLib.ButtonType} type Button type.<br>
 * NORMAL: (plain) button<br>
 * TOGGLE: toggle button<br>
 * POPUP: poup button<br>
 * RADIO: radio button
 * @param {WidgetLib.ButtonAttr} attr Button attributes.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerButtonWidget = function(node, type, attr)
{
	if (!node || !node.id) {
		return false;
	}

	if (WidgetLib._hasWidget(node.id)) {
		return false;
	}

	var _type;
	if (type == null) {
		_type = WidgetLib.ButtonType.NORMAL;
	} else {
		if (!WidgetLib._isValidButtonType(type)) {
			return false;
		}
		_type = type;
	}

	var _status = {enable: true, on: false, press:false};
	var _attr = {};
	
	WidgetLib._buttons[node.id] = {node: node, type: _type, status:_status, attr: _attr};

	if (attr) {
		if (!WidgetLib.setWidgetAttr(node.id, attr)) {
			WidgetLib._buttons[node.id] = null;
			return false;
		}
	}

	node.setAttribute("onmousedown", "WidgetLib._onEvent('onmousedown', '" + node.id + "')");

	return true;
};

/**
 * 指定されたIDを持つdocumentツリー上のノードを、ボタンウィジェットとして登録する<br>
 * 詳細はregisterButtonWidget()を参照のこと
 * 
 * @param {String} id 登録するdocumentツリー上のDOMノードのID
 * @param {WidgetLib.ButtonType} type ボタン種別 NORMAL:通常ボタン、TOGGLE:トグルボタン、
 * POPUP:ポップアップボタン RADIO:ラジオボタン
 * @param {WidgetLib.ButtonAttr} attr ボタン属性
 * @returns {Bool} true:登録成功、false:登録失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets node on document tree with specified ID as button widget.<br>
 * See registerButtonWidget() for details.
 * 
 * @param {String} id ID of DOM node on document tree to be registered.
 * @param {WidgetLib.ButtonType} type Button type.<br>
 * NORMAL: (plain) button<br>
 * TOGGLE: toggle button<br>
 * POPUP: poup button<br>
 * RADIO: radio button
 * @param {WidgetLib.ButtonAttr} attr Button attributes.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.registerButtonWidgetById = function(id, type, attr)
{
	var _node = document.getElementById(id);

	if (!WidgetLib.registerButtonWidget(_node, type, attr)) {
		return false;
	}

	return true;
};
/**
 * 指定されたウィジェットの属性を取得する<br>
 * ボタンウィジェットにのみ有効。<br>
 *
 * @param {String} id 対象となるウィジェットのID
 * @returns {WidgetLib.ButtonAttr} attr ウィジェットの属性
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves attributes of specified widget.<br>
 * Valid only for button widgets. 
 * @param {String} id ID of widget to specify.
 * @returns {WidgetLib.ButtonAttr} attr Widget attributes.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.getWidgetAttr = function(id)
{
	if (!id) {
		return null;
	}

	var _widget = WidgetLib._buttons[id];
	if (!_widget) {
		return null;
	}

	var _attr = new WidgetLib.ButtonAttr;
	for (var i in _widget.attr) {
		_attr[i] = _widget.attr[i];
	}

	return _attr;
};
/**
 * 指定されたウィジェットの属性を設定する<br>
 * ボタンウィジェットにのみ有効。<br>
 *
 * @param {String} id 対象となるウィジェットのID
 * @param {WidgetLib.ButtonAttr} attr ボタン属性
 * @returns {Bool} true:成功、false:失敗
 * @addon
 * @static
 * @lang ja
 */
/**
 * Sets attributes of specified widget.<br>
 * Valid only for button widgets.
 *
 * @param {String} id Widget ID.
 * @param {WidgetLib.ButtonAttr} attr Button attributes.
 * @returns {Bool} true if registration is successful; otherwise, false.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.setWidgetAttr = function(id, attr)
{
	if (!id || !attr) {
		return false;
	}

	var _widget = WidgetLib._buttons[id];
	if (!_widget) {
		return false;
	}
	
	for (var i in attr) {
		_widget.attr[i] = attr[i];
	}

	WidgetLib._onButtonChanged(_widget);
	
	return true;
};

/**
 * 指定されたウィジェットの状態を取得する<br>
 * ボタンウィジェットにのみ有効。<br>
 *
 * @param {String} id 対象となるウィジェットのID
 * @returns {WidgetLib.ButtonStatus} ボタン状態
 * @addon
 * @static
 * @lang ja
 */
/**
 * Retrieves status of specified widget.<br>
 * Valid only for button widgets.
 *
 * @param {String} id Widget IDs
 * @returns {WidgetLib.ButtonStatus} Button status.
 * @addon
 * @static
 * @lang en
 */
WidgetLib.getWidgetStatus = function(id)
{
	if (!id) {
		return null;
	}

	var _widget = WidgetLib._buttons[id];
	if (!_widget) {
		return null;
	}

	var _status = new WidgetLib.ButtonStatus();
	for (var i in _widget.status) {
		_status[i] = _widget.status[i];
	}

	return _status;
};

/**
 * 指定されたウィジェットの状態を変更する<br>
 * ボタンウィジェットにのみ有効。<br>
 *
 * @param {String} id 対象となるウィジェットのID
 * @param {WidgetLib.ButtonStatus} status ボタン状態
 * @addon
 * @statis
 * @lang ja
 */
/**
 * Changes status of specified widget.<br>
 * Valid only for button widgets.
 *
 * @param {String} id Widget ID.
 * @param {WidgetLib.ButtonStatus} status Button status.
 * @addon
 * @statis
 * @lang en
 */
WidgetLib.setWidgetStatus = function(id, status)
{
	if (!id || !status) {
		return false;
	}

	var _widget = WidgetLib._buttons[id];
	if (!_widget) {
		return false;
	}

	var _changed = false;
	for (var i in status) {
		if (status[i] != _widget.status[i]) {
			_widget.status[i] = status[i];
			_changed = true;
		}
	}

	if (_changed) {
		WidgetLib._onButtonChanged(_widget);
	}
	
	return true;
};

WidgetLib._getWidget = function(id)
{
	if (WidgetLib._buttons[id]) {
		return WidgetLib._buttons[id];
	}
	if (WidgetLib._popups[id]) {
		return WidgetLib._popups[id];
	}
	if (WidgetLib._widgets[id]) {
		return WidgetLib._widgets[id];
	}
	
	return null;
};

WidgetLib._hasWidget = function(id)
{
	if (WidgetLib._getWidget(id)) {
		return true;
	}
	return false;
};

WidgetLib._isValidPopupType = function(type)
{
	switch (type) {
	case WidgetLib.PopupType.NORMAL:
	case WidgetLib.PopupType.MODAL:
		return true;
	default:
		return false;
	}
};

WidgetLib._isValidButtonType = function(type)
{
	switch (type) {
	case WidgetLib.ButtonType.NORMAL:
	case WidgetLib.ButtonType.TOGGLE:
	case WidgetLib.ButtonType.POPUP:
	case WidgetLib.ButtonType.RADIO:
		return true;
	default:
		return false;
	}
};

WidgetLib._inPopupedWidget = function(widget)
{
	var _node = widget.node;
	while (_node) {
		if (_node.id == WidgetLib._popupId) {
			return true;
		}
		_node = _node.parentNode;
	}
	return false;
};

WidgetLib._onEvent = function(event, id)
{
	var _targetId = 0;
	var _targetEvent = "";
	var _targetButton = null;

	switch (event) {
	case "onmousedown":
		_targetId = id;
		_targetEvent = "onbuttondown";
		_targetButton = WidgetLib._buttons[_targetId];
		
		// Disable状態のボタンは無効
		if (_targetButton && !_targetButton.status.enable) {
			BrowserExt.Beep(1);
			return;
		}
		// ポップアップ中は、配下のボタン以外は無効
		if (WidgetLib._popupId && !WidgetLib._inPopupedWidget(_targetButton)) {
			return;
		}
		
		// 押したボタンは覚えておく
		WidgetLib._downedButtonId = _targetId;
		break;
	case "onmouseup":
		_targetId = WidgetLib._downedButtonId;
		_targetEvent = "onbuttonup";
		_targetButton = WidgetLib._buttons[_targetId];

		// 無効なボタン押して離したor背景部分で離した
		if (!_targetButton) {
			//モーダルポップアップ以外なら、ポップアップはクローズする
			if (WidgetLib._popupId && WidgetLib._popups[WidgetLib._popupId].type != "modal_popup") {
				if (WidgetLib.closePopupWidget(WidgetLib._popupId)) {
				}
			}
			return;
		}
		
		// 押したボタンはもう興味ない
		WidgetLib._downedButtonId = null;
		break;
	}
	
	// 状態の変更
	switch (_targetButton.type) {
	case WidgetLib.ButtonType.NORMAL:
		if (event == "onmousedown") {
			_targetButton.status.press = true;
			_targetButton.status.on = true;
		}
		if (event == "onmouseup") {
			_targetButton.status.press = false;
			_targetButton.status.on = false;
		}
		break;
	case WidgetLib.ButtonType.TOGGLE:
		if (event == "onmousedown") {
			_targetButton.status.press = true;
			_targetButton.status.on = !_targetButton.status.on;
		}
		if (event == "onmouseup") {
			_targetButton.status.press = false;
		}
		break;
	case WidgetLib.ButtonType.POPUP:
		if (event == "onmousedown") {
			_targetButton.status.press = true;
			_targetButton.status.on = true;
			}
		if (event == "onmouseup") {
			_targetButton.status.press = false;
		}
		break;
	case WidgetLib.ButtonType.RADIO:
		if (event == "onmousedown") {
			_targetButton.status.press = true;
			_targetButton.status.on = true;
			for (var i in WidgetLib._buttons) {
				if (WidgetLib._buttons[i].type == WidgetLib.ButtonType.RADIO) {
					if (WidgetLib._buttons[i] != _targetButton && WidgetLib._buttons[i].attr.groupId == _targetButton.attr.groupId) {
						WidgetLib._buttons[i].status.on = false;
						WidgetLib._onButtonChanged(WidgetLib._buttons[i]);
					}
				}
			}
		}
		if (event == "onmouseup") {
			_targetButton.status.press = false;
		}
	}
	WidgetLib._onButtonChanged(_targetButton);

	// イベントの通知
	if (WidgetLib._listener) {
		WidgetLib._listener(_targetEvent, _targetId);
	}
	
	if (event == "onmouseup") {
		if (WidgetLib._popupId) {
			// ポップアップを元に戻し、イベント通知
			if (WidgetLib._inPopupedWidget(_targetButton)) {
				WidgetLib.closePopupWidget(WidgetLib._popupId);
			}
		} else {
			// ポップアップを表示し、イベント通知
			if (_targetButton.type == WidgetLib.ButtonType.POPUP) {
				if (WidgetLib.openPopupWidget(_targetButton.attr.popupId)) {
					WidgetLib._popupBaseButtonId = _targetId;
				}
			}
		}
	}
};

WidgetLib._onButtonChanged = function(button)
{
	var _imgNode, _iconNode;
	var i;
	
	if (button.attr.targetImgId) {
		_imgNode = document.getElementById(button.attr.targetImgId);
		if(button.attr.iconAttr){
			_iconNode = document.getElementById(button.attr.iconAttr.targetImgId);
		}
		if (_imgNode == null) {
			// 見つからない場合はボタンの直下を対象にIDを探す
			for (i = 0; i < button.node.childNodes.length; i++) {
				if (button.attr.targetImgId == button.node.childNodes.item(i).id) {
					_imgNode = button.node.childNodes.item(i);
					break;
				}
			}
		}
	} else {
		// 指定がなければ自分自身
		_imgNode = button.node;
	}

	if (_imgNode == null) {
		return;
	}
	
	// 表示はDisable/Press/On/Offの順に優先される
	if (!button.status.enable) {
		if (button.attr.disableImg) {
			_imgNode.setAttribute("src", button.attr.disableImg);
			if(button.attr.groupId !== "BTN_MP_FUNC"){
				button.node.style = "opacity: 0.5";	
			}
			return;
		}
	}
	if (button.status.press) {
		if (button.attr.pressImg) {
			_imgNode.setAttribute("src", button.attr.pressImg);
			if(_iconNode){
				_iconNode.setAttribute("src", button.attr.iconAttr.pressImg);
			}
			Common.addClass(button.node.id,"press");
			return;
		}
	}
	if (button.status.on) {
		if (button.attr.onImg) {
			_imgNode.setAttribute("src", button.attr.onImg);
			if(_iconNode){
				_iconNode.setAttribute("src", button.attr.iconAttr.pressImg);
			}
			return;
		}
	} else {
		if (button.attr.offImg) {
			_imgNode.setAttribute("src", button.attr.offImg);
			if(_iconNode){
				_iconNode.setAttribute("src", button.attr.iconAttr.offImg);
			}
			Common.removeClass(button.node.id,"press");
			button.node.style.removeProperty("opacity");
			return;
		}
	}
	return;
};

