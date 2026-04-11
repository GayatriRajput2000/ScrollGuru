import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Get current user ID from JWT token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.id || null; // Change if your token uses different key
    } catch (e) {
      console.error("Token decode error:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!video) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(video);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [video]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess(false);

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    setVideo(file);
  };

  const uploadReel = async () => {
    if (!title.trim() || !video) {
      setError("Please enter title and select a video.");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      setError("Please login again. Session expired.");
      navigate("/login");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess(false);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("video", video);
      formData.append("category", "learning");
      formData.append("creator", userId);   // ← Fixed: Sending creator

      await API.post("/reels/create/", formData);

      setSuccess(true);

      setTimeout(() => {
        navigate("/feed");
      }, 1400);
    } catch (err) {
      console.error("Upload Error Full Response:", err.response);

      let errorMsg = "Upload failed! Please try again.";

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "string") {
          errorMsg = data;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else if (data.creator) {
          errorMsg = Array.isArray(data.creator) ? data.creator[0] : data.creator;
        } else if (data.video) {
          errorMsg = Array.isArray(data.video) ? data.video[0] : data.video;
        } else if (data.title) {
          errorMsg = Array.isArray(data.title) ? data.title[0] : data.title;
        } else if (data.non_field_errors) {
          errorMsg = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors;
        } else {
          errorMsg = JSON.stringify(data);
        }
      }

      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          @keyframes floatY {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input::placeholder {
            color: #8d8d95;
          }
        `}
      </style>

      <div style={styles.page}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        <div style={styles.bgGrid}></div>

        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ‹
          </button>

          <div>
            <h1 style={styles.heading}>Upload Reel</h1>
            <p style={styles.subheading}>Share your knowledge with the world</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.badge}>🔥 Creator Upload</div>

          <div style={styles.section}>
            <label style={styles.label}>Reel Title</label>
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Video File</label>

            <label style={styles.uploadArea}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {preview ? (
                <div style={styles.previewWrapper}>
                  <video src={preview} controls style={styles.videoPreview} />
                  <div style={styles.previewMeta}>
                    <div style={styles.filePill}>✅ Video Selected</div>
                    <p style={styles.fileName}>{video?.name}</p>
                    <p style={styles.fileInfo}>
                      {(video?.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p style={styles.changeText}>Tap to change video</p>
                  </div>
                </div>
              ) : (
                <div style={styles.emptyUpload}>
                  <div style={styles.uploadIconBox}>📹</div>
                  <h3 style={styles.uploadTitle}>Choose a video to upload</h3>
                  <p style={styles.uploadSubtitle}>
                    MP4, MOV, WEBM • keep under 100MB for best experience
                  </p>
                </div>
              )}
            </label>
          </div>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {success && (
            <div style={styles.successBox}>
              ✅ Reel uploaded successfully! Redirecting...
            </div>
          )}

          <button
            type="button"
            onClick={uploadReel}
            disabled={uploading || !title.trim() || !video}
            style={{
              ...styles.uploadBtn,
              opacity: uploading || !title.trim() || !video ? 0.6 : 1,
              cursor:
                uploading || !title.trim() || !video
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {uploading ? (
              <span style={styles.btnRow}>
                <span style={styles.spinner}></span>
                Uploading video...
              </span>
            ) : (
              <span style={styles.btnRow}>
                <span>🚀</span>
                Upload Reel
              </span>
            )}
          </button>

          <div style={styles.note}>
            <span style={{ fontSize: 18 }}>💡</span>
            <span>
              Your reel will be visible to everyone after successful upload.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(131,58,180,0.22), transparent 30%), radial-gradient(circle at bottom left, rgba(245,96,64,0.18), transparent 30%), linear-gradient(180deg, #050505 0%, #0a0a0f 100%)",
    color: "#fff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px 16px 60px",
    position: "relative",
    overflow: "hidden",
  },

  bgOrb1: {
    position: "absolute",
    top: 50,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "rgba(0,149,246,0.18)",
    filter: "blur(80px)",
    animation: "glowPulse 6s ease-in-out infinite",
    pointerEvents: "none",
  },

  bgOrb2: {
    position: "absolute",
    bottom: 80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "rgba(245,96,64,0.16)",
    filter: "blur(80px)",
    animation: "floatY 7s ease-in-out infinite",
    pointerEvents: "none",
  },

  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
    pointerEvents: "none",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    position: "relative",
    zIndex: 1,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 28,
    cursor: "pointer",
  },

  heading: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  subheading: {
    margin: "4px 0 0",
    color: "#a0a0aa",
    fontSize: 13,
  },

  card: {
    position: "relative",
    zIndex: 1,
    maxWidth: 560,
    margin: "0 auto",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 28,
    padding: 22,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    animation: "fadeUp .45s ease",
  },

  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    fontWeight: 700,
    color: "#ffb37a",
    marginBottom: 18,
  },

  section: {
    marginBottom: 20,
  },

  label: {
    display: "block",
    marginBottom: 10,
    fontSize: 12,
    color: "#a6a6b0",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  },

  uploadArea: {
    display: "block",
    width: "100%",
    minHeight: 260,
    borderRadius: 22,
    border: "1.5px dashed rgba(255,255,255,0.16)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  emptyUpload: {
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    textAlign: "center",
  },

  uploadIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    marginBottom: 14,
    background: "rgba(0,149,246,0.12)",
    border: "1px solid rgba(0,149,246,0.20)",
  },

  uploadTitle: {
    margin: "0 0 8px",
    fontSize: 20,
    fontWeight: 800,
  },

  uploadSubtitle: {
    margin: 0,
    fontSize: 14,
    color: "#9a9aa5",
    maxWidth: 320,
    lineHeight: 1.5,
  },

  previewWrapper: {
    padding: 14,
  },

  videoPreview: {
    width: "100%",
    maxHeight: 240,
    borderRadius: 18,
    objectFit: "cover",
    background: "#000",
    marginBottom: 14,
  },

  previewMeta: {
    textAlign: "center",
  },

  filePill: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(0,255,157,0.10)",
    border: "1px solid rgba(0,255,157,0.18)",
    color: "#00ff9d",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },

  fileName: {
    margin: "0 0 6px",
    fontSize: 15,
    fontWeight: 700,
    wordBreak: "break-word",
  },

  fileInfo: {
    margin: "0 0 6px",
    color: "#7ce5b7",
    fontSize: 13,
    fontWeight: 600,
  },

  changeText: {
    margin: 0,
    color: "#93939c",
    fontSize: 12,
  },

  errorBox: {
    background: "rgba(255,80,80,0.10)",
    border: "1px solid rgba(255,80,80,0.25)",
    color: "#ff8c8c",
    padding: "14px 16px",
    borderRadius: 14,
    fontSize: 14,
    marginBottom: 16,
  },

  successBox: {
    background: "rgba(0,255,157,0.10)",
    border: "1px solid rgba(0,255,157,0.25)",
    color: "#7cffc7",
    padding: "14px 16px",
    borderRadius: 14,
    fontSize: 14,
    marginBottom: 16,
  },

  uploadBtn: {
    width: "100%",
    border: "none",
    borderRadius: 18,
    padding: "17px 20px",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    background:
      "linear-gradient(135deg, #ff7a18 0%, #ff006e 45%, #8338ec 100%)",
    boxShadow: "0 14px 40px rgba(131,56,236,0.35)",
  },

  btnRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  spinner: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    animation: "spin .8s linear infinite",
  },

  note: {
    marginTop: 16,
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    fontSize: 13,
    color: "#9d9da7",
    lineHeight: 1.5,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
};