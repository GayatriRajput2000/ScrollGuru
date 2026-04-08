export default function Profile() {
  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <h1 style={styles.username}>gayatri_</h1>   {/* aapka naam ya dynamic bana sakte ho baad mein */}
        <div style={styles.topIcons}>
          <span style={styles.icon}>☰</span>
        </div>
      </div>

      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.verified}>✓</div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>posts</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>followers</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>following</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={styles.bio}>
        <div style={styles.name}>Gayatri</div>
        <div style={styles.bioText}>Learning while scrolling 🔥 | ScrollGuru Creator</div>
      </div>

      {/* Edit Profile Button */}
      <button style={styles.editButton}>Edit Profile</button>

      {/* Coins / Extra Info */}
      <div style={styles.coinsSection}>
        <span style={styles.coinIcon}>🪙</span>
        <span style={styles.coins}>0 Coins</span>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location = "/login";
        }}
        style={styles.logoutButton}
      >
        Logout
      </button>

      {/* Bottom spacing for Navbar */}
      <div style={{ height: "80px" }}></div>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "70px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #333",
    position: "sticky",
    top: 0,
    background: "#000",
    zIndex: 10,
  },
  username: {
    fontSize: "20px",
    fontWeight: "600",
  },
  topIcons: {
    fontSize: "24px",
  },
  icon: {
    marginLeft: "16px",
    cursor: "pointer",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "20px 16px",
    gap: "30px",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f56040, #c13584)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    border: "4px solid #000",
  },
  verified: {
    position: "absolute",
    bottom: "4px",
    right: "4px",
    background: "#0095f6",
    color: "#fff",
    fontSize: "14px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #000",
  },
  stats: {
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    textAlign: "center",
  },
  statItem: {
    cursor: "pointer",
  },
  statNumber: {
    fontSize: "18px",
    fontWeight: "700",
  },
  statLabel: {
    fontSize: "13px",
    color: "#aaa",
    marginTop: "4px",
  },
  bio: {
    padding: "0 16px 12px",
  },
  name: {
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "4px",
  },
  bioText: {
    fontSize: "14px",
    color: "#ddd",
    lineHeight: "1.4",
  },
  editButton: {
    margin: "10px 16px",
    padding: "8px 20px",
    background: "transparent",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "8px",
    fontWeight: "600",
    width: "calc(100% - 32px)",
    cursor: "pointer",
  },
  coinsSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    background: "#111",
    margin: "10px 16px",
    borderRadius: "12px",
  },
  coinIcon: {
    fontSize: "24px",
  },
  coins: {
    fontSize: "16px",
    fontWeight: "600",
  },
  logoutButton: {
    margin: "20px 16px",
    padding: "12px",
    background: "#c13584",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    width: "calc(100% - 32px)",
    cursor: "pointer",
  },
};