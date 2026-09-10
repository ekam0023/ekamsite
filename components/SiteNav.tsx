const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Start a project" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          className="font-display text-lg tracking-tight text-ink"
        >
          Ekam
        </a>
        <ul className="hidden items-center gap-8 text-sm text-mist sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-edge bg-glass px-4 py-2 text-sm text-ink backdrop-blur-md transition-colors hover:border-beam/50 sm:hidden"
        >
          Start
        </a>
      </nav>
    </header>
  );
}

export default SiteNav;
