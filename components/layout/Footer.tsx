import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.contact.location}
        </span>
        <span className="font-mono text-xs uppercase tracking-widest">
          Built with Next.js · Tailwind · Framer Motion
        </span>
      </div>
    </footer>
  );
}
