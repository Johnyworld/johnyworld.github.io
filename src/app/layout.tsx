import Analytics from '@containers/Analytics';
import { GoToTop } from '@containers/GoToTop';
import { Footer } from '@containers/Footer';
import { Header } from '@containers/Header';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { DOMAIN_URL } from '@utils/constants';
import {
  DEFAULT_OG_IMAGE,
  getAlternates,
  OG_IMAGE_SIZE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
} from '@constants/site';

import '@style/index.scss';
import '@style/main.css';

// head 에 태그를 직접 쓰면 Next 가 metadata 로 만든 태그와 중복돼서,
// 글 페이지마다 title/og:title 이 두 벌씩 나가고 뒤엣것이 이깁니다.
// 검색/공유용 태그는 전부 이 metadata 객체로만 관리합니다.
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  // 카테고리 필터가 /?c=공부 같은 쿼리 URL 을 만드는데, 정적 export 라
  // 그 URL 들이 홈과 완전히 같은 HTML 을 돌려줍니다. canonical 로 홈에 모아줍니다.
  alternates: getAlternates('/'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ ...OG_IMAGE_SIZE, url: DEFAULT_OG_IMAGE, alt: SITE_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    other: {
      // naver 검색엔진 확인
      'naver-site-verification': 'ebb0335cc1fb0aeadb38243f2293b50556fc0319',
    },
  },
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

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
