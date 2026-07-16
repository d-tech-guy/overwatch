# OverWatch Engineering Specification
# 17 - Threat Intelligence Database & Knowledge Graph System
Version: 1.0.0
Status: APPROVED
Priority: HIGH

Dependencies

- 05-database.md
- 06-ai-engine.md
- 07-raid-engine.md
- 12-reporting-engine.md
- 16-analytics-intelligence-engine.md

---

# Purpose

The Threat Intelligence Database is the long-term memory system of OverWatch.

While individual investigations answer isolated questions, the Threat Intelligence Database connects events together.

It allows OverWatch to understand relationships between

Schools

Creators

Videos

Keywords

Hashtags

Incidents

Locations

Behaviour Patterns

The objective is to transform OverWatch from a reporting tool into an intelligence platform.

---

# Philosophy

Every incident contains information.

Every piece of information can become intelligence.

A single bullying post may seem insignificant.

However,

100 similar posts,

from the same creators,

using the same language,

targeting the same institutions,

over several months,

represent a pattern.

Patterns create intelligence.

---

# Core Objectives

The Threat Intelligence Database shall

Store historical observations

Track entities

Detect relationships

Identify recurring patterns

Improve AI analysis

Improve raid discovery

Improve severity scoring

Support predictive intelligence

---

# Architecture

Raw Evidence

↓

Entity Extraction

↓

Normalization

↓

Relationship Mapping

↓

Intelligence Records

↓

Risk Calculation

↓

Analytics

↓

Recommendations

---

# Intelligence Entities

The system tracks the following entities.

---

# Institution Entity

Represents schools or organizations.

Fields

Institution ID

Name

Aliases

Location

Verified Status

Risk Score

Threat Level

Created Date

Last Activity

---

# Creator Entity

Represents TikTok accounts.

Fields

Creator ID

Username

Display Name

Profile URL

Follower Count

Verification Status

Risk Score

First Seen

Last Seen

---

# Video Entity

Represents discovered content.

Fields

Video ID

URL

Creator

Caption

Upload Date

Engagement Metrics

Threat Score

Investigation Status

---

# Keyword Entity

Represents discovered terms.

Fields

Keyword

Category

Frequency

First Seen

Last Seen

Risk Association

---

# Hashtag Entity

Represents discovered hashtags.

Fields

Hashtag

Frequency

Growth Rate

Associated Institutions

Associated Creators

Threat Level

---

# Incident Entity

Represents confirmed or suspected harmful events.

Fields

Incident ID

Investigation ID

Severity

Status

Institutions

Creators

Evidence Count

Created Date

---

# Relationship Model

Entities connect through relationships.

Examples

Creator

↓

Posted

↓

Video


Video

↓

Mentions

↓

Institution


Creator

↓

Associated With

↓

Incident


Hashtag

↓

Used In

↓

Investigation

---

# Relationship Types

POSTED

MENTIONED

TARGETED

ASSOCIATED

CONNECTED

REPEATED

SIMILAR

PART_OF_CAMPAIGN

REPORTED_BY

---

# Knowledge Graph

Future architecture.

Nodes

Entities

Edges

Relationships

Properties

Metadata

Example

Creator A

↓

20 videos

↓

Targeting School B

↓

Using hashtag #schoolwar

↓

Connected to Incident C

---

# Entity Resolution

Purpose

Prevent duplicates.

Examples

Different spellings

@user123

@User_123

User123official

should be analyzed as possible same entity.

---

# Resolution Factors

Username Similarity

Profile Similarity

Content Similarity

Historical Association

AI Confidence

Never automatically merge high-risk entities without confidence.

---

# Intelligence Confidence

Every intelligence record includes confidence.

Range

0-100

Factors

Source Reliability

Evidence Amount

AI Confidence

Historical Consistency

---

# Evidence Sources

Evidence can originate from

Investigation

Raid

AI Analysis

Administrator Report

Manual Review

Provider Data

Each source is recorded.

---

# Intelligence Lifecycle

Discovered

↓

Observed

↓

Verified

↓

Trusted

↓

Archived

---

# Entity Status

Unknown

Observed

Under Review

Confirmed

False Positive

Archived

---

# Creator Intelligence

Tracks

Previous Investigations

Mentioned Institutions

Common Keywords

Posting Frequency

Engagement Pattern

Threat History

Associated Accounts

---

# Creator Risk Score

Calculated from

Severity History

Frequency

Targeting Behaviour

Engagement

Repeated Incidents

Confidence

Range

0-100

---

# Institution Intelligence

Tracks

Threat History

Frequently Targeted By

Frequently Mentioned Creators

Common Keywords

Incident Frequency

Risk Trend

---

# Keyword Intelligence

Tracks

Words commonly associated with

Bullying

Threats

Violence

Harassment

Institution Conflicts

AI discovers new terms over time.

---

# Hashtag Intelligence

Tracks

Emerging hashtags

Conflict hashtags

Campaign hashtags

Event hashtags

Growth rate

Associated entities

---

# Similarity Detection

Purpose

Find related incidents.

Similarity based on

Caption

Comments

Hashtags

Creator

Institution

Timing

AI embeddings (future)

---

# Campaign Detection

Detect coordinated behaviour.

Signals

Multiple accounts

Same wording

Same hashtags

Same target

Similar timing

Output

Possible Coordinated Campaign

Confidence Score

---

# Rivalry Intelligence

Tracks recurring conflicts.

Example

School A

↓

School B

↓

15 incidents

↓

Average Severity 72

Stored as rivalry intelligence.

---

# Behaviour Patterns

Examples

Repeated posting after events

Night-time attacks

Exam-period conflicts

Sports-related conflicts

Graduation conflicts

Patterns contribute to prediction.

---

# Intelligence Updates

New Investigation Completed

↓

Extract Entities

↓

Compare Existing Intelligence

↓

Create Relationships

↓

Update Scores

↓

Broadcast Updates

---

# AI Integration

AI receives intelligence context.

Example

Previous incidents involving this creator:

3

Average severity:

82

Previous target:

School A

AI uses context.

AI does not make final decisions.

---

# Raid Integration

Raid Engine uses intelligence.

Example

Known creator discovered

↓

Increase priority

↓

Auto-investigate

---

# Search Integration

Users can search intelligence.

Examples

School

Creator

Keyword

Hashtag

Incident

---

# Intelligence Dashboard

Displays

Known Threats

Emerging Patterns

High Risk Creators

Trending Keywords

Active Campaigns

Institution Risk

---

# Platform Administrator View

Additional visibility

Global Threat Trends

All Institutions

All Creators

All Campaigns

Intelligence Confidence

False Positives

System Accuracy

---

# False Positive Handling

Incorrect intelligence can be marked.

Process

Review

↓

Mark False Positive

↓

Reduce Confidence

↓

Preserve History

Never delete intelligence silently.

---

# Data Retention

Historical intelligence remains.

Archived entities preserved.

Deletion requires Platform Administrator permission.

---

# Security

Institution Administrators

Only see intelligence related to their institution.

Platform Administrator

Global access.

Sensitive intelligence protected.

---

# Performance

Entity Lookup

<100ms

Relationship Query

<300ms

Risk Update

Background

Graph Expansion

Cached

---

# Future Enhancements

Knowledge Graph Database

Neo4j Integration

Graph Visualization

AI Relationship Discovery

Behaviour Forecasting

Automated Threat Hunting

Cross Platform Intelligence

Image Similarity

Voice Similarity

---

# Definition of Done

The Threat Intelligence Database is complete only when

✓ Historical incidents create reusable intelligence.

✓ Entities are tracked over time.

✓ Relationships are preserved.

✓ Creators gain intelligence profiles.

✓ Institutions gain threat histories.

✓ AI receives historical context.

✓ Raid searches become smarter.

✓ False positives can be corrected.

✓ Intelligence remains auditable.

✓ The platform improves with every investigation.

This specification is authoritative for all long-term intelligence storage, entity tracking, relationship mapping, and knowledge discovery within OverWatch.