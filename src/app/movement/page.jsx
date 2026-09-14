import MovementPage from "@/views/MovementPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/movement");

export default function Page() {
  return <><JsonLd data={pageSchema("/movement", "CollectionPage")} /><MovementPage /></>;
}
