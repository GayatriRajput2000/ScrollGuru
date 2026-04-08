import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hoveredUpload, setHoveredUpload] = useState(false);

  const navigate = useNavigate();

  const uploadReel = async () => {
    if (!title.trim() || !video) {
      alert("Please enter title and select a video");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("video", video);
      formData.append("category", "learning");

      const res = await API.post("reels/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      setTimeout(() => {
        alert("✅ Reel Uploaded Successfully!");
        navigate("/feed");
      }, 1500);
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err);
      alert("Upload failed! Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -15px) scale(1.08); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-15px, 20px) scale(1.05); }
          }
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes successPop {
            0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.15); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
          @keyframes checkDraw {
            0% { stroke-dashoffset: 30; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes ringExpand {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes borderDash {
            0% { background-position: 0 0, 100% 0, 100% 100%, 0 100%; }
            100% { background-position: 100% 0, 100% 100%, 0 100%, 0 0; }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Ambient Glows */}
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <div style={styles.glow3} />

        {/* Floating Particles */}
        <div style={styles.particle1} />
        <div style={styles.particle2} />
        <div style={styles.particle3} />

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <div
              style={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              ‹
            </div>
            <div>
              <h1 style={styles.topTitle}>Upload Reel</h1>
              <p style={styles.topSubtitle}>Share your knowledge with the world</p>
            </div>
          </div>
          <div style={styles.headerEmoji}>🔥</div>
        </div>

        {/* Form Card */}
        <div style={styles.formCard}>
          {/* Title Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Reel Title</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✏️</span>
              <input
                type="text"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Video Upload Area */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Upload Video</label>

            <div
              style={{
                ...styles.uploadBox,
                borderColor: video ? "#00ff9d" : hoveredUpload ? "rgba(0,149,246,0.4)" : "rgba(255,255,255,0.08)",
                background: video
                  ? "linear-gradient(135deg, rgba(0,255,157,0.04), rgba(0,149,246,0.02))"
                  : hoveredUpload
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.015)",
              }}
              onMouseEnter={() => setHoveredUpload(true)}
              onMouseLeave={() => setHoveredUpload(false)}
            >
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                style={styles.fileInput}
              />

              <div style={styles.uploadContent}>
                {video ? (
                  <>
                    // Replace this block in your JSX:
                    <div style={styles.successIconWrapper}>
                        <div style={styles.successCheckBg} />
                            <svg width="28" height="28" viewBox="4 4 24 24" fill="none">
                                <path
                                d="M5 13l4 4L19 7"
                                stroke="#00ff9d"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="30"
                                strokeDashoffset="0"
                                style={{ animation: "checkDraw 0.5s ease 0.2s both" }}
                                />
                            </svg>
                        </div>
                    <p style={styles.fileName}>{video.name}</p>
                    <p style={styles.fileSize}>
                      {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <p style={styles.changeFile}>Tap to change</p>
                  </>
                ) : (
                  <>
                    <div style={styles.uploadIconWrapper}>
                      <span style={styles.uploadIcon}>📹</span>
                    </div>
                    <p style={styles.uploadText}>
                      Tap to select video
                    </p>
                    <p style={styles.uploadSubtext}>
                      MP4 · Max 100MB recommended
                    </p>
                  </>
                )}
              </div>

              {/* Corner accents when no video */}
              {!video && (
                <>
                  <div style={styles.cornerTL} />
                  <div style={styles.cornerTR} />
                  <div style={styles.cornerBL} />
                  <div style={styles.cornerBR} />
                </>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadReel}
            disabled={!title.trim() || !video || uploading}
            style={{
              ...styles.uploadButton,
              opacity: !title.trim() || !video || uploading ? 0.5 : 1,
              cursor: !title.trim() || !video || uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? (
              <span style={styles.loadingRow}>
                <span style={styles.spinner} />
                Uploading...
              </span>
            ) : (
              <span style={styles.btnContent}>
                <span style={styles.btnIcon}>🚀</span>
                Upload Reel
              </span>
            )}
          </button>

          {/* Success State */}
          {success && (
            <div style={styles.successBanner}>
              <div style={styles.successBannerRing} />
              <span style={styles.successBannerIcon}>✓</span>
              <span style={styles.successBannerText}>Reel uploaded successfully! Redirecting...</span>
            </div>
          )}

          {/* Info Note */}
          <div style={styles.noteCard}>
            <span style={styles.noteIcon}>💡</span>
            <p style={styles.noteText}>
              Your reel will be visible to everyone after upload
            </p>
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: "100px" }} />
      </div>
    </>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "80px",
    position: "relative",
    overflow: "hidden",
  },

  // Ambient Glows
  glow1: {
    position: "fixed",
    top: "-5%",
    right: "-5%",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,149,246,0.08) 0%, transparent 70%)",
    animation: "float1 9s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow2: {
    position: "fixed",
    bottom: "10%",
    left: "-8%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(193,53,132,0.08) 0%, transparent 70%)",
    animation: "float2 10s ease-in-out infinite",
    pointerEvents: "none",
  },
  glow3: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(245,96,64,0.04) 0%, transparent 60%)",
    pointerEvents: "none",
  },

  // Floating Particles
  particle1: {
    position: "fixed",
    top: "18%",
    left: "15%",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(0,149,246,0.35)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  particle2: {
    position: "fixed",
    top: "60%",
    right: "12%",
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "rgba(245,96,64,0.3)",
    animation: "pulse 4s ease-in-out infinite 1s",
    pointerEvents: "none",
  },
  particle3: {
    position: "fixed",
    bottom: "25%",
    left: "30%",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "rgba(0,255,157,0.2)",
    animation: "pulse 3.5s ease-in-out infinite 0.5s",
    pointerEvents: "none",
  },

  // Top Bar
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    position: "sticky",
    top: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    zIndex: 10,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  backBtn: {
    fontSize: "28px",
    fontWeight: "300",
    color: "#fff",
    cursor: "pointer",
    lineHeight: "1",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    transition: "background 0.2s ease",
  },
  topTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  topSubtitle: {
    fontSize: "12px",
    color: "#888",
    margin: "2px 0 0 0",
    fontWeight: "500",
  },
  headerEmoji: {
    fontSize: "24px",
  },

  // Form Card
  formCard: {
    margin: "24px 16px 0",
    padding: "28px 20px",
    background: "rgba(17,17,17,0.6)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
    animation: "fadeUp 0.5s ease both",
  },

  // Input Group
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "16px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "16px 16px 16px 46px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
  },

  // Upload Box
  uploadBox: {
    position: "relative",
    width: "100%",
    height: "200px",
    border: "2px dashed rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    zIndex: 2,
  },
  uploadContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: "100%",
    zIndex: 1,
  },

  // Upload Empty State
  uploadIconWrapper: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "rgba(0,149,246,0.1)",
    border: "1px solid rgba(0,149,246,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  uploadIcon: {
    fontSize: "28px",
  },
  uploadText: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 6px 0",
    color: "rgba(255,255,255,0.85)",
  },
  uploadSubtext: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
    fontWeight: "500",
  },

  // Corner Accents
  cornerTL: {
    position: "absolute",
    top: "12px",
    left: "12px",
    width: "20px",
    height: "20px",
    borderTop: "2px solid rgba(0,149,246,0.2)",
    borderLeft: "2px solid rgba(0,149,246,0.2)",
    borderRadius: "4px 0 0 0",
    pointerEvents: "none",
    zIndex: 1,
  },
  cornerTR: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "20px",
    height: "20px",
    borderTop: "2px solid rgba(0,149,246,0.2)",
    borderRight: "2px solid rgba(0,149,246,0.2)",
    borderRadius: "0 4px 0 0",
    pointerEvents: "none",
    zIndex: 1,
  },
  cornerBL: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    width: "20px",
    height: "20px",
    borderBottom: "2px solid rgba(0,149,246,0.2)",
    borderLeft: "2px solid rgba(0,149,246,0.2)",
    borderRadius: "0 0 0 4px",
    pointerEvents: "none",
    zIndex: 1,
  },
  cornerBR: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    width: "20px",
    height: "20px",
    borderBottom: "2px solid rgba(0,149,246,0.2)",
    borderRight: "2px solid rgba(0,149,246,0.2)",
    borderRadius: "0 0 4px 0",
    pointerEvents: "none",
    zIndex: 1,
  },

  // File Selected State
  successIconWrapper: {
    position: "relative",
    width: "56px",
    height: "56px",
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  successCheckBg: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "rgba(0,255,157,0.1)",
    border: "2px solid rgba(0,255,157,0.2)",
  },
  fileName: {
    fontSize: "14px",
    fontWeight: "600",
    wordBreak: "break-all",
    padding: "0 24px",
    margin: "0 0 4px",
    color: "rgba(255,255,255,0.9)",
  },
  fileSize: {
    fontSize: "13px",
    color: "#00ff9d",
    margin: "0 0 4px",
    fontWeight: "600",
  },
  changeFile: {
    fontSize: "12px",
    color: "#555",
    margin: 0,
    fontWeight: "500",
  },

  // Upload Button
  uploadButton: {
    width: "100%",
    padding: "17px",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    backgroundSize: "200% 200%",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "8px",
    transition: "all 0.3s ease",
    letterSpacing: "0.2px",
    position: "relative",
    overflow: "hidden",
  },
  btnContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  btnIcon: {
    fontSize: "18px",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },

  // Success Banner
  successBanner: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    padding: "14px 20px",
    background: "rgba(0,255,157,0.06)",
    border: "1px solid rgba(0,255,157,0.15)",
    borderRadius: "14px",
    overflow: "hidden",
    animation: "fadeUp 0.4s ease both",
  },
  successBannerRing: {
    position: "absolute",
    top: "50%",
    left: "24px",
    transform: "translate(-50%, -50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid rgba(0,255,157,0.3)",
    animation: "ringExpand 1.5s ease-out infinite",
    pointerEvents: "none",
  },
  successBannerIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(0,255,157,0.15)",
    color: "#00ff9d",
    fontSize: "14px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  successBannerText: {
    fontSize: "13px",
    color: "#00ff9d",
    fontWeight: "600",
  },

  // Note Card
  noteCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "20px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: "12px",
  },
  noteIcon: {
    fontSize: "16px",
    flexShrink: 0,
    marginTop: "1px",
  },
  noteText: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
    lineHeight: "1.45",
    fontWeight: "500",
  },
};
