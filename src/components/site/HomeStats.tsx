import { CalendarDays, Container, Globe2, Package, Ship } from "lucide-react";

const homeStats = [
  { number: "2019", label: "Established", Icon: CalendarDays },
  { number: "6", label: "Product families", Icon: Package },
  { number: "12+", label: "Countries Served", Icon: Globe2 },
  { number: "120+", label: "Containers / year", Icon: Container },
  { number: "3,000+", label: "MT exported / year", Icon: Ship },
  // { number: "90%", label: "Customer Retention", Icon: Package }, Confirm before publishing.
];

export function HomeStats() {
  return (
    <section className="hero-stats-strip" aria-label="Arjuna Exports at a glance">
      <div className="container hero-stats-strip__inner">
        {homeStats.slice(0, 5).map(({ number, label, Icon }) => (
          <div className="hero-stats-strip__col" key={label}>
            <span className="hero-stats-strip__icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="hero-stats-strip__number">{number}</span>
            <span className="hero-stats-strip__underline" aria-hidden="true" />
            <span className="hero-stats-strip__label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
