import PageContent from '@components/layouts/PageContent';
import Markdown from '@components/molecules/Markdown';
import { CV_FILE_PATH } from '@utils/constants';
import { readDataFile } from '@utils/readDataFile';
import { Main } from '@components/layouts/Main';
import { Metadata } from 'next';

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
  const title = 'Johny Kim: Curriculum Vitae';
  return {
    title,
    openGraph: {
      title,
    },
  };
}
