/**
 * @fileoverview 프린트중 팝업
 * @author FXKIS son.ch
 * @version 1.0.0
 */
/**
 * 개별 페이지의 표시 및 동작용
 * 프린트중 팝업
 */
var PrintingPopup = new TemplatePage();

PrintingPopup.ID = "pop_printingPopup";

/**
 * 개별 페이지의 Data정의
 */
PrintingPopup._initModel=function()
{
	this._data=
	{
		buttonList:[
		],
		imageList:[
		           {id:"img_printing_progress_bar", src:Img.PROGRESS_BAR} //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		],
		textList:[
		          {id:"lbl_printing_progress", text:Msg.Page.PrintingPopup.lblPrinting} //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		]
	};
	this._imgListSetting();//imageList 설정
};

PrintingPopup._imgListSetting = function(){
	////2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
	/*(glbConfig.campaignImg.length==0)?this._data.imageList.push({id:"img_printer",src:Img.IMG_PP_PRINTER}):""; //Default 이미지 설정
	for(i in glbConfig.campaignImg){
		this._data.imageList.push({id:"img_printer"+i,src:"./skin/"+glbConfig.campaignImg[i]});
	}*/
};

PrintingPopup._onPageChange = function(){
	//var className = "pattern-background";
	//var pageObj = document.getElementById(PrintingPopup.ID);
	//if(pageObj && pageObj.classList && !pageObj.classList.contains(className)) pageObj.classList.add(className);
	
	this.updateDisplay();
	//Common.startJobFound();
};
PrintingPopup._onPageLeave = function(){
	//this.clearAnimation();//2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
};

/**
 * 화면 표시의 갱신 (공통/화면전환시에 호출된다.)
 */
PrintingPopup.updateDisplay = function(){
	//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
	/*if(glbConfig.campaignImg.length==0){
		PrintingPopup.setAnimation_Default();//Printing 기본 출력이미지 표시
	}else{
		PrintingPopup.setAnimation_CampainImg();//캠페인 이미지 표시
	}*/
	
	if(glbChargeInit && glbChargeInit.paymentMethods == 'typeA'){ //2016.05.16 chone 신용/교통 카드 결제 요청 문구 추가, 신용카드 결제의 경우 response가 오기 전까지 결제 요청 문구 표시
		Common.setText("lbl_pay_amount", Msg.Page.PrintingPopup.lblRequestCardPayment);
		Common.changeVisibility("lbl_printing_progress", "none");
		return;
	}
	
	var info = this._dataSet.priceInfo;
	var totalPrice = Msg.UNIT.TOTALPRICE + formatWithRemainders(info.totalPrice) + " " + Msg.UNIT.WON;
	Common.setText("lbl_pay_amount", totalPrice);
};

PrintingPopup.updatePriceInfo = function()
{
	Common.changeVisibility("lbl_printing_progress", "block");

	var info = this._dataSet.priceInfo;
	var totalPrice = Msg.UNIT.TOTALPRICE + formatWithRemainders(info.totalPrice) + " " + Msg.UNIT.WON;
	Common.setText("lbl_pay_amount", totalPrice);
};

/**
 * 프린팅 애니메이션 (캠페인 이미지 fadeIn/Out 표시)
 */
PrintingPopup.setAnimation_CampainImg = function(){
	var slider = document.getElementById("slider");
	var slideArray = slider.getElementsByTagName("li");
	var slideMax = glbConfig.campaignImg.length - 1;
	var curSlideNo = 0;
	var nextSlideNo =null;
	var fadeStart = false;
	var curSlideLevel = 1;
	var nextSlideLevel = 0;

	for (i = 0; i <= slideMax; i++) {(i == curSlideNo) ? changeOpacity(slideArray[i], 1) : changeOpacity(slideArray[i], 0);}

	function startSlide(dir){
		if (fadeStart === true) return;
		
		if( dir == "prev" ) {
			nextSlideNo = curSlideNo - 1;
			( nextSlideNo < 0 ) ? (nextSlideNo = slideMax):"";
		} else if( dir == "next" ) {
			nextSlideNo = curSlideNo + 1;
			( nextSlideNo > slideMax ) ? (nextSlideNo = 0):"";
		} else {
			fadeStart = false;
			return;
		}
		
		fadeStart = true;
		changeOpacity(slideArray[curSlideNo], curSlideLevel);
		changeOpacity(slideArray[nextSlideNo], nextSlideLevel);
		fadeInOutAction(dir);
	}

	function fadeInOutAction(dir){
		curSlideLevel = curSlideLevel - 0.1;
		nextSlideLevel = nextSlideLevel + 0.1;
		if( curSlideLevel <= 0 ) {
			changeOpacity(slideArray[curSlideNo], 0);
			changeOpacity(slideArray[nextSlideNo], 1);
			if(dir == "prev"){
				curSlideNo = curSlideNo - 1;
				curSlideNo = (curSlideNo < 0) ? slideMax : curSlideNo;
			}else {
				curSlideNo = curSlideNo + 1;
				curSlideNo = (curSlideNo > slideMax) ? 0 : curSlideNo;
			}
			curSlideLevel = 1;
			nextSlideLevel = 0;
			fadeStart = false;
			return;
		}
		changeOpacity(slideArray[curSlideNo], curSlideLevel);
		changeOpacity(slideArray[nextSlideNo], nextSlideLevel);
		setTimeout(function() {
			fadeInOutAction(dir);
		},100);
	}

	function changeOpacity(obj,level) 
	{
		obj.style.opacity = level; 
		obj.style.MozOpacity = level; 
		obj.style.KhtmlOpacity = level;
		//obj.style.MsFilter = "'progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (level * 100) + ")'";
		obj.style.filter = "alpha(opacity=" + (level * 100) + ");"; 
	}

	//x초마다 Fade In/Out 슬라이드를 반복하는 코드
	this.timer = setInterval( function(){startSlide('next');}, CONFIG.ENV.TIMEOUTS.CAMPAIGN_FADEINOUT||"2500");
}

/**
 * 프린팅 애니메이션
 */
PrintingPopup.setAnimation_Default = function(){
	var i = 0;
	//var node = document.getElementById("printing_animation");
	var node = document.getElementById("lyr_PP_aniWrapper");
	var duration = 100;
	/*setTimeout(function(){
		var node = document.getElementById("printing_animation");
		node.style.left = "318px";
	},(3*duration));*/
	this.timer = setInterval(function(){ node.className = "ani"+ ((i<10)? "0"+i : i); i++; if(i==20) i=11; },duration);
};

/**
 * 프린팅 애니메이션 해제
 */
PrintingPopup.clearAnimation = function(){
	clearTimeout(this.timer);
};

/**
 * 개별 페이지의 Event처리
 * @param {string} event : Event종류
 * @param {string} id : Event발생원
 */
PrintingPopup.EventHandler = function(event, id)
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
		case "onhardkeydown":
			MessageManager.clearMessageArea();
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