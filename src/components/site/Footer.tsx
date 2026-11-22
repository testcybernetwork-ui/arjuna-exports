import { Link } from "@tanstack/react-router";
import { Globe2, Leaf, Mail, MapPin, MessageCircle, Phone, Sprout, Trees } from "lucide-react";
import logo from "@/assets/logo.svg";
import plantation from "@/assets/stage-husk.jpg";
import { ImageZoomButton } from "@/components/site/ImageZoom";
import { navItems, products } from "@/lib/site-data";
import { ContentTodo } from "./primitives";

const footerNavItems = navItems.filter((item) => item.to !== "/");

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/arjunaexports" },
  { label: "Instagram", href: "https://www.instagram.com/arjunaexports/" },
  { label: "Facebook", href: "https://www.facebook.com/ArjunaExports/" },
];

const footerValues = [
  { title: "Renewable Resource", description: "Giving value to nature’s by-product", icon: Leaf },
  { title: "Sustainable Solutions", description: "Supporting greener cultivation", icon: Sprout },
  { title: "Global Impact", description: "Serving growers worldwide", icon: Globe2 },
  {
    title: "Long-Term Partnerships",
    description: "Growing together for a better tomorrow",
    icon: Trees,
  },
];

function SocialIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-icon">
      {label === "Instagram" && (
        <>
          <defs>
            <linearGradient id="footer-instagram-gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFB13D" />
              <stop offset="48%" stopColor="#E1306C" />
              <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill="url(#footer-instagram-gradient)" />
          <rect
            x="5.5"
            y="5.5"
            width="13"
            height="13"
            rx="3.5"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="white" strokeWidth="1.8" />
          <circle cx="16.3" cy="7.9" r="1" fill="white" />
        </>
      )}
      {label === "LinkedIn" && (
        <>
          <circle cx="12" cy="12" r="12" fill="#0A66C2" />
          <text
            x="12"
            y="17"
            textAnchor="middle"
            fill="white"
            fontFamily="Poppins, sans-serif"
            fontSize="13"
            fontWeight="700"
            letterSpacing="-1"
          >
            in
          </text>
        </>
      )}
      {label === "Facebook" && (
        <>
          <circle cx="12" cy="12" r="12" fill="#0866FF" />
          <path
            d="M13.7 24V13.1h3.6l.55-4.25H13.7V6.14c0-1.23.34-2.07 2.1-2.07H18V.27C17.62.22 16.3.1 14.76.1c-3.2 0-5.4 1.95-5.4 5.54v3.21H5.74v4.25h3.62V24h4.34Z"
            fill="white"
            transform="translate(1.8 0) scale(.84)"
          />
        </>
      )}
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <section className="footer-story" aria-labelledby="footer-story-title">
        <img
          src={plantation}
          alt="Coconut palms growing in a tropical plantation"
          className="footer-story-image"
          loading="lazy"
          decoding="async"
        />
        <ImageZoomButton src={plantation} alt="Coconut palms growing in a tropical plantation" />
        <div className="footer-story-wash" aria-hidden="true" />
        <div className="container footer-story-content">
          <h2 id="footer-story-title" className="footer-headline">
            <span>The journey continues</span>
            <span>From a coconut husk</span>
            <span className="footer-headline-accent">to new life.</span>
          </h2>
          <div className="footer-values">
            {footerValues.map(({ title, description, icon: Icon }) => (
              <div className="footer-value" key={title}>
                <Icon aria-hidden="true" className="footer-value-icon" />
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container footer-content">
        <div className="footer-columns">
          <div className="footer-company">
            <Link to="/" aria-label="Arjuna Exports home" className="footer-logo-link">
              <img src={logo} alt="Arjuna Exports" className="footer-logo" />
            </Link>
            <p className="footer-description">
              We supply premium coconut-based growing media to professional growers across global
              markets. Founded in 2019 and based in Tamil Nadu, India, Arjuna Exports is committed
              to consistent quality, transparent communication, reliable execution, and building
              long-term partnerships with customers worldwide.
            </p>
            <nav className="footer-socials" aria-label="Arjuna Exports social media">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <SocialIcon label={label} />
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          </div>

          <nav aria-label="Navigate the website" className="footer-nav">
            <h3 className="footer-column-heading">Navigate</h3>
            <ul className="footer-link-list">
              {footerNavItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products" className="footer-nav">
            <h3 className="footer-column-heading">Products</h3>
            <ul className="footer-link-list">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="footer-link"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-contact">
            <h3 className="footer-column-heading">Contact</h3>
            <address className="footer-address">
              <div className="footer-contact-item footer-address-item">
                <MapPin aria-hidden="true" className="footer-contact-icon" />
                <div className="footer-address-lines">
                  <strong>Arjuna Exports</strong>
                  <span>1/140-12, GM Complex,</span>
                  <span>Opposite TMB Bank,</span>
                  <span>Kumaramangalam Post,</span>
                  <span>Tiruchengode Taluk,</span>
                  <span>Namakkal District,</span>
                  <span>Tamil Nadu – 637205, India</span>
                </div>
              </div>
              <a
                href="mailto:info@arjunaexports.com"
                className="footer-contact-item footer-contact-link"
              >
                <Mail aria-hidden="true" className="footer-contact-icon" />
                <span>info@arjunaexports.com</span>
              </a>
              <a href="tel:+919629874555" className="footer-contact-item footer-contact-link">
                <Phone aria-hidden="true" className="footer-contact-icon" />
                <span>+91 96298 74555</span>
              </a>
              <a href="tel:+914288250125" className="footer-contact-item footer-contact-link">
                <Phone aria-hidden="true" className="footer-contact-icon" />
                <span>+91 4288 250125</span>
              </a>
              <a
                href="https://wa.me/919629874555"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-item footer-contact-link"
              >
                <MessageCircle aria-hidden="true" className="footer-contact-icon" />
                <span>WhatsApp</span>
              </a>
            </address>
          </div>
        </div>

        <div className="footer-legal">
          <div className="footer-legal-copy">
            <span>© 2026 Arjuna Exports. All rights reserved.</span>
            <span className="footer-credit">
              Crafted by{" "}
              <a
                href="https://www.devstudioco.com"
                target="_blank"
                rel="noopener"
                className="footer-credit-link"
              >
                The Development Studio
              </a>
            </span>
          </div>
          <div className="footer-legal-links">
            <Link to="/privacy-policy" className="footer-policy-link">
              Privacy Policy
            </Link>
            <span className="footer-region">Location: India</span>
          </div>
        </div>
      </div>
      <ContentTodo request="Supply Terms of Use text before publishing a Terms of Use page." />
    </footer>
  );
}
