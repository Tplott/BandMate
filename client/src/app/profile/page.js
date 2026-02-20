"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

export default function MyProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // Toggle edit mode
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state for editing
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    instruments: "",    // Stored as comma-separated string in the form, converted to array on save
    genres: "",
    experienceLevel: "intermediate",
    lookingFor: "",
    influences: "",
    availability: "",
  });

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Fetch profile and posts on load
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          API.get("/users/profile"),
          API.get(`/posts/user/${user?._id}`),
        ]);
        setProfile(profileRes.data);
        setPosts(postsRes.data);

        // Pre-fill the edit form with current values
        // Arrays are joined to comma-separated strings for the input fields
        setFormData({
          bio: profileRes.data.bio || "",
          location: profileRes.data.location || "",
          instruments: profileRes.data.instruments.join(", "),
          genres: profileRes.data.genres.join(", "),
          experienceLevel: profileRes.data.experienceLevel || "intermediate",
          lookingFor: profileRes.data.lookingFor.join(", "),
          influences: profileRes.data.influences.join(", "),
          availability: profileRes.data.availability || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert comma-separated strings back to arrays before sending to the API
      const updated = {
        ...formData,
        instruments: formData.instruments.split(",").map((s) => s.trim()).filter(Boolean),
        genres: formData.genres.split(",").map((s) => s.trim()).filter(Boolean),
        lookingFor: formData.lookingFor.split(",").map((s) => s.trim()).filter(Boolean),
        influences: formData.influences.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await API.put("/users/profile", updated);
      setProfile(data);
      setEditing(false);
    } catch (err) {
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return null;

  return (
    <div>

      {/* PROFILE HEADER — photo, name, location, bio */}
      <div>
        <img src={profile.profilePic || "/default-avatar.png"} alt={profile.name} />
        <h1>{profile.name}</h1>
        <p>{profile.location || "No location set"}</p>
        <p>{profile.bio || "No bio yet"}</p>
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* EDIT FORM — only shown when editing is true */}
      {editing && (
        <form onSubmit={handleSave}>
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell the world about yourself..." />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
          <input name="instruments" value={formData.instruments} onChange={handleChange} placeholder="Guitar, Bass, Drums (comma separated)" />
          <input name="genres" value={formData.genres} onChange={handleChange} placeholder="Rock, Jazz, Blues (comma separated)" />
          <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
          <input name="lookingFor" value={formData.lookingFor} onChange={handleChange} placeholder="Band, Jam Session, Gigs (comma separated)" />
          <input name="influences" value={formData.influences} onChange={handleChange} placeholder="Jimi Hendrix, SRV (comma separated)" />
          <input name="availability" value={formData.availability} onChange={handleChange} placeholder="Weekends, Evenings, Anytime" />
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </form>
      )}

      {/* PROFILE DETAILS — instruments, genres, etc. */}
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
          <h3>Availability</h3>
          <p>{profile.availability || "Not set"}</p>
        </div>
        <div>
          <h3>Experience</h3>
          <p>{profile.experienceLevel}</p>
        </div>
      </div>

      {/* POSTS SECTION — the user's music clips */}
      <div>
        <h2>My Posts</h2>
        {posts.length === 0 && <p>No posts yet. Share a clip!</p>}
        {posts.map((post) => (
          <div key={post._id}>
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} controls />
            ) : (
              <img src={post.mediaUrl} alt={post.caption} />
            )}
            <p>{post.caption}</p>
            <p>{post.instrument}</p>
            <p>{post.likes.length} likes</p>
            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}
