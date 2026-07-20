import os
import json
import urllib.request

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split('=', 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip().strip('"').strip("'")
                    os.environ[key] = val

load_env()

db_url = os.environ.get('TURSO_CONNECTION_URL', '')
db_token = os.environ.get('TURSO_AUTH_TOKEN', '')
http_url = db_url.replace('libsql://', 'https://')
pipeline_url = f"{http_url}/v2/pipeline"
headers = {
    "Authorization": f"Bearer {db_token}",
    "Content-Type": "application/json"
}

slug = "unesco-coursera-launch-free-global-ai-ethics-course"

rich_content = """<p>UNESCO has officially partnered with Coursera and LG AI Research to roll out the Global MOOC on the Ethics of AI. This free initiative aims to equip students, researchers, and professionals with fundamental skills in responsible technology deployment.</p>

<div class="geo-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li><strong>Free Global Access:</strong> Learners around the world can enroll in the UNESCO AI Ethics course on Coursera at zero cost.</li>
    <li><strong>Industry Collaboration:</strong> Co-developed with LG AI Research, combining academic governance standards with enterprise AI principles.</li>
    <li><strong>Career-Boosting Credential:</strong> Provides verified foundational knowledge in ethical AI frameworks, algorithmic bias, and tech policy.</li>
  </ul>
</div>

<h2>Introduction: UNESCO and Coursera AI Ethics Course</h2>
<p>Artificial intelligence is rapidly reshaping higher education, software engineering, and digital workforce demands. To address the critical need for ethical oversight and governance, UNESCO and Coursera have launched an open-access global learning program. The initiative is built to democratize AI education and help young professionals navigate ethical dilemmas in machine learning deployment.</p>

<h2>What Happened? Global Coalition Launches Free AI Training</h2>
<p>On July 20, 2026, UNESCO announced its flagship partnership with online learning platform Coursera and LG AI Research. Together, they unveiled the Global MOOC on the Ethics of AI. The curriculum draws directly from UNESCO's globally endorsed Recommendation on the Ethics of Artificial Intelligence, focusing on human rights, fairness, privacy preservation, and algorithmic transparency.</p>

<h2>Why It Matters</h2>
<p>As generative AI models become integrated into commercial tools and academic workflows, employers increasingly prioritize candidates who understand AI safety and compliance. Obtaining formal instruction in AI ethics gives students a competitive edge in job markets where tech regulation and responsible AI implementation are paramount.</p>

<h2>Who Should Care?</h2>
<h3>1. Students and Graduates</h3>
<p>Computer science, data science, and humanities students gain essential insights into how algorithms impact society and how to build safer software systems.</p>
<h3>2. Job Seekers & Aspirants</h3>
<p>Professionals preparing for tech, product management, or policy roles can showcase certified knowledge in enterprise AI ethics to prospective recruiters.</p>
<h3>3. Institutions</h3>
<p>Universities and educational organizations can integrate this open courseware into their digital literacy and engineering ethics curricula.</p>

<h2>How Does It Work? [Technical Details / Workflow]</h2>
<p>The UNESCO Coursera learning pathway follows a structured, self-paced progression from registration to credential verification:</p>

<div class="geo-mermaid">
flowchart TD
  Student([Learner Registers]) -->|Access Course Page| Coursera[Coursera Platform]
  Coursera -->|Self-Paced Learning| Modules[UNESCO & LG AI Video Modules]
  Modules -->|Interactive Assessment| Quiz[Case Study & Ethics Quizzes]
  Quiz -->|Verification| Certificate([Statement of Participation Issued])
</div>

<h2>Eligibility, Dates & Resource Links</h2>
<p>Review the primary enrollment parameters, course format, and official resource links below:</p>

<table class="geo-dates-table">
  <thead>
    <tr>
      <th>Course Parameter</th>
      <th>Official Requirements & Specifications</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Eligible Audience</td>
      <td>Open globally to all students, developers, and professionals (No prerequisites)</td>
    </tr>
    <tr>
      <td>Tuition & Fee</td>
      <td>100% Free Access (Global MOOC Initiative)</td>
    </tr>
    <tr>
      <td>Course Platform</td>
      <td>Coursera (Developed by UNESCO & LG AI Research)</td>
    </tr>
    <tr>
      <td>Format & Pace</td>
      <td>Online, Self-Paced (Asynchronous Learning Modules)</td>
    </tr>
    <tr>
      <td>Official Enrollment Path</td>
      <td>Coursera Global MOOC on the Ethics of AI</td>
    </tr>
  </tbody>
</table>

<h2>What Should You Do Next?</h2>
<p>1. Step 1 (Action): Visit the official Coursera course page to register for the Global MOOC on the Ethics of AI.</p>
<p>2. Step 2 (Action): Complete the self-paced video modules and interactive case study assessments.</p>
<p>3. Step 3 (Action): Add your statement of participation to your LinkedIn profile and resume to highlight your skills in ethical tech.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://blog.coursera.org/unesco-partners-with-coursera-and-launches-free-ai-ethics-course/" target="_blank" rel="noopener">Coursera Official Announcement: UNESCO AI Ethics Course</a></li>
    <li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO Recommendation on the Ethics of Artificial Intelligence</a></li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Is the UNESCO Coursera AI Ethics course completely free?</h4>
    <p class="faq-answer">Yes, the course modules and learning materials are available at zero cost for learners worldwide.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Do I need prior coding or AI experience to enroll?</h4>
    <p class="faq-answer">No technical or programming prerequisites are required; it is suitable for beginners and experts alike.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Who developed the course content with UNESCO?</h4>
    <p class="faq-answer">The course was developed by UNESCO in collaboration with LG AI Research and international AI ethics scholars.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How do I access and start learning?</h4>
    <p class="faq-answer">You can enroll directly on Coursera by searching for the UNESCO Global MOOC on the Ethics of AI.</p>
  </div>
</div>"""

payload = {
    "requests": [
        {
            "type": "execute",
            "stmt": {
                "sql": "UPDATE articles SET content = ?, updated_at = ? WHERE slug = ?",
                "args": [
                    {"type": "text", "value": rich_content},
                    {"type": "integer", "value": "1784537476875"},
                    {"type": "text", "value": slug}
                ]
            }
        },
        {"type": "close"}
    ]
}

req = urllib.request.Request(
    pipeline_url,
    data=json.dumps(payload).encode('utf-8'),
    headers=headers,
    method='POST'
)

out_file = os.path.join(os.path.dirname(__file__), '..', 'force_update_log.txt')

try:
    with urllib.request.urlopen(req) as resp:
        res_json = json.loads(resp.read().decode('utf-8'))
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write("SUCCESS: Updated content column in Turso DB!\n" + json.dumps(res_json, indent=2))
except Exception as e:
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(f"ERROR: {e}")
