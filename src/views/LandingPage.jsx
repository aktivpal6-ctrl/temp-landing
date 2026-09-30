import Image from "next/image";
import Link from "next/link";
import {
  Camera, CirclePlus, Compass, Flag, Footprints, History, MapPin, MessagesSquare, Mountain,
  Route, Sailboat, ScrollText, Send, ShieldCheck, Snowflake, Star, UserPlus, UserRound, Users, Waves,
} from "lucide-react";
import { IMAGES } from "@/data/survey";
import { TrailRail } from "@/components/TrailRail";
import { BackgroundNumeral, FinalCTA, Hero, PlanCard, SafetyChecklist, Timeline } from "@/components/marketing/Marketing";
import { HomeEffects } from "@/components/marketing/HomeEffects";

const ACTIVITIES = [
  [Mountain, "Hiking"], [Footprints, "Walking"], [Route, "Trail running"],
  [Snowflake, "Skiing"], [Sailboat, "Kayaking"], [Waves, "Swimming"],
];
const STEPS = [
  [Compass, "Discover", "Browse upcoming Movements by activity and location."],
  [UserPlus, "Join", "Check the details, see who's going, and request to join or join instantly when the host allows it."],
  [MapPin, "Meet up", "Confirm the plan and coordinate with the group."],
  [Mountain, "Move", "Show up, explore and enjoy it together."],
];
const FEATURES = [
  { title: "At launch", items: [
    [Compass, "Discover Movements", "Browse activities near you by interest, location, schedule and experience level."],
    [CirclePlus, "Create your own", "Set the details and bring together people who want to join."],
    [Users, "Find the right people", "Profiles, shared interests and activity history help you decide who to move with."],
  ] },
  { title: "Coming next", items: [
    [MessagesSquare, "Connect before you go", "A chat for every Movement to coordinate the plan."],
    [Send, "Stay connected", "Message people you've met and keep in touch after the activity."],
    [Camera, "Share the experience", "Post photos and videos from your Movements."],
  ] },
];
const TRUST = [
  [UserRound, "Profiles", "Learn more about the people you're planning to meet."],
  [History, "Activity history", "Build a reputation through taking part in the community."],
  [Star, "Reviews", "Learn from other people's experiences with a host or group."],
  [ScrollText, "Community standards", "Clear expectations that encourage respectful behaviour."],
  [Flag, "Reporting and moderation", "Tools to report inappropriate behaviour and protect the community."],
];
// Trail waypoints mark the numbered chapters (01–05), as on Our Story.
const TRAIL_CHAPTERS = [
  { id: "chapter-01" },
  { id: "chapter-02" },
  { id: "chapter-03" },
  { id: "chapter-04" },
  { id: "chapter-05" },
];

export const LandingPage = () => (
  <main id="main-content" tabIndex={-1} className="marketing-page apm-home apm-has-trail" data-testid="landing-page">
    <HomeEffects />
    <TrailRail chapters={TRAIL_CHAPTERS} />
    <Hero actions note showcase backdrop="grid" description="AKTIVPAL helps you find people for outdoor activities near you, from hikes and trail runs to ski days and kayaking. Join a Movement (a planned activity anyone can join) or create your own.">
      <span>Find your people.</span><span>Make a plan.</span><span>Get moving.</span>
    </Hero>

    <section className="apm-section" id="activities" data-testid="chapter-01" aria-labelledby="activities-title">
      <BackgroundNumeral value="01" />
      <div className="apm-wrap apm-split">
        <div>
          <h2 id="activities-title">Find people for outdoor activities near you.</h2>
          <p className="apm-lead">Your plans shouldn't depend on whether your friends are free. Find people who share your activities, match the experience you want, and turn "we should" into a plan.</p>
        </div>
        <div>
          <ul className="apm-chips" aria-label="Activities">
            {ACTIVITIES.map(([Icon, activity]) => <li key={activity}><span className="apm-chip-icon"><Icon size={16} aria-hidden="true" /></span>{activity}</li>)}
          </ul>
          <p className="apm-chips-note">Some days it's a morning walk. Other days it's a trail run, a ski day or a paddle. One community means you don't need a new group every time you try something new.</p>
          <Link className="apm-text-link" href="/about">Read our story</Link>
        </div>
      </div>
    </section>

    <section className="apm-section" id="how" data-testid="chapter-02" aria-labelledby="how-title">
      <BackgroundNumeral value="02" />
      <div className="apm-wrap">
        <div className="apm-journey">
          <h2 id="how-title">From idea to actual plan.</h2>
          <Timeline steps={STEPS} />
        </div>
        <div className="apm-features">
          <h2>Everything you need to get moving together.</h2>
          {FEATURES.map(({ title, items }, index) => <div className={`apm-feat-group${index ? " apm-feat-group--next" : ""}`} key={title}>
            <h3 className="apm-group-title">{title}</h3>
            <ul className="apm-feat-list">{items.map(([Icon, name, text]) => <li key={name}>
              <span className="apm-feat-icon"><Icon size={20} aria-hidden="true" /></span>
              <h4>{name}</h4><p>{text}</p>
            </li>)}</ul>
          </div>)}
        </div>
      </div>
    </section>

    <section className="apm-section apm-section--panel" id="sometime" data-testid="chapter-03" aria-labelledby="sometime-title">
      <div className="apm-panel">
        <BackgroundNumeral value="03" />
        <div className="apm-wrap apm-panel-inner apm-split">
          <div>
            <h2 id="sometime-title" className="apm-quote-h">&ldquo;We should do that sometime.&rdquo;</h2>
            <p className="apm-lead">But &ldquo;sometime&rdquo; rarely makes it onto the calendar. AKTIVPAL helps you find people who want to do the same things you do, so you can make a plan and actually go.</p>
          </div>
          <div className="apm-plan-wrap">
            <PlanCard interactive />
            <p className="apm-plan-caption">Try it. Real Movements will appear here at launch.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="apm-section" id="community" data-testid="chapter-04" aria-labelledby="community-title">
      <BackgroundNumeral value="04" />
      <div className="apm-wrap apm-community">
        <div>
          <h2 id="community-title">Built around community, not matching.</h2>
          <p className="apm-lead">AKTIVPAL isn't a dating app, and it isn't a feed built to keep you scrolling. It's built to turn shared interests into things you actually do.</p>
          <ul className="apm-pills" aria-label="What you can do">
            {["Meet people", "Discover places", "Try something new", "Build friendships", "Create memories"].map((text) => <li key={text}>{text}</li>)}
          </ul>
        </div>
        <div>
          <div className="apm-community-photo">
            <div className="apm-parallax-img" data-parallax="-0.1">
              <Image src={IMAGES.ski} alt="Rocky alpine trail overlooking snow-capped mountain peaks" fill sizes="(min-width: 1160px) 480px, (min-width: 900px) 42vw, calc(100vw - 64px)" />
            </div>
          </div>
          <blockquote className="apm-pull">
            <p>The best part of an adventure is who you share it with.</p>
            <p className="apm-muted">One Movement can lead to another, and the people you meet become the people you call next time.</p>
          </blockquote>
        </div>
      </div>
    </section>

    <section className="apm-section" id="trust" data-testid="chapter-05" aria-labelledby="trust-title">
      <BackgroundNumeral value="05" />
      <div className="apm-wrap">
        <h2 id="trust-title">Know who you're moving with.</h2>
        <p className="apm-lead apm-muted">Meeting new people takes trust, so AKTIVPAL is being designed with safety in mind.</p>
        <ul className="apm-trust-list">{TRUST.map(([Icon, title, text]) => <li key={title}>
          <span className="apm-feat-icon"><Icon size={20} aria-hidden="true" /></span><h3>{title}</h3><p>{text}</p>
        </li>)}</ul>
        <div className="apm-safety">
          <span className="apm-feat-icon apm-feat-icon--dark" aria-hidden="true"><ShieldCheck size={20} /></span>
          <h3>Before you meet up</h3>
          <SafetyChecklist />
        </div>
      </div>
    </section>

    <section className="apm-section apm-ack" aria-labelledby="ack-title">
      <div className="apm-wrap apm-ack-inner">
        <h2 id="ack-title">Territorial acknowledgement</h2>
        <p>AKTIVPAL is based in Vancouver, British Columbia, on the unceded traditional territories of the <strong>xʷməθkʷəy̓əm (Musqueam), Sḵwx̱wú7mesh (Squamish), and səlilwətaɬ (Tsleil-Waututh) Nations</strong>.</p>
        <p>We acknowledge the enduring relationship these Nations have with these lands and waters, and we are grateful for the opportunity to live, work, move, and connect with others here.</p>
      </div>
    </section>
    <FinalCTA />
  </main>
);
