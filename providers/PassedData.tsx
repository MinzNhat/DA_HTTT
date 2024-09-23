'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

interface UserInfo {
    role: string,
    username: string,
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
        role: "",
        username: ""
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