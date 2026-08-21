# Career Command Center

github.com/shreeyash-thakur/career-launchpad-pro
I want you to CREATE A BRAND-NEW DASHBOARD for my existing Career Launchpad website.

IMPORTANT:

- There is currently NO dashboard.

- Do not assume an existing dashboard exists.

- Do not rebuild the entire website.

- Do not replace my existing architecture.

- First inspect the existing codebase and understand how authentication, Firebase, routing, resume data, profiles, and existing features work.

- Then create a new dashboard that integrates with those existing features.

- Preserve all existing functionality.

- Do not delete or break my existing resume builder, templates, PDF generation, authentication, certificates, profile system, or other working features.

PRODUCT VISION:

Career Launchpad should evolve from a simple resume builder into a modern 2026 AI-powered career platform.

The dashboard is the user's MAIN HOME after logging in.

It should feel like:

"Your personal AI career command center."

The dashboard should answer:

1. How career-ready am I?

2. What should I improve?

3. What should I do next?

4. Where am I in my job search?

==================================================

DASHBOARD LAYOUT

==================================================

Create a completely new dashboard route/page, for example:

/dashboard

Use the project's existing routing system instead of introducing a new framework.

==================================================

1. SIDEBAR

==================================================

Create a modern collapsible sidebar.

Logo:

Career Launchpad

Navigation:

MAIN

- Dashboard

- Career Profile

- Resumes

- Job Match

- Applications

CAREER

- Cover Letters

- Interview Prep

- Skill Gap

- Certifications

- Portfolio

AI

- Career AI

BOTTOM

- Settings

- Help

Dashboard should be highlighted as the active page.

On mobile, convert the sidebar into a drawer or suitable mobile navigation.

==================================================

2. TOP BAR

==================================================

Create a clean top navigation bar containing:

- Page title

- Search if useful

- Notification icon

- User avatar

- Authenticated user's name

- User dropdown

Use the actual logged-in user's information.

Do NOT hardcode a user name.

==================================================

3. GREETING SECTION

==================================================

At the top of the dashboard show:

"Good evening, {userName} 👋"

Subtitle:

"Let's move your career forward."

Use the authenticated user's actual name.

Under this, create a prominent AI input:

✨ Ask Career AI

Placeholder:

"Ask anything about your career..."

Examples:

"How can I improve my resume?"

"Am I ready for a backend internship?"

"What skills should I learn next?"

Create the UI and integration point.

If the existing AI functionality is not connected yet, do not invent a backend. Create the component so it can be connected later.

==================================================

4. CAREER READINESS CARD

==================================================

Create a large primary card:

🎯 Career Readiness

Display:

XX / 100

This score MUST NOT be hardcoded.

Create a reusable scoring system based on the user's available data.

Possible factors:

- Profile completeness

- Resume completeness

- Skills

- Projects

- Certifications

- Portfolio

- Interview preparation

Example:

Resume       82%

Profile      91%

Skills       74%

Projects     88%

Interview    63%

Portfolio    71%

Show a beautiful circular progress/ring or similar visualization.

Add:

"Improve my score →"

If there is insufficient data, display:

"Complete your profile to calculate your career readiness."

Do NOT create fake statistics.

==================================================

5. RECOMMENDED FOR YOU

==================================================

Create a section:

⚡ Recommended for you

Show personalized action cards.

Examples:

Card 1:

"Complete your career profile"

"Add missing information to improve your career readiness score."

Button: Complete profile

Card 2:

"Improve your resume"

"Add measurable achievements to your project descriptions."

Button: Improve resume

Card 3:

"Prepare for interviews"

"Practice technical and HR questions."

Button: Start practice

Card 4:

"Identify your skill gaps"

"Compare your skills with your target role."

Button: Analyze skills

These recommendations should be based on real available user data where possible.

For a new user, show useful onboarding recommendations instead.

==================================================

6. APPLICATION OVERVIEW

==================================================

Create a dashboard card:

📋 Applications

Show:

Saved

Applied

Interview

Offers

Rejected

Use actual application data if it exists.

If the application tracker does not exist yet:

Show:

"You haven't tracked any applications yet."

Button:

"Add application →"

Do NOT create fake applications.

==================================================

7. JOB MATCH

==================================================

Create a card:

🎯 Job Match

If the user has previously analyzed a job, show:

Job title

Company

Match percentage

Matching skills

Missing skills

Example:

Software Engineer

XYZ Technologies

82% Match

✓ Python

✓ React

✓ REST API

✓ Git

Missing:

Docker

AWS

Button:

"View Match →"

If no job has been analyzed yet:

"Paste a job description and discover how well your profile matches."

Button:

"Analyze a Job →"

==================================================

8. MY RESUMES

==================================================

Create:

📄 My Resumes

Connect this section to the EXISTING resume system.

Show the user's actual resumes.

Each card should contain:

Resume name

Last updated

ATS score if available

Actions:

Edit

Analyze

Download

Also include:

"+ Create New Resume"

Do not create fake resumes.

Use the existing resume data and PDF download functionality.

==================================================

9. INTERVIEW READINESS

==================================================

Create:

🤖 Interview Readiness

Show:

Technical

Projects

HR

Communication

If data exists, calculate/display progress.

If no interview data exists:

"Start practicing to build your interview readiness."

Button:

"Start Mock Interview →"

==================================================

10. PROFILE COMPLETION

==================================================

Create:

👤 Profile Completion

Calculate this from actual profile information.

Possible fields:

Education

Skills

Projects

Experience

Certifications

GitHub

LinkedIn

Portfolio

Career preferences

Display:

XX% Complete

with a progress bar.

Show missing items.

Button:

"Complete Profile →"

==================================================

11. CAREER ACTIVITY

==================================================

Create:

📊 Career Activity

Display actual activity where possible:

Applications

Interviews

Resumes

Certificates

Skills

AI sessions

Add a recent activity timeline.

Examples:

Updated resume

Added a project

Completed certification

Applied for a job

If there is no activity yet:

"Your career activity will appear here as you build your profile."

==================================================

DESIGN

==================================================

Make the dashboard look like a premium modern SaaS product.

Design principles:

- Clean

- Minimal

- Professional

- Modern 2026 aesthetic

- Responsive

- Desktop + tablet + mobile

- Lots of whitespace

- Subtle borders

- Soft shadows

- Medium/large rounded corners

- Modern typography

- Consistent iconography

- Subtle animations only

Do NOT make it look like:

- An old admin dashboard

- A generic Bootstrap dashboard

- A template marketplace

- An overly colorful student portal

- A dashboard filled with unnecessary charts

The dashboard should feel like a modern AI product.

==================================================

RESPONSIVE DESIGN

==================================================

Desktop:

Sidebar + spacious dashboard grid.

Tablet:

Collapsible sidebar + adaptive cards.

Mobile:

- Sidebar becomes drawer/bottom navigation

- Single-column cards

- No horizontal scrolling

- Touch-friendly buttons

- AI input remains easily accessible

- Resume cards remain usable

==================================================

EMPTY STATES

==================================================

This is VERY IMPORTANT.

Career Launchpad will have new users with no data.

Create beautiful empty states.

Examples:

No resumes:

"You haven't created a resume yet."

[ Create Resume ]

No applications:

"Start tracking your job applications."

[ Add Application ]

No job matches:

"Analyze a job description to see your match."

[ Analyze Job ]

No interview history:

"Practice your first interview."

[ Start Practice ]

Do not show fake data just to make the dashboard look populated.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Before writing code:

1. Inspect the entire existing project structure.

2. Identify the frontend framework.

3. Identify the routing system.

4. Identify Firebase configuration.

5. Identify authentication/user context.

6. Identify Firestore collections.

7. Identify existing resume data.

8. Identify existing profile data.

9. Identify existing certificate data.

10. Identify reusable UI components.

11. Identify existing styling system.

12. Identify where the dashboard route should be added.

Then create the dashboard using the EXISTING architecture.

Create reusable components such as:

DashboardLayout

DashboardSidebar

DashboardTopbar

CareerReadinessCard

CareerAIInput

RecommendationCard

ApplicationOverview

JobMatchCard

ResumeCard

InterviewReadinessCard

ProfileCompletionCard

CareerActivity

Only create components where they improve maintainability.

==================================================

DATA

==================================================

Use real authenticated user data.

Do NOT hardcode:

- User name

- Resume count

- Application count

- ATS score

- Career readiness score

- Profile percentage

- Interview score

If data doesn't exist, use an empty state.

Avoid unnecessary Firebase reads.

Reuse existing contexts/hooks where possible.

==================================================

SECURITY

==================================================

Do not expose:

- Firebase admin credentials

- OpenRouter API keys

- Any secret keys

Do not change existing Firebase security rules unless absolutely necessary.

==================================================

IMPORTANT IMPLEMENTATION PROCESS

==================================================

STEP 1:

Analyze the existing codebase.

STEP 2:

Tell me:

- Which files you will create

- Which files you will modify

- How the dashboard will connect to existing data

- How the routing will work

DO NOT CODE YET.

STEP 3:

After the plan is approved, implement the dashboard.

STEP 4:

Run the project and fix all errors.

STEP 5:

Verify:

- Login → Dashboard works

- User information loads

- Existing resume functionality still works

- Existing Firebase functionality still works

- Dashboard works for a new user with empty data

- Dashboard works for an existing user

- Desktop layout works

- Mobile layout works

- No console errors

- No broken routes

FINAL GOAL:

The user should log in and immediately see:

Career Launchpad

"Good evening 👋"

"Your career readiness"

"What should I do next?"

"Your applications"

"Your resumes"

"Your job matches"

"Your interview readiness"

"Your profile progress"

"Your career activity"

The dashboard should make Career Launchpad feel like an AI-powered career operating system rather than simply a resume builder.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9fe7969-dc21-43e3-9a02-a396f0299d29).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
