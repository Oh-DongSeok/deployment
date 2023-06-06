/**
 * @fileoverview Preference Page
 * @author FBKR Oh Dongseok
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
 var PreferencePage2 = new TemplatePage();
 PreferencePage2.ID = "page_preference2";
 
 /**
  * 개별 페이지의 Data정의
  */
 PreferencePage2._initModel=function()
 {
     this._data=
     {
         buttonList:[
             {id: "btn_PF2_setting_save", 	type: WidgetLib.ButtonType.NORMAL},
             {id: "btn_PF2_setting_cancel", type: WidgetLib.ButtonType.NORMAL},
             {id: "btn_PF2_mfd_home", 		type: WidgetLib.ButtonType.NORMAL}
         ],
         imageList:[
         ],
         textList:[
             {id:"tit_PF2_title",     	text:Msg.PreferencePage2.LBL_Title},
         ]
     };
 };
 //Css 보정 (TODO 이후 언어별 css파일로 관리필요)
 PreferencePage2.cssChange = function()
 {
     document.getElementById(PreferencePage2.ID).style.height = glbInfo.pageHeight.toString() + "px";
     if(glbInfo.screenType == BrowserLib.ScreenType.WSVGA_ALL_SCREEN){
		document.getElementById(PreferencePage2.ID).style.width = glbInfo.screenWidth.toString() + "px";
		document.getElementById("btn_PF2_setting_save").style.left = "809px";
		document.getElementById("btn_PF2_setting_cancel").style.left = "914px";
	}
 }
 PreferencePage2._onPageChange = function(){
     KISUtil.debug("Preference Page:","excute");
     this.cssChange();
     this.updateDisplay();
 };
 
 /**
  * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
  */
 PreferencePage2.updateDisplay = function(){
    for(var i = 0; i < 5;i++){
        document.getElementById("tbx_PF2_pc_ip" + i.toString()).value = glbConfigData.SCAN_PC_IP[i];
        document.getElementById("tbx_PF2_pc_name" + i.toString()).value = glbConfigData.SCAN_PC_NAME[i];
    }
 };
 
 /**
  * 개별 페이지의 Event처리
  * @param {string} event : Event종류
  * @param {string} id : Event발생원
  */
 PreferencePage2.EventHandler = function(event, id)
 {
     switch(event){
         case "onbuttonup":
             switch(id)
             {
                 default:
                     BrowserExt.Beep(1);
                     break;
             }
             break;
         case "onhardkeydown":
             switch(id)
             {
                 case BrowserExt.keyCode.FX_VK_PAUSE:
                     break;
                 default:
                     BrowserExt.Beep(1);
                     break;
             }
             break;
         default:
             break;
     }
 };