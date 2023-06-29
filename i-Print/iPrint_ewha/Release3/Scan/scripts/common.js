/**
 * @fileoverview CS기본동작과 공통기능을 정의하는 파일
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var Common = {};

Common.onLoadBody = function() {
    ContentsLib.init();
    ContentsLib.contentsIcon = "./info/smallicon.png";
    ContentsLib.setListener(Common.onLoadEvent);
    JFLib.setEventListener(MainPage.EventHandler);

    LogLib.setLogLevel(LogLib.LEVEL.INF);
    BrowserExt.EnablePrivilege();

    KISUtil.initDebug("body");

    if (flg_Dummy_Beep) { //Chrome Dummy용
        glbInfo.lang = "ko";
        p_glbInfo = {};
        glbConfig.chkScanUse = "c9ee2e8b5761ac9d31aa63957ae09422a2077da48bb09d18c72b2fef1b4b9eb1";
        glbConfig.chkScan = "c9ee2e8b5761ac9d31aa63957ae09422a2077da48bb09d18c72b2fef1b4b9eb1";
    } else {
        var p_glbConfig = window.parent["glbConfig"];
        glbConfig.chkScanUse = p_glbConfig.chkScanUse;
        glbConfig.chkScan = p_glbConfig.chkScan;
        glbInfo.lang = p_glbConfig.language[p_glbConfig.langCount];
        glbConfig.chkFaxUse
    }

    switch (glbInfo.lang) {
        case "ko":
        case "en":
        case "ja":
        case "ch":
            Msg = extendDeep(Msg_lang[glbInfo.lang], extendDeep(Msg_default, {}));
            break;
        default:
            Msg = extendDeep(Msg_lang["en"], extendDeep(Msg_default, {}));
            break;
    }

    //조절가능값 설정
    initModel();

    ContentsLib.contentsName = Msg_lang[glbInfo.lang].CommonLbl.title;

    BrowserExt.SetScreenChange("popup:faultAll");

    quoteParentModule();
    LogLib.write("CS Scan --- PRINTER_IP : " + glbConfig.PRINTER_IP, LogLib.LEVEL.INF);

    if (!flg_Dummy_Beep && !SecureManager) {
        BrowserExt.SetScreenChange("");
        return;
    }

    //초기화
    PageManager.init("pageWrapper");

    //잡 모니터 초기화
    JobMonitor.init(glbConfig.GetJob.term);

    //대기 페이지로 전환
    PageManager.changePage(WaitingPage, PageManager.type.NORMAL);

    //슬라이드 메시지 초기화
    MessageManager.init();

    //CS타이틀 영역 표시
    Common.displayTitleArea();

    //정보취득
    SSMILib.GetCustomizeDeviceInfo();

    /**
     * menu CS에 정의된 모듈 및 데이터를 인용
     */
    function quoteParentModule() {
        SecureManager = (!flg_Dummy_Beep) ? window.parent["SecureManager"] : "";
        var p_glbInfo = (!flg_Dummy_Beep) ? window.parent["glbInfo"] : "";
        glbInfo.userId = (!flg_Dummy_Beep) ? p_glbInfo.userId : 'ch';
        glbInfo.userPw = (!flg_Dummy_Beep) ? p_glbInfo.userPw : '1212';
        glbInfo.displayName = (!flg_Dummy_Beep) ? p_glbInfo.displayName : '';
        glbInfo.productCode = (!flg_Dummy_Beep) ? p_glbInfo.productCode : 'TC101049';
        glbInfo.serialNumber = (!flg_Dummy_Beep) ? p_glbInfo.serialNumber : '217574';
        glbConfig.PRINTER_IP = (!flg_Dummy_Beep) ? p_glbConfig.PRINTER_IP : '192.168.200.131';
    }
};

/**
 * 공통 이벤트 처리 메소드
 * 이곳에 정의 되지 않은 경우 각 페이지에서 이벤트가 처리됨
 * @param {event} event
 * @param {string} id
 */
Common.onLoadEvent = function(event, id) {
    switch (event) {
        case "GetCustomizeDeviceInfo":
            if (arguments[1] == true) {
                var obj = arguments[2];
                if (obj.productInformation) {
                    glbDevInfo.serialNo = obj.productInformation.serialNumber;
                    glbDevInfo.productCode = obj.productInformation.productCode;
                }
                if (obj.scannerCapability) {
                    glbDevInfo.scanInfo = obj.scannerCapability;
                }
                if (obj.printerCapability) {
                    glbDevInfo.printInfo = obj.printerCapability;
                    glbDevInfo.isMono = arguments[2].printerCapability.ColorMode == "monochrome";
                }
            } else {
                var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_COMM };
                WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
                return;
            }
            if (glbConfig.chkScanUse != glbConfig.chkScan) {
                var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_COMM };
                WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
            var iframes = window.parent.document.getElementsByTagName("iframe");
            if (iframes.length > 0) {
                excuteToParent("ServiceManager.displayIframe", null);
            }
            PageManager.changePage(MainPage, PageManager.type.NORMAL);
            break;
        case "ScanJobFound":
            break;
        case "ScanJobComplete":
            JobMonitor.stopMonitor({ uuid: glbInfo.scanJobID });
            
            // Scan Job의 매수 확인
            SSMILib.GetChildJobInfo(true, glbInfo.scanJobID, "ScanImageInformation");
            
            //Common.doChargePrice();
            break;
        case "GetChildJobInfo":
            if(arguments[1] == true){
				var jobInfo = arguments[2];
				for(var i = 0; jobInfo.length > i; i++){
					if(jobInfo[i].Sheets){
						glbInfo.ScanImageInformation = jobInfo[i];
						SSMILib.GetChildJobInfo(true, glbInfo.jobId, "ScanImageDetailInformation");
                        Common.doChargePrice();
                        //Common.doCharge(PAYMENT_METHOD.CREDIT);
					}
				}
			}
            break;
        case "ScanJobCancel":
            JobMonitor.stopMonitor({ uuid: glbInfo.scanJobID });
            var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.INTERUPTED_SCAN_JOB };
            WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
            PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            break;
        case "ScanJobError":
            JobMonitor.stopMonitor({ uuid: glbInfo.scanJobID });
            var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_SCAN_JOB };
            WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
            PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            break;
        case "ScanJobTimeout":
            var arg = arguments[2];
            JobMonitor.stopMonitor(arg);
            var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_TIMEOUT };
            WarnPopup._param = { type: "job", title: msg.title, message: msg.message, targetPage: false };
            PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            break;
        case "onbuttonup":
            switch (id) {
                case "btn_serviceSelect":
                    BrowserExt.Beep(0);
                    ConfirmPopup.popupType = "SERVICE_SELECT";
                    ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_SEVICE_SELECT;
                    PageManager.changePage(ConfirmPopup, PageManager.type.MODAL);
                    break;
                case "btn_logout":
                    BrowserExt.Beep(0);
                    ConfirmPopup.popupType = "LOGOUT";
                    ConfirmPopup.msg = Msg.Page.CONFIRM.GUIDE_LOGOUT;
                    PageManager.changePage(ConfirmPopup, PageManager.type.MODAL);
                    break;
            }
        default:
            var currentPage = PageManager.getCurrentPage();
            if (currentPage) {
                currentPage.EventHandler(arguments[0], arguments[1], arguments[2]);
            }
            break;
    }
};

/**
 * Title의 Text와 Icon을 설정
 */
Common.displayTitleArea = function() {
    Common.setImage("icn_title", Img.COMMON.ICN_TITLE);
    Common.setText("txt_title", Msg.CommonLbl.title);
    var obj = { id: "btn_logout", type: WidgetLib.ButtonType.NORMAL, attr: { offImg: Img.UIPARTS.BTN_LOGOUT_OFF, pressImg: Img.UIPARTS.BTN_LOGOUT_PRESS } };
    WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
    obj = { id: "btn_serviceSelect", type: WidgetLib.ButtonType.NORMAL, attr: { offImg: Img.UIPARTS.BTN_SERVICE_SELECT_OFF, pressImg: Img.UIPARTS.BTN_SERVICE_SELECT_PRESS } };
    WidgetLib.registerButtonWidgetById(obj.id, obj.type, obj.attr);
    Common.changeVisibility("btn_logout", "block");
    Common.changeVisibility("btn_serviceSelect", "block");
};

/**
 * 화면에 표시할 유저명을 취득<br>
 * 우선순위<br>
 * 1.정보취득중과 화면표시중에 취득된 유저명<br>
 * 2.1이 아닌 경우, 유저의 RelatedUserID<br>
 * 3.1,2이 아닌 경우, 「일반유저」<br>
 * @return {string} name 화면에 표시할 유저명
 */
Common.getUserName = function() {
    var name = "";
    if (glbInfo.userInfo) {
        if (glbInfo.userInfo.RelatedUserID) {
            name = glbInfo.userInfo.RelatedUserID;
        } else {
            name = "";
        }
    }

    return name;
};

/**
 * 화면에 표시할 유저명의 길이 설정<br>
 * 유저명의 길이가 길경우 표시 폭에 마추어 잘라내기 한다.
 * @return {string} name 화면에 표시할 유저명
 */
Common.getUserDisplayName = function(name) {
    if (name) {
        var byteNum = this.getStringSize(name);
        if (byteNum > glbInfo.userNameLength) {
            name = this.cutStringWidth(name, glbInfo.userNameLength);
        }
    }

    return name;
};

/**
 *풀다운의 HTML을 작성
 * @param {string) _page : 적용될 페이지의 Key
 * @param {string} _key : 풀다운의 Key (각 Element의 ID를 작성해 사용한다.)
 * @param {int} _length : 항목 (항목을 나누어 HTML을 작성)
 * @return Full down HTML Element
 */
Common.createHTMLPulldown = function(_page, _key, _length, _isDouble) {
    var _popup = Common.getNewElement("div", { id: "pul_" + _page + "_" + _key + "_popup", className: "pullPop hide" }),
        _bg = Common.getNewElement("img", { id: "img_" + _page + "_" + _key + "_popup_bg", className: "pullBg" }),
        _body = Common.getNewElement("div", { id: "lst_" + _page + "_" + _key + "_popup" }),
        _list = document.createElement("ul"),
        _btn, _item, _node, _tmp;
    _bg.setAttribute("src", Img.BG["BG_PUL_" + _length] || Img.BG["BG_PUL_5"]);
    _bg.style.top = 0;
    _body.style.zIndex = "100";

    for (var i = 0; i < _length; i++) {
        _item = Common.getNewElement("li", { id: "item" + i });
        _btn = Common.getNewElement("div", { id: "btn_" + _page + "_" + _key + "_menu_" + i, className: "btn" });
        _btn.appendChild(Common.getNewElement("img", { id: "img_" + _page + "_" + _key + "_menu_" + i, className: "bg" })); //bg
        _btn.appendChild(Common.getNewElement("img", { id: "icn_" + _page + "_" + _key + "_menu_" + i, className: "icon" })); //icon

        if (glbInfo.lang == 'en' && (_key == 'inplex' || _key == 'outplex') && (i == 1 || i == 2)) {
            _btn.appendChild(Common.getNewElement("div", { id: "lbl_" + _page + "_" + _key + "_menu_" + i + "_1", className: "lbl" })); //label
            _btn.appendChild(Common.getNewElement("div", { id: "lbl_" + _page + "_" + _key + "_menu_" + i + "_2", className: "lbl" })); //label
        } else {
            _btn.appendChild(Common.getNewElement("div", { id: "lbl_" + _page + "_" + _key + "_menu_" + i, className: "lbl" })); //label
        }
        if (_isDouble) {
            _btn.appendChild(Common.getNewElement("div", { id: "lbl_" + _page + "_" + _key + "_menu_" + i + "_0", className: "lbl1" })); //label
        }

        _item.appendChild(_btn);
        _list.appendChild(_item);
    }
    _body.appendChild(_list);

    _popup.appendChild(_body);
    _popup.appendChild(_bg);

    return _popup;
};

/**
 * List를 입수시 Widget의 Status를 변경
 * @param {Array} list Widget Object Array
 * @param {boolean} flag Enable/Disable
 */
Common.changeStatus = function(list, flag) {
    for (var i = 0, il = list.length; i < il; i++) {
        WidgetLib.setWidgetStatus(list[i], { enable: flag });
    }
};

Common.getWsIp = function() {
    var regex = /^http:\/\/([A-Za-z0-9-]+\.)+[A-Za-z0-9-]{2,4}/;
    var result = regex.exec(glbConfig.DATA.SERVER_URL);
    KISUtil.debug("Common.getWsIp/glbConfig.DATA.SERVER_URL", glbConfig.DATA.SERVER_URL);
    return (result != null) ? result[0].replace("http://", "") : "";
};

/**************************************************************** 共通 ****************************************************************/
/**
 * 화면 Object의 문자열 표시 처리
 * @param {string} id :Object의 ID
 * @param {string} string :표시할 문자열
 */
Common.setText = function(id, str) {
    var textNode;
    if (typeof id === String || typeof id === "string") {
        textNode = document.getElementById(id);
        if (!textNode || str == undefined) {
            alert("id=" + id + " : string=" + str);
            return;
        }
    } else if (typeof id === Object) {
        textNode = id;
    } else {
        return;
    }

    switch (textNode.nodeName.toLowerCase()) {
        case "div":
        case "textarea":
        case "option":
        case "span":
        case "p":
            while (textNode.firstChild) {
                textNode.removeChild(textNode.firstChild);
            }
            if (typeof str == "string") {
                textNode.innerHTML = (str == "") ? "&nbsp;" : str;
            } else if (typeof str == "number") {
                textNode.innerHTML = str;
            } else if (str instanceof Array) {
                var tmp;
                for (var i = 0, il = str.length; i < il; i++) {
                    tmp = document.createElement("p");
                    tmp.innerHTML = (str[i] == "") ? "&nbsp;" : str[i];
                    textNode.appendChild(tmp);
                }
            } else {
                KISUtil.debug("Common.setText:", id + "/" + str);
            }
            break;
        case "input":
            if (textNode["type"] === "image") {
                textNode.appendChild(document.createTextNode((str == "") ? "&nbsp;" : str));
            } else {
                textNode.setAttribute("value", str);
            }
            break;
        default:
            KISUtil.debug("Common.setText:", id + "/" + str);
            break;
    }
};

/**
 * 화면 Object의 Image표시 처리
 * @param {string} id : Object ID
 * @param {string} src : Image의 Hendle
 */
Common.setImage = function(id, src) {
    var imgNode = document.getElementById(id);
    if (!imgNode || !src || imgNode.src == src) {
        alert("id=" + id + " : src=" + src);
        return;
    }
    imgNode.setAttribute("src", src);
};

/**
 * Text를 취득 한다.
 * @param {string} id : Text를 취득하는 Object ID
 * @return {string} : 지정된 ID의 Text
 */
Common.getText = function(id) {
    var obj = document.getElementById(id);
    if (!obj || !id) {
        return;
    }
    return obj.firstChild ? obj.firstChild.nodeValue : obj.innerText;
};

/**
 * 화면 Object의 Text Color변경 처리<br>
 * Off의 경우, #000000지정
 * disable의 경우, #ADAAAD지정
 * @param {string} id : Object의 ID
 * @param {string} color : Text의 Color
 */
Common.setTextColor = function(id, color) {
    if (!id || !color) {
        return;
    }
    var obj = document.getElementById(id);
    if (obj) {
        obj.style.color = color;
    }
};

/**
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} margin : Text의 margin 위치 (left/right/top/bottom)
 * @param {string} margin : Text의 margin 위치값
 */
Common.setMargin = function(id, margin, arg) {
    if (!id || !margin) {
        return;
    }
    var obj = document.getElementById(id);
    if (obj) {
        switch (margin) {
            case 'marginLeft':
                obj.style.marginLeft = arg;
                break;
            case 'marginRight':
                obj.style.marginRight = arg;
                break;
            case 'marginTop':
                obj.style.marginTop = arg;
                break;
            case 'marginBottom':
                obj.style.marginBottom = arg;
                break;
            default:
                break;
        }
    }
};

/**
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} margin : Text의 margin 위치 (left/right/top/bottom)
 * @param {string} margin : Text의 margin 위치값
 */
Common.setPosition = function(id, margin, arg) {
    if (!id || !margin) {
        return;
    }
    var obj = document.getElementById(id);
    if (obj) {
        switch (margin) {
            case 'left':
                obj.style.left = arg;
                break;
            case 'right':
                obj.style.right = arg;
                break;
            case 'top':
                obj.style.top = arg;
                break;
            case 'bottom':
                obj.style.bottom = arg;
                break;
            case 'width':
                obj.style.width = arg;
                break;
            case 'height':
                obj.style.height = arg;
                break;
            default:
                break;
        }
    }
};

/**
 * 화면 Object의 Text css margin변경 처리<br>
 * @param {string} id : Object의 ID
 * @param {string} indent : Text의 indent 위치값
 */
Common.setIndent = function(id, indent) {
    if (!id || !indent) {
        return;
    }
    var obj = document.getElementById(id);
    obj.style.textIndent = indent;
};

/**
 * 용지 사이즈명을 변경 처리
 * @param {string} paperSize : 용지 사이즈
 * @param {string} beforeName : 변경전 용지명
 * @param {string} AfterName : 변경후 용지명
 */
Common.paperSizeNameReplace = function(paperSize, beforeName, AfterName) {
    return paperSize.replace(beforeName, AfterName);
}

/**
 * Object의 표시/비표시를 처리
 * @param {string} id : 표시를 변경하는 Object ID
 * @param {string} attr : display를 지정하는 문자열(none, block)
 */
Common.changeVisibility = function(id, attr) {
    var obj = document.getElementById(id);
    if (!id || !attr || !obj) {
        return;
    }
    if (obj.style.display != attr) {
        obj.style.display = attr;
    }
};

/**
 * HTML Element를 작성
 * @param {string} tag : Tag명
 * @param {object} attrs: Teg에 할당된 속성
 * @return 작성된 Tag의 Element
 */
Common.getNewElement = function(tag, attrs) {
    var result = null;
    if (tag) {
        result = document.createElement(tag);

        if (attrs.id) { result.setAttribute("id", attrs.id); }
        if (attrs.className) { result.setAttribute("class", attrs.className); }
    }
    return result;
};

/**
 * Event를 할당한다.（사용되지 않고 있다)
 * @param {string} id : Tag ID
 * @param {string} eventName : Event의 종류
 * @param {event} event : 할당된 Event
 */
Common.setEvent = function(id, eventName, event) {
    var obj = document.getElementById(id);
    if (obj && eventName && event) {
        if (obj.attachEvent) obj.attachEvent(eventName, event);
        else if (obj.addEventListener) obj.addEventListener(eventName, event, false);
    }
};

/**
 * 문자열의 Bytes수를 계산한다.
 * @param {string} str : 문자열
 * @return {int} cnt : 문자열의 Byte수(반각 기준)
 */
Common.getStringSize = function(str) {
    var cnt = 0;
    var c;
    for (var i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        //Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
        //Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
        if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            cnt++;
        } else {
            cnt += 2;
        }
    }
    return cnt;
};

/**
 * 지정된 문자열을 잘라 문자열을 분활 한다.
 * @param {string} str : 문자열
 * @param {int} num : 잘라낼 문자열 Bytes수
 * @return {array} strArray : 분할한 문자열 배열
 */

Common.splitString = function(str, num, cnt) {
    var strArray = [];
    var tmp = [];

    var nowByte = 0;
    var i = 0;
    var c;

    var step = 0;
    while (c = str.charCodeAt(i)) {
        step = this.isEmSizeCharacter(c) ? 2 : 1; //refactoring(문자의 폭을 판단)

        if (nowByte + step < num) { //이하의 내용일 경우
            //문자열을 Copy
            tmp[tmp.length] = str.substr(i++, 1);
            nowByte += step;
        } else if (nowByte + step == num) { //상한에 도달한 경우
            //문자열을 Copy
            tmp[tmp.length] = str.substr(i++, 1);
            nowByte += step;
            //문자열을 격납하고, tmp를 초기화
            strArray[strArray.length] = tmp.join("");
            tmp = [];
            nowByte = 0;
        } else if (nowByte + step > num) { //상한을 초과하는 경우
            //문자열을 격납하고, tmp를 초기화
            strArray[strArray.length] = tmp.join("");
            tmp = [];
            nowByte = 0;

            //문자열을 Copy
            tmp[tmp.length] = str.substr(i++, 1);
            nowByte += step;
        }
    }

    if (tmp.length > 0) {
        strArray[strArray.length] = tmp.join("");
    }
    tmp = null;

    if (cnt && strArray.length < cnt) {
        for (var i = strArray.length; i < cnt; i++) {
            strArray[i] = "";
        }
    }
    return strArray;
};

Common.getIdx = function(id) { return parseInt(id.substring(id.length, id.length - 1)); };

/**
 * 문자의 폭을 판단한다.
 * @param {string} c : 문자열
 * @return {bool} true: 전각, false:반각
 */
Common.isEmSizeCharacter = function(c) {
    var width = true;
    //Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
    //Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
    if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        width = false;
    }
    return width;
};

/**
 * 문자열을 지정된 Bytes수로 자른다
 * @param {string} str : 문자열
 * @param {int} bytes : 잘라낼 Bytes수
 * @return {string} : 지정 Bytes수로 잘라낸 문자열
 */
Common.cutStringWidth = function(str, num) {
    var tmp = [];

    var nowByte = 0;
    var i = 0;
    var c;

    var step = 0;
    while (c = str.charCodeAt(i)) {
        step = this.isEmSizeCharacter(c) ? 2 : 1; //refactoring(문자의 폭을 판단)

        if (nowByte + step <= num) {
            tmp[tmp.length] = str.substr(i++, 1);
            nowByte += step;
        } else {
            break;
        }
    }

    return tmp.join("");
};

/**
 * List에서 Index를 반환 /Lib문제로 Prototype대신 별도의 Function으로 작성
 * @param {Array} collection
 * @param {object} obj
 * @return {int} idx : 대상이 없는 경우는 -1
 */
Common.indexOf = function(collection, obj) {
    var idx = -1;
    if (collection instanceof Array) {
        for (var i = 0, il = collection.length; i < il; i++) {
            if (collection[i] == obj) {
                idx = i;
                break;
            }
        }
    }
    return idx;
};

Common.contains = function(collection, obj) {
    return (this.indexOf(collection, obj) > -1);
};

/**
 * 해당 Element의 CSS Class를 설정
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 해당하는 Class의 이름
 */
Common.setClass = function(id, arg) {
    var obj = document.getElementById(id);
    if (obj) {
        obj.className = arg;
    }
};

Common.getClassList = function(obj) {
    return obj.className.split(" ");
};

Common.setClassList = function(obj, lst) {
    obj.className = lst.join(" ");
};

/**
 * 해당 Element의 CSS Class를 추가
 * @param {string} id : 추가할 Object의 ID
 * @param {string} arg : 추가된 Class의 이름
 */
Common.addClass = function(id, arg) {
    var obj = document.getElementById(id);
    if (obj) {
        if (obj.classList) {
            obj.classList.add(arg);
        } else {
            var lst = Common.getClassList(obj);
            var idx = Common.indexOf(lst, arg);
            if (idx == -1) {
                lst.push(arg);
                Common.setClassList(obj, lst);
            }
        }
    }
};

/**
 * 해당 Element의 CSS Class를 제거
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : 제거된 Class의 이름
 */
Common.removeClass = function(id, arg) {
    var obj = document.getElementById(id);
    if (obj) {
        if (obj.classList) {
            obj.classList.remove(arg);
        } else {
            var lst = Common.getClassList(obj);
            var idx = Common.indexOf(lst, arg);
            while (idx > -1) {
                lst.splice(idx, 1);
                idx = Common.indexOf(lst, arg);
            }
            Common.setClassList(obj, lst);
        }
    }
};

/**
 * 해당 Element의 CSS Class를 Toggle
 * @param {string} id : 해당 Object의 ID
 * @param {string} arg : Toggle된 Class의 이름
 */
Common.toggleClass = function(id, arg) {
    var obj = document.getElementById(id);
    if (obj) {
        obj.classList2.toggle(arg);
    }
};

Common.compareStr = function(strInput, strOutput) {
    var i;
    for (i = strOutput.length, il = 0; i > il; --i) {
        if (strInput[i] == strOutput[i]) {
            break;
        }
    }
    return i + 1;
};

Common.trimByEncodingSize = function(str, size) {
    var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
    var trimedStr = encodedStr.substr(0, size);
    var pattern = /%[^%]?$/;
    var regexResult = trimedStr.replace(pattern, '');
    return Common.getDecode(regexResult);
};

Common.getDecode = function(str) {
    var result;
    try {
        result = decodeURIComponent(str);
    } catch (ex) {
        var pattern = /%[^%]+$/;
        var trimStr = str.replace(pattern, '');
        result = Common.getDecode(trimStr);
    }
    return result;
};

Common.trimEncodedString = function(str, length) {
    var encodedStr = URLUTF8Encoder.encodeURIComponent(str);
    var trimedStr = encodedStr.substr(0, length);
    var pattern = /%[^%]?$/;
    var regexResult = trimedStr.replace(pattern, '');
    return Common.getDecode(regexResult);
};

/**
 * Page를 Click할 때의 Event/현재의 Page의 OnPageClick Event
 */
function onPageClick() {
    var currentPage = PageManager.getCurrentPage();
    if (currentPage) {
        if (currentPage.onPageClick) currentPage.onPageClick();
    }
};

/**
 * 화면 Object의 enable, disable처리
 * @param id {string} : Object의 ID
 * @param enable {boolean} true:enable한다, false:disable한다.
 */
Common.setObjectEnable = function(id, enable) {
    if (!id) {
        return;
    }
    WidgetLib.setWidgetStatus(id, { enable: enable });
};

/**
 * Object가 Null 또는 Empty상태일 때의 판별
 */
Common.isNullOrEmpty = function(obj) {
    var result = false;
    switch (typeof obj) {
        case "undefined":
            result = true;
            break;
        case "object":
            if (obj === null) {
                result = true;
            }
            break;
        case "string":
            if (obj === null || obj === "") {
                result = true;
            }
            break;
        default:
            //console.log(obj);
            break;
    }
    return result;
};

Common.removePrefix = function(str) {
    var pattern = /([^:]+)$/;
    var result = str.match(pattern);
    return result[1];
};

Common.xmlToJson = function(xml) {
    var obj = {};
    if (xml.hasChildNodes()) {
        for (var i = 0, iMax = xml.childNodes.length; i < iMax; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = this.removePrefix(item.nodeName);
            if (item.nodeType == 1) { //object
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].length) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                        obj.flg = true;
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            } else if (item.nodeType == 3) { // text
                obj = item.nodeValue;
            }
        }
        if (obj.flg == true) {
            var old = obj[nodeName];
            obj = old;
        }
    }
    return obj;
};

Common.getObjLength = function(obj) {
    var cnt = 0;
    for (var tmp in obj) {
        cnt++;
    }
    return cnt;
};

Common.getIndex = function(collection, _value) {
    var idx = -1;
    var tmp;
    for (var i = 0, iMax = collection.length; i < iMax; i++) {
        tmp = collection[i];
        if (tmp.value == _value) {
            idx = i;
            break;
        }
    }
    return idx;
};

Common.getKey = function(collection, _value) {
    var key = "";
    var tmp;
    for (var i = 0, iMax = collection.length; i < iMax; i++) {
        tmp = collection[i];
        if (tmp.value == _value) {
            key = tmp.key;
            break;
        }
    }
    return key;
};

Common.setIndex = function(_id, _idx) {
    var obj = document.getElementById(_id);
    if (obj && obj.tagName.toLowerCase() == "select") {
        obj.selectedIndex = _idx;
    }
};

function parseBool(value) {
    return (typeof value === "undefined") ?
        false :
        // trim using jQuery.trim()'s source
        value.replace(/^\s+|\s+$/g, "").toLowerCase() === "true";
}

function loadScript(loc) {
    var tag = document.createElement("script");
    tag.setAttribute("type", "text/javascript");
    tag.setAttribute("src", loc);
    tag.setAttribute("charset", "UTF-8");
    document.getElementsByTagName("head")[0].appendChild(tag);
}

Common.replaceStrAtArray = function(_collection, _key, _value) {
    var _result = new Array(_collection.length);
    for (var i = 0, iMax = _collection.length, _msg; i < iMax; i++) {
        _result[i] = _collection[i].replace(_key, _value);
    }
    return _result;
};

Common.isSytemAdmin = function(userInfo) {
    KISUtil.debug("Common.isSytemAdmin", "excute");
    if (userInfo.Index < 0 || (typeof userInfo.Roles != 'undefined' && userInfo.Roles.Role == 'SystemAdministrator')) {
        return true;
    }
    return false;
};

Common.indexOf = function(collection, obj) {
    var idx = -1;
    if (collection instanceof Array) {
        for (var i = 0, il = collection.length; i < il; i++) {
            if (collection[i] == obj) {
                idx = i;
                break;
            }
        }
    }
    return idx;
};

//************************* 스캔 잡 실행 이후 서버 통신 ********************************//

function doScanJobStart() {
    KISUtil.debug("doJobStart", "excute");

    glbFileTran.docName = getScanFileName();
    remappingTemplate();

    glbComm = new WebServiceLib.Communicator();
    glbComm.successHandler = onScanJobSuccess;
    glbComm.errorHandler = onScanJobError;

    glbComm.user = CONFIG.ENV.LOGIN_INFO.KO_ID;
    glbComm.password = CONFIG.ENV.LOGIN_INFO.KO_PASSWORD;

    glbComm.callJobExecService(glbJobTemplate, gHost);
};

function getScanFileName() {
    KISUtil.debug("getScanFileName", "excute");

    var fileObj = [glbDevInfo.serialNo];
    var date = new Date();
    var timestamp = date.format("yyyyMMdd_HHhhmmssfff");
    fileObj.push(timestamp);

    return fileObj.join("_");
};

/**
 * Job実行成功処理
 */
function onScanJobSuccess(resp) {
    KISUtil.debug("onScanJobSuccess", "excute");

    WidgetLib.setWidgetStatus("btn_MP_Start", { enable: true }); //버튼 활성화
    WidgetLib.setWidgetStatus("btn_EP_Start", { enable: true }); //버튼 활성화

    if (resp.responseXML) {
        var ids = resp.responseXML.getElementsByTagName("JobID");
        var arr = [],
            arr2;
        for (var i = 0; i < ids.length; i++) {
            tmp = ids[i].childNodes;
            arr2 = [];
            for (var j = 0; j < ids.length; j++) {
                arr2[arr2.length] = tmp[j].nodeValue;
            }
            arr[arr.length] = arr2.join('');
        }

        glbInfo.scanJobID = arr[0]; //스캔잡이므로 하나
        PageManager.changePage(ProcessingPopup, PageManager.type.NORMAL);

        JobMonitor.startMonitor({
            uuid: glbInfo.scanJobID,
            type: "scan",
            successCallback: function() {
                console.log("successCallback");
                SSMILib.onEvent("ScanJobComplete", true, { uuid: glbInfo.scanJobID, type: "scan" });
            },
            errorCallback: function() {
                console.log("errorCallback");
                SSMILib.onEvent("ScanJobError", true, { uuid: glbInfo.scanJobID, type: "scan" });
            },
            timeoutCallback: function() {
                console.log("timeoutCallback");
                SSMILib.onEvent("ScanJobTimeout", true, { uuid: glbInfo.scanJobID, type: "scan" });
            },
            cancelCallback: function() {
                console.log("cancelCallback");
                SSMILib.onEvent("ScanJobCancel", true, { uuid: glbInfo.scanJobID, type: "scan" });
            },
            foundCallback: function() {
                console.log("foundCallback");
                SSMILib.onEvent("ScanJobFound", true, { uuid: glbInfo.scanJobID, type: "scan" });
            }
        }, glbConfig.GetJob.count);
    } else {

    }
};

/**
 * 과금 정보 요청 시작
 */
Common.doChargePrice = function() {
    //var res = glbInfo.resolution[glbDataSet.resolutionIdx];
    var res = "300";
    //res = res.substring(0, 3);

    //pdf의 경우 [파일명.pdf] 지정, jpg의 경우 [파일명](파일명이 곧 폴더명이 됨) 지정
    var fileName = (glbFileTran.docFormat == JFLib.DOCFORMAT.PDF) ? glbFileTran.docName + '.pdf' : glbFileTran.docName;

    var info = {
		/*
        "service": SERVICE_CODE.SCAN_PRICE,
        "docInfo": {
            "resolution": res,
            "colormode": glbDataSet.colorModeIdx.toString(), // 0/1 (Color/Black&White)
            "fileName": fileName,
            "destAdd": document.getElementById("txt_userInputInfo").value
        },
        "userId": glbInfo.userId,
        "ipAddress": glbConfig.PRINTER_IP,
        "serialNo": glbInfo.serialNumber || "000000",
        'language': glbInfo.lang
		*/
		"service": SERVICE_CODE.SCAN_PRICE,
        "docInfo": {
            "resolution": res,
			"pages"		: glbInfo.ScanImageInformation.Impressions.toString(),
            "colormode": glbDataSet.colorModeIdx.toString(), // 0/1 (Color/Black&White)
            "fileName": fileName,
            "fileType": glbFileTran.docFormat
            //"destAdd": document.getElementById("txt_userInputInfo").value
        },
		    //"userId": glbInfo.userId,
        "ipAddress": glbConfig.PRINTER_IP,
        "serialNo": glbInfo.serialNumber || "000000",
        'language': glbInfo.lang
    };

    //info.userId = (glbConfig.isSHA) ? SecureManager_Hash(info.userId) : info.userId; //SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
    info = extendDeep(info, glbChargePriceChkInit);
    Common.DoChargePriceChkReq(info, Common.DoChargePriceChkResp);
};

/**
 * 과금 정보 요청 Request함수
 * @param {Function} callback 과금결제 표시처리 Response함수
 * @param {Array} data 과금결제 표시를 위해 필요데이터
 */
Common.DoChargePriceChkReq = function(data, callback) {
    KISUtil.debug("Common.DoChargePriceChkReq", "excute");
    if (!flg_Dummy_Beep) {
        var p_glbConfig = window.parent["glbConfig"];
        if (!p_glbConfig.SERVER_IP) {
            return;
        }
        //p_glbConfig.SERVER_SSL = true;
        //p_glbConfig.SERVER_IP = "192.168.200.130";
        //p_glbConfig.SERVER_PORT = 11181;
    } else {
        p_glbConfig = {};
        p_glbConfig.SERVER_SSL = false;
        p_glbConfig.SERVER_IP = "192.168.200.130";
        p_glbConfig.SERVER_PORT = 11181;
    }

    var httpRequest = createXMLHttpRequest();

    var url = (p_glbConfig.SERVER_SSL) ? "https://" : "http://";
    url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

    httpRequest.onreadystatechange = function() {
        KISUtil.debug("onreadystatechange", "excute");
        if (this.readyState === 4) {
            if (this.status === 200) {
                callback.call(this);
            } else {
                KISUtil.debug("DoChargePriceChkReq Ajax Fail", this.status);
                clearTimeout(glbInfo.loginTimer);
                WarnPopup._param = { type: "startup", title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_COMM, targetPage: false };
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout = ChargeInfoPopup.timer;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 과금 정보 요청 Response함수
 */
Common.DoChargePriceChkResp = function() {
    KISUtil.debug("Common.DoChargePriceChkResp", "excute");

    try {
        if(flg_Dummy_Beep){
            var data = {};
            data.status = 'success';
            data.unitPrice = '100';
            data.totalPrice = '200';
        }else{
            var data = JSON.parse(this.responseText);
        }
    } catch (error) {
        var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS };
        WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
        return;
    }

    if (data.status == 'success') {
        glbDataSet.priceInfo = {};
        glbDataSet.priceInfo.unitPrice = parseInt(data.unitPrice);
        glbDataSet.priceInfo.totalPrice = parseInt(data.totalPrice);
        var targetPopup = ChargeInfoPopup;
    } else {
        var msg = (data.reason) ? { title: Msg.Page.WarnPopup.title, message: data.reason } : { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS };
        WarnPopup._param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        var targetPopup = WarnPopup;
    }

    PageManager.changePage(targetPopup, PageManager.type.NORMAL);
};

/*
 * 과금 처리 실시
 */
Common.doCharge = function(payType) {
    //var res = glbInfo.resolution[glbDataSet.resolutionIdx];
    var res = "300";
    //res = res.substring(0, 3);

    //pdf의 경우 [파일명.pdf] 지정, jpg의 경우 [파일명](파일명이 곧 폴더명이 됨) 지정
    var fileName = (glbFileTran.docFormat == JFLib.DOCFORMAT.PDF) ? glbFileTran.docName + '.pdf' : glbFileTran.docName

    var charge = {
        "service": SERVICE_CODE.SCAN_CHARGE,
        "docInfo": {
            "resolution": res,
            "colormode": glbDataSet.colorModeIdx.toString(), // 0/1 (Color/Black&White)
            "pages": glbInfo.ScanImageInformation.Impressions.toString(),
            //"destAdd": document.getElementById("txt_userInputInfo").value
            "fileName" : fileName,
            "fileType" : glbFileTran.docFormat
        },
        "userInfo": {
            "userId": "", // 해당 내용은 사용하지 않지만 I/F 구성상 빈값을 사용합니다.
            "mailAddr": document.getElementById("txt_userInputInfo").value,
            "telNumber": document.getElementById("txt_userNumberInputInfo").value,//document.getElementById("txt_userInputInfo").value,
            "informingConsent": true // ToDo: 차후 변수로 변경
        },
        "paymentMethods": payType, //payType 직과금/사이버머니
        "ipAddress": glbConfig.PRINTER_IP,
        "serialNo": glbInfo.serialNumber || "000000",
        "language": glbInfo.lang
    };

    KISUtil.debug("Common.doCharge/charge", JSON.stringify(charge));

    //charge.userId = (glbConfig.isSHA) ? SecureManager_Hash(charge.userId) : charge.userId; //SHA-256 암호화 (TODO 유저ID도 암호화가 필요한가?)
    charge = extendDeep(charge, glbChargeInit);
    Common.DoChargeReq(charge, Common.DoChargeResp);
};

/**
 * 과금 처리 Request함수
 * @param {Function} callback 과금결제처리 Response함수
 * @param {Array} data 과금결제를 위해 필요데이터
 */
Common.DoChargeReq = function(data, callback) {
    KISUtil.debug("Common.DoChargeReq", "excute");

    if (!flg_Dummy_Beep) {
        var p_glbConfig = window.parent["glbConfig"];
        if (!p_glbConfig.SERVER_IP) {
            return;
        }
        //p_glbConfig.SERVER_SSL = true;
        //p_glbConfig.SERVER_IP = "192.168.200.130";
        //p_glbConfig.SERVER_PORT = 11181;
    } else {
        p_glbConfig = {};
        p_glbConfig.SERVER_SSL = false;
        p_glbConfig.SERVER_IP = "192.168.200.130";
        p_glbConfig.SERVER_PORT = 11181;
    }

    var httpRequest = createXMLHttpRequest();

    var url = (p_glbConfig.SERVER_SSL) ? "https://" : "http://";
    url = url + p_glbConfig.SERVER_IP + ":" + p_glbConfig.SERVER_PORT;

    httpRequest.onreadystatechange = function() {
        KISUtil.debug("onreadystatechange", "excute");
        if (this.readyState === 4) {
            if (this.status === 200) {
                callback.call(this);
            } else {
                KISUtil.debug("DoChargeReq Ajax Fail", this.status);
                var param = { type: "startup", title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_COMM, targetPage: false };
                WarnPopup._param = param;
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
        }
    };

    httpRequest.open("POST", url, true);
    httpRequest.timeout = ChargeInfoPopup.timer;
    httpRequest.timeout = 61000;
    httpRequest.setRequestHeader("Content-Type", "application/json");
    httpRequest.send(data && JSON.stringify(data));
};

/**
 * 과금 처리 Response함수
 */
Common.DoChargeResp = function() {
    KISUtil.debug("Common.DoChargeResp:", "excute");

    try {
        var data = JSON.parse(this.responseText);
    } catch (error) { //서버로부터 JSON형식으로 오지 않았을 경우
        var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS };
        var param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        WarnPopup._param = param;
        var targetPopup = WarnPopup;
        PageManager.changePage(targetPopup, PageManager.type.NORMAL);
        return;
    }

    if (data.status == 'success') {
        glbDataSet.priceResult = {};
        glbDataSet.priceResult.price = parseInt(data.totalPrice);
        glbDataSet.priceResult.chargeRemains = parseInt(data.unitPrice);
        var targetPopup = ChargeResultPopup;
        var pageType = PageManager.type.NORMAL;
    } else {
        var msg = (data.reason) ? { title: Msg.Page.WarnPopup.title, message: data.reason } : { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_OTHERS }; //결제 오류등
        WarnPopup._param = param = { type: "startup", title: msg.title, message: msg.message, targetPage: false };
        var targetPopup = WarnPopup;
        var pageType = PageManager.type.NORMAL;
    }

    PageManager.changePage(targetPopup, pageType);
};

function onScanJobError() {
    KISUtil.debug("onScanJobError", "excute");

    WidgetLib.setWidgetStatus("btn_MP_Start", { enable: true }); //버튼 활성화
    WidgetLib.setWidgetStatus("btn_EP_Start", { enable: true }); //버튼 활성화

    var msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_SCAN_JOB };
    BrowserExt.Beep(1);
    if (glbComm && glbComm.fault) {
        KISUtil.debug("onScanJobError/subcode", glbComm.fault.subcode);
        if (glbComm.fault.subcode == "flt:UnauthorizedUser") {
            msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_ENV }; //JOB_EXCUTE_WITH_UNAUTHORIZED_USER
            KISUtil.debug(glbComm.fault.subcode, glbComm.fault.subSubcode);
        } else {
            KISUtil.debug("onScanJobError/subSubcode", glbComm.fault.subSubcode);
            switch (glbComm.fault.subSubcode) {
                case "flt:TooManyJobs":
                    MessageManager.displayMessage(MessageManager.MessageType.JOB_START, MessageManager.START_DETAIL.TOO_MANY_JOB_ERROR, Msg.ERROR_MSG.TOO_MANY_JOBS);
                    return;
                case "flt:InvalidJobFlow":
                    if (glbComm.fault.description) {
                        switch (glbComm.fault.description) {
                            case "Conflict:PageSplit and ScanFrom":
                                MessageManager.displayMessage(MessageManager.MessageType.JOB_START, MessageManager.START_DETAIL.JOB_CONFLICT_PAGESPLIT_SCANFORM, Msg.ERROR_MSG.USE_GLASS_FOR_PAGESPLIT);
                                return;
                        }
                    }
                    break;
                case "flt:AuditronLimitExceeded":
                case "flt:ServiceLimitReached":
                case "flt:PagePrintLimitExceeded": //발생치 않음
                case "flt:AccessyError":
                    msg = { title: Msg.Page.WarnPopup.title, message: Msg.ERROR_MSG.FAIL_ENV };
                    break;
                default:
                    KISUtil.debug(glbComm.fault.subcode, glbComm.fault.subSubcode);
                    break;
            }
        }
    }
    var param = { type: "job", title: msg.title, message: msg.message, targetPage: false };
    WarnPopup._param = param;
    PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
};
