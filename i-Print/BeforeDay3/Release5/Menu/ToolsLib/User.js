/** 
 * @fileoverview ToolsLib関連の公開クラスを定義する<br>
 * 下記のような情報取得用メソッドを提供する<br>
 * isCELogin<br>
 * これらのクラスを使用するには
 * <ul>
 * <li>SSMILib/GetChainLink.js
 * </ul>
 * のロードが必要となる。<br>
 * 使用するには<b>ToolsLib/ToolsLib.js</b>を参照すること
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/**
 * @fileoverview 
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */


/**
 * userインスタンスを作成する<br>
 * ＊ToolsLib/ToolsLib.jsのインクルードが必要。
 * @class ユーザによる情報取得のためのクラス.
 * @lang ja
 */
 /**
 * Creates user instance.<br>
 * ＊ToolsLib/ToolsLib.js must be included.
 * @class Class for information retrieval by user.
 * @lang en
 */
ToolsLib.user = function()
{

};



/**
 * isCELoginメソッドが呼び出すローカル関数(CB等)の上位インスタンスを作成する
 * @class isCELoginが呼び出すコールバック関数定義用のクラス
 * @private
 * @lang ja
 */
ToolsLib.user.isCELogin = function()
{

};


/**
 * ログインモードがCEか否かを問い合わせる。<br>
 * 登録されたリスナーにてイベントの戻り値を返す。<br>
 * ＊SSMILib/GetChainLink.js のインクルードが必要。
 * @returns {string} arguments[0] : イベントID ("isCELogin") 
 * @returns {bool}   arguments[1] : イベント結果 (true:CEログイン中  false:CE以外でログイン中 または 未認証)
 * @ example
 * //1.呼び出し
 * function sample_func(){
 *      …
 *      _msg = new ToolsLib.user(); //userインスタンス生成
 *      _msg.isCELogin(); //呼び出し
 *      ContentsLib.setListener(event_func);//イベントリスナ登録
 *      …
 * }
 *
 * //2.戻り値の確認
 * function event_func(event){
 *      …
 *      //イベントID確認
 *      if(arguments[0] == "isCELogin"){
 *          …
 *      }
 *      …
 * }
 *
 * @lang ja
 */ 
/**
 * Inquires whether the login mode is CE or not.<br>
 * Return the return value of event to the registered listener.<br>
 * *SSMILib/GetChainLink.js must be included.
 * @returns {string} arguments[0] : Event ID ("isCELogin") 
 * @returns {bool}   arguments[1] : Event result (true: Logged-in as CE  false: Logged-in as user other than CE or unauthenticated.)
 * @example
 *  //1. Calling
 * function sample_func(){
 *      …
 *      _msg = new ToolsLib.user(); //create user instance
 *      _msg.isCELogin(); //call
 *      ContentsLib.setListener(event_func);//register event listener
 *      …
 * }
 *
 * //2. Checking return value
 * function event_func(event){
 *      …
 *      //check event ID
 *      if(arguments[0] == "isCELogin"){
 *          …
 *      }
 *      …
 * }
 *
 * @lang en
 */
 ToolsLib.user.prototype.isCELogin = function()
 {
	var _obj = new SSMILib.ChainLink();

	//1件のみ取得の設定 (=取得可能なChainLinkの内、先頭番号のものを優先的に取得する) 
	_obj.scope.count = 1; 
	
	_obj.requester.successHandler = ToolsLib.user.isCELogin.successCb;
	_obj.requester.errorHandler = ToolsLib.user.isCELogin.errorCb;

	_obj.getChainLink();
	return;
};


/**
 * @private
 */
ToolsLib.user.isCELogin.successCb = function(res)
{
    var _result = false;
    
	if(!res.responseXML) {
		SSMILib.onEvent("isCELogin", false, null);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetChainLinkResponse");
	
	if(_resNode.length && _resNode[0].hasChildNodes()){
		_result = true;
	} else {
		_result = false;
	}
	SSMILib.onEvent("isCELogin", _result, null); //イベントの成功可否のみ返却
	
	return;
};


/**
 * @private
 */
ToolsLib.user.isCELogin.errorCb = function(res)
{
	SSMILib.onEvent("isCELogin", false, null);

	return;
};




