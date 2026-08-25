> 현재는 서비스 중지중입니다.

## 소개

학습 목적으로 기획, 디자인, 개발까지 모두 맡아 만들었습니다. 매 시간 무엇을 했는지 기록하는 일은 '시간 가계부', '데일리 리포트'등의 이름으로 불려집니다. 데이로그 웹 서비스는 최소 15분 단위로 본인이 무엇을 했는지 기록할 수 있습니다. 

## 스펙

- React
- GraphQL, Apollo
- i18next 다국어 지원
- AWS S3
- Heroku

## 브랜딩

### 컨셉

기록을 통해 하루를 반성하고 내일 더 나은 하루를 보내며 더 나아가 완벽한 하루를 보내기 위한 자기계발 서비스 입니다.

### 슬로건

오늘, 얼마나 시간을 낭비했나요?

### 네이밍

10개의 키워드를 조합하여 만든 여러 단어들 중 'Daylog'라는 이름을 추출했습니다.

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/branding-naming.jpg)

### 로고

Daylog의 맨 앞자인 'D'와 '기록'을 의미하는 깃털펜의 형태를 조합하여 심볼을 제작했고, 로고타입은 심플하고 부드러운 서체인 Open Sans를 사용했습니다.

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/branding-logo.jpg)

## 기획

### Information Architecture

6개의 기본 메뉴로 구성 되어있고 하루의 일과를 관리할 수 있는 Today가 메인 페이지입니다.

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/ui-menus.jpg)

### Flow charts

혼자 하는 프로젝트지만, 플로우차트를 작성하여 여러가지 상황에 대처할 수 있도록 고민하였습니다.

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/flowchart-1.jpg)
![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/flowchart-2.jpg)

### Wireframes

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/wireframe-today.jpg)
![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/wireframe-log.jpg)
![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/wireframe-feed_and_menu.jpg)

## 데이터모델

### Entity Relationship Diagram

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/data-diagram.jpg)

### Relational Data Model

![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/data-rdm.jpg)

## 컬러 가이드

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; justify-contents: space-between">
  <div style="width: 100%; height: 80px; background-color: #1a9df9; color: white; display: flex; justify-content: center; align-items: center;">Day Blue</div>
  <div style="width: 100%; height: 80px; background-color: #61bffb; color: white; display: flex; justify-content: center; align-items: center;">Day Blue light</div>
  <div style="width: 100%; height: 80px; background-color: #94d1fc; color: white; display: flex; justify-content: center; align-items: center;">Day Blue lighter</div>
  <div style="width: 100%; height: 80px; background-color: #09446e; color: white; display: flex; justify-content: center; align-items: center;">Day Blue dark</div>
  <div style="width: 100%; height: 80px; background-color: #40627a; color: white; display: flex; justify-content: center; align-items: center;">Day Gray dark</div>
  <div style="width: 100%; height: 80px; background-color: #a5b4c3; color: white; display: flex; justify-content: center; align-items: center;">Day Gray</div>
  <div style="width: 100%; height: 80px; background-color: #edf2f6; color: white; display: flex; justify-content: center; align-items: center;">Day Gray light</div>
  <div style="width: 100%; height: 80px; background-color: #ec4040; color: white; display: flex; justify-content: center; align-items: center;">Day Red</div>
</div>

## 화면

### 로그인 

#### 간편한 회원 가입 / 인증코드 로그인

단 3개의 정보만 입력하면 회원가입이 가능하고, 비밀번호 없이 인증코드로 로그인합니다. JWT토큰 인증방식을 사용했습니다.

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/login-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/login-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/login-4.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/login-3.jpg) |

### 다국어

#### 한글/영문 언어를 지원합니다.

- 접속 국가의 언어에 따라 처음 언어가 설정됩니다.
- 프로필 수정 화면에서 언어를 변경할 수 있습니다.
- 언어 설정이 없는 국가는 기본적으로 영어로 표시됩니다.
- 인증 메일도 설정 된 언어로 전송됩니다.

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/login-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/lang-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/lang-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/lang-3.jpg) |

### 하루의 기록

#### 타임라인 인터페이스

타임라인 UI로 한눈에 일정을 확인할 수 있고 한번의 클릭으로 빠른 일정 등록과 수정이 가능합니다.

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/today-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/today-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/today-4.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/today-3.jpg) |

### 통계

#### 일간, 주간, 월간, 연간의 통계

- 시간, 퍼센트 단위의 원형 그래프
- 오전 / 오후로 구분된 원형 타임 테이블
- 일간, 주간, 월간, 연간 단위의 리뷰 작성

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/log-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/log-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/log-3.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/log-4.jpg) |

### 소셜 네트워킹

#### 팔로우와 소통

- 친구의 리뷰와 일정을 피드로 확인합니다.
- 댓글과 좋아요로 서로 응원합니다.

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/feed-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/feed-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/feed-3.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/feed-4.jpg) |

### 나만의 루틴

#### 직접 만들고 공유하는 일과 아이템

- 기본으로 제공되는 다양한 라인 아이콘들과 색상 팔레트
- 기본 아이콘들은 개발자가 직접 그린 SVG 입니다.
- 직접 만든 아이콘 파일을 업로드하세요.
- 예쁜 색상과 개성 있는 아이콘의 조합을 만드세요.
- 내가 만든 루틴은 다른 사람이 사용할지도 모릅니다!

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/edit-doing-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/edit-doing-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/edit-doing-3.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/edit-doing-4.jpg) |

### 기타

- 함께할 친구를 검색합니다.
- 프로필사진과 아이콘은 적당한 크기로 리사이즈 되어 AWS S3 버킷에 업로드 됩니다.

|||||
|---|---|---|---|
| ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/etc-1.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/etc-2.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/etc-3.jpg) | ![](https://johnyworld2019.s3.ap-northeast-2.amazonaws.com/images/work/daylog/pc/etc-4.jpg) |

