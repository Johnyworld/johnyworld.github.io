---
Created: 2023-11-14
tags:
  - 블로그발행
  - 에세이
---
의뢰를 받아 모 서비스의 프로젝트 기초를 만들고 있는데, 그걸 하면서 [tailwind CSS](https://tailwindcss.com/) 를 처음으로 사용해봤다. 약 3년 전부터 이것의 존재는 알고 있었는데, 당시에는 **CSS 이름은 의미가 있어야 한다**라는 믿음이 있었기에 클래스명에 단순히 인라인 방식으로 스타일만 나열 되는 것 처럼 보이는 Utility-first CSS 프레임워크는 거부감이 들어서 사용해 볼 마음 조차 들지 않았었다.

## 그런데 왜 써보게 되었나

계기가 있었다. 유틸리티 클래스를 하나하나 만들고 있던 나 자신을 발견하고 나서 부터 였다.

나는 리액트나 넥스트에서 컴포넌트와 동일한 이름으로 클래스명을 만들었고 컴포넌트에서 prop 으로 받는 크기값을 가지는 클래스들도 따로 정의했다. 예를 들면 `.button__small` 이런 것이다.

그리고 색상 값은 보통 디자인 시스템에 정의가 되어 있거나, 개인 프로젝트는 내가 정의를 하고 사용하기 때문에 scss 에 변수로 등록 해놓고 `@each` 문을 돌아 `.c-primary`, `.bg-gray-weak` 와 같은 클래스명을 만들어 놓고 사용했다.

저렇게 만들어 두면 사용이 편리하기 때문에, 시간이 지나면서 색상 값 뿐 아니라 간격, 폰트 사이즈, 정렬 등등... 하나, 하나 코드를 만들어 두게 되었다.

물론 저렇게 만든 클래스들을 className 에 직접 넣지는 않는다. 상위 컴포넌트로부터 전달 받은 prop 값에 의해 결정이 될 용도로만 사용했다.

```tsx
// 이렇게 말고
<button className="button c-primary ..." />

// 이렇게
<button className={classNames('button', {[`c-${color}`]: color })} />
```

이렇게 유틸리티 클래스를 하나하나 만들다보니 문득 tailwind CSS 가 떠올랐다. `"이럴거면 tailwind 쓰지"` 라는 생각이 들었고, 사람들이 많이 쓰는데는 이유가 있지 않을까 싶어서 공식 홈페이지에 들어가 글들을 읽기 시작했다.

그 중 tailwind를 개발한 [Adam Wathan](https://adamwathan.me/) 님이 2017년에 작성한 [CSS Utility Classes and "Separation of Concerns"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/) 라는 글이 인상 깊었다. 이분도 처음에는 **CSS 이름은 의미가 있어야 한다** 라고 생각을 했었더랬다.

tailwind 를 써본 사람들의 후기들과 장단점들을 파악해가며 이걸 적용해도 될지 고민해 보았고, 결국 적용해보기로 결정했다. 그 중 [워니님의 후기](https://wonny.space/writing/dev/hello-tailwind-css)가 참 잘 정리 되었던 것 같다.

## 어떻게 쓰고 있나

### 이상하게 사용해보기

옛날 습관을 버리기 어렵기도 하고 클래스명이 지저분해지는게 싫어서 [@apply](https://tailwindcss.com/docs/functions-and-directives#apply) 기능을 많이 사용했다. tailwind 의 철학과 맞지 않는 방법 같지만, 이런식이었다.

```css
@layer component {
	.button {
		@apply flex items-center h-10 py-4 ... ;
	}
}
```

이미 `<Button />` 컴포넌트로 분리되어 있었지만, 클래스명을 깔끔하게 유지하기 위해 저렇게 했고, prop 을 통해 다이나믹하게 변화되는 스타일만 아래와 같이 따로 클래스명에 추가했다.

```tsx
// 'button' 이라는 클래스명에 많은 스타일이 담겨있다.
<button className={classNames('button', {[colorVariants(color)]: color })} />

const colorVariants = {
	primary: 'text-white bg-primary',
	...
}

// 아무런 prop을 받지 않은 버튼은 클래스명이 깔끔하긴 했다.
<button class="button">버튼</button>
```

하지만 이게 맞나 싶었다. 스타일을 수정하기 위해 **css 파일을 건드리지 않아도 된다**는 것이 tailwind 의 철학 중 하나인데, 그게 지켜지지 않고 있었다.

### 깨달음

그래서 지금은 클래스명의 지저분함은 인정하고 넘어가기로 했다. 그걸 누가 본다고... ㅎㅎ

`@apply` 는 위에서 보여준 것 처럼 `.button` 같은 컴포넌트 클래스를 정의한 것 대신 mixin 처럼 사용하게 되었다. 자주 사용하는 패턴들을 묶었고, 클래스명 앞에는 알기 쉽게 `_` 언더스코어 프리픽스를 붙여주었다.

```css
@layer component {
	._ellipsis {
		@apply text-ellipsis overflow-hidden whitespace-nowrap;
	}
	._flex-center {
		@apply flex items-center justify-center;
	}
	._pos-center {
		@apply top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4;
	}
}
```

## 써보면서 느낀 점

모든걸 포기(?)하고나니, tailwind 의 장점들이 체감되기 시작했다. 특히 개발 속도 향상이 느껴졌다. tsx, scss 파일 왔다 갔다 하는 시간도 줄었지만 컴포넌트를 새로 만들 때 scss 파일을 추가로 만들지 않아도 됐다.

### React(Next) 와 함께 사용하니 좋다.

tailwind 는 어떠한 수정사항이 생겼을 때 전체 페이지에 대한 스타일 수정이 어렵다는 단점이 있었다고 들었다. 하지만 리액트(넥스트)와 함께 쓰면, 재활용 된 컴포넌트를 수정하여 전체 페이지에 쉽게 적용할 수 있기 때문에 전혀 문제가 안됐다.

그리고 비록 클래스명이 지저분해지고, 태그에 의미는 사라졌지만(사실 뭐 스타일 없는 클래스명을 맨 앞에 붙여주면 의미가 없진 않게 된다.) 컴포넌트명에 의미가 있기 때문에 이것도 문제가 안됐다. 
**우리에게는 의미 있는 '컴포넌트'가 있는데, 클래스명 예쁜게 뭐가 중요한가. 개발 속도가 빨라졌으면 그걸로 된거지!**

### 테마 설정하는게 꽤 맘에 든다.

`tailwind.config.js` 는 참 많이 드나들게 된다. 여기서 색상, 폰트 사이즈, 간격 등의 테마를 설정할 수 있다. 디자인 시스템의 상당 부분을 여기서 설정하여 클래스명에 적용할 수 있어서 좋았다. scss 를 사용할 때에도 항상 디자인 시스템을 변수로 정의해두고 쓰는데, 그런게 잘 지원 됐다.