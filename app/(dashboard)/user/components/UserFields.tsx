import InputField from "@/components/fields";
import { FormattedMessage } from "react-intl";
import {
  CustomerInfo,
  CustomerStore,
  CustomerIndividual,
  UpdateUserInfo,
} from "@/api_lib/User";

type NestedCustomerInfoKey =
  | keyof CustomerInfo
  | `CustomerStore.${keyof CustomerStore}`
  | `CustomerIndividual.${keyof CustomerIndividual}`;

interface Props {
  data: CustomerInfo | UpdateUserInfo;
  fields: Array<{
    id: NestedCustomerInfoKey;
    type: string;
    label: string;
    disable?: boolean;
    important?: boolean;
    onChange?: (id: NestedCustomerInfoKey, value: string) => void;
  }>;
  handleChange: (id: NestedCustomerInfoKey, value: string | number) => void;
}

const getNestedFieldValue = (
  data: CustomerInfo,
  id: NestedCustomerInfoKey
): string => {
  const keys = id.split(".");
  if (keys.length === 1) {
    return data[keys[0] as keyof CustomerInfo]
      ? data[keys[0] as keyof CustomerInfo]!.toString()
      : "không có dữ liệu";
  } else if (keys.length === 2) {
    const [parentKey, childKey] = keys;
    if (parentKey === "CustomerStore" && data.CustomerStore) {
      return data.CustomerStore[childKey as keyof CustomerStore]
        ? data.CustomerStore[childKey as keyof CustomerStore]!.toString()
        : "không có dữ liệu";
    } else if (parentKey === "CustomerIndividual" && data.CustomerIndividual) {
      return data.CustomerIndividual[childKey as keyof CustomerIndividual]
        ? data.CustomerIndividual[
            childKey as keyof CustomerIndividual
          ]!.toString()
        : "không có dữ liệu";
    }
  }
  return "không có dữ liệu";
};

const UserFields: React.FC<Props> = ({ data, fields, handleChange }) => {
  return (
    <>
      {fields.map(({ id, type, label, disable, important, onChange }) => (
        <div
          key={id as string}
          className="flex gap-2 w-full flex-col lg:flex-row"
        >
          <div className="lg:w-44 lg:min-w-[11rem] flex lg:justify-between place-items-center">
            <strong className="flex gap-1">
              <FormattedMessage id={label} />
              {important && <div className="text-red-500">*</div>}
            </strong>
            :
          </div>
          <p className="whitespace-nowrap flex flex-row gap-2 relative w-full">
            <InputField
              variant={true}
              id={label}
              disabled={disable}
              type={type}
              value={getNestedFieldValue(data as CustomerInfo, id)}
              setValue={(value: string) =>
                onChange ? onChange(id, value) : handleChange(id, value)
              }
              className="bg-white dark:!bg-[#3a3b3c] w-full"
              extra="w-full"
            />
          </p>
        </div>
      ))}
    </>
  );
};

export default UserFields;
