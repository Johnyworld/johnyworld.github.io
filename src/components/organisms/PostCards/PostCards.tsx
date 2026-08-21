import { Post } from 'type';
import PostCardItem from '../../molecules/PostCardItem/PostCardItem';
import Link from 'next/link';
import { getRoute } from '@utils/routes';

interface Props {
  posts: Post[];
}

const PostCards = ({ posts }: Props) => {
  return (
    <ul className="post-cards space-y-1">
      {posts.map(post => {
        return (
          <li key={post.title}>
            <Link href={getRoute.postWithFileName(post.title)}>
              <PostCardItem post={post} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default PostCards;
