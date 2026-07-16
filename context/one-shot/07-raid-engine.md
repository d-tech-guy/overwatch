# OverWatch Engineering Specification
# 07 - Raid Engine & Threat Discovery System
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 01-investigation-engine.md
- 03-admin-console.md
- 05-database.md
- 06-ai-engine.md

---

# Purpose

The Raid Engine is the proactive intelligence subsystem of OverWatch.

Unlike a standard investigation, which begins with a user submitting a single TikTok URL, a Raid begins with a search objective.

Its mission is to discover potentially harmful content before it is reported.

The Raid Engine continuously searches TikTok using configurable intelligence parameters, collects relevant posts, filters them, scores their relevance, and automatically creates investigations for qualifying results.

A raid is an intelligence-gathering operation.

An investigation is an evidence analysis operation.

These are distinct concepts.

---

# Design Philosophy

The Raid Engine should behave like an automated cyber threat hunting platform.

It continuously searches.

Collects evidence.

Prioritizes findings.

Launches investigations.

Produces intelligence.

Administrators define objectives.

The platform performs discovery.

---

# Primary Objectives

The Raid Engine shall

Search TikTok

Collect videos

Collect profile information

Collect comments

Deduplicate discoveries

Measure relevance

Prioritize findings

Launch investigations

Generate raid reports

Update Threat Intelligence

---

# High-Level Architecture

Administrator

↓

Raid Configuration

↓

Raid Scheduler

↓

Search Pipeline

↓

Apify Actors

↓

Data Normalization

↓

Deduplication

↓

Relevance Scoring

↓

Investigation Queue

↓

AI Engine

↓

Threat Intelligence

↓

Raid Report

Every stage is persisted.

---

# Raid Lifecycle

Created

↓

Queued

↓

Searching

↓

Collecting Metadata

↓

Collecting Profiles

↓

Collecting Comments

↓

Normalizing

↓

Deduplicating

↓

Scoring

↓

Creating Investigations

↓

Monitoring AI Progress

↓

Generating Raid Report

↓

Completed

Possible terminal states

Completed

Cancelled

Failed

Timed Out

---

# Raid Types

Institution Raid

Keyword Raid

Hashtag Raid

Creator Raid

Emergency Raid

Scheduled Raid

Manual Raid

Future

Regional Raid

National Raid

Cross-Institution Raid

---

# Institution Raid

Purpose

Continuously search for content mentioning a specific school.

Search Inputs

Institution Name

Aliases

Abbreviations

Common Misspellings

Example

University Preparatory Secondary School

UPSS

UP Secondary

University Prep

Every alias contributes to search discovery.

---

# Keyword Raid

Searches arbitrary phrases.

Examples

fight

beef

school war

destroy

camp

raid

expel

Students are encouraged to avoid generic keywords without institution references.

---

# Hashtag Raid

Searches TikTok hashtags.

Examples

#upss

#schoolbeef

#interhouse

#fightnight

Supports multiple hashtags.

---

# Creator Raid

Targets a specific TikTok creator.

Search begins from

Username

Creator ID

Future

Verified Creator Database

---

# Emergency Raid

Highest priority.

Ignores scheduling limits.

Immediately allocates available workers.

Used only during active incidents.

---

# Scheduled Raid

Automatically launches.

Examples

Every Day

Every Week

Every Month

Before Inter-House Sports

Exam Period

Graduation Week

Future scheduler must support cron expressions.

---

# Search Pipeline

Raid Created

↓

Configuration Loaded

↓

Search Requests Generated

↓

Apify Invoked

↓

Results Returned

↓

Normalization

↓

Deduplication

↓

Investigation Creation

↓

AI Processing

↓

Raid Dashboard Updated

---

# Search Providers

Current

Apify

Future

Official TikTok API

Commercial Intelligence Providers

Custom Crawlers

Architecture must remain provider-independent.

---

# Apify Actors

Video Metadata Actor

Profile Actor

Comment Actor

Every actor executes independently.

Failures should never terminate the entire raid.

---

# Metadata Collection

Collected Fields

Video URL

Caption

Creator Username

Display Name

Video ID

Views

Likes

Comments

Shares

Bookmarks

Hashtags

Upload Time

Duration

Music

Language

Every field normalized.

---

# Profile Collection

Collected Fields

Username

Display Name

Followers

Following

Likes

Biography

Verified

Avatar

Private Account

Total Videos

Profile URL

---

# Comment Collection

Collected Fields

Comment

Author

Timestamp

Likes

Replies

Language

Supports pagination.

Future versions may sample large comment sets.

---

# Data Normalization

Every provider response becomes one standardized schema.

No downstream system should know

Apify

TikTok

Future providers

Normalization removes provider-specific fields.

---

# Deduplication

Duplicate detection occurs before investigation creation.

Duplicate Criteria

Video ID

Video URL

Checksum

Existing Investigation

Near Duplicate

Similarity Score

Duplicates never generate new investigations.

Instead

Existing investigation updated.

Raid references existing investigation.

---

# Relevance Engine

Purpose

Determine whether discovered content deserves investigation.

Factors

Institution Mention

Aliases

Caption

Comments

Hashtags

Creator History

Engagement

Language

Violence Indicators

Output

0

↓

100

Only videos above configurable threshold proceed.

---

# Priority Engine

Priority Levels

LOW

NORMAL

HIGH

CRITICAL

Priority calculated from

Severity Estimate

Virality

Institution Match

Emergency Keywords

Historical Incidents

Priority controls queue ordering.

---

# Investigation Creation

Every qualifying video creates

Investigation

Timeline Entry

Terminal Events

Provider Logs

Notification

Creation occurs inside one database transaction.

---

# Background Processing

Raids execute asynchronously.

Administrators may safely

Navigate away

Close browser

Log out

Progress persists.

Realtime reconnects automatically.

---

# Raid Dashboard

Displays

Raid ID

Current Stage

Progress

Elapsed Time

Videos Found

Videos Processed

Videos Filtered

Investigations Created

Completed Investigations

Critical Findings

Estimated Remaining Time

Workers Active

Provider Status

Every widget updates live.

---

# Live Terminal

Every backend event appears.

Examples

Searching hashtag

Searching institution alias

Metadata collected

Comments downloaded

Duplicate skipped

Investigation queued

AI completed

Report generated

Provider timeout

Retrying request

No simulated messages.

Every line originates from backend events.

---

# Worker Architecture

Raid Manager

↓

Worker Queue

↓

Metadata Worker

↓

Profile Worker

↓

Comment Worker

↓

Normalization Worker

↓

Investigation Worker

↓

AI Queue

Workers remain independent.

One failure should not halt others.

---

# Failure Handling

Possible Failures

Provider Timeout

Network Error

Rate Limited

Actor Failure

Invalid Response

Database Failure

Retry Policy

Exponential Backoff

Maximum Retries

3

Every retry logged.

---

# Rate Limiting

Institution Limits

Concurrent Raids

Maximum Videos

Maximum Comments

Requests Per Minute

Platform Limits configurable.

---

# Raid Report

Generated automatically.

Contains

Executive Summary

Objectives

Search Parameters

Videos Collected

Videos Ignored

Duplicates

Investigations Created

Critical Threats

Trending Hashtags

Trending Keywords

Creator Statistics

Recommendations

Raid Duration

Provider Statistics

Raid reports remain immutable.

---

# Threat Intelligence Integration

Every completed raid updates

Threat Heat Map

Trending Keywords

Trending Hashtags

Institution Risk

Creator Risk

Historical Trends

No manual refresh required.

---

# Historical Intelligence

Every raid contributes to long-term analytics.

Metrics

Average Discoveries

Average Severity

Institution Growth

Threat Growth

Monthly Activity

Seasonal Trends

Used for future predictive models.

---

# Security

Administrators may only access raids belonging to their institution.

Platform Administrators may access every raid.

Every raid action creates an audit log.

Search parameters containing sensitive information must be encrypted at rest where appropriate.

---

# Performance Targets

Raid Creation

<200ms

Search Initialization

<1s

Metadata Processing

Streaming

Realtime Delay

<500ms

Dashboard Updates

Instant

Large raids should stream progressively rather than waiting for completion.

---

# Future Enhancements

Cross-platform raids

Instagram

Facebook

X

YouTube

Telegram

Discord

AI-assisted search expansion

Automatic alias generation

Image similarity search

School logo detection

Uniform recognition

Coordinated campaign detection

Predictive threat forecasting

---

# Definition of Done

The Raid Engine is complete only when

✓ Administrators can launch raids.

✓ Multiple search strategies are supported.

✓ Provider responses are normalized.

✓ Duplicate investigations are prevented.

✓ Relevance scoring determines investigation creation.

✓ Priority controls queue order.

✓ Raids continue in the background.

✓ Live dashboards stream progress.

✓ Every backend action appears in the terminal.

✓ Raid reports are generated automatically.

✓ Threat Intelligence updates after every completed raid.

This specification is authoritative for all proactive threat discovery operations within OverWatch.