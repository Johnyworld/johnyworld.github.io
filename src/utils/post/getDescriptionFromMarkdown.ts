const MAX_LENGTH = 155;
const MIN_USEFUL_LENGTH = 40;

/**
 * 마크다운 본문에서 검색 결과 스니펫으로 쓸 요약을 만듭니다.
 *
 * 글마다 별도의 description 이 없어서, 본문 앞부분을 평문으로 바꿔 사용합니다.
 * 코드 블록과 이미지는 설명으로서 의미가 없으므로 통째로 버립니다.
 */
export const getDescriptionFromMarkdown = (markdown: string, maxLength = MAX_LENGTH): string => {
  // 소제목("## CORS의 개념")보다 그 아래 본문이 요약으로 쓸모 있어서 먼저 제목을 빼고 시도하고,
  // 제목뿐인 글이라 건질 게 없으면 제목까지 포함해 다시 만듭니다.
  const withoutHeadings = toPlainText(markdown, { dropHeadings: true });
  const plainText =
    withoutHeadings.length >= MIN_USEFUL_LENGTH
      ? withoutHeadings
      : toPlainText(markdown, { dropHeadings: false });

  return clampToLength(plainText, maxLength);
};

const toPlainText = (markdown: string, { dropHeadings }: { dropHeadings: boolean }) =>
  markdown
    // 코드 블록 / 인라인 코드
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    // 이미지는 버리고, 링크는 텍스트만 남깁니다.
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // 남아있는 HTML 태그
    .replace(/<[^>]*>/g, ' ')
    // 제목
    .replace(/^\s{0,3}#{1,6}\s+(.*)$/gm, dropHeadings ? ' ' : '$1')
    // 인용 / 목록 / 수평선 마커
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^\s{0,3}(?:[-*_]\s?){3,}$/gm, ' ')
    // 강조 마커
    .replace(/(\*\*|__|\*|_|~~)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const clampToLength = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  const sliced = text.slice(0, maxLength);
  // 문장 끝에서 자를 수 있으면 거기서 끊고, 아니면 마지막 공백까지만 남깁니다.
  const sentenceEnd = sliced.lastIndexOf('. ');
  if (sentenceEnd > maxLength * 0.6) {
    return sliced.slice(0, sentenceEnd + 1);
  }

  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
};
