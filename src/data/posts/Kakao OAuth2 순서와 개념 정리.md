---
Created: 2022-02-08
tags:
  - 공부
  - 블로그발행
---
> -   이 글에는 자세한 코드나 사용법은 다루지 않음.
> -   틀린 부분이 있을 수 있음. 건강한 토론의 댓글은 환영 합니다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F895be5f2-f737-4736-b364-170653c8c555%2FScreen%20Shot%202022-02-08%20at%201.52.04%20PM.png)

그냥 내가 느낀 점

1.  백엔드와 클라이언트 소스 코드가 분리되어있는 경우에는 SDK가 마음 편함.
    -   예를들면 `React` - `Nest` 등의 조합
2.  SDK를 사용하지 않는 경우 프론트엔드에서 kauth.kakao.com 호스트와 통신하여 access_code를 응답 받는 방법이 있음. 이 경우 callback을 위한 route를 하나 만들어 줘야 함.
3.  페이지를 백엔드에서 만들어서 라우팅 하는 경우, passport를 사용하면 편하다.
    -   로그인 기능의 소스 코드가 클라이언트와 분리 되어있지 않은 경우

---

## SDK

SDK로 카카오 로그인을 진행하는 경우 위 6개 단계를 2개 단계로 생략하게 된다. **인증코드 요청부터 토큰 전달**까지 4개 단계를 SDK가 해주고, 토큰으로 **로그인 API를 호출 & 응답** 받으면 된다.

### 인증코드 요청부터 토큰 전달

SDK로 KakaoOAuth2를 진행하는 경우, 아래와 같이 `access_token`을 받아서 바로 API 호출 단계로 넘어간다.

```js
Kakao.Auth.login({
  success: res => {
    ... 
    Kakao.Auth.setAccessToken(res.access_token);
    const csrftoken = Cookies.get('csrftoken');
    
    axios.post('/api/auth/kakao', {
      access_token: res.access_token,
      headers:{
        "Access-Control-Allow-Origin": '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
    })
    ...
  },
  ...
})
```

### 로그인 API 호출 & 응답

`/api/auth/kakao` 엔드포인트에서는 `access_token`을 이용해 아래 경로에서 유저 정보를 받아온다.

```null
https://kapi.kakao.com/v2/user/me
```

받아온 유저 정보로 아래와 같은 프로세스를 진행한다. 이건 서비스 정책에 따른다. (서비스마다 로직이 다를 수 있다.)

-   이미 가입 된 유저인 경우 (email 중복)
    -   타 SNS로 가입 된 경우 -> 상관 없이 로그인 처리 후 access token 응답.
    -   이메일로 가입된 경우 -> 상관 없이 로그인 처리 후 access token 응답.
-   아직 가입되지 않은 유저인 경우
    -   회원 가입 처리 후 access token 응답.

---

## REST API

### 1. 인증 코드 요청

아래와 같은 경로에서 유저는 카카오 로그인을 하게 된다. `REDIRECT_URI`는 인가코드를 처리해 줄 URL을 입력한다.

```null
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}
```

### 2. 인증 코드 전달

1번 단계에서 유저가 로그인에 성공하게 되면, `REDIRECT_URI` 경로로 리다이렉트 된다. 아래 경로와 같이, QueryString 으로 인가코드인 `code` 값을 받게 된다.

```null
/{REDIRECT_URI}/callback?code=tmwowQ2CCyPfm2_3xcNgW-6VeuGYCw1i6NFD_vbotpP7x8xloxNiDeIcNzUkgtEKzVV6Ngopb1QAAAF-16djpg
```

### 3. 인증 코드로 토큰 요청 & 토큰 전달

전달 받은 인가코드 `code` 값을 이용해서 `kauth.kakao.com/oauth/token`에 토큰을 요청해야 로그인이 완료된다.

passport로 진행하는 경우 callback 엔드포인트에서 3-4 단계는 자동으로 진행된다.

### 4. 토큰으로 API 호출 & 응답

`kauth.kakao.com/oauth/token` 로부터 토큰을 받아서 로그인 프로세스를 진항한다.

### 5. 로그인 프로세스 진행

토큰을 받고, `https://kapi.kakao.com/v2/user/me` 경로에 유저 정보를 요청한다.

```js
await axios.get(
  'https://kapi.kakao.com/v2/user/me', 
  {
    headers: { Authorization: `Bearer ${access_token}` },
  },
)
```

받아온 유저 정보로 아래와 같은 프로세스를 진행한다. 이건 서비스 정책에 따른다. (서비스마다 로직이 다를 수 있다.)

-   이미 가입 된 유저인 경우 (email 중복)
    -   타 SNS로 가입 된 경우 -> 상관 없이 로그인 처리 후 access token 응답.
    -   이메일로 가입된 경우 -> 상관 없이 로그인 처리 후 access token 응답.
-   아직 가입되지 않은 유저인 경우
    -   회원 가입 처리 후 access token 응답.