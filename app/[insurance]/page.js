"use client";
import Banner from "./components/CSSBanner";
import Banner2 from "./components/CSSBanner2";
import BlogCard from "./components/BlogCard";
import { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import React, { useEffect, useState } from "react";
import HeadSection from "./components/HeadSection";
import BlogHome from "./components/BlogHome";
import FeaturedPost from "./components/FeaturedPost";
import ArticleCard from "./components/Card";
import { GET_HERO_AND_STATS, graphQLClient } from "../lib/utils";
function stripHtml(html) {
  return html.replace(/<[^>]*>?/gm, "");
}

export default function Page({ params }) {
  const { insurance } = React.use(params);

  const [loading, setLoading] = useState(true);
  const [randomTop, setRandomTop] = useState(null);
  const [randomBottom, setRandomBottom] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [blog, setBlog] = useState({});

  useEffect(() => {
    setRandomTop(Math.floor(Math.random() * 3)); // 0 to 2
    setRandomBottom(Math.floor(Math.random() * 3)); // 0 or 1
  }, []);
  const [insurancedata, setInsurancedata] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = sessionStorage.getItem("data")
          ? JSON.parse(sessionStorage.getItem("data"))
          : await graphQLClient.request(GET_HERO_AND_STATS);
        // const data = await graphQLClient.request(GET_HERO_AND_STATS);

        // Flatten posts from all categories
        const allPosts = data.categories.nodes.flatMap((category) =>
          category.posts.nodes.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            image: post.featuredImage?.node?.sourceUrl || "/images/default.png",
          }))
        );

        setInsurancedata(allPosts); // use for rendering BlogCard
        data?.categories?.nodes?.forEach((category) => {
          if (category?.slug.toString() === insurance.toString()) {
            // setCards(category?.children?.nodes);
            setBlog(category);
          }
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // ✅ Mark loading complete
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="bg-white dark:bg-black/10 min-h-screen">
        <main className="max-w-7xl  mx-auto  px-4 py-6">
          {randomTop === 0 && <BlogHome />}
          {randomTop === 1 && <HeadSection />}
          {randomTop === 2 && <Banner />}

          <div className="grid  grid-cols-1 md:grid-cols-3 sm:grid-cols-2  gap-1">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    {/* Image Placeholder */}
                    <div className="h-48 w-full bg-gray-300" />

                    {/* Content Placeholder */}
                    <div className="p-4 space-y-4">
                      {/* Title Placeholder */}
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      {/* Text Placeholder */}
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                      {/* Author & Meta Placeholder */}
                      <div className="flex items-center space-x-3 mt-4">
                        <div className="h-8 w-8 bg-gray-300 rounded-full" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))
              : blog?.posts?.nodes?.map((post, i) => (
                  <BlogCard
                    key={i}
                    title={post?.title}
                    image={
                      post?.featuredImage?.node?.sourceUrl ||
                      "/images/default.png"
                    }
                    postid={post?.id}
                    latestposts={blog?.posts?.nodes}
                    content={post?.content}
                    description={stripHtml(post.content).slice(0, 120) + "..."}
                  />
                ))}
            {/* {blog?.posts?.nodes?.map((post, i) => (
              <BlogCard
                key={i}
                title={post?.title}
                image={
                  post?.featuredImage?.node?.sourceUrl || "/images/default.png"
                }
                description={stripHtml(post.content).slice(0, 120) + "..."}
              />
            ))} */}
          </div>
          {/* <div className="w-full">LoadMore</div> */}

          {/* <FeaturedPost /> */}
          {randomBottom === 0 && <FeaturedPost />}
          {randomBottom === 1 && <Banner2 />}
          {randomBottom === 2 && <ArticleCard />}
        </main>
      </div>
    </>
  );
}
