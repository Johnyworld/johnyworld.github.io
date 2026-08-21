---
Created: 2021-06-11
tags:
  - 팁
  - 블로그발행
---
django에 ServiceWorker를 등록하는 과정에서 `sw.js` 파일의 경로를 설정하는 부분에서 꽤나 애를 먹었다. `sw.js`파일은 `example.com/sw.js` 위치에 존재해야 하는데 django는 `example.com/static/sw.js` 로 정적 파일을 제공하기 때문에 경로가 맞지 않아 서비스 워커를 등록할 수가 없었다.

처음에는 프론트엔드 빌더로 사용중인 parcel 문제인줄 알고 프론트엔드쪽에서 여러 시도를 해보았지만 아무것도 해결되지 않았다.

다시 백엔드로 돌아와서 나에게 맞는 정답을 찾았다.

/template 폴더에 sw.js 파일을 넣어두고 `urls.py` 에서 sw.js 파일의 경로를 제공해주는 것이다. 코드는 아래와 같다.

```jsx
from django.views.generic import TemplateView
from django.views.decorators.cache import cache_control

url(r'^sw.js', cache_control(max_age=2592000)(TemplateView.as_view(
  template_name='sw.js',
  content_type='application/javascript',
)), name='sw.js'),
```

이렇게 세팅해준 다음, 빌드 후 자동으로 파일이 이동 될 수 있도록 `package.json`의 postbuild script에 아래 내용을 추가해주었다.

```jsx
"... && mv -f build/sw.js ../templates"
```

### 참고 글

-   [https://stackoverflow.com/questions/38696595/django-and-service-workers-serve-sw-js-at-applications-root-url](https://stackoverflow.com/questions/38696595/django-and-service-workers-serve-sw-js-at-applications-root-url)