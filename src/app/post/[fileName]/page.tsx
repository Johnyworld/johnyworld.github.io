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
import { JsonLd } from '@components/atoms/JsonLd';
import { getBlogPostingJsonLd } from '@utils/jsonLd';
import { POST_PUBLISH_TAG } from '@constants/post';
import {
  getAlternates,
  OG_IMAGE_SIZE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  getPostOgImage,
} from '@constants/site';
import { getDescriptionFromMarkdown } from '@utils/post';
import { getRoute } from '@utils/routes';
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
    const markdown = readPostMarkdown(postTitle);
    const properties = getProperties(markdown);
    const markdownContent = removePropertiesFromPostMarkdown(markdown);

    return (
      <Main>
        <JsonLd
          data={getBlogPostingJsonLd({
            title: postTitle,
            description: getDescriptionFromMarkdown(markdownContent),
            path: getRoute.postWithFileName(postTitle),
            image: getPostOgImage(postTitle),
            createdAt: properties?.createdAt,
            modifiedAt: getPostList().find(post => post.title === postTitle)?.modifiedAt,
            tags: properties?.tags,
          })}
        />

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

const readPostMarkdown = (postTitle: string) => {
  return readDataFile(`${POSTS_DIR_PATH}/${postTitle}.md`);
};

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
  const url = getRoute.postWithFileName(postTitle);

  // 글마다 다른 요약이 없으면 41 개 글이 전부 같은 스니펫으로 노출되므로,
  // 본문에서 뽑아 씁니다. 파일을 못 읽으면 사이트 기본 설명으로 떨어집니다.
  const { description, createdAt } = readPostSummary(postTitle);
  const modifiedAt = getPostList().find(post => post.title === postTitle)?.modifiedAt;
  const ogImage = getPostOgImage(postTitle);

  return {
    title: postTitle,
    description,
    alternates: getAlternates(url),
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      title: postTitle,
      description,
      publishedTime: createdAt,
      modifiedTime: modifiedAt,
      authors: [SITE_AUTHOR],
      images: [{ ...OG_IMAGE_SIZE, url: ogImage, alt: postTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: postTitle,
      description,
      images: [ogImage],
    },
  };
}

const readPostSummary = (postTitle: string) => {
  try {
    const markdown = readPostMarkdown(postTitle);
    const createdAt = getProperties(markdown)?.createdAt;
    return {
      description: getDescriptionFromMarkdown(removePropertiesFromPostMarkdown(markdown)),
      createdAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    };
  } catch {
    return { description: SITE_DESCRIPTION, createdAt: undefined };
  }
};
