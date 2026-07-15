# AI System

## Overview

OverWatch uses Artificial Intelligence to assist school administrators in identifying and investigating cyberbullying on TikTok.

The AI does not make disciplinary decisions.

Its responsibility is to collect evidence, analyze public content, assess potential harm, and generate a structured investigation report for human review.

---

# AI Objectives

The AI is responsible for:

- Identifying the school being targeted
- Detecting cyberbullying and harassment
- Understanding the context of the content
- Assessing the severity of the incident
- Explaining why content was flagged
- Generating investigation reports

The AI never determines punishment or disciplinary action.

---

# Investigation Pipeline

Every submitted TikTok URL follows the same investigation pipeline.

TikTok URL

↓

Retrieve Public Content

↓

Extract Available Information

↓

AI Investigation

↓

Generate Structured Report

↓

Save Incident

↓

Administrator Review

---

# Content Sources

The AI analyzes every publicly available piece of information associated with the TikTok post.

This may include:

- Caption
- Video description
- Hashtags
- Comments
- Upload timestamp
- Creator information
- Public engagement metrics
- Video content

The more evidence available, the more accurate the investigation.

---

# AI Investigation Stages

## Stage 1 — School Detection

Identify whether a school is mentioned.

Examples:

- School name
- Abbreviations
- Nicknames
- Hashtags
- Common misspellings

Output:

- Detected school
- Confidence score

---

## Stage 2 — Harm Detection

Determine whether the content contains:

- Cyberbullying
- Harassment
- Threats
- Defamation
- Hate speech
- Mockery
- Public humiliation

Output:

- Harm categories
- Supporting evidence

---

## Stage 3 — Context Analysis

Understand the intent behind the content.

Examples:

Positive:

"Our school won the competition."

Negative:

"Students from this school are useless."

This stage reduces false positives by considering context instead of relying on keywords alone.

---

## Stage 4 — Severity Assessment

Evaluate how harmful the incident may be.

Factors considered include:

- Direct targeting
- Language used
- Repeated insults
- Threats
- Audience engagement
- Overall context

Output:

- Risk Score
- Priority Level

Priority Levels:

- Low
- Medium
- High
- Critical

---

## Stage 5 — Report Generation

The AI generates a structured investigation report containing:

- Executive summary
- Detected school
- Harm categories
- Risk score
- Confidence score
- Supporting evidence
- Explanation
- Recommended next steps

---

# Explainable AI

Every conclusion made by the AI must be supported by evidence.

Example:

Risk Score: 91%

Reasoning:

- School identified in caption
- Offensive language detected
- Negative sentiment
- Public humiliation
- Multiple supporting comments

Administrators should always understand why a post was flagged.

---

# Human Review

AI recommendations are advisory only.

Administrators remain responsible for:

- Confirming incidents
- Rejecting false positives
- Recording investigation notes
- Determining disciplinary action

---

# Future Improvements

The AI system is designed to support future enhancements, including:

- Multi-platform investigations
- Trend prediction
- Repeat offender detection
- Cross-school conflict analysis
- Real-time monitoring
- Additional AI providers
