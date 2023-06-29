/** 
 * @fileoverview ジョブフローにおけるプリント・コピージョブの共通クラスを定義する<br>
 * プリント・コピージョブ共通で使用される各種クラス<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2010-2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.3.0
 * @lang ja
 */
 /** 
 * @fileoverview Defines classes common to Print/Copy jobs in Job Flow.<br>
 * Classes used commonly by Print and Copy jobs.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2010-2012 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.3.0
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

/**
 * MediumSize インスタンスを作成する
 * @constructor
 * @class 出力サイズを指定するクラス
 * @lang ja
 */
/**
 * Creates MediumSize instance.
 * @constructor
 * @class This class specifies output size
 * @lang en
 */
JFLib.ComPrint.MediumSize = function() 
{
	/**
	 *	定型の入出力のサイズをあらわす定数を設定する
	 *	@type JFLib.MS
	 *	@default 指定なし
	 *  @lang ja
	 */
	/**
	 *	Sets the constant representing standard input/output size
	 *	@type JFLib.MS
	 *	@default 
	 *  @lang en
	 */
	this.size = JFLib.MS.NOTSPEC;
};

/**
 * @private
 */
JFLib.ComPrint.MediumSize.prototype.toXmlNode = function (xml) 
{
	return xml.createElementNSwithText(XMLLib.NS.JT, 'StandardMediumSize', this.size);
};

/**
 * OutputMediumSize インスタンスを作成する
 * @constructor
 * @extends JFLib.ComPrint.MediumSize
 * @class 出力サイズを指定するクラス<br>
 * <a href="JFLib.ComPrint.MediumSize.html#">MediumSize</a>のサブクラス 
 * @lang ja
 */
/**
 * Creates OutputMediumSize instance.
 * @constructor
 * @extends JFLib.ComPrint.MediumSize
 * @class This class specifies output size<br>
 * Subclass of <a href="JFLib.ComPrint.MediumSize.html#">MediumSize</a>.
 * @lang en
 */
JFLib.ComPrint.OutputMediumSize = function() 
{
	/**
	 *	定型の入出力のサイズをあらわす定数を設定する
	 *	@type JFLib.MS
	 *	@default 指定なし
	 *  @lang ja
	 */
	/**
	 *	Sets the constant representing standard input/output size
	 *	@type JFLib.MS
	 *	@default Not specified.
	 *  @lang en
	 */
	this.size = JFLib.MS.NOTSPEC;
};

/**
 * @private
 */
Extend(JFLib.ComPrint.OutputMediumSize.prototype, JFLib.ComPrint.MediumSize.prototype);

/**
 * OriginalImageSize インスタンスを作成する
 * @constructor
 * @extends JFLib.ComScan.MediumSize
 * @class 出力時の画像サイズを指定するクラス<br>
 * <a href="JFLib.ComPrint.MediumSize.html#">MediumSize</a>のサブクラス 
 * @lang ja
 */
/**
 * Creates OriginalImageSize instance.
 * @constructor
 * @extends  JFLib.ComScan.MediumSize
 * @class This class specifies image size at the time of output<br>
 * Subclass of <a href="JFLib.ComPrint.MediumSize.html#">MediumSize</a>.
 * @lang en
 */
JFLib.ComPrint.OriginalImageSize = function() 
{
	/**
	 * @private
	 */
	this.size = "";
};

/**
 * @private
 */
Extend(JFLib.ComPrint.OriginalImageSize.prototype, JFLib.ComPrint.MediumSize.prototype);

/**
 * PageSet インスタンスを作成する
 * @constructor
 * @class ページ組み機能を指定するクラス<br>
 * @lang ja
 */
/**
 * Creates PageSet instance.
 * @constructor
 * @class This class specifies features in which multiple page images are printed to a single output page.<br>
 * @lang en
 */
JFLib.ComPrint.PageSet = function()
{
	/**
	 * ページ組み機能の指定有無をtrue/falseで設定する
	 * @type Bool
	 * @default false
	 * @lang ja
	 */
	/**
	 * Whether features in which multiple page images are printed to a single output page is specified is set by true/false.
	 * @type Bool
	 * @default false
	 * @lang en
	 */
	this.enable = false;

	/**
	 * 分割配置された画像の配置場所を指定する。
	 * 属性値として'left'を指定する。適用できる場合はFacesの要素値が3の場合に限る。それ以外では指定しても無視される。
	 * @type JFLib.NUPSHIFT
	 * @default null
	 * @lang ja
	 */
	/**
	 * Layout of images to divided areas.
	 * 'left' is specified as the attribute, which applies only when the value set for Faces element is 3. Otherwise, the designation is ignored.
	 * @type JFLib.NUPSHIFT
	 * @default null
	 * @lang en
	 */
	this.shift = "";

	/**
	 * N-up出力機能（出力ページを等分割して、連続する入力ページを順次貼り付ける機能）を指定する。
	 * @type JFLib.NUPFACES
	 * @default JFLib.NUPFACES.ONE
	 * @lang ja
	 */
	/**
	 * Specifies N-up feature（Divide output page evenly and layout consecutive input pages sequentially to each area).
	 * @type JFLib.NUPFACES
	 * @default JFLib.NUPFACES.ONE
	 * @lang en
	 */
	this.nup = JFLib.NUPFACES.ONE;
};

/**
 * @private
 */
JFLib.ComPrint.PageSet.prototype.toXmlNode = function(xml)
{
	var pageSet = xml.createElementNS(XMLLib.NS.JT, 'PageSet');
	var nup = pageSet.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Nup'));
	if(this.shift){
		xml.setAttributeNS(nup, XMLLib.NS.JT, 'shift', this.shift);
	}
	nup.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Faces', this.nup));
	return pageSet;
};

//Modification for 2Color Print (FXKIS : Soyeon, Hwang ) START
/**
 * SeconderyOutputColor インスタンスを作成する
 * @constructor
 * @class 2色プリント時の色/変換方法を設定する。<br>
 * @lang ja
 */
JFLib.ComPrint.SeconderyOutputColor = function()
{
	/**
	 *	置き換え色の指定する/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default false
     *  @lang ja
	 */
	this.enable = false;
	
	/**
	 *	出力色<br>
	 *	指定可能な値は, 以下の色に相当する定数のみである。<br>
　	　*	- レッド
　	　*	- グリーン
　	　*	- ブルー
　	　*	- シアン
　	　*	- マゼンタ
　	　*	- イエロー	
	 *	@type JFLib.NAMEDCOLOR
	 *	@default null
     *  @lang ja
	 */
	this.namedColor = "";
	
	/**
	 *	色変換方法<br>
	 *	@type JFLib.PRINT_OUTPUTCOLOR.METHOD
	 *	@default null
     *  @lang ja
	 */
	this.method = "";
}

/**
 * @private
 * outputColorオブジェクトをxml node化する
 * @lang ja
 */
JFLib.ComPrint.SeconderyOutputColor.prototype.toXmlNode = function (xml)
{
	var outputColor = xml.createElementNS(XMLLib.NS.JT, 'OutputColor');
	var secondary = outputColor.appendChild(xml.createElementNS(XMLLib.NS.JT, 'Secondary'));
	secondary.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'NamedColor', this.namedColor));
	secondary.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Method', this.method));
	
	return outputColor;
}
//Modification for 2Color Print (FXKIS : Soyeon, Hwang ) End
JFLib.JSIncluded("JfsComPrint");
