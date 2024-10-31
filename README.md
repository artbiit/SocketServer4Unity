# SocketServer4Unity
> [유니티 샘플](https://github.com/artbiit/Unity4SockerServer)과 통신하기 위한 소켓 서버입니다.

#  📁 서버 프로젝트 구조

```plaintext
📂src
├── 📂 classes
│   ├── 📂 managers        # 게임 관련 로직과 상태를 관리하는 매니저 클래스들
│   └── 📂 models          # 프로젝트에서 사용하는 데이터 모델들
│   └── 📂 configs         # 시스템의 여러 설정을 관리하는 설정 파일들
├── 📂 db
│   ├── 📂 sql             # SQL 쿼리 파일들
│   └── 📂 user            # 사용자 데이터베이스 유틸리티, 포함된 파일:
│       ├── 🟨 mysql.js    # MySQL 관련 쿼리와 연결 로직
│       ├── 🟨 redis.js    # Redis와의 상호작용을 위한 유틸리티(이 서버에선 사용하진 않음)
│       └── 🟨 utils.js    # 사용자 데이터베이스 작업에 관련된 추가 도우미 함수
├── 📂 events
│   ├── 🟨 onConnection.js # 사용자가 연결될 때의 이벤트 처리
│   ├── 🟨 onData.js       # 클라이언트로부터 들어오는 데이터를 처리
│   ├── 🟨 onEnd.js        # 연결 종료 이벤트 처리
│   └── 🟨 onError.js      # 연결 또는 데이터와 관련된 에러를 처리
├── 📂 handlers
│   ├── 📂 common          # 다양한 컴포넌트에서 공통으로 사용하는 핸들러
│   ├── 📂 game            # 게임에 특화된 이벤트 및 데이터 핸들러
│   └── 📂 initial         # 초기 요청 핸들러 및 관련 로직
│       ├── 🟨 index.js    # 초기 핸들러의 진입점 파일
│       └── 🟨 result.js   # 초기 결과나 응답을 처리하는 파일
├── 📂 init
│   ├── 🟨 index.js        # 프로젝트 설정과 초기화 로직을 관리하는 파일
│   └── 🟨 loadProtos.js   # Protobuf 파일들을 로드하고 설정하는 기능
├── 📂 protobuf
│   ├── 📂 notification    # 알림과 관련된 Protobuf 메시지 정의
│   ├── 📂 request         # 클라이언트 요청에 대한 Protobuf 메시지 정의
│   └── 📂 response        # 서버 응답에 대한 Protobuf 메시지 정의
├── 📂 session
│   └── 🟨 user.session.js # 사용자 세션 관리를 위한 파일, 사용자 상태 추적 등을 담당
├── 📂 tests
│   ├── 🟨 client.js       # 클라이언트 테스트 관련 코드
│   ├── 🧪 initial.test.js # 초기 요청 핸들러와 관련된 테스트 파일
│   └── 🧪 ping.test.js    # 연결 상태 확인 및 핑 테스트 관련 코드
├── 📂 utils
│   ├── 📂 error           # 에러 처리를 위한 유틸리티 파일들
│   ├── 📂 notification    # 알림 관련 유틸리티 코드
│   ├── 📂 parser          # 데이터 파싱 관련 유틸리티
│   └── 📂 response        # 응답 처리를 위한 유틸리티 파일들
│   └── 🟨 logger.js       # 로그 기록을 위한 유틸리티, 서버 동작 추적 및 에러 기록
├── 🟨 server.js           # 서버의 진입점 파일, 전체 애플리케이션을 실행하고 설정
├── 🟩 .dockerignore       # Docker 이미지 생성 시 무시할 파일 목록
├── 🟩 .env                # 환경 변수 설정 파일, 서버 구성 및 인증 정보 관리

```


# 문서

- [기능 정리 문서](./docs/features/index.md)
- [트러블슈팅 문서](./docs/troubleshootings/index.md)