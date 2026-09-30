import { LandingPage } from "@/views/LandingPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Page() {
  return <>
    <JsonLd data={pageSchema("/")} />
    <LandingPage />
  </>;
}
