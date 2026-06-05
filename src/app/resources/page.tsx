import BlurFade from "@/components/magicui/blur-fade";
import { ResourcesComingSoonRow } from "@/components/resources-coming-soon-row";
import { allPosts } from "content-collections";
import Link from "next/link";
import type { Metadata } from "next";
import { paginate, normalizePage } from "@/lib/pagination";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  accentBackChevron,
  accentBackLink,
  accentListChevron,
  accentListTitle,
  accentPaginationLink,
  resourcesListIndex,
} from "@/lib/accent-classes";
import { HardCoverResourceRow } from "@/components/hard-cover-resource-row";
import { createMetadata } from "@/lib/seo";

const PAGE_SIZE = 5;

const resourcesDescription =
  "NIL financial literacy guides, checklists, and money management content for college athletes navigating Name, Image, and Likeness deals.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const currentPage = normalizePage(pageParam, totalPages);
  const title =
    currentPage > 1 ? `Resources (Page ${currentPage})` : "Resources";
  const path =
    currentPage > 1 ? `/resources?page=${currentPage}` : "/resources";

  return createMetadata({
    title,
    description: resourcesDescription,
    path,
  });
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;

  const posts = allPosts;
  const sortedPosts = [...posts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const currentPage = normalizePage(pageParam, totalPages);
  const { items: paginatedPosts, pagination } = paginate(sortedPosts, {
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  return (
    <section id="resources">
      <BlurFade delay={0}>
        <div className="flex justify-start gap-4 items-center">
          <Link
            href="/"
            className={`${accentBackLink} mb-6`}
            aria-label="Back to Home"
          >
            <ChevronLeft className={accentBackChevron} />
            Back to Home
          </Link>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Resources</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Guides, flyers, and content to help NIL athletes understand and protect their money.
        </p>
      </BlurFade>

      {paginatedPosts.length > 0 ? (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <div className="flex flex-col gap-5">
              {pagination.page === 1 ? (
                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                  <HardCoverResourceRow />
                </BlurFade>
              ) : null}
              {paginatedPosts.map((post, id) => {
                const slug = post._meta.path.replace(/\.mdx$/, "");
                const indexNumber = (pagination.page - 1) * PAGE_SIZE + id + 1;
                return (
                  <BlurFade delay={BLUR_FADE_DELAY * 3 + id * 0.05} key={slug}>
                    <Link
                      className="flex items-start gap-x-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      href={`/resources/${slug}`}
                    >
                      <span className={resourcesListIndex}>
                        {String(indexNumber).padStart(2, "0")}.
                      </span>
                      <div className="flex flex-col gap-y-2 flex-1">
                        <p className="tracking-tight text-lg font-medium">
                          <span className={accentListTitle}>
                            {post.title}
                            <ChevronRight className={accentListChevron} aria-hidden />
                          </span>
                        </p>
                      </div>
                    </Link>
                  </BlurFade>
                );
              })}
              {pagination.page === pagination.totalPages && (
                <BlurFade
                  delay={BLUR_FADE_DELAY * 3 + paginatedPosts.length * 0.05}
                >
                  <ResourcesComingSoonRow
                    index={
                      (pagination.page - 1) * PAGE_SIZE + paginatedPosts.length + 1
                    }
                  />
                </BlurFade>
              )}
            </div>
          </BlurFade>

          {pagination.totalPages > 1 && (
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <nav
                aria-label="Resources pagination"
                className="flex gap-3 flex-row items-center justify-between mt-8"
              >
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2 sm:justify-end">
                  {pagination.hasPreviousPage ? (
                    <Link
                      href={`/resources?page=${pagination.page - 1}`}
                      className={accentPaginationLink}
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                  {pagination.hasNextPage ? (
                    <Link
                      href={`/resources?page=${pagination.page + 1}`}
                      className={accentPaginationLink}
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="h-8 w-fit px-2 flex items-center justify-center text-sm border border-border rounded-lg opacity-50 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </div>
              </nav>
            </BlurFade>
          )}
        </>
      ) : (
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-xl">
            <p className="text-muted-foreground text-center">
              No resources yet. Check back soon!
            </p>
          </div>
        </BlurFade>
      )}
    </section>
  );
}
