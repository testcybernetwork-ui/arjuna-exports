/**
 * Server-side enquiry submission handler.
 *
 * This file runs ONLY on the server (TanStack Start server function).
 * The Resend API key is read from process.env — never sent to the browser.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { Resend } from "resend";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EnquiryPayload {
  // Common fields
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  email: string;
  requestPurpose?: "quote" | "sample";
  website?: string;
  phone?: string;
  enquiryType: "partnership" | "product" | "general";

  // Partnership fields
  marketSegment?: string;
  marketSegmentOther?: string;
  partnershipRole?: string;
  partnershipRoleOther?: string;
  partnershipRequirements?: string;

  // Product fields
  currentCustomer?: string;
  product?: string;
  productCategory?: string;
  productCategoryOther?: string;
  requiredDocuments?: string;
  additionalInformation?: string;

  // General fields
  generalRole?: string;
  generalRoleOther?: string;
  generalComments?: string;

  // Consent
  marketingConsent: boolean;

  // Honeypot – must be empty
  _hp_website?: string;
}

type SubmitResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

const MAX_LEN = 2000;
const MAX_SHORT = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function stripNewlines(s: string): string {
  return s.replace(/[\r\n]/g, " ");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateString(
  val: unknown,
  label: string,
  opts: { required?: boolean; maxLen?: number } = {},
): { value: string; error?: string } {
  const { required = false, maxLen = MAX_SHORT } = opts;
  if (val === undefined || val === null || val === "") {
    if (required) return { value: "", error: `${label} is required.` };
    return { value: "" };
  }
  if (typeof val !== "string") return { value: "", error: `${label} must be text.` };
  const trimmed = val.trim();
  if (required && trimmed.length === 0) return { value: "", error: `${label} is required.` };
  if (trimmed.length > maxLen) return { value: "", error: `${label} is too long (max ${maxLen}).` };
  return { value: trimmed };
}

function isEnquiryPayload(value: unknown): value is EnquiryPayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  const requiredStringFields = ["firstName", "lastName", "company", "country", "email"];
  const optionalStringFields = [
    "website",
    "phone",
    "marketSegment",
    "marketSegmentOther",
    "partnershipRole",
    "partnershipRoleOther",
    "partnershipRequirements",
    "currentCustomer",
    "product",
    "productCategory",
    "productCategoryOther",
    "requiredDocuments",
    "additionalInformation",
    "generalRole",
    "generalRoleOther",
    "generalComments",
    "_hp_website",
  ];

  const enquiryType = payload["enquiryType"];
  return (
    requiredStringFields.every((field) => typeof payload[field] === "string") &&
    optionalStringFields.every(
      (field) => payload[field] === undefined || typeof payload[field] === "string",
    ) &&
    typeof enquiryType === "string" &&
    ["partnership", "product", "general"].includes(enquiryType) &&
    typeof payload["marketingConsent"] === "boolean" &&
    (payload["requestPurpose"] === undefined ||
      payload["requestPurpose"] === "quote" ||
      payload["requestPurpose"] === "sample")
  );
}

/* ------------------------------------------------------------------ */
/*  Rate limiter (in-memory, per-process; resets on cold start)        */
/* ------------------------------------------------------------------ */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Build email body                                                   */
/* ------------------------------------------------------------------ */

function buildEmailHtml(data: EnquiryPayload): string {
  const rows: [string, string][] = [
    ["Enquiry type", data.enquiryType],
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Company", data.company],
    ["Country", data.country],
    ["Email", data.email],
  ];

  if (data.phone) rows.push(["Phone", data.phone]);
  if (data.website) rows.push(["Website", data.website]);

  // Enquiry-specific fields
  if (data.enquiryType === "partnership") {
    if (data.marketSegment) rows.push(["Market segment", data.marketSegment]);
    if (data.marketSegmentOther) rows.push(["Market segment (other)", data.marketSegmentOther]);
    if (data.partnershipRole) rows.push(["Role", data.partnershipRole]);
    if (data.partnershipRoleOther) rows.push(["Role (other)", data.partnershipRoleOther]);
    if (data.partnershipRequirements) rows.push(["Requirements", data.partnershipRequirements]);
  }
  if (data.enquiryType === "product") {
    rows.push([
      "Request purpose",
      data.requestPurpose === "sample" ? "Sample request" : "Quote request",
    ]);
    if (data.currentCustomer) rows.push(["Current customer", data.currentCustomer]);
    if (data.product) rows.push(["Product", data.product]);
    if (data.productCategory) rows.push(["Product category", data.productCategory]);
    if (data.productCategoryOther) rows.push(["Product category (other)", data.productCategoryOther]);
    if (data.requiredDocuments) rows.push(["Required documents", data.requiredDocuments]);
    if (data.additionalInformation) rows.push(["Additional info", data.additionalInformation]);
  }
  if (data.enquiryType === "general") {
    if (data.generalRole) rows.push(["Role", data.generalRole]);
    if (data.generalRoleOther) rows.push(["Role (other)", data.generalRoleOther]);
    if (data.generalComments) rows.push(["Comments", data.generalComments]);
  }

  rows.push(["Marketing consent", data.marketingConsent ? "Yes" : "No"]);

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;white-space:nowrap;border-bottom:1px solid #eee">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#20555A">New ${escapeHtml(data.enquiryType)} enquiry from arjunaexports.com</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${tableRows}</table>
      <p style="color:#888;font-size:12px">This email was sent automatically from the Arjuna Exports contact form.</p>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/*  Server function                                                    */
/* ------------------------------------------------------------------ */

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!isEnquiryPayload(data)) throw new Error("Invalid enquiry form data.");
    return data;
  })
  .handler(async ({ data }): Promise<SubmitResult> => {
    // --- Rate limiting ---
    // In Vercel / serverless, IP can be extracted from headers in middleware.
    // For basic protection, we use an in-memory rate limiter keyed by a hash.
    const clientIp = getRequestIP({ xForwardedFor: true }) ?? "unknown";

    if (isRateLimited(clientIp)) {
      console.warn(`[enquiry] Rate limited`);
      return { success: false, error: "Too many requests. Please wait a few minutes and try again." };
    }

    // --- Honeypot check ---
    if (data._hp_website && data._hp_website.trim().length > 0) {
      // Silently succeed for bots
      console.warn(`[enquiry] Honeypot triggered`);
      return { success: true };
    }

    // --- Field validation ---
    const fieldErrors: Record<string, string> = {};
    const optionalFields: Array<[keyof EnquiryPayload, string, number]> = [
      ["website", "Website", MAX_SHORT],
      ["phone", "Phone", MAX_SHORT],
      ["marketSegment", "Market segment", MAX_SHORT],
      ["marketSegmentOther", "Market segment", MAX_SHORT],
      ["partnershipRole", "Role", MAX_SHORT],
      ["partnershipRoleOther", "Role", MAX_SHORT],
      ["partnershipRequirements", "Requirements", MAX_LEN],
      ["currentCustomer", "Customer status", MAX_SHORT],
      ["product", "Product", MAX_SHORT],
      ["productCategory", "Product category", MAX_SHORT],
      ["productCategoryOther", "Product category", MAX_SHORT],
      ["requiredDocuments", "Required documents", MAX_LEN],
      ["additionalInformation", "Additional information", MAX_LEN],
      ["generalRole", "Role", MAX_SHORT],
      ["generalRoleOther", "Role", MAX_SHORT],
      ["generalComments", "Comments", MAX_LEN],
    ];
    for (const [field, label, maxLen] of optionalFields) {
      const validated = validateString(data[field], label, { maxLen });
      if (validated.error) fieldErrors[field] = validated.error;
    }

    const firstName = validateString(data.firstName, "First name", { required: true });
    if (firstName.error) fieldErrors["firstName"] = firstName.error;

    const lastName = validateString(data.lastName, "Last name", { required: true });
    if (lastName.error) fieldErrors["lastName"] = lastName.error;

    const company = validateString(data.company, "Company", { required: true });
    if (company.error) fieldErrors["company"] = company.error;

    const country = validateString(data.country, "Country", { required: true });
    if (country.error) fieldErrors["country"] = country.error;

    const email = validateString(data.email, "Email", { required: true });
    if (email.error) {
      fieldErrors["email"] = email.error;
    } else if (!EMAIL_RE.test(email.value)) {
      fieldErrors["email"] = "Please provide a valid email address.";
    }

    const website = validateString(data.website, "Website");
    const phone = validateString(data.phone, "Phone");

    const enquiryType = data.enquiryType;
    if (!["partnership", "product", "general"].includes(enquiryType)) {
      fieldErrors["enquiryType"] = "Invalid enquiry type.";
    }

    // Enquiry-type-specific validation
    if (enquiryType === "partnership") {
      const marketSegment = validateString(data.marketSegment, "Market segment", {
        required: true,
      });
      if (marketSegment.error) fieldErrors["marketSegment"] = marketSegment.error;

      const reqs = validateString(data.partnershipRequirements, "Requirements", {
        required: true,
        maxLen: MAX_LEN,
      });
      if (reqs.error) fieldErrors["partnershipRequirements"] = reqs.error;
      if (data.marketSegment === "Others") {
        const other = validateString(data.marketSegmentOther, "Market segment", {
          required: true,
        });
        if (other.error) fieldErrors["marketSegmentOther"] = other.error;
      }
      if (data.partnershipRole === "Others") {
        const other = validateString(data.partnershipRoleOther, "Role", { required: true });
        if (other.error) fieldErrors["partnershipRoleOther"] = other.error;
      }
    }
    if (enquiryType === "product") {
      const product = validateString(data.product, "Product", { required: true });
      if (product.error) fieldErrors["product"] = product.error;

      const documents = validateString(data.requiredDocuments, "Required documents", {
        required: true,
        maxLen: MAX_LEN,
      });
      if (documents.error) fieldErrors["requiredDocuments"] = documents.error;

      if (data.productCategory === "Others") {
        const other = validateString(data.productCategoryOther, "Product category", {
          required: true,
        });
        if (other.error) fieldErrors["productCategoryOther"] = other.error;
      }
    }
    if (enquiryType === "general") {
      if (data.generalRole === "Others") {
        const other = validateString(data.generalRoleOther, "Role", { required: true });
        if (other.error) fieldErrors["generalRoleOther"] = other.error;
      }
      const comments = validateString(data.generalComments, "Comments", {
        required: true,
        maxLen: MAX_LEN,
      });
      if (comments.error) fieldErrors["generalComments"] = comments.error;
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
    }

    // --- Environment check ---
    const apiKey = process.env["RESEND_API_KEY"];
    const emailFrom = process.env["EMAIL_FROM"] || "noreply@arjunaexports.com";
    const emailTo = process.env["EMAIL_TO"] || "info@arjunaexports.com";

    if (!apiKey) {
      console.error("[enquiry] RESEND_API_KEY is not set");
      return { success: false, error: "Email service is not configured. Please try again later." };
    }

    // --- Build and send email ---
    const sanitizedName = stripNewlines(`${firstName.value} ${lastName.value}`);
    const sanitizedCompany = stripNewlines(company.value);
    const subject = stripNewlines(
      `New ${enquiryType} enquiry from ${sanitizedName} – ${sanitizedCompany}`,
    );

    try {
      const resend = new Resend(apiKey);

      const { error } = await resend.emails.send({
        from: `Arjuna Exports <${emailFrom}>`,
        to: [emailTo],
        replyTo: email.value,
        subject,
        html: buildEmailHtml({
          ...data,
          firstName: firstName.value,
          lastName: lastName.value,
          company: company.value,
          country: country.value,
          email: email.value,
          website: website.value ? website.value : undefined,
          phone: phone.value ? phone.value : undefined,
        } as EnquiryPayload),
      });

      if (error) {
        console.error("[enquiry] Resend API error:", error);
        return { success: false, error: "Failed to send your enquiry. Please try again later." };
      }

      console.log(`[enquiry] Email sent for ${enquiryType} enquiry`);
      return { success: true };
    } catch (err) {
      console.error("[enquiry] Unexpected error:", err);
      return { success: false, error: "An unexpected error occurred. Please try again later." };
    }
  });
