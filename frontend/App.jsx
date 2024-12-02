import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import GetProjects from "./pages/GetProjects";
import Requests from "./pages/Requests";
import Todos from "./pages/GetTodos";

function App() {
  return (
    <Router>
      {/* Set background gradient for the entire app */}
      <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<GetProjects />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;