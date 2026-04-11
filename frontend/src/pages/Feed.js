import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const stories = [
  { name: "Your story", img: "myprofile", isYou: true },
  { name: "sarah_lens", img: "sarah42", seen: false },
  { name: "maxtravel", img: "max88", seen: false },
  { name: "julia.art", img: "julia77", seen: false },
  { name: "kai_photo", img: "kai55", seen: true },
  { name: "nina_bakes", img: "nina33", seen: false },
  { name: "leo_fitness", img: "leo99", seen: true },
  { name: "mia_wander", img: "mia44", seen: false },
];

const suggestions = [
  { name: "river_wild", img: "river12", mutual: "Suggested for you" },
  { name: "chef_maria", img: "maria45", mutual: "Followed by nina_bakes" },
  { name: "urban_sketch", img: "sketch78", mutual: "Suggested for you" },
  { name: "astro_night", img: "astro90", mutual: "Followed by kai_photo" },
];

const sidebarLinks = [
  { icon: "fa-house", label: "Home", key: "home" },
  { icon: "fa-compass", label: "Explore", key: "explore" },
  { icon: "fa-film", label: "Reels", key: "reels" },
  { icon: "fa-paper-plane", label: "Messages", key: "messages" },
  { divider: true },
  { icon: "fa-user", label: "Profile", key: "profile" },
  { icon: "fa-bookmark", label: "Saved", key: "saved" },
  { icon: "fa-gear", label: "Settings", key: "settings" },
];

const mobileLinks = [
  { icon: "fa-house", key: "home" },
  { icon: "fa-compass", key: "explore" },
  { icon: "fa-square-plus", key: "create" },
  { icon: "fa-film", key: "reels" },
  { icon: "fa-user", key: "profile", isAvatar: true },
];

export default function Feed() {
  const [reels, setReels] = useState([]);
  const [comments, setComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [heartAnim, setHeartAnim] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const [sidebarActive, setSidebarActive] = useState("home");
  const [mobileActive, setMobileActive] = useState("home");
  const [followState, setFollowState] = useState({});
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const observerRef = useRef(null);
  const toastTimer = useRef(null);
  const loadingRef = useRef(false);

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastKey((k) => k + 1);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const loadReels = async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const res = await API.get(`reels/?page=${page}`);
      const incoming = res.data || [];

      if (!incoming.length) {
        setHasMore(false);
        return;
      }

      setReels((prev) => {
        const ids = new Set(prev.map((r) => r.id));
        const filtered = incoming.filter((r) => !ids.has(r.id));
        return [...prev, ...filtered];
      });
    } catch (err) {
      console.error(err);
      if ([401, 403].includes(err.response?.status)) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (!reels.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (entry.isIntersecting) {
            video?.play().catch(() => {});
          } else {
            video?.pause();
          }
        });
      },
      { threshold: 0.65 }
    );

    const els = document.querySelectorAll(".post-video-wrap");
    els.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [reels]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loadingRef.current) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 600
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  useEffect(() => {
    const container = document.getElementById("bgParticles");
    if (!container) return;

    container.innerHTML = "";
    const colors = ["#ff7a59", "#ff477e", "#ffb703", "#7b61ff", "#5eead4"];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "bg-particle";

      const size = Math.random() * 180 + 60;
      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: `${Math.random() * 18 + 16}s`,
        animationDelay: `-${Math.random() * 20}s`,
        opacity: Math.random() * 0.08 + 0.03,
      });

      container.appendChild(p);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const likeReel = async (id) => {
    const alreadyLiked = likedPosts.has(id);

    setLikedPosts((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(id) : next.add(id);
      return next;
    });

    setReels((prev) =>
      prev.map((reel) =>
        reel.id === id
          ? {
              ...reel,
              likes: Math.max(0, (reel.likes || 0) + (alreadyLiked ? -1 : 1)),
            }
          : reel
      )
    );

    try {
      await API.post(`reels/${id}/like/`);
    } catch (err) {
      console.error(err);

      setLikedPosts((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.add(id) : next.delete(id);
        return next;
      });

      setReels((prev) =>
        prev.map((reel) =>
          reel.id === id
            ? {
                ...reel,
                likes: Math.max(0, (reel.likes || 0) + (alreadyLiked ? 1 : -1)),
              }
            : reel
        )
      );

      navigate("/login");
    }
  };

  const loadComments = async (id) => {
    try {
      const res = await API.get(`reels/${id}/comments/`);
      setComments((prev) => ({ ...prev, [id]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (id) => {
    const text = commentTexts[id]?.trim();
    if (!text) return;

    try {
      await API.post(`reels/${id}/comments/create/`, { text });
      setCommentTexts((prev) => ({ ...prev, [id]: "" }));
      loadComments(id);
      showToast("Comment posted ✨");
    } catch (err) {
      console.error(err);
      showToast("Couldn't post comment");
    }
  };

  const handleDoubleTap = (id) => {
    if (!likedPosts.has(id)) likeReel(id);
    setHeartAnim(id);
    setTimeout(() => setHeartAnim(null), 850);
  };

  const formatNumber = (n) => {
    if (!n) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n.toLocaleString();
  };

  const toggleFollow = (name) => {
    setFollowState((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <style>{`
        :root {
          --bg: #f6f4ef;
          --bg-2: #fffdf9;
          --text: #171717;
          --muted: #737373;
          --muted-2: #9b9b9b;
          --card: rgba(255,255,255,0.72);
          --card-solid: #ffffff;
          --border: rgba(20,20,20,0.07);
          --border-strong: rgba(20,20,20,0.12);
          --shadow-sm: 0 8px 30px rgba(31, 38, 135, 0.06);
          --shadow-md: 0 18px 50px rgba(17, 24, 39, 0.10);
          --shadow-lg: 0 24px 80px rgba(17, 24, 39, 0.16);
          --radius: 24px;
          --radius-lg: 30px;
          --accent: #ff5f6d;
          --accent-2: #ffc371;
          --accent-3: #7b61ff;
          --accent-dark: #ef476f;
          --soft: rgba(255, 95, 109, 0.10);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', sans-serif;
          color: var(--text);
          background:
            radial-gradient(circle at top left, rgba(255, 145, 77, 0.18), transparent 28%),
            radial-gradient(circle at 80% 10%, rgba(123, 97, 255, 0.14), transparent 24%),
            radial-gradient(circle at 50% 90%, rgba(255, 95, 109, 0.10), transparent 24%),
            linear-gradient(180deg, #fffaf5 0%, #f7f4ef 100%);
          overflow-x: hidden;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        button, input {
          font: inherit;
        }

        button {
          border: none;
          background: none;
          cursor: pointer;
        }

        .bg-particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
          filter: blur(10px);
        }

        .bg-particle {
          position: absolute;
          border-radius: 999px;
          animation: floatParticle linear infinite;
          transform: translateY(0);
        }

        @keyframes floatParticle {
          0% { transform: translate3d(0, 20px, 0) scale(1); }
          50% { transform: translate3d(-30px, -40px, 0) scale(1.12); }
          100% { transform: translate3d(10px, -90px, 0) scale(0.95); }
        }

        .topnav {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 24px;
          backdrop-filter: blur(20px);
          background: rgba(255, 250, 245, 0.75);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .topnav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          white-space: nowrap;
          cursor: pointer;
        }

        .logo-dot {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent-3));
          box-shadow: 0 0 0 5px rgba(255, 95, 109, 0.12);
        }

        .topnav-search {
          flex: 1;
          max-width: 620px;
          height: 52px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: var(--shadow-sm);
          border-radius: 999px;
        }

        .topnav-search i {
          color: var(--muted-2);
        }

        .topnav-search input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text);
        }

        .topnav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topnav-btn {
          position: relative;
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: var(--shadow-sm);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .topnav-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          background: rgba(255,255,255,0.92);
        }

        .topnav-btn i {
          font-size: 1rem;
          color: #242424;
        }

        .badge {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff5f6d, #ff9966);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.9);
        }

        .topnav-avatar-text {
          width: 42px;
          height: 42px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 800;
          background: linear-gradient(135deg, #111827, #374151);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), var(--shadow-sm);
        }

        .app-layout {
          position: relative;
          z-index: 1;
          width: min(1440px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr) 360px;
          gap: 28px;
          padding: 28px 24px 110px;
        }

        .sidebar-left {
          position: sticky;
          top: 98px;
          height: fit-content;
          padding: 18px 12px;
          border-radius: 28px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.72);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .sidebar-link {
          position: relative;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          color: #2e2e2e;
          transition: all .22s ease;
        }

        .sidebar-link:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.95);
          box-shadow: var(--shadow-sm);
        }

        .sidebar-link.active {
          color: white;
          background: linear-gradient(135deg, #ff5f6d, #ffc371);
          box-shadow: 0 16px 30px rgba(255, 95, 109, 0.25);
        }

        .sidebar-link i {
          font-size: 1.1rem;
        }

        .tooltip {
          position: absolute;
          left: 72px;
          white-space: nowrap;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.82rem;
          background: rgba(21,21,21,0.92);
          color: white;
          opacity: 0;
          pointer-events: none;
          transform: translateY(6px);
          transition: .18s ease;
        }

        .sidebar-link:hover .tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        .sidebar-divider {
          width: 38px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);
          margin: 4px 0;
        }

        .main-feed {
          max-width: 720px;
          width: 100%;
          margin: 0 auto;
        }

        .stories-bar {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 14px;
          margin-bottom: 24px;
          border-radius: 28px;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: var(--shadow-md);
          scrollbar-width: none;
        }

        .stories-bar::-webkit-scrollbar { display: none; }

        .story-item {
          min-width: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          transition: transform .2s ease;
        }

        .story-item:hover {
          transform: translateY(-2px);
        }

        .story-ring {
          width: 78px;
          height: 78px;
          padding: 3px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff5f6d, #ffc371, #7b61ff);
          box-shadow: 0 10px 22px rgba(255, 95, 109, 0.18);
        }

        .story-ring.seen {
          background: linear-gradient(135deg, #d7d7d7, #a8a8a8);
          box-shadow: none;
        }

        .story-ring img {
          border-radius: 999px;
          border: 3px solid #fff;
        }

        .story-item.your-story .story-ring {
          position: relative;
          background: linear-gradient(135deg, #111827, #4b5563);
        }

        .story-item.your-story .story-ring::after {
          content: "+";
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ff5f6d, #ff9966);
          border: 3px solid white;
        }

        .story-name {
          max-width: 84px;
          font-size: 0.78rem;
          text-align: center;
          color: #464646;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .post-card {
          position: relative;
          overflow: hidden;
          margin-bottom: 26px;
          border-radius: 30px;
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: var(--shadow-lg);
          animation: fadeUp .55s ease both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .post-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 120px;
          background: linear-gradient(180deg, rgba(255,255,255,0.55), transparent);
          pointer-events: none;
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 18px 14px;
        }

        .post-avatar-grad {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: white;
          font-size: 1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ff5f6d, #ffc371, #7b61ff);
          box-shadow: 0 12px 24px rgba(123, 97, 255, 0.18);
          flex-shrink: 0;
        }

        .post-user-info {
          flex: 1;
          min-width: 0;
        }

        .post-username {
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .post-location {
          margin-top: 2px;
          font-size: 0.87rem;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .post-more {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #333;
          transition: .2s ease;
        }

        .post-more:hover {
          background: rgba(255,255,255,0.92);
          box-shadow: var(--shadow-sm);
        }

        .post-video-wrap {
          position: relative;
          margin: 0 16px;
          aspect-ratio: 9 / 12.8;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(180deg, #111827, #1f2937);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
        }

        .post-video-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #111;
        }

        .post-video-wrap::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 30%;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.35));
          pointer-events: none;
        }

        .double-tap-heart {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.5);
          font-size: 5rem;
          color: white;
          text-shadow: 0 10px 30px rgba(0,0,0,0.28);
          opacity: 0;
          pointer-events: none;
        }

        .double-tap-heart.show {
          animation: heartBurst .85s ease forwards;
        }

        @keyframes heartBurst {
          0%   { transform: translate(-50%, -50%) scale(0.25); opacity: 0; }
          20%  { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
          50%  { transform: translate(-50%, -50%) scale(0.95); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.05); opacity: 0; }
        }

        .post-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 16px 10px;
        }

        .post-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #2f2f2f;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: var(--shadow-sm);
          transition: all .2s ease;
        }

        .post-action-btn:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow: var(--shadow-md);
        }

        .post-action-btn.liked {
          color: #ef476f;
          background: rgba(255, 95, 109, 0.10);
          border-color: rgba(255, 95, 109, 0.18);
          animation: likePop .35s ease;
        }

        @keyframes likePop {
          0% { transform: scale(1); }
          35% { transform: scale(1.22); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        .post-actions-spacer {
          flex: 1;
        }

        .post-likes {
          padding: 0 18px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .post-caption {
          padding: 10px 18px 0;
          line-height: 1.65;
          color: #262626;
          font-size: 0.96rem;
        }

        .cap-user {
          font-weight: 700;
          margin-right: 5px;
        }

        .post-comments-preview {
          padding: 10px 18px 0;
          font-size: 0.92rem;
          color: var(--muted);
          cursor: pointer;
        }

        .post-comments-preview:hover {
          color: #3a3a3a;
        }

        .post-time {
          padding: 10px 18px 0;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #a1a1a1;
        }

        .post-comment-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px 18px;
        }

        .post-comment-box input {
          flex: 1;
          height: 50px;
          padding: 0 16px;
          border-radius: 16px;
          border: 1px solid rgba(20,20,20,0.08);
          background: rgba(255,255,255,0.72);
          outline: none;
          transition: .2s ease;
        }

        .post-comment-box input:focus {
          border-color: rgba(255, 95, 109, 0.22);
          background: rgba(255, 95, 109, 0.04);
          box-shadow: 0 0 0 5px rgba(255, 95, 109, 0.07);
        }

        .post-btn {
          min-width: 84px;
          height: 50px;
          padding: 0 18px;
          border-radius: 16px;
          font-weight: 700;
          color: #9ca3af;
          background: #f3f4f6;
          transition: .2s ease;
        }

        .post-btn.active {
          color: white;
          background: linear-gradient(135deg, #ff5f6d, #ff9966);
          box-shadow: 0 14px 24px rgba(255, 95, 109, 0.26);
        }

        .post-btn.active:hover {
          transform: translateY(-2px);
        }

        .sidebar-right {
          position: sticky;
          top: 98px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .side-card {
          padding: 18px;
          border-radius: 28px;
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.85);
          box-shadow: var(--shadow-md);
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .profile-avatar {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 800;
          background: linear-gradient(135deg, #111827, #4b5563);
          flex-shrink: 0;
        }

        .profile-meta h4 {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .profile-meta p {
          margin-top: 4px;
          font-size: 0.88rem;
          color: var(--muted);
        }

        .side-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .side-title h3 {
          font-size: 0.98rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .side-link {
          font-size: 0.86rem;
          font-weight: 700;
          color: #ff5f6d;
        }

        .suggestion-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .suggestion-avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .suggestion-meta {
          flex: 1;
          min-width: 0;
        }

        .suggestion-meta h4 {
          font-size: 0.92rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .suggestion-meta p {
          margin-top: 3px;
          font-size: 0.8rem;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .follow-btn {
          min-width: 92px;
          height: 38px;
          padding: 0 14px;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #7b61ff, #5b8cff);
          box-shadow: 0 12px 24px rgba(91, 140, 255, 0.2);
          transition: .2s ease;
        }

        .follow-btn:hover {
          transform: translateY(-2px);
        }

        .follow-btn.following {
          color: #2d3748;
          background: #eef2f7;
          box-shadow: none;
        }

        .trend-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .trend-chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(20,20,20,0.06);
          box-shadow: var(--shadow-sm);
          font-size: 0.84rem;
          color: #444;
          transition: .2s ease;
        }

        .trend-chip:hover {
          transform: translateY(-2px);
          background: white;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .mini-stat {
          padding: 16px 12px;
          border-radius: 20px;
          text-align: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7));
          border: 1px solid rgba(20,20,20,0.06);
        }

        .mini-stat strong {
          display: block;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .mini-stat span {
          display: block;
          margin-top: 4px;
          font-size: 0.78rem;
          color: var(--muted);
        }

        .sg-empty-state {
          padding: 56px 28px;
          text-align: center;
          border-radius: 30px;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.86);
          box-shadow: var(--shadow-lg);
        }

        .sg-empty-icon {
          font-size: 3rem;
          margin-bottom: 14px;
        }

        .sg-empty-title {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .sg-empty-subtitle {
          margin-top: 8px;
          color: var(--muted);
        }

        .sg-upload-btn {
          margin-top: 20px;
          height: 50px;
          padding: 0 20px;
          border-radius: 16px;
          color: white;
          font-weight: 700;
          background: linear-gradient(135deg, #ff5f6d, #ff9966);
          box-shadow: 0 16px 30px rgba(255, 95, 109, 0.24);
        }

        .shimmer {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(90deg, #f4f4f4 25%, #fbfbfb 50%, #f1f1f1 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite linear;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .toast-container {
          position: fixed;
          left: 50%;
          bottom: 90px;
          transform: translateX(-50%);
          z-index: 80;
          pointer-events: none;
        }

        .toast {
          padding: 14px 18px;
          border-radius: 16px;
          color: white;
          font-weight: 600;
          background: rgba(23,23,23,0.92);
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
          animation: toastIn .25s ease;
          backdrop-filter: blur(12px);
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav {
          display: none;
        }

        @media (max-width: 1220px) {
          .app-layout {
            grid-template-columns: 92px minmax(0, 1fr);
          }

          .sidebar-right {
            display: none;
          }
        }

        @media (max-width: 860px) {
          .topnav {
            padding: 14px 16px;
          }

          .topnav-search {
            display: none;
          }

          .app-layout {
            display: block;
            padding: 18px 12px 110px;
          }

          .sidebar-left {
            display: none;
          }

          .main-feed {
            max-width: 100%;
          }

          .stories-bar {
            margin-bottom: 18px;
            padding: 12px;
            border-radius: 22px;
          }

          .post-card {
            border-radius: 24px;
            margin-bottom: 18px;
          }

          .post-video-wrap {
            margin: 0 12px;
            border-radius: 20px;
          }

          .mobile-nav {
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 12px;
            z-index: 70;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 10px;
            border-radius: 24px;
            background: rgba(255,255,255,0.72);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.9);
            box-shadow: var(--shadow-lg);
          }

          .mobile-nav button {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            display: grid;
            place-items: center;
            color: #2f2f2f;
            transition: .2s ease;
          }

          .mobile-nav button.active {
            color: white;
            background: linear-gradient(135deg, #ff5f6d, #ffc371);
            box-shadow: 0 12px 22px rgba(255,95,109,0.22);
          }
        }
      `}</style>

      <div className="bg-particles" id="bgParticles"></div>

      <nav className="topnav">
        <div
          className="topnav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="logo-dot"></span>
          Scroll Guru
        </div>

        <div className="topnav-search">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search creators, ideas, moments..." />
        </div>

        <div className="topnav-actions">
          <button className="topnav-btn">
            <i className="fas fa-house"></i>
          </button>
          <button className="topnav-btn">
            <i className="far fa-paper-plane"></i>
            <span className="badge"></span>
          </button>
          <button className="topnav-btn">
            <i className="far fa-heart"></i>
            <span className="badge"></span>
          </button>
          <button className="topnav-btn" onClick={() => navigate("/upload")}>
            <i className="far fa-square-plus"></i>
          </button>
          <div className="topnav-avatar-text">G</div>
        </div>
      </nav>

      <div className="app-layout">
        <aside className="sidebar-left">
          {sidebarLinks.map((link, i) =>
            link.divider ? (
              <div key={i} className="sidebar-divider"></div>
            ) : (
              <button
                key={i}
                className={`sidebar-link ${sidebarActive === link.key ? "active" : ""}`}
                onClick={() => setSidebarActive(link.key)}
              >
                <i className={`fas ${link.icon}`}></i>
                <span className="tooltip">{link.label}</span>
              </button>
            )
          )}
        </aside>

        <main className="main-feed">
          <section className="stories-bar">
            {stories.map((s, i) => (
              <div
                key={i}
                className={`story-item ${s.isYou ? "your-story" : ""}`}
                onClick={() =>
                  showToast(s.isYou ? "Create your story" : `Viewing ${s.name}'s story`)
                }
              >
                <div className={`story-ring ${s.seen ? "seen" : ""}`}>
                  <img
                    src={`https://picsum.photos/seed/${s.img}/120/120.jpg`}
                    alt={s.name}
                  />
                </div>
                <span className="story-name">{s.name}</span>
              </div>
            ))}
          </section>

          {reels.length === 0 && !loading ? (
            <div className="sg-empty-state">
              <div className="sg-empty-icon">🎥</div>
              <h2 className="sg-empty-title">No reels yet</h2>
              <p className="sg-empty-subtitle">
                Be the first to share something inspiring
              </p>
              <button className="sg-upload-btn" onClick={() => navigate("/upload")}>
                <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
                Upload Reel
              </button>
            </div>
          ) : (
            reels.map((reel, idx) => {
              const creatorName = reel.creator?.phone || "Creator";
              const isLiked = likedPosts.has(reel.id);

              return (
                <article
                  key={reel.id}
                  className="post-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="post-header">
                    <div className="post-avatar-grad">
                      {creatorName.charAt(0).toUpperCase()}
                    </div>

                    <div className="post-user-info">
                      <div className="post-username">{creatorName}</div>
                      <div className="post-location">{reel.title || "New reel"}</div>
                    </div>

                    <button
                      className="post-more"
                      onClick={() => showToast("More options")}
                    >
                      <i className="fas fa-ellipsis"></i>
                    </button>
                  </div>

                  <div
                    className="post-video-wrap"
                    onDoubleClick={() => handleDoubleTap(reel.id)}
                  >
                    <video loop muted playsInline>
                      <source
                        src={`http://127.0.0.1:8000${reel.video}`}
                        type="video/mp4"
                      />
                    </video>
                    <i
                      className={`fas fa-heart double-tap-heart ${
                        heartAnim === reel.id ? "show" : ""
                      }`}
                    ></i>
                  </div>

                  <div className="post-actions">
                    <button
                      className={`post-action-btn ${isLiked ? "liked" : ""}`}
                      onClick={() => likeReel(reel.id)}
                    >
                      <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>

                    <button
                      className="post-action-btn"
                      onClick={() => loadComments(reel.id)}
                    >
                      <i className="far fa-comment"></i>
                    </button>

                    <button
                      className="post-action-btn"
                      onClick={() => showToast("Link copied")}
                    >
                      <i className="far fa-paper-plane"></i>
                    </button>

                    <span className="post-actions-spacer"></span>

                    <button
                      className="post-action-btn"
                      onClick={() => showToast("Saved to collection")}
                    >
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>

                  <div className="post-likes">{formatNumber(reel.likes)} likes</div>

                  <div className="post-caption">
                    <span className="cap-user">{creatorName}</span>
                    {reel.description || reel.title || "Beautiful moment shared"}
                  </div>

                  {comments[reel.id]?.length > 0 && (
                    <div
                      className="post-comments-preview"
                      onClick={() => showToast("Opening comments")}
                    >
                      View all {comments[reel.id].length} comments
                    </div>
                  )}

                  <div className="post-time">Just now</div>

                  <div className="post-comment-box">
                    <input
                      placeholder="Add a thoughtful comment..."
                      value={commentTexts[reel.id] || ""}
                      onChange={(e) =>
                        setCommentTexts((prev) => ({
                          ...prev,
                          [reel.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addComment(reel.id)}
                    />

                    <button
                      className={`post-btn ${
                        commentTexts[reel.id]?.trim() ? "active" : ""
                      }`}
                      onClick={() => addComment(reel.id)}
                    >
                      Post
                    </button>
                  </div>
                </article>
              );
            })
          )}

          {loading && (
            <div className="post-card" style={{ animation: "none", padding: 16 }}>
              <div className="shimmer" style={{ height: 560 }}></div>
            </div>
          )}
        </main>

        <aside className="sidebar-right">
          <div className="side-card profile-card">
            <div className="profile-avatar">G</div>
            <div className="profile-meta">
              <h4>guru.creator</h4>
              <p>Designing beautiful scroll-worthy moments</p>
            </div>
          </div>

          <div className="side-card">
            <div className="side-title">
              <h3>Suggested for you</h3>
              <button className="side-link">See all</button>
            </div>

            <div className="suggestion-list">
              {suggestions.map((s, i) => {
                const following = !!followState[s.name];
                return (
                  <div key={i} className="suggestion-item">
                    <div className="suggestion-avatar">
                      <img
                        src={`https://picsum.photos/seed/${s.img}/120/120.jpg`}
                        alt={s.name}
                      />
                    </div>

                    <div className="suggestion-meta">
                      <h4>{s.name}</h4>
                      <p>{s.mutual}</p>
                    </div>

                    <button
                      className={`follow-btn ${following ? "following" : ""}`}
                      onClick={() => {
                        toggleFollow(s.name);
                        showToast(following ? `Unfollowed ${s.name}` : `Following ${s.name}`);
                      }}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="side-card">
            <div className="side-title">
              <h3>Today’s vibe</h3>
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <strong>24</strong>
                <span>New Reels</span>
              </div>
              <div className="mini-stat">
                <strong>8.2K</strong>
                <span>Likes</span>
              </div>
              <div className="mini-stat">
                <strong>312</strong>
                <span>Comments</span>
              </div>
            </div>
          </div>

          <div className="side-card">
            <div className="side-title">
              <h3>Trending topics</h3>
            </div>

            <div className="trend-list">
              <button className="trend-chip">#VisualDiary</button>
              <button className="trend-chip">#SlowLiving</button>
              <button className="trend-chip">#CreativeFlow</button>
              <button className="trend-chip">#AestheticEdit</button>
              <button className="trend-chip">#DigitalNomad</button>
              <button className="trend-chip">#ArtOfReels</button>
            </div>
          </div>
        </aside>
      </div>

      <nav className="mobile-nav">
        {mobileLinks.map((link, i) => (
          <button
            key={i}
            className={mobileActive === link.key ? "active" : ""}
            onClick={() => {
              setMobileActive(link.key);
              if (link.key === "create") navigate("/upload");
              if (link.key === "home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            {link.isAvatar ? (
              <div
                className="topnav-avatar-text"
                style={{ width: 28, height: 28, fontSize: 12, borderRadius: 10 }}
              >
                G
              </div>
            ) : (
              <i className={`fas ${link.icon}`}></i>
            )}
          </button>
        ))}
      </nav>

      {toast && (
        <div className="toast-container">
          <div className="toast" key={toastKey}>
            {toast}
          </div>
        </div>
      )}
    </>
  );
}
