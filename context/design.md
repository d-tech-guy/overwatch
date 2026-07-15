# UI & Design System

## Design Philosophy

OverWatch is designed as a modern intelligence platform inspired by surveillance systems and mission-critical software.

The interface prioritizes clarity, precision, and confidence over decoration.

Every interaction should feel deliberate.

The UI should never feel playful or consumer-oriented.

Design Keywords:

- Minimal
- Monochrome
- Tactical
- Structured
- Professional
- Efficient

---

# Color Palette

The interface uses a strict black-and-white palette.

Primary Background

- Black

Secondary Background

- Slightly lighter black

Cards & Panels

- Dark gray

Borders

- Medium gray

Primary Text

- White

Secondary Text

- Light gray

Muted Text

- Gray

Color should never be used as decoration.

Status indicators may use subtle semantic colors only when absolutely necessary.

---

# Typography

Primary Font

- Mono Sans

Typography should establish hierarchy through weight and size rather than multiple font families.

Headings should be bold and concise.

Body text should remain clean and highly readable.

---

# Corners

All components use sharp edges.

No rounded corners.

Examples:

- Buttons
- Cards
- Inputs
- Tables
- Dialogs
- Badges

---

# Borders

Borders define separation.

Every major section should be enclosed by subtle borders.

Heavy shadows should be avoided.

---

# Shadows

Minimal to none.

Hierarchy should be created using spacing and borders instead of elevation.

---

# Icons

Library

- Lucide React

Use outlined icons whenever possible.

Icons should communicate information without becoming decorative.

---

# Components

Primary components include:

- Buttons
- Inputs
- Textareas
- Cards
- Tables
- Dialogs
- Dropdown Menus
- Badges
- Command Menu
- Navigation
- Breadcrumbs
- Tabs
- Tooltips
- Skeleton Loaders

Components should be built using shadcn/ui whenever possible.

---

# Layout

The application follows a dashboard-first layout.

Structure:

Top Navigation

↓

Sidebar Navigation

↓

Content Area

↓

Panels

↓

Cards

↓

Tables

Spacing should be consistent throughout the application.

Layouts should prioritize readability over density.

---

# Navigation

Primary navigation:

- Overview
- Incident Queue
- Investigations
- Intelligence
- Schools
- Settings

The current page should always be clearly identifiable.

---

# Buttons

Buttons should use strong typography.

Avoid excessive styling.

Primary actions should stand out through contrast rather than color.

Examples:

- Begin Investigation
- Report Incident
- Resolve Incident
- Export Report

---

# Tables

Tables are the primary method of presenting investigation data.

Every table should support:

- Sorting
- Searching
- Filtering
- Pagination

Rows should remain highly readable.

---

# Forms

Forms should be minimal.

Only request information that is necessary.

Validation should happen immediately when possible.

---

# Loading States

Avoid traditional loading spinners whenever possible.

Prefer:

- Skeleton loaders
- Progress indicators
- Status updates

Examples:

- Retrieving TikTok data
- Running AI investigation
- Generating report

---

# Empty States

Empty states should reassure the user.

Example messages:

- No Active Incidents
- No Investigations Found
- No Schools Registered

Every empty state should suggest the next available action.

---

# Motion

Animations should be subtle.

Allowed:

- Fade
- Slide
- Opacity transitions

Avoid:

- Bounce
- Elastic
- Oversized motion

Animations should communicate state changes rather than entertain.

---

# Responsiveness

The application must work across:

- Desktop
- Tablet
- Mobile

The administrator dashboard is optimized for desktop while remaining fully functional on smaller screens.

---

# Accessibility

Maintain high contrast.

Support keyboard navigation.

Provide descriptive labels for interactive elements.

Never rely solely on color to communicate meaning.

---

# Design Principles

- Simplicity over decoration.
- Information before aesthetics.
- Borders over shadows.
- Typography over color.
- Evidence before conclusions.
- Every interface should reduce cognitive load.
- Every interaction should feel intentional.