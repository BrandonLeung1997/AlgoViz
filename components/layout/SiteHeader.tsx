import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-sky-700"
        >
          AlgoViz
        </Link>
        <nav className="text-sm text-slate-600">
          <Link href="/" className="hover:text-sky-700">
            Algorithms
          </Link>
        </nav>
      </div>
    </header>
  );
}
