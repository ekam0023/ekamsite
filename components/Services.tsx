const services = [
  {
    title: "New website, from scratch",
    detail:
      "You bring the idea — a business, a portfolio, a launch. We handle structure, design, copy, and build, and hand you a finished site.",
    tag: "Design + build",
  },
  {
    title: "Redesign an existing site",
    detail:
      "Keep your content and domain, replace the parts that feel slow, dated, or hard to update, with something people actually enjoy using.",
    tag: "Rebuild",
  },
  {
    title: "Ongoing changes",
    detail:
      "Once your site is live, send us edits — new pages, new photos, new pricing — and we make the change, so you never have to touch code.",
    tag: "Maintenance",
  },
];

export function Services() {
  return (
    <section id="services" className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          What we take off your plate
        </h2>
        <div className="mt-12 divide-y divide-edge border-y border-edge">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="sm:max-w-md">
                <h3 className="font-display text-xl text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist sm:text-base">
                  {service.detail}
                </p>
              </div>
              <span className="text-sm text-beam sm:text-right">
                {service.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
