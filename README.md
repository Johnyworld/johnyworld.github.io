# 프론트엔드 엔지니어 김재환의 테크 블로그 소스코드 저장소

https://johnyworld.github.io 로 구경 오세요.

## 배포 가이드

`main` 브랜치에 머지되면 GitHub Actions(`.github/workflows/deploy.yml`)가
정적 빌드(`next build` → `out/`)를 만들어 GitHub Pages 로 배포합니다.

### 글 발행

포스트는 빌드 시점에 레포에 커밋된 `src/data` 를 읽습니다.
따라서 Obsidian vault 에서 글을 뽑아 커밋해야 배포에 반영됩니다.

```bash
yarn gen-posts
git add src/data
git commit -m "data: Update posts"
git push
```

공유 카드용 OG 이미지(`public/og/`)는 `yarn build` 가 `src/data/posts.json` 을 보고
자동으로 만들기 때문에 커밋하지 않습니다. 카드 모양만 손볼 때는 `yarn gen-og` 로
따로 돌릴 수 있습니다. 한글을 그리려면 `assets/Pretendard-Bold.woff` 가 필요합니다.

### 최초 설정 (한 번만)

1. 레포 이름이 `johnyworld.github.io` 여야 `https://johnyworld.github.io` 루트로 서빙됩니다.
2. Settings → Pages → Source 를 **GitHub Actions** 로 변경.
3. Settings → Secrets and variables → Actions 에 `NEXT_PUBLIC_GTM` 추가.

### 제약

GitHub Pages 는 정적 파일만 서빙하므로 서버 런타임이 없습니다.

- 요청 시점 API(`cookies()`, 서버 컴포넌트의 `searchParams`) 사용 불가.
  테마는 `<head>` 인라인 스크립트로, 카테고리 필터는 클라이언트에서 처리합니다.
- 동적 라우트(`/post/[fileName]`, `/work/[id]`)는 `generateStaticParams` 로
  빌드 시점에 전부 생성됩니다. 새 경로는 재배포해야 생깁니다.
- 없는 경로는 `out/404.html`(`src/app/not-found.tsx`)이 서빙됩니다.

## 개발 가이드

### 린트

```bash
yarn lint      # eslint .
yarn lint:fix
```

설정은 `eslint.config.mjs` (ESLint 10 flat config)입니다.

`next build` 는 flat config 를 읽지 못해 빌드 시 린트를 건너뜁니다.
따라서 `yarn lint` 가 유일한 린트 경로이고, CI 는 빌드 앞에서 이를 실행합니다.

### 업그레이드 회귀 검사

의존성을 올릴 때 빌드 산출물이 바뀌었는지 비교합니다.
청크 해시와 buildId 는 정규화해서 제외하므로, 실제 렌더 결과만 봅니다.

```bash
yarn build && yarn snapshot          # 업그레이드 전: 기준선 저장
# ...의존성 업그레이드...
yarn build && yarn snapshot:check    # 달라지면 어느 페이지의 무엇이 바뀌었는지 출력하고 exit 1
```

페이지별로 텍스트 길이, 헤딩/문단/링크/이미지/표/코드블록/하이라이팅 토큰 수와
정규화된 마크업 해시를 비교합니다.

기준선(`scripts/.build-baseline.json`)은 콘텐츠가 바뀔 때마다 달라지므로 커밋하지
않습니다. 글을 발행한 뒤에는 `yarn snapshot` 으로 다시 떠야 합니다.
같은 이유로 CI 에는 넣지 않았습니다 - 업그레이드 작업용 도구입니다.

### 새로운 테마 추가하기

#### 용어 정리

- <테마>: dark, light 와 같은 넓은 단위
- <테마 분류>: colors, fonts 와 같은 각 테마 내 값들의 분류
- <테마 값>: primary, secondary 와 같은 각 테마의 값들

#### 관련 파일 리스트

- `src/style/theme.scss`
- `src/style/_variables.scss`
- `src/style/theme.{color}.module.ts`
- `src/style/theme.ts`
- `src/types/theme.d.ts`

#### <테마 값> 추가/수정하기

- `src/style/theme.scss` 에 <테마 값> 추가/수정.
- scss 변수로 사용하기 위해 `src/style/_variables.scss` 파일에 <테마 값> 변수 지정.
- `.tsx?` 파일에서도 사용하기 위해 `src/style/theme.{color}.module.scss` 에서 <테마 값> 내보내고, `src/style/theme.{color}.module.scss.d.ts` 에 타입 정의.

#### <테마 분류> 추가/수정하기

- `src/style/theme.scss` 에 <테마 분류> 추가/수정, 추가하는 경우 필요에 따라 `@each`문 돌리기.
- scss 변수로 사용하기 위해 `src/style/_variables.scss` 파일 수정.
- `src/style/theme.{새로운 테마 분류}.module.scss` 파일 생성하고 `src/style/theme.{color}.module.scss.d.ts` 에 타입 정의.
- `src/style/theme.ts` 파일도 추가/수정.

#### <테마> 추가하기

- 새로운 테마를 추가하려면 `src/style/theme.scss` 파일만 건드리면 됩니다.
- scss map 을 정의하고, `:root` 대신에 `[data-theme='dark'] { ... }` 요런식으로 해서 light-theme과 마찬가지로 `@each`문 돌려주면 됩니다.
