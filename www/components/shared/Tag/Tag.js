import styles from './tag.module.scss';

export default function Tag({
  children,
  className,
  color = 'primary',
  size = 'medium'
}) {
  const classNames = [
    styles.tag,
    styles[ color ],
    styles[ size ],
    className
  ].join(' ');

  return (
    <div className={classNames}>
      {children}
    </div>
  );
}
