---
tags:
  - 공부
  - 블로그발행
Created: 2024-11-07
---


## 쌓임 맥락이란?

[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)는 쌓임 맥락을 다음과 같이 이야기하고 있습니다.

> 쌓임 맥락(Stacking context)는 뷰포트 또는 웹페이지를 향하고 있다고 가정한 사용자를 기준으로 가상의 z축을 따라 HTML 요소를 3차원으로 개념화한 것입니다. HTML 요소는 요소 속성에 따라 우선순위에 따라 이 공간을 차지합니다.

이게 도대체 무슨 말인지 이 글을 통해 천천히 알아봅시다!

## 용어집

- **modal:** 브라우저 내에서 주목할 수 있는 레이어를 띄우는 것.
- **dialog:** modal 의 한 종류로써, 일반적으로 우리가 modal 이라고 부르는, 중앙에 띄워지는 녀석입니다. 이것을 부르는 말은 다양한데, 구글에서 dialog 라고 부르고 있어서 그걸 차용해보겠습니다.
- **side-peek:** modal 의 한 종류로써, 사이드에 등장하는 녀석입니다. drawer, side-sheet 등 다 비슷비슷한 친구들인데 이 글에서는 side-peek 으로 부르겠습니다.

## position 과 z-index 에 따른 쌓임

기본적으로 `html` 태그를 기준으로 하나의 쌓임 맥락이 생성됩니다. 그 안에서 요소들이 어떻게 쌓이는지 가장 기본부터 알아봅시다.

아래에는 [1] 과 [2] 라는 이름을 가진 두개의 HTML 요소가 있습니다. 먼저 이 둘을 가지고 재밌는 것들을 해보고자 합니다.

### 두개의 요소가 positon: static 일 때

position 의 default 값은 static 입니다. 각 요소는 어휘적 순서에 영향을 받습니다.

> 이하 코드에서는 이 글에서 중요하지 않은 클래스, 스타일 등은 생략합니다.

```tsx
<div>1</div>
<div>2</div>
```

<article>
<div class="box blue">
  <p>1</p>
</div>
<div class="box green -mt-10 ml-10 flex-col-end">
  <p>2</p>
</div>
</article>

### [1]에 position: relative 속성을 부여해봤습니다.

position: relative 속성을 지닌 요소는 일반적인 요소들보다 한 단계 위 레이어에 놓입니다.

```tsx
<div class="relative">1</div> // ← 여기
<div>2</div>
```

<article>
<div class="box blue relative">
  <p>1</p>
  <p>relative;</p>
</div>
<div class="box green -mt-10 ml-10 flex-col-end">
  <p>2</p>
</div>
</article>

### 만약 둘 다 relative 라면?

[2] 에도 position: relative 속성을 부여했습니다. 이 경우 마찬가지로 [2] 요소가 한단계 위 레이어에 놓이고, [1] 과 [2] 는 현재 같은 레이어상에 있게 됩니다. 어휘적 순서에 영향을 받아 [2]가 다시 위로 올라옵니다.


```tsx
<div class="relative">1</div>
<div class="relative">2</div> // ← 여기
```

<article>
<div class="box blue relative">
  <p>1</p>
  <p>relative;</p>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative;</p>
</div>
</article>

### 이제 z-index 를 써보겠습니다.

어휘적 순서가 먼저인 [1]에 z-index: 10 속성을 부여했습니다.
이 경우 z-index 속성이 더 높기 때문에 [2]가 다시 아래로 내려갑니다.

```tsx
<div class="relative z-10">1</div> // ← 여기
<div class="relative">2</div>
```

<article>
<div class="box blue relative z-10">
  <p>1</p>
  <p>position: relative;</p>
  <p>z-index: 10;</p>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>position: relative;</p>
</div>
</article>

### 다시 원점으로 돌아가, 이번에는 자식컴포넌트가 존재할 때 어떻게 쌓이는지 보겠습니다.

부모 컴포넌트는 모두 relative 속성을 가지고 있습니다. 그리고 자식 컴포넌트에 absolute 속성을 부여했습니다.

```tsx
<div class="relative">
  1
  <div class="absolute">1-1</div>
</div>
<div class="relative">
  2
  <div class="absolute">2-1</div>
</div>
```

<article>
<div class="box blue relative">
  <p>1</p>
  <p>relative</p>
  <div class="box child blue absolute bottom-2 right-2">
    <p>1-1</p>
    <p>absolute</p>
  </div>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative</p>
  <div class="box child green absolute top-2 right-2 flex-col-end">
    <p>2-1</p>
    <p>absolute</p>
  </div>
</div>
</article>

### [1]에 z-index: 10 속성을 부여했습니다.

자식컴포넌트인 [1-1]도 부모를 따라서 [2] 보다 위에 놓이게 됩니다. [1] 요소에 쌓임 맥락이 생성되어 자식에게 영향을 주었습니다.

```tsx
<div class="relative z-10"> // ← 여기
  1
  <div class="absolute">1-1</div>
</div>
<div class="relative">
  2
  <div class="absolute">2-1</div>
</div>
```

<article>
<div class="box blue relative z-10">
  <p>1</p>
  <p>relative</p>
  <p>z-index: 10</p>
  <div class="box child blue absolute bottom-2 right-2">
    <p>1-1</p>
    <p>absolute</p>
  </div>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative</p>
  <div class="box child green absolute top-2 right-2 flex-col-end">
    <p>2-1</p>
    <p>absolute</p>
  </div>
</div>
</article>

### 자식 요소인 [1-1]에만 z-index 를 부여하면 어떻게 될까요?

부모는 어휘적 순서에 영향을 받았지만, [1-1]은 혼자 위에 놓이게 되었습니다.

```tsx
<div class="relative">
  1
  <div class="absolute z-10">1-1</div> // ← 여기
</div>
<div class="relative">
  2
  <div class="absolute">2-1</div>
</div>
```

<article>
<div class="box blue relative">
  <p>1</p>
  <p>relative</p>
  <div class="box child blue absolute bottom-2 right-2 z-10">
    <p>1-1</p>
    <p>absolute</p>
    <p>z-index: 10</p>
  </div>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative</p>
  <div class="box child green absolute top-2 right-2 flex-col-end">
    <p>2-1</p>
    <p>absolute</p>
  </div>
</div>
</article>

### [2-1]에도 z-index를 부여해보겠습니다.

역시나 어휘적 순서에 따라 [2-1]이 [1-1]보다 위에 놓이게 됩니다.

```tsx
<div class="relative">
  1
  <div class="absolute z-10">1-1</div>
</div>
<div class="relative">
  2
  <div class="absolute z-10">2-1</div> // ← 여기
</div>
```

<article>
<div class="box blue relative">
  <p>1</p>
  <p>relative</p>
  <div class="box child blue absolute bottom-2 right-2 z-10">
    <p>1-1</p>
    <p>absolute</p>
    <p>z-index: 10</p>
  </div>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative</p>
  <div class="box child green absolute top-2 right-2 flex-col-end z-10">
    <p>2-1</p>
    <p>absolute</p>
    <p>z-index: 10</p>
  </div>
</div>
</article>

### [1]에 추가로 z-index 를 줘보겠습니다.

어휘적 순서가 가장 아래에 있는 [2-1]이 가장 위에 놓여 있습니다.

```tsx
<div class="relative z-10"> // ← 여기
  1
  <div class="absolute z-10">1-1</div>
</div>
<div class="relative">
  2
  <div class="absolute z-10">2-1</div>
</div>
```

<article>
<div class="box blue relative z-10">
  <p>1</p>
  <p>relative</p>
  <p>z-index: 10</p>
  <div class="box child blue absolute bottom-2 right-2 z-10">
    <p>1-1</p>
    <p>absolute</p>
    <p>z-index: 10</p>
  </div>
</div>
<div class="box green relative -mt-10 ml-10 flex-col-end">
  <p>2</p>
  <p>relative</p>
  <div class="box child green absolute top-2 right-2 flex-col-end z-10">
    <p>2-1</p>
    <p>absolute</p>
    <p>z-index: 10</p>
  </div>
</div>
</article>

지금껏 봐 왔듯이 z-index는 부모 요소가 쌓임 맥락이 없다면 자신의 z-index 값에 따라 스스로 쌓임 맥락을 생성하고 레이어상 위쪽에 놓이게 됩니다.

아직까지는 그렇게 복잡해 보이지는 않습니다. 하지만 실무에서는 z-index가 겵코 간단하게 흘러가지 않습니다. 어떠한 서로 다른 UI 라이브러리에서 온 dialog 끼리 서로 누가 위로 올라가느냐 싸우고, 레거시 코드끼리도 서로 싸우다가 z-index 지옥이 펼쳐지며 난장판이 되는 경우가 허다합니다. 그러면 우리는 어떻게 z-index 를 관리해야할까요?

## 실무에서 적용할 수 있는 쌓임 맥락 제어

쌓임 맥락을 격리하는 방법을 사용하여 서비스 내에서 어떻게 z-index 를 깔끔하게 관리할 수 있을지 알아보겠습니다. 먼저 가장 중요한 이야기부터 하면, 저는 **z-index 를 (최대한)쓰지 않아야 한다고 믿습니다.** 즉, **어휘적 순서에 쌓임을 맡기는 것**입니다.

하지만, 하나의 dialog 레이어 안에서 sticky header 가 있는 경우나 부득이하게 z-index 를 써야 하는 경우들이 반드시 생깁니다. 이걸 어떻게 해결할 수 있을까요? 순서대로 알아보겠습니다.


### sticky header 를 가진 화면

main 요소에도 position: relative 속성이 있는 경우라면 header가 main 보다 어휘적 순서가 위에 있기 때문에 반드시 main 보다 아래 레이어에 위치하게 됩니다. 이것은 우리가 원하는 레이아웃이 아닙니다.

스크롤 해보세요.

```tsx
<div id="app">
  <header class="sticky top-0">Header</header>
  <main class="relative">...</main>
  <footer>...</footer>
</div>
```

<article>
<div id="app" class="h-40 scrollable">
  <header class="blue sticky top-0">
    <p>Header, sticky</p>
  </header>
  <main class="green h-40 relative">
    <p>Main</p>
    <p>relative</p>
  </main>
  <footer class="blue">
    <p>Footer</p>
  </footer>
</div>
</article>

### header 에 z-index 를 부여해봅니다

header 에 z-index: 20 을 줬습니다. 이제야 제대로 되는 것 같군요.

```tsx
<div id="app">
  <header class="sticky top-0 z-20">Header</header> // ← 여기
  <main class="relative">...</main>
  <footer>...</footer>
</div>
```

<article>
<div id="app" class="h-40 scrollable">
  <header class="blue sticky top-0 z-20">
    <p>Header, sticky, z-index: 20</p>
  </header>
  <main class="green h-40 relative">
    <p>Main</p>
    <p>relative</p>
    <p>스크롤 해보세요.</p>
  </main>
  <footer class="blue">
    <p>Footer</p>
  </footer>
</div>
</article>

### 이제 dialog 를 띄워봅시다

header 의 z-index 를 모르는 한 개발자가 z-index: 10 의 dialog 를 만들었습니다.

```tsx
<body>
  <div id="app">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay z-10"></div> // ← 여기
  <div class="dialog z-10">...</div> // ← 여기
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable">
    <header class="blue sticky top-0 z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay z-10"></div>
  <div class="dialog z-10">
    <content>
      <main>
        나는야 모달
        <p>z-index: 10</p>
      </main>
    </content>
  </div>
</div>
</article>

앗! dialog 의 z-index 가 header 의 z-index 보다 작다보니, dialog 가 header 보다 어휘적 위치가 아래에 있음에도 불구하고 header 위에 놓이게 되는 이상한 모양이 되어버렸습니다.

> 참고로 아래 예시에서, dialog 와 side-peek 의 레이아웃을 구현할 때 일반적으로 사용하는 속성인 transform 속성을 사용하지 않았습니다. 적절한 예시를 만들기 위해서인데, 이유는 뒤에서 말씀드리겠습니다.

### dialog 에 header 보다 위인 z-index 30을 주면 어떨까요?

```tsx
<body>
  <div id="app">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay z-30"></div> // ← 여기
  <div class="dialog z-30">...</div> // ← 여기
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable">
    <header class="blue sticky top-0 z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay z-30"></div>
  <div class="dialog z-30">
    <content>
      <main>
        나는야 모달
        <p>z-index: 30</p>
      </main>
    </content>
  </div>
</div>
</article>

이제 좀 원하는 대로 보여지는 것 같네요.

### 여기에 side-peek 을 추가해보죠.

dialog 내에서 어떤 버튼을 클릭해서 SidePeek 이 열렸다고 가정하면, dialog 보다 위에 있으니, z-index 40을 줘야겠죠?

```tsx
<body>
  <div id="app">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay z-30"></div>
  <div class="dialog z-30">...</div>
  <div class="modal-overlay z-40"></div> // ← 여기
  <div class="side-peek z-40">...</div> // ← 여기
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable">
    <header class="blue sticky top-0 z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay z-30"></div>
  <div class="dialog z-30">
    <content>
      <main>
        나는야 모달
        <p>z-index: 30</p>
      </main>
    </content>
  </div>
  <div class="modal-overlay z-40"></div>
  <div class="side-peek z-40">
    <content>
      나는야 사이드픽
      <p>z-index: 40</p>
    </content>
  </div>
</div>
</article>

### 그런데, side-peek 이 dialog 보다 언제나 레이어상 위에 있을까요?

사용자가 side-peek 에서 뭔가를 보다가 dialog UI를 만나게 되는 경우도 많이 볼 수 있습니다. 일반적으로 Modal UI 들은 나중에 열린 친구들이 레이어상 위에 놓이게 됩니다. 주목해야 하니까요. 이때마다 z-index 를 바꿔줘야 할까요? 

```tsx
<body>
  <div id="app">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  // dialog 와 side-peek 의 z-index 를 서로 바꾸었습니다.
  <div class="modal-overlay z-40"></div>
  <div class="dialog z-40">...</div>
  <div class="modal-overlay z-30"></div>
  <div class="side-peek z-30">...</div>
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable">
    <header class="blue sticky top-0 z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay z-40"></div>
  <div class="dialog z-40">
    <content>
      <main>
        나는야 모달
        <p>z-index: 40</p>
      </main>
    </content>
  </div>
  <div class="modal-overlay z-30"></div>
  <div class="side-peek z-30">
    <content>
      나는야 사이드픽
      <p>z-index: 30</p>
    </content>
  </div>
</div>
</article>

그리고 어디 side-peek 뿐인가요? 토스트, 바텀시트, 툴팁, 팝오버, 드롭다운 등등... 레이어 싸움에는 수많은 참가자들이 있습니다. 과연 이들 모두에게 알맞은 z-index 를 부여할 수 있을까요?

해결 방법으로 Modal 컴포넌트들의 사용처에서 그때 그때 z-index를 부여하는 방식을 생각해 볼 수 있을 것 같습니다. 나쁘지 않은 것 같은데요? 하지만 이 방법도 쉽지 않습니다. z-index 가 서로 위에 있겠다고 싸우는 상황은 여전히 해결되지 않을 것입니다.

## 쌓임 맥락을 격리해봅시다

일단 dialog 들의 z-index 를 모두 제거해보겠습니다. 위에서 언급했지만, header 는 sticky 속성이 있고 main 에 relative 속성이 있기 때문에 z-index를 제거할 수 없습니다.

```tsx
<body>
  <div id="app">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay"></div> // ← 여기
  <div class="dialog">...</div> // ← 여기
  <div class="modal-overlay"></div> // ← 여기
  <div class="side-peek">...</div> // ← 여기
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable">
    <header class="blue sticky z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog">
    <content>
      <main>
        나는야 모달
      </main>
    </content>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek"><content>나는야 사이드픽</content></div>
</div>
</article>

header 가 다시 혼자 위쪽 레이어로 올라왔습니다.

### app 역할을 하고 있는 div 요소에 isolation: isolate 속성을 줍니다.

isolation: isolate 속성은 해당 요소를 기준으로 하나의 쌓임 맥락을 생성하고 격리합니다. 좀 더 이해하기 쉽게 말하자면... 말 그대로 **z축의 모음(맥락)을 격리(isolate)하는 것**입니다. 
header, main, footer를 감싸는 app 요소의 쌓임 맥락이 생성되고 격리되어, 외부 환경과 쌓임 맥락을 공유하지 않게 됩니다.

바로 위의 예시에서는 header 요소의 z-index 가 dialog, side-peek 요소들과 비교해서 더 높기 때문에 위쪽 레이어에 놓였습니다.

하지만 isolate 속성을 사용한 아래 예시를 보면, 이제는 header 요소와 dialog, side-peek 을 비교하지 않고 격리된 app 요소와 그 형제들인 dialog, side-peek 을 비교하게 됩니다.

```tsx
<body>
  <div id="app isolate"> // ← 여기
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog">...</div>
  <div class="modal-overlay"></div>
  <div class="side-peek">...</div>
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable isolate">
    <header class="blue sticky z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog">
    <content>
      <main>
        나는야 모달
      </main>
    </content>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek"><content>나는야 사이드픽</content></div>
</div>
</article>

보시다시피 app, dialog, side-peek 그리고 modal-overlay 까지 아무도 z-index 를 가지고 있지 않습니다. 그래서 **어휘적 순서대로 쌓이게 됩니다.**

## 조금 응용을 해보겠습니다.

dialog 에도 header 를 만들어봤습니다. 

```tsx
<body>
  <div id="app isolate">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog">
    <header class="sticky top-0 z-20">...</header> // ← 여기
    ...
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek">...</div>
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable isolate">
    <header class="blue sticky z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog">
    <content>
      <header class="block blue sticky z-20">
        <p>Header, sticky, z-index: 20</p>
      </header>
      <main>
        나는야 모달
      </main>
    </content>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek"><content>나는야 사이드픽</content></div>
</div>
</article>

역시나, dialog 의 header 가 side-peek 을 침범하고 있습니다.

> 위에서 dialog 와 side-peek 의 레이아웃을 구현할 때 **transform 속성을 사용하지 않고 dialog, side-peek을 구현했다**고 말씀 드렸었는데, 이 예시를 위해서입니다.
> transform 속성은 isolate 와 마찬가지로 **쌓임 맥락을 생성하여 격리하는 속성**입니다(놀랍게도 opacity 도). 쌓임 맥락이 격리되기 전/후를 보여드리고 싶은데 transform 은 이미 쌓임 맥락이 격리 되었기 때문에 전/후를 비교해드릴 수가 없었습니다.
> 쌓임 맥락을 생성/격리하는 것은 어떤 것들이 있는지는 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context#description)에 잘 나와 있습니다.

dialog 에도 똑같이 isolate 속성을 부여해서 격리해보겠습니다.

```tsx
<body>
  <div id="app isolate">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog isolate">  // ← 여기
    <header class="sticky top-0 z-20">...</header>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek">...</div>
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable isolate">
    <header class="blue sticky z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog isolate">
    <content>
      <header class="block blue sticky z-20">
        <p>Header, sticky, z-index: 20</p>
      </header>
      나는야 모달
    </content>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek"><content>나는야 사이드픽</content></div>
</div>
</article>

눈에 거슬렸던 dialog header 가 잘 사라진 모습이 보이나요? 쌓임 맥락을 잘 격리하면, 격리된 환경 내에서만 z-index 를 신경쓰면 되기 때문에 관리하기가 편합니다. 다른 Modal 내부에서 z-index 를 1000을 사용하던 9999를 사용하던 관심을 가질 필요가 없어집니다.

마지막으로, isolate 대신 위에서 말한 것 처럼 transform 속성으로도 쌓임 맥락이 격리 되는지 테스트 해보겠습니다.

```tsx
<body>
  <div id="app isolate">
    <header class="sticky top-0 z-20">Header</header>
    <main class="relative">...</main>
    <footer>...</footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog -translate-x-20">  // ← 여기
    <header class="sticky top-0 z-20">...</header>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek">...</div>
</body>
```

<article>
<div class="relative">
  <div id="app" class="h-40 scrollable isolate">
    <header class="blue sticky z-20">
      <p>Header, sticky, z-index: 20</p>
    </header>
    <main class="green h-40 relative">
      <p>Content</p>
      <p>relative</p>
    </main>
    <footer class="blue">
      <p>Footer</p>
    </footer>
  </div>
  <div class="modal-overlay"></div>
  <div class="dialog z-0">
    <content>
      <header class="block blue sticky z-20">
        <p>Header, sticky, z-index: 20</p>
      </header>
      나는야 모달
    </content>
  </div>
  <div class="modal-overlay"></div>
  <div class="side-peek"><content>나는야 사이드픽</content></div>
</div>
</article>

우리가 예상한 대로 dialog 내의 쌓임 맥락이 격리되어, 외부 쌓임 맥락의 영향을 받지 않게 되어 원하는 레이어로 dialog header 가 위치하게 되었습니다.

## 마무리

앞으로 우리는 어떻게 하면 좋을까요? 현재 유행하고 있는 Headless UI 패턴을 사용하는 라이브러리들을 보면 기본적으로 모든 dialog 에 z-index 를 사용하지 않을 수 있습니다. 그것을 활용하면 좋을 것 같습니다.

body 의 1depth 자식인 app 요소에 isolate 속성을 주고 앞으로 쌓일 Modal 요소들은 body 에 append 되도록 합니다. 필요시 Modal 요소들에도 isolate 속성을 주면 각 Modal 요소들끼리 z-index 의 영향을 주고받지 않게 됩니다. 

```tsx
<body>
  <div id="app" class="isolate">...</div>
  <div class="modal-overlay"></div>
  <div class="modal isolate">
    <header class="sticky z-10">...</header>
  </div>
  <div class="side-peek"></div>
  <div class="popover"></div>
  <div class="toast"></div>
  <div class="alert"></div>
</body>
```

이 때, 나중에 생성되는 dialog 일수록 어휘적으로 아래쪽에 쌓이고 더 위쪽 레이어로 쌓이게 됩니다. 이것은 매우 자연스럽게 느껴질 것입니다. 물론 z-index 를 가지고 있지 않아야 합니다.

## FAQ

Q. 타이밍 이슈로 2개의 Modal 요소가 열리는데 순서가 보장되지 않는 경우는 어떻게 하면 좋을까요?

A. 
일단 최초 페이지 로드시, 또는 사용자 인터렉션 후 2개 이상의 Modal 요소가 뜨게 되는 것은 좋은 UX가 아닌 것 같습니다. 그런 상황을 만들지 않는게 가장 좋겠지만 피치 못하게 그런 상황이 발생하는 경우가 있을 것 같습니다.

일단 타이밍 이슈가 있을 때에는 어떤 Modal 요소들이 존재하는지 확인해보고 어떤 순서로 뜨던지 어색하지 않을 것 같다면 그대로 두어도 좋을 것 같습니다. 하지만 Alert, Confirm 창이 다른 Modal 요소 보다 먼저 뜬 다음 다른 Modal 요소들에 의해 가려지게 되면 어색하게 느껴질 것 같습니다. 이때는 해당 사용처에서만 Alert, Confirm 등에 특별히 z-index 를 사용하면 좋을 것 같습니다. 또는 Alert, Confirm 이 항상 가장 위에 떠야한다는 가정이 있다면 디자인 시스템 단계에서 z-index 를 부여해 놓는것도 필요할 수 있을 것 같습니다.

또는 중요도에 따라 modal 간에도 두개의 레이어를 두는 것도 생각해볼 수 있을 것 같습니다. 

```tsx
<body>
  <div id="app" class="isolate">...</div>
  <div id="modals">
    <div class="modal-overlay"></div>
    <div class="modal isolate">
      <header class="sticky z-10">...</header>
    </div>
    <div class="side-peek"></div>
    <div class="popover"></div>
    <div class="toast"></div>
  </div>
  <div id="alerts">
    <div class="alert"></div>
  </div>
</body>
```

<style>
article {
  color: black;
}
article p {
  font-size: 12px;
}
content {
  display: block;
}
.box {
  padding: 4px;
  width: 150px;
  height: 150px;
  background: #000000d4;
  border-width: 2px;
  border-style: dashed;
  border-color: #000;
}
.box.child {
  width: 80px;
  height: 80px;
}
.blue {
  background: #a2c9ffd4;
  border-color: #1448a3;
}
.green {
  background: #a5ffa5d4;
  border-color: #2c8112;
}
.red {
  background: #ff8a8ad4;
  border-color: #a31e1e;
}
.flex-col-end {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.scrollable {
  overflow-y: scroll;
  border: 2px solid #000;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000aa;
}
.dialog {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
}
.dialog content {
  width: 200px;
  height: 100px;
  background: #fff;
  border: 2px solid #000;
}
.dialog content main {
  padding: 16px;
}
.side-peek {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.side-peek content {
  width: 40%;
  height: 100%;
  padding: 16px;
  background: #fff;
  border: 2px solid #000;
}
</style>