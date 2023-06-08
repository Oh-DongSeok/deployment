﻿var Msg = {};
var Msg_default = {
	Common : {
		CSName : "",
		UnknownUserName : "_No User",
		StartGuide:"인증을 하시기 바랍니다."
	}
};
var Msg_lang = {
	en:{
		CommonLbl : {
			lbl_POPUP_confirm	:	"Setting",
			lbl_POPUP_cancel	:	"Cancel",
			lbl_POPUP_close	:	"Close",
			logout				:	"Select a services",
			title:"Copy Services"
		},
		Func:{
			plex:{
				simplex:"1 Side",//2016.05.25 chone 다언어대응
				duplex:["2 Side", "(Left and Right)"],//2016.05.25 chone 다언어대응
				tumble:["2 Side", "(Up and Down)"]//2016.05.25 chone 다언어대응
			},
			magnification:{
				fix100:"100%",//2016.05.25 chone 다언어대응
				auto:"Auto detected",
				other:"Other"
			},
			nup:{
				none:"off",
				two:"2up",
				four:"4up",
				eight:"8up"
			},
			colorMode:{
				color:"Color",
				bw:"B & W"//2016.05.25 chone 다언어대응
			},
			imageMode:{
				mixed:"Text/Picture",
				text:"Text",
				photo:"Picture"
			},
			headPosition:{
				top:"Upright",//2016.05.25 chone 다언어대응
				left:"Sideways"//2016.05.25 chone 다언어대응
			},
			bgElimination:{
				none:"Off",
				set:"Select"
			},
			tray:{
				auto:"Auto detect",//2016.05.26 chone 다언어대응 - 용지 사이즈 영어 번역
				stationary:"Plain",
				fineQuality:"Bond",
				transparency:"OHP",
				labels:"Label",
				coated:"Coating",
				heavyWeight:"Heavyweight1",
				"heavyWeight(reverse)":"Heavyweight1(Verso)",
				heavyWeight2:"Extra Heavyweight2",
				"heavyWeight2(reverse)":"Extra Heavyweight2(Verso)",
				recycled:"Recycled",
				customPaper:"Custom1",
				customPaper2:"Custom2",
				customPaper3:"Custom3",
				customPaper4:"Custom4",
				customPaper5:"Custom5",
				heavyWeightA:"Heavy1(A)",
				heavyWeightB:"Heavy1(B)",
				heavyWeightC:"Heavy1(C)",
				heavyWeightS:"Heavy1(S)",
				heavyWeight2A:"Heavy2(A)",
				heavyWeight2B:"Heavy2(B)",
				heavyWeight2C:"Heavy2(C)",
				heavyWeight2D:"Heavy2(D)",
				heavyWeight2S:"Heavy2(S)",
				reverse:"Used paper",
				"recycled(reverse)":"Recycled(Verso)",
				"pre-punched":"Punched",
				letterhead:"Letterhead",
				preprinted:"Pre-printed",
				customPaper6:"Custom6",
				customPaper7:"Custom7",
				customPaper8:"Custom8",
				customPaper9:"Custom9",
				customPaper10:"Custom10",
				customPaper11:"Custom11",
				customPaper12:"Custom12",
				customPaper13:"Custom13",
				customPaper14:"Custom14",
				customPaper15:"Custom15",
				customPaper16:"Custom16",
				customPaper17:"Custom17",
				customPaper18:"Custom18",
				customPaper19:"Custom19",
				customPaper20:"Custom20",
				other:"Other"
			},
			resolution : {
				dpi200 : "200dpi",
				dpi300 : "300dpi",
				dpi400 : "400dpi",
				dpi600 : "600dpi"
			},
			docFormat : {
				pdf : "PDF",
				jpg : "JPEG"
			}
		},
		UNIT:{
			PAGE:"Page",
			PRN_SET:"Number of copies",
			WON : "",//2016.05.25 Chone 다언어대응
			TOTALPRICE : "The total amount: " //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		ERROR_MSG:{
			//공통
			FAIL_NOT_INPUT_USER_INFO : ["Please enter your fax number."],
			FAIL_ENV : ["The environment configuration is incorrect.","","Please contact administrator."],
			FAIL_COMM:["A failure occurred during communication.","","Please contact administrator."],
			FAIL_TIMEOUT : ["A failure occurred during communication.","","Please contact administrator."],
			FAIL_OTHERS : ["Unknown failure has occurred.","","Please contact administrator."],
			
			//트레이
			USABLE_TRAY_NOT_FOUND:["No available Tray.", "After checking the tray, please try again."],
			
			//Job실행
			TOO_MANY_JOBS:["There are jobs that are already running,","you can not run the copy.","Please check the list of tasks"],
			//스캔실행
			FAIL_SCAN_JOB:["Failed to scan.","Please contact administrator."],
			USE_GLASS_FOR_PAGESPLIT:["In the book copy selected,","you can not use the automatic document feeder.","","Please try again put the book on the flatbed glass."],
			INTERUPTED_SCAN_JOB:["Scanning has stopped."],
			//프린트실행
			INTERUPTED_PRINT_JOB:["Printing has stopped."],
			FAIL_PRINT_JOB:["Failed to print.","Please contact administrator."],
			FAIL_PRINT_REFUND : ["The job can not be printed and the job is terminated."]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		},
		Comflict : {
			colorMode : "컬러 모드를 [컬러]로 변경했습니다",
			docFormat : "문서 종류를 [PDF]로 변경했습니다"
		},
		Page:{
			Main:{
				inputInfo: "Enter the fax number to send",
				inputInfo2: "The phone number to receive the result",
				titFaxNumber : "Enter fax number",
				titTelNumber : "Phone number",
				titPageType : "Input Direction",
				titMagnification : "Reduce/Enlarge",
				//titNup : "다중이미지",
				titTray : "Paper supply",
				titColorMode : "Output color",
				titPageSet:"Copies",//2016.05.25 Chone 다언어대응
				titInplex : "Originals 2 Sided",//2016.05.25 Chone 다언어대응
				titOutplex : "Output 2 Sided",//2016.05.25 Chone 다언어대응
				lblEtcFunc : "Other features",
				//lblUsbChk : "Copy To USB",
				lblStart : "Scan",
				lblUtilStr : "",			  //2016.05.25 chone 다언어대응
				//slideTrayDis : ["트레이의 정보를 취득중입니다.","잠시후 다시 시도하시기 바랍니다."],
				//slideCopiesOver : ["입력가능한 매수는 3자리수입니다."],
				//slideCopiesOverMinVal : ["복사 매수의 최솟값은 1입니다."],
				//slideCopiesOverMaxVal : ["복사 매수의 최댓값은 999입니다. "],
				//slideCopiesOverMin : ["최소 복사 매수에 도달하였습니다."],
				//slideCopiesOverMax : ["최대 복사 매수에 도달하였습니다."],
				slideChangeTray : ["As the scale selected in the output paper,","select the custom paper selection is changed to Nnn."],
				slideChangeMagnifi : ["As selected by Auto detect,", "the magnification is change to the same magnification."],
				slideStartTrayDis : ["Getting information of the tray. After a while, please try again."],
				titResolution : "Resolution",
				titDocFormat : "Doc Format"
			},
			Etc:{
				lblMainPage:"Main screen",
				lblStart : "Scan",
				lblPageType : "Original direction",
				lblHeadPosition : "Original direction set",
				lblBgElimination : "Remove background",
				lblImageMode : "Document type",
				lblDarkness : "Lighten/Darken",
				lblPageSplit:"Book copying"
			},
			TraySelectionPopup:{
				guide:["Can not measure the size of the output paper.","","To continue, please select the paper(tray)."],
				confirm:"Confirm",
				cancel:"Cancel"
			},
			WarnPopup:{
				title:"Warning",
				btnClose:"Close"
			},
			CONFIRM:{
				BTN_CONFIRM:"Confirm",
				BTN_CANCEL:"Cancel",
				GUIDE_SEVICE_SELECT:["Would you like to return to the Service screen?"],
				GUIDE_LOGOUT:["Do you want to log out?"],
			},
			Printing:{
				msg1:"Printing.."
			},
			ResultPopup:{
				eco_text:"You saved Nnn sheets of paper."
			},
			ChargeInfoPopup:{
				title:"Payment notification",
				btnDirectConfirm:"Payment to T-money / Credit card",
				btnCyberConfirm:"Payment to Charge",
				btnCancel:"Cancel",
				//msg1:"Charge is ",
				//msg2:"Won.",
				//msg3:"After touch card to the terminal, Please push the confirm button."
				//,currency:"￦"
				oms:"Output paper size:",
				colorMode:"Output color:",
				pages:"Number of original document:",
				outplex:"Output type:",
				unitPrice:"Fax price:",
				copiesPrice:"Cost per copies:",
				copies:"Number of copies:",
				totalPrice:"The total amount:",
				msg1:"When you use your credit card or transportation card,",
				msg2:"touch the payment button after putting the card on the terminal."
			},
			ErrorPopup:{
				title:"Error",
				btnClose:"Close"
			},
			MagnificationPopup:{
				titMagpanel:"Reduce/Enlarge set",
				lblMag:"Reduce/Enlarge",
				lblMagExpain:"(25~400%)",
				titMagPreset:"Quick Settings",
				lblMagFix100:"The same magnification(100%)",
				lblMagAuto:"Auto detected",
				titMagInputMS:"Original paper size",
				titMagOutputMS:"Copy paper size",
				titMagTray:"Output paper select",
				lblMSA3:"A3",
				lblMSA4:"A4",
				lblMSB4:"B4",
				lblMSB5:"B5",
				lblMSAuto:"Auto",
				lblMagCancel:"Cancel",
				lblMagConfirm:"Setting",
				lblHyphen:"-",
				lblPercent:"%",
				//slideMagAlertMinVal : ["배율의 최솟값은 25입니다."],
				//slideMagAlertMaxVal : ["배율의 최댓값은 400입니다."],
				//slideMagOverMin : ["최소배율에 도달하였습니다."],
				//slideMagOverMax : ["최대배율에 도달하였습니다."],
				slideMagUnusableStart : ["In the magnification pop-up, you can not run the copy.", "Please run in the main screen or other setting screens."],
				slideNotReadyTray : ["This paper is not ready on the tray."],
				slideMagSetAuto : ["You have selected the magnification, select [Custom Paper output].Please select the paper size to be printed."],
				lblSetMagExplain:"※ Document / Output paper size when magnification (enlarge/reduce) is set."
			},
			pageSplit:{
				titPageSplit:"Book copying",
				lblPsDirection:"Original orientation",
				lblPsOff:"Off",
				lblLeftRigth:["Left page", "than right"],
				lblRigthLeft:["Right page", "than left"],
				lblTopBottom:["Top page", "than bottom"],
				lblPsOrder:"Scan / Order",
				lblBothPage:"Both pages",
				lblLeftPage:"Left page",
				lblRightPage:"Right page",
				lblTopPage:"Up page",
				lblBottomPage:"Down page",
				lblExplain:"This feature scans both sides of a page of expanded  that separate copy of the manuscript of two sheets of paper.",
				lblCenterErase:"Binding edge erase",
				lblCenterEraseRange:"(0~50mm)",
				lblSubExplain:"Please set the document as follows.",
				//slideCEOverMin : ["중앙선 지움의 최솟값에 도달하였습니다."],
				//slideCEOverMax : ["중앙선 지움의 최댓값에 도달하였습니다."],
				//slideCEOverMinVal : ["중앙선 지움의 최댓값은 0입니다."],
				//slideCEOverMaxVal : ["중앙선 지움의 최댓값은 50입니다."],	
				slideMagUnusableStart : ["You can not run the copy in the book settings pop-up.", "Please run in the main screen or other setting screens."],
				slideChgHeadPositionTop : ["The original set direction has been changed to LEF."],
				slideChgHeadPositionLeft : ["The original set direction has been changed to SEF."]
			},
			PaymentPopup : {//2016.05.12 chone 신용/교통 카드 결제 요청 문구 추가
				lblRequestCardPayment : "Please make a payment from card terminal."
			},
			PrintingPopup : {//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblPrinting : "Printing..."
			},
			Comflict : {
				colorMode : "컬러 모드를 [컬러]로 변경했습니다",
				docFormat : "문서 종류를 [PDF]로 변경했습니다"
			}
		}
	},
	ko:{
		CommonLbl : {
			lbl_POPUP_confirm	:	"설정",
			lbl_POPUP_cancel	:	"취소",
			lbl_POPUP_close	:	"닫기",
			logout				:	"서비스선택으로",
			title:"팩스 서비스"
		},
		Func:{
			plex:{
				simplex:"단면",
				duplex:"양면(좌우)",
				tumble:"양면(상하)"
			},
			magnification:{
				fix100:"1:1 원본사이즈", //2016.09.28 KIS Chone 용어 변경 refs #4070
				auto:"출력용지맞춤",
				other:"기타"
			},
			nup:{
				none:"선택안함",
				two:"2up",
				four:"4up",
				eight:"8up"
			},
			colorMode:{
				color:"컬러",
				bw:"흑백"
			},
			imageMode:{
				mixed:"문자/사진",
				text:"문자",
				photo:"사진"
			},
			headPosition:{
				top:"바로놓기",
				left:"돌려놓기"
			},
			bgElimination:{
				none:"선택안함",
				set:"선택함"
			},
			tray:{
				auto:"자동",
				stationary:"보통지",
				fineQuality:"고급 백상지",
				transparency:"OHP 필름",
				labels:"라벨용지",
				coated:"코팅용지",
				heavyWeight:"중량지1",
				"heavyWeight(reverse)":"중량지1(뒷면)",
				heavyWeight2:"중량지2",
				"heavyWeight2(reverse)":"중량지2(뒷면)",
				recycled:"재생용지",
				customPaper:"사용자용지1",
				customPaper2:"사용자용지2",
				customPaper3:"사용자용지3",
				customPaper4:"사용자용지4",
				customPaper5:"사용자용지5",
				heavyWeightA:"중량지1(A)",
				heavyWeightB:"중량지1(B)",
				heavyWeightC:"중량지1(C)",
				heavyWeightS:"중량지1(S)",
				heavyWeight2A:"중량지2(A)",
				heavyWeight2B:"중량지2(B)",
				heavyWeight2C:"중량지2(C)",
				heavyWeight2D:"중량지2(D)",
				heavyWeight2S:"중량지2(S)",
				reverse:"이면지",
				"recycled(reverse)":"재생용지(뒷면)",
				"pre-punched":"천공용지",
				letterhead:"레터 헤드",
				preprinted:"사전 인쇄 용지",
				customPaper6:"사용자용지6",
				customPaper7:"사용자용지7",
				customPaper8:"사용자용지8",
				customPaper9:"사용자용지9",
				customPaper10:"사용자용지10",
				customPaper11:"사용자용지11",
				customPaper12:"사용자용지12",
				customPaper13:"사용자용지13",
				customPaper14:"사용자용지14",
				customPaper15:"사용자용지15",
				customPaper16:"사용자용지16",
				customPaper17:"사용자용지17",
				customPaper18:"사용자용지18",
				customPaper19:"사용자용지19",
				customPaper20:"사용자용지20",
				other:"기타"
			},
			resolution : {
				dpi200 : "200dpi",
				dpi300 : "300dpi",
				dpi400 : "400dpi",
				dpi600 : "600dpi"
			},
			docFormat : {
				pdf : "PDF",
				jpg : "JPEG"
			}
		},
		UNIT:{
			PAGE:"쪽",
			PRN_SET:"부",
			WON : "원",
			TOTALPRICE : "총결제금액: " //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		ERROR_MSG:{
			//공통
			FAIL_NOT_INPUT_USER_INFO : ["FAX 번호를 입력해주세요."],
			FAIL_ENV:["환경구성이 바르지 않습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_COMM:["통신중 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_TIMEOUT:["통신중 장애(TimeOut)가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			FAIL_OTHERS : ["알수없는 장애가 발생했습니다.", "", "관리자에게 문의 바랍니다."],
			
			//트레이
			USABLE_TRAY_NOT_FOUND:["사용가능한 트레이가 없습니다.", "트레이를 점검후 다시 시도하시기 바랍니다."],
			
			//Job실행
			TOO_MANY_JOBS:["이미 실행 중인 일감이 있어 복사를 실행할 수 없습니다.", "작업 목록을 확인하시기 바랍니다."],
			//스캔실행
			FAIL_SCAN_JOB:["스캔에 실패했습니다.","","관리자에게 문의하시기바랍니다."],
			USE_GLASS_FOR_PAGESPLIT:["책복사를 선택한 상태에서는 ","자동 원고이송장치를 사용하실 수 없습니다.","","평판 글래스에 책을 올려놓고 다시 시도하시기 바랍니다."],
			INTERUPTED_SCAN_JOB:["스캔이 중지되었습니다."],
			//프린트실행
			INTERUPTED_PRINT_JOB:["프린트가 중지되었습니다."],
			FAIL_PRINT_JOB:["프린트에 실패했습니다.","","관리자에게 문의하시기바랍니다."],
			FAIL_PRINT_REFUND : ["프린트를 할 수 없어서 작업을 종료합니다"]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		},
		Comflict : {
			colorMode : "컬러 모드를 [컬러]로 변경했습니다",
			docFormat : "문서 종류를 [PDF]로 변경했습니다"
		},
		Page:{
			Main:{
				inputInfo: "보낼 팩스번호 입력",
				inputInfo2: "전송 실패시 받을 핸드폰번호",
				titFaxNumber : "팩스번호 입력",
				titTelNumber : "전화번호 입력",
				titPageType : "원고방향",
				titMagnification : "배율선택",
				//titNup : "다중이미지",
				titTray : "출력용지선택",
				titPageSet:"복사부수",
				titInplex : "원고양/단면",
				titOutplex : "출력양/단면",
				titDarkness : "농도",
				lblEtcFunc : "기타기능",
				//lblUsbChk : "Copy To USB",
				lblStart : "팩스",
				lblUtilStr : "",
				//slideTrayDis : ["트레이의 정보를 취득중입니다.","잠시후 다시 시도하시기 바랍니다."],
				//slideCopiesOver : ["입력가능한 매수는 3자리수입니다."],
				//slideCopiesOverMinVal : ["복사 매수의 최솟값은 1입니다."],
				//slideCopiesOverMaxVal : ["복사 매수의 최댓값은 999입니다. "],
				//slideCopiesOverMin : ["최소 복사 매수에 도달하였습니다."],
				//slideCopiesOverMax : ["최대 복사 매수에 도달하였습니다."],
				slideChangeTray : ["배율선택을 출력용지맞춤로 선택함에 따라 용지선택이 Nnn로","변경됩니다."],
				slideChangeMagnifi : ["용지선택을 자동으로 선택함에 따라 배율선택이 등배로 변경됩니다."],
				slideStartTrayDis : ["트레이의 정보를 취득중입니다.", "잠시후 다시 시도하시기 바랍니다."],
				titResolution : "해상도",
				titDocFormat : "문서종류"
			},
			Etc:{
				lblMainPage:"기본화면",
				lblStart : "스캔",
				lblPageType : "원고방향",
				lblHeadPosition : "원고방향세트",
				lblBgElimination : "배경 삭제", //2016.09.28 KIS Chone 용어 변경 refs #4070
				lblImageMode : "원고종류",
				lblDarkness : "농도",
				lblPageSplit:"책복사"
			},
			TraySelectionPopup:{
				guide:["출력용지 크기를 특정할 수 없습니다. ","","계속 진행하시려면 대상용지를 선택하시기 바랍니다."],
				confirm:"확인",
				cancel:"취소"
			},
			WarnPopup:{
				title:"경고",
				btnClose:"닫기"
			},
			CONFIRM:{
				BTN_CONFIRM:"확인",
				BTN_CANCEL:"취소",
				GUIDE_SEVICE_SELECT:["서비스선택화면으로 돌아가시겠습니까?"],
				GUIDE_LOGOUT:["로그아웃 하시겠습니까?"],
			},
			Printing:{
				msg1:"인쇄중"
			},
			ResultPopup:{
				eco_text:"Nnn장의 종이를 절약했습니다."
			},
			ChargeInfoPopup:{
				title:"결제 금액 알림",
				btnDirectConfirm:"교통/신용 결제",
				btnCyberConfirm:"충전금 결제",
				btnCancel:"취소",
				oms:"출력용지크기:",
				colorMode:"컬러모드:",
				pages:"원고매수:",
				outplex:"출력형태:",
				unitPrice:"팩스 단가:",
				copiesPrice:"부수당 가격:",
				copies:"복사부수:",
				totalPrice:"총결제금액:",
				msg1:"교통카드 또는 신용카드로 결제시,",
				msg2:"단말기에 카드를 올리신 후 교통/신용 결제 버튼을 눌러주십시오."
			},
			ErrorPopup:{
				title:"에러",
				btnClose:"닫기"
			},
			MagnificationPopup:{
				titMagpanel:"배율설정",
				lblMag:"배율",
				lblMagExpain:"(25~400%)",
				titMagPreset:"빠른설정",
				lblMagFix100:"1:1 원본사이즈", //2016.09.28 KIS Chone 용어 변경 refs #4070
				lblMagAuto:"출력용지맞춤",
				titMagInputMS:"원고용지크기",
				titMagOutputMS:"출력용지크기",
				titMagTray:"출력용지선택",
				lblMSA3:"A3",
				lblMSA4:"A4",
				lblMSB4:"B4",
				lblMSB5:"B5",
				lblMSAuto:"Auto",
				lblMagCancel:"취소",
				lblMagConfirm:"설정",
				lblHyphen:"-",
				lblPercent:"%",
				//slideMagAlertMinVal : ["배율의 최솟값은 25입니다."],
				//slideMagAlertMaxVal : ["배율의 최댓값은 400입니다."],
				//slideMagOverMin : ["최소배율에 도달하였습니다."],
				//slideMagOverMax : ["최대배율에 도달하였습니다."],
				slideMagUnusableStart : ["배율설정팝업에서는 복사를 실행할 수 없습니다.", "기본화면 혹은 기타설정화면에서 실행해주시기 바랍니다."],
				slideNotReadyTray : ["해당 용지가 트레이에 준비되지 않았습니다."],
				slideMagSetAuto : ["배율 선택을 [출력용지맞춤]을 선택하셨습니다. 출력할 용지사이즈를 선택하시기바랍니다."],
				lblSetMagExplain:"※ 원고/출력 용지 크기 지정시 배율(확대/축소)이 설정됩니다."
			},
			pageSplit:{
				titPageSplit:"책복사",
				lblPsDirection:"제본방향",
				lblPsOff:"선택안함",
				lblLeftRigth:"좌철원고",
				lblRigthLeft:"우철원고",
				lblTopBottom:"상철원고",
				lblPsOrder:"스캔대상/순서",
				lblBothPage:"양쪽 페이지",
				lblLeftPage:"왼쪽 페이지",
				lblRightPage:"오른쪽 페이지",
				lblTopPage:"위쪽 페이지",
				lblBottomPage:"아래쪽 페이지",
				lblExplain:"이 기능은 펼쳐진 원고의 양쪽 페이지를 스캔하여 2매의 용지에 따로 복사하는 기능입니다.",
				lblCenterErase:"중앙선 지움",
				lblCenterEraseRange:"(0~50mm)",
				lblSubExplain:"원고를 다음과 같이 세트하여 주십시오.",
				//slideCEOverMin : ["중앙선 지움의 최솟값에 도달하였습니다."],
				//slideCEOverMax : ["중앙선 지움의 최댓값에 도달하였습니다."],
				//slideCEOverMinVal : ["중앙선 지움의 최솟값은 0입니다."],
				//slideCEOverMaxVal : ["중앙선 지움의 최댓값은 50입니다."],	
				slideMagUnusableStart : ["책복사설정팝업에서는 복사를 실행할 수 없습니다.", "기본화면 혹은 기타설정화면에서 실행해주시기 바랍니다."],
				slideChgHeadPositionTop : ["[원고세트방향]을[바로놓기]로 변경했습니다."],
				slideChgHeadPositionLeft : ["[원고세트방향]을[돌려놓기]로 변경했습니다."]
			},
			PaymentPopup : {//2016.05.12 chone 신용/교통 카드 결제 요청 문구 추가
				lblRequestCardPayment : "카드 단말기에 결제를 진행해주세요!"
			},
			PrintingPopup : {//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblPrinting : "인쇄중..."
			},
			Comflict : {
				colorMode : "컬러 모드를 [컬러]로 변경했습니다",
				docFormat : "문서 종류를 [PDF]로 변경했습니다"
			},
			ChargeResultPopup : {
				lblPrice : "결제금액:",
				lblChargeRemain : "충전잔액:"
			}
		}
	},
	ja:{
		CommonLbl : {
			lbl_POPUP_confirm	:	"セット",
			lbl_POPUP_cancel	:	"キャンセル",
			lbl_POPUP_close	:	"クローズ",
			logout				:	"サービスを選択",
			title:"コピー・サービス"
		},
		Func:{
			plex:{
				simplex:"片面",//2016.05.25 Chone 다언어대응
				duplex:"両面（左右）",//2016.05.25 Chone 다언어대응
				tumble:"両面（上下）"//2016.05.25 Chone 다언어대응
			},
			magnification:{
				fix100:"100%",//2016.05.25 Chone 다언어대응
				auto:"自動検出",
				other:"その他"
			},
			nup:{
				none:"オフ",
				two:"2up",
				four:"4up",
				eight:"8up"
			},
			colorMode:{
				color:"色",
				bw:"白黒"
			},
			imageMode:{
				mixed:"テキスト/画像",
				text:"テキスト",
				photo:"画像"
			},
			headPosition:{
				top:"読める向き",//2016.05.25 Chone 다언어대응
				left:"左向き"//2016.05.25 Chone 다언어대응
			},
			bgElimination:{
				none:"オフ",
				set:"選択します"
			},
			tray:{
				auto:"自動検出",//2016.05.25 chone 다언어대응
				stationary:"標準サイズ",
				fineQuality:"ボンド紙",
				transparency:"OHPフィルム",
				labels:"ラベル用紙",
				coated:"コーティング紙",
				heavyWeight:"ヘビー級紙1",
				"heavyWeight(reverse)":"ヘビー級紙1（バーソ）",
				heavyWeight2:"エキストラヘビー級紙2",
				"heavyWeight2(reverse)":"エキストラヘビー級紙2（バーソ）",
				recycled:"再生紙",
				customPaper:"カスタム用紙1",
				customPaper2:"カスタム用紙2",
				customPaper3:"カスタム用紙3",
				customPaper4:"カスタム用紙4",
				customPaper5:"カスタム用紙5",
				heavyWeightA:"厚紙1（A）",
				heavyWeightB:"厚紙1（B）",
				heavyWeightC:"厚紙1（C）",
				heavyWeightS:"厚紙1（S）",
				heavyWeight2A:"厚紙2（A）",
				heavyWeight2B:"厚紙2（B）",
				heavyWeight2C:"厚紙2（C）",
				heavyWeight2D:"厚紙2（D）",
				heavyWeight2S:"厚紙2（S）",
				reverse:"古紙",
				"recycled(reverse)":"古紙（バーソ）",
				"pre-punched":"パンチ紙",
				letterhead:"レターヘッド",
				preprinted:"事前印刷された紙",
				customPaper6:"カスタム用紙6",
				customPaper7:"カスタム用紙7",
				customPaper8:"カスタム用紙8",
				customPaper9:"カスタム用紙9",
				customPaper10:"カスタム用紙10",
				customPaper11:"カスタム用紙11",
				customPaper12:"カスタム用紙12",
				customPaper13:"カスタム用紙13",
				customPaper14:"カスタム用紙14",
				customPaper15:"カスタム用紙15",
				customPaper16:"カスタム用紙16",
				customPaper17:"カスタム用紙17",
				customPaper18:"カスタム用紙18",
				customPaper19:"カスタム用紙19",
				customPaper20:"カスタム用紙20",
				other:"その他"
			},
			resolution : {
				dpi200 : "200dpi",
				dpi300 : "300dpi",
				dpi400 : "400dpi",
				dpi600 : "600dpi"
			},
			docFormat : {
				pdf : "PDF",
				jpg : "JPEG"
			}
		},
		UNIT:{
			PAGE:"ページ",
			PRN_SET:"部数",
			WON : "",//2016.05.25 chone 다언어대응
			TOTALPRICE : "合計お支払い額: " //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		ERROR_MSG:{
			//공통
			FAIL_NOT_INPUT_USER_INFO : ["FAX番号を入力してください。"],
			FAIL_ENV:["環境の構成が正しくありません.", "", "管理者に連絡してください。"],
			FAIL_COMM:["障害が通信中に発生しました.", "", "管理者に連絡してください。"],
			FAIL_TIMEOUT:["障害が通信中に発生しました.", "", "管理者に連絡してください。"],
			FAIL_OTHERS : ["不明なエラーが発生しました.", "", "管理者に連絡してください。"],
			
			//트레이
			USABLE_TRAY_NOT_FOUND:["使用可能なトレイがありません。", "トレイを確認後、再度お試しください。"],
			
			//Job실행
			TOO_MANY_JOBS:["すでに実行されているジョブがありますが、","あなたはコピーを実行することはできません.","タスクのリストを確認してください。"],
			//스캔실행
			FAIL_SCAN_JOB:["スキャンに失敗しました。","","管理者に連絡してください。"],
			USE_GLASS_FOR_PAGESPLIT:["選択した書籍のコピーでは、","自動原稿送り装置を使用することはできません。","","再度お試しフラットベッドガラスの上に本を入れてください。"],
			INTERUPTED_SCAN_JOB:["スキャンが停止しました。"],
			//프린트실행
			INTERUPTED_PRINT_JOB:["印刷が停止しました。"],
			FAIL_PRINT_JOB:["印刷に失敗しました。","","管理者に連絡してください。"],
			FAIL_PRINT_REFUND : ["プリントをすることができなくて操作を終了します。"]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		},
		Comflict : {
			colorMode : "컬러 모드를 [컬러]로 변경했습니다",
			docFormat : "문서 종류를 [PDF]로 변경했습니다"
		},
		Page:{
			Main:{
				inputInfo: "送信ファックス番号を入力",
				inputInfo2: "結果受信する電話番号",
				titFaxNumber : "FAX番号を入力",
				titTelNumber : "電話番号",
				titPageType : "入力方向",
				titMagnification : "拡大/縮小",
				//titNup : "다중이미지",
				titTray : "給紙",
				titColorMode : "出力色",
				titPageSet:"部数",
				titInplex : "原稿 両/片面",//2016.05.25 chone 다언어대응
				titOutplex : "出力 両/片面",//2016.05.25 chone 다언어대응
				lblEtcFunc : "その他の機能",
				//lblUsbChk : "Copy To USB",
				lblStart : "Scan",
				lblUtilStr : "",	 //2016.05.25 chone 다언어대응
				//slideTrayDis : ["トレイの情報を取得します。", "しばらくして、もう一度お試しください。"],
				//slideCopiesOver : ["入力可能な枚数は3桁までです。"],
				//slideCopiesOverMinVal : ["コピー枚数の最小値は1です。"],
				//slideCopiesOverMaxVal : ["コピー枚数の最大値は999です。"],
				//slideCopiesOverMin : ["最小コピー枚数に達しました。"],
				//slideCopiesOverMax : ["最大コピー枚数に達しました。"],
				slideChangeTray : ["倍率選択を出力用紙カスタムで選択することにより、","用紙の選択がNnnに変更されます。"],
				slideChangeMagnifi : ["検出自動で選択され、倍率が同じ倍率に変更されます。"],
				slideStartTrayDis : ["トレイの情報を取得します。", "しばらくして、もう一度お試しください。"],
				titResolution : "Resolution",
				titDocFormat : "Doc Format"
			},
			Etc:{
				lblMainPage:"メインスクリーン",
				lblStart : "Scan",
				lblPageType : "元の方向",
				lblHeadPosition : "元の方向セット",
				lblBgElimination : "新聞",
				lblImageMode : "ドキュメントタイプ",
				lblDarkness : "明るく / 暗く",
				lblPageSplit:"ブックコピー"
			},
			TraySelectionPopup:{
				guide:["出力用紙のサイズを測定することはできません。","","続行するには、紙（トレイ）を選択してください。"],
				confirm:"確認します",
				cancel:"キャンセル"
			},
			WarnPopup:{
				title:"警告",
				btnClose:"クローズ"
			},
			CONFIRM:{
				BTN_CONFIRM:"確認します",
				BTN_CANCEL:"キャンセル",
				GUIDE_SEVICE_SELECT:["[サービス]画面に戻りますか？"],
				GUIDE_LOGOUT:["あなたはログアウトしますか？"],
			},
			Printing:{
				msg1:"印刷中"
			},
			ResultPopup:{
				eco_text:"Nnn枚の紙を節約しました。"
			},
			ChargeInfoPopup:{
				title:"支払通知",
				btnDirectConfirm:"Tマネーの支払い/クレジットカード",
				btnCyberConfirm:"充電金の支払い",//2016.05.25 chone 다언어대응
				btnCancel:"キャンセル",
				oms:"出力用紙サイズ:",
				colorMode:"出力色:",
				pages:"元の文書の数:",
				outplex:"出力タイプ:",
				unitPrice:"ファックス価格:",
				copiesPrice:"コピーあたりの費用:",
				copies:"部数:",
				totalPrice:"合計お支払い額:",
				msg1:"あなたのクレジットカードまたは交通カードを使用すると、",
				msg2:"端末にカードを入れた後に支払いボタンをタッチします。"
			},
			ErrorPopup:{
				title:"エラー",
				btnClose:"クローズ"
			},
			MagnificationPopup:{
				titMagpanel:"拡大/縮小セット",
				lblMag:"拡大/縮小",
				lblMagExpain:"(25~400%)",
				titMagPreset:"クイック設定",
				lblMagFix100:"同じ倍率（100％）",
				lblMagAuto:"自動検出",
				titMagInputMS:"オリジナル用紙サイズ",
				titMagOutputMS:"コピー用紙サイズ",
				titMagTray:"出力紙を選択します",
				lblMSA3:"A3",
				lblMSA4:"A4",
				lblMSB4:"B4",
				lblMSB5:"B5",
				lblMSAuto:"自動",
				lblMagCancel:"キャンセル",
				lblMagConfirm:"設定",
				lblHyphen:"-",
				lblPercent:"%",
				//slideMagAlertMinVal : ["倍率の最小値は25です。"],
				//slideMagAlertMaxVal : ["倍率の最大値は400です。"],
				//slideMagOverMin : ["最小倍率に達しました。"],
				//slideMagOverMax : ["最大倍率に達しました。"],
				slideMagUnusableStart : ["倍率ポップアップでは、コピーを実行することはできません.", "メイン画面またはその他の設定画面で実行してください。"],
				slideNotReadyTray : ["本論文では、トレイの準備ができていません。"],
				slideMagSetAuto : ["あなたは倍率を、[カスタム用紙出力]に選択しました。印刷する用紙サイズを選択してください。"],
				lblSetMagExplain:"※文書/出力用紙サイズを倍率（拡大/減少させる）が設定されている場合。"
			},
			pageSplit:{
				titPageSplit:"ブックコピー",
				lblPsDirection:"オリジナルの向き",
				lblPsOff:"オフ",
				lblLeftRigth:"左とじ原稿",//2016.05.25 chone 다언어대응
				lblRigthLeft:"右とじ原稿",//2016.05.25 chone 다언어대응
				lblTopBottom:"上とじ原稿",//2016.05.25 chone 다언어대응
				lblPsOrder:"スキャン/順序",
				lblBothPage:"両ページ",//2016.05.25 chone 다언어대응
				lblLeftPage:"左ページ",//2016.05.25 chone 다언어대응
				lblRightPage:"右ページ",//2016.05.25 chone 다언어대응
				lblTopPage:"上ページ",//2016.05.25 chone 다언어대응
				lblBottomPage:"下ページ",//2016.05.25 chone 다언어대응
				lblExplain:"この機能は、紙の2枚の原稿を拡大している別のコピーのページの両面をスキャンします。",
				lblCenterErase:"結合エッジ消去",
				lblCenterEraseRange:"(0~50mm)",
				lblSubExplain:"次のように原稿をセットしてください",
				//slideCEOverMin : ["中消しの最小値に達しました。"],
				//slideCEOverMax : ["中消しの最大値に達しました。"],
				//slideCEOverMinVal : ["中消しの最小値は0です。"],
				//slideCEOverMaxVal : ["中消しの最大値은50です。"],	
				slideMagUnusableStart : ["あなたは、書籍設定ポップアップでコピーを実行することはできません。", "メイン画面またはその他の設定画面で実行してください。"],
				slideChgHeadPositionTop : ["元のセット方向がLEFTに変更されました。"],
				slideChgHeadPositionLeft : ["元のセット方向はSEFに変更されました。"]
			},
			PaymentPopup : {//2016.05.12 chone 신용/교통 카드 결제 요청 문구 추가
				lblRequestCardPayment : "カード端末からの支払いを行ってください。"
			},
			PrintingPopup : {//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblPrinting : "印刷..."
			}
		}
	},
	ch:{
		CommonLbl : {
			lbl_POPUP_confirm	:	"组",
			lbl_POPUP_cancel	:	"取消",
			lbl_POPUP_close	:	"关",
			logout				:	"选择服务",
			title:"复制服务"
		},
		Func:{
			plex:{
				simplex:"单面",//2016.05.25 chone 다언어대응
				duplex:"兩面（左右）",//2016.05.25 chone 다언어대응
				tumble:"兩面（上下）"//2016.05.25 chone 다언어대응
			},
			magnification:{
				fix100:"100%",//2016.05.25 chone 다언어대응
				auto:"自动检测",
				other:"其他"
			},
			nup:{
				none:"离",
				two:"2up",
				four:"4up",
				eight:"8up"
			},
			colorMode:{
				color:"颜色",
				bw:"黑白"//2015.05.25 chone 다언어대응
			},
			imageMode:{
				mixed:"文本/图片",
				text:"文本",
				photo:"图片"
			},
			headPosition:{
				top:"长边送纸",//2015.05.25 chone 다언어대응
				left:"短边送纸"//2015.05.25 chone 다언어대응
			},
			bgElimination:{
				none:"离",
				set:"选择"
			},
			tray:{
				auto:"自动侦测",
				stationary:"标准尺寸",
				fineQuality:"铜版纸",
				transparency:"OHP胶片",
				labels:"商标纸",
				coated:"涂布纸",
				heavyWeight:"重磅纸1",
				"heavyWeight(reverse)":"重磅纸1（Verso的）",
				heavyWeight2:"额外的重磅纸2",
				"heavyWeight2(reverse)":"额外的重磅纸2（Verso的）",
				recycled:"再生纸",
				customPaper:"自定义纸张1",
				customPaper2:"自定义纸张2",
				customPaper3:"自定义纸张3",
				customPaper4:"自定义纸张4",
				customPaper5:"自定义纸张5",
				heavyWeightA:"重磅纸1（A）",
				heavyWeightB:"重磅纸1（B）",
				heavyWeightC:"重磅纸1（C）",
				heavyWeightS:"重磅纸1（S）",
				heavyWeight2A:"重磅纸2（A）",
				heavyWeight2B:"重磅纸2（B）",
				heavyWeight2C:"重磅纸2（C）",
				heavyWeight2D:"重磅纸2（D）",
				heavyWeight2S:"重磅纸2（S）",
				reverse:"废纸",
				"recycled(reverse)":"废纸（Verso的）",
				"pre-punched":"打孔纸",
				letterhead:"信",
				preprinted:"预印纸",
				customPaper6:"自定义纸张6",
				customPaper7:"自定义纸张7",
				customPaper8:"自定义纸张8",
				customPaper9:"自定义纸张9",
				customPaper10:"自定义纸张10",
				customPaper11:"自定义纸张11",
				customPaper12:"自定义纸张12",
				customPaper13:"自定义纸张13",
				customPaper14:"自定义纸张14",
				customPaper15:"自定义纸张15",
				customPaper16:"自定义纸张16",
				customPaper17:"自定义纸张17",
				customPaper18:"自定义纸张18",
				customPaper19:"自定义纸张19",
				customPaper20:"自定义纸张20",
				other:"其他"
			},
			resolution : {
				dpi200 : "200dpi",
				dpi300 : "300dpi",
				dpi400 : "400dpi",
				dpi600 : "600dpi"
			},
			docFormat : {
				pdf : "PDF",
				jpg : "JPEG"
			}
		},
		UNIT:{
			PAGE:"页",
			PRN_SET:"复印数量",
			WON : "",//2016.05.25 chone 다언어대응
			TOTALPRICE : "支付总额: " //2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		ERROR_MSG:{
			//공통
			FAIL_NOT_INPUT_USER_INFO : ["请输入您的传真号码."],
			FAIL_ENV:["环境配置不正确.", "", "请与管理员联系."],
			FAIL_COMM:["通信过程中发生故障.", "", "请与管理员联系."],
			FAIL_TIMEOUT:["通信过程中发生故障.", "", "请与管理员联系."],
			FAIL_OTHERS : ["未知的故障发生.", "", "请与管理员联系."],
			
			//트레이
			USABLE_TRAY_NOT_FOUND:["没有可用的托盘.", "检查托盘后，请重试."],
			
			//Job실행
			TOO_MANY_JOBS:["在选择书的副本，","已经在运行的作业，","则不能运行副本请检查任务列表."],
			//스캔실행
			FAIL_SCAN_JOB:["无法扫描.","","请与管理员联系."],
			USE_GLASS_FOR_PAGESPLIT:["在选择书的副本，","你不能使用自动文档进纸器.","","请重试把书放在平板玻璃."],
			INTERUPTED_SCAN_JOB:["扫描已停止."],
			//프린트실행
			INTERUPTED_PRINT_JOB:["已停止打印."],
			FAIL_PRINT_JOB:["无法打印.","","请与管理员联系."],
			FAIL_PRINT_REFUND : ["它不能被打印来结束操作。"]//2016.12.07 KIS Chone #4032 프린트 환불 처리 타이밍 변경(에러 팝업에서 로그아웃 버튼 누른 시점으로 이동)
		},
		Comflict : {
			colorMode : "컬러 모드를 [컬러]로 변경했습니다",
			docFormat : "문서 종류를 [PDF]로 변경했습니다"
		},
		Page:{
			Main:{
				inputInfo: "输入要发送的传真号码",
				inputInfo2: "接收结果的电话号码",
				titFaxNumber : "输入传真号码",
				titTelNumber : "电话号码",
				titPageType : "输入方向",
				titMagnification : "缩小/放大",
				//titNup : "다중이미지",
				titTray : "纸张供应",
				titColorMode : "输出颜色",
				titPageSet:"数量",//2016.05.25 chone 다언어대응
				titInplex : "原稿双面/单面",
				titOutplex : "输出双面/单面",
				lblEtcFunc : "其他特性",
				//lblUsbChk : "Copy To USB",
				lblStart : "Scan",
				lblUtilStr : "",//2016.05.25 chone 다언어대응
				//slideTrayDis : ["トレイの情報を取得します。", "しばらくして、もう一度お試しください。"],
				//slideCopiesOver : ["入力可能な枚数は3桁までです。"],
				//slideCopiesOverMinVal : ["コピー枚数の最小値は1です。"],
				//slideCopiesOverMaxVal : ["コピー枚数の最大値は999です。"],
				//slideCopiesOverMin : ["最小コピー枚数に達しました。"],
				//slideCopiesOverMax : ["最大コピー枚数に達しました。"],
				slideChangeTray : ["作为一个在输出纸张选择的规模,","选择自定义纸张选择更改为Nnn."],
				slideChangeMagnifi : ["为所选自动检测，放大倍率改变到相同的放大倍数."],
				slideStartTrayDis : ["获取托盘的信息.", "过了一会儿，请重试."],
				titResolution : "Resolution",
				titDocFormat : "Doc Format"
			},
			Etc:{
				lblMainPage:"主屏幕",
				lblStart : "Scan",
				lblPageType : "原来的方向",
				lblHeadPosition : "原来的方向设定",
				lblBgElimination : "报纸",
				lblImageMode : "文档类型",
				lblDarkness : "变浅 / 变深",
				lblPageSplit:"书本复印"
			},
			TraySelectionPopup:{
				guide:["无法测量的输出纸张尺寸.","","要继续，请选择纸张（纸盒）."],
				confirm:"确认",
				cancel:"取消"
			},
			WarnPopup:{
				title:"警告",
				btnClose:"关"
			},
			CONFIRM:{
				BTN_CONFIRM:"确认",
				BTN_CANCEL:"取消",
				GUIDE_SEVICE_SELECT:["你想，返回到服务界面？"],
				GUIDE_LOGOUT:["你要注销？"],
			},
			Printing:{
				msg1:"印花"
			},
			ResultPopup:{
				eco_text:"Nnn枚の紙を節約しました。"
			},
			ChargeInfoPopup:{
				title:"付款通知",
				btnDirectConfirm:"支付T-货币/信用卡",
				btnCyberConfirm:"支付给网络赚钱(充值金)",
				btnCancel:"取消",
				oms:"输出纸张尺寸:",
				colorMode:"输出颜色:",
				pages:"原始文档的数量:",
				outplex:"输出类型:",
				unitPrice:"传真價格:",
				copiesPrice:"每拷贝成本:",
				copies:"复印数量:",
				totalPrice:"支付总额:",
				msg1:"当你用你的信用卡或交通卡，把卡在终端上后，",
				msg2:"触摸付款按钮."
			},
			ErrorPopup:{
				title:"错误",
				btnClose:"关"
			},
			MagnificationPopup:{
				titMagpanel:"缩小/放大设置",
				lblMag:"缩小/放大",
				lblMagExpain:"(25~400%)",
				titMagPreset:"快速设置",
				lblMagFix100:"在相同的放大倍数（100％）",
				lblMagAuto:"自动检测",
				titMagInputMS:"原始纸张尺寸",
				titMagOutputMS:"复印纸尺寸",
				titMagTray:"输出纸张选择",
				lblMSA3:"A3",
				lblMSA4:"A4",
				lblMSB4:"B4",
				lblMSB5:"B5",
				lblMSAuto:"自动检测",
				lblMagCancel:"取消",
				lblMagConfirm:"设置",
				lblHyphen:"-",
				lblPercent:"%",
				//slideMagAlertMinVal : ["倍率の最小値は25です。"],
				//slideMagAlertMaxVal : ["倍率の最大値は400です。"],
				//slideMagOverMin : ["最小倍率に達しました。"],
				//slideMagOverMax : ["最大倍率に達しました。"],
				slideMagUnusableStart : ["在放大弹出，你不能运行副本.", "请在主屏幕或其他设置屏幕运行."],
				slideNotReadyTray : ["本文不准备在托盘上."],
				slideMagSetAuto : ["您所选择的放大倍率，选择[自定义纸张的输出.请选择纸张尺寸打印."],
				lblSetMagExplain:"当放大倍率（放大/缩小）设置※文件/输出纸张尺寸."
			},
			pageSplit:{
				titPageSplit:"书本复印",
				lblPsDirection:"原始方向",
				lblPsOff:"离",
				lblLeftRigth:"比对左页",
				lblRigthLeft:"右页左比",
				lblTopBottom:"比底部首页",
				lblPsOrder:"扫描/订单",
				lblBothPage:"这两个页面",
				lblLeftPage:"左页",
				lblRightPage:"右页",
				lblTopPage:"截至页面",
				lblBottomPage:"向下翻页",
				lblExplain:"该功能扫描的两张纸的手稿扩大了单独的副本页面的两侧.",
				lblCenterErase:"结合边缘消除",//2016.05.25 chone 다언어대응
				lblCenterEraseRange:"(0~50mm)",
				lblSubExplain:"请设置文件如下.",
				//slideCEOverMin : ["中消しの最小値に達しました。"],
				//slideCEOverMax : ["中消しの最大値に達しました。"],
				//slideCEOverMinVal : ["中消しの最小値は0です。"],
				//slideCEOverMaxVal : ["中消しの最大値은50です。"],	
				slideMagUnusableStart : ["你不能运行在图书设置弹出副本.", "请在主屏幕或其他设定屏幕上运行."],
				slideChgHeadPositionTop : ["原设定的方向已经改变到左."],
				slideChgHeadPositionLeft : ["原设定的方向已经改变海基会."]
			},
			PaymentPopup : {//2016.05.12 chone 신용/교통 카드 결제 요청 문구 추가
				lblRequestCardPayment : "请从卡终端付款."
			},
			PrintingPopup : {//2016.05.12 chone 프린팅 화면 결제 금액 표시 개선 요청
				lblPrinting : "印花..."
			}
		}
	}
};
