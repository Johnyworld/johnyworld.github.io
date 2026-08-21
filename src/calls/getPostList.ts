import { POST_LIST_FILE_PATH } from '@utils/constants';
import { readDataFile } from '@utils/readDataFile';
import { Post } from 'type';

export const getPostList = (): Post[] => {
  return JSON.parse(readDataFile(POST_LIST_FILE_PATH));
};
