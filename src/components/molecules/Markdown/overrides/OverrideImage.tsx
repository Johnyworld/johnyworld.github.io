import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

/**
 * 본문 이미지는 대부분 첫 화면 밖에 있으므로 지연 로딩합니다.
 *
 * alt 가 없으면 스크린리더가 URL 을 읽어버리므로 빈 문자열을 채워 장식 이미지로
 * 취급하게 합니다. 의미 있는 설명은 마크다운 원문에 직접 써야 합니다.
 */
export const OverrideImage = ({ alt, ...props }: Props) => {
  return <img {...props} alt={alt ?? ''} loading="lazy" decoding="async" />;
};
