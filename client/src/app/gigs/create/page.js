"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

export default function CreateGigPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    location: "",
    date: "",
    pay: "",
    instrumentsNeeded: "", // comma-separated in form, converted to array on submit
    genre: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in or not a venue
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (user && user.role !== "venue") {
      router.push("/gigs"); // Musicians can't post gigs
    }
  }, [token, user, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        pay: Number(formData.pay), // Convert pay string to number
        instrumentsNeeded: formData.instrumentsNeeded.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await API.post("/gigs", payload);
      router.push(`/gigs/${data._id}`); // Redirect to the newly created gig page
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gig.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Post a Gig</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Gig title (e.g. Live Jazz Night)"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Describe the gig..."
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="venue"
          placeholder="Venue name"
          value={formData.venue}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="City, State"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pay"
          placeholder="Pay ($)"
          value={formData.pay}
          onChange={handleChange}
        />
        <input
          name="instrumentsNeeded"
          placeholder="Instruments needed (e.g. Guitar, Bass, Drums)"
          value={formData.instrumentsNeeded}
          onChange={handleChange}
        />
        <input
          name="genre"
          placeholder="Genre (e.g. Jazz, Rock)"
          value={formData.genre}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
}
