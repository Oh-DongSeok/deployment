/**
 * @fileoverview ブラウザ未定義のDOM関数の補完<br>
 * 以下のメソッドを提供する<br>
 * document.getElementsByClassName<br>
 * document.createElementNS
 * @author Copyright(C) 2007 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.2
 * @lang ja
 */
 
/**
 * @fileoverview Provides DOM functions that the browser does not.<br>
 * Provides the following methods:<br>
 * document.getElementsByClassName<br>
 * document.createElementNS
 * @author Copyright(C) 2007 Fuji Xerox Co., Ltd. All rights reserved.
 * @version 1.0.2
 * @lang en
 */
 
/**
 * documentのメソッドとして追加される。<br>
 * classNameで指定したクラス名を持つエレメントオブジェクトを検索・収集し集合を返す
 * @name getElementsByClassName
 * @function 
 * @param {String} className クラス名を示す文字列
 * @return {Object} elements Null：エラー<br>
 * elements：上記以外(収集されたエレメントノードが格納されているノードリストオブジェクト)<br><br>
 * 【補足】<br>
 * 収集されたエレメントノードはツリーから削除されることはない。<br>
 * <font color = "#ff0000">classNameにはスペース区切りで複数のクラス名を指定することが可能</font>
 * @lang ja
 */
 
 /**
 * Added as method of document.<br>
 * Searches for element objects specified by className, and returns group of element objects.
 * @name getElementsByClassName
 * @function 
 * @param {String} className String representing class name.
 * @return {Object} elements Returns null if error occurs; otherwise returns elements (node list object comprising of those)<br>
 * elements that were searched)<br><br>
 * NOTES:<br>
 * The collected element nodes are not removed from the document tree.<br>
 * <font color = "#ff0000">Multiple class names can be set to className by comma separation.</font>
 * @lang en
 */
 
document.getElementsByClassName = function(className)
{
	var children = document.body.getElementsByTagName('*');
//	var elements = new Array();
	var elements = new Object();
	var child = new Array();
	child = children;
	children.length;
	var sp_classname = className.split(" ");
	for(var cnt=0; cnt<sp_classname.length; cnt++)
	{
		var pattern = new RegExp("(^|\\s)" + sp_classname[cnt] + "(\\s|$)");
		for (var i = 0; i < children.length; i++) {
			if (child[i].className.match(pattern))
			{
				elements.push(child[i]);
			}
		}
	}
	return elements;
};
/**
 * documentのメソッドとして追加される。<br>
 * 指定された名前空間に属するエレメントノードを生成する
 * @name createElementNS
 * @private
 * @function 
 * @param {String} namespace 名前空間を示すURI文字列
 * @param {String} name タグ名(NCNameもしくはQName)を示す文字列
 * @returns {Object} node null：エラー<br>
 * node：上記以外(生成されたエレメントノードオブジェクト)<br><br>
 * 【補足】<br>
 * 指定されたタグ名がNCName(名前空間を示すprefixと":"がない表記の名前)の時にはデフォルト名前空間宣言(xmlns="...")が付加され、<br>
 * タグ名がQName(prefixと":"が付加されている名前)の時にはxmlns:prefix="..."表記の名前空間宣言が付加される。
 * @lang ja
 */
 
 /**
 * Added as method of document.<br>
 * Creates element node of specified namespace.
 * @name createElementNS
 * @private
 * @function 
 * @param {String} namespace URI string representing namespace.
 * @param {String} name String representing tag name (NCName or QName)
 * @returns {Object} node Returns null if error occurs; otherwise returns node (created element node object).<br><br>
 * NOTE:s<br>
 * If specified tag name is NCName (i.e. does not contain namespace prefix and ":"), <br>
 * default namespace declaration (xmlns="...") is appended.
 * If tag name is QName (i.e. contains namespace prefix and ":"), namespace declaration of the format <br>
 * xmlns:prefix="..." is appended.
 * @lang en
 */
document.createElementNS = function( namespace, name )
{
	var ns = namespace;
	if (ns == null) {
    	return  document.body.createElement( name );
	}	
   	var node = document.body.createElement( ns.prefix + ":" + name );

	var attrnode = document.body.createAttribute("xmlns:"+ns.prefix);
	attrnode.nodeValue = ns.url;
	node.setAttributeNode(attrnode);

	return node;
};
