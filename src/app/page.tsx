import { Main } from '@components/layouts/Main';
import { JsonLd } from '@components/atoms/JsonLd';
import { FilteredHomeContent, HomeContent } from '@components/organisms/HomeContent';
import { ALL_CATEGORIES_KEY } from '@utils/constants';
import { SITE_DESCRIPTION, SITE_TITLE } from '@constants/site';
import { getWebSiteJsonLd } from '@utils/jsonLd';
import { Suspense } from 'react';
import { getPostList } from 'src/calls/getPostList';

export default function Page() {
  const posts = getPostList();

  return (
    <Main>
      <JsonLd data={getWebSiteJsonLd()} />

      {/* 목록만 있는 화면이라 눈에 보이는 제목이 없습니다. 문서의 h1 은 있어야 하므로
          레이아웃을 건드리지 않고 스크린리더/크롤러용으로만 넣습니다. */}
      <h1 className="sr-only">{SITE_TITLE}</h1>
      <p className="sr-only">{SITE_DESCRIPTION}</p>

      {/* fallback 에 전체 글 목록을 그려두어, 정적 HTML 에도 목록이 담기게 합니다. */}
      <Suspense fallback={<HomeContent posts={posts} currentCategory={ALL_CATEGORIES_KEY} />}>
        <FilteredHomeContent posts={posts} />
      </Suspense>
    </Main>
  );
}
