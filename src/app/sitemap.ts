import { DOMAIN_URL } from '@utils/constants';
import { MetadataRoute } from 'next';
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
