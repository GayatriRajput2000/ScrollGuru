import { useState } from "react";
import API from "../api/axios";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);

  const uploadReel = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("video", video);
    formData.append("category", "learning");

    await API.post("reels/create/", formData);

    alert("Uploaded");
  };

  return (
    <div>
      <h2>Upload Reel</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />

      <input
        type="file"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <button onClick={uploadReel}>Upload</button>
    </div>
  );
}