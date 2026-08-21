---
Created: 2020-10-09
tags:
  - 튜토리얼
  - 블로그발행
---
개인 프로젝트와 두개 회사에서 적용했었던 i18next 를 이제서야 정리해본다. 현재 리액트 다국어에서 가장 많이 사용되는 모듈인 것 같다. json 파일 기반이라서 사용하기도 좋고 여러 번역자들과 협업시 [https://lokalise.com/](https://lokalise.com/) 와 같은 다국어 관리 사이트와 함께 사용하면 좋다.

세팅은 어렵지 않다. 천천히 살펴보도록 하자.

## 설치하기

아래 4가지의 의존성을 먼저 설치하도록 하자.

```null
yarn add i18next @types/i18next react-i18next @types/react-i18next
```

## 파일 작성하기

그리고 리액트 프로젝트의 src 폴더에 아래 파일을 생성한다. 폴더명은 마음대로 해도 괜찮다.

```null
src/Locales
src/Locales/i18n.ts
src/Locales/Files/ko.json
src/Locales/Files/en.json
```

i18next를 세팅하는 파일을 먼저 작성해주자. 아래 코드 중 `userLanguage` 는 `ie`를 지원해야 하는 경우를 위해 `window.navigator.userLanguage` 코드도 함께 작성해두었고, `lng` 는 로컬스토리지에 현재 언어를 저장하는 경우를 위해 `localStorage.getItem('language')` 를 우선순위로 불러온다.

**src/Locales/i18n.ts**

```jsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tranEn from './Files/en.json';
import tranKo from './Files/ko.json';

const resources = {
  en: { translation: tranEn },
  ko: { translation: tranKo },
}

const userLanguage = window.navigator.language || window.navigator.userLanguage;

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || userLanguage || 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false
  }
})

export default i18n;
```

예시로 `Hello world`를 띄워보자. json 파일에 아래와 같이 작성한다. key값은 언어별로 반드시 똑같아야 한다. `language_??` 로 작성된 키들은 테스트 할때 만들 버튼을 위해 작성해두었다.

**src/Locales/Files/ko.json**

```jsx
{
  "hello": "안녕하세요",
  "language_en": "English",
  "language_ko": "한국어"
}
```

**src/Locales/Files/ko.json**

```jsx
{
  "hello": "Hello world!"
  "language_en": "English",
  "language_ko": "한국어"
}
```

이제 기본 설정은 끝났고, index.ts 파일에서 위 i18n 세팅 파일을 불러와주기만 하면 된다.

**src/index.tsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './Locales/i18n'; // 추가

ReactDOM.render( ... );
```

## 테스트

이제 테스트를 해보자.

**src/Locales/i18n.ts**  
i18next 설정 파일에 아래 코드를 추가한다. type을 따로 `d.ts` 파일에 정리해도 좋다. 개인적으로 번역 관련 설정들은 모두 `i18n.ts` 파일에 두고 싶어서 여기다 작성하였다. 위치는 크게 중요하진 않은데 상단 `import` 바로 아래쪽에 두면 된다.

```jsx
export const languages = [ 'en', 'ko' ] as const;

export type Languages = typeof languages[number]; // 'en' | 'ko'
```

위 방법은 Languages 라는 `Array` 를 기반으로 ENUM 스타일? 의 상수 string 타입을 만드는 방법이다. 정확한 명칭은 아직 모르겠지만, 암튼 ENUM 처럼 사용할 수 있다. 실무에서 유용하게 사용하고있다.

**src/App.tsx**

위 `i18n.ts` 파일에서 작성한 `languages`(언어목록) 배열과 `Languages` 타입이 잘 사용되고 있는 모습을 볼 수 있다. 그리고 위 json 파일에 미리 만들어두었던 `language_??` 키의 값도 버튼에서 사용되고있다. 아래와 같이 설정해두면 언어가 추가될 경우 `i18n.ts` 파일만 수정하면 된다. 물론 `json`파일은 당연히 추가해야 하고.

```jsx
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Languages, languages } from './Locales/i18n'

function App() {
  
  const { t, i18n } = useTranslation();
  
  const handleChangeLanguage = (lang: Languages) => {
    i18n.changeLanguage(lang);
  }
  
  return (
    <div>
      <p>{t('hello')}</p>
      { languages.map(lang=> (
        <button key={lang} onClick={() => handleChangeLanguage(lang)}>
          {t(`language_${lang}`)}
        </button>
      ))}
    </div>
  );
}
```

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Fc9cfad39-1cb8-4182-af9f-66cf9e834631%2FScreen%20Shot%202020-10-09%20at%2017.40.26.png)

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Faf45e061-6568-4929-a5eb-7ab2c4fd4e3d%2FScreen%20Shot%202020-10-09%20at%2017.40.30.png)

잘 작동된다.

## Lazy loading

언어가 다양해지고 문장과 단어량이 많아지면서 파일 용량이 점점 커지게 되면, 1개의 언어만 보면 되는데 실제로는 모든 언어의 json 파일이 다운받아지는 문제가 있다. 현재 진행중인 프로젝트도 6개 언어를 지원하고 문장과 단어가 800개를 넘다보니 파일 하나당 50kb를 초과한다. (이것도 많은 편은 아닐것이다.) 쓸데없이 250kb 를 다운받아야 하는 문제가 있다.

이 때 i18next에서 제공하는 해결할 수 있는 방법이 있다. 이 내용은 추후에 업데이트 예정이다. 꼭 필요하면 i18next 문서를 참고바란다.