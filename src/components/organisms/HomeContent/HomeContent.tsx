import PageContent from '@components/layouts/PageContent';
import Categories from '@components/organisms/Categories';
import PostCards from '@components/organisms/PostCards';
import { ALL_CATEGORIES_KEY } from '@utils/constants';
import { Post } from 'type';

interface Props {
  posts: Post[];
  currentCategory: string;
}

export const HomeContent = ({ posts, currentCategory }: Props) => {
  return (
    <>
      <PageContent style={{ marginBottom: 30 }}>
        <Categories posts={posts} currentCategory={currentCategory} />
      </PageContent>
      <PageContent>
        <PostCards
          posts={posts.filter(
            post => currentCategory === ALL_CATEGORIES_KEY || post.tags.includes(currentCategory),
          )}
        />
      </PageContent>
    </>
  );
};
