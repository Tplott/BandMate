import Link from "next/link";

export default function HomePage() {
  return (
    <div>

      {/* HERO SECTION — main headline and call to action buttons */}
      <section>
        <h1>Find Your Sound. Find Your People.</h1>
        <p>
          BandMate connects musicians with other musicians. Browse talent near you,
          share your clips, and book gigs — all in one place.
        </p>
        <Link href="/register">Get Started</Link>
        <Link href="/explore">Browse Musicians</Link>
      </section>

      {/* HOW IT WORKS SECTION — 3 feature highlights */}
      <section>
        <h2>How It Works</h2>
        <div>
          <div>
            <h3>Create Your Profile</h3>
            <p>List your instruments, genres, experience level, and upload videos of you playing.</p>
          </div>
          <div>
            <h3>Discover Musicians</h3>
            <p>Search by location, instrument, or genre. Find the perfect bandmate near you.</p>
          </div>
          <div>
            <h3>Book & Play Gigs</h3>
            <p>Venues post open gigs. Musicians apply. Get booked and get on stage.</p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION — second sign up prompt */}
      <section>
        <h2>Ready to find your bandmate?</h2>
        <p>Join thousands of musicians already on BandMate.</p>
        <Link href="/register">Sign Up Free</Link>
      </section>

    </div>
  );
}
