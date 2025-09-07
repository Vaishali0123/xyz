// "use client";
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { CiPlay1 } from "react-icons/ci";
// import AnimatedOverlayCarousel from "./AnimatedOverlayCarousel";
// import Link from "next/link";
// import { FaArrowRight } from "react-icons/fa";
// import { useLanguage } from "../context/LanguageContext";
// import { GET_HERO_AND_STATS, graphQLClient, translateText } from "../lib/utils";
// import { useRouter } from "next/navigation";

// export default function Hero() {
//   const labels = ["Life Insurance", "Car Insurance", "Education Savings"];
//   const headingText = "We guarantee the future of the things you care about!";
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const { language } = useLanguage();
//   const [cardata, setCardata] = useState({});
//   const [lifedata, setlifedata] = useState({});
//   const [healthdata, sethealthdata] = useState({});
//   const [cardataposts, setCardataposts] = useState([]);
//   const [lifedataposts, setLifedataposts] = useState([]);
//   const [healthdataposts, setHealthdataposts] = useState([]);
//   const [isMobile, setIsMobile] = useState(false);
//   const [translatedData, setTranslatedData] = useState({
//     lifedata: {},
//     cardata: {},
//     healthdata: {},
//     lifedataposts: [],
//     cardataposts: [],
//     healthdataposts: [],
//   });

//   // Enhanced Animation states
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [previousIndex, setPreviousIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [titleDirection, setTitleDirection] = useState("right");
//   const [cardsDirection, setCardsDirection] = useState("up");
//   const intervalRef = useRef(null);
//   const titleTimeoutRef = useRef(null);

//   // Detect mobile screen size with debouncing
//   useEffect(() => {
//     let timeoutId;
//     const handleResize = () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         setIsMobile(window.innerWidth < 640);
//       }, 100);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       clearTimeout(timeoutId);
//     };
//   }, []);

//   // Get GraphQL Data
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // const data = await graphQLClient.request(GET_HERO_AND_STATS);
//         let data = null;
//         const storedData = sessionStorage.getItem("data");

//         if (storedData) {
//           // Parse stored data only once
//           data = JSON.parse(storedData);
//         } else {
//           // Fetch from API if no sessionStorage data
//           data = await graphQLClient.request(GET_HERO_AND_STATS);
//           sessionStorage.setItem("data", JSON.stringify(data));
//         }
//         data?.categories?.nodes?.forEach((category) => {
//           if (category?.slug === "car-insurance") {
//             setCardata(category?.posts.nodes[0]);
//             setCardataposts(category?.posts.nodes);
//           }
//           if (category?.slug === "health-insurance") {
//             sethealthdata(category.posts.nodes[0]);
//             setHealthdataposts(category?.posts.nodes);
//           }
//           if (category?.slug === "life-insurance") {
//             setlifedata(category.posts.nodes[0]);
//             setLifedataposts(category?.posts.nodes);
//           }
//         });
//       } catch (err) {
//         console.error("GraphQL Error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   // Translation function
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

//   // Enhanced transition function with improved timing and direction detection
//   const changeActiveIndex = useCallback(
//     (newIndex, userTriggered = false) => {
//       if (isTransitioning || newIndex === activeIndex) return;

//       // Determine animation directions
//       const titleDir = newIndex > activeIndex ? "left" : "right";
//       const cardsDir = userTriggered
//         ? "fade"
//         : newIndex > activeIndex
//         ? "up"
//         : "down";

//       setTitleDirection(titleDir);
//       setCardsDirection(cardsDir);
//       setPreviousIndex(activeIndex);
//       setIsTransitioning(true);

//       // Clear any existing title timeout
//       if (titleTimeoutRef.current) {
//         clearTimeout(titleTimeoutRef.current);
//       }

//       // Staggered animation timing for better visual flow
//       titleTimeoutRef.current = setTimeout(() => {
//         setActiveIndex(newIndex);

//         // Reset transition state after animation completes
//         setTimeout(() => {
//           setIsTransitioning(false);
//         }, 400);
//       }, 100);
//     },
//     [activeIndex, isTransitioning]
//   );

//   // Auto-cycle with smooth transitions
//   useEffect(() => {
//     const startInterval = () => {
//       intervalRef.current = setInterval(() => {
//         const nextIndex = (activeIndex + 1) % labels.length;
//         changeActiveIndex(nextIndex, false);
//       }, 4000); // Slightly longer interval for better readability
//     };

//     if (!isTransitioning) {
//       startInterval();
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [activeIndex, labels.length, isTransitioning, changeActiveIndex]);

//   // Handle manual button clicks with improved UX
//   const handleButtonClick = useCallback(
//     (index) => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }

//       changeActiveIndex(index, true);

//       // Restart auto-cycle after manual interaction with longer delay
//       setTimeout(() => {
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//         }
//         intervalRef.current = setInterval(() => {
//           const nextIndex = (index + 1) % labels.length;
//           changeActiveIndex(nextIndex, false);
//         }, 4000);
//       }, 6000); // 6 second delay before restarting auto-cycle
//     },
//     [changeActiveIndex, labels.length]
//   );

//   // Translation effect
//   useEffect(() => {
//     async function handleTranslation() {
//       if (!lifedata?.title && !cardata?.title && !healthdata?.title) return;

//       const translatedLife = {
//         ...lifedata,
//         title: await translateText(lifedata?.title, language),
//       };
//       const translatedCar = {
//         ...cardata,
//         title: await translateText(cardata?.title, language),
//       };
//       const translatedHealth = {
//         ...healthdata,
//         title: await translateText(healthdata?.title, language),
//       };

//       const translatedLifePosts = await Promise.all(
//         lifedataposts.map(async (post) => ({
//           ...post,
//           title: await translateText(post.title, language),
//         }))
//       );
//       const translatedCarPosts = await Promise.all(
//         cardataposts.map(async (post) => ({
//           ...post,
//           title: await translateText(post.title, language),
//         }))
//       );
//       const translatedHealthPosts = await Promise.all(
//         healthdataposts.map(async (post) => ({
//           ...post,
//           title: await translateText(post.title, language),
//         }))
//       );
//       const translatedLabels = await Promise.all(
//         labels.map((label) => translateText(label, language))
//       );

//       const translatedHeading = await translateText(headingText, language);
//       setTranslatedData({
//         lifedata: translatedLife,
//         cardata: translatedCar,
//         healthdata: translatedHealth,
//         lifedataposts: translatedLifePosts,
//         cardataposts: translatedCarPosts,
//         healthdataposts: translatedHealthPosts,
//         labels: translatedLabels,
//         heading: translatedHeading,
//       });
//     }

//     handleTranslation();
//   }, [language, lifedata, cardata, healthdata]);

//   // Get current posts based on active index
//   const getCurrentPosts = () => {
//     return activeIndex === 0
//       ? translatedData?.lifedataposts
//       : activeIndex === 1
//       ? translatedData?.cardataposts
//       : translatedData?.healthdataposts;
//   };

//   // Get current title with animation
//   const getCurrentTitle = () => {
//     return activeIndex === 0
//       ? translatedData?.lifedata?.title
//       : activeIndex === 1
//       ? translatedData?.cardata?.title
//       : translatedData?.healthdata?.title;
//   };

//   // Cleanup function
//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//       if (titleTimeoutRef.current) {
//         clearTimeout(titleTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-full flex flex-col items-center justify-center py-20">
//       {/* Hero Content Flex Wrapper */}
//       <div className="relative flex px-4 sm:px-6 lg:px-8 flex-col items-center gap-10 md:flex-row md:items-start">
//         {/* Left Section - Text and Buttons */}
//         <div className="w-full max-w-lg text-center md:text-left">
//           {/* Main Heading with subtle entrance animation */}
//           <div className="text-[50px] pn:max-sm:text-[40px] font-[Marcellus] dark:text-white font-semibold animate-fade-in-up">
//             {translatedData.heading || headingText}
//           </div>

//           {/* Enhanced Animated Title Section */}
//           <div className="mt-4 h-[40px] dark:text-white text-gray-600 relative overflow-hidden">
//             <div
//               key={`title-${activeIndex}`}
//               className={`absolute inset-0 flex items-center transition-all duration-500 ease-out transform ${
//                 isTransitioning
//                   ? titleDirection === "left"
//                     ? "translate-x-full opacity-0"
//                     : "-translate-x-full opacity-0"
//                   : "translate-x-0 opacity-100"
//               }`}
//               style={{
//                 transitionDelay: isTransitioning ? "0ms" : "100ms",
//               }}
//             >
//               {getCurrentTitle()}
//             </div>
//           </div>

//           {/* Play Button with enhanced hover effects */}
//           <div className="mt-8 flex items-center justify-center gap-6 md:justify-start">
//             <button className="group relative flex h-16 w-16 items-center justify-center rounded-full dark:bg-[#191919] bg-[#f6f6f6] transition-all duration-300 hover:scale-110 hover:shadow-lg overflow-hidden">
//               <div className="absolute inset-0 rounded-full bg-[#1f1f1f] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//               <CiPlay1 className="h-8 w-8 dark:text-white text-[#191919] transition-transform duration-300 group-hover:scale-110 relative z-10" />
//               <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-colors duration-300"></div>
//             </button>
//           </div>

//           {/* Enhanced Button Section with improved animations */}
//           <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
//             {(translatedData?.labels?.length > 0
//               ? translatedData.labels
//               : labels
//             ).map((label, index) => (
//               <button
//                 key={`${label}-${index}`}
//                 onClick={() => handleButtonClick(index)}
//                 disabled={isTransitioning}
//                 className={`group relative flex h-11 items-center font-[Marcellus] whitespace-nowrap rounded-full border px-5 font-semibold transition-all duration-500 ease-out transform overflow-hidden ${
//                   activeIndex === index
//                     ? "scale-105 dark:bg-[#191919] border-transparent bg-[#1f1f1f] text-[#fff] shadow-xl "
//                     : "scale-100 border-transparent dark:bg-[#fff] bg-[#e5e5e5] text-gray-700 hover:bg-[#191919] hover:text-white hover:dark:text-black hover:scale-105 hover:shadow-md"
//                 } ${isTransitioning ? "pointer-events-none" : ""}`}
//                 style={{
//                   transitionDelay: `${index * 50}ms`,
//                 }}
//               >
//                 {/* Background gradient effect */}
//                 <div
//                   className={`absolute inset-0 bg-[#1f1f1f] transition-opacity duration-300 ${
//                     activeIndex === index
//                       ? "opacity-100"
//                       : "opacity-0 group-hover:opacity-10"
//                   }`}
//                 ></div>
//                 <span className="relative z-10">{label}</span>
//               </button>
//             ))}
//           </div>

//           {/* Enhanced Progress Indicators with smooth animations */}
//           <div className="mt-6 flex justify-center md:justify-start gap-2">
//             {labels.map((_, index) => (
//               <div
//                 key={index}
//                 className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
//                   activeIndex === index
//                     ? "w-8 bg-[#1f1f1f] dark:bg-slate-100 shadow-sm"
//                     : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer"
//                 }`}
//                 onClick={() => handleButtonClick(index)}
//                 style={{
//                   transitionDelay: `${index * 100}ms`,
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         <AnimatedOverlayCarousel />
//       </div>

//       {/* Enhanced Stats Section with improved slide animations */}
//       <div className="relative py-8 z-10 mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
//         <div className="flex pn:max-md:h-[740px] overflow-hidden h-[370px] flex-col items-center justify-evenly sm:flex-row sm:flex-wrap gap-6">
//           <div
//             key={`cards-${activeIndex}`}
//             className={`w-full flex flex-col pn:max-sm:h-[500px] sm:flex-row sm:flex-wrap gap-6 items-center justify-evenly transition-all duration-600 ease-out ${
//               isTransitioning
//                 ? cardsDirection === "fade"
//                   ? "opacity-0 scale-95"
//                   : cardsDirection === "up"
//                   ? "transform translate-y-8 opacity-0"
//                   : "transform -translate-y-8 opacity-0"
//                 : "transform translate-y-0 opacity-100 scale-100"
//             }`}
//             style={{
//               transitionDelay: isTransitioning ? "150ms" : "0ms",
//             }}
//           >
//             {isLoading || !getCurrentPosts()?.length
//               ? // Enhanced Loader with staggered animations
//                 Array.from({ length: isMobile ? 2 : 3 }).map((_, i) => (
//                   <div
//                     key={`loader-${i}`}
//                     className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-black w-full sm:w-[48%] md:w-[31%] animate-pulse"
//                     style={{
//                       animationDelay: `${i * 150}ms`,
//                     }}
//                   >
//                     <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 w-full rounded-[6.9%] animate-shimmer"></div>
//                     <div className="flex flex-grow flex-col justify-between p-5">
//                       <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mb-2 animate-shimmer"></div>
//                       <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2 animate-shimmer"></div>
//                     </div>
//                   </div>
//                 ))
//               : // Enhanced Posts with improved hover effects and animations
//                 getCurrentPosts()
//                   ?.slice(0, isMobile ? 2 : 3)
//                   ?.map((stat, index) => (
//                     <button
//                       onClick={() => {
//                         sessionStorage.setItem(
//                           "blogContent",
//                           JSON.stringify({
//                             content: stat?.content,
//                             title: stat?.title,
//                             postid: stat?.id,
//                             image: stat?.featuredImage?.node?.sourceUrl,
//                             latestposts:
//                               activeIndex === 0
//                                 ? translatedData
//                                   ? translatedData?.lifedataposts
//                                   : lifedataposts
//                                 : activeIndex === 1
//                                 ? translatedData
//                                   ? translatedData?.cardataposts
//                                   : cardataposts
//                                 : translatedData
//                                 ? translatedData?.healthdataposts
//                                 : healthdataposts,
//                           })
//                         );
//                         router.push(
//                           `/blog/${stat?.title.replace(/\s+/g, "-")}/${
//                             stat?.id
//                           }`
//                         );
//                       }}
//                       key={`${stat?.id}-${activeIndex}-${index}`}
//                       className="group flex  dark:text-white bg-white dark:bg-black flex-col overflow-hidden rounded-t-3xl w-full sm:w-[48%] md:w-[31%] transform transition-all duration-500 hover:scale-105 hover:-translate-y-3  focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                       style={{
//                         animationDelay: `${index * 120}ms`,
//                         animation: isTransitioning
//                           ? "none"
//                           : `fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${
//                               index * 120
//                             }ms both`,
//                       }}
//                     >
//                       <div className="aspect-video h-[29.5vh] w-full relative overflow-hidden">
//                         <img
//                           src={
//                             stat?.featuredImage?.node?.sourceUrl ||
//                             "/placeholder.png"
//                           }
//                           alt={stat?.title}
//                           className="object-cover w-full h-[29.5vh] opacity-100 rounded-[6.9%] transition-all duration-500 group-hover:scale-110"
//                           loading="lazy"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[6.9%]"></div>
//                       </div>
//                       <div className="flex flex-grow flex-col dark:bg-[#000] bg-white rounded-3xl justify-between -mt-12 p-4 relative z-10">
//                         <h3 className="text-[16px] h-[50px] text-left font-semibold dark:text-white text-gray-800 leading-tight">
//                           {stat?.title}
//                         </h3>
//                         <div className="mt-3 flex items-center transition-all duration-300 group-hover:translate-x-2 group-hover:bg-[#191919] group-hover:text-white rounded-2xl py-2 px-4 justify-center w-fit text-gray-500">
//                           <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(40px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes shimmer {
//           0% {
//             background-position: -200px 0;
//           }
//           100% {
//             background-position: calc(200px + 100%) 0;
//           }
//         }

//         .animate-fade-in-up {
//           animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
//         }

//         .animate-shimmer {
//           background-image: linear-gradient(
//             90deg,
//             rgba(255, 255, 255, 0) 0%,
//             rgba(255, 255, 255, 0.4) 50%,
//             rgba(255, 255, 255, 0) 100%
//           );
//           background-size: 200px 100%;
//           background-repeat: no-repeat;
//           animation: shimmer 1.5s infinite;
//         }

//         .dark .animate-shimmer {
//           background-image: linear-gradient(
//             90deg,
//             rgba(255, 255, 255, 0) 0%,
//             rgba(255, 255, 255, 0.1) 50%,
//             rgba(255, 255, 255, 0) 100%
//           );
//         }

//         /* Smooth scrolling for better UX */
//         html {
//           scroll-behavior: smooth;
//         }

//         /* Custom focus styles for accessibility */
//         button:focus-visible {
//           outline: 2px solid #3b82f6;
//           outline-offset: 2px;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { CiPlay1 } from "react-icons/ci";
import AnimatedOverlayCarousel from "./AnimatedOverlayCarousel";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { GET_HERO_AND_STATS, graphQLClient, translateText } from "../lib/utils";
import { useRouter } from "next/navigation";

export default function Hero() {
  const labels = ["Life Insurance", "Car Insurance", "Education Savings"];
  const headingText = "We guarantee the future of the things you care about!";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const [cardata, setCardata] = useState({});
  const [lifedata, setlifedata] = useState({});
  const [healthdata, sethealthdata] = useState({});
  const [cardataposts, setCardataposts] = useState([]);
  const [lifedataposts, setLifedataposts] = useState([]);
  const [healthdataposts, setHealthdataposts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [translatedData, setTranslatedData] = useState({
    lifedata: {},
    cardata: {},
    healthdata: {},
    lifedataposts: [],
    cardataposts: [],
    healthdataposts: [],
  });

  // Enhanced Animation states
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [titleDirection, setTitleDirection] = useState("right");
  const [cardsDirection, setCardsDirection] = useState("up");
  const intervalRef = useRef(null);
  const titleTimeoutRef = useRef(null);

  // Detect mobile screen size with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Get GraphQL Data
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
          if (category?.slug === "car-insurance") {
            setCardata(category?.posts.nodes[0]);
            setCardataposts(category?.posts.nodes);
          }
          if (category?.slug === "health-insurance") {
            sethealthdata(category.posts.nodes[0]);
            setHealthdataposts(category?.posts.nodes);
          }
          if (category?.slug === "life-insurance") {
            setlifedata(category.posts.nodes[0]);
            setLifedataposts(category?.posts.nodes);
          }
        });
      } catch (err) {
        console.error("GraphQL Error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Translation function
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

  // Enhanced transition function with improved timing and direction detection
  const changeActiveIndex = useCallback(
    (newIndex, userTriggered = false) => {
      if (isTransitioning || newIndex === activeIndex) return;

      // Determine animation directions
      const titleDir = newIndex > activeIndex ? "left" : "right";
      const cardsDir = userTriggered
        ? "fade"
        : newIndex > activeIndex
        ? "up"
        : "down";

      setTitleDirection(titleDir);
      setCardsDirection(cardsDir);
      setPreviousIndex(activeIndex);
      setIsTransitioning(true);

      // Clear any existing title timeout
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }

      // Staggered animation timing for better visual flow
      titleTimeoutRef.current = setTimeout(() => {
        setActiveIndex(newIndex);

        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
        }, 400);
      }, 100);
    },
    [activeIndex, isTransitioning]
  );

  // Auto-cycle with smooth transitions
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % labels.length;
        changeActiveIndex(nextIndex, false);
      }, 4000); // Slightly longer interval for better readability
    };

    if (!isTransitioning) {
      startInterval();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex, labels.length, isTransitioning, changeActiveIndex]);

  // Handle manual button clicks with improved UX
  const handleButtonClick = useCallback(
    (index) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      changeActiveIndex(index, true);

      // Restart auto-cycle after manual interaction with longer delay
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          const nextIndex = (index + 1) % labels.length;
          changeActiveIndex(nextIndex, false);
        }, 4000);
      }, 6000); // 6 second delay before restarting auto-cycle
    },
    [changeActiveIndex, labels.length]
  );

  // Translation effect
  useEffect(() => {
    async function handleTranslation() {
      if (!lifedata?.title && !cardata?.title && !healthdata?.title) return;

      const translatedLife = {
        ...lifedata,
        title: await translateText(lifedata?.title, language),
      };
      const translatedCar = {
        ...cardata,
        title: await translateText(cardata?.title, language),
      };
      const translatedHealth = {
        ...healthdata,
        title: await translateText(healthdata?.title, language),
      };

      const translatedLifePosts = await Promise.all(
        lifedataposts.map(async (post) => ({
          ...post,
          title: await translateText(post.title, language),
        }))
      );
      const translatedCarPosts = await Promise.all(
        cardataposts.map(async (post) => ({
          ...post,
          title: await translateText(post.title, language),
        }))
      );
      const translatedHealthPosts = await Promise.all(
        healthdataposts.map(async (post) => ({
          ...post,
          title: await translateText(post.title, language),
        }))
      );
      const translatedLabels = await Promise.all(
        labels.map((label) => translateText(label, language))
      );

      const translatedHeading = await translateText(headingText, language);
      setTranslatedData({
        lifedata: translatedLife,
        cardata: translatedCar,
        healthdata: translatedHealth,
        lifedataposts: translatedLifePosts,
        cardataposts: translatedCarPosts,
        healthdataposts: translatedHealthPosts,
        labels: translatedLabels,
        heading: translatedHeading,
      });
    }

    handleTranslation();
  }, [language, lifedata, cardata, healthdata]);

  // Get current posts based on active index
  const getCurrentPosts = () => {
    return activeIndex === 0
      ? translatedData?.lifedataposts
      : activeIndex === 1
      ? translatedData?.cardataposts
      : translatedData?.healthdataposts;
  };

  // Get current title with animation
  const getCurrentTitle = () => {
    return activeIndex === 0
      ? translatedData?.lifedata?.title
      : activeIndex === 1
      ? translatedData?.cardata?.title
      : translatedData?.healthdata?.title;
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center py-20">
      {/* Hero Content Flex Wrapper */}
      <div className="relative flex px-4 sm:px-6 lg:px-8 flex-col items-center gap-10 md:flex-row md:items-start">
        {/* Left Section - Text and Buttons */}
        <div className="w-full max-w-lg text-center md:text-left">
          {/* Main Heading with subtle entrance animation */}
          <div className="text-[50px] pn:max-sm:text-[40px] font-[Marcellus] dark:text-white font-semibold animate-fade-in-up">
            {translatedData.heading || headingText}
          </div>

          {/* Enhanced Animated Title Section */}
          <div className="mt-4 h-[40px] dark:text-white text-gray-600 relative overflow-hidden">
            <div
              key={`title-${activeIndex}`}
              className={`absolute inset-0 flex items-center transition-all duration-500 ease-out transform ${
                isTransitioning
                  ? titleDirection === "left"
                    ? "translate-x-full opacity-0"
                    : "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
              style={{
                transitionDelay: isTransitioning ? "0ms" : "100ms",
              }}
            >
              {getCurrentTitle()}
            </div>
          </div>

          {/* Play Button with enhanced hover effects */}
          <div className="mt-8 flex items-center justify-center gap-6 md:justify-start">
            <button className="group relative flex h-16 w-16 items-center justify-center rounded-full dark:bg-[#191919] bg-[#f6f6f6] transition-all duration-300 hover:scale-110 hover:shadow-lg overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-[#1f1f1f] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <CiPlay1 className="h-8 w-8 dark:text-white text-[#191919] transition-transform duration-300 group-hover:scale-110 relative z-10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-colors duration-300"></div>
            </button>
          </div>

          {/* Enhanced Button Section with improved animations */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            {(translatedData?.labels?.length > 0
              ? translatedData.labels
              : labels
            ).map((label, index) => (
              <button
                key={`${label}-${index}`}
                onClick={() => handleButtonClick(index)}
                disabled={isTransitioning}
                className={`group relative flex h-11 items-center font-[Marcellus] whitespace-nowrap rounded-full border px-5 font-semibold transition-all duration-500 ease-out transform overflow-hidden ${
                  activeIndex === index
                    ? "scale-105 dark:bg-[#191919] border-transparent bg-[#1f1f1f] text-[#fff] shadow-xl "
                    : "scale-100 border-transparent dark:bg-[#fff] bg-[#e5e5e5] text-gray-700 hover:bg-[#191919] hover:text-white hover:dark:text-black hover:scale-105 hover:shadow-md"
                } ${isTransitioning ? "pointer-events-none" : ""}`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* Background gradient effect */}
                <div
                  className={`absolute inset-0 bg-[#1f1f1f] transition-opacity duration-300 ${
                    activeIndex === index
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-10"
                  }`}
                ></div>
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          {/* Enhanced Progress Indicators with smooth animations */}
          <div className="mt-6 flex justify-center md:justify-start gap-2">
            {labels.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  activeIndex === index
                    ? "w-8 bg-[#1f1f1f] dark:bg-slate-100 shadow-sm"
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer"
                }`}
                onClick={() => handleButtonClick(index)}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>

        <AnimatedOverlayCarousel />
      </div>

      {/* Enhanced Stats Section with improved slide animations */}
      <div className="relative py-8 z-10 mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex pn:max-md:h-full overflow-hidden h-[370px] flex-col items-center justify-evenly sm:flex-row sm:flex-wrap gap-6">
          <div
            key={`cards-${activeIndex}`}
            className={`w-full flex flex-col pn:max-sm:h-[500px] sm:flex-row sm:flex-wrap gap-6 items-center justify-evenly transition-all duration-600 ease-out ${
              isTransitioning
                ? cardsDirection === "fade"
                  ? "opacity-0 scale-95"
                  : cardsDirection === "up"
                  ? "transform translate-y-8 opacity-0"
                  : "transform -translate-y-8 opacity-0"
                : "transform translate-y-0 opacity-100 scale-100"
            }`}
            style={{
              transitionDelay: isTransitioning ? "150ms" : "0ms",
            }}
          >
            {isLoading || !getCurrentPosts()?.length
              ? // Enhanced Loader with staggered animations
                Array.from({ length: isMobile ? 2 : 3 }).map((_, i) => (
                  <div
                    key={`loader-${i}`}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-black w-full sm:w-[48%] md:w-[31%] animate-pulse"
                    style={{
                      animationDelay: `${i * 150}ms`,
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 w-full rounded-[6.9%] animate-shimmer"></div>
                    <div className="flex flex-grow flex-col justify-between p-5">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mb-2 animate-shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2 animate-shimmer"></div>
                    </div>
                  </div>
                ))
              : // Enhanced Posts with improved hover effects and animations
                getCurrentPosts()
                  ?.slice(0, isMobile ? 2 : 3)
                  ?.map((stat, index) => (
                    <button
                      onClick={() => {
                        sessionStorage.setItem(
                          "blogContent",
                          JSON.stringify({
                            content: stat?.content,
                            title: stat?.title,
                            postid: stat?.id,
                            image: stat?.featuredImage?.node?.sourceUrl,
                            latestposts:
                              activeIndex === 0
                                ? translatedData
                                  ? translatedData?.lifedataposts
                                  : lifedataposts
                                : activeIndex === 1
                                ? translatedData
                                  ? translatedData?.cardataposts
                                  : cardataposts
                                : translatedData
                                ? translatedData?.healthdataposts
                                : healthdataposts,
                          })
                        );
                        router.push(
                          `/blog/${stat?.title.replace(/\s+/g, "-")}/${
                            stat?.id
                          }`
                        );
                      }}
                      key={`${stat?.id}-${activeIndex}-${index}`}
                      className="group flex  dark:text-white bg-white dark:bg-black flex-col overflow-hidden rounded-t-3xl w-full sm:w-[48%] md:w-[31%] transform transition-all duration-500 hover:scale-105 hover:-translate-y-3  "
                      style={{
                        animationDelay: `${index * 120}ms`,
                        animation: isTransitioning
                          ? "none"
                          : `fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${
                              index * 120
                            }ms both`,
                      }}
                    >
                      <div className="aspect-video h-[29.5vh] w-full relative overflow-hidden">
                        <img
                          src={
                            stat?.featuredImage?.node?.sourceUrl ||
                            "/placeholder.png"
                          }
                          alt={stat?.title}
                          className="object-cover w-full h-[29.5vh] opacity-100 rounded-[6.9%] transition-all duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[6.9%]"></div>
                      </div>
                      <div className="flex flex-grow flex-col dark:bg-[#000] bg-white rounded-3xl justify-between -mt-12 p-4 relative z-10">
                        <h3 className="text-[16px] h-[50px] text-left font-semibold dark:text-white text-gray-800 leading-tight">
                          {stat?.title}
                        </h3>
                        <div className="mt-3 flex items-center transition-all duration-300 group-hover:translate-x-2 group-hover:bg-[#191919] group-hover:text-white rounded-2xl py-2 px-4 justify-center w-fit text-gray-500">
                          <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </button>
                  ))}
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: shimmer 1.5s infinite;
        }

        .dark .animate-shimmer {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }

        /* Custom focus styles for accessibility */
        button:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
