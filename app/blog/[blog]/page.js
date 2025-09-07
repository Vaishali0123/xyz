"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
// import { useSearchParams } from "next/navigation";
import ArticleRenderer from "../../components/ArticleRenderer";
import parse from "html-react-parser";
import { GET_HERO_AND_STATS, graphQLClient } from "../../lib/utils";
import ShimmerCard from "../../components/Shimmer";
import { useLanguage } from "../../context/LanguageContext";
import Comments from "../components/Commets";

function stripHtml(html) {
  return html?.replace(/<[^>]*>?/gm, "");
}

const Page = () => {
  const [blogData, setBlogData] = useState(null);
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedPosts, setTranslatedPosts] = useState([]);
  const { language } = useLanguage();
  const [likeHeading, setLikeHeading] = useState("YOU MAY ALSO LIKE");
  const [followHeading, setFollowHeading] = useState("Follow Us");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [followText, setFollowText] = useState(
    "Join thousands in growing subscriber and improve a collection of tools to help your team every work."
  );
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

  // ✅ Translate dynamic blog content when language changes
  useEffect(() => {
    async function translateBlog() {
      const [tLike, tFollow, tFollowText] = await Promise.all([
        translateText("YOU MAY ALSO LIKE", language),
        translateText("Follow Us", language),
        translateText(
          "Join thousands in growing subscriber and improve a collection of tools to help your team every work.",
          language
        ),
      ]);
      setLikeHeading(tLike);
      setFollowHeading(tFollow);
      setFollowText(tFollowText);
      if (!blogData) return;

      try {
        const tTitle = await translateText(blogData.title || "", language);
        // const tContent = await translateText(
        //   stripHtml(blogData.content || ""),
        //   language
        // );
        const translatedCategories = {};
        if (allCategories) {
          await Promise.all(
            Object.entries(allCategories).map(async ([key, value]) => {
              translatedCategories[key] = await translateText(
                value || "",
                language
              );
            })
          );
        }
        const tPosts = await Promise.all(
          (blogData.latestposts || []).map(async (post) => {
            const translatedTitle = await translateText(
              post.title || "",
              language
            );

            // Remove HTML tags before translating content
            const plainContent = post.content
              ? post.content.replace(/<[^>]+>/g, "")
              : "";

            const translatedContent = await translateText(
              // plainContent,
              post.content || "",
              language
            );

            return {
              ...post,
              title: translatedTitle,
              content: translatedContent || post.content, // translated text instead of raw HTML
            };
          })
        );

        setTranslatedTitle(tTitle);
        // setTranslatedContent(tContent);
        setTranslatedPosts(tPosts);
      } catch (err) {
        console.error("Translation error:", err);
      }
    }

    translateBlog();
  }, [language, blogData]);
  useEffect(() => {
    const stored = sessionStorage.getItem("blogContent");
    if (stored) {
      setBlogData(JSON.parse(stored));
    }
  }, []);
  const content = blogData?.content;
  console.log(blogData, "blogData");
  const title = translatedTitle || blogData?.title;
  const image = blogData?.image;
  const latestposts = translatedPosts.length
    ? translatedPosts
    : blogData?.latestposts;
  // console.log(
  //   blogData?.latestposts,
  //   typeof blogData?.latestposts,
  //   "blogData?.latestposts"
  // );
  const [formData, setFormData] = useState({
    comment: "",
    name: "",
    email: "",
    save: false,
  });
  const decodedContent = content || "";
  const parsed = parse(decodedContent);

  // Collect elements

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // API call can go here
  };
  // Top 6 categories
  const [category0, setCategory0] = useState({});
  const [category1, setCategory1] = useState({});
  const [category2, setCategory2] = useState({});
  const [category3, setCategory3] = useState({});
  const [category4, setCategory4] = useState({});
  const [category5, setCategory5] = useState({});

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { name, email, comment } = formData;

    const payload = {
      post: postid,
      author_name: name,
      author_email: email,
      content: comment,
    };

    try {
      const res = await fetch(
        "https://admin.costaricaninsurance.com/wp-json/wp/v2/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setMessage("Comment submitted successfully!");
        setFormData({ comment: "", name: "", email: "", save: formData.save });
      } else {
        const err = await res.json();
        setMessage(`Failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Try again later.");
    }
  };
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await graphQLClient.request(GET_HERO_AND_STATS);

        // raw categories
        const categories = data?.categories?.nodes || [];

        // translate posts for each category
        const translatedCategories = await Promise.all(
          categories.map(async (cat) => {
            if (!cat?.posts?.nodes?.length) return null;

            const post = cat.posts.nodes[0]; // first post

            const translatedTitle = await translateText(
              post.title || "",
              language
            );

            // ⚠️ instead of stripping tags, keep full HTML so it's consistent
            const translatedContent = await translateText(
              post.content || "",
              language
            );

            return {
              ...post,
              title: translatedTitle || post.title,
              content: translatedContent || post.content,
              featuredImage: post.featuredImage,
            };
          })
        );

        // save all categories in one state
        setAllCategories(translatedCategories);

        // also expose category0..categoryN dynamically if needed
        translatedCategories.forEach((cat, idx) => {
          if (cat) {
            // 👇 This assumes you already have useState hooks like setCategory0, setCategory1, etc.
            switch (idx) {
              case 0:
                setCategory0(cat);
                break;
              case 1:
                setCategory1(cat);
                break;
              case 2:
                setCategory2(cat);
                break;
              case 3:
                setCategory3(cat);
                break;
              case 4:
                setCategory4(cat);
                break;
              case 5:
                setCategory5(cat);
                break;
              default:
                break; // add more cases if you still want category6,7... etc.
            }
          }
        });
      } catch (err) {
        console.error("GraphQL Error:", err);
      }
      setLoading(false);
    }

    fetchData();
  }, [language]);

  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const data = await graphQLClient.request(GET_HERO_AND_STATS);

  //       setAllCategories(data?.categories?.nodes);
  //       setCategory0(data?.categories?.nodes[0]?.posts?.nodes?.[0]);
  //       setCategory1(data?.categories?.nodes[1]?.posts?.nodes?.[0]);
  //       setCategory2(data?.categories?.nodes[2]?.posts?.nodes?.[0]);
  //       setCategory3(data?.categories?.nodes[3]?.posts?.nodes?.[0]);
  //       setCategory4(data?.categories?.nodes[4]?.posts?.nodes?.[0]);
  //       setCategory5(data?.categories?.nodes[5]?.posts?.nodes?.[0]);
  //       const translatedCategories = await Promise.all(
  //         data?.categories?.nodes?.map(async (cat) => {
  //           if (!cat?.posts?.nodes?.length) return null;

  //           const post = cat.posts.nodes[0]; // first post of category

  //           const translatedTitle = await translateText(
  //             post.title || "",
  //             language
  //           );

  //           const plainContent = post.content
  //             ? post.content.replace(/<[^>]+>/g, "")
  //             : "";
  //           const translatedContent = await translateText(
  //             plainContent,
  //             language
  //           );

  //           return {
  //             ...post,
  //             title: translatedTitle,
  //             content: translatedContent,
  //             featuredImage: post.featuredImage, // keep image
  //           };
  //         })
  //       );

  //       setAllCategories(translatedCategories);
  //       setCategory0(translatedCategories[0]);
  //       setCategory1(translatedCategories[1]);
  //       setCategory2(translatedCategories[2]);
  //       setCategory3(translatedCategories[3]);
  //       setCategory4(translatedCategories[4]);
  //       setCategory5(translatedCategories[5]);
  //     } catch (err) {
  //       console.error("GraphQL Error:", err);
  //     }
  //     setLoading(false);
  //   }

  //   fetchData();
  // }, [language]);

  return (
    <div className="min-h-screen w-full dark:bg-black">
      <section className="relative scale-95  w-full rounded-3xl dark:from-white/10 dark:to-white/20  overflow-hidden">
        <div className=" sm:px-6 w-full py-20">
          <div className=" gap-8 items-center justify-center flex flex-col w-full">
            <h2 className="text-3xl lg:text-4xl pn:max-sm:w-full font-bold font-[marcellus] dark:text-gray-200 leading-tight ">
              {title}
              <br />
            </h2>

            <div className="relative w-full">
              <div className="bg-white w-full sm:h-[500px] dark:bg-white/10 rounded-[40px] overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover "
                />
              </div>

              {/* <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full"></div>
              <div className="absolute top-1/2 -left-6 w-6 h-6 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-6 left-1/3 w-4 h-4 bg-blue-400 rounded-full"></div> */}
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="w-full pn:max-sm:px-2 px-6 py-16">
        <div className="flex sm:max-md:flex-wrap  gap-4">
          <div className="w-[300px] pn:max-md:hidden h-full flex sm:flex-col pn:max-sm:justify-center items-center gap-3">
            {" "}
            <div className="p-4 w-fit border rounded-full dark:text-white dark:border-gray-800 flex flex-col space-y-4 ">
              <Facebook className="w-5 h-5 " />
              <Twitter className="w-5 h-5 " />
              <Instagram className="w-5 h-5 " />
              <Linkedin className="w-5 h-5 " />
              <Youtube className="w-5 h-5 " />
            </div>
          </div>
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            {/* <article
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: decodedContent }}
            /> */}
            {/* <ArticleRenderer htmlContent={content} /> */}
            <article className="prose max-w-none ">
              <ArticleRenderer htmlContent={decodedContent} />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 pn:max-md:hidden">
            {/* Follow Us */}
            <div className="bg-white dark:bg-white/10 p-6 dark:border-gray-800 rounded-3xl border">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">
                {followHeading}
              </h4>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 dark:text-white text-black" />
                <Twitter className="w-5 h-5 dark:text-white text-black" />
                <Instagram className="w-5 h-5 dark:text-white text-black " />
                <Linkedin className="w-5 h-5 dark:text-white text-black" />
                <Youtube className="w-5 h-5 dark:text-white text-black" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                {followText}
              </p>
            </div>

            {/* The Latest */}
            {latestposts?.length > 0 && (
              <div className="bg-white dark:bg-white/10 py-4 px-2 dark:border-gray-800 rounded-3xl   border">
                <h4 className="font-bold dark:text-gray-300 font-[marcellus] text-gray-800 dark:text-gray-20  mb-4">
                  The Latest
                </h4>
                <div className="space-y-4">
                  {latestposts?.slice(0, 3)?.map((post, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        console.log(post, "post");
                        sessionStorage.setItem(
                          "blogContent",
                          JSON.stringify({
                            content: post?.content,
                            title: post?.title,
                            postid: post?.id,
                            image: post?.featuredImage?.node?.sourceUrl,
                            latestposts,
                          })
                        );
                        // No new tab
                        window.open(
                          `/blog/${post?.title.replace(/\s+/g, "-")}`,
                          "_self"
                        );
                      }}
                      className="flex hover:bg-gray-100 cursor-pointer hover:dark:bg-white/20   dark:hover:bg-slate-50 p-1 rounded-2xl space-x-3"
                    >
                      <img
                        src={
                          post?.featuredImage?.node?.sourceUrl ||
                          "/api/placeholder/80/60"
                        }
                        alt={post?.title || "Article"}
                        className="w-20 h-15 object-cover rounded-2xl"
                      />
                      <div className="flex items-center">
                        <h5 className="text-[12px] font-semibold   dark:text-gray-300  text-gray-800 mb-1">
                          {post?.title || "Loading Title..."}
                        </h5>
                        {/* <p className="text-xs text-gray-500">
                      June 14, 2023 • 3 minute read
                    </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <div className="">
        <Comments postId={blogData?.postid} />
      </div>
      {/* You May Also Like Section */}
      <section className="w-full py-16">
        <div className="w-full px-2 sm:px-12">
          <h3 className="text-2xl font-bold text-gray-800 font-[marcellus] pr-2 dark:text-gray-100 mb-12">
            {likeHeading}
          </h3>
          {loading ? (
            <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))}
            </div>
          ) : (
            // <div className="grid px-8 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            //   {/* Article 1 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category0?.featuredImage?.node?.sourceUrl}
            //       alt={category0?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800  dark:text-gray-100 mb-2">
            //         {category0?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200  text-sm mb-4">
            //         {stripHtml(category0.content)?.slice(0, 100) + "..."}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            //   {/* Article 2 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category1?.featuredImage?.node?.sourceUrl}
            //       alt={category1?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            //         {category1?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200 text-sm mb-4">
            //         {stripHtml(category1.content)?.slice(0, 100) + "..."}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            //   {/* Article 3 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-2xl overflow-hidden border hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category2?.featuredImage?.node?.sourceUrl}
            //       alt={category2?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800 font-[marcellus] dark:text-gray-200 mb-2">
            //         {category2?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200 text-sm mb-4">
            //         {stripHtml(category2.content)?.slice(0, 100) +
            //           "... Read more"}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            //   {/* Article 4 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category3?.featuredImage?.node?.sourceUrl}
            //       alt={category3?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            //         {category3?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200 text-sm mb-4">
            //         {stripHtml(category3.content)?.slice(0, 100) +
            //           "... Read more"}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            //   {/* Article 5 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category4?.featuredImage?.node?.sourceUrl}
            //       alt={category4?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            //         {category4?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200 text-sm mb-4">
            //         {stripHtml(category4.content)?.slice(0, 100) + "..."}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            //   {/* Article 6 */}
            //   <article
            //     // key={item}
            //     className="bg-white dark:bg-white/10  rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            //   >
            //     <img
            //       src={category5?.featuredImage?.node?.sourceUrl}
            //       alt={category5?.title || "Article"}
            //       className="w-full h-48 object-cover"
            //     />
            //     <div className="p-6">
            //       <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            //         {category5?.title}
            //       </h4>
            //       <p className="text-gray-600 dark:text-gray-200 text-sm mb-4">
            //         {stripHtml(category5.content)?.slice(0, 100) + "..."}
            //       </p>
            //       {/* <div className="text-xs text-gray-500">
            //         June 14, 2023 • 5 minute read
            //       </div> */}
            //     </div>
            //   </article>
            // </div>
            <div className="grid px-8 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {allCategories?.slice(0, 6)?.map((cat, idx) => (
                <article
                  onClick={() => {
                    sessionStorage.setItem(
                      "blogContent",
                      JSON.stringify({
                        content: cat?.content,
                        title: cat?.title,
                        postid: cat?.id,
                        image: cat?.featuredImage?.node?.sourceUrl,
                        latestposts,
                      })
                    );
                    // No new tab
                    window.open(
                      `/blog/${cat?.title.replace(/\s+/g, "-")}`,
                      "_self"
                    );
                  }}
                  key={idx}
                  className="bg-white dark:bg-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={cat?.featuredImage?.node?.sourceUrl}
                      alt={cat?.title || `Article ${idx + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {cat?.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-200 text-sm mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors duration-200">
                      {stripHtml(cat?.content)?.slice(0, 100) + "... Read more"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Page;
