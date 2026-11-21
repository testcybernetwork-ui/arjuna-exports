import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import step1Image from "@/assets/customer journey/1.jpg";
import step2Image from "@/assets/customer journey/2.jpg";
import step3Image from "@/assets/customer journey/3.jpg";
import step4Image from "@/assets/customer journey/4.jpg";
import step5Image from "@/assets/customer journey/5.jpg";
import step6Image from "@/assets/customer journey/6.jpg";
import step7Image from "@/assets/customer journey/7.jpg";

/**
 * Customer Journey section for the Arjuna Exports site.
 *
 * Optional script font: add

 *
 * Usage: <CustomerJourney />
 * Custom steps: <CustomerJourney steps={[{ title: "Your step", image: "/images/custom.svg" }]} />
 */

export type Step = {
  title: string;
  /** Image URL. Defaults to /images/journey/step-{number}.svg. */
  image?: string;
  /** Descriptive alt text for a supplied illustration. */
  alt?: string;
};

const defaultSteps: Step[] = [
  { title: "Customer Inquiry", image: step1Image, alt: "Customer inquiry illustration" },
  { title: "Quotation & Negotiation", image: step2Image, alt: "Quotation and negotiation illustration" },
  { title: "Order Confirmation", image: step3Image, alt: "Order confirmation illustration" },
  { title: "Production", image: step4Image, alt: "Production illustration" },
  { title: "Quality Control", image: step5Image, alt: "Quality control illustration" },
  { title: "Logistics & Shipment Delivery", image: step6Image, alt: "Logistics and shipment delivery illustration" },
  { title: "Long-Term Partnership", image: step7Image, alt: "Long-term partnership illustration" },
];

const headerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const headerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};
const reducedFadeVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};
const stepsContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export function CustomerJourney({ steps = defaultSteps }: { steps?: Step[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="customer-journey-title"
      className="customer-journey relative overflow-hidden py-5"
      style={{ "--brand-dark": "var(--brand-deep)", "--brand-green": "var(--accent-green)" } as CSSProperties}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5">
        <div className="mb-5 grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto] md:gap-8">
          <motion.div
            variants={prefersReducedMotion ? reducedFadeVariants : headerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-[760px]"
          >
            <motion.p variants={prefersReducedMotion ? reducedFadeVariants : headerItemVariants} className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#617469]">
              Customer Journey
            </motion.p>
            <motion.h2
              id="customer-journey-title"
              variants={prefersReducedMotion ? reducedFadeVariants : headerItemVariants}
              className="display mb-1 text-[clamp(1.35rem,3.15vw,2rem)] font-normal leading-[1.08] tracking-[-0.01em] text-[var(--brand-dark)]"
            >
              From First Call to Long-Term Partnership
            </motion.h2>
            <motion.p variants={prefersReducedMotion ? reducedFadeVariants : headerItemVariants} className="max-w-[620px] text-left text-base leading-[1.6] text-gray-700">
              A simple and transparent process, designed around your success.
            </motion.p>
          </motion.div>

          <motion.p
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -12, scale: 0.92 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: -6, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={prefersReducedMotion ? { duration: 0.25 } : { type: "spring", stiffness: 160, damping: 13, delay: 0.25 }}
            className="display justify-self-start text-left text-[24px] md:justify-self-end md:text-right"
            aria-label="Growing Together Worldwide"
          >
            <span className="block">Growing</span>
            <span className="block">Together</span>
            <span className="block">Worldwide</span>
          </motion.p>
        </div>

        <motion.ol
          aria-label="Customer journey steps"
          variants={stepsContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="journey-steps relative m-0 grid list-none grid-cols-1 gap-y-5 p-0 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-6 md:grid-cols-7 md:gap-x-0 md:gap-y-0"
        >
          {steps.map((step, index) => (
            <JourneyItem
              key={`${step.title}-${index}`}
              step={step}
              index={index}
              total={steps.length}
              reducedMotion={!!prefersReducedMotion}
            />
          ))}
        </motion.ol>
      </div>

      <style>{`
        .customer-journey { background: #F6F5F0; }
        .journey-step { grid-column: span 1; }
        .journey-chevron { display: none; }
        @media (min-width: 768px) {
          .journey-chevron { display: flex; }
        }
        @media (hover: hover) and (min-width: 768px) {
          .journey-step:hover .journey-badge { background-color: var(--brand-green); }
          .journey-step:hover .journey-label { color: var(--brand-green); }
        }
        @media (max-width: 639px) {
          .journey-steps { padding-left: 52px; }
          .journey-steps::before { content: ""; position: absolute; left: 14px; top: 18px; bottom: 20px; border-left: 1px dashed rgba(47,125,79,.38); }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-illustration { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function JourneyItem({ step, index, total, reducedMotion }: { step: Step; index: number; total: number; reducedMotion: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = step.image ?? `/images/journey/step-${index + 1}.svg`;

  return (
    <>
      <motion.li
        aria-label={`Step ${index + 1}: ${step.title}`}
        variants={reducedMotion ? reducedFadeVariants : stepVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="journey-step relative flex min-w-0 items-center gap-3 py-2 sm:flex-col sm:gap-0 sm:py-0"
      >
        <motion.span
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0 }}
          whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reducedMotion ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 15, delay: index * 0.08 }}
          className="journey-badge absolute left-[-52px] top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--brand-dark)] text-[13px] font-bold leading-none text-white transition-colors duration-200 sm:relative sm:left-auto sm:top-auto sm:mb-2 sm:h-7 sm:w-7 sm:translate-y-0 md:mb-[-6px] md:h-[26px] md:w-[26px] md:text-[12px]"
        >
          {index + 1}
        </motion.span>

        <motion.div
          className="journey-illustration relative flex h-[104px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-teal-light sm:h-[96px] sm:w-[96px] md:h-[88px] md:w-[88px]"
          {...(reducedMotion
            ? {}
            : {
                animate: { y: [0, -4, 0] },
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
                whileHover: { y: -6, scale: 1.05 },
              })}
        >
          {imageFailed ? (
            <JourneyIllustration kind={index % 7} />
          ) : (
            <img
              src={image}
              alt={step.alt ?? step.title}
              onError={() => setImageFailed(true)}
              className="relative z-[1] h-auto w-full max-w-none object-contain mix-blend-multiply"
              style={{ transform: `scaleY(${[1.3, 1.4, 1.85, 1.4, 1.25, 2.2, 1][index] ?? 1.4})`, transformOrigin: "top center" }}
              loading="lazy"
            />
          )}
        </motion.div>

        <motion.p
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reducedMotion ? { duration: 0.2 } : { duration: 0.4, delay: index * 0.08 + 0.16 }}
          className="journey-label mb-0 line-clamp-2 max-w-[145px] text-left text-[13px] font-bold leading-[1.22] text-[var(--brand-dark)] transition-colors duration-200 sm:mt-2 sm:text-center sm:text-[12px] sm:leading-[1.2]"
        >
          {step.title}
        </motion.p>
      </motion.li>

      {index < total - 1 && (
        <motion.span
          aria-hidden="true"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
          whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, delay: index * 0.12 + 0.16 }}
          className="journey-chevron absolute hidden items-center justify-center text-[#2f7d4f]"
          style={{ left: `${(index + 1) * (100 / total) - 1.3}%`, top: "64px" }}
        >
          <ChevronRight size={18} strokeWidth={1.8} />
        </motion.span>
      )}
    </>
  );
}

export function JourneyIllustration({ kind }: { kind: number }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-hidden="true" className="relative z-[1] h-full w-full overflow-visible">
      <g stroke="#173F36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
        {kind === 0 && <>
          <path fill="#F2B878" d="M28 92V58c0-7 5-12 12-12h18c8 0 13 5 13 13v33Z" />
          <path fill="#F0C9A3" d="M39 51c0-13 8-21 20-21s19 8 19 20v15H39Z" />
          <path fill="#1A3440" d="M39 51c0-15 9-24 21-24 13 0 20 9 20 22v9H69l-7-12-8 8-15 3Z" />
          <path fill="none" d="M35 50c-10 0-11 6-11 14v7m52-20c10 0 12 7 12 15v5" />
          <rect x="80" y="58" width="24" height="24" rx="12" fill="#F5BE35"/><text x="86" y="75" fill="#173F36" stroke="none" fontSize="16" fontWeight="700">$</text>
          <path fill="#D9E9DC" d="M17 92h78v7H17z" />
        </>}
        {kind === 1 && <>
          <path fill="#FEF8E9" d="M26 21h48l17 17v63H26Z"/><path fill="#F4CF59" d="M74 21v18h17"/>
          <path fill="none" d="M39 50h32M39 60h27M39 70h22"/><circle cx="73" cy="79" r="20" fill="#F5BE35"/><text x="66" y="86" fill="#173F36" stroke="none" fontSize="21" fontWeight="700">$</text>
        </>}
        {kind === 2 && <>
          <rect x="19" y="34" width="66" height="53" rx="6" fill="#294965"/><rect x="24" y="39" width="56" height="43" rx="3" fill="#DCEEE5"/><circle cx="52" cy="60" r="15" fill="#54AA70"/><path fill="none" stroke="white" strokeWidth="4" d="m44 60 6 6 12-14"/><path fill="#F4CB54" d="M68 23c3-9 17-11 23 0l8 13H61Z"/><path fill="#E4AD36" d="M61 36h39v6H61z"/>
        </>}
        {kind === 3 && <>
          <path fill="#3C9B65" d="M19 91V57l18 10V55l19 12V42h34v49Z"/><path fill="#1B5A42" d="M53 42V30h10v12m10 0V23h9v19"/><path fill="#F5C64D" d="M25 75h8v9h-8zm18 0h8v9h-8zm28-20h8v8h-8zm0 19h8v9h-8z"/><path fill="none" d="M73 18c-5-6 5-8 1-13m7 13c-5-6 5-8 1-13"/><path fill="#69B66D" d="M30 48c10-10 17-4 15 3-6 6-11 5-15-3Z"/>
        </>}
        {kind === 4 && <>
          <path fill="#E8E3D6" d="M12 36h96v59H12Z"/><path fill="#D6D0C0" d="M12 36h96v9H12Z"/><path fill="none" d="M28 45v49m32-49v49m32-49v49"/><path fill="#536F6D" d="M20 71h82v21H20Z"/><path fill="#D89A4A" d="M25 74h20v13H25zm26 0h20v13H51zm27 0h19v13H78z"/><circle cx="52" cy="44" r="11" fill="#F0C49B"/><path fill="#203E46" d="M41 44c0-13 20-17 23-2v6H53l-7 7-5-4Z"/><path fill="#316B58" d="M41 57h25l7 30H35Z"/><path fill="#FFFDF5" d="M74 53h23v30H74z"/><path fill="none" d="m79 65 4 4 9-10m-9 13h9"/>
        </>}
        {kind === 5 && <>
          <path fill="#4B9BB0" d="M17 71h87l-14 23H33Z"/><path fill="#1C4656" d="M27 68h70v8H27Z"/><path fill="#E3A842" d="M35 47h18v19H35zm20-13h18v32H55zm20 12h18v20H75z"/><path fill="#DA5C43" d="M35 47h18v7H35zm20-13h18v7H55zm20 12h18v7H75z"/><path fill="none" d="M22 67V25h5v42m-5-35h20L27 46m65 21V20h5v47m-5-36H78l14 17"/>
        </>}
        {kind === 6 && <>
          <path fill="#F1C19A" d="M18 37c0-12 8-20 20-20s20 8 20 20v10H18Zm44 0c0-12 8-20 20-20s20 8 20 20v10H62Z"/><path fill="#315569" d="M18 40h40v13H18zm44 0h40v13H62Z"/><path fill="#E7A778" d="M51 61h18v9H51z"/><path fill="none" strokeWidth="5" d="m52 65-8 7 9 6 8-6 8 6 8-6-8-7"/><path fill="#3B9C68" d="M19 57h25v31H19zm57 0h25v31H76z"/><path fill="#F0C24D" d="M15 88h91v7H15z"/>
        </>}
        {kind === 7 && <>
          <circle cx="60" cy="60" r="42" fill="#DDEFE5" />
          <path fill="#F9FCF7" d="M60 18c-8 10-13 25-13 42s5 32 13 42c8-10 13-25 13-42S68 28 60 18Z" />
          <path fill="none" d="M20 60h80M29 39h62M29 81h62M60 18c-8 10-13 25-13 42s5 32 13 42c8-10 13-25 13-42S68 28 60 18Z" />
          <path fill="#4A9C73" d="m34 42 8-5 7 4 1 7-8 4-7-3Zm34-13 8-4 8 4-2 7-9 2-5-4Zm-5 43 9-3 8 5-2 10-8 5-7-8Zm-28 2 9-4 7 5-4 8-8 1-5-5Z" />
        </>}
        {kind === 8 && <>
          <path fill="#E3A842" d="M14 54h61v32H14z" />
          <path fill="#D65D49" d="M18 58h14v11H18zm18 0h14v11H36zm18 0h14v11H54z" />
          <path fill="#F7F5E9" d="M75 66h19l12 13v7H75Z" />
          <path fill="#9BC8C6" d="M81 70h11l8 9H81Z" />
          <path fill="none" d="M80 66v-8h8v8m-75 20h92" />
          <circle cx="34" cy="88" r="7" fill="#173F36" /><circle cx="88" cy="88" r="7" fill="#173F36" />
          <circle cx="34" cy="88" r="2" fill="#F6F5F0" /><circle cx="88" cy="88" r="2" fill="#F6F5F0" />
        </>}
        {kind === 9 && <>
          <path fill="#2F7D68" d="M13 72h96l-16 22H34Z" />
          <path fill="#D9E8DE" d="M28 45h56v26H28z" />
          <path fill="#E4A842" d="M34 49h15v10H34zm20 0h15v10H54zm20 0h8v10h-8z" />
          <path fill="#F7F5E9" d="M70 31h20v40H70zM76 20h9v11h-9z" />
          <path fill="none" d="M17 101c8-6 16 6 24 0s16 6 24 0 16 6 24 0 16 6 24 0" />
        </>}
      </g>
    </svg>
  );
}

export default CustomerJourney;
