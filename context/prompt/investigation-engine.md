# OverWatch AI Investigation Engine

## Objective

Implement the complete AI investigation pipeline for OverWatch.

This document is the authoritative specification for how every investigation is processed.

The objective is not to summarize a TikTok.

The objective is to perform a structured cyberbullying investigation suitable for review by school administrators.

Every investigation must follow this pipeline exactly.

---

# Investigation Lifecycle

Every investigation moves through deterministic processing states.

```
Queued

↓

Fetching Metadata

↓

Metadata Retrieved

↓

Preparing AI Context

↓

Submitting To Gemini

↓

AI Analysis

↓

Generating Report

↓

Saving Results

↓

Completed
```

Failure at any stage must terminate the investigation gracefully.

Never silently fail.

---

# Progress Mapping

The frontend terminal reflects real backend progress.

Progress values are authoritative.

```
Queued

0%

Fetching Metadata

10%

Metadata Retrieved

25%

Preparing AI Context

40%

Submitting To Gemini

55%

AI Processing

70%

Generating Report

85%

Saving Investigation

95%

Completed

100%
```

Never jump directly from 10% to 100%.

Progress should feel believable.

---

# Terminal UI

The investigation modal must resemble an active digital forensic terminal.

Do not display fake loading messages.

Every log line must correspond to actual backend work.

Example timeline

```
[00:00:01]

✓ Investigation Created

↓

[00:00:02]

Connecting to metadata provider...

↓

[00:00:03]

TikTok metadata received.

↓

[00:00:03]

Caption extracted.

↓

[00:00:03]

Author identified.

↓

[00:00:04]

Upload timestamp parsed.

↓

[00:00:04]

Hashtags indexed.

↓

[00:00:05]

Comment statistics indexed.

↓

[00:00:06]

Preparing AI investigation context...

↓

[00:00:07]

Submitting evidence to Gemini...

↓

[00:00:10]

Awaiting AI response...

↓

[00:00:15]

AI response received.

↓

[00:00:16]

Evaluating severity...

↓

[00:00:17]

Detecting targeted institution...

↓

[00:00:18]

Generating investigation report...

↓

[00:00:19]

Saving findings...

↓

[00:00:20]

Investigation Complete.
```

Never invent timestamps.

Never display messages for work that never occurred.

---

# Metadata Collection

Collect every available field before contacting Gemini.

Required

```
Video URL

Caption

Author Username

Upload Timestamp

Hashtags

Mentioned Users

Comment Count

Like Count

Share Count

Video Description

Available Comments

Available OCR Text

Available Speech Transcript
```

If any field is unavailable

Store null.

Do not fabricate information.

---

# AI Context Construction

Gemini should never receive only a TikTok URL.

Construct a structured context object.

Example

```
Video Metadata

↓

Caption

↓

Hashtags

↓

Transcript

↓

OCR Text

↓

Comments

↓

Upload Metadata

↓

System Instructions
```

Only after the full context has been prepared should Gemini be invoked.

---

# Gemini System Prompt

The model acts as an AI cyberbullying investigator.

Not a chatbot.

Not a teacher.

Not a social media assistant.

Gemini is responsible for producing a formal investigation.

Primary objectives

- Detect targeted harassment.

- Detect school rivalry.

- Detect cyberbullying.

- Detect insults.

- Detect threatening language.

- Detect incitement.

- Detect hate speech.

- Detect violence.

- Detect misinformation.

---

# Investigation Questions

Gemini must answer every question.

```
Is another school targeted?

If yes

Which school?

What evidence supports this?

What words triggered the conclusion?

How severe is the content?

How confident are you?

What emotional tone is present?

Does the content encourage retaliation?

Should administrators review this?

Could the content damage school reputation?

Does the content violate school policy?

Recommended disciplinary action?

Summary?

Detailed explanation?
```

Every question requires an answer.

---

# Output Format

Gemini must return JSON only.

Never Markdown.

Never paragraphs.

Schema

```json
{
  "severity":"critical",

  "severityScore":91,

  "confidence":96,

  "targetSchool":"University Preparatory Secondary School",

  "location":"Benin City",

  "sentiment":"hostile",

  "containsBullying":true,

  "containsThreat":false,

  "containsHarassment":true,

  "containsIncitement":false,

  "summary":"",

  "explanation":"",

  "recommendation":"",

  "evidence":[
      "...",
      "...",
      "..."
  ]
}
```

The response must be parseable.

Reject malformed JSON.

---

# Database Persistence

Store

Raw JSON

↓

Structured fields

↓

Timeline events

↓

Progress updates

↓

Completion timestamp

The report should never require another AI request.

---

# Report Generation

Generate a formal intelligence report.

Structure

```
OVERWATCH

INVESTIGATION REPORT

────────────────────

Status

Target School

Risk Level

Severity

Confidence

Detected Location

Summary

Evidence

Analysis

Recommendation

Investigation Timeline

Completed At
```

The report is generated immediately after Gemini responds.

Store it permanently.

---

# Error Handling

Metadata Failure

↓

status

failed_metadata

↓

Display reason.

AI Failure

↓

status

failed_ai

↓

Persist logs.

↓

Allow retry.

Never leave investigations stuck.

---

# Logging

Every processing stage must create an InvestigationEvent.

Examples

```
Investigation Created

Metadata Fetch Started

Metadata Retrieved

Gemini Request Started

Gemini Response Received

Severity Calculated

Report Generated

Database Saved

Completed
```

This powers

- terminal logs

- audit history

- debugging

- administrator timeline

---

# Terminal Design

Black background.

White monospace text.

Sharp borders.

No rounded corners.

Blinking cursor.

Smooth auto-scroll.

Terminal should display

```
Current Stage

Current Progress

Elapsed Time

Investigation ID

Live Logs
```

Every update originates from backend events.

Never simulate fake activity.

---

# Completion

When progress reaches 100%

Display

```
✓ Investigation Complete
```

Enable

```
View Report
```

The report button opens the saved investigation.

Never regenerate it.

---

# Definition of Done

The feature is complete only when

✓ Every investigation invokes Gemini.

✓ Metadata is collected before AI analysis.

✓ The terminal reflects real backend work.

✓ Progress updates accurately.

✓ Every stage is persisted.

✓ Every stage produces logs.

✓ Gemini returns structured JSON.

✓ Reports are permanently stored.

✓ View Report displays the saved investigation.

✓ No placeholder data exists anywhere in the pipeline.

The investigation engine must resemble a professional digital forensics platform rather than a generic AI chatbot.