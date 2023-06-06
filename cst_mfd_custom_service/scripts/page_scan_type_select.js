/**
 * @fileoverview Scan Type 선택 페이지
 * @version 1.0.0
 */

/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
 var ScanTypeSelectPage = new TemplatePage();

 ScanTypeSelectPage.ID = "page_scan_type_select";
 ScanTypeSelectPage.key = ""; //메시지 영역 구분자
 ScanTypeSelectPage.targetService = null;
 
 /**
  * 개별 페이지의 Data정의
  */
  ScanTypeSelectPage._initModel = function() {
     this._data = {
         buttonList: [
             { id: "btn_scan_to_usb",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_usb", offImg: Img.ICN_CF_CONFIRM_OFF, pressImg: Img.ICN_CF_CONFIRM_PRESS, disableImg: Img.ICN_CF_CONFIRM_DIS } },
             { id: "btn_scan_to_pc0",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_pc0", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } },
             { id: "btn_scan_to_pc1",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_pc1", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } },
             { id: "btn_scan_to_pc2",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_pc2", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } },
             { id: "btn_scan_to_pc3",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_pc3", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } },
             { id: "btn_scan_to_pc4",   type: WidgetLib.ButtonType.NORMAL, attr: { targetImgId: "img_scan_to_pc4", offImg: Img.ICN_CF_CANCEL_OFF, pressImg: Img.ICN_CF_CANCEL_PRESS, disableImg: Img.ICN_CF_CANCEL_DIS } },
         ],
         imageList: [
             { id: "img_usb_input", src:Img.IMG_USB_INPUT},
             { id: "img_center_line", src:Img.IMG_CENTER_LINE}
         ],
         textList: [
             { id: "lbl_scan_to_usb",    text: Msg.SCAN_TYPE_SELECT.TYPE_USB },
             { id: "msg_not_scan_to_usb",    text: Msg.SCAN_TYPE_SELECT.NOT_USB },
             { id: "lbl_scan_to_pc0",    text: Msg.SCAN_TYPE_SELECT.TYPE_PC0 },
             { id: "lbl_scan_to_pc1",    text: Msg.SCAN_TYPE_SELECT.TYPE_PC1 },
             { id: "lbl_scan_to_pc2",    text: Msg.SCAN_TYPE_SELECT.TYPE_PC2 },
             { id: "lbl_scan_to_pc3",    text: Msg.SCAN_TYPE_SELECT.TYPE_PC3 },
             { id: "lbl_scan_to_pc4",    text: Msg.SCAN_TYPE_SELECT.TYPE_PC4 },
         ]
     };
 };
 
 ScanTypeSelectPage._onPageChange = function() {
     this.updateDisplay();
 };
 
 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
  ScanTypeSelectPage.updateDisplay = function() {
     var obj = document.getElementById(ScanTypeSelectPage.ID);
     var pageHeight = glbInfo.screenHeight - 40;
     obj.style.height = pageHeight.toString() + "px";
     obj.style.width = glbInfo.screenWidth.toString() + "px";
     if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		Common.setPosition("lyr_scan_type_select_wrapper", "left", "112px");
	}
     var barObj = document.getElementById("img_center_line");
     var barHeight = pageHeight - 20;
     barObj.style.height = barHeight.toString() + "px";
     
     if((glbConfigData.SERVICE.SCAN_TYPE == SCAN_TYPE_CHECK.USB)||(glbConfigData.SERVICE.SCAN_TYPE == SCAN_TYPE_CHECK.USB_PC)){
        WidgetLib.setWidgetStatus("btn_scan_to_usb", { enable: true });
        Common.changeVisibility("img_usb_input","block");
        Common.changeVisibility("btn_scan_to_usb","block");
        Common.setText("msg_not_scan_to_usb", "");
        //Common.setText("msg_not_scan_to_usb", Msg.SCAN_TYPE_SELECT.NOT_USB);
     }else{
        WidgetLib.setWidgetStatus("btn_scan_to_usb", { enable: false });
        Common.changeVisibility("img_usb_input","none");
        Common.changeVisibility("btn_scan_to_usb","none");
        Common.setText("msg_not_scan_to_usb", Msg.SCAN_TYPE_SELECT.NOT_USB);
        //Common.setText("msg_not_scan_to_usb", "");

     }

     if((glbConfigData.SERVICE.SCAN_TYPE == SCAN_TYPE_CHECK.PC)||(glbConfigData.SERVICE.SCAN_TYPE == SCAN_TYPE_CHECK.USB_PC)){
        for(var i = 0; i < 5; i++ ){
            if(glbConfigData.SCAN_PC_IP[i] != ""){
                this.scanBtnlblSet();
                WidgetLib.setWidgetStatus("btn_scan_to_pc" + i.toString(), { enable: true });
            }else{
                WidgetLib.setWidgetStatus("btn_scan_to_pc" + i.toString(), { enable: false });
            }
        }
     }else{
        for(var i = 0; 5 > i; i++ ){
            WidgetLib.setWidgetStatus("btn_scan_to_pc" + i.toString(), { enable: false });
        }
     }

 };
 ScanTypeSelectPage.scanBtnlblSet = function() {
    for(var i = 0; i < 5; i++){
        if(glbConfigData.SCAN_PC_NAME[i] != ""){
            Common.setText("lbl_scan_to_pc" + i.toString(), glbConfigData.SCAN_PC_NAME[i]);
        }
    }
 }
 
 /**
  * 개별 페이지의 Event처리
  * @param {string} event : Event종류
  * @param {string} id : Event발생원
  */
  ScanTypeSelectPage.EventHandler = function(event, id) {
     switch (event) {
         case "onbuttonup":
             switch (id) {
                 case "btn_OTID_confirm":
                     BrowserExt.Beep(0);
                     var tbxOTID = document.getElementById("tbx_OTID");
                     if (!tbxOTID.value) {
                         BrowserExt.Beep(1);
                         return;
                     }
                     WidgetLib.setWidgetStatus("btn_OTID_confirm", { enable: false });
                     glbInfo.userId = tbxOTID.value;
                     SSMILib.GetPrintInformation(6000, DATA.SERVER_URL, glbInfo.userId);
                     tbxOTID.value = "";
                     break;
                 case "btn_OTID_cancel":
                     BrowserExt.Beep(0);
                     var tbxOTID = document.getElementById("tbx_OTID");
                     tbxOTID.value = "";
                     PageManager.changePage(PageManager.getPrevPage(), PageManager.type.ROLLBACK);
                     break;
             }
             break;
         case "onhardkeydown":
             switch (id) {
                 case BrowserExt.keyCode.FX_VK_PAUSE:
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
                 default:
                     BrowserExt.Beep(1);
                     break;
             }
             break;
         default:
             break;
     }
 };
 