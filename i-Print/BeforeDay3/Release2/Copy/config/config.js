var CONFIG = {
	ENV : {
		LOGO_PATH : "./skin/CS_LOGO_48.png",
		
		LOGIN_INFO:{
			ID :"ch",
			PASSWORD : "1212",
			KO_ID:"11111",
			KO_PASSWORD:"x-admin",
		},
		MAILBOX:{//glbConfig.mailboxId, glbConfig.mailboxPassword
			BOX_NO:1,
			PASSWORD:""
		},
		TIMEOUTS :{
			GETJOB_DELAY : 500, // Job Log 취득시 Delay
			CHARGEINFO : 60000, // 과금 결제 Duration (Default:1분)
			CAMPAIGN_FADEINOUT : 2500 //프린팅시 캠페인 페이지 Fade In Out Duration
		},
		COUNTER : {
			//PRINTING : 30,
			GETJOB_DELAY: 45
		},
		//FILE_SERVER : "192.168.11.50",
		FILE_SERVER : "192.168.0.209",
		FILE_SERVER_PORT : "9999",
		FILE_SERVER_SSL : false,
		FTPServer : {
      			//URL : "ftp://192.168.11.50", //ex) ftp://13.197.1.97/home
	  			URL : "ftp://cloud.svr01.i-print.co.kr", //ex) ftp://13.197.1.97/home
      			ID 	: "iprint_copy",
      			PW 	: "copy12345"
				//ID 	: "ohdongseok",
      			//PW 	: "breeze121"
    		},
		CAMPAIGN_IMG : [], //Default
		//CAMPAIGN_IMG : ["SNU_GreenCampain0.png","SNU_GreenCampain1.png","SNU_GreenCampain2.png"], //켐페인 이미지 최대 5개까지 설정가능
		SUPPORT_PAPER_SIZE : ["A4","B5","B4","A3"] //지원가능한 용지 A4,A3,B4,B5,8.5x11,8.5x13,8.5x14,11x17
	},
	MODE:{
		MAGNIFICATION_ENABLE : true,
		PAGE_SPLIT_USABLE : true,
		DADF_ONLY : false,
		_8BIT_DISPLAY:false,
		isSHA : false
	},
	defaultValue : {
		pageType : "Portrait",
		inplex : "Simplex",
		outplex : "Simplex",
		magnification : "100",//2016.09.29 KIS Chone 배율 디폴트 값 [출력용지맞춤]으로 변경 refs #4069
		nup : 1,
		colorMode : "B",//흑백기일때 "B"로 설정
		headPosition : "Top",
		bgElimination : false,
		imageMode : "mixed",
		darkness : 0,
		//resolution:"200x200/dpi"
		//resolution:"300x300/dpi"
		//resolution:"400x400/dpi"
		resolution:"600x600/dpi"
	}
};