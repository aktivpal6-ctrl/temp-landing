import Image from "next/image";
import { TrailRail } from "@/components/TrailRail";
import { BackgroundNumeral, FinalCTA, Hero } from "@/components/marketing/Marketing";

const PHOTOS = {
  hero: "/images/about/photo-1551632811-561732d1e306.jpeg",
  peaks: "/images/about/photo-1519681393784-d120267933ba.jpeg",
  ride: "/images/about/photo-1541625602330-2277a4c46182.jpeg",
};

function StoryPhoto({ src, alt, label, portrait = false }) {
  return (
    <figure className={`apm-story-photo${portrait ? " apm-story-photo--portrait" : ""}`}>
      <div className="apm-parallax-img" data-parallax="-0.1">
        <Image src={src} alt={alt} fill sizes="(min-width: 1160px) 540px, (min-width: 900px) 46vw, calc(100vw - 40px)" />
      </div>
      <figcaption className="apm-story-tag">{label}</figcaption>
    </figure>
  );
}

// Our Story in four chapters on the shared marketing layout: inset photo hero,
// numbered sections on the chapter trail, the Mission in a forest panel, and the
// closing call to action that joins the site footer. Photos sit on the left so the
// odd chapter numerals (right side) stay visible beside the text.
export const AboutPage = () => (
  <main id="main-content" tabIndex={-1} className="marketing-page apm-story apm-has-trail">
    <TrailRail chapters={[{ id: "chapter-01" }, { id: "chapter-02" }, { id: "chapter-03" }, { id: "chapter-04" }]} />
    <Hero compact testId="about-hero" photo={PHOTOS.hero} breadcrumb="/about" note="Starting in British Columbia" description="I wish I had someone to share this with.">
      <span>It started with</span><span>a simple feeling.</span>
    </Hero>

    <section className="apm-section" data-testid="chapter-01" aria-labelledby="beginning-title">
      <BackgroundNumeral value="01" />
      <div className="apm-wrap apm-split apm-split--media-left">
        <div>
          <p className="apm-eyebrow">Chapter 01 — The Beginning</p>
          <h2 id="beginning-title">Why we built AKTIVPAL</h2>
          <p className="apm-lead apm-story-strong">
            Five years ago, I moved to BC, Canada. I came with a love for adventure and a curiosity to explore
            everything this beautiful part of the world had to offer.
          </p>
          <p className="apm-body-p">
            Over the years, I travelled solo along much of the Pacific Coast — from Alaska to Mexico — exploring
            mountains, trails, coastlines and countless places across BC and the western United States.
          </p>
          <p className="apm-body-p">
            I loved the freedom of going wherever I wanted and discovering places on my own. But there was always
            one thing I wished I had: someone to share it with. Someone to join me for a morning run. Someone who
            was up for a weekend hike.
          </p>
          <p className="apm-story-line">Someone who would say, <span className="apm-accent">&ldquo;Let&rsquo;s go.&rdquo;</span></p>
        </div>
        <StoryPhoto portrait src={PHOTOS.peaks} alt="A lone traveller beneath snowy mountain peaks under a night sky" label="Pacific Coast — Alaska to Mexico" />
      </div>
    </section>

    <section className="apm-section" data-testid="chapter-02" aria-labelledby="problem-title">
      <BackgroundNumeral value="02" />
      <div className="apm-wrap">
        <div className="apm-story-col">
          <p className="apm-eyebrow">Chapter 02 — The Problem</p>
          <h2 id="problem-title">Making friends as an adult is hard.</h2>
          <p className="apm-lead">
            Friends have their own lives. They&rsquo;re busy, unavailable, or simply don&rsquo;t share the same
            interests. And I realized something: making meaningful friendships as an adult is hard — especially when
            you&rsquo;re new to a place.
          </p>
          <p className="apm-body-p">
            I looked everywhere. Facebook groups, communities, social platforms and different apps helped me find
            people or information, but everything felt scattered.
          </p>
          <blockquote className="apm-pull apm-story-quote">
            <p>I didn&rsquo;t need another place to scroll. <span className="apm-accent">I needed a place to go.</span></p>
          </blockquote>
        </div>
      </div>
    </section>

    <section className="apm-section" data-testid="chapter-03" aria-labelledby="idea-title">
      <BackgroundNumeral value="03" />
      <div className="apm-wrap apm-split apm-split--media-left">
        <div>
          <p className="apm-eyebrow">Chapter 03 — The Idea</p>
          <h2 id="idea-title">What if finding someone was as easy as finding the thing itself?</h2>
          <p className="apm-lead apm-story-strong">That&rsquo;s where AKTIVPAL began.</p>
          <p className="apm-body-p">
            But the more I thought about it, the more I realized this wasn&rsquo;t just my problem. People move to
            new cities. Friends get busy. Interests don&rsquo;t always align. Travellers arrive somewhere knowing
            nobody. And sometimes, you simply want someone who&rsquo;s up for the same adventure.
          </p>
          <blockquote className="apm-pull apm-story-quote">
            <p>We all have things we want to do. Sometimes, we just don&rsquo;t have someone to do them with.</p>
          </blockquote>
        </div>
        <StoryPhoto src={PHOTOS.ride} alt="Cyclists riding together outdoors" label="Try something new" />
      </div>
    </section>

    <section className="apm-section apm-section--panel" data-testid="chapter-04" aria-labelledby="mission-title">
      <div className="apm-panel">
        <BackgroundNumeral value="04" />
        <div className="apm-wrap apm-panel-inner">
          <div className="apm-story-col">
            <p className="apm-eyebrow">Chapter 04 — The Mission</p>
            <h2 id="mission-title">AKTIVPAL exists to change that.</h2>
            <p className="apm-lead">
              We&rsquo;re building a place where you can find the right people to move, explore, play and experience
              more with — whether you&rsquo;re new to a city, travelling somewhere new, or simply looking for someone
              who&rsquo;s up for it.
            </p>
            <div className="apm-story-statement">
              <p>Because some of the best experiences are better shared.</p>
              <p className="apm-accent">And some of your best people are still strangers.</p>
            </div>
            <p className="apm-story-pill">From &ldquo;we should&rdquo; to &ldquo;let&rsquo;s go.&rdquo;</p>
          </div>
        </div>
      </div>
    </section>

    <FinalCTA />
  </main>
);
