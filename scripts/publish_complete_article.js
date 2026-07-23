const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function publishArticle() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;
  if (!dbUrl || !dbToken) {
    console.error("Missing DB environment variables!");
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });
  const slug = "unesco-coursera-launch-free-global-ai-ethics-course";

  const fullHTML = `<p>UNESCO has officially partnered with Coursera and LG AI Research to launch a landmark global learning program: the Global MOOC on the Ethics of AI. This free initiative is designed to equip students, software engineers, policy makers, and digital researchers worldwide with essential skills in responsible artificial intelligence deployment and algorithmic governance.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>100% Free Global Enrollment:</strong> Open to learners across all countries with zero tuition fees or prerequisite requirements on Coursera.</li>
    <li><strong>Multilateral Industry Collaboration:</strong> Jointly created by UNESCO, LG AI Research, and international AI scholars to bridge technical engineering and human rights frameworks.</li>
    <li><strong>High-Impact Career Credential:</strong> Delivers verifiable expertise in AI governance, algorithmic bias mitigation, data privacy, and ethical tech compliance.</li>
  </ul>
</div>

<h2>Introduction: UNESCO & Coursera Free AI Ethics Initiative</h2>
<p>As generative artificial intelligence and autonomous machine learning systems become deeply embedded in global commercial products, legal frameworks, and academic research, the demand for ethical technology oversight has reached an unprecedented peak. To address this urgent need, UNESCO and Coursera have launched an open-access global curriculum aimed at democratizing ethical AI education for learners of all backgrounds.</p>

<h2>What Happened? Global Coalition Launches Free AI Training</h2>
<p>Announced on July 20, 2026, the UNESCO Global MOOC on the Ethics of AI brings together international experts from civil society, academic research, and enterprise tech. Built upon UNESCO's universally adopted Recommendation on the Ethics of Artificial Intelligence, the course provides foundational training on fundamental rights, societal fairness, algorithmic transparency, and environmental sustainability in AI systems.</p>

<h2>Why It Matters for Students & Tech Professionals</h2>
<p>Enterprise hiring managers and tech recruiters are rapidly shifting priorities toward candidates who understand tech safety, regulatory compliance (such as the EU AI Act), and bias prevention. Gaining certified training in AI ethics provides students and software engineers with a strong competitive advantage when applying for product management, data science, and software engineering roles.</p>

<h2>Who Should Care?</h2>
<h3>1. Computer Science & Data Science Students</h3>
<p>Learn how to design non-discriminatory algorithms, audit training datasets for systemic bias, and implement privacy-preserving machine learning pipelines.</p>
<h3>2. Job Seekers & Tech Aspirants</h3>
<p>Differentiate your profile by mastering global AI compliance frameworks, risk assessment models, and ethical tech governance standards.</p>
<h3>3. Academic Institutions & Educators</h3>
<p>Universities can integrate this free courseware directly into computer science degree modules and digital literacy programs.</p>

<h2>How Does It Work? [Technical Details / Workflow]</h2>
<p>The UNESCO Coursera learning pathway is structured into self-paced digital modules. Below is the complete step-by-step progression from initial enrollment to credential verification:</p>

<div class="geo-mermaid">
flowchart TD
  A([Learner Enrolls on Coursera]) --> B[Access UNESCO Video Modules]
  B --> C[Study Case Studies & Ethics Frameworks]
  C --> D[Complete Interactive Quizzes & Assessments]
  D --> E([Earn Official Statement of Participation])
</div>

<h2>Eligibility, Key Dates & Official Resource Links</h2>
<p>Review the primary course parameters, eligible regions, and official enrollment details in the table below:</p>

<table class="geo-dates-table">
  <thead>
    <tr>
      <th>Course Parameter</th>
      <th>Official Specifications & Enrollment Requirements</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Eligible Audience</td>
      <td>Open globally to all students, developers, researchers, and professionals</td>
    </tr>
    <tr>
      <td>Tuition & Access Fee</td>
      <td>100% Free (Zero Cost Access via Coursera MOOC Platform)</td>
    </tr>
    <tr>
      <td>Partner Organizations</td>
      <td>UNESCO, LG AI Research & Global Ethics Scholars</td>
    </tr>
    <tr>
      <td>Learning Format</td>
      <td>Online, Self-Paced (Asynchronous Video & Case Study Modules)</td>
    </tr>
    <tr>
      <td>Official Course Path</td>
      <td>Coursera Global MOOC on the Ethics of AI</td>
    </tr>
  </tbody>
</table>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit the official Coursera platform page and sign up for the free UNESCO Global MOOC on the Ethics of AI.</p>
<p>2. Step 2 (Action): Work through the self-paced video lectures, case studies, and automated knowledge assessments.</p>
<p>3. Step 3 (Action): Download your statement of participation and add certified AI ethics skills to your LinkedIn profile and technical resume.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://blog.coursera.org/unesco-partners-with-coursera-and-launches-free-ai-ethics-course/" target="_blank" rel="noopener">Coursera Announcement: UNESCO Partners with Coursera for Free AI Ethics MOOC</a></li>
    <li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO Recommendation on the Ethics of Artificial Intelligence</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Is the UNESCO Coursera AI Ethics course completely free?</h4>
    <p class="faq-answer">Yes, all learning modules and course materials are available at 100% zero cost for learners worldwide.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Do I need prior programming or math experience to enroll?</h4>
    <p class="faq-answer">No technical or coding background is required. The curriculum is accessible to beginners as well as experienced engineers.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Who developed the course curriculum with UNESCO?</h4>
    <p class="faq-answer">The curriculum was co-created by UNESCO experts in collaboration with LG AI Research and international technology policy scholars.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How do I access and begin the course?</h4>
    <p class="faq-answer">You can enroll directly on Coursera by searching for the UNESCO Global MOOC on the Ethics of AI.</p>
  </div>
</div>`;

  console.log(`[*] Updating database for slug: ${slug}...`);

  const res = await client.execute({
    sql: "UPDATE articles SET content = ?, updated_at = ? WHERE slug = ?",
    args: [fullHTML, Date.now(), slug]
  });

  console.log(`[+] SUCCESS! Rows affected: ${res.rowsAffected}`);
  client.close();
}

publishArticle().catch(err => {
  console.error("[-] ERROR updating article:", err);
  process.exit(1);
});
