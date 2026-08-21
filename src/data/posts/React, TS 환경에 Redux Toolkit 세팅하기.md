---
Created: 2020-10-16
tags:
  - 튜토리얼
  - 블로그발행
---
## 서론

### 프로젝트에서 MobX를 사용했었다.

현재 회사 프로젝트에 **MobX** 를 몇개월 동안 쓰면서 잘 사용하긴 했는데, `useObserber`를 쓰고 싶지 않았던 점과, `console.log` 를 찍어볼 때 자꾸 `Proxy` 로 출력이 되어서, `toJS` 함수를 써야 한다는 점 등이 좀 귀찮게 다가왔다. 그리고 React의 철학을 따르지 않는 부분도 약간 이질적으로 느껴지는게 있었다. 물론 그래도 훌륭한 라이브러리이다.

### useContext도 써보았다.

그래서 **useContext**를 써보기도 했다. useContext는 사용하기도 편리했고, 아주 React 스러워서 만족스러웠다. 하지만 여러가지 글을 읽어보면서 useContext는 성능 면에서 Redux 보다 좋지 않다는 글을 보았다.

실제로 useContext를 실험 해보았는데, 더 넓은 범위에서 Re-rendering이 발생하였다. 필요한 부분만 바뀌는 것이 아니라 감싸져 있는 모든 자식 컴포넌트들이 모두 Re-render 되었다. 부분적으로 잘 설계해서 쓰면 좋겠지만, **전역 상태관리**로 사용하기에는 무리가 있었다.

### RTK를 써보기로 했다.

그래서 새로 진행하는 사이드 프로젝트에 **Redux Toolkit** 을 적용해보기로 했다. 새로운 것을 공부하는 것이 좋기도 했고 Redux 를 배워보긴 했지만 실 프로젝트에 적용해 본 적이 없어서 익숙해지는게 필요하다고 생각하기도 했다.

이 글에서는 Redux Toolkit 초기 세팅을 하고 Dispatch 테스트 해보는 코드를 작성해보기로 하자. 확실히 예전에 배웠던 Classic(?) Redux에 비해서 _아주 매우 많이_ 쉬워지고 코드도 깔끔해진 느낌이 든다.

참고로 필자는 `CRA template` 는 `--typescript` 만 넣어서 설치 해 놓은 상태이다. CRA 위에 추가 되는 파일 구조는 아래와 같다.

> src/Slices/users.ts  
> src/rootReducer.ts  
> src/store.ts

## 파일 작성

### src/Slices/users.ts

유저 리스트를 만들고, 유저 이름을 입력받아 유저를 추가하는 매우 간단한 코드를 작성해보자. Redux Toolkit은 `createSlice` 한방에 다 끝낼 수 있다.

```jsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
}

let tempId = 3;

// slice 안에 들어갈 내용들은 매우 심플하고 직관적이다. 
// name, initialState, reducers.
export const users = createSlice({
  name: 'users',
  initialState: [
    { id: 1, name: 'User1' },
    { id: 2, name: 'User2' },
  ] as User[], // 필수로 타입 지정 안해도 되지만, 확실히 하기로 한다.
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      action.payload.id = tempId++;
      // 업데이트 되는 State 를 return 해준다.
      return [...state, action.payload];
    }
  }
});

// 액션과 리듀서를 export 해준다. 이건 그냥 따라하면 된다.
export const { addUser } = users.actions;
export default users.reducer;
```

### src/rootReducer.ts

```jsx
import { combineReducers } from "@reduxjs/toolkit";
import users from './Slices/users';

// 만들어 놓은 리듀서들을 합친다.
const reducer = combineReducers({
  users, ...
});

// React에서 사용할 수 있도록 타입을 만들어 export 해준다.
export type ReducerType = ReturnType<typeof reducer>;
export default reducer;
```

### src/store.ts

기본 아래와 같이 store 를 작성할 수 있다. 하지만 여기에 미들웨어를 추가할 수 있다.

```jsx
import { configureStore } from "@reduxjs/toolkit";
import reducer from './rootReducer';

const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch
export default store;
```

위 코드에서 `logger` 미들웨어를 추가해보자. 먼저 `logger` 를 설치해준다.

```null
yarn add redux-logger @types/redux-logger
```

다음, 추가 된 코드를 보자.

```jsx
+ import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from './rootReducer';
+ import logger from 'redux-logger';

+ const middleware = [ ...getDefaultMiddleware(), logger ];

const store = configureStore({
  reducer,
+  middleware,
});

export type AppDispatch = typeof store.dispatch
export default store;
```

### src/index.tsx

`index.tsx` 파일에는 아래와 같이 `Provider`를 추가해준다.

```jsx
...
import { Provider } from 'react-redux';
import store from './store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### src/App.tsx

모든 설정은 끝났다. 너무 간단하다! 이제 테스트를 해보자.

```jsx
import React, { FormEvent, useState } from 'react'
...
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from './rootReducer';
import { User, addUser } from './Slices/users';

function App() {
  
  const users = useSelector<ReducerType, User[]>(state=> state.users);
  const dispatch = useDispatch();
  
  const [ name, setName ] = useState('');
  
  const handleChangeName = (e: any) => {
    setName(e.target.value);
  }
  
  const handleAddUser = (e:FormEvent) => {
    e.preventDefault();
    dispatch(addUser({ name } as User));
    setName('');
  }
  
  return (
    <div>
      
      <form onSubmit={handleAddUser}>
        <input type='text' value={name} onChange={handleChangeName} />
        <button type='submit'>Add User</button>
      </form>
      
      {users.map(user=> (
        <div key={user.id}>{user.name}</div>
      ))}
      
    </div>
  ) 
}
```

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Fa8f2d904-15aa-48d9-bad0-a46ca2fc2653%2FScreen%20Recording%202020-10-16%20at%2017.48.30.gif)