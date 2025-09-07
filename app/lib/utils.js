import { gql, GraphQLClient } from "graphql-request";

export const graphQLClient = new GraphQLClient(
  "https://admin.costaricaninsurance.com/graphql",
  {
    headers: { "Content-Type": "application/json" },
  }
);

export const GET_HERO_AND_STATS = gql`
  query GetAllCategoriesWithPosts {
    categories(first: 100) {
      nodes {
        id
        name
        slug
        posts(first: 20) {
          nodes {
            id
            title
            content
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
        children(first: 100) {
          nodes {
            id
            name
            slug
            posts(first: 20) {
              nodes {
                id
                title
                content
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
            children(first: 100) {
              nodes {
                id
                name
                slug
                posts(first: 20) {
                  nodes {
                    id
                    title
                    content
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
// export async function translateText(text, targetLang) {
//   if (!text || targetLang === "en") return text;
//   try {
//     const res = await fetch("/api/translate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text, targetLang }),
//     });
//     const data = await res.json();
//     return data.translatedText || text;
//   } catch (err) {
//     console.error("Translation error:", err);
//     return text;
//   }
// }
