/**
 * 개별 페이지의 표시 및 동작용
 * （메뉴 페이지용）
 */
var AdminSettingPage = new TemplatePage();

AdminSettingPage.ID = "page_admin";

/**
 * 개별 페이지의 Data정의
 */
AdminSettingPage._initModel = function() {
    this._data = {
        buttonList: [
            { id: "btn_LP_confirm", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_LP_confirm", offImg: Img.BTN_OPN_OFF, pressImg: Img.BTN_OPN_PRESS, disableImg: Img.BTN_OPN_DIS } }, 
            { id: "btn_LP_cancel", type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_LP_cancel", offImg: Img.BTN_OPN_OFF, pressImg: Img.BTN_OPN_PRESS, disableImg: Img.BTN_OPN_DIS } },
            { id: "btn_LP_native", type: WidgetLib.ButtonType.NORMAL}
        ],
        imageList: [
            //{id:"img_LP_bg", src:Img.IMG_LP_BG},
            { id: "img_LP_mainLogo", src: Img.IMG_LP_LOGO }
        ],
        textList: [
            //{id : "lbl_LP_id", text: Msg.Menu.LOGIN_ID_LABEL},
            //{id : "lbl_LP_password", text: Msg.Menu.LOGIN_PW_LABEL},
            { id: "lbl_LP_serverIP", text: "서버주소 : " }, 
            { id: "lbl_LP_serverPort", text: "포트 : " }, 
            { id: "lbl_LP_isCreditUse", text: "스캔 사용여부" }, 
            { id: "lbl_LP_isImoneyUse", text: "팩스 사용여부" }, 
            { id: "lbl_LP_isPrint", text: "출력 사용여부" }, 
            { id: "lbl_LP_isCopy", text: "복사 사용여부" }, 
            { id: "lbl_LP_confirm", text: "확인" }, 
            { id: "lbl_LP_cancel", text: "취소" }


        ]
    };
};

/**
 * 개별 페이지의 HTML Tag를 구성 및 등록
 */
AdminSettingPage._initOthers = function() {
    /*
    var tbxID=document.getElementById("tbx_LP_id");
    var tbxPW=document.getElementById("tbx_LP_password");
    tbxID.placeholder = Msg.LOGIN.GUIDE_ID;
    tbxPW.placeholder = Msg.LOGIN.GUIDE_PW;
    */

    var tbxID = CONFIG.ENV.ADMIN_INFO.ID;
    var tbxPW = CONFIG.ENV.ADMIN_INFO.PASSWORD;
    tbxID.placeholder = Msg.LOGIN.GUIDE_ID;
    tbxPW.placeholder = Msg.LOGIN.GUIDE_PW;


    Common.setText("lbl_csTitle", Msg.Common.ServerSetName);
    //Common.changeVisibility("lbl_csTitle","none");
    Common.changeVisibility("tray_status", "none");
};

AdminSettingPage._onPageChange = function() {
    this.updateDisplay();
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
AdminSettingPage.updateDisplay = function() {
    Common.changeVisibility("tray_status", "none");
    var tbxIP = document.getElementById("tbx_LP_serverIP");
    var tbxPORT = document.getElementById("tbx_LP_serverPort");
    tbxIP.value = glbConfig.SERVER_IP;
    tbxPORT.value = glbConfig.SERVER_PORT;
    //document.getElementById("subFlipSwitch1").checked = glbConfig.isCreditPayment;
    //document.getElementById("subFlipSwitch2").checked = glbConfig.isIMoneyPayment;
    document.getElementById("subFlipSwitch1").checked = glbConfig.isScanUse;
    document.getElementById("subFlipSwitch2").checked = glbConfig.isFaxUse;
    document.getElementById("subFlipSwitch3").checked = glbConfig.isPrintUse;
    document.getElementById("subFlipSwitch4").checked = glbConfig.isCopyUse;
    Common.setText("lbl_csTitle", Msg.Common.ServerSetName);
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event의 종류
 * @param {string} id : Event의 발생원
 */
AdminSettingPage.EventHandler = function(event, id) {
    KISUtil.debug("EventHandler", "event:" + event + "/id:" + id);
    switch (event) {
        case "SetCsvLocalData":
            if (arguments[1] == true) {
               // LogLib.info("[AIP-00005]writeFile Before");
                this.writeFile("./data/data.js", this.createDataStr(this.setDataFileString()));
                //LogLib.info("[AIP-00005]fixedValue After");
            } else {
                var param = { type: "startup", title: Msg.WarnPopup.title, message: Msg.ERROR_MESSAGE.FAIL_OTHERS, targetPage: false };
                WarnPopup._param = param;
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
            break;
        case "onbuttonup":
            MessageManager.clearMessageArea();
            switch (id) {
                case "btn_LP_confirm":
                    BrowserExt.Beep(0);
                    //data.js에 파일내용적용처리 TODO
                    var fixedValue = this.createDataStr(this.setDataFileString()).replace(/\n/ig, "");
                    //LogLib.info("[AIP-00005]fixedValue is " + fixedValue);
                    SSMILib.SetCsvLocalData(Msg.Common.CS_NUMBER, true, fixedValue, SSMILib.AREA.HDD);
                    break;
                case "btn_LP_cancel":
                    BrowserExt.Beep(0);
                    SSMILib.GetTrayInfo();
                    break;
                case "btn_LP_native":
                    BrowserExt.Beep(0);
                    BrowserExt.SetScreenChange("menuto:native_menu");
                    //BrowserExt.SetScreenChange("menuto:copy");
                    break;
                default:
                    //BrowserExt.Beep(0);
                    //clearMessageAreaTimer();
                    break;
            }
            break;
        case "onhardkeydown":
            MessageManager.clearMessageArea();
            switch (id) {
                case BrowserExt.keyCode.FX_VK_START:
                    BrowserExt.Beep(1);
                    break;
                case BrowserExt.keyCode.FX_VK_CLEAR:
                    //リセットキー
                    BrowserExt.Beep(0);
                    BrowserExt.SetScreenChange("allservice");
                    break;
                case BrowserExt.keyCode.FX_VK_0:
                case BrowserExt.keyCode.FX_VK_1:
                case BrowserExt.keyCode.FX_VK_2:
                case BrowserExt.keyCode.FX_VK_3:
                case BrowserExt.keyCode.FX_VK_4:
                case BrowserExt.keyCode.FX_VK_5:
                case BrowserExt.keyCode.FX_VK_6:
                case BrowserExt.keyCode.FX_VK_7:
                case BrowserExt.keyCode.FX_VK_8:
                case BrowserExt.keyCode.FX_VK_9:
                    if (flg_Dummy_Beep) {
                        return;
                    }
                case BrowserExt.keyCode.FX_VK_PAUSE:
                default:
                    BrowserExt.Beep(1);
                    break;
            }
            break;
        default:
            break;
    }
};

/**
 * data.jsに書き込む内容生成
 */
AdminSettingPage.createDataStr = function(objArray) {
    var returnStr = 'var DATA = \n';
    returnStr = returnStr + "{\n";

    if (objArray.ADDRESS) {
        returnStr = returnStr + 'ADDRESS : "' + objArray.ADDRESS + '", \n';
    } else {
        returnStr = returnStr + 'ADDRESS : ' + glbConfig.SERVER_IP + ', \n';
    }
    if (objArray.PORT) {
        returnStr = returnStr + 'PORT : "' + objArray.PORT + '", \n';
    } else {
        returnStr = returnStr + 'PORT : ' + glbConfig.SERVER_PORT + ', \n';
    }
    /*
    if (objArray.isCreditPayment) {
        returnStr = returnStr + 'CREDIT_PAYMENT : "' + objArray.isCreditPayment + '", \n';
    } else {
        returnStr = returnStr + 'CREDIT_PAYMENT : ' + glbConfig.isCreditPayment + ', \n ';
    }
    if (objArray.isIMoneyPayment) {
        returnStr = returnStr + 'I_MONEY_PAYMENT : "' + objArray.isIMoneyPayment + '", \n';
    } else {
        returnStr = returnStr + 'I_MONEY_PAYMENT : "' + glbConfig.isIMoneyPayment + '", \n';
    }
    */
    if (objArray.isPrintUse) {
        returnStr = returnStr + 'PRINT_USE : "' + objArray.isPrintUse + '", \n';
    } else {
        returnStr = returnStr + 'PRINT_USE : "' + glbConfig.isPrintUse + '", \n';
    }
    if (objArray.isCopyUse) {
        returnStr = returnStr + 'COPY_USE : "' + objArray.isCopyUse + '", \n';
    } else {
        returnStr = returnStr + 'COPY_USE : "' + glbConfig.isCopyUse + '", \n';
    }
	
	if (objArray.isScanUse) {
        returnStr = returnStr + 'SCAN_USE : "' + objArray.isScanUse + '", \n';
    } else {
        returnStr = returnStr + 'SCAN_USE : "' + glbConfig.isScanUse + '", \n';
    }
	if (objArray.isFaxUse) {
        returnStr = returnStr + 'FAX_USE : "' + objArray.isFaxUse + '" \n';
    } else {
        returnStr = returnStr + 'FAX_USE : "' + glbConfig.isFaxUse + '" \n';
    }
	

    returnStr = returnStr + '\t } \n';

    returnStr = returnStr.substring(0, returnStr.length - 1);
    return returnStr;
}

//하기는 util.js로 이동 TODO
/**
 * ファイル書き込み
 *
 * @param filePath ファイルパス
 * @param targetStr 書き込む内容
 */
AdminSettingPage.writeFile = function(filePath, targetStr, processFlag) {
    var _requester = WebServiceLib.createXMLHttpRequest();
    _requester.open("PUT", filePath, true);
    _requester.onreadystatechange = function() {
        if (_requester.readyState == 4) {
            if (_requester.status == 200) {
                //LogLib.info("[CS-RM-xxxx0]_requester.status success");
                AdminSettingPage.successHandler();
            } else {
                //Error
                var param = { type: "startup", title: Msg.WarnPopup.title, message: Msg.ERROR_MESSAGE.FAIL_OTHERS, targetPage: false };
                WarnPopup._param = param;
                PageManager.changePage(WarnPopup, PageManager.type.NORMAL);
            }
        }
    }
    _requester.send(targetStr);
}

/**
 * data.jsの文字列設定
 */
AdminSettingPage.setDataFileString = function() {
    //신용카드 사용여부
    var config = new Array();

    config.ADDRESS = (document.getElementById("tbx_LP_serverIP").value) ? (document.getElementById("tbx_LP_serverIP").value) : null; //서버주소
    config.PORT = (document.getElementById("tbx_LP_serverPort").value) ? (document.getElementById("tbx_LP_serverPort").value) : null; //포트

    // 스캔 사용여부
    var tmp = document.getElementById("subFlipSwitch1").checked;
    config.isScanUse = tmp ? "1" : "0";
    //config.isCreditPayment = tmp ? "1" : "0";

    //팩스 사용여부
    var tmp = document.getElementById("subFlipSwitch2").checked;
    config.isFaxUse = tmp ? "1" : "0";
    //config.isIMoneyPayment = tmp ? "1" : "0";

    //출력 사용 여부
    var tmp = document.getElementById("subFlipSwitch3").checked;
    config.isPrintUse = tmp ? "1" : "0";

    //복사 사용 여부
    var tmp = document.getElementById("subFlipSwitch4").checked;
    config.isCopyUse = tmp ? "1" : "0";
	
	//스캐 사용 여부
	//config.isScanUse = "1";
	//config.isFaxUse = "1";
    config.isCreditPayment = "1";
    config.isIMoneyPayment = "0"

    return config;
}

/**
 * ファイル書き込め処理の成功時の処理
 */
AdminSettingPage.successHandler = function() {
    this.replaceDataArr();
    initData();

    SSMILib.GetTrayInfo();
    window.location.reload();
    //PageManager.changePage(MainPage, PageManager.type.NORMAL);
};

//複合機登録に成功した場合、複合機情報の配列に登録した内容反映
AdminSettingPage.replaceDataArr = function() {
    //LogLib.info("[CS-RM-xxxx0]setDataFileString Before");
    var data = this.setDataFileString();
    //LogLib.info("[CS-RM-xxxx0]setDataFileString After");
    DATA.ADDRESS = data.ADDRESS;
    DATA.PORT = data.PORT;
    DATA.CREDIT_PAYMENT = data.isCreditPayment;
    DATA.I_MONEY_PAYMENT = data.isIMoneyPayment;
    DATA.PRINT_USE = data.isPrintUse;
    DATA.COPY_USE = data.isCopyUse;
	DATA.SCAN_USE = data.isScanUse;
	DATA.FAX_USE = data.isFaxUse;
    //LogLib.info("[CS-RM-xxxx0]DataSet OK");
}
