import { formatISODatePart } from '@utils/string';
import classNames from 'classnames';

interface Props {
  workStatus: WorkStatus;
  title: string;
  description?: string;
  thumbnail?: string;
  createdAt?: string;
}

export enum WorkStatus {
  Live = 'LIVE',
  Legacy = 'LEGACY',
}

export const WorkCardItem = ({ workStatus, title, description, thumbnail, createdAt }: Props) => {
  return (
    <div className="work-card-item space-y-1.5">
      <div className="relative flex">
        <img className="w-full aspect-16/9 object-cover rounded-sm contrast-90" src={thumbnail} />
        <LiveTag workStatus={workStatus} />
      </div>
      <h3>{title}</h3>
      {createdAt && <p className="text-sm text-gray mt-0.5">{formatISODatePart(createdAt)}</p>}
      <p className="leading-140">{description}</p>
    </div>
  );
};

const LiveTag = ({ workStatus }: { workStatus: WorkStatus }) => {
  return (
    <div
      className={classNames(
        'absolute right-2 bottom-2 py-0.5 px-1 rounded-sm shadow-sm text-2xs sm:text-xs bg-grayDarkest',
        tagStatusVariants[workStatus],
      )}
    >
      {workStatus === WorkStatus.Live ? '운영중' : '중지됨'}
    </div>
  );
};

const tagStatusVariants = {
  [WorkStatus.Live]: 'text-green',
  [WorkStatus.Legacy]: 'text-grayLight',
};
