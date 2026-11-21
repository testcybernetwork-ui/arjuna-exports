import { motion, useReducedMotion } from "framer-motion";

export function AboutHeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="about-hero-section scroll-mt-20 bg-white pt-16 text-[#123f3b] lg:scroll-mt-[88px] lg:pt-16"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#25856f]">
            About Us
          </p>
          <h1 className="mb-6 font-['DM_Sans',system-ui,sans-serif] text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-[#123f3b]">
            About Arjuna Exports
          </h1>
          <div className="space-y-4 text-[15px] leading-7 text-[#425c58] sm:text-base">
            <p className="font-semibold text-[#123f3b]">
              Founded in 2019, Arjuna Exports is a South India–based Exporter of coco substrate solutions for professional growers, horticultural businesses, and international customers.
            </p>
            <p>
              Our foundation comes from a deep understanding of coconut cultivation and the agricultural ecosystem. Combined with engineering expertise and global corporate experience, this has shaped the way we approach product development, quality management, customer requirements, and international trade.
            </p>
            <p>
              We believe that a growing medium is more than a commodity. Consistency, technical suitability, and reliable execution directly influence growing performance. Our focus is therefore on delivering coco substrate solutions that meet defined specifications and provide customers with greater confidence from sourcing to application.
            </p>
            <h2 className="pt-2 text-left font-['DM_Sans',system-ui,sans-serif] text-xl font-bold leading-tight text-[#123f3b] sm:text-2xl">
              Built Around Long-Term Partnerships
            </h2>
            <p>
              Our objective extends beyond supplying a product. We aim to create a transparent, professional, and dependable buying experience for international customers through clear communication, accurate documentation, consistent quality, and reliable execution.
            </p>
            <p>
              Today, our products serve customers across international markets, supporting growers and horticultural businesses with coco-based substrate solutions tailored to their requirements.
            </p>
            <p>
              From our agricultural roots in Tamil Nadu to growing businesses around the world, Arjuna Exports is committed to raising the standard of coco substrate supply.
            </p>
            <p className="pt-2 font-semibold text-[#176052]">
              Rooted in Agriculture. Built for the World.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
