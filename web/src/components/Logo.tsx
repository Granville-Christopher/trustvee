type LogoProps = {
  className?: string;
  variant?: "full" | "mark";
  title?: string;
};

/** Trustvee Elite brand mark + wordmark */
export default function Logo({
  className = "",
  variant = "full",
  title = "Trustvee Elite",
}: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        className={className}
        width="36"
        height="36"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <MarkArtwork />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="172"
      height="36"
      viewBox="0 0 172 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g transform="translate(0 0) scale(0.5625)">
        <MarkArtwork />
      </g>
      <text
        x="44"
        y="15"
        fill="#0B3D2E"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="-0.045em"
      >
        Trustvee
      </text>
      <path d="M44 19h58" stroke="#0B3D2E" strokeOpacity="0.16" strokeWidth="1" />
      <text
        x="44"
        y="30.5"
        fill="#7A5630"
        fontFamily="Syne, sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="0.22em"
      >
        ELITE
      </text>
    </svg>
  );
}

function MarkArtwork() {
  return (
    <>
      {/* Crest */}
      <rect width="64" height="64" rx="16" fill="#0B3D2E" />
      <circle cx="48" cy="14" r="18" fill="#1A5C45" opacity="0.45" />

      {/* Elite crown peak */}
      <path d="M32 8.5L40 19.5H24L32 8.5Z" fill="#C4A574" />
      <circle cx="32" cy="8.5" r="2.2" fill="#F2E8D5" />

      {/* Monogram: T */}
      <path
        d="M18 23h28v5.2H36.6V50h-9.2V28.2H18V23z"
        fill="#F2E8D5"
      />

      {/* Ascending V / trust chevron */}
      <path
        d="M16 52.5L32 34l16 18.5h-6.2L32 41.2 22.2 52.5H16z"
        fill="#C4A574"
      />
    </>
  );
}
