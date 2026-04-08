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
    <div style={{background:"black", color:"white"}}>
      <h2>Creator Profile</h2>

      {reels.map(r=>(
        <video key={r.id} width="100%" controls>
          <source src={`http://127.0.0.1:8000${r.video}`} />
        </video>
      ))}
    </div>
  );
}