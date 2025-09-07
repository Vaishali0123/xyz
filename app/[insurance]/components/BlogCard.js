"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
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

const BlogCard = ({
  title = "Blog Post Title",
  description = "Aenean eleifend ante maecenas pulvinar montes lorem sit pede dis dolor pretium donec dictum. Vici consequat justo enim. Venenatis eget adipiscing luctus lorem.",
  date = "June 28, 2018",
  author = "Joanna Wellick",
  bgColor = "bg-gray-300",
  image,
  content,
  shares = "1K shares",
  authorAvatar = "/images/avatar.png",
  postid,
  latestposts,
}) => {
  console.log(latestposts, "latestposts in blog card");
  /** === Responsive Styles === */
  const cardStyle = {
    borderRadius: "12px",
    overflow: "hidden",
    border: "none",
    transition: "transform 0.2s ease-in-out",
    cursor: "pointer",
    maxWidth: "386px",
    width: "100%",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
  };

  const imageContainerStyle = {
    height: "220px",
    width: "100%",
    position: "relative",
    backgroundColor: image ? "transparent" : "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "12px",
    margin: "12px 12px 0 12px",
    width: "calc(100% - 24px)",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  };

  const overlayStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "16px",
    borderRadius: "12px",
  };

  const authorTagStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(8px)",
    borderRadius: "20px",
    padding: "6px 12px",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  };

  const iconButtonStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "8px",
    padding: "6px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const titleOverlayStyle = {
    color: "white",
    fontSize: "1.25rem",
    fontWeight: 700,
    lineHeight: "1.3",
    // textShadow: "0 2px 8px rgba(0,0,0,0.3)",
    margin: "0",
    maxWidth: "85%",
  };

  const contentStyle = {
    padding: "16px",
  };
  const { language } = useLanguage();
  const [translations, setTranslations] = useState({
    title,
    description,
    readMore: "Read more",
  });
  useEffect(() => {
    async function doTranslate() {
      if (language === "en") {
        setTranslations({ title, description, readMore: "Read more" });
        return;
      }

      const translatedTitle = await translateText(title, language);
      const translatedDesc = await translateText(description, language);
      const translatedReadMore = await translateText("Read more", language);

      setTranslations({
        title: translatedTitle,
        description: translatedDesc,
        readMore: translatedReadMore,
      });
    }
    doTranslate();
  }, [language, title, description]);
  function stripHtml(html) {
    return html?.replace(/<[^>]*>?/gm, "") || "";
  }

  return (
    <div
      onClick={() => {
        sessionStorage.setItem(
          "blogContent",
          JSON.stringify({
            content,
            title,
            postid,
            image,
            latestposts,
          })
        );

        // No new tab
        window.open(`/blog/${title.replace(/\s+/g, "-")}/${postid}`, "_self");
      }}
      // href={{
      //   pathname: "/blog",
      //   // query: {
      //   //   content: content,
      //   //   title: title,
      //   //   postid: postid,
      //   //   image: image,
      //   // },
      // }}
      style={cardStyle}
      className="dark:bg-white/10 bg-white "
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* === Image Container === */}
      <div style={imageContainerStyle}>
        {image ? (
          <img loading="lazy" src={image} alt={title} style={imageStyle} />
        ) : (
          <span style={{ color: "white", fontSize: "18px", fontWeight: 500 }}>
            Image Here
          </span>
        )}
        <div style={overlayStyle}>
          {/* Top Overlay - Author Tags */}

          {/* Bottom Overlay - Bookmark and Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {/* <h3 style={titleOverlayStyle}>{title}</h3> */}
            {/* <button style={iconButtonStyle}>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#64748b"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                />
              </svg>
            </button> */}
          </div>
        </div>
      </div>

      {/* === Content === */}
      <div style={contentStyle}>
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "12px",
            // color: "#111827",
            lineHeight: "1.3",
          }}
          className="dark:text-gray-100 text-black "
        >
          {/* {title} */}
          {translations.title}
        </h3>

        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "12px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          <img
            src={authorAvatar}
            alt={author}
            style={{ width: "20px", height: "20px", borderRadius: "50%" }}
          />
          <span style={{ fontWeight: 600, color: "#374151" }}>{author}</span>
          <span>—</span>
          <span>{date}</span>
          <span>•</span>
          <span>{shares}</span>
        </div> */}

        <p
          style={{
            fontSize: "0.85rem",
            // color: "#6b7280",
            marginBottom: "16px",
            lineHeight: 1.5,
          }}
          className="dark:text-gray-200 text-black "
        >
          {/* {description} */}
          {translations.description}
        </p>

        <div
          href="https://admin.costaricaninsurance.com/understanding-medical-insurance-a-comprehensive-guide/"
          style={{
            fontWeight: 500,
            textDecoration: "underline",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            padding: 0,
          }}
          className="dark:text-white text-black "
        >
          {/* Read more */}
          {translations.readMore}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
