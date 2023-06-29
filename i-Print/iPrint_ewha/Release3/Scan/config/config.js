var CONFIG = {
    ENV: {
        LOGO_PATH: "./skin/CS_LOGO_48.png",

        LOGIN_INFO: {
            ID: "ch",
            PASSWORD: "1212",
            KO_ID: "11111",
            KO_PASSWORD: "x-admin",
        },
        MAILBOX: { //glbConfig.mailboxId, glbConfig.mailboxPassword
            BOX_NO: 1,
            PASSWORD: ""
        },
        TIMEOUTS: {
            GETJOB_DELAY: 500, // Job Log 취득시 Delay
            CHARGEINFO: 5000, // 과금 결제 Duration (Default:1분)
            CAMPAIGN_FADEINOUT: 2500 //프린팅시 캠페인 페이지 Fade In Out Duration
        },
        COUNTER: {
            //PRINTING : 30,
            GETJOB_DELAY: 45
        },

        FTPServer : {
        	URL : "ftp://cloud.svr01.i-print.co.kr", //ex) ftp://13.197.1.97/home
        	ID : "iprint_scan",
        	PW : "scan12345"
          //ID : "iprint_copy",
        	//PW : "copy12345"
        }
    },
    MODE: {
        PAGE_SPLIT_USABLE: false,
        DADF_ONLY: false,
        _8BIT_DISPLAY: false,
        isSHA: false
    },
    defaultValue: {
    	headPosition: "Top",
    	inplex: "Simplex",
        resolution:"300x300/dpi",//"200x200/dpi" "400x400/dpi" "600x600/dpi"
        imageMode: "mixed",
        docFormat: 'PDF', // 'PDF' or 'JFIF'
        colorMode: "C", //흑백기일때 "B"로 설정
        bgElimination: false,
        darkness: 0
    }
};
