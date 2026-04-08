export default function Profile() {
  return (
    <div style={{color:"white", background:"black", height:"100vh"}}>
      <h2>👤 My Profile</h2>

      <p>Followers: 0</p>
      <p>Coins: 0</p>

      <button
        onClick={()=>{
          localStorage.removeItem("token");
          window.location="/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}