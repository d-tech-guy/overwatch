# OverWatch Engineering Specification
# 09 - Design System & User Experience Architecture
Version: 1.0.0
Status: Approved
Priority: CRITICAL

Dependencies

- Entire Platform

---

# Purpose

The OverWatch Design System exists to ensure that every page, every component, every interaction, every animation, and every workflow communicates one feeling:

"The platform is actively protecting institutions."

Users should never feel they are operating a school management system.

They should feel they are operating a cyber intelligence platform.

The interface must balance

Professionalism

↓

Operational Awareness

↓

Information Density

↓

Clarity

↓

Speed

↓

Accessibility

Every design decision should reinforce trust.

---

# Design Philosophy

The interface should borrow inspiration from

CrowdStrike Falcon

Microsoft Defender XDR

Cloudflare Dashboard

AWS Console

Linear

Raycast

Vercel

GitHub

Datadog

Notion should NOT be referenced.

Discord should NOT be referenced.

Slack should NOT be referenced.

The visual language should communicate

Precision

Security

Confidence

Control

---

# Brand Identity

Brand Name

OverWatch

Tagline

Intelligent School Threat Intelligence Platform

Brand Personality

Calm

Professional

Analytical

Modern

Trustworthy

Minimal

Technical

Never playful.

Never cartoonish.

---

# Color Philosophy

Color should communicate state.

Not decoration.

Neutral colors dominate.

Accent colors communicate urgency.

---

# Semantic Colors

Primary

Neutral

Success

Healthy

Warning

Attention Required

Danger

Critical Threat

Info

Realtime Activity

Muted

Background Information

Every component must use semantic tokens.

Never hardcode colors.

---

# Visual Density

The platform is information-rich.

Whitespace should be intentional.

Avoid oversized cards.

Avoid oversized buttons.

Prefer information density over excessive spacing.

The interface should comfortably display

Tables

Metrics

Charts

Terminals

Timelines

Without appearing cluttered.

---

# Typography

Primary Font

Geist Sans

Secondary Font

Geist Mono

Terminal

Geist Mono

Never mix more than two font families.

---

# Typography Scale

Display

Dashboard Titles

Heading 1

Page Titles

Heading 2

Section Titles

Heading 3

Cards

Body Large

Body

Body Small

Caption

Terminal

Code

Every page should follow the same hierarchy.

---

# Border Radius

Small

Inputs

Medium

Cards

Large

Dialogs

Avoid excessively rounded components.

The platform is precise.

Not playful.

---

# Shadows

Minimal.

Use elevation sparingly.

Most separation achieved through

Borders

Contrast

Spacing

Not shadows.

---

# Motion Philosophy

Animations communicate

Progress

Hierarchy

Feedback

Never decoration.

Animations should be fast.

Subtle.

Functional.

---

# Animation Timing

Instant

State Indicators

Fast

Buttons

Normal

Cards

Slow

Dialogs

Realtime streams should never animate excessively.

---

# Page Layout

Persistent Sidebar

↓

Persistent Header

↓

Workspace

↓

Floating Notifications

↓

Background Operations Widget

The layout never reloads.

---

# Sidebar

Always visible.

Collapsible.

Contains

Logo

Navigation

Quick Actions

Realtime Status

Current User

Environment

Version

Never scroll independently unless necessary.

---

# Header

Contains

Breadcrumbs

Search

Notifications

Realtime Indicator

Institution Switcher (future)

User Menu

The header remains fixed.

---

# Global Search

Keyboard Shortcut

CTRL + K

Searches

Investigations

Reports

Institutions

Raids

Administrators

Terminal Events

Should feel similar to Raycast.

Results grouped.

Instant.

---

# Cards

Cards should communicate

Purpose

Status

Actions

Context

Every card should contain

Header

Body

Footer

Avoid empty decorative elements.

---

# Metric Cards

Every metric card displays

Title

Primary Value

Trend

Delta

Description

Status Indicator

Click Action

Never display metrics without context.

---

# Tables

Tables are primary.

Not secondary.

Every table supports

Sorting

Filtering

Searching

Pagination

Column Visibility

Export

Keyboard Navigation

Resizable Columns (future)

---

# Terminal

The terminal is one of the defining UI elements.

It must feel authentic.

Every line originates from backend events.

Never fake output.

Fields

Timestamp

Severity

Component

Duration

Operation

Message

Investigation

Metadata

Features

Copy

Search

Pause

Resume

Filter

Download

Auto-scroll

Expand

Terminal colors based on severity.

---

# Timeline

Every investigation contains a timeline.

Items

Icon

Timestamp

Title

Description

Duration

Expand

Newest appears last.

Timeline never mutates.

---

# Investigation Progress

Displayed using

Stage Indicator

↓

Progress Bar

↓

Elapsed Time

↓

Estimated Remaining

↓

Current Worker

↓

Current Provider

Users should always know

Where

Why

How long

---

# Status Badges

Examples

Queued

Running

Completed

Failed

Cancelled

Healthy

Offline

Warning

Critical

Badges use semantic colors.

---

# Buttons

Primary

Secondary

Ghost

Danger

Icon

Loading

Split Button

Every loading button disables interaction.

---

# Inputs

Support

Validation

Descriptions

Helper Text

Loading

Success

Errors

Accessibility Labels

Never rely on placeholders as labels.

---

# Dialogs

Dialogs should contain

Title

Description

Body

Actions

Keyboard Shortcuts

Escape closes only safe dialogs.

Danger dialogs require confirmation.

---

# Toast Notifications

Purpose

Immediate feedback.

Types

Success

Info

Warning

Danger

Toast lifetime depends on severity.

Critical alerts remain visible.

---

# Empty States

Every empty state teaches.

Examples

No Investigations

No Reports

No Notifications

No Raids

Provide

Explanation

Illustration

Primary Action

Never display blank pages.

---

# Loading States

Skeletons preferred.

Never show spinning indicators alone.

Show

Current Stage

Progress

Estimated Time

Backend Activity

---

# Error States

Every error contains

What happened

Why

Suggested Action

Retry Button

Reference ID

Never display raw stack traces.

---

# Dashboard Widgets

Widgets should be movable in future.

Current widgets

Threat Summary

Running Investigations

Recent Reports

Notifications

Realtime Feed

Terminal

Platform Health

---

# Charts

Use charts only when trends matter.

Preferred

Line

Bar

Area

Heatmap

Avoid pie charts unless absolutely necessary.

Every chart exports.

---

# Maps

Future

Threat Heat Map

Institution Locations

Raid Coverage

Geographic Trends

Maps should support clustering.

---

# Icons

Use Lucide Icons.

Maintain consistent iconography.

Icons communicate

Action

Status

Navigation

Never decorate unnecessarily.

---

# Accessibility

Minimum contrast

WCAG AA

Keyboard navigation

Complete

Focus indicators

Visible

ARIA labels

Required

Screen reader compatibility

Required

Animations respect reduced-motion preferences.

---

# Responsive Strategy

Desktop First.

Tablet supported.

Mobile

Monitoring only.

Complex investigations are desktop optimized.

---

# Background Operations Widget

Fixed

Bottom Right

Displays

Running Investigations

Running Raids

Current Stage

Progress

Elapsed Time

Cancel

Open

Collapse

This widget persists across navigation.

---

# Theme

Dark Mode

Primary

Light Mode

Supported

Dark mode is the design reference.

Light mode mirrors functionality.

---

# Component Standards

Every reusable component must include

Variants

Loading State

Disabled State

Empty State

Accessibility

Keyboard Support

Error Handling

Storybook compatibility (future)

---

# UX Principles

Every page must answer

What is happening?

What happened?

What should I do next?

Users should never feel lost.

No dead ends.

No unexplained states.

No ambiguous actions.

---

# Definition of Done

The Design System is complete only when

✓ Every page follows a shared visual language.

✓ Components are reusable.

✓ Status is always visible.

✓ Information hierarchy is consistent.

✓ Accessibility requirements are met.

✓ Realtime feedback is integrated.

✓ Empty and loading states are meaningful.

✓ Terminal feels authentic.

✓ Dark mode is the primary experience.

✓ Every interaction reinforces confidence and operational awareness.

This specification is authoritative for all UI, UX, and visual design decisions across OverWatch.