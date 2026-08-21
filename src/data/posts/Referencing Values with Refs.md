---
tags:
  - 번역
  - 블로그발행
Created: 2023-02-06
---
컴포넌트가 어떤 정보를 "기억"하고 싶지만 [새로운 렌더링을 발생](https://beta.reactjs.org/learn/render-and-commit)시키게 하고싶지 않을 때 ref 를 사용할 수 있다.

### 이런 것들을 배우게 된다

- 컴포넌트에 ref를 어떻게 추가하는지
- ref의 값을 어떻게 업데이트 하는지
- ref가 state와 어떻게 다른지
- ref를 어떻게 안정하게 쓰는지

### 컴포넌트에 ref 추가하기

리액트로부터 `useRef` 훅을 가져오면서 ref를 컴포넌트에 추가할 수 있다.

```js
import { useRef } from 'react';
```

컴포넌트 내에서, `useRef` 훅을 호출하는 유일한 인수로 참조하고자 하는 초기값을 전달한다. 예를들어, 이것은 값 `0`에 대한 참조이다:

```js
const ref = useRef(0);
```

`useRef`는 이와 같은 객체를 리턴한다:

```js
{ 
  current: 0 // The value you passed to useRef
}
```

`ref.current` 프로퍼티를 통해 ref 의 current 값에 액세스 할 수 있다. 이 값은 의도적으로 변경할 수 있다, 읽고 쓰기가 가능하다는 것을 의미한다. 리액트가 추적하지 않는 컴포넌트의 비밀 주머니와 같다. (이것이 리액트의 단방향 데이터 흐름으로부터의 탈출구로 만드는 것이다. 자세한 내용은 아래를 보자!)

여기 매 클릭마다 `ref.current` 를 증가시키는 버튼이 있다.

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

ref 점수는 숫자이지만  [state](https://beta.reactjs.org/learn/state-a-components-memory) 처럼, 문자열, 객체, 아니면 함수라 하더라도 어떤 타입이라도 가능하다. state와는 다르게, ref는 읽고 쓰기가 가능한 `current` 속성이 있는 일반 자바스크립트 객체이다.

컴포넌트는 매 증가마다 리렌더 하지 않는다. state 처럼, refs 는 리렌더 사이에 리액트에 의해 유지된다. 하지만 state를 설정하면 리렌더가 되지만 ref를 변경하는 것은 그렇지 않다.

## 예제: 스톱워치 만들기

하나의 컴포넌트에서 refs 와 state를 합칠 수 있다. 예를 들어, 유저가 버튼을 통해 시작하거나 멈출 수 있는 스톱워치를 만들어보자. 사용자가 시작을 누르고 얼마나 시간이 지났는지 표시하기 위해, 시작 버튼을 누른 시간과 현재 시간을 추적해야 한다. **이 정보는 렌더링 중 사용된다. 그래서 state 에 유지한다:**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

사용자가 시작을 누르면, 매 10ms마다 업데이트 하기 위해 [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) 를 사용할 것이다.

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

"정지" 버튼이 누르면, `now` state 변수를 업데이트하는 것을 멈추게 하도록 존재하는 인터벌을 취소 해야 한다. [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) 로 이걸 수행할 수 있지만 유저가 시작 버튼을 눌렀을 때, `setInterval` 호출에 의해 이전에 반환 된 interval ID를 제공해야 한다. 어딘가에 interval ID 를 보관해야 한다. **interval ID 는 렌더링 중 사용되지 않으므로 ref에 저장할 수 있다.**

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

정보의 조각이 렌더링 중 사용 됐을 때, state를 유지하라. 정보의 조각이 오직 이벤트 핸들러와 리렌더가 필요하지 않는 경우, ref를 사용하는 것은 더 효율적일 수 있다.

## refs 와 state의 다른 점들

아마도 state 보다 refs 가 덜 엄격하다고 생각 할 지 모른다. 예를 들어 항상 state setting 함수를 사용하는 대신 그것들을 변경할 수 있다. 그러나 대부분의 경우 state 를 사용하고 싶을 것이다. Refs 는 자주 필요하지 않은 "탈출구" 이다. state 와 refs 를 비교하는 방법은 다음과 같다:

| refs | state |
|---|---|
| `useRef(initialValue)` 는 `{ current: initialValue }` 를 반환한다. | `useState(initialValue)` 는 현재 state 변수의 값과 setter 함수를 반환한다. ( `[value, setValue]`) |
| 변경 됐을 때 리렌더 되지 않는다. | 변경 됐을 때 리렌더를 트리거 한다. |
| "변화 가능" - 렌더링 과정 밖에서 `current`의 값을 수정할 수 있다. | "불변성" — 리렌더를 하려고 state 변수를 수정하기 위해 반드시 setting 함수를 사용해야 한다. |
| 렌더링 중 `currnet` 값을 읽거나 수정하면 안된다. | 언제든 state 값을 읽을 수 있지만 각 렌더는 변경되지 않은 state의 각 [스냅샷](https://beta.reactjs.org/learn/state-as-a-snapshot) 을 가진다. | 

여기 state 로 구현 된 카운터 버튼이 있다:

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

`count` 값이 표시 됐기 때문에, state 값을 사용하는 것이 말이 된다. 카운터 값이 `setCount()` 로 설정 될 때, 리액트는 컴포넌트를 리렌더 하고 새로운 카운트를 반영하기 위해 화면을 업데이트 한다.

ref 로 이것을 구현하려 한다면, 리액트는 리렌더 하지 않을것이다. 그래서 카운트가 바뀌는 것을 볼 수 없다. 이 버튼을 클릭하는 것이 어떻게 그의 text를 **업데이트 하지 않는지** 보자:

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

렌더 중 `ref.current` 를 읽는 것이 신뢰할 수 없는 코드로 이어지는 이유이다. 이게 필요하다면, 대신 state 를 사용하라.

---

#### DEEPDIVE: How does useRef work inside?

리액트로부터 `useState`와 `useRef` 가 모두 제공 되지만, 원칙적으로 `useRef` 는 `useState` 위에 구현될 수 있다. 리액트 내에서 `useRef` 가 다음과 같이 구현된다고 상상할 수 있다:

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

첫번째 렌더링 중, `useRef`는 `{ current: initialValue }`를 리턴한다. 이 객체는 리액트에 의해 저장되므로 다름 렌더링중 같은 객체가 반환 될 것이다. 이 예제에서 state 설정자가 어떻게 사용되지 않았는지 보라. `useRef`는 항상 같은 객체를 반환해야 하기 때문에 불필요하다.

리액트는 `useRef`의 내장 버전을 제공한다. 실무에서 흔히 볼 수 있기 때문에. 하지만 setter 가 없는 일반적인 state 변수처럼 생각하면 된다. OOP(객체 지향 프로그래밍)에 익숙하다면, 참조는 인스턴스 필드를 상기시킬 수 있지만 `this.somthing` 대신 `somethingRef.current` 라고 쓴다.

---

## 언제 refs 를 사용하는가

일반적으로, 컴포넌트라 React 에서 "벗어나" 외부 API(종종 컴포넌트의 모양에 영향이 미치지 않는 브라우저 API) 와 통신해야 할 때 ref를 사용한다. 다음은 이러한 드문 상황 중 일부이다:

- [timeout IDs](https://developer.mozilla.org/docs/Web/API/setTimeout) 저장
- [다음 페이지](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs) 에서 다루는 [DOM 엘리먼트](https://developer.mozilla.org/docs/Web/API/Element) 저장 및 조작
- JSX를 계산하는 데 필요하지 않은 다른 객체를 저장한다.

컴포넌트가 어떤 값을 저장해야 하지만, 렌더링 로직에 영향을 미치지 않는 경우 refs 를 선택하라.

## refs 모범 사례

다음 원칙을 따르면 컴포넌트를 더 예측 가능하게 만들 수 있다.

- **참조를 탈출구로 취급한다.** Refs는 외부 시스템 또는 브라우저 API로 작업할 때 유용하다. 애플리케이션 로직 및 데이터 흐름의 대부분이 refs에 의존하는 경우 접근 방식을 다시 생각해 볼 수 있다.
- **렌더링 중에 `ref.current`를 읽거나 쓰지 마라.**  렌더링 중 일부 정보가 필요한 경우 [state](https://beta.reactjs.org/learn/state-a-components-memory)를 대신 사용하라. 리액트는 `ref.current`가 언제 변경되는지 모르기 때문에 렌더링 하는 동안 읽어도 컴포넌트의 동작을 예측하기 어렵다. (유일한 예외는 첫 번째 렌더링 중에 ref를 한번만 설정하는 `if (!ref.current) ref.current = new Thing()` 와 같은 코드이다.)

리액트 state 제한은 refs 에 적용되지 않는다. 예를 들어, state는 [모든 렌더링에 대한 스냅샷](https://beta.reactjs.org/learn/state-as-a-snapshot) 처럼 작동하고 [동기적으로 업데이트 되지 않는다.](https://beta.reactjs.org/learn/queueing-a-series-of-state-updates) 그러나 ref의 현재 값을 변경하면 즉시 변경된다:

```js
ref.current = 5;
console.log(ref.current); // 5
```

이는 **ref 자체가 일반 JavaScript 객체이기 때문에** 하나처럼 작동하기 때문이다.

또한 ref로 작업할 때 [돌연변이 방지](https://beta.reactjs.org/learn/updating-objects-in-state)에 대해 걱정할 필요가 없다. 변경하려는 객체가 렌더링에 사용되지 않는 한 React는 ref 또는 그 내용으로 무엇을 하든 상관하지 않는다.

## Refs 와 DOM

ref는 모든 값을 가리킬 수 있습니다. 그러나 ref의 가장 일반적인 사용 사례는 DOM 요소에 액세스하는 것입니다. `<div ref={myRef}>` 와 같이 JSX의 `ref` 속성에 ref를 전달하면 리액트는 해당 DOM 요소를 `myRef.current` 에 넣는다. 이것에 대해 [Manipulating the DOM with Refs](Manipulating%20the%20DOM%20with%20Refs.md) 에서 더 읽어볼 수 있다.

## 요약

- Refs 는 렌더링에 사용되지 않는 값을 유지하기 위한 탈출구이다. 자주 필요하지는 않다.
- ref는 읽거나 설정할 수 있는 `current` 라는 단일 속성이 있는 일반적인 자바스크립트 객체이다.
- `useRef` 훅을 호출하여 리액트에 ref 를 제공하도록 요청할 수 있다.
- state 처럼 refs 를 사용하면 컴포넌트를 렌더링 하는 사이에 정보를 유지할 수 있다.
- state 와는 달리, ref 의 `current` 값을 설정해도 다시 렌더링 되지 않는다.
- 렌더링 중 `ref.current` 를 읽거나 쓰지 마라. 이로 인해 구성요소를 예측하기 어렵다.

