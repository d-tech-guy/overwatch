# OverWatch Engineering Specification
# Inngest Infrastructure Repair
Version: 2.0

Status: REQUIRED

Priority: CRITICAL

---

# Purpose

The background processing infrastructure is partially implemented but incorrectly configured.

The objective is to repair the Inngest integration.

Do not redesign the investigation architecture.

Do not replace Inngest.

Do not remove background processing.

Only correct the implementation.

---

# Current Problems

The following issues have been identified.

- Event dispatch occasionally fails.
- The Inngest client is not fully configured.
- Background functions are not guaranteed to be discoverable.
- Errors are thrown instead of being handled gracefully.
- Investigation startup can fail because of infrastructure configuration.

---

# 1. Configure the Inngest Client Properly

The Inngest client must use the environment Event Key.

Current implementation creates the client using only

- id

This is incomplete.

The client must also be configured with

```
eventKey: process.env.INNGEST_EVENT_KEY
```

The Event Key must never be hardcoded.

Always load it from the environment.

---

# 2. Validate Environment Variables

At application startup verify

```
INNGEST_EVENT_KEY

INNGEST_SIGNING_KEY
```

If either variable is missing

- log a clear startup warning
- identify the missing variable
- explain what functionality is affected

Do not allow confusing runtime failures.

---

# 3. Verify API Route

Audit the project.

Ensure there is exactly ONE Inngest endpoint.

Expected route

```
src/app/api/inngest/route.ts
```

or

```
app/api/inngest/route.ts
```

The endpoint must expose every registered function using

```
serve(...)
```

Register

- processInvestigation
- processRaid
- every future Inngest function

Do not leave background workers unregistered.

---

# 4. Function Discovery

Verify that every exported function inside

```
lib/inngest/functions.ts
```

is included inside the serve() configuration.

Nothing should exist that cannot be discovered.

---

# 5. Startup Validation

During development

log

✓ Inngest Initialized

✓ Event Key Loaded

✓ Signing Key Loaded

✓ Functions Registered

✓ API Endpoint Ready

This should make debugging much easier.

---

# 6. Investigation Startup

Current behaviour

```
Create Investigation

↓

Send Event

↓

Throw Error

↓

Entire Request Fails
```

Replace with

```
Create Investigation

↓

Attempt Event Dispatch

↓

If Success

Continue

↓

If Failure

Persist Error

Update Investigation Status

Return Meaningful Error

Never crash the application.
```

---

# 7. Error Handling

Wrap

```
inngest.send(...)
```

inside proper error handling.

Capture

- network errors
- configuration errors
- invalid event payloads
- provider failures

Log structured diagnostics.

Never allow an unhandled promise rejection.

---

# 8. Development Diagnostics

During local development

display

Registered Functions

Registered Events

Connected Environment

Current Inngest Mode

This information should be available in server logs.

---

# 9. Terminal Integration

When an event is successfully dispatched

emit a terminal event.

Example

```
[INFO]

Background worker dispatched.

Waiting for Inngest execution...
```

When the worker actually begins

emit

```
[SUCCESS]

Worker connected.

Pipeline execution started.
```

This keeps the investigation terminal truthful.

---

# 10. Completion Validation

Verify all of the following.

✓ Investigation created.

✓ Event dispatched.

✓ Inngest receives event.

✓ Worker starts.

✓ Investigation pipeline executes.

✓ Terminal receives realtime updates.

✓ Report generated.

✓ Investigation completed.

---

# Success Criteria

The implementation is complete only when

✓ The Inngest client is fully configured.

✓ Environment variables are validated.

✓ Background functions are discoverable.

✓ Event dispatch succeeds.

✓ Missing configuration never crashes the application.

✓ Investigation background processing is reliable.

✓ Terminal accurately reflects background execution.

Do not redesign the background architecture.

Repair and complete the existing implementation while preserving the current project structure.