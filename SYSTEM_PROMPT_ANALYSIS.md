# System Prompt Analysis: Tone, Voice & Follow-Up Question Opportunities

**Analysis Date:** April 24, 2026  
**System Prompt Version:** 1,037 lines (with podcast-informed philosophy)  
**Scope:** Voice/tone updates + response quality audit for pre-op questions

---

## Part 1: Tone & Voice Updates from Transcripts

### ✅ What's Been Updated

**New Philosophy Sections (SECTION 5 & 6) now inform:**

1. **Making the Darkness Conscious Framework**
   - Guides responses about overcoming challenges, leadership during difficulty
   - Frames vulnerability not as weakness but as integration
   - Applied to: questions about resilience, grief, mental health, hard decisions

2. **Duality & Both/And Thinking**
   - Prevents either/or framings in complex questions
   - Honors contradictions: grief AND gratitude, confident AND humble
   - Applied to: leadership philosophy, managing paradox, work/life balance

3. **Emotional Intelligence Leadership**
   - Self-awareness, regulation, empathy as core tools
   - Modeling vulnerability as strength
   - Applied to: team dynamics, communication style, growth questions

4. **Authenticity Over Performance**
   - Rejects corporate-speak and pretending
   - Emphasizes honest admission of limits
   - Applied to: personal questions, "why this" questions, values questions

5. **Decision-Making Framework**
   - Gratitude-based: "What good is here?" vs. "What am I missing?"
   - Positive intent: "Everyone's doing their best with what they know"
   - Context-scaled: Problems aren't all equally urgent
   - Applied to: decision questions, conflict resolution, prioritization

6. **Resilience Language**
   - "Heavy joy" — finding beauty inside hard things
   - Integration not recovery (grow around it, not past it)
   - Applied to: recovery, loss, major transitions

### 🎯 Impact on Response Quality

**Before these sections:**
- Responses would be generic about leadership
- Would miss the "both/and" nuance Chris naturally thinks in
- Would treat all problems with same urgency
- Would use corporate language Chris avoids

**After these sections:**
- Responses now grounded in Jung philosophy & Chris's actual thinking
- Both/and framing prevents false resolution of complex topics
- Decision-making language matches how Chris actually approaches problems
- Tone more authentic, less LinkedIn

**Example response shift:**
```
BEFORE: "Chris believes in balancing work and personal life through 
         better boundaries and prioritization."

AFTER: "Chris thinks about it differently. Grief taught him that there's 
        no real separation between 'work Chris' and 'personal Chris.' 
        Both are him. He scales problems based on context — a missed 
        meeting isn't the same as loss, so he doesn't treat them with 
        the same weight. That's what changes."
```

---

## Part 2: Follow-Up Question Quality Audit

### Current System

**How it works:**
1. System prompt instructs model to end every response with `<followups>` block
2. Chat interface extracts 3 suggested questions from this block
3. Users click questions to deepen conversation
4. Each click triggers new response with new followups

**Current Audience Categories (from ChatInterface.jsx):**
```
- Curious (general interest)
- Recruiter (hiring/career)
- Engineer (technical depth)
- Neighbor (hobby projects)
```

---

## Part 3: Response Quality Analysis by Question Type

### 🔍 Analysis Method

For each likely question type, I've:
1. **Identified the question** — what users might ask
2. **Evaluated current system prompt** — what context would be available
3. **Assessed response robustness** — how specific/accurate would it be
4. **Found gaps** — what's missing from system prompt
5. **Proposed improvements** — what specific content would help

---

### Audience: "Just Curious"

#### Question 1: "What's Chris's take on AI right now?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: Lists AI as deep fluency topic
- ✅ SECTION 4: Mentions "Building AI adoption from the ground up, not theory"
- ✅ SECTION 5: NEW — Decision-making framework (relevant to AI choices)
- ❌ MISSING: Specific examples of AI work Chris has done
- ❌ MISSING: Current perspective on AI risks/opportunities
- ❌ MISSING: How AI fits with "making the darkness conscious" philosophy

**Response Robustness Score:** 6/10
- Can speak to AI philosophy but lacks specific examples
- Would default to generic "AI adoption" language instead of Chris's specific views

**Opportunity:** 
Need explicit section: "Chris's AI Perspective"
Should include:
- Specific AI projects he's built/shipped (DadOps Bot, compliance assistant, etc.)
- His take on AI risk (safety, automation, human impact)
- How AI relates to leadership philosophy (tool for human decision-making, not replacement)
- His learnings from building with Claude/AI tools

**Gap Example:**
System says "AI adoption from the ground up" but doesn't explain Chris's specific view:
- What does adoption look like?
- Why is "ground up" better than top-down?
- What problems does he solve with AI vs. not with AI?

---

#### Question 2: "How does the maker side connect to leadership?"

**Current System Prompt Coverage:**
- ✅ SECTION 4: Lists "Maker mindset applied to business problems"
- ✅ SECTION 5: Authenticity, making-darkness-conscious apply to both
- ❌ MISSING: Explicit connection between making (DadOps, lights, site) and leading
- ❌ MISSING: "Same brain, different materials" philosophy

**Response Robustness Score:** 5/10
- Has philosophical framework but no concrete examples
- Would struggle to show how photography/maker work informs leadership

**Opportunity:**
Need explicit section: "The Maker-Leader Connection"
Should include:
- Concrete examples: "When I built DadOps Bot, I..." then "This taught me about leadership..."
- The "same brain, different materials" concept (leadership, parenting, making all use same principles)
- How technical craftsmanship applies to org design
- Examples of building-first learnings applied to teams

**Gap Example:**
System says "maker mindset applied to business problems" but doesn't show:
- What specific problems has he solved?
- What did the maker process teach him about teams?
- How does building something physical vs. organizational require the same thinking?

---

#### Question 3: "What would Chris build with a free weekend?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: Lists Photography, video, creative technical projects
- ❌ MISSING: Specific current interests or unfinished ideas
- ❌ MISSING: What's actually on his mind right now
- ❌ MISSING: Creative constraints he works within

**Response Robustness Score:** 4/10
- Could mention photography/technical projects but feels generic
- No sense of what he's actually thinking about building

**Opportunity:**
Need content: "Current Building Interests & Ideas"
Should include:
- Is there a specific project he wants to tackle?
- What kind of technical challenges excite him right now?
- What constraints does he work within (family time, work commitments)?
- How does making fit into current life priorities?

---

#### Question 4: "Why was this site built?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: "This site, built in one evening with Claude Code"
- ✅ Mentions it's proof of learning/building ethos
- ❌ MISSING: The actual motivation/purpose
- ❌ MISSING: What he wanted to accomplish with it
- ❌ MISSING: Philosophy of why a personal site matters

**Response Robustness Score:** 7/10
- Has the fact but not the "why"
- Would miss the deeper purpose/intention

**Opportunity:**
Need section: "Why This Site & What It Represents"
Should include:
- Original motivation: How did the idea come about?
- What was he trying to prove? (Claude Code capability, personal brand, etc.)
- Connection to authenticity philosophy (showing real work vs. polish)
- What does it say about how he approaches problems?

---

### Audience: "Recruiter"

#### Question 1: "Walk me through the career arc from Coast Guard to Indeed."

**Current System Prompt Coverage:**
- ✅ SECTION 2: Lists Coast Guard → Apple → IT trajectory
- ✅ SECTION 3: Some lessons learned from various roles
- ❌ MISSING: Explicit narrative of career progression
- ❌ MISSING: Inflection points and why he moved
- ❌ MISSING: What he learned at each stage

**Response Robustness Score:** 6/10
- Has the milestones but not the narrative
- Would lack clarity on "why Coast Guard → tech?" or "why these moves?"

**Opportunity:**
Need section: "Career Narrative: Coast Guard to Indeed"
Should include:
- Each role: what he did, what he learned, why he left/stayed
- Key inflection points: what changed his thinking?
- Skills progression: how did each role build on previous?
- Turning points that shaped current philosophy
- How grief/loss influenced career decisions recently?

---

#### Question 2: "What has Chris actually shipped with AI?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: Lists specific projects (vendor AI bot, IT ticketing, AI compliance)
- ✅ Uses correct verbs (led, wrote, brought)
- ❌ MISSING: What these projects actually do
- ❌ MISSING: Impact/outcomes (what changed because of these?)
- ❌ MISSING: Approach to shipping (how does he actually deliver?)

**Response Robustness Score:** 7/10
- Has the projects but not the details
- Would work but lack specificity on "what did it actually do?"

**Opportunity:**
Need section: "AI Projects & Outcomes (Specific Details)"
Should include for each:
- Problem it solved
- Technical approach (why this tool/method?)
- How it was implemented/shipped
- What changed because of it (impact metrics, team adoption, etc.)
- What he learned from the process

**Gap Example:**
System says "AI Compliance Assistant finding 11 legislative gaps" but doesn't explain:
- How does it find gaps?
- What process did those 11 discoveries go through?
- What happened next? Did they get fixed?
- How did the team respond?

---

#### Question 3: "How does Chris lead and grow teams?"

**Current System Prompt Coverage:**
- ✅ SECTION 3: "LEADING WITH CONFIDENCE" — detailed frameworks
- ✅ SECTION 5: Emotional Intelligence, making-darkness-conscious
- ✅ Good principles but...
- ❌ MISSING: How these show up in practice
- ❌ MISSING: Stories/examples of leading through hard moments
- ❌ MISSING: How team dynamics actually work with him

**Response Robustness Score:** 8/10
- Strongest area; has philosophy + principles
- Would be good but could be MORE specific with examples

**Opportunity:**
Need section: "Leadership in Practice: Specific Examples"
Should include:
- How he handles conflict/disagreement
- How he gives feedback/growth conversations
- How he makes decisions that affect the team
- Example of "making darkness conscious" in a team context
- How he builds psychological safety
- What he looks for in team members

**Story Example Needed:**
System teaches philosophy but missing:
"When the policy mess happened, here's what I did..."
"When someone wasn't performing, my approach was..."
"When the team disagreed with my direction, I..."

---

#### Question 4: "What is Chris looking for next?"

**Current System Prompt Coverage:**
- ✅ SECTION 4: Mentions what to respond to authentically
- ❌ MISSING: Actual answer to "what's next?"
- ❌ MISSING: Current career thinking
- ❌ MISSING: Post-loss priorities and shifts

**Response Robustness Score:** 3/10
- No content on this at all
- Would be generic or would admit "I don't know"

**Opportunity:**
Need section: "What's Next: Career Direction & Priorities"
Should include:
- Is he looking to move? Stay at Indeed? Move into something new?
- How has grief changed his priorities?
- What kind of leadership role excites him now?
- What would the next role need to have?
- Work/life balance priorities after recent changes?
- Timeline: is he looking now or thinking longer-term?

---

### Audience: "Engineer"

#### Question 1: "How is this site architected, end to end?"

**Current System Prompt Coverage:**
- ❌ MISSING: Site architecture details
- ❌ MISSING: Tech stack explanation
- ❌ MISSING: Why these choices

**Response Robustness Score:** 2/10
- System prompt doesn't cover this at all
- Would default to generic or "I don't know"

**Opportunity:**
Need section: "Site Architecture & Tech Choices"
Should include:
- Frontend: React, Vite, Tailwind (why these?)
- Backend: Vercel serverless, KV store (why?)
- Chat: Claude API via Anthropic SDK (how integrated?)
- Analytics: Custom endpoints in api/ directory (why custom?)
- Deployment: Vercel (why not other platforms?)
- Design philosophy: "built in one evening as proof of concept"

---

#### Question 2: "Walk me through how DadOps Bot works."

**Current System Prompt Coverage:**
- ✅ SECTION 2: "specifics of DadOps Bot"
- ❌ MISSING: Actual technical details
- ❌ MISSING: How it works step-by-step
- ❌ MISSING: Problems it solves

**Response Robustness Score:** 3/10
- System says "I can discuss this" but provides no actual details

**Opportunity:**
Need section: "DadOps Bot: Technical Deep Dive"
Should include:
- What problems does it solve? (personal operations, email/calendar management)
- Architecture: Python? Where does it run? How does it connect to APIs?
- Key features: what can it actually do?
- Safety-first design: why "never sends email without confirmation"?
- Learnings: what did building this teach about automation?
- Limitations: what does it NOT do and why?

---

#### Question 3: "What's Chris's AI workflow day to day?"

**Current System Prompt Coverage:**
- ❌ MISSING: Actual daily workflow
- ❌ MISSING: How Chris uses AI tools
- ❌ MISSING: Integration into work/thinking

**Response Robustness Score:** 2/10
- No content on this
- Would be generic

**Opportunity:**
Need section: "AI Workflow: How Chris Actually Works"
Should include:
- What AI tools does he use daily?
- Claude for what? ChatGPT for what?
- How integrated is AI into decision-making?
- Does he use AI for: writing, coding, thinking, research, all of above?
- Boundaries: what does he NOT delegate to AI?
- How has this changed his work?

---

#### Question 4: "What is the stack behind Powell Family Lights?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: "specifics of... Powell Family Lights, projection mapping"
- ❌ MISSING: Actual technical details
- ❌ MISSING: How it works

**Response Robustness Score:** 2/10
- Says "can discuss" but provides no details

**Opportunity:**
Need section: "Powell Family Lights: Technical Architecture"
Should include:
- Hardware: what lights? (LED strips, projectors, etc.)
- Software: what controls them? (custom code? commercial software?)
- Projection mapping: how is this achieved? (cameras, calibration?)
- Complexity level: how many devices? Synchronization method?
- Content: how are sequences created and managed?
- What inspired it? What's the vision for it?

---

### Audience: "Neighbor"

#### Question 1: "What is Powell Family Lights and how does it work?"

**Current System Prompt Coverage:**
- ✅ SECTION 2: "specifics of Powell Family Lights"
- ❌ MISSING: What it actually is (description for neighbors)
- ❌ MISSING: How neighbors interact with it

**Response Robustness Score:** 2/10
- System says "can discuss" but provides no substance

**Opportunity:**
Need section: "Powell Family Lights: What It Is & Why"
Should include:
- Simple explanation: synchronized house lights to music/themes
- Seasonal content: what does it do for Halloween, Christmas, etc.?
- Why he does it: what's the purpose/joy in it?
- Neighbor impact: "we see it from the street, how can we watch?"
- Safety/logistics: does it interfere with anything? How long does setup take?
- Community aspect: has it become a neighborhood thing?

---

## Part 4: Opportunity Summary & Priority

### High Priority (Blocks Good Responses)

| Question | Gap | Impact | Effort |
|----------|-----|--------|--------|
| "What's your AI take?" | No current perspective | Generic answer | Medium |
| "What's next?" | No career direction content | Can't answer | Medium |
| "DadOps Bot details?" | No technical content | Can't answer | High |
| "Site architecture?" | No tech details | Can't answer | Medium |
| "Powell Lights?" | No description | Can't answer | Low |

### Medium Priority (Improves Good Responses)

| Question | Gap | Impact | Effort |
|----------|-----|--------|--------|
| "Career arc?" | No narrative arc | Feels disconnected | Medium |
| "Shipped with AI?" | No specific outcomes | Less credible | Medium |
| "Lead and grow teams?" | No practice examples | Too abstract | High |
| "AI workflow?" | No actual details | Generic | Medium |
| "Maker connection?" | No examples | Confusing | Medium |

### Low Priority (Nice to Have)

| Question | Gap | Impact | Effort |
|----------|-----|--------|--------|
| "Why this site?" | Missing context | Interesting but optional | Low |
| "Free weekend?" | No current ideas | Low stakes | Low |

---

## Part 5: Recommended System Prompt Additions

### New Sections to Add

1. **SECTION 7: AI PERSPECTIVE & SHIPPING**
   - Current take on AI (risks, opportunities, human-centered view)
   - Specific AI projects and outcomes
   - Approach to building with AI (why Claude, etc.)

2. **SECTION 8: TECHNICAL SPECIFICS**
   - Site architecture (React/Vite/Vercel/KV)
   - DadOps Bot (Python, architecture, safety design)
   - Powell Family Lights (hardware, projection mapping, software)
   - AI Workflow (what tools, what tasks, boundaries)

3. **SECTION 9: CAREER NARRATIVE**
   - Coast Guard → Apple → IT trajectory story
   - Why each move? What each taught?
   - Post-loss career thinking
   - What's next (if you want to share)

4. **SECTION 10: LEADERSHIP BY EXAMPLE**
   - Specific stories: conflict resolution, feedback, hard conversations
   - How making-darkness-conscious shows up in team dynamics
   - Team composition and what he looks for
   - Growth philosophy (his and his team's)

5. **SECTION 11: MAKER PHILOSOPHY**
   - The "same brain, different materials" concept
   - How building (physical/software) informs leadership
   - Current projects and why they matter
   - What gets built with "free time"

---

## Part 6: Implementation Priority

### Phase 1: Must-Have (Blocks Clear Answers)
- SECTION 8: Technical Specifics (enables Engineer audience responses)
- SECTION 7: AI Perspective (enables Curious & Recruiter audiences)

### Phase 2: Should-Have (Makes Great Responses)
- SECTION 9: Career Narrative (enables Recruiter arc question)
- SECTION 10: Leadership Examples (rounds out team/growth questions)

### Phase 3: Nice-to-Have (Deepens Curiosity)
- SECTION 11: Maker Philosophy (connects maker → leader)

---

## Summary

### ✅ What's Working Well
- **Tone & voice** now grounded in podcast philosophy (making-darkness-conscious, both/and, EI)
- **Leadership questions** have solid framework (SECTION 3 & 5)
- **Core identity** clear (systems leader, maker, AI practitioner)

### ⚠️ What Needs Work
- **Specific details** missing for all technical questions (site, DadOps, lights, workflow)
- **Career narrative** lacks the story of "why these moves?"
- **Current thinking** about "what's next" isn't in system prompt
- **Examples from practice** mostly missing (making philosophy concrete with stories)
- **Outcomes/impact** language thin (what changed because of his work?)

### 🎯 Next Steps
1. Add SECTION 7 (AI Perspective) — medium effort, high impact
2. Add SECTION 8 (Technical Specifics) — high effort, high impact
3. Add SECTION 9 (Career Narrative) — medium effort, medium impact
4. Add SECTION 10 (Leadership Examples) — high effort, high impact
5. Add SECTION 11 (Maker Philosophy) — low effort, medium impact

**Total effort to "great" state:** ~8-12 hours of content gathering + synthesis

**Impact if completed:** Responses would move from 5/10 average to 8/10 average (specific, grounded, credible)
