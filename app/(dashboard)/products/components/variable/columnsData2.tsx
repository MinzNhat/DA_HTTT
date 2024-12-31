import { SpecialOfferInfo } from "@/api_lib/SpecialOffer";
import { IntlShape } from "react-intl";
import { Column } from "react-table";

export const createColumnsData = (intl: IntlShape): Column<SpecialOfferInfo>[] => [
    {
        Header: intl.formatMessage({ id: "SpcOffer.Description" }),
        accessor: "Description",
    },
    {
        Header: intl.formatMessage({ id: "SpcOffer.StartDate" }),
        accessor: "StartDate",
    },
    {
        Header: intl.formatMessage({ id: "SpcOffer.EndDate" }),
        accessor: "EndDate",
    },
    {
        Header: intl.formatMessage({ id: "SpcOffer.DiscountPct" }),
        accessor: "DiscountPct",
    },
];
