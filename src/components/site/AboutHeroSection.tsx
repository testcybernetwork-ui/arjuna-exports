import { motion, useReducedMotion } from "framer-motion";
import { Label } from "./primitives";

export function AboutHeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="about-hero-section scroll-mt-20 bg-surface-cream text-body-text lg:scroll-mt-[88px]"
    >
      <div className="container py-14 lg:py-24">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <Label className="mb-4 text-brand">
            About Us
          </Label>
          <h1 className="display mb-6 text-h1 text-heading">
            About Arjuna Exports
          </h1>
          <div className="space-y-4 text-base leading-body text-body-text">
            <p className="font-semibold text-heading">
              Founded in 2019, Arjuna Exports is a South India–based Exporter of coco substrate solutions for professional growers, horticultural businesses, and international customers.
            </p>
            <p>
              Our foundation comes from a deep understanding of coconut cultivation and the agricultural ecosystem. Combined with engineering expertise and global corporate experience, this has shaped the way we approach product development, quality management, customer requirements, and international trade.
            </p>
            <p>
              We believe that a growing medium is more than a commodity. Consistency, technical suitability, and reliable execution directly influence growing performance. Our focus is therefore on delivering coco substrate solutions that meet defined specifications and provide customers with greater confidence from sourcing to application.
            </p>
            <h2 className="display pt-2 text-left text-h3 text-heading">
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
            <p className="pt-2 font-semibold text-brand">
              Rooted in Agriculture. Built for the World.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
