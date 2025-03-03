"use client";

import { fetchLanguages } from "@/lib/api";
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
    async function fetchAndSetLanguages() {
      const data = await fetchLanguages();
      const langArray = Object.values(data) as Language[];
      setLanguages(langArray);
    }

    fetchAndSetLanguages();
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
