/**
 * 공유 카드용 OG 이미지를 public/og/ 아래 PNG 로 만들어 둡니다.
 *
 *   node scripts/gen-og-images.mjs
 *
 * Next 의 opengraph-image 라우트 컨벤션을 쓰지 않는 이유:
 * 정적 export 에서 그 라우트는 확장자 없는 파일(out/opengraph-image)로 떨어지는데,
 * GitHub Pages 는 확장자로 Content-Type 을 정하므로 PNG 로 서빙되지 않습니다.
 * 그래서 .png 파일로 직접 떨어뜨리고 metadata 에서 경로로 참조합니다.
 */
import { ImageResponse } from 'next/og.js';
import { createElement as h } from 'react';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const OUT_DIR = 'public/og';
const POSTS_JSON = 'src/data/posts.json';
const FONT_PATH = 'assets/Pretendard-Bold.woff';
const SIZE = { width: 1200, height: 630 };

const SITE_NAME = 'JohnyKimBlog';
const SITE_TITLE = 'Johny Kim Blog';
const SITE_DESCRIPTION = '프론트엔드 개발자 조니의 블로그입니다.';

const COLORS = {
  background: '#16181d',
  accent: '#6aa9ff',
  title: '#ffffff',
  muted: '#9aa3af',
};

const font = await readFile(FONT_PATH);

const card = ({ eyebrow, title, footer }) =>
  h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: COLORS.background,
        padding: '72px 80px',
        fontFamily: 'Pretendard',
      },
    },
    h('div', { style: { display: 'flex', fontSize: 30, color: COLORS.accent } }, eyebrow),
    h(
      'div',
      {
        style: {
          display: 'flex',
          fontSize: title.length > 40 ? 62 : 76,
          lineHeight: 1.3,
          color: COLORS.title,
        },
      },
      title,
    ),
    h('div', { style: { display: 'flex', fontSize: 28, color: COLORS.muted } }, footer),
  );

const render = async element => {
  const response = new ImageResponse(element, {
    ...SIZE,
    fonts: [{ name: 'Pretendard', data: font, style: 'normal', weight: 700 }],
  });
  return Buffer.from(await response.arrayBuffer());
};

/** 이미 만들어 둔 이미지가 원본보다 새 것이면 건너뜁니다. */
const isUpToDate = async (target, sourceMtime) => {
  try {
    return (await stat(target)).mtimeMs > sourceMtime;
  } catch {
    return false;
  }
};

const writeImage = async (relativePath, element) => {
  const target = join(OUT_DIR, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, await render(element));
  return target;
};

const clamp = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

const main = async () => {
  const posts = JSON.parse(await readFile(POSTS_JSON, 'utf-8'));
  // 스크립트를 고치면 카드 디자인이 바뀌므로 스크립트 자신도 원본으로 봅니다.
  const sourceMtime = Math.max(
    (await stat(POSTS_JSON)).mtimeMs,
    (await stat('scripts/gen-og-images.mjs')).mtimeMs,
  );

  let written = 0;
  let skipped = 0;

  if (await isUpToDate(join(OUT_DIR, 'default.png'), sourceMtime)) {
    skipped += 1;
  } else {
    await writeImage(
      'default.png',
      card({ eyebrow: SITE_NAME, title: SITE_TITLE, footer: SITE_DESCRIPTION }),
    );
    written += 1;
  }

  for (const post of posts) {
    const relativePath = `post/${post.title}.png`;
    if (await isUpToDate(join(OUT_DIR, relativePath), sourceMtime)) {
      skipped += 1;
      continue;
    }
    await writeImage(
      relativePath,
      card({
        eyebrow: SITE_NAME,
        title: clamp(post.title, 60),
        footer: [post.createdAt, post.tags.join(', ')].filter(Boolean).join(' · '),
      }),
    );
    written += 1;
  }

  console.log(`OG 이미지: ${written} 개 생성, ${skipped} 개 건너뜀 -> ${OUT_DIR}/`);
};

await main();
