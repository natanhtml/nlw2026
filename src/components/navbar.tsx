import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-bg-page border-b border-border-primary z-50">
      <div className="h-full max-w-[1440px] mx-auto px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold text-accent-green">
            &gt;
          </span>
          <span className="font-mono text-lg font-medium text-text-primary">
            devroast
          </span>
        </Link>

        <Link
          href="/leaderboard"
          className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          leaderboard
        </Link>
      </div>
    </nav>
  );
}
