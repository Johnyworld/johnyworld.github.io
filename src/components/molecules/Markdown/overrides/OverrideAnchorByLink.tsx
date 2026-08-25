import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import Link from 'next/link';
import { removeExtension } from '@utils/stringUtils';
import { getRoute } from '@utils/routes';

export const OverrideAnchorByLink = (
  props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
) => {
  // 경로가 없다면 홈으로 보낸다.
  if (!props.href) {
    return <Link href="/">{props.children}</Link>;
  }

  // 스킴이 붙어 있으면(http, https, mailto, tel 등) 외부 경로로 보고 새창으로 띄워준다.
  if (/^[a-z][a-z0-9+.-]*:/i.test(props.href)) {
    return (
      <Link href={props.href} target="_blank">
        {props.children}
      </Link>
    );
  }

  // 앱 내 이동시.
  return (
    <Link href={removeExtension(getRoute.post() + '/' + props.href)} target={props.target}>
      {props.children}
    </Link>
  );
};
