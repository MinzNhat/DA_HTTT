'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

export interface UserInfo {
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    CountryRegionName: string;
    JobTitle: string;
    PhoneNumber: string;
    email: string;
    isManager: boolean;
    name: string;
}

export interface PassDataContextInterface {
    passData: UserInfo,
    setPassData: (passData: UserInfo) => any
}

export const PassDataContext = createContext({} as PassDataContextInterface);

type Props = {
    children: ReactNode
};

export default function PassDataProvider({ children }: Props) {
    const [passData, setPassData] = useState<UserInfo>({
        AddressLine1: "",
        AddressLine2: "",
        City: "",
        CountryRegionName: "",
        JobTitle: "",
        PhoneNumber: "",
        email: "",
        isManager: false,
        name: "",
    });

    return (
        <PassDataContext.Provider
            value={{
                passData, setPassData,
            }}
        >
            {children}
        </PassDataContext.Provider>
    );
}

export function usePassDataContext() {
    return useContext(PassDataContext)
}  