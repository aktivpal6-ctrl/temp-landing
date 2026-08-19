// Static content + full survey definition for AKTIVPAL

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1786263503168-28dc7767d7a3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  hike: "https://images.unsplash.com/photo-1725078849783-81d0baab71e4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  run: "https://images.unsplash.com/photo-1785418169168-23de800ab1bd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  climb: "https://images.unsplash.com/photo-1727558729775-83c4ab8d55a8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  bike: "https://images.unsplash.com/photo-1627044185459-09e6dbc39444?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  ski: "https://images.pexels.com/photos/15602865/pexels-photo-15602865.jpeg?auto=compress&cs=tinysrgb&w=1200",
  canada: "https://images.pexels.com/photos/8561213/pexels-photo-8561213.jpeg?auto=compress&cs=tinysrgb&w=1400",
  activitiesBg: "https://images.unsplash.com/photo-1566353820666-883ec100f41b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
};

export const MATCH_CRITERIA = [
  { icon: "Compass", title: "Activity", body: "Hiking, running, cycling, climbing, skiing, snowboarding, tennis, pickleball, swimming, kayaking, gym, yoga and more." },
  { icon: "Gauge", title: "Fitness & Skill", body: "Beginner. Intermediate. Advanced. Match your pace—not someone else's." },
  { icon: "Clock", title: "When", body: "Saturday morning? After work? Sunrise? Last-minute adventure?" },
  { icon: "MapPin", title: "Where", body: "Find people interested in the same places and activities around you." },
  { icon: "Users", title: "Who", body: "Choose the kind of people you feel comfortable being active with." },
  { icon: "Target", title: "Goals & Personality", body: "Training hard? Exploring casually? Meeting new people? Getting outside more?" },
];

export const ACTIVITIES = [
  { icon: "Footprints", title: "Hike together", body: "Find someone who wants to explore the same trail at the same pace." },
  { icon: "Zap", title: "Run together", body: "Easy 5K? Tempo run? Trail run? Find someone who's training like you." },
  { icon: "Bike", title: "Ride together", body: "Road cycling, mountain biking or a casual weekend ride." },
  { icon: "Snowflake", title: "Snow days", body: "Find your ski or snowboard crew before the season passes you by." },
  { icon: "Mountain", title: "Climb together", body: "Find climbing partners who match your experience and goals." },
  { icon: "Trophy", title: "Play together", body: "Tennis, pickleball, basketball, soccer and more." },
  { icon: "Waves", title: "Get outside", body: "Kayaking, swimming, camping, paddling, surfing and whatever comes next." },
];

export const WHO_FOR = [
  { title: "New to Canada", body: "You moved here and haven't built your outdoor circle yet." },
  { title: "New to the activity", body: "You want to start hiking, running or skiing—but going alone feels intimidating." },
  { title: "Already active", body: "You have the fitness. You just need someone whose schedule and pace match yours." },
  { title: "Travelling", body: "You want to experience a place with people who actually enjoy doing the same things." },
  { title: "Looking for community", body: "You want more than likes and followers. You want people you can actually meet." },
];

export const SAFETY = [
  { icon: "BadgeCheck", title: "Identity verification", body: "Know whether a person has completed verification." },
  { icon: "IdCard", title: "Profile information", body: "See relevant information before deciding who to connect with." },
  { icon: "History", title: "Activity history", body: "Build reputation through real participation and experiences." },
  { icon: "Star", title: "Ratings & reviews", body: "Give the community a way to build trust over time." },
  { icon: "ShieldCheck", title: "Safety-focused matching", body: "Choose preferences that make you feel more comfortable." },
  { icon: "ScrollText", title: "Community standards", body: "Clear expectations for respectful behaviour." },
];

export const STEPS = [
  { n: "01", title: "Tell us what you love doing", body: "Hiking? Running? Skiing? Cycling? Climbing? Something else?" },
  { n: "02", title: "Tell us what you're looking for", body: "Your experience, fitness level, preferred pace, schedule and the kind of people you'd like to meet." },
  { n: "03", title: "Help shape AKTIVPAL", body: "We're talking directly with Canada's outdoor community to build something genuinely useful." },
  { n: "04", title: "Be among the first", body: "Early community members will get first access to AKTIVPAL as we launch." },
];

export const FOUNDING_TAGS = [
  { icon: "Footprints", label: "Get outside more" },
  { icon: "Zap", label: "Become more active" },
  { icon: "Mountain", label: "Explore BC" },
  { icon: "Handshake", label: "Meet new people" },
  { icon: "Trees", label: "Build community" },
  { icon: "Flame", label: "Try something new" },
];

// ---- Survey ----
// types: single | multi | scale | text | textarea
export const SURVEY = [
  {
    id: "q1", type: "single", label: "Where are you currently based?",
    options: ["Vancouver / Lower Mainland", "Victoria / Vancouver Island", "Okanagan", "Other BC", "Elsewhere in Canada", "Outside Canada", "Others"],
  },
  {
    id: "q2", type: "single", label: "How often do you intentionally do physical or outdoor activities?",
    options: ["Almost every day", "4–6 times a week", "2–3 times a week", "About once a week", "A few times a month", "Rarely", "I want to be more active but currently don't do much"],
  },
  {
    id: "q3", type: "multi", label: "What activities are you currently interested in?",
    options: ["🥾 Hiking", "🏃 Running / Trail Running", "🚵 Cycling / Mountain Biking", "🎿 Skiing / Snowboarding", "🧗 Climbing", "🎾 Tennis", "🏓 Pickleball", "🏀 Basketball", "🏊 Swimming", "🧘 Yoga", "🏋️ Gym / Strength Training", "🛶 Kayaking / Paddling", "🏕️ Camping", "🌊 Water Sports", "🏐 Volleyball"],
    allowOther: true,
  },
  {
    id: "q4", type: "single", label: "Have you ever wanted to do an activity but didn't because you didn't have someone to go with?",
    options: ["Yes — frequently", "Yes — sometimes", "Yes — once or twice", "No", "I usually prefer doing activities alone"],
  },
  {
    id: "q5", type: "multi", max: 3, label: "What usually stops you from finding someone?",
    hint: "Choose up to 3",
    condition: { q: "q4", in: ["Yes — frequently", "Yes — sometimes", "Yes — once or twice"] },
    options: ["My friends aren't interested", "My friends aren't available at the same time", "We have different fitness levels", "We have different skill levels", "I don't know enough active people", "I recently moved / small social circle", "I feel uncomfortable meeting strangers", "Safety concerns", "I don't know where to find people", "Existing FB/WhatsApp/Meetup groups are inconvenient", "I don't want to join a large group", "I want someone with a similar pace", "I want people around my age", "I prefer a specific gender"],
    allowOther: true,
  },
  {
    id: "q6", type: "multi", label: "How do you currently find people to do activities with?",
    options: ["Friends / family", "Facebook Groups", "WhatsApp Groups", "Meetup", "Strava", "Reddit", "Instagram", "Discord", "Bumble BFF", "Sports clubs / community groups", "I usually go alone", "I don't currently have anyone"],
    allowOther: true,
    followup: { id: "q6b", type: "textarea", label: "What do you like or dislike about the way you currently find people?", emphasis: true },
  },
  {
    id: "q7", type: "scale", label: "Imagine AKTIVPAL let you post a plan like “Tunnel Bluffs — Sat 8 AM — Beginner/Moderate — 2–3 people, similar pace”, then showed you people interested in the same activity. How useful would that be?",
    low: "Not useful at all", high: "Extremely useful",
  },
  {
    id: "q8", type: "multi", max: 3, label: "Which of these would be most valuable to you?", hint: "Choose top 3",
    options: ["Find people for a specific activity", "Match by fitness level", "Match by skill level", "Match based on pace", "Find people available at the same time", "Find people nearby", "Filter by age", "Gender preferences", "Identity verification", "Ratings / reviews", "See someone's activity history", "Create / join specific plans", "Small groups rather than large events", "Meet people new to Canada", "Similar interests / personality", "Last-minute activity partners"],
    allowOther: true,
  },
  {
    id: "q9", type: "scale", section: "Trust & Safety — this section is particularly important for AKTIVPAL.",
    label: "How comfortable would you be meeting someone you found through AKTIVPAL for an activity?",
    low: "Very uncomfortable", high: "Very comfortable",
  },
  {
    id: "q10", type: "multi", label: "What would make you feel safer meeting someone through AKTIVPAL?",
    options: ["Government ID verification", "Verified profile badge", "Ratings / reviews", "Seeing their previous activities", "Mutual connections", "In-app messaging before meeting", "Public meeting locations", "Emergency contact / safety features", "Ability to report / block users", "Gender preferences", "Small-group activities instead of 1-on-1", "Community guidelines", "Knowing how long they've been on AKTIVPAL"],
    allowOther: true,
  },
  {
    id: "q11", type: "scale", label: "If AKTIVPAL were available today and you found a suitable partner, how likely would you be to actually use it?",
    low: "Definitely wouldn't", high: "Definitely would",
  },
  {
    id: "q12", type: "single", label: "How often could you realistically see yourself using AKTIVPAL?",
    options: ["Several times a week", "Once a week", "2–3 times a month", "Once a month", "Occasionally", "Only for special activities / trips"],
  },
  {
    id: "q13", type: "textarea", label: "What would make you trust AKTIVPAL enough to meet someone from the platform?",
  },
  {
    id: "q14", type: "textarea", emphasis: true, label: "What is the ONE thing you wish existed that would make it easier to be active with other people?",
  },
  {
    id: "q15", type: "single", label: "Would you like to be one of the first people to try AKTIVPAL in Canada?",
    options: ["Yes — I'd love to", "Maybe — I'd like to learn more", "Not right now"],
    reveal: { on: "Yes — I'd love to" },
  },
];
