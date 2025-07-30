import { POST_PUBLISH_TAG } from '../constants/post';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

dotenv.config({ path: '.env.local' });

const regProperties = /(?<=^---\n)([\s\S]*?)(?=---)/;
const regCreatedAt = /(?<=Created: ("|))([\d]{4}-[\d]{2}-[\d]{2})/;
const regTags = /(?<=- )([\s\S]*?)(?=\n)/g;

const config = {
  vaultSrc: process.env.NEXT_PUBLIC_VAULT_SRC,
  publishTag: POST_PUBLISH_TAG,
  targetDir: 'src/data',
  prettier: {
    parser: 'json',
    tabWidth: 2,
  },
};

// 1. 전체 md 파일 path 가져오기
// 2. 각 md 파일을 차례대로 읽으며 publishTag가 있는 파일들만 따로 분류
// 3. 해당 파일들을 posts 경로로 복사
// 4. 해당 파일들의 리스트에 대한 json 파일 생성 title, content, path, createdAt, modifiedAt, tags

const main = async () => {
  if (!config.vaultSrc) {
    return;
  }
  const mdFilePaths = scanMdFiles(config.vaultSrc);
  const publishedMdFilePaths = scanPublishedPosts(mdFilePaths);
  copyPublishedPosts(publishedMdFilePaths, config.targetDir + '/posts');
  const postsProperties = getPostsProperties(publishedMdFilePaths);

  fs.writeFileSync(
    config.targetDir + '/posts.json',
    await prettier.format(JSON.stringify(postsProperties), config.prettier),
    'utf-8',
  );

  fs.cpSync(config.vaultSrc + '/area/resume', config.targetDir, { recursive: true });
};

const scanMdFiles = (rootPath: string) => {
  const stack: string[] = [];
  const result: string[] = [];
  const dfs = (dir: string) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        stack.push(file);
        dfs(filePath);
        stack.pop();
      } else {
        if (path.extname(filePath) === '.md') {
          result.push(filePath);
        }
      }
    });
  };
  dfs(rootPath);
  return result;
};

const scanPublishedPosts = (filePaths: string[]): string[] => {
  return filePaths.filter(scanPublishedPost);
};

const scanPublishedPost = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.startsWith('---')) {
    return false;
  }
  const propertiesPart = content.match(regProperties)?.[0];
  return propertiesPart?.includes(config.publishTag);
};

const copyPublishedPosts = (filePaths: string[], targetDir: string) => {
  fs.existsSync(targetDir) && fs.rmdirSync(targetDir, { recursive: true });
  fs.mkdirSync(targetDir);
  filePaths.forEach(filePath => {
    fs.copyFileSync(filePath, getTargetDirPathEachFile(targetDir, filePath));
  });
};

const getPostsProperties = (filePaths: string[]) => {
  return filePaths.map(getPostProperties).sort((a, b) => {
    if (a.createdAt === undefined) {
      return 1;
    }
    if (b.createdAt === undefined) {
      return -1;
    }
    return a.createdAt > b.createdAt ? -1 : 1;
  });
};

const getPostProperties = (filePath: string) => {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const propertiesPart = content.match(regProperties)?.[0];
  const createdAt = propertiesPart?.match(regCreatedAt)?.[0];
  const modifiedAt = fs.statSync(filePath).mtime.toISOString();
  const tags = propertiesPart?.match(regTags) || [];
  return {
    title: fileName.replace('.md', ''),
    path: getTargetDirPathEachFile(config.targetDir + '/posts', filePath),
    createdAt,
    modifiedAt,
    tags: tags.filter(tag => tag !== config.publishTag),
  };
};

const getTargetDirPathEachFile = (targetDir: string, filePath: string) => {
  return `${targetDir}/${path.basename(filePath)}`;
};

main();
