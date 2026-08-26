'use client';

import MarkdownToJSX, { MarkdownToJSX as MarkdownToJSXType } from 'markdown-to-jsx';
import { OverrideAnchorByLink } from './overrides/OverrideAnchorByLink';
import { usePathname } from 'next/navigation';
import { CopyableContent } from '../CopyableContent';
import { OverridePre } from './overrides/OverridePre';
import { OverrideTable } from './overrides/OverrideTable';
import { OverrideIframe } from './overrides/OverrideIframe';
import { OverrideImage } from './overrides/OverrideImage';
import classNames from 'classnames';

interface Props {
  className?: string;
  children: string;
  options?: MarkdownToJSXType.Options;
}

const Markdown = ({ className, children, options }: Props) => {
  const pathname = usePathname();
  const basePath = typeof window !== 'undefined' ? window.location.origin + pathname : '';

  return (
    <MarkdownToJSX
      className={classNames('markdown', className)}
      options={{
        ...options,
        slugify: str => str.replace(/\s/g, '-'),
        overrides: {
          a: OverrideAnchorByLink,
          pre: OverridePre,
          table: OverrideTable,
          iframe: OverrideIframe,
          img: OverrideImage,
          h2: props => (
            <h2 {...props}>
              <CopyableContent text={basePath + `#${props.id}`}>{props.children}</CopyableContent>
            </h2>
          ),
          h3: props => (
            <h3 {...props}>
              <CopyableContent text={basePath + `#${props.id}`}>{props.children}</CopyableContent>
            </h3>
          ),
        },
      }}
    >
      {children}
    </MarkdownToJSX>
  );
};

export default Markdown;
