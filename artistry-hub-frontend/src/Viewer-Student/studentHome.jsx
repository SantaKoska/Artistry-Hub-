import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const StudentHome = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/homeposts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { posts, userId } = response.data;
        const likedPostIds = new Set(
          posts
            .map((post) => (post.likedBy.includes(userId) ? post._id : null))
            .filter(Boolean)
        );

        setPosts(posts);
        setLikedPosts(likedPostIds);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/toggle-like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch posts to update state
      const updatedPosts = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/student/homeposts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { posts, userId } = updatedPosts.data;

      setPosts(posts);

      const likedPostIds = new Set(
        posts
          .map((post) => (post.likedBy.includes(userId) ? post._id : null))
          .filter(Boolean)
      );
      setLikedPosts(likedPostIds);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => {
      const newExpandedPosts = new Set(prev);
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId);
      } else {
        newExpandedPosts.add(postId);
      }
      return newExpandedPosts;
    });
  };

  return (
    <div className="container mx-auto w-full max-w-screen-2xl pb-20 px-4">
      <div className="grid gap-6 grid-cols-1 w-full max-w-3xl mx-auto">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-900 border border-yellow-500/20 rounded-xl shadow-xl p-6 mb-4 
                hover:border-yellow-500/40 transition-all duration-300 w-full"
            >
              {/* User Info Section */}
              <div className="flex items-center mb-6">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    post.user.profilePicture
                  }`}
                  alt={post.user.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500/30"
                />
                <div className="ml-4">
                  <Link to={`/profile/${post.user.userName}`}>
                    <p className="font-semibold text-lg text-yellow-400 hover:text-yellow-300 transition-colors">
                      {post.user.userName}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-400">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Media Section */}
              {post.mediaUrl && post.mediaType === "image" && (
                <div className="mb-6 rounded-lg overflow-hidden border border-zinc-800">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${post.mediaUrl}`}
                    alt="Post media"
                    className="w-full h-64 object-contain bg-zinc-950"
                  />
                </div>
              )}
              {post.mediaUrl && post.mediaType === "video" && (
                <div className="mb-6 rounded-lg overflow-hidden border border-zinc-800">
                  <video
                    controls
                    src={`${import.meta.env.VITE_BACKEND_URL}${post.mediaUrl}`}
                    className="w-full h-64 object-contain bg-zinc-950"
                  />
                </div>
              )}
              {post.mediaUrl && post.mediaType === "audio" && (
                <div className="mb-6 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                  <audio
                    controls
                    src={`${import.meta.env.VITE_BACKEND_URL}${post.mediaUrl}`}
                    className="w-full"
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="mb-4">
                <p className="text-gray-300 leading-relaxed">
                  {expandedPosts.has(post._id)
                    ? post.content
                    : `${post.content.slice(0, 150)}...`}
                </p>
                {post.content.length > 150 && (
                  <button
                    className="text-yellow-400 hover:text-yellow-300 text-sm mt-2 transition-colors"
                    onClick={() => toggleReadMore(post._id)}
                  >
                    {expandedPosts.has(post._id) ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Like Section */}
              <div className="flex items-center mt-4 pt-4 border-t border-zinc-800">
                <button
                  className={`focus:outline-none transition-all duration-300 transform hover:scale-110 ${
                    likedPosts.has(post._id)
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-yellow-400"
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  <FaHeart size={20} />
                </button>
                <span className="ml-2 text-gray-400 text-sm">
                  {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No posts available at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
