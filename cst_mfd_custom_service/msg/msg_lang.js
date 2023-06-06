var Msg = {};
var Msg_lang = {
	ko:{
		// Top Bar
		TOP_BAR:{
			TITLE_NAME								: "과금용 복합기",
			DEFAULT_SIZE 							: "A4"
		},
		// Menu Page
		MENU_PAGE:{
			SERVICE_PRINT 							: "프린트",
			SERVICE_COPY 							: "복사",
			SERVICE_SCAN 							: "스캔",
			SERVICE_FAX 							: "팩스",
			NOTICE_MESSAGE 							: ["사용할 서비스 메뉴를 눌러 주세요.", "A4 컬러 = XX 원, A4 흑백 = YY 원"],
			NOTICE_ERROR 							: ["서버와 연결에 문제가 있습니다.", "관리자에 문의해주세요."],
			FAX_INFO 								: "팩스 조회 안내"
		},
		// PRINT 관련 기능
		OTID:{
			GUIDE_MESSAGE							: "출력할 One time ID 를 입력해 주세요.",
			BTN_CONFIRM								: "확인",
			BTN_CANCEL								: "취소",
		},
		FILELIST:{
			SELECTED_FILE_NUMBER_MSG 				: "선택수:",
			FILE_NOT_EXIST 							: "문서가 없습니다.",
			FILE_LIST_BTN_PAGE_MSG 					: "페이지",
			FILE_LIST_BTN_QUANTITY_LABEL 			: "부",
			FILE_LIST_BTN_COLOR_MODE_BW_MSG 		: "흑백",
			FILE_LIST_BTN_COLOR_MODE_AUTO_MSG 		: "컬러",
			FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG : "A4",
			FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG : "A3",
			FILE_LIST_BTN_OUTPUT_SIMPLEX			: "단면",
			FILE_LIST_BTN_OUTPUT_DUPLEX				: "양면(좌우)",
			FILE_LIST_BTN_OUTPUT_TUMBLE				: "양면(상하)",
			FILE_LIST_BTN_PRICE						: "결제금액",
			FILE_LIST_BTN_WON						: "원",
			COMMON_PRINT_NUP_LABEL 					: "up",
			SELECT_ALL_BTN_LABEL_0 					: "전체 선택",
			SELECT_ALL_BTN_LABEL_1 					: "",
			DELETE_FILE_BTN_LABEL 					: "삭제",
			PRINT_SETTING_BTN_LABEL_0 				: "프린트",
			SELECT_INFO_0 							: "출력 불가능한 문서가 선택되었습니다.",
			SELECT_INFO_1 							: "컬러 문서를 해제해 주세요.",
			SELECT_INFO_2 							: "용지 사이즈가 없는 문서를 해제해 주세요.",
			SELECT_INFO_3 							: "컬러, 용지 사이즈 출력 불가 문서를 해제해 주세요.",
			LOADING_MSG_0 							: "잠시 기다려 주세요.",
			LOADING_MSG_1 							: "문서 표시에 시간이 걸리는 경우가 있습니다.",
			LOADING_MSG_2 							: "",
			LOADING_MSG_3 							: "",

		},
		ChargeInfoPopup:{
			title									: "결제 금액 알림",
			btnConfirm								: "확인",
			btnDirectConfirm						: "교통/신용 결제",
			btnCyberConfirm							: "충전금 결제",
			btnCancel								: "취소",
			//msg1:"요금은 ",
			//msg2:"원 입니다.",
			msg1									: "교통카드 또는 신용카드로 결제시,",
			msg2									: "단말기에 카드를 올리신 후 교통/신용 결제 버튼을 눌러주십시오.",
			scan_msg1								: "USB Disk를 삽입해주세요.",
			scan_msg2								: "확인중입니다.",
			scan_msg3								: "USB Disk가 고장나거나 포멧이 FAT32 가 아닙니다.",
			scan_msg4								: "다른 USB를 사용해주시거나 작업을 취소해주세요.",
			scan_msg5								: "남은 용량: ",
			scan_msg6								: "USB Disk가 확인되었습니다.",
			GBYTE									: " Byte",
			//,currency:"￦"
			outSize									: "출력용지: ",
			outDuplex								: "양단면: ",
			outPages								: "원고매수: ",
			outCopies								: "출력부수: ",
			outColorMode							: "컬러모드: ",
			joblist									: "출력물선택건수: ",
			totalPrice								: "총결제금액: "
		},
		PrintingPopup : {
			lblRequestCardPayment 					: "카드 단말기에 결제를 진행해주세요!",
			lblPrinting 							: "인쇄중...",
			lblInTransit							: "전송중..."
		},
		ScanningPopup : {
			lblScanningMsg 							: "카드 단말기에 결제를 진행해주세요!",
			lblScanning 							: "스캔중..."
		},
		UNIT:{
			PAGE									: "페이지",
			PRN_SET									: "부",
			WON 									: "원",
			COUNT									: "건",
			TOTALPRICE 								: "총결제금액: " //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		COPY_MAIN_MENU:{
			SRC_DUPLEX_LABEL						: "원고 양면/단면",
			DUPLEX_LABEL							: "출력 양면/단면",
			COLOR_LABEL								: "컬러모드",
			DPI_LABEL								: "해상도",
			RATIO_LABEL								: "스캔 비율",
			OUTPUT_SIZE_LABEL						: "출력용지",
			COPIES_LABEL							: "출력부수",
			MANUAL_MAG_LABEL						: "비율 직접입력(%)",
			COPY_START								: "복    사",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "스캔 시작",

			PLEX_OPTION_SIM 						: "단면",
			PLEX_OPTION_DUP 						: "양면 (좌우열기)",
			PLEX_OPTION_TUM 						: "양면 (상하열기)",
			/*
			DOC_FORMAT_LABEL 						: "파일형식",
			DOC_FORMAT_OPTION_TIFF 					: "TIFF",
			DOC_FORMAT_OPTION_PDF 					: "PDF",
			DOC_FORMAT_OPTION_DOCUWORKS 			: "DocuWorks",
			DOC_FORMAT_OPTION_JPEG 					: "JPEG",
			*/
			CM_OPTION_AUTO 							: "자동 감지",
			CM_OPTION_COLOR 						: "컬러",
			CM_OPTION_GRAY 							: "그레이스케일(흑백 사진)",
			CM_OPTION_BW 							: "흑백(문자)",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",

			MAG_OPTION_100 							: "100%",
			MAG_OPTION_61  							: "61%  A3 → B5",
			MAG_OPTION_70  							: "70%  A3 → A4, B4 → B5",
			MAG_OPTION_81  							: "81%  B4 → A4",
			MAG_OPTION_86  							: "86%  A3 → B4, A4 → B5",
			MAG_OPTION_115 							: "115%  B4 → A3, B5 → A4",
			MAG_OPTION_122 							: "122%  A4 → B4, A5 → B5",
			MAG_OPTION_141 							: "141%  A4 → A3, B5 → B4",
			MAG_OPTION_200 							: "200%  A5 → A3, B6 → B4",
			MAG_MANUAL 	   							: "직접입력"
			/******scan status page**************************************************/
		},
		SCAN_MAIN_MENU:{
			FILE_NAME								: "파일명",
			SRC_DUPLEX_LABEL						: "원고 양면/단면",
			DUPLEX_LABEL							: "출력 양면/단면",
			COLOR_LABEL								: "컬러모드",
			DPI_LABEL								: "해상도",
			RATIO_LABEL								: "스캔 비율",
			SCAN_START								: "스    캔",
			SCAN_PC_NUMBER							: "문서 저장: ",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "스캔 시작",

			PLEX_OPTION_SIM 						: "단면",
			PLEX_OPTION_DUP 						: "양면 (좌우열기)",
			PLEX_OPTION_TUM 						: "양면 (상하열기)",

			DOC_FORMAT_LABEL 						: "파일형식",
			DOC_FORMAT_OPTION_TIFF 					: "TIFF",
			DOC_FORMAT_OPTION_PDF 					: "PDF",
			DOC_FORMAT_OPTION_JPEG 					: "JPEG",

			CM_OPTION_AUTO 							: "자동 감지",
			CM_OPTION_COLOR 						: "컬러",
			CM_OPTION_GRAY 							: "그레이스케일(흑백 사진)",
			CM_OPTION_BW 							: "흑백(문자)",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",
			/******scan status page**************************************************/
		},
		SCAN_TYPE_SELECT:{
			NOT_USB 								: "USB는 사용할 수 없습니다.",
			TYPE_USB								: "USB 저장",
			TYPE_PC0								: "1번 PC 전송",
			TYPE_PC1								: "2번 PC 전송",
			TYPE_PC2								: "3번 PC 전송",
			TYPE_PC3								: "4번 PC 전송",
			TYPE_PC4								: "5번 PC 전송"
		},
		FAX_MAIN_MENU:{
			AREA_CODE								: "지역번호:",
			FAX_NUMBER								: "팩스번호:",
			FAX_NUMBER_INFO							: "번호를 다시한번 확인 해 주세요.",
			SRC_DUPLEX_LABEL						: "원고 양면/단면",
			HP_LABEL								: "원고 세트 방향",
			DPI_LABEL								: "해상도",
			SCAN_START								: "팩스 전송",
			DOC_TYPE								: "문서 종류",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "스캔 시작",

			PLEX_OPTION_SIM 						: "단면",
			PLEX_OPTION_DUP 						: "양면 (좌우열기)",
			PLEX_OPTION_TUM 						: "양면 (상하열기)",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",

			CM_OPTION_AUTO 							: "자동 감지",
			CM_OPTION_COLOR 						: "컬러",
			CM_OPTION_GRAY 							: "사진 + 문자",
			CM_OPTION_BW 							: "문자",

			HP_LEFT 								: "바로놓기",
			HP_TOP 									: "돌려놓기"
			/******scan status page**************************************************/
		},
		FAX_AREA_CODE:{
			AREA_NAME:{
				0  : "직접입력",
				1  : "서울시",
				2  : "경기도",
				3  : "인천시",
				4  : "강원도",
				5  : "충청남도",
				6  : "대전시",
				7  : "충청북도",
				8  : "세종시",
				9  : "부산시",
				10 : "울산시",
				11 : "대구시",
				12 : "경상북도",
				13 : "경상남도",
				14 : "전라남도",
				15 : "광주시",
				16 : "전라북도",
				17 : "제주도"
			},
			AREA_CODE:{
				0  : "direct",
				1  : "02",
				2  : "031",
				3  : "032",
				4  : "033",
				5  : "041",
				6  : "042",
				7  : "043",
				8  : "044",
				9  : "051",
				10 : "052",
				11 : "053",
				12 : "054",
				13 : "055",
				14 : "061",
				15 : "062",
				16 : "063",
				17 : "064"
			}

		},
		PreferencePage:{
			LBL_Title								: "환경설정",
			LBL_BAR_TITLE							: "Title:",
			LBL_SERVER_URL							: "서버주소:",
			LBL_CHECK_SCAN							: "스캔사용:",
			LBL_CHECK_FAX							: "팩스사용:",
			LBL_NATIVE_SCAN							: "복합기 스캔:",
			LBL_NATIVE_FAX							: "복합기 팩스:",
			LBL_SCAN_TYPE							: "스캔 방법 설정:",
			SELECT_USED								: "사용",
			SELECT_UNUSED							: "미사용",
			SELECT_NATIVE_SCAN_OPT0					: "미사용",
			SELECT_NATIVE_SCAN_OPT1					: "Scan to PC",
			SELECT_NATIVE_SCAN_OPT2					: "Store to Folder",
			SELECT_NATIVE_SCAN_OPT3					: "E-mail",
			SELECT_NATIVE_FAX_OPT0					: "미사용",
			SELECT_NATIVE_FAX_OPT1					: "Fax",
			SELECT_NATIVE_FAX_OPT2					: "Simple Fax",
			SELECT_SCAN_TYPE_OPT0					: "USB Only",
			SELECT_SCAN_TYPE_OPT1					: "PC Only",
			SELECT_SCAN_TYPE_OPT2					: "USB & PC",
			MSG_SETTING_FAIL						: "동시사용은 불가능 합니다.",
			LBL_CHARGE_MODE							: "카드리더 설정:",
			SELECT_TECHREADER						: "테크리더",
			SELECT_JWORKS							: "JetWork",
			LBL_CHARGE_URL							: "리더기 주소:",
			SCAN_PC_SERCH_MSG1						: "연결 PC 확인중...(다소 시간이 걸립니다.)",
			SCAN_PC_SERCH_MSG2						: "PC 확인을 완료했습니다.",
			SCAN_PC_SERCH_MSG3						: "PC 5대 확인을 완료했습니다."
		},
		PreferencePage2:{
			LBL_Title								: "Scan to PC 설정"
		},
		NoticePopup:{
			title									: " ",
			Title_Fail								: "오류",
			Title_Warn								: "주의",
			Title_Info								: "알림",

			btnConfirm								: "확인",
			btnCancel								: "취소",
			btnRetry								: "뒤로",
			btnSetting								: "설정",
			btnAdmin								: "재설정",
			Msg_Other								: ["알 수 없는 오류가 발생했습니다.", "관리자에 문의해주세요."],
			Msg_Auth								: ["복합기 설정이 해당 서비스 이용에 맞지 않습니다.", "인증설정을 확인해주세요."],
			Msg_ResFail								: ["복합기로 부터 응답이 없습니다.", "네트워크 설정 및 인증 설정을 확인해주세요."],
			Msg_TrayFail							: ["복합기 용지정보를 확인할 수 없습니다."],
			Msg_BillFail							: ["서버로부터 과금정보를 가져올 수 없습니다.", "서버의 과금정보 또는 서버주소 설정을 확인해주세요."],
			Msg_ListFail							: ["서버로부터 문서정보를 가져올 수 없습니다.", "관리자에 문의해주세요."],
			Msg_PowerOff							: ["복합기 전원을 껐다가 켜주세요."],
			Msg_WriteFail							: ["파일 저장에 실패했습니다.", "개발사에 문의해주세요."],
			Msg_ChargeInfoFail						: ["과금에 필요한 정보 취득에 실패했습니다.", "관리자에 문의해주세요."],
			Msg_DocEmpty							: ["출력할 문서가 없습니다.","입력 ID를 확인해주세요."],
			Msg_RegiResFail							: ["서버로부터 등록정보를 가져올 수 없습니다.", "관리자에 문의해주세요."],
			Msg_RegiFail							: ["이 복합기는 라이선스 등록이 되지 않았습니다.", "라이선스를 등록 후에 사용해주세요."],
			Msg_ChargeFail  						: ["결제에 실패하였습니다.", "작업을 취소합니다."],
			Msg_SERVER_Fail 						: ["서버와 네트워크 연결이 끊겼습니다.", "관리자에 문의해주세요."],
			Msg_NONE_PC								: ["선택한 PC와 연결이 안됩니다.", "다른 PC를 선택하거나 관리자에 문의해주세요."],
			Msg_FAX_Send_Search_Guide 				: ["팩스 전송 상태 확인을 위해서는", "이하 QR코드를 스캔해 주세요."],
			Msg_FAX_Send_Search_NO_QR 				: ["아직 서비스 전입니다.", "관리자에 문의해주세요."],
		}

	},
	en:{
		// Top Bar
		TOP_BAR:{
			TITLE_NAME								: "Multifunction device for billing",
			DEFAULT_SIZE 							: "A4"
		},
		// Menu Page
		MENU_PAGE:{
			SERVICE_PRINT 							: "Print",
			SERVICE_COPY 							: "Copy",
			SERVICE_SCAN 							: "Scan",
			SERVICE_FAX 							: "FAX",
			NOTICE_MESSAGE 							: ["Press the service menu you want to use.", "A4 Color = XX Won, A4 B&W = YY Won"],
			NOTICE_ERROR 							: ["There is a problem connecting to the server.", "Please contact the administrator."],
			FAX_INFO								: "Fax Inquiry Guide"
		},
		// PRINT 관련 기능
		OTID:{
			GUIDE_MESSAGE							: "Please input One time ID",
			BTN_CONFIRM								: "Confirm",
			BTN_CANCEL								: "Cancel",
		},
		FILELIST:{
			SELECTED_FILE_NUMBER_MSG 				: "Select:",
			FILE_NOT_EXIST 							: "There is no document.",
			FILE_LIST_BTN_PAGE_MSG 					: "Page",
			FILE_LIST_BTN_QUANTITY_LABEL 			: "Copies",
			FILE_LIST_BTN_COLOR_MODE_BW_MSG 		: "Black & White",
			FILE_LIST_BTN_COLOR_MODE_AUTO_MSG 		: "Color",
			FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A4_MSG	: "A4",
			FILE_LIST_BTN_OUTPUT_MEDIUM_SIZE_A3_MSG	: "A3",
			FILE_LIST_BTN_OUTPUT_SIMPLEX			: "Simplex",
			FILE_LIST_BTN_OUTPUT_DUPLEX				: "Duplex",
			FILE_LIST_BTN_OUTPUT_TUMBLE				: "Tumble",
			FILE_LIST_BTN_PRICE						: "Payment",
			FILE_LIST_BTN_WON						: "Won",
			COMMON_PRINT_NUP_LABEL 					: "up",
			SELECT_ALL_BTN_LABEL_0 					: "Select all",
			SELECT_ALL_BTN_LABEL_1 					: "",
			DELETE_FILE_BTN_LABEL 					: "Delete",
			PRINT_SETTING_BTN_LABEL_0 				: "Print",
			SELECT_INFO_0 							: "An unprintable document was selected.",
			SELECT_INFO_1 							: "Please disable color documents.",
			SELECT_INFO_2 							: "Please release the document without paper size.",
			SELECT_INFO_3 							: "Please release the document that cannot print in color or paper size.",
			LOADING_MSG_0 							: "Please wait a moment.",
			LOADING_MSG_1 							: "It may take some time to display the document.",
			LOADING_MSG_2 							: "",
			LOADING_MSG_3 							: "",

		},
		ChargeInfoPopup:{
			title									: "Payment Amount Notification",
			btnConfirm								: "Confirm",
			btnDirectConfirm						: "Credit payment",
			btnCyberConfirm							: "충전금 결제",
			btnCancel								: "Cancel",
			//msg1:"요금은 ",
			//msg2:"원 입니다.",
			msg1									: "When paying by transportation card or credit card,",
			msg2									: "After placing the card on the terminal, press the payment button.",
			scan_msg1								: "Please insert a USB Disk.",
			scan_msg2								: "Checking it now.",
			scan_msg3								: "The USB disk is broken or the format is not FAT32.",
			scan_msg4								: "Please use a different USB or cancel the operation.",
			scan_msg5								: "Remaining capacity: ",
			scan_msg6								: "USB Disk is OK!.",
			GBYTE									: " Byte",
			//,currency:"￦"
			outSize									: "Paper Size: ",
			outDuplex								: "Duplex Mode: ",
			outPages								: "Pages: ",
			outCopies								: "Copies: ",
			outColorMode							: "Color Mode: ",
			joblist									: "Select Document: ",
			totalPrice								: "Total price: "
		},
		PrintingPopup : {
			lblRequestCardPayment 					: "Please proceed with the payment on the card terminal!",
			lblPrinting 							: "Printing...",
			lblInTransit							: "in transit..."
		},
		ScanningPopup : {
			lblScanningMsg 							: "Please proceed with the payment on the card terminal!",
			lblScanning 							: "Scanning..."
		},
		UNIT:{
			PAGE									: "Page",
			PRN_SET									: "Copies",
			WON 									: "Won",
			COUNT									: "Select",
			TOTALPRICE 								: "Total price: " //2016.05.16 chone 프린팅 화면 결제 금액 표시 개선 요청
		},
		COPY_MAIN_MENU:{
			SRC_DUPLEX_LABEL						: "Document Duplex/Simplex",
			DUPLEX_LABEL							: "Output Duplex/Simplex",
			COLOR_LABEL								: "Color Mode",
			DPI_LABEL								: "Resolution",
			RATIO_LABEL								: "Scan rate",
			OUTPUT_SIZE_LABEL						: "Output Size",
			COPIES_LABEL							: "Output Copies",
			MANUAL_MAG_LABEL						: "Manual input of magnification",
			COPY_START								: "COPY",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "Scan Start",

			PLEX_OPTION_SIM 						: "Simplex",
			PLEX_OPTION_DUP 						: "Duplex",
			PLEX_OPTION_TUM 						: "Tumble",
			/*
			DOC_FORMAT_LABEL 						: "파일형식",
			DOC_FORMAT_OPTION_TIFF 					: "TIFF",
			DOC_FORMAT_OPTION_PDF 					: "PDF",
			DOC_FORMAT_OPTION_DOCUWORKS 			: "DocuWorks",
			DOC_FORMAT_OPTION_JPEG 					: "JPEG",
			*/
			CM_OPTION_AUTO 							: "Auto",
			CM_OPTION_COLOR 						: "Color",
			CM_OPTION_GRAY 							: "GrayScale",
			CM_OPTION_BW 							: "Black & White",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",

			MAG_OPTION_100 							: "100%",
			MAG_OPTION_61  							: "61%  A3 → B5",
			MAG_OPTION_70  							: "70%  A3 → A4, B4 → B5",
			MAG_OPTION_81  							: "81%  B4 → A4",
			MAG_OPTION_86  							: "86%  A3 → B4, A4 → B5",
			MAG_OPTION_115 							: "115%  B4 → A3, B5 → A4",
			MAG_OPTION_122 							: "122%  A4 → B4, A5 → B5",
			MAG_OPTION_141 							: "141%  A4 → A3, B5 → B4",
			MAG_OPTION_200 							: "200%  A5 → A3, B6 → B4",
			MAG_MANUAL 								: "Direct Input(%)"
			/******scan status page**************************************************/
		},
		SCAN_MAIN_MENU:{
			FILE_NAME								: "File Name",
			SRC_DUPLEX_LABEL						: "Document Duplex/Simplex",
			DUPLEX_LABEL							: "Output Duplex/Simplex",
			COLOR_LABEL								: "Color Mode",
			DPI_LABEL								: "Resolution",
			RATIO_LABEL								: "Scan rate",
			SCAN_START								: "Scan",
			SCAN_PC_NUMBER							: "Document storage location: ",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "Scan Start",

			PLEX_OPTION_SIM 						: "Simplex",
			PLEX_OPTION_DUP 						: "Duplex",
			PLEX_OPTION_TUM 						: "Tumble",

			DOC_FORMAT_LABEL 						: "File Type",
			DOC_FORMAT_OPTION_TIFF 					: "TIFF",
			DOC_FORMAT_OPTION_PDF 					: "PDF",
			DOC_FORMAT_OPTION_JPEG 					: "JPEG",

			CM_OPTION_AUTO 							: "Auto",
			CM_OPTION_COLOR 						: "Color",
			CM_OPTION_GRAY 							: "GrayScale",
			CM_OPTION_BW 							: "Black & White",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",
			/******scan status page**************************************************/
		},
		SCAN_TYPE_SELECT:{
			NOT_USB									: "USB cannot be used.",
			TYPE_USB								: "Save to USB",
			TYPE_PC0								: "Save No.1 PC",
			TYPE_PC1								: "Save No.2 PC",
			TYPE_PC2								: "Save No.3 PC",
			TYPE_PC3								: "Save No.4 PC",
			TYPE_PC4								: "Save No.5 PC"
		},
		FAX_MAIN_MENU:{
			AREA_CODE								: "Area Code:",
			FAX_NUMBER								: "Fax Number:",
			FAX_NUMBER_INFO							: "Please check the number again.",
			SRC_DUPLEX_LABEL						: "Document Duplex/Simplex",
			HP_LABEL								: "Document Set Orientation",
			DPI_LABEL								: "Resolution",
			SCAN_START								: "Scan",
			DOC_TYPE								: "Document Type",

			/******scan setting page**************************************************/
			START_BTN_MSG 							: "Scan Start",

			PLEX_OPTION_SIM 						: "Simplex",
			PLEX_OPTION_DUP 						: "Duplex",
			PLEX_OPTION_TUM 						: "Tumble",

			RES_OPTION_R200 						: "200 dpi",
			RES_OPTION_R300 						: "300 dpi",
			RES_OPTION_R400 						: "400 dpi",
			RES_OPTION_R600 						: "600 dpi",

			CM_OPTION_AUTO 							: "Auto",
			CM_OPTION_COLOR 						: "Color",
			CM_OPTION_GRAY 							: "Photo + Text",
			CM_OPTION_BW 							: "Text",

			HP_LEFT 								: "Head left",
			HP_TOP 									: "Head top"
			/******scan status page**************************************************/
		},
		FAX_AREA_CODE:{
			AREA_NAME:{
				0  : "Direct input",
				1  : "Seoul",
				2  : "Gyeonggi-do",
				3  : "Incheon",
				4  : "Gangwon-do",
				5  : "Chungcheongnam-do",
				6  : "Daejeon",
				7  : "Chungcheongbuk-do",
				8  : "Sejong",
				9  : "Busan",
				10 : "Ulsan",
				11 : "Daegu",
				12 : "Gyeongsangbuk-do",
				13 : "Gyeongsangnam-do",
				14 : "Jeollanam-do",
				15 : "Gwangju",
				16 : "Jeollabuk-do",
				17 : "Jeju-do"
			},
			AREA_CODE:{
				0  : "direct",
				1  : "02",
				2  : "031",
				3  : "032",
				4  : "033",
				5  : "041",
				6  : "042",
				7  : "043",
				8  : "044",
				9  : "051",
				10 : "052",
				11 : "053",
				12 : "054",
				13 : "055",
				14 : "061",
				15 : "062",
				16 : "063",
				17 : "064"
			}
		},
		PreferencePage:{
			LBL_Title								: "환경설정",
			LBL_BAR_TITLE							: "Title:",
			LBL_SERVER_URL							: "서버주소:",
			LBL_CHECK_SCAN							: "스캔사용:",
			LBL_CHECK_FAX							: "팩스사용:",
			LBL_NATIVE_SCAN							: "복합기 스캔:",
			LBL_NATIVE_FAX							: "복합기 팩스:",
			LBL_SCAN_TYPE							: "스캔 방법 설정:",
			SELECT_USED								: "사용",
			SELECT_UNUSED							: "미사용",
			SELECT_NATIVE_SCAN_OPT0					: "미사용",
			SELECT_NATIVE_SCAN_OPT1					: "Scan to PC",
			SELECT_NATIVE_SCAN_OPT2					: "Store to Folder",
			SELECT_NATIVE_SCAN_OPT3					: "E-mail",
			SELECT_NATIVE_FAX_OPT0					: "미사용",
			SELECT_NATIVE_FAX_OPT1					: "Fax",
			SELECT_NATIVE_FAX_OPT2					: "Simple Fax",
			SELECT_SCAN_TYPE_OPT0					: "USB Only",
			SELECT_SCAN_TYPE_OPT1					: "PC Only",
			SELECT_SCAN_TYPE_OPT2					: "USB & PC",
			MSG_SETTING_FAIL						: "동시사용은 불가능 합니다.",
			LBL_CHARGE_MODE							: "카드리더 설정:",
			SELECT_TECHREADER						: "테크리더",
			SELECT_JWORKS							: "JetWork",
			LBL_CHARGE_URL							: "리더기 주소:",
			SCAN_PC_SERCH_MSG1						: "연결 PC 확인중...(다소 시간이 걸립니다.)",
			SCAN_PC_SERCH_MSG2						: "PC 확인을 완료했습니다.",
			SCAN_PC_SERCH_MSG3						: "PC 5대 확인을 완료했습니다."
		},
		PreferencePage2:{
			LBL_Title								: "환경설정"
		},
		NoticePopup:{
			title									: " ",
			Title_Fail								: "Error",
			Title_Warn								: "Caution",
			Title_Info								: "Notice",

			btnConfirm		  						: "Confirm",
			btnCancel		  						: "Cancel",
			btnRetry		  						: "Back",
			btnSetting		  						: "Setting",
			btnAdmin		  						: "Resetting",
			Msg_Other		  						: ["An unknown error occurred.", "Please contact administrator."],
			Msg_Auth		  						: ["The multifunction device settings are not suitable for using the service.", "Please check the authentication settings."],
			Msg_ResFail		  						: ["There is no response from the MFP.", "Please check the network settings and authentication settings."],
			Msg_TrayFail	  						: ["Cannot check the paper information of the MFP."],
			Msg_BillFail	  						: ["Could not get billing information from the server.", "Please check the server's billing information or server address settings."],
			Msg_ListFail	  						: ["Cannot get document information from server.", "Please contact administrator."],
			Msg_PowerOff	  						: ["Please turn off the power of the MFP."],
			Msg_WriteFail	  						: ["Failed to save file.", "Contact the developer."],
			Msg_ChargeInfoFail						: ["Failed to obtain information required for charging.", "Please contact administrator."],
			Msg_DocEmpty	  						: ["There is no document to print","Please check the input ID."],
			Msg_RegiResFail	  						: ["Could not get registration information from server.", "Please contact the administrator."],
			Msg_RegiFail	  						: ["This device has not been licensed.", "Please use it after registering the license."],
			Msg_ChargeFail    						: ["Payment failed.", "Cancel the operation."],
			Msg_SERVER_Fail   						: ["The network connection with the server was lost.", "Please contact administrator."],
			Msg_NONE_PC		  						: ["Cannot connect to the selected PC.", "Choose another PC or contact the administrator."],
			Msg_FAX_Send_Search_Guide 				: ["To check the fax transmission status", "Scan the QR code below."],
			Msg_FAX_Send_Search_NO_QR 				: ["Not yet serviceable.", "Please contact the administrator."],
		}

	},
}
