import { DOMAIN_URL } from '@utils/constants';
import { MetadataRoute } from 'next';

// output: 'export' 에서 메타데이터 라우트는 정적임을 명시해야 합니다 (Next 16).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 클라이언트 라우팅용 RSC 페이로드(*.txt)가 out/ 에 함께 떨어집니다.
      // 사람이 볼 문서가 아니고 본문과 내용이 겹치므로 색인에서 뺍니다.
      disallow: '/*.txt$',
    },
    sitemap: `${DOMAIN_URL}/sitemap.xml`,
  };
}
