'use client';

import { Theme } from 'type';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// cookies-next 6 은 client/server 엔트리가 나뉩니다. 이 스토어는 'use client' 이므로
// client 엔트리를 써야 동기 반환 타입이 나옵니다 (루트 엔트리는 union 타입).
import { setCookie, getCookie } from 'cookies-next/client';

interface ThemeState {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

const getDefaultTheme = (): Theme => {
  if (typeof window === 'undefined') {
    // 서버 렌더링 중일 때
    return 'light';
  }
  const themeCookie = getCookie('johnylog_theme');
  if (themeCookie && isTheme(themeCookie)) {
    return themeCookie;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const isTheme = (str: string): str is Theme => {
  return ['dark', 'light'].includes(str);
};

export const useThemeStore = create<ThemeState>()(
  devtools(set => ({
    theme: getDefaultTheme(),
    changeTheme: newTheme => {
      document.documentElement.setAttribute('data-theme', newTheme);
      setCookie('johnylog_theme', newTheme);
      set(() => ({ theme: newTheme }));
    },
  })),
);
