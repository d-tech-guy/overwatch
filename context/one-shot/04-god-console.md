# OverWatch Engineering Specification
# 04 - GOD Console (Platform Administration)
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 00-product-specification.md
- 01-investigation-engine.md
- 02-authentication.md
- 03-admin-console.md

---

# Purpose

The GOD Console is the highest privilege interface within the entire OverWatch ecosystem.

It is not an extension of the Administrator Console.

It is an entirely different application that exists inside the same codebase.

The GOD Console provides complete visibility over every subsystem, every investigation, every institution, every administrator, every AI request, every provider and every platform event.

Every privileged operation originates here.

This console is intended exclusively for the platform owner.

No institution should ever have access to this interface.

---

# Access Control

Only ONE account may access this console.

Primary Email

osemudiamhen.obhahie@upsshub.com

Access Phrase

grant access

The access phrase is NOT authentication.

It is an additional verification step after successful login.

Workflow

Login

↓

Verify Platform Role

↓

Prompt Access Phrase

↓

Validate

↓

Create GOD Session

↓

Open Console

Failure immediately destroys the authentication session.

---

# Security Philosophy

Every page inside the GOD Console should assume complete platform authority.

Nothing is hidden.

Nothing is abstracted.

Everything should be observable.

Every click should reveal deeper system information.

The console should feel similar to

AWS Console

Azure Portal

Cloudflare Dashboard

CrowdStrike Falcon

Microsoft Defender XDR

Notion is NOT a design reference.

---

# Layout

Persistent Sidebar

↓

Persistent Command Header

↓

Workspace

↓

Floating System Alerts

↓

Realtime Event Stream

↓

Global Providers

The layout never unmounts.

---

# Sidebar

Sections

Mission Control

Applications

Institutions

Administrators

Investigations

Reports

Raid Operations

Threat Intelligence

Artificial Intelligence

Providers

System Health

Audit Logs

Platform Settings

Danger Zone

Bottom

Current User

Current Environment

Build Version

Realtime Status

Logout

Collapse Button

---

# Mission Control

Route

/god

Purpose

Provide immediate awareness of the entire platform.

Within five seconds of opening this page the platform owner should understand

Platform Health

Threat Level

Current Load

System Errors

Pending Approvals

Running Investigations

Provider Status

AI Health

Nothing on this page should require clicking to become useful.

---

# Mission Control Layout

Top Metrics

↓

Platform Health Strip

↓

Operations Grid

↓

Live Activity Feed

↓

Critical Alerts

↓

Provider Monitoring

↓

Platform Terminal

↓

Realtime Investigation Queue

---

# Platform Metrics

Display

Registered Institutions

Pending Applications

Approved Institutions

Administrators

Running Investigations

Completed Today

Critical Threats

Reports Generated

Average Investigation Time

Gemini Requests

Apify Requests

Average AI Latency

Realtime Connections

Active Sessions

Online Administrators

Database Connections

Every card updates through realtime.

---

# Platform Health Strip

Displays

Database

Realtime

Gemini

Apify Metadata

Apify Comments

Apify Profiles

Prisma

Background Queue

Server Actions

Next.js

Each provider displays

Health

Latency

Error Rate

Retry Count

Current Status

Status Values

Operational

Degraded

Maintenance

Offline

---

# Live Operations Feed

Purpose

Provide a live stream of every meaningful platform event.

Examples

Institution submitted application

Institution approved

Institution rejected

Investigation created

Metadata retrieved

AI completed

Raid started

Raid completed

Provider timeout

Database error

Realtime disconnected

Authentication failure

Critical bullying detected

Every event contains

Timestamp

Severity

Source

Institution

Investigation

Description

Expand Button

Events are immutable.

---

# Critical Alerts

Critical alerts appear above all content.

Examples

Gemini unavailable

Database unreachable

Apify quota exceeded

Realtime disconnected

Migration failed

Authentication attacks

High severity investigation

Critical alerts remain pinned until acknowledged.

---

# Investigation Queue

Displays every running investigation.

Columns

Public ID

Institution

Current Stage

Current Provider

Progress

Elapsed Time

Priority

Assigned AI

Actions

Open

Cancel

Retry

Investigate

Everything updates live.

---

# Platform Terminal

Purpose

Provide raw operational insight.

This terminal displays backend events exactly as they occur.

The terminal is not simulated.

Every line originates from actual backend processing.

Columns

Timestamp

Severity

Component

Operation

Duration

Investigation

Institution

Details

Search

Copy

Filter

Download

Pause

Auto Scroll

Terminal Categories

SYSTEM

DATABASE

PRISMA

SUPABASE

REALTIME

API

AI

APIFY

AUTH

QUEUE

REPORT

RAID

SERVER

CLIENT

Never truncate messages.

Allow expanding each event.

---

# Global Search

Searches the entire platform.

Entities

Institution

Administrator

Investigation

Report

Application

Raid

Comment

Creator

School

Terminal Event

Provider Error

Search must return grouped results.

Keyboard Shortcut

CTRL + K

Search latency should remain below

300ms

---

# Institution Management

Route

/god/institutions

Purpose

Manage every institution registered on OverWatch.

Table Columns

Institution

Status

Administrators

Investigations

Reports

Threat Level

Created

Last Activity

Actions

Actions

Open

Suspend

Archive

Disable

Delete (Future)

Open displays

Institution Profile

---

# Institution Profile

Tabs

Overview

Administrators

Investigations

Reports

Threat Intelligence

Raids

Audit Trail

Settings

Overview contains

Verification Status

Institution Information

Aliases

Contact Details

Threat Summary

Activity Graph

Investigation Statistics

Everything should be accessible from one location.

---

# Application Review

Route

/god/applications

Purpose

Review pending institution requests.

Cards display

Institution

Administrator

Submitted

Location

Website

Reason

Status

Buttons

Approve

Reject

Request More Information

Approval creates

Institution

Administrator

Authentication Account

Audit Entry

Notification

Everything occurs inside one transaction.

---

# Administrator Management

Displays every administrator.

Columns

Name

Institution

Email

Status

Last Login

Created

Role

Actions

Suspend

Reset Password

Disable

Transfer

View Activity

No administrator may escalate privileges.

Only the Platform Administrator can assign platform roles.

---

# Investigation Management

Purpose

Access every investigation in existence.

Filters

Institution

Severity

Date

Status

AI Confidence

Provider

Report

Actions

Open

Replay

Retry

Archive

Export

Delete (Future)

Every investigation is viewable regardless of institution ownership.

---

# Replay Investigation

Replay does NOT rerun AI.

Replay reconstructs

Timeline

Terminal

Evidence

Report

Exactly as originally executed.

Used for debugging.
---

# Artificial Intelligence Control Center

Route

/god/artificial-intelligence

Purpose

Provide complete visibility into every AI interaction occurring across the OverWatch platform.

This page exists for operational monitoring, debugging, optimization and quality assurance.

The AI Control Center is not intended for prompt engineering by institutions.

Only the Platform Administrator has access.

---

# Objectives

The AI Control Center must answer the following questions immediately.

• Is Gemini healthy?

• Is AI currently processing requests?

• How many requests have failed?

• What is the average response time?

• Which investigations required retries?

• Which prompts generated poor responses?

• Which reports have the lowest confidence?

• Is AI becoming slower over time?

---

# Layout

AI Overview

↓

Model Health

↓

Live Request Queue

↓

Prompt Performance

↓

Response Quality

↓

Cost Monitoring

↓

Failure Analysis

↓

Prompt Library

↓

Terminal Feed

---

# AI Overview

Display

Current Provider

Model Name

Provider Version

Average Latency

Current Queue

Successful Requests

Failed Requests

Retry Count

Average Confidence

Average Severity

Average Processing Time

Current Status

Every value updates through realtime.

---

# Current Model

Display

Provider

Gemini

Model

gemini-2.5-pro

Context Window

Current Prompt Version

Temperature

Top P

Max Output Tokens

Reasoning Mode

Streaming Enabled

Structured Output Enabled

This information should be read-only.

---

# AI Health

Possible States

Operational

↓

Healthy

Degraded

↓

Slow responses

Busy

↓

High queue

Offline

↓

Unavailable

Maintenance

↓

Disabled manually

Each state includes

Status

Latency

Success Rate

Retry Rate

Last Failure

Last Recovery

---

# Live Request Queue

Purpose

Display every investigation currently communicating with AI.

Columns

Investigation ID

Institution

Prompt Version

Stage

Queue Position

Elapsed Time

Estimated Completion

Retry Count

Current Status

Actions

Inspect

Cancel

Replay

---

# Prompt Library

Purpose

Version every production prompt.

Every prompt has

Prompt Version

Created At

Created By

Description

Current Status

Deployment Status

Checksum

Token Count

Only one prompt version may be active.

Older prompts remain archived.

Never delete prompts.

---

# Prompt Viewer

Display

System Prompt

Developer Prompt

Evidence Schema

JSON Schema

Expected Output

Validation Rules

Prompt Hash

Deployment History

Copy Button

Diff Viewer

Administrators may compare prompt versions.

---

# Prompt Performance

Metrics

Average Confidence

Average Tokens

Average Latency

Average Cost

Average Severity Accuracy

JSON Success Rate

Retry Rate

Failure Rate

Prompt Injection Detection

Charts

24 Hours

7 Days

30 Days

---

# AI Response Inspector

Purpose

Inspect raw AI responses.

Display

Prompt

Response

Parsed JSON

Confidence

Risk Score

Processing Time

Token Usage

Validation Results

Hallucination Checks

Every response links back to its investigation.

---

# Confidence Monitoring

Display

Average Confidence

Lowest Confidence

Highest Confidence

Confidence Distribution

Trend Graph

Low confidence investigations automatically appear inside Review Queue.

---

# Hallucination Detection

Every response passes validation.

Checks

Required Fields

Valid JSON

Known Schools

Known Locations

Reasoning Present

Evidence Referenced

Confidence Present

Severity Present

Failures create

Validation Events

Warnings

Platform Alerts

---

# Failure Analysis

Display

Validation Failures

Timeouts

Provider Failures

JSON Parsing Errors

Rate Limits

Network Failures

Unknown Errors

Each category expands into detailed logs.

---

# Token Usage

Metrics

Input Tokens

Output Tokens

Average Tokens

Largest Prompt

Largest Response

Daily Usage

Monthly Usage

Estimated Cost

Future providers should integrate automatically.

---

# Cost Dashboard

Display

Today's Cost

Weekly Cost

Monthly Cost

Average Cost Per Investigation

Most Expensive Investigation

Estimated Monthly Projection

Color-code spending trends.

---

# Replay AI

Purpose

Replay an AI request without affecting production data.

Replay performs

Load Evidence

↓

Load Prompt Version

↓

Send To AI

↓

Compare Responses

↓

Display Diff

Replay never overwrites reports.

---

# Response Comparison

Compare

Original Response

Replay Response

Display

Confidence Difference

Severity Difference

Recommendation Difference

Token Difference

Latency Difference

Visual diff highlights changed sections.

---

# AI Terminal

Dedicated AI terminal.

Every event includes

Timestamp

Provider

Model

Latency

Prompt Version

Investigation

Operation

Duration

Status

Error

Supports

Filtering

Download

Copy

Search

Auto Scroll

---

# Provider Monitoring

Route

/god/providers

Purpose

Monitor every external dependency.

No provider should fail silently.

---

# Supported Providers

Supabase

Prisma

Gemini

Apify Metadata

Apify Comments

Apify Profiles

Next.js

Vercel

Future providers

OpenAI

Claude

Azure AI

Vertex AI

Cloudflare

Architecture should remain provider-independent.

---

# Provider Cards

Each provider displays

Status

Latency

Average Response

Success Rate

Failure Rate

Current Requests

Retries

Last Error

Last Successful Request

Health Score

---

# Detailed Provider View

Tabs

Overview

Requests

Errors

Latency

Configuration

Audit Trail

Overview displays

Provider Version

API Endpoint

Authentication Status

Daily Requests

Quota Usage

Connection Health

---

# Provider Logs

Every provider request is logged.

Fields

Timestamp

Endpoint

Method

Latency

Response Code

Retries

Result

Investigation

Correlation ID

Never expose secrets.

---

# Quota Monitoring

Display

Daily Quota

Used

Remaining

Estimated Exhaustion

Warnings

Quota warnings appear before exhaustion.

---

# Background Queue Inspector

Purpose

Monitor asynchronous operations.

Queue Types

Investigation Queue

Raid Queue

Notification Queue

Retry Queue

Report Queue

Each queue displays

Pending

Running

Completed

Failed

Average Wait Time

Longest Running

---

# Queue Inspector

Selecting a queue displays

Job ID

Investigation

Institution

Status

Started

Updated

Retries

Worker

Logs

Administrators may retry failed jobs manually.

---

# Performance Monitoring

Metrics

Average Request Time

Average Investigation Time

Average AI Time

Average Metadata Time

Database Latency

Realtime Latency

Memory Usage

CPU Usage (future)

Charts support

Hour

Day

Week

Month

---

# Platform Analytics

Purpose

Provide strategic insight into platform growth.

Metrics

Institutions

Administrators

Investigations

Reports

Raids

Threats

AI Requests

Provider Requests

Processing Success

Growth Rate

All charts exportable.

---

# Audit Logs

Every privileged action creates an immutable audit log.

Fields

Timestamp

Administrator

Action

Target

Previous Value

New Value

IP Address

User Agent

Correlation ID

Audit logs are append-only.

Never editable.

Never deletable.

---

# Feature Flags

Purpose

Safely release platform functionality.

Flags

Enable Raids

Enable AI

Enable Reports

Enable Realtime

Enable Provider Monitoring

Enable Beta Features

Flags update immediately.

No redeploy required.

---

# Platform Configuration

Editable

Support Email

Platform Name

Maintenance Banner

Default Investigation Timeout

Maximum Concurrent Investigations

Maximum Concurrent Raids

Maximum AI Retries

Maximum Metadata Retries

Changes recorded in Audit Log.

---

# Emergency Controls

Purpose

Rapidly protect the platform.

Controls

Disable AI

Disable Raids

Disable New Investigations

Disable Registration

Disable Authentication

Enable Maintenance Mode

Restart Background Workers (future)

Each action requires

Confirmation

↓

Access Phrase

↓

Audit Entry

↓

Execution

---

# Danger Zone

Contains irreversible operations.

Archive Institution

Disable Institution

Force Logout All Sessions

Clear Queue

Purge Cache

Delete Test Data

Future

Database Restore

Every operation requires

Access Phrase

Confirmation Dialog

Audit Entry

Never allow accidental execution.

---

# Definition of Done

The GOD Console is complete only when

✓ Every institution can be monitored.

✓ Every administrator is manageable.

✓ Every investigation is searchable.

✓ AI health is visible.

✓ Provider health is visible.

✓ Queue inspection functions.

✓ Audit logs are immutable.

✓ Feature flags work.

✓ Emergency controls function safely.

✓ Every privileged action is audited.

✓ Platform analytics update in realtime.

✓ The interface reflects an enterprise-grade Security Operations Center.

This document is the authoritative specification governing all Platform Administration functionality.