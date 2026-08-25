import { DOMAIN_URL } from '@utils/constants';
import { MetadataRoute } from 'next';

// output: 'export' 에서 메타데이터 라우트는 정적임을 명시해야 합니다 (Next 16).
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DOMAIN_URL}/sitemap.xml`,
  };
}
