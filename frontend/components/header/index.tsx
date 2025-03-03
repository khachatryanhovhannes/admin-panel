import { INavItem } from "@/models";
import Link from "next/link";
import LanguageSwitcher from "../languageSwitcher";

interface IHeaderProps {
  lang: string;
  navigation: INavItem[];
}

function Header({ navigation, lang }: IHeaderProps) {
  return (
    <nav>
      {navigation.map((item) => (
        <Link key={item.id} href={`/${lang}${item.link}`}>
          {item.text}
        </Link>
      ))}
      <LanguageSwitcher currentLang={lang} />
    </nav>
  );
}

export default Header;
