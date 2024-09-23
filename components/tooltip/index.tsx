import { FC, ReactNode } from "react";
import { Tooltip } from "@chakra-ui/tooltip";

type Props = {
  extra?: string
  trigger?: ReactNode | string
  content?: string
  placement?: any
}

const TooltipHorizon: FC<Props> = ({ extra, trigger, content, placement }) => {
  return (
    <Tooltip
      placement={placement}
      label={content}
      className={`w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none ${extra}`}
    >
      {trigger}
    </Tooltip>
  );
};

export default TooltipHorizon;
