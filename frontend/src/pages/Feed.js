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

    document.querySelectorAll(".reel-item").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [reels]);

  const loadReels = async () => {
    try {
      const res = await API.get(`reels/?page=${page}`);
      setReels((prev) => [...prev, ...res.data]);
      console.log("Reels loaded successfully:", res.data);
    } catch (err) {
      console.error("Load Reels Error:", err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to load reels");
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
      navigate("/login");
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

  const handleDoubleTap = (id) => {
    likeReel(id);
    setLikedAnimation(id);
    setTimeout(() => setLikedAnimation(null), 800);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Heart Animation CSS */}
      <style>
        {`
          @keyframes popHeart {
            0% { 
              transform: translate(-50%, -50%) scale(0.3); 
              opacity: 0; 
            }
            40% { 
              transform: translate(-50%, -50%) scale(1.2); 
            }
            100% { 
              transform: translate(-50%, -50%) scale(1); 
              opacity: 0; 
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {reels.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: "18px" }}>No reels uploaded yet 🚀</p>
            <p style={{ fontSize: "14px", opacity: 0.6, marginTop: "8px" }}>
              Be the first to upload!
            </p>
          </div>
        ) : (
          reels.map((reel) => (
            <div
              key={reel.id}
              className="reel-item"
              style={styles.reelContainer}
              onDoubleClick={() => handleDoubleTap(reel.id)}
            >
              {/* VIDEO */}
              <video
                loop
                muted
                playsInline
                controls
                width="100%"
                style={styles.video}
              >
                <source src={`http://127.0.0.1:8000${reel.video}`} />
              </video>

              {/* Double Tap Heart Animation */}
              {likedAnimation === reel.id && (
                <div style={styles.heartAnimation}>❤️</div>
              )}

              {/* Bottom Gradient Overlay */}
              <div style={styles.bottomGradient} />

              {/* Main Overlay Content */}
              <div style={styles.overlay}>
                {/* Creator Info */}
                <div style={styles.creatorRow}>
                  <div style={styles.creatorAvatar}>👤</div>
                  <div style={styles.creatorInfo}>
                    <div style={styles.creatorName}>
                      {reel.creator?.phone || "Creator"}
                    </div>
                    <div style={styles.title}>{reel.title}</div>
                  </div>
                </div>

                {/* Description */}
                {reel.description && (
                  <p style={styles.description}>{reel.description}</p>
                )}

                {/* Action Buttons */}
                <div style={styles.actions}>
                  <button 
                    onClick={() => likeReel(reel.id)} 
                    style={styles.actionButton}
                  >
                    ❤️ <span style={styles.actionCount}>{reel.likes || 0}</span>
                  </button>

                  <button 
                    onClick={() => loadComments(reel.id)} 
                    style={styles.actionButton}
                  >
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

              {/* Comment Input Bar */}
              <div style={styles.commentBar}>
                <input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={styles.commentInput}
                />
                <button 
                  onClick={() => addComment(reel.id)}
                  style={styles.sendButton}
                >
                  Send
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instagram Bottom Navbar */}
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
    height: "45%",
    background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
    pointerEvents: "none",
  },

  overlay: {
    position: "absolute",
    bottom: "110px",
    left: "16px",
    right: "16px",
    zIndex: 3,
    color: "#fff",
  },

  creatorRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },

  creatorAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f56040, #c13584)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    border: "3px solid #fff",
  },

  creatorInfo: {
    flex: 1,
  },

  creatorName: {
    fontWeight: "600",
    fontSize: "15px",
  },

  title: {
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "2px",
  },

  description: {
    fontSize: "14.5px",
    lineHeight: "1.4",
    margin: "8px 0 12px",
    opacity: 0.95,
  },

  actions: {
    display: "flex",
    gap: "22px",
  },

  actionButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    cursor: "pointer",
  },

  actionCount: {
    fontSize: "15px",
    fontWeight: "500",
  },

  heartAnimation: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "110px",
    zIndex: 10,
    pointerEvents: "none",
    animation: "popHeart 0.8s ease forwards",
  },

  commentsPreview: {
    position: "absolute",
    bottom: "165px",
    left: "16px",
    right: "16px",
    background: "rgba(0,0,0,0.65)",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "13.5px",
    maxHeight: "90px",
    overflowY: "auto",
    zIndex: 2,
  },

  commentText: {
    margin: "4px 0",
    lineHeight: "1.3",
  },

  commentBar: {
    position: "absolute",
    bottom: "68px",
    left: "16px",
    right: "16px",
    background: "rgba(30,30,30,0.85)",
    borderRadius: "30px",
    padding: "6px 10px",
    display: "flex",
    alignItems: "center",
    zIndex: 5,
    border: "1px solid rgba(255,255,255,0.1)",
  },

  commentInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: "8px 12px",
    fontSize: "15px",
  },

  sendButton: {
    background: "#0095f6",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  emptyState: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#aaa",
    textAlign: "center",
  },
};