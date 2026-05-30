import { allPosts } from "content-collections";

import {
  FileCabinetDrawer,
  type ArticlePreviewData,
} from "@/components/file-cabinet-drawer";
import { DATA } from "@/data/resume";
import { extractArticleExcerpt } from "@/lib/article-preview";

function slugFromPath(path: string) {
  return path.replace(/\.mdx$/, "");
}

export function FileCabinet() {
  const featuredSlugs = [
    DATA.featuredContent.slug,
    ...DATA.featuredResources.map((r) => r.slug),
  ];

  const articles: ArticlePreviewData[] = featuredSlugs.flatMap((slug) => {
    const post = allPosts.find((p) => slugFromPath(p._meta.path) === slug);
    if (!post) return [];

    const isFeatured = slug === DATA.featuredContent.slug;
    const resource = DATA.featuredResources.find((r) => r.slug === slug);
    const meta = isFeatured ? DATA.featuredContent : resource;

    return [
      {
        slug,
        title: post.title,
        tabLabel: isFeatured
          ? DATA.featuredContent.title
          : "All This Money?",
        summary: post.summary,
        excerpt: meta?.description ?? extractArticleExcerpt(post.content),
        label: isFeatured ? DATA.featuredContent.label : resource?.type,
        readTime: meta?.readTime,
        cost: meta?.cost,
      },
    ];
  });

  return <FileCabinetDrawer articles={articles} />;
}
