import { useState } from "react";
import API from "../api/axios";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);

  const uploadReel = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("video", video);
    formData.append("category", "learning");

    await API.post("reels/create/", formData);

    alert("Uploaded");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Upload Reel</h1>
        <p style={styles.subtitle}>Share your knowledge with the world 🔥</p>
      </div>

      <div style={styles.formContainer}>
        {/* Title Input */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Reel Title</label>
          <input
            type="text"
            placeholder="Enter a catchy title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Video Upload Area */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Upload Video</label>
          
          <div 
            style={{
              ...styles.uploadBox,
              borderColor: video ? "#00ff9d" : "#555"
            }}
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
                  <div style={styles.successIcon}>✅</div>
                  <p style={styles.fileName}>{video.name}</p>
                  <p style={styles.fileSize}>
                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <div style={styles.uploadIcon}>📹</div>
                  <p style={styles.uploadText}>Tap to select video</p>
                  <p style={styles.uploadSubtext}>MP4 • Max 100MB recommended</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button 
          onClick={uploadReel}
          disabled={!title.trim() || !video}
          style={{
            ...styles.uploadButton,
            opacity: (!title.trim() || !video) ? 0.6 : 1,
            cursor: (!title.trim() || !video) ? "not-allowed" : "pointer"
          }}
        >
          🚀 Upload Reel
        </button>

        <p style={styles.note}>
          Your reel will be visible to everyone after upload
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "80px",
  },

  header: {
    padding: "40px 20px 30px",
    textAlign: "center",
    background: "linear-gradient(180deg, #1a1a1a, #000)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },

  subtitle: {
    fontSize: "15px",
    color: "#aaa",
    margin: 0,
  },

  formContainer: {
    padding: "20px",
  },

  inputGroup: {
    marginBottom: "28px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ddd",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "16px 18px",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },

  uploadBox: {
    position: "relative",
    width: "100%",
    height: "180px",
    border: "2px dashed #555",
    borderRadius: "16px",
    background: "#0a0a0a",
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
  },

  uploadIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  successIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  uploadText: {
    fontSize: "17px",
    fontWeight: "600",
    margin: "0 0 6px 0",
  },

  uploadSubtext: {
    fontSize: "13px",
    color: "#777",
  },

  fileName: {
    fontSize: "15px",
    fontWeight: "600",
    wordBreak: "break-all",
    padding: "0 20px",
  },

  fileSize: {
    fontSize: "13px",
    color: "#00ff9d",
    marginTop: "4px",
  },

  uploadButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(90deg, #f56040, #c13584)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "17px",
    fontWeight: "700",
    marginTop: "20px",
    transition: "all 0.3s ease",
  },

  note: {
    textAlign: "center",
    fontSize: "13px",
    color: "#666",
    marginTop: "20px",
  },
};