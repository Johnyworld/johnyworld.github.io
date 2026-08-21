---
tags:
  - 공부
  - 블로그발행
Created: 2022-01-29
---
자바스크립트의 실행컨텍스트는 중요하다. 실행컨텍스트를 이해하면 Scope, Hoisting, Closure 를 함께 이해하기 쉬워지며, Event Loop와도 관련이 있다.

---

## 정의

실행컨텍스트란 **자바스크립트 코드가 실행되는 환경(맥락)**을 말한다.  
자바스크립트가 실행되기 위해 필요한 `variables`, `scope chain`, `this` 의 요소들을 **함수 단위**로 묶여 코드가 실행되는 위치를 설명한다.

---

## 알아야 할 단어

### Call Stack (호출 스택)

프로그램에서 함수의 호출을 기록하는 데이터 구조.

먼저 `Stack` 과 `Queue`의 차이점을 살펴보자.

-   `Queue`라는 것은 **선입 선출**. 즉, 먼저 들어온 놈이 먼저 나간다는 뜻이다. 마치 편의점 음료를 앞에서 꺼내고 뒤에서 넣는 것과 같은 원리이다.
-   `Stack`은 반대로 **후입 선출**. 가장 나중에 들어온 놈이 먼저 나간다. 프링글스 통에 감자칩을 새로 담는다고 생각하면 편하다. 먼저 담은 감차집은 가장 마지막에 먹을 수 있다.

콜 스택도 `Stack` 이기 때문에 **후입 선출**의 형태를 띠고 있으며, 그 안에는 실행 컨텍스트들이 담긴다. 가장 먼저 들어온 Global Excution Context는 그 위에 쌓이는 Functional Excution Context들이 모두 종료 되고 나서야 마지막에 종료된다.

---

## 종류

실행컨텍스트는 아래와 같이 3개 종류로 나눌 수 있다.

### Global Excution Context (전역 실행 컨텍스트)

-   프로그램이 실행 되는 동안 단 한개만 존재한다.
-   this는 `Window`(browser) or `Global`(nodejs) 객체를 가리킨다.
-   전역 실행 컨텍스트는 `Call Stack` 에 가장 먼저 추가되어 앱이 종료될 때 사라지게 된다.

### Functional Excution Context (함수 실행 컨텍스트)

-   프로그램이 실행 되는 동안 여러개가 존재할 수 있다.
-   함수가 호출될 때 마다 새로운 실행 컨텍스트를 생성 함.
-   각 함수는 고유한 실행 컨텍스트를 가짐.

### Eval Function Excution Context

-   함수내에서 실행되는 Eval 함수(string 형태의 함수)도 실행 컨텍스트를 가짐.

---

## 구성요소

실행 컨텍스트는 여러 구성요소 중 가장 우리가 알아야 할 환경은 `Lexical Environment`(어휘 환경)이고, Lexical Environment는 **Environment Record**와 **Outer Environment Reference**으로 구성되어있다.

-   Environment Record (환경 레코드)
-   Outer Environment Reference (외부 환경 참조)

---

## 실행 컨텍스트의 생성 단계

### Call Stack

위에 설명했던 `Call Stack`을 먼저 보자.

1.  프로그램이 실행되면 전역 실행 컨텍스트가 먼저 `Call Stack`이라는 (프링글스) 통 안에 담기게 된다.
2.  `함수 A`가 실행되면 `함수 A`의 실행 컨텍스트가 전역 실행 컨텍스트 위에 담긴다. (Push)
3.  `함수 A`에서 `함수 B`를 호출하면 `함수 B`의 실행 컨텍스트가 `함수 A`의 실행 컨텍스트 위에 담긴다.
4.  종료되는 순서도 위에 언급한 대로 `함수 B`부터 `함수 A`, `전역` 순서로 종료된다.

아래 그림으로 확인해보자.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F063c8507-7708-4214-b4a4-515fbb5d9b70%2FScreen%20Shot%202022-01-29%20at%202.29.16%20PM.png)

### 각 실행 컨텍스트의 생성 단계

실행 컨텍스트는 **생성 단계**와 **실행 단계** 두 단계로 생성된다. 먼저 생성단계를 보자.

-   전역 or 인수 개체 생성
-   this 개체 생성
-   선언 된 변수와 함수를 위한 메모리 공간 확보
-   메모리에 함수 선언 배치
-   변수 선언에 기본값 undefined를 할당

#### Hoisting

자바스크립트 엔진은 생성 단계에서 전체 코드를 스캔하여 변수와 함수를 메모리 공간에 미리 기록해두는데, 그 공간이 바로 위에서 언급한 **Environment Record**(환경 레코드) 이다. 변수와 함수를 미리 기록해 둔 이후에 코드를 실행하기 때문에 아래 코드 예시와 같이 **실제로 선언 된 코드라인보다 이전에 선언 된 변수를 사용해도 에러가 발생하지 않는다.** 다만 아직 값이 할당되기 전이기 때문에 기본값으로 저장 된 `undefined` 값이 할당 되어 있다.

```js
console.log(a) // undefined
var a = "hello";
console.log(a) // "hello"
```

이와 같이 변수와 함수의 메모리 공간을 선언 전에 미리 할당하여 **변수의 선언과 초기화를 분리한 후, 선언만 코드의 최상단으로 옮기는**것을 [호이스팅](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)(Hoisting-끌어올리는)이라고 한다.

#### let과 const

`let`과 `const`로 선언한 변수의 경우 호이스팅시 변수를 초기화하지 않는다. 함수가 시작하고 선언과 할당 이전 까지의 공간을 TDZ(Temporal Dead Zone)이라고 부른다. TDZ 내에서 `let` 과 `cosnt` 로 선언한 변수를 호출하게 되면 `Uncaught ReferenceError: Cannot access '변수명' before initialization` 에러가 발생하게 된다.

#### 함수의 Hoisting

자바스크립트에서는 변수에 함수를 담을 수 있는데, 그러한 경우 위에 설명한 변수 호이스팅과 똑같이 동작한다. 이처럼 변수에 함수를 담아서 사용하는 방법은 **Function Expression (함수 표현식)** 이라고 한다.

반면, `function a() { ... }`처럼 일반적인 **Function Declaration 함수 선언문** 방식으로 함수를 선언한 경우에는 함수가 호이스팅 되어, 선언 전에도 함수를 사용할 수 있게 된다.

### 실행 단계

다음, 실행 단계 에서는

-   자바스크립트 엔진이 선언문 외의 코드를 한 줄씩 실행하고 변수에 실제 값을 할당한다.
-   필요한 경우 **환경 레코드**에 기록해 둔 정보를 참조하거나 업데이트 한다.

---

## 외부 환경 참조

위 **구성요소** 파트에서 언급했던 **Outer Environment Reference (외부 환경 참조)** 를 알아보자. `스코프`와 `스코프 체이닝`을 이해할 수 있게 된다.

실행 컨텍스트가 생성이 되면 **함수가 실행 된 순간의 환경을 기억**하게 되고, 이것을 **외부 환경 참조**라 한다. (이 특징을 이용하여 **Closure** 함수를 만들어 낼 수 있다.)

환경 레코드에 기록 되어, **변수나 함수에 접근할 수 있는 범위**를 **스코프**라고 하고, `전역 -> 함수 A -> 함수 B` 이렇게 스코프가 연결 되어있는 형태를 **스코프 체이닝**이라고 한다.

### 스코프 체인은 CallStack 기준으로 만들어지지 않는다.

> 외부 환경 참조를 설명하는 자료 중에, **Call Stack의 바로 아래 쌓여있는 컨텍스트의 환경 을 참조한다**고 설명하는 내용을 본 적이 있다. 꽤 신뢰 있는 곳에서 만든 자료라서, 맞다고 생각하고 있었는데 아무리 생각해도 내가 경험과는 다르다는 생각이 들었다. (물론 내가 자료를 잘 못 이해했을 수 있다.)  
> 몸으론 알지만 개념적으로 헷갈리는 상황이라서, 실험을 해보았다.

결론적으론 위에 언급한 자료가 틀렸다. 스코프 체인은 Call Stack에 쌓여있는 순서에서 참조하는 것이 아니라, **함수가 실행되는 순간 실행 되는 함수의 부모 스코프**에서 찾게 된다.

아래의 간단한 코드를 보자.

```js
let name = "Tom";

function b() {
  console.log(name);
}

function a() {
  let name = "Jake";
  b();
}

a();
```

`a` 함수 내에서 `b` 함수를 호출하였다. 콜 스택은 `Global` -> `a` -> `b` 순서로 쌓여 있을 것이다. 그렇다면 `b`함수 내의 `console.log(name)`은 어떤 값이 나오겠는가?

위 인용 글에서 보여준 것 처럼 현재 활성화 중인 **b 함수의 환경 레코드** 콜 스택의 바로 이전 단계인 **a 함수의 환경 레코드**에서 값을 찾는다고 가정하면 a 함수의 실행 단계에서 name을 `"Jake"`로 선언해주었기 때문에 `b` 함수 내의 `console.log(name)`은 `"Jake"`가 나와야 할 것이다.

하지만 콘솔 로그는 `"Tom"`이 찍힌다. 일단 `a` 함수 내에서 전역 스코프의 `name`을 `"Jake"`로 변경시킨 것이 아니라 **새로 선언** 했기 때문에 전역 스코프의 `name`은 여전히 `"Tom"`인 상태이다.

이 상태에서 `b` 함수에서 `console.log(name)`함수를 실행할 때, `name` 식별자를 콜 스택이 쌓인 기준이 아닌 **함수가 실행 된 순간의 환경**에서의 부모 스코프는 **전역 스코프**이기 때문에 전역 스코프의 식별자 `name`을 찾게 된다. 그래서 값은 `"Tom"`으로 찍히게 되는 것이다.

---

### 참고

-   [https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0](https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0)
-   [https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript/](https://ui.dev/ultimate-guide-to-execution-contexts-hoisting-scopes-and-closures-in-javascript/)
-   [https://developer.mozilla.org/ko/docs/Glossary/Hoisting](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)
-   [https://www.youtube.com/watch?v=EWfujNzSUmw&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9CTech](https://www.youtube.com/watch?v=EWfujNzSUmw&ab_channel=%EC%9A%B0%EC%95%84%ED%95%9CTech)
-   [https://nyol.tistory.com/129](https://nyol.tistory.com/129)