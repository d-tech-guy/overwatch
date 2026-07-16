# OverWatch Engineering Specification
# 08 - Realtime Architecture & Distributed Event System
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 01-investigation-engine.md
- 05-database.md
- 06-ai-engine.md
- 07-raid-engine.md

---

# Purpose

Realtime is one of the defining features of OverWatch.

The application should never feel like a traditional CRUD dashboard.

Administrators should experience the platform as if they are watching a live cyber operation unfold.

Information should arrive.

Not be refreshed.

Realtime is responsible for synchronizing every investigation, raid, report, notification and operational event across every connected client.

---

# Philosophy

The UI should always represent the current state of the platform.

Users should never wonder

"Do I need to refresh?"

Refreshing should never be part of the workflow.

---

# Technology Stack

Realtime Provider

Supabase Realtime

Database

PostgreSQL

Transport

WebSockets

Authentication

Supabase Auth

State Management

React Query

Optimistic Updates

Realtime Reconciliation

---

# Event Architecture

Database Change

↓

Repository

↓

Commit

↓

Realtime Event

↓

Supabase Channel

↓

Connected Clients

↓

Local Store

↓

UI Updates

Database writes always occur before broadcasts.

---

# Event Principles

Realtime events are

Stateless

Ordered

Idempotent

Serializable

Versioned

Clients should be capable of replaying events safely.

---

# Event Categories

Investigation Events

Raid Events

Report Events

Institution Events

Authentication Events

Threat Events

Timeline Events

Terminal Events

Notification Events

Provider Events

Audit Events

System Events

---

# Investigation Channel

investigation:{public_id}

Purpose

Broadcast investigation-specific updates.

Subscribers

Guest

Institution Administrator

Platform Administrator

Events

Created

Queued

Metadata Retrieved

Comments Retrieved

AI Started

AI Completed

Report Generated

Completed

Cancelled

Failed

Progress Updated

---

# Institution Channel

institution:{institution_id}

Purpose

Broadcast institution-wide events.

Events

Investigation Created

Threat Updated

Raid Started

Raid Completed

Notification Created

Administrator Added

Application Approved

---

# Platform Channel

platform

Purpose

Broadcast platform-wide operational events.

Subscribers

Platform Administrator only.

Events

Provider Failure

Migration

Health Change

Critical Threat

Maintenance Mode

Application Submitted

Platform Alert

---

# Raid Channel

raid:{raid_id}

Purpose

Broadcast raid-specific progress.

Events

Created

Searching

Metadata Retrieved

Comments Retrieved

Duplicate Removed

Investigation Created

Completed

Cancelled

Failed

Progress Updated

---

# Report Channel

report:{report_id}

Purpose

Notify clients when reports become available.

Events

Generating

Generated

Archived

Exported

---

# Notification Channel

notification:{user_id}

Purpose

Deliver realtime notifications.

Events

Created

Read

Archived

Dismissed

---

# Terminal Channel

terminal:{investigation_id}

Purpose

Stream backend execution logs.

Each message corresponds to one persisted TerminalEvent.

Fields

Timestamp

Severity

Component

Operation

Message

Duration

Metadata

Never stream simulated logs.

---

# Timeline Channel

timeline:{investigation_id}

Purpose

Update chronological investigation events.

Events

Stage Started

Stage Completed

Severity Changed

Evidence Added

Recommendation Updated

Report Completed

---

# Presence

Purpose

Track active users.

Displays

Administrator Online

Administrator Offline

Viewing Investigation

Viewing Raid

Viewing Report

Future

Collaborative investigation mode.

---

# Presence States

Offline

Idle

Viewing

Editing

Monitoring

Investigating

Platform Administrator receives institution presence.

Institutions only see their own administrators.

---

# Event Envelope

Every realtime event follows one schema.

Fields

Event ID

Timestamp

Category

Type

Source

Version

Payload

Correlation ID

Entity ID

Actor

No anonymous payloads.

---

# Event Ordering

Clients should process events in chronological order.

Each event contains

Sequence Number

Timestamp

Version

Out-of-order events ignored until missing events arrive.

---

# Event Replay

Purpose

Recover after temporary disconnects.

Workflow

Client Reconnects

↓

Last Event ID Sent

↓

Missing Events Retrieved

↓

Replay

↓

Synchronization Complete

No manual refresh required.

---

# Offline Recovery

When disconnected

Queue optimistic updates

Display offline indicator

Reconnect automatically

Replay events

Resolve conflicts

Never silently discard user actions.

---

# Optimistic Updates

Only low-risk actions may be optimistic.

Examples

Notification Read

Sidebar Expansion

Filter Selection

Dangerous operations require server confirmation.

---

# Investigation Synchronization

Progress updates include

Current Stage

Percentage

Elapsed Time

Estimated Remaining

Current Provider

Terminal Count

Timeline Count

The UI derives state entirely from events.

---

# Background Investigation Support

Guests may

Run investigation in background

Navigate elsewhere

Submit another investigation

Open previous investigations

Realtime reconnects automatically.

Background widget displays

Investigation ID

Progress

Elapsed Time

Current Stage

Cancel

Open

---

# Concurrent Investigations

One browser may monitor multiple investigations.

Each investigation owns

Independent channel

Independent terminal

Independent progress

Widgets collapse into

Background Operations Center

---

# Background Operations Center

Fixed bottom-right panel.

Displays

Running Investigations

Running Raids

Completed Reports

Errors

Queue

Expandable

Searchable

Dismissible

Never blocks navigation.

---

# Multi-Tab Synchronization

One browser

↓

Multiple Tabs

↓

BroadcastChannel API

↓

Shared Local State

Only one tab maintains expensive subscriptions when possible.

Other tabs synchronize locally.

---

# Conflict Resolution

Server state always wins.

When conflict detected

Merge

↓

Notify User

↓

Refresh Local Cache

↓

Continue

---

# Notification System

Notifications appear

Toast

Notification Center

Realtime Feed

Mobile Drawer (future)

Each notification links directly to relevant entity.

---

# Event Compression

High-frequency updates

Progress

Terminal

Queue

may be batched.

Critical alerts

Never batched.

---

# Event Priority

Critical

Immediately Render

High

Render Next Frame

Medium

Normal Queue

Low

Background Queue

---

# Performance Targets

Realtime Latency

<500ms

Reconnect

<2 seconds

Presence Updates

<1 second

Notification Delivery

<500ms

Terminal Stream

Continuous

---

# Scalability

Architecture should support

100

↓

10,000+

Concurrent subscriptions.

Channel subscriptions should remain granular.

Never subscribe globally unless necessary.

---

# Security

Guests

Investigation channels only

Institution Administrators

Institution channels

Own investigations

Own raids

Own reports

Platform Administrator

Every channel

Realtime authorization enforced by RLS.

Never trust client-side filtering.

---

# Monitoring

Track

Active Connections

Dropped Connections

Reconnect Rate

Average Latency

Failed Deliveries

Replay Count

Provider Status

Visible in GOD Console.

---

# Failure Handling

Failures

WebSocket Closed

Authentication Expired

Provider Offline

Network Lost

Replay Failed

Subscription Failed

Client displays

Status

Reason

Retry Timer

Reconnect Button

---

# Future Features

Collaborative investigations

Live annotations

Investigation chat

Shared cursors

Live report editing

Cross-platform notifications

Mobile realtime

Push notifications

Voice alerts

---

# Definition of Done

The Realtime Architecture is complete only when

✓ No manual refresh is required.

✓ Investigation progress streams live.

✓ Raid progress streams live.

✓ Reports appear instantly.

✓ Terminal output is streamed.

✓ Timeline updates automatically.

✓ Notifications arrive immediately.

✓ Offline recovery succeeds.

✓ Event replay restores consistency.

✓ Multi-tab synchronization functions.

✓ Channel permissions enforce security.

This specification is authoritative for all realtime communication within OverWatch.