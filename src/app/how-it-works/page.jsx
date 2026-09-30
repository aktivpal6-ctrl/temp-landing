import { HowItWorksPage } from "@/views/HowItWorksPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/how-it-works");

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to join an outdoor activity with AKTIVPAL",
  "description": "Find people for outdoor activities, join a Movement and meet up in British Columbia.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Discover",
      "text": "Browse upcoming Movements by activity and location."
    },
    {
      "@type": "HowToStep",
      "name": "Join",
      "text": "Check the details, see who is going, and request to join or join instantly when the host allows it."
    },
    {
      "@type": "HowToStep",
      "name": "Meet up",
      "text": "Confirm the plan and coordinate with the group."
    },
    {
      "@type": "HowToStep",
      "name": "Move",
      "text": "Show up, explore and enjoy it together."
    }
  ]
};

export default function Page() {
  return <><JsonLd data={pageSchema("/how-it-works")} /><JsonLd data={howToSchema} /><HowItWorksPage /></>;
}
