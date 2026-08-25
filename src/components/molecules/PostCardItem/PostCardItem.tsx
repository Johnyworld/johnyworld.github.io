import { Post } from 'type';
import { formatISODatePart } from '@utils/string';

interface Props {
  post: Post;
}

const PostCardItem = ({ post }: Props) => {
  return (
    <div className="post-card-item rounded-sm px-2.5 py-1.5 -mx-2.5 clickable">
      <h3 className="text-md whitespace-nowrap ellipsis">{post.title}</h3>
      <p className="text-sm text-gray mt-0.5">
        {post.createdAt && formatISODatePart(post.createdAt)}
        {post.createdAt && ' · '}
        {post.tags.join(', ')}
      </p>
    </div>
  );
};

export default PostCardItem;
