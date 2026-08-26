import { Main } from '@components/layouts/Main';
import { JsonLd } from '@components/atoms/JsonLd';
import { FilteredHomeContent, HomeContent } from '@components/organisms/HomeContent';
import { ALL_CATEGORIES_KEY } from '@utils/constants';
import { getWebSiteJsonLd } from '@utils/jsonLd';
import { Suspense } from 'react';
import { getPostList } from 'src/calls/getPostList';

export default function Page() {
  const posts = getPostList();

  return (
    <Main>
      <JsonLd data={getWebSiteJsonLd()} />

      {/* fallback 에 전체 글 목록을 그려두어, 정적 HTML 에도 목록이 담기게 합니다. */}
      <Suspense fallback={<HomeContent posts={posts} currentCategory={ALL_CATEGORIES_KEY} />}>
        <FilteredHomeContent posts={posts} />
      </Suspense>
    </Main>
  );
}
