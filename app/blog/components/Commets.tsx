// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// function decodePostId(
//   postId: string | number | undefined | null
// ): number | null {
//   if (!postId) {
//     return null;
//   }

//   if (typeof postId === "number") return postId;

//   try {
//     // Decode base64 → "post:143"
//     const decoded = atob(postId);
//     const parts = decoded.split(":");
//     const numeric = Number(parts.pop());
//     if (isNaN(numeric)) throw new Error("Decoded value is not a number");
//     return numeric;
//   } catch (err) {
//     return null;
//   }
// }

// export default function Comments({ postId }: { postId: number }) {
//   const [formData, setFormData] = useState({
//     comment: "",
//     name: "",
//     email: "",
//     saveInfo: false,
//   });
//   const [comments, setComments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);
//   // Fetch comments from WordPress
//   useEffect(() => {
//     const fetchComments = async () => {
//       const numericPostId = decodePostId(postId);
//       if (!numericPostId) return;
//       try {
//         const res = await axios.get(
//           `https://admin.costaricaninsurance.com/wp-json/wp/v2/comments?post=${numericPostId}`
//         );
//         console.log(res?.data, "commen");
//         setComments(res.data);
//       } catch (err) {
//         console.error("Error fetching comments:", err);
//       }
//     };
//     fetchComments();
//   }, [postId]);
//   // console.log(postId, "postId");

//   // Handle input
//   const handleInputChange = (e: any) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Submit to WP
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!formData.comment || !formData.name || !formData.email) {
//       alert("Please fill in all required fields");
//       return;
//     }
//     console.log(
//       postId,
//       formData.name,
//       formData.email,
//       formData.comment,
//       "data to submit"
//     );
//     setLoading(true);
//     const numericPostId = decodePostId(postId);
//     try {
//       const res = await axios.post(
//         `https://admin.costaricaninsurance.com/wp-json/wp/v2/comments`,
//         {
//           post: numericPostId,
//           author_name: formData.name,
//           author_email: formData.email,
//           content: formData.comment,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Add new comment instantly (optimistic update)
//       setComments((prev) => [res.data, ...prev]);
//       setPopupMessage("Your comment has been submitted!");
//       setFormData({
//         comment: "",
//         name: "",
//         email: "",
//         saveInfo: false,
//       });
//     } catch (err: any) {
//       console.error("Error submitting comment:", err.response?.data || err);
//       alert("Could not post comment. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto dark:text-[#fff] p-6">
//       {popupMessage && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-white/30 text-black dark:text-white p-6 rounded-2xl shadow-lg text-center">
//             <p className="text-lg">{popupMessage}</p>
//             <button
//               onClick={() => setPopupMessage(null)}
//               className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//             >
//               OK
//             </button>
//           </div>
//           <div
//             className="fixed inset-0 bg-black opacity-40"
//             onClick={() => setPopupMessage(null)}
//           />
//         </div>
//       )}
//       {/* Comments List */}
//       <h2 className="text-2xl font-[marcellus] font-bold w-fit  border-b border-orange-400 mb-4">
//         Comments ({comments.length})
//       </h2>
//       {comments.length === 0 ? (
//         <p>No comments yet.</p>
//       ) : (
//         <div className="space-y-6">
//           {comments.map((comment) => (
//             <div
//               key={comment.id}
//               className="p-4 border dark:border-gray-700 rounded-2xl"
//             >
//               <h4 className="font-semibold">{comment.author_name}</h4>
//               <div
//                 className="text-gray-700 dark:text-gray-300"
//                 dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
//               />
//               <p className="text-xs text-gray-500 dark:text-gray-300">
//                 {new Date(comment.date).toISOString().split("T")[0]}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Comment Form */}
//       <div className="mt-8 ">
//         <h3 className="text-xl font-bold font-[marcellus] mb-4">
//           Leave a Reply
//         </h3>
//         <textarea
//           name="comment"
//           value={formData.comment}
//           onChange={handleInputChange}
//           placeholder="Your Comment"
//           rows={5}
//           className="w-full p-3 border  dark:bg-white/10 dark:border-white/10 rounded-2xl mb-3"
//         />
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           placeholder="Name"
//           className="w-full p-3 border rounded-2xl dark:bg-white/10 dark:border-white/10 mb-3"
//         />
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleInputChange}
//           placeholder="Email"
//           className="w-full p-3 border  dark:bg-white/10 dark:border-white/10 rounded-2xl mb-3"
//         />
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="px-6 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50"
//         >
//           {loading ? "Posting..." : "Post Comment"}
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
function buildCommentTree(comments: any[]) {
  const map: Record<number, any> = {};
  const roots: any[] = [];

  comments.forEach((c) => {
    map[c.id] = { ...c, children: [] };
  });

  comments.forEach((c) => {
    if (c.parent && map[c.parent]) {
      map[c.parent].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}
function decodePostId(
  postId: string | number | undefined | null
): number | null {
  if (!postId) return null;
  if (typeof postId === "number") return postId;
  try {
    const decoded = atob(postId);
    const parts = decoded.split(":");
    const numeric = Number(parts.pop());
    if (isNaN(numeric)) throw new Error("Decoded value is not a number");
    return numeric;
  } catch (err) {
    return null;
  }
}

export default function Comments({ postId }: { postId: number }) {
  const [formData, setFormData] = useState({
    comment: "",
    name: "",
    email: "",
    saveInfo: false,
  });
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // Track reply state
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Fetch comments from WordPress
  useEffect(() => {
    const fetchComments = async () => {
      const numericPostId = decodePostId(postId);
      if (!numericPostId) return;
      try {
        const res = await axios.get(
          `https://admin.costaricaninsurance.com/wp-json/wp/v2/comments?post=${numericPostId}&per_page=100`
        );
        console.log(res?.data, "res");
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // Handle input
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit comment or reply
  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   if (!formData.comment || !formData.name || !formData.email) {
  //     alert("Please fill in all required fields");
  //     return;
  //   }
  //   setLoading(true);
  //   const numericPostId = decodePostId(postId);
  //   try {
  //     const payload: any = {
  //       post: numericPostId,
  //       author_name: formData.name,
  //       author_email: formData.email,
  //       content: formData.comment,
  //     };
  //     if (replyingTo) {
  //       payload.parent = replyingTo; // make it a reply
  //     }

  //     const res = await axios.post(
  //       `https://admin.costaricaninsurance.com/wp-json/wp/v2/comments`,
  //       payload,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     setComments((prev) => [res.data, ...prev]);
  //     setPopupMessage(
  //       replyingTo
  //         ? "Your reply has been submitted!"
  //         : "Your comment has been submitted!"
  //     );

  //     // reset
  //     setFormData({ comment: "", name: "", email: "", saveInfo: false });
  //     setReplyingTo(null);
  //   } catch (err: any) {
  //     console.error("Error submitting comment:", err.response?.data || err);
  //     alert("Could not post comment. Please try again.");
  //   }
  //   setLoading(false);
  // };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.comment || !formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const numericPostId = decodePostId(postId);
    try {
      const payload: any = {
        post: numericPostId,
        author_name: formData.name,
        author_email: formData.email,
        content: formData.comment,
      };
      if (replyingTo) payload.parent = replyingTo;

      const res = await axios.post(
        `https://admin.costaricaninsurance.com/wp-json/wp/v2/comments`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setComments((prev) => [res.data, ...prev]);
      setPopupMessage(
        replyingTo
          ? "Your reply has been submitted!"
          : "Your comment has been submitted!"
      );
      setFormData({ comment: "", name: "", email: "", saveInfo: false });
      setReplyingTo(null);
    } catch (err: any) {
      console.error("Error submitting comment:", err.response?.data || err);
      alert("Could not post comment. Please try again.");
    }
    setLoading(false);
  };
  const renderComments = (comments: any[], depth = 0) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`p-4 border dark:border-gray-700 rounded-2xl mt-4`}
        style={{ marginLeft: depth * 30 }}
      >
        <h4 className="font-semibold">{comment.author_name}</h4>
        <div
          className="text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
        />
        <p className="text-xs text-gray-500 dark:text-gray-300">
          {new Date(comment.date).toISOString().split("T")[0]}
        </p>

        <button
          onClick={() => {
            setReplyingTo(replyingTo === comment.id ? null : comment.id);
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 50);
          }}
          className="mt-2 text-sm text-black dark:text-white font-bold hover:underline"
        >
          {replyingTo === comment.id ? "Cancel" : "Reply"}
        </button>

        {replyingTo === comment.id && (
          <p className="text-sm text-gray-400 mt-1">
            Replying to{" "}
            <span className="font-semibold">{comment.author_name}</span>
          </p>
        )}

        {/* Render children recursively */}
        {comment.children && comment.children.length > 0 && (
          <div className="mt-3">
            {renderComments(comment.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };
  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setTimeout(() => {
      textareaRef.current?.focus(); // ⬅️ move cursor
    }, 50);
  };
  const commentTree = buildCommentTree(comments);
  return (
    <div className="max-w-4xl mx-auto dark:text-[#fff] p-6">
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-white/30 z-60 text-black dark:text-white p-6 rounded-2xl shadow-lg text-center">
            <p className="text-lg">{popupMessage}</p>
            <button
              onClick={() => setPopupMessage(null)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              OK
            </button>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setPopupMessage(null)}
          />
        </div>
      )}

      {/* Comments List */}
      <h2 className="text-2xl font-[marcellus] font-bold w-fit border-b border-orange-400 mb-4">
        Comments ({comments.length})
      </h2>
      {/* {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border dark:border-gray-700 rounded-2xl"
            >
              <h4 className="font-semibold">{comment.author_name}</h4>
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {new Date(comment.date).toISOString().split("T")[0]}
              </p>

            
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                className="mt-2 text-sm text-orange-500 hover:underline"
              >
                {replyingTo === comment.id ? "Cancel Reply" : "Reply"}
              </button>

             
              {replyingTo === comment.id && (
                <p className="text-sm text-gray-400 mt-1">
                  Replying to{" "}
                  <span className="font-semibold">{comment.author_name}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )} */}
      {commentTree.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div>{renderComments(commentTree)}</div>
      )}
      {/* Single Comment/Reply Form */}
      <div className="mt-8">
        <h3 className="text-xl font-bold font-[marcellus] mb-4">
          {replyingTo ? "Write a Reply" : "Leave a Comment"}
        </h3>

        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Your Comment"
            rows={5}
            className="w-full p-3 border outline-black dark:outline-white/10 dark:bg-white/10 dark:border-white/10 rounded-2xl mb-3"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full p-3 border rounded-2xl outline-none dark:bg-white/10 dark:border-white/10 mb-3"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-3 border outline-none dark:bg-white/10 dark:border-white/10 rounded-2xl mb-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50"
          >
            {loading
              ? "Posting..."
              : replyingTo
              ? "Post Reply"
              : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
