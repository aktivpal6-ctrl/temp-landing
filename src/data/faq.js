// Approved copy shared by the visible accordions and FAQPage JSON-LD.
export const FAQ_GROUPS = [
  {
    "id": "about",
    "title": "About AKTIVPAL",
    "questions": [
      {
        "question": "What is AKTIVPAL?",
        "answer": "AKTIVPAL helps people find others for real-world outdoor activities. Pick an activity, meet people who share your interests, make a plan and get moving together."
      },
      {
        "question": "Is AKTIVPAL a dating app?",
        "answer": "No. AKTIVPAL is about friendship and shared adventure. It's built to help people find others who want to do the same activities, and it isn't a feed designed to keep you scrolling."
      },
      {
        "question": "Where is AKTIVPAL available?",
        "answer": "AKTIVPAL is starting in British Columbia, Canada. Availability elsewhere in Canada will depend on the rollout."
      },
      {
        "question": "When can I start?",
        "answer": "AKTIVPAL is coming soon. Join the early access waitlist to be among the first to discover, create and join Movements."
      }
    ]
  },
  {
    "id": "movements",
    "title": "Movements and activities",
    "questions": [
      {
        "question": "What is a Movement?",
        "answer": "A Movement is a planned activity that anyone can join. A host picks an activity, a place and a time, and people who want to come along join."
      },
      {
        "question": "Which activities can I find people for?",
        "answer": "Hiking, walking, trail running, skiing, kayaking and swimming, starting in British Columbia."
      },
      {
        "question": "What does a Movement show me?",
        "answer": "Each Movement shows a title and description, the location, the start time and duration, a difficulty level, and who's going and how many spots are left."
      },
      {
        "question": "Can I join as a beginner?",
        "answer": "Yes. Every Movement lists a difficulty level (beginner, moderate or expert), so you can choose plans that suit your experience and fitness."
      },
      {
        "question": "How do I join a Movement?",
        "answer": "Check the details and see who's going. You can join instantly when the host allows it, or request to join when the host wants to approve people first."
      },
      {
        "question": "Do I need to host to use AKTIVPAL?",
        "answer": "No. You can join Movements without ever creating one. Hosting is there for when you have a plan and want company."
      },
      {
        "question": "Can I create my own Movement?",
        "answer": "Yes. Set the basics, add details about the activity and choose whether people can join instantly or need your approval."
      }
    ]
  },
  {
    "id": "safety",
    "title": "Trust and safety",
    "questions": [
      {
        "question": "What should I consider before meeting activity partners?",
        "answer": "Read the activity details, choose a public meeting place, tell someone your plans and pick activities that suit your experience and fitness. Outdoor conditions can change, so check the weather and bring appropriate equipment."
      },
      {
        "question": "How does AKTIVPAL help me know who I'm meeting?",
        "answer": "AKTIVPAL is being designed with profiles, activity history, reviews and community standards, so you can learn about the people you plan to meet before you go."
      },
      {
        "question": "What if someone behaves inappropriately?",
        "answer": "Reporting and moderation tools are being built so you can report inappropriate behaviour and help protect the community. If you are ever in immediate danger, call 911."
      },
      {
        "question": "Where can I find outdoor safety guidance?",
        "answer": "AdventureSmart has trip planning, training and essentials guidance at adventuresmart.ca, and it's worth reading before any outdoor plan."
      }
    ]
  },
  {
    "id": "start",
    "title": "Getting started",
    "questions": [
      {
        "question": "How can I get involved?",
        "answer": "Join the early access waitlist to help shape AKTIVPAL. Planned activities in British Columbia will appear on the Movement page as they launch. If none are listed yet, join early access and you'll be first to know."
      },
      {
        "question": "What's coming after launch?",
        "answer": "A chat for every Movement, messages between people you've met, group conversations, and photo and video sharing are planned as next steps."
      }
    ]
  }
];

export const FAQS = FAQ_GROUPS.flatMap(({ questions }) => questions);

export const HOW_IT_WORKS_FAQS = [
  {
    "question": "Do I need to host to use AKTIVPAL?",
    "answer": "No. You can join Movements without ever creating one. Hosting is there for when you have a plan and want company."
  },
  {
    "question": "Can I join as a beginner?",
    "answer": "Yes. Every Movement lists a difficulty level (beginner, moderate or expert), so you can choose plans that suit your experience."
  },
  {
    "question": "Which activities can I find people for?",
    "answer": "Hiking, walking, trail running, skiing, kayaking and swimming, starting in British Columbia, Canada."
  },
  {
    "question": "When can I start?",
    "answer": "AKTIVPAL is coming soon. Join early access to be among the first to discover, create and join Movements."
  }
];
