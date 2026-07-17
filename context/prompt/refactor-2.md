# OverWatch Engineering Specification
# Authentication System Refactor Directive
Version: 2.0.0

Status: REQUIRED

Priority: CRITICAL

---

# Purpose

The current authentication implementation is incomplete.

Although authentication appears to succeed on the backend, the frontend is failing to transition correctly into an authenticated session.

This indicates that the authentication flow has become fragmented.

Do **not** patch the existing implementation.

Refactor the authentication architecture into a complete, production-ready authentication system that follows the existing OverWatch specifications.

The goal is to have one cohesive authentication pipeline from registration to dashboard access.

---

# Current Issues

The following problems have been observed.

- Backend authentication succeeds.
- UI reports "Invalid login credentials".
- Session state is not being reflected correctly.
- Frontend and backend authentication logic appear to be disconnected.
- Registration flow is incomplete.
- Institution onboarding is incomplete.
- Authentication routing is inconsistent.
- There is no clear authentication state machine.

These issues should be treated as architectural problems rather than isolated bugs.

---

# Authentication Architecture

OverWatch has three user types.

## 1. Guest User

No authentication required.

Guests may

- Submit investigations
- Monitor investigations
- Run investigations in the background
- Download public reports

Guests cannot

- Access admin pages
- Launch raids
- View institution analytics
- View institution reports
- Access dashboards

---

## 2. Institution Administrator

Authentication required.

Institution administrators represent verified schools.

They can

- View investigations
- Launch raids
- View reports
- View analytics
- Receive notifications
- Manage institution settings

They cannot

- Manage other institutions
- View global analytics
- Access GOD Console

---

## 3. Platform Administrator

Single platform owner.

Full unrestricted access.

Can

- Approve schools
- Reject schools
- Suspend schools
- Manage users
- Access global analytics
- Access every investigation
- Access every raid
- Configure providers

---

# Authentication Routes

The following routes must exist.

```
/auth

/auth/login

/auth/register

/auth/pending

/auth/rejected

/auth/forgot-password

/auth/reset-password

/auth/logout
```

Protected routes

```
/dashboard

/dashboard/investigations

/dashboard/reports

/dashboard/analytics

/dashboard/settings
```

Platform routes

```
/god

/god/applications

/god/institutions

/god/users

/god/providers

/god/system
```

---

# Landing Page

The landing page should expose two clear entry points.

Primary

Start Investigation

Secondary

Admin Portal

Clicking

Admin Portal

opens

```
/auth/login
```

The login page should contain

Sign In

↓

Register Institution

↓

Forgot Password

---

# Registration

The institution registration page MUST exist.

```
/auth/register
```

This page should always remain publicly accessible.

No authentication required.

This is how schools begin onboarding.

---

# Registration Form

Collect

Institution Name

Institution Type

Official School Email

Administrator Name

Administrator Position

Administrator Email

Administrator Phone

School Phone (optional)

School Website

Address

City

State

Country

Reason for joining

Agreement Checkbox

Submit

No authentication account should be created yet.

---

# Registration Flow

Institution visits

```
/auth/register
```

↓

Completes form

↓

Application created

↓

Status

Pending

↓

Redirect

```
/auth/pending
```

Display

"Your institution has been submitted for manual verification."

---

# Approval Flow

Platform Administrator reviews application.

If approved

↓

Create Supabase Auth user

↓

Create School

↓

Create Institution Administrator

↓

Send approval notification

↓

User can now login

---

# Login Flow

Institution visits

```
/auth/login
```

↓

Enter credentials

↓

Supabase Auth

↓

Validate session

↓

Fetch Administrator

↓

Fetch School

↓

Fetch Role

↓

Create application session

↓

Redirect

Institution Dashboard

Every login must complete this sequence.

---

# Session Validation

Immediately after login

Verify

Authentication session

↓

Administrator exists

↓

School exists

↓

School approved

↓

Administrator active

↓

Role valid

If any validation fails

Terminate session

Display appropriate message

Never partially authenticate.

---

# Session Provider

The application should use a single centralized authentication provider.

Authentication state must not be duplicated across multiple contexts.

Every component should consume the same session.

Never maintain separate frontend and backend authentication state.

---

# Middleware

Middleware should protect

/dashboard

/god

/admin

Protected routes should automatically redirect unauthenticated users to

```
/auth/login
```

Authenticated users should never see login again unless they logout.

---

# Session Persistence

Users should remain logged in across browser refreshes.

Support

Remember Me

Persistent sessions

Automatic token refresh

Automatic session restoration

---

# Logout

Logout should

Destroy session

↓

Clear caches

↓

Clear auth context

↓

Redirect

Landing Page

---

# Error Handling

Replace generic

"Invalid login credentials"

with meaningful messages.

Examples

Incorrect email or password

Institution not yet approved

Institution suspended

Application rejected

Session expired

Network error

Unexpected authentication failure

Every authentication error should guide the user.

---

# Loading States

Every authentication request should have

Loading button

Progress indicator

Disabled inputs

Error state

Retry support

Never leave the user wondering.

---

# Dashboard Resolution

After successful login

Resolve destination automatically.

Institution Administrator

↓

Dashboard

Platform Administrator

↓

GOD Console

Never hardcode redirects.

Use role resolution.

---

# Audit Logging

Record

Login

Logout

Failed Login

Password Reset

Approval

Rejection

Account Suspension

Every event should be auditable.

---

# Security

Never expose

Service Role Key

JWT secrets

Session tokens

Refresh tokens

Admin API responses

Authentication logic belongs exclusively on the server.

---

# Existing Implementation

Before implementing new authentication code

Audit the existing implementation.

Identify

Duplicate authentication providers

Duplicate session management

Conflicting middleware

Broken redirects

Multiple login handlers

Remove architectural duplication.

There should be one authentication pipeline.

---

# Completion Criteria

This refactor is complete only when

✓ Institution registration is available at `/auth/register`.

✓ Schools can submit applications.

✓ Applications appear inside the GOD Console.

✓ Platform Administrator can approve applications.

✓ Approval creates the authentication account.

✓ Institution Administrator can login successfully.

✓ Session persists correctly.

✓ Dashboard loads without frontend authentication errors.

✓ Logout works correctly.

✓ Middleware protects every secured route.

✓ Authentication follows one unified architecture across the entire application.

This document supersedes the existing authentication implementation wherever architectural inconsistencies exist.