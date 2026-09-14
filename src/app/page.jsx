import { LandingPage } from "@/views/LandingPage";
import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/data/faq";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Page() {
  return <>
    <JsonLd data={pageSchema("/")} />
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQS.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    }} />
    <LandingPage />
  </>;
}
