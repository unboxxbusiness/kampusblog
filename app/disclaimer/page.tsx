import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Disclaimer - Kampus Filter",
  description: "Read our disclaimers on AI, career, technology, finance, investments, and accessibility.",
};

export default function DisclaimerPage() {
  return (
    <PolicyLayout title="Disclaimer" lastUpdated="July 9, 2026">
      <h2 className="font-heading text-lg font-bold text-foreground mb-2">1. Educational Disclaimer</h2>
      <p>
        Content on Kampus Filter is provided for general educational and informational purposes only. It is not a substitute for formal education, professional training, or university-accredited certification programs. We make reasonable efforts to ensure accuracy, but we do not guarantee that any content will meet your specific learning objectives.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">2. Technology Disclaimer</h2>
      <p>
        The technology landscape, including AI tools, API platforms, and integration services referenced on Kampus Filter, changes rapidly. Features, pricing, and availability of third-party tools may change after publication without our knowledge. We recommend verifying current details directly with the tool or service provider before making implementation decisions.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">3. AI Disclaimer</h2>
      <p>
        Kampus Filter publishes content about artificial intelligence and, in some cases, uses AI-assisted workflows to help produce that content (see our AI Content Policy). AI systems can make mistakes, generate outdated information, or reflect the limitations of their training data. We apply human review whenever practical, but readers should exercise independent judgment and verify critical information from primary sources.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">4. Career Disclaimer</h2>
      <p>
        Career-related content on Kampus Filter (including résumé tips, job market analysis, and skill recommendations) reflects general guidance and does not constitute personalized career counseling. Outcomes depend on many individual factors we cannot account for. We do not guarantee employment, promotion, or specific career outcomes as a result of following our content.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">5. Financial & Investment Disclaimer</h2>
      <p>
        Any content touching on financial topics (such as business growth strategies, monetization of AI tools, or pricing of software) is provided for general informational purposes only and does not constitute financial advice. 
      </p>
      <p className="mt-2">
        Kampus Filter does not provide investment advice, and nothing on the Platform should be interpreted as a recommendation to buy, sell, or hold any security, cryptocurrency, or investment product. Consult a qualified financial professional before making financial decisions.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">6. External Links & Sourcing Disclaimer</h2>
      <p>
        Kampus Filter may link to third-party tools, articles, and resources for reference. We do not control, endorse, or take responsibility for the accuracy, legality, or content of external websites.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">7. Affiliate Disclosure</h2>
      <p>
        In some instances, we may include affiliate links to recommended software, services, or books. This means we may earn a small commission if you make a purchase through these links, at no additional cost to you. We only recommend tools we believe provide real value.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">8. Advertising Policy</h2>
      <p>
        We may display advertisements or sponsored posts on the Platform. Any sponsored content will be clearly labeled as such. Our editorial standards are independent, and advertising partnerships do not influence our reviews, tutorials, or guides.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">9. Accessibility Statement</h2>
      <p>
        Kampus Filter is committed to ensuring digital accessibility for all users, including people with disabilities. We continually apply improvements to enhance the user experience and conform to relevant accessibility guidelines.
      </p>
    </PolicyLayout>
  );
}
