# OverWatch Engineering Specification
# 01 - Investigation Engine
Version: 1.0.0
Status: Approved
Priority: Critical
Dependencies:
- 00-product-specification.md
- database.md
- architecture.md
- workflow-rules.md
- code-standards.md

---

# Purpose

The Investigation Engine is the heart of OverWatch.

Every feature within the application either creates, manages, monitors or consumes investigations.

The Investigation Engine is responsible for transforming a single TikTok URL into a complete intelligence report through a deterministic, observable, fault-tolerant and realtime processing pipeline.

This document is the single source of truth governing investigation execution.

No component may bypass this architecture.

---

# Engineering Goals

The Investigation Engine MUST satisfy the following goals.

• Deterministic

Given identical evidence, identical prompts and identical metadata providers, investigations should produce equivalent outputs.

---

• Observable

Every processing step must emit realtime events.

Nothing should happen silently.

---

• Fault Tolerant

Failure of one provider should not destroy an investigation.

Collected evidence must remain available.

---

• Persistent

No important processing state should exist exclusively in memory.

---

• Resumable

Future versions should be capable of resuming interrupted investigations.

This architecture should support that possibility from day one.

---

# High Level Architecture

Guest

↓

Landing Page

↓

submitInvestigation()

↓

Investigation Service

↓

Investigation Repository

↓

Database

↓

Realtime Event Stream

↓

Metadata Pipeline

↓

Evidence Pipeline

↓

AI Pipeline

↓

Report Pipeline

↓

Completed Investigation

---

NO PAGE

NO COMPONENT

NO SERVER ACTION

may communicate directly with Prisma except through repositories.

Repositories own the database.

Services own business logic.

UI owns presentation.

---

# Folder Structure

src/

actions/

submit-investigation.ts

cancel-investigation.ts

resume-investigation.ts

lib/

investigation/

investigation.service.ts

pipeline.service.ts

pipeline.types.ts

pipeline.constants.ts

metadata.service.ts

ai.service.ts

report.service.ts

terminal.service.ts

realtime.service.ts

repositories/

investigation.repository.ts

terminal.repository.ts

report.repository.ts

profile.repository.ts

comments.repository.ts

types/

investigation.ts

pipeline.ts

terminal.ts

hooks/

useInvestigation.ts

useRealtimeInvestigation.ts

components/

investigation/

---

# Investigation Creation

Only ONE function may create investigations.

submitInvestigation()

Responsibilities

Validate URL

Create database record

Generate Public ID

Create timeline

Emit realtime event

Return investigation identifier

Launch background pipeline

Return response immediately

This function must complete in under one second whenever possible.

Long-running work belongs to the pipeline.

Never inside submitInvestigation().

---

# Investigation Lifecycle

Queued

↓

Created

↓

Metadata

↓

Profile

↓

Comments

↓

Evidence

↓

Prompt

↓

AI

↓

Report

↓

Persist

↓

Completed

Failure

↓

Persist Failure

↓

Emit Failure

↓

Stop Pipeline

Every transition must be written to the database.

---

# Investigation State Machine

Allowed transitions

Queued

↓

Running

↓

Completed

Running

↓

Cancelled

Running

↓

Failed

Queued

↓

Cancelled

Completed

↓

Archived

Transitions not defined above are forbidden.

Repositories should reject invalid transitions.

---

# Investigation Identity

Every investigation owns

UUID

Public ID

Creation Timestamp

Completion Timestamp

Progress

Current Stage

Current Task

Elapsed Time

Retry Count

Current Provider

Current AI Model

Status

These values must always remain synchronized.

---

# Progress System

Progress is authoritative.

Never estimate randomly.

Progress updates should correspond to completed milestones.

Example

Create Investigation

5%

Metadata

20%

Profile

35%

Comments

50%

Prompt

65%

Gemini

80%

Report

95%

Persistence

100%

Progress should never decrease.

---

# Pipeline Service

PipelineService owns the investigation lifecycle.

Responsibilities

Start investigation

Move between stages

Coordinate services

Emit terminal events

Persist progress

Handle retries

Handle cancellation

Generate reports

PipelineService must never perform database queries directly.

Repositories exist for that purpose.

---

# Metadata Service

MetadataService abstracts all metadata providers.

The remainder of the application must never know whether metadata originated from

Apify

Future TikTok APIs

Custom providers

Future internal crawlers

MetadataService always returns

VideoMetadata

No exceptions.

---

# AI Service

AIService owns all communication with Gemini.

Responsibilities

Prompt construction

Prompt validation

Context construction

AI invocation

Retry handling

JSON parsing

Confidence extraction

Failure reporting

The rest of the application must never call Gemini directly.

---

# Report Service

ReportService transforms

Metadata

+

Comments

+

Profile

+

AI Output

↓

Structured Investigation Report

Responsibilities

Generate sections

Generate summary

Generate evidence

Generate recommendations

Persist report

---

# Terminal Service

Every processing stage must generate structured terminal events.

Terminal messages are not strings.

They are objects.

interface TerminalEvent {

id

timestamp

investigationId

severity

category

source

message

progress

elapsedTime

metadata

}

These objects are persisted before broadcasting.

---

# Terminal Categories

SYSTEM

DATABASE

PIPELINE

AI

REPORT

PROFILE

COMMENTS

METADATA

NETWORK

AUTH

SERVER

CLIENT

---

# Terminal Severity

INFO

SUCCESS

WARNING

ERROR

CRITICAL

The UI determines color.

The backend determines severity.

---

# Terminal Rules

Every important operation produces

Start Event

↓

Success Event

or

Failure Event

Never emit success without completion.

---

Example

Fetching Metadata

↓

Metadata Retrieved

OR

Metadata Failed

---

# Realtime Events

Every investigation owns a dedicated realtime channel.

Pattern

investigation:{publicId}

The client subscribes immediately after investigation creation.

Every update originates from the backend.

Never simulate realtime.

---

# Background Processing

Investigations continue after modal closure.

Background processing must be completely independent of UI state.

Closing

Refreshing

Navigating

must never terminate an investigation.

The investigation belongs to the backend.

Not the browser.

---

# Investigation Dock

Investigation Dock subscribes to every active investigation.

Responsibilities

Display progress

Display elapsed time

Resume modal

Cancel investigation

Collapse

Expand

Multiple investigations

Dock state persists locally.

# Execution Pipeline

The execution pipeline is the canonical workflow responsible for transforming an input URL into a completed investigation.

No component may alter the execution order.

The only valid execution order is:

Validate URL
↓

Create Investigation
↓

Emit Investigation Created Event
↓

Subscribe Client to Realtime
↓

Metadata Collection
↓

Profile Collection
↓

Comment Collection
↓

Evidence Assembly
↓

Prompt Construction
↓

Gemini Analysis
↓

Report Generation
↓

Persist Report
↓

Emit Completion Event

Every stage MUST complete before the next begins unless explicitly marked as parallel.

---

# Parallel Execution

The following operations may execute simultaneously.

Video Metadata

||

Profile Collection

||

Comment Collection

All three operations should execute using Promise.allSettled() rather than Promise.all().

Reason:

Failure of one provider should never terminate successful providers.

Example

Metadata

✓ Success

Profile

✓ Success

Comments

❌ Failed

Pipeline should continue.

Missing evidence must simply be reflected inside the report.

---

# Evidence Assembly

EvidenceService is responsible for creating the Investigation Evidence Package.

Input

Video Metadata

Profile Metadata

Comments

Historical Timeline

Output

InvestigationEvidence

The remainder of the application should consume only InvestigationEvidence.

Never raw provider data.

---

interface InvestigationEvidence

video

profile

comments

terminal

timeline

metadata

providerHealth

processingSummary

---

# Provider Health

Every provider call returns

status

latency

retryCount

error

providerName

These metrics become part of the investigation.

Example

Metadata Provider

Apify

Latency

2104ms

Retries

1

Status

SUCCESS

---

# Prompt Construction

Prompt construction must be deterministic.

The prompt builder owns

system prompt

developer prompt

evidence

metadata

instructions

No other component constructs prompts.

Pipeline

Evidence

↓

PromptBuilder

↓

Prompt

↓

Gemini

The PromptBuilder should expose only one public method.

buildInvestigationPrompt()

---

# AI Invocation

The AI Service owns

request construction

streaming

timeouts

retry

response validation

JSON extraction

No page or component should communicate with Gemini.

---

# Retry Strategy

Transient failures

↓

Retry

Maximum retries

3

Retry delays

1 second

↓

3 seconds

↓

5 seconds

Permanent failures

↓

Stop pipeline

↓

Persist failure

↓

Emit terminal event

Never retry

400

401

403

404

Invalid Prompt

Malformed JSON

Only retry

429

500

502

503

504

Timeout

Network failure

---

# Cancellation

Cancellation is cooperative.

Pipeline checks

investigation.cancelled

between every stage.

Example

Metadata

↓

Check Cancellation

↓

Continue

↓

Comments

↓

Check Cancellation

↓

Continue

↓

AI

↓

Check Cancellation

↓

Continue

If cancelled

Persist

Cancelled

Emit Event

Terminate

---

# Background Investigations

Background investigations must continue independently of browser state.

Closing browser

↓

Pipeline continues

Refreshing browser

↓

Pipeline continues

Leaving landing page

↓

Pipeline continues

Investigation state always belongs to the backend.

---

# Investigation Ownership

Investigation ownership is immutable.

Once created

Investigation owns

Timeline

Terminal

Evidence

Report

Progress

No component should duplicate these objects.

Everything references Investigation.

---

# Repository Contracts

Repositories exist only for persistence.

Repositories contain ZERO business logic.

Responsibilities

CRUD

Transactions

Queries

Pagination

Filtering

Nothing else.

Forbidden

Prompt generation

Progress calculation

Business rules

Retry logic

Realtime

---

# Investigation Repository

Required methods

create()

update()

updateProgress()

updateStatus()

markCompleted()

markCancelled()

markFailed()

findById()

findByPublicId()

list()

delete()

archive()

No custom SQL inside services.

Always use repository methods.

---

# Terminal Repository

Methods

append()

list()

clear()

count()

stream()

The UI should never write terminal events.

Only backend services.

---

# Report Repository

Methods

create()

update()

find()

export()

delete()

Reports become immutable after completion.

Only export metadata may change.

---

# Prisma Transactions

Every critical write should occur inside Prisma transactions.

Example

Create Investigation

↓

Create Timeline

↓

Create Initial Terminal Event

↓

Commit

Never create orphaned investigations.

---

# Database Consistency

Every pipeline stage must satisfy

Persist

↓

Emit Realtime

Never

Emit

↓

Persist

Reason

Realtime clients must never observe state that does not exist inside the database.

Persistence is the source of truth.

---

# Realtime Channels

Each investigation owns

investigation:{publicId}

Global dashboard owns

investigations

Operations Center owns

operations

Threat Intelligence owns

threats

God Console owns

system

Never broadcast unrelated events to unrelated channels.

---

# Realtime Payload

interface InvestigationRealtime

publicId

progress

status

stage

terminal

elapsedTime

updatedAt

providerStatus

aiStatus

Every payload should be serializable.

Never include Prisma objects.

Never include Dates.

Always serialize timestamps.

---

# Server Actions

Required server actions

submitInvestigation()

cancelInvestigation()

resumeInvestigation()

retryInvestigation()

archiveInvestigation()

launchRaid()

approveAdministrator()

rejectAdministrator()

exportReport()

Every action validates

Authentication

Authorization

Input

Business Rules

Repository

Response

In exactly that order.

---

# Error Handling

Every error must be classified.

SYSTEM

DATABASE

NETWORK

PROVIDER

AI

AUTH

VALIDATION

UNKNOWN

The UI must never display raw stack traces.

Terminal stores detailed errors.

UI displays user-friendly summaries.

---

# Definition of Done

The Investigation Engine is complete only when:

✓ Multiple investigations execute concurrently.

✓ Background mode functions correctly.

✓ Cancellation works.

✓ Terminal streams backend events.

✓ Progress reflects actual execution.

✓ Reports generate successfully.

✓ Prisma transactions guarantee consistency.

✓ Realtime updates require no refresh.

✓ Every failure is persisted.

✓ Every terminal event is stored.

✓ Every stage is independently testable.

This document is authoritative. Any implementation that diverges from this specification should be considered non-compliant.