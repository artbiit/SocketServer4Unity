# 프로토버퍼

## 불러오기

protobuf 하위의 *.proto 파일들을 불러와 Package와 Message 명칭으로 정리합니다.
외부에선 [Pakcage][Message]와 같은 규격으로 불러올 수 있게 했습니다.


## 불러오기 시점
소켓 서버를 생성하기 전에 프로토버퍼를 불러옵니다.