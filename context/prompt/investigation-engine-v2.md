# OverWatch Investigation Engine v2

## Objective

Refactor the OverWatch investigation pipeline into a professional cyber-forensics workflow.

The investigation should resemble software used by digital investigators rather than a simple AI chatbot.

The user should feel like they are watching a real investigation unfold.

The report generated at the end should be detailed enough that a school administrator could make an informed disciplinary decision without needing to watch the TikTok again.

---

# Primary Objectives

Implement the following.

- Integrate Apify Video Scraper
- Integrate Apify Profile Scraper
- Integrate Apify Comments Scraper
- Build a Metadata Provider abstraction
- Replace placeholder investigation stages
- Upgrade terminal UI
- Upgrade progress system
- Upgrade AI prompt
- Upgrade report generation
- Persist every stage to the database

---

# Investigation Pipeline

Every investigation must follow this exact order.

```
Validate TikTok URL

↓

Create Investigation

↓

Persist Investigation

↓

Run Video Scraper

↓

Run Profile Scraper

↓

Run Comment Scraper

↓

Assemble Investigation Context

↓

Submit Evidence To Gemini

↓

Receive Structured JSON

↓

Generate Investigation Report

↓

Persist Report

↓

Complete Investigation
```

No stage may be skipped.

---

# Metadata Provider

Create

```
src/lib/providers/
```

Create

```
metadata-provider.ts
```

Define

```
interface MetadataProvider
```

Functions

```
getVideoMetadata(url)

getProfile(username)

getComments(videoUrl)
```

---

# Apify Integration

Create

```
src/lib/apify/
```

Files

```
client.ts

video.ts

profile.ts

comments.ts

index.ts
```

Client

Uses

```
APIFY_TOKEN
```

from

```
.env
```

Never instantiate multiple clients.

---

# Investigation Flow

User pastes TikTok URL.

↓

Create Investigation.

↓

Store

```
status

queued

progress

0
```

↓

Run

Video Scraper.

↓

Extract

```
Caption

Author Username

Author Display Name

Author Avatar

Video Description

Upload Timestamp

Likes

Comments

Shares

Bookmarks

Views

Hashtags

Mentions

Music

Video Duration

Video URL

Thumbnail

Download URL
```

Persist immediately.

---

After Video Scraper finishes

Run

Profile Scraper

using

```
Author Username
```

Extract

```
Follower Count

Following Count

Total Likes

Bio

Verified Status

Region

Language

Avatar

Recent Videos
```

Persist immediately.

---

Run Comment Scraper.

Extract

```
Comment Text

Author

Likes

Replies

Pinned Status

Reply Count
```

Store comments.

Limit to configurable amount.

Default

```
100 comments
```

---

# AI Context

Do NOT send only a TikTok URL.

Construct one evidence package.

```
Video Metadata

+

Profile Metadata

+

Comments

+

Transcript

+

OCR Text

+

Speech Transcript
```

Only then invoke Gemini.

---

# Gemini Responsibilities

Gemini acts as

```
Senior Cyberbullying Investigator
```

Gemini must determine

```
Targeted School

Mentioned Schools

Detected Students

Detected Rivalries

Bullying Severity

Harassment

Threats

Incitement

Reputation Damage

Emotional Tone

Confidence

Summary

Recommendation

Evidence
```

Return JSON only.

Never Markdown.

---

# Investigation Statuses

Replace old statuses.

Use

```
Queued

Validating URL

Creating Investigation

Fetching Video Metadata

Video Metadata Complete

Fetching Profile

Profile Complete

Fetching Comments

Comments Complete

Preparing AI Context

Calling Gemini

AI Analysis Complete

Generating Report

Saving Results

Completed

Failed
```

---

# Progress Mapping

```
Queued

0%

Validate URL

5%

Create Investigation

10%

Video Metadata

25%

Profile

40%

Comments

55%

Preparing AI

65%

Gemini

80%

Generating Report

90%

Saving Results

95%

Completed

100%
```

Never jump from 10 to 100.

---

# Terminal UI

Replace current fake loading messages.

Terminal becomes live investigation log.

Black background.

White monospace text.

Sharp borders.

Blinking cursor.

Smooth auto-scroll.

Display

```
Investigation ID

Public ID

Current Stage

Progress

Elapsed Time

Connection Status

Provider Status

AI Status

Current Task
```

---

# Terminal Logs

Every backend event creates a terminal entry.

Example

```
✓ URL validated

↓

✓ Investigation created

↓

Connecting to Apify...

↓

Video Scraper started...

↓

Video metadata received

↓

Author identified

↓

Caption indexed

↓

Hashtags indexed

↓

Upload date parsed

↓

Views indexed

↓

Likes indexed

↓

Comments indexed

↓

Shares indexed

↓

Download URL received

↓

Launching Profile Scraper...

↓

Follower count retrieved

↓

Bio indexed

↓

Region identified

↓

Launching Comment Scraper...

↓

100 comments downloaded

↓

Preparing AI evidence package...

↓

Submitting request to Gemini...

↓

Gemini response received

↓

Extracting schools...

↓

Calculating severity...

↓

Calculating confidence...

↓

Generating intelligence report...

↓

Persisting investigation...

↓

Investigation Complete
```

Never display fake logs.

Every line must correspond to actual backend work.

---

# Investigation Report

Replace current report.

Create

```
OVERWATCH

DIGITAL FORENSIC REPORT
```

Sections

---

## Investigation

```
Investigation ID

Public ID

Date

Time

Processing Time

Status
```

---

## TikTok Video

```
Original URL

Caption

Author Username

Display Name

Upload Time

Duration

Music

Views

Likes

Comments

Shares

Bookmarks

Hashtags

Mentions
```

---

## Creator Profile

```
Username

Followers

Following

Total Likes

Verified

Bio

Region

Language
```

---

## School Analysis

```
Primary School

Secondary School

Mentioned Schools

Detected School Logos

Detected Uniforms

Detected School Names
```

---

## AI Assessment

```
Bullying Detected

Severity

Risk Score

Confidence

Sentiment

Threat Level

Harassment

Incitement

Violence

Defamation

Reputation Damage
```

---

## Timeline

Display every investigation event.

```
Timestamp

Stage

Description
```

---

## Evidence

Display every AI evidence item.

Example

```
Evidence 1

Evidence 2

Evidence 3

Evidence 4
```

---

## AI Summary

Professional executive summary.

---

## Detailed Analysis

Multiple paragraphs explaining

- why the AI reached its conclusion
- what evidence supported it
- why severity was chosen

---

## Recommended Administrative Action

Examples

```
Monitor

Counselling

Parent Notification

Formal Warning

Suspension Review

Escalate To School Management
```

---

## Investigation Metadata

```
Gemini Model

Metadata Provider

Comments Retrieved

Investigation Duration

Processing Version
```

---

# Database

Persist

```
Video Metadata

Profile Metadata

Comments

Transcript

OCR

AI JSON

Formatted Report

Timeline

Terminal Logs

Progress

Status
```

Nothing should exist only in memory.

---

# View Report

The report page must NEVER regenerate AI output.

It displays only persisted investigation data.

---

# Error Handling

Every failure creates

```
Terminal Event

Database Event

User Notification
```

Display

```
Reason

Stage

Timestamp
```

Allow retry.

---

# Performance

After Video Metadata completes

Run

```
Profile Scraper

Comment Scraper
```

concurrently using

```
Promise.all()
```

Only Gemini waits for both.

---

# Final Result

The completed investigation should resemble a professional intelligence report rather than an AI chat response.

Every statistic, piece of metadata, AI finding, investigation event, and evidence item must be visible to the administrator.

The user should feel like they have watched a real cyber-forensics investigation execute from beginning to end.