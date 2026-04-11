import { useEffect, useMemo, useRef, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MEDIA_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_MEDIA_URL) ||
  "http://127.0.0.1:8000";

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
  { name: "theedit.zone", img: "edit11", mutual: "New on Scroll Guru" },
];

const sidebarLinks = [
  { icon: "fa-house", label: "Home", key: "home" },
  { icon: "fa-magnifying-glass", label: "Search", key: "search" },
  { icon: "fa-compass", label: "Explore", key: "explore" },
  { icon: "fa-clapperboard", label: "Reels", key: "reels" },
  { icon: "fa-paper-plane", label: "Messages", key: "messages" },
  { icon: "fa-heart", label: "Notifications", key: "notifications" },
  { icon: "fa-square-plus", label: "Create", key: "create" },
  { divider: true },
  { icon: "fa-user", label: "Profile", key: "profile" },
  { icon: "fa-bookmark", label: "Saved", key: "saved" },
  { icon: "fa-bars", label: "More", key: "more" },
];

const mobileLinks = [
  { icon: "fa-house", key: "home" },
  { icon: "fa-compass", key: "explore" },
  { icon: "fa-square-plus", key: "create" },
  { icon: "fa-paper-plane", key: "messages" },
  { icon: "fa-user", key: "profile" },
];

export default function Feed() {
  const [reels, setReels] = useState([]);
  const [comments, setComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [heartAnim, setHeartAnim] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [toastKey, setToastKey] = useState(0);
  const [sidebarActive, setSidebarActive] = useState("home");
  const [mobileActive, setMobileActive] = useState("home");
  const [followState, setFollowState] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  const currentReel = useMemo(
    () => reels.find((r) => r.id === openCommentsFor) || null,
    [openCommentsFor, reels]
  );

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastKey((k) => k + 1);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const getVideoUrl = (path) => {
    if (!path) return "";
    if (String(path).startsWith("http")) return path;
    return `${MEDIA_BASE_URL}${path}`;
  };

  const getCreatorName = (reel) =>
    reel?.creator?.username ||
    reel?.creator?.phone ||
    reel?.creator?.name ||
    "creator";

  const formatNumber = (n) => {
    if (!n) return "0";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return n.toLocaleString();
  };

  const loadReels = async () => {
    if (loadingRef.current || !hasMore) return;

    try {
      loadingRef.current = true;
      setLoading(true);

      const res = await API.get(`reels/?page=${page}`);
      const incoming = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      if (!incoming.length) {
        setHasMore(false);
        return;
      }

      setReels((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const filtered = incoming.filter((item) => !ids.has(item.id));
        return [...prev, ...filtered];
      });
    } catch (err) {
      console.error(err);
      if ([401, 403].includes(err.response?.status)) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        showToast("Failed to load reels");
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

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    const zones = document.querySelectorAll(".auto-play-zone");
    zones.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [reels]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 700
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

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

      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      } else {
        showToast("Like failed");
      }
    }
  };

  const toggleSave = (id) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("Removed from saved");
      } else {
        next.add(id);
        showToast("Saved");
      }
      return next;
    });
  };

  const loadComments = async (id) => {
    try {
      const res = await API.get(`reels/${id}/comments/`);
      setComments((prev) => ({ ...prev, [id]: res.data || [] }));
    } catch (err) {
      console.error(err);
      showToast("Couldn't load comments");
    }
  };

  const openComments = async (id) => {
    setOpenCommentsFor(id);
    if (!comments[id]) await loadComments(id);
  };

  const addComment = async (id) => {
    const text = commentTexts[id]?.trim();
    if (!text) return;

    try {
      await API.post(`reels/${id}/comments/create/`, { text });
      setCommentTexts((prev) => ({ ...prev, [id]: "" }));
      await loadComments(id);
      showToast("Comment posted ✨");
    } catch (err) {
      console.error(err);
      showToast("Couldn't post comment");
    }
  };

  const handleDoubleTap = (id) => {
    if (!likedPosts.has(id)) likeReel(id);
    setHeartAnim(id);
    setTimeout(() => setHeartAnim(null), 800);
  };

  const copyLink = async (id) => {
    const url = `${window.location.origin}/reel/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Copy failed");
    }
  };

  const toggleFollow = (name) => {
    setFollowState((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
    showToast(followState[name] ? `Unfollowed ${name}` : `Following ${name}`);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <style>{`
        :root {
          --ig-bg: #fafafa;
          --ig-white: #ffffff;
          --ig-text: #111111;
          --ig-muted: #737373;
          --ig-border: #dbdbdb;
          --ig-soft: #efefef;
          --ig-blue: #0095f6;
          --ig-red: #ff3040;
          --ig-black: #000000;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: "Inter", sans-serif;
          background: var(--ig-bg);
          color: var(--ig-text);
          overflow-x: hidden;
        }

        img, video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        button, input {
          font: inherit;
        }

        button {
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .sg-app {
          min-height: 100vh;
          background: var(--ig-bg);
        }

        .ig-topbar {
          display: none;
        }

        .ig-layout {
          width: min(1320px, 100%);
          display: grid;
          grid-template-columns: 245px minmax(0, 630px) 320px;
          gap: 28px;
          padding: 0 22px 36px;
        }

        .ig-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 22px 14px 18px 8px;
          border-right: 1px solid var(--ig-border);
          background: var(--ig-white);
        }

        .ig-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 14px 28px;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .ig-brand-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
        }

        .ig-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ig-nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 13px 14px;
          border-radius: 12px;
          color: #111;
          font-size: 0.98rem;
          transition: background .2s ease, transform .2s ease;
        }

        .ig-nav-link i {
          width: 20px;
          text-align: center;
          font-size: 1.15rem;
        }

        .ig-nav-link span {
          font-weight: 500;
        }

        .ig-nav-link:hover {
          background: #f3f3f3;
        }

        .ig-nav-link.active {
          font-weight: 700;
          background: #f5f5f5;
        }

        .ig-divider {
          height: 1px;
          background: var(--ig-border);
          margin: 10px 14px;
        }

        .ig-main {
          padding-top: 26px;
        }

        .ig-stories {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          overflow-x: auto;
          padding: 10px 4px 18px;
          margin-bottom: 18px;
          scrollbar-width: none;
        }

        .ig-stories::-webkit-scrollbar {
          display: none;
        }

        .ig-story {
          min-width: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .ig-story-ring {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
        }

        .ig-story-ring.seen {
          background: #d1d1d1;
        }

        .ig-story-ring img {
          border-radius: 50%;
          border: 2px solid white;
        }

        .ig-story.you .ig-story-ring {
          position: relative;
          background: #dadada;
        }

        .ig-story.you .ig-story-ring::after {
          content: "+";
          position: absolute;
          right: -1px;
          bottom: -1px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--ig-blue);
          color: white;
          border: 2px solid white;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .ig-story-name {
          max-width: 72px;
          font-size: 0.74rem;
          color: #262626;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }

        .ig-feed {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ig-post {
          width: 100%;
          max-width: 470px;
          margin-bottom: 26px;
          background: white;
        }

        .ig-post-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0 12px;
        }

        .ig-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #f77737, #e1306c, #833ab4);
          padding: 2px;
        }

        .ig-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #222;
          color: white;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .ig-user-block {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .ig-username {
          font-size: 0.92rem;
          font-weight: 700;
        }

        .ig-dot {
          font-size: 0.25rem;
          color: #999;
        }

        .ig-time {
          font-size: 0.84rem;
          color: var(--ig-muted);
        }

        .ig-post-more {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          color: #222;
        }

        .ig-media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background: #000;
          border: 1px solid var(--ig-border);
          border-radius: 6px;
          overflow: hidden;
        }

        .ig-double-heart {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.4);
          color: white;
          font-size: 4.4rem;
          opacity: 0;
          pointer-events: none;
          text-shadow: 0 8px 20px rgba(0,0,0,.35);
        }

        .ig-double-heart.show {
          animation: heartPop .8s ease forwards;
        }

        @keyframes heartPop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(.3); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(.95); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }

        .ig-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 2px 10px;
        }

        .ig-action-btn {
          font-size: 1.45rem;
          color: #111;
          transition: transform .16s ease, color .16s ease;
        }

        .ig-action-btn:hover {
          transform: scale(1.05);
          color: #333;
        }

        .ig-action-btn.liked {
          color: var(--ig-red);
        }

        .ig-action-btn.saved {
          color: #111;
        }

        .ig-actions-spacer {
          flex: 1;
        }

        .ig-likes {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .ig-caption,
        .ig-comments-link,
        .ig-add-comment {
          font-size: 0.9rem;
        }

        .ig-caption {
          line-height: 1.5;
          color: #111;
          margin-bottom: 6px;
        }

        .ig-caption .user {
          font-weight: 700;
          margin-right: 6px;
        }

        .ig-comments-link {
          color: var(--ig-muted);
          margin-bottom: 8px;
          cursor: pointer;
        }

        .ig-comments-link:hover {
          color: #444;
        }

        .ig-add-comment-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--ig-border);
        }

        .ig-add-comment {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          padding: 6px 0;
        }

        .ig-post-btn {
          color: var(--ig-blue);
          font-weight: 700;
          font-size: 0.9rem;
          opacity: 0.45;
          pointer-events: none;
        }

        .ig-post-btn.active {
          opacity: 1;
          pointer-events: auto;
        }

        .ig-rightbar {
          position: sticky;
          top: 28px;
          height: fit-content;
          padding-top: 36px;
          padding-left: 100px;
          width: 150%;
        }

        .ig-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .ig-profile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #222;
          color: white;
          font-weight: 700;
          flex-shrink: 0;
        }

        .ig-profile-meta {
          flex: 1;
          min-width: 0;
        }

        .ig-profile-meta h4 {
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 3px;
        }

        .ig-profile-meta p {
          font-size: 0.85rem;
          color: var(--ig-muted);
        }

        .ig-blue-link {
          color: var(--ig-blue);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .ig-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .ig-section-head h5 {
          color: var(--ig-muted);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .ig-section-head button {
          font-size: 0.78rem;
          font-weight: 700;
          color: #111;
        }

        .ig-suggestion-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .ig-suggestion {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ig-suggestion-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ig-suggestion-meta {
          flex: 1;
          min-width: 0;
        }

        .ig-suggestion-meta h4 {
          font-size: 0.86rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .ig-suggestion-meta p {
          font-size: 0.77rem;
          color: var(--ig-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ig-follow-btn {
          color: var(--ig-blue);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .ig-follow-btn.following {
          color: #111;
        }

        .ig-footer-meta {
          margin-top: 28px;
          color: #c0c0c0;
          font-size: 0.74rem;
          line-height: 1.6;
        }

        .ig-empty {
          width: 100%;
          max-width: 470px;
          padding: 60px 24px;
          text-align: center;
          background: white;
          border: 1px solid var(--ig-border);
          border-radius: 10px;
        }

        .ig-empty h2 {
          font-size: 1.35rem;
          margin-bottom: 10px;
        }

        .ig-empty p {
          color: var(--ig-muted);
          margin-bottom: 18px;
        }

        .ig-empty button {
          padding: 11px 18px;
          border-radius: 8px;
          color: white;
          background: var(--ig-blue);
          font-weight: 700;
        }

        .ig-loader {
          width: 100%;
          max-width: 470px;
          height: 420px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f2f2f2 25%, #fafafa 50%, #f2f2f2 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
          border: 1px solid var(--ig-border);
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .tt-feed,
        .tt-bottom-nav,
        .tt-mobile-top {
          display: none;
        }

        .comments-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          z-index: 200;
          display: none;
          align-items: flex-end;
          justify-content: center;
        }

        .comments-overlay.show {
          display: flex;
        }

        .comments-sheet {
          width: min(540px, 100%);
          max-height: 80vh;
          background: white;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .comments-head {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 16px 18px;
          border-bottom: 1px solid var(--ig-border);
          font-weight: 700;
        }

        .comments-close {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
          color: #444;
        }

        .comments-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 160px;
        }

        .comment-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .comment-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ddd;
          display: grid;
          place-items: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .comment-body {
          flex: 1;
          min-width: 0;
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .comment-body strong {
          margin-right: 6px;
        }

        .comments-compose {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-top: 1px solid var(--ig-border);
        }

        .comments-compose input {
          flex: 1;
          height: 44px;
          border: 1px solid var(--ig-border);
          border-radius: 999px;
          padding: 0 14px;
          outline: none;
        }

        .comments-compose button {
          color: var(--ig-blue);
          font-weight: 700;
        }

        .toast-wrap {
          position: fixed;
          left: 50%;
          bottom: 90px;
          transform: translateX(-50%);
          z-index: 220;
          pointer-events: none;
        }

        .toast {
          background: rgba(20,20,20,.92);
          color: white;
          padding: 12px 16px;
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 600;
          animation: toastIn .2s ease;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1160px) {
          .ig-layout {
            grid-template-columns: 78px minmax(0, 1fr);
          }

          .ig-rightbar {
            display: none;
          }

          .ig-sidebar {
            padding-left: 6px;
            padding-right: 6px;
          }

          .ig-brand {
            justify-content: center;
            font-size: 0;
            padding-bottom: 20px;
          }

          .ig-brand-dot {
            width: 22px;
            height: 22px;
          }

          .ig-nav-link {
            justify-content: center;
            padding: 13px 10px;
          }

          .ig-nav-link span {
            display: none;
          }
        }

        @media (max-width: 820px) {
          body {
            background: #000;
          }

          .ig-layout,
          .ig-sidebar,
          .ig-rightbar,
          .ig-stories,
          .ig-feed,
          .ig-topbar {
            display: none;
          }

          .sg-app {
            background: #000;
          }

          .tt-mobile-top {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            display: flex;
            justify-content: center;
            padding: 14px 16px 10px;
            pointer-events: none;
          }

          .tt-switcher {
            display: inline-flex;
            align-items: center;
            gap: 20px;
            color: rgba(255,255,255,.75);
            font-size: 0.95rem;
            font-weight: 600;
          }

          .tt-switcher strong {
            color: #fff;
            position: relative;
          }

          .tt-switcher strong::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            border-radius: 999px;
            background: #fff;
          }

          .tt-feed {
            display: block;
            height: 100vh;
            overflow-y: auto;
            scroll-snap-type: y mandatory;
            background: #000;
          }

          .tt-slide {
            position: relative;
            height: 100vh;
            scroll-snap-align: start;
            background: #000;
            overflow: hidden;
          }

          .tt-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background: #000;
          }

          .tt-overlay {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.72) 100%);
            pointer-events: none;
          }

          .tt-heart {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(.4);
            color: white;
            font-size: 4.8rem;
            opacity: 0;
            pointer-events: none;
            z-index: 3;
          }

          .tt-heart.show {
            animation: heartPop .8s ease forwards;
          }

          .tt-right-actions {
            position: absolute;
            right: 10px;
            bottom: 120px;
            z-index: 3;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
          }

          .tt-action-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            color: white;
          }

          .tt-action-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(255,255,255,.14);
            backdrop-filter: blur(10px);
            color: white;
            font-size: 1.18rem;
          }

          .tt-action-btn.liked {
            color: #ff3040;
          }

          .tt-action-btn.saved {
            color: #ffd76a;
          }

          .tt-action-stack span {
            font-size: 0.75rem;
            font-weight: 700;
          }

          .tt-meta {
            position: absolute;
            left: 12px;
            right: 74px;
            bottom: 100px;
            z-index: 3;
            color: white;
          }

          .tt-user {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            font-weight: 700;
          }

          .tt-follow-chip {
            padding: 3px 10px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,.4);
            font-size: 0.76rem;
            font-weight: 700;
          }

          .tt-caption {
            font-size: 0.92rem;
            line-height: 1.45;
            margin-bottom: 10px;
            color: rgba(255,255,255,.95);
          }

          .tt-audio {
            font-size: 0.8rem;
            color: rgba(255,255,255,.85);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .tt-bottom-nav {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 105;
            display: flex;
            align-items: center;
            justify-content: space-around;
            height: 60px;
            background: rgba(0,0,0,.86);
            border-top: 1px solid rgba(255,255,255,.12);
          }

          .tt-bottom-nav button {
            color: rgba(255,255,255,.75);
            font-size: 1.2rem;
          }

          .tt-bottom-nav button.active {
            color: #fff;
          }

          .comments-overlay.show {
            z-index: 300;
          }

          .toast-wrap {
            bottom: 78px;
          }
        }
      `}</style>

      <div className="sg-app">
        {/* DESKTOP / TABLET INSTAGRAM STYLE */}
        <div className="ig-layout">
          <aside className="ig-sidebar">
            <div className="ig-brand">
              <span className="ig-brand-dot"></span>
              <span>Scroll Guru</span>
            </div>

            <div className="ig-nav">
              {sidebarLinks.map((link, i) =>
                link.divider ? (
                  <div key={i} className="ig-divider"></div>
                ) : (
                  <button
                    key={link.key}
                    className={`ig-nav-link ${
                      sidebarActive === link.key ? "active" : ""
                    }`}
                    onClick={() => {
                      setSidebarActive(link.key);
                      if (link.key === "create") navigate("/upload");
                    }}
                  >
                    <i className={`fa-solid ${link.icon}`}></i>
                    <span>{link.label}</span>
                  </button>
                )
              )}
            </div>
          </aside>

          <main className="ig-main">
            <section className="ig-stories">
              {stories.map((s, i) => (
                <div
                  key={i}
                  className={`ig-story ${s.isYou ? "you" : ""}`}
                  onClick={() =>
                    showToast(
                      s.isYou ? "Create your story" : `Viewing ${s.name}'s story`
                    )
                  }
                >
                  <div className={`ig-story-ring ${s.seen ? "seen" : ""}`}>
                    <img
                      src={`https://picsum.photos/seed/${s.img}/120/120.jpg`}
                      alt={s.name}
                    />
                  </div>
                  <div className="ig-story-name">{s.name}</div>
                </div>
              ))}
            </section>

            <section className="ig-feed">
              {reels.length === 0 && !loading ? (
                <div className="ig-empty">
                  <h2>No reels yet</h2>
                  <p>Upload your first reel and start building your Scroll Guru vibe.</p>
                  <button onClick={() => navigate("/upload")}>Upload Reel</button>
                </div>
              ) : (
                reels.map((reel) => {
                  const creatorName = getCreatorName(reel);
                  const isLiked = likedPosts.has(reel.id);
                  const isSaved = savedPosts.has(reel.id);
                  const reelComments = comments[reel.id] || [];

                  return (
                    <article key={reel.id} className="ig-post">
                      <div className="ig-post-header">
                        <div className="ig-avatar">
                          <div className="ig-avatar-inner">
                            {creatorName.charAt(0).toUpperCase()}
                          </div>
                        </div>

                        <div className="ig-user-block">
                          <span className="ig-username">{creatorName}</span>
                          <span className="ig-dot">•</span>
                          <span className="ig-time">5 d</span>
                        </div>

                        <button
                          className="ig-post-more"
                          onClick={() => showToast("More options")}
                        >
                          <i className="fa-solid fa-ellipsis"></i>
                        </button>
                      </div>

                      <div
                        className="ig-media-wrap auto-play-zone"
                        onDoubleClick={() => handleDoubleTap(reel.id)}
                      >
                        <video loop muted playsInline preload="metadata">
                          <source src={getVideoUrl(reel.video)} type="video/mp4" />
                        </video>
                        <i
                          className={`fa-solid fa-heart ig-double-heart ${
                            heartAnim === reel.id ? "show" : ""
                          }`}
                        ></i>
                      </div>

                      <div className="ig-actions">
                        <button
                          className={`ig-action-btn ${isLiked ? "liked" : ""}`}
                          onClick={() => likeReel(reel.id)}
                        >
                          <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                        </button>

                        <button
                          className="ig-action-btn"
                          onClick={() => openComments(reel.id)}
                        >
                          <i className="fa-regular fa-comment"></i>
                        </button>

                        <button
                          className="ig-action-btn"
                          onClick={() => copyLink(reel.id)}
                        >
                          <i className="fa-regular fa-paper-plane"></i>
                        </button>

                        <span className="ig-actions-spacer"></span>

                        <button
                          className={`ig-action-btn ${isSaved ? "saved" : ""}`}
                          onClick={() => toggleSave(reel.id)}
                        >
                          <i
                            className={
                              isSaved
                                ? "fa-solid fa-bookmark"
                                : "fa-regular fa-bookmark"
                            }
                          ></i>
                        </button>
                      </div>

                      <div className="ig-likes">{formatNumber(reel.likes)} likes</div>

                      <div className="ig-caption">
                        <span className="user">{creatorName}</span>
                        {reel.description || reel.title || "Beautiful moment shared"}
                      </div>

                      <div
                        className="ig-comments-link"
                        onClick={() => openComments(reel.id)}
                      >
                        View all {reelComments.length || 0} comments
                      </div>

                      <div className="ig-add-comment-row">
                        <input
                          className="ig-add-comment"
                          placeholder="Add a comment..."
                          value={commentTexts[reel.id] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({
                              ...prev,
                              [reel.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <button
                          className={`ig-post-btn ${
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

              {loading && <div className="ig-loader"></div>}
            </section>
          </main>

          <aside className="ig-rightbar">
            <div className="ig-profile">
              <div className="ig-profile-avatar">G</div>
              <div className="ig-profile-meta">
                <h4>guru.creator</h4>
                <p>Designing scroll-worthy moments</p>
              </div>
              <button className="ig-blue-link">Switch</button>
            </div>

            <div className="ig-section-head">
              <h5>Suggested for you</h5>
              <button>See all</button>
            </div>

            <div className="ig-suggestion-list">
              {suggestions.map((s, i) => {
                const following = !!followState[s.name];
                return (
                  <div key={i} className="ig-suggestion">
                    <div className="ig-suggestion-avatar">
                      <img
                        src={`https://picsum.photos/seed/${s.img}/100/100.jpg`}
                        alt={s.name}
                      />
                    </div>

                    <div className="ig-suggestion-meta">
                      <h4>{s.name}</h4>
                      <p>{s.mutual}</p>
                    </div>

                    <button
                      className={`ig-follow-btn ${following ? "following" : ""}`}
                      onClick={() => toggleFollow(s.name)}
                    >
                      {following ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="ig-footer-meta">
              About · Help · Press · API · Jobs · Privacy · Terms <br />
              Locations · Language · Meta Verified <br /><br />
              © 2026 SCROLL GURU FROM META STYLE
            </div>
          </aside>
        </div>

        {/* MOBILE TIKTOK STYLE */}
        <div className="tt-mobile-top">
          <div className="tt-switcher">
            <span>Following</span>
            <strong>For You</strong>
          </div>
        </div>

        <div className="tt-feed">
          {reels.map((reel) => {
            const creatorName = getCreatorName(reel);
            const isLiked = likedPosts.has(reel.id);
            const isSaved = savedPosts.has(reel.id);

            return (
              <section
                key={`mobile-${reel.id}`}
                className="tt-slide auto-play-zone"
                onDoubleClick={() => handleDoubleTap(reel.id)}
              >
                <video className="tt-video" loop muted playsInline preload="metadata">
                  <source src={getVideoUrl(reel.video)} type="video/mp4" />
                </video>

                <div className="tt-overlay"></div>

                <i
                  className={`fa-solid fa-heart tt-heart ${
                    heartAnim === reel.id ? "show" : ""
                  }`}
                ></i>

                <div className="tt-right-actions">
                  <div className="tt-action-stack">
                    <button
                      className={`tt-action-btn ${isLiked ? "liked" : ""}`}
                      onClick={() => likeReel(reel.id)}
                    >
                      <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </button>
                    <span>{formatNumber(reel.likes)}</span>
                  </div>

                  <div className="tt-action-stack">
                    <button
                      className="tt-action-btn"
                      onClick={() => openComments(reel.id)}
                    >
                      <i className="fa-regular fa-comment-dots"></i>
                    </button>
                    <span>{formatNumber((comments[reel.id] || []).length)}</span>
                  </div>

                  <div className="tt-action-stack">
                    <button
                      className="tt-action-btn"
                      onClick={() => copyLink(reel.id)}
                    >
                      <i className="fa-solid fa-share"></i>
                    </button>
                    <span>Share</span>
                  </div>

                  <div className="tt-action-stack">
                    <button
                      className={`tt-action-btn ${isSaved ? "saved" : ""}`}
                      onClick={() => toggleSave(reel.id)}
                    >
                      <i
                        className={
                          isSaved
                            ? "fa-solid fa-bookmark"
                            : "fa-regular fa-bookmark"
                        }
                      ></i>
                    </button>
                    <span>Save</span>
                  </div>
                </div>

                <div className="tt-meta">
                  <div className="tt-user">
                    <span>@{creatorName}</span>
                    <span className="tt-follow-chip">Follow</span>
                  </div>

                  <div className="tt-caption">
                    {reel.description || reel.title || "A beautiful short reel for your feed"}
                  </div>

                  <div className="tt-audio">
                    <i className="fa-solid fa-music" style={{ marginRight: 8 }}></i>
                    Original audio · Scroll Guru trending sound
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <nav className="tt-bottom-nav">
          {mobileLinks.map((link) => (
            <button
              key={link.key}
              className={mobileActive === link.key ? "active" : ""}
              onClick={() => {
                setMobileActive(link.key);
                if (link.key === "create") navigate("/upload");
                if (link.key === "home") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <i className={`fa-solid ${link.icon}`}></i>
            </button>
          ))}
        </nav>

        {/* COMMENTS SHEET */}
        <div
          className={`comments-overlay ${openCommentsFor ? "show" : ""}`}
          onClick={() => setOpenCommentsFor(null)}
        >
          <div className="comments-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="comments-head">
              Comments
              <button
                className="comments-close"
                onClick={() => setOpenCommentsFor(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="comments-list">
              {(comments[openCommentsFor] || []).length === 0 ? (
                <div style={{ color: "#777", textAlign: "center", paddingTop: 24 }}>
                  No comments yet
                </div>
              ) : (
                (comments[openCommentsFor] || []).map((comment, idx) => {
                  const uname =
                    comment?.user?.username ||
                    comment?.user?.phone ||
                    comment?.username ||
                    "user";

                  return (
                    <div key={comment.id || idx} className="comment-item">
                      <div className="comment-avatar">
                        {uname.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-body">
                        <strong>{uname}</strong>
                        {comment.text || comment.body || comment.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {currentReel && (
              <div className="comments-compose">
                <input
                  placeholder="Add a comment..."
                  value={commentTexts[currentReel.id] || ""}
                  onChange={(e) =>
                    setCommentTexts((prev) => ({
                      ...prev,
                      [currentReel.id]: e.target.value,
                    }))
                  }
                   onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                    }}
                />
                <button onClick={() => addComment(currentReel.id)}>Post</button>
              </div>
            )}
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="toast-wrap">
            <div className="toast" key={toastKey}>
              {toast}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
