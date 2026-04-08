import API from "../api/axios";
import { useState } from "react";

export default function ReelCard({ reel, loadReels }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const likeReel = async () => {
    await API.post(`reels/${reel.id}/like/`);
    loadReels();
  };

  const loadComments = async () => {
    const res = await API.get(`reels/${reel.id}/comments/`);
    setComments(res.data);
    setShowComments(!showComments);
  };

  const addComment = async () => {
    if (!commentText) return;

    await API.post(`reels/${reel.id}/comments/create/`, {
      text: commentText,
    });

    setCommentText("");
    loadComments();
  };

  return (
    <div className="reel">

      <video
        src={`http://127.0.0.1:8000${reel.video}`}
        autoPlay
        loop
        controls
        className="video"
      />

      <div className="overlay">

        <h3>{reel.title}</h3>

        <button onClick={likeReel}>
          ❤️ {reel.likes}
        </button>

        <button onClick={loadComments}>💬</button>

        {showComments && (
          <div>
            {comments.map((c) => (
              <p key={c.id}>
                <b>{c.user_phone}</b>: {c.text}
              </p>
            ))}

            <input
              placeholder="Comment..."
              value={commentText}
              onChange={(e)=>setCommentText(e.target.value)}
            />
            <button onClick={addComment}>Send</button>
          </div>
        )}

      </div>
    </div>
  );
}