'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

interface AppInfo {
    openApp: boolean,
    appName: string,
}

export interface OpenAppDataContextInterface {
    openApp: AppInfo,
    setOpenApp: (openApp: AppInfo) => any
}

export const OpenAppDataContext = createContext({} as OpenAppDataContextInterface);

type Props = {
    children: ReactNode
};

export default function OpenAppProvider({ children }: Props) {
    const [openApp, setOpenApp] = useState<AppInfo>({
        openApp: false,
        appName: ""
    });

    return (
        <OpenAppDataContext.Provider
            value={{
                openApp, setOpenApp,
            }}
        >
            {children}
        </OpenAppDataContext.Provider>
    );
}

export function useOpenAppDataContext() {
    return useContext(OpenAppDataContext)
}  