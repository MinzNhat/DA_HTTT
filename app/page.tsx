'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import useMobileView from "@/hooks/useMobileView";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useSearchParams } from "next/navigation";
import { IntlProvider } from "react-intl";

type LanguageMessages = {
  [key: string]: any;
}

export default function Home() {
  const languages: LanguageMessages = {
    vi: require('@/language/vi.json'),
    en: require('@/language/en.json')
  };
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'vi';
  const defaultLocale = 'vi';
  const messages = languages[locale];
  const { isMobile } = useMobileView()
  const { openSidebar, setOpenSidebar } = useSidebarContext()

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
      <section className="flex h-full w-full">
        <Sidebar />

        {/* Navbar & Main Content */}
        <div className="h-full w-full bg-lightPrimary dark:!bg-[#3a3b3c]">
          <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 ${!isMobile && openSidebar ? "xl:ml-[313px]" : "xl:ml-5"}`}>
            <div className="h-full">
              <Navbar />
              <div className="pt-5s mx-auto mb-auto h-full min-h-[calc(100dvh-120px)] md:min-h-[calc(100dvh-89.5px)] p-2 md:pr-2">
              </div>
            </div>
          </main>
        </div>
      </section>
    </IntlProvider>
  );
}
