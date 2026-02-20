import Link from "next/link";

// Receives a single user object and renders a card for them
// Used on the Explore page to show search results
export default function MusicianCard({ user }) {
  return (
    <Link href={`/profile/${user._id}`}>
      <div>
        {/* Profile picture */}
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt={user.name}
        />

        {/* Name and location */}
        <h3>{user.name}</h3>
        <p>{user.location || "Location not set"}</p>

        {/* Experience level */}
        <p>{user.experienceLevel}</p>

        {/* Instruments list */}
        <div>
          {user.instruments.map((inst) => (
            <span key={inst}>{inst}</span>
          ))}
        </div>

        {/* Genres list */}
        <div>
          {user.genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>

        {/* What they're looking for */}
        <div>
          {user.lookingFor.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
