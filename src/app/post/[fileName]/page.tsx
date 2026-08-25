import PageContent from '@components/layouts/PageContent';
import Markdown from '@components/molecules/Markdown';
import { POSTS_DIR_PATH } from '@utils/constants';
import { readDataFile } from '@utils/readDataFile';
import { Main } from '@components/layouts/Main';
import { Divider } from '@components/atoms/Divider';
import { PostTitle } from '@components/organisms/PostTitle';
import { NotFound } from '@components/organisms/NotFound';
import { MarkdownTOC } from '@components/molecules/MarkdownTOC';
import { Metadata } from 'next';
import { PostComment } from '@containers/PostComment';
import { POST_PUBLISH_TAG } from '@constants/post';
import { getPostList } from 'src/calls/getPostList';

interface Props {
  params: Promise<{
    fileName: string;
  }>;
}

export function generateStaticParams() {
  return getPostList().map(post => ({ fileName: post.title }));
}

const regProperties = /^---([\s\S]*?)---/;
const regCreatedAt = /(?<=Created: ("|))([\d]{4}-[\d]{2}-[\d]{2})/;
const regTags = /(?<=- )([\s\S]*?)(?=\n)/g;

export default async function Page(props: Props) {
  const params = await props.params;
  try {
    const postTitle = decodeURIComponent(params.fileName);
    const markdown = readDataFile(`${POSTS_DIR_PATH}/${postTitle}.md`);
    const properties = getProperties(markdown);
    const markdownContent = removePropertiesFromPostMarkdown(markdown);

    return (
      <Main>
        <PageContent>
          <PostTitle
            title={postTitle}
            createdAt={properties?.createdAt ?? ''}
            tags={properties?.tags ?? []}
          />
        </PageContent>

        <Divider />

        <PageContent>
          <MarkdownTOC content={markdownContent} style={{ marginBottom: 60 }} />
          <Markdown>{markdownContent}</Markdown>
        </PageContent>

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

const getProperties = (fileContent: string) => {
  const propertiesPart = fileContent.match(regProperties)?.[0];
  const createdAt = propertiesPart?.match(regCreatedAt)?.[0];
  const tags = propertiesPart?.match(regTags) || [];
  if (!createdAt) {
    return null;
  }
  return {
    createdAt,
    tags: tags.filter(tag => tag !== POST_PUBLISH_TAG),
  };
};

const removePropertiesFromPostMarkdown = (markdown: string) => {
  return markdown.replace(regProperties, '');
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const postTitle = decodeURIComponent(params.fileName);

  return {
    title: postTitle,
    openGraph: {
      title: postTitle,
    },
  };
}
