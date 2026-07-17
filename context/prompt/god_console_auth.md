# Authentication Refactor
# Platform Administrator (GOD Console) Login

Status: REQUIRED

Priority: CRITICAL

---

## Purpose

The Platform Administrator (GOD) login is currently non-functional.

Implement the authentication flow for the Platform Administrator without changing any existing UI.

Do **not** redesign the login page.

Do **not** add new inputs.

Do **not** modify the layout.

Only change the authentication logic.

---

# Environment Variables

The Platform Administrator credentials are stored in the server environment.

```
GOD_EMAIL=
GOD_PASSPHRASE=
```

These values are the authoritative credentials.

Never hardcode them.

Never expose them to the client.

Never return them in an API response.

Never serialize them into the browser.

They must only be read on the server.

---

# Login Flow

When the user submits the existing login form:

1.

Read the submitted email.

2.

Compare it against

```
process.env.GOD_EMAIL
```

3.

If the email matches,

compare the submitted password against

```
process.env.GOD_PASSPHRASE
```

4.

If both values match,

authenticate the Platform Administrator.

5.

Immediately create the Platform Administrator session.

6.

Redirect directly to

```
/god
```

Do not attempt Supabase Auth for the GOD account.

Do not query institution tables.

Do not require an Institution record.

Do not require an Application record.

The Platform Administrator exists independently of institution authentication.

---

# Authentication Order

The login handler should resolve users in the following order.

1.

Platform Administrator

↓

Check environment credentials.

If matched,

create GOD session.

Redirect to

```
/god
```

Stop execution.

Do not continue.

---

2.

Institution Administrator

↓

Authenticate with Supabase Auth.

↓

Validate Institution.

↓

Validate Approval.

↓

Load Administrator.

↓

Create session.

↓

Redirect to dashboard.

---

3.

Otherwise

Return

"Invalid email or password."

---

# Session

The Platform Administrator must receive a proper authenticated session.

The session should include

```
role = GOD

isPlatformAdmin = true

permissions = *
```

Do not fake navigation.

Do not simply redirect.

The session must identify the user as the Platform Administrator so middleware and authorization work correctly.

---

# Middleware

Protected GOD routes

```
/god

/god/*

```

must accept

```
role === GOD
```

and reject every other user.

Institution Administrators must never access GOD routes.

Guests must never access GOD routes.

---

# Security

Never expose

```
GOD_EMAIL

GOD_PASSPHRASE
```

to the browser.

All comparisons must occur on the server.

Use a constant-time comparison where appropriate.

Do not log the credentials.

Do not include them in audit logs.

---

# Existing UI

Keep the existing login UI exactly as it is.

No visual changes.

No layout changes.

No component changes.

Only replace the backend authentication logic.

---

# Success Criteria

The implementation is complete when

✓ Logging in with

```
GOD_EMAIL

GOD_PASSPHRASE
```

creates a Platform Administrator session.

✓ The user is redirected to

```
/god
```

✓ Middleware recognizes the session.

✓ Institution authentication continues to function independently.

✓ No UI changes are introduced.
