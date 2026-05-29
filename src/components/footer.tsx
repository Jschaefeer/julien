import { DATA } from "@/data/resume";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 text-center text-xs text-muted-foreground/60 space-y-0.5">
      <p>
        © {year} Copyright by {DATA.name}
      </p>
      <p>
        Site designed by{" "}
        <a
          href="https://www.buzzedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-muted-foreground transition-colors"
        >
          Buzzed Tech
        </a>
      </p>
    </footer>
  );
}
