---
Created: 2021-07-16
tags:
  - 문제해결
  - 블로그발행
---
## 📛 문제 발견

Github 연결을 Password 방식으로 하고있다가, 더 이상 Password 방식을 지원하지 않는다고 들어서 SSH 연결로 바꾸게 되었다.

그렇게 크게 문제 없이 쓰고 있었는데, 어느 날 스타벅스에서 작업을 하다가 작업중인 branch 에서 동료가 작업한 내용을 `pull` 받았는데 기능이 적용이 되지 않았다.

터미널을 보니 아래와 같은 메시지가 떠 있었고 동료의 코드는 `pull` 되지 않은 상태였던 것이었다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F536b4096-7d6b-4f7f-aca1-050dd5ee16d4%2FScreen%20Shot%202021-07-16%20at%2011.05.21%20AM.png)

> ssh: connect to host github.com port 22: Operation timed out  
> fatal: Could not read from remote repository.
> 
> Please make sure you have the correct access rights

스타벅스 와이파이에서 포트 22(https) 가 방화벽에 막혀 있던 것이다.  
바로 검색을 해봤고 반갑게도 velog 글에서 해답을 찾았다.

## 🛠 문제 해결

```null
vi ~/.ssh/config
```

위 명령어로 ssh 설정 파일에 들어가서  
HostName 을 `github.com` 에서 `ssh.github.com` 으로 바꾸어주었고,  
Port 443 (http) 을 추가해주었다.

**최종 코드는 아래와 같다.**

```null
Host github.com-MYUSERNAME
  	HostName ssh.github.com
  	User MYUSERNAME
  	IdentityFile ~/.ssh/MYUSERNAME
  	Port 443
```

> #### MYUSERNAME 에 대해
> 
> `Host github.com` 옆에 `-MYUSERNAME` 이 붙은 이유는, 회사계정과 개인계정을 따로 쓰고있기 때문이다. 여러개의 계정을 쓰고 있지 않으면 `-MYUSERNAME` 을 붙일 필요가 없다. _(물론 `MYUSERNAME` 은 내가 쓰는 계정 이름을 넣는다.)_  
> `User MYUSERNAME` 은 내 깃헙 계정을 넣으면 되고 `IdentityFile` 은 ssh 인증 파일 이름으로 해주면 된다. 난 내 깃헙계정 이름을 똑같이 썼다.

### 참고한 글

-   [https://velog.io/@resident000/ssh-%EC%A0%91%EC%86%8D-%EC%8B%9C-port-22-blocked-%EB%AC%B8%EC%A0%9C](https://velog.io/@resident000/ssh-%EC%A0%91%EC%86%8D-%EC%8B%9C-port-22-blocked-%EB%AC%B8%EC%A0%9C)