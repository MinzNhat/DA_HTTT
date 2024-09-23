import { FC, type ReactNode } from 'react'

type Props = {
  className?: string
  children?: ReactNode
}

const Card: FC<Props> = ({ className, children }) => {
  return (
    <div className={`!z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-[#242526] dark:text-white dark:shadow-none ${className}`}>
      {children}
    </div>
  );
}

export default Card;
