import Link from "next/link";

export default function GigCard({ gig }) {
  return (
    <Link href={`/gigs/${gig._id}`}>
      <div>
        {/* Gig title and venue */}
        <h3>{gig.title}</h3>
        <p>{gig.venue}</p>
        <p>{gig.location}</p>

        {/* Date formatted nicely */}
        <p>{new Date(gig.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</p>

        {/* Pay */}
        <p>${gig.pay}</p>

        {/* Genre */}
        <p>{gig.genre}</p>

        {/* Instruments needed */}
        <div>
          {gig.instrumentsNeeded.map((inst) => (
            <span key={inst}>{inst}</span>
          ))}
        </div>

        {/* Status badge */}
        <span>{gig.status}</span>

        {/* Posted by */}
        {gig.postedBy && <p>Posted by {gig.postedBy.name}</p>}
      </div>
    </Link>
  );
}
