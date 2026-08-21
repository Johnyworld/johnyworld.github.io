---
tags:
  - 문제해결
  - 블로그발행
Created: 2023-12-05
---
> 부제 : RHF - handleSubmit 은 더이상 onSubmit 콜백 에러를 잡지 않는다.
> 
> 이 글은 회사에 근무하고 있을 때 해결했던 일을 기록한 글입니다.

## 문제 마주하기

어느 날, 제출에 한 번 실패했던 폼 버튼의 로딩이 풀리지 않는 이슈를 겪었다. 그쪽 코드는 건드린 적이 없었고 원인을 찾다가 얼마 전 대대적으로 React Hook Form(RHF)을 최신 버전으로 업데이트 했다는 것이 생각났다. 에러 상황도 테스트 했어야 했는데 그러지 못했다.

### RHF 업데이트 내용

업데이트 노트를 찾아보았고, 문제의 원인을 발견하게 되었다. 문제는 [7.42.0](https://github.com/react-hook-form/react-hook-form/blob/master/CHANGELOG.md#7420---2023-01-13) 버전을 업데이트 하면서 발생하게 되었던 것이고 그 내용은 이러하다. 

- `handleSubmit no longer catch onSubmit callback error.`

보시다시피, **RHF에서 제공하는 handleSubmit 메서드는 더이상 전달된 onSubmit 콜백 함수의 에러를 잡아주지 않는다**는 내용이다. 

[공식 문서](https://react-hook-form.com/docs/useform/handlesubmit)에도 해당 내용이 추가되었다.

- `handleSubmit` function will not swallow errors that occurred inside your onSubmit callback, so we recommend you to try and catch inside async request and handle those errors gracefully for your customers.

### RHF 업데이트에 따른 원인 발생 살펴보기

로딩이 풀리지 않았던 원인을 보자.

```tsx
const { isSubmitting } = useForm<SomeFormType>();
...
<Button ... loading={isSubmitting} />
```

위 코드에서 보여지는 것 처럼 버튼의 로딩 상태는 useForm의 isSubmitting을 바라보고 있었다. RHF 업데이트 전에는 handleSubmit이 에러를 잡아줬기 때문에, 콜백 함수에서 요청 된 API가 실패한 경우 콜백 함수가 마무리 되어 isSubmitting이 false 로 바뀌게 된다.

업데이트 이후에는 더 이상 **handleSubmit이 에러를 잡아주지 않기 때문에** onSubmit 콜백 함수에서 에러를 잡지 않으면 함수는 멈추어버린다. 함수가 끝까지 실행되지 못하고 터졌기 때문에 isSubmitting이 false로 바뀌지 못했다. 그래서 버튼은 무한 로딩을 가지게 되었다.

앞으로는 아래처럼 onSubmit 콜백 함수에서 에러를 잡아 주어야 한다.

```tsx
const { handleSubmit } = useForm<SomeFormType>();
...
<form onSubmit={handleSubmit(async (formData) => {
	// onSubmit에서 에러를 잡아서 직접 처리한다.
	try {
		// API 요청
		await someMutation(formData);
	} catch {
		// 에러 처리
	}
})}
```

## Error Hiding 을 피하자.

여기서 배울 점이 있다. (중요)

RHF은 handleSubmit에서 왜 굳이 잘 잡아주던 에러를 잡지 않게 되었을까? 사실 에러는 무조건 잡는다고 좋은게 아니다. 에러를 잡고 아무것도 하지 않는 것 보다 **잘 던져 주는 것이 중요**하다. 에러는 사용자(또는 개발자)로부터 숨기는게 아니라 **적절한 에러를 잘 보여주어서** 문제를 빠르게 파악하고 대응할 수 있게 해야 한다. 에러는 그걸 전문적으로 잘 잡는 녀석에게 잘 던져주도록 하자.

에러를 잡고 숨기는 행위를 [Error Hiding 또는 Error Swallowing](https://en.wikipedia.org/wiki/Error_hiding)이라고 한다. 절대 해선 안되며 부득이 한 경우 반드시 주석을 남기도록 해야 한다.

### 추천 영상

관련하여 좋은 영상을 추천한다. 좀 오래 된 영상이지만, 유행을 타는 내용은 아니기 때문에 괜찮을 것 같다.

- [FEConf 2019 - ES6+ 비동기 프로그래밍과 실전 에러 핸들링 by 유인동님](https://www.youtube.com/watch?v=o9JnT4sneAQ&ab_channel=FEConfKorea)

## 참고 자료

- https://react-hook-form.com/docs/useform/handlesubmit
- https://github.com/react-hook-form/react-hook-form/blob/master/CHANGELOG.md#7420---2023-01-13