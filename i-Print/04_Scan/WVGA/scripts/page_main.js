/**
 * 기본 화면
 */
var MainPage = new TemplatePage();
MainPage.ID = "page_main";

MainPage._initModel = function() {
    this._data = {
        pulldownList: {
            common: {
                pullDown: {
                    offImg: Img.UIPARTS.PUL_NOR_OFF,
                    pressImg: Img.UIPARTS.PUL_NOR_PRESS,
                    onImg: Img.UIPARTS.PUL_NOR_ON,
                    disableImg: Img.UIPARTS.PUL_NOR_DIS
                },
                btn: {
                    top: {
                        offImg: Img.UIPARTS.RAD_TOP_OFF,
                        onImg: Img.UIPARTS.RAD_TOP_ON,
                        disableImg: Img.UIPARTS.RAD_TOP_DIS,
                        pressImg: Img.UIPARTS.RAD_TOP_PRESS
                    },
                    mid: {
                        offImg: Img.UIPARTS.RAD_MID_OFF,
                        onImg: Img.UIPARTS.RAD_MID_ON,
                        disableImg: Img.UIPARTS.RAD_MID_DIS,
                        pressImg: Img.UIPARTS.RAD_MID_PRESS
                    },
                    bot: {
                        offImg: Img.UIPARTS.RAD_BOT_OFF,
                        onImg: Img.UIPARTS.RAD_BOT_ON,
                        disableImg: Img.UIPARTS.RAD_BOT_DIS,
                        pressImg: Img.UIPARTS.RAD_BOT_PRESS
                    }

                }
            },
            list: [{
                    key: "inplex",
                    value: [{ //단면
                            icon: { off: Img.FUNC.ICN_P_PLEX_SIMPLEX_OFF },
                            iconLeft: { off: Img.FUNC.ICN_L_PLEX_SIMPLEX_OFF },
                            text: Msg.Func.plex.simplex,
                            value: JFLib.PLEX.SIMPLEX
                        },
                        { //양면(좌우열기)
                            icon: { off: Img.FUNC.ICN_P_PLEX_DUPLEX_OFF },
                            iconLeft: { off: Img.FUNC.ICN_L_PLEX_DUPLEX_OFF },
                            text: Msg.Func.plex.duplex,
                            text0: Msg.Func.plex.duplex[0],
                            text1: Msg.Func.plex.duplex[1],
                            value: JFLib.PLEX.DUPLEX
                        },
                        { //양면(상하열기)
                            icon: { off: Img.FUNC.ICN_P_PLEX_TUMBLE_OFF },
                            iconLeft: { off: Img.FUNC.ICN_L_PLEX_TUMBLE_OFF },
                            text: Msg.Func.plex.tumble,
                            text0: Msg.Func.plex.tumble[0],
                            text1: Msg.Func.plex.tumble[1],
                            value: JFLib.PLEX.TUMBLE
                        },
                        { //책복사
                            icon: { off: Img.ICON.ICN_PS },
                            iconLeft: { off: Img.ICON.ICN_PS },
                            text: Msg.Page.Etc.lblPageSplit
                        }

                    ]
                },
                {
                    key: "headPosition",
                    value: [{
                            icon: { off: Img.ICON.ICN_PRINT_POT_OFF, dis: Img.ICON.ICN_PRINT_POT_OFF },
                            iconLeft: { off: Img.ICON.ICN_PRINT_POT_OFF, dis: Img.ICON.ICN_PRINT_POT_OFF },
                            text: Msg.Func.headPosition.top,
                            value: JFLib.HP.TOP
                        },
                        {
                            icon: { off: Img.ICON.ICN_PRINT_LAN_OFF, dis: Img.ICON.ICN_PRINT_LAN_OFF },
                            iconLeft: { off: Img.ICON.ICN_PRINT_LAN_OFF, dis: Img.ICON.ICN_PRINT_LAN_OFF },
                            text: Msg.Func.headPosition.left,
                            value: JFLib.HP.LEFT
                        }
                    ]
                },
                /*
                {
                    key: "resolution",
                    value: [{
                            icon: { off: Img.FUNC.ICN_RES_200, dis: Img.FUNC.ICN_RES_200 },
                            text: Msg.Func.resolution.dpi200,
                            value: JFLib.RES.R200
                        },
                        {
                            icon: { off: Img.FUNC.ICN_RES_300, dis: Img.ICN_RES_300 },
                            text: Msg.Func.resolution.dpi300,
                            value: JFLib.RES.R300
                        },
                        {
                            icon: { off: Img.FUNC.ICN_RES_400, dis: Img.FUNC.ICN_RES_400 },
                            text: Msg.Func.resolution.dpi400,
                            value: JFLib.RES.R400
                        },
                        {
                            icon: { off: Img.FUNC.ICN_RES_600, dis: Img.FUNC.ICN_RES_600 },
                            text: Msg.Func.resolution.dpi600,
                            value: JFLib.RES.R600
                        }
                    ]
                },
                */
                {
                    key: "imageMode",
                    value: [{
                            icon: { off: Img.FUNC.ICN_IM_MIXED, dis: Img.FUNC.ICN_IM_MIXED },
                            iconLeft: { off: Img.FUNC.ICN_IM_MIXED, dis: Img.FUNC.ICN_IM_MIXED },
                            text: Msg.Func.imageMode.mixed,
                            value: JFLib.IM.MIXED
                        },
                        {
                            icon: { off: Img.FUNC.ICN_IM_TEXT, dis: Img.FUNC.ICN_IM_TEXT },
                            iconLeft: { off: Img.FUNC.ICN_IM_TEXT, dis: Img.FUNC.ICN_IM_TEXT },
                            text: Msg.Func.imageMode.text,
                            value: JFLib.IM.TEXT
                        },
                        {
                            icon: { off: Img.FUNC.ICN_IM_PHOTO, dis: Img.FUNC.ICN_IM_PHOTO },
                            iconLeft: { off: Img.FUNC.ICN_IM_PHOTO, dis: Img.FUNC.ICN_IM_PHOTO },
                            text: Msg.Func.imageMode.photo,
                            value: JFLib.IM.HALFTONE
                        }
                    ]
                },
                {
                    key: "docFormat",
                    value: [{
                            icon: { off: Img.FUNC.ICN_DOC_PDF, dis: Img.FUNC.ICN_DOC_PDF },
                            text: Msg.Func.docFormat.pdf,
                            value: JFLib.DOCFORMAT.PDF
                        },
                        {
                            icon: { off: Img.FUNC.ICN_DOC_JPG, dis: Img.FUNC.ICN_DOC_JPG },
                            text: Msg.Func.docFormat.jpg,
                            value: JFLib.DOCFORMAT.JPEG
                        }
                    ]
                },
                {
                    key: "colorMode",
                    value: [{ //컬러
                            icon: { off: Img.FUNC.ICN_CM_CLR, dis: Img.FUNC.ICN_CM_CLR },
                            text: Msg.Func.colorMode.color,
                            value: JFLib.CM.COLOR
                        },
                        { //흑백
                            icon: { off: Img.FUNC.ICN_CM_BW, dis: Img.FUNC.ICN_CM_BW },
                            text: Msg.Func.colorMode.bw,
                            value: JFLib.CM.BW
                        }
                    ]
                }
            ]
        },
        buttonList: [
            { id: "btn_MP_etcFunc", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_MP_etcFunc", offImg: Img.UIPARTS.BTN_NOR_OFF, pressImg: Img.UIPARTS.BTN_NOR_PRESS } },
            { id: "btn_MP_Start", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_MP_Start", offImg: Img.UIPARTS.BTN_OPN_OFF, pressImg: Img.UIPARTS.BTN_OPN_PRESS, disableImg: Img.UIPARTS.BTN_OPN_DIS } }
        ],
        imageList: [],
        textList: [
            { id: "tit_MP_destAddInput", text: Msg.Page.Main.destAddInput },
            { id: "tit_MP_numberAddInput", text: Msg.Page.Main.numberAddInput },
            { id: "tit_MP_inplex", text: Msg.Page.Main.titInplex },
            { id: "lbl_MP_inplex", text: Msg.Func.plex.simplex },
            { id: "lbl_MP_etcFunc", text: Msg.Page.Main.lblEtcFunc },
            { id: "lbl_MP_Start", text: Msg.Page.Main.lblStart },
            { id: "tit_MP_imageMode", text: Msg.Page.Etc.lblImageMode },
            { id: "tit_MP_colorMode", text: Msg.Page.Main.titColorMode },
            { id: "tit_MP_headPosition", text: Msg.Page.Etc.lblHeadPosition }
            //{ id: "tit_MP_resolution", text: Msg.Page.Main.titResolution }
            //{ id: "tit_MP_docFormat", text: Msg.Page.Main.titDocFormat }
        ]
    };
};

/**
 * 풀다운 목록
 */
//MainPage.pullDownList = ["inplex", "headPosition", "resolution", "imageMode", "docFormat", "colorMode"];
MainPage.pullDownList = ["inplex", "headPosition", "imageMode", "docFormat", "colorMode"];

/**
 * プルダウンを構成
 * templatePage.jsから移動
 */
MainPage.initPullDown = function() {
	var tbxUserInfo=document.getElementById("txt_userInputInfo");
	tbxUserInfo.placeholder = Msg.Page.Main.inputInfo;

    var tbxUserInfo2=document.getElementById("txt_userNumberInputInfo");
    tbxUserInfo2.placeholder = Msg.Page.Main.inputInfo2;
	
    var pulldownList = this._data.pulldownList;
    if (pulldownList == null) {
        return;
    }
    var obj;
    var node;
    var tmp;
    for (var i = 0, il = pulldownList.list.length; i < il; i++) {
        obj = pulldownList.list[i];
        document.body.appendChild(Common.createHTMLPulldown("MP", obj.key, obj.value.length, false));
        for (var j = 0, jl = obj.value.length; j < jl; j++) {
            node = obj.value[j];
            tmp = pulldownList.common.btn[(j == 0) ? "top" : ((j == (jl - 1)) ? "bot" : "mid")];
            tmp.targetImgId = "img_MP_" + obj.key + "_menu_" + j;

            WidgetLib.registerButtonWidgetById("btn_MP_" + obj.key + "_menu_" + j, WidgetLib.ButtonType.RADIO, tmp);
            if (obj.key != "tray" || (obj.key == "tray" && j == 0)) {
                Common.setImage("icn_MP_" + obj.key + "_menu_" + j, node.icon.off);
                if (glbInfo.lang == 'en' && (obj.key == "inplex" || obj.key == "outplex") && (j == 1 || j == 2)) {
                    Common.setText("lbl_MP_" + obj.key + "_menu_" + j + "_1", node.text0);
                    Common.setText("lbl_MP_" + obj.key + "_menu_" + j + "_2", node.text1);
                } else {
                    Common.setText("lbl_MP_" + obj.key + "_menu_" + j, node.text);
                }
            }
        }
        Common.changeVisibility("pul_MP_docFormat", "none");
		Common.changeVisibility("tit_MP_numberAddInput", "none");
		Common.changeVisibility("txt_userNumberInputInfo", "none");
        Common.setImage("icn_MP_" + obj.key, obj.value[0].icon.off);
        Common.setText("lbl_MP_" + obj.key, obj.value[0].text);

        var popupId = "pul_MP_" + obj.key + "_popup";
        var pullBtnAttr = pulldownList.common.pullDown;
        pullBtnAttr.targetImgId = "img_MP_" + obj.key;
        pullBtnAttr.popupId = popupId;
        WidgetLib.registerPopupWidgetById(popupId, WidgetLib.PopupType.MODAL);
        WidgetLib.registerButtonWidgetById("pul_MP_" + obj.key, WidgetLib.ButtonType.POPUP, pullBtnAttr);
    }
};

/**
 * 풀다운항목을 표시
 */
MainPage.displayPullMenuBtn = function(idx) {
    var id = "pul_MP_" + this.pullDownList[idx] + "_popup";
    var node = WidgetLib.getWidgetNode(id);
    if (!node) {
        createPullMenuBtn(this.pullDownList, idx);
        WidgetLib.registerPopupWidgetById(id, WidgetLib.PopupType.MODAL);
    }
    WidgetLib.openPopupWidget(id);
    this.displayPullMenuPopup(idx);
    Common.changeVisibility(id, "block");
};

/**
 * 풀다운이미지를 설정
 */
MainPage.displayPullMenuPopup = function(idx) {
    var key = this.pullDownList[idx];
    var pullIdx = this._dataSet[key + "Idx"];
    var length = glbInfo[key].length;
    this.updatePullMenuPopup(key, pullIdx, length);
    var id = "pul_MP_" + key + "_popup";
    Common.changeVisibility(id, "block");
};

/**
 * 풀다운항목갱신
 */
MainPage.updatePullMenuPopup = function(key, idx, length) {
    for (var i = 0; i < length; i++) {
        var id = "btn_MP_" + key + "_menu_" + i;
        var btnStatus = (key == 'colorMode' && glbDevInfo.isMono) ? { enable: (i == idx), on: (i == idx) } : { on: (i == idx) }; //흑백기 일때 컬러 버튼 Disable
        (key == 'colorMode' && glbDevInfo.isMono) ? Common.setTextColor("lbl_MP_" + key + "_menu_0", "gray"): "";
        WidgetLib.setWidgetStatus(id, btnStatus);
    }
};

/**
 * 풀다운표시 갱신
 */
MainPage.updatePulldown = function(type) {
    //getName
    var key = this.pullDownList[type];
    var idx = this._dataSet[key + "Idx"];

    if (idx < 0) {
        KISUtil.debug("invalid DataType/" + key, this._dataSet[key]);
    } else {
        var lst = this._data.pulldownList.list[type];
        //update Icon
        if (lst.value[idx]) {
            if (this._dataSet.orientation == 1 && (lst.key == "inplex" || lst.key == "outplex")) {
                Common.setImage("icn_MP_" + lst.key, lst.value[idx].iconLeft.off);
            } else {
                var status = WidgetLib.getWidgetStatus("pul_MP_" + lst.key);
                Common.setImage("icn_MP_" + lst.key, (!status.enable && !!lst.value[idx].icon.dis) ? lst.value[idx].icon.dis : lst.value[idx].icon.off);
            }
            Common.setText("lbl_MP_" + lst.key, lst.value[idx].text);
        }
        WidgetLib.setWidgetStatus("pul_MP_" + key, { on: false });
    }
};

/**
 * 개별 페이지 고유의 항목을 구성
 */
MainPage._initOthers = function() {
    //책복사 기능 활성/비활성 : config.js 초기 비활성
    if (!glbConfig.PAGE_SPLIT_USABLE) {
        this._data.pulldownList.list[0].value.pop();
    }

    this.initPullDown();
};

MainPage._onPageChange = function() {
    this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
MainPage.updateDisplay = function() {
    for (var i = 0; i < this.pullDownList.length; i++) {
        this.updatePulldown(i);
    }
};

/**
 * 画面表示の更新（プルダウンメニューアイコン）
 */
MainPage.updatePullMenuIcon = function(data, idx) {
    var key = this.pullDownList[idx];
    var flag = (this._dataSet.orientation == 1);

    var iconKey = "icon";
    var iconStatus = "off";
    if (flag) {
        iconKey = "iconLeft";
        var id;
        for (var i = 0, il = glbInfo[key].length; i < il; i++) {
            id = "icn_MP_" + key + "_menu_" + i;
            Common.setImage(id, data.pulldownList.list[idx].value[i][iconKey][iconStatus]);
        }
    } else {
        var id;
        for (var i = 0, il = glbInfo[key].length; i < il; i++) {
            id = "icn_MP_" + key + "_menu_" + i;
            Common.setImage(id, data.pulldownList.list[idx].value[i][iconKey][iconStatus]);
        }

    }
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
MainPage.EventHandler = function(event, id) {
    switch (event) {
        case "onbuttondown":
            MessageManager.clearMessageArea();
            break;
        case "onbuttonup":
            var isChange = false;
            switch (id) {
                case "btn_MP_Start":
                    WidgetLib.setWidgetStatus("btn_MP_Start", { enable: false }); //버튼 연타를 막기위한 조치
                    WidgetLib.setWidgetStatus("btn_EP_Start", { enable: false }); //버튼 연타를 막기위한 조치
                    var infoData = document.getElementById("txt_userInputInfo").value;
                    if (!infoData) {
                        BrowserExt.Beep(1);
                        MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.ERROR_MSG.FAIL_NOT_INPUT_USER_INFO);
                        WidgetLib.setWidgetStatus("btn_MP_Start", { enable: true });
                        WidgetLib.setWidgetStatus("btn_EP_Start", { enable: true });
                        return;
                    }
                    BrowserExt.Beep(0);
                    doScanJobStart();
                    break;
                case "btn_MP_etcFunc":
                    BrowserExt.Beep(0);
                    PageManager.changePage(EtcFuncPage, PageManager.type.NORMAL);
                    break;
                case "btn_MP_inplex_menu_0":
                case "btn_MP_inplex_menu_1":
                case "btn_MP_inplex_menu_2":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.inplexIdx = idx;
                    this._dataSet.splitScan.enable = false;
                    this._dataSet.splitScanIdx = 0;
                    this._dataSet.centerErase = 0;
                    break;
                case "btn_MP_inplex_menu_3":
                    BrowserExt.Beep(0);
                    PageManager.changePage(PageSplitPopup, PageManager.type.NORMAL);
                    break;
                case "btn_MP_imageMode_menu_0":
                case "btn_MP_imageMode_menu_1":
                case "btn_MP_imageMode_menu_2":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.imageModeIdx = idx;
                    setImageModeIdx();
                    break;
                case "btn_MP_headPosition_menu_0":
                case "btn_MP_headPosition_menu_1":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.headPositionIdx = idx;
                    setHeadPosition();
                    break;
                case "btn_MP_colorMode_menu_0":
                case "btn_MP_colorMode_menu_1":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.colorModeIdx = idx;
                    setColorModeIdx();
                    var param = glbInfo.colorMode[idx];
                    glbScan.setConflictParam("colorMode", param, glbFileTran);
                    break;
                case "btn_MP_resolution_menu_0":
                case "btn_MP_resolution_menu_1":
                case "btn_MP_resolution_menu_2":
                case "btn_MP_resolution_menu_3":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.resolutionIdx = idx;
                    setResolutionIdx();
                    break;
                case "btn_MP_docFormat_menu_0":
                case "btn_MP_docFormat_menu_1":
                    BrowserExt.Beep(0);
                    var idx = parseInt(id.substring(id.length, id.length - 1));
                    this._dataSet.docFormatIdx = idx;
                    setDocFormatIdx();
                    glbScan.setConflictParam("docFormat", null, glbFileTran);
                    break;
                default:
                    break;
            }
            break;
        case "onpopupopen":
            BrowserExt.Beep(0);
            switch (id) {
                case "pul_MP_inplex_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "inplex"));
                    this.updatePullMenuIcon(this._data, 0);
                    if (this._dataSet.inplexIdx < 3) {
                        WidgetLib.setWidgetStatus("btn_MP_inplex_menu_3", { on: false });
                    }
                    break;
                case "pul_MP_colorMode_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "colorMode"));
                    break;
                case "pul_MP_imageMode_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "imageMode"));
                    break;
                case "pul_MP_headPosition_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "headPosition"));
                    break;
                case "pul_MP_colorMode_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "colorMode"));
                    break;
                case "pul_MP_resolution_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "resolution"));
                    break;
                case "pul_MP_docFormat_popup":
                    this.displayPullMenuPopup(Common.indexOf(MainPage.pullDownList, "docFormat"));
                    break;
                default:
                    break;
            }
            break;
        case "onpopupclose":
            switch (id) {
                case "pul_MP_inplex_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "inplex"));
                    break;
                case "pul_MP_colorMode_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "colorMode"));
                    break;
                case "pul_MP_imageMode_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "imageMode"));
                    break;
                case "pul_MP_headPosition_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "headPosition"));
                    break;
                case "pul_MP_resolution_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "resolution"));
                    break;
                case "pul_MP_docFormat_popup":
                    this.updatePulldown(Common.indexOf(MainPage.pullDownList, "docFormat"));
                    break;
                default:
                    break;
            }
            break;
        case "onhardkeydown":
            MessageManager.clearMessageArea();
            switch (id) {
                case BrowserExt.keyCode.FX_VK_START:
                    if (WebServiceLib.getActiveRequestCount() != 0) {
                        BrowserExt.Beep(1);
                        return;
                    }

                    var infoData = document.getElementById("txt_userInputInfo").value;
                    if (!infoData) {
                        BrowserExt.Beep(1);
                        MessageManager.displayMessage(MessageManager.MessageType.USER_ACTION_REQUIRED, "", Msg.ERROR_MSG.FAIL_NOT_INPUT_USER_INFO);
                        WidgetLib.setWidgetStatus("btn_MP_Start", { enable: true });
                        WidgetLib.setWidgetStatus("btn_EP_Start", { enable: true });
                        return;
                    }

                    BrowserExt.Beep(0);
                    doScanJobStart();
                    break;
                case BrowserExt.keyCode.FX_VK_PAUSE:
                    break;
                default:
                    BrowserExt.Beep(1);
                    break;
            }
            break;
        case "ChgCpCfParam": //定されたパラメータにより関連するパラメータをコンフリクトが発生しないように自動的に変更
            //KISUtil.debug("@@ChgCpCfParam@@:arguments[2]", arguments[2]);
            onProcessConflict(arguments[2]);
            break;
        default:
            break;
    }
};

function onProcessConflict(paramArr) {
    if (!(paramArr instanceof Array)) {
        var tmp = paramArr;
        paramArr = new Array();
        paramArr.push(tmp);
    }

    var conflictParam = "";
    var msgType = null;
    var msgParam = new Array();

    for (var i = 0; i < paramArr.length; i++) {
        conflictParam = String(paramArr[i]);
        switch (conflictParam) {
            case "docFormat":
                if (glbDataSet.docFormatIdx == 1) {
                    glbDataSet.docFormatIdx = 0;
                    setDocFormatIdx();
                    MainPage.updatePulldown(Common.indexOf(MainPage.pullDownList, "docFormat"));
                    msgParam.push(Msg.Comflict[conflictParam]);
                }
                break;
            case "colorMode":
                if (glbDataSet.colorModeIdx == 1) {
                    glbDataSet.colorModeIdx = 0;
                    setColorModeIdx();
                    MainPage.updatePulldown(Common.indexOf(MainPage.pullDownList, "colorMode"));
                    msgParam.push(Msg.Comflict[conflictParam]);
                }

                break;
            default:
                break;
        }
    }

    var msg = msgParam.join();
    if (msg) {
        MessageManager.displayMessage(MessageManager.MessageType.CONFLICT, "", msg);
    }
}

/**
 * プルダウン閉じ処理用メソッド
 * templatePage.jsから移動
 */
MainPage.onPageClick = function() {
    MessageManager.clearMessageArea();
    switch (WidgetLib._popupId) {
        case "pul_MP_inplex_popup":
        case "pul_MP_colorMode_popup":
        case "pul_MP_imageMode_popup":
        case "pul_MP_headPosition_popup":
        case "pul_MP_resolution_popup":
        case "pul_MP_docFormat_popup":
            WidgetLib.closePopupWidget(WidgetLib._popupId);
            break;
        default:
            break;
    }
};