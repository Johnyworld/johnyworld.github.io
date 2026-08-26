export const getRoute = {
  root: () => {
    return `/`;
  },
  rootCategoryQueryString: (category: string) => {
    return `/?c=${category}`;
  },
  post: () => {
    return `/post`;
  },
  postWithFileName: (fileName: string) => {
    return `/post/${fileName}`;
  },
  work: () => {
    return `/work`;
  },
  workWithId: (id: string) => {
    return `/work/${id}`;
  },
  cv: () => {
    return `/cv`;
  },
};
