'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, FC } from 'react';
import Dropdown from '../dropdown';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

type Props = {
    message?: string
    animation?: string
    animation2?: string
    className?: string
}

const LanguageSwitcher: FC<Props> = ({ message, animation, animation2, className }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialLocale = searchParams.get('locale') || 'vi';
    const [locale, setLocale] = useState(initialLocale);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLanguageSwitch = (selectedLocale: string) => {
        if (locale !== selectedLocale && (typeof window !== 'undefined' && window.localStorage)) {
            setLocale(selectedLocale);
            localStorage.setItem('locale', selectedLocale);
        }
    };

    useEffect(() => {
        const newSearchParams = new URLSearchParams(Array.from(searchParams.entries()));
        newSearchParams.set('locale', locale);
        const newPath = `${pathname}?${newSearchParams.toString()}`;
        router.push(newPath);
    }, [locale, pathname, router, searchParams]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedLocale = localStorage?.getItem('locale');
            if (storedLocale && storedLocale !== locale) {
                setLocale(storedLocale);
            }
        }
    }, [locale]);

    return (
        <Dropdown
            animation="origin-top transition-all duration-300 ease-in-out"
            button={
                <button onClick={() => setDropdownOpen(true)} className="text-blue-600 dark:text-white uppercase h-5 w-5 
          rounded-md flex justify-center place-items-center font-bold text-xs pt-[1px]">
                    {locale}
                </button>
            }
            className={"py-2 top-8 -left-[54px]"}
        >
            <div className="flex min-w-32 w-32 !z-50 flex-col justify-start border dark:border-white/10 rounded-md bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-[#242526] dark:text-white dark:shadow-none">
                {/* Option 1: English */}
                <button
                    onClick={() => handleLanguageSwitch('en')}
                    className="text-sm font-medium text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-md py-1 px-3 flex justify-between place-items-center"
                >
                    English
                    {locale === 'en' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                </button>
                <div className="h-px w-full bg-gray-200 dark:bg-white/10 " />
                <button
                    onClick={() => handleLanguageSwitch('vi')}
                    className="text-sm font-medium text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-md py-1 px-3 flex justify-between place-items-center"
                >
                    Vietnamese
                    {locale === 'vi' ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
                </button>
            </div>
        </Dropdown>
    );
};

export default LanguageSwitcher;
