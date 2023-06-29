/** 
 * @fileoverview ジョブフローにおけるプリント・コピージョブの共通クラスを定義する<br>
 * プリント・コピージョブ共通で使用される各種クラス<br>
 *
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes common to Print/Copy jobs in Job Flow.<br>
 * Classes used commonly by Print and Copy jobs.<br>
 *
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.1.1
 * @lang en
 */

/**
 * ジョブフローにおけるプリント・コピージョブの共通クラスのための名前空間定義
 * @namespace
 * @static
 * @lang ja
 */
/**
 * Namespace definition common to Print/Copy jobs in Job Flow.
 * @namespace
 * @static
 * @lang en
 */
JFLib.ComPrint = {};
/**
 * Staple インスタンスを作成する
 * @constructor
 * @class ステープルを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Staple instance.
 * @constructor
 * @class This class specifies Staple.<br>
 * @lang en
 */

JFLib.ComPrint.Staple = function()
{
	/**
	 *	ステープルの有無をtrue/falseで設定する
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */
	/**
	 *	Whether to Staple or not (true/false).
	 *	@type Bool
	 *	@default Do not Staple.
	 *  @lang en
	 */
	this.enable = false;
	/**
	 *	ステープルの数を整数値(1～2)で設定する
	 *	@type Int
	 *	@default 1箇所
	 *  @lang ja
	 */
	/**
	 *	Integer representing number of Staples to specify (1 or 2).
	 *	@type Int
	 *	@default 1.
	 *  @lang en
	 */
	this.num = 1;
	/**
	 *	ステープルの位置をあらわす定数を設定する
	 *	@type JFLib.STAPLEPOS
	 *	@default 上辺
	 *  @lang ja
	 */
	/**
	 *	Constant representing Staple position.
	 *	@type JFLib.STAPLEPOS
	 *	@default Top.
	 *  @lang en
	 */
	this.position = JFLib.STAPLEPOS.TOP;
};
/**
 * @private
 * Stapleオブジェクトをxml node化する
 */
/**
 * @private
 * Creates xml node from Staple object.
 */
JFLib.ComPrint.Staple.prototype.toXmlNode = function (xml)
{
	var staple = xml.createElementNS(XMLLib.NS.JT, 'Staple');
	xml.setAttributeNS(staple, XMLLib.NS.JT, 'numberOfStaples', this.num);
	xml.setAttributeNS(staple, XMLLib.NS.JT, 'position', this.position);
	return staple;

};

/**
 * Punch インスタンスを作成する
 * @constructor
 * @class パンチを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates Punch instance.
 * @constructor
 * @class This class specifies Punch.<br>
 * @lang en
 */
JFLib.ComPrint.Punch = function()
{
	/**
	 *	パンチの有無をtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
     *  @lang ja
	 */
	/**
	 *	Whether to Punch or not (true/false).<br>
	 *	@type Bool
	 *	@default Do not Punch.
     *  @lang en
	 */
	this.enable = false;
	/**
	 *	パンチの数を整数値(2～3)で設定する
	 *	@type Int
	 *	@default 2個
     *  @lang ja
	 */
	/**
	 *	Integer representing number of holes to specify (2 or 3).
	 *	@type Int
	 *	@default 2.
     *  @lang en
	 */
	this.num = 2;
	/**
	 *	パンチの位置をあらわす定数を設定する
	 *	@type JFLib.PUNCHPOS
	 *	@default 上辺
     *  @lang ja
	 */
	/**
	 *	Constant representing Punch position.
	 *	@type JFLib.PUNCHPOS
	 *	@default Top.
     *  @lang en
	 */
	this.position = JFLib.PUNCHPOS.TOP;
};
/**
 * @private
 * Punchオブジェクトをxml node化する
 * @lang ja
 */
 /**
 * @private
 * Creates xml node from Punch object.
 * @lang en
 */
JFLib.ComPrint.Punch.prototype.toXmlNode = function (xml)
{
	var punch = xml.createElementNS(XMLLib.NS.JT, 'Punch');
	xml.setAttributeNS(punch, XMLLib.NS.JT, 'numberOfHoles', this.num);
	xml.setAttributeNS(punch, XMLLib.NS.JT, 'position', this.position);
	return punch;
};

JFLib.JSIncluded("JfsComPrint");
