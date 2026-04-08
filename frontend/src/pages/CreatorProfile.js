import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function CreatorProfile() {
  const { id } = useParams();
  const [reels, setReels] = useState([]);

  useEffect(() => {
    API.get(`reels/creator/${id}/`)
      .then(res => setReels(res.data));
  }, [id]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Creator Profile</h1>
      </div>

      <div style={styles.content}>
        {reels.length === 0 ? (
          <div style={styles.empty}>
            <p>No reels found from this creator</p>
          </div>
        ) : (
          reels.map((r) => (
            <div key={r.id} style={styles.reelCard}>
              <video
                key={r.id}
                width="100%"
                controls
                style={styles.video}
              >
                <source src={`http://127.0.0.1:8000${r.video}`} />
              </video>
              <div style={styles.reelInfo}>
                <h3 style={styles.reelTitle}>{r.title}</h3>
                <p style={styles.reelDesc}>{r.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  header: {
    padding: "20px",
    borderBottom: "1px solid #333",
    background: "#111",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    padding: "16px",
  },
  reelCard: {
    marginBottom: "30px",
    background: "#111",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
  },
  video: {
    width: "100%",
    display: "block",
  },
  reelInfo: {
    padding: "16px",
  },
  reelTitle: {
    fontSize: "17px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  reelDesc: {
    fontSize: "14px",
    color: "#aaa",
    lineHeight: "1.4",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#666",
  },
};