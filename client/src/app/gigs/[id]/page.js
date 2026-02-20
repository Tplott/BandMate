"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

export default function GigDetailPage({ params }) {
  const { id } = params;
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application form state
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await API.get(`/gigs/${id}`);
        setGig(data);

        // If the logged-in user is the gig poster, also fetch the applications
        if (user && data.postedBy._id === user._id) {
          const appRes = await API.get(`/gigs/${id}/applications`);
          setApplications(appRes.data);
        }
      } catch (err) {
        setError("Failed to load gig.");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post(`/gigs/${id}/apply`, { message: applyMessage });
      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      const { data } = await API.put(`/gigs/${id}/applications/${appId}`, { status });
      // Update the application in state
      setApplications(applications.map((a) => (a._id === appId ? data : a)));
    } catch (err) {
      setError("Failed to update application.");
    }
  };

  if (loading) return <p>Loading gig...</p>;
  if (error) return <p>{error}</p>;
  if (!gig) return null;

  const isOwner = user?._id === gig.postedBy._id;
  const isMusician = user?.role === "musician";

  return (
    <div>

      {/* GIG DETAILS */}
      <div>
        <h1>{gig.title}</h1>
        <p>{gig.venue}</p>
        <p>{gig.location}</p>
        <p>{new Date(gig.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        <p>${gig.pay}</p>
        <p>{gig.genre}</p>
        <p>{gig.description}</p>

        <div>
          <h3>Instruments Needed</h3>
          {gig.instrumentsNeeded.map((inst) => (
            <span key={inst}>{inst}</span>
          ))}
        </div>

        <p>Status: {gig.status}</p>
        <p>Posted by: {gig.postedBy.name}</p>
      </div>

      {/* APPLY SECTION — only shown to logged-in musicians who haven't applied yet */}
      {user && isMusician && !isOwner && gig.status === "open" && (
        <div>
          <h2>Apply for this Gig</h2>
          {applied ? (
            <p>Application sent! The venue will be in touch.</p>
          ) : (
            <form onSubmit={handleApply}>
              <textarea
                placeholder="Tell the venue why you'd be great for this gig..."
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
              />
              <button type="submit" disabled={applying}>
                {applying ? "Sending..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* APPLICATIONS SECTION — only shown to the gig owner */}
      {isOwner && (
        <div>
          <h2>Applications ({applications.length})</h2>
          {applications.length === 0 && <p>No applications yet.</p>}
          {applications.map((app) => (
            <div key={app._id}>
              <img src={app.applicant.profilePic || "/default-avatar.png"} alt={app.applicant.name} />
              <h4>{app.applicant.name}</h4>
              <p>{app.applicant.location}</p>
              <p>Experience: {app.applicant.experienceLevel}</p>
              <div>
                {app.applicant.instruments.map((i) => <span key={i}>{i}</span>)}
              </div>
              <p>{app.message}</p>
              <p>Status: {app.status}</p>

              {/* Accept/Reject buttons — only if still pending */}
              {app.status === "pending" && (
                <div>
                  <button onClick={() => handleUpdateStatus(app._id, "accepted")}>Accept</button>
                  <button onClick={() => handleUpdateStatus(app._id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
