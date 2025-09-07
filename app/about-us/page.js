"use client";
import {
  Shield,
  Users,
  CheckCircle,
  FileText,
  Globe,
  Heart,
  Home,
  PlaneTakeoff,
  GraduationCap,
  PawPrint,
  TruckIcon,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import GraphicElements from "../components/GraphicElements";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const Index = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({});

  const texts = {
    brand: "Costa Rica",
    trusted: "Trusted by Costa Rica",
    heroTitle: "Protecting What Matters in",
    heroDesc:
      "Simple, clear, and accessible insurance guidance for residents, expats, students, and travelers",
    contactBtn: "Contact us",
    whyChoose: "Why Choose Us?",
    whyDesc:
      "No sales pressure. No jargon. Just real guidance to help you make confident decisions.",
    benefit1Title: "Independent & Unbiased",
    benefit1Desc:
      "We're not tied to any insurance company. Our recommendations are based solely on what's best for you.",
    benefit2Title: "Costa Rica Experts",
    benefit2Desc:
      "Local knowledge meets international standards. We understand both expat needs and local requirements.",
    benefit3Title: "Plain English",
    benefit3Desc:
      "We translate complex insurance terms into clear, actionable guidance you can actually understand.",
    aboutTitle: "About Costa Rican Insurance",
    aboutDesc1:
      "We make protecting what matters simple, clear, and accessible, whether you're a local resident, expat, student, or traveler in Costa Rica.",
    aboutDesc2:
      "We're an independent resource and comparison platform created to help you understand, evaluate, and secure the right insurance coverage, from tuition, travel, and medical policies to valuables, pet, moving, and home insurance.",
    mission: "Our Mission",
    missionDesc:
      "To empower individuals and families in Costa Rica with transparent, unbiased information about insurance options, so you can make confident decisions with no pressure or confusion.",
    offerTitle: "What We Offer",
    offerDesc:
      "Your trusted insurance translator, helping you navigate policies and providers",
    guideTitle: "Expert Guides & Checklists",
    guideDesc:
      "Expertly written guides for real-life insurance questions and situations.",
    compareTitle: "Provider Comparisons",
    compareDesc:
      "Side-by-side comparisons with up-to-date info for Costa Rica.",
    claimTitle: "Claim Filing Tips",
    claimDesc:
      "Coverage breakdowns and cost-saving insights when you need them most.",
    localTitle: "Localized Advice",
    localDesc:
      "Specialized guidance for expats and locals navigating Costa Rica's system.",
    toolsTitle: "Free Tools",
    toolsDesc:
      "Worksheets, downloadable PDFs, and checklists to guide your decisions.",
    bilingualTitle: "Bilingual Support",
    bilingualDesc:
      "Clear guidance in both English and Spanish for maximum accessibility.",
    whoTitle: "Who We Help",
    whoDesc:
      "Whether you're new to Costa Rica or have lived here for years, we're here for you",
    expatsTitle: "Expats Relocating",
    expatsDesc: "New to Costa Rica and need comprehensive coverage guidance.",
    familyTitle: "Families & Students",
    familyDesc:
      "Parents with children in private schools or language programs.",
    homeTitle: "Homeowners & Renters",
    homeDesc: "Protecting your property, valuables, and beloved pets.",
    nomadsTitle: "Digital Nomads",
    nomadsDesc: "Long-term travelers seeking flexible, comprehensive coverage.",
    closingLine: "Anyone looking for clarity and peace of mind.",
    closingBold:
      "If it matters to you, we'll help you insure it — the smart way.",
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
      const translated = {};
      // const tt = await translateText(translationtext, language);
      // setTranslationtext(tt);
      for (let [key, value] of Object.entries(texts)) {
        translated[key] = await translateText(value, language);
      }
      setTranslations(translated);
    }
    doTranslate();
  }, [language]);
  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* <HeroBackground /> */}
        {/* <FloatingCards /> */}
        <GraphicElements />

        <div className=" px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-4 ">
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-100 dark:to-orange-200 dark:text-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-pulse">
                {translations?.trusted || texts?.trusted}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-[marcellus]  font-extrabold text-gray-900 dark:text-gray-100  mb-6 leading-10 bg-gradient-to-r from-gray-900 via-gray-800 to-orange-700 bg-clip-text text-transparent">
              {translations?.heroTitle || texts?.heroTitle}
              <span className="block text-orange-600 dark:text-orange-200 mt-2 font-[marcellus] animate-pulse">
                {translations?.brand || texts?.brand}
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-100 mb-8 leading-relaxed max-w-3xl mx-auto opacity-90">
              {translations.heroDesc || texts.heroDesc}
            </p>

            <Link
              href={"/contact-us"}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 border-2 rounded-full border-orange-600 dark:border-orange-100 text-orange-600 hover:bg-orange-500 hover:dark:bg-orange-100 dark:bg-orange-50 hover:text-white hover:dark:text-orange-400 text-base font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                {translations.contactBtn || texts.contactBtn}
              </Button>
            </Link>

            {/* <AnimatedStats /> */}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white/50 dark:bg-black/10  backdrop-blur-sm relative">
        <div className=" px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold font-[marcellus] text-gray-900 dark:text-gray-100  mb-4 bg-gradient-to-r dark:from-gray-100 dark:to-gray-200 from-gray-900 to-orange-700 bg-clip-text text-transparent">
              {translations.whyChoose || texts.whyChoose}
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              {translations.whyDesc || texts.whyDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: translations.benefit1Title || texts.benefit1Title,
                description: translations.benefit1Desc || texts.benefit1Desc,
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: Globe,
                title: translations.benefit2Title || texts.benefit2Title,
                description: translations.benefit2Desc || texts.benefit2Desc,
                gradient: "from-orange-500 to-yellow-500",
              },
              {
                icon: CheckCircle,
                title: translations.benefit3Title || texts.benefit3Title,
                description: translations.benefit3Desc || texts.benefit3Desc,
                gradient: "from-orange-500 to-pink-500",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br  dark:from-black/20 dark:to-orange/40 from-white to-orange-50/30 backdrop-blur-sm group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent  via-orange-50/20 to-orange-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div
                    className={`h-16 w-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${benefit.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="h-8 w-8 text-white hover:text-black" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 font-[marcellus] dark:text-gray-200 hover:dark:text-gray-100 hover:text-gray-100 text-gray-900">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-600 hover:text-gray-200 dark:text-gray-200 hover:dark:text-gray-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div className="">
        <section
          id="about"
          className="py-16 bg-gradient-to-br scale-95 dark:bg-black/20 dark:from-black/10 dark:to-black/20 rounded-4xl from-orange-50 via-white to-orange-100/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-10 right-10 w-32 h-32 border-4 border-orange-300 rounded-full animate-spin"
              style={{ animationDuration: "15s" }}
            ></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-orange-400 rotate-45 animate-pulse"></div>
          </div>

          <div className=" px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-bold mb-6 font-[marcellus] dark:from-gray-100 dark:to-orange-300 bg-gradient-to-r from-gray-900 to-orange-700 bg-clip-text text-transparent">
                {translations.aboutTitle || texts.aboutTitle}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                {translations.aboutDesc1 || texts.aboutDesc1}
              </p>
              <p className="text-base text-gray-600 dark:text-gray-100 mb-10 leading-relaxed">
                {translations.aboutDesc2 || texts.aboutDesc2}
              </p>

              <div className="bg-white/80 dark:bg-black/30 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200/50 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5"></div>
                <h4 className="text-2xl font-bold font-[marcellus] text-orange-600 dark:text-orange-200 mb-4 relative z-10">
                  {translations.mission || texts.mission}
                </h4>
                <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed relative z-10">
                  {translations.missionDesc || texts.missionDesc}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 bg-white/80 dark:bg-black/20 backdrop-blur-sm"
      >
        <div className=" px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold font-[marcellus] dark:text-gray-200 text-gray-900 mb-3">
              {translations.offerTitle || texts.offerTitle}
            </h3>
            <p className="text-lg dark:text-gray-200 text-gray-600">
              {translations.offerDesc || texts.offerDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {[
              {
                icon: FileText,
                title: translations.guideTitle || texts.guideTitle,
                desc: translations.guideDesc || texts.guideDesc,
              },
              {
                icon: Users,
                title: translations.compareTitle || texts.compareTitle,
                desc: translations.compareDesc || texts.compareDesc,
              },
              {
                icon: CheckCircle,
                title: translations.claimTitle || texts.claimTitle,
                desc: translations.claimDesc || texts.claimDesc,
              },
              {
                icon: Globe,
                title: translations.localTitle || texts.localTitle,
                desc: translations.localDesc || texts.localDesc,
              },
              {
                icon: FileText,
                title: translations.toolsTitle || texts.toolsTitle,
                desc: translations.toolsDesc || texts.toolsDesc,
              },
              {
                icon: Globe,
                title: translations.bilingualTitle || texts.bilingualTitle,
                desc: translations.bilingualDesc || texts.bilingualDesc,
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="hover:shadow-md transition-shadow duration-300 rounded-3xl border dark:border-gray-800 border-gray-200"
              >
                <CardContent className="p-5">
                  <item.icon className="h-6 w-6 text-orange-600 mb-2" />
                  <h4 className="text-base font-semibold mb-2 dark:text-gray-200 text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
            {/* <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <FileText className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Expert Guides & Checklists
                </h4>
                <p className="text-sm text-gray-600">
                  Expertly written guides for real-life insurance questions and
                  situations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <Users className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Provider Comparisons
                </h4>
                <p className="text-sm text-gray-600">
                  Side-by-side comparisons with up-to-date info for Costa Rica.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <CheckCircle className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Claim Filing Tips
                </h4>
                <p className="text-sm text-gray-600">
                  Coverage breakdowns and cost-saving insights when you need
                  them most.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <MapPin className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Localized Advice
                </h4>
                <p className="text-sm text-gray-600">
                  Specialized guidance for expats and locals navigating Costa
                  Rica's system.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <FileText className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Free Tools
                </h4>
                <p className="text-sm text-gray-600">
                  Worksheets, downloadable PDFs, and checklists to guide your
                  decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300 rounded-3xl border border-gray-200">
              <CardContent className="p-5">
                <Globe className="h-6 w-6 text-orange-600 mb-2" />
                <h4 className="text-base font-semibold mb-2 text-gray-900">
                  Bilingual Support
                </h4>
                <p className="text-sm text-gray-600">
                  Clear guidance in both English and Spanish for maximum
                  accessibility.
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section
        id="who-we-help"
        className="py-16 bg-gradient-to-r dark:from-orange-800 dark:to-black from-gray-50 to-orange-50/30"
      >
        <div className=" px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-[marcellus] font-bold dark:text-gray-100  text-gray-900 mb-3">
              {translations.whoTitle || "Who We Help"}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 ">
              {translations.whoDesc || texts.whoDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: PlaneTakeoff,
                title: translations.expatsTitle || texts.expatsTitle,
                desc: translations.expatsDesc || texts.expatsDesc,
              },
              {
                icon: GraduationCap,
                title: translations.familyTitle || texts.familyTitle,
                desc: translations.familyDesc || texts.familyDesc,
              },
              {
                icon: Home,
                title: translations.homeTitle || texts.homeTitle,
                desc: translations.homeDesc || texts.homeDesc,
              },
              {
                icon: Globe,
                title: translations.nomadsTitle || texts.nomadsTitle,
                desc: translations.nomadsDesc || texts.nomadsDesc,
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="text-center hover:shadow-md rounded-3xl hover:bg-orange-400 h-fit group transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                <CardContent className="p-5">
                  <item.icon className="h-10 w-10  group-hover:text-white dark:group-hover:text-black text-orange-600 dark:text-orange-300 mx-auto mb-3" />
                  <h4 className="text-base font-semibold mb-2 dark:text-gray-200 group-hover:text-white dark:group-hover:text-black text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-sm group-hover:text-white dark:text-gray-200 dark:group-hover:text-black text-gray-600">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
            {/* <Card className="text-center hover:shadow-md rounded-3xl hover:bg-orange-400 h-fit group transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <CardContent className="p-5">
                <PlaneTakeoff className="h-10 w-10 group-hover:text-white text-orange-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold mb-2 group-hover:text-white text-gray-900">
                  Expats Relocating
                </h4>
                <p className="text-sm group-hover:text-white text-gray-600">
                  New to Costa Rica and need comprehensive coverage guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md rounded-3xl hover:bg-orange-400 h-fit group mt-10 transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <CardContent className="p-5">
                <GraduationCap className="h-10 w-10 group-hover:text-white text-orange-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold mb-2 group-hover:text-white text-gray-900">
                  Families & Students
                </h4>
                <p className="text-sm group-hover:text-white text-gray-600">
                  Parents with children in private schools or language programs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md rounded-3xl hover:bg-orange-400 h-fit group mt-20 transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <CardContent className="p-5">
                <Home className="h-10 w-10 group-hover:text-white text-orange-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold mb-2 group-hover:text-white text-gray-900">
                  Homeowners & Renters
                </h4>
                <p className="text-sm group-hover:text-white text-gray-600">
                  Protecting your property, valuables, and beloved pets.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md rounded-3xl  hover:bg-orange-400 h-fit group mt-32 transition-all duration-300 hover:-translate-y-1 border border-gray-200">
              <CardContent className="p-5">
                <Globe className="h-10 w-10 group-hover:text-white text-orange-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold mb-2 group-hover:text-white text-gray-900">
                  Digital Nomads
                </h4>
                <p className="text-sm group-hover:text-white text-gray-600">
                  Long-term travelers seeking flexible, comprehensive coverage.
                </p>
              </CardContent>
            </Card> */}
          </div>

          <div className="text-center mt-8">
            <p className="text-base text-gray-700 dark:text-gray-200 d font-medium">
              {translations.closingLine || texts.closingLine}
            </p>
            <p className="text-lg text-orange-600 dark:text-gray-200 font-bold mt-2">
              {translations.closingBold || texts.closingBold}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
