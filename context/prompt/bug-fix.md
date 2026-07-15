# Bug Fix Specification — Foundation Blocking Issues

## Objective

Resolve all foundation-level errors before continuing feature development.

These issues block the investigation workflow and must be completely resolved.

Do **not** continue implementing new features until every issue in this document has been fixed and verified.

---

# Issue 1 — Next.js Image Warning

## Error

```
Image with src "http://localhost:3001/logo.svg"
has either width or height modified, but not the other.
```

## Root Cause

The logo image is being resized while only one dimension is constrained.

This breaks the aspect ratio and produces a Next.js warning.

## Required Fix

Locate every usage of the logo image.

Ensure that:

- both width and height are explicitly provided, or
- when overriding one dimension with CSS, the opposite dimension is set to `auto`.

Examples

```tsx
<Image
    src="/logo.svg"
    width={40}
    height={40}
    alt="OverWatch"
/>
```

or

```tsx
className="w-10 h-auto"
```

Never distort the logo.

## Verification

- No Image warnings appear in the browser console.
- Logo maintains its correct proportions.

---

# Issue 2 — Node.js Version

## Warning

```
Node.js 20 and below are deprecated
```

## Required Fix

Verify the current Node.js version.

If below Node.js 22:

- upgrade the development environment to Node.js 22 LTS
- reinstall dependencies if necessary
- regenerate the lockfile if required

## Verification

Running

```
node -v
```

should return

```
v22.x.x
```

No Supabase SDK deprecation warning should remain.

---

# Issue 3 — Missing Database Table

## Error

```
PGRST205

Could not find table

public.incidents
```

## Root Cause

The application is attempting to insert into a table that does not exist.

Possible causes include:

- migration not executed
- table created under a different name
- incorrect schema
- stale generated types

## Required Investigation

Verify

1.

Supabase contains

```
public.incidents
```

2.

If not:

Create the table using the project's schema.

3.

If a different table name exists

Example

```
investigations
```

Update every repository reference accordingly.

Do not maintain conflicting table names.

The project should consistently use a single table name.

---

## Verify

Inspect

- SQL migrations
- Supabase Dashboard
- generated types
- repository functions
- server actions

Ensure every reference points to the same table.

---

# Issue 4 — Schema Cache

If the table exists but PostgREST cannot find it

Refresh the schema cache.

Verify

- migrations applied
- schema exposed
- API enabled

Do not assume the cache is current.

---

# Issue 5 — Generated Types

If the schema changed

Regenerate

```
src/types/database.ts
```

Ensure

- incidents table exists
- processing_status exists
- investigation_status exists
- progress exists

Generated types must exactly match the live database schema.

---

# Issue 6 — Repository Validation

Inspect

```
src/actions/incidents.ts
```

Verify

- correct table name
- correct insert payload
- correct types
- correct Supabase client

Ensure inserts target the correct table.

---

# Issue 7 — End-to-End Verification

After every fix

Run

1.

Create investigation

↓

2.

Insert succeeds

↓

3.

Investigation appears in Supabase

↓

4.

No console errors

↓

5.

No browser warnings

↓

6.

No runtime exceptions

↓

7.

Investigation ID returned

↓

8.

Landing page continues to Investigation Terminal

---

# Deliverables

Do not simply patch the symptoms.

Identify the root cause of each issue.

For every fix provide:

- Root cause
- Files modified
- Why the issue occurred
- How it was resolved
- Verification performed

The application must reach a clean foundation state with:

- Zero browser warnings
- Zero Supabase errors
- Zero schema mismatches
- Zero runtime exceptions

Only after every item passes should feature development continue.