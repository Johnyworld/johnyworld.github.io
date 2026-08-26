import { DOMAIN_URL } from '@utils/constants';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@constants/site';
import { getRoute } from '@utils/routes';

const SCHEMA_CONTEXT = 'https://schema.org';

export const toAbsoluteUrl = (path: string) => `${DOMAIN_URL}${path}`;

const person = {
  '@type': 'Person',
  name: SITE_AUTHOR,
  alternateName: 'Johny Kim',
  url: DOMAIN_URL,
  jobTitle: '프론트엔드 개발자',
};

export const getWebSiteJsonLd = () => [
  {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_TITLE,
    url: DOMAIN_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    publisher: person,
  },
  {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Blog',
    name: SITE_TITLE,
    url: DOMAIN_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    author: person,
  },
];

interface BlogPostingParams {
  title: string;
  description: string;
  path: string;
  image: string;
  createdAt?: string;
  modifiedAt?: string;
  tags?: string[];
}

export const getBlogPostingJsonLd = ({
  title,
  description,
  path,
  image,
  createdAt,
  modifiedAt,
  tags,
}: BlogPostingParams) => [
  {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: toAbsoluteUrl(path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': toAbsoluteUrl(path) },
    image: toAbsoluteUrl(image),
    inLanguage: 'ko-KR',
    author: person,
    publisher: person,
    ...(createdAt ? { datePublished: createdAt } : {}),
    ...(modifiedAt ? { dateModified: modifiedAt } : {}),
    ...(tags?.length ? { keywords: tags.join(', ') } : {}),
  },
  getBreadcrumbJsonLd([
    { name: 'Blog', path: getRoute.root() },
    { name: title, path },
  ]),
];

export const getBreadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': SCHEMA_CONTEXT,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  })),
});

interface CreativeWorkParams {
  title: string;
  description: string;
  path: string;
  image: string;
  createdAt?: string;
}

export const getWorkJsonLd = ({
  title,
  description,
  path,
  image,
  createdAt,
}: CreativeWorkParams) => [
  {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CreativeWork',
    name: title,
    description,
    url: toAbsoluteUrl(path),
    image: toAbsoluteUrl(image),
    inLanguage: 'ko-KR',
    creator: person,
    ...(createdAt ? { dateCreated: createdAt } : {}),
  },
  getBreadcrumbJsonLd([
    { name: 'Work', path: getRoute.work() },
    { name: title, path },
  ]),
];
