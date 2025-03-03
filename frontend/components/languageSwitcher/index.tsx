"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Language {
  shortName: string;
  nativeName: string;
}

export default function LanguageSwitcher({
  currentLang,
}: {
  currentLang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    async function fetchLanguages() {
      const res = await fetch("http://localhost:3000/frontend/languages");
      const data = await res.json();
      const langArray = Object.values(data) as Language[];
      setLanguages(langArray);
    }

    fetchLanguages();
  }, []);

  const switchLanguage = (lang: string) => {
    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`);
    router.push(newPath);
  };

  return (
    <div>
      {languages.map((lang) => (
        <button
          key={lang.shortName}
          onClick={() => switchLanguage(lang.shortName)}
          disabled={currentLang === lang.shortName}
        >
          {lang.nativeName}
        </button>
      ))}
    </div>
  );
}
