import { HomePageClient } from "@/components/home-page-client";
import { JsonLd } from "@/components/json-ld";
import { createWebsiteJsonLd } from "@/lib/seo";

export default function Page() {
  return (
    <>
      <JsonLd data={createWebsiteJsonLd()} />
      <HomePageClient />
    </>
  );
}
