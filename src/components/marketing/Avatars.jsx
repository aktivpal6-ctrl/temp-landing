// Decorative stack of placeholder avatars for the example plan cards.
export function Avatars({ count, you = false }) {
  return (
    <span className="apm-avatars" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <span key={index} />)}
      {you && <span className="apm-avatar-you" />}
    </span>
  );
}
