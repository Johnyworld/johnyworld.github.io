import PageContent from '@components/layouts/PageContent';
import Markdown from '@components/molecules/Markdown';
import { WORK_DIR_PATH } from '@utils/constants';
import { readDataFile } from '@utils/readDataFile';
import { Main } from '@components/layouts/Main';
import { Divider } from '@components/atoms/Divider';
import { WorkTitle } from '@components/organisms/WorkTitle';
import { NotFound } from '@components/organisms/NotFound';
import { getProjects } from 'src/calls/getProjects';
import { getToyProjects } from 'src/calls/getToyProjects';
import { MarkdownTOC } from '@components/molecules/MarkdownTOC';
import { Metadata } from 'next';
import { PostComment } from '@containers/PostComment';
import {
  getAlternates,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_SIZE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@constants/site';
import { getDescriptionFromMarkdown } from '@utils/post';
import { getRoute } from '@utils/routes';
import { JsonLd } from '@components/atoms/JsonLd';
import { getWorkJsonLd } from '@utils/jsonLd';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return [...getProjects(), ...getToyProjects()]
    .filter(work => work.hasOwnPage)
    .map(work => ({ id: work.id }));
}

export default async function Page(props: Props) {
  const params = await props.params;
  try {
    const id = decodeURI(params.id);
    const markdownContent = readDataFile(`${WORK_DIR_PATH}/${id}.md`);
    const projects = getProjects();
    const toyProjects = getToyProjects();
    const project = [...projects, ...toyProjects].find(work => work.id === id);

    return (
      <Main>
        {project && (
          <JsonLd
            data={getWorkJsonLd({
              title: project.title,
              description: project.description || getDescriptionFromMarkdown(markdownContent),
              path: getRoute.workWithId(id),
              image: DEFAULT_OG_IMAGE,
              createdAt: project.createdAt,
            })}
          />
        )}

        <PageContent>
          {project ? <WorkTitle data={project} /> : <h1>데이터가 없어요</h1>}
        </PageContent>

        <Divider />

        {markdownContent ? (
          <PageContent>
            <MarkdownTOC content={markdownContent} style={{ marginBottom: 60 }} />
            <Markdown>{markdownContent}</Markdown>
          </PageContent>
        ) : (
          <PageContent>내용이 없습니다.</PageContent>
        )}

        <PageContent>
          <PostComment />
        </PageContent>
      </Main>
    );
  } catch {
    return (
      <Main>
        <PageContent>
          <NotFound />
        </PageContent>
      </Main>
    );
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = decodeURI(params.id);
  const projects = getProjects();
  const toyProjects = getToyProjects();
  const project = [...projects, ...toyProjects].find(work => work.id === id);

  const title = project?.title ?? 'Work';
  const url = getRoute.workWithId(id);
  // 프로젝트 소개는 한 줄뿐이라, 있으면 그걸 쓰고 없으면 본문에서 뽑습니다.
  const description = project?.description || readWorkDescription(id);

  return {
    title,
    description,
    alternates: getAlternates(url),
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ ...OG_IMAGE_SIZE, url: DEFAULT_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

const readWorkDescription = (id: string) => {
  try {
    return getDescriptionFromMarkdown(readDataFile(`${WORK_DIR_PATH}/${id}.md`));
  } catch {
    return SITE_DESCRIPTION;
  }
};
