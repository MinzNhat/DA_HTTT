'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';


export interface SettingContextInterface {
    openSetting: boolean,
    setOpenSetting: (state: boolean) => any
}

export const SettingContext = createContext({} as SettingContextInterface);


type Props = {
    children: ReactNode
};

export default function SettingProvider({ children }: Props) {
    const [openSetting, setOpenSetting] = useState<boolean>(false);
    return (
        <SettingContext.Provider
            value={{
                openSetting, setOpenSetting,
            }}
        >
            {children}
        </SettingContext.Provider>
    );
}

export function useSettingContext() {
    return useContext(SettingContext)
}  