'use client';

import { useEffect, useRef } from 'react';
import { useThemeStore } from '@stores/theme';
import { GITHUB_REPO } from '@utils/constants';

const UTTERANCES_ORIGIN = 'https://utteranc.es';

export const PostComment = () => {
  const theme = useThemeStore(state => state.theme);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  /**
   * script 는 마운트 시 한 번만 심고, 절대 DOM 에서 떼어내지 않습니다.
   *
   * utterances 는 자기 script 의 부모에 iframe 을 꽂기 때문에, 로딩이 끝나기 전에
   * script 가 분리되면 NoModificationAllowedError 가 납니다. 이전 구현은 인라인 ref
   * 콜백이라 렌더마다 script 를 새로 만들며 직전 것을 떼어냈고, dev 의 Strict Mode
   * 이중 실행까지 겹쳐 매번 에러가 났습니다.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || wrapper.childElementCount > 0) {
      return;
    }

    const script = document.createElement('script');
    script.src = `${UTTERANCES_ORIGIN}/client.js`;
    script.async = true;
    script.setAttribute('repo', GITHUB_REPO);
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', `github-${themeRef.current}`);
    script.setAttribute('label', 'comments');
    script.crossOrigin = 'anonymous';
    wrapper.appendChild(script);
  }, []);

  /** 테마 변경은 재생성 대신 utterances 의 postMessage API 로 전달합니다. */
  useEffect(() => {
    const iframe = wrapperRef.current?.querySelector<HTMLIFrameElement>('.utterances-frame');
    iframe?.contentWindow?.postMessage(
      { type: 'set-theme', theme: `github-${theme}` },
      UTTERANCES_ORIGIN,
    );
  }, [theme]);

  return <div className="utterances_wrapper" ref={wrapperRef} />;
};
