import type { ReactNode } from "react";

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 120"
      className="h-[132px] w-full max-w-[240px] text-[#0f4c42] sm:h-[140px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      {children}
    </svg>
  );
}

function QualityIcon() {
  return (
    <FeatureIcon>
      <circle cx="100" cy="60" r="42" strokeWidth="3" />
      <circle cx="100" cy="60" r="31" strokeWidth="1.8" />
      <path id="quality-label-arc" d="M67 53a34 34 0 0 1 66 0" fill="none" stroke="none" />
      <text fill="currentColor" stroke="none" fontSize="9" fontWeight="700" letterSpacing="1.2">
        <textPath href="#quality-label-arc" startOffset="50%" textAnchor="middle">PREMIUM QUALITY</textPath>
      </text>
      <path d="m100 37 6.4 13 14.4 2.1-10.4 10.1 2.5 14.3L100 69.8l-12.9 6.7 2.5-14.3-10.4-10.1L93.6 50 100 37Z" fill="currentColor" strokeWidth="1.5" />
      <circle cx="67" cy="65" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="133" cy="65" r="2.5" fill="currentColor" stroke="none" />
      <path d="M80 86q20 12 40 0" strokeWidth="1.8" />
    </FeatureIcon>
  );
}

function BiodegradableIcon() {
  return (
    <FeatureIcon>
      <path d="M64 43c12-23 42-31 65-16" strokeWidth="12" />
      <path d="m119 17 24 5-13 21" fill="currentColor" stroke="none" />
      <path d="M143 48c14 22 7 49-14 63" strokeWidth="12" />
      <path d="m137 98-21 14 1-26" fill="currentColor" stroke="none" />
      <path d="M113 110c-25 9-51-3-59-28" strokeWidth="12" />
      <path d="m50 90 3-26 20 16" fill="currentColor" stroke="none" />
      <path d="M54 52c1-14 5-23 13-32" strokeWidth="12" />
      <path d="m57 18 23-10-3 26" fill="currentColor" stroke="none" />
    </FeatureIcon>
  );
}

function AcousticIcon() {
  return (
    <FeatureIcon>
      <path d="M25 50h15l20-16v52L40 70H25V50Z" fill="currentColor" strokeWidth="3" />
      <path d="M73 43q18 17 0 34M84 33q28 27 0 54M96 24q38 36 0 72" strokeWidth="5" />
      <rect x="128" y="20" width="36" height="80" rx="2" fill="currentColor" strokeWidth="3" />
      <path d="M136 22v76m8-76v76m8-76v76" stroke="#fcfaf4" strokeWidth="2" />
      <path d="m136 32 8 7-8 7m16 4-8 7 8 7m-16 5 8 7-8 7m16 3-8 7 8 5" stroke="#fcfaf4" strokeWidth="1.5" />
      <path d="M173 27v66" strokeWidth="3" />
    </FeatureIcon>
  );
}

function NaturalIcon() {
  return (
    <FeatureIcon>
      <circle cx="63" cy="60" r="38" strokeWidth="3" />
      <circle cx="63" cy="60" r="31" strokeWidth="1.5" />
      <path d="M62 85c1-19 0-34-10-49 19 7 28 20 21 37-3 6-7 10-11 12Z" fill="currentColor" strokeWidth="2" />
      <path d="M61 84c-15-5-24-15-23-27 13 2 22 10 24 22m0 0c8-12 17-18 29-17-4 12-13 20-28 22" strokeWidth="3" />
      <path d="M61 83v-30" stroke="#fcfaf4" strokeWidth="1.7" />
      <rect x="102" y="35" width="82" height="50" rx="7" fill="currentColor" strokeWidth="2" />
      <path d="M110 60h66" stroke="#fcfaf4" strokeWidth="1.5" />
      <text x="143" y="54" fill="#fcfaf4" stroke="none" fontSize="11" fontWeight="800" letterSpacing="1.2" textAnchor="middle">NATURAL</text>
      <text x="143" y="76" fill="#fcfaf4" stroke="none" fontSize="11" fontWeight="800" letterSpacing="1.2" textAnchor="middle">PRODUCT</text>
    </FeatureIcon>
  );
}

function HandlingIcon() {
  return (
    <FeatureIcon>
      <path d="M33 37h39v50H28V48q0-11 5-11Z" strokeWidth="4" />
      <path d="M71 40v54m7-52v52M37 89h65" strokeWidth="5" />
      <path d="m50 55 11 20m-14-17 8-5m-5 29h13" strokeWidth="4" />
      <path d="M26 70H14v22h99" strokeWidth="5" />
      <path d="M26 82H10v10h16" fill="currentColor" strokeWidth="2" />
      <rect x="89" y="27" width="34" height="30" rx="2" fill="currentColor" strokeWidth="3" />
      <path d="M101 29v11l5-4 5 4V29" stroke="#fcfaf4" strokeWidth="3" />
      <rect x="90" y="61" width="34" height="27" rx="2" fill="currentColor" strokeWidth="3" />
      <path d="M102 63v10l5-3 5 3V63" stroke="#fcfaf4" strokeWidth="3" />
      <circle cx="40" cy="96" r="10" fill="#fcfaf4" strokeWidth="5" />
      <circle cx="76" cy="96" r="10" fill="#fcfaf4" strokeWidth="5" />
      <circle cx="111" cy="96" r="15" fill="#fcfaf4" strokeWidth="4" />
      <path d="m104 96 5 5 10-11" strokeWidth="4" />
    </FeatureIcon>
  );
}

function StrengthIcon() {
  return (
    <FeatureIcon>
      <path d="m52 28 42 25-8 13-42-25 8-13Z" fill="currentColor" strokeWidth="2" />
      <path d="m47 23 15-17 20 12-10 18" fill="currentColor" strokeWidth="3" />
      <path d="m42 36-8 13m52-27 12 9m-22-22 4-8" strokeWidth="4" />
      <path d="m81 70 11 5-3 8m12-10 7 5-2 7" strokeWidth="3" />
      <path d="m35 71-7 6m71-6 8 5m-54-3-1 8" strokeWidth="3" />
      <path d="M25 88h150v21H25z" fill="currentColor" strokeWidth="3" />
      <path d="M37 89v19m15-19v19m15-19v19m15-19v19m15-19v19m15-19v19m15-19v19m15-19v19m15-19v19" stroke="#fcfaf4" strokeWidth="2" />
      <path d="M29 96h142" stroke="#fcfaf4" strokeWidth="1.5" strokeDasharray="3 4" />
    </FeatureIcon>
  );
}

const features = [
  { title: "Consistent Quality", Icon: QualityIcon },
  { title: "Biodegradable", Icon: BiodegradableIcon },
  { title: "Acoustic Insulation Properties", Icon: AcousticIcon },
  { title: "100% Natural", Icon: NaturalIcon },
  { title: "Easy Handling", Icon: HandlingIcon },
  { title: "Tough, Strong and Sturdy", Icon: StrengthIcon },
];

export function CoirMattingFeatures() {
  return (
    <section aria-labelledby="coir-matting-features-title" className="coir-features-section bg-[#fcfaf4]">
      <div className="shell coir-features-inner">
        <h2
          id="coir-matting-features-title"
          className="font-sans text-[clamp(2.4rem,4.6vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[#0f4c42]"
        >
          Key Features
        </h2>
        <ul className="coir-features-grid mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, Icon }) => (
            <li
              key={title}
              className="coir-feature-card flex min-h-[204px] flex-col items-center justify-center gap-2 rounded-[3px] border border-[#e5e9e2] bg-white px-4 py-4 text-center shadow-[0_2px_8px_rgba(15,76,66,.035)] transition-shadow hover:shadow-[0_12px_28px_rgba(15,76,66,.09)]"
            >
              <Icon />
              <span className="max-w-[28ch] font-sans text-[clamp(1.05rem,1.6vw,1.25rem)] font-semibold leading-snug text-[#172b28]">
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
