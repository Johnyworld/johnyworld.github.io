---
Created: 2022-02-04
tags:
  - 에세이
  - 블로그발행
---
> @deprecated : 이 글에서 설명한 방법은 더 이상 사용하고 있지 않다. 조합형 UI 라이브러리인 Radix 의 모달이 여러가지 방법을 유연하게 제공하고 있다고 생각한다.

리액트에서 Modal을 띄울 때 여러가지 고민을 했었고 몇가지 패턴으로 Modal을 사용해보았다. 어떤 패턴을 사용해보았고 지금은 어떤 패턴을 가장 선호하는지에 대해 공유하고자 한다.

내가 사용해 본 패턴은. ~~이름은 내 마음대로...~~

1.  Trigger component
2.  Modal hook
3.  Toggle state modal

## Trigger component

Modal 과 Trigger를 하나의 컴포넌트 안에 주입시키는 패턴이다. 이러한 패턴은 [Sementic-UI React](https://react.semantic-ui.com/)를 통해 처음 접하게 되었다.

코드를 보자. 아래 코드는 [Sementic-UI React](https://react.semantic-ui.com/) 홈페이지에서 복사해왔다.

```jsx
const [open, setOpen] = useState(false);

<Modal
  onClose={() => setOpen(false)}
  onOpen={() => setOpen(true)}
  open={open}
  trigger={<Button>Show Modal</Button>}
>
  <Modal.Header>Select a Photo</Modal.Header>
  <Modal.Content>
    ...
  </Modal.Content>
  <Modal.Actions>
    ...
  </Modal.Actions>
</Modal>
```

위와 같이 Modal 이라는 컴포넌트 안에, `children`으로 Modal 내용들을 전달하고, Modal을 띄워줄 버튼 등을 `trigger` prop으로 전달한다. 꽤 직관적이고 심플하게 사용할 수 있다.

하지만 이 패턴에서 내가 느끼는 단점이 있었다. 그게 뭔지는 **Toggle state** 패턴을 설명할 때 같이 설명 할 것이다.

## Modal Hook

`useModal` 이라는 custom hook을 이용한 패턴이다. hook 안에 모든 재료들을 준비해놓고, 컴포넌트에서는 사용하기만 하면 되는 구조다.

#### 참고로 이 패턴의 경우 단점이 꽤 많아서, 이제는 사용하지 않는다.

```jsx
// useModal.ts
const [isOpen, setIsOpen] = useState(false);

const openModal = useCallback(() => setIsOpen(true), [isOpen]);
const closeModal = useCallback(() => setIsOpen(false), [isOpen]);
const toggleModal = useCallback(() => setIsOpen(!isOpen), [isOpen]);

const renderModal = <Modal>
  <Modal.Header>{headerText}</Modal.Header>
  <Modal.Content>
    {modalContent}
  </Modal.Content>
  <Modal.Actions>
    {modalActions}
  </Modal.Actions>
<Modal>
  
return {
  isOpen,
  openModal,
  closeModal,
  toggleModal,
  renderModal,
}
```

```jsx
// Component.tsx
const { openModal, renderModal } = useModal({
  headerText: 'Select a Photo',
  modalActions: <>
    ...
  </>,
  modalContent: <>
    ...
  </>
});

return (
  <div>
    <button onClick={openModal}>Open</button>
    {renderModal}
  </div>
)
```

처음에는 custom hook을 이용해 Modal을 구현해보고 싶었고, 준비 된 재료들을 hook에서 바로 사용할 수 있어서 좋다고 생각했다. 하지만 오래 못가, 많은 단점들이 발견되었고 더 이상 사용하지 않게 되었다.

어떠한 단점들이 있었을까?

#### 1. `Component.tsx` 파일 내에서 기능이 들어가야 할 영역에 View 를 포함하게 된다.

`useModal`에 props 로 전달하게 되는 modalActions와 modalContent는 모두 React.Element이다. 즉, View를 담당하게 될 부분인 것이다. 보통 View는 컴포넌트 가 반환하는 `return (...)` 코드 내에 존재한다고 생각하게 되는데. 컴포넌트 로직이 존재하는 위치에 View가 존재하게 되다보니 혼동이 오게 됐다.

#### 2. 코드를 찾기가 어렵다.

컴포넌트 내에 여러가지의 Modal들과 기능들이 붙다보면, 관련 된 코드들이 서로 떨어지게 되어, 코드를 찾는것도 힘들게 느껴졌다.

#### 3. renderModal을 return 코드에 포함해야 한다.

굳이 `renderModal`을 `return <...>{renderModal}</...>` 이와 같이 return 안에 넣어줘야 했다. 물론 전역 store를 이용해 해결할 수 있겠지만, 모달 안에 여러 로직과 상태들이 존재해야 하는 경우 컴포넌트간 데이터를 공유하는 것이 쉽지 않다고 느꼈다.

## Toggle state

마지막 소개 할 패턴은 `Toggle state` 이다. 첫번째로 설명한 `Trigger compoenet` 패턴을 사용했을 때, 해결하고 싶은 문제가 있었다. 그것은 **컴포넌트 관심사 분리**이다.

예를 들어, 어떠한 글 리스트를 보여주고 있는 화면에서 글 새로 추가하거나 수정하는 폼을 Modal로 띄워야 하는 경우를 가정한다.

```jsx
// PostList.tsx
const [openEdit, setOpenEdit] = useState(false);
const [openCreate, setOpenCreate] = useState(false);

const postList = useSelector(state => state.post.postList);
const {...} = useEditPost();
const {...} = useCreatePost();

<Modal
  onClose={() => setOpenEdit(false)}
  onOpen={() => setOpenEdit(true)}
  open={openEdit}
  trigger={<Button>Edit Post</Button>}
>
  <Modal.Header>Edit Post</Modal.Header>
  <Modal.Content>
    ...
  </Modal.Content>
  <Modal.Actions>
    ...
  </Modal.Actions>
</Modal>

<Modal
  onClose={() => setOpenCreate(false)}
  onOpen={() => setOpenCreate(true)}
  open={openCreate}
  trigger={<Button>Create Post</Button>}
>
  <Modal.Header>Create Post</Modal.Header>
  <Modal.Content>
    ...
  </Modal.Content>
  <Modal.Actions>
    ...
  </Modal.Actions>
</Modal>

...

<PostListItems list={postList} />
```

위처럼 두가지 이상의 기능들을 가진 컴포넌트를 첫 번째 패턴으로 하게 되면, 어떤 단점들이 있을까?

1.  `List` 컴포넌트 안에 Create, Edit 기능이 함께 존재해야하고, View와 기능이 섞이게 된다.
2.  1번을 해결하고자 **Modal과 기능을 하나씩 각각 묶게 되면** 기능이 여러 컴포넌트로 흩어지게 되고 앱이 더 복잡해지게 되면 기능을 찾기가 어려워진다.
3.  api call 함수를 따로 분리한다 하더라도, 한 컴포넌트 내에서 `onEdit`, `onCreate`, `list` 등의 서로 관련 없는 여러 props를 받아줘야 하는 문제가 있다.
4.  Button과 Modal이 결합되어 있어, 레이아웃 변경이 무겁고 복잡해진다.
5.  Modal 위에서 다른 Modal을 띄워야 하는 경우가 있었는데, 그 경우 기능분리가 어렵다.

여기서 `Create`, `Edit`, `List` 각 기능을 분리하고 싶었고 View 컴포넌트는 오직 View의 역할만 하고 기능은 Container에서 따로 관리하고 싶었다.

-   PostContainer.tsx : 기능과 뷰를 연결해주는 **컨테이너 컴포넌트**
-   useEditAndCreatePost.tsx : 글 생성, 수정 API 콜과 기능을 담은 **커스텀 훅**
-   PostForm.tsx : 글 생성, 수정의 입력을 다루는 **뷰 컴포넌트**
-   PostList.tsx : 글 리스트를 보여주는 **뷰 컴포넌트**

코드를 보자.

```jsx
// PostContainer.tsx
// 컨테이너 역할의 컴포넌트에는 기능을 담당하는 코드들이 존재해요.
// 기능들이 여러 컴포넌트로 흩어지지 않게 한 곳에서 관리해요.

const postList = useSelector(state => state.post.postList);

const { 
  isOpenModal, // boolean
  initPost, // Post | null
  onOpenCreate,
  onSelectPost,
  onSubmit,
  onCloseModal,
} = useEditAndCreatePost();

return (
  <main>
    
    <button onClick={onOpenCreate}>새 글 쓰기</button>
    
    <PostList
      list={postList}
      onSelectPost={onSelectPost}
    />
    
    <Modal
      isOpen={isOpenModal}
      onClose={onCloseModal}
      children={
        <PostForm
          initPost={initPost}
          onSubmit={editPost}
          onClose={toggleEdit.close}
        />
      }
    />
  </main>
)
```

```jsx
// useEditAndCreatePost.ts
const toggleEdit = useToggle();
const selectedPost = useObject<Post>();

const onSubmit = (values: Post) => {
  // selectedPost가 있으면 PUT, 없으면 POST를 날린다.
}

const onCloseModal = useCallback(() => {
  toggleEdit.close();
  selectedPost.clear();
}, []);

return {
  isOpenModal: toggleEdit.value || !!selectedPost.item,
  initPost: selectedPost.item, // Post | null
  onOpenCreate: toggleEdit.open,
  onSelectPost: selectedPost.select,
  onSubmit,
  onCloseModal,
}
```

```jsx
// PostForm.tsx (View)
// 뷰를 담당하는 컴포넌트에서는 input에 연결 된 controlled values state는 존재해도 된다.

interface Props {
  initPost?: Post || null; // null | undefined 의 경우 Create 모드.
  onSubmit: (values: Post) => void;
  onClose: () => void;
}

...

const isEditing = !init;
const [values, setValues] = useState({
  title: initPost.title || '',
  content: initPost.content || ''
});

const handleSubmit = useCallback((e) => {
  e.preventDefault();
  onSubmit(values as Post);
}, [values]);

return (
  <Modal.Container>
    <Modal.Header onClose={onClose}>{isEditing ? 'Edit' : 'Create'}</Modal.Header>
    <Modal.Content>
      <form onSubmit={handleSubmit}>
        ...
      </form>
    </Modal.Content>
    <Modal.Actions>
      ...
    </Modal.Actions>
  </Modal.Container>
)
```

```jsx
// PostList.tsx (View)
// 뷰를 담당하는 컴포넌트. 
// onSelectPost는 props로 받아서 필요한 곳에 연결만 해주면 된다.

interface Props {
  list: Post[];
  onSelectPost: (selected: Post) => void;
}

...

return (
  <ul>
    { list.map(item => (
      <PostListItem data={item} onClick={() => onSelectPost(item)} />
    )}
  </ul>
)
```

사실 첫번째 패턴으로도 위와 비슷하게 관심사에 따라 코드 분리를 할 수 있긴 했다. 하지만 한계가 있었다. Button(Trigger)과 Modal이 결합되어 있기 때문에, 드물지만 Modal 위에 Modal을 띄워야 하는 경우 무조건 2depth 이상 컴포넌트를 연결 해줘야 한다.

하지만 마지막 패턴으로 하게 되면, onOpenModal 이벤트만 버튼에 연결해주면 되기 때문에 Modal과 Button을 자유롭게 분리할 수 있다. 하나의 Container 컴포넌트에, 존재하는 모든 Modal들을 1차원적으로 깔아놓을 수 있어서 2depth 이상 넘어갈 필요도 없다.

이 패턴을 사용하면서 Container 컴포넌트의 길이가 길어질 수는 있지만 어떤 Modal들이 존재하는지 찾기가 쉽다고 느꼈다.
