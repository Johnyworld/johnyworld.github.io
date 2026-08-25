import { HTMLAttributes } from 'react';
import classNames from 'classnames';

interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {}

export const GoToTopButton = ({ ...props }: Props) => {
  return (
    <div className="go-to-top-positioner fixed bottom-0 left-0 right-0 max-w-pageWidth p-pageMargin mx-auto">
      <button
        {...props}
        className={classNames(
          'go-to-top-button',
          'absolute bottom-4 right-4 sm:right-8 md:-right-8 w-10 h-10 flex-center bg-glass rounded-sm backdrop-blur-xs print:hidden',
          props.className,
        )}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 8L9 2L15 8" stroke="var(--color-letter)" strokeWidth="1" />
          <path d="M9 2V15.5" stroke="var(--color-letter)" strokeWidth="1" />
        </svg>
      </button>
    </div>
  );
};
