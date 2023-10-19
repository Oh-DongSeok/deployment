# Interface

## GetDivisionInfo

**Request URL:**
 - http://{서버주소}:{port}/GetDivisionInfo

----

### Request Example Value
```json
{
	"userId"	:"xxxxx",
	"deviceIp"	:"xxx.xxx.xxx.xxx"
}
```
* deviceIp : 복합기가 아닌 외부 호출인 경우 확인용 필요시에는 시리얼 넘버 추가 가능/불필요시에는 삭제 가능함

----
### Response Example Value
```json
{
	"division"	: "xxxxx",
	"serverUrl"	: "https://xxx.xxx.xxx.xxx:9009/",
	"status" 	: "success",
	"reason" 	: ["실패 사유"]
}
```

 - division : 소속 정보
 - serverUrl : 해당 사용자의 서버 주소
 - status : 성공/실패 여부 (성공 : "success", 실패 : "failure")
 - reason : string 실패 시 사유

    - 실패 사유
        - 존재하지 않는 사용자
        - 존재하지 않는 복합기 (복합기가 아닌 외부 호출인 경우 탐지용)
        - 소속을 알 수 없는 사용자
        - DB와 연결 오류
        - 해당 소속 주소 없음

