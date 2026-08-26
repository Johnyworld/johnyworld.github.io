interface Props {
  data: object | object[];
}

/**
 * 구조화 데이터(JSON-LD)를 심습니다.
 *
 * 본문에 "</script>" 같은 문자열이 들어가면 스크립트가 조기에 닫히므로
 * "<" 를 유니코드 이스케이프로 바꿔서 넣습니다.
 */
export const JsonLd = ({ data }: Props) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
};
