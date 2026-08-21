import { getCategoriesFromPosts } from '@utils/post';
import { Post } from 'type';
import { ALL_CATEGORIES_KEY } from '@utils/constants';
import { CategoryItem } from './Categoryitem';
import Link from 'next/link';
import { getRoute } from '@utils/routes';

interface Props {
  posts: Post[];
  currentCategory: string;
}

const Categories = ({ posts, currentCategory }: Props) => {
  const categories = getCategoriesFromPosts(posts);

  return (
    <div className="categories flex items-center flex-wrap gap-x-1 gap-y-2">
      <Link href={'/'}>
        <CategoryItem
          name="전체보기"
          count={posts.length}
          isSelected={currentCategory === ALL_CATEGORIES_KEY}
        />
      </Link>

      {Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => (
          <Link key={category} href={getRoute.rootCategoryQueryString(category)}>
            <CategoryItem name={category} count={count} isSelected={currentCategory === category} />
          </Link>
        ))}
    </div>
  );
};

export default Categories;
