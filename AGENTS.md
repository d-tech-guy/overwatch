<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
# AGENTS.md

## Project Overview

OverWatch is an AI-powered cyberbullying investigation platform built for secondary schools.

The platform analyzes publicly submitted TikTok URLs, generates structured AI investigation reports, and enables school administrators to review and resolve incidents.

The goal is to assist investigations, not automate disciplinary decisions.

---

# Read First

Before making any changes, review the following files in the `/context` directory:

1. product.md
2. architecture.md
3. database.md
4. ai.md
5. workflow.md
6. ui.md
7. code-standards.md
8. ai-workflow.md
9. progress.md

These documents define the architecture and development standards of the project.

---

# Primary Responsibilities

As an AI agent, your responsibilities are to:

- Follow the established architecture.
- Respect the design system.
- Produce production-ready code.
- Reuse existing components.
- Maintain consistency across the codebase.
- Preserve existing functionality unless explicitly instructed otherwise.

---

# Development Rules

- Build incrementally.
- Complete one feature at a time.
- Do not introduce unnecessary dependencies.
- Keep components focused and reusable.
- Use Server Components whenever possible.
- Keep client-side JavaScript to a minimum.

---

# Design Rules

The application follows a strict monochrome design system.

Requirements:

- Sharp corners
- Mono Sans typography
- Minimal animations
- Border-based layouts
- High information density
- Professional dashboard aesthetics

Do not introduce rounded corners or colorful UI elements unless explicitly requested.

---

# Coding Standards

Always follow the project's coding standards.

Never:

- Use `any`
- Duplicate functionality
- Create unnecessary abstractions
- Ignore TypeScript errors
- Ignore linting issues

---

# AI Integration

All AI functionality must pass through the centralized AI service layer.

Never call AI providers directly from UI components.

Keep prompts modular and maintainable.

---

# Database

Respect existing relationships.

Do not change the schema without considering migrations and data integrity.

Always validate input before database operations.

---

# Before Completing Any Task

Ensure that:

- The solution is production-ready.
- The code follows the project architecture.
- The UI follows the design system.
- The implementation is responsive.
- Existing functionality remains intact.
- No unnecessary files or dependencies have been introduced.

---

# Project Goal

Every contribution should make OverWatch feel like professional intelligence software used by educational institutions to investigate and resolve cyberbullying incidents.

When in doubt, prioritize simplicity, consistency, and maintainability over complexity.