import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo.svg";
import { navItems } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "./primitives";

const menuItems = navItems;

export function Header({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const menuButton = menuButtonRef.current;
    if (!menu) return;

    const getFocusableItems = () =>
      Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    getFocusableItems()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusableItems();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [open]);

  const splitProductHero = pathname.startsWith("/products/");
  const transparentOverHero = overHero && pathname === "/";
  const solid = scrolled || !transparentOverHero || splitProductHero;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          solid ? "bg-ivory/92 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div
          className={cn(
            "container flex h-16 items-center justify-between lg:h-[72px]",
            solid ? "text-charcoal" : "text-pure-white",
          )}
        >
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center"
            aria-label="Arjuna Exports home"
          >
            <img
              src={logo}
              alt="Arjuna Exports"
              className={cn(
                "h-auto w-[158px] transition-[filter] duration-250 sm:w-[174px]",
                !solid && "brightness-0 invert",
              )}
            />
          </Link>

          <nav
            className={cn(
              "site-menu-font hidden items-center gap-[clamp(24px,2vw,32px)] transition-colors duration-250 xl:flex",
              solid ? "text-brand" : "text-pure-white",
            )}
            aria-label="Primary"
          >
            {menuItems.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex min-h-11 items-center whitespace-nowrap py-1 text-sm tracking-[0.01em] transition-opacity duration-300 hover:opacity-70",
                    active && "opacity-100",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <PrimaryButton
              to="/contact"
              {...(pathname === "/contact" ? { hash: "contact-form" } : {})}
              className="hidden sm:inline-flex"
            >
              {pathname === "/contact" ? "Send enquiry" : "Request a quote"}
            </PrimaryButton>

            <button
              ref={menuButtonRef}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center xl:hidden"
            >
              <span className="relative block h-3 w-7">
                <span className="absolute inset-x-0 top-0 h-px bg-current" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-[60] overflow-y-auto bg-ivory transition-[opacity,visibility] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] xl:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" aria-label="Arjuna Exports home">
            <img src={logo} alt="Arjuna Exports" className="h-auto w-[158px]" />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center"
          >
            <span className="relative block h-5 w-5">
              <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav
          className="container flex min-h-[calc(100dvh-5rem)] flex-col justify-between gap-8 pt-4 pb-8"
          aria-label="Mobile"
        >
          <ul className="site-menu-font text-brand">
            {menuItems.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <li key={item.to} className="border-b border-charcoal/10">
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex items-baseline py-3.5", active && "text-brand")}
                  >
                    <span className="text-[30px] leading-none tracking-[0.01em] sm:text-[34px]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <PrimaryButton
            to="/contact"
            {...(pathname === "/contact" ? { hash: "contact-form" } : {})}
            className="w-full justify-center"
          >
            {pathname === "/contact" ? "Send enquiry" : "Request a quote"}
          </PrimaryButton>
        </nav>
      </div>
    </>
  );
}
