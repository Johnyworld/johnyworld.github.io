import { DOMAIN_URL } from '@utils/constants';

export const SITE_NAME = 'JohnyKimBlog';
export const SITE_TITLE = 'Johny Kim Blog | 프론트엔드 개발자 조니';
export const SITE_DESCRIPTION = '프론트엔드 개발자 조니의 블로그입니다.';
export const SITE_AUTHOR = '김재환';
export const SITE_KEYWORDS = [
  '프론트엔드',
  '개발자',
  '조니킴',
  '블로그',
  '김재환',
  'frontend',
  'developer',
  'engineer',
  'johny',
  'johny kim',
  'blog',
];

/** OG 이미지는 scripts/gen-og-images.mjs 가 빌드 전에 public/og/ 로 떨어뜨립니다. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const DEFAULT_OG_IMAGE = '/og/default.png';
export const getPostOgImage = (postTitle: string) =>
  `/og/post/${encodeURIComponent(postTitle)}.png`;

export const RSS_FEED_URL = `${DOMAIN_URL}/rss.xml`;

/**
 * canonical 과 RSS 자동 탐색 링크를 함께 만듭니다.
 *
 * 자식 라우트의 alternates 는 부모 것을 통째로 덮어쓰기 때문에,
 * 페이지마다 이 헬퍼를 거치지 않으면 피드 링크가 홈에서만 나옵니다.
 */
export const getAlternates = (canonical: string) => ({
  canonical,
  types: { 'application/rss+xml': RSS_FEED_URL },
});
