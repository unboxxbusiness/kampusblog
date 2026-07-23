/**
 * batch_publish.js — Kampus Filter
 * Publishes 10 category-wise GEO articles to Turso database
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

// ─── Load Env (exact pattern from delete_all_articles.js) ───────────────────
function loadEnv() {
  const envPaths = ['.env.local', '.env'];
  for (const envFile of envPaths) {
    const fullPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(fullPath)) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('#') || !line.includes('=')) continue;
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
  console.error('[!] Error: TURSO_CONNECTION_URL not found in env files');
  process.exit(1);
}

// ─── Utils ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function readingTime(html) {
  return Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length / 225));
}

function genId() {
  return Math.random().toString(36).substring(2, 15);
}

// ─── 10 Articles ─────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    title: "DU CSAS UG 2026 Round 2: Seat Allocation on July 25, Fee Deadline July 28",
    excerpt: "Delhi University's CSAS UG 2026 Round 2 seat allocation releases on July 25. Students must accept seats by July 26, complete document verification by July 27, and pay fees by July 28, 2026.",
    category: "University Admissions",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    keywords: "DU CSAS UG 2026, delhi university admission 2026, CSAS round 2, DU fee payment, CUET UG 2026",
    featured: 1, viral_score: 95, tags: "university-admissions,DU,CSAS,delhi-university,CUET,2026",
    content: `<p>The <strong>Delhi University CSAS UG 2026 Round 2 seat allocation</strong> is releasing on <strong>July 25, 2026</strong>. If you cleared CUET UG 2026 and applied to Delhi University, this is your critical action window — seat acceptance closes the same day, document verification runs July 25–27, and the fee payment deadline is <strong>July 28, 2026</strong>. Missing any single step means losing your seat.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Round 2 Allocation Date: July 25, 2026</strong> — Result releases on admission.uod.ac.in.</li>
    <li><strong>Seat Acceptance Window:</strong> July 25–26, 2026 (up to 11:59 PM).</li>
    <li><strong>Document Verification:</strong> July 25–27, 2026 — complete online verification with your college.</li>
    <li><strong>Fee Payment Deadline: July 28, 2026</strong> (up to 11:59 PM) — non-payment = automatic seat cancellation.</li>
    <li>Round 1 seat allotment was declared July 16; preference reordering closed July 21, 2026.</li>
  </ul>
</div>

<h2>DU CSAS Round 2 Complete Schedule</h2>
<table class="geo-dates-table">
  <thead><tr><th>Event</th><th>Date</th></tr></thead>
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
  A([Round 2 Result Released July 25]) --> B{Check Allocated College and Programme}
  B -->|Satisfied| C[Accept Seat Online before July 26 11:59 PM]
  B -->|Want Upgrade| D[Accept and Keep Higher Preferences for Round 3]
  C --> E[Online Document Verification with College July 25-27]
  D --> E
  E --> F[Pay Admission Fee Online Deadline July 28 11:59 PM]
  F --> G([Seat Confirmed])
</div>

<h2>Documents Required for Online Verification</h2>
<ul>
  <li>CUET UG 2026 Scorecard</li>
  <li>Class 10 and Class 12 Marksheets and Passing Certificate</li>
  <li>Aadhaar Card or Government-issued ID proof</li>
  <li>Category certificate — SC/ST/OBC-NCL/EWS (if applicable)</li>
  <li>PwBD certificate (if applicable)</li>
  <li>Passport-size photograph</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Log in to admission.uod.ac.in on July 25 morning to check your Round 2 seat allocation and decide whether to accept or retain higher preferences for Round 3.</p>
<p>2. Step 2 (Action): Upload all required documents to your college's verification portal between July 25–27.</p>
<p>3. Step 3 (Action): Complete the online fee payment before July 28, 11:59 PM — set a phone reminder right now.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
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
    <p class="faq-answer">If you fail to pay the admission fee by July 28, 2026 at 11:59 PM, your allocated seat will be automatically cancelled.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Is DU admission purely based on CUET scores in 2026?</h4>
    <p class="faq-answer">Yes. Delhi University undergraduate admissions in 2026 are entirely based on CUET UG 2026 scores. Class 12 percentage marks do not directly determine your seat allocation under the CSAS system.</p>
  </div>
</div>`
  },
  {
    title: "BITSAT 2026 Iteration IV Allotment Out Today: Fee Deadline July 25, Classes Start August 2",
    excerpt: "BITS Pilani released Iteration IV seat allotment for Pilani, Goa, and Hyderabad campuses on July 22, 2026. Fee payment deadline is July 25. Physical reporting July 28–30, orientation July 31, classes begin August 2.",
    category: "University Admissions",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    keywords: "BITSAT 2026 iteration 4, BITS Pilani admission 2026, BITSAT allotment result, BITS fee payment July 2026",
    featured: 0, viral_score: 90, tags: "university-admissions,BITS,BITSAT,2026,engineering",
    content: `<p>BITS Pilani has officially released the <strong>BITSAT 2026 Iteration IV seat allotment</strong> today — July 22, 2026 — for all three campuses: Pilani, Goa, and Hyderabad. Students allotted or upgraded in Iteration IV must <strong>pay the admission fee online by July 25, 2026</strong>. Campus reporting begins July 28, orientation is July 31, and the academic session officially starts <strong>August 2, 2026</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Iteration IV Result: Out Today</strong> — July 22, 2026. Check at admissions.bits-pilani.ac.in.</li>
    <li><strong>Fee Payment Deadline: July 25, 2026</strong> — Non-payment cancels your seat with no exceptions.</li>
    <li><strong>Campus Reporting: July 28–30, 2026</strong> — Physical reporting with original documents at allotted campus.</li>
    <li><strong>Orientation Programme: July 31, 2026</strong> — Mandatory for all newly admitted students.</li>
    <li><strong>Iteration V Result: August 1</strong> | <strong>Classes Begin: August 2, 2026</strong></li>
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

<h2>BITSAT 2026 Admission Process</h2>
<div class="geo-mermaid">
flowchart TD
  A([Check Iteration IV Result July 22]) --> B{Satisfied with Allotment?}
  B -->|Yes| C[Pay Fee Online Deadline July 25]
  B -->|Upgrade| D[Pay Fee and Stay in Iteration V Pool]
  C --> E[Physical Reporting at Campus July 28-30]
  D --> E
  E --> F[Attend Mandatory Orientation July 31]
  F --> G([Classes Begin August 2])
</div>

<h2>Documents to Carry for Physical Reporting</h2>
<ul>
  <li>BITSAT 2026 Score Card (printed)</li>
  <li>Class 10 and Class 12 Original Marksheets + Passing Certificates</li>
  <li>Provisional Admission Letter (downloaded from portal)</li>
  <li>Aadhaar Card + 4 photocopies</li>
  <li>Category or PwBD Certificate (if applicable)</li>
  <li>6 recent passport-size photographs</li>
  <li>Medical fitness certificate from a registered doctor</li>
  <li>Fee payment confirmation receipt</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Log in to admissions.bits-pilani.ac.in immediately to check your Iteration IV allotment and campus/branch details.</p>
<p>2. Step 2 (Action): Complete online fee payment before July 25 — keep your transaction ID safe as you'll need it during physical reporting.</p>
<p>3. Step 3 (Action): Prepare all original documents and travel to your allotted campus for reporting between July 28–30. Do not miss the July 31 orientation.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://admissions.bits-pilani.ac.in/" target="_blank" rel="noopener">BITS Pilani Official Admissions Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">When was BITSAT 2026 Iteration IV allotment released?</h4>
    <p class="faq-answer">BITSAT 2026 Iteration IV allotment was released on July 22, 2026 for Pilani, Goa, and Hyderabad campuses.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the BITSAT 2026 Iteration IV fee payment deadline?</h4>
    <p class="faq-answer">The online admission fee payment deadline for BITSAT 2026 Iteration IV is July 25, 2026. Missing this deadline results in automatic seat cancellation.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">When do BITS Pilani 2026 classes begin?</h4>
    <p class="faq-answer">First semester classes begin on August 2, 2026, following campus reporting (July 28–30) and orientation (July 31).</p>
  </div>
</div>`
  },
  {
    title: "Rhodes Scholarship 2027 India: Fully-Funded Oxford — Apply by July 23",
    excerpt: "5 fully-funded Rhodes Scholarships for Indian students for postgraduate study at Oxford. Application deadline July 23, 2026. Covers full tuition, £19,000+ living stipend, airfare, visa and health insurance.",
    category: "Scholarships",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    keywords: "Rhodes scholarship India 2027, Rhodes scholarship deadline July 2026, Oxford scholarship India, fully funded scholarship India 2026",
    featured: 1, viral_score: 97, tags: "scholarships,Rhodes,Oxford,fully-funded,international,2027",
    content: `<p>The <strong>Rhodes Scholarship 2027 (India Constituency)</strong> application deadline is <strong>tomorrow — July 23, 2026</strong>. Five of the world's most prestigious postgraduate scholarships are awarded annually to outstanding Indian citizens for study at the University of Oxford. Fully funded: all tuition, £19,000+ annual living stipend, economy return airfare, and visa and health insurance fees.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Application Deadline: July 23, 2026 at 23:59 IST</strong> — Submissions close tomorrow. Apply immediately.</li>
    <li><strong>5 Scholarships awarded</strong> annually to Indian candidates for postgraduate study at Oxford University.</li>
    <li><strong>Fully Funded:</strong> 100% tuition fees + £19,000+ annual living stipend + return airfare + visa &amp; health insurance.</li>
    <li><strong>Referee Deadline: August 6, 2026</strong> — Recommendation letters must be submitted by your referees.</li>
    <li><strong>Selection Criteria:</strong> Academic excellence, integrity of character, leadership, and commitment to using talents for good.</li>
  </ul>
</div>

<h2>Scholarship Benefits at a Glance</h2>
<table class="geo-dates-table">
  <thead><tr><th>Benefit Component</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>University Tuition Fees</td><td>100% covered for the full duration of your Oxford degree</td></tr>
    <tr><td>Annual Living Stipend</td><td>£19,000+ per year</td></tr>
    <tr><td>Airfare</td><td>Economy class return flight from India to the UK</td></tr>
    <tr><td>Visa Fees</td><td>Covered by the scholarship</td></tr>
    <tr><td>Health Insurance</td><td>Covered for the scholarship period</td></tr>
    <tr><td>Study Duration</td><td>1–2 years for most Oxford PG degrees</td></tr>
  </tbody>
</table>

<h2>Selection Process</h2>
<div class="geo-mermaid">
flowchart TD
  A([Submit Application Online Deadline July 23 2026]) --> B[Referees Submit Letters Deadline August 6 2026]
  B --> C[Shortlisting by Rhodes India Committee]
  C --> D[Regional Interviews October-November 2026]
  D --> E{Final Selection}
  E -->|Selected| F([Scholarship Awarded Oxford Starts October 2027])
  E -->|Not Selected| G([Reapply Next Year])
</div>

<h2>Eligibility Criteria</h2>
<ul>
  <li><strong>Citizenship:</strong> Must be an Indian citizen</li>
  <li><strong>Age:</strong> Must be 18–24 years old (some flexibility to 27)</li>
  <li><strong>Academic Qualification:</strong> Completed or near-completing an undergraduate degree from a recognized Indian university</li>
  <li><strong>Academic Excellence:</strong> Outstanding academic record — typically first-class or high second-class honours equivalent</li>
  <li><strong>Leadership &amp; Character:</strong> Demonstrated leadership, community involvement, and ethical conduct</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit rhodeshouse.ox.ac.uk/scholarships/applications/india/ immediately and start your online application — the deadline is 23:59 IST tomorrow, July 23, 2026.</p>
<p>2. Step 2 (Action): Contact your referees today and ask them to submit recommendation letters before August 6, 2026.</p>
<p>3. Step 3 (Action): Prepare a compelling Personal Statement that demonstrates your academic achievements, leadership, and vision for using your Oxford education for the greater good.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://www.rhodeshouse.ox.ac.uk/scholarships/applications/india/" target="_blank" rel="noopener">Rhodes Scholarship — Official India Applications Page</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the Rhodes Scholarship India deadline for 2027?</h4>
    <p class="faq-answer">The application deadline for the Rhodes Scholarship 2027 (India constituency) is July 23, 2026 at 23:59 IST. Referee recommendation letters must be submitted by August 6, 2026.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Is the Rhodes Scholarship fully funded?</h4>
    <p class="faq-answer">Yes. The Rhodes Scholarship covers 100% of Oxford tuition fees, £19,000+ annual living stipend, economy return airfare, and visa and health insurance costs.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How many Rhodes Scholarships are awarded to India each year?</h4>
    <p class="faq-answer">Five Rhodes Scholarships are awarded annually to outstanding Indian citizens for postgraduate study at the University of Oxford.</p>
  </div>
</div>`
  },
  {
    title: "PM Internship Scheme 2026: Rs 9,000/Month Stipend + Insurance at India's Top 500 Companies",
    excerpt: "The PM Internship Scheme (PMIS) offers Indian youth aged 18–25 a Rs 9,000 monthly stipend, government insurance, and a Rs 6,000 joining grant at India's top 500 companies. Applications are rolling on pminternship.mca.gov.in.",
    category: "Internships",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    keywords: "PM internship scheme 2026, PMIS stipend 9000, government internship India 2026, pminternship.mca.gov.in",
    featured: 1, viral_score: 94, tags: "internships,PM-internship,government,stipend,2026,youth",
    content: `<p>The <strong>PM Internship Scheme (PMIS)</strong> is the Government of India's flagship youth internship programme — offering Indian citizens aged 18–25 a structured internship at <strong>India's top 500 companies</strong> with a monthly stipend of <strong>Rs 9,000</strong>, government-backed life and accident insurance, and a Rs 6,000 one-time incidental grant. Applications are accepted on a rolling basis through the official portal.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Rs 9,000/month stipend</strong> — Rs 8,100 DBT from Government + Rs 900 from corporate partner.</li>
    <li><strong>Rs 6,000 one-time incidental grant</strong> provided to all selected interns upon joining.</li>
    <li><strong>Government Insurance:</strong> PM Jeevan Jyoti Bima Yojana (life) + PM Suraksha Bima Yojana (accident) for the full internship duration.</li>
    <li><strong>Top 500 Companies:</strong> Internship placements across leading Indian corporates in manufacturing, services, and tech sectors.</li>
    <li><strong>Age: 18–25</strong> | Not employed full-time | Annual family income below Rs 12 lakh.</li>
  </ul>
</div>

<h2>Eligibility &amp; Benefits Breakdown</h2>
<table class="geo-dates-table">
  <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>Age Eligibility</td><td>18 to 25 years (Indian citizen)</td></tr>
    <tr><td>Educational Qualification</td><td>Completed 10th, 12th, ITI, Polytechnic Diploma, or UG/PG degree</td></tr>
    <tr><td>Employment Status</td><td>Must NOT be employed full-time</td></tr>
    <tr><td>Family Income Limit</td><td>Annual family income up to Rs 12,00,000</td></tr>
    <tr><td>Excluded Candidates</td><td>IIT / IIM / NLU / IISc / NID / NIFT graduates, CAs, CMAs, CS holders</td></tr>
    <tr><td>Monthly Stipend</td><td>Rs 9,000 (Rs 8,100 DBT + Rs 900 from company)</td></tr>
    <tr><td>One-Time Grant</td><td>Rs 6,000 incidental grant on joining</td></tr>
    <tr><td>Insurance Coverage</td><td>PM Jeevan Jyoti Bima Yojana + PM Suraksha Bima Yojana</td></tr>
    <tr><td>Duration</td><td>6 to 12 months</td></tr>
  </tbody>
</table>

<h2>How to Apply</h2>
<div class="geo-mermaid">
flowchart TD
  A([Visit pminternship.mca.gov.in]) --> B[Register with Aadhaar-linked Mobile]
  B --> C[Complete Candidate Profile: Education and Skills]
  C --> D[Browse Internship Listings from Top 500 Companies]
  D --> E[Select Up to 3 Internship Choices]
  E --> F{Company Reviews and Shortlists}
  F -->|Selected| G([Stipend Disbursed via DBT])
  F -->|Not Selected| H([Update Profile and Reapply])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit pminternship.mca.gov.in and register your candidate profile using your Aadhaar-linked mobile number — complete 100% of your profile for maximum visibility.</p>
<p>2. Step 2 (Action): Browse current internship listings and apply to up to 3 roles that match your educational background and interests.</p>
<p>3. Step 3 (Action): Ensure your bank account is linked to your Aadhaar for seamless DBT stipend transfers once you are selected and onboarded.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://pminternship.mca.gov.in" target="_blank" rel="noopener">PM Internship Scheme — Official Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the PM Internship Scheme stipend amount?</h4>
    <p class="faq-answer">The PM Internship Scheme offers Rs 9,000 monthly — Rs 8,100 via DBT from the Government and Rs 900 from the corporate partner. Plus a one-time Rs 6,000 incidental grant on joining.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Who is NOT eligible for the PM Internship Scheme?</h4>
    <p class="faq-answer">Graduates of IITs, IIMs, National Law Universities, IISc, NID, and NIFT are excluded. CAs, CMAs, and CS are also ineligible. Students in full-time regular education or employed full-time are also ineligible.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What insurance is provided under PMIS?</h4>
    <p class="faq-answer">All PMIS interns receive PM Jeevan Jyoti Bima Yojana (life insurance) and PM Suraksha Bima Yojana (accident insurance) for the full internship duration.</p>
  </div>
</div>`
  },
  {
    title: "NITI Aayog Internship 2026: How to Apply in the August Window (Open Aug 1-10)",
    excerpt: "NITI Aayog's internship portal accepts applications only from the 1st to 10th of every month. The July window is closed — the August 1–10 window is your next chance. Eligibility, process and preparation guide inside.",
    category: "Internships",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    keywords: "NITI Aayog internship 2026, government internship August 2026, workforindia.niti.gov.in, policy internship India",
    featured: 0, viral_score: 85, tags: "internships,NITI-Aayog,government,policy,2026",
    content: `<p>The <strong>NITI Aayog Internship Scheme</strong> is one of India's most sought-after government internship opportunities — placing students directly inside the country's apex policy-making body. The portal only accepts applications from the <strong>1st to the 10th of every month</strong>. The July 2026 window closed on July 10. Your next opportunity is the <strong>August 1–10, 2026 window</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Monthly Window: August 1–10, 2026</strong> — Portal opens strictly on the 1st and closes on the 10th of each month.</li>
    <li><strong>Unpaid Internship</strong> — No monetary stipend. The value is direct government policy exposure and an official certificate.</li>
    <li><strong>UG Eligibility:</strong> Must have completed 4th semester with at least 85% marks in Class 12.</li>
    <li><strong>PG / Research Scholars:</strong> Minimum 70% in graduation + completed 2nd semester of PG.</li>
    <li>Apply 2–6 months in advance of your preferred internship month.</li>
  </ul>
</div>

<h2>Eligibility Requirements</h2>
<table class="geo-dates-table">
  <thead><tr><th>Candidate Type</th><th>Minimum Eligibility</th></tr></thead>
  <tbody>
    <tr><td>Undergraduate Students</td><td>Completed 4th semester; Class 12 score at least 85%</td></tr>
    <tr><td>Postgraduate Students</td><td>Completed 2nd semester of PG; Graduation at least 70%</td></tr>
    <tr><td>Research Scholars</td><td>Registered M.Phil. or Ph.D. student</td></tr>
    <tr><td>Application Frequency</td><td>Only ONCE per financial year per candidate</td></tr>
    <tr><td>Advance Application Window</td><td>2–6 months before desired internship month</td></tr>
  </tbody>
</table>

<h2>Application Process</h2>
<div class="geo-mermaid">
flowchart TD
  A([August 1 Portal Opens]) --> B[Visit workforindia.niti.gov.in]
  B --> C[Register and Fill Academic Details]
  C --> D[Select Domain of Interest]
  D --> E[Submit Before August 10 2026]
  E --> F{NITI Aayog Division Reviews}
  F -->|Shortlisted| G([Selection Confirmation NOC from College Required])
  F -->|Not Shortlisted| H([Reapply Next Month])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Set a calendar reminder for August 1, 2026 to visit workforindia.niti.gov.in the moment the portal opens — early applications get better visibility.</p>
<p>2. Step 2 (Action): Prepare your application materials now: academic transcripts, a strong Statement of Purpose on your policy interests, and a faculty recommendation letter.</p>
<p>3. Step 3 (Action): Obtain a No Objection Certificate (NOC) from your college beforehand — NITI Aayog requires it upon selection.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://workforindia.niti.gov.in" target="_blank" rel="noopener">NITI Aayog Official Internship Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">When is the NITI Aayog internship application window for August 2026?</h4>
    <p class="faq-answer">The NITI Aayog internship portal opens from August 1 to August 10, 2026 — strictly during this window each month.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Does the NITI Aayog internship offer a stipend?</h4>
    <p class="faq-answer">No. The NITI Aayog Internship Scheme is unpaid. The value lies in direct government policy exposure and an official NITI Aayog internship certificate.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the minimum marks required for NITI Aayog internship for UG students?</h4>
    <p class="faq-answer">UG students must have at least 85% in Class 12. PG students need a minimum 70% in their undergraduate degree.</p>
  </div>
</div>`
  },
  {
    title: "World Bank Group Pioneers Internship 2026: Paid Global Programme — Apply by August 12",
    excerpt: "The World Bank Group's Pioneers Internship Program opened its Fall/Winter 2026 window from July 13 to August 12. Paid internships in economics, data science, public policy, and development finance. Open to final-year UG and PG students.",
    category: "Student Opportunities",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    keywords: "World Bank internship 2026, WBG Pioneers internship, World Bank paid internship, World Bank August 2026 deadline",
    featured: 1, viral_score: 92, tags: "student-opportunities,World-Bank,paid-internship,international,2026",
    content: `<p>The <strong>World Bank Group Pioneers Internship Program</strong> has opened its <strong>Fall/Winter 2026 application window</strong> — accepting candidates from July 13 through <strong>August 12, 2026</strong>. This paid internship places university students inside one of the world's most influential development finance institutions, working on real projects in economics, public policy, data science, and social development.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Application Deadline: August 12, 2026</strong> — Window is open now.</li>
    <li><strong>Paid Programme</strong> — Competitive hourly stipend at World Bank HQ or global offices including India.</li>
    <li><strong>Duration:</strong> 8 weeks to 6 months.</li>
    <li><strong>Domains:</strong> Economics, development finance, data science, public policy, social development, environment.</li>
    <li><strong>Eligibility:</strong> Final-year UG students or full-time Master's / MBA / PhD students currently enrolled.</li>
    <li>You can apply for up to 3 specific roles per selection cycle.</li>
  </ul>
</div>

<h2>Programme Breakdown</h2>
<table class="geo-dates-table">
  <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
  <tbody>
    <tr><td>Application Window</td><td>July 13 – August 12, 2026</td></tr>
    <tr><td>Internship Term</td><td>September 2026 – January 2027</td></tr>
    <tr><td>Duration</td><td>8 weeks to 6 months</td></tr>
    <tr><td>Compensation</td><td>Paid — competitive hourly stipend</td></tr>
    <tr><td>Location</td><td>World Bank HQ Washington DC + Global Country Offices including India</td></tr>
    <tr><td>Application Limit</td><td>Up to 3 intern roles per cycle</td></tr>
    <tr><td>Eligibility</td><td>Final-year UG or full-time Master's / MBA / PhD currently enrolled</td></tr>
  </tbody>
</table>

<h2>Application Process</h2>
<div class="geo-mermaid">
flowchart TD
  A([Visit World Bank Careers Portal]) --> B[Create or Update Your WBG Profile]
  B --> C[Search Pioneers Internship Roles by Domain and Location]
  C --> D[Apply to Up to 3 Roles Before August 12]
  D --> E{WBG Hiring Managers Review Profiles}
  E -->|Shortlisted| F([Paid Internship September 2026 to January 2027])
  E -->|Not Selected| H([Reapply in Next Cycle])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit the World Bank careers portal and create or update your candidate profile — highlight quantitative skills, research experience, and any development sector work.</p>
<p>2. Step 2 (Action): Search for Pioneers Internship roles aligned with your academic background and apply to up to 3 roles before August 12, 2026.</p>
<p>3. Step 3 (Action): Tailor each application with a strong cover letter explaining your specific interest in that project area — generic applications rarely succeed at the World Bank level.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://www.worldbank.org/en/about/careers/programs-and-internships/youth-pioneers-internship-program" target="_blank" rel="noopener">World Bank Pioneers Internship Program — Official Page</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Is the World Bank Pioneers Internship paid?</h4>
    <p class="faq-answer">Yes. The World Bank Pioneers Internship Program offers a competitive hourly stipend that varies by location.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the World Bank internship application deadline for Fall 2026?</h4>
    <p class="faq-answer">The Fall/Winter 2026 application window closes on August 12, 2026. Applications opened on July 13, 2026.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Can Indian students apply for the World Bank Pioneers Internship?</h4>
    <p class="faq-answer">Yes. Indian students enrolled as final-year undergraduates or full-time postgraduate / PhD students are eligible to apply.</p>
  </div>
</div>`
  },
  {
    title: "UGC Mandates SWAYAM MOOCs in Colleges + Cabinet Approves Unified Education Regulator 2026",
    excerpt: "UGC's July 2026 directive mandates all Indian universities to integrate SWAYAM MOOCs — students can earn up to 40% of credits online. The Union Cabinet also approved the Viksit Bharat Shiksha Bill to merge UGC, AICTE, and NCTE into one regulator.",
    category: "Education News",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    keywords: "UGC SWAYAM mandate 2026, Viksit Bharat Shiksha Bill, UGC AICTE NCTE merger, SWAYAM credits 2026, higher education India 2026",
    featured: 1, viral_score: 88, tags: "education-news,UGC,SWAYAM,higher-education,NEP,2026",
    content: `<p>Two landmark developments are reshaping Indian higher education. First, the <strong>UGC</strong> has issued a directive requiring all Higher Education Institutions to formally integrate <strong>SWAYAM MOOCs into academic curricula</strong> for the July 2026 semester — students can earn up to 40% of semester credits online. Second, the <strong>Union Cabinet approved the Viksit Bharat Shiksha Adhikshan Bill</strong> to merge UGC, AICTE, and NCTE into a single unified regulatory body.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>SWAYAM Credit Integration:</strong> Students can earn up to 40% of semester credits via SWAYAM MOOCs with on-campus proctored end-term exams.</li>
    <li><strong>Unified Regulator Bill:</strong> UGC + AICTE + NCTE to be merged under the Viksit Bharat Shiksha Adhikshan Bill.</li>
    <li><strong>Biannual Admissions:</strong> Universities now operate July–August and January–February admission cycles.</li>
    <li><strong>FYUP + ME-ME Active:</strong> 4-Year UG Programme with Multiple Entry / Multiple Exit live in 67%+ of Indian HEIs via Academic Bank of Credits.</li>
    <li><strong>Anti-Discrimination Cells:</strong> All universities must appoint Equity Officers under UGC Regulations 2026.</li>
  </ul>
</div>

<h2>Impact: Before vs After 2026 Reforms</h2>
<table class="geo-dates-table">
  <thead><tr><th>Area</th><th>Before 2026</th><th>After 2026</th></tr></thead>
  <tbody>
    <tr><td>Online Credit Earning</td><td>Optional or peripheral</td><td>Up to 40% of credits via SWAYAM (formal mandate)</td></tr>
    <tr><td>Admission Cycles</td><td>Annual July only</td><td>Biannual July-Aug plus Jan-Feb</td></tr>
    <tr><td>Regulatory Bodies</td><td>UGC plus AICTE plus NCTE separate</td><td>Single unified regulator pending full rollout</td></tr>
    <tr><td>UG Programme Duration</td><td>3-year fixed</td><td>4-year FYUP with flexible ME-ME via ABC</td></tr>
    <tr><td>Student Protection</td><td>Ombudsman only</td><td>Mandatory Equity Officers plus Anti-Discrimination Cells</td></tr>
  </tbody>
</table>

<h2>How the SWAYAM Credit System Works</h2>
<div class="geo-mermaid">
flowchart LR
  A([Student Enrolls in SWAYAM MOOC]) --> B[Completes Online Course Modules]
  B --> C[Appears in On-Campus Proctored End-Term Exam]
  C --> D[Credits Uploaded to Academic Bank of Credits]
  D --> E[Credits Count Toward Semester GPA]
  E --> F([Up to 40% of Degree Credits Earned Online])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit swayam.gov.in and explore free IIT/IIM-taught MOOCs in your discipline — register for July 2026 semester courses before enrollment closes.</p>
<p>2. Step 2 (Action): Register on the Academic Bank of Credits (abc.gov.in) using your Aadhaar — mandatory for credit transfer and ME-ME exit options under FYUP.</p>
<p>3. Step 3 (Action): Check with your college's examination department how SWAYAM credits are being processed in the July 2026 semester — policies may vary slightly by institution.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://ugc.gov.in" target="_blank" rel="noopener">University Grants Commission (UGC) — Official Website</a></li>
    <li><a href="https://swayam.gov.in" target="_blank" rel="noopener">SWAYAM — Free Online Education Platform</a></li>
    <li><a href="https://education.gov.in" target="_blank" rel="noopener">Ministry of Education — Government of India</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What is the UGC SWAYAM MOOC mandate for 2026?</h4>
    <p class="faq-answer">The UGC has directed all Higher Education Institutions to integrate SWAYAM MOOCs into academic curricula starting July 2026, allowing students to earn up to 40% of semester credits through these online courses after clearing a proctored on-campus end-term examination.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is the Viksit Bharat Shiksha Adhikshan Bill?</h4>
    <p class="faq-answer">A bill approved by the Union Cabinet in 2026 to merge UGC, AICTE, and NCTE into a single unified higher education regulatory body, creating consistent standards across all streams of higher education in India.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How does biannual admission benefit students?</h4>
    <p class="faq-answer">Universities now have two admission windows — July-August and January-February. If a student misses one cycle, they can join the next one after just 6 months, rather than waiting a full academic year.</p>
  </div>
</div>`
  },
  {
    title: "NTA Reforms 2026: No Score Normalization for CUET, Computer-Adaptive Testing Coming",
    excerpt: "NTA has overhauled its exam processes in 2026 — eliminating score normalization for rescheduled CUET papers, introducing Computer-Adaptive Testing, decoupling OMR challenges from answer key releases, and narrowing its mandate to higher education only.",
    category: "Education News",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
    keywords: "NTA reforms 2026, CUET no score normalization, NTA CUET changes 2026, NTA computer adaptive testing, nta.ac.in",
    featured: 0, viral_score: 86, tags: "education-news,NTA,CUET,exam-reforms,2026",
    content: `<p>The <strong>National Testing Agency (NTA)</strong> has implemented its most significant operational overhaul in 2026. The reforms affect every student appearing for <strong>CUET UG/PG, UGC-NET, and NEET-UG</strong>: no more score normalization penalties for rescheduled exam shifts, faster result timelines, and a shift toward <strong>Computer-Adaptive Testing (CAT) infrastructure</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>No Score Normalization:</strong> Rescheduled CUET 2026 papers evaluated on absolute marks — no mathematical penalty for any shift.</li>
    <li><strong>Narrowed Mandate:</strong> NTA now focuses exclusively on CUET UG/PG, UGC-NET, NEET-UG.</li>
    <li><strong>Faster Results:</strong> OMR challenge process decoupled from answer key release — faster independent results.</li>
    <li><strong>CAT Infrastructure:</strong> Transition to Computer-Adaptive Testing underway — dynamically adjusted question difficulty.</li>
    <li><strong>Better Exam Day:</strong> AI-monitored CCTV, biometric verification, automatic time compensation standardized.</li>
  </ul>
</div>

<h2>What Changed: Before vs After 2026</h2>
<table class="geo-dates-table">
  <thead><tr><th>Reform Area</th><th>Before 2026</th><th>After 2026 Reforms</th></tr></thead>
  <tbody>
    <tr><td>Score Normalization Rescheduled Shifts</td><td>Applied — disadvantaged some candidates</td><td>Eliminated — absolute marks for all</td></tr>
    <tr><td>NTA Exam Scope</td><td>Higher education plus government recruitment</td><td>Exclusively higher education exams</td></tr>
    <tr><td>Result Publication Speed</td><td>OMR challenge bundled with answer key</td><td>Decoupled — faster independent results</td></tr>
    <tr><td>Testing Technology</td><td>Standard Computer-Based Test CBT</td><td>Transitioning to Computer-Adaptive Testing</td></tr>
    <tr><td>Technical Disruption Policy</td><td>Ad-hoc compensatory time</td><td>Automatic compensatory time plus standardized re-exam</td></tr>
  </tbody>
</table>

<h2>New NTA Exam Flow</h2>
<div class="geo-mermaid">
flowchart TD
  A([Exam Day Biometric plus AI-Monitored CCTV]) --> B[CBT or CAT Infrastructure Exam]
  B --> C{Technical Disruption?}
  C -->|Yes| D[Automatic Compensatory Time or Standardised Re-Exam]
  C -->|No| E[Exam Completed]
  E --> F[Answer Key Released Independently]
  F --> G[Challenge Window Opens]
  G --> I([Final Result Published No Normalization Applied])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): If you appeared for CUET UG/PG 2026 in a rescheduled shift, your score is evaluated on absolute marks — no normalization disadvantage applies.</p>
<p>2. Step 2 (Action): Monitor nta.ac.in for the official CUET 2026 answer key release and challenge window timeline.</p>
<p>3. Step 3 (Action): Students preparing for CUET 2027 should familiarize themselves with Computer-Adaptive Testing — question difficulty adjusts dynamically, requiring strong foundational knowledge over pattern-memorization.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://nta.ac.in" target="_blank" rel="noopener">National Testing Agency (NTA) — Official Website</a></li>
    <li><a href="https://cuet.nta.nic.in" target="_blank" rel="noopener">CUET UG/PG — NTA Official Portal</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Has NTA eliminated score normalization for CUET 2026?</h4>
    <p class="faq-answer">Yes. NTA eliminated score normalization for rescheduled CUET 2026 papers. All candidates are now evaluated on absolute marks.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is Computer-Adaptive Testing and will NTA use it for CUET?</h4>
    <p class="faq-answer">Computer-Adaptive Testing adjusts question difficulty dynamically based on your answers. NTA has initiated a transition toward CAT infrastructure, though the full rollout timeline for CUET will be announced officially.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Which exams does NTA now conduct after 2026 mandate changes?</h4>
    <p class="faq-answer">NTA's mandate is now exclusively: CUET UG, CUET PG, UGC-NET, and NEET-UG. Government recruitment exams have been transferred to other bodies.</p>
  </div>
</div>`
  },
  {
    title: "GCC Hiring Boom 2026: Rs 8-18 LPA for AI-Skilled Freshers — What You Must Know",
    excerpt: "India's 2,117+ Global Capability Centers are creating 4.25–4.5 lakh new jobs in 2026, with entry-level salaries of Rs 8–18 LPA for Generative AI, MLOps, and cloud-skilled fresh graduates. Traditional IT volume hiring is down to 15%.",
    category: "Career Signals",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    keywords: "GCC hiring 2026, global capability centers India, GCC freshers salary 2026, AI jobs freshers India 2026, India skills report 2026",
    featured: 1, viral_score: 96, tags: "career-signals,GCC,hiring,AI-jobs,salary,freshers,2026",
    content: `<p>India's job market for fresh graduates has undergone a fundamental structural shift in 2026. The era of volume IT hiring — where lakhs of students joined TCS, Infosys, and Wipro at Rs 3.5–4 LPA — is giving way to a skills-first economy led by <strong>Global Capability Centers (GCCs)</strong>. India now hosts over <strong>2,117 GCCs employing 2.36 million professionals</strong>, adding <strong>4.25 to 4.5 lakh new jobs</strong> in 2026 — with entry-level salaries starting at <strong>Rs 8–12 LPA</strong> and reaching <strong>Rs 18+ LPA for AI-specialised freshers</strong>.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>2,117+ GCCs</strong> in India employing 2.36 million people — fastest-growing high-skill employer segment.</li>
    <li><strong>4.25–4.5 lakh new GCC jobs</strong> expected to be created in 2026.</li>
    <li><strong>Entry-level salaries: Rs 8–12 LPA</strong> (general software) to <strong>Rs 8–18+ LPA</strong> (Gen AI, MLOps, LLM engineering).</li>
    <li><strong>Traditional IT campus hiring down to ~15% of intake</strong> — GCCs now lead premium fresh hiring.</li>
    <li><strong>64% of new GCC engineering roles</strong> require AI framework proficiency.</li>
  </ul>
</div>

<h2>GCC vs Traditional IT: Salary Comparison</h2>
<table class="geo-dates-table">
  <thead><tr><th>Role Type</th><th>Traditional IT TCS Infosys</th><th>GCC JPMorgan Amazon Google</th></tr></thead>
  <tbody>
    <tr><td>General Software Engineer Fresher</td><td>Rs 3.5–5 LPA</td><td>Rs 8–12 LPA</td></tr>
    <tr><td>Data Engineer Analyst Fresher</td><td>Rs 4–6 LPA</td><td>Rs 10–14 LPA</td></tr>
    <tr><td>Generative AI LLM Engineer Fresher</td><td>Not typically hired at fresher level</td><td>Rs 12–18+ LPA</td></tr>
    <tr><td>MLOps Cloud Engineer Fresher</td><td>Rs 5–7 LPA</td><td>Rs 10–15 LPA</td></tr>
    <tr><td>Work Nature</td><td>Client maintenance and support</td><td>In-house product R&amp;D and AI</td></tr>
  </tbody>
</table>

<h2>How to Position Yourself for GCC Jobs</h2>
<div class="geo-mermaid">
flowchart TD
  A([Build Core CS Fundamentals: DSA plus System Design]) --> B[Pick Specialisation: AI Cloud Data Security]
  B --> C[Earn Certifications: Google Cloud AWS Microsoft AI]
  C --> D[Build 2-3 Real Projects Deploy on GitHub]
  D --> E[Target GCC Off-Campus Drives July-October 2026]
  E --> F{Interview: DSA plus System Design plus Domain Knowledge}
  F -->|Pass| G([GCC Job Offer Rs 8-18 LPA])
</div>

<h2>What GCCs Are Hiring For in 2026</h2>
<ul>
  <li><strong>Generative AI &amp; LLM Engineering:</strong> Prompt engineering, RAG architectures, LangChain, fine-tuning, LlamaIndex</li>
  <li><strong>Cloud Infrastructure:</strong> AWS, GCP, Azure — cloud-native and serverless architectures</li>
  <li><strong>Data Engineering:</strong> Apache Spark, Kafka, dbt, Databricks, real-time pipelines</li>
  <li><strong>MLOps:</strong> Model deployment, monitoring, CI/CD for ML systems</li>
  <li><strong>Full-Stack Development:</strong> React/Next.js + Node.js or Python backend with system design depth</li>
</ul>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Identify which GCC-demanded skill cluster aligns with your background and start a focused 90-day upskilling plan — use free resources from Google Cloud, AWS, and Microsoft Learn.</p>
<p>2. Step 2 (Action): Build a production-ready project in your chosen domain and put it on GitHub — GCCs shortlist candidates based on demonstrated projects, not just marks.</p>
<p>3. Step 3 (Action): Register on LinkedIn, Unstop, and direct company career portals for GCC off-campus drives starting July–October 2026.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://nasscom.in" target="_blank" rel="noopener">NASSCOM — India Tech Industry Report 2026</a></li>
    <li><a href="https://zinnov.com" target="_blank" rel="noopener">Zinnov GCC India Landscape Report 2026</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">What salary do GCCs offer fresh graduates in India in 2026?</h4>
    <p class="faq-answer">GCCs offer Rs 8–12 LPA for general software engineering roles, scaling up to Rs 8–18+ LPA for specialised positions in Generative AI, MLOps, and LLM engineering.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">What is a Global Capability Center GCC?</h4>
    <p class="faq-answer">A GCC is a subsidiary of a multinational company in India performing high-value technical work — product engineering, AI development, R&amp;D — for the parent company. GCCs offer premium salaries and global exposure unlike traditional IT services companies.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How many GCC jobs are available in India in 2026?</h4>
    <p class="faq-answer">India's GCC sector is expected to create 4.25 to 4.5 lakh new jobs in 2026, spread across 2,117+ GCCs in Bengaluru, Hyderabad, Pune, Chennai, and NCR.</p>
  </div>
</div>`
  },
  {
    title: "Get Rs 14,500 Back for Learning AI: NASSCOM FutureSkills Prime + Free Google and Microsoft Certifications 2026",
    excerpt: "Indian students can receive up to Rs 14,500 in government reimbursements for AI certifications through NASSCOM FutureSkills Prime. Combined with free Google Cloud and Microsoft AI pathways, this is the most accessible AI skilling ecosystem in 2026.",
    category: "Future Skills",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80",
    keywords: "NASSCOM FutureSkills Prime 2026, AI certification government reimbursement India, free AI course India 2026, Google Cloud AI free, Microsoft AI skills India",
    featured: 1, viral_score: 93, tags: "future-skills,AI,NASSCOM,Google,Microsoft,certification,2026",
    content: `<p>Here's a combination most Indian students don't know exists: the Government of India — through MeitY and NASSCOM FutureSkills Prime — will <strong>reimburse you up to Rs 14,500</strong> for completing recognised deep-skilling AI certifications. Pair this with free AI learning pathways from <strong>Google Cloud Skills Boost</strong> and <strong>Microsoft Learn</strong>, and you have the most accessible AI education ecosystem India has ever had. Generative AI certified freshers are already commanding <strong>40–50% higher starting salaries</strong> than non-certified peers.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Rs 14,500 Government Reimbursement</strong> available via MeitY/NASSCOM FutureSkills Prime for eligible AI deep-skill certifications.</li>
    <li><strong>Google Cloud Skills Boost:</strong> Free 56-hour AI Research Foundations + Generative AI Leader paths with shareable badges.</li>
    <li><strong>Microsoft AI Skills Yatra:</strong> Free hands-on Applied Skills credentials on Microsoft Learn.</li>
    <li><strong>NPTEL/SWAYAM:</strong> Credit-transferable AI courses by IIT faculty — free, with academic credit recognition.</li>
    <li><strong>30%+ year-on-year growth</strong> in Indian job openings requiring Generative AI proficiency in 2026.</li>
  </ul>
</div>

<h2>Complete Free AI Learning Ecosystem</h2>
<table class="geo-dates-table">
  <thead><tr><th>Platform</th><th>Programme</th><th>Cost</th><th>Credential</th></tr></thead>
  <tbody>
    <tr><td>NASSCOM FutureSkills Prime</td><td>AI Deep-Skilling Courses various</td><td>Reimbursable up to Rs 14,500</td><td>Industry-recognised certificate plus NSQF badge</td></tr>
    <tr><td>Google Cloud Skills Boost</td><td>Generative AI Leader plus AI Research Foundations 56 hrs</td><td>Free</td><td>Google Cloud Skill Badges</td></tr>
    <tr><td>Microsoft Learn</td><td>AI Skills Yatra plus Applied Skills AI agent building</td><td>Free</td><td>Microsoft Applied Skills Credentials</td></tr>
    <tr><td>NPTEL / SWAYAM</td><td>Generative AI by IIT Faculty</td><td>Free exam Rs 1000</td><td>NPTEL Certificate plus academic credit transfer</td></tr>
    <tr><td>Google Career Certificates Coursera</td><td>Google AI Professional Certificate</td><td>Financial Aid available</td><td>Google Professional Certificate NSQF recognised</td></tr>
  </tbody>
</table>

<h2>Your 5-Step AI Certification Roadmap</h2>
<div class="geo-mermaid">
flowchart TD
  A([Register on futureskillsprime.in and Take Diagnostic Test]) --> B[Complete Google Cloud Generative AI Learning Path Free]
  B --> C[Earn Microsoft Applied Skills Credential on AI Agent Building Free]
  C --> D[Enroll in NPTEL AI Course for Academic Credit Transfer]
  D --> E[Build 2-3 Real AI Projects and Share on GitHub and LinkedIn]
  E --> F([Apply for NASSCOM Reimbursement and Target GCC Roles at Rs 10-18 LPA])
</div>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit futureskillsprime.in today — register, complete the free Competency Diagnostic Test, and shortlist AI courses eligible for the government reimbursement incentive.</p>
<p>2. Step 2 (Action): Start the Google Cloud Generative AI Learning Path on cloudskillsboost.google — free, 56 hours, and gives you shareable digital badges to put on LinkedIn immediately.</p>
<p>3. Step 3 (Action): Enrol on nptel.ac.in for the July 2026 semester AI course before enrollment closes — earn the NPTEL certificate and academic credit transfer simultaneously.</p>

<div class="geo-citations">
  <h3>Authoritative Sources &amp; Citations</h3>
  <ul>
    <li><a href="https://futureskillsprime.in/" target="_blank" rel="noopener">NASSCOM FutureSkills Prime — Official Skilling Portal</a></li>
    <li><a href="https://cloudskillsboost.google/" target="_blank" rel="noopener">Google Cloud Skills Boost — Free AI Learning Paths</a></li>
    <li><a href="https://learn.microsoft.com/" target="_blank" rel="noopener">Microsoft Learn — AI Skills and Applied Credentials</a></li>
    <li><a href="https://nptel.ac.in/" target="_blank" rel="noopener">NPTEL / SWAYAM — IIT-Taught AI Courses</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">How do I get the Rs 14,500 government AI skilling reimbursement?</h4>
    <p class="faq-answer">Register on futureskillsprime.in (NASSCOM FutureSkills Prime backed by MeitY), take the Competency Diagnostic Test, enrol in a government-incentivized AI course, complete the certification, and apply for the reimbursement through the portal.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Are Google Cloud AI certificates free for Indian students?</h4>
    <p class="faq-answer">Yes. Google Cloud Skills Boost offers free learning paths including the Generative AI Leader pathway (56 hours) with shareable digital skill badges at no cost.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Do NPTEL AI courses count toward my college degree?</h4>
    <p class="faq-answer">Yes. Under the UGC's SWAYAM credit integration mandate effective July 2026, NPTEL/SWAYAM courses can count toward up to 40% of your semester credits at most Indian universities.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How much salary premium do AI certifications give freshers?</h4>
    <p class="faq-answer">Freshers with verified AI certifications earn 40–50% higher starting salaries compared to non-certified graduates in equivalent roles, with GCC entry-level AI roles starting at Rs 10–18 LPA.</p>
  </div>
</div>`
  }
];

// ─── Publish All ─────────────────────────────────────────────────────────────
async function publishAll() {
  console.log(`[*] Connecting to Turso: ${dbUrl.substring(0, 40)}...`);
  const client = createClient({ url: dbUrl, authToken: dbToken });
  let published = 0, skipped = 0, errors = 0;

  for (const draft of ARTICLES) {
    const slug = slugify(draft.title);
    try {
      const existing = await client.execute({ sql: 'SELECT slug FROM articles WHERE slug = ?', args: [slug] });
      if (existing.rows.length > 0) {
        console.log(`[~] Skipping (exists): ${draft.title.substring(0, 50)}...`);
        skipped++;
        continue;
      }
      const now = Date.now();
      const id = genId();
      const rt = readingTime(draft.content);
      await client.execute({
        sql: `INSERT INTO articles (id,title,slug,excerpt,content,category,image,author,published_at,created_at,updated_at,featured,status,meta_title,meta_description,keywords,reading_time,views,tags,content_type,viral_score,source_name,source_url,views_7d,views_30d,og_image,twitter_image,published_by,research_ref) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [id, draft.title.trim(), slug, draft.excerpt.trim(), draft.content.trim(), draft.category, draft.image, 'Kampus Filter Desk', now, now, now, draft.featured, 'published', draft.title.trim(), draft.excerpt.trim(), draft.keywords || draft.category.toLowerCase(), rt, 0, draft.tags || '', 'news', draft.viral_score || 80, '', '', 0, 0, draft.image, draft.image, 'Kampus Filter Desk', '']
      });
      console.log(`[+] Published (${draft.category}): ${draft.title.substring(0, 60)}`);
      published++;
    } catch (err) {
      console.error(`[!] Error on "${draft.title.substring(0, 40)}": ${err.message}`);
      errors++;
    }
  }

  client.close();
  console.log('\n' + '='.repeat(55));
  console.log('  KAMPUS FILTER BATCH PUBLISH COMPLETE');
  console.log('='.repeat(55));
  console.log(`  Published : ${published}`);
  console.log(`  Skipped   : ${skipped}`);
  console.log(`  Errors    : ${errors}`);
  console.log(`  Total     : ${ARTICLES.length}`);
  console.log('='.repeat(55) + '\n');
}

publishAll().catch(err => {
  console.error('[!] Fatal error:', err.message);
  process.exit(1);
});
