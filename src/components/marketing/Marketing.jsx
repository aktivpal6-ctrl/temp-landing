import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Mountain, Users } from "lucide-react";
import { IMAGES } from "@/data/survey";
import { ExampleJoin } from "./ExampleJoin";
import { ParallaxEffects } from "./ParallaxEffects";
import { MarketingMotion } from "./MarketingMotion";
import { Avatars } from "./Avatars";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Inset rounded hero card with copy on the left and, on the home page, a floating
// showcase of the example plan. backdrop="photo" layers a ridge photo (`photo`)
// under a forest overlay; backdrop="grid" is a photo-free gradient, grid and
// elevation line. `note` is the location pill (true for the default wording) and
// `breadcrumb` the page path to show a breadcrumb trail for, or { path, current }
// for a page nested under it.
export function Hero({ children, description, compact = false, actions = false, note = false, wide = false, showcase = false, backdrop = "photo", photo = IMAGES.hero, breadcrumb = null, testId }) {
  return (
    <section className={`apm-hero apm-hero--${backdrop}${compact ? " apm-hero--compact" : ""}`} id="hero" data-testid={testId} aria-labelledby="hero-title">
      {/* Every marketing page has one Hero, so it also mounts the page's motion. */}
      <MarketingMotion />
      <ParallaxEffects />
      {backdrop === "grid" ? <GridBackdrop /> : <>
        <div className="apm-hero-photo" data-parallax="0.14">
          <Image src={photo} alt="Hikers moving along a mountain ridge trail" fill sizes="(min-width: 1424px) 1280px, 100vw" preload />
        </div>
        <svg className="apm-hero-ridge" data-parallax="0.3" data-parallax-limit="110" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d={PHOTO_RIDGE_PATH} />
        </svg>
      </>}
      <div className="apm-hero-grid">
        <div className="apm-hero-inner" data-parallax="0.35" data-parallax-mode="exit" data-parallax-fade>
          {breadcrumb && <Breadcrumbs {...(typeof breadcrumb === "string" ? { path: breadcrumb } : breadcrumb)} className="apm-hero-crumbs" />}
          {note && <p className="apm-hero-note"><MapPin size={14} aria-hidden="true" />{note === true ? "Starting in British Columbia, Canada." : note}</p>}
          <h1 id="hero-title" className={wide ? "apm-title-wide" : undefined}>{children}</h1>
          <p className="apm-hero-sub">{description}</p>
          {actions && <div className="apm-hero-actions">
            <JoinLink />
            <Link className="apm-btn apm-btn--ghost" href="/movement">Explore Movements</Link>
          </div>}
        </div>
        {showcase && <HeroShowcase />}
      </div>
    </section>
  );
}

// Catmull-Rom curve through the points as cubic Béziers, so ridges read as
// rolling terrain rather than a price chart.
function smoothPath(points) {
  const round = (n) => Math.round(n * 10) / 10;
  return points.reduce((d, [x, y], i) => {
    if (!i) return `M${x} ${y}`;
    const [x0, y0] = points[i - 2] || points[i - 1];
    const [x1, y1] = points[i - 1];
    const [x3, y3] = points[i + 1] || [x, y];
    return `${d} C${round(x1 + (x - x0) / 6)} ${round(y1 + (y - y0) / 6)} ${round(x - (x3 - x1) / 6)} ${round(y - (y3 - y1) / 6)} ${x} ${y}`;
  }, "");
}

const PHOTO_RIDGE_PATH = smoothPath([[0, 150], [240, 96], [420, 122], [640, 58], [860, 118], [1080, 72], [1280, 112], [1440, 88]]);

// Home backdrop landscape in a 1440x320 box: a faint far range behind the lit
// near ridge, with two hikers heading up to the summit flag.
const FAR_RANGE = [[0, 236], [150, 190], [300, 140], [450, 170], [610, 96], [740, 128], [900, 52], [1040, 108], [1180, 78], [1320, 128], [1440, 96]];
const RIDGE = [[0, 290], [170, 262], [330, 226], [480, 184], [620, 150], [780, 96], [920, 132], [1060, 152], [1210, 120], [1340, 164], [1440, 150]];
const FAR_RANGE_PATH = smoothPath(FAR_RANGE);
const RIDGE_PATH = smoothPath(RIDGE);
const SUMMIT = RIDGE[5];
// Points on RIDGE, so their feet sit on the line; the lead hiker carries the orange pack.
const HIKERS = [[...RIDGE[3], "mint"], [...RIDGE[4], "orange"]];
const onRidge = ([x, y]) => ({ left: `${(x / 1440) * 100}%`, top: `${(y / 320) * 100}%` });

// Trail-sign style hiker walking right with a pole, leaning into the climb.
function Hiker({ pack }) {
  return (
    <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 27 L12.5 36.5 L8.5 45.5 L11 46.5 M16.5 27 L20 36.5 L22.5 46.5 L25.5 46.5" strokeWidth="4" />
      <g transform="rotate(9 16 27)">
        <rect className={`apm-hiker-pack apm-hiker-pack--${pack}`} x="7" y="11" width="8" height="14" rx="3" stroke="none" />
        <path d="M17 13 L16 26" strokeWidth="6.5" />
        <path d="M18 14.5 L21.5 20.5 L25 22" strokeWidth="3" />
        <circle cx="18.5" cy="5.5" r="4" fill="currentColor" stroke="none" />
      </g>
      <path d="M25.5 21 L28.5 46.5" strokeWidth="1.6" />
    </svg>
  );
}

// Photo-free hero backdrop: brand glows, a fine grid that fades at the edges,
// orbit rings behind the showcase and the mountain landscape with its hikers.
function GridBackdrop() {
  return (
    <div className="apm-backdrop" aria-hidden="true">
      <div className="apm-backdrop-grid" />
      <div className="apm-backdrop-rings" data-parallax="-0.06" data-parallax-limit="40"><span /><span /><span /></div>
      <div className="apm-elevation" data-parallax="0.2" data-parallax-limit="80">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="apm-elev-stroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#86D6A8" stopOpacity="0" />
              <stop offset="0.3" stopColor="#86D6A8" stopOpacity="0.8" />
              <stop offset="0.62" stopColor="#FF8A4C" />
              <stop offset="1" stopColor="#FF5C00" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="apm-elev-far" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#86D6A8" stopOpacity="0.1" />
              <stop offset="1" stopColor="#86D6A8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="apm-elev-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#123A28" />
              <stop offset="1" stopColor="#081A12" />
            </linearGradient>
          </defs>
          <path className="apm-elev-far" d={`${FAR_RANGE_PATH} L1440 320 L0 320 Z`} fill="url(#apm-elev-far)" />
          <path className="apm-elev-area" d={`${RIDGE_PATH} L1440 320 L0 320 Z`} fill="url(#apm-elev-fill)" />
          <path className="apm-elev-line" d={RIDGE_PATH} pathLength="1" stroke="url(#apm-elev-stroke)" />
        </svg>
        <span className="apm-summit" style={onRidge(SUMMIT)}>
          <svg viewBox="0 0 20 32"><path d="M4 31 V2" stroke="#F7F7F2" strokeWidth="1.6" strokeLinecap="round" /><path d="M4.8 3 L17 7.5 L4.8 12 Z" fill="#FF5C00" /></svg>
        </span>
        {HIKERS.map(([x, y, pack], index) => <span key={x} className="apm-hiker" style={{ ...onRidge([x, y]), "--i": index }}><Hiker pack={pack} /></span>)}
      </div>
    </div>
  );
}

// Decorative preview built only from the example plan shown further down the page,
// so it is hidden from assistive technology to avoid announcing it twice.
function HeroShowcase() {
  return (
    <div className="apm-showcase" aria-hidden="true">
      <div className="apm-float apm-float--chip apm-float--top" data-parallax="0.08" data-parallax-limit="36">
        <span className="apm-tile apm-tile--mint"><Mountain size={18} /></span>
        <span><b>Hiking</b><small>Walking · Trail running</small></span>
      </div>
      <div className="apm-float apm-float--plan" data-parallax="-0.05" data-parallax-limit="36">
        <span className="apm-mini-badge">Example plan</span>
        <b className="apm-mini-title">Grouse Grind</b>
        <span className="apm-mini-meta"><Clock size={15} />Saturday, 8:00 AM</span>
        <span className="apm-mini-meta"><MapPin size={15} />Vancouver</span>
        <span className="apm-mini-foot"><Avatars count={3} /><span>3 interested</span><span className="apm-mini-btn">I&apos;m in</span></span>
      </div>
      <div className="apm-float apm-float--chip apm-float--low" data-parallax="0.12" data-parallax-limit="36">
        <span className="apm-tile apm-tile--peach"><Users size={18} /></span>
        <span><b>Looking for 2 to 3 people</b><small>similar pace</small></span>
      </div>
    </div>
  );
}

export function JoinLink() {
  return <Link className="apm-btn apm-btn--primary" href="/waitlist">Join early access<ArrowRight size={18} aria-hidden="true" /></Link>;
}

// Vertical step timeline: numbered nodes on a line that fills as you scroll, with
// the step cards alternating sides once the timeline is wide enough (see "Steps"
// in marketing.css). `steps` is a list of [Icon, title, text].
export function Timeline({ steps }) {
  return (
    <div className="apm-timeline">
      <span className="apm-steps-track" aria-hidden="true"><span className="apm-steps-fill" /></span>
      <ol className="apm-steps">
        {steps.map(([Icon, title, text], index) => <li key={title}>
          <span className="apm-step-node" aria-hidden="true">{index + 1}</span>
          <div className="apm-step-card">
            <span className="apm-feat-icon"><Icon size={20} aria-hidden="true" /></span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </div>
        </li>)}
      </ol>
    </div>
  );
}

// The last block on a marketing page. When it ends the page, CSS fuses it with the
// shared site footer into one panel (see "Closing panel" in marketing.css).
export function FinalCTA({ title = "Movement is better together." }) {
  return (
    <section className="apm-cta" data-testid="final-cta" aria-labelledby="cta-title">
      <div className="apm-sun" aria-hidden="true" data-parallax="0.18" data-parallax-limit="90" />
      <div className="apm-wrap apm-cta-inner">
        <div className="apm-cta-copy">
          <h2 id="cta-title">{title}</h2>
          <p>Join early access and be among the first to discover, create and join Movements in British Columbia.</p>
        </div>
        <div className="apm-cta-action"><JoinLink /></div>
      </div>
    </section>
  );
}

export function PlanCard({ interactive = false }) {
  const details = [
    { Icon: Mountain, label: interactive ? "Moderate to hard" : "Difficulty: moderate" },
    { Icon: Clock, label: interactive ? "Saturday, 8:00 AM" : "Saturday, 8:00 AM, about 2 hours" },
    { Icon: MapPin, label: "Vancouver" },
  ];
  if (interactive) details.push({ Icon: Users, label: "Looking for 2 to 3 people, similar pace" });
  return (
    <article className="apm-plan-card" aria-label={interactive ? "Example plan: Grouse Grind" : "Example Movement"} data-tilt={interactive || undefined}>
      <div className="apm-plan-photo">
        <div className="apm-parallax-img" data-parallax="-0.1">
          <Image src={IMAGES.hike} alt="Steep forest hiking trail for a Grouse Grind plan" fill sizes="(min-width: 960px) 440px, (min-width: 760px) 40vw, 100vw" />
        </div>
        <span className="apm-badge">{interactive ? "Example plan" : "Example Movement"}</span>
      </div>
      <div className="apm-plan-content">
        <h3>Grouse Grind</h3>
        <ul className="apm-plan-meta">
          {details.map(({ Icon, label }) => <li key={label}><span className="apm-meta-icon"><Icon size={16} aria-hidden="true" /></span>{label}</li>)}
        </ul>
        {interactive ? <ExampleJoin /> : <div className="apm-plan-foot">
          <div className="apm-interest"><Avatars count={3} /><span className="apm-spots">3 going, 1 spot left</span></div>
          <span className="apm-btn apm-btn--join" aria-hidden="true">Join</span>
        </div>}
      </div>
    </article>
  );
}

const SAFETY_CHECKS = [
  "Read the activity details and choose one that suits your experience and fitness.",
  "Choose a public meeting place.",
  "Tell someone your plans.",
  "Check the weather and bring the right equipment.",
];

export function SafetyChecklist() {
  return <ul className="apm-checks">{SAFETY_CHECKS.map((text) => <li key={text}><span className="apm-check"><Check size={14} strokeWidth={3} aria-hidden="true" /></span>{text}</li>)}</ul>;
}

export function FaqList({ questions }) {
  return <div className="apm-faq">{questions.map(({ question, answer }) => (
    <details key={question}>
      <summary>{question}</summary>
      <p className="apm-answer">{answer}</p>
    </details>
  ))}</div>;
}

export function DocumentLayout({ sections, children }) {
  return <div className="apm-wrap apm-doc">
    <nav className="apm-toc" aria-label="On this page">
      <h2>On this page</h2>
      <ul>{sections.map(({ id, title }) => <li key={id}><Link href={`#${id}`}>{title}</Link></li>)}</ul>
    </nav>
    <div className="apm-doc-main">{children}</div>
  </div>;
}

// Oversized outline numeral in the Our Story chapter style; sides alternate by number.
export function BackgroundNumeral({ value }) {
  return <span className={`apm-bg-num-clip apm-bg-num-clip--${Number(value) % 2 ? "right" : "left"}`} aria-hidden="true">
    <span className="apm-bg-num" data-parallax="0.22" data-parallax-limit="40">{value}</span>
  </span>;
}

export function DocumentSection({ id, title, number = null, numeral = null, children }) {
  // Numbered sections are trail chapters, named like the Our Story chapters (chapter-01, …).
  return <section className="apm-doc-sec" id={id} data-testid={numeral ? `chapter-${numeral}` : id} aria-labelledby={`${id}-title`}>
    {numeral && <BackgroundNumeral value={numeral} />}
    <h2 id={`${id}-title`}>{number && <span className="apm-num" aria-hidden="true">{number}</span>}{title}</h2>
    {children}
  </section>;
}

// "next" marks features that are not built yet (peach), everything else is guidance (mint).
export function Callout({ title = "Good to know", tone = "info", children }) {
  return <div className={`apm-callout apm-callout--${tone}`}><strong>{title}</strong>{children}</div>;
}
