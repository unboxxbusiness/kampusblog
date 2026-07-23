import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join("=").trim().replace(/(^["']|["']$)/g, "");
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

function slugify(text: string): string {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}

function calculateReadingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

export const ARTICLES = [

// ═══════════════════════════════════════════════════════════
// 1. UNIVERSITY ADMISSIONS — DU CSAS UG Round 2
// ═══════════════════════════════════════════════════════════
{
  title: "DU CSAS UG 2026 Round 2: Seat Allocation on July 25, Fee Deadline July 28",
  excerpt: "Delhi University's CSAS UG 2026 Round 2 seat allocation releases on July 25. Students must accept seats by July 26, complete document verification by July 27, and pay fees by July 28, 2026.",
  category: "University Admissions",
  image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "DU CSAS UG 2026, delhi university admission 2026, CSAS round 2 seat allotment, DU admission fee payment, CUET UG 2026",
  featured: true,
  tags: "university-admissions,DU,CSAS,delhi-university,CUET,2026",
  viral_score: 95,
  source_name: "Delhi University Official Portal",
  source_url: "https://admission.uod.ac.in/",
  content: `<p>The <strong>Delhi University CSAS UG 2026 Round 2 seat allocation</strong> is releasing on <strong>July 25, 2026</strong>. If you cleared CUET UG 2026 and applied to Delhi University, this is your critical action window — seat acceptance closes the same day, document verification runs July 25–27, and the fee payment deadline is <strong>July 28, 2026</strong>. Missing any single step means losing your seat.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Round 2 Allocation Date: July 25, 2026</strong> — Result releases on the DU admission portal (admission.uod.ac.in).</li>
    <li><strong>Seat Acceptance Window:</strong> July 25–26, 2026 (up to 11:59 PM).</li>
    <li><strong>Document Verification:</strong> July 25–27, 2026 — complete online verification with your college.</li>
    <li><strong>Fee Payment Deadline: July 28, 2026</strong> (up to 11:59 PM) — non-payment = automatic seat cancellation.</li>
    <li>Round 1 seat allotment was declared July 16; preference reordering closed July 21, 2026.</li>
  </ul>
</div>

<h2>What is DU CSAS UG 2026?</h2>
<p>The <strong>Common Seat Allocation System (CSAS)</strong> is Delhi University's centralised online admission process for all undergraduate programmes. Admissions are strictly based on <strong>CUET UG 2026 scores</strong> — Class 12 marks play no direct role in seat allocation. Once CUET results are declared, students register on the DU portal, fill programme and college preferences, and seats are allocated in multiple rounds.</p>

<h2>Complete Round 2 Schedule</h2>

<table class="geo-dates-table">
  <thead><tr><th>Event</th><th>Date & Deadline</th></tr></thead>
  <tbody>
    <tr><td>Round 1 Seat Allocation Declared</td><td>July 16, 2026</td></tr>
    <tr><td>Round 1 Seat Acceptance Closed</td><td>July 18, 2026</td></tr>
    <tr><td>Preference Reordering (Upgrade Eligible)</td><td>Closed July 21, 2026</td></tr>
    <tr><td><strong>Round 2 Seat Allocation Result</strong></td><td><strong>July 25, 2026</strong></td></tr>
    <tr><td>Round 2 Seat Acceptance Window</td><td>July 25 – July 26, 2026 (11:59 PM)</td></tr>
    <tr><td>College Online Document Verification</td><td>July 25 – July 27, 2026</td></tr>
    <tr><td><strong>Round 2 Fee Payment Deadline</strong></td><td><strong>July 28, 2026 (11:59 PM)</strong></td></tr>
  </tbody>
</table>

<h2>How the CSAS Round 2 Process Works</h2>

<div class="geo-mermaid">
flowchart TD
  A([Round 2 Result Released on July 25]) --> B{Check your allocated\\ncollege & programme}
  B -->|Satisfied| C[Accept Seat Online\\nbefore July 26, 11:59 PM]
  B -->|Want Upgrade| D[Accept & Keep Higher Preferences\\nfor Round 3]
  C --> E[Complete Online Document Verification\\nwith allocated College: July 25–27]
  D --> E
  E --> F[Pay Admission Fee Online\\nDeadline: July 28, 11:59 PM]
  F --> G([Seat Confirmed ✅])
</div>

<h2>Documents Required for Online Verification</h2>
<ul>
  <li>CUET UG 2026 Scorecard</li>
  <li>Class 10 and Class 12 Marksheets & Passing Certificate</li>
  <li>Aadhaar Card / Government-issued ID proof</li>
  <li>Category certificate — SC/ST/OBC-NCL/EWS (if applicable)</li>
  <li>PwBD certificate (if applicable)</li>
  <li>Passport-size photograph</li>
  <li>DU CSAS Application Reference Number</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Log in to admission.uod.ac.in on July 25 morning to check your Round 2 seat allocation and immediately decide whether to accept or retain higher preferences for Round 3.</p>
<p>2. Step 2 (Action): Upload all required documents to your college's verification portal between July 25–27 — incomplete submissions will hold up your admission confirmation.</p>
<p>3. Step 3 (Action): Complete the online fee payment before July 28, 11:59 PM — set a phone reminder right now, as no extensions are typically granted.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://admission.uod.ac.in/" target="_blank" rel="noopener">Delhi University Official Admission Portal — CSAS UG 2026</a></li>
    <li><a href="https://cuetug.ntaonline.in/" target="_blank" rel="noopener">CUET UG 2026 — NTA Official Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">When is the DU CSAS UG 2026 Round 2 result date?</h4>
    <p class="faq-answer">The DU CSAS UG 2026 Round 2 seat allocation result will be declared on July 25, 2026 on the official portal admission.uod.ac.in.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What happens if I miss the Round 2 fee payment deadline?</h4>
    <p class="faq-answer">If you fail to pay the admission fee by July 28, 2026 at 11:59 PM, your allocated seat will be automatically cancelled. You may still be considered in subsequent rounds but there is no guarantee of a seat in your preferred college or programme.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Can I still get a seat upgrade after Round 2?</h4>
    <p class="faq-answer">Yes. If you accept your Round 2 seat but retain higher preferences, you will be considered for seat upgrades in Round 3. You must accept and pay the fee even if you expect an upgrade — failing to pay cancels your current allotment.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Is DU admission purely based on CUET scores in 2026?</h4>
    <p class="faq-answer">Yes. Delhi University undergraduate admissions in 2026 are entirely based on CUET UG 2026 scores. Class 12 percentage marks do not directly determine your seat allocation under the CSAS system.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 2. UNIVERSITY ADMISSIONS — BITSAT 2026 Iteration IV
// ═══════════════════════════════════════════════════════════
{
  title: "BITSAT 2026 Iteration IV Allotment Out Today: Fee Deadline July 25, Classes Start August 2",
  excerpt: "BITS Pilani released Iteration IV seat allotment for all campuses on July 22, 2026. Fee payment deadline is July 25. Physical reporting from July 28–30, orientation July 31, and classes begin August 2.",
  category: "University Admissions",
  image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "BITSAT 2026 iteration 4, BITS Pilani admission 2026, BITSAT allotment result, BITS Goa Hyderabad Pilani, BITS fee payment deadline 2026",
  featured: false,
  tags: "university-admissions,BITS,BITSAT,2026,engineering",
  viral_score: 90,
  source_name: "BITS Pilani Admissions",
  source_url: "https://admissions.bits-pilani.ac.in/",
  content: `<p>BITS Pilani has officially released the <strong>BITSAT 2026 Iteration IV seat allotment</strong> today — July 22, 2026 — for all three campuses: Pilani, Goa, and Hyderabad. Students allotted or upgraded in Iteration IV must <strong>pay the admission fee online by July 25, 2026</strong>. Campus reporting begins July 28, orientation is July 31, and the academic session officially starts <strong>August 2, 2026</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Iteration IV Result: Out Today</strong> — July 22, 2026. Check at admissions.bits-pilani.ac.in.</li>
    <li><strong>Fee Payment Deadline: July 25, 2026</strong> — Non-payment cancels your seat with no exceptions.</li>
    <li><strong>Campus Reporting: July 28–30, 2026</strong> — Physical reporting with original documents at allotted campus.</li>
    <li><strong>Orientation Programme: July 31, 2026</strong> — Mandatory for all newly admitted students.</li>
    <li><strong>Iteration V Result: August 1</strong> | <strong>Classes Begin: August 2, 2026.</strong></li>
  </ul>
</div>

<h2>Complete BITSAT 2026 Iteration IV–V Timeline</h2>

<table class="geo-dates-table">
  <thead><tr><th>Event</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td><strong>Iteration IV Allotment Released</strong></td><td><strong>July 22, 2026</strong></td></tr>
    <tr><td>Online Fee Payment Deadline</td><td>July 25, 2026</td></tr>
    <tr><td>Physical Campus Reporting (All Campuses)</td><td>July 28 – July 30, 2026</td></tr>
    <tr><td>Mandatory Orientation Programme</td><td>July 31, 2026</td></tr>
    <tr><td>Iteration V Allotment Result</td><td>August 1, 2026</td></tr>
    <tr><td>First Semester Classes Begin</td><td>August 2, 2026</td></tr>
  </tbody>
</table>

<h2>BITSAT 2026 Admission Process Flow</h2>

<div class="geo-mermaid">
flowchart TD
  A([Check Iteration IV Result\\nJuly 22]) --> B{Satisfied with\\nAllotment?}
  B -->|Yes| C[Pay Fee Online\\nDeadline: July 25]
  B -->|Waiting for Upgrade| D[Pay Fee + Remain in\\nIteration V Pool]
  C --> E[Physical Reporting at Campus\\nJuly 28–30 with Documents]
  D --> E
  E --> F[Attend Mandatory Orientation\\nJuly 31]
  F --> G([Classes Begin August 2 ✅])
</div>

<h2>Documents to Carry for Physical Reporting</h2>
<ul>
  <li>BITSAT 2026 Score Card (printed)</li>
  <li>Class 10 & Class 12 Original Marksheets + Passing Certificates</li>
  <li>Provisional Admission Letter (downloaded from portal)</li>
  <li>Aadhaar Card + 4 photocopies</li>
  <li>Category / PwBD Certificate (if applicable)</li>
  <li>6 recent passport-size photographs</li>
  <li>Medical fitness certificate from a registered doctor</li>
  <li>Fee payment confirmation receipt</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Log in to admissions.bits-pilani.ac.in immediately to check your Iteration IV allotment and campus/branch details.</p>
<p>2. Step 2 (Action): Complete online fee payment before July 25 — keep your transaction ID safe as you'll need it during physical reporting.</p>
<p>3. Step 3 (Action): Prepare all original documents and travel to your allotted campus for reporting between July 28–30. Do not miss the July 31 orientation.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://admissions.bits-pilani.ac.in/" target="_blank" rel="noopener">BITS Pilani Official Admissions Portal — BITSAT 2026</a></li>
    <li><a href="https://bitsadmission.com/" target="_blank" rel="noopener">BITSAT Admission Information — bitsadmission.com</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">When was BITSAT 2026 Iteration IV allotment released?</h4>
    <p class="faq-answer">BITSAT 2026 Iteration IV allotment was released on July 22, 2026 for all three BITS campuses — Pilani, Goa, and Hyderabad.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the BITSAT 2026 Iteration IV fee payment deadline?</h4>
    <p class="faq-answer">The online admission fee payment deadline for BITSAT 2026 Iteration IV is July 25, 2026. Missing this deadline results in automatic seat cancellation.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">When do BITS Pilani 2026 classes begin?</h4>
    <p class="faq-answer">First semester classes for the 2026–27 academic session begin on August 2, 2026, following campus reporting (July 28–30) and orientation (July 31).</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 3. SCHOLARSHIPS — Rhodes Scholarship 2027
// ═══════════════════════════════════════════════════════════
{
  title: "Rhodes Scholarship 2027 India: Fully-Funded Oxford University — Apply by July 23",
  excerpt: "5 fully-funded Rhodes Scholarships are awarded to Indian students for postgraduate study at Oxford. The application deadline is July 23, 2026 — tomorrow. Covers full tuition, £19,000+ living stipend, and airfare.",
  category: "Scholarships",
  image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "Rhodes scholarship India 2027, Rhodes scholarship deadline July 2026, Oxford scholarship India, fully funded scholarship India 2026, Rhodes scholarship eligibility",
  featured: true,
  tags: "scholarships,Rhodes,Oxford,fully-funded,international,2027",
  viral_score: 97,
  source_name: "Rhodes House Oxford",
  source_url: "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/india/",
  content: `<p>The <strong>Rhodes Scholarship 2027 (India Constituency)</strong> application deadline is <strong>tomorrow — July 23, 2026</strong>. Five of the world's most prestigious postgraduate scholarships are awarded annually to outstanding Indian citizens for study at the University of Oxford. The scholarship is fully-funded: it covers all tuition, a £19,000+ annual living stipend, economy return airfare to the UK, and visa and health insurance fees. If you qualify, this is the most transformative academic opportunity available to an Indian student today.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Application Deadline: July 23, 2026 at 23:59 IST</strong> — Submissions close tomorrow. Apply immediately.</li>
    <li><strong>5 Scholarships awarded</strong> annually to Indian candidates for postgraduate study at Oxford University.</li>
    <li><strong>Fully Funded:</strong> 100% tuition fees + £19,000+ annual living stipend + return airfare + visa & health insurance.</li>
    <li><strong>Referee Deadline: August 6, 2026</strong> — Recommendation letters must be submitted by your referees.</li>
    <li><strong>Selection Criteria:</strong> Academic excellence, integrity of character, leadership, and commitment to using your talents for good.</li>
  </ul>
</div>

<h2>What is the Rhodes Scholarship?</h2>
<p>The Rhodes Scholarship is one of the world's oldest and most celebrated international scholarship programmes, established in 1902 by the will of Cecil John Rhodes. It brings exceptional young people from around the world to the University of Oxford — one of the highest-ranked universities globally — to pursue postgraduate degrees. Rhodes Scholars join a lifelong network of global leaders, innovators, and changemakers.</p>
<p>India has a dedicated constituency with 5 scholarships available each year. Past Indian Rhodes Scholars include some of the country's most prominent academics, policymakers, and social entrepreneurs.</p>

<h2>Scholarship Benefits at a Glance</h2>

<table class="geo-dates-table">
  <thead><tr><th>Benefit Component</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>University Tuition Fees</td><td>100% covered for the full duration of your Oxford degree</td></tr>
    <tr><td>Annual Living Stipend</td><td>£19,000+ per year (sufficient for Oxford living costs)</td></tr>
    <tr><td>Airfare</td><td>Economy class return flight from India to the UK</td></tr>
    <tr><td>Visa Fees</td><td>Covered by the scholarship</td></tr>
    <tr><td>Health Insurance</td><td>Covered for the scholarship period</td></tr>
    <tr><td>Study Duration</td><td>1–2 years for most Oxford PG degrees (MSc, MPhil, MBA, MPP, etc.)</td></tr>
  </tbody>
</table>

<h2>Eligibility Criteria</h2>
<ul>
  <li><strong>Citizenship:</strong> Must be an Indian citizen</li>
  <li><strong>Age:</strong> Must be 18–24 years old (some flexibility up to 27 for recent graduates — check official portal)</li>
  <li><strong>Academic Qualification:</strong> Completed or near-completing an undergraduate degree from a recognized Indian university</li>
  <li><strong>Academic Excellence:</strong> Outstanding academic record — typically a first-class or high second-class honours equivalent</li>
  <li><strong>Leadership & Character:</strong> Demonstrated leadership, community involvement, and ethical conduct</li>
  <li><strong>Programme:</strong> Must be applying for a full-time postgraduate degree at the University of Oxford</li>
</ul>

<h2>Selection Process Flow</h2>

<div class="geo-mermaid">
flowchart TD
  A([Submit Application Online\\nDeadline: July 23, 2026]) --> B[Referees Submit Letters\\nDeadline: August 6, 2026]
  B --> C[Shortlisting by Rhodes India Committee]
  C --> D[Regional Interviews\\nOctober–November 2026]
  D --> E{Final Selection}
  E -->|Selected| F([Scholarship Awarded\\nOxford Programme Starts October 2027])
  E -->|Not Selected| G([Reapply Next Year\\nor Explore Other Fellowships])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit rhodeshouse.ox.ac.uk/scholarships/applications/india/ immediately and start your online application — the deadline is 23:59 IST tomorrow, July 23, 2026.</p>
<p>2. Step 2 (Action): Contact your referees today and ask them to submit their recommendation letters before August 6, 2026 — give them full context on the scholarship and your goals.</p>
<p>3. Step 3 (Action): Prepare a compelling Personal Statement that demonstrates your academic achievements, leadership experiences, and vision for using your Oxford education for the greater good.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://www.rhodeshouse.ox.ac.uk/scholarships/applications/india/" target="_blank" rel="noopener">Rhodes Scholarship — Official India Applications Page</a></li>
    <li><a href="https://www.ox.ac.uk/" target="_blank" rel="noopener">University of Oxford — Official Website</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the Rhodes Scholarship India deadline for 2027?</h4>
    <p class="faq-answer">The application deadline for the Rhodes Scholarship 2027 (India constituency) is July 23, 2026 at 23:59 IST. Referee recommendation letters must be submitted by August 6, 2026.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How many Rhodes Scholarships are awarded to India each year?</h4>
    <p class="faq-answer">Five Rhodes Scholarships are awarded annually to outstanding Indian citizens for postgraduate study at the University of Oxford.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Is the Rhodes Scholarship fully funded?</h4>
    <p class="faq-answer">Yes. The Rhodes Scholarship is fully funded and covers 100% of Oxford tuition fees, an annual living stipend of over £19,000, economy return airfare, and visa and health insurance costs.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Who is eligible for the Rhodes Scholarship India?</h4>
    <p class="faq-answer">Indian citizens aged 18–24 (with some flexibility to 27) who have completed or are completing an undergraduate degree from a recognized institution, with outstanding academic records and demonstrated leadership and character.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 4. INTERNSHIPS — PM Internship Scheme
// ═══════════════════════════════════════════════════════════
{
  title: "PM Internship Scheme 2026: ₹9,000/Month Stipend + Insurance at India's Top 500 Companies",
  excerpt: "The PM Internship Scheme (PMIS) offers Indian youth aged 18–25 a ₹9,000 monthly stipend, government insurance, and hands-on experience at India's top 500 companies. Applications are rolling — apply now on pminternship.mca.gov.in.",
  category: "Internships",
  image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "PM internship scheme 2026, PMIS stipend 9000, government internship India 2026, pminternship.mca.gov.in, PM internship eligibility, top 500 companies internship India",
  featured: true,
  tags: "internships,PM-internship,government,stipend,2026,youth",
  viral_score: 94,
  source_name: "Ministry of Corporate Affairs",
  source_url: "https://pminternship.mca.gov.in",
  content: `<p>The <strong>PM Internship Scheme (PMIS)</strong> is the Government of India's flagship youth internship programme — offering Indian citizens aged 18–25 a structured internship at <strong>India's top 500 companies</strong> with a monthly stipend of <strong>₹9,000</strong>, government-backed life and accident insurance, and a ₹6,000 one-time incidental grant. Applications are accepted on a rolling basis through the official portal — and with placement season approaching, this is the right moment to apply.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>₹9,000/month stipend</strong> — ₹8,100 DBT from Government + ₹900 from corporate partner.</li>
    <li><strong>₹6,000 one-time incidental grant</strong> provided to all selected interns upon joining.</li>
    <li><strong>Government Insurance:</strong> PM Jeevan Jyoti Bima Yojana (life) + PM Suraksha Bima Yojana (accident) for the full internship duration.</li>
    <li><strong>Top 500 Companies:</strong> Internship placements across leading Indian corporates in manufacturing, services, and tech sectors.</li>
    <li><strong>Age: 18–25</strong> | Not currently employed full-time | Annual family income below ₹12 lakh.</li>
  </ul>
</div>

<h2>What is the PM Internship Scheme?</h2>
<p>The <strong>Prime Minister Internship Scheme (PMIS)</strong> was launched to bridge the gap between India's young talent pool and the structured work experience they need to become employable. Unlike most unpaid government internships, PMIS offers a competitive stipend backed directly by the Union Government's Direct Benefit Transfer (DBT) system — ensuring payments reach interns reliably every month.</p>
<p>The scheme targets students and recent graduates who may not have the connections or resources to access premium corporate internships on their own, and creates a structured pathway into India's best companies.</p>

<h2>Complete Eligibility & Benefits Breakdown</h2>

<table class="geo-dates-table">
  <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>Age Eligibility</td><td>18 to 25 years (Indian citizen)</td></tr>
    <tr><td>Educational Qualification</td><td>Completed 10th, 12th, ITI, Polytechnic Diploma, or UG/PG degree</td></tr>
    <tr><td>Employment Status</td><td>Must NOT be employed full-time; not pursuing full-time regular education</td></tr>
    <tr><td>Family Income Limit</td><td>Annual family income ≤ ₹12,00,000</td></tr>
    <tr><td>Excluded Candidates</td><td>IIT / IIM / NLU / IISc / NID / NIFT graduates, CAs, CMAs, and CS holders</td></tr>
    <tr><td>Monthly Stipend</td><td>₹9,000 (₹8,100 DBT from Govt + ₹900 from company)</td></tr>
    <tr><td>One-Time Grant</td><td>₹6,000 incidental grant on joining</td></tr>
    <tr><td>Insurance Coverage</td><td>PM Jeevan Jyoti Bima Yojana + PM Suraksha Bima Yojana</td></tr>
    <tr><td>Duration</td><td>6 to 12 months</td></tr>
  </tbody>
</table>

<h2>How to Apply: Step-by-Step</h2>

<div class="geo-mermaid">
flowchart TD
  A([Visit pminternship.mca.gov.in]) --> B[Register / Login with Aadhaar-linked Mobile]
  B --> C[Complete Your Candidate Profile:\\nEducation + Skills + Preferences]
  C --> D[Browse Available Internship Listings\\nfrom Top 500 Companies]
  D --> E[Select Up to 3 Internship Choices]
  E --> F{Company Reviews\\n& Shortlists}
  F -->|Selected| G[Internship Offer Issued\\nStipend Disbursed via DBT]
  F -->|Not Selected| H([Update Profile & Reapply\\nNext Cycle])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit pminternship.mca.gov.in and register your candidate profile using your Aadhaar-linked mobile number — complete 100% of your profile for maximum visibility to companies.</p>
<p>2. Step 2 (Action): Browse current internship listings across sectors and apply to up to 3 roles that match your educational background and interests.</p>
<p>3. Step 3 (Action): Ensure your bank account is linked to your Aadhaar for seamless DBT stipend transfers once you are selected and onboarded.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://pminternship.mca.gov.in" target="_blank" rel="noopener">PM Internship Scheme — Official Portal (MCA, Govt of India)</a></li>
    <li><a href="https://www.mca.gov.in" target="_blank" rel="noopener">Ministry of Corporate Affairs — Official Website</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the PM Internship Scheme stipend amount?</h4>
    <p class="faq-answer">The PM Internship Scheme offers a total monthly stipend of ₹9,000 — ₹8,100 directly credited by the Government of India via DBT and ₹900 contributed by the corporate partner company. In addition, a one-time ₹6,000 incidental grant is provided on joining.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Who is NOT eligible for the PM Internship Scheme?</h4>
    <p class="faq-answer">Graduates of IITs, IIMs, National Law Universities, IISc, NID, and NIFT are excluded. Chartered Accountants (CAs), Cost and Management Accountants (CMAs), and Company Secretaries (CS) are also not eligible. Students currently in full-time regular education or employed full-time are also ineligible.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What insurance is provided under the PM Internship Scheme?</h4>
    <p class="faq-answer">All PMIS interns receive government-backed insurance under PM Jeevan Jyoti Bima Yojana (life insurance) and PM Suraksha Bima Yojana (accident insurance) for the full duration of their internship.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 5. INTERNSHIPS — NITI Aayog Internship
// ═══════════════════════════════════════════════════════════
{
  title: "NITI Aayog Internship 2026: How to Apply in August Window (Open Aug 1–10)",
  excerpt: "NITI Aayog's internship portal accepts applications only from the 1st to 10th of every month. The July window is closed — the August 1–10 window is your next chance. Here's everything you need to qualify and apply.",
  category: "Internships",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "NITI Aayog internship 2026, government internship apply August 2026, workforindia.niti.gov.in, NITI Aayog eligibility, policy internship India",
  featured: false,
  tags: "internships,NITI-Aayog,government,policy,2026",
  viral_score: 85,
  source_name: "NITI Aayog",
  source_url: "https://workforindia.niti.gov.in",
  content: `<p>The <strong>NITI Aayog Internship Scheme</strong> is one of India's most sought-after government internship opportunities — placing students directly inside the country's apex policy-making body. There's a crucial catch most students miss: the portal only accepts applications from the <strong>1st to the 10th of every month</strong>. The July 2026 window closed on July 10. Your next opportunity is the <strong>August 1–10, 2026 window</strong> — bookmark this and apply the moment it opens.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Monthly Window: August 1–10, 2026</strong> — Portal opens strictly on the 1st and closes on the 10th of each month.</li>
    <li><strong>Unpaid Internship</strong> — No monetary stipend. The value is direct government policy exposure and an official internship certificate.</li>
    <li><strong>UG Eligibility:</strong> Must have completed 4th semester with at least 85% marks in Class 12.</li>
    <li><strong>PG / Research Scholars:</strong> Minimum 70% in graduation + completed 2nd semester of PG.</li>
    <li>Apply 2–6 months in advance of your preferred internship month.</li>
  </ul>
</div>

<h2>Why the NITI Aayog Internship Stands Out</h2>
<p>NITI Aayog serves as the Government of India's premier policy think tank — the institution that designs India's development frameworks, advises on economic strategy, and leads major national initiatives. Interning here gives students direct exposure to how policy decisions are researched, drafted, and implemented at the national level. For students targeting UPSC, public policy careers, development sector roles, or international institutions like the World Bank, an NITI Aayog internship is a defining credential.</p>

<h2>Eligibility Requirements</h2>

<table class="geo-dates-table">
  <thead><tr><th>Candidate Type</th><th>Minimum Eligibility</th></tr></thead>
  <tbody>
    <tr><td>Undergraduate Students</td><td>Completed / appeared in 4th semester (2nd year); Class 12 score ≥ 85%</td></tr>
    <tr><td>Postgraduate Students</td><td>Completed / appeared in 2nd semester (1st year of PG); Graduation ≥ 70%</td></tr>
    <tr><td>Research Scholars</td><td>Registered M.Phil. or Ph.D. student at a recognized university</td></tr>
    <tr><td>Preferred Domains</td><td>Economics, Public Policy, Data Analytics, Agriculture, Health, Education, Energy, Urban Development</td></tr>
    <tr><td>Application Frequency</td><td>Only ONCE per financial year per candidate</td></tr>
    <tr><td>Advance Application Window</td><td>Minimum 2 months, maximum 6 months before desired internship month</td></tr>
  </tbody>
</table>

<h2>Application Process</h2>

<div class="geo-mermaid">
flowchart TD
  A([Open: August 1, 2026]) --> B[Visit workforindia.niti.gov.in]
  B --> C[Register with Valid Email & Mobile]
  C --> D[Fill Academic Details + Select Domain of Interest]
  D --> E[Submit Application\\nDeadline: August 10, 2026]
  E --> F{NITI Aayog Division\\nReviews Application}
  F -->|Shortlisted| G[Selection Confirmation + NOC from College Required]
  F -->|Not Shortlisted| H([Reapply Next Monthly Window])
  G --> I([Internship Starts at Specified Month])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Set a calendar reminder for August 1, 2026 to visit workforindia.niti.gov.in the moment the portal opens — early applications tend to get better visibility.</p>
<p>2. Step 2 (Action): Prepare your application materials now: academic transcripts showing your marks, a strong Statement of Purpose (SOP) explaining your policy interests, and a faculty recommendation letter.</p>
<p>3. Step 3 (Action): Obtain a No Objection Certificate (NOC) from your college beforehand — NITI Aayog requires it upon selection, and institutional approval can take time.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://workforindia.niti.gov.in" target="_blank" rel="noopener">NITI Aayog Official Internship Portal — Work for India</a></li>
    <li><a href="https://niti.gov.in" target="_blank" rel="noopener">NITI Aayog — Official Government of India Website</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">When is the NITI Aayog internship application window for August 2026?</h4>
    <p class="faq-answer">The NITI Aayog internship portal opens from August 1 to August 10, 2026. The portal accepts applications strictly during this window each month.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Does the NITI Aayog internship offer a stipend?</h4>
    <p class="faq-answer">No. The NITI Aayog Internship Scheme is unpaid. It does not offer a monetary stipend. The value of the internship lies in direct government policy exposure, mentorship from senior officials, and an official NITI Aayog internship certificate.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the minimum marks required for NITI Aayog internship for UG students?</h4>
    <p class="faq-answer">Undergraduate students must have completed or appeared in their 4th semester (2nd year) with a minimum of 85% marks in Class 12. Postgraduate students need a minimum of 70% marks in their undergraduate degree.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 6. STUDENT OPPORTUNITIES — World Bank Pioneers Internship
// ═══════════════════════════════════════════════════════════
{
  title: "World Bank Group Pioneers Internship 2026: Paid Global Programme — Apply by August 12",
  excerpt: "The World Bank Group's Pioneers Internship Program opened its Fall/Winter 2026 window from July 13 to August 12. Paid internships across economics, data science, public policy, and development finance — open to final-year UG and PG students.",
  category: "Student Opportunities",
  image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "World Bank internship 2026, WBG Pioneers internship, World Bank India internship apply, paid international internship for students, World Bank August 2026 deadline",
  featured: true,
  tags: "student-opportunities,World-Bank,paid-internship,international,2026",
  viral_score: 92,
  source_name: "World Bank Group",
  source_url: "https://www.worldbank.org/en/about/careers/programs-and-internships/youth-pioneers-internship-program",
  content: `<p>The <strong>World Bank Group Pioneers Internship Program</strong> has opened its <strong>Fall/Winter 2026 application window</strong> — accepting candidates from July 13 through <strong>August 12, 2026</strong>. This paid internship programme places university students from across the world directly inside one of the most influential development finance institutions on the planet, working on real projects in economics, public policy, data science, social development, and development finance. Indian students studying economics, public policy, data science, or development studies should treat this as a priority application.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Application Deadline: August 12, 2026</strong> — Window is open now. Apply at worldbank.org.</li>
    <li><strong>Paid Programme</strong> — Competitive hourly stipend at World Bank HQ (Washington D.C.) or global country offices including India.</li>
    <li><strong>Duration:</strong> 8 weeks to 6 months.</li>
    <li><strong>Domains:</strong> Economics, development finance, data science, public policy, social development, environment.</li>
    <li><strong>Eligibility:</strong> Final-year UG students or full-time Master's / MBA / PhD students currently enrolled.</li>
    <li>You can apply for up to 3 specific intern roles per selection cycle.</li>
  </ul>
</div>

<h2>About the World Bank Pioneers Programme</h2>
<p>The World Bank Group's <strong>Pioneers Internship Program</strong> is the flagship early-career pathway for students interested in international development and global policy. Unlike most institutional internships, Pioneers places interns on actual project teams — contributing to analytical work, research, country assessments, and programme design that directly influences how billions of dollars in development finance are deployed worldwide.</p>
<p>For Indian students, this is especially significant: India is one of the World Bank's largest borrowing countries, with active projects across infrastructure, agriculture, education, urban development, and climate. Interns in India country office roles work at the intersection of Indian policy and global development frameworks.</p>

<h2>Programme Breakdown</h2>

<table class="geo-dates-table">
  <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>Application Window</td><td>July 13 – August 12, 2026</td></tr>
    <tr><td>Internship Term</td><td>September 2026 – January 2027 (Fall/Winter Cycle)</td></tr>
    <tr><td>Duration</td><td>8 weeks to 6 months</td></tr>
    <tr><td>Compensation</td><td>Paid — competitive hourly stipend (rate varies by location)</td></tr>
    <tr><td>Location</td><td>World Bank HQ, Washington D.C. + Global Country Offices (incl. India)</td></tr>
    <tr><td>Application Limit</td><td>Up to 3 intern roles per cycle</td></tr>
    <tr><td>Working Domains</td><td>Economics, Development Finance, Data Science, Public Policy, Social Development, Climate & Environment</td></tr>
    <tr><td>Eligibility</td><td>Final-year UG or full-time Master's / MBA / PhD currently enrolled</td></tr>
  </tbody>
</table>

<h2>Application Process</h2>

<div class="geo-mermaid">
flowchart TD
  A([Visit World Bank Careers Portal]) --> B[Create / Update Your WBG Profile]
  B --> C[Search for Pioneers Internship Roles\\nFilter by Domain + Location]
  C --> D[Select Up to 3 Roles\\nand Submit Applications]
  D --> E{WBG Hiring Managers\\nReview Profiles}
  E -->|Shortlisted| F[Interview / Assessment Round]
  F -->|Offer| G([Paid Internship Confirmed\\nSept 2026 – Jan 2027])
  E -->|Not Selected| H([Reapply in Next Cycle])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit the World Bank careers portal at worldbank.org and create or update your candidate profile — ensure your CV highlights quantitative skills, research experience, and any development sector work.</p>
<p>2. Step 2 (Action): Search for Pioneers Internship roles aligned with your academic background (economics, data science, public policy, etc.) and apply to up to 3 roles before August 12, 2026.</p>
<p>3. Step 3 (Action): Tailor each application with a strong cover letter explaining your specific interest in that project area and how your skills will add value — generic applications rarely succeed at the World Bank level.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://www.worldbank.org/en/about/careers/programs-and-internships/youth-pioneers-internship-program" target="_blank" rel="noopener">World Bank Pioneers Internship Program — Official Page</a></li>
    <li><a href="https://www.worldbank.org/en/country/india" target="_blank" rel="noopener">World Bank India Country Office</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Is the World Bank Pioneers Internship paid?</h4>
    <p class="faq-answer">Yes. The World Bank Pioneers Internship Program is a paid opportunity offering a competitive hourly stipend. The exact rate varies based on the location of the internship (Washington D.C. vs. country offices).</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the World Bank internship application deadline for Fall 2026?</h4>
    <p class="faq-answer">The Fall/Winter 2026 application window closes on August 12, 2026. Applications opened on July 13, 2026.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Can Indian students apply for the World Bank Pioneers Internship?</h4>
    <p class="faq-answer">Yes. Indian students enrolled in a recognized university as a final-year undergraduate or full-time postgraduate / PhD student are eligible to apply. Strong English communication and quantitative skills are expected.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 7. EDUCATION NEWS — UGC SWAYAM + Unified Regulator Bill
// ═══════════════════════════════════════════════════════════
{
  title: "UGC Mandates SWAYAM MOOCs in Colleges + Cabinet Approves Unified Education Regulator Bill 2026",
  excerpt: "UGC's July 2026 directive mandates all Indian universities to integrate SWAYAM MOOCs into curricula. Simultaneously, the Union Cabinet approved the Viksit Bharat Shiksha Adhikshan Bill to merge UGC, AICTE, and NCTE into a single regulator.",
  category: "Education News",
  image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "UGC SWAYAM mandate July 2026, Viksit Bharat Shiksha Bill 2026, UGC AICTE NCTE merger, SWAYAM credits 2026, higher education news India 2026, UGC new rules",
  featured: true,
  tags: "education-news,UGC,SWAYAM,higher-education,NEP,2026",
  viral_score: 88,
  source_name: "UGC India",
  source_url: "https://ugc.gov.in",
  content: `<p>Two landmark developments are reshaping Indian higher education this week. First, the <strong>University Grants Commission (UGC)</strong> has issued a directive requiring all Higher Education Institutions (HEIs) to formally integrate <strong>SWAYAM MOOCs into their academic curricula</strong> for the July 2026 semester — allowing students to earn up to 40% of their semester credits online. Second, the <strong>Union Cabinet approved the Viksit Bharat Shiksha Adhikshan Bill</strong> to merge UGC, AICTE, and NCTE into a single unified higher education regulatory body, the most significant structural change to Indian higher education governance in decades.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>SWAYAM Credit Integration:</strong> Students can now earn up to 40% of semester credits via SWAYAM MOOCs — with proctored on-campus end-term exams.</li>
    <li><strong>Unified Regulator Bill:</strong> UGC + AICTE + NCTE to be merged into one regulatory body under the Viksit Bharat Shiksha Adhikshan Bill.</li>
    <li><strong>Biannual Admissions:</strong> Universities now operate July–August and January–February admission cycles — students no longer lose a full year if they miss one deadline.</li>
    <li><strong>FYUP + ME-ME Active:</strong> The 4-Year UG Programme with Multiple Entry / Multiple Exit is live in 67%+ of Indian HEIs via the Academic Bank of Credits.</li>
    <li><strong>Anti-Discrimination Cells:</strong> All universities must now appoint Equity Officers under UGC Regulations 2026.</li>
  </ul>
</div>

<h2>What the SWAYAM Mandate Means for You</h2>
<p>The UGC directive is a significant expansion of online learning rights for Indian university students. Under the new framework:</p>
<ul>
  <li>You can complete up to <strong>40% of your semester coursework through SWAYAM MOOCs</strong> — IIT and IIM faculty-taught courses available free on swayam.gov.in</li>
  <li>Your college must credit your SWAYAM course grades toward your official semester GPA after you clear a <strong>proctored end-term examination on campus</strong></li>
  <li>The Academic Bank of Credits (ABC) tracks your credits across institutions — giving you the flexibility to study at multiple universities over your degree</li>
</ul>
<p>This is the most practically significant change for students who want to take IIT-quality courses in subjects their college doesn't offer, or who want to accelerate their learning in AI, data science, programming, or core engineering without paying for additional coaching.</p>

<h2>What the Unified Regulator Bill Means</h2>
<p>The <strong>Viksit Bharat Shiksha Adhikshan Bill</strong> proposes to collapse three separate regulatory bodies — UGC (universities), AICTE (technical education), and NCTE (teacher education) — into a single unified regulator. Key implications:</p>
<ul>
  <li><strong>Simplified compliance</strong> for multi-disciplinary universities that currently deal with multiple regulators</li>
  <li><strong>Uniform standards</strong> across engineering, arts, sciences, and teacher training programmes</li>
  <li><strong>Faster reform cycles</strong> — single body can issue unified policy updates affecting all streams simultaneously</li>
  <li>Students applying across disciplines will see more consistent admission, examination, and credit-transfer policies</li>
</ul>

<h2>Impact Summary: Old vs New</h2>

<table class="geo-dates-table">
  <thead><tr><th>Area</th><th>Before (2025)</th><th>After (2026 Onwards)</th></tr></thead>
  <tbody>
    <tr><td>Online Credit Earning</td><td>Optional / peripheral in most colleges</td><td>Formally integrated — up to 40% of credits via SWAYAM</td></tr>
    <tr><td>Admission Cycles</td><td>Annually (July only, miss = lose a year)</td><td>Biannual (July–Aug + Jan–Feb windows)</td></tr>
    <tr><td>Regulatory Bodies</td><td>UGC + AICTE + NCTE (separate)</td><td>Single unified regulator (pending full implementation)</td></tr>
    <tr><td>UG Programme Duration</td><td>3-year fixed in most colleges</td><td>4-year FYUP with flexible entry/exit via ABC</td></tr>
    <tr><td>Student Protection</td><td>Ombudsman only</td><td>Mandatory Equity Officers + Anti-Discrimination Cells</td></tr>
  </tbody>
</table>

<div class="geo-mermaid">
flowchart LR
  A([Student Joins College]) --> B[Takes SWAYAM MOOCs\\nUp to 40% of Credits]
  B --> C[Appears in On-Campus\\nProctored End-Term Exam]
  C --> D[Credits Uploaded to\\nAcademic Bank of Credits]
  D --> E[Credits Recognised Across\\nMultiple Institutions]
  E --> F([Degree with Flexible\\nExit Options at 1, 2, 3, or 4 Years])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit swayam.gov.in and explore free IIT/IIM-taught MOOCs in your discipline — register for the July 2026 semester courses before enrollment closes.</p>
<p>2. Step 2 (Action): Register on the Academic Bank of Credits (ABC) portal (abc.gov.in) using your Aadhaar — this is mandatory for credit transfer and ME-ME exit options under FYUP.</p>
<p>3. Step 3 (Action): Check with your college's examination department how SWAYAM credits are being processed in the July 2026 semester under the new UGC directive — policies may vary slightly by institution.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://ugc.gov.in" target="_blank" rel="noopener">University Grants Commission (UGC) — Official Website</a></li>
    <li><a href="https://swayam.gov.in" target="_blank" rel="noopener">SWAYAM — Free Online Education Platform</a></li>
    <li><a href="https://education.gov.in" target="_blank" rel="noopener">Ministry of Education — Government of India</a></li>
    <li><a href="https://abc.gov.in" target="_blank" rel="noopener">Academic Bank of Credits (ABC) — Official Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the UGC SWAYAM MOOC mandate for 2026?</h4>
    <p class="faq-answer">The UGC has directed all Higher Education Institutions to formally integrate SWAYAM MOOCs into their academic curricula starting July 2026, allowing students to earn up to 40% of their semester credits through these online courses, subject to clearing a proctored on-campus end-term examination.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the Viksit Bharat Shiksha Adhikshan Bill?</h4>
    <p class="faq-answer">It is a bill approved by the Union Cabinet in 2026 to merge three separate higher education regulatory bodies — UGC, AICTE, and NCTE — into a single unified higher education regulator, creating consistent standards and simplified governance across all streams of higher education in India.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How does the biannual admission cycle benefit students?</h4>
    <p class="faq-answer">Universities now have two admission windows each year — July–August and January–February. This means that if a student misses one admission cycle, they can join the next one after just 6 months, rather than waiting an entire academic year as was previously the case.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 8. EDUCATION NEWS — NTA Reforms
// ═══════════════════════════════════════════════════════════
{
  title: "NTA Reforms 2026: No Score Normalization for CUET, Computer-Adaptive Testing & Faster Results",
  excerpt: "NTA has overhauled its exam processes in 2026 — eliminating score normalization for rescheduled CUET papers, shifting to Computer-Adaptive Testing infrastructure, decoupling OMR challenges from answer key releases, and narrowing its mandate to higher education only.",
  category: "Education News",
  image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "NTA reforms 2026, CUET no score normalization, NTA CUET changes 2026, NTA computer adaptive testing, nta.ac.in, NTA exam integrity 2026",
  featured: false,
  tags: "education-news,NTA,CUET,exam-reforms,2026",
  viral_score: 86,
  source_name: "National Testing Agency",
  source_url: "https://nta.ac.in",
  content: `<p>The <strong>National Testing Agency (NTA)</strong> has implemented its most significant operational overhaul in 2026 — a direct response to examination integrity concerns raised earlier in the year. The reforms affect every student appearing for <strong>CUET UG/PG, UGC-NET, and NEET-UG</strong>: no more score normalization penalties for rescheduled exam shifts, faster result timelines, and a systematic shift toward <strong>Computer-Adaptive Testing (CAT) infrastructure</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>No Score Normalization:</strong> Rescheduled CUET 2026 papers are now evaluated on absolute marks — candidates are no longer penalised by shifting mathematical formulas.</li>
    <li><strong>Narrowed Mandate:</strong> NTA now focuses exclusively on higher education entrance exams — CUET UG/PG, UGC-NET, NEET-UG. Government recruitment exams transferred to other bodies.</li>
    <li><strong>Faster Results:</strong> OMR challenge process decoupled from answer key release — result publication timelines significantly shortened.</li>
    <li><strong>CAT Infrastructure:</strong> Transition to Computer-Adaptive Testing underway — exams will be harder-to-cheat with dynamically adjusted question difficulty.</li>
    <li><strong>Better Exam Day Experience:</strong> AI-monitored CCTV, biometric verification, automatic time compensation for technical disruptions now standardized.</li>
  </ul>
</div>

<h2>Why These NTA Reforms Matter</h2>
<p>The 2026 reforms respond directly to the trust deficit NTA faced after exam irregularity controversies in recent years. The structural changes are designed to make national entrance examinations fairer, more transparent, and more resilient to manipulation. For students preparing for CUET and UGC-NET, understanding these changes directly affects how you should interpret results and plan re-attempts.</p>

<h2>What Changed: Before vs After</h2>

<table class="geo-dates-table">
  <thead><tr><th>Reform Area</th><th>Before 2026</th><th>After 2026 Reforms</th></tr></thead>
  <tbody>
    <tr><td>Score Normalization (Rescheduled Shifts)</td><td>Applied — disadvantaged some candidates on harder shifts</td><td>Eliminated — absolute marks used for all candidates</td></tr>
    <tr><td>NTA's Exam Scope</td><td>Higher education + government recruitment exams</td><td>Exclusively higher education (CUET, UGC-NET, NEET-UG)</td></tr>
    <tr><td>Result Publication Speed</td><td>OMR challenge + answer key release bundled together (slow)</td><td>Decoupled — faster independent result declarations</td></tr>
    <tr><td>Testing Technology</td><td>Standard Computer-Based Test (CBT)</td><td>Transitioning to Computer-Adaptive Testing (CAT)</td></tr>
    <tr><td>Technical Disruption Policy</td><td>Ad-hoc compensatory time</td><td>Automatic compensatory time + standardized re-exam windows</td></tr>
    <tr><td>Exam Security</td><td>Standard proctoring</td><td>AI-monitored CCTV + biometric verification at all centres</td></tr>
  </tbody>
</table>

<h2>How the New NTA Exam Flow Works</h2>

<div class="geo-mermaid">
flowchart TD
  A([Exam Day: Biometric + AI-Monitored CCTV]) --> B[CBT / CAT Infrastructure Exam]
  B --> C{Technical Disruption?}
  C -->|Yes| D[Automatic Compensatory Time\\nor Standardised Re-Exam]
  C -->|No| E[Exam Completed]
  E --> F[OMR/Response Sheet Processing]
  F --> G[Answer Key Released Independently]
  G --> H[Challenge Window Opens]
  H --> I[Final Result Published\\nNo Normalization Applied]
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): If you appeared for CUET UG/PG 2026 in a rescheduled shift, understand that your score is now evaluated on absolute marks — no normalization disadvantage applies to your result.</p>
<p>2. Step 2 (Action): Monitor nta.ac.in for the official CUET 2026 answer key release and the independent challenge window timeline — the new decoupled process means results may come faster than previous years.</p>
<p>3. Step 3 (Action): Students preparing for CUET 2027 should begin familiarising themselves with Computer-Adaptive Testing format — question difficulty will adjust dynamically based on your answers, requiring strong foundational knowledge rather than pattern-memorisation strategies.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://nta.ac.in" target="_blank" rel="noopener">National Testing Agency (NTA) — Official Website</a></li>
    <li><a href="https://cuet.nta.nic.in" target="_blank" rel="noopener">CUET UG/PG — NTA Official Portal</a></li>
    <li><a href="https://ugcnet.nta.ac.in" target="_blank" rel="noopener">UGC NET — NTA Official Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Has NTA eliminated score normalization for CUET 2026?</h4>
    <p class="faq-answer">Yes. NTA eliminated score normalization for rescheduled CUET 2026 papers. All candidates are now evaluated on absolute marks, removing the mathematical adjustments that previously disadvantaged students in certain exam shifts.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is Computer-Adaptive Testing and will NTA use it for CUET?</h4>
    <p class="faq-answer">Computer-Adaptive Testing (CAT) is a modern exam format where the difficulty of each question adjusts dynamically based on a candidate's previous answers. NTA has initiated a systematic transition toward CAT infrastructure to improve security and accuracy, though the full rollout timeline for CUET will be announced officially.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Which exams does NTA now conduct after the 2026 mandate changes?</h4>
    <p class="faq-answer">Following the 2026 reforms, NTA's mandate is narrowed exclusively to higher education entrance examinations: CUET UG, CUET PG, UGC-NET, and NEET-UG. Government recruitment examinations have been transferred to other designated conducting bodies.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 9. CAREER SIGNALS — GCC Hiring Boom 2026
// ═══════════════════════════════════════════════════════════
{
  title: "GCC Hiring Boom 2026: ₹8–18 LPA for AI-Skilled Freshers — What You Must Know",
  excerpt: "India's 2,117+ Global Capability Centers (GCCs) are creating 4.25–4.5 lakh new jobs in 2026, with entry-level salaries of ₹8–18 LPA for Generative AI, MLOps, and cloud-skilled fresh graduates. Traditional IT volume hiring is down 85%.",
  category: "Career Signals",
  image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "GCC hiring 2026, global capability centers India, GCC freshers salary 2026, AI jobs freshers India 2026, ₹18 LPA fresher salary, India skills report 2026",
  featured: true,
  tags: "career-signals,GCC,hiring,AI-jobs,salary,freshers,2026",
  viral_score: 96,
  source_name: "NASSCOM / Zinnov",
  source_url: "https://nasscom.in",
  content: `<p>India's job market for fresh graduates has undergone a fundamental structural shift in 2026. The era of volume IT hiring — where lakhs of students joined TCS, Infosys, and Wipro at ₹3.5–4 LPA — is giving way to a skills-first economy led by <strong>Global Capability Centers (GCCs)</strong>. India now hosts over <strong>2,117 GCCs employing 2.36 million professionals</strong>, and the sector is adding <strong>4.25 to 4.5 lakh new jobs</strong> in 2026 — with entry-level salaries starting at <strong>₹8–12 LPA</strong> and reaching <strong>₹18+ LPA for AI-specialised freshers</strong>. Here is everything you need to understand and position yourself for this shift.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>2,117+ GCCs</strong> in India employing 2.36 million people — the fastest-growing high-skill employer segment.</li>
    <li><strong>4.25–4.5 lakh new GCC jobs</strong> expected to be created in 2026.</li>
    <li><strong>Entry-level salaries: ₹8–12 LPA</strong> (general software) → <strong>₹8–18+ LPA</strong> (Gen AI, MLOps, LLM engineering).</li>
    <li><strong>Traditional IT campus hiring down to ~15% of intake</strong> — GCCs now lead premium fresh hiring.</li>
    <li><strong>64% of new GCC engineering roles</strong> require AI framework proficiency — not optional anymore.</li>
    <li>India Skills Report 2026: Overall graduate employability at 56.35% — skills gap remains critical.</li>
  </ul>
</div>

<h2>What is a GCC and Why It Matters for Your Career</h2>
<p>A <strong>Global Capability Center (GCC)</strong> — previously known as a captive center or offshore development center — is a subsidiary of a multinational company that performs high-value technical work in India: product engineering, R&D, AI development, financial analytics, cybersecurity, and more. Unlike traditional IT outsourcing companies, GCCs work exclusively for their parent company, doing sophisticated, proprietary work with global exposure and premium compensation structures.</p>
<p>Companies like JPMorgan, Goldman Sachs, Amazon, Google, Microsoft, Apple, Walmart, Boeing, and hundreds more run massive GCCs in Bengaluru, Hyderabad, Pune, Chennai, and NCR. Getting a job in a GCC means working on the same systems, codebases, and products as your global counterparts in New York, London, or San Francisco — at Indian living costs but near-global salary structures.</p>

<h2>GCC vs Traditional IT: Salary & Role Comparison</h2>

<table class="geo-dates-table">
  <thead><tr><th>Role Type</th><th>Traditional IT (TCS/Infosys/Wipro)</th><th>GCC (JP Morgan / Amazon / Google)</th></tr></thead>
  <tbody>
    <tr><td>General Software Engineer (Fresher)</td><td>₹3.5–5 LPA</td><td>₹8–12 LPA</td></tr>
    <tr><td>Data Engineer / Analyst (Fresher)</td><td>₹4–6 LPA</td><td>₹10–14 LPA</td></tr>
    <tr><td>Generative AI / LLM Engineer (Fresher)</td><td>Not typically hired at fresher level</td><td>₹12–18+ LPA</td></tr>
    <tr><td>MLOps / Cloud Engineer (Fresher)</td><td>₹5–7 LPA</td><td>₹10–15 LPA</td></tr>
    <tr><td>Product Engineer (Fresher)</td><td>₹5–8 LPA</td><td>₹12–18 LPA</td></tr>
    <tr><td>Work Nature</td><td>Client project maintenance / support</td><td>In-house product / R&D / AI</td></tr>
  </tbody>
</table>

<h2>What Skills GCCs Are Hiring For in 2026</h2>
<p>The GCC hiring shift is driven by two forces: the AI transformation agenda of their parent companies, and India's demonstrated ability to produce technically skilled talent at scale. The specific skill clusters in demand:</p>
<ul>
  <li><strong>Generative AI & LLM Engineering:</strong> Prompt engineering, RAG architectures, LangChain, fine-tuning, LlamaIndex</li>
  <li><strong>Cloud Infrastructure:</strong> AWS, GCP, Azure — particularly cloud-native development and serverless architectures</li>
  <li><strong>Data Engineering:</strong> Apache Spark, Kafka, dbt, Databricks, real-time data pipelines</li>
  <li><strong>MLOps:</strong> Model deployment, monitoring, CI/CD for ML systems, feature stores</li>
  <li><strong>Cybersecurity:</strong> Application security, cloud security, zero-trust architecture</li>
  <li><strong>Full-Stack Development:</strong> React/Next.js + Node.js or Python backend with system design depth</li>
</ul>

<h2>How to Position Yourself for GCC Jobs</h2>

<div class="geo-mermaid">
flowchart TD
  A([Build Core CS Fundamentals:\\nDSA + System Design]) --> B[Pick a Specialisation:\\nAI / Cloud / Data / Security]
  B --> C[Earn Recognised Certifications:\\nGoogle Cloud, AWS, Microsoft AI]
  C --> D[Build 2–3 Real Projects\\nDeploy on GitHub / Portfolio]
  D --> E[Target GCC Off-Campus Drives\\nJuly–October 2026]
  E --> F{Interview: DSA + System Design\\n+ Domain Knowledge}
  F -->|Pass| G([GCC Job Offer: ₹8–18 LPA])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Identify which GCC-demanded skill cluster aligns with your academic background and start a focused 90-day upskilling plan — use free resources from Google Cloud, AWS, and Microsoft Learn.</p>
<p>2. Step 2 (Action): Build a production-ready project in your chosen domain (a Generative AI app, a data pipeline, or a deployed web app) and put it on GitHub — GCCs increasingly shortlist candidates based on demonstrated projects, not just marks.</p>
<p>3. Step 3 (Action): Register on LinkedIn, Unstop, and direct company career portals (Amazon, JPMorgan, Goldman Sachs, Microsoft India) for GCC off-campus drives starting July–October 2026.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://nasscom.in" target="_blank" rel="noopener">NASSCOM — India Tech Industry Report 2026</a></li>
    <li><a href="https://zinnov.com" target="_blank" rel="noopener">Zinnov GCC India Landscape Report 2026</a></li>
    <li><a href="https://economictimes.indiatimes.com" target="_blank" rel="noopener">Economic Times — GCC Hiring and Salary Trends India 2026</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What salary do GCCs offer fresh graduates in India in 2026?</h4>
    <p class="faq-answer">GCCs offer entry-level salaries ranging from ₹8–12 LPA for general software engineering roles, scaling up to ₹8–18+ LPA for specialised positions in Generative AI, MLOps, LLM engineering, and cloud architecture.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is a Global Capability Center (GCC)?</h4>
    <p class="faq-answer">A GCC is a subsidiary of a multinational company set up in India to perform high-value technical work — product engineering, AI development, R&D, financial analytics — for the parent company. GCCs offer premium salaries, global exposure, and in-house product work unlike traditional IT service companies.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How many GCC jobs are available in India in 2026?</h4>
    <p class="faq-answer">India's GCC sector is expected to create 4.25 to 4.5 lakh new jobs in 2026, spread across 2,117+ GCCs employing 2.36 million professionals in cities like Bengaluru, Hyderabad, Pune, Chennai, and NCR.</p>
  </div>
</div>`
},

// ═══════════════════════════════════════════════════════════
// 10. FUTURE SKILLS — Generative AI & NASSCOM Skilling
// ═══════════════════════════════════════════════════════════
{
  title: "Get ₹14,500 Back for Learning AI: NASSCOM FutureSkills Prime + Free Google & Microsoft Certifications 2026",
  excerpt: "Indian students can receive up to ₹14,500 in government reimbursements for completing AI certifications through NASSCOM FutureSkills Prime. Combined with free Google Cloud and Microsoft AI pathways, this is the most accessible AI skilling ecosystem in 2026.",
  category: "Future Skills",
  image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80",
  author: "Kampus Filter Desk",
  keywords: "NASSCOM FutureSkills Prime 2026, AI certification government reimbursement India, free AI course India 2026, Google Cloud AI certification free, Microsoft AI skills India, NPTEL AI course 2026",
  featured: true,
  tags: "future-skills,AI,NASSCOM,Google,Microsoft,certification,2026",
  viral_score: 93,
  source_name: "NASSCOM FutureSkills Prime",
  source_url: "https://futureskillsprime.in/",
  content: `<p>Here's a combination that most Indian students don't know exists: the Government of India — through MeitY and NASSCOM FutureSkills Prime — will <strong>reimburse you up to ₹14,500</strong> for completing recognised deep-skilling AI certifications. Pair this with completely free AI learning pathways from <strong>Google Cloud Skills Boost</strong> and <strong>Microsoft Learn</strong>, and you have the most accessible AI education ecosystem India has ever had. Generative AI certified freshers are already commanding <strong>40–50% higher starting salaries</strong> than their non-certified peers. Here is exactly how to take advantage of this in 2026.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>₹14,500 Government Reimbursement</strong> available via MeitY/NASSCOM FutureSkills Prime for eligible AI deep-skill certifications.</li>
    <li><strong>Google Cloud Skills Boost:</strong> Free 56-hour AI Research Foundations + Generative AI Leader pathways with shareable digital badges.</li>
    <li><strong>Microsoft AI Skills Yatra:</strong> Free hands-on Applied Skills credentials and AI Transformation pathways on Microsoft Learn.</li>
    <li><strong>IIT NPTEL / SWAYAM:</strong> Credit-transferable Generative AI courses taught by IIT faculty — free, with academic credit recognition.</li>
    <li><strong>Demand Surge:</strong> 30%+ year-on-year growth in Indian job openings requiring Generative AI proficiency in 2026.</li>
  </ul>
</div>

<h2>The ₹14,500 Government AI Skilling Reimbursement: How It Works</h2>
<p>Under the <strong>NASSCOM FutureSkills Prime</strong> initiative — backed by the Ministry of Electronics and Information Technology (MeitY) — eligible Indian learners can receive financial incentives after completing recognised AI deep-skilling programmes. The process:</p>
<ol>
  <li>Register on <strong>futureskillsprime.in</strong> and take the free Competency Diagnostic Test</li>
  <li>Filter for government-incentivized AI courses and enrol in your chosen programme</li>
  <li>Complete the course and earn your certification</li>
  <li>Apply for reimbursement through the portal — up to ₹14,500 depending on the course tier</li>
</ol>
<p>This is not a scholarship — it's a skills incentive. You pay upfront (or choose a free course), complete it, and get reimbursed. The government's goal is to build a 1-million-strong AI-skilled workforce in India by 2027.</p>

<h2>Complete Free AI Learning Ecosystem for Indian Students</h2>

<table class="geo-dates-table">
  <thead><tr><th>Platform</th><th>Programme</th><th>Cost</th><th>Credential</th></tr></thead>
  <tbody>
    <tr><td>NASSCOM FutureSkills Prime</td><td>AI Deep-Skilling Courses (various)</td><td>Reimbursable up to ₹14,500</td><td>Industry-recognised certificate + NSQF badge</td></tr>
    <tr><td>Google Cloud Skills Boost</td><td>Generative AI Leader + AI Research Foundations (56 hrs)</td><td>Free</td><td>Google Cloud Skill Badges (shareable)</td></tr>
    <tr><td>Microsoft Learn</td><td>AI Skills Yatra + Applied Skills (AI agent building, prompt eng.)</td><td>Free</td><td>Microsoft Applied Skills Credentials</td></tr>
    <tr><td>NPTEL / SWAYAM</td><td>Generative AI and ML (IIT Faculty-taught)</td><td>Free (proctored exam: ₹1,000)</td><td>NPTEL Certificate with academic credit transfer</td></tr>
    <tr><td>Google Career Certificates (Coursera)</td><td>Google AI Professional Certificate</td><td>Financial Aid available (effectively free)</td><td>Google Professional Certificate (NSQF recognised)</td></tr>
  </tbody>
</table>

<h2>Your 5-Step AI Certification Roadmap</h2>

<div class="geo-mermaid">
flowchart TD
  A([Step 1: Register on futureskillsprime.in\\nTake Free Diagnostic Test]) --> B[Step 2: Complete Google Cloud\\nGenerative AI Learning Path — Free]
  B --> C[Step 3: Earn Microsoft Applied Skills\\nCredential on AI Agent Building — Free]
  C --> D[Step 4: Enrol in NPTEL AI Course\\nfor Academic Credit Transfer]
  D --> E[Step 5: Build 2–3 Real AI Projects\\nDeploy + Share on GitHub + LinkedIn]
  E --> F([Apply for NASSCOM Reimbursement\\n+ Target GCC / AI Roles at ₹10–18 LPA])
</div>

<h2>Why AI Certification Matters for Salary in 2026</h2>
<p>The data from India's job market is unambiguous:</p>
<ul>
  <li>Freshers with verified AI certifications are earning <strong>40–50% higher starting salaries</strong> than non-certified peers in the same roles</li>
  <li><strong>64% of new GCC engineering roles</strong> in 2026 list AI proficiency as a baseline requirement — not a bonus</li>
  <li>Job openings requiring Generative AI proficiency grew by <strong>over 30% year-on-year</strong> in 2026</li>
  <li>Companies including Accenture, Infosys, TCS, and virtually every GCC now have internal AI skilling mandates — certified candidates skip directly to technical rounds</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit futureskillsprime.in today — register, complete the free Competency Diagnostic Test, and shortlist 2–3 AI courses eligible for the government reimbursement incentive.</p>
<p>2. Step 2 (Action): Start the Google Cloud Generative AI Learning Path on cloudskillsboost.google — it's entirely free, takes 56 hours, and gives you shareable digital badges to put on your LinkedIn immediately.</p>
<p>3. Step 3 (Action): Enrol on nptel.ac.in for the July 2026 semester AI / Generative AI course before enrollment closes — earn both the NPTEL certificate and academic credit transfer toward your college degree simultaneously.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://futureskillsprime.in/" target="_blank" rel="noopener">NASSCOM FutureSkills Prime — Official Skilling Portal</a></li>
    <li><a href="https://cloudskillsboost.google/" target="_blank" rel="noopener">Google Cloud Skills Boost — Free AI Learning Paths</a></li>
    <li><a href="https://learn.microsoft.com/" target="_blank" rel="noopener">Microsoft Learn — AI Skills & Applied Credentials</a></li>
    <li><a href="https://nptel.ac.in/" target="_blank" rel="noopener">NPTEL / SWAYAM — IIT-Taught AI Courses with Credit Transfer</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">How do I get the ₹14,500 government AI skilling reimbursement?</h4>
    <p class="faq-answer">Register on futureskillsprime.in (the NASSCOM FutureSkills Prime portal backed by MeitY), complete the Competency Diagnostic Test, enrol in a government-incentivized AI course, complete the certification, and then apply for the reimbursement through the portal. Eligible courses and exact reimbursement amounts are listed on the platform.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Are Google Cloud AI certificates free for Indian students?</h4>
    <p class="faq-answer">Yes. Google Cloud Skills Boost offers free learning paths including the Generative AI Leader pathway and AI Research Foundations curriculum (56 hours). You earn shareable digital skill badges at no cost. Google Career Certificates on Coursera can also be accessed for free via Coursera Financial Aid.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Do NPTEL AI courses count toward my college degree?</h4>
    <p class="faq-answer">Yes. Under the UGC's SWAYAM credit integration mandate (effective July 2026), NPTEL/SWAYAM courses — including AI and Generative AI courses taught by IIT faculty — can count toward up to 40% of your semester credits at most Indian universities. Check with your college's examination department for specific credit transfer procedures.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How much salary premium do AI certifications give freshers in India?</h4>
    <p class="faq-answer">According to industry reports and the India Skills Report 2026, freshers with verified AI and Generative AI certifications earn 40–50% higher starting salaries compared to non-certified graduates in equivalent roles. GCC entry-level roles for AI-specialised freshers start at ₹10–18 LPA, compared to ₹3.5–5 LPA in traditional IT services.</p>
  </div>
</div>`
}

];

// ═══════════════════════════════════════════════════════════
// PUBLISH ENGINE
// ═══════════════════════════════════════════════════════════
async function publishAll() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;
  if (!dbUrl) { console.error("[!] TURSO_CONNECTION_URL missing"); process.exit(1); }

  console.log("[*] Connecting to Turso...");
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const db = drizzle(client);
  const { articles } = await import("../db/schema");
  const { eq } = await import("drizzle-orm");

  let published = 0;
  let skipped = 0;

  for (const draft of ARTICLES) {
    const slug = slugify(draft.title);
    const now = Date.now();
    const id = Math.random().toString(36).substring(2, 15);
    const readingTime = calculateReadingTime(draft.content);

    // Check for existing
    const existing = await client.execute({ sql: "SELECT slug FROM articles WHERE slug = ?", args: [slug] });
    if (existing.rows.length > 0) {
      console.log(`[~] Skipping (already exists): ${slug}`);
      skipped++;
      continue;
    }

    const newArticle = {
      id, title: draft.title.trim(), slug,
      excerpt: draft.excerpt.trim(), content: draft.content.trim(),
      category: draft.category, image: draft.image.trim(),
      author: draft.author.trim(), publishedAt: now, createdAt: now, updatedAt: now,
      featured: draft.featured ? 1 : 0, status: "published",
      metaTitle: draft.title.trim(), metaDescription: draft.excerpt.trim(),
      keywords: draft.keywords || draft.category.toLowerCase(),
      readingTime, views: 0,
      tags: draft.tags || "", contentType: "news",
      viralScore: draft.viral_score || 80,
      sourceName: draft.source_name || "", sourceUrl: draft.source_url || "",
      views7d: 0, views30d: 0, lastViewedAt: null,
      ogImage: draft.image.trim(), twitterImage: draft.image.trim(),
      publishedBy: draft.author.trim(), researchRef: "", metadata: null
    };

    try {
      await db.insert(articles).values(newArticle);
      console.log(`[+] Published (${draft.category}): ${draft.title}`);
      published++;
    } catch (err: any) {
      console.error(`[!] Failed: ${draft.title} — ${err.message}`);
    }
  }

  client.close();

  console.log("\n" + "═".repeat(60));
  console.log("  ✅  Kampus Filter Batch Publish Complete");
  console.log("═".repeat(60));
  console.log(`  Articles Published : ${published}`);
  console.log(`  Skipped (exists)   : ${skipped}`);
  console.log(`  Total Articles     : ${ARTICLES.length}`);
  console.log("═".repeat(60) + "\n");
}

export { slugify, calculateReadingTime };
if (process.argv[1] && process.argv[1].endsWith("publish_batch_articles.ts")) {
  publishAll();
}
