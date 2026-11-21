import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  Container,
  FileText,
  Handshake,
  Loader2,
  Mail,
  MapPin,
  Orbit,
  Phone,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { img, products } from "@/lib/site-data";
import { PageHero, pageMeta } from "@/components/site/PageHero";
import { Label, PrimaryButton, Reveal } from "@/components/site/primitives";
import { DeskPhoneIcon } from "@/components/site/DeskPhoneIcon";
import { submitEnquiry } from "@/lib/submit-enquiry";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta(
      "Contact",
      "Talk to Arjuna Exports about coco products, specifications, samples and global supply.",
    ),
  validateSearch: (search: Record<string, unknown>) => ({
      product: typeof search["product"] === "string" ? search["product"] : undefined,
  }),
  component: Contact,
});

const contactCards = [
  {
    key: "email",
    label: "Email",
    value: "info@arjunaexports.com",
    href: "mailto:info@arjunaexports.com",
    icon: Mail,
    isEmail: true,
  },
  {
    key: "mobile",
    label: "Mobile / WhatsApp",
    value: "+91 96298 74555",
    href: "tel:+919629874555",
    icon: Phone,
    isEmail: false,
  },
  {
    key: "landline",
    label: "Landline",
    value: "+91 4288 250125",
    href: "tel:+914288250125",
    icon: DeskPhoneIcon,
    isEmail: false,
  },
];

const responseSteps = [
  {
    icon: FileText,
    title: "Specification review",
    text: "We check product format, EC level, crop application and packing requirements.",
  },
  {
    icon: Container,
    title: "Export planning",
    text: "We align quantity, palletisation, destination and container loading plans.",
  },
  {
    icon: CheckCircle2,
    title: "Quote follow-up",
    text: "You receive the next steps or a clear quotation.",
  },
];

const commonFields = [
  { label: "First name", name: "firstName", required: true },
  { label: "Last name", name: "lastName", required: true },
  { label: "Company", name: "company", required: true },
  { label: "Country", name: "country", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  { label: "Website", name: "website", type: "url", required: false },
  { label: "Phone", name: "phone", type: "tel", required: false },
];

const enquiryTypes = [
  { value: "partnership", label: "Partnership", icon: Handshake },
  { value: "product", label: "Products", icon: ShoppingCart },
  { value: "general", label: "General", icon: Orbit },
] as const;

const productCategoryOptions = [
  "Bulk Purchase (FCL)",
  "Private Label",
  "Retail (LCL)",
  "Others",
] as const;

const marketSegmentOptions = [
  "Professional Greenhouse Grower",
  "Lawn and Landscapers",
  "Substrate Manufacturers",
  "Retailer/Garden Centre/ Nurseries",
  "Horticulture & Floriculture",
  "Potting Mix Suppliers",
  "Importer/Distributor/Wholesaler",
  "Others",
] as const;

const partnershipRoleOptions = [
  "Business Owner/Partner/CEO",
  "Product Development",
  "Purchase Department",
  "Buying Decision Maker",
  "Buying/Sourcing Agent",
  "Others",
] as const;

type EnquiryType = (typeof enquiryTypes)[number]["value"];

const inputClass =
  "mt-2 h-12 w-full rounded-sm border border-brand/35 bg-pure-white px-4 text-base font-normal text-brand-deep outline-none transition-colors placeholder:text-charcoal/55 focus:border-2 focus:border-accent-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green";

function Contact() {
  const search = Route.useSearch();
  const initialProduct = products.find((product) => product.slug === search.product);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(
    initialProduct ? "product" : "partnership",
  );
  const [selectedProduct, setSelectedProduct] = useState(initialProduct?.slug ?? "");
  const [generalRole, setGeneralRole] = useState("Vendor");
  const [productCategory, setProductCategory] = useState("Bulk Purchase (FCL)");
  const [marketSegment, setMarketSegment] = useState("Professional Greenhouse Grower");
  const [partnershipRole, setPartnershipRole] = useState("Business Owner/Partner/CEO");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setErrorMessage(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    const payload = {
      firstName: (formData.get("firstName") as string) || "",
      lastName: (formData.get("lastName") as string) || "",
      company: (formData.get("company") as string) || "",
      country: (formData.get("country") as string) || "",
      email: (formData.get("email") as string) || "",
      website: (formData.get("website") as string) || "",
      phone: (formData.get("phone") as string) || "",
      enquiryType,
      marketingConsent: formData.get("marketingConsent") === "on",
      // Honeypot field
      _hp_website: (formData.get("_hp_website") as string) || "",
      // Partnership fields
      marketSegment: (formData.get("marketSegment") as string) || undefined,
      marketSegmentOther: (formData.get("marketSegmentOther") as string) || undefined,
      partnershipRole: (formData.get("partnershipRole") as string) || undefined,
      partnershipRoleOther: (formData.get("partnershipRoleOther") as string) || undefined,
      partnershipRequirements: (formData.get("partnershipRequirements") as string) || undefined,
      // Product fields
      currentCustomer: (formData.get("currentCustomer") as string) || undefined,
      product: (formData.get("product") as string) || undefined,
      productCategory: (formData.get("productCategory") as string) || undefined,
      productCategoryOther: (formData.get("productCategoryOther") as string) || undefined,
      requiredDocuments: (formData.get("requiredDocuments") as string) || undefined,
      additionalInformation: (formData.get("additionalInformation") as string) || undefined,
      // General fields
      generalRole: (formData.get("generalRole") as string) || undefined,
      generalRoleOther: (formData.get("generalRoleOther") as string) || undefined,
      generalComments: (formData.get("generalComments") as string) || undefined,
    };

    try {
      const result = await submitEnquiry({ data: payload });
      if (result.success) {
        setSent(true);
      } else {
        setErrorMessage(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    } catch {
      setErrorMessage("Something went wrong. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  function fieldErrorEl(fieldName: string) {
    const err = fieldErrors[fieldName];
    if (!err) return null;
    return <span className="mt-1 block text-xs text-red-600">{err}</span>;
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <span className="block">
            <span className="block">Share Your Requirement…</span>
            <span className="block">We'll Take It From There!</span>
          </span>
        }
        titleClassName="contact-hero-title max-w-none pb-1 text-body-text"
        introClassName="contact-hero-intro"
        gridClassName="lg:grid-cols-[1.45fr_.55fr] xl:grid-cols-[1.5fr_.5fr]"
        intro="Tell us what you need to source, where it needs to go and in what volume. We'll evaluate your requirements and guide you through product specification, packaging and shipment planning."
        image={img.exportPort}
      />

      <section className="bg-surface-cream py-16 lg:py-24">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="grid auto-rows-fr gap-6 md:grid-cols-2">
              {contactCards.map((card) => (
                <Reveal key={card.key} className="h-full">
                  <a
                    href={card.href}
                    aria-label={`${card.label}: ${card.value}`}
                    className="contact-card group flex h-full min-h-[140px] overflow-hidden transition-transform hover:-translate-y-1"
                  >
                    <span className="flex w-24 shrink-0 items-center justify-center bg-brand sm:w-28 lg:w-24 xl:w-28">
                      <card.icon
                        className="h-10 w-10 text-pure-white sm:h-12 sm:w-12"
                        strokeWidth={1.7}
                        aria-hidden
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-center px-3.5 py-5 text-center sm:px-4 sm:py-6 lg:px-3 xl:px-5">
                      <span
                        className={`min-w-0 font-semibold leading-tight text-body-text ${
                          card.isEmail ? "whitespace-nowrap text-sm" : "whitespace-nowrap text-base"
                        }`}
                      >
                        {card.value}
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
              </div>
              <p className="contact-response-note mt-5">We&apos;ll respond within 24 hours.</p>
            </div>

            <Reveal delay={120} className="h-full">
              <address className="contact-card flex h-full min-h-[140px] overflow-hidden not-italic">
                <span className="flex w-24 shrink-0 items-center justify-center bg-brand sm:w-28 lg:w-24 xl:w-28">
                  <MapPin
                    className="h-10 w-10 text-pure-white sm:h-12 sm:w-12"
                    strokeWidth={1.7}
                    aria-hidden
                  />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-center px-4 py-6 sm:px-6 xl:px-8">
                  <div
                    className="flex min-w-0 flex-col justify-center text-left text-sm font-semibold leading-body tracking-normal text-body-text"
                  >
                    <span>1/140-12, GM Complex,</span>
                    <span>Opposite TMB Bank,</span>
                    <span>Kumaramangalam Post,</span>
                    <span>Tiruchengode Taluk,</span>
                    <span>Namakkal District,</span>
                    <span>Tamil Nadu – 637205, India.</span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Kumaramangalam+Namakkal+Tamil+Nadu+637205"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                    >
                      Get directions
                    </a>
                  </div>
                </span>
              </address>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface-cream pb-20 lg:pb-24">
        <div className="container grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
          <Reveal className="lg:order-2">
            <form
              id="contact-form"
              onSubmit={submit}
              className="contact-form rounded-md border bg-pure-white p-5 sm:p-8 lg:p-10"
            >
              {sent ? (
                <div className="grid min-h-[480px] place-items-center rounded-sm bg-brand-soft p-8 text-center" role="status" aria-live="polite">
                  <div className="max-w-lg">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-pure-white">
                      <CheckCircle2 className="h-8 w-8" strokeWidth={1.7} aria-hidden />
                    </span>
                    <Label className="mt-8 justify-center text-brand">Thank you</Label>
                    <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.75rem)]">
                      Your enquiry is ready for our team.
                    </h2>
                    <p className="mt-5 text-center text-charcoal/65">
                      Thanks — we&apos;ll be in touch soon.
                    </p>
                    <PrimaryButton type="button" onClick={() => { setSent(false); setErrorMessage(null); setFieldErrors({}); }} className="mt-8">
                      Send another enquiry
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="grid grid-cols-3 rounded-sm bg-brand p-3 sm:p-5"
                    role="tablist"
                    aria-label="Choose enquiry type"
                  >
                    {enquiryTypes.map(({ value, label, icon: Icon }) => {
                      const selected = enquiryType === value;
                      return (
                        <button
                          key={value}
                          id={`${value}-tab`}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          aria-controls="enquiry-tab-panel"
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setEnquiryType(value)}
                          onKeyDown={(event) => {
                            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                            event.preventDefault();
                            const tabs = Array.from(
                              event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                                '[role="tab"]',
                              ) ?? [],
                            );
                            const currentIndex = tabs.indexOf(event.currentTarget);
                            const direction = event.key === "ArrowRight" ? 1 : -1;
                            tabs[(currentIndex + direction + tabs.length) % tabs.length]?.click();
                          }}
                          className="contact-tab group flex min-h-12 min-w-0 flex-col items-center gap-3 px-1 py-2 text-center text-pure-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pure-white"
                        >
                          <span className="site-menu-font text-xs uppercase tracking-[.08em]">
                            {label}
                          </span>
                          <span
                            className={`contact-tab__icon grid h-14 w-14 place-items-center rounded-full transition-all sm:h-16 sm:w-16 ${
                              selected
                                ? "-translate-y-0.5 bg-pure-white/25 ring-2 ring-pure-white shadow-lg"
                                : "bg-pure-white/10 group-hover:-translate-y-0.5"
                            }`}
                          >
                            <Icon className="h-7 w-7 text-pure-white sm:h-8 sm:w-8" strokeWidth={1.8} aria-hidden />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" name="category" value={enquiryType} />
                  <div
                    id="enquiry-tab-panel"
                    role="tabpanel"
                    aria-labelledby={`${enquiryType}-tab`}
                    tabIndex={0}
                  >

                  {/* Honeypot – hidden from real users, traps bots */}
                  <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", top: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <label>
                      Don&apos;t fill this out
                      <input type="text" name="_hp_website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className="mt-9">
                    <Label className="text-brand">{enquiryType} enquiry</Label>
                    <h2 className="mt-4 text-2xl leading-tight sm:text-3xl">
                      {enquiryType === "partnership"
                        ? "We don't just fulfil orders; we participate in every partnership."
                        : enquiryType === "product"
                          ? "Products inquiry form"
                          : "General inquiry form"}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/58">
                      {enquiryType === "partnership"
                        ? "Complete the partnership form below, and our team will reach out to you."
                        : enquiryType === "product"
                          ? "Tell us which products, documents and order format you require."
                          : "Send your comments or questions and we'll connect you with the right team."}
                    </p>
                  </div>

                  {/* Error banner */}
                  {errorMessage && (
                    <div className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                    {commonFields.map((f) => (
                      <label key={f.name} className="block">
                        <span className="micro-label text-brand">
                          {f.label}
                          {f.required ? " *" : " (optional)"}
                        </span>
                        <input
                          name={f.name}
                          required={f.required}
                          type={f.type ?? "text"}
                          placeholder={f.label}
                          className={`${inputClass} ${fieldErrors[f.name] ? "!border-red-400" : ""}`}
                        />
                        {fieldErrorEl(f.name)}
                      </label>
                    ))}
                  </div>

                  {enquiryType === "partnership" && (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className="micro-label text-brand">Market segment *</span>
                        <select
                          name="marketSegment"
                          className={inputClass}
                          required
                          value={marketSegment}
                          onChange={(event) => setMarketSegment(event.target.value)}
                        >
                          {marketSegmentOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                      {marketSegment === "Others" && (
                        <label className="block">
                          <span className="micro-label text-brand">Others (Please Specify) *</span>
                          <input name="marketSegmentOther" required className={inputClass} />
                        </label>
                      )}
                      <label className="block">
                        <span className="micro-label text-brand">Best describes me (optional)</span>
                        <select
                          name="partnershipRole"
                          className={inputClass}
                          value={partnershipRole}
                          onChange={(event) => setPartnershipRole(event.target.value)}
                        >
                          {partnershipRoleOptions.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                      {partnershipRole === "Others" && (
                        <label className="block">
                          <span className="micro-label text-brand">Others (Please Specify) *</span>
                          <input name="partnershipRoleOther" required className={inputClass} />
                        </label>
                      )}
                      <label className="block sm:col-span-2">
                        <span className="micro-label text-brand">
                          Detailed requirements and inputs *
                        </span>
                        <textarea
                          name="partnershipRequirements"
                          required
                          rows={5}
                          className={`mt-2 block w-full resize-y rounded-sm border border-brand/18 bg-pure-white px-4 py-3 text-base font-medium text-brand-deep outline-none transition-colors focus:border-brand ${fieldErrors["partnershipRequirements"] ? "!border-red-400" : ""}`}
                        />
                        {fieldErrorEl("partnershipRequirements")}
                      </label>
                    </div>
                  )}

                  {enquiryType === "product" && (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <fieldset className="sm:col-span-2">
                        <legend className="micro-label text-brand">
                          Are you a current Arjuna Exports customer? (optional)
                        </legend>
                        <div className="mt-3 flex gap-8 text-sm font-medium text-brand-deep">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="currentCustomer" value="yes" defaultChecked />
                            Yes
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="currentCustomer" value="no" /> No
                          </label>
                        </div>
                      </fieldset>
                      <label className="block">
                        <span className="micro-label text-brand">Product name *</span>
                        <select
                          name="product"
                          className={inputClass}
                          value={selectedProduct}
                          onChange={(event) => setSelectedProduct(event.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {products.map((product) => (
                            <option key={product.slug} value={product.slug}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="micro-label text-brand">Product category (optional)</span>
                        <select
                          name="productCategory"
                          className={inputClass}
                          value={productCategory}
                          onChange={(event) => setProductCategory(event.target.value)}
                        >
                          {productCategoryOptions.map((category) => (
                            <option key={category}>{category}</option>
                          ))}
                        </select>
                      </label>
                      {productCategory === "Others" && (
                        <label className="block">
                          <span className="micro-label text-brand">Others (Please Specify) *</span>
                          <input name="productCategoryOther" required className={inputClass} />
                        </label>
                      )}
                      <label className="block sm:col-span-2">
                        <span className="micro-label text-brand">
                          Required documents or information *
                        </span>
                        <textarea
                          name="requiredDocuments"
                          rows={4}
                          required
                          className="mt-2 block w-full resize-y rounded-sm border border-brand/18 bg-pure-white px-4 py-3 text-base font-medium text-brand-deep outline-none transition-colors focus:border-brand"
                        />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="micro-label text-brand">Additional information (optional)</span>
                        <textarea
                          name="additionalInformation"
                          rows={4}
                          className="mt-2 block w-full resize-y rounded-sm border border-brand/18 bg-pure-white px-4 py-3 text-base font-medium text-brand-deep outline-none transition-colors focus:border-brand"
                        />
                      </label>
                    </div>
                  )}

                  {enquiryType === "general" && (
                    <div className="mt-6 grid gap-6">
                      <label className="block sm:max-w-[calc(50%-0.625rem)]">
                        <span className="micro-label text-brand">Best describes me (optional)</span>
                        <select
                          name="generalRole"
                          className={inputClass}
                          value={generalRole}
                          onChange={(event) => setGeneralRole(event.target.value)}
                        >
                          <option>Vendor</option>
                          <option>Current Client</option>
                          <option>Press</option>
                          <option>Others</option>
                        </select>
                      </label>
                      {generalRole === "Others" && (
                        <label className="block sm:max-w-[calc(50%-0.625rem)]">
                          <span className="micro-label text-brand">Others (Please Specify) *</span>
                          <input name="generalRoleOther" required className={inputClass} />
                        </label>
                      )}
                      <label className="block">
                        <span className="micro-label text-brand">Your comments / questions *</span>
                        <textarea
                          name="generalComments"
                          required
                          rows={6}
                          className={`mt-2 block w-full resize-y rounded-sm border border-brand/18 bg-pure-white px-4 py-3 text-base font-medium text-brand-deep outline-none transition-colors focus:border-brand ${fieldErrors["generalComments"] ? "!border-red-400" : ""}`}
                        />
                        {fieldErrorEl("generalComments")}
                      </label>
                    </div>
                  )}

                  <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-charcoal/65">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      required
                      className="mt-1 h-4 w-4 accent-brand"
                    />
                    <span>
                      <strong aria-hidden="true">*</strong>{" "}
                      By opting in, I agree to receive marketing offers, updates and other
                      communications from Arjuna Exports, and understand that my personal data will
                      be stored and processed in line with the privacy policy.
                    </span>
                  </label>
                  {fieldErrorEl("marketingConsent")}

                  <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-charcoal/10 pt-7">
                    <div className="max-w-md">
                      <p className="font-semibold text-brand-deep">
                        Your enquiry is reviewed by our export team.
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal/55">
                        Your details are used to respond to this enquiry and prepare the right
                        product or export follow-up.
                      </p>
                    </div>
                    <PrimaryButton type="submit" disabled={sending} className="relative w-full sm:w-auto">
                      {sending && (
                        <Loader2 className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin" aria-hidden />
                      )}
                      <span className={sending ? "invisible" : ""}>Submit</span>
                    </PrimaryButton>
                  </div>
                  </div>
                </>
              )}
            </form>
          </Reveal>

          <aside className="space-y-6 lg:order-1 lg:sticky lg:top-28">
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-md bg-brand-deep text-pure-white">
                <div className="relative aspect-[4/3] p-6">
                  <img
                    src={img.appGreenhouse}
                    alt="Greenhouse crops grown in coco medium"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/12 to-transparent" />
                  <div className="absolute right-6 bottom-6 left-6">
                    <span className="micro-label text-aqua">Export support</span>
                    <h2 className="display mt-3 text-3xl">From sample to container.</h2>
                  </div>
                </div>
                <div className="grid gap-px bg-pure-white/12">
                  {responseSteps.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="bg-brand-deep p-6">
                      <div className="flex gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-pure-white/18 text-aqua">
                          <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                        </span>
                        <span>
                          <span className="block font-semibold">{title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-pure-white">
                            {text}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="rounded-md border border-brand/12 bg-brand-soft p-6">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-pure-white text-brand">
                    <Sparkles className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                  </span>
                  <p className="text-sm leading-relaxed text-brand-deep/72">
                    We don't just fulfil orders; we actively engage with our partners to build
                    lasting, mutually beneficial relationships.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <p className="px-1 text-sm font-medium leading-relaxed text-charcoal/68">
                To facilitate an accurate and efficient quotation, please provide your target EC,
                particle grade, packaging requirements, private-label specifications and destination
                market, where applicable. It would reduce back-and-forth during quoting.
              </p>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
