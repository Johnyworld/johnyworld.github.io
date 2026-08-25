const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // GitHub Pages 는 정적 파일만 서빙하므로 out/ 으로 정적 export 합니다.
  // dev 에서는 켜지 않습니다. next dev 가 요청 경로(URL 인코딩된 상태)를
  // generateStaticParams 의 디코딩된 값과 그대로 비교해, 한글 제목 글이 500 이 됩니다.
  // 정적 export 제약은 CI 의 next build 가 잡아줍니다.
  ...(isProduction ? { output: 'export' } : {}),
  // trailingSlash 는 켜지 않습니다. utterances 가 댓글 스레드를 location.pathname 으로
  // 찾는데 후행 슬래시를 지우지 않아서, 켜면 기존 댓글 스레드와 키가 어긋납니다.
  // GitHub Pages 가 /post/foo 요청에 post/foo.html 을 서빙해주므로 이대로 동작합니다.
  // 이미지 최적화 서버가 없으므로 비활성화합니다.
  images: { unoptimized: true },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/style')],
  },
  webpack: config => {
    const oneOf = config.module.rules.find(rule => typeof rule.oneOf === 'object');

    if (oneOf) {
      // Find the module which targets *.scss|*.sass files
      const moduleSassRule = oneOf.oneOf.find(rule =>
        regexEqual(rule.test, /\.module\.(scss|sass)$/),
      );

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
