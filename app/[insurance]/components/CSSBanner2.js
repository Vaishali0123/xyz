"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import pic from "../../../public/three.jpg";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
async function translateText(text, targetLang) {
  try {
    // Example using Google Translate API (fetch from your backend instead of client directly)
    const res = await fetch(
      `/api/translate?text=${encodeURIComponent(text)}&lang=${targetLang}`
    );
    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text;
  }
}
const Banner = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({
    bannerTitle: "Find the Right Insurance with Confidence",
    bannerDesc:
      "From health to home to disability — get expert-backed guidance for every coverage you need.",
    btnText: "Get Started",
  });
  useEffect(() => {
    async function doTranslate() {
      if (language === "en") return; // Skip English
      const entries = Object.entries(translations);

      const translatedEntries = await Promise.all(
        entries.map(async ([key, value]) => {
          const translated = await translateText(value, language);
          return [key, translated];
        })
      );

      setTranslations(Object.fromEntries(translatedEntries));
    }
    doTranslate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  return (
    <div
      className="relative flex items-center justify-center dark:bg-white/10 h-[55vh] min-h-[300px] max-h-[600px] mb-8 rounded-[30px] overflow-hidden bg-cover bg-center bg-no-repeat px-[5%]"
      style={{ backgroundImage: "url(/images/Banner2.png)" }}
    >
      {/* Overlay image */}
      <Image
        alt="pic"
        src={pic}
        className="absolute inset-0 w-full  rounded-[30px] h-full object-contain object-right z-[1]"
      />

      {/* Content */}
      <div className="relative z-10 w-full px-4 flex flex-col items-start justify-start dark:text-gray-200 text-black">
        <h1 className="font-[Marcellus] font-bold mb-4 leading-tight w-[80%] text-[clamp(1.5rem,4vw,3rem)]">
          {translations.bannerTitle}
        </h1>
        <p className="max-w-[600px] mb-6 text-[clamp(0.9rem,2vw,1.125rem)] leading-relaxed text-black dark:text-gray-200 text-shadow">
          {translations.bannerDesc}
        </p>
        <Link
          href="https://admin.costaricaninsurance.com/understanding-medical-insurance-a-comprehensive-guide/"
          target="_blank"
          className="bg-white dark:bg-white/10 text-purple-700 dark:text-purple-400 px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition text-[clamp(0.85rem,1.5vw,1rem)]"
        >
          {translations.btnText}
        </Link>
      </div>
    </div>
  );
};

export default Banner;
