import { getpostdetails } from "../../../lib/text";
import BlogClient from "../BlogClient";

function decodePostId(postId) {
  if (!postId) return null;
  if (/^\d+$/.test(postId)) {
    return Number(postId);
  }
  // if (typeof postId === "number") return postId;

  try {
    const decoded = atob(postId); // base64 → "post:143"
    const parts = decoded.split(":");
    const numeric = Number(parts.pop());
    return isNaN(numeric) ? null : numeric;
  } catch {
    return null;
  }
}

// function stripHtml(html) {
//   return html?.replace(/<[^>]*>?/gm, "") || "";
// }
function stripHtml(html) {
  if (!html) return "";

  return (
    html
      // Remove images, videos, iframes, scripts, styles completely
      .replace(/<(img|iframe|video|script|style)[^>]*>/gi, "")
      // Replace remaining HTML tags with space
      .replace(/<[^>]+>/g, " ")
      // Collapse multiple spaces/newlines
      .replace(/\s+/g, " ")
      .trim()
  );
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// export async function generateMetadata(props) {
//   const params = await props.params;
//   const { blog } = params;
//   const numericPostId = decodeURIComponent(params.postid);
//   const postid = decodePostId(numericPostId);

//   // Default metadata for when post is not found
//   const defaultMetadata = {
//     title: "Costa Rican Insurance - Blog",
//     description:
//       "Read the latest blog posts from Costa Rican Insurance about insurance solutions in Costa Rica.",
//     alternates: { canonical: "https://costaricaninsurance.com/" },
//     robots: {
//       index: true,
//       follow: true,
//     },
//   };

//   const post = await getpostdetails(postid);
//   const blogTitle = post?.title?.rendered
//     ? post.title.rendered
//     : decodeURIComponent(blog.replace(/-/g, " "));

//   // if (!post) {
//   //   return defaultMetadata;
//   // }
//   const description = post?.content?.rendered
//     ? (() => {
//         const text = stripHtml(post.content.rendered).replace(
//           /\[&hellip;\]/g,
//           "..."
//         );
//         return text.length > 160 ? text.slice(0, 160) + "..." : text;
//       })()
//     : "Read the latest blog from Costa Rican Insurance about insurance solutions in Costa Rica.";

//   // Extract data based on actual post structure
//   const rawTitle = post?.title?.rendered || "Costa Rican Insurance - Blog";
//   const title = blogTitle;
//   // const description =
//   //   stripHtml(post?.excerpt?.rendered || "")
//   //     .replace(/\[&hellip;\]/g, "...")
//   //     .slice(0, 160) ||
//   //   "Read the latest blog from Costa Rican Insurance about insurance solutions in Costa Rica.";

//   // Use the existing slug from WordPress or create one
//   const slug = post?.slug || createSlug(title);
//   const url = `https://costaricaninsurance.com/blog/${blogTitle.replace(
//     /\s+/g,
//     "-"
//   )}/${params.postid}`;

//   // Handle featured media - it's just an ID, you might need to fetch the actual image
//   // For now, we'll use a default or construct the image URL if you have a pattern
//   const featuredMediaId = post?.featured_media;
//   const defaultImage = "https://costaricaninsurance.com/default-blog-image.jpg";

//   // You might need to fetch the actual media details separately
//   // const featuredImage = featuredMediaId ? `https://costaricaninsurance.com/wp-content/uploads/...` : defaultImage;
//   const featuredImage = defaultImage; // Update this when you have image URL logic

//   return {
//     //  FIXED: Proper title structure for Next.js
//     title: {
//       absolute: blogTitle, // This ensures the exact title is used without template
//     },
//     description,

//     // Essential meta tags
//     keywords:
//       `${blogTitle}, Costa Rica, insurance, blog, mortgage, property`.slice(
//         0,
//         255
//       ),
//     authors: [{ name: "Costa Rican Insurance" }],

//     // Canonical link
//     alternates: { canonical: url },

//     // OpenGraph meta tags
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: "Costa Rican Insurance",
//       locale: "en_US",
//       type: "article",
//       publishedTime: post.date,
//       modifiedTime: post.modified,
//       authors: ["Costa Rican Insurance"],
//       section: "Insurance",
//       tags: post?.tags?.map((tag) => tag.name) || ["insurance", "Costa Rica"],
//       images: [
//         {
//           url: featuredImage,
//           width: 1200,
//           height: 630,
//           alt: blogTitle,
//           type: "image/jpeg",
//         },
//       ],
//     },

//     // Twitter Card
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       creator: "@costaricanins",
//       site: "@costaricanins",
//       images: [featuredImage],
//     },

//     // Robots meta
//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         "max-video-preview": -1,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//     },

//     // Additional meta tags
//     other: {
//       "article:published_time": post.date,
//       "article:modified_time": post.modified,
//       "article:author": "Costa Rican Insurance",
//       "article:section": "Insurance",
//       "og:updated_time": post.modified, // This helps with content freshness
//     },
//   };
// }
export async function generateMetadata({ params }) {
  const { blog } = params;

  // const postId = decodePostId(decodeURIComponent(postid));
  const numericPostId = decodeURIComponent(params.postid);

  const post = postId ? await getpostdetails(numericPostId) : null;
  const postid = decodePostId(numericPostId);
  const blogTitle = post?.title?.rendered
    ? post.title.rendered
    : decodeURIComponent(blog.replace(/-/g, " "));

  const description = post?.content?.rendered
    ? (() => {
        const text = stripHtml(post.content.rendered).replace(
          /\[&hellip;\]/g,
          "..."
        );
        return text.length > 160 ? text.slice(0, 160) + "..." : text;
      })()
    : "Read the latest blog from Costa Rican Insurance about insurance solutions in Costa Rica.";

  const url = `https://costaseo.vercel.app/blog/${blogTitle
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")}/${postid}`;

  const featuredImage =
    post?.featured_media_url ||
    "https://costaseo.vercel.app/default-blog-image.jpg";

  return {
    title: blogTitle,
    description,
    keywords:
      `${blogTitle}, Costa Rica, insurance, blog, mortgage, property`.slice(
        0,
        255
      ),
    alternates: { canonical: url },
    openGraph: {
      title: blogTitle,
      description,
      url,
      siteName: "Costa Rican Insurance",
      type: "article",
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: blogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogTitle,
      description,
      images: [featuredImage],
      creator: "@costaricanins",
      site: "@costaricanins",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
export default async function Page({ params }) {
  const numericPostId = decodeURIComponent(params.postid);
  const postid = decodePostId(numericPostId);
  // const post = await getpostdetails(postid);

  // Generate structured data for this specific post
  // const generateStructuredData = () => {
  //   if (!post) return null;

  //   const title = stripHtml(post.title?.rendered || "");
  //   const description = stripHtml(post.excerpt?.rendered || "")
  //     .replace(/\[&hellip;\]/g, "...")
  //     .slice(0, 160);
  //   const slug = post?.slug || createSlug(title);
  //   const url = `https://costaseo.vercel.app/blog/${slug}/${params.postid}`;
  //   const defaultImage = "https://costaseo.vercel.app/default-blog-image.jpg";

  //   // Get word count from content
  //   const contentText = stripHtml(post?.content?.rendered || "");
  //   const wordCount = contentText
  //     .split(/\s+/)
  //     .filter((word) => word.length > 0).length;

  //   return {
  //     "@context": "https://schema.org",
  //     "@type": "BlogPosting",
  //     "@id": url,
  //     headline: title,
  //     description,
  //     image: {
  //       "@type": "ImageObject",
  //       url: defaultImage,
  //       width: 1200,
  //       height: 630,
  //     },
  //     datePublished: post.date,
  //     dateModified: post.modified,
  //     author: {
  //       "@type": "Organization",
  //       name: "Costa Rican Insurance",
  //       url: "https://costaricaninsurance.com",
  //       logo: {
  //         "@type": "ImageObject",
  //         url: "https://costaricaninsurance.com/logo.png",
  //         width: 200,
  //         height: 60,
  //       },
  //     },
  //     publisher: {
  //       "@type": "Organization",
  //       name: "Costa Rican Insurance",
  //       url: "https://costaricaninsurance.com",
  //       logo: {
  //         "@type": "ImageObject",
  //         url: "https://costaricaninsurance.com/logo.png",
  //         width: 200,
  //         height: 60,
  //       },
  //     },
  //     mainEntityOfPage: {
  //       "@type": "WebPage",
  //       "@id": url,
  //     },
  //     articleSection: "Insurance",
  //     keywords: "insurance, Costa Rica, mortgage, property, qualify",
  //     wordCount: wordCount,
  //     articleBody:
  //       contentText.slice(0, 500) + (contentText.length > 500 ? "..." : ""),
  //     inLanguage: "en-US",
  //     isAccessibleForFree: true,
  //   };
  // };

  // const structuredData = generateStructuredData();

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      {/* {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )} */}

      {/* Main Content */}
      <BlogClient postid={params.postid} />
    </>
  );
}
// import { getpostdetails } from "../../../lib/text";
// import BlogClient from "../BlogClient";

// function decodePostId(postId) {
//   if (!postId) return null;
//   if (/^\d+$/.test(postId)) {
//     return Number(postId);
//   }

//   try {
//     const decoded = atob(postId); // base64 → "post:143"
//     const parts = decoded.split(":");
//     const numeric = Number(parts.pop());
//     return isNaN(numeric) ? null : numeric;
//   } catch {
//     return null;
//   }
// }

// function stripHtml(html) {
//   if (!html) return "";
//   return html.replace(/<[^>]*>?/gm, "").trim();
// }

// function createSlug(title) {
//   if (!title) return "";
//   return title
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .trim()
//     .replace(/\s+/g, "-");
// }

// function cleanDescription(excerpt) {
//   if (!excerpt) return "";
//   return stripHtml(excerpt)
//     .replace(/\[&hellip;\]/g, "...")
//     .replace(/\s+/g, " ")
//     .trim()
//     .slice(0, 160);
// }

// export async function generateMetadata(props) {
//   try {
//     const params = await props.params;
//     const numericPostId = decodeURIComponent(params.postid);
//     const postid = decodePostId(numericPostId);

//     // If we can't decode the postid, return 404-like metadata
//     if (!postid) {
//       return {
//         title: "Costa Rican Insurance",
//         description:
//           "Read Costa Rican Insurance blog - your trusted source for insurance information in Costa Rica.",
//         robots: { index: false, follow: false },
//       };
//     }

//     // Fetch post data
//     const post = await getpostdetails(postid);

//     // if (!post) {
//     //   return {
//     //     title: "Costa Rican Insurance",
//     //     description:
//     //       "Read Costa Rican Insurance blog - your trusted source for insurance information in Costa Rica",
//     //     robots: { index: false, follow: false },
//     //   };
//     // }

//     // Extract and clean title
//     const rawTitle = post.title?.rendered;
//     if (!rawTitle) {
//       return {
//         title: "Costa Rican Insurance",
//         description:
//           "Read Costa Rican Insurance blog - your trusted source for insurance information in Costa Rica.",
//         robots: { index: false, follow: false },
//       };
//     }

//     const title = stripHtml(rawTitle);

//     // Extract and clean description
//     const rawExcerpt = post.excerpt?.rendered || post.content?.rendered;
//     const description =
//       cleanDescription(rawExcerpt) ||
//       `Read about ${title} on Costa Rican Insurance blog - your trusted source for insurance information in Costa Rica.`;

//     // Create proper URL
//     const slug = post.slug || createSlug(title);
//     const url = `https://costaseo.vercel.app/blog/${slug}/${params.postid}`;

//     // Handle featured image
//     const defaultImage = "https://costaseo.vercel.app/default-blog-image.jpg";

//     // Create keywords from title and categories
//     const baseKeywords = ["Costa Rica", "insurance", "blog"];
//     const titleKeywords = title.toLowerCase().split(/\s+/).slice(0, 3);
//     const keywords = [...new Set([...titleKeywords, ...baseKeywords])].join(
//       ", "
//     );

//     return {
//       title: title, // Use simple string instead of object
//       description,

//       // Essential meta tags
//       keywords: keywords.slice(0, 255),
//       authors: [{ name: "Costa Rican Insurance" }],

//       // Canonical link
//       alternates: {
//         canonical: url,
//       },

//       // OpenGraph meta tags
//       openGraph: {
//         title: title,
//         description,
//         url,
//         siteName: "Costa Rican Insurance",
//         locale: "en_US",
//         type: "article",
//         publishedTime: post.date,
//         modifiedTime: post.modified || post.date,
//         authors: ["Costa Rican Insurance"],
//         section: "Insurance",
//         images: [
//           {
//             url: defaultImage,
//             width: 1200,
//             height: 630,
//             alt: title,
//             type: "image/jpeg",
//           },
//         ],
//       },

//       // Twitter Card
//       twitter: {
//         card: "summary_large_image",
//         title: title,
//         description,
//         creator: "@costaricanins",
//         site: "@costaricanins",
//         images: [defaultImage],
//       },

//       // Robots meta
//       robots: {
//         index: true,
//         follow: true,
//         googleBot: {
//           index: true,
//           follow: true,
//           "max-video-preview": -1,
//           "max-image-preview": "large",
//           "max-snippet": -1,
//         },
//       },

//       // Additional meta tags
//       other: {
//         "article:published_time": post.date,
//         "article:modified_time": post.modified || post.date,
//         "article:author": "Costa Rican Insurance",
//         "article:section": "Insurance",
//         "og:updated_time": post.modified || post.date,
//       },
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);

//     // Return fallback metadata on error
//     return {
//       title: "Costa Rican Insurance - Blog",
//       description:
//         "Read the latest blog posts from Costa Rican Insurance about insurance solutions in Costa Rica.",
//       robots: { index: false, follow: true },
//     };
//   }
// }

// export default async function Page({ params }) {
//   const numericPostId = decodeURIComponent(params.postid);
//   const postid = decodePostId(numericPostId);

//   // Don't fetch post again since we already have it in generateMetadata
//   // But we need it for structured data
//   const post = await getpostdetails(postid);

//   // Generate structured data for this specific post
//   const generateStructuredData = () => {
//     if (!post || !post.title?.rendered) return null;

//     const title = stripHtml(post.title.rendered);
//     const description =
//       cleanDescription(post.excerpt?.rendered || post.content?.rendered) ||
//       `Read about ${title} on Costa Rican Insurance blog.`;

//     const slug = post.slug || createSlug(title);
//     const url = `https://costaseo.vercel.app/blog/${slug}/${params.postid}`;
//     const defaultImage = "https://costaseo.vercel.app/default-blog-image.jpg";

//     // Get word count from content
//     const contentText = stripHtml(post.content?.rendered || "");
//     const wordCount = contentText
//       .split(/\s+/)
//       .filter((word) => word.length > 0).length;

//     return {
//       "@context": "https://schema.org",
//       "@type": "BlogPosting",
//       "@id": url,
//       headline: title,
//       description,
//       image: {
//         "@type": "ImageObject",
//         url: defaultImage,
//         width: 1200,
//         height: 630,
//       },
//       datePublished: post.date,
//       dateModified: post.modified || post.date,
//       author: {
//         "@type": "Organization",
//         name: "Costa Rican Insurance",
//         url: "https://costaricaninsurance.com",
//         logo: {
//           "@type": "ImageObject",
//           url: "https://costaricaninsurance.com/logo.png",
//           width: 200,
//           height: 60,
//         },
//       },
//       publisher: {
//         "@type": "Organization",
//         name: "Costa Rican Insurance",
//         url: "https://costaricaninsurance.com",
//         logo: {
//           "@type": "ImageObject",
//           url: "https://costaricaninsurance.com/logo.png",
//           width: 200,
//           height: 60,
//         },
//       },
//       mainEntityOfPage: {
//         "@type": "WebPage",
//         "@id": url,
//       },
//       articleSection: "Insurance",
//       keywords:
//         `${title}, insurance, Costa Rica, mortgage, property`.toLowerCase(),
//       wordCount: wordCount,
//       articleBody:
//         contentText.slice(0, 500) + (contentText.length > 500 ? "..." : ""),
//       inLanguage: "en-US",
//       isAccessibleForFree: true,
//     };
//   };

//   const structuredData = generateStructuredData();

//   return (
//     <>
//       {/* Structured Data (JSON-LD) */}
//       {structuredData && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(structuredData),
//           }}
//         />
//       )}

//       {/* Main Content */}
//       <BlogClient postid={params.postid} />
//     </>
//   );
// }
