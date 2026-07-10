import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Terms & Conditions - Kampus Filter",
  description: "Read our comprehensive Terms & Conditions, DMCA policy, Acceptable Use, and Community Guidelines.",
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="July 9, 2026">
      <p>
        These Terms & Conditions (&ldquo;Terms&rdquo;) govern your access to and use of Kampus Filter (the &ldquo;Platform&rdquo;). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">1. Acceptance of Terms</h2>
      <p>
        By visiting, browsing, subscribing to, or otherwise using any part of Kampus Filter, you acknowledge that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy and all other policies referenced herein.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">2. Eligibility</h2>
      <p>
        Kampus Filter is intended for use by individuals who are at least 13 years of age, or the minimum age of digital consent in their jurisdiction. By using the Platform, you represent that you meet this age requirement, or that you are using the Platform under the supervision of a parent or legal guardian.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">3. Permitted Use</h2>
      <p>
        You may use Kampus Filter for lawful, personal, non-commercial purposes, including reading and browsing published content, subscribing to the newsletter or browser notifications, sharing links to our content, and submitting support queries.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">4. Prohibited Use & Acceptable Use Policy</h2>
      <p>
        You agree not to:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li>Use automated tools (bots, scrapers, crawlers) to extract content at scale without prior written permission.</li>
        <li>Attempt to gain unauthorized access to any part of the Platform, its Firebase Firestore databases, Netlify hosting, or Turso backend.</li>
        <li>Interfere with or disrupt the Platform's functionality, servers, or network streams.</li>
        <li>Use the Platform to transmit spam, malware, or any harmful scripts.</li>
        <li>Misrepresent your identity or impersonate any person or entity.</li>
        <li>Use the Platform for any unlawful purpose or in violation of any local, national, or international regulations.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">5. Intellectual Property & Copyright Policy</h2>
      <p>
        All original content published on Kampus Filter — including articles, guides, graphics, logos, and creative works — is the property of Kampus Filter or used under appropriate license, and is protected under applicable copyright law.
      </p>
      <p className="mt-2">
        We recognize the doctrine of fair use (or fair dealing), which permits limited use of copyrighted material without permission for purposes such as commentary, criticism, news reporting, or education. For any reproduction, replication, or commercial use beyond this scope, please contact us through our <strong>Copyright Requests</strong> channel to seek permission.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">6. DMCA notice-and-takedown Policy</h2>
      <p>
        Kampus Filter respects the intellectual property rights of others and responds to valid notices of alleged copyright infringement in accordance with applicable laws, including the U.S. Digital Millennium Copyright Act (DMCA).
      </p>
      <p className="mt-2 font-semibold">Notice Requirements:</p>
      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
        If you believe content on Kampus Filter infringes your copyright, please submit a written notice through our <strong>Copyright Requests</strong> contact channel that includes: (1) A signature of the copyright owner or authorized representative; (2) Identification of the copyrighted work claimed to have been infringed; (3) Identification of the specific material on Kampus Filter that you claim is infringing, including the URL; (4) Your contact details; (5) A statement of good-faith belief; and (6) A statement, made under penalty of perjury, that the notice is accurate.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">7. User Submission Policy</h2>
      <p>
        While you do not need an account to read content, any feedback, form responses, or messages you submit through our contact forms are treated as non-confidential. By submitting, you grant Kampus Filter a non-exclusive, perpetual, royalty-free, worldwide license to use, reproduce, modify, and distribute your feedback for operational purposes.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">8. Community Guidelines</h2>
      <p>
        Although Kampus Filter does not currently offer public comment sections, these guidelines apply to direct communications with our team. You must treat our staff respectfully. Harassment, threats, spam, targeted abuse, illegal content submissions, or the propagation of harmful misinformation through our contact channels is strictly prohibited.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">9. Disclaimer of Warranties</h2>
      <p>
        THE PLATFORM AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">10. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KAMPUS FILTER AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF, OR INABILITY TO USE, THE PLATFORM.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">11. Governing Law & Legal Compliance</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict-of-law principles, unless otherwise required by applicable local law in your jurisdiction. We make no representation that the Platform is appropriate or available for use in all locations worldwide.
      </p>
    </PolicyLayout>
  );
}
