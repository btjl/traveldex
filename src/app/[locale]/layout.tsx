// app/[locale]/layout.tsx

import { EnsureLocaleAndTranslateParam } from "@/components/EnsureLocaleAndTranslateParam";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { createTranslator } from "use-intl/core";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(props: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (await props).params.locale;

  const messages = (await import(`@/i18n/locales/${locale}.json`)).default;

  const t = createTranslator({
    locale,
    messages,
    namespace: "LocaleLayout",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }
}>) {
  const locale = await params.locale
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-800`}
      >
        {/* Ensure URL always has locale path and translateTo param */}
        <EnsureLocaleAndTranslateParam />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
