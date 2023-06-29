/**
 * @fileoverview スキャンコンフリクト制御のためのクラス定義
 * @author
 * @version 1.0.0
 */
/**
 * 指定されたパラメータに対して以下の処理を行う<br>
 * 1. 指定されたパラメータの設定を行う<br>
 * 2. 1で設定されたパラメータにより関連するパラメータをコンフリクトが発生しないように自動的に変更する<br>
 * @param {String} property 出力処理の各プロパティ名
 * @param {Object/String/Int/Bool} attrObj 設定する値
 * @parma {Object} refObj 参照するオブジェクト
 * @returns 2の処理により、関連するパラメータが変更された場合、その旨をパラメータIDの配列により通知する<br>
 * パラメータIDは各サービスのオブジェクト下のプロパティ名とする
 */
JFLib.Scan.prototype.setConflictParam = function(property, attrObj, refObj)
{
	var _funcName = null;
	JFLib.Scan._chkParamId = null;
	JFLib.Scan._chgParamId = new Array();

	//値の設定
	this.setParam(property, attrObj);

	//設定の整合を取って関連パラメータを変更
	if(property in this._conflictChgTable){
		for(var i in this._conflictChgTable[property]){
			_funcName = this._conflictChgTable[property][i];
			this[_funcName](property, refObj);
		}
		if(JFLib.Scan._chgParamId.length){
			JFLib.onEvent("ChgCpCfParam", JFLib.eventType.VALIDATE, JFLib.Scan._chgParamId);
		}
	}
	return;
}

/**
 * 後優先のテーブル
 * @private
 */
JFLib.Scan.prototype._conflictChgTable = {
	'docFormat'			:	['chgResolution', 'chgColorMode'],
	'resolution'		:	['chgFileFormat'],
	'colorMode'			:	['chgFileFormat'],
	'plex'				:	['chgSplitScan'],
	'headposition'		:	['chgSplitScan'],
	'splitScan'			:	['chgPlex', 'chgHeadPos']
}

JFLib.Scan.prototype.chgFileFormat = function(funcId, emailObj)
{
	var _chgPrmId = "docFormat";
	var _funcVal = this.getParam(funcId);
	switch(funcId){
		case 'resolution':
			if(_funcVal && (_funcVal == JFLib.RES.R400 || _funcVal == JFLib.RES.R600)){
				if(this.multiLayer.enable){
					var _ret = this.setParam('multiLayer', {enable:false});
				}
				if(_ret){
					JFLib.Scan._chgParamId.push(_chgPrmId);
				}
				return _ret;
			}
			break;
		case 'colorMode':
			if(_funcVal && _funcVal == JFLib.CM.BW){
				if(emailObj.docFormat == JFLib.DOCFORMAT.JPEG){
					var _ret = emailObj.setParam(_chgPrmId, JFLib.DOCFORMAT.TIFF_MULTI);
				}else if((emailObj.docFormat == JFLib.DOCFORMAT.PDF) && (this.multiLayer.enable)){
					var _ret = this.setParam('multiLayer', {enable:false});
				}
				if(_ret){
					JFLib.Scan._chgParamId.push(_chgPrmId);
				}
				return _ret;
			}
			break;
		default:
			break;
	}
	return false;
}

/**
 * カラーモードを変更
 * @private
 */
JFLib.Scan.prototype.chgColorMode = function(funcId, emailObj)
{
	var _chgPrmId = "colorMode";
	var _funcVal = emailObj.getParam(funcId);
	switch(funcId) {
		case 'docFormat':
			var _chgPrmVal = this.getParam(_chgPrmId);
			if(_funcVal && (_chgPrmVal && _chgPrmVal == JFLib.CM.BW)){
				if((_funcVal == JFLib.DOCFORMAT.PDF) && this.multiLayer.enable){
					//仕様変更対応(V1.5.0) Start
					//var _ret = this.setParam(_chgPrmId, JFLib.CM.AUTO);
					var cmFlag = (glbDevInfo.cmType==CMType.BNW);
					var _ret = this.setParam(_chgPrmId, cmFlag?JFLib.CM.GRAY:JFLib.CM.AUTO);
					//仕様変更対応(V1.5.0) End
				}else if(_funcVal == JFLib.DOCFORMAT.JPEG){
					var _ret = this.setParam(_chgPrmId, JFLib.CM.GRAY);
				}
				if(_ret){
					JFLib.Scan._chgParamId.push(_chgPrmId);
				}
				return _ret;
			}
			break;
		default:
			break;
	}
	return false;
}

/**
 * 解像度を変更
 * @private
 */
JFLib.Scan.prototype.chgResolution = function(funcId, emailObj)
{
	var _chgPrmId = "resolution";
	var _funcVal = emailObj.getParam(funcId);
	switch(funcId){
		case 'docFormat':
			if((_funcVal && _funcVal == JFLib.DOCFORMAT.PDF) && (this.multiLayer.enable)){
				var _chgPrmVal = this.getParam(_chgPrmId);
				if(_chgPrmVal && (_chgPrmVal == JFLib.RES.R400 || _chgPrmVal == JFLib.RES.R600)){
					var _ret = this.setParam(_chgPrmId, JFLib.RES.R300);
					if(_ret){
						JFLib.Scan._chgParamId.push(_chgPrmId);
					}
					return _ret;
				}
			}
			break;
		default:
			break;
	}
	return false;
}

/**
 * 両面スキャンを変更
 * @private
 */
JFLib.Scan.prototype.chgPlex = function(funcId, refObj)
{
	var _chgPrmId = "plex";
	var _funcVal = this.getParam(funcId);
	switch(funcId) {
		case 'splitScan':
			if(_funcVal && _funcVal.enable){
				return this.chgSimplex(_chgPrmId);
			}
			break;
		default:
			break;
	}
	return false;
}

/**
 * 原稿の向きを変更
 * @private
 */
JFLib.Scan.prototype.chgHeadPos = function(funcId, refObj)
{
	var _chgPrmId = "headposition";
	var _funcVal = this.getParam(funcId);
	switch(funcId){
		case 'splitScan':
			if(_funcVal && _funcVal.enable){
				if(_funcVal.boundAt == JFLib.SPLITBOUND.TOP){
					var _ret = this.setParam(_chgPrmId, JFLib.HP.LEFT);
				}else{
					var _ret = this.setParam(_chgPrmId, JFLib.HP.TOP);
				}
				if(_ret){
					JFLib.Scan._chgParamId.push(_chgPrmId);
				}
				return _ret;
			}
			break;
		default:
			break;
	}
	return false;
}

/**
 * ページ連写を変更
 * @private
 */
JFLib.Scan.prototype.chgSplitScan = function(funcId, refObj)
{
	var _chgPrmId = "splitScan";
	var _funcVal = this.getParam(funcId);
	switch (funcId){
		case 'headposition':
			var _chgPrmVal = this.getParam(_chgPrmId);
			if(_chgPrmVal && _chgPrmVal.enable){
				if(_funcVal == JFLib.HP.LEFT){
					var _ret = this.setParam(_chgPrmId, {boundAt:JFLib.SPLITBOUND.TOP});
				}else if(_funcVal == JFLib.HP.TOP){
					if(_chgPrmVal.boundAt == JFLib.SPLITBOUND.TOP){
						var _ret = this.setParam(_chgPrmId, {boundAt:JFLib.SPLITBOUND.LEFT});
					}
				}
				if(_ret){
					JFLib.Scan._chgParamId.push(_chgPrmId);
				}
				return _ret;
			}
			break;
		case 'plex':
			if(this.isDuplex(_funcVal)){
				return this.chgDisable(_chgPrmId);
			}
			break;
		default:
			return false;
	}
}

/**
 * 両面か否か
 * @private
 */
JFLib.Scan.prototype.isDuplex = function(_funcVal)
{
	return (_funcVal == JFLib.PLEX.DUPLEX || _funcVal == JFLib.PLEX.TUMBLE);
}

/**
 * 片面に変更
 * @private
 */
JFLib.Scan.prototype.chgSimplex = function(_chgPrmId)
{
	var _chgPrmVal = this.getParam(_chgPrmId);
	if(this.isDuplex(_chgPrmVal)){
		var _ret = this.setParam(_chgPrmId, JFLib.PLEX.SIMPLEX);
		if(_ret){
			JFLib.Scan._chgParamId.push(_chgPrmId);
		}
		return _ret;
	}else{
		return false;
	}
}

/**
 * 指定された機能をOFFにする
 * @private
 */
JFLib.Scan.prototype.chgDisable = function(_chgPrmId)
{
	var _chgPrmVal = this.getParam(_chgPrmId);
	if(_chgPrmVal && _chgPrmVal.enable){
		var _ret = this.setParam(_chgPrmId, {enable : false});
		if(_ret){
			JFLib.Scan._chgParamId.push(_chgPrmId);
		}
		return _ret;
	}else{
		return false;
	}
}