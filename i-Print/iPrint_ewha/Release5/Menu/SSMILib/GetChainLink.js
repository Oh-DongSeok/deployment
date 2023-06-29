/** 
 * @fileoverview デバイスからChain-Link情報を取得するためのクラス定義<br>
 * Chain-Link情報取得に関して以下のメソッドを提供する<br>
 * getChainLink<br>
 * 使用するには<b>SSMILib/SSMILib.js</b>を参照すること
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang ja
 */
/**
 * @fileoverview Defines classes for retrieving Chain-Link information from device.<br>
 * Provides the following methods regarding retrieval of Chain-Link information.<br>
 * getChainLink<br>
 * To use this file, see <b>SSMILib/SSMILib.js</b>.
 * @author Copyright(C) 2011 Fuji Xerox Co., Ltd. All rights reserved.<br>
 * @version 1.0.0
 * @lang en
 */

/**
 * ChainLinkインスタンスを作成する
 * @class 要求したChain-Link情報取得のためのクラス
 * @lang ja
 */
/**
 * Creates ChainLink instance.<br>
 * @class Class for retrieving Chain-Link information.
 * @lang en
 */
SSMILib.ChainLink = function()
{
	/**
	 * 取得範囲を設定する
	 * @type SSMILib.ChainLink.Scope
	 * @lang ja
	 */	
	/**
	 * Scope of Chain-Links to retrieve.
	 * @type SSMILib.ChainLink.Scope
	 * @lang en
	 */
	 this.scope = new SSMILib.ChainLink.Scope();
	/**
	 * Chain-Linkのタイプを設定する
	 * @type SSMILib.ChainLink.Type
	 * @lang ja
	 */
	/**
	 * Type of Chain-Link to retrieve.
	 * @type SSMILib.ChainLink.Type
	 * @lang en
	 */	
	 this.type = new SSMILib.ChainLink.Type();
	/**
	 * リクエストメッセージ生成時に設定する
	 * @type WebServiceLib.Communicator
	 * @default new WebServiceLib.Communicator()
	 * @private
	 * @lang ja
	 */
	 /**
	 * Sets whether request message destination device requires authentication or not.
	 * @type WebServiceLib.Communicator
	 * @default new WebServiceLib.Communicator()
	 * @private
	 * @lang en
	 */
	this.requester = new WebServiceLib.Communicator();
};
/**
 * @private
 */
Extend(SSMILib.ChainLink.prototype, XMLLib.SOAPMsg.prototype);

/**
 * ChainLink.Scope インスタンスを作成する
 * @class 取得情報の範囲を設定するクラス<br>
 * @lang ja
 */
/**
 * Creates ChainLink.Scope instance.
 * @class Class that sets the scope of Chain-Links to retrieve.<br>
 * @lang en
 */
SSMILib.ChainLink.Scope = function()
{
	/**
	 * リソース情報の取得する数を設定する。値は正の整数であること。<br>
	 * プロパティへの値設定は必須。
	 * @type Int
	 * @default null
	 * @lang ja
	 */	
	/**
	 * Number of resource information sets to retrieve. Value must be a positive integer.<br>
	 * Value must be set for property.
	 * @type Int
	 * @default null
	 * @lang en
	 */	    
	 this.count = null;
	/**
	 * リソース情報範囲の開始位置を設定する。<br>
	 * 省略可。省略した場合は、取得可能な先頭のChainLink番号が設定される。<br>
	 * 設定する文字列は "\d{3}\-\d{3}" の形式である事。(例:"123-456") 
	 * @type String
	 * @default null
	 * @lang ja
	 */	
	/**
	 * Start position of resource information range.
	 * Setting can be omitted. If it is omitted, the number of the first Chain-Link that can be retrieved is set.<br>
	 * Specified according to the following format: "\d{3}\-\d{3}" (E.g.:"123-456")
	 * @type String
	 * @default null
	 * @lang en
	 */	
    this.from = null;
	/**
	 * リソース情報範囲の終了位置を設定する。<br>
	 * 省略可。<br>
	 * 設定する文字列は "\d{3}\-\d{3}" の形式である事。(例:"123-456") 
	 * @type String
	 * @default null
	 * @lang ja
	 */	
	/**
	 * End position of resource information range.<br>
	 * Setting can be omitted.<br>
	 * Specified according to the following format: "\d{3}\-\d{3}" (E.g.:"123-456") 
	 * @type String
	 * @default null
	 * @lang en
	 */	
    this.to = null;
};


/**
 * ChainLink.Type インスタンスを作成する
 * @class 取得情報のタイプを設定するクラス<br>
 * 詳細は 「02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
 * SSMI-0201 拡張編 14 Chain-Link管理」の ChainLinkTypeを参照のこと <br>
 * @lang ja
 */
/**
 * Creates ChainLink.Type instance.
 * @class Class that sets type of information to retrieve.<br>
 * For details, see "02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
 * See description on ChainLinkType in 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc.<br>
 * @lang en
 */
SSMILib.ChainLink.Type = function()
{
	/**
	 * バックアップ/リストア可能なChain-Linkを指定するためのインスタンスを生成。<br>
     * 指定を必要としない場合は、生成されたインスタンスのメンバプロパティに対する値設定は省略可。<br>
	 * 生成されたインスタンスの各種プロパティの詳細は継承元クラスを参照。<br>
	 * @type SSMILib.ChainLink.WritableType
	 * @default null
	 * @lang ja
	 */	
	/**
	 * Creates instance for specifying Chain-Link that can be backed up and restored<br>
     * When designation is not required, setting can be omitted for member properties of the created instance.<br>
	 * For details of the properties of the created instance, see the parent class.<br>
	 * @type SSMILib.ChainLink.WritableType
	 * @default null
	 * @lang en
	 */	
	this.restorable = new SSMILib.ChainLink.WritableType();
	/**
	 * 情報として他へコピー可能なChain-Linkを指定するためのインスタンスを生成。<br>
     * 指定を必要としない場合は、生成されたインスタンスのメンバプロパティに対する値設定は省略可。<br>
	 * 詳細は 「02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
	 * SSMI-0201 拡張編 14 Chain-Link管理」 の ChainLinkType を参照のこと <br>
	 * 生成されたインスタンスの各種プロパティの詳細は継承元クラスを参照。<br>
	 * @type SSMILib.ChainLink.WritableType
	 * @default null
	 * @lang ja
	 */	
	/**
	 * Creates instance for specifying Chain-Link whose information can be copied.<br>
     * When designation is not required, setting can be omitted for member properties of the created instance.<br>
	 * For details, see "02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
	 * See description on ChainLinkType in 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc.<br>
	 * For details of the properties of the created instance, see the parent class.<br>
	 * @type SSMILib.ChainLink.WritableType
	 * @default null
	 * @lang en
	 */	
	this.portable = new SSMILib.ChainLink.WritableType();
};


/**
 * ChainLink.WritableType インスタンスを作成する
 * @class 書き込み可能なChain-Linkのタイプを設定するクラス<br>
 * 詳細は 「02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
 * SSMI-0201 拡張編 14 Chain-Link管理」の WritableTypeを参照のこと <br>
 * @lang ja
 */
/**
 * Creates ChainLink.WritableType instance.
 * @class Class for setting type of Chain-Links that can be modified.<br>
 *  For details, see "02-01 SESAMi Service Management Interface Specification_ServiceExtensions<br>
 * See description on WritableType in 02-01 SESAMi Service Management Interface Specification_ServiceExtensions_E.doc.<br>
 * @lang en
 */
SSMILib.ChainLink.WritableType = function()
{
	/**
	 * 取得した個体を基準にした書き込み先を表す。<br>
	 * 省略可。ただし、プロパティ値phaseに値を設定した場合は設定必須。<br>
	 * 指定可能なenumのメンバは下記<br>
	 * - self : 書き込み対象が、同一固体であることを表す。 <br>
	 * - sameModel : 書き込み対象が、同一機種であることを表す。<br>
	 * - otherModel : 書き込み対象が、他の機種であることを表す。 
	 * @type enum
	 * @default null
	 * @lang ja
	 */	
	/**
	 * Indicates target device information.<br>
	 * This setting can be omitted. Setting is mandatory when a value is set for the property value phase.<br>
	 * The following enum members can be specified.<br>
	 * - self : Indicates that target device is the device to which the request was made itself.<br>
	 * - sameModel : Indicates that target device is of the same model as the device to which the request was made.<br>
	 * - otherModel : Indicates that target device is of a different model as the device to which the request was made.
	 * @type enum
	 * @default null
	 * @lang en
	 */	
	this.target = null;
	/**
	 * 書き込みの段階(フェーズ)を表す。<br>
	 * 省略可。ただし、プロパティ値targetに値を設定した場合は設定必須。<br>
	 * 指定可能なenumのメンバは下記<br>
	 * - first : フェーズ１を表す。<br>
	 * - second : フェーズ２を表す。フェーズ１で書き込むChain-Linkの値に依存するものである。
	 * @type enum
	 * @default null
	 * @lang ja
	 */
	/**
	 * Chain-Link modification phase.<br>
	 * This setting can be omitted. Setting is mandatory when a value is set for the property value phase.<br>
	 * The following enum members can be specified.<br>
	 * - first : Phase 1.<br>
	 * - second : Phase 2. Phase in which Chain-Link values that are dependent on other Chain-Link values, set in Phase 1, are set.
	 * @type enum
	 * @default null
	 * @lang en
	 */	
	this.phase = null;
};



/**
 * getChainLinkメソッドが呼び出すローカル関数(CB等)の上位インスタンスを作成する
 * @class getChainLinkが呼び出すコールバック関数定義用のクラス
 * @private
 * @lang ja
 */

SSMILib.ChainLink.getChainLink = function()
{

};



/**
 * @private 
 */
SSMILib.ChainLink.prototype.createMsg = function ()
{
	var xml = new XMLLib.XMLSOAP();
	var root = xml.createSOAPEnvelope();
	var env = root;
	var body = xml.body;

    var clNS    =   "http://www.fujixerox.co.jp/2003/12/ssm/management/chainLink";
	var mgtNS	=	"http://www.fujixerox.co.jp/2003/12/ssm/management";

	xml.addNSPrefix(clNS, "cl");
	xml.addNSPrefix(mgtNS, "mgt");

	var _clNode = body.appendChild(xml.createElementNS(clNS, "GetChainLink"));
	xml.addNSDeclaration(clNS, _clNode, true);

    //Scope要素と各属性の宣言
	if(this.scope.count != null|| this.scope.from != null|| this.scope.to != null){
		var _scopeNode = _clNode.appendChild(xml.createElementNS(mgtNS, "Scope"));
		xml.addNSDeclaration(mgtNS, _scopeNode, true);
		if(this.scope.count){
			_scopeNode.setAttribute("count", this.scope.count);
		}
		if(this.scope.from){
			_scopeNode.setAttribute("from", this.scope.from);
		}
		if(this.scope.to){
			_scopeNode.setAttribute("to", this.scope.to);
		}
    }


    //ChainLinkType要素と各子要素の宣言
	if(this.type.restorable.target != null|| this.type.restorable.phase != null || this.type.portable.target != null|| this.type.portable.phase != null){
		var _typeNode = _clNode.appendChild(xml.createElementNS(clNS, "ChainLinkType"));
		xml.addNSDeclaration(clNS, _typeNode, true);

        //Restorable要素と各種属性の宣言
    	var _typeRestorableNode = _typeNode.appendChild(xml.createElementNS(clNS, "Restorable"));
	    xml.addNSDeclaration(clNS, _typeRestorableNode, true);

	    if(this.type.restorable.target != null){
	        _typeRestorableNode.setAttribute("target", this.type.restorable.target);
	    }

	    if(this.type.restorable.phase != null){
	        _typeRestorableNode.setAttribute("phase", this.type.restorable.phase);
	    }

        //Portable要素と各種属性の宣言
    	var _typePortableNode = _typeNode.appendChild(xml.createElementNS(clNS, "Portable"));
	    xml.addNSDeclaration(clNS, _typePortableNode, true);

	    if(this.type.portable.target != null){
	        _typeRestorableNode.setAttribute("target", this.type.portable.target);
	    }

	    if(this.type.portable.phase != null){
	        _typeRestorableNode.setAttribute("phase", this.type.portable.phase);
	    }
	}
    
	env.appendChild(body);
	
	var soapMsg = xml.rootElement;
	return soapMsg;

};



/**
 * 指定したオブジェクトと属性によりChain-Link情報を取得する<br>
 * 登録されたリスナーにてイベントの戻り値を返す。<br>
 * @returns {string} arguments[0] : イベントID ("getChainLink") 
 * @returns {bool}   arguments[1] : イベント成功有無 (true:通信成功  false:通信失敗 または 取得数0件)
 * @returns {GetChainLinkResponse (SSMM定義)}   arguments[2] : イベント結果。取得した各Chain-Linkの値を指定型の配列で返す。＊ただし、そのメンバプロパティFaultはサポートしない
 * @lang ja
 */
 /**
 * Retrieves Chain-Link information based on object and attribute specified.<br>
 * The return value of event is returned to the registered listener.<br>
 * @returns {string} arguments[0] : Event ID ("getChainLink") 
 * @returns {bool}   arguments[1] : Whether or not event succeeded. (true:Communication succeeded  false:Communication failed or the number of retrievals is 0.)
 * @returns {GetChainLinkResponse (SSMM definition)}   arguments[2] : Result of event. The retrieved Chain-Link values are returned in the type specified upon retrieval. * The operation of the member property Fault is not guaranteed.
 * @return {string}
 * @return {bool}
 * @return {GetChainLinkResponse}
 * @lang en
 */
SSMILib.ChainLink.prototype.getChainLink = function()
{
	this.requester.async = SSMILib.async;
	this.requester.soapAction = '"http://www.fujixerox.co.jp/2003/12/ssm/management/chainLink#GetChainLink"';
	this.requester.isDeviceReq = true;

    //呼び出し元がCBハンドラを設定済みでない場合、既存ハンドラとしてSSMILib.ChainLink配下のCB関数をセットする
    if(this.requester.successHandler == null){
    	this.requester.successHandler = SSMILib.ChainLink.getChainLink.successCb;
    }

    if(this.requester.errorHandler == null){
    	this.requester.errorHandler = SSMILib.ChainLink.getChainLink.errorCb;
    }


	var _targetURL = SSMILib.protocol + SSMILib.host + "/ssm/Management/CustomerEngineer/ChainLink";

	if(this.scope.count <= 0){
		SSMILib.onEvent("getChainLink", false, null);
		return;
	}
	else {
		var _cLinkObj = new SSMILib.ChainLink();
		_cLinkObj.scope.count = this.scope.count;
		_cLinkObj.scope.from = this.scope.from ? this.scope.from : null;
		_cLinkObj.scope.to = this.scope.to ? this.scope.to : null;
	}


	if(this.type.restorable.target != null || this.type.restorable.phase != null){
	    _cLinkObj.type.restorable.target = this.type.restorable.target;
	    _cLinkObj.type.restorable.phase = this.type.restorable.phase;
	}
	if(this.type.portable.target != null || this.type.portable.phase != null){
	    _cLinkObj.type.portable.target = this.type.portable.target;
	    _cLinkObj.type.portable.phase = this.type.portable.phase;
	}

	var _msg = _cLinkObj.serializeToString();
	this.requester.send(_targetURL, _msg);
	return;	
};




/**
 * @private
 */
SSMILib.ChainLink.getChainLink.successCb = function(res)
{
	var _chainLinkList = null;
	var _result = false;
	if(!res.responseXML){
		SSMILib.onEvent("getChainLink", _result, _chainLinkList);
		return;
	}
	var _resNode = res.responseXML.getElementsByTagName("GetChainLinkResponse");
	
	if(_resNode.length && _resNode[0].hasChildNodes()){
		var _resNodeLen = _resNode[0].childNodes.length;
		_chainLinkList = new Array();
		for (var i = 0; i < _resNodeLen; i++){
			var _chainLinkNode = _resNode[0].childNodes[i];

			if (_chainLinkNode.nodeType != 1 /* ELEMENT_NODE以外 */ || !_chainLinkNode.hasChildNodes()) {	//不要なノードを飛ばす
				continue;
			}
			_chainLinkList.push(SSMILib.childNodeToProperty(_chainLinkNode));
		}
		_result = true;
	}	

    SSMILib.onEvent("getChainLink", _result, _chainLinkList);

	return;
};

/**
 * @private 
 */
SSMILib.ChainLink.getChainLink.errorCb = function(res)
{
	var _chainLinkList = null;
	var _result = false;
	   
	SSMILib.onEvent("getChainLink", _result, _chainLinkList);

	return;
};
