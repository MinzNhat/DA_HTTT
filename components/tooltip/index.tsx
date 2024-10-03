import { FC, ReactNode } from "react";
import { Tooltip } from "@chakra-ui/tooltip";

type Props = {
  extra?: string
  children?: ReactNode | string
  content?: ReactNode
  placement?: any
}

const TooltipHorizon: FC<Props> = ({ extra, children, content, placement }) => {
  return (
    <Tooltip
      placement={placement}
      label={content}
      className={`w-max rounded-md py-1.5 px-3 text-sm shadow-xl shadow-shadow-500 dark:shadow-none w-50 ${extra}`}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipHorizon;
