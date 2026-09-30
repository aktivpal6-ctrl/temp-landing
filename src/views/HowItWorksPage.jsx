import Link from "next/link";
import { ClipboardList, SlidersHorizontal, Sparkles } from "lucide-react";
import { TrailRail } from "@/components/TrailRail";
import {
  Callout,
  DocumentLayout,
  DocumentSection,
  FaqList,
  FinalCTA,
  Hero,
  PlanCard,
  SafetyChecklist,
  Timeline,
} from "@/components/marketing/Marketing";
import { HOW_IT_WORKS_FAQS } from "@/data/faq";

const SECTIONS = [
  { id: "movement", title: "What's a Movement?" },
  { id: "discover", title: "1. Discover" },
  { id: "join", title: "2. Join" },
  { id: "meetup", title: "3. Meet up" },
  { id: "move", title: "4. Move" },
  { id: "after", title: "After the Movement" },
  { id: "host", title: "Hosting" },
  { id: "safe", title: "Staying safe" },
  { id: "faq", title: "Questions" },
];
const FIELDS = [
  ["Title and description", "What the plan is and what to expect."],
  ["Location", "Where you're meeting and where you're headed."],
  ["Start time and duration", "When it starts and roughly how long it takes."],
  ["Difficulty", "Beginner, moderate or expert, set by the host."],
  ["Who's going", "How many people have joined and how many spots are left."],
];
const HOST_STEPS = [
  [
    ClipboardList,
    "The basics",
    "Title, description, location, start time, duration and group size.",
  ],
  [
    SlidersHorizontal,
    "About the activity",
    "Details that apply to any activity, like the difficulty and the experience you're looking for.",
  ],
  [
    Sparkles,
    "Made for your activity",
    "The questions change to fit what you pick, so a hike asks different things than a swim.",
  ],
];

export function HowItWorksPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="marketing-page apm-has-trail"
    >
      <TrailRail
        chapters={[
          { id: "chapter-01" },
          { id: "chapter-02" },
          { id: "chapter-03" },
          { id: "chapter-04" },
        ]}
      />
      <Hero
        compact
        actions
        description={
          "From \"we should do that sometime\" to a plan you actually go on. Here's the full journey, whether you're joining a Movement or hosting one."
        }
      >
        How AKTIVPAL works
      </Hero>
      <DocumentLayout sections={SECTIONS}>
        <DocumentSection id="movement" title="What's a Movement?">
          <p className="apm-lead">
            A Movement is a planned activity that anyone can join.
          </p>
          <p className="apm-body-p">
            A host picks an activity, a place and a time. People who want to
            come along join. It can be a Saturday morning hike, a trail run
            after work or a ski day, and it always has a plan attached, so
            "sometime" becomes "this weekend".
          </p>
          <ul className="apm-fields" aria-label="What every Movement shows">
            {FIELDS.map(([title, text]) => (
              <li key={title}>
                <b>{title}</b>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </DocumentSection>
        <DocumentSection id="discover" title="Discover" number={1} numeral="01">
          <p className="apm-lead">Find something worth doing near you.</p>
          <div className="apm-doc-cols apm-doc-cols--card">
            <div>
              <ul className="apm-bul apm-bul--flush">
                <li>
                  Browse upcoming Movements by <strong>activity</strong> and{" "}
                  <strong>location</strong>.
                </li>
                <li>
                  Read the title and description to see if the plan fits what
                  you want to do.
                </li>
                <li>
                  Check the <strong>difficulty</strong>, start time and duration
                  before you decide.
                </li>
                <li>
                  See how many people are going and how many spots are left.
                </li>
              </ul>
              <Callout>
                Every Movement has a difficulty level, so a beginner walk and an
                expert trail run never look the same.
              </Callout>
            </div>
            <div className="apm-mock">
              <PlanCard />
            </div>
          </div>
        </DocumentSection>
        <DocumentSection id="join" title="Join" number={2} numeral="02">
          <p className="apm-lead">
            Check the details, see who's going and say you're in.
          </p>
          <ul className="apm-bul">
            <li>
              <strong>Join instantly</strong> when the host allows it. You're on
              the list straight away.
            </li>
            <li>
              <strong>Request to join</strong> when the host wants to approve
              people first. You'll hear back before the day.
            </li>
            <li>
              Look at the host's profile and the other people going, so you know
              who you're meeting.
            </li>
          </ul>
          <Callout>
            You don't need to host anything to use AKTIVPAL. You can simply join
            Movements.
          </Callout>
        </DocumentSection>
        <DocumentSection id="meetup" title="Meet up" number={3} numeral="03">
          <p className="apm-lead">Confirm the plan before you go.</p>
          <ul className="apm-bul">
            <li>
              The meeting place, start time and difficulty are on the Movement,
              so everyone starts from the same plan.
            </li>
            <li>
              Choose a public meeting place, and tell someone where you're going
              and who with.
            </li>
            <li>Check the weather and pack for the conditions.</li>
          </ul>
          <Callout title="Coming next" tone="next">
            A chat for every Movement, so the group can talk through the plan
            and coordinate details before the day.
          </Callout>
        </DocumentSection>
        <DocumentSection id="move" title="Move" number={4} numeral="04">
          <p className="apm-lead">Show up, explore and enjoy it together.</p>
          <ul className="apm-bul">
            <li>
              Go at the pace and level the Movement describes, and look out for
              each other.
            </li>
            <li>
              Follow the community standards: be respectful, be on time and be
              honest about your experience.
            </li>
            <li>
              If something doesn't feel right, you can report it and step away.
            </li>
          </ul>
        </DocumentSection>
        <DocumentSection id="after" title="After the Movement">
          <p className="apm-lead">One Movement can lead to another.</p>
          <ul className="apm-bul">
            <li>
              Leave a review. Reviews and your activity history help other
              people decide who to move with.
            </li>
            <li>Find your next Movement, or create one of your own.</li>
          </ul>
          <Callout title="Coming next" tone="next">
            Message people you've met, start group conversations, and share
            photos and videos from your activities.
          </Callout>
        </DocumentSection>
        <DocumentSection id="host" title="Hosting a Movement">
          <p className="apm-lead">
            Have a plan in mind? Create a Movement and bring together people who
            want to join.
          </p>
          <Timeline steps={HOST_STEPS} />
          <Callout title="You stay in control">
            Choose whether people can join instantly or need your approval, and
            manage who's coming to your Movement.
          </Callout>
        </DocumentSection>
        <DocumentSection id="safe" title="Staying safe">
          <p className="apm-lead">
            Meeting new people takes trust, and AKTIVPAL is being designed with
            safety in mind.
          </p>
          <p className="apm-body-p">
            Profiles, activity history, reviews, community standards, and
            reporting and moderation tools all work together, so you can see who
            you're meeting and speak up when something isn't right.
          </p>
          <div className="apm-safe-box">
            <SafetyChecklist />
            <Link className="apm-text-link" href="/#trust">
              More on trust and safety
            </Link>
          </div>
        </DocumentSection>
        <DocumentSection id="faq" title="Questions">
          <FaqList questions={HOW_IT_WORKS_FAQS} />
        </DocumentSection>
      </DocumentLayout>
      <FinalCTA title="Ready to find your people?" />
    </main>
  );
}
