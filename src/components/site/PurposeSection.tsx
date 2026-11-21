import { Label } from "./primitives";

export function PurposeSection() {
  return (
    <section className="w-full bg-surface-teal-light py-14 text-body-text lg:py-24">
      <div className="container">
        <div className="mb-8 w-full">
          <Label className="mb-3 text-brand">
            Our Direction
          </Label>
          <h2 className="display text-h2 text-heading">
            Purpose in every partnership.
          </h2>
          <p className="mt-4 max-w-[70ch] text-base leading-body text-body-text">
            A clear mission guides how we work today. A global vision keeps us building for what
            growers and international partners will need tomorrow.
          </p>
        </div>

        <div className="grid gap-8 border-t border-brand/15 pt-8 md:grid-cols-2 md:gap-12">
          <article className="min-w-0 md:border-r md:border-brand/15 md:pr-10">
            <Label className="mb-2 text-brand">
              Vision
            </Label>
            <h3 className="display text-h3 text-heading">
              A Global Vision for Better Growing
            </h3>
            <p className="mt-4 text-base leading-body text-body-text">
              To build a globally trusted coco substrate company that sets new standards for
              quality, transparency, and professionalism in horticultural supply.
            </p>
          </article>

          <article className="min-w-0">
            <Label className="mb-2 text-brand">
              Mission
            </Label>
            <h3 className="display text-h3 text-heading">
              Turning Knowledge into Growing Solutions
            </h3>
            <p className="mt-4 text-base leading-body text-body-text">
              To transform coconut coir into reliable growing solutions by combining agricultural
              knowledge, technical discipline, consistent quality, and customer-focused execution —
              building long-term partnerships with growers and businesses worldwide.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
