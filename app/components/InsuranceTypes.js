"use client";
import React, { useEffect, useState } from "react";
import { FaCarCrash, FaNotesMedical } from "react-icons/fa";
import { LiaMotorcycleSolid } from "react-icons/lia";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { HiMiniHomeModern } from "react-icons/hi2";
import { IoHeartSharp } from "react-icons/io5";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
const baseInsuranceData = [
  {
    id: "car",
    title: "Car Insurance",
    slug: "car-insurance",
    description:
      "Protect your vehicle with comprehensive auto insurance coverage options.",
    isFeatured: true,
    shadowBg: "#E4EFFE",
    border: "none",
    icon: <FaCarCrash className="h-10 w-10" />,
  },
  {
    id: "motorcycle",
    title: "Motorcycle Insurance",
    slug: "motorcycle-insurance",
    description:
      "Protect your ride with tailored motorcycle insurance coverage.",
    isFeatured: false,
    shadowBg: "#FEF1E0",
    border: "3px solid #FFFFFF",
    icon: <LiaMotorcycleSolid className="h-10 w-10" />,
  },
  {
    id: "medical",
    title: "Medical Insurance",
    slug: "medical-insurance",
    description:
      "Comprehensive medical coverage for your health and wellbeing.",
    isFeatured: false,
    shadowBg: "#E5FCED",
    border: "3px solid #FFFFFF",
    icon: <FaNotesMedical className="h-10 w-10" />,
  },
  {
    id: "home",
    title: "Home Insurance",
    slug: "home-insurance",
    description:
      "Protect your home and belongings with flexible insurance plans.",
    isFeatured: false,
    shadowBg: "#F6EEFE",
    border: "3px solid #FFFFFF",
    icon: <HiMiniHomeModern className="h-10 w-10" />,
  },
  {
    id: "life",
    title: "Life Insurance",
    slug: "life-insurance",
    description: "Secure your family's future with reliable life insurance.",
    isFeatured: false,
    shadowBg: "#FDE9E9",
    border: "3px solid #FFFFFF",
    icon: <IoHeartSharp className="h-10 w-10" />,
  },
  {
    id: "business",
    title: "Business Insurance",
    slug: "business-insurance",
    description: "Comprehensive coverage for your business and assets.",
    isFeatured: false,
    shadowBg: "#F6EEFE",
    border: "3px solid #FFFFFF",
    icon: <LuBriefcaseBusiness className="h-10 w-10" />,
  },
];
const InsuranceCard = ({
  title,
  description,
  isFeatured,
  shadowBg,
  border,
  icon,
  learnMoreText,
}) => {
  return (
    <div
      className={`relative w-full max-w-[320px] min-h-[22rem] overflow-hidden border p-4 
      hover:shadow-md hover:bg-black dark:bg-black hover:dark:bg-white active:bg-black active:dark:bg-white group transition-all duration-200
      ${
        isFeatured
          ? "border-gray-200 dark:border-gray-700"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Glow */}
      <div className="h-[50px] absolute w-[50px] bg-amber-300 blur-2xl rounded-full bottom-0 right-0"></div>

      {/* Rotated shadow/icon box */}
      <div
        className="absolute z-0 group-hover:bottom-14 group-hover:rotate-0 group-hover:right-14 rounded-2xl -rotate-[15deg] bottom-0 right-0  duration-500 flex justify-center items-center"
        style={{
          width: "30%",
          height: "33%",
          //   transform: "rotate(-11.47deg)",
          transformOrigin: "bottom right",
          opacity: 1,
          border: border,
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,0.1)",
          backgroundColor: shadowBg,
          overflow: "hidden",
        }}
      >
        <div className="w-[80px] h-[80px] flex justify-center items-center">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h3
            className={`text-lg font-medium ${
              isFeatured
                ? "text-gray-900 dark:text-gray-200 group-hover:text-white group-hover:dark:text-black"
                : "text-gray-900 dark:text-gray-200 group-hover:text-white group-hover:dark:text-black"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mt-1 ${
              isFeatured
                ? "text-gray-600 dark:text-gray-200 group-hover:dark:text-black group-hover:text-white"
                : "text-gray-600 dark:text-gray-200 group-hover:dark:text-black group-hover:text-white"
            }`}
          >
            {description}
          </p>
        </div>
        <div className="group-hover:text-[#FEB117] group-hover:dark:text-[#e8a114] dark:text-white text-sm font-medium hover:underline">
          {learnMoreText}
        </div>
      </div>
    </div>
  );
};

export default function InsuranceTypes() {
  const router = useRouter();
  const { language } = useLanguage();

  const [heading, setHeading] = useState("Insurance Types We Cover");
  const [description, setDescription] = useState(
    "Comprehensive guides and information for every type of insurance you need."
  );
  const [translatedData, setTranslatedData] = useState([]);
  const [insuranceData, setInsuranceData] = useState(baseInsuranceData);
  useEffect(() => {
    async function doTranslation() {
      // translate heading + description
      const [translatedHeading, translatedDesc] = await Promise.all([
        translateText("Insurance Types We Cover", language),
        translateText(
          "Comprehensive guides and information for every type of insurance you need.",
          language
        ),
      ]);

      setHeading(translatedHeading);
      setDescription(translatedDesc);

      // translate blogs (already there)
      const translatedCards = await Promise.all(
        insuranceData.map(async (blog) => {
          const [title, description, content, learnMoreText] =
            await Promise.all([
              translateText(blog.title, language),
              translateText(blog.description, language),
              translateText(blog.content, language),
              translateText("Learn More →", language),
            ]);
          return { ...blog, title, description, content, learnMoreText };
        })
      );

      setTranslatedData(translatedCards);
      //   setActiveBlog(translatedBlogs[0]);
    }

    doTranslation();
  }, [language, insuranceData]);

  //   useEffect(() => {
  //     async function doTranslation() {
  //       if (language === "en") {
  //         setInsuranceData(baseInsuranceData);
  //         return;
  //       }
  //       const [translatedHeading, translatedDesc] = await Promise.all([
  //         translateText("Insurance Types We Cover", language),
  //         translateText(
  //           "Comprehensive guides and information for every type of insurance you need.",
  //           language
  //         ),
  //       ]);

  //       setHeading(translatedHeading);
  //       setDescription(translatedDesc);
  //       const translatedBlogs = await Promise.all(
  //         baseInsuranceData.map(async (item) => {
  //           const [title, description, content] = await Promise.all([
  //             translateText(item.title, language),
  //             translateText(item.description, language),
  //             translateText(blog.content, language),
  //           ]);
  //           return { ...item, title, description };
  //         })
  //       );
  //       setTranslatedData(translatedBlogs);
  //       setActiveBlog(translatedBlogs[0]);
  //       setInsuranceData(translated);
  //     }
  //     doTranslation();
  //   }, [language]);
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
  return (
    <div className="font-sans  my-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-normal text-gray-800 dark:text-gray-100 md:w-[26%]"
            style={{ fontFamily: "Marcellus" }}
          >
            {heading}
          </h2>
          <p className="text-base text-gray-500 max-w-xl dark:text-gray-200">
            {description}
          </p>
        </div>

        {/* Cards */}
        <div className="flex  flex-wrap justify-center gap-6">
          {(translatedData.length > 0 ? translatedData : insuranceData).map(
            (item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  const updatedData = (
                    translatedData.length > 0 ? translatedData : insuranceData
                  ).map((data, i) => ({
                    ...data,
                    isFeatured: i === index,
                  }));
                  console.log(updatedData, "updatedData");
                  console.log(item, "item");

                  setInsuranceData(updatedData);
                  setTranslatedData(updatedData);
                  // sessionStorage.setItem(
                  //   "selectedType",
                  //   JSON.stringify(option)
                  // );
                  router.push(`/${item.slug}`);
                }}
                className="flex justify-center"
              >
                <InsuranceCard {...item} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
