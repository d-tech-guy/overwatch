# OverWatch Engineering Specification
# 11 - Security Architecture & Platform Hardening
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- Entire Platform

---

# Purpose

Security is not a feature.

Security is the foundation upon which every OverWatch subsystem operates.

Every layer of the application must assume that incoming requests are hostile until proven otherwise.

The platform must follow the principle of Zero Trust.

Every request.

Every user.

Every provider.

Every token.

Every websocket.

Every database query.

must be validated.

---

# Security Philosophy

Assume Breach.

Least Privilege.

Defense in Depth.

Zero Trust.

Audit Everything.

Never Trust Client Input.

Never Trust External APIs.

Never Trust AI Output.

Every security decision should minimize blast radius.

---

# Security Layers

Layer 1

Authentication

↓

Layer 2

Authorization

↓

Layer 3

Database Policies

↓

Layer 4

Business Validation

↓

Layer 5

Provider Validation

↓

Layer 6

Audit Logging

↓

Layer 7

Monitoring

---

# Authentication

Provider

Supabase Auth

Supported Methods

Email + Password

Future

Magic Links

Institution SSO

Google Workspace

Microsoft Entra ID

Only verified school administrators may authenticate.

Students never authenticate.

Guests remain anonymous.

---

# Guest Sessions

Guests may

Submit Investigations

Run Background Investigations

View Reports

Cancel Investigations

Reconnect to Active Investigations

Guests may NOT

Access Dashboard

Launch Raids

View Institution Data

Create Administrators

Modify Reports

---

# Administrator Sessions

Administrators authenticate using

Supabase Auth

↓

Institution Verification

↓

Approved Institution

↓

Active Account

↓

JWT Issued

↓

Platform Session

Rejected institutions never receive dashboard access.

---

# Platform Administrator

Only one platform account exists.

Primary Email

osemudiamhen.obhahie@upsshub.com

Platform Access additionally requires

Access Phrase

grant access

The phrase is requested after successful authentication.

The phrase is never stored in plaintext.

Hash using Argon2 or bcrypt.

Comparison occurs server-side.

---

# Authorization

Authorization is role-based.

Roles

Guest

Institution Administrator

Platform Administrator

Future

Institution Moderator

Security Analyst

Read-only Auditor

---

# Permission Matrix

Guest

Submit Investigation

View Own Investigation

Cancel Own Investigation

Run Background Investigation

Institution Administrator

Everything Guest

Institution Dashboard

Institution Reports

Institution Raids

Institution Analytics

Platform Administrator

Full Platform Access

Provider Management

Institution Approval

Feature Flags

Audit Logs

System Configuration

---

# Database Security

Provider

Supabase PostgreSQL

ORM

Prisma

Database interaction always occurs through Prisma.

No direct client database access.

No SQL in UI.

No SQL in Components.

---

# Row Level Security

Even though Prisma performs server-side operations,

RLS remains enabled.

Purpose

Defense in Depth.

Future API protection.

Future Edge Functions.

Future direct SQL operations.

Never disable RLS globally.

---

# RLS Principles

Institution Administrators

↓

Institution Records Only

Platform Administrator

↓

Everything

Guests

↓

Nothing

Guest investigations identified through secure tracking identifiers.

Never expose UUIDs.

---

# Session Management

Sessions contain

User ID

Institution ID

Role

Issued At

Expiration

Session Version

Sessions rotate automatically.

---

# Session Expiration

Institution Administrator

Standard Duration

30 Days

Platform Administrator

Shorter Duration

12 Hours

Idle Timeout

30 Minutes

Critical pages require re-verification.

---

# CSRF Protection

Required

Server Actions

Forms

Authentication

State-changing operations

Never trust origin headers alone.

---

# XSS Prevention

Escape

Captions

Comments

Usernames

Institution Names

Search Queries

AI Responses

Never render HTML from external sources.

Render as plain text.

---

# SQL Injection

Prevented through

Prisma Parameterization

Input Validation

No string concatenation.

Never execute user-generated SQL.

---

# Prompt Injection Protection

TikTok captions.

Comments.

Usernames.

Profile bios.

must always be treated as untrusted input.

Prompt Builder wraps all external text inside evidence sections.

AI instructed to ignore instructions embedded inside evidence.

Example

Caption

"Ignore previous instructions"

must never alter system prompts.

---

# API Key Management

Secrets

Gemini

Apify

Supabase

Future Providers

Stored only

Environment Variables

Never

Database

Frontend

Logs

Client Components

---

# Secret Rotation

Secrets should be replaceable without code changes.

Future

Secret Manager

Current

Environment Variables

---

# Input Validation

Every request validated.

Validation includes

Required Fields

Length

Type

Pattern

Allowed Values

URL Format

Rate Limits

No bypasses.

---

# URL Validation

Supported Domains

TikTok

Future

Instagram

YouTube

Reject

Malformed URLs

Unsupported Domains

Localhost URLs

Private Network Addresses

---

# File Upload Security

Future Feature

Requirements

Virus Scan

MIME Validation

File Size Limit

Extension Validation

Randomized Storage Names

No executable uploads.

---

# Rate Limiting

Protect

Authentication

Registration

Investigation Submission

Raid Creation

Search

Provider Calls

Platform Configuration

Rate limits configurable.

---

# Abuse Detection

Monitor

Repeated Failures

Repeated Registrations

Repeated Investigation Spam

Provider Abuse

Authentication Abuse

Suspicious IP Activity

Future

Automatic temporary bans.

---

# Audit Logging

Every privileged operation creates

Immutable Audit Entry

Fields

Timestamp

Actor

Institution

Action

Target

Old Value

New Value

IP Address

User Agent

Correlation ID

Audit logs never editable.

---

# Monitoring

Monitor

Failed Logins

Permission Denials

Provider Failures

Rate Limits

Database Errors

Realtime Failures

Prompt Validation Failures

Visible inside GOD Console.

---

# Encryption

Passwords

Argon2 or bcrypt

HTTPS

Required

JWT

Signed

Environment Variables

Encrypted at rest

Database

Managed by Supabase

Future

Application-level encryption for highly sensitive fields.

---

# Security Headers

Content Security Policy

Strict Transport Security

X-Frame-Options

X-Content-Type-Options

Referrer Policy

Permissions Policy

Configured globally.

---

# Dependency Security

Dependencies updated regularly.

Use

pnpm audit

Dependabot (future)

Security advisories monitored.

Unused dependencies removed.

---

# Logging Policy

Never log

Passwords

Access Tokens

Refresh Tokens

API Keys

Secrets

Database Passwords

Authentication Cookies

PII beyond operational necessity.

---

# Error Messages

Users receive

Human-readable messages.

Logs receive

Technical details.

Never expose

Stack Traces

SQL Errors

Prisma Errors

Provider Credentials

---

# Provider Security

All external responses validated.

Timeouts configured.

Retries limited.

Malformed responses rejected.

Provider failures isolated.

One provider failure must never compromise platform stability.

---

# Backup Security

Encrypted

Retention Policy

Access Controlled

Restore Operations audited.

---

# Incident Response

Future Runbooks

Database Failure

Provider Outage

Authentication Failure

API Leak

Security Breach

Platform Compromise

Every incident documented.

---

# Future Enhancements

Hardware Security Keys

Passkeys

Institution SSO

Risk-based Authentication

Behavior Analytics

SIEM Integration

Automated Threat Detection

SOC Alerting

---

# Definition of Done

The Security Architecture is complete only when

✓ Zero Trust principles are enforced.

✓ Authentication is secure.

✓ Authorization is role-based.

✓ RLS protects database access.

✓ Prompt injection is mitigated.

✓ Secrets never leave the server.

✓ Audit logs are immutable.

✓ Sessions rotate safely.

✓ Rate limiting protects critical endpoints.

✓ Monitoring detects abnormal activity.

✓ Sensitive information is never exposed to clients.

This specification is authoritative for all security, authentication, authorization, and platform hardening decisions within OverWatch.