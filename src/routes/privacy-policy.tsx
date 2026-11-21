import { createFileRoute } from "@tanstack/react-router";
import { PageHero, pageMeta } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    pageMeta(
      "Privacy Policy",
      "How Arjuna Exports collects, uses, and protects personal data.",
      "/privacy-policy",
    ),
  component: PrivacyPolicy,
});

type PolicySubsection = { title: string; paragraphs?: string[]; items?: string[] };
type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  subsections?: PolicySubsection[];
};

const sections: PolicySection[] = [
  {
    title: "Collecting and Using Your Personal Data",
    paragraphs: [
      "This Privacy Policy describes our policies and procedures regarding the collection, use, and disclosure of your information when you use the service. It informs you about your privacy rights and how the law protects you. We use your personal data to provide and improve the service. By using the service, you agree to the collection and use of information in accordance with this Privacy Policy.",
    ],
  },
  {
    title: "Types of Data Collected",
    subsections: [
      {
        title: "Personal Data",
        paragraphs: [
          "While using our service, we may ask you to provide personally identifiable information that can be used to contact or identify you. This may include:",
        ],
        items: [
          "Email address",
          "First name and last name",
          "Phone number",
          "Address, State, Province, ZIP/Postal code, City",
        ],
      },
      {
        title: "Usage Data",
        paragraphs: [
          "Usage data is collected automatically when using the service. It may include your device’s Internet Protocol address (such as an IP address), browser type and version, the pages of our service that you visit, the time and date of your visit, time spent on those pages, unique device identifiers, and other diagnostic data.",
          "When you access the service with a mobile device, we may automatically collect the type and unique ID of your mobile device, its IP address, mobile operating system, mobile internet browser type, unique device identifiers, and other diagnostic data. We may also collect information that your browser sends whenever you visit our service or access it through a mobile device.",
        ],
      },
    ],
  },
  {
    title: "Tracking Technologies and Cookies",
    paragraphs: [
      "We use cookies and similar tracking technologies to track activity on our service and store certain information. These technologies include beacons, tags, and scripts that collect and track information and improve and analyze our service.",
      "Cookies or browser cookies are small files placed on your device. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. If you do not accept cookies, some parts of our service may not be available. Unless you adjust your browser settings to refuse cookies, our service may use them.",
      "Web beacons are small electronic files (also known as clear gifs, pixel tags, and single-pixel gifs) that may appear in certain sections of our service and emails. They allow us to count users who visit pages or open emails and to gather related website statistics, such as section popularity and system integrity checks.",
      "Cookies can be persistent or session cookies. Persistent cookies remain on your computer or mobile device when you go offline; session cookies are deleted when you close your browser. We use both types for the purposes below.",
    ],
    subsections: [
      { title: "Necessary / Essential Cookies", paragraphs: ["Type: Session Cookies", "Administered by: Us", "Purpose: These cookies are essential to provide services available through the website and enable you to use some of its features. They help authenticate users and prevent fraudulent use of user accounts. Without them, requested services cannot be provided."] },
      { title: "Cookies Policy / Notice Acceptance Cookies", paragraphs: ["Type: Persistent Cookies", "Administered by: Us", "Purpose: These cookies identify whether users have accepted the use of cookies on the website."] },
      { title: "Functionality Cookies", paragraphs: ["Type: Persistent Cookies", "Administered by: Us", "Purpose: These cookies allow us to remember choices you make, such as login details or language preference, for a more personalized experience and to avoid asking you to re-enter your preferences each time."] },
    ],
  },
  {
    title: "Use of Your Personal Data",
    paragraphs: ["The Company may use personal data for the following purposes:"],
    items: [
      "To provide and maintain our service, including monitoring its usage.",
      "To perform a contract, including developing, complying with, and carrying out purchase contracts for products, items, or services you have purchased, or any other contract with us through the service.",
      "To contact you by email, telephone calls, SMS, or equivalent electronic communications about updates or information related to functionality, products, or contracted services, including security updates when necessary or reasonable.",
      "To provide news, special offers, and general information about goods, services, and events similar to those you have already purchased or enquired about, unless you have opted out.",
      "To manage and respond to your requests.",
      "For other purposes, such as data analysis, identifying usage trends, determining the effectiveness of promotional campaigns, and evaluating and improving our products, services, marketing, and your experience.",
    ],
  },
  {
    title: "Sharing Your Personal Data",
    paragraphs: ["We may share your personal information in the following situations:"],
    items: [
      "With service providers to monitor and analyze use of our service and to contact you.",
      "With affiliates, provided they honor this Privacy Policy. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.",
      "With business partners to offer you certain products, services, or promotions.",
      "With other users when you share personal information or interact in public areas. Such information may be viewed by all users and publicly distributed. If you interact with other users or register through a third-party social media service, your contacts on that service may see your name, profile, pictures, and activity. Other users may also view your activity, communicate with you, and view your profile.",
      "With your consent, for any other purpose.",
    ],
  },
  {
    title: "Retention of Your Personal Data",
    paragraphs: [
      "The Company will retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use it as necessary to comply with legal obligations, resolve disputes, and enforce our legal agreements and policies.",
      "The Company will also retain usage data for internal analysis. Usage data is generally kept for a shorter period, except when it is used to strengthen security or improve service functionality, or when we are legally required to retain it longer.",
    ],
  },
  {
    title: "Transfer of Your Personal Data",
    paragraphs: [
      "Your information, including personal data, is processed at the Company’s operating offices and wherever the parties involved in processing are located. This means your information may be transferred to and maintained on computers outside your state, province, country, or other governmental jurisdiction, where data protection laws may differ.",
      "Your consent to this Privacy Policy, followed by your submission of information, represents your agreement to that transfer.",
      "The Company will take all steps reasonably necessary to ensure your data is treated securely and in accordance with this Privacy Policy. No transfer of your personal data will take place to an organization or country unless adequate controls are in place, including controls for the security of your data and other personal information.",
    ],
  },
  {
    title: "Delete Your Personal Data",
    paragraphs: [
      "You have the right to delete or request that we assist in deleting the personal data we have collected about you. Our service may give you the ability to delete certain information about yourself.",
      "You may update, amend, or delete your information at any time by signing in to your account, if you have one, and visiting the account settings section. You may also contact us to request access to, correct, or delete personal information you have provided.",
      "We may need to retain certain information when we have a legal obligation or lawful basis to do so.",
    ],
  },
  {
    title: "Disclosure of Your Personal Data",
    subsections: [
      { title: "Law Enforcement", paragraphs: ["Under certain circumstances, the Company may be required to disclose your personal data if required by law or in response to valid requests by public authorities, such as a court or government agency."] },
      { title: "Other Legal Requirements", paragraphs: ["The Company may disclose your personal data in the good-faith belief that such action is necessary to:"], items: ["Comply with a legal obligation", "Protect and defend the rights or property of the Company", "Prevent or investigate possible wrongdoing in connection with the service", "Protect the personal safety of users of the service or the public", "Protect against legal liability"] },
    ],
  },
  {
    title: "Security of Your Personal Data",
    paragraphs: ["The security of your personal data is important to us. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security."],
  },
  {
    title: "Links to Other Websites",
    paragraphs: ["Our service may contain links to other websites that are not operated by us. If you click a third-party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of third-party sites or services."],
  },
  {
    title: "Changes to This Privacy Policy",
    paragraphs: ["We may update our Privacy Policy from time to time. We will notify you of changes by posting the new Privacy Policy on this page. We will let you know by email and/or a prominent notice on our service before a change becomes effective, and update the ‘Last updated’ date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically. Changes are effective when posted on this page."],
  },
  {
    title: "Contact Us",
    paragraphs: ["If you have any questions about this Privacy Policy, you can contact us by email at info@arjunaexports.com or by visiting www.arjunaexports.com."],
  },
];

function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Last updated: March 19, 2024"
        title="Privacy Policy"
        intro="How we collect, use, and protect your personal data."
      />
      <div className="bg-offwhite py-12 sm:py-16">
        <div className="container max-w-4xl">
          <div className="space-y-10">
            {sections.map((section) => (
              <section className="border-t border-charcoal/15 pt-6" key={section.title}>
                <h2 className="display mb-4 text-2xl text-[#20555A]">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p className="mb-3 leading-relaxed text-charcoal/75" key={paragraph}>{paragraph}</p>)}
                {section.items && <ul className="mb-4 list-disc space-y-2 pl-6 leading-relaxed text-charcoal/75">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.subsections?.map((subsection) => (
                  <div className="mb-6" key={subsection.title}>
                    <h3 className="mb-2 text-lg font-semibold text-charcoal">{subsection.title}</h3>
                    {subsection.paragraphs?.map((paragraph) => <p className="mb-3 leading-relaxed text-charcoal/75" key={paragraph}>{paragraph}</p>)}
                    {subsection.items && <ul className="list-disc space-y-2 pl-6 leading-relaxed text-charcoal/75">{subsection.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
