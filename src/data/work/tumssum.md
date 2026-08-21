> AWS에서 서비스하다보니 과금이 생겨서 유지비를 아끼려, 현재는 서비스 중지중입니다.

## 소개

오랜시간 써 온 가계부를 더 편리하게 쓰기 위해 공부도 할 겸 만들어 본 프로젝트입니다. 최소 기능으로 먼저 배포하여 9개월 넘게 직접 사용하며 테스트 했습니다.

## 서비스 개발/운영, 문제해결

- 안정성과 개인 학습을 위해 [**스토리북 주도 개발(SDD)**](https://johnyworld.github.io/post/%EB%AC%B8%EC%84%9C%20%EC%A3%BC%EB%8F%84%20%EA%B0%9C%EB%B0%9C#%F0%9F%93%98%20%EC%8A%A4%ED%86%A0%EB%A6%AC%EB%B6%81%20%EC%A3%BC%EB%8F%84%20%EA%B0%9C%EB%B0%9C) 과 **TDD**를 지키며 개발
- 개인 학습을 위해 **EC2, RDS(MySQL), Route53, S3** 등 유료 AWS 서비스를 적극 이용
- 쉽고 직관적으로 가계부를 쓸 수 있도록 **드래그 앤 드롭** 기능 자체 개발
- EC2 환경을 개발 환경과 동일하게 맞추기 위해 **Docker** 적용

## 스펙

- React, Django(Python), Redux toolkit, SCSS
- Storybook, Docker, React testing library, Jest
- OAuth2(Social authentication), Email authentication (JWT token)
- AWS EC2, RDS(MySQL)
- [관계형 데이터](https://drawsql.app/teams/johnyworld/diagrams/tumssum) 설계, 반응형 웹 디자인

## 화면

### 가계부 화면

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/tumssum-1.jpg)

### 로그인 화면

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/tumssum-2.png)

### 스토리북 UI 문서

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/resume/tumssum-3.png)