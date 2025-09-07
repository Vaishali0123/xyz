"use client";
import React, { useEffect, useState } from "react";
import Blogbg from "../../../public/blogbg.png"; // Import the Blogbg
import Image from "next/image";
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

const HeadSection = () => {
  const { language } = useLanguage();
  // State for translated texts
  const [texts, setTexts] = useState({
    titleLine1: "Make better",
    titleLine2: "life with insurance",
    subtitle: "learn how with our blogs",
    imageAlt: "Blog Illustration",
  });

  useEffect(() => {
    async function doTranslate() {
      const [t1, t2, t3, t4] = await Promise.all([
        translateText("Make better", language),
        translateText("life with insurance", language),
        translateText("learn how with our blogs", language),
        translateText("Blog Illustration", language),
      ]);

      setTexts({
        titleLine1: t1,
        titleLine2: t2,
        subtitle: t3,
        imageAlt: t4,
      });
    }

    doTranslate();
  }, [language]);
  return (
    <div className="w-full flex flex-wrap justify-between lg:h-[90vh] items-center px-6 py-10 ">
      {/* Left Content */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 ">
        <div className="text-black dark:text-gray-100">
          <div className="text-[48px] sm:text-[60px] font-[marcellus]  leading-tight font-bold font-inter mt-0  sm:mt-28 sm:ml-25 ml-0">
            {texts.titleLine1} <br />
            {texts.titleLine2}
          </div>
          <div className="text-[20px] sm:text-[28px] md:text-[32px]  dark:text-gray-300 text-[#4B5563] mt-2 font-inter sm:ml-25 ml-0">
            {texts.subtitle}
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex justify-center w-full lg:w-1/2">
        <div className="w-full max-w-[600px]">
          <Image
            src={Blogbg}
            alt="Blog Illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeadSection;
