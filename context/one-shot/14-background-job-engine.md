# OverWatch Engineering Specification
# 14 - Background Job Engine & Distributed Worker Architecture
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
- 13-terminal-engine.md

---

# Purpose

The Background Job Engine is responsible for executing every long-running operation within OverWatch.

The user interface should never wait for operations that require external providers, AI inference, metadata collection, report generation, or large-scale searches.

Instead, every expensive operation should become a background job that is observable, resumable, cancellable, retryable, and fault tolerant.

The Background Job Engine transforms OverWatch from a request-response application into an event-driven intelligence platform.

---

# Philosophy

A browser session is temporary.

An investigation is not.

Investigations should continue even if

the browser closes,

the network disconnects,

the administrator logs out,

or another user begins monitoring the same investigation.

Jobs belong to the platform.

Not to the browser.

---

# Objectives

The Background Job Engine shall

Execute long-running tasks

Distribute work

Persist progress

Retry failures

Support cancellation

Recover after crashes

Resume interrupted work

Publish realtime updates

Produce truthful telemetry

Maintain auditability

---

# High-Level Architecture

Client

↓

Server Action

↓

Job Dispatcher

↓

Queue

↓

Worker

↓

Provider

↓

Database

↓

Realtime

↓

Terminal

↓

Report

---

# Job Lifecycle

Created

↓

Queued

↓

Waiting

↓

Reserved

↓

Running

↓

Succeeded

OR

Failed

OR

Cancelled

OR

Timed Out

Every transition is persisted.

---

# Job States

CREATED

QUEUED

WAITING

RUNNING

RETRYING

COMPLETED

FAILED

CANCELLED

DEAD_LETTER

Only one active state exists.

---

# Queue Architecture

Each job belongs to one queue.

Queues

Investigation Queue

Raid Queue

AI Queue

Metadata Queue

Comment Queue

Report Queue

Notification Queue

Maintenance Queue

Future queues may be added without architecture changes.

---

# Worker Architecture

Queue

↓

Worker

↓

Job

↓

Progress

↓

Completion

Workers are stateless.

Workers should be replaceable.

Workers may execute on different machines.

---

# Worker Responsibilities

Workers

Reserve jobs

Execute work

Update progress

Write terminal events

Persist results

Retry failures

Release resources

Never communicate directly with UI.

---

# Job Types

Investigation Job

Metadata Job

Comment Job

Profile Job

AI Job

Validation Job

Report Job

Raid Job

Notification Job

Cleanup Job

Analytics Job

---

# Investigation Pipeline

Submit Investigation

↓

Create Investigation

↓

Queue Metadata Job

↓

Queue Profile Job

↓

Queue Comment Job

↓

Wait

↓

Queue AI Job

↓

Queue Validation Job

↓

Queue Report Job

↓

Completed

Every stage creates terminal events.

---

# Parallel Execution

Independent jobs execute simultaneously.

Example

Metadata

↓

Profile

↓

Comments

run concurrently.

AI waits for all evidence.

---

# Dependencies

Jobs may depend on other jobs.

Example

AI Job

depends on

Metadata

Profile

Comments

Workers should not poll unnecessarily.

Dependency completion emits events.

---

# Job Payload

Each payload contains

Job ID

Investigation ID

Correlation ID

Job Type

Priority

Retry Count

Created At

Scheduled At

Worker Metadata

Provider Configuration

Payload Version

---

# Priority Levels

LOW

NORMAL

HIGH

URGENT

CRITICAL

Higher priority jobs receive workers first.

---

# Scheduling

Jobs may execute

Immediately

At a specific time

After another job

After delay

Recurring (future)

---

# Cancellation

Jobs may be cancelled by

Guest

(Own investigation only)

Institution Administrator

Platform Administrator

Cancellation Flow

Request

↓

Validation

↓

Worker Interrupt

↓

Persist State

↓

Broadcast

↓

Terminal Event

↓

Timeline Event

Cancelled jobs never resume automatically.

---

# Background Investigations

Guests may select

Run In Background

Investigation continues normally.

UI closes.

Background Operations Widget appears.

Progress remains visible.

---

# Background Operations Center

Displays

Running Jobs

Current Stage

Progress

Elapsed Time

Queue Position

Estimated Time Remaining

Cancel

Open Investigation

Collapse

Expand

Supports multiple concurrent jobs.

---

# Retry Strategy

Retryable Errors

Provider Timeout

Temporary Network Failure

Rate Limits

Transient Database Errors

Non-retryable

Validation Failure

Permission Failure

Malformed Input

Maximum Retries

3

Configurable.

---

# Retry Policy

Attempt 1

↓

5 seconds

Attempt 2

↓

15 seconds

Attempt 3

↓

60 seconds

Exponential backoff preferred.

Every retry logged.

---

# Dead Letter Queue

Purpose

Store permanently failed jobs.

Contains

Payload

Failure Reason

Retry History

Worker

Timestamp

Correlation ID

Platform Administrators may inspect.

Jobs never disappear.

---

# Timeout Policy

Every job defines

Maximum Runtime

Examples

Metadata

30s

Comments

60s

AI

120s

Report

20s

Timeout creates failure event.

---

# Progress Reporting

Workers report

Current Stage

Completed Steps

Percentage

Elapsed Time

Estimated Remaining

Progress derives from actual work.

Never fake increments.

---

# Heartbeats

Running workers emit heartbeats.

Frequency

Every 5 seconds

Contains

Worker ID

Current Stage

Memory Usage (future)

Current Operation

Heartbeat loss indicates worker failure.

---

# Worker Recovery

If heartbeat lost

↓

Job returned to queue

↓

Another worker reserves job

↓

Execution resumes

Duplicate execution prevented.

---

# Idempotency

Every job is idempotent.

Re-execution must never

Duplicate reports

Duplicate investigations

Duplicate notifications

Duplicate database records

Repositories enforce uniqueness.

---

# Concurrency

Maximum concurrent workers configurable.

Examples

Metadata Workers

10

AI Workers

3

Report Workers

5

Future auto-scaling.

---

# Resource Limits

Workers monitor

CPU

Memory

Execution Time

Queue Size

Platform Administrator dashboard displays utilization.

---

# Job Logging

Every job creates

Terminal Events

Timeline Events

Audit Events

Performance Metrics

Logs searchable.

---

# Queue Monitoring

Metrics

Queue Length

Running Jobs

Failed Jobs

Dead Letter Count

Average Wait Time

Average Runtime

Success Rate

Visible in GOD Console.

---

# Notifications

Users receive realtime notifications

Job Started

Job Completed

Job Failed

Job Cancelled

Report Ready

Notifications respect permissions.

---

# Failure Handling

Failures categorized

Provider

Database

Worker

Validation

Timeout

Unknown

Every failure creates

Terminal Event

Audit Event

Timeline Event

---

# Cleanup Jobs

Scheduled maintenance

Archive old logs

Delete expired tokens

Optimize database

Refresh analytics

Cleanup temporary files

Runs automatically.

---

# Security

Workers never expose

Secrets

API Keys

Database Credentials

Internal Stack Traces

Jobs execute with minimum privileges.

---

# Performance Targets

Job Dispatch

<50ms

Worker Reservation

<100ms

Realtime Update

<500ms

Retry Decision

<20ms

Queue Throughput

Scalable

---

# Future Enhancements

Distributed Workers

Horizontal Scaling

Kubernetes

Redis Queue

Temporal.io

Inngest

Trigger.dev

Priority Inheritance

Predictive Scheduling

GPU AI Workers

Automatic Load Balancing

Multi-region Workers

---

# Definition of Done

The Background Job Engine is complete only when

✓ Long-running operations execute outside request lifecycles.

✓ Jobs persist independently of browser sessions.

✓ Workers execute safely and idempotently.

✓ Retries follow exponential backoff.

✓ Dead Letter Queue preserves failed jobs.

✓ Background investigations survive disconnects.

✓ Progress reflects real execution.

✓ Queue metrics are observable.

✓ Heartbeats detect worker failures.

✓ Jobs recover safely after interruptions.

✓ Every background operation is fully auditable.

This specification is authoritative for all asynchronous execution, distributed workers, queue management, retries, cancellation, recovery, and background processing within OverWatch.