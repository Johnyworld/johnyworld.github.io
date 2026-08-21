---
tags:
  - 공부
  - 블로그발행
Created: 2022-03-03
---
자바스크립트로 코드를 짜다보면 this가 의도하지 않은 객체를 가리키는 경우를 한번쯤은 겪게 되는 것 같습니다. 그래서 `.bind()` 메서드를 주로 사용하곤 합니다. 처음에는 스택 오버플로우 형님들이 그렇게 알려줘서 그렇게 쓰곤 했지만, 왜 그런지 개념을 더 명확히 하기 위해 this에 대한 개념을 정리합니다.

---

## 자바스크립트의 this

JavaScript에서 함수의 this 키워드는 다른 언어와 조금 다르게 동작합니다. MDN 문서에는 아래와 같이 적혀있습니다.

> 대부분의 경우 this의 값은 함수를 **호출한 방법**에 의해 결정됩니다. 실행중에는 할당으로 설정할 수 없고 함수를 호출할 때 마다 다를 수 있습니다.

아래 예제에서 `showMyInfo` 함수를 호출하면 어떤 로그가 찍히는지 주목해주세요.

```js
const person = {
  name: "철수",
  showMyInfo: function () {
    console.log(this);
  }
}

person.showMyInfo(); // person

const showMyInfo2 = person.showMyInfo;

showMyInfo2(); // window
```

`person.showMyInfo`와 `showMyInfo2`는 같은 함수를 참조하고 있습니다. 하지만 둘의 this 값은 서로 다른 객체를 가리키고 있음을 알 수 있습니다.

함수가 **어디서 생성 되었는지**와는 관계 없이, **어디서 호출**되었는지에 따라 this가 바뀌는 것을 알 수 있습니다.

### call, apply

`call`, `apply` 메서드는 this의 값을 다른 문맥으로 넘길 수 있습니다.

```js
showMyInfo2().call(person); // person
showMyInfo2().apply(person); // person
```

두 메서드는 첫번째 인자로 'this'로 사용할 객체를 전달하는 공통점을 가지고 있습니다.  
두 메서드의 차이점은 어떤 방식으로 매개변수를 넘기느냐입니다.

위 예제에서 `person.showMyInfo` 메서드가 `name`과 `age`를 인자로 받는다고 가정합니다. 그러면 아래와 같이 `call`은 **arguments**로, `apply`는 **배열**로 매개변수를 넘길 수 있습니다.

```js
showMyInfo2().call(person, "철수", 15); // person
showMyInfo2().apply(person, ["영희", 13]); // person
```

### bind

`fn.bind(someObject)`를 호출하면 `fn`와 같은 본문(코드)과 범위를 가졌지만 `this`는 원본 함수를 가진 새로운 함수를 생성합니다.

```js
const showMyInfo3 = person.showMyInfo.bind(person);
showMyInfo3() // person
```

---

## 화살표 함수에서의 this

화살표 함수는 this를 가지고 있지 않는 것 처럼 동작합니다.

따라서 bind, call, apply등의 메서드는 무시합니다. (매개변수는 전달할 수 있습니다. 그러한 경우에는 첫번째 인자를 null로 전달합니다.)

this를 가지고 있지 않기 때문에 화살표 함수내에서의 this는 자신을 감싼 외부 환경의 정적 범위(호출한 환경이 아닌 선언한 환경)를 가리킵니다.

```js
const func = () => this;
const obj = { name: "철수", func };
const func2 = func.bind(obj)

const t1 = this; // window
const t2 = func(); // window
const t3 = obj.func() // window (not obj)
const t4 = func.call(obj) // window (not obj)
const t5 = func2() // window (not obj)
```

위와 같은 현상은 다른 함수 내에서 생성된 화살표 함수에도 동일하게 적용됩니다. this는 화살표 함수를 감싸고 있는 렉시컬 컨텍스트(어휘적 문맥)의 것으로 유지됩니다.

아래는 MDN에서 제공하는 예제입니다.

```js
// this를 반환하는 메소드 bar를 갖는 obj를 생성합니다.
// 반환된 함수는 화살표 함수로 생성되었으므로,
// this는 감싸진 함수의 this로 영구적으로 묶입니다.
// bar의 값은 호출에서 설정될 수 있으며, 이는 반환된 함수의 값을 설정하는 것입니다.
var obj = {
  bar: function() {
    var x = (() => this);
    return x;
  }
};

// obj의 메소드로써 bar를 호출하고, this를 obj로 설정
// 반환된 함수로의 참조를 fn에 할당
var fn = obj.bar();

// this 설정 없이 fn을 호출하면,
// 기본값으로 global 객체 또는 엄격 모드에서는 undefined
const t1 = fn() // obj

// 호출 없이 obj의 메소드를 참조한다면 주의하세요.
var fn2 = obj.bar;
// 화살표 함수의 this를 bar 메소드 내부에서 호출하면
// fn2의 this를 따르므로 window를 반환할것입니다.
const t1 = fn2()() // window
```

---

## 생성자의 this

함수를 new 키워드와 함께 생성자로 사용하면 this는 새로 생긴 객체에 묶입니다.

```js
function Constructor() {
  this.name = "철수";
}

var person = new Constructor();
const name = person.name; // 철수
```

---

## 이벤트 핸들러의 this

이벤트가 실행 된 엘리먼트를 가리킵니다.

참고

-   `currentTarget`: 이벤트 리스너를 가진 엘리먼트
-   `target`: 실제 이벤트가 실행된 엘리먼트
-   버블링, 캡쳐링등의 현상에 따라 currentTarget과 target이 다를 수 있음.

```js
function eventHandler(e) {
  console.log(this === e.currentTarget); // true
  console.log(this === e.target); // currentTarget과 target이 같은 객체면 true
}
```

## 참고한 자료

-   [https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)

