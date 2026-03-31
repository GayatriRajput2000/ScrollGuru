import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Feed() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    API.get("reels/")
      .then((res) => setReels(res.data))
      .catch(() => alert("Login Required"));
  }, []);

  return (
    <div>
      <h2>ScrollGuru Feed</h2>

      {reels.map((reel) => (
        <div key={reel.id}>
          <h3>{reel.title}</h3>

          <video width="300" controls>
            <source src={reel.video} />
          </video>

          <p>{reel.description}</p>
        </div>
      ))}
    </div>
  );
}