"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

export default function PublicProfilePage({ params }) {
  const { id } = params; // The user ID from the URL — e.g. /profile/abc123
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Connection request state
  const [connectMessage, setConnectMessage] = useState("");
  const [connectSent, setConnectSent] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/posts/user/${id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async (postId) => {
    if (!user) return; // Must be logged in to like
    try {
      const { data } = await API.put(`/posts/${postId}/like`);
      // Update the post in state with the new likes array
      setPosts(posts.map((p) => (p._id === postId ? data : p)));
    } catch (err) {
      console.error("Failed to like post");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return null;

  // Don't show "Connect" button on your own profile
  const isOwnProfile = user?._id === profile._id;

  return (
    <div>

      {/* PROFILE HEADER */}
      <div>
        <img src={profile.profilePic || "/default-avatar.png"} alt={profile.name} />
        <h1>{profile.name}</h1>
        <p>{profile.location || "No location set"}</p>
        <p>{profile.bio || "No bio yet"}</p>

        {/* CONNECT BUTTON — only shown if logged in and viewing someone else's profile */}
        {user && !isOwnProfile && !connectSent && (
          <div>
            <textarea
              placeholder="Send a message with your connection request..."
              value={connectMessage}
              onChange={(e) => setConnectMessage(e.target.value)}
            />
            <button disabled={connectLoading}>
              {connectLoading ? "Sending..." : "Connect"}
            </button>
          </div>
        )}
        {connectSent && <p>Connection request sent!</p>}
      </div>

      {/* MUSICIAN DETAILS */}
      <div>
        <div>
          <h3>Instruments</h3>
          {profile.instruments.map((i) => <span key={i}>{i}</span>)}
        </div>
        <div>
          <h3>Genres</h3>
          {profile.genres.map((g) => <span key={g}>{g}</span>)}
        </div>
        <div>
          <h3>Looking For</h3>
          {profile.lookingFor.map((l) => <span key={l}>{l}</span>)}
        </div>
        <div>
          <h3>Influences</h3>
          {profile.influences.map((inf) => <span key={inf}>{inf}</span>)}
        </div>
        <div>
          <h3>Experience</h3>
          <p>{profile.experienceLevel}</p>
        </div>
        <div>
          <h3>Availability</h3>
          <p>{profile.availability || "Not set"}</p>
        </div>
      </div>

      {/* POSTS — their music clips */}
      <div>
        <h2>Music Clips</h2>
        {posts.length === 0 && <p>No posts yet.</p>}
        {posts.map((post) => (
          <div key={post._id}>
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} controls />
            ) : (
              <img src={post.mediaUrl} alt={post.caption} />
            )}
            <p>{post.caption}</p>
            <p>{post.instrument}</p>
            <div>
              <button onClick={() => handleLike(post._id)}>
                {/* Show filled heart if the logged-in user already liked it */}
                {user && post.likes.includes(user._id) ? "♥" : "♡"}
              </button>
              <span>{post.likes.length} likes</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
