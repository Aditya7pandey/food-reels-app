import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import PartnerRegister from "./pages/PartnerRegister";
import PartnerLogin from "./pages/PartnerLogin";
import UserDashboard from "./pages/UserDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerProfile from "./pages/PartnerProfile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route
          path="/partner/profile/:partnerId"
          element={<PartnerProfile />}
        />
      </Routes>
    </Router>
  );
}

export default App;
