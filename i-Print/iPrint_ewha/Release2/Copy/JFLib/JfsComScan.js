/** 
 * @fileoverview ジョブフローにおけるスキャン・コピージョブの共通クラスを定義する<br>
 * スキャン・コピージョブ共通で使用される各種クラス<br>
 * 使用するには<b>JFLib/JfsCom.js</b>を参照すること
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang ja
 */
/** 
 * @fileoverview Defines classes common to Scan/Copy jobs in Job Flow.<br>
 * Classes used in common by Scan/Copy jobs.<br>
 * To use this file, see <b>JFLib/JfsCom.js</b>.
 * @author Copyright(C) 2010 FujiXerox Co., Ltd. All rights reserved.
 * @version 2.2.1
 * @lang en
 */

/**
 * ジョブフローにおけるスキャン・コピージョブの共通クラスのための名前空間定義
 * @namespace
 * @static
 * @lang ja
 */
 /**
 * Namespace definition for classes used in common by Scan/Copy jobs in Job Flow.
 * @namespace
 * @static
 * @lang en
 */
JFLib.ComScan = {};

/**
 * EdgeErase インスタンスを作成する
 * @constructor
 * @class 枠消しを指定するクラス<br> 
 * @lang ja
 */
/**
 * Creates EdgeErase instance.
 * @constructor
 * @class This class specifies Edge Erase.<br> 
 * @lang en
 */
JFLib.ComScan.EdgeErase = function()
{
	/**
	 *	上方向のクリッピングの量を整数値(0～50)で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Integer (0-50) representing area to be erased at top.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.top =		0;
	/**
	 *	下方向のクリッピングの量を整数値(0～50)で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Integer (0-50) representing area to be erased at bottom.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.bottom =	0;
	/**
	 *	左方向のクリッピングの量を整数値(0～50)で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Integer (0-50) representing area to be erased at left.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.left =		0;
	/**
	 *	右方向のクリッピングの量を整数値(0～50)で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Integer (0-50) representing area to be erased at right.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.right =	0;
	/**
	 *	デバイスのデフォルト設定に従う
	 *	@type Bool
	 *	@default true
	 *  @lang ja
	 */
	/**
	 *	Operation is according to device default settings. 
	 *	@type Bool
	 *	@default true
	 *  @lang en
	 */
	this.isDefault =	true;
	/**
	 *	クリッピング量の指定の単位を設定する
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Unit for specifying area to be clipped.
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang en
	 */
	this.unit =	JFLib.UNIT.MM;
};
/**
 * @private
*/
JFLib.ComScan.EdgeErase.prototype.set = function (top, bottom, left, right, unit) 
{

	this.top = top;
	this.bottom = bottom;
	this.left = left;
	this.right = right;
	if(unit) { this.unit = unit; }
	return [this.top, this.bottom, this.left, this.right, this.unit];
};
/**
 * @private
 * EdgeEraseオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from EdgeErase object.
 * @lang en
 */
JFLib.ComScan.EdgeErase.prototype.toXmlNode = function (xml)
{
	var edge = xml.createElementNS(XMLLib.NS.JT, 'EdgeErase');
	var node = null;

	if(this.isDefault) {
		node = xml.createElementNSwithText(XMLLib.NS.JT, 'Instruction', "Default");
	} else {
		node = xml.createElementNS(XMLLib.NS.JT, 'Edge');
		xml.setAttributeNS(node, XMLLib.NS.JT, 'top', this.top);
		xml.setAttributeNS(node, XMLLib.NS.JT, 'bottom', this.bottom);
		xml.setAttributeNS(node, XMLLib.NS.JT, 'left', this.left);
		xml.setAttributeNS(node, XMLLib.NS.JT, 'right', this.right);
		xml.setAttributeNS(node, XMLLib.NS.JT, 'unit', this.unit);
	}
	edge.appendChild(node);
	return edge;
};
/**
 * CenterErase インスタンスを作成する
 * @constructor
 * @class 中消しを指定するクラス<br> 
 * @lang ja
 */
/**
 * Creates CenterErase instance.
 * @constructor
 * @class This class specifies center erase.<br> 
 * @lang en
 */
JFLib.ComScan.CenterErase = function()
{
	/**
	 *	クリッピングの量を整数値(0～50)で設定する<br>もしくは、デバイスの規定値をJFLib.DEFAULT設定する
	 *	@type Int/JFLib.DEFAULT
	 *	@default JFLib.DEFAULT
	 *  @lang ja
	 */
	/**
	 *	Integer (0-50) representing area to be clipped.<br>
	 *  Device default settings may be set by specifying JFLib.DEFAULT.
	 *	@type Int/JFLib.DEFAULT
	 *	@default JFLib.DEFAULT
	 *  @lang en
	 */
	this.center =	JFLib.DEFAULT;
	/**
	 *	クリッピング量の指定の単位を設定する
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Unit for specifying area to be clipped.
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang en
	 */
	this.unit =	JFLib.UNIT.MM;
};
/**
 * @private
*/
JFLib.ComScan.CenterErase.prototype.set = function (center, unit) 
{
	this.center = center;
	if(unit) { this.unit = unit; }
	return [this.center, this.unit];
};
/**
 * @private
 * CenterEraseオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from CenterErase object.
 * @lang en
 */
JFLib.ComScan.CenterErase.prototype.toXmlNode = function (xml)
{
	var center = xml.createElementNS(XMLLib.NS.JT, 'CenterErase');

	var node = center.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'LineClip', this.center));
	xml.setAttributeNS(node, XMLLib.NS.JT, 'direction', "SecondaryScan");
	xml.setAttributeNS(node, XMLLib.NS.JT, 'unit', this.unit);
	return center;
};

/**
 * MediumSize インスタンスを作成する
 * @constructor
 * @class 入出力サイズを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates MediumSize instance.
 * @constructor
 * @class This class specifies input/output size.<br>
 * @lang en
 */
JFLib.ComScan.MediumSize = function() 
{
	/**
	 *	定型の入出力のサイズをあらわす定数を設定する<br>
	 *	非定型のサイズを使用する場合は"JFLib.MS.NONSTANDARD"を設定する
	 *	@type JFLib.MS
	 *	@default 指定なし
	 *  @lang ja
	 */
	/**
	 *	Constant representing standard medium size for input/output.<br>
	 *	For non-standard size, set "JFLib.MS.NONSTANDARD."
	 *	@type JFLib.MS
	 *	@default Not specified.
	 *  @lang en
	 */
	this.size = JFLib.MS.NOTSPEC;
	/**
	 *	非定型の入出力のサイズのあらわす主走査方向の長さを整数で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Length in fast scan direction upon input/output of non-standard size.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.x = 0;
	/**
	 *	非定型の入出力のサイズのあらわす副走査方向の長さを整数で設定する
	 *	@type Int
	 *	@default 0
	 *  @lang ja
	 */
	/**
	 *	Length in slow scan direction upon input/output of non-standard size.
	 *	@type Int
	 *	@default 0
	 *  @lang en
	 */
	this.y = 0;
	/**
	 *	非定型の入出力のサイズのあらわす主/副走査方向の長さの単位<br>
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang ja
	 */
	/**
	 *	Unit for length in fast/slow scan directions of non-standard size input/output.<br>
	 *	@type JFLib.UNIT
	 *	@default JFLib.UNIT.MM
	 *	@private
	 *  @lang en
	 */
	this.unit = JFLib.UNIT.MM;
	/**
	 *	MediumSizeの初期化
	 */
	this.initialize();
	
};
/**
 * @private
 */
JFLib.ComScan.MediumSize.prototype.initialize = function ()
{
	this.size = JFLib.MS.NOTSPEC;
	this.x = 0;
	this.y = 0;
	this.unit = JFLib.UNIT.MM;
};

/**
 * @private
 */
JFLib.ComScan.MediumSize.prototype.set = function (size, x, y) 
{
	this.size = size;
	if (arguments.length > 1) {
		this.x = x;
		this.y = y;
	}

	return [this.size, this.x, this.y];
};
/**
 * @private
 */
JFLib.ComScan.MediumSize.prototype.setStandard = function (s) 
{
	this.set(s, null, null);
};
/**
 * @private
 */
JFLib.ComScan.MediumSize.prototype.setNonstandard = function (x,y) 
{
	this.set(JFLib.MS.NONSTANDARD, x, y);
};

/**
 * @private
 * MediumSizeオブジェクトをxml node化する
 * @lang ja
 */
 /**
 * @private
 * Creates xml node from MediumSize object.
 * @lang en
 */
JFLib.ComScan.MediumSize.prototype.toXmlNode = function (xml) 
{
	if (this.size != JFLib.MS.NONSTANDARD) {
		return xml.createElementNSwithText(XMLLib.NS.JT, 'StandardMediumSize', this.size);
	} else {
		var ms = xml.createElementNS(XMLLib.NS.JT, 'NonStandardMediumSize');
		xml.setAttributeNS(ms, XMLLib.NS.JT, 'w', this.x);
		xml.setAttributeNS(ms, XMLLib.NS.JT, 'h', this.y);
		xml.setAttributeNS(ms, XMLLib.NS.JT, 'unit', this.unit);
		return ms;
	}

};
/**
 * InputMediumSize インスタンスを作成する
 * @constructor
 * @extends JFLib.ComScan.MediumSize
 * @class 入力サイズを指定するクラス<br>
 * <a href="JFLib.ComScan.MediumSize.html#">MediumSize</a>のサブクラス 
 * @lang ja
 */
/**
 * Creates InputMediumSize instance.
 * @constructor
 * @extends JFLib.ComScan.MediumSize
 * @class This class specifies input size.<br>
 * Subclass of <a href="JFLib.ComScan.MediumSize.html#">MediumSize</a>. 
 * @lang en
 */
JFLib.ComScan.InputMediumSize = function() 
{
	/**
	 * @private
	 */
	this.initialize();
	/**
	 * @private
	 */
	this.size = JFLib.MS.AUTO;
};
Extend(JFLib.ComScan.InputMediumSize.prototype, JFLib.ComScan.MediumSize.prototype);


/**
 * OutputMediumSize インスタンスを作成する
 * @constructor
 * @extends JFLib.ComScan.MediumSize
 * @class 出力サイズを指定するクラス<br>
 * <a href="JFLib.ComScan.MediumSize.html#">MediumSize</a>のサブクラス 
 * @lang ja
 */
/**
 * Creates OutputMediumSize instance.
 * @constructor
 * @extends JFLib.ComScan.MediumSize
 * @class This class specifies output medium size.<br>
 * Subclass of <a href="JFLib.ComScan.MediumSize.html#">MediumSize</a>.
 * @lang en
 */
JFLib.ComScan.OutputMediumSize = function() 
{
	/**
	 * @private
	 */
	this.initialize();
	/**
	 * @private
	 */
	this.size = JFLib.MS.NOTSPEC;
};
Extend(JFLib.ComScan.OutputMediumSize.prototype, JFLib.ComScan.MediumSize.prototype);

/**
 * Magnification インスタンスを作成する
 * @constructor
 * @class 拡大・縮小率を指定するクラス<br>
 * 定型の倍率をあらわす<a href="JFLib.MAG.html">定数</a>を使用する場合には主走査方向・副走査方向に同じ値を設定すること
 * @lang ja
 */
/**
 * Creates Magnification instance.
 * @constructor
 * @class This class specifies enlargement/reduction rates. <br>
 * When using <a href="JFLib.MAG.html">constant</a> for specifying rates for standard sizes, the same value must be set for both slow/scan directions.
 * @lang en
 */
JFLib.ComScan.Magnification = function()
{
	/**
	 *	主走査方向の拡大・縮小率を25.0～400.0の範囲で設定する<br>
	 *	もしくは定型の倍率をあらわす定数を設定する
	 *	@type JFLib.MAG/Float
	 *	@default 等倍
	 *  @lang ja
	 */
	/**
	 *	Enlargement/reduction rate in fast scan direction, range 25.0-400.0; <br>
	 *	or alternatively, constant representing standard rate.
	 *	@type JFLib.MAG/Float
	 *	@default 1:1.
	 *  @lang en
	 */
	this.x = JFLib.MAG.FIX100;
	/**
	 *	副走査方向の拡大・縮小率を25.0～400.0の範囲で設定する<br>
	 *	もしくは定型の倍率をあらわす定数を設定する
	 *	@type JFLib.MAG/Float
	 *	@default 等倍
	 *  @lang ja
	 */
	/**
	 *	Enlargement/reduction rate in slow scan direction, range 25.0-400.0;<br>
	 *	or alternatively, constant representing standard rate.
	 *	@type JFLib.MAG/Float
	 *	@default 1:1.
	 *  @lang en
	 */
	this.y = JFLib.MAG.FIX100;
};

/**
 * @private
*/
JFLib.ComScan.Magnification.prototype.set = function (x, y) 
{
	this.x = x;
	if (arguments.length > 1) {
	 	this.y = y;
	} else {
	 	this.y = v._x;
	}
	return [this.x, this.y];
};
/**
 * @private
*/
JFLib.ComScan.Magnification.prototype.setIsotropic = function (x) 
{
	return this.set(x, x);
};
/**
 * @private
 * Magオブジェクトをxml node化する
 * @lang ja
 */
/**
 * @private
 * Creates xml node from Mag object.
 * @lang en
 */
JFLib.ComScan.Magnification.prototype.toXmlNode = function (xml)
{
	var v = 100;
	var mag = xml.createElementNS(XMLLib.NS.JT, 'Magnification');
	if (this.x == this.y) {
		if (this.x != 100) { v = this.x; }
		mag.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Isotropic', v));
	} else {
		v = this.x + " " + this.y;
		mag.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Anamorphic', v));
	}
		
	return mag;
};

/**
 * SplitScan インスタンスを作成する
 * @constructor
 * @return なし <br>
 * @class 分割スキャンを指定するクラス<br>
 * @lang ja
 */
/**
 * Creates SplitScan instance.
 * @constructor
 * @return None <br>
 * @class This class specifies Split Scan.<br>
 * @lang en
 */
JFLib.ComScan.SplitScan = function()
{
	/**
	 *	分割スキャンのする/しないをtrue/falseで設定する<br>
	 *	@type Bool
	 *	@default しない
	 *  @lang ja
	 */
	/**
	 *	Specifies whether or not to perform Split Scan by true/false.<br>
	 *	@type Bool
	 *	@default false
	 *  @lang en
	 */
	this.enable = false;
	/**
	 *	スキャン原稿の綴じ位置によって分割出力された2面の画像のページ順と向き設定する<br>設定 - <font color = "#ff0000">必須</font>
	 *	@type JFLib.SPLITBOUND
	 *	@default なし
	 *  @lang ja
	 */
	/**
	 *	Specifies the page sequence and orientation of two impressions that are output using Split Scan based on the binding position of the original<br>Setting - <font color = "#ff0000">REQUIRED.</font>
	 *	@type JFLib.SPLITBOUND
	 *	@default None
	 *  @lang en
	 */
	this.boundAt = "";
	/**
	 *	分割出力された2面の画像のうちどちらの画像を出力するかを設定する<br>
	 *	@type JFLib.SPLITEXTRACT
	 *	@default なし
	 *  @lang ja
	 */
	/**
	 *	Specifies which image is to be output between two impressions that are output using Split Scan<br>
	 *	@type JFLib.SPLITEXTRACT
	 *	@default None
	 *  @lang en
	 */
	this.extract = "";
};

/**
 * @private
 * SplitScanオブジェクトをxml node化する
 */
JFLib.ComScan.SplitScan.prototype.toXmlNode = function (xml)
{
	var splitScan = xml.createElementNS(XMLLib.NS.JT, 'SplitScan');
	var pageSplit = splitScan.appendChild(xml.createElementNS(XMLLib.NS.JT, 'PageSplit'));
	if(this.boundAt) { xml.setAttributeNS(pageSplit, XMLLib.NS.JT, 'boundAt', this.boundAt); }
	if(this.extract){ pageSplit.appendChild(xml.createElementNSwithText(XMLLib.NS.JT, 'Extract', this.extract)); }
	return splitScan;
};


JFLib.JSIncluded("JfsComScan");

