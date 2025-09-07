"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { GET_HERO_AND_STATS, graphQLClient } from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";

const PopularBlogs = ({ mortgagesdata }) => {
  const [insurancedata, setInsurancedata] = useState([]);
  const router = useRouter();
  const { language } = useLanguage();
  const [mortgage, setMortgages] = useState({});
  const [translatedData, setTranslatedData] = useState([]);
  const [heading, setHeading] = useState("Latest Mortgages");
  const [subHeading, setSubHeading] = useState(
    "Ideas, trends, and inspiration for a brighter future"
  );
  const [viewMoreText, setViewMoreText] = useState("View More");
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await graphQLClient.request(GET_HERO_AND_STATS);

        data?.categories?.nodes?.forEach((category) => {
          if (category?.slug === "insurance") {
            setInsurancedata(category?.children?.nodes);
          }
          if (category?.slug === "mortgages") {
            setMortgages(category);
          }
        });
      } catch (err) {
        console.error("GraphQL Error:", err);
      }
    }

    fetchData();
  }, []);
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

  // Translate static + dynamic content
  useEffect(() => {
    async function doTranslation() {
      if (!mortgagesdata?.length) return;

      // Static texts
      const [translatedHeading, translatedSubHeading, translatedViewMore] =
        await Promise.all([
          translateText("Latest Mortgages", language),
          translateText(
            "Ideas, trends, and inspiration for a brighter future",
            language
          ),
          translateText("View More", language),
        ]);

      setHeading(translatedHeading);
      setSubHeading(translatedSubHeading);
      setViewMoreText(translatedViewMore);

      // Dynamic mortgage data titles
      const translatedBlogs = await Promise.all(
        mortgagesdata.map(async (item) => {
          const translatedTitle = await translateText(item?.title, language);
          return { ...item, title: translatedTitle };
        })
      );

      setTranslatedData(translatedBlogs);
    }

    doTranslation();
  }, [language, mortgagesdata]);

  const displayData =
    translatedData.length > 0 ? translatedData : mortgagesdata;
  console.log(displayData, "displayData");
  return (
    <div className="flex flex-col items-center  px-6 py-16 font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold  dark:text-gray-300 font-[marcellus] mb-2">
          {heading}
        </h2>
        <p className="text-gray-600 text-lg dark:text-gray-300">{subHeading}</p>
      </div>

      {/* Blog Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center sm:w-[60%] md:w-full">
        {/* Left Column: One Tall Card */}
        <div className="w-full lg:w-2/5 ">
          <div
            onClick={() => {
              sessionStorage.setItem(
                "blogContent",
                JSON.stringify({
                  content: displayData?.[0]?.content,
                  title: displayData?.[0]?.title,
                  postid: displayData?.[0]?.id,
                  image: displayData?.[0]?.featuredImage?.node?.sourceUrl,
                  latestposts: displayData,
                })
              );
              // No new tab
              window.open(
                `/blog/${displayData?.[0]?.title.replace(/\s+/g, "-")}/${
                  displayData?.[0]?.id
                }`,
                "_self"
              );
            }}
            className="flex flex-col dark:bg-[#171717] bg-gray-50  rounded-3xl overflow-hidden hover:scale-105 duration-150 lg:h-[550px] w-full"
          >
            <img
              src={displayData?.[0]?.featuredImage?.node?.sourceUrl}
              alt={displayData?.[0]?.title}
              className="w-full dark:text-gray-300 h-[300px]  rounded-3xl lg:h-2/3 object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h3 className="text-[24px] lg:text-[28px] font-[marcellus] font-bold text-gray-900 dark:text-gray-100 mb-3 break-words">
                {displayData?.[0]?.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-auto">
                {/* <div className="flex items-center gap-2">
                  <img
                    src="/blog/card1logo.png"
                    alt="Clara Wilson"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>Clara Wilson</span>
                </div> */}
                {/* <span>Nov 29, 2024</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Two Cards */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          {/* Card 1 */}
          <div
            onClick={() => {
              sessionStorage.setItem(
                "blogContent",
                JSON.stringify({
                  content: displayData?.[1]?.content,
                  title: displayData?.[1]?.title,
                  postid: displayData?.[1]?.id,
                  image: displayData?.[1]?.featuredImage?.node?.sourceUrl,
                  latestposts: displayData,
                })
              );
              // No new tab
              window.open(
                `/blog/${displayData?.[1]?.title.replace(/\s+/g, "-")}/${
                  displayData?.[1]?.id
                }`,
                "_self"
              );
            }}
            className="flex flex-col md:flex-row bg-gray-50 dark:bg-[#171717] rounded-3xl overflow-hidden hover:scale-105 duration-150 w-full lg:h-[260px]"
          >
            {/* Image */}
            <div className="w-full md:w-[40%] h-[200px] lg:h-full">
              <img
                src={displayData?.[1]?.featuredImage?.node?.sourceUrl}
                alt={displayData?.[1]?.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="w-full md:w-[60%] p-4 flex flex-col justify-between">
              <h3 className="text-[24px] lg:text-[30px] font-bold font-[marcellus] text-gray-900 dark:text-gray-100 mb-3 break-words">
                {displayData?.[1]?.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mt-auto">
                {/* <div className="flex items-center gap-2">
                  <img
                    src="/blog/card2logo.png"
                    alt="Amelia Scott"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>Amelia Scott</span>
                </div> */}
                {/* <span>Nov 29, 2024</span> */}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              sessionStorage.setItem(
                "blogContent",
                JSON.stringify({
                  content: displayData?.[2]?.content,
                  title: displayData?.[2]?.title,
                  postid: displayData?.[2]?.id,
                  image: displayData?.[2]?.featuredImage?.node?.sourceUrl,
                  latestposts: displayData,
                })
              );
              // No new tab
              window.open(
                `/blog/${displayData?.[2]?.title.replace(/\s+/g, "-")}/${
                  displayData?.[2]?.id
                }`,
                "_self"
              );
            }}
            className="flex flex-col md:flex-row bg-gray-50 dark:bg-[#171717] rounded-3xl overflow-hidden hover:scale-105 duration-150 w-full lg:h-[260px]"
          >
            {/* Image */}
            <div className="w-full lg:w-[40%] h-[200px] lg:h-full">
              <img
                src={displayData?.[2]?.featuredImage?.node?.sourceUrl}
                alt={displayData?.[2]?.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="w-full lg:w-[60%] p-4 flex flex-col justify-between">
              <h3 className="text-[24px] lg:text-[30px] font-bold font-[marcellus] text-gray-900  dark:text-gray-100 mb-3 break-words">
                {displayData?.[2]?.title}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mt-auto">
                {/* <div className="flex items-center gap-2">
                  <img
                    src={mortgagesdata?.[2]?.featuredImage?.node?.sourceUrl}
                    alt="Blog 3"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>Oliver Grant</span>
                </div> */}
                {/* <span>Nov 29, 2024</span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* View More Button */}
      <div className="mt-20 text-center">
        <button
          onClick={() => {
            sessionStorage.setItem("selectedType", JSON.stringify(mortgage));
            router.push("/mortgages");
          }}
          className="bg-yellow-400 dark:bg-yellow-800 mt-2 cursor-pointer hover:bg-yellow-300 hover:dark:bg-yellow-700 text-black dark:text-white font-semibold px-10 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {viewMoreText}
        </button>
      </div>
    </div>
  );
};

export default PopularBlogs;
