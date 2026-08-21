---
tags:
  - 문제해결
  - 블로그발행
Created: 2023-10-26
---
이 글을 쓴 날짜 (2023년 10월 26일) 기준 Next JS 버전에 존재하는 이슈에 관한 이야기이다.

Next 는 각 route 마다 css 번들을 생성해주고 있다. 덕분에 같은 컴포넌트의 스타일이 중복되어버리는 이슈가 있다. 아래 현상을 보자. PageContent 라는 컴포넌트가 있고 `/`, `/cv`, `/work` 세개 라우트 내에서 해당 컴포넌트를 사용하고 있다.

그런데 아래 사진을 보자. `page.css` 번들이 각 route 마다 생성 되었다. 여기까지는 코드스플리팅이 되었다고 생각한다. 

![](https://velog.velcdn.com/images/johnyworld/post/af98a519-1391-43e4-ab16-dc632a2caf9b/image.png)

여기 아래의 그림을 보자. 여러개의(각 css 번들마다) 같은 클래스 네임이 정의 되어 있다. 으악. 지저분해보인다.

![](https://velog.velcdn.com/images/johnyworld/post/1dbd9713-900d-4d86-a9e6-5bf9b235beb9/image.png)

이렇게 보기 흉한 것은 애교에 불과하다. 같은 원인으로 인해, 스타일 순서가 잘못 불러와지는 이슈도 존재한다고 한다.

좀 오래 된 이슈인 것 같다. 아직 해결되지 않은 이슈라서 아쉽지만... 빨리 해결해주길 바라며 관련 링크들을 가져왔다. 

- [이 이슈를 해결했던 PR](https://github.com/vercel/next.js/pull/50406) : 근데 다시 재발한 듯 하다. 13버전 이후의 app 라우팅 관련인가..?
- [이슈 논의 - 2021. 5. 26.](https://github.com/vercel/next.js/issues/25456)
- [이슈 논의 - 2023. 6. 9.](https://github.com/vercel/next.js/issues/51030) : 가장 최근의 논의
