import { AboutPage } from "@/views/AboutPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/about");

export default function Page() {
  return <><JsonLd data={pageSchema("/about", "AboutPage")} /><AboutPage /></>;
}
