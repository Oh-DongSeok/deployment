var DATA = {
	JOB_LIST_COUNT		: 40,
	TIME_TYPE			: 1,
	TITLE_NAME			: "SmartWhere",
	TIMEOUT				: 10,
	SKIP				: 0,
	BUTTON_DEFAULT		: "select",
	COLOR_DISPLAY		: true,
	SERVER_URL			: [
		"http://10.134.187.103:9009/",
		"Re-enter",
		"Re-enter",
		"Re-enter",
		"Re-enter",
		"Re-enter"
	],
	DELETE				: 0,
	LIST_AUTO_SELECT	: 0,
	UPDATE_DELAY_TIME	: 1000,
	LIST_SORT_ASC		: true,
	NAME_DISPLAY_SELECT : "relatedid",
	MULTI_SERVER_TYPE	: 0,
	BANNER_URL 			: "https://10.134.187.103:28000/data/main_msg.js"
};

/** ---- Readme -------------------------------------------------------------------
 * JOB_LIST_COUNT: Job List 표시건수 제한 수치
 *    40: 최대 40건 표시(Default)
 *    80: 최대 80건 표시
 * TIME_TYPE: 미사용 기능
 * TITLE_NAME: SmartUI Title Bar 표시 문구
 *    Default String: "SmartWhere"
 * TIMEOUT: 서버와 통신 불가 검지 시간
 *    Default: 10
 * SKIP: 메인메뉴 화면 표시 Skip 기능 선택출력만 사용할 경우
 *    0: 메인메뉴 표시(Default)
 *    1: 선택출력화면 표시
 * BUTTON_DEFAULT: 즉시출력, 선택출력 버튼의 초기 선택 상태 설정
 *    prompt: 즉시출력 우선
 *    select: 선택출력 우선
 *    last: 마직막 선택 버튼을 우선
 *    none: 모두 선택하지 않은 상태로 설정,
 *    auto: 출력 건수가 1건이면 즉시출력, 2건 이상이면 선택출력(Default)
 * COLOR_DISPLAY: 흑백 복합기의 경우 컬러관련 내용의 표시 여부 설정
 *    true: 표시(Default)
 *    false: 비표시(흑백기의 경우만 사용)
 * SERVER_URL: SmartWhere WebService 주소(필수기입)
 *    ex) ["http://13.197.1.229:9009/","http://13.197.1.220:9009/","Re-enter","Re-enter","Re-enter","Re-enter"]
 *    ### 주의사항 ###
 *    1. 사용하지 않은 서버주소 입력 내용에는 "Re-enter"를 입력해 둡니다.
 *    2. 주소 입력시 마지막에 "/"를 꼭 입력해주세요. 주소인식을 할수없어 "Re-enter"로 바뀔 수 있습니다.
 * DELETE: 문서의 저장/삭제 초기
 *    0: 삭제(Default)
 *    1: 저장
 * UPDATE_DELAY_TIME: 일반적인 상황에서는 변경하지 말아주세요.
 *    Default: 1000(1sec)
 * LIST_AUTO_SELECT: 선택출력 리스트의 자동선택 사용/미사용
 *    0: 미사용(Default)
 *    1: 사용
 * NAME_DISPLAY_SELECT: Title Bar의 유저 명칭 표시 설정
 *    - 해당 항목은 서버에 따른 설정이므로 설치전에 확인을 해주세요. 설치후 변경불가
 *    auto: 우선순위에 따른 자동 표시
 *    userid: User ID를 표시
 *    relatedid: Releated User ID를 표시(Default)
 *    displayname: Display Name 을 표시
 * MULTI_SERVER_TYPE: 다중 Print Server의 운영 Type
 *	  0: 각 Server별 DB도 다중으로 되어 있는 경우
 *    1: DB는 단독, 각 Server만 다중으로 되어 있는 경우
 * -------------------------------------------------------------------------------- */