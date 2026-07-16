# OverWatch Engineering Specification
# 02 - Authentication & Institution Verification
Version: 1.0.0
Status: Approved
Priority: Critical

Dependencies

- 00-product-specification.md
- 01-investigation-engine.md
- database.md
- architecture.md

---

# Purpose

The Authentication System is responsible for protecting every privileged operation within OverWatch.

Unlike conventional authentication systems, OverWatch authenticates institutions rather than individual consumers.

Every authenticated user represents a real educational institution.

The authentication system must reinforce trust.

Administrators should feel as though they are requesting access to a secure intelligence platform rather than creating an ordinary account.

---

# Authentication Philosophy

The platform intentionally separates the application into two worlds.

PUBLIC

Guest Investigation

Landing Page

Realtime Investigation

Generated Reports

----------------------------

PRIVATE

Operations Center

Threat Intelligence

Raid Engine

Saved Reports

Institution Settings

Administration

Only authenticated school administrators may access the private environment.

---

# User Roles

Version One defines three roles.

Guest

Authenticated School Administrator

Platform Administrator

No additional roles should exist.

Future versions may introduce:

Moderator

Investigator

Counsellor

Principal

These roles are intentionally deferred.

---

# Authentication Provider

Authentication shall use

Supabase Auth

Authentication methods

Email + Password

Google OAuth

Future providers may be added later.

Business logic must never depend on authentication provider implementation.

---

# Route Architecture

Public Routes

/

/report/[id]

/login

/request-access

/privacy

/terms

Authenticated Routes

/admin

/admin/investigations

/admin/reports

/admin/raids

/admin/settings

Platform Routes

/god

/god/applications

/god/institutions

/god/investigations

/god/system

/god/settings

Unknown routes redirect to

404

---

# Layout Architecture

Public Layout

Minimal

Navigation

Landing

Authentication

Investigation Modal

Background Investigation Dock

Admin Layout

Persistent Sidebar

Operations Header

Realtime Notification Center

Global Search

Content Container

God Layout

Platform Sidebar

System Metrics

Platform Alerts

Live Activity Feed

No page should construct its own layout.

---

# Public Authentication Flow

Landing Page

↓

Request Access

↓

Pending Verification

↓

Administrator Approval

↓

Email Notification

↓

Login

↓

Operations Center

No administrator should be able to skip verification.

---

# Request Access Philosophy

The Request Access page exists to collect institutional information.

It DOES NOT create an active account.

Instead it creates an

Institution Access Request

The request remains inactive until manually approved.

---

# Request Access Form

Collect

Institution Name

Institution Type

Public

Private

Government

Country

State

City

Official School Email

Official School Website

Administrator Full Name

Administrator Role

Administrator Email

Administrator Phone Number

Reason For Joining

Every field must validate.

---

# Validation Rules

Institution Name

Required

Minimum 3 characters

Maximum 120 characters

Administrator Name

Minimum 3 characters

Maximum 80 characters

Email

Must be valid email

Phone

Must match E164

Website

HTTPS only

Reason

Maximum

1000 characters

Validation should occur

Client

AND

Server

---

# Request Submission

Submitting the request performs

Validate

↓

Persist Request

↓

Generate Public Request ID

↓

Send Notification (future)

↓

Display Pending Screen

No authentication account should be created at this stage.

---

# Pending Verification Screen

Purpose

Inform administrators that verification is manual.

Display

Institution Name

Submission Date

Public Request ID

Verification Status

Expected Response Time

Support Contact

Actions

Return Home

Contact Support

No additional actions.

---

# Manual Verification

Verification occurs inside the GOD Console.

Platform Administrator reviews

Institution

Administrator

Website

School Email

Supporting Communication

Administrator manually decides

Approve

Reject

Request Additional Information

Version One intentionally avoids automatic document verification.

---

# Approval Process

Administrator clicks

Approve

↓

System creates Supabase Auth account

↓

Creates Institution

↓

Creates Administrator Profile

↓

Links Account

↓

Marks Request

Approved

↓

Sends Approval Email (future)

↓

Administrator may login

Everything must occur inside a transaction.

No orphaned records.

---

# Rejection Process

Rejected requests remain stored.

Fields

Rejected At

Rejected By

Reason

Rejected requests never create auth accounts.

---

# Login Screen

Minimal interface.

Fields

Email

Password

Remember Me

Buttons

Sign In

Continue with Google

Forgot Password

Request Access

The page should resemble a secure operations platform.

Not a social application.

---

# Login Rules

Before authentication

Validate

Email

Password

After authentication

Verify

Administrator Exists

Institution Exists

Institution Approved

Account Active

Only then create session.

---

# Session Management

Sessions managed by Supabase Auth.

Application stores

Institution

Administrator

Role

Permissions

Never trust client state.

Always validate server-side.

---

# Route Protection

Every protected route performs

Session Check

↓

Administrator Check

↓

Institution Check

↓

Permission Check

↓

Render Page

Failures redirect

/login

Platform routes additionally verify

Platform Administrator

---

# Institution Model

Institution owns

Administrators

Investigations

Reports

Raids

Threat Monitors

Settings

No investigation should exist without an owning institution.

---

# Administrator Model

Administrator owns

Institution ID

Full Name

Role

Email

Phone

Status

Last Login

Created At

Updated At

Administrators never own investigations directly.

Institutions own investigations.

---

# Logout

Logout clears

Session

Realtime Subscriptions

Cached Institution Data

Cached Administrator Data

Background Tasks

Redirect

Landing Page

---

# Forgot Password

Use Supabase reset flow.

Never implement custom password reset logic.

---

# Notification Requirements

Successful Login

Welcome notification

Approval

Institution approved

Rejected

Access request rejected

Unauthorized

Permission denied

Session expired

Please sign in again

---

# Security Rules

Passwords never stored by application.

Never expose JWT.

Never expose Service Role Key.

Never trust client supplied institution IDs.

Never trust client supplied role IDs.

Every protected mutation validates

Authentication

Authorization

Ownership

Permission

Business Rules

Only then execute.

---

# Accessibility

Entire authentication flow must support

Keyboard navigation

Screen readers

Visible focus states

Proper labels

Reduced motion

Responsive layouts

---

# Definition of Done

Authentication is complete only when

✓ Guests may investigate anonymously.

✓ Institutions may request access.

✓ Requests persist correctly.

✓ GOD Console approves requests.

✓ Supabase accounts created only after approval.

✓ Route protection works.

✓ Sessions restore correctly.

✓ Unauthorized access blocked.

✓ Institution ownership enforced.

✓ Logout clears state.

✓ Authentication UI matches OverWatch design language.

This document is authoritative for every authentication-related implementation.