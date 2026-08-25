import cx from 'classnames';

interface Props {
  title: string;
  selected: boolean;
}

export const NavigationMenuItem = ({ title, selected }: Props) => {
  return (
    <div
      className={cx('navigation-menu-item', 'sm:text-sm py-1.5 md:py-1 px-2 rounded-sm clickable', {
        'font-bold': selected,
      })}
    >
      {title}
    </div>
  );
};
