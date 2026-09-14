import { WaitlistPage } from "@/views/WaitlistPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const metadata = pageMetadata("/waitlist");

export default function Page() {
  return <><JsonLd data={pageSchema("/waitlist")} /><WaitlistPage /></>;
}
