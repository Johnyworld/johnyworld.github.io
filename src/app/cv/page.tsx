import PageContent from '@components/layouts/PageContent';
import Markdown from '@components/molecules/Markdown';
import { CV_FILE_PATH } from '@utils/constants';
import { readDataFile } from '@utils/readDataFile';
import { Main } from '@components/layouts/Main';
import { Metadata } from 'next';
import { SITE_AUTHOR, SITE_NAME } from '@constants/site';
import { getRoute } from '@utils/routes';

export default function Page() {
  const markdownContent = readDataFile(CV_FILE_PATH);

  return (
    <Main>
      <PageContent>
        <Markdown className="cv">{markdownContent}</Markdown>
      </PageContent>
    </Main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Curriculum Vitae';
  const description = `프론트엔드 개발자 조니(${SITE_AUTHOR})의 이력과 경력을 정리한 페이지입니다.`;
  const url = getRoute.cv();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'profile',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
