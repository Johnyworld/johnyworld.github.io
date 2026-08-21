---
Created: 2021-02-08
tags:
  - 팁
  - 블로그발행
---
영어가 아닌 문자열을 검색해주는 방법인데, 영어가 아닌 문자는 한글만 사용하고 있기 때문에 `한글로 된 부분만 검색하기` 라는 제목을 사용했습니다.

`Cmd(Ctrl) + F` 또는 `Cmd + Shift + F` 를 눌러서 `[^\x00-\x7F]+` 키워드로 검색합니다.

검색할 때 반드시 아래처럼 `Use Reguler Expression` 아이콘을 켜둬야 합니다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F029f2fda-d8bc-4eda-9e85-da4b7c71ff44%2FScreen%20Shot%202021-02-08%20at%209.50.56%20AM.png)