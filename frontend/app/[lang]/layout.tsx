import { Header } from "@/components";
import { fetchNavigation } from "@/lib/api";
import { INavItem } from "@/models";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { lang } = params;
  const navigation: INavItem[] = await fetchNavigation(lang);

  return (
    <html lang={lang}>
      <body>
        <Header navigation={navigation} lang={lang} />
        {children}
      </body>
    </html>
  );
}
