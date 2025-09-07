"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaCarAlt,
  FaPaw,
  FaHeart,
  FaPlane,
  FaHome,
  FaNotesMedical,
  FaAngleRight,
} from "react-icons/fa";

import { useRouter } from "next/navigation";
import { GET_HERO_AND_STATS, graphQLClient } from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";

const initialInsuranceData = {
  car: {
    title: "Car Insurance",
    description:
      "Car insurance protects you financially against accidents, theft, or damage to your vehicle. It typically covers liability, repairs, medical costs, and legal expenses. Policies may include third-party, comprehensive, or collision coverage. It's legally required in most places and ensures safer driving with peace of mind.",
    subDescription:
      "Discover the most appropriate fit for you and your Family.",
    image: "/cars.jpg",
    data: null,
  },
  life: {
    title: "Life Insurance",
    description:
      "Life insurance provides financial support to your loved ones after your death. It pays out a lump sum (death benefit) to the chosen beneficiaries. Policies can help cover debts, daily expenses, or future goals like education. It ensures your family's financial stability in your absence.",
    subDescription: "Choose a policy that grows with your life's milestones.",
    image: "/lifes.jpg",
    data: null,
  },
  pet: {
    title: "Pet Insurance",
    description:
      "Pet insurance helps cover veterinary costs for your pet's illnesses, injuries, or routine care. It reduces the financial burden of unexpected medical treatments. Policies may include coverage for accidents, surgeries, medications, and preventive care. It ensures your pet gets the best care without stressing your budget.",
    subDescription: "Because they're not just pets, they're family.",
    image: "/dog.jpg",
    data: null,
  },
  travel: {
    title: "Travel Insurance",
    description:
      "Travel insurance provides coverage for unexpected events during a trip, such as trip cancellations, delays, or medical emergencies. It protects travelers from financial losses due to unforeseen disruptions. Policies often include lost luggage, flight issues, and emergency evacuation. It offers peace of mind while traveling domestically or internationally.",
    subDescription: "Your safety net wherever you go.",
    image: "/travel.jpg",
    data: null,
  },
  health: {
    title: "Health Insurance",
    description:
      "Health insurance is a type of coverage that pays for medical, surgical, and hospital expenses. It protects individuals from high healthcare costs by covering part or all of the bills. Policies can vary, offering benefits like doctor visits, prescriptions, and emergency care. It provides financial security and ensures timely access to quality healthcare.",
    subDescription: "Stay healthy, stay insured.",
    image: "/health.jpg",
    data: null,
  },
  home: {
    title: "Home Insurance",
    description:
      "Home insurance protects your house and personal belongings from risks like fire, theft, or natural disasters. It also covers liability for accidents that happen on your property. Policies can include coverage for repairs, rebuilding, and temporary housing. It provides financial security and peace of mind for homeowners.",
    subDescription: "Coverage you can count on.",
    image: "/home.jpg",
    data: null,
  },
};

// Icons
const iconMap = {
  car: <FaCarAlt className="w-6 h-6" />,
  life: <FaHeart className="w-6 h-6" />,
  pet: <FaPaw className="w-6 h-6" />,
  travel: <FaPlane className="w-6 h-6" />,
  health: <FaNotesMedical className="w-6 h-6" />,
  home: <FaHome className="w-6 h-6" />,
};

// Icon menu with staggered position animations
const InsuranceMainCategories = ({ activeCategory, setActiveCategory }) => {
  const keys = Object.keys(iconMap);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);

    // Reset animation state after animation completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600 + keys.length * 100); // Base duration + stagger time

    return () => clearTimeout(timer);
  }, [activeCategory, keys.length]);

  // Improved circular slice function for smoother transitions
  const getCircularSlice = (arr, start, count) => {
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(arr[(start + i) % arr.length]);
    }
    return result;
  };

  const otherKeys = keys.filter((key) => key !== activeCategory);
  const reordered = [
    activeCategory,
    ...getCircularSlice(otherKeys, 0, 3), // Always start from 0 for consistency
  ];

  return (
    <div className="sm:h-[220px] pn:max-sm:scale-90 pn:max-sm:mt-[100px] relative">
      <div className="border-orange-300 border-2 h-28 w-28 -top-10 -left-5 rounded-full flex items-center justify-center absolute "></div>
      <div className="flex sm:flex-col gap-4">
        {reordered.map((key, index) => (
          <button
            key={key} // Keep consistent key to maintain element identity
            onClick={() => setActiveCategory(key)}
            className={`h-16 w-16 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-300
              ${isAnimating ? "icon-position-shift" : ""}
              ${
                activeCategory === key
                  ? "bg-orange-500 text-white "
                  : "bg-orange-100 pn:max-sm:scale-75 scale-90 hover:scale-100 duration-75 hover:bg-orange-300 hover:text-white text-orange-500"
              }`}
            style={{
              animationDelay: `${index * 100}ms`, // Stagger the position shifts
            }}
          >
            {iconMap[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main component
const Insurance = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const keys = Object.keys(initialInsuranceData);
  const [activeCategory, setActiveCategory] = useState(keys[0]);
  const [insuranceData, setInsuranceData] = useState(initialInsuranceData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [imageAnimationKey, setImageAnimationKey] = useState(0);
  const intervalRef = useRef(null);
  const [translatedData, setTranslatedData] = useState(initialInsuranceData);

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

  // Auto-rotation logic
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start auto-rotation
    intervalRef.current = setInterval(() => {
      setActiveCategory((prev) => {
        const currentIndex = keys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % keys.length;
        return keys[nextIndex];
      });
    }, 3000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [keys]);

  // Stop auto-rotation when user interacts
  const handleManualCategoryChange = (category) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveCategory(category);

    // Restart auto-rotation after 5 seconds of inactivity
    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setActiveCategory((prev) => {
          const currentIndex = keys.indexOf(prev);
          const nextIndex = (currentIndex + 1) % keys.length;
          return keys[nextIndex];
        });
      }, 3000);
    }, 5000);
  };

  useEffect(() => {
    setTextAnimationKey((prev) => prev + 1);
    setImageAnimationKey((prev) => prev + 1);
  }, [activeCategory]);

  const rawData = insuranceData[activeCategory];

  // Fetch GraphQL data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await graphQLClient.request(GET_HERO_AND_STATS);
        console.log(response, "data");

        const updatedInsuranceData = { ...initialInsuranceData };

        response?.categories?.nodes?.forEach((category) => {
          const slugToKey = {
            "car-insurance": "car",
            "health-insurance": "health",
            "life-insurance": "life",
            "pet-insurance": "pet",
            "home-insurance": "home",
            "travel-insurance": "travel",
          };

          const key = slugToKey[category?.slug];
          if (key && updatedInsuranceData[key]) {
            updatedInsuranceData[key].data = category;
          }
        });

        setInsuranceData(updatedInsuranceData);
        setIsDataLoaded(true);
      } catch (err) {
        console.error("GraphQL Error:", err);
        setIsDataLoaded(true); // Set to true even on error to prevent infinite loading
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function doTranslation() {
      const entries = await Promise.all(
        Object.entries(insuranceData).map(async ([key, item]) => {
          const [title, description, subDescription] = await Promise.all([
            translateText(item.title, language),
            translateText(item.description, language),
            translateText(item.subDescription, language),
          ]);

          return [
            key,
            {
              ...item,
              title,
              description,
              subDescription,
            },
          ];
        })
      );

      setTranslatedData(Object.fromEntries(entries));
    }

    doTranslation();
  }, [language, insuranceData]);

  const data = translatedData[activeCategory] || rawData;

  const handleNavigate = () => {
    const categoryData = insuranceData[activeCategory]?.data;
    if (categoryData) {
      sessionStorage.setItem("selectedType", JSON.stringify(categoryData));
      router.push(`/${categoryData?.slug}`);
    } else {
      // Handle case where data is not loaded yet
      console.warn("Category data not loaded yet");
    }
  };

  return (
    <>
      <section
        className="py-16"
        style={{
          backgroundImage: "url('/BG.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row gap-10 px-4 sm:px-6 lg:px-8 items-center md:items-start md:justify-between">
          <div className=" flex pn:max-sm:flex-col gap-10">
            {/* Left - Icons */}
            <InsuranceMainCategories
              activeCategory={activeCategory}
              setActiveCategory={handleManualCategoryChange}
            />

            {/* Center - Text */}
            <div
              key={textAnimationKey}
              className="flex-1 max-w-md text-center pn:max-sm:text-left lg:text-left text-content-animate"
            >
              <h2 className="sm:text-4xl text-[23px] font-[Marcellus] font-semibold text-gray-800 dark:text-gray-100">
                {data.title}
              </h2>
              <p className="mt-6 text-[13px] text-gray-600 dark:text-gray-100">
                {data.description}
              </p>
              <p className="mt-4 text-gray-500 dark:text-gray-100">
                {data.subDescription}
              </p>
              <button
                onClick={handleNavigate}
                disabled={!isDataLoaded || !data.data}
                className={`mt-8 h-12 w-12 rounded-full text-white dark:text-gray-800 flex items-center justify-center transition ${
                  !isDataLoaded || !data.data
                    ? "bg-gray-400 dark:bg-gray-300 cursor-not-allowed"
                    : "bg-gray-900 hover:scale-110 dark:bg-gray-100"
                }`}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
          {/* Right - Image */}
          <div
            key={imageAnimationKey}
            className="flex-1 w-full md:max-w-md relative flex justify-center"
          >
            {/* Top decoration (only show on md+) */}
            <div className="hidden md:block absolute -top-[70px] -left-[50px] w-[376px] h-[277px] bg-orange-100/50 rounded-3xl z-0"></div>

            {/* Image */}
            <div className="relative overflow-hidden h-[300px] image-content-animate w-full sm:w-[90vw] md:w-full rounded-3xl bg-white shadow-xl z-10">
              <img
                src={rawData?.image}
                alt={data?.title}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>

            {/* Bottom decoration (only show on md+) */}
            <div className="hidden md:block absolute md:max-lg:hidden -bottom-[100px] -right-[100px] w-[376px] h-[277px] border-2 border-orange-100/90 rounded-3xl z-0"></div>
          </div>
        </div>
      </section>

      {/* CSS Keyframe Animations */}
      <style jsx global>{`
        @keyframes iconPositionShift {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(0.8);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes textContentSmooth {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes imageContentSmooth {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .icon-position-shift {
          animation: iconPositionShift 0.4s ease-in-out;
        }

        .text-content-animate {
          animation: textContentSmooth 0.5s ease-out;
          animation-fill-mode: both;
        }

        .image-content-animate {
          animation: imageContentSmooth 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </>
  );
};

export default Insurance;
