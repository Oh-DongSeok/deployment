/**
 * Construct DeviceLogLib インスタンスを作成する
 * @class ログ生成タメのクラス
 * @constructor
 * @param {String} path
 * @param {String} id ログ生成を実行するためのユーザID
 * @param {String} password ログ生成を実行するためのパスワード
 * @lang ja
 */
DeviceLogLib = function(path, id, password)
{
	/**
	 *	ログ生成を実行するためのパス
	 *	@type String
	 *	@default なし
	 *  @lang ja
	 */
	this.path = "";
	if(path){
		this.path = path;
	}

	/**
	 *	ログ生成を実行するためのユーザID
	 *	@type String
	 *	@default なし
	 *  @lang ja
	 */
	this.id = "";
	if(id){
		this.id = id;
	}

	/**
	 *	ログ生成を実行するためのパスワード
	 *	@type String
	 *	@default なし
	 *  @lang ja
	 */
	this.password = "";
	if(password){
		this.password = password;
	}
};

/**
 * @private
 */
DeviceLogLib.prototype.create = function (protocol, ip)
{
	if(!this.path || !protocol || !ip)
		return false;

	var path = protocol + ip + this.path;
	var _requester = WebServiceLib.createXMLHttpRequest();
	_requester.open("GET", path, true, this.id, this.password);
	_requester.onreadystatechange = function() {
		 if(_requester.readyState == 4) {
			 if(_requester.status == 200) {
				return true;
			 }else{
				return false;
			 }
		 }
	}
	_requester.send();
};
