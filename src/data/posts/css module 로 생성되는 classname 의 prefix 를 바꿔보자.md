---
tags:
  - 문제해결
  - 블로그발행
Created: 2023-10-27
---
Next (@^13) 에서 css module 을 사용하다보니, `.SomeComponent_someClassName__hash` 이런 이름으로 생성되는 클래스 이름이 마음에 들지 않았다.

이걸 개발 중에는 `.someClassName_hash` 이렇게 짧게 나오게 바꾸고, production 빌드에서는 난독화하여 보여주고자 했다. [이 글](https://dhanrajsp.me/snippets/customize-css-loader-options-in-nextjs)에 나오는 코드를 내 입맛대로 조금 고쳐서 썼다.

production 빌드에서는 base64 인코딩 후, 문자만 남기고 지워줬다. (+, =, 등 특수문자가 포함되거나 숫자로 시작하는 className은 스타일이 적용되지 않는다. 그리고 어차피 디코딩할 필요가 없으니 괜찮다.)

```ts
// next.config.js

const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/style')],
  },
  webpack: config => {
    console.log('rules', config.module.rules);
    const oneOf = config.module.rules.find(rule => typeof rule.oneOf === 'object');
    console.log('oneOf', oneOf);

    if (oneOf) {
      // Find the module which targets *.scss|*.sass files
      const moduleSassRule = oneOf.oneOf.find(rule => regexEqual(rule.test, /\.module\.(scss|sass)$/));

      if (moduleSassRule) {
        // Get the config object for css-loader plugin
        const cssLoader = moduleSassRule.use.find(({ loader }) => loader.includes('/css-loader/'));
        if (cssLoader) {
          cssLoader.options = {
            ...cssLoader.options,
            modules: cssLoaderOptions(cssLoader.options.modules),
          };
        }
      }
    }

    return config;
  },
};

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

// css-loader 플러그인 덮어쓰기
function cssLoaderOptions(modules) {
  const { getLocalIdent, ...others } = modules;
  return {
    getLocalIdent: (context, _, exportName, options) => {
      const localIndent = getLocalIdent(context, _, exportName, options);
      const hash = localIndent.split('_').pop();
      const name = isProduction ? encodeBase64WithOnlyAlphabets(exportName) : exportName;
      const customIndent = name + '_' + hash;
      return customIndent;
    },
    ...others,
  };
}

const encodeBase64WithOnlyAlphabets = str => {
  const base64 = Buffer.from(str, 'utf8').toString('base64');
  return base64.replace(/\W/g, '');
};
```

### 결과

AS-IS

![](https://velog.velcdn.com/images/johnyworld/post/fc2364be-ad66-457b-9656-5e4eb1f76a44/image.png)

TO-BE

development

![](https://velog.velcdn.com/images/johnyworld/post/2a23cb1f-18b1-4938-97fd-9c136090e5e0/image.png)

production

![](https://velog.velcdn.com/images/johnyworld/post/cc2eafc8-8dd2-449a-a829-e0796db51890/image.png)


### 참고 자료

- https://dhanrajsp.me/snippets/customize-css-loader-options-in-nextjs