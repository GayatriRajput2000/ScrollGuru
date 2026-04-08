import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import CreatorProfile from "./pages/CreatorProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Splash Screen */}
        <Route path="/" element={<Splash />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Profile />} /> {/* ✅ */}
        <Route path="/creator/:id" element={<CreatorProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;