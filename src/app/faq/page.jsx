import { JsonLd } from "@/components/JsonLd";
import { TrailRail } from "@/components/TrailRail";
import { DocumentLayout, DocumentSection, FaqList, FinalCTA, Hero } from "@/components/marketing/Marketing";
import { FAQ_GROUPS, FAQS } from "@/data/faq";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/faq");

export default function Page() {
  return <>
    <JsonLd data={pageSchema("/faq")} />
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: FAQS.map(({ question, answer }) => ({
        "@type": "Question", name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    }} />
    <main id="main-content" tabIndex={-1} className="marketing-page apm-faq-page apm-has-trail">
      <TrailRail chapters={[{ id: "chapter-01" }, { id: "chapter-02" }, { id: "chapter-03" }, { id: "chapter-04" }]} />
      <Hero compact wide description="Quick answers about AKTIVPAL, Movements and staying safe. The essentials before you get moving.">Frequently asked questions</Hero>
      <DocumentLayout sections={FAQ_GROUPS}>
        {FAQ_GROUPS.map(({ id, title, questions }, index) => <DocumentSection key={id} id={id} title={title} numeral={String(index + 1).padStart(2, "0")}><FaqList questions={questions} /></DocumentSection>)}
      </DocumentLayout>
      <FinalCTA />
    </main>
  </>;
}
