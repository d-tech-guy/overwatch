# OverWatch Engineering Specification
# 13 - Terminal Engine & Operational Telemetry System
Version: 1.0.0
Status: APPROVED
Priority: CRITICAL

Dependencies

- 01-investigation-engine.md
- 05-database.md
- 06-ai-engine.md
- 07-raid-engine.md
- 08-realtime.md
- 10-backend.md

---

# Purpose

The Terminal Engine is the operational heartbeat of OverWatch.

Unlike traditional loading indicators or progress bars, the Terminal provides a truthful, chronological, realtime view of everything occurring inside an investigation.

The terminal exists for transparency.

Users should never wonder

"What is the AI doing?"

"What stage is the investigation on?"

"Has it frozen?"

"Is it retrying?"

"What provider is currently working?"

The terminal answers every one of those questions.

It is not decorative.

It is a live operational console.

---

# Philosophy

Every line shown inside the terminal MUST originate from a real backend event.

The terminal may NEVER

simulate logs

invent progress

fake delays

artificially animate operations

guess timing

Every message displayed must correspond to an actual completed or currently running backend operation.

Truthfulness is more important than aesthetics.

---

# Architecture

Investigation

↓

Background Worker

↓

Operation

↓

Terminal Event

↓

Database

↓

Supabase Realtime

↓

Terminal UI

↓

User

The UI never generates terminal events.

It only renders persisted events.

---

# Responsibilities

The Terminal Engine shall

Display realtime backend activity

Provide operational transparency

Explain investigation progress

Surface provider failures

Surface retry attempts

Display execution timing

Provide debugging information

Allow replay of completed investigations

Support auditability

---

# Event Lifecycle

Operation Begins

↓

Terminal Event Created

↓

Persisted

↓

Broadcast

↓

Rendered

↓

Operation Ends

↓

Duration Updated

↓

Progress Updated

---

# Event Categories

SYSTEM

INVESTIGATION

AI

DATABASE

APIFY

PRISMA

SUPABASE

AUTH

REPORT

QUEUE

REALTIME

WARNING

ERROR

SECURITY

AUDIT

PERFORMANCE

Each category owns its own icon.

---

# Severity Levels

TRACE

DEBUG

INFO

SUCCESS

NOTICE

WARNING

ERROR

CRITICAL

FATAL

Color mapping should follow semantic design tokens.

Never hardcode colors.

---

# Event Structure

Each terminal event contains

Event ID

Timestamp

Category

Severity

Component

Operation

Stage

Progress

Duration

Correlation ID

Worker ID

Investigation ID

Provider

Retry Count

Message

Metadata

Expanded Data

---

# Event Types

Investigation Started

Metadata Request

Metadata Received

Profile Request

Profile Received

Comment Request

Comments Downloaded

Evidence Normalized

Prompt Built

AI Started

AI Streaming

AI Finished

Validation Started

Validation Finished

Report Started

Report Saved

Realtime Broadcast

Completed

Every event has a lifecycle.

---

# Component Naming

Examples

InvestigationService

PrismaRepository

GeminiProvider

ApifyProvider

RealtimeService

ReportGenerator

QueueWorker

NotificationService

Every event should identify its source component.

---

# Example Log

12:44:13

INFO

InvestigationService

Created investigation INV-000182

Duration

14ms

---

12:44:14

INFO

ApifyProvider

Fetching metadata

Video ID

748239923847

---

12:44:16

SUCCESS

ApifyProvider

Metadata collected

Caption

196 characters

Duration

1.8s

---

12:44:17

INFO

GeminiProvider

Constructing prompt

Evidence Size

14.2 KB

Prompt Version

6

---

12:44:29

SUCCESS

GeminiProvider

Analysis completed

Confidence

94%

Latency

11.4s

---

12:44:31

SUCCESS

ReportGenerator

Final report generated

Report Version

3

Duration

202ms

---

# Investigation Stages

Queued

↓

Initializing

↓

Metadata

↓

Profile

↓

Comments

↓

Evidence

↓

AI

↓

Validation

↓

Report

↓

Persistence

↓

Realtime

↓

Completed

Each stage maps directly to progress.

---

# Progress Engine

Progress is NOT time based.

Progress reflects completed backend stages.

Example

Initialization

5%

Metadata

20%

Profile

30%

Comments

45%

Evidence

55%

AI

75%

Validation

85%

Report

95%

Completed

100%

No fake interpolation.

---

# Timing Metrics

Every operation records

Start

Finish

Duration

Average

Historical Average

Estimated Remaining

---

# Estimated Time

Calculated using

Historical investigation durations

↓

Current stage

↓

Average provider latency

↓

Queue size

Never use static estimates.

---

# Expanded Metadata

Clicking a terminal line expands

Provider Response

Execution Details

Payload Summary

Timing

Retries

Affected Records

Correlation ID

Stack Trace (Admins only)

Guests receive simplified metadata.

---

# Search

Supports

Keyword

Category

Severity

Component

Provider

Time

Investigation ID

Correlation ID

Regex search not required.

---

# Filtering

Users may filter

Only Errors

Only AI

Only Database

Only Providers

Only Performance

Only Security

Only Warnings

Filters update instantly.

---

# Auto Scroll

Enabled by default.

Automatically pauses if

User scrolls upward.

Resume button appears.

---

# Download

Supported Formats

TXT

JSON

Markdown

CSV (future)

Downloads preserve timestamps.

---

# Replay Mode

Completed investigations may replay.

Replay simulates

Ordering

Timing

Progress

Streaming

Replay never regenerates logs.

It replays persisted events.

---

# Performance Metrics

Terminal displays

Average Stage Time

Longest Stage

Fastest Stage

Total Runtime

Provider Time

Database Time

AI Time

Realtime Time

Charts optional.

---

# Correlation IDs

Every investigation owns

One Correlation ID

Every backend operation inherits it.

Allows tracing across

Providers

Database

Realtime

Logs

Audit

---

# Worker Identification

Display

Worker ID

Queue Name

Retry Number

Job ID

Useful for debugging concurrent investigations.

---

# Retry Events

Every retry logs

Original Failure

Reason

Retry Number

Delay

Outcome

Maximum retries displayed.

---

# Failure Rendering

Errors should display

Readable explanation

↓

Technical details (expand)

↓

Suggested action

↓

Reference ID

Never expose secrets.

---

# Queue Visibility

Display

Current Queue Position

Jobs Ahead

Jobs Behind

Average Queue Time

Current Worker

---

# Provider Visibility

Display current provider.

Example

Gemini

↓

Processing

Latency

12.4s

Retries

0

Health

Healthy

Future providers should appear automatically.

---

# Database Visibility

Display

Insert

Update

Transaction

Commit

Rollback

Never expose SQL statements to guests.

Platform Admin may enable SQL debug mode.

---

# AI Visibility

Display

Prompt Version

Model

Token Count

Latency

Validation Status

Confidence

JSON Validation

Hallucination Check

This information greatly improves trust.

---

# Security Events

Examples

Permission Denied

Invalid Session

Expired Token

Failed Authorization

Security events highlighted separately.

---

# Warning Events

Examples

Provider Slow

Retry Initiated

Rate Limit Approaching

Partial Metadata

Low Confidence

Warnings remain visible.

---

# Critical Events

Examples

Database Offline

AI Provider Failed

Investigation Failed

Queue Failure

Realtime Failure

Critical events trigger notifications.

---

# Terminal Toolbar

Contains

Pause

Resume

Clear View

Download

Search

Filters

Expand All

Collapse All

Auto Scroll Toggle

Copy All

Never clears persisted logs.

Only clears UI.

---

# Keyboard Shortcuts

/

Search

Space

Pause

End

Jump Bottom

Home

Jump Top

Ctrl + C

Copy Selected

Future

Command Palette Integration

---

# Accessibility

Screen Reader Support

Keyboard Navigation

Reduced Motion

Semantic Labels

WCAG AA

Every event readable without color.

---

# Performance Targets

Initial Render

<100ms

Realtime Event

<300ms

Search

<100ms

Filtering

Instant

Replay

60 FPS

---

# Future Features

ANSI terminal rendering

Worker visualization

Distributed tracing

OpenTelemetry integration

Network waterfall

Provider flame graph

Timeline synchronization

Live CPU usage

Memory usage

Database query inspector

---

# Definition of Done

The Terminal Engine is complete only when

✓ Every displayed event originates from a persisted backend event.

✓ No simulated logs exist.

✓ Every backend stage is visible.

✓ Progress reflects real work.

✓ Timing metrics are accurate.

✓ Providers identify themselves.

✓ Retries are visible.

✓ Failures explain themselves.

✓ Replay reproduces actual investigations.

✓ Search and filtering function correctly.

✓ The terminal provides enough operational insight to diagnose an investigation without inspecting server logs.

This specification is authoritative for all terminal rendering, operational telemetry, execution logging, and realtime backend visibility within OverWatch.