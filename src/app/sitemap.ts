import { DOMAIN_URL } from '@utils/constants';
import { MetadataRoute } from 'next';

// output: 'export' 에서 메타데이터 라우트는 정적임을 명시해야 합니다 (Next 16).
export const dynamic = 'force-static';
import { getPostList } from 'src/calls/getPostList';
import { getProjects } from 'src/calls/getProjects';
import { getToyProjects } from 'src/calls/getToyProjects';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostList();

  const routes = ['', '/work', '/cv'].map(route => ({
    url: `${DOMAIN_URL}${route}`,
    lastModified: new Date(),
  }));

  const postsMap = posts.map(post => ({
    url: `${DOMAIN_URL}/post/${post.title}`,
    lastModified: post.modifiedAt,
  }));

  const projects = getProjects();
  const toyProjects = getToyProjects();
  const projectsMap = [...projects, ...toyProjects].map(project => ({
    url: `${DOMAIN_URL}/work/${project.id}`,
    lastModified: new Date(),
  }));

  return [...routes, ...postsMap, ...projectsMap];
}
