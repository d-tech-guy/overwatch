# OverWatch Engineering Specification
# 05 - Database Architecture & Persistence Layer
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 00-product-specification.md
- 01-investigation-engine.md
- 02-authentication.md
- 03-admin-console.md
- 04-god-console.md

---

# Purpose

The database is the single source of truth for the entire OverWatch platform.

Nothing inside the application should rely on temporary memory for critical state.

If the server crashes at any point during processing, another server should theoretically be capable of reconstructing the investigation entirely from the database.

The database is not simply storage.

It is the platform's operational memory.

Every entity, event, report, provider response, audit log, AI interaction, and investigation lifecycle transition must be persisted.

---

# Database Philosophy

The platform follows five principles.

Persistence First

Every important state change must be written before being broadcast.

---

ORM First

All database interactions must occur through Prisma.

No page.

No React component.

No server action.

No API route.

No service.

No utility.

may execute raw SQL unless absolutely unavoidable.

---

Repository Pattern

Business logic never talks directly to Prisma.

Instead

Component

↓

Server Action

↓

Service Layer

↓

Repository

↓

Prisma

↓

Database

This architecture is mandatory.

---

Append Rather Than Replace

Historical information should rarely be overwritten.

Instead create

Events

Audit entries

Timeline entries

Version records

The platform values traceability over convenience.

---

Immutable Evidence

Once an investigation completes, its evidence package becomes immutable.

Corrections should generate new records.

Never silently overwrite historical evidence.

---

# Technology Stack

Database

PostgreSQL

Provider

Supabase

ORM

Prisma

Connection Pool

Supabase Pooler

Realtime

Supabase Realtime

Migrations

Prisma Migrate

No Supabase SQL migrations should exist after the Prisma migration.

Prisma owns schema evolution.

---

# Schema Naming Convention

Tables

snake_case

Columns

snake_case

Enums

snake_case

Indexes

idx_

Foreign Keys

fk_

Unique Constraints

uq_

Check Constraints

chk_

Prisma Models

PascalCase

Prisma Fields

camelCase

---

# UUID Strategy

Every major entity owns two identifiers.

Internal UUID

Used internally.

Never exposed.

Public ID

Human readable.

Displayed in UI.

Used in URLs.

Example

INV-2026-000183

instead of

6cb9ad6d-32...

---

# Timestamp Strategy

Every table contains

created_at

updated_at

Optional

deleted_at

completed_at

approved_at

verified_at

cancelled_at

No table should rely on application time.

Database timestamps only.

---

# Soft Deletes

Entities should almost never be permanently deleted.

Instead

deleted_at

is populated.

Queries exclude deleted records by default.

Permanent deletion is reserved for future maintenance tools.

---

# Core Models

Institution

Administrator

Investigation

InvestigationTimeline

TerminalEvent

Report

Raid

RaidJob

Application

AuditLog

Notification

AIRequest

AIResponse

ProviderLog

SystemHealthSnapshot

FeatureFlag

SystemConfiguration

These are the primary platform entities.

---

# Institution

Purpose

Represents a verified educational institution.

Relationships

One Institution

↓

Many Administrators

↓

Many Investigations

↓

Many Reports

↓

Many Raids

↓

Many Notifications

Fields

id

public_id

name

aliases

type

email

website

phone

country

state

city

status

created_at

updated_at

verified_at

deleted_at

Indexes

name

status

email

---

# Administrator

Purpose

Represents an authenticated institutional administrator.

Relationships

Belongs To

Institution

Fields

id

institution_id

supabase_user_id

full_name

email

phone

role

status

last_login

created_at

updated_at

Permissions should never be stored as JSON.

Use role-based authorization.

---

# Investigation

Purpose

Primary operational entity.

Relationships

Belongs To

Institution

Has Many

Timeline Events

Terminal Events

Evidence

Reports

Comments

Metadata

AI Requests

Provider Logs

Fields

id

public_id

institution_id

submitted_url

processing_status

investigation_status

progress

risk_score

confidence_score

severity

summary

created_at

completed_at

updated_at

Indexes

public_id

processing_status

severity

institution_id

created_at

---

# Investigation Timeline

Purpose

Chronological reconstruction.

Every lifecycle transition creates one entry.

Fields

id

investigation_id

event

description

source

metadata

created_at

Timeline never deletes records.

---

# Terminal Events

Purpose

Persist terminal output.

Fields

id

investigation_id

severity

category

message

metadata

duration

timestamp

Terminal output displayed in UI originates exclusively from this table.

---

# Reports

Purpose

Final intelligence dossier.

Relationships

Belongs To

Investigation

Fields

id

investigation_id

executive_summary

full_report

recommendations

confidence

risk

generated_at

version

Reports become immutable after generation.

---

# Raid

Purpose

Represents one proactive search operation.

Relationships

Institution

↓

Raid

↓

Raid Jobs

↓

Generated Investigations

Fields

id

institution_id

status

keywords

hashtags

configuration

started_at

completed_at

created_at

Progress calculated from child jobs.

---

# Raid Jobs

Purpose

Individual work items.

Examples

Search Hashtag

Search Creator

Search Keyword

Fields

id

raid_id

provider

status

progress

started_at

completed_at

Retries occur at job level.

---

# Applications

Purpose

Pending institution requests.

Fields

institution_name

administrator_name

administrator_email

website

reason

status

reviewed_by

reviewed_at

Applications never become Institutions automatically.

Approval creates Institution.

---

# Notifications

Purpose

Deliver important events.

Fields

recipient

type

title

body

read

link

created_at

Supports realtime delivery.

---

# Audit Log

Purpose

Immutable security history.

Every privileged action creates one record.

Fields

actor

action

entity

entity_id

before

after

ip_address

user_agent

created_at

Audit logs are append-only.

Never editable.

---

# AI Requests

Purpose

Track every Gemini invocation.

Fields

investigation

model

prompt_version

tokens

latency

status

retry_count

started_at

completed_at

Every request links to its response.

---

# AI Responses

Purpose

Store original AI output.

Fields

request_id

raw_response

parsed_json

confidence

validation_status

processing_time

Never overwrite responses.

---

# Provider Logs

Purpose

Track every external provider interaction.

Fields

provider

endpoint

latency

status

response_code

investigation

error

timestamp

Providers

Gemini

Apify

Supabase

Realtime

---

# Feature Flags

Purpose

Enable controlled releases.

Fields

key

enabled

description

updated_at

No feature flag logic belongs in UI.

---

# System Configuration

Purpose

Store editable platform configuration.

Examples

Investigation timeout

Maximum retries

Provider priorities

Maintenance mode

Support email

Configuration should be cached.

---

# Indexing Strategy

Every foreign key indexed.

Every frequently filtered column indexed.

Every frequently searched identifier indexed.

Composite indexes added for

Institution + Status

Severity + Created Date

Status + Progress

Raid + Status

Never create unnecessary indexes.

Monitor query plans.

---

# Transactions

Use Prisma transactions whenever operations affect multiple entities.

Example

Create Investigation

↓

Create Timeline

↓

Create Terminal Event

↓

Commit

If one operation fails

Everything rolls back.

---

# Raw SQL Policy

Raw SQL prohibited unless

Performance

Full-text search

Unsupported Prisma feature

Every raw query requires

Comment

Reason

Benchmark

Approval

---

# Migration Strategy

Every schema change uses

Prisma Migrate

Never manually modify production schema.

Migration order

Development

↓

Review

↓

Staging

↓

Production

Every migration reversible whenever possible.

---

# Backup Strategy

Daily logical backups.

Weekly snapshots.

Monthly archives.

Backups encrypted.

Retention

90 Days

Future

Point-in-time recovery.

---

# Performance Targets

Simple Queries

<50ms

Investigation Fetch

<100ms

Report Fetch

<150ms

Search

<300ms

Bulk Operations

Chunked

No N+1 queries.

Use eager loading where appropriate.

---

# Database Rules

No business logic.

No presentation logic.

No provider-specific data structures.

No duplicated evidence.

No mutable reports.

No mutable audit logs.

No mutable timeline events.

---

# Definition of Done

The persistence layer is complete only when

✓ Every entity has a Prisma model.

✓ Every relationship is normalized.

✓ Repositories encapsulate Prisma.

✓ No raw SQL exists unnecessarily.

✓ Transactions guarantee consistency.

✓ Every critical action is audited.

✓ Reports are immutable.

✓ Soft deletes work.

✓ Indexes support expected query patterns.

✓ Database remains the authoritative source of truth.

This specification is authoritative for all persistence and data access within OverWatch.