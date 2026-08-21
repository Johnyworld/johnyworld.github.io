'use client';

import { useSearchParams } from 'next/navigation';
import { ALL_CATEGORIES_KEY } from '@utils/constants';
import { Post } from 'type';
import { HomeContent } from './HomeContent';

interface Props {
  posts: Post[];
}

// 정적 export 에서는 서버가 쿼리스트링을 알 수 없어 카테고리 필터를 클라이언트에서 처리합니다.
export const FilteredHomeContent = ({ posts }: Props) => {
  const currentCategory = useSearchParams().get('c') || ALL_CATEGORIES_KEY;
  return <HomeContent posts={posts} currentCategory={currentCategory} />;
};
