"use client";
import React, { useEffect, useState } from "react";
import Bg from "../../../public/BGs.png";
import { useLanguage } from "../../context/LanguageContext";
async function translateText(text, targetLang) {
  if (!text) return "";
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });
    const data = await res.json();
    return data?.translatedText || text;
  } catch (err) {
    console.error("Translation API error:", err);
    return text;
  }
}
const Banner = () => {
  const { language } = useLanguage();

  // State for translated texts
  const [texts, setTexts] = useState({
    heading: "Efficient Rules to get best insurance",
    subtitle:
      "Whether you're looking for pet insurance, health insurance, or disability insurance, we've got you covered.",
  });

  useEffect(() => {
    async function doTranslate() {
      const [h, s] = await Promise.all([
        translateText("Efficient Rules to get best insurance", language),
        translateText(
          "Whether you're looking for pet insurance, health insurance, or disability insurance, we've got you covered.",
          language
        ),
      ]);

      setTexts({
        heading: h,
        subtitle: s,
      });
    }

    doTranslate();
  }, [language]);
  return (
    <div
      className="relative flex  items-center h-[50vh] min-h-[260px] max-h-[450px] mb-8 rounded-[30px] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${Bg.src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 rounded-[30px] z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full px-[8%] py-[5%] text-white flex flex-col items-start justify-center">
        <h1 className="font-[Marcellus] font-bold mb-3 max-w-[800px] leading-tight text-shadow-lg text-[clamp(1.5rem,4vw,3rem)]">
          {texts.heading}
        </h1>
        <p className="text-[20px] max-w-[650px] mb-5 text-shadow">
          {texts.subtitle}
        </p>
      </div>
    </div>
  );
};

export default Banner;
