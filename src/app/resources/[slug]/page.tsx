import BlurFade from "@/components/magicui/blur-fade";
import { ChecklistPrintButton } from "@/components/checklist-print-button";
import { JsonLd } from "@/components/json-ld";
import { NilChecklistArticle } from "@/components/nil-checklist-article";
import { NilChecklistInput } from "@/components/mdx/nil-checklist-input";
import { NilChecklistPrintSheet } from "@/components/nil-checklist-print-sheet";
import { allPosts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { createArticleJsonLd, createMetadata, getResourceSlug } from "@/lib/seo";
import Link from "next/link";
import {
  accentBackChevron,
  accentBackLink,
  accentPillCard,
  accentPillCardMeta,
  accentPillCardTitle,
  accentPillChevron,
} from "@/lib/accent-classes";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getSortedPosts() {
  return [...allPosts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: getResourceSlug(post._meta.path),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allPosts.find((p) => getResourceSlug(p._meta.path) === slug);

  if (!post) {
    return undefined;
  }

  const { title, publishedAt, updatedAt, summary: description, image } = post;

  return createMetadata({
    title,
    description,
    path: `/resources/${slug}`,
    type: "article",
    publishedTime: publishedAt,
    modifiedTime: updatedAt ?? publishedAt,
    image: image ?? `/resources/${slug}/opengraph-image`,
  });
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const sortedPosts = getSortedPosts();
  const currentIndex = sortedPosts.findIndex(
    (p) => p._meta.path.replace(/\.mdx$/, "") === slug
  );
  const post = sortedPosts[currentIndex];

  if (!post) {
    notFound();
  }

  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const getSlug = (post: (typeof sortedPosts)[0]) =>
    post._meta.path.replace(/\.mdx$/, "");

  const isNilChecklist = slug === "nil-dispatch";

  return (
    <section id="resources">
      <JsonLd
        data={createArticleJsonLd({
          title: post.title,
          description: post.summary,
          slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          image: post.image,
        })}
      />
      <BlurFade delay={0}>
        <div className="no-print flex justify-start gap-4 items-center">
          <Link href="/resources" className={`${accentBackLink} mb-6`} aria-label="Back to Resources">
            <ChevronLeft className={accentBackChevron} />
            Back to Resources
          </Link>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="no-print title font-semibold text-3xl md:text-4xl tracking-tighter leading-tight">
            {post.title}
          </h1>
          {isNilChecklist ? (
            <ChecklistPrintButton className="hidden sm:inline-flex" />
          ) : null}
        </div>
      </BlurFade>
      {isNilChecklist ? <NilChecklistPrintSheet mdx={post.mdx} /> : null}
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        {isNilChecklist ? (
          <NilChecklistArticle className="no-print nil-checklist prose w-full max-w-3xl text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert mt-6">
            <MDXContent
              code={post.mdx}
              components={{ ...mdxComponents, input: NilChecklistInput }}
            />
          </NilChecklistArticle>
        ) : (
          <article className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert mt-6">
            <MDXContent code={post.mdx} components={mdxComponents} />
          </article>
        )}
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <nav className="no-print mt-12 pt-8 max-w-2xl">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {previousPost ? (
              <Link
                href={`/resources/${getSlug(previousPost)}`}
                className={accentPillCard}
              >
                <span className={accentPillCardMeta}>
                  <ChevronLeft className={accentPillChevron} />
                  Previous
                </span>
                <span
                  className={`${accentPillCardTitle} whitespace-normal wrap-break-word`}
                >
                  {previousPost.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}

            {nextPost ? (
              <Link
                href={`/resources/${getSlug(nextPost)}`}
                className={cn(accentPillCard, "text-right")}
              >
                <span
                  className={cn(
                    accentPillCardMeta,
                    "justify-end",
                  )}
                >
                  Next
                  <ChevronRight className={accentPillChevron} />
                </span>
                <span
                  className={`${accentPillCardTitle} whitespace-normal wrap-break-word`}
                >
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div className="hidden sm:block flex-1" />
            )}
          </div>
        </nav>
      </BlurFade>
    </section>
  );
}
