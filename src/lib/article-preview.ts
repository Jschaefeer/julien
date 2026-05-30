function cleanParagraph(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain-text excerpt from MDX body for card previews */
export function extractArticleExcerpt(content: string, maxLength = 380): string {
  const body = content.replace(/^---[\s\S]*?---\n?/m, "");
  const paragraphs = body
    .split(/\n\s*\n/)
    .map(cleanParagraph)
    .filter((p) => p.length >= 72);

  const text = (paragraphs.length > 0 ? paragraphs.slice(0, 2).join(" ") : cleanParagraph(body));

  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 200 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
