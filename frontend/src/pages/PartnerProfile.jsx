import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PartnerProfile.css";

const PartnerProfile = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [partnerAddress, setPartnerAddress] = useState("");

  useEffect(() => {
    fetchPartnerAndFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId]);

  const fetchPartnerAndFoods = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all food items
      const response = await axios.get("http://localhost:3000/api/food/", {
        withCredentials: true,
      });

      const items = response.data?.items || [];

      // Normalize comparison: item.foodpartner may be string, ObjectId, or populated object
      const partnerItems = items.filter((item) => {
        const fp = item.foodpartner;
        if (!fp) return false;
        // handle object with _id, plain object, or string/ObjectId
        const fpId =
          typeof fp === "string"
            ? fp
            : fp && (fp._id || fp.toString)
            ? fp._id
              ? String(fp._id)
              : String(fp)
            : "";
        return fpId === String(partnerId);
      });

      // Try POST first (if your backend expects POST); fallback to GET
      let partnerRes;
      try {
        partnerRes = await axios.post(
          `http://localhost:3000/api/food/partner/${partnerId}`,
          {},
          { withCredentials: true }
        );
      } catch (postErr) {
        partnerRes = await axios.get(
          `http://localhost:3000/api/food/partner/${partnerId}`,
          { withCredentials: true }
        );
      }

      // Handle common response shapes
      const partnerData = partnerRes?.data?.partner || partnerRes?.data || null;

      // If partner API returns an object wrapper like { success, data }, try deeper
      const normalizedPartner =
        partnerData?.data || partnerData?.partner || partnerData;

      setPartner(normalizedPartner || null);
      setFoodItems(partnerItems);
      
      // Set partner address
      if (normalizedPartner?.address) {
        setPartnerAddress(normalizedPartner.address);
      }

      // Check if current user is following and set followers count
      if (normalizedPartner) {
        const followers = normalizedPartner.followers || [];
        setFollowersCount(followers.length);

        // Check if current user follows this partner
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser._id) {
          setIsFollowing(followers.includes(currentUser._id));
        }
      }

      // If API returned nothing but we have items, provide a minimal fallback
      if (!normalizedPartner && partnerItems.length > 0) {
        setPartner({
          id: partnerId,
          name: partnerItems[0]?.foodpartnerName || "Food Partner",
          totalItems: partnerItems.length,
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch partner info"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/food/follow/${partnerId}`,
        { withCredentials: true }
      );

      const updatedPartner = response.data?.updatedPartner;
      if (updatedPartner) {
        const followers = updatedPartner.followers || [];
        setFollowersCount(followers.length);

        // Check if current user is in followers list
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        setIsFollowing(followers.includes(currentUser._id));
      } else {
        // Toggle optimistically if response doesn't include updated partner
        setIsFollowing(!isFollowing);
        setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading partner profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>😕 Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate("/user/dashboard")}
          className="back-btn"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="partner-profile-container">
      {/* Header */}
      <header className="profile-header">
        <button
          className="back-button"
          onClick={() => navigate("/user/dashboard")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>Partner Profile</h1>
        <div className="header-spacer"></div>
      </header>

      {/* Profile Info */}
      <div className="profile-content">
        <div className="profile-info-card">
          <div className="profile-avatar">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="profile-name">{partner?.fullName || partner?.name}</h2>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{foodItems.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>
          <button
            className={`follow-btn ${isFollowing ? "following" : ""}`}
            onClick={handleFollowToggle}
            disabled={followLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isFollowing ? (
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </>
              ) : (
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </>
              )}
            </svg>
            {followLoading
              ? "Loading..."
              : isFollowing
              ? "Following"
              : "Follow"}
          </button>
          
          {/* Partner Location Map */}
          {partnerAddress && (
            <div className="location-section">
              <div className="location-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="location-label">Location</span>
              </div>
              <p className="location-address">{partnerAddress}</p>
              <div className="map-container">
                <iframe
                  title="Partner Location"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ border: 0, borderRadius: '12px' }}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(partnerAddress)}&zoom=15`}
                  allowFullScreen
                >
                </iframe>
              </div>
            </div>
          )}
        </div>

        {/* Food Grid */}
        <div className="foods-section">
          <h3 className="section-title">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            All Posts
          </h3>

          {foodItems.length === 0 ? (
            <div className="no-posts">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>No posts yet</p>
            </div>
          ) : (
            <div className="food-grid">
              {foodItems.map((item) => (
                <div
                  key={item._id}
                  className="food-grid-item"
                  onClick={() => navigate("/user/dashboard")}
                >
                  <video src={item.video} className="grid-video" muted />
                  <div className="grid-overlay">
                    <div className="play-icon">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="grid-info">
                    <h4>{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
