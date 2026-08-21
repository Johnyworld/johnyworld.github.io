---
Created: 2020-11-11
tags:
  - 튜토리얼
  - 블로그발행
---
회사에서 점점 언어가 늘어나자, i18next의 lazy loading을 구현해야 할 필요가 생겼다. 한개의 언어 파일이 60kb 를 넘는데 벌써 서비스 언어가 9개가 됐다. 언어만 500kb를 넘는다. i18next lazy loading 을 적용하면서 그 내용을 정리하는 글이다.

## 설치

```null
yarn add i18next-xhr-backend
or
npm install i18next-xhr-backend --save
```

## 파일 변경

### i18n.ts

참고로 기존에 설정했던 파일중, 아래처럼 json 파일을 import 해주는 과정은 전혀 필요하지 않게 되었다.

```jsx
import tranEn from './Files/en.json';
import tranKo from './Files/ko.json';

const resources = {
  en: { translation: tranEn },
  ko: { translation: tranKo },
}
```

파일 내용을 살펴보자.

```jsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import backend from "i18next-xhr-backend";

const userLanguage = window.navigator.language;

+i18n.use(backend).use(initReactI18next).init({
  lng: localStorage.getItem('language') || userLanguage || 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false
  },
+ react: {
+   useSuspense: false
+ },
+ backend: {
+   // 원하는 경로를 설정해준다. 
+   // (중요) 참고로 아래 경로는 빌드 된 파일 기준이라서 CRA로 앱을 만든 경우 /public 폴더 안에 넣어줘야 한다.
+   // ex) client/public/locales/en.json
+   loadPath: '/locales/{{lng}}.json',
+ }
})

export default i18n;
```

위 코드처럼 react 와 backend 라는 프로퍼티를 추가해주고, 기존에 있던 resources 는 삭제해준다.

### index.tsx

아래 코드를 보자. React Lazy loading을 구현할 때와 마찬가지로 React.Suspense 로 한번 감싸줘야 한다. 이미 React Lazy loading가 구현된 앱이라면 그대로 둬도 좋다.

```jsx
import React, { Suspense } from 'react';

...

ReactDOM.render(
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>,
  document.getElementById('root')
);
```

## 완성!

자 이제 끝났다! 별거 아닌 것 같다. (사실 좀 헤맸다.)

아래 gif 그림에서 우측 하단을 보면, en.json과 ja.json 을 나중에 불러오는 것을 볼 수 있다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Face4d62c-158f-4976-a317-a0d3bae01f17%2FScreen%20Recording%202020-11-11%20at%2022.16.41.gif)

> 참고로 `처음 언어` 와 `fallback 언어` 는 첫 로딩때 로드된다.  
> 위 gif 파일에서는 처음언어와 fallback언어 모두 한글로 해놓은 상태이다.