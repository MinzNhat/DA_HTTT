'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';


export interface SearchContextInterface {
    search: string,
    setSearch: (state: string) => any
}

export const SearchContext = createContext({} as SearchContextInterface);


type Props = {
    children: ReactNode
};

export default function SettingProvider({ children }: Props) {
    const [search, setSearch] = useState<string>("");
    return (
        <SearchContext.Provider
            value={{
                search, setSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearchContext() {
    return useContext(SearchContext)
}  