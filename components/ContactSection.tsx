import ContactForm from "@/components/ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">
          Start a project
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mist sm:text-base">
          Fill this in and we&rsquo;ll get back to you with next steps. No
          account, no password — just tell us what you need.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
