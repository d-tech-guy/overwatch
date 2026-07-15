# Code Standards

These rules apply to every piece of code generated for OverWatch.

Always follow these standards unless explicitly instructed otherwise.

---

# General Principles

- Prioritize readability over cleverness.
- Prefer maintainable code over short code.
- Write code that another developer can immediately understand.
- Avoid unnecessary abstractions.
- Keep components focused on a single responsibility.
- Prefer composition over duplication.

---

# Tech Stack

Always use:

- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Framer Motion
- Supabase
- Supabase Auth
- Zod

Do not introduce additional libraries unless absolutely necessary.

---

# TypeScript

Always use strict typing.

Never use:

- any

Prefer:

- interfaces
- type aliases
- inferred types where appropriate

Always define types for:

- props
- API responses
- database models
- utility functions

---

# React

Prefer Server Components.

Use Client Components only when required.

Keep components small.

Extract reusable UI instead of duplicating code.

Do not place large components in a single file.

---

# File Organization

Organize files by feature whenever possible.

Keep related logic together.

Avoid deeply nested folders.

Use clear and descriptive file names.

---

# Styling

Use Tailwind CSS.

Do not write inline styles.

Avoid custom CSS unless necessary.

Use Tailwind utility classes consistently.

Keep spacing consistent.

---

# Components

Use shadcn/ui components whenever possible.

Wrap or extend components instead of modifying library code.

Components should:

- accept props
- remain reusable
- avoid unnecessary internal state

---

# Icons

Always use Lucide React.

Use consistent icon sizes throughout the application.

Avoid decorative icons.

---

# State Management

Prefer:

- Server Components
- Server Actions
- React hooks

Avoid introducing global state unless required.

Keep state as close as possible to where it is used.

---

# Forms

Use:

- React Hook Form
- Zod validation

Validate all user input.

Display clear validation messages.

---

# Database

Never query the database directly inside components.

Keep database logic inside dedicated server functions.

Always validate input before database operations.

---

# AI Integration

All AI interactions must go through a dedicated AI service layer.

Never call the AI provider directly from UI components.

The application should remain provider-independent.

---

# Error Handling

Handle expected errors gracefully.

Never expose internal errors to users.

Provide helpful error messages.

Log unexpected failures.

---

# Loading States

Every asynchronous action should include:

- loading state
- success state
- failure state

Never leave users wondering whether something is happening.

---

# Accessibility

Every interactive element must include:

- keyboard support
- accessible labels
- sufficient contrast

Never rely solely on icons.

---

# Performance

Avoid unnecessary re-renders.

Lazy load heavy components where appropriate.

Optimize images.

Keep client-side JavaScript to a minimum.

---

# Naming Conventions

Use descriptive names.

Examples:

Good

- IncidentCard
- InvestigationTimeline
- ReportSummary
- RiskScoreBadge

Avoid:

- Card1
- Utils2
- DataComponent

---

# Comments

Do not comment obvious code.

Only add comments when explaining:

- business logic
- architecture decisions
- complex algorithms

Code should explain itself whenever possible.

---

# User Experience

Every user action should provide immediate feedback.

Buttons should indicate loading.

Forms should validate clearly.

Navigation should feel responsive.

Never leave users uncertain about the current system state.

---

# Code Quality

Before completing any task, ensure:

- No TypeScript errors
- No ESLint warnings
- No unused imports
- No duplicate code
- No dead code
- Consistent formatting
- Fully responsive layouts

Code should always be production-ready.

## Existing Code

Before creating a new component, utility, hook, or function:

- Search the project for an existing implementation.
- Reuse existing code whenever possible.
- Extend existing components instead of duplicating them.
- Maintain consistency with the established architecture.

Avoid introducing duplicate functionality.