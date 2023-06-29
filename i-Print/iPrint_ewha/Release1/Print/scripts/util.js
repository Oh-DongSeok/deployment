/**
 * 암호화 처리 모듈 
 */
var SecureManager = {
    _solvedKey: null,
    _iv: null,
    init: function(solvedKey, iv) {
        this._solvedKey = solvedKey;
        this._iv = iv;
    },
    encrypt: function(obj) {
        var tmp;
        for (var j in obj) {
            if (obj.hasOwnProperty(j)) {
                //if(typeof obj[j] === "object"){
                tmp = obj[j];
                //console.log(JSON.stringify(tmp));
                switch (typeof tmp) {
                    case "object":
                        if (tmp.$super) {
                            obj[j] = this._encodeMsg(tmp);
                        } else {
                            obj[j] = this.encrypt(tmp);
                        }
                        break;
                    case "boolean":
                    case "number":
                        tmp = tmp.toString();
                    case "string":
                        obj[j] = this._encodeMsg(tmp);
                        break;
                    default:
                        //pass
                        break;
                }
            } else {
                //pass
            }
        }
        return obj;
    },
    decrypt: function(obj) {
        var tmp;
        for (var j in obj) {
            if (obj.hasOwnProperty(j)) {
                //if(typeof obj[j] === "object"){
                tmp = obj[j];
                switch (typeof tmp) {
                    case "object":
                        obj[j] = this.decrypt(obj[j]);
                        break;
                    case "string":
                    case "number":
                        obj[j] = this._decodeMsg(tmp);
                        break;
                    default:
                        //pass
                        break;
                }
            } else {
                //pass
            }
        }
        return obj;
    },
    /*
    	decrypt:function(obj){
    		var result="";
    		switch(typeof obj){
    			case "object":
    				result = this._decodeObj(obj);
    				break;
    			case "string":
    			case "number":
    				result = this._decodeMsg(obj);
    				break;
    			default:
    				//pass
    				break;
    		}
    		return result;
    	},
    	_decodeObj:function(obj){
    		var result = (obj instanceof Array)?[]:{};
    		for(var j in obj){
    			if(obj.hasOwnProperty(j)){
    				//if(typeof obj[j] === "object"){
    				result[j] = this.decrypt(obj[j]);
    			}
    			else{
    				//pass
    			}
    		}
    		return result;
    	},*/
    _encodeMsg: function(_msg) {
        var _encoded = CryptoJS.AES.encrypt(_msg, this._solvedKey, { iv: this._iv, blockSize: 128, mode: CryptoJS.mode.ECB });
        var result = _encoded.toString();
        _encoded = null;
        return result;
    },
    _decodeMsg: function(_msg) {
        var _decoded = CryptoJS.AES.decrypt(_msg, this._solvedKey, { iv: this._iv, blockSize: 128, mode: CryptoJS.mode.ECB });
        var result = _decoded.toString(CryptoJS.enc.Utf8);
        _decoded = null;
        return result;
    }
};

var TemplateManager = {
    DataSource: {
        //"DocList":"<div><p>${Name}</p><p>${Value}</p><p>${Name}</p><p>${Value}</p></div>"
        //"DocList":'<img id="bgDocItem${Idx}" /><div id="lblDocItemName${Idx}" class="lbl fileName">${Name}</div><div id="lblDocItemDate${Idx}" class="lbl fileDate">${Date}</div><div id="lblDocItemPages${Idx}" class="lbl filePages">${Pages}</div><div id="lblDocItemQat${Idx}" class="lbl fileQat">${Qat}</div><img id="icnDocItemColor${Idx}" class="icon fileColor" /><div id="lblDocItemColor${Idx}" class="lbl fileColor">${Color}</div><img id="icnDocItemPlex${Idx}" class="icon filePlex" /><div id="lblDocItemPlex${Idx}" class="lbl filePlex">${Plex}</div><img id="icnDocItemNup${Idx}" class="icon fileNup"/><div id="lblDocItemNup${Idx}" class="lbl fileNup">${Nup}</div><img id="icnDocItemAlert${Idx}" class="icon alert" />'
        //"DocItem":'<img id="bgDocItem${Idx}" /><div id="lblDocItemName${Idx}" class="lbl fileName"></div><div id="lblDocItemDate${Idx}" class="lbl fileDate"></div><div id="lblDocItemPages${Idx}" class="lbl filePages"></div><div id="lblDocItemQat${Idx}" class="lbl fileQat"></div><img id="icnDocItemColor${Idx}" class="icon fileColor" /><div id="lblDocItemColor${Idx}" class="lbl fileColor"></div><img id="icnDocItemPlex${Idx}" class="icon filePlex" /><div id="lblDocItemPlex${Idx}" class="lbl filePlex"></div><img id="icnDocItemNup${Idx}" class="icon fileNup"/><div id="lblDocItemNup${Idx}" class="lbl fileNup"></div><img id="icnDocItemAlert${Idx}" class="icon alert" /><div id="lblDocItemDelete${Idx}" class="lbl fileDelete"></div>'
        "DocItem": '<img id="bgDocItem{{Idx}}" /><div id="lblDocItemName{{Idx}}" class="lbl fileName"></div><div id="lblDocItemDate{{Idx}}" class="lbl fileDate"></div><div id="lblDocItemPages{{Idx}}" class="lbl filePages"></div><div id="lblDocItemQat{{Idx}}" class="lbl fileQat"></div><img id="icnDocItemColor{{Idx}}" class="icon fileColor" /><div id="lblDocItemColor{{Idx}}" class="lbl fileColor"></div><img id="icnDocItemPlex{{Idx}}" class="icon filePlex" /><div id="lblDocItemPlex{{Idx}}" class="lbl filePlex"></div><img id="icnDocItemNup{{Idx}}" class="icon fileNup"/><div id="lblDocItemNup{{Idx}}" class="lbl fileNup"></div><img id="icnDocItemAlert{{Idx}}" class="icon alert" /><div id="lblDocItemDelete{{Idx}}" class="lbl fileDelete"></div>',
        //ewb의 정규식 대응문제에 따른 임시 대처
        /*"DocItem0":'<img id="bgDocItem0" /><div id="lblDocItemName0" class="lbl fileName"></div><div id="lblDocItemDate0" class="lbl fileDate"></div><div id="lblDocItemPages0" class="lbl filePages"></div><div id="lblDocItemQat0" class="lbl fileQat"></div><img id="icnDocItemColor0" class="icon fileColor" /><div id="lblDocItemColor0" class="lbl fileColor"></div><img id="icnDocItemPlex0" class="icon filePlex" /><div id="lblDocItemPlex0" class="lbl filePlex"></div><img id="icnDocItemNup0" class="icon fileNup"/><div id="lblDocItemNup0" class="lbl fileNup"></div><img id="icnDocItemAlert0" class="icon alert" /><div id="lblDocItemDelete0" class="lbl fileDelete"></div>',
        "DocItem1":'<img id="bgDocItem1" /><div id="lblDocItemName1" class="lbl fileName"></div><div id="lblDocItemDate1" class="lbl fileDate"></div><div id="lblDocItemPages1" class="lbl filePages"></div><div id="lblDocItemQat1" class="lbl fileQat"></div><img id="icnDocItemColor1" class="icon fileColor" /><div id="lblDocItemColor1" class="lbl fileColor"></div><img id="icnDocItemPlex1" class="icon filePlex" /><div id="lblDocItemPlex1" class="lbl filePlex"></div><img id="icnDocItemNup1" class="icon fileNup"/><div id="lblDocItemNup1" class="lbl fileNup"></div><img id="icnDocItemAlert1" class="icon alert" /><div id="lblDocItemDelete1" class="lbl fileDelete"></div>',
        "DocItem2":'<img id="bgDocItem2" /><div id="lblDocItemName2" class="lbl fileName"></div><div id="lblDocItemDate2" class="lbl fileDate"></div><div id="lblDocItemPages2" class="lbl filePages"></div><div id="lblDocItemQat2" class="lbl fileQat"></div><img id="icnDocItemColor2" class="icon fileColor" /><div id="lblDocItemColor2" class="lbl fileColor"></div><img id="icnDocItemPlex2" class="icon filePlex" /><div id="lblDocItemPlex2" class="lbl filePlex"></div><img id="icnDocItemNup2" class="icon fileNup"/><div id="lblDocItemNup2" class="lbl fileNup"></div><img id="icnDocItemAlert2" class="icon alert" /><div id="lblDocItemDelete2" class="lbl fileDelete"></div>',
        "DocItem3":'<img id="bgDocItem3" /><div id="lblDocItemName3" class="lbl fileName"></div><div id="lblDocItemDate3" class="lbl fileDate"></div><div id="lblDocItemPages3" class="lbl filePages"></div><div id="lblDocItemQat3" class="lbl fileQat"></div><img id="icnDocItemColor3" class="icon fileColor" /><div id="lblDocItemColor3" class="lbl fileColor"></div><img id="icnDocItemPlex3" class="icon filePlex" /><div id="lblDocItemPlex3" class="lbl filePlex"></div><img id="icnDocItemNup3" class="icon fileNup"/><div id="lblDocItemNup3" class="lbl fileNup"></div><img id="icnDocItemAlert3" class="icon alert" /><div id="lblDocItemDelete3" class="lbl fileDelete"></div>'*/
        /*"DocItem0":'<img id="bgDocItem0" /><div id="lblDocItemName0" class="lbl fileName"></div><div id="lblDocItemDate0" class="lbl fileDate"></div><div id="lblDocItemPages0" class="lbl filePages"></div><div id="lblDocItemQat0" class="lbl fileQat"></div><img id="icnDocItemColor0" class="icon fileColor" /><div id="lblDocItemColor0" class="lbl fileColor"></div><div id="lblDocItemMS0" class="lbl fileMS"></div>',
        "DocItem1":'<img id="bgDocItem1" /><div id="lblDocItemName1" class="lbl fileName"></div><div id="lblDocItemDate1" class="lbl fileDate"></div><div id="lblDocItemPages1" class="lbl filePages"></div><div id="lblDocItemQat1" class="lbl fileQat"></div><img id="icnDocItemColor1" class="icon fileColor" /><div id="lblDocItemColor1" class="lbl fileColor"></div><div id="lblDocItemMS1" class="lbl fileMS"></div>',
        "DocItem2":'<img id="bgDocItem2" /><div id="lblDocItemName2" class="lbl fileName"></div><div id="lblDocItemDate2" class="lbl fileDate"></div><div id="lblDocItemPages2" class="lbl filePages"></div><div id="lblDocItemQat2" class="lbl fileQat"></div><img id="icnDocItemColor2" class="icon fileColor" /><div id="lblDocItemColor2" class="lbl fileColor"></div><div id="lblDocItemMS2" class="lbl fileMS"></div>',
        "DocItem3":'<img id="bgDocItem3" /><div id="lblDocItemName3" class="lbl fileName"></div><div id="lblDocItemDate3" class="lbl fileDate"></div><div id="lblDocItemPages3" class="lbl filePages"></div><div id="lblDocItemQat3" class="lbl fileQat"></div><img id="icnDocItemColor3" class="icon fileColor" /><div id="lblDocItemColor3" class="lbl fileColor"></div><div id="lblDocItemMS3" class="lbl fileMS"></div>',
        "DocItem4":'<img id="bgDocItem4" /><div id="lblDocItemName4" class="lbl fileName"></div><div id="lblDocItemDate4" class="lbl fileDate"></div><div id="lblDocItemPages4" class="lbl filePages"></div><div id="lblDocItemQat4" class="lbl fileQat"></div><img id="icnDocItemColor4" class="icon fileColor" /><div id="lblDocItemColor4" class="lbl fileColor"></div><div id="lblDocItemMS4" class="lbl fileMS"></div>'*/
        //JSON용 파일당 가격표시 추가
        /*"DocItem0":'<img id="bgDocItem0" /><div id="lblDocItemName0" class="lbl fileName"></div><div id="lblDocItemDate0" class="lbl fileDate"></div><div id="lblDocItemPages0" class="lbl filePages"></div><div id="lblDocItemQat0" class="lbl fileQat"></div><img id="icnDocItemColor0" class="icon fileColor" /><div id="lblDocItemColor0" class="lbl fileColor"></div><div id="lblDocItemMS0" class="lbl fileMS"></div><div id="lblDocItemPrice0" class="lbl filePrice"></div>',
        "DocItem1":'<img id="bgDocItem1" /><div id="lblDocItemName1" class="lbl fileName"></div><div id="lblDocItemDate1" class="lbl fileDate"></div><div id="lblDocItemPages1" class="lbl filePages"></div><div id="lblDocItemQat1" class="lbl fileQat"></div><img id="icnDocItemColor1" class="icon fileColor" /><div id="lblDocItemColor1" class="lbl fileColor"></div><div id="lblDocItemMS1" class="lbl fileMS"></div><div id="lblDocItemPrice1" class="lbl filePrice"></div>',
        "DocItem2":'<img id="bgDocItem2" /><div id="lblDocItemName2" class="lbl fileName"></div><div id="lblDocItemDate2" class="lbl fileDate"></div><div id="lblDocItemPages2" class="lbl filePages"></div><div id="lblDocItemQat2" class="lbl fileQat"></div><img id="icnDocItemColor2" class="icon fileColor" /><div id="lblDocItemColor2" class="lbl fileColor"></div><div id="lblDocItemMS2" class="lbl fileMS"></div><div id="lblDocItemPrice2" class="lbl filePrice"></div>',
        "DocItem3":'<img id="bgDocItem3" /><div id="lblDocItemName3" class="lbl fileName"></div><div id="lblDocItemDate3" class="lbl fileDate"></div><div id="lblDocItemPages3" class="lbl filePages"></div><div id="lblDocItemQat3" class="lbl fileQat"></div><img id="icnDocItemColor3" class="icon fileColor" /><div id="lblDocItemColor3" class="lbl fileColor"></div><div id="lblDocItemMS3" class="lbl fileMS"></div><div id="lblDocItemPrice3" class="lbl filePrice"></div>',
        "DocItem4":'<img id="bgDocItem4" /><div id="lblDocItemName4" class="lbl fileName"></div><div id="lblDocItemDate4" class="lbl fileDate"></div><div id="lblDocItemPages4" class="lbl filePages"></div><div id="lblDocItemQat4" class="lbl fileQat"></div><img id="icnDocItemColor4" class="icon fileColor" /><div id="lblDocItemColor4" class="lbl fileColor"></div><div id="lblDocItemMS4" class="lbl fileMS"></div><div id="lblDocItemPrice4" class="lbl filePrice"></div>'*/
        //Nup,양단면 추가
        "DocItem0": '<img id="bgDocItem0" /><div id="lblDocItemName0" class="lbl fileName"></div><div id="lblDocItemDate0" class="lbl fileDate"></div><div id="lblDocItemPages0" class="lbl filePages"></div><div id="lblDocItemQat0" class="lbl fileQat"></div><img id="icnDocItemColor0" class="icon fileColor" /><div id="lblDocItemColor0" class="lbl fileColor"></div><div id="lblDocItemMS0" class="lbl fileMS"></div><div id="lblDocItemPrice0" class="lbl filePrice"></div><div id="lblDocItemNup0" class="lbl fileNup"></div><div id="lblDocItemPlex0" class="lbl filePlex"></div>',
        "DocItem1": '<img id="bgDocItem1" /><div id="lblDocItemName1" class="lbl fileName"></div><div id="lblDocItemDate1" class="lbl fileDate"></div><div id="lblDocItemPages1" class="lbl filePages"></div><div id="lblDocItemQat1" class="lbl fileQat"></div><img id="icnDocItemColor1" class="icon fileColor" /><div id="lblDocItemColor1" class="lbl fileColor"></div><div id="lblDocItemMS1" class="lbl fileMS"></div><div id="lblDocItemPrice1" class="lbl filePrice"></div><div id="lblDocItemNup1" class="lbl fileNup"></div><div id="lblDocItemPlex1" class="lbl filePlex"></div>',
        "DocItem2": '<img id="bgDocItem2" /><div id="lblDocItemName2" class="lbl fileName"></div><div id="lblDocItemDate2" class="lbl fileDate"></div><div id="lblDocItemPages2" class="lbl filePages"></div><div id="lblDocItemQat2" class="lbl fileQat"></div><img id="icnDocItemColor2" class="icon fileColor" /><div id="lblDocItemColor2" class="lbl fileColor"></div><div id="lblDocItemMS2" class="lbl fileMS"></div><div id="lblDocItemPrice2" class="lbl filePrice"></div><div id="lblDocItemNup2" class="lbl fileNup"></div><div id="lblDocItemPlex2" class="lbl filePlex"></div>',
        "DocItem3": '<img id="bgDocItem3" /><div id="lblDocItemName3" class="lbl fileName"></div><div id="lblDocItemDate3" class="lbl fileDate"></div><div id="lblDocItemPages3" class="lbl filePages"></div><div id="lblDocItemQat3" class="lbl fileQat"></div><img id="icnDocItemColor3" class="icon fileColor" /><div id="lblDocItemColor3" class="lbl fileColor"></div><div id="lblDocItemMS3" class="lbl fileMS"></div><div id="lblDocItemPrice3" class="lbl filePrice"></div><div id="lblDocItemNup3" class="lbl fileNup"></div><div id="lblDocItemPlex3" class="lbl filePlex"></div>',
        "DocItem4": '<img id="bgDocItem4" /><div id="lblDocItemName4" class="lbl fileName"></div><div id="lblDocItemDate4" class="lbl fileDate"></div><div id="lblDocItemPages4" class="lbl filePages"></div><div id="lblDocItemQat4" class="lbl fileQat"></div><img id="icnDocItemColor4" class="icon fileColor" /><div id="lblDocItemColor4" class="lbl fileColor"></div><div id="lblDocItemMS4" class="lbl fileMS"></div><div id="lblDocItemPrice4" class="lbl filePrice"></div><div id="lblDocItemNup4" class="lbl fileNup"></div><div id="lblDocItemPlex4" class="lbl filePlex"></div>',
        "DocItem5": '<img id="bgDocItem5" /><div id="lblDocItemName5" class="lbl fileName"></div><div id="lblDocItemDate5" class="lbl fileDate"></div><div id="lblDocItemPages5" class="lbl filePages"></div><div id="lblDocItemQat5" class="lbl fileQat"></div><img id="icnDocItemColor5" class="icon fileColor" /><div id="lblDocItemColor5" class="lbl fileColor"></div><div id="lblDocItemMS5" class="lbl fileMS"></div><div id="lblDocItemPrice5" class="lbl filePrice"></div><div id="lblDocItemNup5" class="lbl fileNup"></div><div id="lblDocItemPlex5" class="lbl filePlex"></div>',
        "DocItem6": '<img id="bgDocItem6" /><div id="lblDocItemName6" class="lbl fileName"></div><div id="lblDocItemDate6" class="lbl fileDate"></div><div id="lblDocItemPages6" class="lbl filePages"></div><div id="lblDocItemQat6" class="lbl fileQat"></div><img id="icnDocItemColor6" class="icon fileColor" /><div id="lblDocItemColor6" class="lbl fileColor"></div><div id="lblDocItemMS6" class="lbl fileMS"></div><div id="lblDocItemPrice6" class="lbl filePrice"></div><div id="lblDocItemNup6" class="lbl fileNup"></div><div id="lblDocItemPlex6" class="lbl filePlex"></div>'
    },
    getTemplate: function(data) {
        var obj = Common.getNewElement("div", { id: data.key + data.attrs.Idx, className: "btn" });
        var _template = this.DataSource[data.tmpl + data.attrs.Idx];
        if (_template) {
            //obj.innerHTML = this.convert(_template, data.attrs);
            //ewb의 정규식 대응문제에 따른 임시 대처
            obj.innerHTML = _template;
        } else {
            //write log
        }
        return obj;
    },
    convert: function(tmpl, attr) {
        var _ptrn;
        for (i in attr) {
            try {
                //_ptrn = new RegExp("\\\$\{" + i + "\}","gi");
                //tmpl = tmpl.replace(_ptrn, attr[i])
                eval("tmpl = tmpl.replace(/\{\{" + i + "\}\}/g, attr[i]);");
            } catch (e) {
                KISUtil.debug("convert", "exception");
            }
        }
        return tmpl;
    }
};



/**
 * 문서 리스트용 모듈 
 * 
 * 초기화
 *  매수연산
 *  플래그 초기화
 * 
 * 항목 선택시
 *  플래그 갱신 -> 전체 플래그 재연산
 * 
 * 설정변경후 천이
 *  매수변경
 *  플래그 갱신 -> 전체 플래그 재연산
 */
var DocListManager = function(opt) {
    this.config = {
        key: "BASE",
        countPerPage: 5,
        targetId: "lyr_BASE_Display_Area",
        hasFirstBtn: false
    };
    this.init = function() {
        this.selectedItemIdx = -1;
        this.checkedList = [];
        this.totalSpendPageCount = 0;
    };

    /**
     * 문서리스트용 데이터 설정 
     */
    this.setDataSource = function(_data) {
        KISUtil.debug("setDataSouce", "start");
        try {
            KISUtil.debug("setDataSouce/_data.length", _data.length);
            this.dataSource = _data;
            KISUtil.debug("setDataSouce/dataSource.length", _data.length);
            //팝업으로의 천이시에도 리스트의 페이징을 유지를 위해 선별적으로 페이지 초기화
            if (this.currentPageIdx == null || typeof this.currentPageIdx == "undefined") {
                this.currentPageIdx = 1;
            }
            this.maxPageIdx = Math.ceil(this.dataSource.length / this.config.countPerPage);
            KISUtil.debug("setDataSouce/maxPageIdx", this.maxPageIdx);
        } catch (e) {
            KISUtil.debug("setDataSouce", "exception");
        }
    };

    /**
     * 문서리스트용 데이터 삭제
     */
    this.clearDataSouce = function() {
        this.dataSource = [];
        this.currentPageIdx = 1;
        this.maxPageIdx = 1;
        this.selectedItemIdx = -1;
        this.checkedList = [];
        this.totalSpendPageCount = 0;
    };

    /**
     * 설정변경데이터의 반영처리
     */
    this.updateSelectedDataSource = function(_docData) {
        this.dataSource[this.selectedItemIdx] = _docData;
    };

    this.getAllItems = function() {
        return this.dataSource;
    };

    this.getCheckedList = function() {
        return this.checkedList;
    };
    /**
     * 선택항목 리스트를 취득
     */
    this.getSelectedUUIDs = function() {
        KISUtil.debug("getSelectedUUIDs", "start");
        var result = [];
        for (var i = 0, iMax = this.checkedList.length; i < iMax; i++) {
            result.push(this.dataSource[this.checkedList[i]].UUID);
        }
        return result;
    };
    /**
     * 리스트의 페이징의 최종값을 반환
     */
    this.getTotalPages = function() {
        return this.maxPageIdx;
    };
    /**
     * 리스트의 항목수를 반환 
     */
    this.getAllCount = function() {
        return this.dataSource.length || 0;
    };
    /**
     * 선택된(체크) 항목수를 반환 
     */
    this.getSelectedCount = function() {
        return this.checkedList.length;
    };
    /**
     * 페이지별 표시용 데이터취득
     */
    this.getDataByPageIdx = function() {
        KISUtil.debug("getDataByPageIdx", "start");
        var result = [];
        var offset = this.getStartIdx();
        var tmp;
        //		for(var i=offset,iMax=offset+this.config.countPerPage;i<iMax;i++){
        try {
            for (var i = 0, iMax = this.config.countPerPage; i < iMax; i++) {
                tmp = this.dataSource[offset + i];
                if (tmp)
                    result.push(this.convertDisplayData(i, tmp));
            }
        } catch (e) {
            KISUtil.debug(e);
            throw e;
        }
        return result;
    };
    /**
     * 선택항목수 갱신용 메소드
     * override하여 사용 
     */
    this.updateSelectedFileCount = function() {};
    /**
     * 리스트의 페이지표시 갱신용 메소드
     * override하여 사용 
     */
    this.updateCurrentPage = function() {};
    /**
     * (화면하단의)선택(활성화)항목의 인쇄매수 표시 갱신용 메소드
     * override하여 사용 
     */
    this.updateTextPrnSet = function() {};

    /**
     *  취득한 문서 데이터를 표시용 데이터 변환
     */
    this.convertDisplayData = function(idx, _data) {
        KISUtil.debug("convertDisplayData", "start");
        var result = { text: {}, image: {} };
        result.text["lblDocItemName" + idx] = _data.docName;
        try {
            result.text["lblDocItemDate" + idx] = _data.printDate;
            result.text["lblDocItemPages" + idx] = _data.pageCnt + Msg.UNIT.PAGE; //"쪽";
            result.text["lblDocItemQat" + idx] = _data.printCnt + Msg.UNIT.PRN_SET; //"부";

            var _tmp = glbInfo["color"][_data.colorIdx];
            result.image["icnDocItemColor" + idx] = _tmp.iconOff;
            result.text["lblDocItemColor" + idx] = _tmp.text;

            //_tmp = glbInfo["MS"][_data.mediumSizeIdx];//XML용
            //result.text["lblDocItemMS" + idx] = _tmp.text;//XML용
            _tmp = _data.paperSize; //JSON용
            result.text["lblDocItemMS" + idx] = _tmp; //JSON용

            result.text["lblDocItemPrice" + idx] = Msg.Page.FILELIST.FILE_LIST_BTN_PRICE + " : " + formatWithRemainders(_data.price) + " " + Msg.UNIT.WON; //"원";

            //Nup,Plex추가예정
            result.text["lblDocItemNup" + idx] = (glbConfig.nup) ? _data.Nup + Msg.Page.FILELIST.COMMON_PRINT_NUP_LABEL : "";
            _tmp = (glbConfig.outPlex) ? glbInfo["outPlex"][_data.outPlex] : "";
            result.text["lblDocItemPlex" + idx] = (glbConfig.outPlex) ? _tmp.text : "";
        } catch (e) {
            KISUtil.debug(e);
            throw e;
        }
        return result;
    };

    /**
     * 문서 리스트 초기구성(템플릿을 통한 HTML및 위젯 등록) 
     */
    this.initDisplay = function() {
        KISUtil.debug("initDisplay", "start");
        var fileListButtonAttr = {
                offImg: Img.FILE_LIST_BUTTON_OFF,
                pressImg: Img.FILE_LIST_BUTTON_PRESS,
                onImg: Img.FILE_LIST_BUTTON_ON
            },
            data = {
                tmpl: "DocItem",
                key: "btnDocItem",
                attrs: {
                    Idx: 0
                }
            };

        if (WidgetLib.getWidgetNode(data.key + "0") == null) { //등록되지 않은 경우에만 생성
            this.registListItems(fileListButtonAttr, data);
        }
    };
    /**
     * 리스트의 항목 버튼 생성 및 위젯에 등록 
     */
    this.registListItems = function(fileListButtonAttr, data) {
        KISUtil.debug("registListItems", "start");
        //registWidget		
        for (var i = 0, iMax = this.config.countPerPage; i < iMax; i++) {
            try {
                data.attrs.Idx = i;
                fileListButtonAttr.targetImgId = "bgDocItem" + i;
                //Template를 이용한 HTML구성
                var btnElement = TemplateManager.getTemplate(data);
                document.getElementById(this.config.targetId).appendChild(btnElement);
                WidgetLib.registerButtonWidget(btnElement, WidgetLib.ButtonType.TOGGLE, fileListButtonAttr); // data[i].Id
            } catch (e) {
                KISUtil.debug("registListItems", "error");
            }
        }
    };

    /**
     * 리스트의 현재 페이지의 시작 인덱스를 반환 
     */
    this.getStartIdx = function() {
        KISUtil.debug("getStartIdx", "start");
        return (this.currentPageIdx - 1) * this.config.countPerPage;
    };

    /**
     * 선택(Check)문서상세정보리스트(인쇄용)취득 
     */
    this.getCheckedDocInfo = function() {
        KISUtil.debug("getCheckedDocInfo", "start");
        var result = [];
        var tmp;
        var _min = this.getStartIdx();
        var _max = _min + this.config.countPerPage - 1;
        for (var i = 0, iMax = this.checkedList.length; i < iMax; i++) {
            tmp = this.checkedList[i];
            if (tmp >= _min && tmp <= _max) {
                result.push(this.dataSource[tmp]);
            }
        }
        return result;
    };

    /**
     * 체크항목 리스트를 취득
     */
    this.getCheckedItems = function() {
        KISUtil.debug("getCheckedItems", "start");
        var result = [];
        for (var i = 0, iMax = this.checkedList.length; i < iMax; i++) {
            result.push(this.dataSource[this.checkedList[i]]);
        }
        return result;
    };
    this.setCheckedItems = function(_lst) {
        this.checkedList = _lst;
    };

    /**
     * 선택(SELECT)문서정보(설정변경용)취득 
     */
    this.getSelectedDocInfo = function() {
        KISUtil.debug("getSelectedDocInfo", "start");
        var result = { success: false, doc: {} };
        if (this.selectedItemIdx > -1) {
            result.doc = this.dataSource[this.selectedItemIdx];
            result.success = true;
        }
        return result;
    };

    /**
     * 문서리스트 연관버튼(리스트 외) 상태갱신 
     * TODO:밖으로 빼야할듯
     */
    this.updateBtnStatus = function() {
        //선택개수 표시갱신
        this.updateSelectedFileCount();
        this.updateCurrentPage();
        //전체 개수!=선택수 true
        Common.setObjectEnable("btn_FL_SelectAll", this.dataSource.length > 0);
        document.getElementById("btn_FL_SelectAll").className = (this.dataSource.length > 0) ? "btn" : "btn disabled";

        WidgetLib.setWidgetStatus("btn_FL_SelectAll", { on: (this.checkedList.length == this.dataSource.length) });

        //선택수>0
        Common.setObjectEnable("btn_FL_DeleteFile", this.checkedList.length > 0);
        //버튼 라벨상태변경
        var lbl = document.getElementById("lbl_FL_DeleteFile");
        lbl.className = (this.checkedList.length > 0) ? "lbl" : "lbl disabled";
        FileListPage.cssChange();

        //선택문서가 존재하고 모두가 인쇄가능한경우
        Common.setObjectEnable("btn_FL_Print", (this.checkedList.length > 0));
        //버튼 라벨상태변경
        var lbl = document.getElementById("lbl_FL_Print");
        lbl.className = (this.checkedList.length > 0) ? "lbl" : "lbl disabled";

        //pageIdx>0
        Common.setObjectEnable("btn_FL_pageUp", this.currentPageIdx > 1);

        //pageIdx<maxPageIdx
        Common.setObjectEnable("btn_FL_pageDown", this.currentPageIdx < this.maxPageIdx);

        if (this.config.hasFirstBtn) {
            //pageIdx>0
            Common.setObjectEnable("btn_FL_pageFirst", this.currentPageIdx > 1);

            //pageIdx<maxPageIdx
            Common.setObjectEnable("btn_FL_pageLast", this.currentPageIdx < this.maxPageIdx);
        }

        //true
        Common.setObjectEnable("btn_FL_Refresh", true);
    };
    /**
     * 
     * 
     * 
     * 
     * [[프린트버튼]]/하드키도
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     * 
     * [데이터수정] - 없음
     * 
     * [동작]
     * !Flag를 갱신하여 인쇄 가능여부를 확인
     * 인쇄 RUN
     * 
     * 
     * [[전체프린트버튼]]
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     * 
     * [데이터수정] - 없음
     * 이동할 페이지 인덱스 비교(최대 최소) OK?
     * 페이지 인덱스 수정
     * 
     * [동작]
     * 인쇄 RUN(조건확인? 무조건?)
     * 
     * 
     * [[액션 공통 동작]의 적용범위]
     * 항목버튼*
     * 페이징 버튼*
     * 전체선택 버튼*
     * 프린트버튼
     * 전체프린트버튼(확인필요)
     * 페이지 천이간
     * 하드키(시작)?
     * 
     * [대상외]
     * 새로고침 / 어차피 다시 가져오므로
     * 삭제 / 어차피 삭제되므로
     */

    /**
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     */

    /**
     * [[항목 선택/해제]]
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     * 
     * [데이터 수정]
     * 선택상태가
     * 미선택이면
     * 체크 + 선택 + InvalidFlag를 하나로 통합?
     * 인덱스 + 키 
     * 
     * -체크리스트에 추가
     * -선택인덱스에 입력
     * -소요매수 갱신(추가)
     * 
     * 선택이면
     * -체크리스트에서 삭제
     *  선택인덱스에 있는경우
     *  -선택인덱스에서도 삭제
     * -소요매수 갱신(삭제)
     * 
     * [표시갱신]
     * 현재 페이지의  리스트정보 취득
     * 현재 페이지의 선택정보 취득
     * 
     * 순차로 이동하며 
     * 매수와 !Flag를 갱신(항상)
     * ON이미지 및 상태 갱신
     * 기타 버튼의 상태갱신
     */
    this.selectItem = function(idx) {
        KISUtil.debug("selectItem", "start");
        try {
            var offset = this.getStartIdx();
            var currentIdx = offset + idx;
            var _idx = Common.indexOf(this.checkedList, currentIdx);
            var _key = "bgDocItem";

            var _selectedData = this.dataSource[currentIdx];
            //선택
            if (_idx == -1) {
                //insert
                this.selectedItemIdx = currentIdx; //selectedItem
                this.checkedList.push(currentIdx); //checkedList
            }
            //해제
            else {
                //remove
                this.selectedItemIdx = -1;
                this.checkedList.splice(_idx, 1);
            }
            this.refresh();
        } catch (e) {
            //console.log(e);
        }
    };
    this.updateDisplayListItems = function(flgUpdateForce) {
        try {
            // [표시갱신]
            // 현재 페이지의  리스트정보 취득
            var pageDataList = this.getDataByPageIdx(this.currentPageIdx); //get Data For Display
            // 현재 페이지의 선택정보 취득
            //console.log(this.checkedList);
            var _btnIdKey = "btnDocItem";
            var _btnId, _item, _attr, _prevStatus, _status, _btnObj;
            var _idx = this.getStartIdx();
            //(this.currentPageIdx * this.config.countPerPage) + this.selectedItemIdx
            // 순차로 이동하며
            for (var i = 0, iMax = this.config.countPerPage; i < iMax; i++, _idx++) {
                _btnId = _btnIdKey + i;
                tmp = pageDataList[i];
                if (tmp) {
                    _btnObj = document.getElementById(_btnId);
                    //_btnObj.style.visibility = "hidden";
                    //기본정보 갱신(선택적으로?)
                    if (flgUpdateForce) this.updateDisplayListItem(tmp);
                    // 매수와 !Flag를 갱신(항상)
                    _status = (Common.indexOf(this.checkedList, _idx) > -1);

                    _attr = WidgetLib.getWidgetAttr(_btnId);
                    /*if(_idx==this.selectedItemIdx){
                    	if(_attr.onImg != Img.FILE_LIST_BUTTON_SELECTED){
                    		WidgetLib.setWidgetAttr(_btnId, {onImg:Img.FILE_LIST_BUTTON_SELECTED});
                    	}
                    }
                    else{
                    	if(_attr.onImg != Img.FILE_LIST_BUTTON_ON){
                    		WidgetLib.setWidgetAttr(_btnId, {onImg:Img.FILE_LIST_BUTTON_ON});
                    	}
                    }
                    _prevStatus = WidgetLib.getWidgetStatus(_btnId);
                    if(_prevStatus.on != _status){
                    	WidgetLib.setWidgetStatus(_btnId, {on:_status});
                    }
                    _btnObj.style.visibility = "visible";*/
                    WidgetLib.setWidgetStatus(_btnId, { on: _status });
                    Common.changeVisibility(_btnId, "block");
                } else {
                    //clear and hide
                    Common.changeVisibility(_btnId, "none");
                }

            }
        } catch (e) {
            KISUtil.debug(e);
        }
    };

    this.updateDisplayListItem = function(_data) {
        for (var img in _data.image) {
            Common.setImage(img, _data.image[img]);
        }
        for (var t in _data.text) {
            Common.setText(t, _data.text[t]);
        }
    };
    /**
     * [[전체선택/해제]]
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     * 
     * [데이터수정]
     * 체크리스트의 개수가 데이터의 개수와 같은경우
     * 해제
     * 체크리스트를 비움 
     * 선택인덱스를 비움
     * 
     * 다른경우
     * 선택
     * 체크리스트를 비움 
     * 선택인덱스를 비움
     * 
     * 체크리스트를 순차적으로 채움 
     * 
     * [표시갱신]
     * 현재 페이지의  리스트정보 취득
     * 현재 페이지의 선택정보 취득
     * 
     * 순차로 이동하며 
     * 매수와 !Flag를 갱신(항상)
     * ON이미지 및 상태 갱신
     * 기타 버튼의 상태갱신 
     */
    this.selectAllItems = function() {
        KISUtil.debug("selectAllItems", "start");
        try {
            var _flag = (this.dataSource.length == this.checkedList.length);
            var offset = this.getStartIdx();

            this.selectedItemIdx = -1;
            this.checkedList = [];

            //전체선택
            if (!_flag) {
                //순서가 중요하지않으므로 기존 데이터를 삭제후 추가
                //체크리스트를 순차적으로 채움 
                for (var i = 0, iMax = this.dataSource.length; i < iMax; i++) {
                    this.checkedList.push(i);
                }
            }
            //표시갱신
            this.refresh();
        } catch (e) {
            //console.log(e);
            KISUtil.debug("selectAllItems", "exception");
        }
    };


    /**
     * [[삭제]]
     * [액션공통동작-생략]
     * 
     * [표시갱신]
     * 현재 페이지의  리스트정보 취득
     * 현재 페이지의 선택정보 취득
     * 
     * 순차로 이동하며 
     * 매수와 !Flag를 갱신(항상)
     * ON이미지 및 상태 갱신
     * 기타 버튼의 상태갱신
     * 
     * 선택 항목을 삭제
     * (매니저가 관리중인)선택된 항목의 개수를 확인후 
     * 개수가 1개 이상인경우 팝업을 
     * 아닌경우 invalid를 출력
     */
    this.deleteItems = function() {
        KISUtil.debug("deleteItems", "start");
        var result = false;
        if (this.checkedList.length > 0) {
            //[데이터수정]
            this._eraseList(this.checkedList);
            //체크리스트를 비움
            this.checkedList = [];
            //선택인덱스를 비움
            this.selectedItemIdx = -1;
            //최종페이지 재연산
            this.maxPageIdx = Math.ceil(this.dataSource.length / this.config.countPerPage);
            //현재페이지 보정
            if (this.currentPageIdx > this.maxPageIdx) {
                this.currentPageIdx = this.maxPageIdx;
            }
            result = true;
        }
        return result;
    };

    /**
     * 선택항목 삭제
     */
    this._eraseList = function(lst) {
        KISUtil.debug("_eraseList", "start");
        //체크리스트의 항목을 값기준 역순으로 정렬
        var _lst = lst.sort(function(a, b) { return b - a; });
        for (var i = 0, iMax = _lst.length; i < iMax; i++) {
            //데이터소스에서 체크된항목을 제거
            this.dataSource.splice(_lst[i], 1);
        }
    };


    /**
     * [[페이징]]
     * [액션 공통 동작]
     * 인쇄매수 변경되었을 시 / 반영
     * 소요매수 재연산
     * 
     * [데이터수정] - 없음
     * 이동할 페이지 인덱스 비교(최대 최소) OK?
     * 페이지 인덱스 수정
     * 
     * [표시갱신]
     * 현재 페이지의  리스트정보 취득
     * 현재 페이지의 선택정보 취득
     * 
     * 순차로 이동하며 리스트 정보를 수정(페이지 전환시에만)
     * 매수와 !Flag를 갱신(항상)
     * ON이미지 및 상태 갱신
     * 기타 버튼의 상태갱신
     */

    /**
     * 첫 페이지로 이동 
     */
    this.goFirstPage = function() {
        if (this.currentPageIdx > 1) {
            this.currentPageIdx = 1;
            this.refresh(true);
        } else {
            KISUtil.debug("DocListManager/goFirstPage/currentPageIdx", this.currentPageIdx);
        }
    };
    /**
     * 이전 페이지로 이동 
     */
    this.goPrevPage = function() {
        if (this.currentPageIdx > 1) {
            this.currentPageIdx--;
            this.refresh(true);
        } else {
            KISUtil.debug("DocListManager/goPrevPage/currentPageIdx", this.currentPageIdx);
        }
    };
    /**
     * 다음 페이지로 이동 
     */
    this.goNextPage = function() {
        if (this.currentPageIdx < this.maxPageIdx) {
            this.currentPageIdx++;
            this.refresh(true);
        } else {
            KISUtil.debug("DocListManager/goNextPage/currentPageIdx", this.currentPageIdx);
        }
    };
    /**
     * 마지막 페이지로 이동 
     */
    this.goLastPage = function() {
        if (this.currentPageIdx < this.maxPageIdx) {
            this.currentPageIdx = this.maxPageIdx;
            this.refresh(true);
        } else {
            KISUtil.debug("DocListManager/goLastPage/currentPageIdx", this.currentPageIdx);
        }
    };

    /**
     * 
     */
    this.refresh = function(flgUpdateForce) {
        //표시갱신
        this.updateDisplayListItems(flgUpdateForce); //TODO:시간나면 분리하기 init과 update
        this.updateBtnStatus();
    };

    Extend(this.config, opt);
    this.init();
};

Date.prototype.toString = function() {
    switch (arguments.length) {
        case 1:
            var format = arguments[0];
            switch (typeof format) {
                case "string":
                    var result = format;
                    var _arg0 = this.getFullYear().toString();
                    var _arg1 = (this.getMonth() + 1).toString(); //0-11
                    var _arg2 = this.getDate().toString();
                    var _arg3 = this.getHours().toString();
                    var _arg4 = this.getMinutes().toString();
                    var _arg5 = this.getSeconds().toString();

                    if (_arg1.length == 1) _arg1 = "0" + _arg1;
                    if (_arg2.length == 1) _arg2 = "0" + _arg2;
                    if (_arg3.length == 1) _arg3 = "0" + _arg3;
                    if (_arg4.length == 1) _arg4 = "0" + _arg4;
                    if (_arg5.length == 1) _arg5 = "0" + _arg5;

                    result = result.replace(/yyyy/gi, _arg0)
                        .replace(/MM/gi, _arg1)
                        .replace(/dd/gi, _arg2)
                        .replace(/HH/gi, _arg3)
                        .replace(/mm/gi, _arg4)
                        .replace(/ss/gi, _arg5);
                    return result;
                case "object":
                    break;
                default:
                    break;
            }
            break;
        default:
            this.__proto__.toString(arguments);
            break;

    }
};

/**
 * 子ノードを削除する。
 * @param id 親ノードのID
 */
function removeChildObj(id) {
    var obj = document.getElementById(id);
    if (obj) obj.innerHTML = "";
}

/**
 *  deepCopy method
 */
var extendDeep = function(parent, child) {
    var toStr = Object.prototype.toString,
        astr = "[object Array]";

    child = child || {};

    for (var j in parent) {
        if (parent.hasOwnProperty(j)) {
            if (parent[j] == null & child[j] == undefined) {
                child[j] = null;
            } else if (typeof parent[j] === "object") {
                child[j] = (toStr.call(parent[j]) === astr) ? [] : {};
                extendDeep(parent[j], child[j]);
            } else {
                child[j] = parent[j];
            }
        } else {
            //pass
        }
    }
    return child;
};

/**
 * 文書の更新日時をYYYY/MM/DD　HH:MM:SSの形式で変える
 * @param {string} str 文書の更新日時
 * @return {string} dateStr 文書の更新日時（YYYY/MM/DD　HH:MM:SSの形式）
 */
function getDateString(str) {
    //console.log("getDateString");
    if (!str) {
        return;
    }

    var dateStr = str.replace(/-/g, '/');

    var dateEndPoint = dateStr.indexOf('T');
    var ymdStr = dateStr.substring(0, dateEndPoint);

    var timeEndPoint = dateStr.indexOf('+');
    var timeStr = dateStr.substring(dateEndPoint + 1, timeEndPoint);

    return ymdStr + " " + timeStr;
}



function retrieveGETqs() {
    var result = {},
        i, pos, key, val;
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (i = 0; i < parms.length; i++) {
        pos = parms[i].indexOf('=');
        if (pos > 0) {
            key = parms[i].substring(0, pos);
            //val = parms[i].substring(pos + 1);
            val = unescape(parms[i].substring(pos + 1));
            result[key] = val;
        }
    }
    return result;
}

/**
 * 암호화 처리 모듈 (Hash)
 * @param {string} str 암호화 처리할 인수값
 * @return {string} sha256digest 암호화된 Hexa값(SHA-256용)
 */
function SecureManager_Hash(str) {
    var shaObj = new jsSHA(str, "ASCII");
    var sha256digest = shaObj.getHash("SHA-256", "HEX"); //헥사값으로 변환
    return sha256digest;
}

function xrsReOrganizeKey(keyStr) { //AES 암호화에 사용할 Key를 추출하는 루틴
    var len = 32;
    var key1 = new Array(len); //Key1 : AES 암호화에 사용할 Key
    var xrsKey = new Array(len);
    //var tmKey1 = decodeBase64(keyStr);
    var tmKey1 = atob(keyStr);
    //KISUtil.debug("tmKey1", getCode(tmKey1));
    if (tmKey1 == null || tmKey1.Length == (len + 40)) { //원하는 키 길이가 아니면 return
        return;
    };

    BlockCopy(tmKey1, 35, xrsKey, 0, xrsKey.length);
    //KISUtil.debug("xrsKey", getCode(xrsKey));

    for (var i = 0; i < len; i++) {
        key1[i] = tmKey1.charCodeAt(i) ^ xrsKey[i].charCodeAt(0);
        //KISUtil.debug(i, tmKey1.charCodeAt(i)+" ^ "+xrsKey[i].charCodeAt(0) + " = " + key1[i]);
    };
    return key1;

    function BlockCopy(src, srcOffset, tar, tarOffset, leng) {
        //console.log(tar);
        var i = srcOffset,
            k = tarOffset;
        for (i = 0; i < leng; i++) {
            tar[tarOffset + i] = src[srcOffset + i];
        }
    }

    function getCode(arr) {
        var lst = [];
        for (var i = 0; i < arr.length; i++) {
            lst[i] = arr[i].charCodeAt(0);
        }
        return lst.join();
    }
}


/**
 * 親Windowのスクリプトをを実行
 */
function excuteToParent(funcName, param) {
    if (typeof funcName != "string") return;
    //if(flg_Dummy_Beep) return param;
    var func;
    var nameArr = funcName.split(".");
    func = window.parent;
    for (var i = 0; i < nameArr.length - 1; i++) {
        func = func[nameArr[i]];
        if (typeof func == "undefined") {
            return null;
        }
    }
    //return func[nameArr[nameArr.length-1]].apply(this,param);
    //func.removeService();
    //return (eval("func."+nameArr[nameArr.length-1]))(param);
    return func[nameArr[nameArr.length - 1]].apply(func, param);
}

function createXMLHttpRequest() {
    var obj;

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            obj = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            obj = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else {
        return null;
    }
    return obj;
}

var ServiceManager = {
    targetFrameId: "",
    targetFrameEle: null,
    currentService: "",
    /**
     * 서비스 매니저 초기화 
     */
    init: function(param) {
        if (param.targetFrameId && param.targetFrameLyrId) {
            this.targetFrameId = param.targetFrameId;
            this.targetFrameLyrId = param.targetFrameLyrId;
            this.targetFrameEle = document.getElementById(this.targetFrameId);
            this.targetFrameEle.seamless = true;
        } else {
            //TODO: throw exception();
        }
    },
    /**
     * 서비스 호출 
     */
    callService: function(service, arg) {
        //파라미터 점검
        //만약 현재 다른 서비스 사용중인경우 에러를 날려줌 
        if (!this.currentService && service) {
            //iframe모드일때
            if (glbConfig.SERVICE_CALL_MODE) {
                this.currentService = service.name;
                //Note: jQuery code 배제
                //$("#"+this.targetFrameId).on("load",_onIframeLoadEvent).attr("src",service.url).prev().show();
                //$("#"+this.targetFrameLyrId).show();
                //$("#"+this.targetFrameId).contents().on("load",_onIframeLoadEvent);

                var _frame = document.getElementById(this.targetFrameId);
                //setEvent(_frame, "load", _onIframeLoadEvent); //trigger는 서비스에서 하도록 변경
                //setEvent((_frame.contentWindow.document || _frame.contentDocument), "load", _onIframeLoadEvent);

                _frame.setAttribute("src", service.url);
                _frame.previousSibling.previousSibling.style.display = "block";

                var _lyr = document.getElementById(this.targetFrameLyrId);
                _lyr.style.display = "block";
            } else {
                var loc = "changeDisplay:URL:" + service.url.replace(/http:/, "http-v5:") + ";DISP:0";
                BrowserExt.SetScreenChange(loc);
            }
            if (arg && arg.successFunc) {
                arg.successFunc.apply(this);
            }
        } else {
            //TODO: throw exception();
            if (arg && arg.errorFunc) {
                arg.errorFunc.apply(this);
            }
        }
        if (arg && arg.doneFunc) {
            arg.doneFunc.apply(this);
        }

        function _onIframeLoadEvent() {
            //console.log("readyToDisplay");
            //console.log(this);
            //$(this).show().off("load").prev().hide();
            this.previousSibling.previousSibling.style.display = "none";
            releaseEvent(this, "load", _onIframeLoadEvent);
            this.style.display = "block";
        }

        function setEvent(_obj, _eventName, _event) {
            if (_obj.attachEvent) _obj.attachEvent(_eventName, _event);
            else if (_obj.addEventListener) _obj.addEventListener(_eventName, _event, false);
        }

        function releaseEvent(_obj, _eventName, _event) {
            if (_obj.detachEvent) _obj.detachEvent(_eventName, _event);
            else if (_obj.removeEventListener) _obj.addEventListener(_eventName, _event, false);
        }
    },
    displayIframe: function() {
        this.targetFrameEle.previousSibling.previousSibling.style.display = "none";
        this.targetFrameEle.style.display = "block";
    },
    /**
     * 서비스를 종료함 
     */
    removeService: function() {
        if (this.currentService) {
            Common.changeVisibility(this.targetFrameLyrId, "none");
            //this.targetFrameEle.setAttrubute("src","");
            this.targetFrameEle.removeAttribute("src");
            this.targetFrameEle.style.display = "none";
            //$("#"+this.targetFrameLyrId).hide();
            //$("#"+this.targetFrameId).attr("src","").hide();
            this.currentService = "";
        }
    },
    excuteScript: function(func) {
        if (flg_Dummy_Beep && this.targetFrameEle) {
            //프래임 내 페이지에서 실행하는 방법
            //with(document.getElementsByTagName("iframe")[0].contentWindow){
            //PageManager.changePage(PrintingPopup , PageManager.type.NORMAL);
            //}
            this.targetFrameEle.contentWindow.eval.apply(this.targetFrameEle.contentWindow, func);
        }
    },

    /**
     * 서비스를 종료함 
     */
    refreshService: function() {
        if (this.currentService) {
            var _frame = document.getElementById(this.targetFrameId);
            _frame.previousSibling.previousSibling.style.display = "block";
            _frame.contentWindow.location.reload();
        }
    },

    /*function showIframe(){
    	//console.log("showIframe");
    	$("#iframe4onetouch").css({left:0}).parent().show();
    	glbInfo.isOnetouchMode=true;
    }
    function hideIframe(){
    	//console.log("hideIframe");
    	$("#iframe4onetouch").unbind("load").removeAttr("src").css({left:800}).parent().hide();
    	glbInfo.isOnetouchMode=false;
    }*/
};

function formatWithRemainders(value) {
    var original = value;
    var isNegative = value < 0;
    var absValue = Math.abs(value);
    var floorValue = Math.floor(absValue);
    var v = floorValue;
    if (v == 0)
        return "0";
    var formatted = "";
    while (v > 0) {
        if (formatted.length > 0) {
            formatted = "," + formatted;
        }
        var remainder = (v % 1000) + "";
        v = Math.floor(v / 1000);
        if (v > 0) {
            for (var i = remainder.length; i < 3; i++) {
                remainder = "0" + remainder;
            }
        }
        formatted = remainder + formatted;
    }
    if (absValue !== floorValue) {
        formatted += "." + original.toString().split('.')[1];
    }
    if (isNegative) {
        formatted = "-" + formatted;
    }
    return formatted;
}

//2016.09.01 FXKIS CHONE  프린트 환불 처리
var JobMonitor = (function() {
    var EVENT_NAME = "GetJob",
        _jobFound,
        _jobInfo,
        _poolingCnt,
        _poolingCntBackup = 0,
        _poolingTerm = 400,
        _isEventAttached,
        _successCallback,
        _errorCallback,
        _timeoutCallback,
        _cancelCallback,
        _foundCallback,
        _eventOrigin;

    return {
        init: function(term) {
            _init(term);
        },
        startMonitor: function(jobObj, cnt) {
            _startMonitor(jobObj, cnt);
        },
        stopMonitor: function(jobObj) {
            _stopMonitor(jobObj);
        },
        getJobInfo: function(uuid) {
            _doPooling({ uuid: uuid });
        }
    };

    function _init(term) {
        _jobFound = false;
        _isEventAttached = false;
        _poolingTerm = term || 400;
        _attachEventHandler();
    }

    function _attachEventHandler() {
        if (!_isEventAttached) {
            _isEventAttached = true;
            _eventOrigin = SSMILib.listener;
            SSMILib.listener = function(event, result, obj) {
                if (!_onSSMIEvent(event, result, obj)) {
                    _eventOrigin(event, result, obj);
                }
            };
        }
    }

    function _dettachEventHandler() {
        if (_isEventAttached) {
            _isEventAttached = false;
            SSMILib.listener = _eventOrigin;
        }
    }

    function _onSSMIEvent(event, result, obj) {
        var objCnt = 1;
        if (event == EVENT_NAME) {
            if (result) {
                _poolingCnt = _poolingCntBackup;
                _jobFound = true;
                if (typeof obj.length == "number") {
                    objCnt = obj.length;
                }
                for (var i = 0; i < objCnt; i++) {
                    var tmpObj = (objCnt == 1) ? obj : obj[i];
                    switch (tmpObj.Status) {
                        case "canceled":
                        case "canceledByUser":
                        case "canceledBySystem":
                            // 복합기에서 Print시 임의의 상태가 올라오는 것으로 판단되어 Job의 취소 이외에는 환불 동작 안함.
                            //case "paused":
                            //case "unknown":
                            //case "pending":
                            //case "terminating":
                            _stopMonitor(obj);
                            LogLib.write("[CS] IPrint Print job : " + tmpObj.JobID + ", " + tmpObj.Status, LogLib.LEVEL.WRN);
                            //2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
                            //Common.doPrintRefundReq(tmpObj.Status);
                            Common.displayPrintRefundPopup(tmpObj.Status);
                            return;
                        default:
                            break;
                    }
                }

                setTimeout("JobMonitor.getJobInfo()", _poolingTerm);

            } else { //잡 미발견
                if (_jobFound) { //이전에 잡이 있었고 다시 잡 모니터링시 잡이 없는 경우 - 잡이 다 실시된 걸로 판단하여 잡 모니터링 중지
                    LogLib.write("Job Monitoring Completed", LogLib.LEVEL.WRN);
                    _successCallback();
                    _stopMonitor();
                    return;
                }

                _poolingCnt--;
                setTimeout("JobMonitor.getJobInfo()", _poolingTerm);
            }
        } else {
            return false;
        }
    }

    function _startMonitor(jobObj, _cnt) {
        _jobFound = false;
        _poolingCnt = _cnt || 10;
        _poolingCntBackup = _cnt || 10;
        _successCallback = jobObj.successCallback;
        _errorCallback = jobObj.errorCallback;
        _cancelCallback = jobObj.cancelCallback;

        _doPooling();
    }

    function _stopMonitor() {
        _jobFound = false;
        _successCallback = null;
        _errorCallback = null;
        _cancelCallback = null;
    }

    function _doPooling() {
        if (_poolingCnt > 0) {
            if (!_jobInfo) {
                _jobInfo = new SSMILib.JobInfo(null, true);
                _jobInfo.listType = SSMILib.JOBLISTTYPE.ACTIVE;
                _jobInfo.sortKeys = [{ element: SSMILib.JOBDETAIL.STARTTIME, order: SSMILib.SORTORDER.ASC }];
            }
            SSMILib.GetJob(_jobInfo);
        } else {
            LogLib.write("doPooing _poolingCnt 0", LogLib.LEVEL.WRN);
            if (_errorCallback) _errorCallback();
            _stopMonitor();
        }
    }
})();