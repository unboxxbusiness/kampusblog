export const siteConfig = {
  name: "Kampus Filter",
  tagline: "The 5-Minute Briefing for Ambitious Students.",
  description: "Kampus Filter is a daily student intelligence platform that helps students make smarter education and career decisions in just a few minutes a day.",
  url: "https://kampusfilter.com",
  ogImage: "https://kampusfilter.com/og-default.jpg",
  links: {
    twitter: "https://twitter.com/kampusfilter",
    linkedin: "https://linkedin.com/company/kampusfilter",
    facebook: "https://facebook.com/kampusfilter",
  },
  // All valid database category values (7 priority categories)
  categories: [
    "University Admissions",
    "Scholarships",
    "Internships",
    "Student Opportunities",
    "Education News",
    "Career Signals",
    "Future Skills",
  ] as const,
  // Mapping of category list for database search/query matches
  categoryMapping: {
    "university-admissions": "University Admissions",
    "scholarships": "Scholarships",
    "internships": "Internships",
    "student-opportunities": "Student Opportunities",
    "education-news": "Education News",
    "career-signals": "Career Signals",
    "future-skills": "Future Skills",
  } as Record<string, string>,
  // LearnHub dropdown items mapped exactly to these 7 categories
  learnHubCategories: [
    { name: "University Admissions", path: "/university-admissions", dbCategory: "University Admissions" },
    { name: "Scholarships", path: "/scholarships", dbCategory: "Scholarships" },
    { name: "Internships", path: "/internships", dbCategory: "Internships" },
    { name: "Student Opportunities", path: "/student-opportunities", dbCategory: "Student Opportunities" },
    { name: "Education News", path: "/education-news", dbCategory: "Education News" },
    { name: "Career Signals", path: "/career-signals", dbCategory: "Career Signals" },
    { name: "Future Skills", path: "/future-skills", dbCategory: "Future Skills" },
  ] as const,
};
