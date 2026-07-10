import React from "react";
import PolicyLayout from "@/components/PolicyLayout";

export const metadata = {
  title: "Privacy Policy - Kampus Filter",
  description: "Read our comprehensive Privacy Policy covering data, cookies, push alerts, and user rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="July 9, 2026">
      <p>
        This Privacy Policy explains how Kampus Filter (&ldquo;Kampus Filter,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, stores, and protects information when you visit our website or use our services (collectively, the &ldquo;Platform&rdquo;). We designed this Platform to require as little personal information as possible. There are no user accounts, no login, and no user dashboard — meaning the vast majority of your interaction with Kampus Filter involves no personal data collection at all.
      </p>
      <p className="mt-4">
        This policy applies to all visitors, readers, and subscribers of Kampus Filter.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">1. Information We Collect</h2>
      <p>
        We collect information in three general ways: (a) information you voluntarily provide to us, (b) information collected automatically through your use of the Platform, and (c) information collected through third-party service providers acting on our behalf.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.1 Newsletter Data</h3>
      <p>
        If you choose to subscribe to our newsletter, we collect:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li>Name</li>
        <li>Mobile Number</li>
        <li>Email Address</li>
      </ul>
      <p>
        This information is stored using <strong>Firebase Firestore</strong>, a cloud database service provided by Google. We collect only what is necessary to deliver newsletter content and, where applicable, to personalize communications (such as addressing you by name).
      </p>
      <blockquote className="border-l-4 border-primary/20 pl-4 italic text-xs text-muted-foreground my-3">
        <strong>Note:</strong> Providing a mobile number for the newsletter is used strictly for subscription-related purposes (such as identity verification or SMS-based updates, if enabled) and is never used for cold-calling or unsolicited marketing outside the scope of the newsletter service you signed up for.
      </blockquote>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.2 Contact Form Data</h3>
      <p>
        When you use any of our contact channels, we collect the information you choose to submit, which may include your name, email address, and the content of your message. This data is used solely to respond to your inquiry and is not used for marketing unless you separately opt into our newsletter.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.3 Push Notification Tokens</h3>
      <p>
        If you opt into browser push notifications, your browser generates a unique <strong>device/browser token</strong> through <strong>Firebase Cloud Messaging (FCM)</strong>. This token allows us to send notifications to your browser but does not, by itself, reveal your identity, name, or contact details unless you have also subscribed to our newsletter using the same device.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.4 Analytics Data</h3>
      <p>
        We use analytics tools (such as Google Analytics) to understand how visitors use the Platform in aggregate. This may include pages visited, time spent on pages, navigation paths, general geographic location (city/region level, derived from IP address), device type, and screen resolution. Analytics data is aggregated and not used to individually identify you.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.5 Cookies</h3>
      <p>
        We use cookies and similar tracking technologies as described in our Cookie Policy. Cookies may be used for essential site functionality, analytics, and preference storage.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.6 Device & Browser Information</h3>
      <p>
        We may automatically collect information about the device you use to access the Platform, including device type, operating system, browser type, version, and screen size, primarily for the purpose of ensuring the site displays and functions correctly.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.7 IP Address</h3>
      <p>
        Your IP address may be logged automatically by our hosting provider (Netlify) and analytics tools for security, fraud prevention, and analytics purposes. We do not use IP addresses to individually track or profile users beyond standard analytics and security functions.
      </p>

      <h3 className="font-heading text-base font-semibold text-foreground mt-4 mb-1">1.8 Referral Information</h3>
      <p>
        We may collect information about the website or source that referred you to Kampus Filter (e.g., a search engine, social media platform, or another website), primarily for analytics purposes.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">2. How Information Is Used</h2>
      <p>
        We use the information described above for the following purposes:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li>To deliver our newsletter to subscribers who have opted in.</li>
        <li>To send push notifications to users who have opted in.</li>
        <li>To respond to inquiries submitted through our contact channels.</li>
        <li>To operate, maintain, and improve the Platform, including diagnosing technical issues.</li>
        <li>To understand aggregate usage patterns through analytics, helping us decide what content to create and how to improve the user experience.</li>
        <li>To maintain security, including detecting and preventing fraud, abuse, and unauthorized access.</li>
        <li>To comply with legal obligations, where applicable.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell personal data to third parties. We do <strong>not</strong> use your personal data for purposes unrelated to the ones described in this policy without obtaining your consent.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">3. How Information Is Stored</h2>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Newsletter subscriber data</strong> (name, mobile number, email address) is stored in <strong>Firebase Firestore</strong>, a Google Cloud-based NoSQL database, secured through Firebase's access control and encryption mechanisms.</li>
        <li><strong>Push notification tokens</strong> are managed through <strong>Firebase Cloud Messaging</strong>.</li>
        <li><strong>Article content and platform data</strong> are stored in <strong>Turso</strong>, a distributed SQLite-based database service.</li>
        <li><strong>The Platform itself is hosted on Netlify</strong>, which provides content delivery, hosting infrastructure, and edge network services.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">4. Data Security</h2>
      <p>
        We take reasonable technical and organizational measures designed to protect the information we hold, including:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li>Use of reputable, security-audited third-party infrastructure providers (Firebase/Google Cloud, Netlify, Turso).</li>
        <li>Encryption of data in transit via HTTPS/TLS across the Platform.</li>
        <li>Access restrictions limiting who within our organization can access stored personal data.</li>
        <li>Regular review of our data handling practices as the Platform evolves.</li>
      </ul>
      <p>
        No method of transmission or storage is 100% secure, and we cannot guarantee absolute security. However, we are committed to promptly investigating and addressing any suspected data security incident.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">5. Data Retention Policy</h2>
      <p>
        We retain personal data only as long as necessary for the purposes described in this policy, or as required by law:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Newsletter Data:</strong> Retained until you unsubscribe. Upon unsubscribing, your details are marked inactive and purged from our production databases within 30 days.</li>
        <li><strong>Contact Form Submissions:</strong> Retained for a maximum of 180 days to resolve support issues, after which they are deleted.</li>
        <li><strong>Push Notification Tokens:</strong> Firebase FCM tokens automatically expire or become invalid when you uninstall the app or clear browser storage. We purge inactive tokens periodically.</li>
        <li><strong>Analytics Logs:</strong> Google Analytics user and event data is set to automatically expire after 14 months.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">6. Push Notification Policy</h2>
      <p>
        Push notifications require your explicit browser-level permission. You will be prompted by your browser to allow or deny notifications from Kampus Filter; we cannot send notifications unless you grant this permission.
      </p>
      <p className="mt-2">
        Once permission is granted, your browser generates a unique token via Firebase Cloud Messaging, which we use to deliver notifications to your device.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">7. Third-Party Services</h2>
      <p>
        We rely on the following third-party service providers, each of which has its own privacy practices:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Firebase (Google):</strong> Used for newsletter data storage (Firestore) and push notification delivery (Cloud Messaging). Firebase is operated by Google LLC and is subject to Google's privacy and security practices.</li>
        <li><strong>Netlify:</strong> Used for website hosting and content delivery. Netlify may log standard web request data, including IP addresses, as part of its infrastructure operations.</li>
        <li><strong>Turso:</strong> Used for storing article and platform content (not personal subscriber data). Turso is a distributed database service built on libSQL/SQLite technology.</li>
        <li><strong>Google Analytics:</strong> Used for aggregate website usage analytics.</li>
      </ul>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">8. International Data Transfers</h2>
      <p>
        Because we rely on globally distributed infrastructure providers, your information may be processed or stored in countries other than your own, including the United States. Where required by applicable law, we rely on appropriate safeguards, such as standard contractual clauses offered by our infrastructure providers, to protect data transferred internationally.
      </p>

      <h2 className="font-heading text-lg font-bold text-foreground mt-8 mb-2">9. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have some or all of the following rights regarding your personal data:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground my-2">
        <li><strong>Right to access:</strong> request a copy of the personal data we hold about you.</li>
        <li><strong>Right to correction:</strong> request that inaccurate or incomplete data be corrected.</li>
        <li><strong>Right to deletion:</strong> request that we delete your personal data.</li>
        <li><strong>Right to withdraw consent:</strong> unsubscribe from the newsletter or disable push notifications at any time.</li>
        <li><strong>Right to lodge a complaint:</strong> with your local data protection authority, if you believe your rights have been violated.</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us through our <strong>Privacy Requests</strong> contact email.
      </p>
    </PolicyLayout>
  );
}
