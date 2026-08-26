/**
 * 빌드 산출물의 구조 지문(fingerprint)을 만들어 out/ 를 비교 가능하게 만듭니다.
 *
 *   yarn build && yarn snapshot           # 현재 산출물을 기준선으로 저장
 *   ...의존성 업그레이드...
 *   yarn build && yarn snapshot --check   # 기준선과 비교, 다르면 exit 1
 *
 * 청크 해시와 buildId 는 빌드마다 달라지므로 정규화해서 제외합니다.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const OUT = 'out';
const BASELINE = 'scripts/.build-baseline.json';

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

/** 빌드마다 달라지는 값(청크 해시, buildId)을 지웁니다. */
const normalize = html =>
  html
    .replace(/\/_next\/static\/chunks\/[0-9a-z_-]+\.(css|js)/g, 'ASSET')
    .replace(/-[0-9a-f]{16}\.js/g, '-HASH.js')
    .replace(/\\?"(?:buildId|b)\\?":\\?"[A-Za-z0-9_-]{15,}\\?"/g, 'BUILD');

const count = (s, re) => (s.match(re) || []).length;

/** 페이지별 구조 지표. 렌더 결과가 바뀌면 여기가 흔들립니다. */
const fingerprint = html => {
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const text = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    hash: createHash('sha256').update(normalize(html)).digest('hex').slice(0, 16),
    textLength: text.length,
    h2: count(html, /<h2/g),
    h3: count(html, /<h3/g),
    p: count(html, /<p[ >]/g),
    li: count(html, /<li[ >]/g),
    a: count(html, /<a /g),
    img: count(html, /<img/g),
    table: count(html, /<table/g),
    pre: count(html, /<pre/g),
    code: count(html, /<code/g),
    codeTokens: count(html, /class="token/g),
    blockquote: count(html, /<blockquote/g),
  };
};

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 yarn build 를 실행하세요.`);
  process.exit(1);
}

const pages = {};
for (const file of walk(OUT)
  .filter(f => f.endsWith('.html'))
  .sort()) {
  pages[relative(OUT, file).split(sep).join('/')] = fingerprint(readFileSync(file, 'utf-8'));
}

const css = walk(OUT)
  .filter(f => f.endsWith('.css'))
  .sort()
  .map(f => readFileSync(f, 'utf-8'))
  .join('');

const snapshot = {
  pageCount: Object.keys(pages).length,
  cssBytes: css.length,
  cssHash: createHash('sha256').update(css).digest('hex').slice(0, 16),
  pages,
};

if (!process.argv.includes('--check')) {
  writeFileSync(BASELINE, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    `기준선 저장: ${BASELINE} (페이지 ${snapshot.pageCount}, CSS ${snapshot.cssBytes} bytes)`,
  );
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error(`기준선이 없습니다. 먼저 yarn snapshot 을 실행하세요.`);
  process.exit(1);
}

const base = JSON.parse(readFileSync(BASELINE, 'utf-8'));
const problems = [];

const added = Object.keys(pages).filter(p => !base.pages[p]);
const removed = Object.keys(base.pages).filter(p => !pages[p]);
if (added.length) problems.push(`추가된 페이지 ${added.length}개: ${added.slice(0, 5).join(', ')}`);
if (removed.length)
  problems.push(`사라진 페이지 ${removed.length}개: ${removed.slice(0, 5).join(', ')}`);

if (base.cssHash !== snapshot.cssHash) {
  const size =
    base.cssBytes === snapshot.cssBytes
      ? `크기는 ${snapshot.cssBytes} bytes 로 같지만 내용이 다릅니다`
      : `${base.cssBytes} -> ${snapshot.cssBytes} bytes`;
  problems.push(`CSS 변경: ${size}`);
}

for (const page of Object.keys(pages).filter(p => base.pages[p])) {
  const a = base.pages[page];
  const b = pages[page];
  const diff = Object.keys(a).filter(k => {
    if (k === 'textLength') return Math.abs(a[k] - b[k]) > 25;
    return a[k] !== b[k];
  });
  if (diff.length) {
    problems.push(`${page}: ${diff.map(k => `${k} ${a[k]} -> ${b[k]}`).join(', ')}`);
  }
}

if (problems.length === 0) {
  console.log(`구조 동일 (페이지 ${snapshot.pageCount}, CSS ${snapshot.cssBytes} bytes)`);
  process.exit(0);
}

console.error(`구조 차이 ${problems.length}건:`);
for (const p of problems.slice(0, 30)) console.error(`  - ${p}`);
if (problems.length > 30) console.error(`  ... 외 ${problems.length - 30}건`);
process.exit(1);
