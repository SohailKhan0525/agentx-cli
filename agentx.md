CONTEXT — READ THIS FIRST



I am forking agentx and turning it into AgentX-CLI.

This is a real product I am about to publish to NPM as "agentx-cli".

Real developers will install and use this. It must work perfectly.

I am not asking for a prototype. I am asking for a finished, shippable tool.

Treat this like your job depends on getting it right, because mine does.



Before you write a single line, read the ENTIRE existing codebase.

Understand every file, every system, every flow that already works.

Do not guess. Do not assume. Read it first.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — CLEAN UP FIRST

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



Go through the entire repository and remove anything that is not

needed for a terminal-only CLI tool. Specifically remove:



\- Windows desktop app and any Windows-specific packaging

\- Linux desktop app and any Linux-specific packaging

\- macOS desktop app and any macOS-specific packaging

\- Electron wrapper code, configs, and build scripts

\- Tauri wrapper code, configs, and build scripts

\- Any GUI window code

\- Any installer scripts for desktop apps (.exe, .deb, .AppImage, .dmg builders)

\- Any CI/CD workflows that build desktop apps

\- Any documentation specifically about the desktop apps

\- Any icons, assets, or resources only used by the desktop apps

\- Any unused dependencies in package.json that were only there

&#x20; for the desktop apps (check imports before removing)



After removing, verify the project still builds and the existing

terminal interface still works exactly as before. This is critical —

do not break the terminal UI while cleaning up.



List every file and folder you removed at the end so I can review it.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 2 — DO NOT TOUCH THE INTERFACE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



This is extremely important. I love the existing terminal interface

exactly as it is. Do NOT:



\- Add a new welcome screen

\- Add new ASCII art or branding screens

\- Change how the chat input looks or behaves

\- Change how messages stream into the terminal

\- Change colors, borders, spinners, or any visual styling

\- Change keyboard shortcuts or navigation

\- Add new UI components unless absolutely required for a new

&#x20; piece of functionality that has no equivalent in the existing UI



You are ONLY changing the brain — what the AI is instructed to do,

what tools it has access to, and what happens when the user talks to it.

The way it LOOKS and FEELS must stay exactly the same as agentx.

If the existing UI already has a way to show a list of options,

collect input, stream a response, or show progress — reuse it exactly

as it already works. Do not rebuild it.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3 — RENAME THE IDENTITY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



Rename every occurrence of "agentx" throughout the entire codebase:

\- package.json: name, description, bin command, repository url

\- README.md: full rewrite, see template at the bottom of this prompt

\- All source file headers, comments, branding strings

\- CLI command name from whatever it was to: agentx

\- Any internal references, log messages, error messages



New identity:

\- Name:        AgentX-CLI

\- Command:     agentx

\- NPM package: agentx-cli

\- Version:     1.0.0

\- Description: The AI agent that builds production-ready websites from your terminal

\- GitHub:      https://github.com/SohailKhan0525/agentx-cli

\- Author:      SohailKhan0525

\- License:     MIT (keep the license file, just update the name/year)



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 4 — THE NEW BRAIN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



agentx's brain is a general purpose coding assistant.

AgentX's brain is a specialist that ONLY builds production websites.



Replace the system prompt and core agent logic so that when a user

opens agentx and starts talking, the AI behaves as a website-building

specialist that follows this exact process, using the SAME interface

elements agentx already has (chat, tool calls, streaming, file edits):



1\. UNDERSTAND THE REQUEST

&#x20;  When the user describes what they want to build, the AI must

&#x20;  fully understand the scope before doing anything. If critical

&#x20;  information is missing, it asks ONE clear question at a time

&#x20;  through the existing chat interface. It does not proceed with

&#x20;  guesses on anything that materially affects the architecture.



2\. DECIDE THE STACK

&#x20;  The AI decides the best stack itself based on the requirements.

&#x20;  It does not ask the user to pick a framework. It chooses and

&#x20;  briefly explains why, then proceeds. If the user wants something

&#x20;  different, they say so in chat like any other instruction and

&#x20;  the AI adjusts.



3\. DETECT WHAT THE PROJECT NEEDS

&#x20;  The AI analyzes the request and determines what backend services,

&#x20;  infrastructure, and integrations the project actually requires —

&#x20;  authentication, database, file storage, email, payments, search,

&#x20;  realtime, background jobs, deployment, CDN, analytics, monitoring.

&#x20;  It only asks about services that are actually needed for this

&#x20;  specific project. It recommends a specific provider for each

&#x20;  (e.g. "this needs a database — I recommend Supabase because...")

&#x20;  and asks the user to confirm or pick something else. The user can

&#x20;  request literally any provider that exists — if the AI does not

&#x20;  have built-in knowledge of it, it must look up the official

&#x20;  documentation and figure out the integration itself.



4\. ASK FOR SECRETS AND KEYS — ONE AT A TIME

&#x20;  For every confirmed service, the AI must ask the user for the

&#x20;  required API keys or secrets through the chat interface, one

&#x20;  service at a time. For each one it must:

&#x20;  - Explain exactly what the key is for

&#x20;  - Give clear numbered steps for where to find or generate it

&#x20;    (the real, correct steps for that specific provider)

&#x20;  - Give the direct docs URL

&#x20;  - Wait for the user to paste it in chat

&#x20;  - Validate the format looks correct before moving on

&#x20;  - Allow the user to skip if they don't have it yet, but make

&#x20;    clear what won't work without it

&#x20;  Never ask for all keys at once in a wall of text. One at a time,

&#x20;  conversational, clear.



5\. CONFIRM THE PLAN

&#x20;  Before writing any code, the AI presents a clear summary of what

&#x20;  it's about to build — pages, stack, services, components it plans

&#x20;  to use — through the existing interface, and asks for explicit

&#x20;  confirmation before proceeding. The user can request changes,

&#x20;  and the AI updates the plan and asks again until confirmed.



6\. BUILD — FOR REAL

&#x20;  Once confirmed, the AI builds the entire project using its

&#x20;  existing tool-use system (file read/write/edit, terminal commands,

&#x20;  whatever agentx's agent already has access to). This means:



&#x20;  - Scaffold the actual project using the real framework CLI

&#x20;    (npx create-next-app, npm create vite, etc.) — run real commands

&#x20;  - Check what tools, libraries, and dependencies are required for

&#x20;    everything being built. If something is not installed, install

&#x20;    it. If a CLI tool is needed (flyctl, vercel CLI, gh CLI, etc.)

&#x20;    and it's missing, install it first before trying to use it.

&#x20;    Never assume a tool exists — check, and install if missing.

&#x20;  - Use the local component registry (components.txt and

&#x20;    components2.txt sitting in the install directory) to source

&#x20;    premium UI components. Read both files, parse every component,

&#x20;    and when building a page, select the components that fit and

&#x20;    customize them — real colors, real copy, real props, real data —

&#x20;    not generic placeholders.

&#x20;  - Write every page, every component, every API route, every

&#x20;    database schema, every integration with complete, real,

&#x20;    working code.

&#x20;  - Wire every single service that was confirmed with real working

&#x20;    code — real SDK calls, real API endpoints, real error handling,

&#x20;    real data flowing through the app. Not stubs that "would" work.

&#x20;    Actually working code, using the actual keys the user provided.

&#x20;  - Write all environment variables to .env.local using the real

&#x20;    values the user provided. Never hardcode secrets in source files.



7\. FIX, BUILD, AND TEST BEFORE FINISHING

&#x20;  This is not optional. After all code is written, the AI must:

&#x20;  - Run the TypeScript compiler and fix every single error it finds

&#x20;  - Run the linter and fix every warning it can

&#x20;  - Start the dev server and confirm it actually starts without crashing

&#x20;  - Visit every page that was built and confirm it renders without

&#x20;    errors (use whatever browser automation tooling makes sense,

&#x20;    install Playwright if not already present)

&#x20;  - Take a screenshot of every page as proof it renders correctly

&#x20;  - Run the production build and confirm it completes successfully

&#x20;  - If anything fails at any of these steps, the AI fixes it and

&#x20;    re-runs the check. It does not stop until everything passes.

&#x20;  - Only after build + test fully pass does the AI tell the user

&#x20;    the project is ready



8\. GITHUB AND DEPLOYMENT

&#x20;  After the build is verified working, the AI asks the user if they

&#x20;  want to push to GitHub. If yes, it asks for a GitHub Personal

&#x20;  Access Token, explains exactly how to generate one with current,

&#x20;  correct steps, then actually creates the repo, commits, and pushes

&#x20;  using real git commands and the real GitHub API.



&#x20;  Then it asks about deployment to whatever platform was chosen

&#x20;  earlier (or asks now if not decided), gets any needed deployment

&#x20;  keys the same conversational way as step 4, and actually deploys

&#x20;  the project using the real platform API or CLI, polls for completion,

&#x20;  and reports back the real live URL.



9\. FINISH

&#x20;  When everything is done — built, tested, pushed, deployed — the AI

&#x20;  tells the user clearly what was accomplished: local URL, GitHub

&#x20;  URL, live URL, where screenshots are saved. Then it asks the user

&#x20;  to consider starring the AgentX-CLI repository on GitHub to support

&#x20;  the project, with the link: github.com/SohailKhan0525/agentx-cli



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE ABSOLUTE RULE — NO EXCEPTIONS, EVER

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



Every single line of code generated by AgentX, in every file, for

every project it ever builds, must be complete and genuinely working.



This means the AI is FORBIDDEN from ever writing:

\- TODO, FIXME, or any comment implying something is unfinished

\- "placeholder", "coming soon", "under construction"

\- "implement this", "add your logic here", "write your code here"

\- "your implementation here", "insert your own", "replace this"

\- example.com, test@test.com, or any obviously fake data

\- lorem ipsum or any filler text

\- mock data, fake data, sample data, dummy data of any kind

\- empty function bodies, or functions that just return null/undefined

&#x20; without performing the real logic their name implies

\- hardcoded API keys, secrets, or credentials in source code

\- any integration that "looks" wired but doesn't actually call the

&#x20; real API or doesn't actually use the real key the user provided

\- skipped error handling on any async operation or API call

\- a page, component, or route that is technically valid syntax but

&#x20; doesn't actually do the real thing it's supposed to do



If the AI does not know how to correctly implement something, it must

fetch the real, current official documentation for that library or

service and use it to write a correct implementation. There is no

acceptable reason to leave anything incomplete. Guessing wrong and

fixing it after testing is acceptable. Leaving something unfinished

is not.



This rule must be baked into the AI's core system prompt so it applies

automatically to every project AgentX ever builds, not just enforced

as an afterthought.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPONENT REGISTRY — REAL IMPLEMENTATION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



Build a real, working parser for components.txt and components2.txt.

Both files sit in the AgentX install directory and follow this format:



NAME: component name

CODE:

full raw source code here



The parser must:

1\. Actually read both files from disk using real file system calls

2\. Actually split the content correctly using "NAME:" as the

&#x20;  component boundary — handle edge cases like component names that

&#x20;  might contain colons, multi-line code with strings containing

&#x20;  "NAME:", etc. Test this with the real files I am providing.

3\. Extract the real component name and the real raw code for each

4\. Actually scan the code's import statements to detect real npm

&#x20;  package dependencies — parse real import syntax, don't guess

5\. Actually classify each component into a category using the code

&#x20;  and name content, not just a fixed lookup table — make a sensible

&#x20;  real decision

6\. Actually detect the framework from real import paths

7\. Merge both files into one in-memory array, no duplicates lost

8\. Make this available to the agent as a real tool it can call when

&#x20;  building pages — the agent should be able to ask "what components

&#x20;  are available for a landing page" and get real, accurate results

9\. When the agent selects a component to use, it must take the REAL

&#x20;  code from the registry and adapt it with real project-specific

&#x20;  values before writing it to a file — never invent a component

&#x20;  that isn't actually from the registry, and never write the raw

&#x20;  unmodified template code without customizing it for the actual

&#x20;  project



Test that this parser actually works correctly against the real

components.txt and components2.txt files before considering this done.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOOLS, LIBRARIES, AND DEPENDENCIES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



The agent must never assume a tool, library, or CLI is available.

Before using anything, it checks if it's installed. If it's not:



\- For npm packages: install them with npm install (or detect and use

&#x20; whatever package manager the project uses — npm, pnpm, yarn, bun)

\- For global CLI tools (flyctl, vercel, netlify-cli, gh, railway,

&#x20; supabase CLI, etc.): check if the command exists, and if not,

&#x20; install it using the correct official installation method for

&#x20; that specific tool, then verify it installed correctly before

&#x20; proceeding to use it

\- For system-level dependencies: check and clearly tell the user if

&#x20; something needs to be installed manually that the agent cannot

&#x20; install itself, with exact instructions



Every tool that gets installed must then actually be used to wire

real data and real functionality — installing something and not

using it correctly afterward is the same as not implementing it.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECRETS AND KEYS — REAL COLLECTION FLOW

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



The agent must actually ask the user for every secret and key it

needs through the conversation, never assume or fabricate one.

Use the existing chat interface for this — no new UI screens.



For each service the project needs, when it's time to collect that

key, the agent's message should read naturally in the existing chat

style, something like:



"This project needs a database. I'm setting it up with Supabase.

Here's how to get your key:

1\. Go to supabase.com and sign in

2\. Open or create your project

3\. Go to Project Settings → API

4\. Copy the Project URL and the anon public key

Paste them here when you're ready, or say 'skip' to continue without it."



Build real, accurate, current instructions for at minimum: Clerk,

Supabase, Firebase, Appwrite, MongoDB Atlas, PlanetScale, Stripe,

Lemon Squeezy, Resend, SendGrid, Postmark, Vercel, Netlify, Railway,

Fly.io, Cloudflare Pages, AWS S3, Cloudflare R2, Uploadthing,

GitHub Personal Access Tokens, PostHog, Sentry.



For any other service the user mentions that isn't in that list,

look up the real current documentation for how to get an API key

for that specific service and generate accurate instructions from it.

Never guess or make up steps — verify against real docs.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUILD, FIX, AND TEST — VERIFY BEFORE DONE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



I will personally test the final tool, so this must actually work

end to end, not just look correct. Before you consider this task

complete, you must:



1\. Run a full build of the AgentX-CLI tool itself (not a generated

&#x20;  project — the actual agentx-cli codebase) and fix every

&#x20;  TypeScript error and every build error until it compiles cleanly

2\. Run the linter on the AgentX-CLI codebase and fix every issue

3\. Actually run `npm link` (or the equivalent) and actually run the

&#x20;  `agentx` command yourself to confirm the CLI starts up correctly

&#x20;  and the existing interface renders properly with no errors

4\. Confirm the components.txt and components2.txt parser actually

&#x20;  loads and parses the real files correctly — print the component

&#x20;  count and verify it's accurate

5\. Walk through the full conversation flow yourself as if you were

&#x20;  a real user — describe a simple website, go through stack

&#x20;  detection, service detection, and confirm the agent's responses

&#x20;  make sense and the flow works without crashing

6\. Fix anything that breaks during this walkthrough

7\. Only report back to me that this is done once you have actually

&#x20;  verified all of the above yourself. Do not tell me it's ready

&#x20;  unless you've actually tested it and confirmed it works.



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

README — REPLACE COMPLETELY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



\# AgentX-CLI



!\[Stars](https://img.shields.io/github/stars/SohailKhan0525/agentx-cli?style=social)

!\[npm](https://img.shields.io/npm/v/agentx-cli)

!\[License](https://img.shields.io/github/license/SohailKhan0525/agentx-cli)



> The AI agent that builds production-ready websites from your terminal.

> Describe your website. AgentX builds it, deploys it, and ships it.

> Not a demo. Not an MVP. A real website, live on the internet.



\## Install

npm install -g agentx-cli



\## Use

agentx



Then just talk to it. Tell it what you want to build.



\## What AgentX Does

1\. You describe your website in plain English

2\. AgentX figures out the best stack and explains its choice

3\. AgentX figures out what backend services you actually need

4\. It asks you for keys one at a time, with clear instructions

&#x20;  for getting each one

5\. It confirms the full plan with you before building

6\. It builds every page, wires every integration, with real

&#x20;  production-quality code — no placeholders, ever

7\. It fixes, builds, and tests everything before calling it done

8\. It pushes to GitHub and deploys live if you want

9\. Your website is on the internet



\## Supported Services

Any service that exists. Built-in guidance for Clerk, Supabase,

Firebase, Appwrite, MongoDB Atlas, PlanetScale, Stripe, Lemon Squeezy,

Resend, SendGrid, Postmark, Vercel, Netlify, Railway, Fly.io,

Cloudflare Pages, AWS S3, Cloudflare R2, Uploadthing, PostHog, Sentry,

and anything else — AgentX reads the docs and figures it out.



\## Component Registry

AgentX ships with a registry of premium UI components sourced from

ReactBits and 21st.dev. When it builds your pages, it pulls from

this registry and customizes real components for your project —

not generic, basic-looking output.



\## Star This Project ⭐

If AgentX-CLI helped you ship something real, please star the repo.

github.com/SohailKhan0525/agentx-cli



━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAST THING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



This matters a lot to me. I am about to publish this to NPM for

real developers to use. Please take the time to actually read the

existing code, actually understand it, actually build everything

described above completely, and actually test it before telling me

it's done. I would rather it take longer and be correct than be fast

and broken. Thank you for taking this seriously.

