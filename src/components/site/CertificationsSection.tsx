import epceLogo from "@/assets/certifications/eepc-official.png";
import msmeLogo from "@/assets/certifications/msme.png";
import coirBoardLogo from "@/assets/certifications/coir-board.jpg";
import iso9001Logo from "@/assets/certifications/iso-9001.png";
import { ContentTodo, Label } from "./primitives";

const certificates = [
  {
    name: "MSME · Udyam",
    desc: "Registered micro, small and medium enterprise",
    image: msmeLogo,
  },
  {
    name: "Coir Board",
    desc: "Under the Ministry of MSME",
    image: coirBoardLogo,
  },
  {
    name: "EEPC India",
    desc: "Engineering Export Promotion Council",
    image: epceLogo,
  },
  {
    name: "ISO 9001:2015",
    desc: "Certified quality management system",
    image: iso9001Logo,
  },
];

export function CertificationsSection() {
  return (
    <section className="w-full overflow-hidden bg-surface-cream py-12 text-body-text lg:py-16">
      <div className="container">
        <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
          <div>
            <Label className="mb-3 block text-brand">
              Certifications &amp; Registrations
            </Label>
            <h2 className="display max-w-[25ch] text-h2">
              Standards behind every shipment.
            </h2>
          </div>
          <p className="max-w-[46ch] text-sm leading-body text-body-text">
            Recognised memberships and quality systems support a professional, export-ready supply
            experience.
          </p>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certificates.map((cert) => (
            <article
              key={cert.name}
              className="flex h-full min-w-0 flex-col rounded-sm border border-brand/15 bg-surface-teal-light p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex h-[76px] items-center justify-center border-b border-brand/15 pb-4">
                <img
                  src={cert.image}
                  alt={`${cert.name} logo`}
                  className="max-h-[58px] max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="pt-4">
                <h3 className="text-base font-semibold leading-heading text-heading">{cert.name}</h3>
                <p className="mt-2 text-sm leading-body text-text-muted">{cert.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <ContentTodo request="Confirm the GST registration details before publishing them." />
      </div>
    </section>
  );
}
