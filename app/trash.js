// "use client";

// import { GraphQLClient } from "graphql-request";
// import { gql } from "graphql-request";
// import { useEffect, useState } from "react";

// // import Hero from "./components/text";
// const graphQLClient = new GraphQLClient(
//   "https://admin.costaricaninsurance.com/graphql",
//   {
//     headers: { "Content-Type": "application/json" },
//   }
// );

// const GET_HERO_AND_STATS = gql`
//   query GetAllCategoriesWithPosts {
//     categories(first: 100) {
//       nodes {
//         id
//         name
//         slug
//         posts(first: 20) {
//           nodes {
//             id
//             title
//             content
//             featuredImage {
//               node {
//                 sourceUrl
//               }
//             }
//           }
//         }
//         children(first: 100) {
//           nodes {
//             id
//             name
//             slug
//             posts(first: 20) {
//               nodes {
//                 id
//                 title
//                 content
//                 featuredImage {
//                   node {
//                     sourceUrl
//                   }
//                 }
//               }
//             }
//             children(first: 100) {
//               nodes {
//                 id
//                 name
//                 slug
//                 posts(first: 20) {
//                   nodes {
//                     id
//                     title
//                     content
//                     featuredImage {
//                       node {
//                         sourceUrl
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export default function Home() {
//   const [reviewdata, setReviewdata] = useState([]);
//   const [mortgagesdata, setMortgagesdata] = useState([]);
//   const [insurancedata, setInsurancedata] = useState([]);
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const data = await graphQLClient.request(GET_HERO_AND_STATS);

//         // const sortedPosts = [...data.posts.nodes].sort(
//         //   (a, b) => new Date(b.date) - new Date(a.date)
//         // );

//         data?.categories?.nodes?.forEach((category) => {
//           // if (category?.slug === "car-insurance") {
//           //   setCardata(category?.posts.nodes[0]);
//           //   console.log(category?.posts.nodes[0], "category?.posts.nodes[0]");
//           // }
//           // if (category?.slug === "health-insurance") {
//           //   sethealthdata(category.posts.nodes[0]);
//           // }
//           // if (category?.slug === "life-insurance") {
//           //   setlifedata(category.posts.nodes[0]);
//           // }
//           if (category?.slug === "mortgages") {
//             setMortgagesdata(category.posts.nodes);
//           }
//           if (category?.slug === "reviews") {
//             setReviewdata(category.posts.nodes);
//           }
//           if (category?.slug === "insurance") {
//             setInsurancedata(category.posts.nodes);
//           }
//         });
//       } catch (err) {
//         console.error("GraphQL Error:", err);
//       }
//     }

//     fetchData();
//   }, []);
//   console.log(insurancedata, "insura");
//   const text = "hi";
//   const [translated, setTranslated] = useState("");
//   const translateContent = async (text, targetLang) => {
//     const res = await fetch("/api/translate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text, targetLang: "hi" }),
//     });
//     if (!res.ok) throw new Error("Translation failed");
//     const data = await res.json();
//     return data;
//   };
//   useEffect(() => {
//     (async () => {
//       const result = await translateContent(text, "hi"); // target Hindi
//       setTranslated(result.translatedText);
//     })();
//   }, [text]);

//   return (
//     <div className="space-y-10">
//       <div>CHange Langugb</div>

//       <div>{text}</div>
//       <div>{translated}</div>
//     </div>
//   );
// }
import React from "react";

function trash() {
  return <div></div>;
}

export default trash;
