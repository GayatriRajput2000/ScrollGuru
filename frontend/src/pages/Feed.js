import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [reels, setReels] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      const res = await API.get("reels/");
      setReels(res.data);
      console.log("Reels loaded successfully:", res.data);
    } catch (err) {
      console.error("Load Reels Error:", err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired or not logged in. Redirecting to login...");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to load reels. Check console (F12) for details.");
      }
    }
  };

  // Like Reel
  const likeReel = async (id) => {
    try {
      await API.post(`reels/${id}/like/`);
      loadReels();
    } catch (err) {
      console.error("Like Error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    }
  };

  // Load Comments
  const loadComments = async (reelId) => {
    try {
      const res = await API.get(`reels/${reelId}/comments/`);
      setComments({
        ...comments,
        [reelId]: res.data,
      });
    } catch (err) {
      console.error("Comments Error:", err);
    }
  };

  // Add Comment
  const addComment = async (reelId) => {
    if (!commentText.trim()) return;

    try {
      await API.post(`reels/${reelId}/comments/create/`, {
        text: commentText,
      });
      setCommentText("");
      loadComments(reelId);
    } catch (err) {
      console.error("Add Comment Error:", err);
    }
  };

  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>
      <h2 style={{ position: "fixed", top: 10, left: 20 }}>
        ScrollGuru Feed
      </h2>

      {reels.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "100px" }}>No reels uploaded yet 🚀</p>
      ) : (
        reels.map((reel) => (
          <div key={reel.id} style={{ marginBottom: "60px" }}>
            <h3>{reel.title}</h3>

            <video
              controls
              autoPlay
              loop
              width="100%"
              style={{ maxHeight: "80vh", objectFit: "cover" }}
            >
              <source src={`http://127.0.0.1:8000${reel.video}`} />
            </video>

            <p>{reel.description}</p>

            <button onClick={() => likeReel(reel.id)}>
              ❤️ Like ({reel.likes || 0})
            </button>

            <div>
              <button onClick={() => loadComments(reel.id)}>Show Comments</button>

              {comments[reel.id]?.map((c) => (
                <p key={c.id}>
                  <b>{c.user_phone}</b>: {c.text}
                </p>
              ))}

              <input
                placeholder="Write comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={() => addComment(reel.id)}>Comment</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}