import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [reels, setReels] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReels();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.isIntersecting) {
            video?.play();
          } else {
            video?.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    document.querySelectorAll(".reel-item").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reels]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const res = await API.get(`reels/?page=${page}`);
      setReels((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.error("Load Reels Error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const likeReel = async (id) => {
    try {
      await API.post(`reels/${id}/like/`);
      loadReels();
    } catch (err) {
      console.error("Like Error:", err);
      navigate("/login");
    }
  };

  const loadComments = async (reelId) => {
    try {
      const res = await API.get(`reels/${reelId}/comments/`);
      setComments({ ...comments, [reelId]: res.data });
    } catch (err) {
      console.error("Comments Error:", err);
    }
  };

  const addComment = async (reelId) => {
    if (!commentText.trim()) return;
    try {
      await API.post(`reels/${reelId}/comments/create/`, { text: commentText });
      setCommentText("");
      loadComments(reelId);
    } catch (err) {
      console.error("Add Comment Error:", err);
    }
  };

  const handleDoubleTap = (id) => {
    likeReel(id);
    setLikedAnimation(id);
    setTimeout(() => setLikedAnimation(null), 800);
  };

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Heart Animation */}
      <style>
        {`
          @keyframes popHeart {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
            40% { transform: translate(-50%, -50%) scale(1.2); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
          }
        `}
      </style>

      <div style={styles.container}>
        {reels.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎥</div>
            <h2 style={styles.emptyTitle}>No reels yet</h2>
            <p style={styles.emptySubtitle}>Be the first to share your knowledge!</p>
            
            <button 
              onClick={() => navigate("/upload")}
              style={styles.uploadBtn}
            >
              📹 Upload Your First Reel
            </button>
          </div>
        ) : (
          reels.map((reel) => (
            <div
              key={reel.id}
              className="reel-item"
              style={styles.reelContainer}
              onDoubleClick={() => handleDoubleTap(reel.id)}
            >
              <video
                loop
                muted
                playsInline
                controls
                style={styles.video}
              >
                <source src={`http://127.0.0.1:8000${reel.video}`} />
              </video>

              {likedAnimation === reel.id && (
                <div style={styles.heartAnimation}>❤️</div>
              )}

              <div style={styles.bottomGradient} />

              {/* Overlay Content */}
              <div style={styles.overlay}>
                <div style={styles.creatorRow}>
                  <div style={styles.creatorAvatar}>👤</div>
                  <div style={styles.creatorInfo}>
                    <div style={styles.creatorName}>
                      {reel.creator?.phone || "Creator"}
                    </div>
                    <div style={styles.title}>{reel.title}</div>
                  </div>
                </div>

                {reel.description && (
                  <p style={styles.description}>{reel.description}</p>
                )}

                <div style={styles.actions}>
                  <button onClick={() => likeReel(reel.id)} style={styles.actionButton}>
                    ❤️ <span style={styles.actionCount}>{reel.likes || 0}</span>
                  </button>
                  <button onClick={() => loadComments(reel.id)} style={styles.actionButton}>
                    💬
                  </button>
                  <button style={styles.actionButton}>🔗</button>
                </div>
              </div>

              {/* Comments Preview */}
              {comments[reel.id] && comments[reel.id].length > 0 && (
                <div style={styles.commentsPreview}>
                  {comments[reel.id].slice(0, 2).map((c) => (
                    <p key={c.id} style={styles.commentText}>
                      <b>{c.user_phone}</b>: {c.text}
                    </p>
                  ))}
                </div>
              )}

              {/* Comment Bar */}
              <div style={styles.commentBar}>
                <input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={styles.commentInput}
                />
                <button onClick={() => addComment(reel.id)} style={styles.sendButton}>
                  Send
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Navbar />
    </>
  );
}

const styles = {
  container: {
    background: "#000",
    minHeight: "100vh",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    paddingBottom: "80px",
  },

  reelContainer: {
    height: "100vh",
    scrollSnapAlign: "start",
    position: "relative",
    background: "#000",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(transparent, rgba(0,0,0,0.95))",
    pointerEvents: "none",
  },

  overlay: {
    position: "absolute",
    bottom: "100px",
    left: "16px",
    right: "16px",
    zIndex: 3,
    color: "#fff",
  },

  creatorRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  creatorAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f56040, #c13584)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    border: "3px solid #fff",
  },

  creatorInfo: { flex: 1 },
  creatorName: { fontWeight: "600", fontSize: "15px" },
  title: { fontSize: "17px", fontWeight: "700", marginTop: "2px" },

  description: {
    fontSize: "14.5px",
    lineHeight: "1.4",
    margin: "8px 0 14px",
    opacity: 0.9,
  },

  actions: { display: "flex", gap: "24px" },
  actionButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "29px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  actionCount: { fontSize: "15px", fontWeight: "500" },

  heartAnimation: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "120px",
    zIndex: 10,
    pointerEvents: "none",
    animation: "popHeart 0.8s ease forwards",
  },

  commentsPreview: {
    position: "absolute",
    bottom: "170px",
    left: "16px",
    right: "16px",
    background: "rgba(0,0,0,0.7)",
    padding: "12px 16px",
    borderRadius: "14px",
    fontSize: "14px",
    maxHeight: "100px",
    overflowY: "auto",
    zIndex: 2,
  },

  commentText: { margin: "5px 0", lineHeight: "1.3" },

  commentBar: {
    position: "absolute",
    bottom: "70px",
    left: "16px",
    right: "16px",
    background: "rgba(30,30,30,0.9)",
    borderRadius: "30px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    zIndex: 5,
    border: "1px solid rgba(255,255,255,0.15)",
  },

  commentInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: "10px 12px",
    fontSize: "15.5px",
  },

  sendButton: {
    background: "#0095f6",
    color: "#fff",
    border: "none",
    padding: "9px 22px",
    borderRadius: "22px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* Empty State - Much More Beautiful */
  emptyState: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    padding: "0 40px",
  },

  emptyIcon: {
    fontSize: "90px",
    marginBottom: "20px",
    opacity: 0.8,
  },

  emptyTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  emptySubtitle: {
    fontSize: "16px",
    color: "#aaa",
    marginBottom: "40px",
    maxWidth: "280px",
  },

  uploadBtn: {
    background: "linear-gradient(90deg, #f56040, #c13584)",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    borderRadius: "50px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(245, 96, 64, 0.4)",
  },
};