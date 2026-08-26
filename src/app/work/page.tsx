import { Main } from '@components/layouts/Main';
import PageContent from '@components/layouts/PageContent';
import { WorkList } from '@components/organisms/WorkList';
import { Metadata } from 'next';
import { SITE_NAME } from '@constants/site';
import { getRoute } from '@utils/routes';
import { getProjects } from 'src/calls/getProjects';
import { getToyProjects } from 'src/calls/getToyProjects';

export default function Page() {
  const projects = getProjects();
  const toyProjects = getToyProjects();

  return (
    <Main>
      {/* 섹션 제목(h2)만 있는 화면이라, 문서 제목은 스크린리더/크롤러용으로 넣습니다. */}
      <h1 className="sr-only">Work</h1>

      <PageContent>
        <WorkList title="Projects" works={projects} />
      </PageContent>

      <PageContent style={{ marginTop: 80 }}>
        <WorkList title="Toy projects" works={toyProjects} />
      </PageContent>
    </Main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Work';
  const description = '프론트엔드 개발자 조니가 만들어 온 프로젝트와 토이 프로젝트 목록입니다.';
  const url = getRoute.work();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
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
