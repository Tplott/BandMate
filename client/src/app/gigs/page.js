"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import GigCard from "@/components/GigCard";

export default function GigsPage() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    instrument: "",
    genre: "",
  });

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (activeFilters = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await API.get(`/gigs?${params.toString()}`);
      setGigs(data);
    } catch (err) {
      setError("Failed to load gigs.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(filters);
  };

  const handleReset = () => {
    setFilters({ location: "", instrument: "", genre: "" });
    fetchGigs();
  };

  return (
    <div>
      <div>
        <h1>Gig Board</h1>
        {/* Only venues see the post gig button */}
        {user?.role === "venue" && (
          <Link href="/gigs/create">Post a Gig</Link>
        )}
      </div>

      {/* FILTERS */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="instrument"
          placeholder="Instrument needed"
          value={filters.instrument}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={filters.genre}
          onChange={handleFilterChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      {/* GIG LISTINGS */}
      {loading && <p>Loading gigs...</p>}
      {error && <p>{error}</p>}
      {!loading && gigs.length === 0 && <p>No open gigs found.</p>}

      <div>
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </div>
  );
}
