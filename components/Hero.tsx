export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-screen flex-col justify-center px-6 pt-24 sm:px-10"
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm text-beam">for people who want a site, not a to-do list</p>
        <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-6xl">
          Tell us what you&rsquo;re
          <br />
          building. We build it.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-mist sm:text-lg">
          Ekam is a small studio that takes a website from a rough idea to a
          live, working site — design, copy, build, and launch — so you
          don&rsquo;t have to learn a website builder to get one.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            Start a project
          </a>
          <a
            href="#process"
            className="rounded-full border border-edge px-6 py-3 text-sm text-ink backdrop-blur-md transition-colors hover:border-beam/50"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
