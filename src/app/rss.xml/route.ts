import { DOMAIN_URL, POSTS_DIR_PATH } from '@utils/constants';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '@constants/site';
import { getDescriptionFromMarkdown } from '@utils/post';
import { getRoute } from '@utils/routes';
import { readDataFile } from '@utils/readDataFile';
import { getPostList } from 'src/calls/getPostList';

// output: 'export' 에서 라우트 핸들러는 정적임을 명시해야 합니다 (Next 16).
export const dynamic = 'force-static';

const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getPostDescription = (title: string) => {
  try {
    return getDescriptionFromMarkdown(
      readDataFile(`${POSTS_DIR_PATH}/${title}.md`).replace(/^---([\s\S]*?)---/, ''),
    );
  } catch {
    return SITE_DESCRIPTION;
  }
};

export async function GET() {
  const posts = getPostList();
  const feedUrl = `${DOMAIN_URL}/rss.xml`;

  const items = posts
    .map(post => {
      const url = `${DOMAIN_URL}${getRoute.postWithFileName(post.title)}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        // guid 는 스레드 식별자라 URL 이 바뀌어도 유지되도록 permalink 로 둡니다.
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(getPostDescription(post.title))}</description>`,
        post.createdAt
          ? `      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>`
          : undefined,
        ...post.tags.map(tag => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const lastBuildDate = posts
    .map(post => post.modifiedAt)
    .sort()
    .at(-1);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${DOMAIN_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <managingEditor>${escapeXml(SITE_AUTHOR)}</managingEditor>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${lastBuildDate ? `    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
