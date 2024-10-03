"use client";
import "./globals.css";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { FormattedMessage, IntlProvider } from 'react-intl';
import SidebarProvider from "@/providers/SidebarProvider";
import SearchProvider from "@/providers/SearchProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { UserAuthProvider } from "@/providers/AuthProvider";
import OpenAppProvider from "@/providers/OpenAppProvider";
import PassDataProvider from "@/providers/PassedData";

type LanguageMessages = {
    [key: string]: any;
}

export const CustomLoadingElement = () => {
    return (
        <div className="w-full h-screen flex flex-col gap-4 justify-center place-items-center dark:text-white bg-white dark:bg-[#3a3b3c]">
            <Image src="/logo.ico" alt="Your image" width={70} height={70} />
            <span className="text-xl dark:text-white"><FormattedMessage id="LoadingMessage" /></span>
        </div>
    );
};

export default function LayoutStructure({
    children,
}: {
    children: React.ReactNode;
}) {
    const languages: LanguageMessages = {
        vi: require('@/language/vi.json'),
        en: require('@/language/en.json')
    };

    const searchParams = useSearchParams();

    const locale = searchParams.get('locale') || 'vi';
    const defaultLocale = 'vi';
    const messages = languages[locale];

    return (
        <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
            <UserAuthProvider>
                <SearchProvider>
                    <ThemeProvider>
                        <SidebarProvider>
                            <OpenAppProvider>
                                <PassDataProvider>
                                    <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                                </PassDataProvider >
                            </OpenAppProvider>
                        </SidebarProvider>
                    </ThemeProvider>
                </SearchProvider>
            </UserAuthProvider>
        </IntlProvider>

    );
}
