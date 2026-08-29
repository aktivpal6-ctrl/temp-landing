export const Numeral = ({ value, dark = false, className = "" }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute select-none font-display text-[9rem] font-black leading-none tracking-tighter md:text-[15rem] ${
      dark ? "text-stroke-light" : "text-stroke-dark"
    } ${className}`}
  >
    {value}
  </span>
);
