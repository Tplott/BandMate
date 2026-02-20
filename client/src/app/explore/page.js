"use client";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import MusicianCard from "@/components/MusicianCard";

export default function ExplorePage() {
  const [musicians, setMusicians] = useState([]);   // List of musicians from the API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter state — what the user types into the search fields
  const [filters, setFilters] = useState({
    location: "",
    instrument: "",
    genre: "",
    experienceLevel: "",
  });

  // Fetch musicians when the page first loads (no filters)
  useEffect(() => {
    fetchMusicians();
  }, []);

  const fetchMusicians = async (activeFilters = {}) => {
    setLoading(true);
    setError("");
    try {
      // Build a query string from whichever filters have values
      // e.g. { location: "Nashville", instrument: "Guitar" } → "?location=Nashville&instrument=Guitar"
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await API.get(`/users/search?${params.toString()}`);
      setMusicians(data);
    } catch (err) {
      setError("Failed to load musicians. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMusicians(filters); // Search with current filter values
  };

  const handleReset = () => {
    setFilters({ location: "", instrument: "", genre: "", experienceLevel: "" });
    fetchMusicians(); // Reload all musicians with no filters
  };

  return (
    <div>
      <h1>Explore Musicians</h1>

      {/* SEARCH FILTERS FORM */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Nashville)"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="instrument"
          placeholder="Instrument (e.g. Guitar)"
          value={filters.instrument}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre (e.g. Rock)"
          value={filters.genre}
          onChange={handleFilterChange}
        />
        <select
          name="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleFilterChange}
        >
          <option value="">Any experience level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="professional">Professional</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      {/* RESULTS */}
      {loading && <p>Loading musicians...</p>}
      {error && <p>{error}</p>}
      {!loading && musicians.length === 0 && <p>No musicians found. Try different filters.</p>}

      {/* MUSICIAN CARDS GRID — style this grid however you want */}
      <div>
        {musicians.map((musician) => (
          <MusicianCard key={musician._id} user={musician} />
        ))}
      </div>
    </div>
  );
}
