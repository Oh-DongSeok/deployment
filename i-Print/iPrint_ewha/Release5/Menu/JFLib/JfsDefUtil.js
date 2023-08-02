﻿/** 
 * @fileoverview 指示書操作のためのユーティリティクラスで使用される定数を定義する
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.1
 * @lang ja
 */
/** 
 * @fileoverview Defines constants used in utility class for Job Flow Sheet operation.
 *
 * @author Copyright(C) 2010 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.1
 * @lang en
 */



/**
 * このコンストラクタを明示的に呼び出す必要はない
 * @class SelectionTypeに用いる定数を定義したクラス
 * @constructor このコンストラクタを明示的に呼び出す必要はない
 * @lang ja
 *
 */
/**
 * This constructor need not be called explicitly.
 * @class Class defining constants to be used for SelectionType.
 * @constructor This constructor need not be called explicitly.
 * @lang en
 *
 */
JfsUtil.SELECTIONTYPE = function(){};
/**
 * 最も新しい文書
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Newest document
 * @final
 * @type String
 * @constant
 * @lang en
 */
JfsUtil.SELECTIONTYPE.NEWEST = 'newest';

/**
 * 最も古い文書
 * @final
 * @type String
 * @constant
 * @lang ja
 */
/**
 * Oldest document
 * @final
 * @type String
 * @constant
 * @lang en
 */
JfsUtil.SELECTIONTYPE.OLDEST = 'oldest';

JFLib.JSIncluded("JfsDefUtil");