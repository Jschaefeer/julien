import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { Mail } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

export default function ContactSection() {
  return (
    <section id="contact">
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <Link
          href={`mailto:${DATA.contact.email}`}
          className="group flex items-center gap-3 rounded-xl border p-5 font-medium transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Mail className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-semibold tracking-tight">Contact Me</span>
        </Link>
      </BlurFade>
    </section>
  );
}
