/**
 * @fileoverview : 페이지의 전환을 관리
 * @author FXKIS son.ch
 * @version 1.0.0
 */
var PageManager=
{
	/**
	 * 페이지 전환 유형
	 * @NORMAL: 하위 페이지로의 전환
	 * @CONFIRM:상위 페이지로의 전환(Data갱신을 반영한다.)
	 * @CANCEL: 상위 페이지로의 전환(Data갱신을 반영하지 않는다.)
	 */
	type:{NORMAL:0,CONFIRM:1,CANCEL:2,RUN:3,MODAL:4,ROLLBACK:5},
	//현재 페이지의 Class
	currentPage:null,
	//이전 페이지의 Class
	prevPage:null,
	//화면 전환 이력
	history:[],
	//페이지 래퍼DOM
	pageWrapperObj:null,
	
	/**
	 * 현재 페이지의 취득
	 */
	getCurrentPage:function(){
		return this.currentPage;
	},
	
	/**
	 * 이전 페이지의 취득
	 */
	getPrevPage:function(){
		return this.prevPage;
	},
	
	init:function(id){
		this.pageWrapperObj = document.getElementById(id);
	},
	
	/**
	 * 페이지 전환 처리를 한다
	 * @param {page} newPage : 전환 대상 페이지 
	 * @param {PageManager.type} type : 전환 종류
	 */
	changePage:function(newPage,type){
		//console.log("pageManager/changePage");
		if(newPage == null){
			return;
		}
		//페이지 갱신 Case
		if(this.currentPage!=null)
		{
			if(newPage)
			{
				if(this.currentPage.ID != newPage.ID)
				{
					//if(!Common.contains([ErrorPopup.ID,WarnPopup.ID,WaitingPage.ID,PrintingPopup.ID],this.currentPage.ID)){
					if(this.currentPage.pageType == "Normal"){
						this.prevPage = this.currentPage;
						this.history.push(this.currentPage.ID);
					}
					
					//이전 페이지의 HTML을 비표시로 한다.
					var prevPageObj = WidgetLib.getWidgetNode(this.currentPage.ID);
					//prevPageObj.className = "page";
					prevPageObj.className = (type == this.type.MODAL)?"page basePage":"page";
					this.currentPage._onPageLeave();
					//document.body.removeChild(prevPageObj);

					//페이지 Data의 이행
					if(type == this.type.CANCEL)
					{
						//Rollback
						this.currentPage.rollBack();
					}
				}
			}
		}

		this.currentPage = newPage;

		//현재 페이지를 취득
		var currentPageObj = WidgetLib.getWidgetNode(this.currentPage.ID);
		if(!currentPageObj)	//등록이 안되어있는 경우 등록 및 초기화를 실행
		{
			//페이지가 정의 되지 않은 경우, 페이지를 초기화 한다.
			this.currentPage._initialize();
			WidgetLib.registerWidgetById(this.currentPage.ID);
			currentPageObj = WidgetLib.getWidgetNode(this.currentPage.ID);
			
			//현재 페이지를 HTML에 붙여넣는다
			this.pageWrapperObj.appendChild(currentPageObj);
		}
		//NORMAL/CONFIRM의 Data를 이행한다.
		if(type == this.type.NORMAL || type == this.type.CONFIRM)
		{
			if(this.prevPage && this.prevPage!==this.currentPage) {
				this.currentPage.deepCopy(this.prevPage._dataSet);
			}
		}
	
		MessageManager.key = this.currentPage.key;

		//현재 페이지 Data를 전역 Data에 대한 참조를 건다. (충돌 처리에 사용하는 등...)
		this.currentPage.store();
		glbDataSet = this.currentPage._dataSet;
		
		if(type!=this.type.ROLLBACK) this.currentPage._onPageChange();
		//현재 화면의 표시갱신을 한다.
		//this.currentPage.updateDisplay()

		//currentPageObj.className = "page focused";
		//currentPageObj.classList.add("focused");
		currentPageObj.className = (type == this.type.MODAL)?"page modal":"page focused";
		
		if(this.prevPage!=null) {
			var prevPageObj = WidgetLib.getWidgetNode(this.prevPage.ID);
			//document.body.removeChild(prevPageObj);
		}
	}
};