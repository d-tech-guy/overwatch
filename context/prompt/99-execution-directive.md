# OverWatch Engineering Specification
# 99 - Master Execution Directive
Version: 1.0.0

Status

AUTHORITATIVE

Priority

ABSOLUTE

This document governs the implementation of the entire OverWatch platform.

Every markdown specification within the /context directory shall be considered part of a single engineering specification.

This document defines how those specifications are interpreted and implemented.

---

# Philosophy

You are not generating demo code.

You are not generating prototypes.

You are building production software.

Every architectural decision should optimize for

Maintainability

Scalability

Reliability

Security

Developer Experience

Accessibility

Performance

Consistency

If multiple implementation options exist,

choose the one that best satisfies these principles.

---

# Source of Truth

The following markdown specifications collectively define the platform.

00-product.md

01-investigation-engine.md

02-authentication.md

03-admin-console.md

04-god-console.md

05-database.md

06-ai-engine.md

07-raid-engine.md

08-realtime.md

09-design-system.md

10-backend.md

11-security.md

12-reporting-engine.md

13-terminal-engine.md

14-background-job-engine.md

15-notification-engine.md

16-analytics-engine.md

17-threat-intelligence.md

18+

Future specifications

Every implementation decision must respect every applicable specification.

No document supersedes another unless explicitly stated.

---

# Implementation Philosophy

The implementation must never attempt shortcuts simply because they are easier.

When a specification requires an architecture,

build the architecture.

Do not simulate.

Do not fake.

Do not stub production systems unless explicitly instructed.

Temporary mock implementations must

be isolated,

be clearly documented,

and be replaceable without affecting application architecture.

---

# Architecture First

The implementation order should always be

Architecture

↓

Database

↓

ORM

↓

Repositories

↓

Services

↓

Background Workers

↓

Providers

↓

Business Logic

↓

Realtime

↓

API

↓

UI

↓

Animations

Never begin with UI.

Never hardcode data.

Never bypass the service layer.

---

# ORM Policy

Prisma is the single source of truth for database interaction.

No component may communicate directly with PostgreSQL.

No SQL should exist inside

React Components

Server Actions

Route Handlers

Pages

Layouts

Middleware

All persistence must occur through

Repositories

↓

Services

↓

Prisma Client

---

# Backend Policy

Every feature must follow

Controller (Server Action)

↓

Service

↓

Repository

↓

Prisma

↓

Database

Business rules belong inside services.

Repositories contain persistence only.

---

# Investigation Pipeline

Every investigation must execute according to the Investigation Engine specification.

No investigation may skip stages.

No stage may fabricate completion.

Every stage must emit realtime progress.

Every stage must create terminal events.

Every stage must update the investigation state.

---

# AI Policy

AI must never generate UI.

AI must never generate HTML.

AI returns structured JSON only.

Every AI response must be validated.

Invalid JSON must never reach the UI.

All AI responses must pass through validation.

---

# Terminal Policy

The terminal is operational telemetry.

Every log displayed must originate from a real backend operation.

No fake progress.

No fake delays.

No fake terminal output.

Every log is persisted.

Every log is replayable.

---

# Reporting Policy

Reports are intelligence documents.

Not AI chat responses.

Every report must separate

Facts

↓

Evidence

↓

Inference

↓

Recommendations

Confidence must always be visible.

---

# Raid Policy

Raid execution is asynchronous.

Large raids must execute in background workers.

Raid progress must remain visible after navigation.

Users may run multiple raids simultaneously.

---

# Background Jobs

Long-running operations shall never block HTTP requests.

Every expensive operation becomes a background job.

Workers are stateless.

Jobs are resumable.

Jobs are retryable.

Jobs are cancellable.

---

# Realtime

Realtime updates are mandatory.

The UI should react to backend events.

Never poll when realtime is available.

Every important state change should be broadcast.

---

# Authentication

Authentication exists only for institution administrators and the platform administrator.

Guests require no authentication.

Institution accounts require manual approval.

Platform Administrator credentials are fixed by specification.

Role-based authorization must exist throughout the application.

---

# Security

Every endpoint must validate

Authentication

Authorization

Ownership

Input

Rate limits

No secrets exposed to client components.

---

# UI Philosophy

UI exists to communicate information.

Not decoration.

Every interface should minimize

Cognitive load

Clicks

Scrolling

Confusion

Complexity

Every major action should be discoverable.

---

# Design Language

The platform aesthetic should communicate

Precision

Authority

Security

Operational awareness

Mission control

Professionalism

The interface should resemble

SOC dashboards

Mission control systems

Intelligence software

Government operational tools

not consumer social media.

---

# Components

Every reusable UI should become a reusable component.

No duplicated component logic.

No duplicated styles.

Shared components belong inside the design system.

---

# Performance

Every page should prioritize

Server Components

Streaming

Lazy Loading

Suspense

Caching

Memoization

Code Splitting

Database optimization

Performance is part of correctness.

---

# Error Handling

Errors are expected.

Every operation should gracefully recover whenever possible.

Errors should be

Readable

Actionable

Traceable

Auditable

Never expose internal secrets.

---

# Logging

Every critical operation creates

Audit Event

Terminal Event

Performance Metric

Timeline Event

Logging is mandatory.

---

# Accessibility

Every page must satisfy WCAG AA.

Keyboard navigation required.

Screen readers supported.

Color cannot be the only indicator.

Reduced motion respected.

---

# Code Quality

The generated code should resemble work produced by a senior engineering team.

Requirements

Small functions

Single responsibility

Clear naming

Consistent patterns

Dependency injection where appropriate

Strong typing

Minimal technical debt

---

# File Organization

The folder structure defined by the architecture specifications is authoritative.

Avoid dumping unrelated files together.

Every module owns

Repositories

Services

Types

Schemas

Validation

UI

---

# Existing Code

Refactor existing code whenever necessary.

Do not preserve poor architecture merely to avoid changing files.

Improving architecture takes precedence over minimizing edits.

---

# Existing Features

Before implementing new features

understand the existing implementation,

identify architectural inconsistencies,

refactor where necessary,

then continue.

Do not layer poor implementations beneath new systems.

---

# Completion Standard

A feature is complete only when

UI exists

↓

Backend exists

↓

Database exists

↓

Realtime exists

↓

Logging exists

↓

Validation exists

↓

Authorization exists

↓

Error handling exists

↓

Loading states exist

↓

Empty states exist

↓

Responsive layouts exist

↓

Accessibility exists

↓

Documentation remains accurate

---

# Assumptions

When a specification is incomplete,

infer the solution that best aligns with

the existing architecture,

engineering best practices,

and the project's design philosophy.

Do not ask unnecessary implementation questions if a reasonable architectural decision can be made.

However,

never invent business requirements that contradict the existing specifications.

---

# Final Objective

The completed application should feel like a professional cyber-threat intelligence platform purpose-built for educational institutions.

Users should experience

trust,

clarity,

speed,

transparency,

and operational confidence.

Every interaction should reinforce the feeling that they are using a serious investigative system rather than a school project.

---

# Definition of Success

This specification is satisfied only when the generated codebase

✓ fully implements every engineering specification,

✓ follows the defined architecture,

✓ maintains consistency across all modules,

✓ avoids unnecessary technical debt,

✓ remains scalable,

✓ is production-ready,

✓ is fully typed,

✓ is secure,

✓ is maintainable,

✓ and delivers the OverWatch vision faithfully.

This document is the final authority governing implementation of the OverWatch platform.