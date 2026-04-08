import { useState } from "react";

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("Gayatri");
  const [bio, setBio] = useState("Learning while scrolling 🔥 | ScrollGuru Creator");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

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

  const handleSaveProfile = () => {
    alert("Profile Updated Successfully! 🔥");
    setIsEditModalOpen(false);
  };

  return (
    <div style={styles.page}>
      {/* Ambient glow */}
      <div style={styles.ambientGlow} />
      <div style={styles.ambientGlow2} />

      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <div style={styles.backBtn}>‹</div>
          <div>
            <h1 style={styles.username}>gayatri_</h1>
            <div style={styles.postsCount}>0 posts</div>
          </div>
        </div>
        <div style={styles.topIcons}>
          <div style={styles.iconBtn}>+</div>
          <div style={styles.iconBtn}>☰</div>
        </div>
      </div>

      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.avatarWrapper}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" style={styles.avatarImage} />
              ) : (
                <span style={styles.avatarEmoji}>👤</span>
              )}
            </div>
          </div>
          <div style={styles.verified}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <div style={styles.stats}>
          {[
            { num: "0", label: "posts" },
            { num: "0", label: "followers" },
            { num: "0", label: "following" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                ...styles.statItem,
                ...(hoveredStat === i ? styles.statItemHover : {}),
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={styles.statNumber}>{stat.num}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio Section */}
      <div style={styles.bioCard}>
        <div style={styles.nameRow}>
          <span style={styles.name}>{name}</span>
          <span style={styles.badge}>✨ Creator</span>
        </div>
        <div style={styles.bioText}>{bio}</div>
        <div style={styles.bioLink}>🔗 scrollguru.app/gayatri</div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionRow}>
        <button
          onClick={() => setIsEditModalOpen(true)}
          style={{
            ...styles.editButton,
            ...(hoveredBtn === "edit" ? styles.editButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn("edit")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span style={styles.btnIcon}>✏️</span>
          Edit Profile
        </button>
        <button
          style={{
            ...styles.shareButton,
            ...(hoveredBtn === "share" ? styles.shareButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredBtn("share")}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <span style={styles.btnIcon}>↗</span>
          Share
        </button>
      </div>

      {/* Coins Section */}
      <div style={styles.coinsCard}>
        <div style={styles.coinsLeft}>
          <div style={styles.coinIconWrapper}>
            <span style={styles.coinIcon}>🪙</span>
          </div>
          <div>
            <div style={styles.coinsLabel}>ScrollGuru Coins</div>
            <div style={styles.coinsValue}>0 Coins</div>
          </div>
        </div>
        <div style={styles.coinsArrow}>›</div>
      </div>

      {/* Menu Items */}
      <div style={styles.menuSection}>
        {[
          { icon: "📊", label: "Analytics", desc: "View your performance" },
          { icon: "⚙️", label: "Settings", desc: "Account preferences" },
          { icon: "❓", label: "Help Center", desc: "Get support" },
        ].map((item, i) => (
          <div key={i} style={styles.menuItem}>
            <span style={styles.menuIcon}>{item.icon}</span>
            <div style={styles.menuText}>
              <div style={styles.menuLabel}>{item.label}</div>
              <div style={styles.menuDesc}>{item.desc}</div>
            </div>
            <div style={styles.menuArrow}>›</div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location = "/login";
        }}
        style={styles.logoutButton}
      >
        <span style={styles.logoutIcon}>↪</span>
        Log Out
      </button>

      {/* Bottom spacing */}
      <div style={{ height: "100px" }} />

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {isEditModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal handle */}
            <div style={styles.modalHandle} />

            <h2 style={styles.modalTitle}>Edit Profile</h2>

            {/* Avatar Upload */}
            <div style={styles.avatarEditSection}>
              <div style={styles.avatarRingLarge}>
                <div style={styles.avatarLarge}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="preview" style={styles.avatarImageLarge} />
                  ) : (
                    <span style={styles.avatarEmojiLarge}>👤</span>
                  )}
                </div>
              </div>
              <label style={styles.changePhotoBtn}>
                <span style={styles.changePhotoIcon}>📷</span>
                Change Photo
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
                placeholder="Your name"
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
              <div style={styles.charCount}>{bio.length}/150</div>
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
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "70px",
    position: "relative",
    overflow: "hidden",
  },

  // Ambient background glows
  ambientGlow: {
    position: "fixed",
    top: "-120px",
    right: "-80px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(193,53,132,0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  ambientGlow2: {
    position: "fixed",
    bottom: "100px",
    left: "-100px",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(0,149,246,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
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
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
  },
  username: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  postsCount: {
    fontSize: "12px",
    color: "#888",
    marginTop: "1px",
  },
  topIcons: {
    display: "flex",
    gap: "8px",
  },
  iconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "400",
  },

  // Profile Header
  profileHeader: {
    display: "flex",
    alignItems: "center",
    padding: "24px 20px 16px",
    gap: "28px",
    position: "relative",
    zIndex: 1,
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatarRing: {
    padding: "3px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4, #f56040)",
    backgroundSize: "300% 300%",
  },
  avatar: {
    width: "82px",
    height: "82px",
    borderRadius: "50%",
    background: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #000",
    overflow: "hidden",
  },
  avatarEmoji: {
    fontSize: "36px",
    filter: "grayscale(0.3)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  verified: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    background: "#0095f6",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #000",
  },

  // Stats
  stats: {
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    textAlign: "center",
  },
  statItem: {
    cursor: "pointer",
    padding: "8px 4px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
  },
  statItemHover: {
    background: "rgba(255,255,255,0.05)",
  },
  statNumber: {
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#888",
    marginTop: "2px",
    fontWeight: "500",
  },

  // Bio Card
  bioCard: {
    padding: "0 20px 4px",
    position: "relative",
    zIndex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  name: {
    fontWeight: "700",
    fontSize: "15px",
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    background: "linear-gradient(135deg, rgba(245,96,64,0.2), rgba(193,53,132,0.2))",
    color: "#f56040",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(245,96,64,0.2)",
  },
  bioText: {
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.5",
  },
  bioLink: {
    fontSize: "13px",
    color: "#0095f6",
    marginTop: "6px",
    fontWeight: "500",
  },

  // Action Buttons
  actionRow: {
    display: "flex",
    gap: "8px",
    padding: "16px 20px",
    position: "relative",
    zIndex: 1,
  },
  editButton: {
    flex: 1,
    padding: "11px 16px",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  editButtonHover: {
    background: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  shareButton: {
    padding: "11px 18px",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s ease",
  },
  shareButtonHover: {
    background: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  btnIcon: {
    fontSize: "14px",
  },

  // Coins Card
  coinsCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    margin: "0 20px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(255,193,7,0.08), rgba(255,152,0,0.04))",
    border: "1px solid rgba(255,193,7,0.12)",
    cursor: "pointer",
    position: "relative",
    zIndex: 1,
    transition: "all 0.2s ease",
  },
  coinsLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  coinIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, rgba(255,193,7,0.2), rgba(255,152,0,0.15))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  coinIcon: {
    fontSize: "22px",
  },
  coinsLabel: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500",
  },
  coinsValue: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#ffc107",
    marginTop: "1px",
  },
  coinsArrow: {
    fontSize: "22px",
    color: "#666",
    fontWeight: "300",
  },

  // Menu Section
  menuSection: {
    margin: "16px 20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "15px 16px",
    cursor: "pointer",
    transition: "background 0.15s ease",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  menuIcon: {
    fontSize: "20px",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuText: {
    flex: 1,
    marginLeft: "12px",
  },
  menuLabel: {
    fontSize: "14px",
    fontWeight: "600",
  },
  menuDesc: {
    fontSize: "12px",
    color: "#666",
    marginTop: "2px",
  },
  menuArrow: {
    fontSize: "20px",
    color: "#444",
    fontWeight: "300",
  },

  // Logout Button
  logoutButton: {
    margin: "20px 20px 0",
    padding: "14px",
    background: "transparent",
    color: "#ff4757",
    border: "1px solid rgba(255,71,87,0.2)",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    width: "calc(100% - 40px)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    position: "relative",
    zIndex: 1,
  },
  logoutIcon: {
    fontSize: "16px",
  },

  // ==================== MODAL STYLES ====================
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#111",
    width: "100%",
    maxWidth: "440px",
    borderRadius: "24px 24px 0 0",
    padding: "12px 24px 36px",
    color: "#fff",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHandle: {
    width: "36px",
    height: "4px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.2)",
    margin: "0 auto 20px",
  },
  modalTitle: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "28px",
    letterSpacing: "-0.3px",
  },

  // Avatar Edit
  avatarEditSection: {
    textAlign: "center",
    marginBottom: "28px",
  },
  avatarRingLarge: {
    padding: "3px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f56040, #c13584, #833ab4, #f56040)",
    display: "inline-block",
    marginBottom: "16px",
  },
  avatarLarge: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #000",
    overflow: "hidden",
  },
  avatarImageLarge: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarEmojiLarge: {
    fontSize: "46px",
    filter: "grayscale(0.3)",
  },
  changePhotoBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #0095f6, #006fb5)",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: "24px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },
  changePhotoIcon: {
    fontSize: "15px",
  },

  // Inputs
  inputGroup: {
    marginBottom: "20px",
    position: "relative",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#999",
    marginBottom: "8px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    resize: "none",
    minHeight: "90px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  charCount: {
    position: "absolute",
    right: "16px",
    bottom: "10px",
    fontSize: "11px",
    color: "#555",
  },

  // Modal Buttons
  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "28px",
  },
  cancelButton: {
    flex: 1,
    padding: "14px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  saveButton: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #0095f6, #006fb5)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
