---
Created: 2020-10-11
tags:
  - 튜토리얼
  - 블로그발행
---
[React, Typescript 환경에서 styled-components 적용하기](React,%20Typescript%20환경에서%20styled-components%20적용하기.md)에서 이어지는 글.

## ThemeProvider

`GlobalStyles`와 `styled` 기본 기능만 이용해도 충분히 가치가 있지만, 우리는 `Dark Mode` 를 한번 만들어보고 싶지 않은가! styled-component 를 이용해 다양한 테마를 구현할 수 있다. Dark / Bright 두가지 모드를 구현해보도록 하자.

### 파일 작성

아래 파일들을 추가한다.

```null
src/Theme/Theme.ts
src/Theme/Bright.ts
src/Theme/Dark.ts
src/styled.d.ts
```

**src/Theme/Theme.ts**

```jsx
import baseStyled, { ThemedStyledInterface } from 'styled-components';
import Bright from './Bright';
import Dark from './Dark';

export const defaultTheme = Bright;
export const darkTheme = Dark;

export type Theme = typeof defaultTheme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;
```

**src/Theme/Bright.ts**

```jsx
export default {
  color: {
    primary: '#3F51B5',
    page: '#fff',
  }
}
```

**src/Theme/Dark.ts**

```jsx
export default {
  color: {
    primary: '#FFCD1C',
    page: '#222',
  }
}
```

**src/styled.d.ts**

```jsx
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    color: {
      primary: string;
      page: string;
    }
  }
}
```

**src/Theme/GlobalStyles.ts**

> `styled-components` 로 생성된 컴포넌트에서도 `${props=> props.theme.color...}` 로 props 를 내려받을 수 있다. 하지만 필자는 CSS variables 를 선호한다. 그 이유는 CSS의 `calc( ... )` API 를 사용할 수 있기 때문이다. props 로 내려받은 값은 js 로만 연산할 수 있는데, CSS 는 여러가지 단위 조합으로 연산할 수 있다. (`px`, `em`, `%` 등)  
> 그래서 스타일드 컴포넌트에 직접 props.theme 을 사용하지 않고 GlobalStyles 파일에 CSS variables 로 사용하는 것이다.

```jsx
...

body {
  background-color: var(--color__page);
}

:root {
  // 아래 방법으로 위에서 설정한 테마를 props 로 내려받을 수 있다.
  --color__primary: ${props=> props.theme.color.primary};
  --color__page: ${props=> props.theme.color.page};
}

...
```

**src/App.tsx**

```jsx
import React, { useState } from 'react';
import styled, { DefaultTheme, ThemeProvider } from 'styled-components';
import GlobalStyles from './Theme/GlobalStyles';
import { defaultTheme, darkTheme } from './Theme/Theme'

// styled-components 생성. 
const Text = styled.p`
  color: var(--color__primary);
`;

// 테마 모듈 선언
const themes = {
  default: defaultTheme,
  dark: darkTheme,
};

// 테마 타입 선언 
type Theme = keyof typeof themes; // 'default' | 'dark'

// 버튼 렌더링을 위해 테마 모듈 key를 배열로 변환
const keysOfThemes = Object.keys(themes) as Theme[];

function App() {
  
  const [ theme, setTheme ] = useState<Theme>('default');
  
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      
      <Text>Hello world!</Text>

      { keysOfThemes.map(theme=> (
        <button key={theme} onClick={() => setTheme(theme)}>{theme}</button>
      ))}
    </ThemeProvider>
  )
}
```

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F3aa603d9-1d0d-4d6a-989d-634bfd495ce9%2FScreen%20Recording%202020-10-09%20at%2020.04.42.gif)