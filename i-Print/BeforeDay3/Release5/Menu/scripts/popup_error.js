/**
 * @fileoverview : 에러 팝업
 * @author FXKIS son.ch
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * （에러 팝업/적색）
 */
var ErrorPopup = new TemplatePage();

ErrorPopup.ID = "pop_errorPopup";
ErrorPopup.pageType = "Special";

/**
 * 개별 페이지의 Data정의
 */
ErrorPopup._initModel=function()
{
	this._data=
	{
		buttonList:[
		],
		imageList:[
			{id:"img_CEP_bg",	src:Img["IMG_POPUP_ERROR_BG"]}
		],
		textList:[
		]
	};
};

/**
 * 화면 표시의 갱신(공통/화면전환시에 호출된다.)
 */
ErrorPopup.updateDisplay=function(){
	BrowserExt.Beep(1);
	var arg=this._message;
	Common.setText("lbl_CEP_title",arg.title);
	
	var il=arg.message.length;
	for(var i=0;i<12;i++)
	{
		if(i<il){	tmp=arg.message[i];	}
		else{	tmp="";	}
		
		Common.setText("txt_CEP_msg"+i,tmp);
	}
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
ErrorPopup.EventHandler = function(event, id)
{
	switch(event){
		case "onbuttonup":
			MessageManager.clearMessageArea();
			switch(id)
			{
				default:
					BrowserExt.Beep(1);
					break;
			}
			break;
		case "onbuttondown":
			MessageManager.clearMessageArea();
			break;
		case "onhardkeydown":
			MessageManager.clearMessageArea();
			switch(id)
			{
				case BrowserExt.keyCode.FX_VK_CLEAR:
					//リセットキー
					BrowserExt.Beep(0);
					BrowserExt.SetScreenChange("allservice");
					break;
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