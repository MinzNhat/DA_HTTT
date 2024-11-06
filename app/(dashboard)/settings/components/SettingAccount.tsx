import { FaUser } from "react-icons/fa";
import InputField from "@/components/fields";
import RenderCase from "@/components/rendercase";
import { UserInfo } from "@/providers/PassedData";
import { FormattedMessage, IntlShape } from "react-intl";

interface Props {
    theme: 'light' | 'dark';
    data: UserInfo;
    setData: React.Dispatch<React.SetStateAction<UserInfo>>;
    fields: Array<{
        id: keyof UserInfo,
        type: string,
        label: string,
        disable?: boolean,
        important?: boolean,
        onChange?: (id: keyof UserInfo,
            value: string) => void,
    }>
    handleChange: (id: keyof UserInfo, value: string | number) => void
    intl: IntlShape
}

const SettingAccount: React.FC<Props> = ({ data, setData, fields, handleChange, intl, theme }) => {
    return <>
        <div className="w-full flex justify-center place-items-center lg:pb-2">
            <RenderCase renderIf={theme === "dark"}>
                <img
                    src='/avatar.jpg'
                    alt="avatar"
                    width={19200}
                    height={10800}
                    className="h-40 w-40 object-cover rounded-full"
                />
            </RenderCase>
            <RenderCase renderIf={theme === "light"}>
                <div className="h-40 w-40 rounded-full bg-white flex justify-center place-items-center" >
                    <FaUser className="text-blue-700 h-20 w-20" />
                </div>
            </RenderCase>
        </div>
        {fields.map(({ id, type, label, disable, important, onChange }) => (
            <div key={id} className="flex gap-2 w-full flex-col lg:flex-row">
                <div className='lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center'>
                    <strong className="flex gap-1"><FormattedMessage id={label} />{important && <div className="text-red-500">*</div>}</strong>:
                </div>
                <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
                    <InputField
                        variant={true}
                        id={label}
                        disabled={disable}
                        type={type}
                        value={id != "isManager" ? data[id] as string : data[id] == true ? intl.formatMessage({ id: "Settings.Manager" }) : intl.formatMessage({ id: "Settings.Employee" })}
                        setValue={(value: string) => onChange ? onChange(id, value) : handleChange(id, value)}
                        className="bg-white dark:!bg-[#3a3b3c] w-full"
                        extra="w-full"
                    />
                </p>
            </div>
        ))
        }
    </>
}

export default SettingAccount;