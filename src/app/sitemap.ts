import { CV_FILE_PATH, DOMAIN_URL, WORK_DIR_PATH } from '@utils/constants';
import { MetadataRoute } from 'next';

// output: 'export' 에서 메타데이터 라우트는 정적임을 명시해야 합니다 (Next 16).
export const dynamic = 'force-static';
import { getSourceModifiedAt, getLatestSourceModifiedAt } from '@utils/getSourceModifiedAt';
import { getRoute } from '@utils/routes';
import { getPostList } from 'src/calls/getPostList';
import { getProjects } from 'src/calls/getProjects';
import { getToyProjects } from 'src/calls/getToyProjects';

// work 목록은 md 가 아니라 이 소스 파일들에 들어 있어서, 이 파일들의 수정 시각을 씁니다.
const WORK_SOURCE_FILES = ['src/calls/getProjects.ts', 'src/calls/getToyProjects.ts'];

// changeFrequency / priority 는 넣지 않습니다. 구글이 무시하는 값이고,
// 글마다 갱신 주기를 정확히 말할 수 없어 추측을 적어두면 잡음만 됩니다.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostList();
  const workSourceModifiedAt = getLatestSourceModifiedAt(WORK_SOURCE_FILES);

  // 홈은 글 목록이므로 가장 최근 글이 곧 마지막 변경 시점입니다.
  const latestPostModifiedAt = posts
    .map(post => post.modifiedAt)
    .sort()
    .at(-1);

  const routes = [
    { url: getRoute.root(), lastModified: latestPostModifiedAt },
    { url: getRoute.work(), lastModified: workSourceModifiedAt },
    { url: getRoute.cv(), lastModified: getSourceModifiedAt(CV_FILE_PATH) },
  ];

  // <loc> 은 URL 인코딩된 절대 URL 이어야 해서 getRoute 를 거칩니다.
  const postsMap = posts.map(post => ({
    url: getRoute.postWithFileName(post.title),
    lastModified: post.modifiedAt,
  }));

  const projectsMap = [...getProjects(), ...getToyProjects()].map(project => ({
    url: getRoute.workWithId(project.id),
    lastModified: getSourceModifiedAt(`${WORK_DIR_PATH}/${project.id}.md`) ?? workSourceModifiedAt,
  }));

  return [...routes, ...postsMap, ...projectsMap].map(({ url, lastModified }) => ({
    url: `${DOMAIN_URL}${url}`,
    ...(lastModified ? { lastModified } : {}),
  }));
}
