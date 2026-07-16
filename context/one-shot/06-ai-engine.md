# OverWatch Engineering Specification
# 06 - Artificial Intelligence Engine
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- 00-product-specification.md
- 01-investigation-engine.md
- 05-database.md

---

# Purpose

The Artificial Intelligence Engine is the analytical core of OverWatch.

Its responsibility is not simply to summarize TikTok posts.

Its purpose is to transform raw internet content into structured intelligence that school administrators can immediately understand and act upon.

Every investigation ultimately succeeds or fails based on the quality of this engine.

The AI Engine must therefore prioritize consistency, explainability, determinism, and evidence-based reasoning over creativity.

The engine must never fabricate information.

---

# Design Philosophy

The AI is an intelligence analyst.

Not a chatbot.

Not an assistant.

Not a conversational agent.

Every response must be

Evidence Driven

↓

Structured

↓

Deterministic

↓

Explainable

↓

Machine Readable

The generated report should resemble a professional cyber threat assessment.

---

# Primary Responsibilities

The AI Engine shall

Interpret TikTok metadata

Analyze captions

Analyze comments

Infer targeted institutions

Measure bullying severity

Estimate escalation risk

Generate administrative recommendations

Produce structured reports

Calculate confidence

Generate investigation summaries

Produce realtime progress events

---

# AI Processing Pipeline

Investigation Created

↓

Metadata Retrieved

↓

Profile Retrieved

↓

Comments Retrieved

↓

Evidence Normalized

↓

Prompt Constructed

↓

Gemini Invoked

↓

Response Validated

↓

Confidence Calculated

↓

Report Generated

↓

Database Updated

↓

Realtime Broadcast

Every stage is persisted.

---

# AI Provider Architecture

The system must be provider-independent.

Current Provider

Gemini

Future Providers

OpenAI

Claude

Azure OpenAI

Vertex AI

Mistral

DeepSeek

Provider selection occurs through an abstraction layer.

Business logic must never directly depend on Gemini SDKs.

---

# AI Service Architecture

Investigation Service

↓

Evidence Builder

↓

Prompt Builder

↓

AI Provider Interface

↓

Gemini Adapter

↓

Validator

↓

Report Builder

↓

Repository

Every module has one responsibility.

---

# Evidence Builder

Purpose

Convert raw provider responses into a normalized evidence package.

Sources

TikTok Metadata

Profile Information

Comments

Institution Database

Previous Investigations

Manual Notes

Future Sources

OCR

Speech-to-Text

Frame Analysis

Evidence Builder must remove provider-specific formatting.

---

# Evidence Package

Every investigation produces one evidence package.

Sections

Video Metadata

Creator Profile

Caption

Comments

Detected Mentions

Detected Schools

Engagement Metrics

Context

Historical Matches

Evidence package becomes immutable.

---

# Metadata Interpretation

Extract

Video URL

Caption

Creator Username

Display Name

Post Time

Music

Duration

Views

Likes

Comments

Shares

Bookmarks

Hashtags

Mentions

Language

Location (if available)

Never invent missing metadata.

Missing values remain null.

---

# Comment Analysis

Comments are analyzed collectively.

The AI should identify

Escalation

Support

Agreement

Mockery

Threats

Violence

Harassment

Institution Mentions

Student Mentions

Repeated Phrases

Trending Language

Comment analysis contributes to severity.

---

# Caption Analysis

Analyze

Intent

Aggression

Humiliation

School References

Calls To Action

Slang

Provocation

Sarcasm

Caption alone must never determine severity.

---

# Institution Detection

The AI should attempt to identify

Target School

Author School

Neutral Institutions

Aliases

Misspellings

Abbreviations

Confidence assigned to every detected institution.

---

# Severity Engine

Purpose

Estimate seriousness.

Levels

LOW

MODERATE

HIGH

CRITICAL

Severity depends on

Language

Threats

Violence

Audience

Virality

Engagement

Comments

Historical Context

Severity must always include reasoning.

---

# Risk Engine

Risk estimates probability of real-world escalation.

Range

0

↓

100

Factors

Violence

Organized Conflict

Planning Language

Repeated Incidents

Targeting

Location

Virality

Risk ≠ Severity.

---

# Confidence Engine

Confidence measures certainty.

Range

0

↓

100

Confidence affected by

Metadata completeness

Comment quality

Profile quality

Language clarity

Prompt completeness

Response validation

Never confuse confidence with risk.

---

# Prompt Builder

Purpose

Construct deterministic prompts.

Prompt consists of

System Prompt

↓

Developer Instructions

↓

Evidence Package

↓

JSON Schema

↓

Validation Rules

↓

Output Constraints

Prompt generation is versioned.

---

# Prompt Rules

Prompt must

Never request opinions

Never request speculation

Require structured JSON

Require reasoning

Require citations to supplied evidence

Forbid fabrication

Explain uncertainty

---

# Structured Output

The AI must always return valid JSON.

Never markdown.

Never prose.

Never HTML.

Every response validated before persistence.

---

# JSON Sections

Executive Summary

Incident Classification

Detected Schools

Evidence Summary

Threat Assessment

Severity

Risk Score

Confidence

Key Findings

Administrative Recommendation

Explanation

Missing Information

Validation Status

Future versions may extend the schema without breaking compatibility.

---

# Validation Layer

Every AI response passes validation.

Checks

Valid JSON

Required Fields

Correct Types

Confidence Present

Severity Present

Risk Present

Explanation Present

No hallucinated evidence

Failures trigger retries.

---

# Retry Strategy

Retry only for

Timeouts

Malformed JSON

Rate Limits

Provider Errors

Maximum Retries

3

Each retry logged.

---

# Hallucination Prevention

The AI must never

Invent usernames

Invent schools

Invent locations

Invent comments

Invent timestamps

Invent statistics

When uncertain

Return Unknown

Never Guess.

---

# Report Generator

Transforms validated JSON into

Executive Summary

Detailed Findings

Evidence Table

Threat Timeline

Recommendations

Appendix

Reports remain immutable after generation.

---

# Administrative Recommendations

Generated recommendations should be actionable.

Examples

Monitor Situation

Notify School Leadership

Contact Student Welfare Team

Escalate Immediately

Document Evidence

Continue Monitoring

Recommendations must explain why.

---

# Timeline Generation

AI produces investigation milestones.

Examples

Metadata Collected

Threat Detected

Institution Identified

Severity Elevated

Report Completed

Timeline entries are persisted.

---

# Streaming

AI responses should stream progress.

Stages

Preparing Evidence

Constructing Prompt

Sending Request

Receiving Response

Validating Output

Generating Report

Saving Results

Each stage produces realtime events.

---

# Error Handling

Possible Errors

Provider Offline

Rate Limited

Timeout

Malformed JSON

Validation Failed

Unknown Provider Error

Every error recorded in

Terminal

Timeline

Audit Log (when appropriate)

---

# Performance Targets

Prompt Construction

<100ms

AI Request

<15 seconds

Validation

<200ms

Report Generation

<300ms

Database Save

<100ms

---

# AI Audit Trail

Every request stores

Prompt Version

Provider

Latency

Input Tokens

Output Tokens

Retry Count

Validation Result

Checksum

Allows future replay.

---

# Security Rules

Never expose API keys.

Never log secrets.

Never persist prompts containing credentials.

Escape all user-generated content before prompt construction.

Protect against prompt injection by treating external text as untrusted evidence.

---

# Future Capabilities

OCR

Speech Recognition

Frame Analysis

Weapon Detection

Logo Detection

Uniform Detection

Face Blurring

Cross-Platform Intelligence

Predictive Escalation Models

Multi-Agent Review

---

# Definition of Done

The AI Engine is complete only when

✓ Evidence is normalized.

✓ Prompts are deterministic.

✓ Provider abstraction exists.

✓ JSON validation succeeds.

✓ Confidence is calculated.

✓ Severity is explainable.

✓ Risk is independent of confidence.

✓ Reports are immutable.

✓ Every request is auditable.

✓ Hallucinations are minimized through validation and evidence constraints.

This specification is authoritative for all AI processing performed by OverWatch.