export function Footer() {
  return (
    <footer className="border-t border-edge px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-2 text-sm text-haze sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ekam</p>
        <a href="mailto:hello@ekam.studio" className="hover:text-mist">
          hello@ekam.studio
        </a>
      </div>
    </footer>
  );
}

export default Footer;
