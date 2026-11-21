import { useState } from "react";

const strengthsData = [
  {
    num: "01",
    title: "Process-Driven Production",
    text: "Structured production processes and defined quality controls help us maintain consistency across every batch and shipment.",
    ArtSvg: () => (
      <svg
        className="art"
        viewBox="0 0 400 400"
        fill="none"
        stroke="var(--brand-deep)"
        strokeWidth="3"
        aria-hidden="true"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          opacity=".18"
          strokeDasharray="3 12"
          strokeLinecap="round"
        />
        <circle cx="200" cy="200" r="130" opacity=".25" />
        <circle cx="200" cy="200" r="80" opacity=".35" />
        <circle cx="200" cy="200" r="34" fill="var(--brand-deep)" stroke="none" opacity=".85" />
        <circle cx="200" cy="20" r="12" fill="var(--brand-deep)" stroke="none" />
        <circle cx="330" cy="330" r="9" fill="var(--brand-deep)" stroke="none" opacity=".6" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Transparent Product Specifications",
    text: "Clear specifications, measurable parameters, and transparent communication give customers a clear understanding of what they are purchasing.",
    ArtSvg: () => (
      <svg className="art" viewBox="0 0 400 400" fill="var(--brand-deep)" aria-hidden="true">
        <rect x="40" y="70" width="320" height="22" rx="11" opacity=".9" />
        <rect x="40" y="120" width="250" height="22" rx="11" opacity=".6" />
        <rect x="40" y="170" width="290" height="22" rx="11" opacity=".4" />
        <rect x="40" y="220" width="190" height="22" rx="11" opacity=".25" />
        <line
          x1="40"
          y1="290"
          x2="360"
          y2="290"
          stroke="var(--brand-deep)"
          strokeWidth="16"
          strokeDasharray="3 17"
          opacity=".4"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Consistent Export-Grade Quality",
    text: "Rigorous quality checks at every stage help ensure that our coco substrate products consistently meet agreed specifications and customer requirements.",
    ArtSvg: () => (
      <svg
        className="art"
        viewBox="0 0 400 400"
        fill="none"
        stroke="var(--brand-deep)"
        strokeWidth="3"
        aria-hidden="true"
      >
        <circle
          cx="200"
          cy="200"
          r="170"
          strokeDasharray="3 11"
          strokeLinecap="round"
          opacity=".35"
        />
        <circle cx="200" cy="200" r="125" opacity=".4" />
        <path
          d="M130 205l50 50 95-110"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".9"
        />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Long-Term B2B Partnerships",
    text: "We focus on building lasting business relationships through responsive communication, reliable execution, and a clear understanding of our customers' requirements.",
    ArtSvg: () => (
      <svg
        className="art"
        viewBox="0 0 400 400"
        fill="none"
        stroke="var(--brand-deep)"
        strokeWidth="4"
        aria-hidden="true"
      >
        <circle cx="140" cy="200" r="100" opacity=".9" />
        <circle cx="260" cy="200" r="100" fill="var(--brand-deep)" fillOpacity=".15" />
        <circle cx="200" cy="200" r="30" fill="var(--brand-deep)" stroke="none" />
      </svg>
    ),
  },
];

export function OurStrengthsAccordion({ label = "Our Strengths" }: { label?: string } = {}) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="strengths-section-root bg-surface-teal-dark font-sans leading-[1.6] text-pure-white">
      <style>{`
        .strengths-wrap {
          width: 100%;
          padding-block: var(--section-space-mobile);
        }

        @media (min-width:1024px) {
          .strengths-wrap {
            padding-block: var(--section-space);
          }
        }

        .strengths-head {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: var(--heading-content-gap);
        }

        .strengths-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: var(--text-label);
          font-weight: 600;
          letter-spacing: var(--letter-label);
          text-transform: uppercase;
          color: var(--accent-green);
          margin: 0;
        }

        .strengths-eyebrow i {
          width: 44px;
          height: 2px;
          background: var(--accent-green);
          transform-origin: left;
          animation: grow .25s .1s both ease;
        }

        .strengths-head h2 {
          font-family: var(--font-display);
          font-weight: 400;
          margin: 0;
          font-size: var(--text-h2);
          line-height: var(--line-heading);
          letter-spacing: var(--letter-heading);
          color: var(--pure-white) !important;
          text-wrap: balance;
        }

        .strengths-head h2 span {
          display: block;
          overflow: hidden;
          padding-bottom: .06em;
        }

        .strengths-head h2 b {
          display: block;
          font-weight: inherit;
          animation: rise .25s both ease;
        }

        @keyframes rise { from { transform: translateY(105%); } }
        @keyframes grow { from { transform: scaleX(0); } }

        .strengths-rail {
          display: flex;
          gap: 10px;
          height: clamp(460px,62vh,560px);
        }

        .strengths-panel {
          position: relative;
          flex: 1 1 0;
          min-width: 0;
          overflow: hidden;
          border-radius: var(--radius-card);
          cursor: pointer;
          color: var(--pure-white);
          background: var(--brand-deep);
          transition: flex-grow .25s ease, background-color .25s ease, color .25s ease;
          outline-offset: 3px;
        }

        .strengths-panel:hover:not(.on) { background: var(--brand); }

        .strengths-panel.on {
          flex-grow: 7;
          background: var(--brand-soft);
          color: var(--brand-deep);
          cursor: default;
        }

        .strengths-panel:focus-visible { outline: 2px solid var(--pure-white); }

        .strengths-panel .n {
          position: absolute;
          top: 22px;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: .8rem;
          font-weight: 600;
          letter-spacing: .2em;
          transition: opacity .25s ease;
        }

        .strengths-panel .n i {
          width: 2px;
          height: 34px;
          background: var(--accent-green);
        }

        .strengths-panel .vt {
          position: absolute;
          left: 0;
          bottom: 26px;
          width: 100%;
          display: flex;
          justify-content: center;
          transition: opacity .25s ease;
        }

        .strengths-panel .vt span {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-family: var(--font-display);
          font-size: 1.25rem;
          white-space: nowrap;
          letter-spacing: .01em;
        }

        .strengths-panel.on .n,
        .strengths-panel.on .vt {
          opacity: 0;
        }

        .strengths-panel .art {
          position: absolute;
          right: -60px;
          top: -60px;
          width: min(460px,70%);
          opacity: 0;
          transform: scale(.85) rotate(-8deg);
          transition: opacity .25s .1s ease, transform .25s .1s ease;
          pointer-events: none;
        }

        .strengths-panel.on .art {
          opacity: 1;
          transform: none;
        }

        .strengths-panel .ghost {
          position: absolute;
          left: 34px;
          top: 14px;
          font-family: var(--font-display);
          font-size: clamp(7rem,15vw,12rem);
          line-height: 1;
          color: var(--brand-deep);
          opacity: 0;
          transition: opacity .25s .1s ease;
          letter-spacing: -.04em;
        }

        .strengths-panel.on .ghost { opacity: .1; }

        .strengths-panel .content {
          position: absolute;
          left: 0;
          bottom: 0;
          width: min(560px,100%);
          padding: 0 clamp(24px,3vw,40px) clamp(26px,3vw,40px);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .25s ease, transform .25s ease;
        }

        .strengths-panel.on .content {
          opacity: 1;
          transform: none;
          transition: opacity .25s .1s ease, transform .25s .1s ease;
        }

        .strengths-panel .content h3 {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: var(--text-h3);
          line-height: var(--line-heading);
          margin: 0 0 var(--space-4);
          letter-spacing: -.01em;
          color: var(--brand-deep) !important;
        }

        .strengths-panel .content p {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--brand-deep);
        }

        .strengths-panel .bar {
          display: block;
          width: 56px;
          height: 5px;
          border-radius: 3px;
          background: var(--brand-deep);
          margin-bottom: var(--space-6);
        }

        @media (max-width:900px){
          .strengths-rail { flex-direction: column; height: auto; }
          .strengths-panel { flex: none; height: 76px; transition: height .25s ease, background-color .25s ease, color .25s ease; border-radius: var(--radius-card); }
          .strengths-panel.on { height: 400px; }
          .strengths-panel .n { top: 0; left: 22px; width: auto; height: 76px; flex-direction: row; align-items: center; }
          .strengths-panel .n i { width: 30px; height: 2px; }
          .strengths-panel .vt { left: 80px; bottom: 0; width: auto; height: 76px; align-items: center; justify-content: flex-start; }
          .strengths-panel .vt span { writing-mode: horizontal-tb; transform: none; font-size: 1.05rem; white-space: normal; }
          .strengths-panel .art { width: 260px; right: -50px; top: -30px; }
          .strengths-panel .ghost { font-size: 7rem; left: 22px; top: 6px; }
        }

        @media (prefers-reduced-motion:reduce){
          .strengths-section-root *, .strengths-section-root *::before, .strengths-section-root *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="container strengths-wrap" aria-labelledby="t-strengths">
        <div className="strengths-head">
          <p className="strengths-eyebrow">
            <i />
            {label}
          </p>
          <h2 id="t-strengths">
            <span>
              <b>Built on Process. Driven by Quality.</b>
            </span>
          </h2>
        </div>

        <div className="strengths-rail">
          {strengthsData.map((item, idx) => {
            const isOn = idx === activeIdx;
            const { ArtSvg } = item;
            return (
              <div
                key={item.num}
                className={`strengths-panel ${isOn ? "on" : ""}`}
                role="button"
                tabIndex={0}
                aria-expanded={isOn}
                onClick={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                onMouseEnter={() => {
                  if (window.matchMedia("(hover:hover) and (min-width:901px)").matches) {
                    setActiveIdx(idx);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
              >
                <div className="n">
                  <span>{item.num}</span>
                  <i />
                </div>
                <div className="vt" aria-hidden="true">
                  <span>{item.title}</span>
                </div>
                <ArtSvg />
                <div className="ghost" aria-hidden="true">
                  {item.num}
                </div>
                <div className="content">
                  <span className="bar" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
