import { DetailedHTMLProps, IframeHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<
  IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
> {}

export const OverrideIframe = (props: Props) => {
  return (
    <div className="markdown-iframe">
      <iframe {...props} />
    </div>
  );
};
