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
      const res = await API.get("reels/?page=${page}");
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
      <div style={styles.container}>
        {reels.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>
            No reels uploaded yet 🚀
          </p>
        ) : (
          reels.map((reel) => (
            <div className="reel-item"
                style={{ position: "relative" }}
                onDoubleClick={() => handleDoubleTap(reel.id)}
            >
              
              {/* VIDEO */}
              <video
                loop
                muted
                playsInline            
                controls
                width="100%"
                style={{ maxHeight: "80vh", objectFit: "cover" }}
              >
                <source src={`http://127.0.0.1:8000${reel.video}`} />
              </video>
            
                {likedAnimation === reel.id && (
                    <div style={styles.heart}>❤️</div>
                )}


              {/* OVERLAY CONTENT */}
              <div style={styles.overlay}>
                <h3>{reel.title}</h3>
                <p>{reel.description}</p>

                <button onClick={() => likeReel(reel.id)}>
                  ❤️ {reel.likes || 0}
                </button>

                <button onClick={() => loadComments(reel.id)}>
                  💬 Comments
                </button>

                {comments[reel.id]?.map((c) => (
                  <p key={c.id}>
                    <b>{c.user_phone}</b>: {c.text}
                  </p>
                ))}

                <input
                  placeholder="Write comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button onClick={() => addComment(reel.id)}>
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
    height: "100vh",
    overflowY: "scroll",
    scrollSnapType: "y mandatory",
    background: "black",
  },

  reel: {
    height: "100vh",
    scrollSnapAlign: "start",
    position: "relative",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    bottom: "90px",
    left: "20px",
    color: "white",
    background: "rgba(0,0,0,0.4)",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "90%",
  },
  heart: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "80px",
    animation: "pop 0.8s ease",
    },
};