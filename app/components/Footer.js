"use client";

import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaChevronUp,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://costaricaninsurance.com/wp-json/mailchimp-for-wp/v1/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EMAIL: email, // Mailchimp requires this exact key
          }),
        }
      );

      const data = await response.json();
      console.log(data, "mailchimp response");

      if (response.ok && data.success) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        throw new Error(data.msg || "Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Subscription failed. Please try again.");
    }
  };
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});
  const [translatedBrand, setTranslatedBrand] = useState(
    "Costa Rican Insurance"
  );

  const texts = {
    heading: "Protect What Matters Most",
    subHeading:
      "From health to home, we provide insurance solutions that give you peace of mind and financial security when you need it most.",
    healthTitle: "Health Coverage",
    healthDesc:
      "Comprehensive plans to safeguard your family’s health and well-being.",
    homeTitle: "Home Protection",
    homeDesc: "Secure your home and belongings against unexpected risks.",
    vehicleTitle: "Vehicle Insurance",
    vehicleDesc:
      "Affordable auto insurance with fast claims and trusted coverage.",
    companyDesc:
      "We make protecting what matters simple, clear, and accessible, whether you’re a local resident, expat, student, or traveler in Costa Rica.",
    quickLinks: "Quick Links",
    about: "About",
    insurance: "Insurance",
    pages: "Pages",
    importantLinks: "Important Links",
    contactUs: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    topCategories: "Top Categories",
    life: "Life Insurance",
    vehicle: "Vehicle Insurance",
    health: "Health Insurance",
    copyright: "Copyright © 2025 CostaRican Insurance -- All rights reserved.",
  };

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
    async function doTranslate() {
      if (language === "en") {
        setTranslations(texts);
        return;
      }
      const entries = Object.entries(texts);
      const translated = {};
      const translatedBrandName = await translateText(
        "Costa Rican Insurance",
        language
      );
      setTranslatedBrand(translatedBrandName);
      for (let [key, value] of entries) {
        translated[key] = await translateText(value, language);
      }
      setTranslations(translated);
    }
    doTranslate();
  }, [language]);

  const scrollToTop = () => {
    const el = document.getElementById("main-scroll");
    el?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white dark:bg-black  w-full">
      <div className="flex flex-col items-stretch mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="bg-[#fca311] rounded-[20px] px-6 py-10 sm:px-10 md:px-14 lg:px-20 my-10 w-full relative overflow-hidden min-h-[200px]">
          {/* Decorative gradients */}
          <div className="absolute top-[-30px] left-[-30px] w-[clamp(60px,15vw,120px)] h-[clamp(60px,15vw,120px)] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)_2px,transparent_2px,transparent_4px)] rounded-full z-0" />
          <div className="absolute bottom-[-30px] right-[-30px] w-[clamp(60px,15vw,120px)] h-[clamp(60px,15vw,120px)] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.2),rgba(255,255,255,0.2)_2px,transparent_2px,transparent_4px)] rounded-full z-0" />

          <div className="relative z-10  flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 w-full">
            <div className="text-white dark:text-gray-900  flex-1 min-w-0 text-center md:text-left">
              <h2 className="text-[clamp(1.25rem,4vw,2rem)]  font-[Marcellus] font-bold leading-tight mb-2">
                {/* Subscribe our newsletter */}
                {translations.heading || texts.heading}
              </h2>
              <p className="text-[clamp(0.85rem,2.5vw,0.95rem)] opacity-90 leading-relaxed">
                {translations.subHeading || texts.subHeading}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white dark:text-gray-900 flex-1">
              <div className="flex flex-col items-center text-center bg-[#14213d]/20  backdrop-blur-sm rounded-2xl p-4">
                <h3 className="font-semibold text-lg">
                  {translations.healthTitle || texts.healthTitle}
                </h3>
                <p className="text-[12px] mt-2  opacity-80">
                  {translations.healthDesc || texts.healthDesc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-[#14213d]/20 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="font-semibold text-lg">
                  {" "}
                  {translations.homeTitle || texts.homeTitle}
                </h3>
                <p className="text-[12px] mt-2 opacity-80">
                  {translations.homeDesc || texts.homeDesc}
                </p>
              </div>
              <div className="flex flex-col items-center text-center bg-[#14213d]/20 backdrop-blur-sm rounded-2xl p-4">
                <h3 className="font-semibold text-lg">
                  {translations.vehicleTitle || texts.vehicleTitle}
                </h3>
                <p className="text-[12px] mt-2  opacity-80">
                  {translations.vehicleDesc || texts.vehicleDesc}
                </p>
              </div>
            </div>
          </div>
          {/* <form
              onSubmit={handleSubmit}
              className="flex items-center bg-white rounded-full shadow-md min-w-[280px] max-w-[400px] w-full h-[clamp(42px,6vw,50px)] overflow-hidden"
            >
              <input
                type="email"
                placeholder="Enter your email ..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none px-4 text-[clamp(0.85rem,2vw,0.95rem)] h-full"
              />
              <button
                type="submit"
                className="bg-[#14213d] text-white h-full w-[clamp(45px,8vw,60px)] text-[clamp(1.5rem,3vw,2rem)] flex items-center justify-center rounded-bl-full transition-transform duration-300 hover:bg-[#0f172a] hover:scale-105 active:scale-95"
              >
                ✓
              </button>
            </form>
            {message && (
              <p className="mt-2 text-sm text-white text-center md:text-left">
                {message}
              </p>
            )} */}
          {/* </div> */}
        </section>

        {/* Main Footer Content */}
        <div className="flex flex-col w-full  md:flex-row flex-wrap ">
          {/* Company Info */}
          <div className="flex-1 min-w-[300px]  md:border-r border-gray-300 p-2 lg:max-w-[600px]">
            {/* <div className="w-[250px]">
              <Image src={wordlogo} alt="logo" />
            </div> */}
            <Link href={"/"} className="flex -ml-5 items-center ">
              <Image
                src={logo}
                alt="logo"
                className="cursor-pointer w-[50px]  sm:w-[60px] md:w-[70px]"
              />
              <div className="flex-shrink-0 ">
                <span
                  className="text-lg dark:text-white sm:text-xl md:text-[1.67rem] font-normal text-[#121212]"
                  style={{ fontFamily: "Marcellus, serif" }}
                >
                  {translatedBrand}
                </span>
              </div>
            </Link>
            <p className="mt-4 dark:text-gray-200 text-gray-500 max-w-sm">
              {translations.companyDesc}
            </p>
            <a
              href="mailto:info@costaricaninsurance.com"
              className="mt-4 inline-block font-semibold dark:text-white text-gray-700  hover:text-amber-500"
            >
              info@costaricaninsurance.com
            </a>
            <div className="mt-6 flex space-x-3">
              <a
                href="#"
                className="text-[#B79C75] border-2 border-[#B79C75] rounded-full p-2 hover:bg-[#B79c75] hover:text-white hover:border-[#B79c75] transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#B79C75] border-2 border-[#B79C75] rounded-full p-2 hover:bg-[#B79c75] hover:text-white hover:border-[#B79c75] transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#B79C75] border-2 border-[#B79C75] rounded-full p-2 hover:bg-[#B79c75] hover:text-white hover:border-[#B79c75] transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#B79C75] border-2 border-[#B79C75] rounded-full p-2 hover:bg-[#B79c75] hover:text-white hover:border-[#B79c75] transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="justify-between w-full flex-1 min-w-[300px] lg:max-w-[600px]">
            <div className="h-[100px] w-full border-b border-gray-300  "></div>
            <div className="flex flex-1  flex-wrap gap-8 p-4 justify-between min-w-[300px]">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white font-[Marcellus] border-b border-[#B79C75] tracking-wider text-sm">
                  {translations.quickLinks || "Quick Links"}
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/about-us"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.about || "About Us"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.insurance || "Insurance"}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.pages || "Pages"}
                    </Link>
                  </li>

                  {/* <li>
                    <Link
                      href="#"
                      className="text-gray-700 hover:text-amber-500 font-medium"
                    >
                      F.A.Qs
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div>
                <h4 className="font-bold dark:text-white text-gray-900 font-[Marcellus]  border-b border-[#B79C75] tracking-wider text-sm">
                  {translations.importantLinks}
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/contact-us"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.contactUs || "Contact Us"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.privacy || "Privacy Policy"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.terms || "Terms & Conditions"}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white  font-[Marcellus]  border-b border-[#B79C75]  tracking-wider text-sm">
                  {translations.topCategories || "Top Categories"}
                </h4>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/life-insurance"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.life || "Life Insurance"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/car-insurance"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.vehicle || "Vehicle Insurance"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/health-insurance"
                      className="text-gray-700 dark:text-gray-200 hover:text-amber-500 font-medium"
                    >
                      {translations.health || "Health Insurance"}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-200">
          <p className="text-center sm:text-left">
            {translations.copyright ||
              "Copyright © 2025 CostaRican Insurance -- All rights reserved."}
          </p>
          <button
            onClick={scrollToTop}
            type="button"
            className="mt-4 sm:mt-0 h-9 w-9 rounded-3xl bg-[#1E3161] dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center hover:bg-blue-800 transition-colors"
            aria-label="Back to top"
          >
            <FaChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
