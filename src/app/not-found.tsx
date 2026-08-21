import { Main } from '@components/layouts/Main';
import PageContent from '@components/layouts/PageContent';
import { NotFound } from '@components/organisms/NotFound';

// 정적 export 시 out/404.html 로 생성되고, GitHub Pages 가 없는 경로에 이 파일을 서빙합니다.
export default function NotFoundPage() {
  return (
    <Main>
      <PageContent>
        <NotFound />
      </PageContent>
    </Main>
  );
}
