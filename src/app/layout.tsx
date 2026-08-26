import Analytics from '@containers/Analytics';
import { GoToTop } from '@containers/GoToTop';
import { Footer } from '@containers/Footer';
import { Header } from '@containers/Header';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { DOMAIN_URL } from '@utils/constants';

import '@style/index.scss';
import '@style/main.css';

const siteName = 'JohnyKimBlog';
const title = 'Johny Kim Blog';
const description = '프론트엔드 개발자 조니의 블로그입니다.';
const keywords =
  '프론트엔드, 개발자, 조니킴, 블로그, 김재환, frontend, developer, engineer, johny, johny kim, blog';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
};

// 정적 export 에서는 서버가 쿠키를 읽을 수 없으므로,
// 첫 페인트 전에 인라인 스크립트로 테마를 결정합니다.
const themeInitializerScript = `(function() {
  var matched = document.cookie.match(/(?:^|; )johnylog_theme=([^;]*)/);
  var saved = matched ? decodeURIComponent(matched[1]) : null;
  var theme =
    saved === 'dark' || saved === 'light'
      ? saved
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 아래 인라인 스크립트가 하이드레이션 전에 data-theme 를 붙입니다.
    // 정적 export 라 서버는 쿠키를 모르므로 이 속성 불일치는 의도된 것입니다.
    // suppressHydrationWarning 은 이 요소 한 단계에만 적용되어, 하위의 진짜
    // 불일치는 계속 보고됩니다.
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <title>Johny Kim</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* naver 검색엔진 확인 */}
        <meta name="naver-site-verification" content="ebb0335cc1fb0aeadb38243f2293b50556fc0319" />

        {/* Open Tags */}
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:keywords" content={keywords} />
        <meta property="og:site_name" content={siteName} />

        {/* Fonts */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitializerScript,
          }}
        />
      </head>
      <body>
        <Suspense>
          <Analytics />
        </Suspense>
        <Header />
        {children}
        <GoToTop />
        <Footer />
      </body>
    </html>
  );
}
