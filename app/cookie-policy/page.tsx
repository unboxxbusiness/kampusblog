import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Cookie Policy - Kampus Filter",
  description: "Read our Cookie Policy to understand what cookies we use and how to manage them.",
};

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy" lastUpdated="July 9, 2026">
      <p>
        Cookies are small text files stored on your device when you visit a website. Kampus Filter uses cookies and similar technologies for the following purposes:
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">1. Essential Cookies</h2>
      <p>
        These cookies are necessary for the Platform to function properly — for example, enabling core site navigation, security features, and dark mode theme persistence. Essential cookies cannot be disabled without affecting site functionality.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">2. Analytics Cookies</h2>
      <p>
        We use analytics cookies (such as those from Google Analytics) to understand aggregate visitor behavior, including which pages are visited, how long visitors stay, and which content performs well. This helps us optimize and improve the Platform.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">3. Preference Cookies</h2>
      <p>
        Preference cookies may be used to remember choices you have made on the site (such as display or notification preferences) so we can provide a more consistent and personalized experience on return visits.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">4. Managing Cookies</h2>
      <p>
        You can control or disable cookies through your browser settings. Most browsers allow you to:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li>View what cookies are stored and delete them individually.</li>
        <li>Block third-party cookies.</li>
        <li>Block all cookies from specific or all websites.</li>
        <li>Delete all cookies when you close your browser.</li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Please note that disabling essential cookies may affect the layout and core functionality of the Platform.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-6 mb-2">5. Third-Party Cookies</h2>
      <p>
        Some cookies are placed by third-party services we use, such as Google Analytics and, where applicable, Netlify. These third parties have their own privacy and cookie policies, which we encourage you to review.
      </p>
    </PolicyLayout>
  );
}
