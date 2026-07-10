import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "About Us - Kampus Filter",
  description: "Learn more about our mission, vision, and values at Kampus Filter.",
};

export default function AboutUsPage() {
  return (
    <PolicyLayout title="About Us" lastUpdated="July 9, 2026">
      <p className="lead text-base font-semibold text-foreground/80 mb-6">
        <strong>Kampus Filter</strong> is a daily student intelligence platform that helps students make smarter education and career decisions in just a few minutes a day.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">Our Mission</h2>
      <p>
        Our mission is simple: <strong>Help students filter the noise and make better decisions.</strong> Rather than helping students consume more content, the platform helps them take meaningful action toward building their future.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">Our Concept</h2>
      <p>
        Kampus Filter filters through the overwhelming amount of information students face and delivers only the updates, opportunities, and insights that actually matter. It functions as a daily briefing designed to help ambitious students make smarter decisions in just a few minutes a day.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">Core Content Pillars</h2>
      <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground mt-3">
        <li><strong>Education:</strong> Important updates related to exams, admissions, scholarships, and universities.</li>
        <li><strong>Opportunities:</strong> Internships, competitions, fellowships, ambassador programs, scholarships, and other opportunities.</li>
        <li><strong>Career Signals:</strong> Emerging careers, future skills, industry trends, salaries, and insights that help students stay ahead.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">Core Audience</h2>
      <p>
        The platform primarily serves Class 11 and Class 12 students, drop-year aspirants, and students preparing for competitive exams.
      </p>
    </PolicyLayout>
  );
}
