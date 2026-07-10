import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Editorial & AI Content Policy - Kampus Filter",
  description: "Understand our editorial standards, fact-checking processes, AI-content guidelines, and ethics.",
};

export default function EditorialPolicyPage() {
  return (
    <PolicyLayout title="Editorial Policy" lastUpdated="July 9, 2026">
      <h2 className="font-heading text-lg font-bold text-foreground mb-2">1. Editorial Principles</h2>
      <p>
        Kampus Filter's editorial team is guided by the following principles:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Accuracy:</strong> We verify claims before publication wherever feasible.</li>
        <li><strong>Clarity:</strong> We write for a general audience, avoiding unnecessary jargon.</li>
        <li><strong>Usefulness:</strong> Every piece of content should help the reader do, understand, or decide something.</li>
        <li><strong>Independence:</strong> Editorial decisions are not influenced by advertisers or partners.</li>
        <li><strong>Timeliness:</strong> Given how quickly educational updates change, we prioritize keeping content current and flag outdated material where relevant.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">2. Content & Research Standards</h2>
      <p>
        All published content must be relevant to our core topics: Admissions, Scholarships, Internships, Student Opportunities, Education News, Career Signals, and Future Skills.
      </p>
      <p className="mt-2">
        Our content is researched using a combination of primary sources (official government documentation, university announcements, academic papers) and reputable secondary sources. We prioritize primary official sources (like UGC, NTA, or university circulars) whenever available.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">3. Fact Checking</h2>
      <p>
        Where practical, claims involving admission criteria, deadlines, scholarship eligibility criteria, or program details are cross-checked against official portals prior to publication. Given the fast-changing nature of the education sector, we rely on our Corrections Policy to catch and fix errors after publication.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">4. AI Content Policy</h2>
      <p>
        Kampus Filter uses AI-assisted workflows to support parts of our content creation process, which may include: drafting initial versions of articles, summarizing news announcements, and formatting information tables. AI is a <strong>tool</strong> used by our editorial process — it is not a substitute for human judgment on what to publish.
      </p>
      <p className="mt-2">
        We apply human review to AI-assisted content <strong>whenever practical</strong> before publication. This review process checks for factual accuracy, tone, clarity, and the removal of inaccurate or misleading AI-generated content.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">5. Corrections Policy</h2>
      <p>
        Errors identified after publication are corrected promptly:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Major Corrections:</strong> Involve substantive factual errors (incorrect deadlines, eligibility criteria, or wrong links). These are clearly noted within the article with a visible &ldquo;Correction&rdquo; tag and date.</li>
        <li><strong>Minor Corrections:</strong> Involve non-substantive fixes (typos, grammar, formatting). These are made directly without separate public notice.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">6. Ethics & Transparency Policy</h2>
      <p>
        Kampus Filter is committed to operating with high ethical standards. We do not present AI-generated content as being written entirely by a named human author unless a human wrote or substantively edited it. We avoid using AI to generate misleading, deceptive, or fabricated news.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">7. Content Licensing Policy</h2>
      <p>
        Except where otherwise indicated, all original text, checklists, and graphics published on Kampus Filter are copyrighted. You may quote short excerpts or use screenshots for educational, review, or non-commercial purposes, provided you include a clickable, followable link back to the source page on Kampus Filter.
      </p>
    </PolicyLayout>
  );
}
