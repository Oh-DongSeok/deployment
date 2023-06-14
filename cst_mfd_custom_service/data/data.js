var DATA = {
	"DEFAULT_CHECK":true,
	"BAR_TITLE":"CST Print",
	"TITLE_NAME":"Billing App",
	"SERVER_URL":"http://10.97.4.42:9001/",
	"SERVICE":{
		"SCAN":true,
		"FAX":true,
		"NATIVE_SCAN":"unused",
		"NATIVE_FAX":"unused",
		"DEFAULT_FAX_AREA_CODE":"032",
		"SCAN_TYPE":"up"	// u : usb, p : PC, up : usb & PC
	},
	"CHARGE_MODE":{
		"CHARGE_TYPE":"jetwork",	// techreader, jetwork
		"CHARGE_URL":"https://pay.cstsolution.co.kr/api/mfd/"
	},
	"LOGIN_INFO":{
		"ID":"ch",
		"PASSWORD":"1212",
		"COUNTER":2,
		"TIMEOUTS":60000
	},
	"SCAN_PC_IP":{
		0:"",
		1:"",
		2:"",
		3:"",
		4:""
	},
	"SCAN_PC_NAME":{
		0:"",
		1:"",
		2:"",
		3:"",
		4:"",
	}
}
/*
DEFAULT_FAX_AREA_CODE 입력방법:

| Number   | Area          |
|----------|---------------|
| direct   | 직접입력       |
| 02       | 서울특별시     |
| 031      | 경기도         |
| 032      | 인천광역시     |
| 033      | 강원도         |
| 041      | 충청남도       |
| 042      | 대전광역시     |
| 043      | 충청북도       |
| 044      | 세종특별자치시 |
| 051      | 부산광역시     |
| 052      | 울산광역시     |
| 053      | 대구광역시     |
| 054      | 경상북도       |
| 055      | 경상남도       |
| 061      | 전라남도       |
| 062      | 광주광역시     |
| 063      | 전라북도       |
| 064      | 제주특별자치도 |
*/