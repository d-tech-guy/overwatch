# OverWatch Engineering Specification
# 03 - School Administrator Console
Version: 1.0.0
Status: Approved
Priority: Critical

Dependencies

- 00-product-specification.md
- 01-investigation-engine.md
- 02-authentication.md

---

# Purpose

The School Administrator Console is the operational workspace used by verified educational institutions.

Unlike a traditional dashboard, the Administrator Console functions as a Security Operations Center (SOC), providing administrators with continuous visibility into online threats affecting their institution.

Every page within this console must support informed decision making, rapid navigation, and realtime awareness.

The console should feel like cybersecurity software.

Never a CRUD panel.

---

# Design Philosophy

The Administrator Console represents a live operations center.

Avoid playful UI.

Avoid gradients.

Avoid oversized illustrations.

Avoid rounded interfaces.

The interface should communicate

Precision

Speed

Control

Confidence

Everything should feel intentional.

---

# Visual Language

Color Palette

Black

White

Gray

No accent colors unless representing severity.

Typography

Monospace

Native UI Components

Sharp Corners

Dense Information

High Contrast

Minimal Decorative Elements

Animations should communicate state.

Never exist for decoration.

---

# Administrator Layout

Every administrator page shares the same layout.

Sidebar

↓

Header

↓

Content Area

↓

Notification Layer

↓

Realtime Providers

↓

Background Investigation Provider

The layout must never unmount between route changes.

---

# Sidebar

Persistent.

Desktop Width

280px

Collapsed

72px

Mobile

Hidden Drawer

Sections

Operations Center

Investigations

Threat Intelligence

Raid Center

Reports

School

Settings

Bottom Section

Current Administrator

Institution

Connection Status

Logout

Collapse Button

---

# Header

Persistent.

Contains

Breadcrumb

Global Search

Realtime Status

Notification Center

Current Time

Administrator Menu

Header height

72px

Always visible.

---

# Operations Center

Route

/admin

Purpose

Provide an immediate overview of institutional cyber threats.

No scrolling should be required to understand the current state.

---

# Operations Center Layout

12-column grid.

Top Row

Threat Cards

Middle

Threat Feed

Latest Investigations

Bottom

AI Health

Recent Activity

System Status

Investigation Queue

---

# Threat Cards

Display

Open Investigations

Critical Threats

Completed Today

Average Severity

Videos Analysed Today

Average Processing Time

Each card updates through Supabase Realtime.

Cards should animate only when values change.

---

# Threat Feed

Purpose

Display the most recent threat-related events.

Newest first.

Events

Investigation Started

Metadata Retrieved

Profile Retrieved

Comments Retrieved

AI Analysis Completed

Report Generated

Raid Completed

Investigation Archived

Each event should contain

Timestamp

Severity

Investigation

Short Description

Clicking an event opens the investigation.

---

# Latest Investigations

Purpose

Quick access.

Columns

Public ID

Status

School

Severity

Progress

Created

Actions

No pagination.

Only recent items.

Maximum

10

Button

View All

---

# Investigation Queue

Display all running investigations.

Fields

Progress

Current Stage

Elapsed Time

Current Task

Provider Status

AI Status

Investigations should reorder automatically.

Highest priority first.

---

# Global Search

Purpose

Instantly locate platform entities.

Searches

Public Investigation ID

TikTok Username

School Name

Administrator

Hashtag

Caption

Report ID

Search should debounce.

Results grouped by type.

Keyboard Shortcut

/

---

# Notifications

Persistent notification center.

Types

Success

Warning

Critical

Information

Examples

Investigation Completed

Raid Finished

High Severity Detected

Institution Settings Updated

Notifications should persist in database.

Unread count displayed.

---

# Realtime Indicator

Top right.

Displays

Realtime Connected

↓

Green Dot

Reconnecting

↓

Yellow Dot

Offline

↓

Red Dot

Clicking opens diagnostics.

---

# Keyboard Shortcuts

/

Search

J

Next Investigation

K

Previous Investigation

R

Refresh

N

Notifications

ESC

Close Drawer

CTRL + K

Command Palette

All shortcuts configurable.

---

# Investigations Page

Route

/admin/investigations

Purpose

Display every investigation belonging to the institution.

Layout

Header

↓

Filters

↓

Investigation Table

↓

Pagination

↓

Realtime Updates

---

# Filters

Status

Severity

Date

AI Confidence

Investigation State

Report Generated

Search

Filters should combine.

Never reset unexpectedly.

---

# Investigation Table

Columns

Public ID

TikTok Author

Target School

Severity

Confidence

Status

Created

Completed

Actions

Actions

Open

Export

Archive

Investigations update live.

No refresh required.

---

# Investigation Details

Selecting an investigation opens a slide-over panel.

Never navigate away.

Tabs

Overview

Timeline

Evidence

Comments

Metadata

AI Analysis

Report

Audit Trail

The panel should preserve scroll position.

---

# Timeline

Chronological.

Contains

Terminal Events

Status Changes

Retries

Failures

AI Calls

Metadata Collection

Realtime updates appended live.

---

# Evidence Tab

Display

Video Metadata

Profile Metadata

Collected Comments

Detected Keywords

Detected Schools

Risk Indicators

Evidence must be read-only.

---

# AI Analysis

Sections

Executive Summary

Detailed Findings

Bullying Classification

Confidence

Reasoning

Administrative Recommendation

Expandable.

Supports copying.

Supports PDF export.

---

# Reports

Route

/admin/reports

Purpose

Access completed reports.

Reports are immutable.

List View

↓

Open

↓

Print

↓

Export PDF

↓

Export JSON

Never edit reports.

Generate new report instead.

---

# Threat Intelligence

Purpose

Provide a realtime overview of threats affecting the institution.

Widgets

Trending Keywords

Trending Hashtags

Most Mentioned Students

Most Mentioned Staff

Recent Viral Posts

Threat Distribution

Average Sentiment

Future versions may include historical analytics.

---

# Raid Center

Purpose

Allow administrators to proactively search TikTok.

Launch Raid

Fields

Keywords

Hashtags

Institution Name

Aliases

Time Range

Maximum Videos

Advanced Options

Button

Launch Raid

Launching a raid creates a background task.

Administrators may leave the page.

Realtime updates continue.

---

# Raid Monitor

Shows

Current Stage

Videos Scanned

Videos Collected

Videos Filtered

Investigations Created

AI Queue

Estimated Time Remaining

Terminal Output

Cancel Raid

Only one raid per institution initially.

Future versions may support multiple.

---

# School Page

Route

/admin/school

Displays

Institution Information

Administrator

Verification Status

Created Date

Current Plan

Threat Monitoring Status

Editable

Phone

Website

Contact Information

Read Only

Institution Name

Verification Status

Institution ID

---

# Settings

Categories

Profile

Notifications

Realtime

Privacy

API Status

Danger Zone

Danger Zone

Archive Institution

Sign Out

Delete Account (future)

Every destructive action requires confirmation.

---

# Loading States

Every page must implement

Skeletons

Not spinners.

Skeletons should closely resemble final layouts.

---

# Empty States

Never display blank tables.

Examples

No Investigations

↓

"Your institution has no completed investigations."

No Reports

↓

"Reports will appear here after investigations complete."

No Threats

↓

"No active threats detected."

---

# Error States

Friendly.

Never expose stack traces.

Display

Summary

Retry Button

Support Reference

Technical details belong only inside terminal logs.

---

# Accessibility

Entire console must support

Keyboard Navigation

Screen Readers

High Contrast

Reduced Motion

Visible Focus

Responsive Layout

---

# Performance Requirements

Initial Load

< 2 seconds

Navigation

Instant

Realtime Delay

< 500ms

Search

< 300ms

Large datasets should use pagination or virtualization.

Never render thousands of rows.

---

# Definition of Done

The Administrator Console is complete only when

✓ Layout is persistent.

✓ Navigation never refreshes.

✓ Realtime updates function.

✓ Investigations update automatically.

✓ Reports open without navigation.

✓ Raid monitor streams progress.

✓ Search works globally.

✓ Notifications persist.

✓ Accessibility requirements satisfied.

✓ Entire UI follows OverWatch design language.

This specification is authoritative for every administrator-facing interface.
---

# Threat Intelligence

Route

/admin/threat-intelligence

Purpose

Provide a live intelligence overview of every online threat affecting the institution.

Unlike Reports, Threat Intelligence is dynamic.

Reports represent completed investigations.

Threat Intelligence represents the current operational picture.

Think of this page as the school's Cyber Threat Map.

Everything should update automatically.

No manual refresh.

---

# Threat Intelligence Layout

Top Summary Bar

↓

Threat Heat Map

↓

Intelligence Grid

↓

Live Activity Feed

↓

Trending Threats

↓

Institution Mentions

↓

Emerging Risks

↓

Historical Timeline

---

# Summary Bar

Display

Current Threat Level

Open Investigations

Critical Investigations

Active Raids

Videos Processed Today

Average Severity

Average Confidence

System Health

Every metric updates through realtime subscriptions.

---

# Institutional Threat Level

Institution Threat Level is calculated from

Open Investigations

Severity Scores

Recent Activity

Risk Score

Raid Discoveries

Values

LOW

MODERATE

HIGH

CRITICAL

Each level should have

Color

Icon

Description

Recommended Action

---

# Threat Heat Map

Purpose

Visualize geographic threat distribution.

Data Sources

Detected Locations

Video Metadata

AI Classification

School Location

Display

Interactive Map

Clusters

Threat Density

Severity

Clicking a location filters investigations.

Future Support

Country

State

City

Neighborhood

---

# Threat Distribution

Charts

Severity Distribution

Sentiment Distribution

Investigation Status

Processing Success

Detected Schools

Charts should be interactive.

Selecting a segment filters the page.

---

# Trending Keywords

Purpose

Detect emerging conversations.

Display

Keyword

Frequency

Growth Rate

Last Seen

Related Investigations

Examples

"fight"

"vs"

"destroy"

"pull up"

"camp"

"beef"

"raid"

"expel"

Keywords generated from

Captions

Comments

AI Extraction

---

# Trending Hashtags

Display

Hashtag

Occurrences

Average Severity

Videos

Trend Direction

Hashtags update after every completed investigation.

---

# Mention Monitor

Purpose

Track institutional mentions.

Display

Institution Name

Alias

Nickname

Abbreviation

Detected Mentions

Sentiment

Severity

Clicking opens related investigations.

---

# Emerging Threats

Purpose

Surface investigations requiring immediate attention.

Criteria

High Severity

Rapid Engagement

Increasing Comments

Aggressive Language

Violence Indicators

Threat Escalation

List ordered by

Risk Score

Descending

---

# Community Sentiment

Display

Positive

Neutral

Negative

Hostile

Calculated from

Comments

Caption

AI Classification

Sentiment should include confidence.

---

# Live Activity Feed

Purpose

Provide realtime operational awareness.

Events

Investigation Started

Raid Started

Raid Completed

Metadata Retrieved

Profile Retrieved

AI Finished

Critical Threat Detected

Report Generated

Archived

Every event

Timestamp

Institution

Severity

Investigation ID

Click opens investigation.

---

# Institution Monitoring

Every institution owns

Primary Name

Aliases

Common Misspellings

Abbreviations

Example

University Preparatory Secondary School

UPSS

UP Secondary

University Prep

These values feed

Raid Engine

Mention Detection

Threat Intelligence

Administrators may edit aliases.

---

# Threat Timeline

Chronological visualization.

Scale

24 Hours

7 Days

30 Days

90 Days

Displays

Investigations

Severity

Raid Activity

Detected Mentions

Timeline supports zoom.

---

# Cross Investigation Correlation

Purpose

Detect related incidents.

Relationships

Same Creator

Same Hashtags

Same Audio

Same Commenters

Same Institution

Same Location

Same Keywords

Similarity Score

Displayed as graph.

Nodes

Investigations

Edges

Relationships

Future AI versions may infer hidden relationships.

---

# Risk Engine

Risk Score Range

0

↓

100

Components

Aggressive Language

Target Institution

Violence

Virality

Comment Escalation

Creator History

Public Engagement

Every component visible.

Never hide calculations.

---

# Confidence Engine

Confidence measures AI certainty.

0

↓

100

Factors

Metadata Quality

Comment Availability

Profile Availability

Prompt Completeness

AI Output Quality

Confidence must never be confused with Severity.

---

# Threat Labels

Possible Labels

Cyberbullying

Harassment

Institutional Defamation

Incitement

Violence

Organized Conflict

False Information

Provocation

Threat

Mockery

Multiple labels allowed.

---

# Operational Widgets

Widgets

Most Active Creator

Fastest Growing Threat

Highest Risk Investigation

Latest Completed Report

AI Success Rate

Provider Health

Widgets update every few seconds.

---

# Provider Health

Purpose

Monitor dependencies.

Providers

Gemini

Apify Metadata

Apify Profile

Apify Comments

Supabase

Realtime

Prisma

Each provider

Latency

Status

Retries

Last Failure

Never hide provider failures.

---

# Intelligence Search

Searches across

Investigations

Reports

Schools

Creators

Comments

Keywords

Hashtags

Supports

Fuzzy Search

Exact Search

Boolean Operators (future)

---

# Saved Filters

Administrators may save

Threat Views

Examples

Critical Only

This Week

Raid Results

Institution Mentions

Saved filters appear in sidebar.

---

# Cross Page Synchronization

Updating

Severity

↓

Immediately updates

Operations Center

Investigations

Threat Intelligence

Reports

No duplicated state.

Use centralized realtime store.

---

# Accessibility

Threat Intelligence must support

Keyboard Navigation

Screen Readers

Reduced Motion

High Contrast

Zoom

Large Text

---

# Performance Requirements

Realtime Event Latency

<500ms

Chart Updates

<1s

Search

<300ms

Map Interaction

60 FPS

Lazy load all heavy visualizations.

---

# Definition of Done

Threat Intelligence is complete only when

✓ Institution risk updates automatically.

✓ Trending keywords refresh.

✓ Mention detection works.

✓ Correlation graph functions.

✓ Threat timeline updates.

✓ Provider health visible.

✓ Risk calculations displayed.

✓ Search works globally.

✓ Saved filters persist.

✓ All widgets update through realtime.

---

# Raid Center

Route

/admin/raid-center

Purpose

The Raid Center enables administrators to proactively search TikTok for content related to their institution before it is reported by students or parents.

Unlike Investigations, which begin from a single submitted URL, a Raid begins from a search query and may discover dozens or hundreds of videos.

Every discovered video should pass through the standard Investigation Pipeline before becoming visible to administrators.

Raids are intelligence-gathering operations, not investigations.

---

# Raid Workflow

Administrator Opens Raid Center

↓

Configures Search Parameters

↓

Launches Raid

↓

Raid Job Created

↓

Search Actors Execute

↓

Videos Collected

↓

Deduplication

↓

Relevance Scoring

↓

Investigation Queue

↓

AI Analysis

↓

Threat Intelligence Updated

↓

Raid Report Generated

A raid is complete only when all queued investigations have reached a terminal state (Completed, Failed, or Cancelled).

---

# Raid Configuration

The launch form shall support:

Search Keywords

Institution Name (pre-filled)

Institution Aliases

Hashtags

Creator Username (optional)

Date Range

Language

Country (future)

Maximum Videos

Maximum Comments Per Video

Minimum Engagement Threshold

Include Profile Analysis (toggle)

Include Comment Analysis (toggle)

Priority Level

Every field should have validation and contextual help text.

---

# Raid Dashboard

After launch, administrators are redirected to a live Raid Dashboard.

The dashboard displays:

Raid ID

Status

Elapsed Time

Current Stage

Videos Discovered

Videos Filtered

Investigations Created

Completed Investigations

Critical Threats Found

Estimated Time Remaining

Live Terminal Feed

Provider Health

Pause (future)

Cancel Raid

The Raid Dashboard follows the same terminal philosophy as investigations: every log entry must correspond to a real backend event.