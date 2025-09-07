import axios from "axios";

export async function translateText(text, targetLang) {
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

export async function getpostdetails(postid) {
  try {
    const res = await fetch(
      `https://admin.costaricaninsurance.com/wp-json/wp/v2/posts/${postid}`
    );
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    return await res.json();
    // return response.data; // { id, title, content, excerpt, author, date, ... }
  } catch (error) {
    console.error(
      "Error fetching post:",
      error.response?.data || error.message
    );
    return null;
  }
}
