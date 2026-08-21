---
Created: 2022-03-01
tags:
  - 공부
  - NPM
  - 블로그발행
---
NPM package로 UI library를 개발하면서, 처음에는 중요한지 몰랐던 peer dependencies 에 대해서 공부하게 되었고, 공부한 내용들을 정리한다.

peer dependencies 를 알아보기 위해서는 dependencies와 dev dependencies 를 먼저 알아야 할 것 같다. 자주 사용하기 때문에 어렵지 않을 것이다.

## Dependencies

앱에 종속된 가장 일반적인 종속성이다. **런타임과 빌드타임, 개발중** 모두에서 이 종속성 패키지들이 필요하기 때문에, **앱이 빌드 될 때 이 종속성 패키지들이 번들에 포함되어 배포된다.**

## Dev Dependencies

런타임에서는 필요하지 않고 **빌드타임 & 개발중**에만 필요한 패키지들이다. 빌드타임에서 이 종속성들은 빌드에 도움을 주거나 참조가 되지만, **번들에는 포함되지 않는** 종속성 패키지들이다.

## Peer Dependencies

이 글의 주인공인 피어 종속성이다. Peer 는 "동료" 라는 뜻을 가지고 있다. 어떤 상황에서 peer dependencies를 사용해야할까?

> 실제로 패키지에서 직접 require(import) 하지는 않더라도 호환성이 필요한 경우 명시한다.

무슨 말인지 어려우니까 예를 들어보자.

`my-app` 에서 사용하기 위한 React 기반의 컴포넌트 라이브러리인 `my-ui-library`를 개발한다고 가정하자. 이 때, UI Library 에서는 `react 17.0.0` 버전을 peer dependancy로 두고 있다.

`my-ui-library`는 `react`컴포넌트의 라이브러리이기 때문에, 이 라이브러리를 사용하게 될 프로젝트에서는 `react`를 의존할 수 밖에 없다. 이러한 경우 peer dependencies를 사용한다.

무슨 말인지 여전히 어렵다. 최대한 간단히 말하자면 아래와 같다.

> 이 라이브러리를 사용하게 될 프로젝트에게,  
> `react ^17.0.0` 버전을 사용해주세요! 라고 알려주는 것과 비슷하다.

```js
// my-ui-library package.json
"peerDependencies": {
  "react": "^17.0.0",
}
```

`my-app`에서도 dependancies로 이미 `react 16.0.0` 버전이 설치되어 있는 상태에서, `my-ui-library`를 설치했다고 가정하자.

```js
// my-app package.json
"dependencies": {
  "react": "^16.0.0",
  "my-ui-library": "^0.0.1"
}
```

`my-app`은 아래와 같은 모듈 구조가 생성이 된다.

```js
node_modules
ㄴreact ^16.0.0 (dependancy)
ㄴmy-ui-library ^0.0.1 (dependancy)
  ㄴnode_modules
    ㄴreact ^17.0.0 (peer dependancy)
```

여기서 `react`의 버전이 서로 다른 것을 확인할 수 있다. 이처럼 서로 버전이 다른 dependancy를 가지고 있다면, `npm`과 `yarn`은 서로 다른 방법으로 개발자에게 알려준다.

### yarn 의 경우

아래와 같은 Warning 메시지를 보여준다.

```null
my-ui-library@0.0.1" has incorrect peer dependency "react@^17.0.0".
```

### npm 의 경우

npm 3버전 까지는 피어 종속성을 자동으로 설치되었지만, 여러 문제가 있어서, 4버전부터 6버전 까지는 경고메시지만 띄워주었고, 7버전부터는 peer dependancy 버전이 맞지 않으면 패키지 설치가 안된다.

npm@<=6 버전과 yarn의 경우 피어 의존성 버전과 설치된 의존성 버전이 서로 맞지 않아도 경고 메시지 외에는 설치에 크게 문제가 없긴 하지만, 어떠한 에러가 발생할지는 모른다. 경고 메시지에 따라 어떤 버전을 실제로 설치하게 될지는 개발자의 선택에 달려있다.

## 참고한 글

-   [https://fathomtech.io/blog/understanding-peer-dependencies-in-npm/](https://fathomtech.io/blog/understanding-peer-dependencies-in-npm/)
-   [https://blog.bitsrc.io/understanding-peer-dependencies-in-javascript-dbdb4ab5a7be](https://blog.bitsrc.io/understanding-peer-dependencies-in-javascript-dbdb4ab5a7be)