import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={styles.navbar}>
      <Link to="/feed" style={styles.navLink}>🏠</Link>
      <Link to="/upload" style={styles.navLink}>➕</Link>
      <Link to="/profile" style={styles.navLink}>👤</Link>
    </div>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65px",
    background: "#000",
    borderTop: "1px solid #333",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 100,
    paddingBottom: "8px",
  },
  navLink: {
    fontSize: "28px",
    textDecoration: "none",
    padding: "8px 20px",
    transition: "all 0.2s",
  },
};