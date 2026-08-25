import { SurveyPage } from "@/views/SurveyPage";

export const metadata = {
  title: "Take the AKTIVPAL Survey — Help Shape the Launch",
  description:
    "Tell us what you need from an activity partner app. Share your input on matching, safety, and local outdoor culture to help AKTIVPAL launch right.",
  openGraph: {
    title: "Take the AKTIVPAL Survey — Help Shape the Launch",
    description:
      "Tell us what you need from an activity partner app. Share your input on matching, safety, and local outdoor culture.",
    url: "https://www.aktivpal.com/survey",
    siteName: "AKTIVPAL",
    type: "website",
  },
  alternates: {
    canonical: "https://www.aktivpal.com/survey",
  },
};

export default function Page() {
  return <SurveyPage />;
}
