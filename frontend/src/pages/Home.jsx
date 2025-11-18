import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Zomato</h1>
        <p>Discover delicious food from our partners</p>
        <div className="cta-buttons">
          <Link to="/user/login" className="btn btn-primary">
            Login as User
          </Link>
          <Link to="/partner/login" className="btn btn-secondary">
            Login as Partner
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🍕 Wide Selection</h3>
          <p>Explore a variety of food items from our trusted partners</p>
        </div>
        <div className="feature-card">
          <h3>📹 Video Previews</h3>
          <p>Watch videos of food items before ordering</p>
        </div>
        <div className="feature-card">
          <h3>🤝 Partner with Us</h3>
          <p>Join as a food partner and grow your business</p>
        </div>
      </div>

      <div className="info-section">
        <h2>Get Started</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>For Users</h3>
            <p>Browse and explore delicious food items</p>
            <Link to="/user/register" className="btn btn-link">
              Register Now
            </Link>
          </div>
          <div className="info-card">
            <h3>For Partners</h3>
            <p>Share your food creations with the world</p>
            <Link to="/partner/register" className="btn btn-link">
              Become a Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
