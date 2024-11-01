'use client';
import { createContext, ReactNode, useEffect, useState, useContext } from 'react';

export interface ThemeContextInterface {
    theme: 'light' | 'dark',
    setTheme: (theme: 'light' | 'dark') => any
}

export const ThemeContext = createContext({} as ThemeContextInterface);


type Props = {
    children: ReactNode
};

export default function ThemeProvider({ children }: Props) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    const rawSetTheme = (rawTheme: string) => {
        const root = window.document.documentElement;
        const isDark = rawTheme === 'dark';

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(rawTheme);

        localStorage.setItem('color-theme', rawTheme);
    };

    useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme, setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeContext = () => useContext(ThemeContext)