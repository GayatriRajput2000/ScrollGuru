import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setTimeout(() => {
      token ? navigate("/feed") : navigate("/login");
    }, 2000);
  }, []);

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.logo}>🔥 ScrollGuru</h1>
        <p style={styles.tag}>Learn While You Scroll</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "black",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  logo: {
    fontSize: "50px",
    fontWeight: "bold",
  },
  tag: {
    opacity: 0.7,
  },
};