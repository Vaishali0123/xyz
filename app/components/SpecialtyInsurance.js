"use client";
import React, { useEffect, useState } from "react";
import {
  FaPaw,
  FaShip,
  FaShieldAlt,
  FaMountain,
  FaGraduationCap,
  FaGem,
  FaCalendarAlt,
  FaGavel,
} from "react-icons/fa";
import Map from "../../public/Map.png";
import { useLanguage } from "../context/LanguageContext";

const cards = [
  {
    icon: (
      <FaPaw className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-orange-500" />
    ),
    title: "Pet Insurance",
    desc: "Keep your furry friends healthy and protected.",
  },
  {
    icon: (
      <FaShip className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-blue-600" />
    ),
    title: "Marine & Boat",
    desc: "Coverage for watercraft and marine activities.",
  },
  {
    icon: (
      <FaShieldAlt className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-red-500" />
    ),
    title: "Cybersecurity",
    desc: "Protection against digital threats and identity theft.",
  },
  {
    icon: (
      <FaMountain className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-green-600" />
    ),
    title: "Adventure Sports",
    desc: "Coverage for extreme sports and outdoor activities.",
  },
  {
    icon: (
      <FaGraduationCap className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-purple-600" />
    ),
    title: "Student Insurance",
    desc: "Specialized coverage for students and education.",
  },
  {
    icon: (
      <FaGem className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-pink-600" />
    ),
    title: "Art & Valuables",
    desc: "Protection for valuable collections and artwork.",
  },
  {
    icon: (
      <FaCalendarAlt className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-orange-400" />
    ),
    title: "Event Insurance",
    desc: "Coverage for weddings, parties, and special events.",
  },
  {
    icon: (
      <FaGavel className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] text-gray-700" />
    ),
    title: "Legal Expense",
    desc: "Coverage for legal fees and court expenses.",
  },
];

const SpecialtyInsurance = () => {
  const { language } = useLanguage();
  const [translatedCards, setTranslatedCards] = useState([]);
  const [heading, setHeading] = useState("Specialty Insurance");
  const [description, setDescription] = useState(
    "Specialized coverage for unique needs and situations"
  );
  const [learnMoreText, setLearnMoreText] = useState("Learn More →");
  async function translateText(text, targetLang) {
    if (!text || targetLang === "en") return text;
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const data = await res.json();
      return data.translatedText || text;
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    }
  }

  useEffect(() => {
    async function translateAll() {
      // Translate heading and description
      const [translatedHeading, translatedDesc, translatedLearnMore] =
        await Promise.all([
          translateText("Specialty Insurance", language),
          translateText(
            "Specialized coverage for unique needs and situations",
            language
          ),
          translateText("Learn More →", language),
        ]);

      setHeading(translatedHeading);
      setDescription(translatedDesc);
      setLearnMoreText(translatedLearnMore);

      // Translate cards
      const cardsTranslations = await Promise.all(
        cards.map(async (card) => {
          const [title, desc] = await Promise.all([
            translateText(card.title, language),
            translateText(card.desc, language),
          ]);
          return { ...card, title, desc };
        })
      );

      setTranslatedCards(cardsTranslations);
    }

    translateAll();
  }, [language]);
  const displayCards = translatedCards.length > 0 ? translatedCards : cards;

  return (
    <div
      style={{ backgroundImage: `url(${Map.src})` }}
      className="w-full px-4 md:px-8 py-16 md:py-20 flex flex-col bg-contain bg-no-repeat bg-center pn:max-sm:bg-top items-center font-sans bg-gradient-to-b from-transparent overflow-hidden bg-[#FFAA00] relative z-10"
    >
      {/* Title */}
      <div className="text-center mb-10 md:mb-16 max-w-2xl">
        <h2 className="text-3xl md:text-4xl text-[#656565] font-[Marcellus] mb-2">
          {heading}
        </h2>
        <p className="text-[#424242]  text-base md:text-lg">{description}</p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-wrap gap-2 sm:gap-6 max-w-[1400px] w-full justify-center items-center">
        {displayCards.map((card, idx) => (
          <div
            key={idx}
            className="group flex flex-col bg-white rounded-3xl p-4 sm:p-6 w-full max-w-[300px] shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-gray-50"
          >
            <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3">
              {card.icon}
            </div>
            <h3 className="font-bold text-[14px] font-[marcellus] sm:text-lg mb-2 mt-3 transition-colors duration-300 group-hover:text-gray-700">
              {card.title}
            </h3>
            <p className=" text-[12px] sm:text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 w-full h-[20%] bg-gradient-to-b from-transparent via-[#FFAA00] to-[#FFAA00]  left-[70vh] blur-2xl"></div>
    </div>
  );
};

export default SpecialtyInsurance;
