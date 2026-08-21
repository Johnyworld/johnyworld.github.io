---
tags:
  - 팁
  - SEO
  - 블로그발행
Created: 2025-07-04
---
```tsx
// eachOptionSchema에 invalid한 값들을 z.array 에서 제거하는 preprocess 로직. 즉, 입력하지 않은 값들을 제거합니다.
const eachOptionSchema = z.string().trim().min(1, { message: '투표 항목의 내용을 입력해주세요.' });
z.preprocess(
 (arr) => (arr as string[]).filter((item) => eachOptionSchema.safeParse(item).success),
  z.array(eachOptionSchema.max(50, { message: '투표 항목은 50자 이내로 작성해주세요.' })).min(2, { message: '투표를 저장하려면 최소 2개의 선택지가 필요해요.' }),
)
```