import { WorkCardItem, WorkStatus } from '@components/molecules/WorkCardItem';
import Link from 'next/link';
import { Work } from 'type';
import { getRoute } from '@utils/routes';

interface Props {
  title?: string;
  works: Work[];
}

export const WorkList = ({ title, works }: Props) => {
  return (
    <div className="work-list">
      {title && <h2 className="mb-4">{title}</h2>}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {works.map(work => {
          const { href, hasOwnPage, ...workProps } = work;
          const hasHref = href !== undefined;
          const workStatus = hasHref ? WorkStatus.Live : WorkStatus.Legacy;
          if (hasOwnPage) {
            return (
              <Link key={work.id} href={`${getRoute.work()}/${work.id}`}>
                <WorkCardItem {...workProps} workStatus={workStatus} />
              </Link>
            );
          }
          if (href) {
            return (
              <Link key={work.id} href={href} target="_blank">
                <WorkCardItem {...workProps} workStatus={workStatus} />
              </Link>
            );
          }
          return <WorkCardItem key={work.id} {...workProps} workStatus={workStatus} />;
        })}
      </div>
    </div>
  );
};
