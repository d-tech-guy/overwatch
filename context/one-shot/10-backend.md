# OverWatch Engineering Specification
# 10 - API Layer, Server Actions & Backend Architecture
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 05-database.md
- 06-ai-engine.md
- 07-raid-engine.md
- 08-realtime.md

---

# Purpose

The Backend Layer is responsible for orchestrating every business process inside OverWatch.

It is the bridge between

Client

↓

Business Logic

↓

Database

↓

AI

↓

Realtime

↓

External Providers

The backend should contain **zero presentation logic**.

It should exist purely to coordinate platform operations.

---

# Architecture

Client

↓

Server Actions

↓

Services

↓

Repositories

↓

Prisma

↓

PostgreSQL

External Providers communicate only through Services.

Never directly from Components.

---

# Guiding Principles

Every backend function should

Be deterministic.

Be transactional.

Be idempotent when appropriate.

Be observable.

Be testable.

Be strongly typed.

Never expose implementation details.

---

# Folder Structure

src/

actions/

services/

repositories/

providers/

validators/

schemas/

events/

lib/

db/

auth/

terminal/

ai/

raid/

report/

notification/

Every folder has one responsibility.

---

# Server Actions

Server Actions are the only entry point from React components.

Components must never import repositories.

Components must never import Prisma.

Components never contain business logic.

---

# Server Action Pattern

UI

↓

Server Action

↓

Input Validation

↓

Service

↓

Repository

↓

Database

↓

Realtime

↓

Return DTO

---

# Naming Convention

Every server action begins with a verb.

Examples

submitInvestigation()

cancelInvestigation()

approveInstitution()

rejectInstitution()

startRaid()

retryInvestigation()

generateReport()

archiveInvestigation()

markNotificationRead()

---

# Investigation Actions

submitInvestigation()

Purpose

Create a new investigation.

Flow

Validate URL

↓

Create Investigation

↓

Create Timeline

↓

Create Terminal Event

↓

Dispatch Background Worker

↓

Broadcast Realtime

↓

Return Investigation

---

cancelInvestigation()

Requirements

Only owner

Not completed

Creates audit event

Creates timeline event

Cancels workers

Broadcast cancellation

---

retryInvestigation()

Requirements

Platform Admin

Institution Admin

Not completed

Maximum retry count respected.

---

runInBackground()

Purpose

Detach UI from investigation.

The investigation continues normally.

Client receives

Tracking Token

↓

Reconnects

↓

Realtime resumes.

---

# Report Actions

generateReport()

RegenerateReport()

ExportPDF()

ExportMarkdown()

ExportJSON()

Every report export logs an audit event.

---

# Raid Actions

createRaid()

cancelRaid()

pauseRaid()

resumeRaid()

retryRaid()

deleteRaid()

Raids execute asynchronously.

---

# Authentication Actions

signIn()

signOut()

registerInstitution()

verifyAccessPhrase()

refreshSession()

requestApproval()

Institution creation never grants access automatically.

---

# Institution Actions

approveInstitution()

rejectInstitution()

suspendInstitution()

restoreInstitution()

updateInstitution()

All privileged actions require audit logging.

---

# Administrator Actions

createAdministrator()

disableAdministrator()

transferOwnership()

updatePermissions()

removeAdministrator()

Only Platform Administrator may modify platform roles.

---

# Notification Actions

createNotification()

markRead()

archiveNotification()

deleteNotification()

Notifications broadcast immediately.

---

# Search Actions

globalSearch()

searchInvestigations()

searchReports()

searchRaids()

searchInstitutions()

Results should return DTOs only.

Never Prisma models.

---

# DTO Strategy

Never expose database models directly.

Every response uses DTOs.

Example

InvestigationDTO

Contains

Public ID

Progress

Status

Summary

Risk

Confidence

Current Stage

Never expose

Internal UUIDs

Secrets

Foreign Keys

---

# Validation

Every action validates

Authentication

Authorization

Input

Business Rules

Database Constraints

Validation occurs before database writes.

---

# Input Validation

Preferred

Zod

Every input schema stored separately.

schemas/

investigation.schema.ts

raid.schema.ts

institution.schema.ts

---

# Error Handling

Never throw raw database errors.

Convert to platform errors.

Example

DATABASE_UNAVAILABLE

↓

"The investigation could not be created."

Include

Reference ID

Retry Suggestion

---

# Error Categories

Validation

Authentication

Authorization

Database

Provider

AI

Network

Unknown

Each category logged separately.

---

# Transactions

Required when multiple entities are affected.

Example

Create Investigation

↓

Timeline

↓

Terminal Event

↓

Audit Log

↓

Notification

↓

Commit

Rollback on failure.

---

# Repositories

Repositories own persistence.

Services never execute Prisma directly.

Example

InvestigationRepository

InstitutionRepository

RaidRepository

NotificationRepository

AuditRepository

Repositories never know UI.

---

# Services

Services own business logic.

Examples

InvestigationService

AIService

RaidService

ReportService

RealtimeService

NotificationService

AuditService

Services coordinate repositories.

---

# Provider Layer

External APIs isolated.

Providers

GeminiProvider

ApifyProvider

SupabaseStorageProvider

Future

TikTokOfficialProvider

OpenAIProvider

Provider interfaces remain stable.

---

# Event System

Every significant action emits events.

Examples

InvestigationCreated

AICompleted

RaidStarted

ReportGenerated

InstitutionApproved

NotificationCreated

Events persist before broadcast.

---

# Logging

Every request receives

Correlation ID

Every log includes

Timestamp

User

Institution

Action

Duration

Status

Correlation ID

Logs searchable in GOD Console.

---

# Background Jobs

Long-running operations never block requests.

Examples

AI Processing

Raid Execution

Report Generation

Metadata Collection

Comment Collection

Workers update progress through events.

---

# Rate Limiting

Protect

Investigations

Raids

Authentication

Registration

Search

Limits configurable.

---

# Security

Never trust client input.

Always authorize server-side.

Never expose

Secrets

API Keys

Database IDs

Internal Stack Traces

Use least-privilege access.

---

# Performance Targets

Action Validation

<20ms

Database Read

<50ms

Database Write

<100ms

Action Response

<300ms

Background Dispatch

<100ms

---

# Testing Strategy

Unit Tests

Repositories

Services

Validators

Integration Tests

Server Actions

Database

Providers

End-to-End

Critical user journeys

---

# Definition of Done

The Backend Architecture is complete only when

✓ Components contain no business logic.

✓ Server Actions are the only client entry point.

✓ Services orchestrate workflows.

✓ Repositories encapsulate Prisma.

✓ DTOs protect internal models.

✓ Validation is comprehensive.

✓ Transactions guarantee consistency.

✓ Providers remain replaceable.

✓ Events power realtime updates.

✓ Logs provide complete observability.

This specification is authoritative for all backend architecture, server actions, services, repositories, and API interactions within OverWatch.