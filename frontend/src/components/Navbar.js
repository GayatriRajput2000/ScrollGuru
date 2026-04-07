import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      position:"fixed",
      bottom:0,
      width:"100%",
      display:"flex",
      justifyContent:"space-around",
      background:"#000",
      color:"#fff",
      padding:"10px"
    }}>
      <Link to="/feed">🏠</Link>
      <Link to="/upload">➕</Link>
      <Link to="/profile">👤</Link>
    </div>
  );
}