import InputField from "@/components/fields";
import { FormattedMessage, IntlShape } from "react-intl";
import { CreateSpecialOffer, SpecialOfferInfo } from "@/api_lib/SpecialOffer";

interface Props {
  data: SpecialOfferInfo | CreateSpecialOffer;
  fields: Array<{
    id: keyof SpecialOfferInfo | CreateSpecialOffer;
    type: string;
    label: string;
    disable?: boolean;
    important?: boolean;
    onChange?: (
      id: keyof SpecialOfferInfo | CreateSpecialOffer,
      value: string
    ) => void;
  }>;
  handleChange: (
    id: keyof SpecialOfferInfo | CreateSpecialOffer,
    value: string | number
  ) => void;
}

const SpecialOfferFields: React.FC<Props> = ({
  data,
  fields,
  handleChange,
}) => {
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
              value={data[id as keyof SpecialOfferInfo] as string}
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

export default SpecialOfferFields;
