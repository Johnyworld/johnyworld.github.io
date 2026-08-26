// 글 제목과 카테고리에 공백과 한글이 그대로 들어 있어서, 인코딩하지 않으면
// href 와 sitemap 의 <loc> 에 공백이 실린 잘못된 URL 이 나갑니다.
export const getRoute = {
  root: () => {
    return `/`;
  },
  rootCategoryQueryString: (category: string) => {
    return `/?c=${encodeURIComponent(category)}`;
  },
  post: () => {
    return `/post`;
  },
  postWithFileName: (fileName: string) => {
    return `/post/${encodeURIComponent(fileName)}`;
  },
  work: () => {
    return `/work`;
  },
  workWithId: (id: string) => {
    return `/work/${encodeURIComponent(id)}`;
  },
  cv: () => {
    return `/cv`;
  },
};
