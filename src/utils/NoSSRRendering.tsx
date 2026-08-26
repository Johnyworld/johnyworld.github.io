'use client';

import dynamic from 'next/dynamic';
// React 19 타입은 전역 JSX 네임스페이스를 제거했습니다 (React.JSX 로 이동).
import type { JSX } from 'react';

type Props = { children: JSX.Element };

const NoSSRRendering = ({ children }: Props) => {
  return children;
};

export default dynamic(() => Promise.resolve(NoSSRRendering), {
  ssr: false,
});
