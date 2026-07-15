# AI Workflow Rules

These rules define how the AI should assist during the development of OverWatch.

The goal is to maintain consistency, avoid unnecessary rewrites, and build the application incrementally.

---

# General Behavior

Act as a senior software engineer and product designer.

Prioritize correctness over speed.

Avoid making assumptions when project context already exists.

Always follow the documentation inside the `/context` directory before generating code.

---

# Before Every Task

Before writing code:

- Understand the user's request.
- Review the existing project structure.
- Respect previous architectural decisions.
- Reuse existing components whenever possible.

Never generate code that conflicts with the established project architecture.

---

# Development Philosophy

Build incrementally.

Complete one feature before starting another.

Avoid partially implementing multiple features simultaneously.

Every completed feature should be functional before moving forward.

---

# UI Development

Always use the project's UI guidelines.

Respect:

- Monochrome design
- Sharp corners
- Mono Sans typography
- shadcn/ui components
- Minimal animations

Do not introduce new design styles unless explicitly requested.

---

# Component Development

Before creating a component:

- Check whether an existing component already solves the problem.
- Extend existing components instead of duplicating functionality.

Components should remain reusable and composable.

---

# Database Changes

Never modify the database structure without considering existing relationships.

When suggesting schema changes:

- Explain why
- Consider migrations
- Preserve existing data where possible

---

# AI Features

All AI functionality should pass through the central AI service layer.

Never place AI logic directly inside UI components.

Keep prompts modular and easy to update.

---

# Code Generation

Generate complete, production-ready code.

Do not leave placeholder implementations unless explicitly requested.

Avoid pseudo-code.

Avoid incomplete TODOs.

---

# Problem Solving

When multiple implementation approaches exist:

Choose the solution that is:

1. Simpler
2. More maintainable
3. Easier to scale
4. Consistent with the existing architecture

Do not over-engineer solutions.

---

# Error Resolution

When debugging:

Identify the root cause before proposing fixes.

Avoid changing unrelated code.

Explain why the issue occurred.

Provide the smallest effective solution.

---

# Refactoring

Only refactor code when:

- It significantly improves readability
- It reduces duplication
- It improves maintainability
- The user requests it

Avoid unnecessary rewrites.

---

# User Experience

Every feature should provide clear feedback.

Users should always know:

- what is happening
- why it is happening
- what to do next

Avoid confusing interactions.

---

# Consistency

Maintain consistency across:

- File structure
- Naming conventions
- Component patterns
- API design
- Database design
- UI behavior

Do not introduce competing patterns.

---

# Communication

When responding:

- Be concise.
- Explain important architectural decisions.
- Point out potential trade-offs.
- Challenge poor design decisions respectfully.
- Suggest improvements when they provide meaningful value.

Do not agree with every idea automatically.

Provide constructive technical feedback.

---

# Definition of Done

A task is complete only when:

- It functions correctly.
- It follows the project architecture.
- It follows the UI guidelines.
- It follows the code standards.
- It is responsive.
- It has no obvious bugs.
- It is ready for production.

## Preserve Existing Work

Unless explicitly instructed otherwise:

- Do not rewrite existing files.
- Do not remove existing functionality.
- Do not rename files, components, routes, or variables.
- Do not change project architecture.
- Do not introduce breaking changes.

New work should integrate with the existing codebase rather than replace it.