# OverWatch Engineering Specification
# 16 - Analytics & Threat Intelligence Engine
Version: 1.0.0
Status: APPROVED
Priority: CRITICAL

Dependencies

- 01-investigation-engine.md
- 03-admin-console.md
- 04-god-console.md
- 05-database.md
- 06-ai-engine.md
- 07-raid-engine.md
- 08-realtime.md
- 12-reporting-engine.md

---

# Purpose

The Analytics & Threat Intelligence Engine transforms thousands of isolated investigations into actionable intelligence.

An investigation tells administrators

"What happened?"

Analytics answers

"Why is it happening?"

Threat Intelligence answers

"Is this likely to happen again?"

This subsystem is responsible for converting raw operational data into strategic insight.

It continuously learns from investigations, raids, reports, and historical evidence.

---

# Philosophy

Data should not simply be stored.

It should become intelligence.

Every completed investigation contributes to the platform's understanding of

Schools

Creators

Bullying behaviour

Threat patterns

Hashtags

Locations

Time

Language

The platform becomes more valuable as more investigations are completed.

---

# Objectives

The Analytics Engine shall

Aggregate investigations

Calculate trends

Detect patterns

Measure institutional risk

Track historical incidents

Generate intelligence

Power dashboards

Support predictive analysis

Continuously update statistics

---

# Architecture

Investigation

↓

Evidence

↓

Analytics Pipeline

↓

Aggregation

↓

Threat Intelligence

↓

Metrics

↓

Dashboards

↓

Recommendations

---

# Data Sources

Investigations

Reports

Raids

Comments

Captions

Profiles

Institutions

Administrators

Threat Scores

Historical Reports

Notification History

Audit Logs

Future

OCR

Speech Analysis

Image Detection

---

# Processing Pipeline

New Investigation

↓

Normalize Data

↓

Extract Metrics

↓

Update Aggregates

↓

Update Institution Intelligence

↓

Update Creator Intelligence

↓

Update Threat Intelligence

↓

Publish Realtime Updates

---

# Intelligence Layers

Operational Intelligence

↓

Institution Intelligence

↓

Creator Intelligence

↓

Threat Intelligence

↓

Predictive Intelligence

Each layer builds upon the previous.

---

# Dashboard Metrics

Institution Administrators should immediately see

Active Investigations

Completed Investigations

Average Severity

Average Confidence

Current Threat Score

Monthly Trend

Resolved Cases

Open Cases

Threat Distribution

Average Investigation Time

---

# Platform Metrics

Platform Administrator additionally sees

Registered Institutions

Pending Approvals

Daily Investigations

Daily Raids

Provider Health

Realtime Connections

Average AI Latency

Database Health

Worker Utilization

API Consumption

---

# Threat Score

Each institution receives

Threat Score

Range

0

↓

100

Factors

Recent Incidents

Severity

Virality

Repeat Offenders

Coordinated Behaviour

Historical Growth

Threat Score updates after every completed investigation.

---

# Institution Intelligence

Every institution stores intelligence.

Examples

Total Investigations

Average Severity

Most Active Months

Most Common Rivals

Trending Keywords

Most Mentioned Hashtags

Known Creators

Historical Risk

Threat Growth

Average Resolution Time

---

# Creator Intelligence

Every creator accumulates history.

Metrics

Investigation Count

Average Severity

Institution Mentions

Follower Growth

Engagement Growth

Known Associations

Known Aliases

Known Hashtags

Historical Behaviour

Future

Risk Evolution Timeline

---

# Threat Intelligence Database

Purpose

Remember previously observed behaviour.

Tracks

Known Rivalries

Known Hashtags

Known Keywords

Known Accounts

Known Videos

Known Events

Known Locations

Known Patterns

Threat Intelligence is cumulative.

---

# Trend Analysis

The engine identifies

Increasing Activity

Decreasing Activity

Seasonal Activity

Sudden Spikes

Repeated Behaviour

Recurring Events

Results displayed visually.

---

# Time Intelligence

Track activity by

Hour

Day

Week

Month

Academic Term

School Calendar

Exam Period

Holiday Period

Purpose

Identify when incidents are most likely.

---

# Geographic Intelligence

Future

Map incidents by

City

State

Region

Institution

Heatmaps supported.

Location confidence displayed.

---

# Sentiment Analytics

Aggregate

Positive

Neutral

Negative

Hostile

Threatening

Track changes over time.

Separate caption sentiment from comment sentiment.

---

# Keyword Intelligence

Track

Most Common Words

Most Aggressive Terms

Emerging Slang

Repeated Phrases

Institution Nicknames

Search terms update automatically.

---

# Hashtag Intelligence

Track

Trending Hashtags

Institution Hashtags

Bullying Hashtags

Campaign Hashtags

Growth Rate

Popularity

Historical Frequency

---

# Rivalry Detection

The engine should detect

Repeated school pairings.

Example

Institution A

↓

Institution B

↓

17 investigations

↓

Average Severity

74

Display

Known Rivalries

Severity Trend

Last Incident

Frequency

---

# Virality Intelligence

Calculate

Engagement Rate

Estimated Reach

Share Velocity

Comment Growth

Interaction Trend

Virality contributes to threat score.

---

# Severity Distribution

Display

LOW

MODERATE

HIGH

CRITICAL

Charts

Bar

Area

Trend

Institution comparison supported.

---

# Investigation Performance

Metrics

Average Completion Time

Average AI Duration

Average Metadata Duration

Average Report Generation

Failure Rate

Retry Rate

Worker Utilization

---

# AI Analytics

Track

Prompt Version Usage

Model Usage

Average Confidence

Hallucination Rate

Validation Failures

Average Token Usage

Provider Latency

Cost Estimation (future)

---

# Provider Analytics

Display

Apify Health

Gemini Health

Average Latency

Failure Rate

Retry Count

Quota Usage

Historical Availability

Platform Administrators only.

---

# Raid Analytics

Metrics

Raids Created

Videos Collected

Investigations Created

Duplicate Rate

Average Relevance Score

Average Runtime

Discovery Rate

Institution Coverage

---

# Historical Comparisons

Support

Week over Week

Month over Month

Year over Year

Institution vs Institution

Current vs Previous

Growth percentages displayed.

---

# Predictive Intelligence

Future

Estimate

Threat Probability

Likely Target Institution

Likely Time Window

Likely Creator

Likely Severity

Predictions always marked as probabilistic.

---

# Search Analytics

Track

Most Searched Schools

Most Searched Creators

Most Searched Keywords

Popular Filters

Search Success Rate

Improves UX over time.

---

# Export

Analytics exports

CSV

JSON

PDF

Future

Power BI

Looker

Grafana

API

---

# Widgets

Dashboard widgets include

Threat Score

Severity Trend

Open Investigations

Monthly Activity

Trending Hashtags

Known Creators

Provider Health

Realtime Feed

Worker Utilization

Widgets refresh automatically.

---

# Refresh Strategy

Metrics

Realtime where possible.

Heavy analytics

Background aggregation.

No expensive queries on every page load.

---

# Caching

Cache

Institution Metrics

Threat Scores

Charts

Leaderboard

Popular Searches

Invalidate after new investigation completion.

---

# Leaderboards

Institution Dashboard

Top Threat Keywords

Top Hashtags

Top Creators

Highest Severity Weeks

Most Active Months

Platform Dashboard

Highest Risk Institutions

Most Investigated Accounts

Largest Raids

Provider Reliability

---

# Accessibility

Charts include

Tables

ARIA labels

Keyboard support

Color-independent indicators

WCAG AA minimum.

---

# Security

Institution Administrators

Institution analytics only.

Platform Administrator

Global analytics.

Historical exports respect authorization.

---

# Performance Targets

Dashboard Load

<500ms

Chart Render

<200ms

Threat Score Update

<100ms

Aggregation

Background

Search

<150ms

---

# Future Enhancements

Machine Learning

Network Graphs

Relationship Mapping

Behavior Clustering

Automatic Threat Forecasting

Creator Influence Scores

Anomaly Detection

Institution Benchmarking

AI-generated Weekly Intelligence Briefs

Executive Dashboards

---

# Definition of Done

The Analytics & Threat Intelligence Engine is complete only when

✓ Every completed investigation contributes to platform intelligence.

✓ Institutions receive dynamic threat scores.

✓ Creator history accumulates over time.

✓ Trends are automatically calculated.

✓ Dashboards update without manual refresh.

✓ Historical comparisons are supported.

✓ Intelligence powers recommendations.

✓ Analytics remain performant through aggregation.

✓ Authorization protects institutional data.

✓ The platform becomes more intelligent as investigations increase.

This specification is authoritative for all analytics, aggregation, threat intelligence, metrics, dashboards, and historical intelligence within OverWatch.