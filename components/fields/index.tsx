'use client'
import { useState, useEffect, FC } from "react";
import { HTMLInputTypeAttribute } from "react";
import { FiEye, FiEyeOff, FiCalendar } from "react-icons/fi";
import RenderCase from "../rendercase";
import { customStyles } from "./styles/styles";
import { useThemeContext } from "@/providers/ThemeProvider";
import Select from "react-select";
import { FormattedMessage } from "react-intl";
import Switch from "../switch";

type OptionType = {
  value: string;
  label: string;
};

type Props = {
  value?: any;
  setValue?: any;
  options?: string[];
  label?: string;
  id?: string;
  extra?: any;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: boolean;
  state?: "error" | "success" | string;
  disabled?: boolean;
  className?: string;
};

const InputField: FC<Props> = ({
  value,
  setValue,
  label,
  id,
  extra,
  type,
  placeholder,
  variant,
  state,
  disabled,
  className,
  options,
}) => {
  const { theme } = useThemeContext();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const triggerDatePicker = (id: string) => {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement.showPicker();
    }
  };

  const selectOptions = options?.map((option) => ({
    value: option,
    label: option,
  }));

  const selectedOption = selectOptions?.find((opt) => opt.value === value);

  const handleSelectChange = (selectedOption: OptionType | null) => {
    setValue(selectedOption?.value);
  };

  return (
    <>
      <RenderCase renderIf={type == "select"}>
        <Select
          id={id}
          instanceId={id}
          isSearchable={false}
          className={`flex items-center h-10 text-navy-800 dark:bg-[#3a3b3c] dark:text-white w-full rounded-xl bg-white`}
          styles={customStyles(theme)}
          menuPlacement="top"
          placeholder={placeholder}
          value={selectedOption}
          onChange={handleSelectChange}
          options={selectOptions}
          formatOptionLabel={(option: OptionType) => (
            <div className="flex items-center space-x-2 truncate">
              <span className="ml-2 text-sm font-medium">
                <FormattedMessage id={option.label} /> ({option.label})
              </span>
            </div>
          )}
        />
      </RenderCase>

      <RenderCase renderIf={type !== "select"}>
        <div className={`${extra}`}>
          <RenderCase renderIf={!!label}>
            <label
              htmlFor={id}
              className={` text-blue-600 dark:text-white ${variant ? "ml-1.5 font-medium text-md" : "font-bold text-sm"
                }`}
            >
              {label}
            </label>
          </RenderCase>

          <div className={`relative w-full ${label ? "mt-1" : ""}`}>
            <RenderCase renderIf={type !== "checkbox"}>
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                onBlur={(e) => {
                  if (type === "date") setValue(e.target.value);
                }}
                disabled={disabled}
                type={type === "password" && showPassword ? "text" : type}
                id={id}
                placeholder={type === "date" ? "" : placeholder}
                className={`flex ${variant ? "h-10" : "h-12"
                  } w-full rounded-xl border ${className ? className : "bg-white/0"
                  } p-3 text-sm outline-none duration-300 ${disabled
                    ? "dark:border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
                    : state === "error"
                      ? "border-red-500 dark:!border-2 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
                      : state === "success"
                        ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
                        : "border-gray-200 dark:border-white/10 focus:border-blueSecondary dark:focus:border-blueSecondary dark:text-white "
                  } ${type === "date" ? "hide-calendar-icon" : ""}`}
              />
            </RenderCase>

            <RenderCase renderIf={type === "checkbox"}>
              <div className="flex justify-center w-full">
                <Switch checked={value} onChange={setValue} />
              </div>
            </RenderCase>

            <RenderCase renderIf={type == "password"}>
              <button
                onClick={togglePasswordVisibility}
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent focus:outline-none ${state == "error" ? "text-red-500 dark:!text-red-400" : "text-gray-500"}`}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </RenderCase>

            <RenderCase renderIf={type == "date"}>
              <>
                <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 dark:text-white">
                  {placeholder}
                </span>
                <FiCalendar
                  onClick={() => triggerDatePicker(id!)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-transparent focus:outline-none text-black dark:text-white"
                />
              </>
            </RenderCase>
          </div>
        </div>
      </RenderCase>
    </>
  );
};

export default InputField;
