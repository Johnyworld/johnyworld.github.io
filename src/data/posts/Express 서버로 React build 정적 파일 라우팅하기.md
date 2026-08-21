---
Created: 2020-10-05
tags:
  - 튜토리얼
  - 블로그발행
---
## 서론

React로 정적 페이지를 만들 때, 두가지 문제점이 있었다.  
첫번째는 SEO 문제.  
두번재는 Routing 문제.

#### SEO문제

SEO를 해결하려면 SSR(Server Side Rendering) 을 해야했다. 그래서 최근에 했던 프로젝트에서는 Next.js 를 사용해봤다. 재밌는 작업이었고 수많은 문제들을 겪고 해결했다. 하지만 개인적으로 Next.js 를 다시 사용하고 싶지는 않았다.  
api 만드는 방법도 폴더로 나누는 방식이라서 내 스타일은 아니었고, Serverless 이다보니, FileSystem을 사용할 수도 없어서 S3에 파일 업로드 하는것도 쉽지 않았다. 결국엔 해결했지만 몇시간동안 Stackoverflow를 뒤져봐도 사례도 별로 없었고 나와 맞지 않는 방법들만 가득했었다.  
express 에서 nextjs 서버를 만드는? 방법도 있었지만, NextJS의 철학을 먼저 공부하고 싶어서 사용해보진 않았다.

#### Routing문제

SPA로 만들어진 정적 사이트는 localhost에서는 문제가 없지만 실제 서비스에서는 경로를 제대로 받지 못하는 문제가 있다. SPA 의 고질적인(?) 문제라고 알고있는데, 예를들면 www.example.com/profile 이라는 URL을 치고 접속해도 www.example.com 즉 Home 페이지로만 라우팅 된다.

위 두가지의 문제를 해결하는 다양한 방법이 있을것이다. 이 글에서는 첫 회사와 지금 회사에서 사용중인 방법을 구현하고자 한다. 그때는 프론트엔드만 다루는데 바빠서 대충만 알고 있었는데, 계속 공부하다보니 이제는 알게 됐다. 그리고 많은 회사에서 사용하는 아주 기본적인 방법이라고 알고있다.

## 본론

방법은 이렇다. Server Side 에서 React 로 Build 된 정적 파일들을 보여주는 것. 너무 간단한데?... 설치부터 해보자.

#### Client

```null
npx create-react-app client --template typescript
```

#### Server

서버 쪽 설치 방법은 [이 글](https://velog.io/@johnyworld/Express-server-with-TS-%EC%B4%88%EA%B8%B0-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0)을 참고 바란다.

### 작성

위 내용대로 설치를 했다면 아래와 같은 폴더구조가 형성됐을 것이다.

> client  
> ⎿public  
> ⎿src  
> server

server 폴더에 server.ts 가 있다. 위 링크 글을 따라서 만들었으면 아래와 같은 코드가 작성되어있을 것이다.

```jsx
import express from 'express';

const app = express();

app.listen(4000);
```

여기서 아래 처럼 코드를 추가해주면, 서버로 접속했을 때 React 에서 빌드된 정적 페이지를 로드한다.

```jsx
import express from 'express';

const app = express();

// React 로 build된 폴더를 연결한다.
const root = require('path').join(__dirname, '..', 'client', 'build');

// 정적 페이지를 보낸다.
app.use(express.static(root));

app.listen(4004);
```

하지만 여기서, 문제를 겪었다.

## 문제 해결

### Refused to apply style 문제

> Refused to apply style from 'http.../2.a925df73.chunk.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.

이건 도대체 뭔가 싶었다. 계속 검색해보고 시도해봤지만, 잘 되지 않았다. 개발자 도구에서 static 폴더 파일을 살펴보니 chunk.js, css파일들이 제대로 들어오지 않았다.

#### 해결

그리고 방법을 한가지 찾았는데, response로 sendFile 을 해주는 것이다. 아래 `app.get` 코드를 추가해준다.

```jsx
...

app.use(express.static(root));

app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

app.listen(4004);
```

이로써, 정적 파일들을 제대로 받을 수 있게 됐다. 이제 잘 되겠지!!  
물론 잘 되지 않았다.

### Uncaught SyntaxError

개발자 도구로 봐도 파일을 불러오는데에는 크게 문제는 없었지만 아래와 같은 에러를 보여주며, 화면엔 아무것도 나오지 않았다.

> Uncaught SyntaxError: Unexpected token <

이건 또 뭔가.

#### 시행착오

처음에는 chunk 파일명에 `.` 이 들어가서 그런가 싶어서 `build/static` 폴더 내에 있는 파일명을 바꿔보았다.  
`2.abcd1234.chunk.js` 파일명을 `chunk.js` 로 바꾸고 메인 파일도 `main.js` 로 바꾸었다.

응? 이렇게 하니까 페이지가 잘 불러와졌다. 오! 정말 파일명 때문이었나? 하지만 빌드 할때마다 이렇게 파일명을 바꾸어 줄 수는 없었고, 말도 안되는 방법이었다. 그래서 다른 방법을 찾는 도중, 파일명의 `.` 이 꼭 문제이진 않았을 것 같다는 생각이 스쳤고, 파일명을 다시 `.`을 놔둔 채로 바꿔보았다.

응? 된다.

그렇다면 다른게 문제일텐데 순간 함께 있는 파일들 중 `2.abcd1234.chunk.js.map` 이라는 파일이 눈에 들어왔다. **이걸 지워볼까?** 하는 생각이 들었고, 지워봤다.

응? 된다.

그렇다면 이 `map` 파일이 문제라는 이야긴데, 이것 역시 매번 빌드할때마다 찾아서 지워줄 수는 없으니, 빌드할때 이 파일을 만들어주지 않는 방법이 있나 찾아보았다.

#### 해결

`express react chunk map` 이라고 검색해보니 velog 로 작성된 [맨 첫](https://velog.io/@racoon/React-build-%EC%8B%9C-sourcemap-%EC%A0%9C%EA%B1%B0%ED%95%98%EA%B8%B0) 글에서 바로 답을 얻을 수 있었다.

위 블로그 글에 의하면, 오히려 저 `map` 파일들은 반드시 지워줘야 하는 녀석들이었다. 위 블로그 글에서 소개 된 방법 중에 나는 package.json 파일을 수정하는 방법을 사용했다.

이렇게 두가지 에러를 해결했고, 서버사이드에서 리액트로 빌드된 정적 파일들을 라우팅해주는 첫 세팅을 마쳤다.

## 프론트엔드 테스트

자 이제 서버 세팅을 마쳤으니 프론트엔드에서도 잘 되는지 확인이 필요하다. 먼저 `react-router-dom` 을 설치해준다.

```null
yarn add react-router-dom @types/react-router-dom
```

그리고 App.tsx 에 BrowserRouter 를 추가해준다.

```jsx
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' render={() => <p>Home</p>} />
        <Route path='/test' render={() => <p>Test</p>} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
```

이렇게 저장하고, 새로 `yarn build` 로 빌드를 해준 다음, server.ts 로 켜놓은 서버로 접속해본다. 나는 `localhost:4004` 포트를 사용하고 있다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F53ca66cd-df69-423f-b3e2-5d8451bf7bab%2FScreen%20Shot%202020-10-07%20at%2018.25.11.png)

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F23c18bfd-ae5c-4808-a0b4-8e95aa179bd2%2FScreen%20Shot%202020-10-07%20at%2018.25.20.png)

잘 되는 것 같다.

## API

하지만 여기서 끝이 아니다. 우리는 API 를 사용할 수 있어야 하며 매번 귀찮게 build 하지 않을 수 있어야 한다.

먼저 테스트를 위해 서버에 api 라우터를 만들어주자.

**server/api/index.ts**

```jsx
import express from 'express';
const router = express.Router();

router.get('/hello', (req, res) => res.json({data:'HELLO WORLD'}));

export default router;
```

**server/server.ts**

```jsx
import express from 'express';
import api from './api/index'; // 추가

const app = express();
const root = require('path').join(__dirname, '..', 'client', 'build');

app.use('/api', api); // 추가

app.use(express.static(root));

... 생략
```

클라이언트 사이드에도 테스트할 수 있는 코드를 만들어준다.

**client/App.tsx**

```jsx
function App() {
  
  fetch('/api/hello') // 추가
    .then(r=> r.json())
    .then(data => console.log(data));
  
  return ( ... )
}
```

이렇게 코드를 입력해준 다음, 브라우저에서 테스트를 해본다.  
! 반드시 리액트에서 새로 `build` 를 해줘야 한다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Fa802b257-6805-417a-8630-a0b6ea40647a%2FScreen%20Shot%202020-10-07%20at%2018.35.49.png)

데이터가 잘 응답되었다.

## 귀찮은 build 문제

프론트엔드 코드를 바꿀때마다 빌드를 새로 해야하는 문제가 있었는데, 이 빌드 문제는 간단히 해결할 수 있다. 실 서버는 server.ts 로 받아야 하지만, 테스트시에는 클라이언트 사이드에서 `yarn start` 로 리액트 서버로 실행하면 된다. 그렇게 실행해보자.

그렇게 되면 기본 리액트 앱에서 `localhost:3000` 포트로 서버를 열어주며 앱이 실행된다. 그리고 App.tsx 에서 fetch API 를 실행할 때 아래와 같은 에러를 만날 수 있을 것이다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Fd96dd741-dfba-467f-ad53-6b9e2a120768%2FScreen%20Shot%202020-10-07%20at%2018.38.41.png)

백엔드 서버에서 실행할때는 문제가 없는데, 프론트엔드(리액트) 서버에서 실행할때는, 서버 경로를 바로 받을 수 없기 때문에 오류가 날 수 밖에 없다. 이 때 App.tsx 파일에 API 경로를 `http://localhost:4004/api/hello` 로 바꿔주면 문제 없이 되기는 한데, 이 경우 환경변수 설정도 따로 해줘야 하고 굳이 그럴 필요가 없기때문에 다른 방법을 쓰도록 하자.

**client/package.json**

```jsx
"proxy": "http://localhost:4004",
```

위 코드를 추가해준 뒤 `yarn start` 로 리액트 서버를 새로 시작해주면 fetchAPI URL 에 `localhost:4004` 를 붙여주지 않아도 해당 경로에 요청할 수 있게 된다.