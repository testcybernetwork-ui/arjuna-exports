export function PurposeSection() {
  return (
    <section className="w-full bg-[#f2faf6] py-8 text-[#123f3b] sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="mb-8 w-full sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#25856f]">
            Our Direction
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#123f3b]">
            Purpose in every partnership.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#49645e] sm:text-base">
            A clear mission guides how we work today. A global vision keeps us building for what
            growers and international partners will need tomorrow.
          </p>
        </div>

        <div className="grid gap-8 border-t border-[#c9e3d8] pt-8 md:grid-cols-2 md:gap-12">
          <article className="min-w-0 md:border-r md:border-[#c9e3d8] md:pr-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#25856f]">
              Vision
            </p>
            <h3 className="text-xl font-semibold leading-snug text-[#123f3b] sm:text-2xl">
              A Global Vision for Better Growing
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-[#49645e]">
              To build a globally trusted coco substrate company that sets new standards for
              quality, transparency, and professionalism in horticultural supply.
            </p>
          </article>

          <article className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#25856f]">
              Mission
            </p>
            <h3 className="text-xl font-semibold leading-snug text-[#123f3b] sm:text-2xl">
              Turning Knowledge into Growing Solutions
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-[#49645e]">
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
