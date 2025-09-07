// import React from "react";
// import HeroSection from "./components/Hero";
// import Insurance from "./components/Insurance";
// import InsuranceNewsSection from "./components/InsuranceNewsSection";
// import InsuranceTypes from "./components/InsuranceTypes";
// import SpecialtyInsurance from "./components/SpecialtyInsurance";

// function page() {
//   return (
//     <div>
//       <HeroSection />
//       <Insurance />
//       <InsuranceNewsSection />
//       <InsuranceTypes />
//       <SpecialtyInsurance />
//     </div>
//   );
// }

// export default page;
"use client";
import React, { Suspense, useEffect, useState } from "react";
import Hero from "./components/Hero";
import Insurance from "./components/Insurance";
import News from "./components/InsuranceNewsSection";
import PopularBlogs from "./components/PopularBlogs";
import { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
// import PopularBlogs from "./components/PoplurBlogs";
import SpecialtyInsurance from "./components/SpecialtyInsurance";
import InsuranceTypes from "./components/InsuranceTypes";
import { GET_HERO_AND_STATS, graphQLClient } from "./lib/utils";

const Page = () => {
  const [reviewdata, setReviewdata] = useState([]);
  const [mortgagesdata, setMortgagesdata] = useState([]);
  const [insurancedata, setInsurancedata] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
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
        // const sortedPosts = [...data.posts.nodes].sort(
        //   (a, b) => new Date(b.date) - new Date(a.date)
        // );

        data?.categories?.nodes?.forEach((category) => {
          if (category?.slug === "mortgages") {
            setMortgagesdata(category.posts.nodes);
          }
          if (category?.slug === "reviews") {
            setReviewdata(category.posts.nodes);
          }
          if (category?.slug === "insurance") {
            setInsurancedata(category.posts.nodes);
          }
        });
      } catch (err) {
        console.error("GraphQL Error:", err);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="space-y-10">
      <Hero />
      <Insurance insurancedata={insurancedata} />
      <News insurancedata={insurancedata} />
      <InsuranceTypes />
      <PopularBlogs mortgagesdata={mortgagesdata} />
      <SpecialtyInsurance />
    </div>
  );
};

export default Page;
