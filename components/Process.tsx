const steps = [
  {
    number: "01",
    title: "You tell us the idea",
    detail:
      "A short call or a message is enough — what the site is for, who it\u2019s for, and any pages or examples you like.",
  },
  {
    number: "02",
    title: "We design it",
    detail:
      "You get a preview link to react to before anything is built. We adjust based on your notes, not guesswork.",
  },
  {
    number: "03",
    title: "We build it",
    detail:
      "The approved design becomes a real, fast website — content, forms, and any tools you need connected underneath it.",
  },
  {
    number: "04",
    title: "You launch",
    detail:
      "We put it live on your domain and walk you through anything you\u2019ll want to update yourself.",
  },
];

export function Process() {
  return (
    <section id="process" className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          From idea to live site
        </h2>
        <ol className="mt-12 space-y-10">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-6">
              <span className="font-display text-lg text-haze">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-mist sm:text-base">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Process;
