# Authentication & Session Management Fixes
Status: REQUIRED

Priority: CRITICAL

The following issues are preventing the administrator workflow from functioning correctly.

These are bug fixes.

Do not redesign the authentication architecture.

Do not change the existing UI.

Do not modify the existing user flow.

Only correct the underlying implementation.

---

# 1. Default Password for Approved Institutions

For the current phase of the project, use a fixed temporary password for every newly approved institution.

When a Platform Administrator approves an application,

create the Supabase Auth account using the following password exactly.

```
OVW-26-4K9M-XP7A
```

This password should only be assigned during account creation.

Do not generate random passwords.

Do not ask the administrator to enter one.

Do not display a password generator.

The password will be communicated manually outside the application.

The implementation should simply use the value above when calling the Supabase Admin API.

Future versions may generate unique passwords, but that is outside the scope of this project.

---

# 2. Fix Logout / Disconnect Session

The current logout implementation is incomplete.

Clicking **Disconnect Session** appears to navigate away, but the authentication session remains active.

Evidence

- Clicking "Operations Center" immediately returns the user to the GOD Console.
- The login page is bypassed.
- Middleware still considers the user authenticated.
- Session cookies are still present.
- Authentication state is not fully cleared.

This is incorrect behaviour.

---

# Required Behaviour

When the user clicks

```
Disconnect Session
```

the application must perform a complete logout.

The logout flow should execute in this order.

```
Terminate authentication session

↓

Invalidate server session

↓

Clear authentication cookies

↓

Clear client authentication state

↓

Clear cached user information

↓

Clear cached role information

↓

Clear GOD session

↓

Redirect to

/auth/login
```

The session must be completely destroyed.

---

# Session Verification

After logout,

attempting to access any protected route should immediately redirect back to

```
/auth/login
```

Protected routes include

```
/god

/god/*

/dashboard

/dashboard/*
```

Refreshing the page must not restore the previous session.

---

# Operations Center Button

After a successful logout,

clicking

```
Operations Center
```

must always open

```
/auth/login
```

The login form should be displayed.

The previous session must never be reused.

The application should never silently re-authenticate the previous user.

---

# Middleware

Audit the middleware and session validation logic.

Verify that

- Expired sessions are rejected.
- Logged-out sessions are rejected.
- Cached sessions are not reused.
- GOD sessions are removed correctly.
- Institution Administrator sessions are removed correctly.

The middleware must determine authentication from the current valid session only.

---

# Client State

Ensure all authentication-related client state is cleared.

This includes

- React context
- Cached user objects
- Cached role objects
- Local authentication stores
- Any persisted authentication data

After logout, the application should behave exactly as if it has never been logged into.

---

# Root Cause Investigation

The current approval issues may be caused by stale authentication state.

Do not treat logout as an isolated bug.

Audit the complete session lifecycle.

Verify

- Login
- Session creation
- Session persistence
- Session validation
- Logout
- Session destruction
- Redirect logic
- Middleware protection

Ensure the entire authentication lifecycle is consistent.

---

# Success Criteria

The implementation is complete only when

✓ Newly approved institution accounts are created with the temporary password

```
OVW-26-4K9M-XP7A
```

✓ The Platform Administrator can manually communicate this password.

✓ Clicking **Disconnect Session** completely destroys the active session.

✓ No authentication cookies remain after logout.

✓ Protected routes cannot be accessed after logout.

✓ Clicking **Operations Center** always displays the login page after logout.

✓ Refreshing the browser does not restore the previous authenticated session.

✓ No stale authentication state remains anywhere in the application.

These changes should fix the existing authentication lifecycle without changing the current UI or redesigning the authentication architecture.