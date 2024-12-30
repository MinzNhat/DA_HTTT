'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, FC } from 'react';
import Dropdown from '../dropdown';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

type Props = {
    version?: '1' | '2';
};

const LanguageSwitcher: FC<Props> = ({ version = '1' }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialLocale = searchParams.get('locale');
    const [locale, setLocale] = useState(initialLocale);
    const router = useRouter();

    const handleLanguageSwitch = (selectedLocale: string) => {
        if (selectedLocale) {
            setLocale(selectedLocale);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('locale', selectedLocale);
            }
        }
    };

    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('locale', locale ?? 'vi');
        router.replace(`${pathname}?${newSearchParams.toString()}`);
    }, [locale, pathname, router, searchParams]);

    const renderLanguageButtons = (isDropdown: boolean) => {
        const buttonClasses =
            `${isDropdown ? 'text-sm w-full' : 'text-md gap-4'} justify-between text-md font-medium text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 py-1 px-3 flex items-center`;

        const buttons = [
            {
                label: 'English',
                value: 'en',
            },
            {
                label: 'Vietnamese',
                value: 'vi',
            },
        ].map(({ label, value }) => (
            <button
                key={value}
                onClick={() => handleLanguageSwitch(value)}
                className={`${buttonClasses} ${!isDropdown ? 'rounded-md mx-1' : ''}`}
            >
                {label}
                {locale === value ? <MdRadioButtonChecked /> : <MdRadioButtonUnchecked />}
            </button>
        ));

        if (isDropdown) {
            return (
                <div className="absolute right-0 translate-x-14 flex min-w-32 w-32 z-50 flex-col border dark:border-white/10 rounded-md bg-white shadow-xl dark:bg-[#242526]">
                    {buttons.map((btn, idx) => (
                        <div key={idx}>
                            {btn}
                            {idx < buttons.length - 1 && (
                                <div className="h-[0.5px] w-full bg-gray-200 dark:bg-white/10" />
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return <div className="flex flex-col gap-2">{buttons}</div>;
    };

    return version === '1' ? (
        <Dropdown
            button={
                <button
                    className="text-blue-600 dark:text-white uppercase h-5 w-5 rounded-md flex justify-center items-center font-bold text-xs pt-[1px]"
                >
                    {locale}
                </button>
            }
        >
            {renderLanguageButtons(true)}
        </Dropdown>
    ) : (
        <div className="flex space-x-2 flex-col">{renderLanguageButtons(false)}</div>
    );
};

export default LanguageSwitcher;