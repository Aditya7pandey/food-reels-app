import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const arrowTimeoutRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/user/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchFoodItems();

    // Prevent body scroll when video feed is active
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navigate]);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/food/", {
        withCredentials: true,
      });
      const items = response.data.items || [];
      setFoodItems(items);

      // Initialize liked videos based on backend data
      const userData = localStorage.getItem("user");
      if (userData) {
        const currentUser = JSON.parse(userData);
        const initialLikedVideos = new Set();

        items.forEach((item) => {
          // Check if current user's ID is in the likes array
          if (
            item.likes &&
            Array.isArray(item.likes) &&
            item.likes.includes(currentUser._id)
          ) {
            initialLikedVideos.add(item._id);
          }
        });

        setLikedVideos(initialLikedVideos);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.play();
      videoRefs.current.forEach((video, index) => {
        if (video && index !== currentVideoIndex) {
          video.pause();
        }
      });
    }
  }, [currentVideoIndex, foodItems]);

  const handleScroll = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (
        newIndex !== currentVideoIndex &&
        newIndex >= 0 &&
        newIndex < foodItems.length
      ) {
        setCurrentVideoIndex(newIndex);
      }

      // Show arrows on scroll, hide after 2 seconds
      setShowArrows(true);
      if (arrowTimeoutRef.current) {
        clearTimeout(arrowTimeoutRef.current);
      }
      arrowTimeoutRef.current = setTimeout(() => {
        setShowArrows(false);
      }, 2000);
    },
    [currentVideoIndex, foodItems.length]
  );

  const scrollToVideo = (index) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };

  const handleLike = async (videoId) => {
    const isLiked = likedVideos.has(videoId);

    try {
      // Call single backend API endpoint that toggles like
      const response = await axios.post(
        `http://localhost:3000/api/food/like/${videoId}`,
        {},
        { withCredentials: true }
      );

      console.log(response);

      // Toggle local state
      const newLikedVideos = new Set(likedVideos);
      if (isLiked) {
        newLikedVideos.delete(videoId);
      } else {
        newLikedVideos.add(videoId);
      }
      setLikedVideos(newLikedVideos);

      // Update optimistically first for immediate feedback
      setFoodItems((prevItems) =>
        prevItems.map((item) =>
          item._id === videoId
            ? {
                ...item,
                likeCount: isLiked
                  ? Math.max(0, (item.likeCount || 0) - 1)
                  : (item.likeCount || 0) + 1,
              }
            : item
        )
      );

      // Then fetch the updated item to get the accurate count and sync liked state
      const updatedResponse = await axios.get(
        "http://localhost:3000/api/food/",
        {
          withCredentials: true,
        }
      );

      if (updatedResponse.data.items) {
        const items = updatedResponse.data.items;
        setFoodItems(items);

        // Update liked videos based on fresh data
        const userData = localStorage.getItem("user");
        if (userData) {
          const currentUser = JSON.parse(userData);
          const updatedLikedVideos = new Set();

          items.forEach((item) => {
            if (
              item.likes &&
              Array.isArray(item.likes) &&
              item.likes.includes(currentUser._id)
            ) {
              updatedLikedVideos.add(item._id);
            }
          });

          setLikedVideos(updatedLikedVideos);
        }
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  const handleCommentClick = async (videoId) => {
    setCurrentVideoId(videoId);
    setShowComments(true);

    try {
      const response = await axios.get("http://localhost:3000/api/comment/", {
        withCredentials: true,
      });

      // Filter comments for the current video
      if (response.data.comments && Array.isArray(response.data.comments)) {
        const videoComments = response.data.comments.filter(
          (c) => c.video === videoId
        );
        setComments(videoComments);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentVideoId) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/comment/${currentVideoId}`,
        { comment: newComment },
        { withCredentials: true }
      );

      if (response.data && response.data.comment) {
        // Add the new comment to the list
        setComments([
          ...comments,
          {
            _id: response.data.id,
            comment: response.data.comment,
            video: currentVideoId,
          },
        ]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleShare = async (videoItem) => {
    const shareData = {
      title: videoItem.name || "Delicious Food",
      text: `Check out this amazing food: ${videoItem.name}${
        videoItem.description ? ` - ${videoItem.description}` : ""
      }`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        } catch (clipboardErr) {
          console.error("Clipboard error:", clipboardErr);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading delicious content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>😕 Oops!</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (foodItems.length === 0) {
    return (
      <div className="empty-screen">
        <div className="empty-content">
          <h2>🍕 No Food Yet</h2>
          <p>Check back later for delicious content from our partners</p>
          <button onClick={() => navigate("/")} className="home-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="top-header">
        <div className="logo">Zomato</div>
        <div className="header-right">
          <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="1" strokeWidth="2" />
              <circle cx="12" cy="5" r="1" strokeWidth="2" />
              <circle cx="12" cy="19" r="1" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>

      {/* Menu Dropdown */}
      {showMenu && (
        <div className="menu-dropdown">
          <div className="menu-item">
            <span>👤 {user?.fullName}</span>
          </div>
          <div className="menu-divider"></div>
          <div className="menu-item" onClick={handleLogout}>
            <span>🚪 Logout</span>
          </div>
        </div>
      )}

      {/* Video Feed Container */}
      <div className="video-feed" ref={containerRef} onScroll={handleScroll}>
        {foodItems.map((item, index) => (
          <div key={item._id} className="video-item">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video}
              className="video-player"
              loop
              playsInline
              muted={isMuted}
              onClick={() => {
                const video = videoRefs.current[index];
                if (video.paused) {
                  video.play();
                } else {
                  video.pause();
                }
              }}
            />

            {/* Video Overlay Info */}
            <div className="video-info">
              <div className="food-details">
                <div
                  className="partner-badge"
                  onClick={() =>
                    navigate(`/partner/profile/${item.foodpartner}`)
                  }
                >
                  <div className="partner-avatar">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <span className="partner-name">View Partner</span>
                </div>
                <h3 className="food-name">{item.name}</h3>
                {item.description && (
                  <p className="food-description">{item.description}</p>
                )}
              </div>
            </div>

            {/* Side Action Buttons */}
            <div className="side-actions">
              <button
                className={`action-btn ${
                  likedVideos.has(item._id) ? "liked" : ""
                }`}
                onClick={() => handleLike(item._id)}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={likedVideos.has(item._id) ? "#ff6b6b" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span className="action-count">
                  {item.likeCount !== undefined ? item.likeCount : 0}
                </span>
              </button>

              <button
                className="action-btn"
                onClick={() => handleCommentClick(item._id)}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>

              <button className="action-btn" onClick={() => handleShare(item)}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>

              <button className="action-btn" onClick={toggleMute}>
                {isMuted ? (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentVideoIndex > 0 && (
        <button
          className={`nav-arrow nav-up ${showArrows ? "visible" : ""}`}
          onClick={() => scrollToVideo(currentVideoIndex - 1)}
          onMouseEnter={() => setShowArrows(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}

      {currentVideoIndex < foodItems.length - 1 && (
        <button
          className={`nav-arrow nav-down ${showArrows ? "visible" : ""}`}
          onClick={() => scrollToVideo(currentVideoIndex + 1)}
          onMouseEnter={() => setShowArrows(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="comments-modal" onClick={() => setShowComments(false)}>
          <div
            className="comments-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="comments-header">
              <h3>Comments</h3>
              <button
                className="close-btn"
                onClick={() => setShowComments(false)}
              >
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
            </div>

            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <div key={idx} className="comment-item">
                    <div className="comment-avatar">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="comment-content">
                      <p className="comment-text">{comment.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="comment-form" onSubmit={handleAddComment}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button
                type="submit"
                className="comment-submit"
                disabled={!newComment.trim()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
