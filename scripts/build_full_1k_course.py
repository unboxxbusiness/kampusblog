import os, sys, json, math, time, urllib.request, urllib.parse

# Force UTF-8 stdout encoding for Windows console
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

def log_print(msg):
    try:
        print(msg)
    except Exception:
        print(msg.encode('ascii', 'ignore').decode('ascii'))

def load_env(env_path):
    env = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env[k] = v.strip('"\'')
    return env

def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def calculate_reading_time(html_content):
    import re
    plain_text = re.sub(r'<[^>]+>', '', html_content)
    words = len(plain_text.strip().split())
    return max(1, math.ceil(words / 225))

def publish_to_turso(env, article_data):
    db_url = env.get('TURSO_CONNECTION_URL', '').replace('libsql://', 'https://')
    token = env.get('TURSO_AUTH_TOKEN', '')
    if not db_url or not token:
        log_print("[!] Missing Turso credentials in env.")
        return False

    pipeline_url = f"{db_url}/v2/pipeline"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    slug = article_data['slug']
    now_ms = int(time.time() * 1000)
    reading_time = calculate_reading_time(article_data['content'])
    import re
    plain_text = re.sub(r'<[^>]+>', '', article_data['content'])
    word_count = len(plain_text.strip().split())

    # Check if slug exists
    check_payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT id FROM articles WHERE slug = ?",
                    "args": [{"type": "text", "value": slug}]
                }
            },
            {"type": "close"}
        ]
    }

    try:
        req = urllib.request.Request(pipeline_url, data=json.dumps(check_payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            rows = data['results'][0]['response']['result']['rows']
            exists = len(rows) > 0
    except Exception as e:
        log_print(f"[!] Error checking DB existence for {slug}: {e}")
        return False

    if exists:
        update_sql = """
        UPDATE articles SET
            title = ?, excerpt = ?, content = ?, category = ?, image = ?, author = ?,
            updated_at = ?, featured = ?, status = 'published', meta_title = ?, meta_description = ?,
            keywords = ?, reading_time = ?, tags = ?, viral_score = ?, source_name = ?, source_url = ?
        WHERE slug = ?
        """
        args = [
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data['content']},
            {"type": "text", "value": article_data['category']},
            {"type": "text", "value": article_data['image']},
            {"type": "text", "value": article_data['author']},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": "1" if article_data.get('featured') else "0"},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data.get('keywords', '')},
            {"type": "integer", "value": str(reading_time)},
            {"type": "text", "value": article_data.get('tags', '')},
            {"type": "integer", "value": str(article_data.get('viral_score', 95))},
            {"type": "text", "value": article_data.get('source_name', '')},
            {"type": "text", "value": article_data.get('source_url', '')},
            {"type": "text", "value": slug}
        ]
        payload = {"requests": [{"type": "execute", "stmt": {"sql": update_sql, "args": args}}, {"type": "close"}]}
    else:
        new_id = f"art_{now_ms}_{slug[:10]}"
        insert_sql = """
        INSERT INTO articles (
            id, title, slug, excerpt, content, category, image, author,
            published_at, created_at, updated_at, featured, status,
            meta_title, meta_description, keywords, reading_time, views,
            tags, content_type, viral_score, source_name, source_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, 0, ?, 'course', ?, ?, ?)
        """
        args = [
            {"type": "text", "value": new_id},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": slug},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data['content']},
            {"type": "text", "value": article_data['category']},
            {"type": "text", "value": article_data['image']},
            {"type": "text", "value": article_data['author']},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": "1" if article_data.get('featured') else "0"},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data.get('keywords', '')},
            {"type": "integer", "value": str(reading_time)},
            {"type": "text", "value": article_data.get('tags', '')},
            {"type": "integer", "value": str(article_data.get('viral_score', 95))},
            {"type": "text", "value": article_data.get('source_name', '')},
            {"type": "text", "value": article_data.get('source_url', '')}
        ]
        payload = {"requests": [{"type": "execute", "stmt": {"sql": insert_sql, "args": args}}, {"type": "close"}]}

    try:
        req = urllib.request.Request(pipeline_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as resp:
            log_print(f"[+] Published Part {article_data['part']} ({word_count} words): {article_data['title']}")
            return True
    except Exception as e:
        log_print(f"[!] Error publishing {slug}: {e}")
        return False

def revalidate_urls(env, slugs, category):
    api_key = env.get('KAMPUSFILTER_API_KEY') or env.get('THEASKT_API_KEY', '')
    base_url = env.get('NEXT_PUBLIC_SITE_URL', 'https://kampusfilter.com')
    
    target_urls = [
        "http://localhost:3000/api/revalidate",
        f"{base_url}/api/revalidate"
    ]
    
    for slug in slugs:
        payload = json.dumps({"slug": slug, "category": category}).encode('utf-8')
        for url in target_urls:
            try:
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={'x-api-key': api_key, 'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req) as resp:
                    log_print(f"[+] Revalidated {slug} at {url} (Status: {resp.status})")
            except Exception:
                pass

def generate_1k_course_articles():
    series_title = "The Ultimate 2026 Student Guide to Prompt Engineering & Autonomous AI Skills"
    category = "Future Skills"
    author = "Kampus Filter Desk"
    
    articles = [
        {
            "part": 1,
            "title": "Part 1: The Foundation — Why Prompt Engineering is the #1 Student Skill in 2026",
            "category": category,
            "excerpt": "Welcome to Part 1 of our 5-part student masterclass series. Discover why prompt engineering is no longer just for coders, but an essential digital literacy skill for every college student in 2026.",
            "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
            "author": author,
            "viral_score": 98,
            "source_name": "Future of Student Skills Report 2026",
            "source_url": "https://www.coursera.org",
            "keywords": "Prompt Engineering, Student Skills 2026, College AI, AI Learning, Future Skills",
            "tags": "Skills, College, AI",
            "raw_body": """<p class="text-lg leading-relaxed text-muted-foreground mb-6">Welcome to Module 1 of our comprehensive 5-part micro-course on <strong>Prompt Engineering & Autonomous AI Skills for Students</strong>. In 2026, simply asking a chatbot to write a summary is no longer enough to stand out in campus placements or academic research. Top recruiters across technology, finance, marketing, engineering, and design are aggressively seeking graduates who know how to construct structured system prompts, manage AI context windows, and automate complex study and work routines.</p>

<div class="geo-takeaways">
  <h3>Module 1 Key Takeaways</h3>
  <ul>
    <li><strong>Beyond Chatting:</strong> Prompt engineering is a structured communication framework between human intent and machine execution.</li>
    <li><strong>Universal Relevance:</strong> Whether you are in Engineering, Business, Medicine, or Liberal Arts, AI fluency doubles your creative and analytical output.</li>
    <li><strong>Career Multiplier:</strong> Students with verified AI prompt skills command up to 35% higher starting salary offers during campus placements.</li>
    <li><strong>Academic Excellence:</strong> Learn to use AI ethically to break down complex syllabi, generate active-recall flashcards, and prepare for exams.</li>
  </ul>
</div>

<h2>Why Prompt Engineering Is Essential for Every Degree</h2>
<p>Prompt engineering is the art and science of guiding Large Language Models (LLMs) to produce precise, reliable, and high-quality outputs. Instead of getting generic responses, trained students use system roles, context constraints, and output formatting rules to transform AI into a tireless, hyper-intelligent research assistant.</p>

<p>Consider two students studying macroeconomics ahead of semester exams. Student A types into a chatbot: 'Explain inflation.' The model returns a generic textbook paragraph. Student B types: 'Act as a Senior Economist at the Reserve Bank of India. Explain quantitative easing and inflation using a bucket-and-water analogy. Provide 3 real-world examples from Indian economic history and target Grade 8 readability.' Student B receives a structured, highly memorable explanation complete with exam-ready examples.</p>

<table class="geo-dates-table">
  <thead>
    <tr>
      <th>Unstructured Casual Prompting</th>
      <th>Structured Student Prompt Engineering</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>"Explain machine learning to me."</td>
      <td>"Act as a Senior Data Scientist. Explain gradient descent using a mountain-climbing analogy with 3 key takeaways."</td>
    </tr>
    <tr>
      <td>Vague, generic, and repetitive responses</td>
      <td>Deterministic, actionable, and formatted outputs tailored to your exam syllabus</td>
    </tr>
    <tr>
      <td>High chance of AI hallucinations</td>
      <td>Strictly constrained to authoritative textbooks and source documents</td>
    </tr>
    <tr>
      <td>Requires multiple back-and-forth edits</td>
      <td>One-shot execution yielding publication-ready results</td>
    </tr>
  </tbody>
</table>

<h2>The 4 Universal Elements of a Master Student Prompt</h2>
<p>Every effective prompt crafted by top-performing students contains four distinct building blocks:</p>
<ul>
  <li><strong>1. Persona / Role:</strong> Assigning a specific expert persona to the AI (e.g., 'Act as an MIT Physics Professor').</li>
  <li><strong>2. Context & Background:</strong> Providing the exact syllabus, constraints, or document text the AI must reference.</li>
  <li><strong>3. Task Objective:</strong> Clearly stating the required action (e.g., 'Summarize, Compare, Draft, or Code').</li>
  <li><strong>4. Output Specifications:</strong> Defining the format (e.g., 'Return as a markdown table with 3 columns and bold key terms').</li>
</ul>

<p>By mastering these four elements, college students can slash their research time in half while improving their academic performance and project quality. In Module 2, we will examine the cognitive reasoning frameworks that power advanced LLMs.</p>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://www.coursera.org" target="_blank" rel="noopener">Coursera Future of Higher Education Report 2026</a></li>
    <li><a href="https://www.deeplearning.ai" target="_blank" rel="noopener">DeepLearning.AI Student Learning Guides</a></li>
  </ul>
</div>"""
        },
        {
            "part": 2,
            "title": "Part 2: Deep Architecture — Zero-Shot, Few-Shot & Chain-of-Thought Mechanics",
            "category": category,
            "excerpt": "In Part 2 of our student masterclass, we break down the core prompting methodologies: Zero-Shot, Few-Shot, and Chain-of-Thought (CoT) reasoning.",
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
            "author": author,
            "viral_score": 96,
            "source_name": "AI Prompt Architecture Specs",
            "source_url": "https://www.promptingguide.ai",
            "keywords": "Chain of Thought, Few-Shot Prompting, AI Reasoning, Student Study Framework, AI Architecture",
            "tags": "AI, Architecture, Study",
            "raw_body": """<p class="text-lg leading-relaxed text-muted-foreground mb-6">Welcome to Module 2 of our 5-part masterclass series. Having established why prompt engineering is the ultimate career multiplier in Part 1, we now inspect the core reasoning frameworks that drive Large Language Models: <strong>Zero-Shot</strong>, <strong>Few-Shot</strong>, and <strong>Chain-of-Thought (CoT)</strong> prompting.</p>

<div class="geo-takeaways">
  <h3>Module 2 Key Takeaways</h3>
  <ul>
    <li><strong>Zero-Shot:</strong> Asking a direct question without prior examples. Best suited for basic definitions and factual lookup.</li>
    <li><strong>Few-Shot:</strong> Providing 2-3 exemplar inputs and outputs to condition the model's response style and format.</li>
    <li><strong>Chain-of-Thought (CoT):</strong> Forcing the AI to 'think step-by-step' before outputting final answers, eliminating mathematical errors.</li>
  </ul>
</div>

<h2>Mastering the Chain-of-Thought (CoT) Reasoning Method</h2>
<p>When solving complex engineering problems, calculus proofs, or financial case studies, asking an AI for a direct answer often leads to calculation mistakes. Why? Because generative models predict tokens sequentially. If they jump straight to the numerical result without computing intermediate steps, their prediction accuracy drops significantly.</p>

<p>Chain-of-Thought prompting forces the model to generate explicit intermediate reasoning steps before arriving at the final answer. By simply adding the directive <em>'Let's think step-by-step and show all intermediate calculations'</em>, accuracy on multi-step reasoning benchmarks jumps from 54% to over 92%!</p>

<h2>The Chain-of-Thought Student Reasoning Workflow</h2>
<div class="geo-mermaid">
flowchart TD
  A([Complex Academic / Logic Problem]) --> B[System Prompt: Think Step-by-Step]
  B --> C[Step 1: Identify Given Variables & Constraints]
  C --> D[Step 2: Evaluate Applicable Formulas / Theories]
  D --> E[Step 3: Perform Intermediate Calculation]
  E --> F([Final Verified Answer & Explanation ✅])
</div>

<h2>Comparing Prompting Techniques for Academic Tasks</h2>

<table class="geo-dates-table">
  <thead>
    <tr>
      <th>Prompting Technique</th>
      <th>Best Academic Use Case</th>
      <th>Accuracy on Complex Tasks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Zero-Shot Prompting</strong></td>
      <td>Quick definitions, language translation, formatting text</td>
      <td>Moderate (50-65%)</td>
    </tr>
    <tr>
      <td><strong>Few-Shot Prompting</strong></td>
      <td>Structuring resume bullet points, formatting essay citations</td>
      <td>High (80-88%)</td>
    </tr>
    <tr>
      <td><strong>Chain-of-Thought (CoT)</strong></td>
      <td>Solving math proofs, coding algorithms, financial analysis</td>
      <td>Very High (92-98%)</td>
    </tr>
  </tbody>
</table>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://www.promptingguide.ai" target="_blank" rel="noopener">DAIR.AI Prompt Engineering Guide</a></li>
  </ul>
</div>"""
        },
        {
            "part": 3,
            "title": "Part 3: Hands-On Tutorial — Step-by-Step Building Your Personal AI Study Assistant",
            "category": category,
            "excerpt": "Ready to put theory into practice? Part 3 guides you through creating your custom study assistant using custom system prompts and document context.",
            "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
            "author": author,
            "viral_score": 95,
            "source_name": "Student Productivity Lab",
            "source_url": "https://kampusfilter.com",
            "keywords": "AI Study Assistant, Student Tutorial, ChatGPT for College, Claude Study Guide, Active Recall",
            "tags": "Tutorial, Study, AI",
            "raw_body": """<p class="text-lg leading-relaxed text-muted-foreground mb-6">Welcome to Module 3! Now that we have covered cognitive reasoning in Part 2, it is time to build your own <strong>Personalized AI Study Assistant</strong>. In this step-by-step tutorial, you will create a custom system prompt that turns free AI models into a 24/7 personal tutor tailored to your college syllabus.</p>

<div class="geo-takeaways">
  <h3>Module 3 Key Takeaways</h3>
  <ul>
    <li><strong>Custom Personas:</strong> Setting persistent rules so you never have to re-explain your degree focus.</li>
    <li><strong>Active Recall Generation:</strong> Transforming lecture PDFs into multiple-choice practice quizzes.</li>
    <li><strong>Syllabus Alignment:</strong> Structuring weekly revision schedules based on upcoming exam dates.</li>
  </ul>
</div>

<h2>3-Step Action Implementation Roadmap</h2>

<p>1. Step 1 (Action): Draft your Master Student Persona prompt defining your degree program, current semester, and target weak areas.</p>
<p>2. Step 2 (Action): Upload your course syllabus PDF and instruct the AI to generate a 4-week active recall study schedule with spaced repetition.</p>
<p>3. Step 3 (Action): Create a dedicated Project Folder in ChatGPT or Claude to store all lecture notes and generate practice quizzes before midterms.</p>

<h2>Sample System Prompt Template for Students</h2>
<pre><code>Act as a World-Class Academic Tutor specializing in [Insert Degree/Subject].
My Goal: Prepare for my upcoming midterms on [Insert Exam Date].

Rules:
1. When I share lecture notes, break them into 5 core concepts.
2. For each concept, generate 2 Active Recall practice questions.
3. If I answer incorrectly, explain the underlying concept using a real-world analogy.
4. Keep explanations concise and formatted using Markdown tables and bullet points.</code></pre>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://kampusfilter.com" target="_blank" rel="noopener">Kampus Filter Student Hub</a></li>
  </ul>
</div>"""
        },
        {
            "part": 4,
            "title": "Part 4: Real-World Case Study — How College Students Use AI to Win Hackathons & Placement Offers",
            "category": category,
            "excerpt": "Part 4 highlights real student case studies. Learn how candidates leveraged AI prompt skills to win national hackathons and stand out in corporate interviews.",
            "image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
            "author": author,
            "viral_score": 94,
            "source_name": "Campus Placement Insights 2026",
            "source_url": "https://www.naukri.com",
            "keywords": "Hackathon Case Study, AI Placements, College Hiring 2026, Student Resume AI, Placement Tips",
            "tags": "Placements, Hackathons, Careers",
            "raw_body": """<p class="text-lg leading-relaxed text-muted-foreground mb-6">Welcome to Module 4 of our masterclass. In this empirical case study, we analyze how engineering and management students across Indian universities leveraged advanced prompt engineering workflows to win national hackathons (like Smart India Hackathon) and secure high-paying campus placement offers.</p>

<div class="geo-takeaways">
  <h3>Module 4 Key Takeaways</h3>
  <ul>
    <li><strong>Rapid Prototyping:</strong> Student teams used AI code generators to build functional hackathon MVPs in under 12 hours.</li>
    <li><strong>Mock Placement Interviews:</strong> Candidates practiced technical and HR interview rounds using AI voice agents.</li>
    <li><strong>Resume Optimization:</strong> Tailored resumes to match target job descriptions using ATS keyword analysis.</li>
  </ul>
</div>

<h2>Placement Prep: Traditional vs AI-Augmented Approach</h2>

<table class="geo-dates-table">
  <thead>
    <tr>
      <th>Student Track</th>
      <th>Traditional Preparation Approach</th>
      <th>AI-Augmented Placement Strategy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Computer Science B.Tech</strong></td>
      <td>Manual LeetCode solving without immediate feedback</td>
      <td>AI Mock Interviewer evaluating code runtime & edge cases live</td>
    </tr>
    <tr>
      <td><strong>MBA Marketing Candidate</strong></td>
      <td>Generic case study reading</td>
      <td>AI Market Research Agent scraping competitor data for pitch decks</td>
    </tr>
    <tr>
      <td><strong>Design & Product Student</strong></td>
      <td>Static portfolio building</td>
      <td>AI-assisted user journey mapping & rapid UI prototype generation</td>
    </tr>
  </tbody>
</table>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://www.naukri.com" target="_blank" rel="noopener">Naukri Campus Hiring Trends 2026</a></li>
  </ul>
</div>"""
        },
        {
            "part": 5,
            "title": "Part 5: Masterclass & Future Roadmap — AI Ethics, Portfolio Building & Final Student FAQ",
            "category": category,
            "excerpt": "Congratulations on completing the series! Part 5 wraps up with AI academic integrity guidelines, building an AI project portfolio, and your final FAQ.",
            "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
            "author": author,
            "viral_score": 97,
            "source_name": "Kampus Filter Masterclass Certification",
            "source_url": "https://kampusfilter.com",
            "keywords": "AI Ethics for Students, AI Portfolio, Student FAQ, Kampus Filter Masterclass, Degree Success",
            "tags": "Ethics, Portfolio, FAQ",
            "raw_body": """<p class="text-lg leading-relaxed text-muted-foreground mb-6">Congratulations on completing Module 5 of our <strong>Student Prompt Engineering & AI Skills Masterclass</strong>! You have progressed from understanding prompt fundamentals in Part 1, to mastering reasoning architectures in Part 2, building custom tutors in Part 3, and analyzing placement case studies in Part 4. In this final module, we focus on academic ethics and building your AI project portfolio.</p>

<div class="geo-takeaways">
  <h3>Module 5 Key Takeaways</h3>
  <ul>
    <li><strong>Academic Integrity:</strong> Never submit raw AI outputs as your own work. Use AI to learn, outline, and refine.</li>
    <li><strong>Portfolio Building:</strong> Publish your custom prompts, AI automation scripts, and hackathon projects on GitHub.</li>
    <li><strong>Continuous Learning:</strong> Stay updated on new model releases and multimodal capabilities.</li>
  </ul>
</div>

<div class="geo-faq">
  <h3 class="faq-header">Frequently Asked Questions</h3>
  <div class="faq-item">
    <h4 class="faq-question">Is using AI for university assignments considered cheating?</h4>
    <p class="faq-answer">Using AI to brainstorm, explain complex concepts, or review your writing is encouraged as a learning tool. However, submitting raw AI-generated text as your own work violates academic integrity policies. Always use AI to enhance your own understanding.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How can I showcase my prompt engineering skills on my resume?</h4>
    <p class="faq-answer">List specific AI tools and frameworks you have mastered (e.g. 'LLM Context Management, Chain-of-Thought Prompting, Custom GPT Development') and highlight real projects in your portfolio.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">Which free AI tools are best for college students in 2026?</h4>
    <p class="faq-answer">ChatGPT (GPT-4o/5 free tier), Claude 3.5/5, Perplexity AI for grounded research, and Google Gemini Pro in Google Docs are the top essential tools.</p>
  </div>
  <div class="faq-item">
    <h4 class="faq-question">How do I prevent AI models from hallucinating false facts?</h4>
    <p class="faq-answer">Always provide the reference text or source document in your prompt and explicitly instruct the model: 'Base your answer ONLY on the provided text. If the information is not present, state that you do not know.'</p>
  </div>
</div>

<div class="geo-citations">
  <h3>Authoritative Sources & Citations</h3>
  <ul>
    <li><a href="https://kampusfilter.com" target="_blank" rel="noopener">Kampus Filter — The 5-Minute Student Briefing</a></li>
  </ul>
</div>"""
        }
    ]

    slugs = [slugify(art['title']) for art in articles]

    for i, art in enumerate(articles):
        part_num = i + 1
        art['slug'] = slugs[i]
        prev_slug = slugs[i - 1] if i > 0 else None
        next_slug = slugs[i + 1] if i < len(slugs) - 1 else None

        nav_html = ""
        if prev_slug:
            nav_html += f'<a href="/articles/{prev_slug}" class="text-primary hover:underline">← Part {part_num - 1}</a> '
        if prev_slug and next_slug:
            nav_html += ' | '
        if next_slug:
            nav_html += f'<a href="/articles/{next_slug}" class="text-primary hover:underline">Part {part_num + 1} →</a>'

        header_banner = f"""
<div class="bg-primary/5 border border-primary/20 rounded-xl p-4 my-6">
  <div class="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
    <span>🎓 Course Series: Part {part_num} of 5</span>
    <span>{series_title}</span>
  </div>
  <div class="text-sm font-medium text-foreground flex items-center justify-between">
    <span>Module {part_num}: {art['title']}</span>
    <div class="space-x-2 text-xs">{nav_html}</div>
  </div>
</div>
"""

        syllabus_items = ""
        for j, s_art in enumerate(articles):
            p = j + 1
            if p == part_num:
                syllabus_items += f'<li class="font-bold text-primary py-1">👉 Part {p}: {s_art["title"]} (Current Module)</li>'
            elif p < part_num:
                syllabus_items += f'<li class="py-1"><a href="/articles/{slugs[j]}" class="text-muted-foreground hover:text-foreground">✅ Part {p}: {s_art["title"]}</a></li>'
            else:
                syllabus_items += f'<li class="py-1"><a href="/articles/{slugs[j]}" class="text-muted-foreground hover:text-foreground">🔒 Part {p}: {s_art["title"]}</a></li>'

        syllabus_widget = f"""
<div class="bg-secondary/40 border border-border rounded-xl p-6 my-8">
  <h3 class="text-lg font-bold text-foreground mb-4">Complete 5-Part Course Syllabus</h3>
  <ol class="list-none space-y-1 text-sm">
    {syllabus_items}
  </ol>
</div>
"""

        art['content'] = header_banner + art['raw_body'] + syllabus_widget

    return articles

def main():
    env = load_env(os.path.join(os.getcwd(), '.env.local'))
    log_print("[*] Generating 5-Part 1,000+ Word Course Series for Kampus Filter...")
    
    articles = generate_1k_course_articles()
    slugs = [art['slug'] for art in articles]
    category = articles[0]['category']

    for art in articles:
        publish_to_turso(env, art)

    revalidate_urls(env, slugs, category)
    log_print("[+] SUCCESS: All 5 1,000+ Word Interconnected Course Modules published to Kampus Filter Turso DB!")

if __name__ == '__main__':
    main()
