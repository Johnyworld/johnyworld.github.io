'use client';

import { HTMLAttributes, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDebounce } from '@utils/useDebounce';

interface Props extends HTMLAttributes<HTMLElement> {
  text: string;
}

export const CopyableContent = ({ text, children, ...restProps }: Props) => {
  const [copied, setCopied] = useState(false);

  useDebounce(copied, 2 * 1000, () => setCopied(false));

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => {
        setCopied(true);
      }}
    >
      <button
        {...restProps}
        className={classNames('copyable-content', 'relative', restProps.className)}
      >
        {children}

        {copied ? (
          <Positioner>
            <IconButton>
              <CheckIcon />
            </IconButton>
          </Positioner>
        ) : (
          <Positioner className="md:hidden [.copyable-content:hover_&]:block">
            <IconButton>
              <CopyIcon />
            </IconButton>
          </Positioner>
        )}
      </button>
    </CopyToClipboard>
  );
};

const Positioner = ({ className, children }: { className?: string; children: ReactNode }) => {
  return (
    <span
      className={classNames(
        'absolute',
        'pl-1 -translate-y-1',
        'md:pl-0 md:-translate-y-1/2 md:-left-8 md:w-8 md:h-7 md:top-1/2',
        className,
      )}
    >
      {children}
    </span>
  );
};

const CheckIcon = () => {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9.6L6.28571 14L17 3" stroke="#76C47E" strokeWidth="2" />
    </svg>
  );
};

const IconButton = ({ children }: { children: ReactNode }) => {
  return (
    <span
      className={classNames('print:hidden rounded-sm clickable', 'md:w-7 md:h-7 md:flex-center')}
    >
      {children}
    </span>
  );
};

const CopyIcon = () => {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="2"
        y="4"
        width="12"
        height="12"
        strokeWidth="2"
        className="stroke-grayWeakest md:stroke-grayWeaker"
      />
      <path d="M5 1H17V13" strokeWidth="2" className="stroke-grayWeakest md:stroke-grayWeaker" />
    </svg>
  );
};
