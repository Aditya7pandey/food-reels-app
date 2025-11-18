import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./PartnerDashboard.css";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  useEffect(() => {
    const partnerData = localStorage.getItem("partner");
    if (!partnerData) {
      navigate("/partner/login");
      return;
    }
    const parsedPartner = JSON.parse(partnerData);
    setPartner(parsedPartner);
    setAddressInput(parsedPartner?.address || "");
    fetchMyVideos(parsedPartner._id);
  }, [navigate]);

  const fetchMyVideos = async (partnerId) => {
    try {
      console.log("Fetching videos for partner:", partnerId);
      const response = await axios.get(
        "http://localhost:3000/api/food/partner/my-videos",
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      const items = response.data.items || [];
      console.log("Partner videos:", items);
      setMyVideos(items);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setMyVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      video: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Food name is required"),
      description: Yup.string(),
      video: Yup.mixed()
        .required("Video is required")
        .test("fileType", "Only video files are allowed", (value) => {
          if (!value) return false;
          return (
            value &&
            [
              "video/mp4",
              "video/webm",
              "video/ogg",
              "video/quicktime",
            ].includes(value.type)
          );
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("video", values.video);

        const response = await axios.post(
          "http://localhost:3000/api/food/",
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          setUploadSuccess("Food item created successfully!");
          resetForm();
          // Refresh the video list
          fetchMyVideos(partner._id);
          setTimeout(() => {
            setShowForm(false);
            setUploadSuccess("");
          }, 2000);
        }
      } catch (err) {
        setUploadError(
          err.response?.data?.message || "Failed to create food item"
        );
      } finally {
        setUploading(false);
      }
    },
  });

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/partner/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("partner");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleCloseModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const handleSaveAddress = async () => {
    if (!addressInput.trim()) {
      setAddressMessage("Address cannot be empty");
      return;
    }
    try {
      setAddressSaving(true);
      setAddressMessage("");
      const response = await axios.post(
        "http://localhost:3000/api/food/partner/address",
        { address: addressInput },
        { withCredentials: true }
      );
      const updated = response.data?.updatedPartner;
      if (updated) {
        setPartner((prev) => ({ ...prev, address: updated.address }));
        localStorage.setItem(
          "partner",
          JSON.stringify({ ...partner, address: updated.address })
        );
        setAddressMessage("✓ Address updated successfully");
      } else {
        setAddressMessage(response.data?.message || "Failed to update address");
      }
    } catch (err) {
      setAddressMessage(
        err.response?.data?.message || "Error updating address"
      );
    } finally {
      setAddressSaving(false);
      setTimeout(() => setAddressMessage(""), 3000);
    }
  };

  // Calculate total likes
  const totalLikes = myVideos.reduce(
    (sum, video) => sum + (video.likeCount || 0),
    0
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Zomato Partner Dashboard</h1>
          <div className="header-actions">
            <span className="user-name">Welcome, {partner?.fullName}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="content-wrapper">
          {/* Address Section */}
          <div className="address-section">
            <div className="stat-card" style={{ marginBottom: "30px" }}>
              <div className="stat-icon views-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="stat-info" style={{ flex: 1 }}>
                <h3 style={{ marginBottom: "8px" }}>Partner Address</h3>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Enter your business address"
                    style={{
                      flex: 1,
                      padding: "12px 15px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    className="add-food-btn"
                    onClick={handleSaveAddress}
                    disabled={addressSaving}
                    style={{ minWidth: "100px" }}
                  >
                    {addressSaving ? "Saving..." : "Save"}
                  </button>
                </div>
                {addressMessage && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      backgroundColor:
                        addressMessage.includes("success") ||
                        addressMessage.includes("✓")
                          ? "#d1fae5"
                          : "#fee2e2",
                      color:
                        addressMessage.includes("success") ||
                        addressMessage.includes("✓")
                          ? "#065f46"
                          : "#991b1b",
                    }}
                  >
                    {addressMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon video-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{myVideos.length}</h3>
                <p>Total Videos</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon likes-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{totalLikes}</h3>
                <p>Total Likes</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon views-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div className="stat-info">
                <h3>
                  {myVideos.reduce((sum, v) => sum + (v.likes?.length || 0), 0)}
                </h3>
                <p>Total Engagements</p>
              </div>
            </div>
          </div>

          <div className="section-header">
            <h2>My Food Videos</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="add-food-btn"
            >
              {showForm ? "Cancel" : "+ Add New Video"}
            </button>
          </div>

          {showForm && (
            <div className="form-container">
              <h3>Create New Food Item</h3>

              {uploadError && (
                <div className="error-message">{uploadError}</div>
              )}
              {uploadSuccess && (
                <div className="success-message">{uploadSuccess}</div>
              )}

              <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Food Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter food name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={
                      formik.touched.name && formik.errors.name ? "error" : ""
                    }
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="field-error">{formik.errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Enter food description (optional)"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="video">Video *</label>
                  <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "video",
                        event.currentTarget.files[0]
                      );
                    }}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.video && formik.errors.video ? "error" : ""
                    }
                  />
                  {formik.touched.video && formik.errors.video && (
                    <div className="field-error">{formik.errors.video}</div>
                  )}
                  <small className="help-text">
                    Upload a video of your food item (MP4, WebM, OGG)
                  </small>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Create Food Item"}
                </button>
              </form>
            </div>
          )}

          {/* Video Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your videos...</p>
            </div>
          ) : myVideos.length === 0 ? (
            <div className="empty-state">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              <h3>No videos yet</h3>
              <p>Click "Add New Video" to upload your first food reel!</p>
            </div>
          ) : (
            <div className="video-grid">
              {myVideos.map((video) => (
                <div
                  key={video._id}
                  className="video-grid-card"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="video-thumbnail">
                    <video src={video.video} className="thumbnail-video" />
                    <div className="play-overlay">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <div className="video-card-info">
                    <h4>{video.name}</h4>
                    <div className="video-stats">
                      <span className="stat-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="#ff6b6b"
                          stroke="#ff6b6b"
                          strokeWidth="2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {video.likeCount || 0}
                      </span>
                      <span className="stat-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {video.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="video-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-video-container">
              <video
                src={selectedVideo.video}
                controls
                autoPlay
                loop
                className="modal-video"
              />
            </div>

            <div className="modal-info">
              <h3>{selectedVideo.name}</h3>
              {selectedVideo.description && (
                <p className="modal-description">{selectedVideo.description}</p>
              )}
              <div className="modal-stats">
                <div className="modal-stat">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#ff6b6b"
                    stroke="#ff6b6b"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{selectedVideo.likeCount || 0} likes</span>
                </div>
                <div className="modal-stat">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{selectedVideo.likes?.length || 0} engagements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
