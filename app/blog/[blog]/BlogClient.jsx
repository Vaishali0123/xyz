"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
// import { useSearchParams } from "next/navigation";
import ArticleRenderer from "../../components/ArticleRenderer";
import parse from "html-react-parser";
import { GET_HERO_AND_STATS, graphQLClient } from "../../lib/utils";
import ShimmerCard from "../../components/Shimmer";
import { useLanguage } from "../../context/LanguageContext";
import Comments from "../components/Commets";
import Head from "next/head";

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
      // setMessage("An error occurred. Try again later.");
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
  const description =
    stripHtml(content)?.slice(0, 160) ||
    "Read the latest blog from Costa Rican Insurance.";

  return (
    <div className="min-h-screen w-full dark:bg-black">
      <section className="relative scale-95 w-full rounded-3xl dark:from-white/10 dark:to-white/20  overflow-hidden">
        <div className=" md:px-6 w-full py-20">
          <div className=" gap-8 items-center flex flex-col w-full">
            <h1 className="text-3xl lg:text-4xl  pn:max-sm:w-full pn:max-sm:text-center font-bold font-[marcellus] dark:text-gray-200 leading-tight ">
              {title}

              <br />
            </h1>

            <div className="relative w-full">
              <div className="bg-white h-[500px] dark:bg-white/10 rounded-[40px] overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="pn:max-sm:px-2  px-6 py-16">
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
                          `/blog/${post?.title.replace(/\s+/g, "-")}/${
                            post?.id
                          }`,
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
        <div className="sm:max-md:px-12 px-2">
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
            <div className="grid md:px-8 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                      `/blog/${cat?.title.replace(/\s+/g, "-")}/${cat?.id}`,
                      "_self"
                    );
                  }}
                  key={idx}
                  className="bg-white dark:bg-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl 
                 transition-all duration-300 ease-in-out cursor-pointer group
                 hover:-translate-y-2 hover:scale-[1.02] transform-gpu"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={cat?.featuredImage?.node?.sourceUrl}
                      alt={cat?.title || `Article ${idx + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-500 ease-out
                     group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div
                      className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm 
                        rounded-full flex items-center justify-center opacity-0 
                        group-hover:opacity-100 transition-all duration-300 
                        transform translate-x-2 group-hover:translate-x-0"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <h4
                      className="font-bold text-gray-800 dark:text-gray-200 mb-2 
                       transition-colors duration-200 group-hover:text-orange-600 
                       dark:group-hover:text-orange-400"
                    >
                      {cat?.title}
                    </h4>
                    <p
                      className="text-gray-600 dark:text-gray-200 text-sm mb-4 
                      transition-all duration-300 group-hover:text-gray-700 
                      dark:group-hover:text-gray-100"
                    >
                      {stripHtml(cat?.content)?.slice(0, 100) + "... "}
                      <span
                        className="text-orange-600 dark:text-orange-400 font-medium 
                           transition-all duration-200 group-hover:underline 
                           group-hover:underline-offset-2"
                      >
                        Read more
                      </span>
                    </p>
                    <div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                        from-yellow-500 to-orange-500 transition-all duration-500 
                        group-hover:w-full"
                    />
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
