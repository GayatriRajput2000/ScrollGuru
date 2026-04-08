import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setError("");
    setImage(file);
  };

  const handlePost = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", image); // backend field name check kar lena
      formData.append("caption", caption);

      await API.post("/posts/create/", formData);

      alert("Post uploaded successfully 🔥");
      navigate("/profile");
    } catch (err) {
      console.error("Post upload error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Post upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h2 style={styles.title}>Create Post</h2>
        <div style={{ width: 34 }} />
      </div>

      <div style={styles.card}>
        <label style={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {preview ? (
            <img src={preview} alt="preview" style={styles.previewImage} />
          ) : (
            <div style={styles.placeholder}>
              <div style={styles.icon}>📸</div>
              <div style={styles.text}>Tap to select photo</div>
              <div style={styles.subtext}>Post like Instagram</div>
            </div>
          )}
        </label>

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={styles.textarea}
        />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button
          onClick={handlePost}
          disabled={!image || uploading}
          style={{
            ...styles.postBtn,
            opacity: !image || uploading ? 0.6 : 1,
            cursor: !image || uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Posting..." : "Share Post"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.9)",
    position: "sticky",
    top: 0,
  },
  backBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "26px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
  },
  card: {
    padding: "16px",
  },
  uploadBox: {
    display: "block",
    width: "100%",
    height: "360px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.12)",
    marginBottom: "16px",
    cursor: "pointer",
  },
  placeholder: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#aaa",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
  },
  subtext: {
    fontSize: "13px",
    color: "#777",
    marginTop: "6px",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#fff",
    padding: "14px",
    fontSize: "15px",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "14px",
    marginTop: "10px",
  },
  postBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
  },
};
