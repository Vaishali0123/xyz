"use client";
import React, { useEffect, useState } from "react";
import { FaChartLine, FaPercent, FaBell, FaBellSlash } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";

const icons = {
  Activity: <FaChartLine className="w-4 h-4 text-orange-500" />,
  Percent: <FaPercent className="w-4 h-4 text-orange-500" />,
  BellRing: <FaBell className="w-4 h-4 text-orange-500" />, // Bell with ring effect
  Bell: <FaBellSlash className="w-4 h-4 text-orange-500" />, // Alternative if you want mute version
};

// Mock data for demo
const mockInsuranceData = [
  {
    id: "1",
    title: "New Car Insurance Regulations 2024",
    content:
      "The latest regulations for car insurance have been updated to provide better coverage for electric vehicles and autonomous driving features. These changes will take effect starting next quarter and will impact all new policies issued after the implementation date.",
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
      },
    },
    iconName: "Activity",
    description: "Updated regulations for better coverage",
  },
  {
    id: "2",
    title: "Home Insurance Premium Changes",
    content:
      "Recent market analysis shows significant changes in home insurance premiums across different regions. Factors such as climate change, construction costs, and local regulations are driving these adjustments.",
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
      },
    },
    iconName: "Percent",
    description: "Market analysis on premium adjustments",
  },
  {
    id: "3",
    title: "Health Insurance Digital Innovation",
    content:
      "The healthcare industry is embracing digital transformation with new telemedicine coverage options and AI-powered health assessments becoming standard features in modern health insurance policies.",
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      },
    },
    iconName: "BellRing",
    description: "Digital transformation in healthcare coverage",
  },
  {
    id: "4",
    title: "Travel Insurance Post-Pandemic Updates",
    content:
      "Travel insurance has evolved significantly since the pandemic, with new coverage options for health emergencies, trip cancellations due to illness, and enhanced protection for international travelers.",
    featuredImage: {
      node: {
        sourceUrl:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      },
    },
    iconName: "Bell",
    description: "Enhanced protection for modern travelers",
  },
];

function stripImages(html) {
  if (!html) return "";
  return html.replace(/<img[^>]*>/g, "");
}

export default function InsuranceNewsSection({
  insurancedata = mockInsuranceData,
}) {
  const [activeBlog, setActiveBlog] = useState(insurancedata?.[0]);
  const [animationKey, setAnimationKey] = useState(0);
  const [translatedData, setTranslatedData] = useState(insurancedata);

  const { language } = useLanguage();
  const router = useRouter();
  const [heading, setHeading] = useState("Latest Insurance News");
  useEffect(() => {
    setActiveBlog(insurancedata?.[0]);
  }, [insurancedata]);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [activeBlog]);
  useEffect(() => {
    async function doTranslation() {
      const translatedHeading = await translateText(
        "Latest Insurance News",
        language
      );
      setHeading(translatedHeading);
      const translated = await Promise.all(
        insurancedata.map(async (blog) => {
          const [title, description, content] = await Promise.all([
            translateText(blog.title, language),
            translateText(blog.description, language),
            translateText(blog.content, language),
          ]);
          return {
            ...blog,
            title,
            description,
            content,
          };
        })
      );

      setTranslatedData(translated);
      setActiveBlog(translated[0]); // reset active to translated
    }
    doTranslation();
  }, [language, insurancedata]);
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
    <>
      <div className="py-8 sm:py-24  lg:h-[100vh] w-[100%] md:px-4 relative">
        {/* Background glow */}
        <div className="absolute pn:max-md:hidden top-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full opacity-50 blur-3xl" />
        <div className="md:max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-[Marcellus] dark:text-gray-100 font-semibold text-center mb-6 text-gray-800">
            {heading}
          </h2>

          <div className="rounded-2xl flex justify-start p-4 sm:p-6 lg:p-8 relative">
            {/* Pattern circle */}
            <div className="absolute top-[130px] pn:max-md:hidden left-[100px] w-[clamp(60px,15vw,120px)] h-[clamp(60px,15vw,120px)] bg-[repeating-linear-gradient(45deg,rgba(252,163,17,0.2),rgba(252,163,17,0.2)_2px,transparent_2px,transparent_4px)] rounded-full z-0" />

            {/* Main container */}
            <div className="flex flex-col md:flex-row gap-8 z-10 w-full lg:h-[520px]">
              {/* Main blog card */}
              <div
                onClick={() => {
                  sessionStorage.setItem(
                    "blogContent",
                    JSON.stringify({
                      content: activeBlog?.content,
                      title: activeBlog?.title,
                      postid: activeBlog?.id,
                      image: activeBlog?.featuredImage?.node?.sourceUrl,
                      latestposts: translatedData,
                    })
                  );
                  router.push(
                    `/blog/${activeBlog?.title.replace(/\s+/g, "-")}/${
                      activeBlog?.id
                    }`
                  );
                }}
                key={animationKey}
                className="flex-1 bg-white  dark:bg-[#171717]  p-3 rounded-3xl shadow-[-6px_4px_41.5px_0px_#FFF8E9] dark:shadow-none flex flex-col blog-card-animate"
              >
                <div className="relative w-full lg:w-[35.5rem] h-64 sm:h-80 lg:h-[60%] p-4 rounded-2xl  overflow-hidden mb-3">
                  {activeBlog?.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={activeBlog?.featuredImage?.node?.sourceUrl}
                      alt="img"
                      className="absolute object-fill inset-0 w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-white/10 dark:text-gray-200 text-gray-500 text-sm">
                      No image available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t  from-black/40 to-transparent rounded-xl" />
                </div>
                <div className="flex  items-center gap-3 text-lg font-[marcellus] font-bold dark:text-gray-100 text-gray-900 mb-2">
                  {activeBlog?.icon || icons[activeBlog?.iconName]}
                  {activeBlog?.title}
                </div>
                <div className="flex-1 flex flex-col relative justify-between">
                  <div
                    className="text-gray-600 text-sm dark:text-gray-100 leading-relaxed overflow-hidden line-clamp-4 md:line-clamp-5"
                    dangerouslySetInnerHTML={{
                      __html: stripImages(activeBlog?.content || ""),
                    }}
                  />
                  <div className="text-orange-500 cursor-pointer text-[14px] hover:underline lg:absolute bottom-[12%] right-0  text-sm font-semibold">
                    Read more
                  </div>
                </div>
              </div>

              {/* Blog list */}
              <div className="flex-1 overflow-y-auto pn:max-lg:overflow-y-scroll pn:max-md:max-h-[220px]   custom-scrollbar lg:max-h-[520px]">
                <div className="flex flex-col gap-2 ">
                  {translatedData?.map((blog, index) => (
                    <div
                      key={index}
                      className={`p-4   cursor-pointer transition-all  duration-200 ${
                        blog?.id === activeBlog?.id
                          ? " bg-orange-100/70 dark:bg-orange-500 border rounded-[15px] lg:scale-95  border-orange-300"
                          : "hover:bg-gray-200 hover:mx-2   hover:dark:bg-white/20 border-b  border-gray-200/60"
                      }`}
                      onClick={() => setActiveBlog(translatedData[index])}
                    >
                      <div className="flex items-center gap-2 font-[marcellus] text-sm font-semibold text-gray-800 dark:text-gray-100 ">
                        {blog?.icon || icons[blog?.iconName]}
                        {blog?.title}
                      </div>
                      <p
                        className="text-gray-600 text-sm dark:text-gray-100 leading-relaxed overflow-hidden line-clamp-1"
                        dangerouslySetInnerHTML={{
                          __html: stripImages(blog?.content || ""),
                        }}
                      ></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Keyframe Animations */}
      <style jsx global>{`
        @keyframes blogCardSmooth {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .blog-card-animate {
          animation: blogCardSmooth 0.4s ease-out;
          animation-fill-mode: both;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 5px;
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #fcd3a6;
          border-radius: 10px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #fcd3a6 transparent;
        }
      `}</style>
    </>
  );
}
