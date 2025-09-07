"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
// Props destructured for reusability
const ArticleCard = ({
  title = "  Comprehensive insurance solutions to safeguard your life, health, home, travels, pets, and more — because peace of mind is priceless.",
  date = "Nov 29, 2024",
  authorName = "Cruz McIntyre",
  authorImage = "/blog/author.jpg",
  backgroundImage = "/blog/bg2.jpg",
}) => {
  const { language } = useLanguage();

  // Local states for translated text
  const [translatedTitle, setTranslatedTitle] = useState(title);
  const [translatedTag, setTranslatedTag] = useState("Insurance");
  const [translatedSmallTitle, setTranslatedSmallTitle] = useState(
    "Reliable Insurance Solutions for Every Stage of Life"
  );
  const [translatedDate, setTranslatedDate] = useState(date);
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
  useEffect(() => {
    if (!language || language === "en") return; // no need to translate if English

    const doTranslation = async () => {
      const [tTitle, tAuthor, tTag, tSmall, tDate] = await Promise.all([
        translateText(title, language),
        translateText(authorName, language),
        translateText("Insurance", language),
        translateText(
          "Reliable Insurance Solutions for Every Stage of Life",
          language
        ),
        translateText(date, language),
      ]);
      setTranslatedTitle(tTitle);
      // setTranslatedAuthor(tAuthor);
      setTranslatedTag(tTag);
      setTranslatedSmallTitle(tSmall);
      setTranslatedDate(tDate);
    };

    doTranslation();
  }, [language, title, authorName, date]);
  return (
    <div className="relative flex flex-col lg:flex-row items-center w-full px-6 py-24">
      {/* === Main Large Card === */}
      <div className="relative w-full max-w-[1400px] h-auto lg:h-[400px] rounded-[25.71px] overflow-hidden shadow-2xl font-sans bg-gradient-to-b from-[rgba(41,128,185,0)] to-[#2980B9] sm:ml-8">
        {/* Background Image */}
        <div
          className="absolute inset-0  w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>

        {/* Blue Overlay */}
        {/* <div className="absolute inset-0 bg-blue-800 opacity-60 z-10"> */}
        {/* <Image src={card} alt="pic" className="h-full w-full object-cover" /> */}
        {/* </div> */}

        {/* Content */}
        <div className="relative flex flex-col justify-between w-full h-full p-10 sm:p-16 text-white z-20">
          {/* Title */}
          <div className="flex-grow mb-6">
            <div className="w-full md:w-4/5 lg:w-3/5">
              <h1 className="text-[32px] sm:text-[40px] md:text-[36px]  font-medium  font-[marcellus] leading-tight font-poppins">
                {/* {title} */}
                {translatedTitle}
              </h1>
            </div>
          </div>

          {/* Bottom: Date & Author */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            {/* Date */}
            {/* <p className="text-[18px] sm:text-[20px] font-medium  font-[marcellus]">
              {date}
            </p> */}

            {/* Author Info */}
            {/* <div className="flex items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/50">
                <img
                  src={authorImage}
                  alt={`Author ${authorName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/80x80/EFEFEF/333333?text=CM";
                  }}
                />
              </div>
              <div className="ml-4">
                <p className="text-[18px] sm:text-[20px]">{authorName}</p>
                <p className="text-sm sm:text-base text-gray-200">Author</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* === Overlay Small Card === */}
      <div className="w-full sm:max-w-[500px] lg:w-[350px] mt-8 lg:mt-0 lg:absolute lg:top-8 lg:right-10 bg-white dark:bg-white/10 rounded-xl shadow-xl p-5 font-poppins z-30">
        <div className="mb-3">
          <span className="text-xs font-medium text-white bg-indigo-600 dark:bg-indigo-400 dark:text-black px-3 py-1 rounded">
            {/* Insurance */}
            {translatedTag}
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-bold font-[marcellus] dark:text-white text-gray-900 leading-snug">
          {/* Reliable Insurance Solutions for Every Stage of Life */}
          {translatedSmallTitle}
        </h2>
        {/* <div className="flex items-center mt-4 gap-3">
          <img
            src="/blog/author2.jpg"
            alt="Jason Francisco"
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-800 mr-1">
              Jason Francisco
            </span>
            August 20, 2022
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ArticleCard;
