# OverWatch Engineering Specification
## 00 - Product Specification
### Version 1.0.0

---

## Document Information

| Property | Value |
|----------|-------|
| Product | OverWatch |
| Organization | Cogni Labs |
| Document Type | Engineering Product Specification |
| Version | 1.0.0 |
| Status | Approved |
| Priority | Critical |
| Applies To | Entire Platform |
| Audience | Software Engineers, AI Coding Agents, Designers, Product Managers |
| Last Updated | July 2026 |

---

# 1. Executive Summary

OverWatch is an AI-powered Digital Threat Intelligence Platform built specifically for educational institutions.

The platform enables schools to detect, investigate, classify and document online cyberbullying incidents before they escalate into real-world violence or reputational damage.

Unlike traditional reporting platforms, OverWatch does not simply collect complaints. It actively investigates social media content using AI, metadata analysis, comment analysis, profile intelligence and behavioural classification to produce detailed intelligence reports suitable for school administrators.

The product is intentionally designed to resemble a Security Operations Center (SOC) rather than a social media dashboard.

Every interaction within the platform should reinforce the feeling that the user is conducting a digital investigation.

---

# 2. Mission

To give every educational institution the ability to proactively detect, understand and respond to online threats against their students, staff and reputation.

---

# 3. Vision

Create the world's most trusted Digital Threat Intelligence Platform for schools.

OverWatch should eventually evolve into a platform capable of monitoring multiple social media platforms including:

- TikTok
- Instagram
- Facebook
- X (Twitter)
- Snapchat
- Threads
- YouTube Shorts

Version 1 focuses exclusively on TikTok.

---

# 4. Product Philosophy

Every feature inside OverWatch must satisfy at least one of these objectives.

• Detect threats

• Understand threats

• Investigate threats

• Document threats

• Respond to threats

If a feature does not contribute to one of these objectives, it should not exist.

---

# 5. Product Identity

OverWatch is NOT:

- a social network
- a moderation tool
- a student portal
- a school management system
- a chatbot
- a generic AI application

OverWatch IS:

- Threat Intelligence Platform
- Investigation Platform
- AI Investigation Engine
- Digital Evidence Collection System
- School Cybersecurity Platform

---

# 6. Product Principles

Every engineering decision must follow these principles.

## Principle 1

Security First

The platform deals with potentially harmful content.

Every action must prioritize data integrity, auditability and accountability.

---

## Principle 2

Investigation First

The application should always feel like software used by investigators.

Avoid playful interactions.

Avoid unnecessary illustrations.

Avoid consumer-app aesthetics.

---

## Principle 3

Evidence First

Every AI conclusion should be backed by evidence.

The report should never simply state:

"The post is bullying."

Instead explain:

• why

• supporting comments

• detected language

• detected schools

• severity factors

• confidence score

---

## Principle 4

Transparency

Every investigation stage should be visible.

Users should always know:

Current task

Progress

Elapsed time

Current AI provider

Metadata provider

Failures

Retries

Completion estimate

---

## Principle 5

Realtime Everything

Nothing important should require refreshing the page.

Every investigation should stream progress live.

---

# 7. Target Users

Version One supports two categories of users.

## Guest

Unauthenticated visitor.

Capabilities:

- Submit investigation
- Watch realtime progress
- Cancel investigation
- Run investigation in background
- View completed report

Restrictions:

- No dashboard
- No saved history
- No raids
- No administration

---

## School Administrator

Authenticated administrator representing an educational institution.

Capabilities:

- Operations Center
- Investigation history
- Threat Intelligence
- Launch raids
- Export reports
- Monitor keywords
- School settings

---

## Platform Administrator

Internal OverWatch administrator.

Referred to throughout the platform as:

GOD Console Administrator

Capabilities:

- Approve schools
- Reject applications
- View all investigations
- Platform analytics
- AI monitoring
- Provider monitoring
- User management
- Emergency controls

---

# 8. Problem Statement

Schools increasingly experience coordinated harassment, insults and intimidation on social media.

These incidents often begin online but later manifest as:

• physical confrontations

• gang conflicts

• retaliation

• reputational damage

Most schools discover these incidents only after they have spread.

Current tools require administrators to manually search social media.

This process is:

- slow
- inconsistent
- difficult to document

OverWatch automates this workflow.

---

# 9. Core Capabilities

The platform must provide the following capabilities.

### Investigation

Input

TikTok URL

↓

Metadata Collection

↓

Profile Intelligence

↓

Comment Intelligence

↓

AI Analysis

↓

Evidence Generation

↓

Threat Classification

↓

Risk Assessment

↓

Report Generation

---

### Threat Monitoring

Administrators should be able to proactively search for content mentioning their institution.

This capability is internally referred to as:

Raid

---

### Reporting

Every completed investigation produces a structured intelligence report.

Reports should be exportable.

Reports should remain immutable after generation.

---

### Institution Management

Schools can request access.

Access is granted only after manual verification by the OverWatch administrator.

---

# 10. Success Metrics

The platform should optimize for:

Investigation completion time

AI accuracy

Evidence quality

False positive reduction

Threat discovery rate

Administrator response speed

Report completeness

---

# 11. Product Terminology

The following terminology must remain consistent throughout the application.

DO NOT use:

Dashboard

Instead use:

Operations Center

---

DO NOT use:

Search

Instead use:

Raid

---

DO NOT use:

User

Instead use:

Administrator

where applicable.

---

DO NOT use:

Result

Instead use:

Investigation Report

---

DO NOT use:

Loading

Instead use:

Investigating

whenever an investigation is actively running.

---

DO NOT use:

Analytics

Instead use:

Threat Intelligence

where appropriate.

---

# 12. Investigation Lifecycle

Every investigation follows exactly one lifecycle.

Queued

↓

Creating Investigation

↓

Fetching Metadata

↓

Fetching Profile

↓

Fetching Comments

↓

Preparing Evidence

↓

Running AI Analysis

↓

Generating Intelligence Report

↓

Persisting Results

↓

Completed

Failure states may occur from any processing stage.

Failures must preserve all previously collected data.

No investigation should disappear because of a failure.

Status transitions must always be persisted to the database.

---

# 13. System Boundaries

This section defines the responsibilities of OverWatch and the responsibilities of external systems.

OverWatch SHALL NOT:

- Host TikTok content.
- Modify social media posts.
- Delete social media posts.
- Contact users involved in investigations.
- Perform moderation on behalf of TikTok.
- Automatically punish schools or students.
- Act as a legal authority.

OverWatch SHALL:

- Collect publicly available metadata.
- Analyze evidence.
- Generate intelligence reports.
- Assist educational administrators.
- Maintain investigation history.
- Provide digital evidence.
- Notify administrators of completed investigations.

The application exists purely as an intelligence and investigation platform.

---

# 14. Functional Requirements

The following requirements define the minimum acceptable functionality of Version 1.

## Investigation Requirements

FR-001

Guests shall be able to submit a TikTok URL.

FR-002

The system shall validate the URL before creating an investigation.

FR-003

Every accepted investigation shall receive:

- UUID
- Public Investigation ID
- Created Timestamp
- Current Status
- Processing Status
- Progress Percentage

FR-004

Every investigation shall persist immediately before AI processing begins.

FR-005

The application shall stream investigation progress in realtime.

FR-006

Users shall never wait on a blank loading screen.

FR-007

Every stage shall produce terminal events.

FR-008

Every terminal event shall be stored.

FR-009

Completed investigations shall generate reports.

FR-010

Guests may cancel investigations.

FR-011

Guests may move investigations into Background Mode.

FR-012

Guests may resume any running investigation.

FR-013

Multiple investigations may execute simultaneously.

FR-014

Each investigation must be isolated.

Cancellation of Investigation A must never terminate Investigation B.

---

# 15. Background Investigation Requirements

Background Mode exists to improve usability.

When activated:

Current modal closes.

Investigation continues.

Realtime subscriptions remain active.

Investigation Dock becomes visible.

Landing page becomes interactive again.

The guest may begin another investigation immediately.

There shall be no restriction on the number of simultaneously running investigations other than server limitations.

Every background investigation must display:

Investigation Name

Progress

Current Stage

Elapsed Time

Status

Resume Button

Cancel Button

The dock shall persist until every investigation has reached one of:

Completed

Cancelled

Failed

---

# 16. Investigation Dock

Purpose

Provide persistent awareness of active investigations.

Location

Bottom Right

Default Width

360px

Collapsed Width

70px

Expanded Height

Auto

Behavior

Collapsed

↓

Click

↓

Expand

↓

Displays all active investigations

Every investigation card contains

Investigation ID

Progress Bar

Elapsed Time

Current Stage

Current AI Task

Resume

Cancel

Completed investigations disappear automatically after thirty seconds unless pinned.

---

# 17. Terminal Design Philosophy

The investigation terminal is NOT decorative.

It is a live operational console.

Every displayed event must originate from backend events.

Fake progress bars are prohibited.

Fake delays are prohibited.

Fake log messages are prohibited.

Every message displayed must correspond to an actual backend event.

Example

✓ Investigation Created

✓ Database Record Created

✓ Connected to Apify

✓ Metadata Retrieved

✓ Profile Retrieved

✓ Comment Retrieval Started

✓ Comments Retrieved

✓ Prompt Constructed

✓ Gemini Request Sent

✓ AI Response Received

✓ Report Generated

✓ Database Updated

✓ Investigation Completed

Failures should appear exactly as returned by backend services.

Example

ERROR

Apify Request Timed Out

Retry Attempt

2 / 3

---

# 18. Terminal Event Architecture

Every investigation event must contain:

Event ID

Timestamp

Severity

Category

Message

Progress

Elapsed Time

Source

Investigation ID

Possible sources

SYSTEM

DATABASE

APIFY

SUPABASE

PRISMA

AI

REPORT

AUTH

SERVER

CLIENT

---

# 19. Artificial Intelligence Responsibilities

Artificial Intelligence SHALL NOT:

Guess.

Invent schools.

Invent usernames.

Invent locations.

Invent evidence.

Artificial Intelligence SHALL:

Reason only from supplied evidence.

Explicitly mention uncertainty.

Provide confidence scores.

Provide explanations.

Reference supporting evidence.

Every AI response must be reproducible using stored metadata.

The original AI response JSON must always be preserved.

---

# 20. Metadata Collection

Metadata collection shall be provider-independent.

Current provider

Apify

Architecture Requirement

No page outside MetadataService may directly communicate with Apify.

Instead

UI

↓

Server Action

↓

Investigation Service

↓

Metadata Provider

↓

Apify Adapter

↓

Apify Actor

↓

Standardized Metadata Object

The remainder of the application must consume only standardized metadata.

Provider switching must require changing only configuration values.

---

# 21. Comment Collection

Comments are evidence.

The system shall retrieve comments whenever possible.

Collected fields include

Comment ID

Author

Username

Text

Likes

Replies

Pinned Status

Comment Timestamp

AI should use comments when determining:

Sentiment

Threat Level

Escalation Risk

Community Response

Bullying Severity

---

# 22. Profile Intelligence

The author's profile provides context.

Collect

Username

Display Name

Biography

Followers

Following

Verified Status

Region

Language

Total Likes

Avatar

Profile Link

The profile information shall become part of the investigation evidence package before AI analysis begins.

---

# 23. Intelligence Report Philosophy

The report is the primary product.

Everything else exists to generate it.

A report should be understandable without reopening the original TikTok post.

The report must contain sufficient evidence for school administrators to make informed decisions.

The report should resemble a professional cyber-intelligence dossier rather than an AI chat response.

Tone

Professional

Objective

Evidence-driven

Neutral

Avoid conversational language.

Never use emojis inside reports.

---

# 24. Report Sections

Every report must include

Executive Summary

Investigation Overview

Target Platform

Video Metadata

Creator Intelligence

Community Response

Detected Institutions

Severity Assessment

Evidence Timeline

AI Findings

Supporting Evidence

Recommended Administrative Actions

Technical Metadata

Processing Summary

AI Confidence Metrics

Investigation Audit Trail

Every section shall be collapsible.

Every section shall be printable.

Every section shall support PDF export.

---

# 25. Investigation Persistence

Nothing generated during an investigation should be lost.

Persist

Metadata

Timeline

Terminal Events

Evidence

Profile

Comments

Prompt

AI Response

Report

Severity

Confidence

Risk Score

Processing Time

Failure Messages

Retry Count

Progress History

Every investigation must be resumable from persisted state whenever technically possible.
