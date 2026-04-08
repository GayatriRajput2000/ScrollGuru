import { useState } from "react";

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("Gayatri");
  const [bio, setBio] = useState("Learning while scrolling 🔥 | ScrollGuru Creator");
  const [avatar, setAvatar] = useState(null); // Will store selected file
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Profile (for now just close modal - backend later)
  const handleSaveProfile = () => {
    alert("Profile Updated Successfully! 🔥");
    setIsEditModalOpen(false);
    // Backend API call yahan daal sakti ho baad mein
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <h1 style={styles.username}>gayatri_</h1>
        <div style={styles.topIcons}>
          <span style={styles.icon}>☰</span>
        </div>
      </div>

      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatarContainer}>
          <div style={styles.avatar}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" style={styles.avatarImage} />
            ) : (
              "👤"
            )}
          </div>
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
        <div style={styles.name}>{name}</div>
        <div style={styles.bioText}>{bio}</div>
      </div>

      {/* Edit Profile Button */}
      <button 
        onClick={() => setIsEditModalOpen(true)}
        style={styles.editButton}
      >
        Edit Profile
      </button>

      {/* Coins Section */}
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

      {/* Bottom spacing */}
      <div style={{ height: "80px" }}></div>

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {isEditModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Edit Profile</h2>

            {/* Avatar Upload */}
            <div style={styles.avatarEditSection}>
              <div style={styles.avatarLarge}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" style={styles.avatarImageLarge} />
                ) : (
                  <div style={styles.avatarPlaceholder}>👤</div>
                )}
              </div>
              <label style={styles.changePhotoBtn}>
                Change Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* Name Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Bio Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={styles.textarea}
                rows="3"
                placeholder="Write something about yourself..."
              />
            </div>

            {/* Buttons */}
            <div style={styles.modalButtons}>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                style={styles.saveButton}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
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
  username: { fontSize: "20px", fontWeight: "600" },
  topIcons: { fontSize: "24px" },
  icon: { marginLeft: "16px", cursor: "pointer" },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "20px 16px",
    gap: "30px",
  },
  avatarContainer: { position: "relative" },
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
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
  statItem: { cursor: "pointer" },
  statNumber: { fontSize: "18px", fontWeight: "700" },
  statLabel: { fontSize: "13px", color: "#aaa", marginTop: "4px" },

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
    padding: "10px 20px",
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
  coinIcon: { fontSize: "24px" },
  coins: { fontSize: "16px", fontWeight: "600" },

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

  /* ==================== MODAL STYLES ==================== */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#111",
    width: "90%",
    maxWidth: "380px",
    borderRadius: "16px",
    padding: "24px",
    color: "#fff",
  },
  modalTitle: {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  avatarEditSection: {
    textAlign: "center",
    marginBottom: "24px",
  },
  avatarLarge: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto 12px",
    background: "linear-gradient(135deg, #f56040, #c13584)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "50px",
    overflow: "hidden",
    border: "4px solid #000",
  },
  avatarImageLarge: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    fontSize: "50px",
  },
  changePhotoBtn: {
    display: "inline-block",
    background: "#0095f6",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },

  inputGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    background: "#1a1a1a",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "80px",
  },

  modalButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  saveButton: {
    flex: 1,
    padding: "12px",
    background: "#0095f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },
};