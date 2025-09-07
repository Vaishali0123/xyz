"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdArrowForward } from "react-icons/md";
import Trip from "../../../public/triptoinc.jpeg";
import { useLanguage } from "../../context/LanguageContext";
// ---- Translation function (API) ----
async function translateText(text, targetLang) {
  if (!text) return text;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation API error:", err);
    return text; // fallback to original
  }
}
const FeaturedPost = () => {
  const { language } = useLanguage();

  // states for translated text
  const [tCategory, setTCategory] = useState("Tips and Tricks");
  const [tTitle, setTTitle] = useState(
    "Your Short trip to Know every insurance"
  );
  const [tDescription, setTDescription] = useState(
    "Comprehensive insurance solutions designed to protect your life, health, home, travels, car, and loved ones — because your peace of mind deserves nothing less."
  );
  const [tButton, setTButton] = useState("Read more");

  // Translate on language change
  useEffect(() => {
    async function translateContent() {
      const [cat, title, desc, btn] = await Promise.all([
        translateText("Tips and Tricks", language),
        translateText("Your Short trip to Know every insurance", language),
        translateText(
          "Comprehensive insurance solutions designed to protect your life, health, home, travels, car, and loved ones — because your peace of mind deserves nothing less.",
          language
        ),
        translateText("Read more", language),
      ]);

      setTCategory(cat);
      setTTitle(title);
      setTDescription(desc);
      setTButton(btn);
    }

    translateContent();
  }, [language]);
  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto my-8 bg-white dark:bg-black rounded-[30px] shadow-xl overflow-hidden h-auto md:h-[600px]">
      {/* Image Section */}
      <div className="w-full md:w-1/2 h-[300px] md:h-full relative rounded-[30px]">
        <Image
          src={Trip}
          alt="Jeep parked by a lake"
          fill
          className="object-cover rounded-[30px]"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 p-6 md:p-14 flex flex-col justify-center">
        <span className="bg-[#23262F] dark:bg-gray-300 dark:text-black text-white text-sm font-semibold px-6 py-2 rounded-full w-fit mb-4">
          {tCategory}
        </span>

        <h1 className="text-3xl md:text-4xl dark:text-white/80 font-bold text-[#1C1C1E] font-[marcellus] leading-snug">
          {tTitle}
        </h1>

        <p className="text-[#777E90] dark:text-white/50 mt-4 md:mt-6 text-base md:text-[20px] max-w-md">
          {tDescription}
        </p>

        <button className="group mt-6 md:mt-10 bg-[#23C55E] dark:bg-green-400 dark:text-black text-white font-semibold py-3 px-6 rounded-full flex items-center transition hover:bg-[#1ea94f] w-fit">
          {tButton}
          <MdArrowForward className="ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedPost;
