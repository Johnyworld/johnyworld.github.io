---
tags:
  - 공부
  - 블로그발행
Created: 2022-03-03
---
## CORS의 개념

CORS는 Cross Origin Resource Sharing의 약자로, **서로 다른 Origin끼리 자원을 공유할 수 있게 하는 정책**을 말합니다. 그렇다면 Origin은 무엇일까요?

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F32451304-ea2f-40f4-98a0-5ee532714bef%2FScreen%20Shot%202022-03-03%20at%2010.53.52%20AM.png)

위 그림은 URI의 각 부분의 명칭입니다. 여기서 `Protocol, Host, Port` 세 부분을 Domain이라고 하고, Origin(출처)는 Domain을 가리킵니다. 즉, 같은 출처(Same Origin)란, Domain이 같다는 것을 의미하고 교차 출처(Cross Origin)란 Domain이 서로 다른 것을 의미합니다.

CORS가 왜 필요할까요? 이것을 이해하려면 한 도메인에서 다른 도메인으로 요청을 할때 어떤 문제가 발생할 수 있는지에 대해서 먼저 이해해야 합니다.

## SOP (Same Origin Policy)

SOP는 **동일 출처 정책**입니다. (위에 Same Origin이 무엇인지 설명한 바 있습니다.) SOP는 **동일한 출처에서만 자원을 공유할 수 있도록 브라우저에서 시행하는 보안 표준**입니다.

Javascript에서의 교차 도메인 요청은 XSS(Cross Site Scripting)이나 XSRF(or CSRF - Cross Site Request Forgery)등의 악성 스크립트 공격을 방지하기 위한 **동일 출처 정책**에 의해 제한됩니다. fetch 또는 XMLHttpRequest와 같은 메소드를 사용하여 AJAX 요청을 할 때 SOP가 주로 작동합니다.

`http://localhost:3000` 에서 `http://localhost:5000` 으로 유저 정보 등의 자원을 요청을 보낸다고 가정 합시다. 이 둘은 Port가 서로 다르기 때문에 _교차 도메인 요청_이 됩니다. 따라서 브라우저는 SOP에 따라 요청을 차단하게 됩니다.

이 때, 요청을 차단하지 않도록 서버 측에서 특정 Domain을 신뢰하고 **자원 공유를 허용**한다고 브라우저에게 알려 주는 것이 바로 CORS 입니다.

## CORS 요청

### Preflight Request

웹 페이지가 원격 리소스에 대한 Http 요청을 만들 때 브라우저는 대상 서버에 본 요청(Actual Request)을 보내기 전에 **리소스 공유가 허용되는지 확인**하기 위한 사전 요청을 먼저 보냅니다. 이것을 **Preflight Request**이라고 합니다.

사전 요청에는 브라우저에게 알려주기 위해 요청 헤더에 아래 정보들을 표현해줘야 합니다.

-   `Origin`: 어디서 요청하는지에 대한 출처
-   `Access-Control-Request-Method`: Actual Request의 메서드
-   `Access-Control-Request-Headers`: Actual Request의 추가 헤더

### Preflight Response

대상 서버는 브라우저가 허용되는 요청 방법과 도메인을 알 수 있도록 하는 일련의 CORS 헤더를 응답합니다. 이를 기반으로 브라우저는 요청을 통과시키거나 차단합니다. 서버가 응답하는 헤더는 아래와 같습니다.

-   `Access-Control-Allow-Origin`: 허가 된 출처에 대한 명시
-   `Access-Control-Allow-Methods`: 허가 된 메서드에 대한 명시
-   `Access-Control-Allow-Headers`: 허가 된 헤더에 대한 명시
-   `Access-Control-Max-Age`: Preflight 응답 캐시 기간

### Simple Request

사전 요청이 항상 필요한 것은 아닙니다. 그러한 경우는 사전 요청이 아닌 Simple Request로 처리됩니다. Simple Request로 처리되는 경우는 아래와 같습니다.

-   `GET`, `HEAD`, `POST` 중 하나의 method로 전송한다.
-   `POST` method로 전송하는 경우 `Content-Type`이 아래 중 하나이다.
    -   `multipart/formdata`
    -   `text/plain`
    -   `application/x-www-form-urlencoded`
-   `Headers`가 아래 목록 중 하나이다.
    -   `Accept`
    -   `Accept-Language`
    -   `Content-Language`
    -   `Content-Type`

### 왜 Preflight 요청이 필요할까?

사전 요청이 없이 Actual Request 만 존재한다면, CORS를 설정하지 않은 서버에서 문제가 될 수 있습니다. 아래와 같은 상황입니다.

1.  클라이언트는 `id: 5`의 상품을 삭제해달라는 `DELETE` 요청을 서버로 보냅니다.
2.  서버는 요청을 받고 `id: 5`의 상품을 삭제하고 응답을 보냅니다.
3.  응답에 CORS 헤더가 존재하지 않기 때문에 브라우저는 `CORS` 에러 메시지를 발생시킵니다.

위 상황에서, CORS 에러가 발생하기 전에 이미 `id: 5`의 상품은 삭제가 되었습니다. Preflight Request가 존재하는 경우 위 상황을 예방할 수 있습니다.

1.  클라이언트는 `id: 5`의 상품을 삭제해달라는 `DELETE` 요청을 서버로 보냅니다.
2.  먼저 Preflight Request를 보내고 서버는 Preflight Response를 보냅니다.
3.  응답에 CORS 헤더가 존재하지 않기 때문에 브라우저는 `CORS` 에러 메시지를 발생시킵니다.

## Credentialed Request

HTTP Cookie, HTTP Authentication, JWT Token 등의 인증 관련 헤더를 포함할 때 사용하는 요청입니다.

클라이언트에서는 `Credentials: "include"`를 헤더에 포함해야 합니다.

서버에서는 `Access-Control-Allow-Credentials: "true"`를 헤더에 명시해야 하며, `Access-Control-Allow-Origin: "*"` 와 같이 처럼 **모든 출처를 허용할 수는 없습니다.**

## 참고한 자료

-   [https://medium.com/bigcommerce-developer-blog/lets-talk-about-cors-84800c726919](https://medium.com/bigcommerce-developer-blog/lets-talk-about-cors-84800c726919)
-   [https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/](https://homoefficio.github.io/2015/07/21/Cross-Origin-Resource-Sharing/)
-   [https://www.youtube.com/watch?v=-2TgkKYmJt4](https://www.youtube.com/watch?v=-2TgkKYmJt4)