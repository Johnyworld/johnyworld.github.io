---
Created: 2023-10-27
tags:
  - 팁
  - 블로그발행
---
> typescript + nextjs 환경 기준이다. 아마 react 에서도 될 것 같긴 하다.

`style.module.scss` 이런식의 확장자를 가지고 있는 css 모듈은 클래스네임의 중복을 방지해주기 때문에 유용하다. 이걸 사용하다보니 타이핑이 제대로 안돼서 불편을 겪었다. 타이핑에 되게 해보자.

## 패키지 설치하기

먼저 [typescript-plugin-css-modules](https://www.npmjs.com/package/typescript-plugin-css-modules#options) 패키지를 설치하자. (자세한 문서는 링크를 클릭해서 보자) 아래 명령어로 패키지를 설치할 수 있다.

```c
yarn add -D typescript-plugin-css-modules
// or
npm install -D typescript-plugin-css-modules
```

## (optional) VSCode 설정 바꾸기

만약 VSCode 에서 타이핑이 제대로 안된다면, VSCode TS 버저을 workspace 버전으로 바꾸어보자. `.ts` 또는 `.tsx` 파일을 열어둔 채로 vscode의 우측 하단을 보자. 현재 언어를 보여주는 `TypeScript JSX` 표시 왼쪽에 요상한 중괄호(`{}`) 버튼이 있다. 아마 요게 버전(e.g. `5.2.2`)으로 적혀 있을수도 있다. 그걸 누르면 TypeScript Version 을 바꿀 수 있는 버튼(`Select Version`)이 나온다.

![](https://velog.velcdn.com/images/johnyworld/post/254a48b2-0cc0-4eb2-ada7-d427f89814fb/image.png)

버튼을 누르면, VSCode 에디터 상단에 아래 그림과 같이, 버전을 선택할 수 있는 선택지가 뜬다. 여기서 Use Workspace Version 으로 설정해보자.

![](https://velog.velcdn.com/images/johnyworld/post/c121537a-7794-487f-953c-014327ad4535/image.png)

## (optional) d.ts 정의하기

패키지 설치하고 VSCode 의 TS 버전까지 바꾸었는데 안된다면 `.d.ts` 파일도 정의해보자. 먼저 `src` 폴더 내 원하는 위치에 `index.d.ts` 또는 `style.d.ts` 파일을 만들어준다. (파일 이름은 원하는 대로 하고, `.d.ts` 파일 위치는 tsconfig 내에 include 되어 있는 경로 하위에 있어야 한다.)

그리고 아래 코드 중 필요한 것만 가져다가 붙여 넣는다. 나의 경우 `*.module.scss` 에 대해서만 정의하면 됐다.

```ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## 에러 처리 기록

### Module "./FileName.module.scss" has no exported member 'someClassName' ...

타이핑이 대체로 잘 되는데, 어떤 파일에서만 위와 같은 메시지의 에러가 발생했다. 빌드페이지는 잘 동작했고 에디터와 배포 단계에서만 에러가 발생했다.

왜 이 두 파일만 문제가 있지? 다른 파일과 뭐가 다른지 찾아보았다.

```scss
@import '@style/variables';
```

두 파일에서만 이렇게 variables 를 가져오고 있었다. variables 파일의 실제 이름은 `_variables.scss` 였는데, 파일 앞에 붙은 언더스코어(`_`)가 문제였다. scss 전처리기는 이걸 처리해주었지만 typescript-plugin-css-modules 패키지에서는 이걸 처리해주지 못하고 있는 것 같았다.

두가지 해결 방법이 있다.

1. 파일명에서 언더스코어를 뺀다. `variables.scss` 
2. import 할 때마다 언더스코어를 붙여준다. `@import '@style/_variables'`

파일 이름 앞에 언더스코어를 붙이는 것은, [이러한 이유](https://sass-lang.com/guide/#partials) 때문이다. 하지만 언더스코어를 붙이지 않아도 Next 에서는 css 파일을 하나로 합쳐주기 때문에, 굳이 붙여야 할 이유가 없다고 생각하여 전자의 방법으로 해결했다.