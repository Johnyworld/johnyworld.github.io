'use client';

import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Theme } from 'type';
import NoSSRRendering from '@utils/NoSSRRendering';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  theme: Theme | null;
  onClick: () => void;
}

export const ThemeToggleButton = ({ theme, onClick, className, ...props }: Props) => {
  return (
    <NoSSRRendering>
      <div
        {...props}
        className={classNames('theme-toggle-button', 'rounded-sm clickable', className)}
      >
        <button onClick={onClick} className="py-0.5 px-1">
          {theme === 'light' ? '🌞' : '🌜'}
        </button>
      </div>
    </NoSSRRendering>
  );
};
