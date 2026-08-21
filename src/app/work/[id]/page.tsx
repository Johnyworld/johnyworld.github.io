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

interface Props {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return [...getProjects(), ...getToyProjects()]
    .filter(work => work.hasOwnPage)
    .map(work => ({ id: work.id }));
}

export default function Page({ params }: Props) {
  try {
    const id = decodeURI(params.id);
    const markdownContent = readDataFile(`${WORK_DIR_PATH}/${id}.md`);
    const projects = getProjects();
    const toyProjects = getToyProjects();
    const project = [...projects, ...toyProjects].find(work => work.id === id);

    return (
      <Main>
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = decodeURI(params.id);
  const projects = getProjects();
  const toyProjects = getToyProjects();
  const project = [...projects, ...toyProjects].find(work => work.id === id);

  return {
    title: project?.title ?? 'Johny Kim',
    openGraph: {
      title: id,
    },
  };
}
