---
tags:
  - 팁
  - 블로그발행
Created: 2024-01-19
---
## 문제 마주하기

채팅 기능을 구현하는 중 유저가 브라우저 탭을 닫는다면 해당 유저를 채널에서 내보내고 채팅에서 로그아웃 하도록 구현해야 했다. 나는 아무 생각 없이 useEffect의 clean-up 함수 내에 그러한 로직을 담았다.

```tsx
useEffect(() => {
	return () => {
		channel.leave();
		client.logout();
	}
}, [...]);
```

하지만 B 유저가 탭을 닫았지만 A 유저의 로그에는 B 유저가 채널에 그대로 남아 있었다. 잠시 고민에 빠졌다. 왜 때문이지...?... 어찌보면 당연한 것 같은데, 탭을 닫으면 앱이 종료되는 것이지, 컴포넌트 Unmount 가 발생하는 것은 아니었다.

## 해결하기

특정 함수를 탭을 닫을때 호출하고자 한다면, Unmount 생명주기에서 호출할 것이 아니라, `beforeunload` 이벤트에서 호출해야한다. 이번에는 탭 종료시 이벤트에 주로 사용하는 beforeunload 이벤트를 사용해보았다.

```tsx
useEffect(() => {
	const leaveChannel = () => {
		channel.leave();
		client.logout();
	}
	window.addEventListener('beforeunload', leaveChannel);
	return () => {
		window.removeEventListener('beforeunload', leaveChannel);
	}
}, [...]);
```

이렇게 하니까 원하는 대로 잘 작동 하였다.