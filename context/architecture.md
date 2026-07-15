# Architecture

## Overview

OverWatch is a full-stack AI-powered web application designed to detect and investigate cyberbullying targeted at schools on TikTok.

The application is built around a simple workflow:

1. Anyone submits a public TikTok URL.
2. The system retrieves the available public content and metadata.
3. AI analyzes the content for school-targeted harassment.
4. An investigation report is generated.
5. School administrators review the report and decide on the appropriate action.

The system is designed around human review. AI assists with investigation but never makes disciplinary decisions.

---

# Technology Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Framer Motion

---

## Backend

The backend is built using Next.js Route Handlers and Server Actions.

Responsibilities include:

- Authentication
- TikTok URL processing
- AI orchestration
- Database operations
- Report generation

---

## Database

Supabase PostgreSQL

Stores:

- Users
- Schools
- Incidents
- AI Reports
- Investigation Notes
- System Settings

---

## Authentication

Supabase Auth

Supported Roles:

- Super Admin
- School Administrator

Authentication is only required for administrative features.

Public users can submit TikTok URLs without creating an account.

---

## Storage

Supabase Storage

Used for:

- Generated report assets
- Extracted thumbnails
- Temporary investigation artifacts

---

## Artificial Intelligence

OverWatch communicates with AI through a dedicated AI Service Layer.

This abstraction keeps the application independent of any single AI provider and makes future provider changes straightforward.

Current provider:

- Google Gemini

AI responsibilities include:

- School identification
- Cyberbullying detection
- Harm classification
- Sentiment analysis
- Risk scoring
- Evidence summarization
- Investigation report generation

---

## Validation

- Zod

---

## Forms

- React Hook Form

---

## Charts

- Recharts

Used throughout the administrator dashboard for analytics and reporting.

---

## PDF Generation

- @react-pdf/renderer

Used to generate professional investigation reports.

---

## Notifications

- Sonner

Used for in-app feedback and system notifications.

---

## Deployment

- here.now

---

# System Architecture

Public User

↓

Landing Page

↓

Paste TikTok URL

↓

Create Investigation

↓

Retrieve Public TikTok Content

↓

AI Analysis Pipeline

↓

Generate Investigation Report

↓

Save Incident

↓

Notify School Dashboard

↓

Administrator Review

↓

Resolve Investigation

---

# Investigation Workflow

## Public Submission

Anyone can submit a public TikTok link for investigation.

No authentication is required.

The landing page acts as the public reporting portal.

---

## AI Processing

Once submitted, the system retrieves all publicly available information from the TikTok post, including:

- Caption
- Hashtags
- Comments
- Upload timestamp
- Creator information
- Available engagement metrics
- Video content

The AI analyzes this information and produces a structured investigation report.

---

## Administrator Review

School administrators can:

- View investigations
- Read AI summaries
- Review evidence
- Confirm incidents
- Mark false positives
- Add investigation notes
- Archive completed investigations
- Export reports

---

# Design Principles

- AI assists, humans decide.
- Every AI conclusion must be supported by evidence.
- Public reporting should require as little friction as possible.
- Administrative workflows should prioritize speed and clarity.
- Every investigation should be explainable and auditable.

---

# Future Architecture

The AI layer is intentionally provider-agnostic.

Future versions may integrate:

- Additional AI providers
- Automated social media monitoring
- Multi-platform investigations
- Ministry-wide administration
- Real-time notification services