---
tags:
  - 공부
  - 블로그발행
Created: 2022-03-03
---
## 이벤트 흐름의 순서

이벤트는 기본적으로 3단계 순서로 흐릅니다.

1.  Capturing
2.  Target
3.  Bubbling

브라우저는 기본적으로 모든 이벤트를 Bubbling으로 처리합니다. 하지만 개발자는 addEventListener 의 세번째 인자로 `true` 값을 부여함으로써 해당 이벤트를 Capturing 단계에서 처리하도록 만들 수 있습니다.

```js
element.addEventListener('click', clickHandler, true);
```

그렇다면 각각의 용어에 대해서 알아보도록 합시다.

---

## Capturing

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F0601cc29-8331-4f89-bc4b-8533ab34a2ea%2FScreen%20Shot%202022-03-03%20at%204.11.10%20PM.png)

이벤트가 최상위 요소로부터 이벤트 발생 대상요소까지 전파 되는 것을 Capturing이라고 합니다.

---

## Target

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F00bd3e04-9b7a-49c9-8a34-bd727b208db4%2FScreen%20Shot%202022-03-03%20at%204.11.41%20PM.png)

이벤트가 발생한 주체를 target 이라고 합니다. 캡쳐링이 끝나면 target 엘리먼트의 이벤트를 발생시킵니다.

만약 여기서 `<div />`에 event listener가 생성되어 있다고 가정합시다. 이 때 div에서 실행되는 이벤트의 target과 currentTarget은 아래와 같습니다.

-   `target`: 이벤트가 발생한 주체 엘리먼트인 `<button />`.
-   `currentTarget`: 이벤트가 실행 된 (이벤트가 설치되어있는) 엘리먼트인 `<div />`

---

## Bubbling

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F536c13ad-c970-4e79-9012-b0c52c08cc13%2FScreen%20Shot%202022-03-03%20at%204.11.57%20PM.png)

이벤트가 발생한 대상 요소로부터 최상위 요소까지 전파 되는 것을 Bubbling 이라고 합니다.

---

## 이벤트 전파 막기

만약 `<button />`과 `<div />` 모두 이벤트가 걸려있다고 가정하면, 이벤트 버블링에 따라, `<button />` 이벤트가 실행 된 다음 `<div />` 이벤트가 실행 될 것입니다.

이러한 상황은, Image Fancybox 를 구현할 때에도 등장하게 됩니다. 배경 이미지를 클릭하면 Fancybox를 닫고, 버튼을 클릭하면 이미지를 리스트에 추가하거나, 이미지를 회전시키거나 하는 이벤트를 등록할 수 있습니다.

`<button />`을 클릭했는데 의도치 않게 Fancybox가 닫혀버리는 상황이 되어버립니다. 이러한 상황을 방지하기 위해 `event.stopPropagation()`메서드로 이벤트 전파를 막을 수 있습니다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F16b27210-f849-4d14-a746-1c1fb0ecb381%2FScreen%20Shot%202022-03-03%20at%204.37.53%20PM.png)

만약 `<div />`에 등록되어 있는 이벤트가 capturing때 실행 되도록 하고, 이벤트 전파를 막게 된다면 어떻게 될까요?

`capturing` 순서에서 이벤트 전파를 막게 되면 아래 그림과 같이 대상 엘리먼트까지 순서가 도달하지 않고 이벤트는 `<div />` 에서 멈추게 됩니다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F92f563b7-1a82-4dee-9d26-f343696f76aa%2FScreen%20Shot%202022-03-03%20at%204.41.42%20PM.png)

---

## Event Delegation

```jsx
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

위처럼 어떠한 리스트가 있고 **동적으로 리스트 아이템들이 추가되고 제거**되는 UI를 구현했다고 가정합시다. 각각의 `<li />`마다 이벤트를 걸어주게 되면, 리스트 아이템이 추가되고 삭제할때마다 이벤트 리스너를 일일히 add, remove 해줘야 합니다.

이 불편함을 개선하려면 Event Capturing을 응용할 수 있습니다. 리스트를 감싸는 `<ul />` 엘리먼트에만 이벤트를 등록하고, `currentTarget`이 아닌, `target`으로 엘리먼트를 제어하면 됩니다.

이러한 응용 방법을 Event Delegation 이라고 부릅니다.

---

## 참고한 자료

-   [https://vsvaibhav2016.medium.com/event-bubbling-and-event-capturing-in-javascript-6ff38bec30e](https://vsvaibhav2016.medium.com/event-bubbling-and-event-capturing-in-javascript-6ff38bec30e)
-   [https://www.youtube.com/watch?v=7gKtNC3b_S8](https://www.youtube.com/watch?v=7gKtNC3b_S8)