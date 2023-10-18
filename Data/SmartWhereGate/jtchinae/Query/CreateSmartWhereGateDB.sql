-- --------------------------------------------------------
--
-- Database: `SmartWhereGate`
--

CREATE DATABASE IF NOT EXISTS `SmartWhereGate` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `SmartWhereGate`;

-- --------------------------------------------------------

--
-- 테이블 구조 `GATE_ENVIRONMENT`
--

CREATE TABLE IF NOT EXISTS `GATE_ENVIRONMENT`
(
    `ID`                            bigint(20)   NOT NULL AUTO_INCREMENT                COMMENT '중계서버 환경설정의 구분자 (자동생성)',
    `IS_ENABLED`                    tinyint(4)   NOT NULL DEFAULT '0'                   COMMENT '중계서버 환경설정 사용여부 (0: false, 1: true)',
    `DATE`                          timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP     COMMENT '중계서버 환경설정 등록시간 (default: Insert 시간)',
    `NAME`                          varchar(128) NOT NULL DEFAULT 'UNNAMED ENVIRONMENT' COMMENT '중계서버 환경설정명',
    `SERVICE_IP_ADDRESS`            varchar(48)  NOT NULL DEFAULT '0.0.0.0'             COMMENT '중계서버 IP주소',
    `SERVICE_PORT`                  int(11)      NOT NULL DEFAULT '515'                 COMMENT '중계서버 데이터 수신 포트번호 (default: 515)',
    `SMARTWHERE_IP_ADDRESS`         varchar(48)  NOT NULL DEFAULT '127.0.0.1'           COMMENT 'SmartWhere 서버의 IP 주소',
    `SMARTWHERE_PORT`               int(11)      NOT NULL DEFAULT '515'                 COMMENT 'SmartWhere 서버의 포트번호 (default: 515)',
    `THREAD_MANAGING_CYCLE_MS`      int(11)      NOT NULL DEFAULT '1000'                COMMENT '다중 스레드에 대한 수명관리 동작 주기\n- 단위: milliseconds\n- 범위: 500ms ~ 60000ms (0.5sec ~ 60sec)\n- default: 1000ms = 1sec',
    `LOG_MANAGING_CYCLE_MS`         int(11)      NOT NULL DEFAULT '3600000'             COMMENT '로그에 대한 수명관리 동작 주기\n- 단위: milliseconds\n- 범위: 5000ms ~ 3600000ms (5sec ~ 1hours)\n- default: 3600000ms = 1hours',
    `CONNECTION_WAITING_TIMEOUT_MS` int(11)      NOT NULL DEFAULT '3000'                COMMENT 'Client 수신 대기 Timeout\n- 단위: milliseconds\n- 범위: 100ms~5000ms (0.1sec ~ 5sec)\n- default: 500ms = 0.5sec',
    `FORCED_TERMINATED_TIMEOUT_MS`  int(11)      NOT NULL DEFAULT '60000'               COMMENT '프로그램 종료시 프로세스 Cancel 처리 대기시간 (이후 강제종료)\n- 단위: milliseconds\n- 범위: 1000ms ~ 3600000ms (1sec ~ 1hours)\n- default: 60000ms = 60sec',
    `BUFFER_SIZE`                   int(11)      NOT NULL DEFAULT '1048576'             COMMENT '중계서버 내부의 메모리 버퍼크기\n- 단위: bytes\n- 범위: 524288byte ~ 67108864byte (512KB ~ 64MB)\n- default: 1048576byte = 1MB',
    `IS_JOB_LOGGING`                tinyint(4)   NOT NULL DEFAULT '1'                   COMMENT '중계 JOB에 대한 LOG 기록 여부 (0: false, 1: true)\n- default: true',
    `LOG_REMAIN_DAYS`               int(11)      NOT NULL DEFAULT '365'                 COMMENT '서비스 로그와 JOB 로그의 보존기간\n- 단위: days\n- 범위: 0~1000 days (0: 제한없음)\n- default: 365 days',
    `CALCULATE_LPR_BYTE_SIZE`       tinyint(4)   NOT NULL DEFAULT '1'                   COMMENT '중계서버측 스풀파일 크기 체크 여부 (0: false, 1: true)\n- MMD2 "LPR 바이트 계산 사용" 체크 -> false\n- MMD2 "LPR 바이트 계산 사용" 체크안함 -> true\n- default: false',
    `ALLOWED_DISK_IO`               tinyint(4)   NOT NULL DEFAULT '1'                   COMMENT '중계서버의 DISK I/O 허용여부 (0: not allowed, 1: allowed)\n- default: true',
    `TEMP_SPOOL_DIRECTORY_PATH`     varchar(512)          DEFAULT 'spool\\'             COMMENT '중계서버 DISK I/O 동작시의 임시 스풀 디렉토리 경로 (절대경로/상대경로)\n- default: spool\\',

    PRIMARY KEY (`ID`),
    UNIQUE KEY  `ID_UNIQUE` (`ID`)
)
ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `GATE_ENVIRONMENT` VALUES (1,1,CURRENT_TIMESTAMP,'UNKNOWN','0.0.0.0',515,'127.0.0.1',515,1000,3600000,500,60000,1048576,1,365,0,1,'spool\\');

-- --------------------------------------------------------

--
-- 테이블 구조 `GATE_JOB_LOG`
--

CREATE TABLE IF NOT EXISTS `GATE_JOB_LOG`
(
    `ID`             bigint(20)   NOT NULL AUTO_INCREMENT            COMMENT '중계 JOB LOG 구분자 (자동생성)',
    `DATE`           timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '중계 JOB LOG의 생성시간 (default: Insert 시간)',
    `IS_SUCCESS`     tinyint(4)   NOT NULL DEFAULT '0'               COMMENT '중계 JOB의 성공 여부 (0: fail, 1: success)',
    `CLIENT_ADDRESS` varchar(48)  NOT NULL                           COMMENT '중계 Client Side의 IP 주소',
    `CLIENT_PORT`    int(11)      NOT NULL DEFAULT '515'             COMMENT '중계 Client Side의 포트 번호 (default: 515)',
    `SERVER_ADDRESS` varchar(48)  NOT NULL                           COMMENT '중계 Server Side(SmartWhere)의 IP 주소',
    `SERVER_PORT`    int(11)      NOT NULL DEFAULT '515'             COMMENT '중계 Server Side(SmartWhere)의 포트 번호 (default: 515)',
    `CONNECTION`     int(11)      NOT NULL DEFAULT '0'               COMMENT 'Server-Client간 연결 구분자(TcpClient Hashcode)',
    `FILE_NAME`      varchar(512) NOT NULL                           COMMENT '중계 JOB의 파일명',
    `DESCRIPTION`    varchar(512)          DEFAULT NULL              COMMENT '비고',

    PRIMARY KEY (`ID`),
    UNIQUE KEY  `ID_UNIQUE` (`ID`)
)
ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `SERVICE_LOG`
--

CREATE TABLE IF NOT EXISTS `SERVICE_LOG`
(
    `ID`        bigint(20)    NOT NULL AUTO_INCREMENT,
    `DATE`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `SERVICE`   varchar(255)  NOT NULL DEFAULT 'UNNAMED_SERVICE',
    `THREAD`    varchar(20)   NOT NULL DEFAULT '0',
    `CLASS`     varchar(45)   NOT NULL,
    `LEVEL`     varchar(45)   NOT NULL DEFAULT 'DEBUG',
    `MESSAGE`   varchar(2000) NOT NULL,
    `EXCEPTION` varchar(5000)          DEFAULT NULL,

    PRIMARY KEY (`ID`),
    UNIQUE KEY `ID_UNIQUE` (`ID`)
)
ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------