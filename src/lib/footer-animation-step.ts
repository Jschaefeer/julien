import { allPosts } from "content-collections";
import { DATA } from "@/data/resume";
import { paginate, normalizePage } from "@/lib/pagination";

const RESOURCES_PAGE_SIZE = 5;

function getSortedPosts() {
  return [...allPosts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

export function getFooterAnimationStep(
  pathname: string,
  pageParam?: string | null
): number | null {
  if (pathname === "/") {
    return 7;
  }

  if (pathname === "/about") {
    const itemCount =
      6 +
      3 +
      DATA.experience.length +
      DATA.education.length +
      DATA.sports.length +
      1;
    return itemCount + 1;
  }

  if (pathname === "/resources") {
    const sortedPosts = getSortedPosts();
    const totalPages = Math.ceil(sortedPosts.length / RESOURCES_PAGE_SIZE);
    const currentPage = normalizePage(pageParam ?? undefined, totalPages);
    const { items: paginatedPosts, pagination } = paginate(sortedPosts, {
      page: currentPage,
      pageSize: RESOURCES_PAGE_SIZE,
    });

    if (paginatedPosts.length === 0) {
      return 3;
    }

    if (pagination.totalPages > 1) {
      return 5;
    }

    return 4;
  }

  if (pathname.startsWith("/resources/")) {
    return 4;
  }

  return null;
}
