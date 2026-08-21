---
tags:
  - 에세이
  - 블로그발행
Created: 2021-08-21
---
![post-thumbnail](https://velog.velcdn.com/images/johnyworld/post/49d0c59a-75e9-4efe-91e8-3ab6c8ad63d1/atomic-design-process.png)

## 🧑🏻‍💻 서론

Atomic Design System을 React와 함께 사용한지 1년 6개월정도 된 것 같다. 프론트엔드 사수가 없던 두 번의 회사 프로젝트와 한번의 개인 프로젝트에 적용해 보았고 여러가지 삽질을 해보면서 점점 더 나은 방법을 찾게 되었다. ~~리팩토링을 몇번을 한건지...~~

Atomic Design System을 다양한 방법들로 응용해서 사용해보게 되었다. Atomic Design System의 철학을 오해하기도 하였고, React 에 적용하면서 재활용성을 높이려다가 잘못 판단하여 오히려 재활용성을 갖다 버리기도 했다.

여러번 방법을 바꿀때마다 "오 이 방법이 최고야!" 라고 생각했지만, 새로운 방법을 고안할 때 마다 그 생각은 깨지게 되었고 오히려 내가 실수를 했음을 깨닫게 되었다. 아마도 사수가 있었다면 이런 고민은 전혀 하지 않았겠지만, 혼자 삽질하며 터득한 노하우는 결코 쉽게 잊혀지지 않을 것이고, 오랜 시간 나쁜 방법들을 경험해봤기 때문에 프론트엔드 전반적인 구조를 깨닫는데도 도움이 되었던 것 같다. 추후에 리액트가 아닌 다른 라이브러리 or 프레임워크를 사용한다고 해도 프로젝트 구조를 잡는데에 큰 도움이 되리라 믿는다.

내가 삽질했던 패턴들을 모두 소개하고 싶지만, 글이 너무 길어질 것 같아서 현재 기준으로 가장 최선이라고 생각하는 방법을 소개하려고 한다.  
(당연히 앞으로 더 나은 방법을 누군가에게 배우거나 스스로 발견하게 될 수도 있을 것이다.)

> -   Atomic Design System 관련 글이나 블로그등을 찾아봐도 `큰 사이즈의 프로젝트` 에서는 어떻게 해야 하는지 모르겠는 분들에게 조금이나마 참고가 되었으면 한다.
> -   물론 "다들 이렇게 하는거 아니야?" 라고 생각할 수 있다. 하지만 다들 하는 걸, 난 이제서야 깨달았다.

## 📂 컴포넌트 분류

Atomic Design System은 총 5가지 컴포넌트 그룹으로 분류가 된다. `Pages`, `Templates`, `Organisms`, `Molecules`, `Atoms` 가 바로 그것이다. Atomic Design System은 React를 겨냥하여 만들어진게 아니기 때문에 React 에 맞게 재조정 할 필요성을 느꼈다. 특히나 `Templates` 그룹은 필요하지 않다고 느꼈다. (개인적인 생각)

그렇다면 새로 분류한 그룹을 보자.

-   Pages
-   Features
-   Organisms
-   Molecules
-   Atoms

`Templates`가 빠지고 `Features`를 새로 추가한게 전부다. 하지만 두 그룹의 역할은 매우 다르다.  
자세한 설명은 계속 이어가겠다.

## 📲 컴포넌트 구조

### 1. App.tsx

앱의 시작인 이 파일에 대해서 먼저 할 이야기가 있다.

나는 이 파일에서 기본적으로 앱에 전반적으로 필요한 데이터들을 불러온다.  
보통은 user 데이터를 GET 하여 Store 에 저장하는 등의 역할을 수행한다.  
유저가 선택했던 Light or Dark 테마나 Language 등을 localStorage 에서 가져오는 일도 여기서 할 수 있겠지만,  
그 작업은 Store 초기화 하는 곳 (InitialStore) 에 함께 두는 편이다.

**_위 작업들은 모두 용도별로 CustomHook 또는 함수로 분리하여 App.tsx 파일을 깔끔하게 유지한다._**

모든 데이터의 GET이 완료가 되면 필요에 따라 `Logged in` 유저와 `Not logged in` 유저와 `Admin` 유저를 나누어서 라우팅을 분리한다. 라우팅이 많아지면 파일을 나눠야 할 수도 있다. 그 경우 `src/Routes` 폴더로 컴포넌트를 분리한다.

```jsx
`src/App.tsx` 기본 데이터 로드
`src/AppRouter.tsx` 유저에 따라 라우팅 분리
`src/Routes/UserLoggedIn.tsx` 로그인 된 유저 라우팅
`src/Routes/UserNotLoggedIn.tsx` 로그인 되지 않은 유저 라우팅
```

물론 페이지가 많지 않거나 로그인/비로그인 상관없는 페이지가 많다면 구조는 많이 달라지게 될 것이다.  
처음에 `App.tsx` 파일에 쭈욱 작성하다가 좀 복잡해진다 싶으면 그 때 알맞게 나누면 된다.

이 과정이 진행중일때는 로딩 화면을 보여주고, 과정이 완료 되었을 때 각 페이지 화면으로 넘어가게 된다.

### 2. Pages

다음은 모든 컴포넌트의 시작인 Page 컴포넌트이다. `App.tsx` 는 사용자를 어디에 보낼지만 결정해주면 되고, 그 다음은 Page 컴포넌트의 몫이다.  
페이지 컴포넌트의 특징을 알아보자.

-   Parameter or Query 받기
-   비즈니스 로직
-   기능
-   API 호출
-   데이터 가공
-   서브메뉴/페이지 존재시 라우팅

기존에 Atomic Design System을 써본 개발자분들은 아마 다들 이렇게 사용하실 것 같다.  
그래서 긴 설명은 필요하지 않고, **내가 꼭 염두에 두는 사항들**을 설명하고 싶다.

#### Custom Hook

한 페이지에 기능이 여러개 들어가는 경우 반드시 CustomHook 을 만들어서 기능별로 분류해야 한다. 한 페이지에 기능이 한가지라면 굳이 이렇게 하지 않아도 될 수 있지만, 앱이 커지다보면 한 페이지에 많은 기능들이 들어가게 된다. 기능별로 분류하지 않으면 유지보수가 정말 힘들어진다.

> 예를 들어 상품 Details 페이지가 있고, 하단에 추천 상품 리스트가 있다고 치자. 두개의 기능은 서로 다른 기능이기 때문에 Hook을 분리한다.  
> `useProductDetails.ts`, `useRecomendedProducts.ts` 로 분리한다고 가정하자.
> 
> `useProductDetails.ts` 에는 아래와 같은 내용이 포함될 것이다.
> 
> -   useFetch : GET 상품 정보
> -   useFetch : POST 상품 구입
> -   API 로딩
> -   상품 Details 데이터 가공
> -   상품 구입 핸들링 함수
> -   API Response 처리
> -   구입 후 이벤트 함수
> -   ...등등
> 
> 그리고 추천 상품 리스트에 관련된 것들은 `useRecomendedProducts.ts` 와 같은 Hook 을 만들면 된다.

#### Re-Rendering

위 예시와 같이 하나의 페이지에 여러 기능이 들어갈 경우 렌더링 문제가 발생한다.  
_사용자는 상품 주문 수량을 1 늘렸을 뿐인데 추천 상품 리스트가 모두 새로 리렌더링 되는 문제_이다.

나는 처음에는 이런 경우 아예 컴포넌트를 나누어버렸다.  
Product 페이지 안에 `<ProductDetails />` 와 `<RecommendedProducts />` 컴포넌트를 나누는 것이다.

```null
<div>
  <ProductDetails />
  <RecommendedProducts  />
</div>
```

이것도 좋은 방법이라고 생각한다. 하지만 기능이 복잡해지고 많아지면서 컴포넌트 분리가 너무 많이 이루어지다보니 API 호출 코드가 여기저기로 흩어지고 로직 코드를 찾기도 쉽지 않았다. depth 도 5번 이상 깊게 들어가는 경우도 생겨버리고 말았다. 컴포넌트 이름도 잘 생각 안나는데 루트 컴포넌트에서 시작해서 여러단계의 자식 파일들을 열어야만 필요한 파일을 찾을 수가 있었다.

그래서 지금은 Page 컴포넌트 안에서 CustomHook 으로 기능을 분리하여 사용한다. 기능도 잘 분리돼있고 찾기도 쉽다. 깊이도 얕다.

물론 로직이 너무 복잡해지거나, **큰 데이터 호출**을 요구하는 **여러 서브페이지**로 나뉘어져야 하는 경우는 컴포넌트를 분리해야 한다. 컴포넌트를 분리해야 하는 경우 2depth 이상 넘어가지 않게 주의하자.

주제에서 좀 돌아갔는데, 그래서 리렌더링 문제를 어떻게 해결하느냐! 이미 예상하시겠지만 `useMemo`, `useCallback`, `React.memo` 등의 방법으로 해결할 수 있다. 자세한 내용은 논점을 벗어나기 때문에 `갓 구글` 형님께 맡긴다.

마지막으로 예시 코드이다.

```jsx
// ProductPage.tsx
const ProductPage: React.FC = () => {
  
  const userData = useSelector(state => state.user.userData); // Redux
  
  // CustomHook
  const {
    productData,
    productDataLoading, // 최초 데이터 GET 로딩
    productDataError, // 최초 데이터 에러 메시지
    productDataButtonLoading, // PUT, DELETE, POST 등의 API 콜 로딩
                   // PUT, DELETE, POST 등의 API 콜 에러는 Alert 모달로 띄움
    updateProduct, // 상품 수정하기 API 콜
    deleteProduct, // 상품 삭제하기 API 콜
    ...
  } = useProductDetails({ productId, userData });
  
  // CustomHook
  const {
    recommendedProductsList,
  } = useRecomendedProducts({ userData });
  
  return (
    <div>
      
      <ProductDetails // Organism
        data={productData}
        loading={productDataLoading}
        error={productDataError}
        buttonLoading={productDataButtonLoading}
        onSubmit={updateProduct}
        onDelete={deleteProduct}
      />
      
      <ProductList // Organism
        list={recommendedProductsList}
      />
      
    </div>
  )
}
```

### 3. Features

어쩌면 이 글을 읽고 계신 분들이 있다면, 가장 궁금해 할 부분이 여기일 것이라고 생각한다. 사실 대단한건 아니다. 먼저 이 컴포넌트 그룹의 역할을 보자.

-   Parameter or Query 받기
-   비즈니스 로직
-   기능
-   API 호출
-   데이터 가공

Features는 Pages와 역할은 비슷하다. Pages에 있던 역할들이 라우팅 빼고 다 들어가있다. Pages와 마찬가지로 여러 Hook과 기능을 포함하고 있으며 어떤 Organism 컴포넌트에 기능을 찔러 줄지에 대한 것도 포함한다.

#### 한 페이지에 기능이 많아질 경우

한 페이지에 기능이 많아지고 복잡해지면 CustomHook을 쓰라고 위에서 조언했다. 하지만 CustomHook을 쓰고 있음에도 기능이 너무너무 많아서 여전히 복잡할 수도 있는데, 그 경우 관련된 기능을 묶어서 Features 로 관리한다.

또는 Pages는 여러 Features 를 묶어주는 역할만 하고 모든 기능은 Features 에서 담당하는 것도 좋은 방법이다.

이 글을 앱이 복잡해 질 경우 컴포넌트를 나누는 것에 대한 이야기를 하고 있기 때문에 Features 를 설명하고 있지만, 사실 작은 단위의 앱에서는 굳이 필요하지 않다.

예시 코드를 보자.

```jsx
// ProductPage.tsx
const ProductPage: React.FC = () => {
  
  const location = useLocation();
  const productId = location.pathname.split('/')[2];
  
  return (
    <div>
      <ProductDetails productId={productId} ... /> // Feature Component
      <RecommendedProducts ... /> // Feature Component
    </div>
  )
}
```

위에서 Pages 컴포넌트를 설명할 때 이런식으로 컴포넌트를 나누면 좋지 않다고 설명했지만, 사실 Pages에서는 각 기능별로 이렇게 1depth 정도만 나누는건 오히려 좋다고 생각한다. depth가 깊어지는건 문제이지만, 1-2depth 정도는 괜찮다.

위 예시 코드에서 Feature 컴포넌트인 ProductDetails 컴포넌트의 내부를 들여다보자.

```jsx
// ProductDetails.tsx

export interface ProductDetailsProps { // Storybook 에 등록하기 위해 export 했다.
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  
  const userData = useSelector(state => state.user.userData); // Redux
  
  // Feature 컴포넌트에서 CustomHook은 필요 없을 수도 있다.
  // 하지만 깔끔하게 보여지기를 원한다면 쓰도록 한다.
  const {
    productData,
    loading, // 최초 데이터 GET 로딩
    error, // 최초 데이터 에러 메시지
    buttonLoading, // PUT, DELETE, POST 등의 API 콜 로딩
                   // PUT, DELETE, POST 등의 API 콜 에러는 Alert 모달로 띄움
    updateProduct, // 상품 수정하기 API 콜
    deleteProduct, // 상품 삭제하기 API 콜
    ...
  } = useProductDetails({ productId, userData });
  
  return (
    <section>
      <ProductDetailsView // Organism 컴포넌트다.
        data={productData}
        loading={productDataLoading}
        error={productDataError}
        buttonLoading={productDataButtonLoading}
        onSubmit={updateProduct}
        onDelete={deleteProduct}
      />
      
      <Modal ... /> // 기능에 Modal이 필요하다면 Feature 컴포넌트에 관련된 모달을 함께 묶어두면 좋다.
    </section>
  )
}
```

Pages 그룹을 설명할 때의 예시코드와는 다르게, RecommendedProductsList관련된 코드는 따로 없다. 완전히 다른 Feature 이기 때문이다.

#### 모달

한 페이지 내에 기능이 많아지면서 여러개의 Modal 이 포함되는 경우도 생길 것이다. 그런 경우에도 Feature 컴포넌트 안에 같이 묶어두면 좋다.

#### 재활용성?

이렇게 Page는 기능을 배치하는 역할만 하고, 기능들은 Features 컴포넌트로 분류하는 장점이 한가지 더 있는데, 다른 페이지에서 해당 기능이 필요한 경우 쉽게 불러올 수 있다는 점이다.

예를 들어 RecommendedProductList의 경우 여러 페이지에 걸쳐서 불러올 수 있다.  
(물론 Feature 컴포넌트 대신 CustomHook + Organism 조합으로 재활용 해도 상관 없다.)

### 4. Organisms & Molecules & Atoms

이 세가지 그룹은 역할이 비슷하기 때문에 묶어서 설명한다. 공통된 사항은 아래와 같다.

-   뷰 컴포넌트 (기능을 포함하지 않음)
-   버튼 또는 리스트 클릭 등의 이벤트 핸들링과 이벤트에 따른 데이터만 부모 컴포넌트로 전달
-   또는, 버튼 이벤트만 연결하고 컴포넌트 정의 과정에서 데이터를 처리할 수도 있다.
-   Stateless 일수도 있고 아닐수도 있음

그리고 세 그룹은 각자의 역할이 있다. 각자의 역할에 대해서 알아보자.

#### Atoms: 디자인 담당

-   Atom은 디자인만을 담당하고 있기 때문에 절대로 고정텍스트가 들어가지 않는다. 모든 텍스트는 props 로 받는다.
-   텍스트 외에도 지정 색상이나 크기 등을 props로 받을 수 있다. 디자인 시스템 컬러나 폰트 사이즈, 간격 등을 미리 Type으로 정해놓는다면 Typescript 와 함께 유용하게 쓴다.
-   예) Button, Input, Dropdown, Checkbox, Avatar, ...

#### Molecules: 디자인 묶음 (패턴)

-   Molecules는 여러 Atom 들과 HTML Element들의 집합체이며 각 요소들의 간격을 결정할 수 있다.
-   Molecules는 고정텍스트가 들어갈수도 있지만 들어가지 않는게 대부분일 것이다. 예를 들어 SNS 앱의 유저 소개 영역을 예로 들어보면 아바타, 닉네임, 소개, 등의 내용이 있을것이고 `닉네임` 이라는 단어는 고정 텍스트로 들어가야 할 수 있다.
-   예) NavigationBar, UserBio, UserListItem, ButtonGroup, ...

#### Organisms: 하나의 큰 블록

-   Organisms 에 대부분의 고정텍스트를 입력한다.
-   레이아웃을 담당한다. 유저 소개 영역, 팔로워 목록, 더보기 버튼 영역 등 많은 `Molecules`와 `Atoms`를 포함한다.
-   `Molecules`와 `Atoms` 컴포넌트들을 어떻게 배치할지, 어떤 텍스트가 배치될지, 간격은 얼마나 될지 등에 대한 결정은 Organism 컴포넌트에서 하게 된다.
-   Pages나 Features 에서 props로 내려 받은 기능 함수들을 각 버튼에 연결한다.
-   예) Header, Footer, Aside, UserProfile, ProductList, ProductDetail, FollowersList, NotificationsModal, ...

---

## 📝 글을 마치며

글을 쓰는 능력이 뛰어나지 않아서... 노력하고는 있는데, 이 글을 보는 분들이 잘 이해하실 수 있을지 잘 모르겠습니다. 이상 제가 혼자서 삽질해가며 익힌 Atomic Design System을 적용하여 컴포넌트 구조화 하는 방법에 대해서 설명했습니다.

글을 쓰는 연습도 하고 내 생각 정리도 하게 되는 좋은 시간이었습니다.

위 설명한 방법은 여전히 완벽한 방법은 아닐 수 있다고 생각합니다. 조언해주실 부분이 있다면 댓글로 좋은 의견 환영합니다. 컴포넌트 구조에 대해 좋은 토론의 장이 되는 것도 환영합니다.

감사합니다.