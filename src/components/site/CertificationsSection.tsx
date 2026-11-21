import epceLogo from "@/assets/certifications/eepc-official.png";
import msmeLogo from "@/assets/certifications/msme.png";
import coirBoardLogo from "@/assets/certifications/coir-board.jpg";
import iso9001Logo from "@/assets/certifications/iso-9001.png";

const certificates = [
  {
    name: "MSME · Udyam",
    desc: "Registered micro, small and medium enterprise",
    image: msmeLogo,
  },
  {
    name: "GST Registration",
    desc: "GSTIN: [INSERT GST NUMBER] · Registered under the Goods and Services Tax Act, India.",
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
    <section className="w-full overflow-hidden bg-white py-8 text-[#123f3b] sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#25856f]">
              Certifications &amp; Registrations
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#123f3b]">
              Standards behind every shipment.
            </h2>
          </div>
          <p className="text-[15px] leading-7 text-[#49645e]">
            Recognised memberships and quality systems support a professional, export-ready supply
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {certificates.map((cert) => (
            <article
              key={cert.name}
              className="flex min-w-0 flex-col rounded-md border border-[#c9e3d8] bg-[#f7fcf9] p-5 sm:p-4 lg:px-4 lg:py-5"
            >
              <div className="flex h-[76px] items-center justify-center border-b border-[#dcece5] pb-4">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={`${cert.name} logo`}
                    className="max-h-[58px] max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 place-items-center rounded-full bg-[#e5f5ed] text-sm font-bold text-[#176052]"
                  >
                    GST
                  </span>
                )}
              </div>
              <div className="pt-4">
                <h3 className="text-[clamp(0.88rem,1.1vw,1rem)] font-semibold leading-5 text-[#123f3b]">
                  {cert.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#58736d]">{cert.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
