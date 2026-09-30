// AKTIVPAL logo mark — mountain peak + sun, dark green & orange
export const Logo = ({ size = 40, showWord = false, light = false }) => (
  <div className="flex items-center gap-2.5" data-testid="ap-logo">
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="AKTIVPAL" role="img">
      <circle cx="50" cy="24" r="11" fill="#FF5C00" />
      <path
        d="M50 30 L82 76 a4 4 0 0 1 -3.4 6 H63 L52 63 a2.4 2.4 0 0 0 -4 0 L37 82 H21.4 a4 4 0 0 1 -3.4 -6 Z"
        fill={light ? "#F7F7F2" : "#0F291E"}
      />
    </svg>
    {showWord && (
      <span
        className={`font-display font-extrabold tracking-tight text-xl ${light ? "text-[#F7F7F2]" : "text-[#0F291E]"}`}
      >
        AKTIVPAL
      </span>
    )}
  </div>
);

