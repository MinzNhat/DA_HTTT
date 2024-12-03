import { FC } from "react";

type Props = {
  className?: string;
  color?: string;
  id?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

const Switch: FC<Props> = ({ className = "", color, id, checked, onChange }) => {
  const getColorClass = () => {
    switch (color) {
      case "red":
        return "checked:bg-red-500 dark:checked:bg-red-400";
      case "blue":
        return "checked:bg-blue-500 dark:checked:bg-blue-400";
      case "green":
        return "checked:bg-green-500 dark:checked:bg-green-400";
      case "yellow":
        return "checked:bg-yellow-500 dark:checked:bg-yellow-400";
      case "orange":
        return "checked:bg-orange-500 dark:checked:bg-orange-400";
      case "teal":
        return "checked:bg-teal-500 dark:checked:bg-teal-400";
      case "lime":
        return "checked:bg-lime-500 dark:checked:bg-lime-400";
      case "cyan":
        return "checked:bg-cyan-500 dark:checked:bg-cyan-400";
      case "pink":
        return "checked:bg-pink-500 dark:checked:bg-pink-400";
      case "purple":
        return "checked:bg-purple-500 dark:checked:bg-purple-400";
      case "amber":
        return "checked:bg-amber-500 dark:checked:bg-amber-400";
      case "indigo":
        return "checked:bg-indigo-500 dark:checked:bg-indigo-400";
      case "gray":
        return "checked:bg-gray-500 dark:checked:bg-gray-400";
      default:
        return "checked:bg-blue-500 dark:checked:bg-blue-500";
    }
  };

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`relative h-5 w-10 appearance-none rounded-[20px] bg-[#e0e5f2] outline-none transition duration-[0.5s]
        before:absolute before:top-[50%] before:h-4 before:w-4 before:translate-x-[2px] before:translate-y-[-50%] before:rounded-[20px]
        before:bg-white before:shadow-[0_2px_5px_rgba(0,_0,_0,_.2)] before:transition before:content-[""]
        checked:before:translate-x-[22px] hover:cursor-pointer
        dark:bg-white/5 ${getColorClass()} ${className}`}
      name="weekly"
    />
  );
};

export default Switch;