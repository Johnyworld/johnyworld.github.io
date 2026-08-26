import Analytics from '@containers/Analytics';
import { GoToTop } from '@containers/GoToTop';
import { Footer } from '@containers/Footer';
import { Header } from '@containers/Header';
import { Suspense } from 'react';
import { Metadata, Viewport } from 'next';
import { Inconsolata } from 'next/font/google';
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

// 코드 폰트는 라틴 전용이라 가볍습니다. 셀프 호스팅하면 @font-face 가 자체
// 스타일시트에 들어가서, 렌더를 막는 외부 요청이 하나 사라집니다.
const inconsolata = Inconsolata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inconsolata',
});

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

// head 에 viewport 를 직접 쓰면 Next 기본 태그와 두 벌이 됩니다.
// 확대 차단(maximum-scale, user-scalable=no)은 접근성 감점 항목이라 함께 걷어냅니다.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
    <html
      lang="ko"
      className={inconsolata.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Pretendard 는 한글 전체를 담아 weight 당 750KB 라, unicode-range 로 쪼갠
            dynamic subset 을 씁니다. 페이지에 실제로 쓰인 글자 조각만 받아서
            글 한 편 기준 150~240KB 로 떨어집니다.
            preconnect 로 이 스타일시트의 DNS/TLS 를 미리 끊어둡니다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css"
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
