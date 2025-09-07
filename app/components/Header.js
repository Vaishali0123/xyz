// "use client";
// import Image from "next/image";
// import React, { Suspense, useEffect, useRef, useState } from "react";
// import Logo from "../../app/assets/logo.png";
// // import wordLogo from "../../app/assets/wordlogo.png";
// import Link from "next/link";
// import { IoSearch } from "react-icons/io5";
// import { HiX } from "react-icons/hi";
// import { useRouter } from "next/navigation";
// import { useLanguage } from "../context/LanguageContext";
// import { GET_HERO_AND_STATS, graphQLClient } from "../lib/utils";
// import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
// import { FiX } from "react-icons/fi";
// import { HiMenuAlt3 } from "react-icons/hi";

// const Header = () => {
//   const [showInsuranceMenu, setShowInsuranceMenu] = useState(false);
//   const [menuOpenedByClick, setMenuOpenedByClick] = useState(false);
//   const [menu, setMenu] = useState(true);
//   const [activeType, setActiveType] = useState(0);
//   const [dark, setDark] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [open1, setOpen1] = useState(false);
//   const router = useRouter();

//   const [query, setQuery] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const { language, setLanguage } = useLanguage();
//   const wrapperRef = useRef(null);
//   const [insuranceTypes, setInsuranceTypes] = useState([]);
//   const [mortgagesdata, setMortgagesdata] = useState([]);
//   const [brandname, setBrandname] = useState("Costa Rican Insurance");

//   const languages = [
//     { code: "en", label: "English", flag: "🇺🇸" },
//     { code: "hi", label: "हिंदी", flag: "🇮🇳" },
//     { code: "es", label: "Español", flag: "🇪🇸" },
//     { code: "fr", label: "Français", flag: "🇫🇷" },
//     { code: "de", label: "Deutsch", flag: "🇩🇪" },
//     { code: "zh", label: "中文", flag: "🇨🇳" },
//     { code: "ar", label: "العربية", flag: "🇸🇦" },
//     { code: "ru", label: "Русский", flag: "🇷🇺" },
//     { code: "ja", label: "日本語", flag: "🇯🇵" },
//     { code: "ko", label: "한국어", flag: "🇰🇷" },
//     { code: "pt", label: "Português", flag: "🇵🇹" },
//     { code: "it", label: "Italiano", flag: "🇮🇹" },
//     { code: "tr", label: "Türkçe", flag: "🇹🇷" },
//   ];
//   const currentLang = languages.find((l) => l.code === language);

//   // const switchLang = (lang) => {
//   //   const currentUrl = new URL(window.location.href);
//   //   currentUrl.searchParams.set("lang", lang);
//   //   router.push(currentUrl.toString());
//   //   setOpen(false);
//   // };
//   useEffect(() => {
//     // Load saved theme
//     if (localStorage.getItem("theme") === "dark") {
//       document.documentElement.classList.add("dark");
//       setDark(true);
//     }
//   }, []);
//   const toggleTheme = () => {
//     if (dark) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setDark(false);
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setDark(true);
//     }
//   };
//   const [navLinks, setNavLinks] = useState([
//     { href: "/", label: "Home", id: "home" },

//     { href: "#", label: "Insurance", id: "insurance" },
//     { href: "/mortgages", label: "Mortgages", id: "mortgages" },
//     { href: "../about-us", label: "About Us", id: "about" },
//     { href: "/contact-us", label: "Contact", id: "contact" },
//   ]);

//   const handleInputChange = (e) => {
//     const input = e.target.value;
//     setQuery(input);
//     const filtered = insuranceTypes.filter((opt) =>
//       opt?.name?.toLowerCase().includes(input.toLowerCase())
//     );
//     setSuggestions(filtered);
//   };

//   useEffect(() => {
//     // close search on outside click
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setOpen1(false);
//         setQuery("");
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   // Get insurance data
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await graphQLClient.request(GET_HERO_AND_STATS);
//         // let data = null;
//         // const storedData = sessionStorage.getItem("data");

//         // if (storedData) {
//         //   // Parse stored data only once
//         //   data = JSON.parse(storedData);
//         // } else {
//         //   // Fetch from API if no sessionStorage data
//         //   data = await graphQLClient.request(GET_HERO_AND_STATS);
//         //   sessionStorage.setItem("data", JSON.stringify(data));
//         // }
//         data?.categories?.nodes?.forEach((category) => {
//           if (category?.slug === "insurance") {
//             setInsuranceTypes(category?.children.nodes);
//           }
//           if (category?.slug === "mortgages") {
//             setMortgagesdata(category);
//           }
//         });
//       } catch (err) {
//         console.error("GraphQL Error:", err);
//       }
//     }

//     fetchData();
//   }, []);
//   async function translateText(text, targetLang) {
//     if (!text || targetLang === "en") return text;
//     try {
//       const res = await fetch("/api/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text, targetLang }),
//       });
//       const data = await res.json();
//       return data.translatedText || text;
//     } catch (err) {
//       console.error("Translation error:", err);
//       return text;
//     }
//   }
//   useEffect(() => {
//     async function doTranslation() {
//       const home = await translateText("Home", language);
//       const insurance = await translateText("Insurance", language);
//       const mortgages = await translateText("Mortgages", language);
//       const aboutus = await translateText("About Us", language);
//       const contact = await translateText("Contact", language);
//       const brand = await translateText(brandname, language);
//       setBrandname(brand);

//       setNavLinks([
//         { href: "/", label: home, id: "home" },
//         { href: "/", label: insurance, id: "insurance" },
//         { href: "/mortgages", label: mortgages, id: "mortgages" },
//         { href: "../about-us", label: aboutus, id: "about" },
//         { href: "/contact-us", label: contact, id: "contact" },
//       ]);
//       const translated = await Promise.all(
//         insuranceTypes.map(async (type) => ({
//           ...type,
//           name: await translateText(type.name, language),
//           posts: {
//             ...type.posts,
//             nodes: await Promise.all(
//               type.posts.nodes.map(async (post) => ({
//                 ...post,
//                 title: await translateText(post.title, language),
//               }))
//             ),
//           },
//         }))
//       );
//       setInsuranceTypes(translated);
//     }

//     doTranslation();
//   }, [language]);
//   return (
//     <div className="w-full h-[100px] flex justify-between items-center relative ">
//       <div className="absolute -top-20 left-0 w-full h-full justify-center items-center flex">
//         <div className="h-[70px] bg-[#f1cc94] dark:bg-[#000] rounded-full blur-2xl w-[97%]"></div>
//       </div>
//       <div className="w-full sm:h-[100px] flex justify-between items-center relative px-4">
//         {/* logo  */}
//         <div className="flex items-center">
//           <Image src={Logo} alt="logo" width={50} height={50} />
//           <div className="flex-shrink-0 ">
//             <span
//               className={`pn:max-sm:text-sm ${
//                 open1
//                   ? "pn:max-sm:hidden text-lg dark:text-white sm:text-xl md:text-[1.67rem] font-normal text-[#121212]"
//                   : "text-lg dark:text-white sm:text-xl md:text-[1.67rem] font-normal text-[#121212]"
//               }`}
//               style={{ fontFamily: "Marcellus, serif" }}
//             >
//               {brandname}
//             </span>
//           </div>
//           {/* <Image src={wordLogo} alt="logo" className="w-[300px]" /> */}
//         </div>

//         {/* nav  */}
//         <div
//           className={`duration-300 flex gap-5 ease-in-out ${
//             menu
//               ? "pn:max-sm:scale-0 pn:max-sm:absolute pn:max-sm:top-[100%] pn:max-sm:left-0 "
//               : " pn:max-sm:flex-col dark:border-gray-800  flex  pn:max-sm:w-full pn:max-sm:absolute pn:max-sm:top-[100%] pn:max-sm:left-0 pn:max-sm:z-[9999] pn:max-sm:p-4 gap-5 dark:bg-[#000] pn:max-sm:border-b pn:max-sm:bg-[#fff] "
//           }`}
//         >
//           {navLinks.map(({ href, label, id }) =>
//             id === "insurance" ? (
//               <div
//                 key={label}
//                 onClick={() => {
//                   // Toggle popup on click
//                   setShowInsuranceMenu((prev) => !prev);
//                   setMenuOpenedByClick(true);
//                 }}
//                 onMouseEnter={() => {
//                   if (!menuOpenedByClick) {
//                     setShowInsuranceMenu(true);
//                   }
//                 }}
//                 onMouseLeave={() => {
//                   if (!menuOpenedByClick) {
//                     setShowInsuranceMenu(false);
//                     setActiveType(null);
//                   }
//                 }}
//                 className="relative   text-gray-600  font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
//               >
//                 <span
//                   className={`cursor-pointer dark:text-[#fff] text-gray-700 ${
//                     showInsuranceMenu && "border-b-1"
//                   }  `}
//                 >
//                   {label}
//                 </span>

//                 {/* Dropdown Mega Menu */}
//                 {showInsuranceMenu && (
//                   <div
//                     className="fixed top-16 left-1/2 -translate-x-1/2 w-[90vw] dark:text-[#fff]  md:w-[80vw] max-w-6xl dark:bg-black dark:border-[#171717] bg-white backdrop-blur-md bg-opacity-90 shadow-2xl border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 z-50 animate-fadeIn"
//                     onMouseLeave={() => {
//                       setShowInsuranceMenu(false);
//                       setActiveType(null);
//                     }}
//                   >
//                     {/* Left Column: Types */}
//                     <div className="w-full  md:w-1/3 space-y-2 overflow-y-auto max-h-[310px]">
//                       {insuranceTypes?.map((type, i) => (
//                         <div
//                           key={i}
//                           onClick={() => {
//                             sessionStorage.setItem(
//                               "selectedType",
//                               JSON.stringify(type)
//                             );

//                             router.push(`/${type?.slug}`);
//                             setMenu(!menu);
//                           }}
//                           onMouseEnter={() => setActiveType(i)}
//                           className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
//                             activeType === i
//                               ? "bg-[#ff7100] text-white"
//                               : "hover:bg-gray-100  dark:text-[#fff] text-gray-800"
//                           }`}
//                         >
//                           {type?.name}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Right Column: Options */}
//                     <div className="w-full md:w-2/3">
//                       {activeType !== null && (
//                         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                           {insuranceTypes?.[activeType]?.posts?.nodes?.map(
//                             (option, j) => (
//                               <li
//                                 key={j}
//                                 className="px-4 py-2 bg-gray-50 dark:bg-[#171717] rounded-md hover:bg-[#f1cc94] hover:text-[#003366] transition cursor-pointer"
//                               >
//                                 {option?.title}
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 onClick={() => {
//                   setMenu(!menu);
//                 }}
//                 key={label}
//                 href={href}
//                 className="text-gray-600 dark:text-[#fff] font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
//               >
//                 {label}
//               </Link>
//             )
//           )}
//           <button
//             onClick={toggleTheme}
//             className="text-gray-600 flex self-start sm:hidden dark:text-[#fff] font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
//           >
//             Change Theme
//           </button>
//         </div>
//         {/* lang/darkMode/search  */}
//         <div className="flex gap-4 items-center">
//           <div className=" top-4 right-6 pn:max-sm:hidden  flex gap-2">
//             <button
//               onClick={() => setOpen(!open)}
//               className="px-4 py-2 w-[70px] flex   items-center justify-evenly gap-2 border text-slate-500 dark:text-white  font-medium rounded-full  transition"
//             >
//               <span>{currentLang.flag}</span>
//               <span>{currentLang.code}</span>
//               {/* {languages.find((l) => l.code === currentLang)?.flag}{" "}
//               {languages.find((l) => l.code === currentLang)?.label ||
//                 "Select Language"} */}
//             </button>

//             {/* Dropdown */}
//             {open && (
//               <div className="absolute mt-2 top-16 w-50 bg-white dark:bg-black dark:border-gray-800 rounded-xl shadow-lg border z-[100000] overflow-hidden animate-fadeIn">
//                 {languages.map((lang) => (
//                   <button
//                     key={lang.code}
//                     onClick={() => {
//                       setLanguage(lang.code);
//                       setOpen(false);
//                     }}
//                     className={`flex items-center gap-2 w-full dark:text-gray-100 text-left px-4 py-2 text-sm hover:dark:text-black hover:dark:bg-white/50 hover:bg-orange-50 transition ${
//                       currentLang === lang.code
//                         ? "bg-orange-100 font-semibold text-orange-700"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     <span>{lang.flag}</span> {lang.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           <button
//             onClick={toggleTheme}
//             className="w-[40px] h-[40px] rounded-full border flex items-center justify-center dark:text-white pn:max-sm:hidden"
//           >
//             {dark ? (
//               <MdOutlineDarkMode size={14} className="w-[20px] h-[20px]" />
//             ) : (
//               <MdOutlineLightMode className="w-[25px] h-[25px]" />
//             )}
//           </button>

//           <div ref={wrapperRef} className="relative">
//             <div
//               className={`h-[40px] flex items-center duration-150 justify-evenly px-4 text-[14px] rounded-full ${
//                 open1 ? "w-[200px] bg-white text-black" : "bg-white text-black"
//               }`}
//             >
//               <input
//                 type="text"
//                 value={query}
//                 onChange={handleInputChange}
//                 placeholder="Search Insurance..."
//                 className={`transition-all duration-300 bg-transparent text-black outline-none ${
//                   open1
//                     ? "w-[150px] opacity-100"
//                     : "w-0 opacity-0 pointer-events-none"
//                 }`}
//               />

//               {open1 ? (
//                 <HiX
//                   className="cursor-pointer"
//                   onClick={() => {
//                     setOpen1(false);
//                     setQuery("");
//                     setSuggestions([]);
//                   }}
//                 />
//               ) : (
//                 <IoSearch
//                   className="cursor-pointer"
//                   onClick={() => setOpen1(true)}
//                 />
//               )}
//             </div>

//             {/* Suggestions Dropdown */}
//             {suggestions.length > 0 && open1 && (
//               <ul className="absolute top-full max-h-[80vh] overflow-y-auto mt-2 w-[200px] bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
//                 {suggestions.map((option, index) => (
//                   <li
//                     key={index}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
//                     onClick={() => {
//                       setQuery(option.name);
//                       setSuggestions([]);
//                       sessionStorage.setItem(
//                         "selectedType",
//                         JSON.stringify(option)
//                       );
//                       router.push(`/${option.slug}`);
//                     }}
//                   >
//                     {option.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <div
//             onClick={() => setMenu(!menu)}
//             className="sm:hidden h-[20px] w-[20px] dark:text-white"
//           >
//             {menu ? (
//               <HiMenuAlt3 className="h-full w-full" />
//             ) : (
//               <FiX className="h-full w-full" />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
"use client";
import Image from "next/image";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Logo from "../../app/assets/logo.png";
// import wordLogo from "../../app/assets/wordlogo.png";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { GET_HERO_AND_STATS, graphQLClient } from "../lib/utils";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";

const Header = () => {
  const [showInsuranceMenu, setShowInsuranceMenu] = useState(false);
  const [menuOpenedByClick, setMenuOpenedByClick] = useState(false);
  const [menu, setMenu] = useState(true);
  const [activeType, setActiveType] = useState(0);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { language, setLanguage } = useLanguage();
  const wrapperRef = useRef(null);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [mortgagesdata, setMortgagesdata] = useState([]);
  const [brandname, setBrandname] = useState("Costa Rican Insurance");

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  ];
  const currentLang = languages.find((l) => l.code === language);

  // const switchLang = (lang) => {
  //   const currentUrl = new URL(window.location.href);
  //   currentUrl.searchParams.set("lang", lang);
  //   router.push(currentUrl.toString());
  //   setOpen(false);
  // };
  useEffect(() => {
    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);
  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };
  const [navLinks, setNavLinks] = useState([
    { href: "/", label: "Home", id: "home" },

    { href: "#", label: "Insurance", id: "insurance" },
    { href: "/mortgages", label: "Mortgages", id: "mortgages" },
    { href: "../about-us", label: "About Us", id: "about" },
    { href: "/contact-us", label: "Contact", id: "contact" },
  ]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    const filtered = insuranceTypes.filter((opt) =>
      opt?.name?.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered);
  };

  useEffect(() => {
    // close search on outside click
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen1(false);
        setQuery("");
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Get insurance data
  useEffect(() => {
    async function fetchData() {
      try {
        // const data = await graphQLClient.request(GET_HERO_AND_STATS);
        let data = null;
        const storedData = sessionStorage.getItem("data");

        if (storedData) {
          // Parse stored data only once
          data = JSON.parse(storedData);
        } else {
          // Fetch from API if no sessionStorage data
          data = await graphQLClient.request(GET_HERO_AND_STATS);
          sessionStorage.setItem("data", JSON.stringify(data));
        }
        data?.categories?.nodes?.forEach((category) => {
          if (category?.slug === "insurance") {
            setInsuranceTypes(category?.children.nodes);
          }
          if (category?.slug === "mortgages") {
            setMortgagesdata(category);
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
  useEffect(() => {
    async function doTranslation() {
      const home = await translateText("Home", language);
      const insurance = await translateText("Insurance", language);
      const mortgages = await translateText("Mortgages", language);
      const aboutus = await translateText("About Us", language);
      const contact = await translateText("Contact", language);
      const brand = await translateText(brandname, language);
      setBrandname(brand);

      setNavLinks([
        { href: "/", label: home, id: "home" },
        { href: "/", label: insurance, id: "insurance" },
        { href: "/mortgages", label: mortgages, id: "mortgages" },
        { href: "../about-us", label: aboutus, id: "about" },
        { href: "/contact-us", label: contact, id: "contact" },
      ]);
      const translated = await Promise.all(
        insuranceTypes.map(async (type) => ({
          ...type,
          name: await translateText(type.name, language),
          posts: {
            ...type.posts,
            nodes: await Promise.all(
              type.posts.nodes.map(async (post) => ({
                ...post,
                title: await translateText(post.title, language),
              }))
            ),
          },
        }))
      );
      setInsuranceTypes(translated);
    }

    doTranslation();
  }, [language]);
  return (
    <div className="w-full h-[100px] flex justify-between items-center relative ">
      <div className="absolute -top-20 left-0 w-full h-full justify-center items-center flex">
        <div className="h-[70px] bg-[#f1cc94] dark:bg-[#000] rounded-full blur-2xl w-[97%]"></div>
      </div>
      <div className="w-full sm:h-[100px] flex justify-between items-center relative px-4">
        {/* logo  */}
        <Link href="/" className="flex cursor-pointer items-center">
          <Image src={Logo} alt="logo" width={50} height={50} />
          <div className="flex-shrink-0 ">
            <span
              className={`pn:max-sm:text-sm ${
                open1
                  ? "pn:max-sm:hidden text-lg dark:text-white sm:text-xl md:text-[1.67rem] font-normal text-[#121212]"
                  : "text-lg dark:text-white sm:text-xl md:text-[1.67rem] font-normal text-[#121212]"
              }`}
              style={{ fontFamily: "Marcellus, serif" }}
            >
              {brandname}
            </span>
          </div>
          {/* <Image src={wordLogo} alt="logo" className="w-[300px]" /> */}
        </Link>

        {/* nav  */}
        <div
          className={`duration-300 flex gap-5 ease-in-out ${
            menu
              ? "pn:max-sm:scale-0 pn:max-sm:absolute pn:max-sm:top-[100%] pn:max-sm:left-0 "
              : " pn:max-sm:flex-col dark:border-gray-800  flex  pn:max-sm:w-full pn:max-sm:absolute pn:max-sm:top-[100%] pn:max-sm:left-0 pn:max-sm:z-[9999] pn:max-sm:p-4 gap-5 dark:bg-[#000] pn:max-sm:border-b pn:max-sm:bg-[#fff] "
          }`}
        >
          {navLinks.map(({ href, label, id }) =>
            id === "insurance" ? (
              <div
                key={label}
                onClick={() => {
                  // Toggle popup on click
                  setShowInsuranceMenu((prev) => !prev);
                  setMenuOpenedByClick(true);
                }}
                onMouseEnter={() => {
                  if (!menuOpenedByClick) {
                    setShowInsuranceMenu(true);
                  }
                }}
                onMouseLeave={() => {
                  if (!menuOpenedByClick) {
                    setShowInsuranceMenu(false);
                    setActiveType(null);
                  }
                }}
                className="relative   text-gray-600  font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
              >
                <span
                  className={`cursor-pointer dark:text-[#fff] text-gray-700 ${
                    showInsuranceMenu && "border-b-1"
                  }  `}
                >
                  {label}
                </span>

                {/* Dropdown Mega Menu */}
                {showInsuranceMenu && (
                  <div
                    className="fixed top-16 left-1/2 -translate-x-1/2 w-[90vw] dark:text-[#fff]  md:w-[80vw] max-w-6xl dark:bg-black dark:border-[#171717] bg-white backdrop-blur-md bg-opacity-90 shadow-2xl border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 z-50 animate-fadeIn"
                    onMouseLeave={() => {
                      setShowInsuranceMenu(false);
                      setActiveType(null);
                    }}
                  >
                    {/* Left Column: Types */}
                    <div className="w-full  md:w-1/3 space-y-2 overflow-y-auto max-h-[310px]">
                      {insuranceTypes?.map((type, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedType",
                              JSON.stringify(type)
                            );

                            router.push(`/${type?.slug}`);
                            setMenu(!menu);
                          }}
                          onMouseEnter={() => setActiveType(i)}
                          className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
                            activeType === i
                              ? "bg-[#ff7100] text-white"
                              : "hover:bg-gray-100  dark:text-[#fff] text-gray-800"
                          }`}
                        >
                          {type?.name}
                        </div>
                      ))}
                    </div>

                    {/* Right Column: Options */}
                    <div className="w-full md:w-2/3">
                      {activeType !== null && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          {insuranceTypes?.[activeType]?.posts?.nodes?.map(
                            (option, j) => (
                              <li
                                key={j}
                                className="px-4 py-2 bg-gray-50 dark:bg-[#171717] rounded-md hover:bg-[#f1cc94] hover:text-[#003366] transition cursor-pointer"
                              >
                                {option?.title}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                onClick={() => {
                  setMenu(!menu);
                }}
                key={label}
                href={href}
                className="text-gray-600 dark:text-[#fff] font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
              >
                {label}
              </Link>
            )
          )}
          <button
            onClick={toggleTheme}
            className="text-gray-600 flex self-start sm:hidden dark:text-[#fff] font-[Marcellus] hover:border-orange-500 font-semibold border-transparent duration-300 border-b-2 text-[14px] hover:text-[#171717] hover:dark:text-[#fff] transition-colors "
          >
            Change Theme
          </button>
        </div>
        {/* lang/darkMode/search  */}
        <div className="flex gap-4 items-center">
          <div className=" top-4 right-6 pn:max-sm:hidden  flex gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="px-4 py-2 w-[70px] flex   items-center justify-evenly gap-2 border text-slate-500 dark:text-white  font-medium rounded-full  transition"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code}</span>
              {/* {languages.find((l) => l.code === currentLang)?.flag}{" "}
              {languages.find((l) => l.code === currentLang)?.label ||
                "Select Language"} */}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute mt-2 top-16 w-50 bg-white dark:bg-black dark:border-gray-800 rounded-xl shadow-lg border z-[100000] overflow-hidden animate-fadeIn">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full dark:text-gray-100 text-left px-4 py-2 text-sm hover:dark:text-black hover:dark:bg-white/50 hover:bg-orange-50 transition ${
                      currentLang === lang.code
                        ? "bg-orange-100 font-semibold text-orange-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{lang.flag}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="w-[40px] h-[40px] rounded-full border flex items-center justify-center dark:text-white pn:max-sm:hidden"
          >
            {dark ? (
              <MdOutlineDarkMode size={14} className="w-[20px] h-[20px]" />
            ) : (
              <MdOutlineLightMode className="w-[25px] h-[25px]" />
            )}
          </button>

          <div ref={wrapperRef} className="relative">
            <div
              className={`h-[40px] flex items-center duration-150 justify-evenly px-4 text-[14px] rounded-full ${
                open1 ? "w-[200px] bg-white text-black" : "bg-white text-black"
              }`}
            >
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search Insurance..."
                className={`transition-all duration-300 bg-transparent text-black outline-none ${
                  open1
                    ? "w-[150px] opacity-100"
                    : "w-0 opacity-0 pointer-events-none"
                }`}
              />

              {open1 ? (
                <HiX
                  className="cursor-pointer"
                  onClick={() => {
                    setOpen1(false);
                    setQuery("");
                    setSuggestions([]);
                  }}
                />
              ) : (
                <IoSearch
                  className="cursor-pointer"
                  onClick={() => setOpen1(true)}
                />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && open1 && (
              <ul className="absolute top-full max-h-[80vh] overflow-y-auto mt-2 w-[200px] bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
                {suggestions.map((option, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                    onClick={() => {
                      setQuery(option.name);
                      setSuggestions([]);
                      sessionStorage.setItem(
                        "selectedType",
                        JSON.stringify(option)
                      );
                      router.push(`/${option.slug}`);
                    }}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            onClick={() => setMenu(!menu)}
            className="sm:hidden h-[20px] w-[20px] dark:text-white"
          >
            {menu ? (
              <HiMenuAlt3 className="h-full w-full" />
            ) : (
              <FiX className="h-full w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
