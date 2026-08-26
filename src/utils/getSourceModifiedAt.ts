import { execFileSync } from 'child_process';

/**
 * 파일이 마지막으로 바뀐 시각을 git 커밋 날짜로 구합니다.
 *
 * 파일시스템 mtime 을 쓰면 안 됩니다. git 은 mtime 을 보존하지 않아서,
 * CI 의 actions/checkout 이 모든 파일을 체크아웃 시각으로 만들어 버립니다.
 * 그러면 sitemap 의 lastmod 가 다시 "매 빌드 갱신"이 됩니다.
 *
 * git 히스토리를 못 읽으면 undefined 를 돌려줍니다. lastmod 를 빼는 편이
 * 틀린 날짜를 적어 크롤러를 오도하는 것보다 낫습니다.
 * (얕은 클론에서 동작하려면 CI 에 fetch-depth: 0 이 필요합니다.)
 */
const cache = new Map<string, Date | undefined>();

export const getSourceModifiedAt = (relativePath: string): Date | undefined => {
  const cached = cache.get(relativePath);
  if (cached !== undefined || cache.has(relativePath)) {
    return cached;
  }

  const result = readGitCommitDate(relativePath);
  cache.set(relativePath, result);
  return result;
};

const readGitCommitDate = (relativePath: string): Date | undefined => {
  if (isShallowRepository()) {
    return undefined;
  }
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return output ? new Date(output) : undefined;
  } catch {
    return undefined;
  }
};

let shallow: boolean | undefined;

const isShallowRepository = () => {
  if (shallow === undefined) {
    try {
      shallow =
        execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim() === 'true';
    } catch {
      shallow = true;
    }
  }
  return shallow;
};

/** 여러 원본 중 가장 최근 변경 시각. 하나도 못 읽으면 undefined 입니다. */
export const getLatestSourceModifiedAt = (relativePaths: string[]): Date | undefined => {
  const times = relativePaths
    .map(getSourceModifiedAt)
    .filter((date): date is Date => date !== undefined);
  return times.length ? new Date(Math.max(...times.map(date => date.getTime()))) : undefined;
};
