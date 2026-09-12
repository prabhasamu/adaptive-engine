# Adaptive Layout Engine for Multi-Surface Ads

A constraint-aware layout engine that takes a single declarative advertisement specification and automatically adapts it across fundamentally different display surfaces and aspect ratios.

The system is designed to solve a common problem in multi-surface advertising: the same advertisement content may need to appear on a mobile interstitial, TV lower-third, square kiosk, or other constrained surface without creating a separate hardcoded layout for every format.

---

## Overview

Advertising content is often created from a single content specification but displayed across surfaces with very different dimensions and constraints.

For example:

* Mobile interstitial → tall portrait layout
* TV lower-third → extremely wide and short layout
* Retail kiosk → square layout
* Other digital surfaces → different aspect ratios and safe areas

A traditional approach creates individual layouts for each surface. This leads to duplicated logic, inconsistent behavior, and difficult maintenance.

This project implements an **Adaptive Layout Engine** that resolves a common declarative ad specification into a surface-specific layout using:

* Aspect-ratio awareness
* Element priorities
* Minimum and maximum constraints
* Safe-area handling
* Adaptive scaling
* Intelligent repositioning
* Element hiding/degradation
* Text truncation
* Overflow detection
* Deterministic layout resolution

The goal is to make the layout engine **content-driven rather than surface-specific**.

---

## Key Features

### 1. Single Declarative Ad Specification

The advertisement is defined once using structured data rather than separate layouts for each surface.

Each element can define properties such as:

* Position
* Dimensions
* Priority
* Minimum/maximum size
* Font size
* Visibility
* Content
* Adaptation behavior

The layout engine then resolves this specification for the selected surface.

---

### 2. Multi-Surface Adaptation

The engine supports fundamentally different surface formats.

Examples include:

| Surface               | Characteristics                         |
| --------------------- | --------------------------------------- |
| Mobile Interstitial   | Portrait, compact vertical space        |
| TV Lower Third        | Wide, shallow horizontal space          |
| Square Kiosk          | Balanced width and height               |
| Other Custom Surfaces | Configurable dimensions and constraints |

The same source advertisement can therefore be rendered differently without maintaining separate hardcoded layouts.

---

### 3. Constraint-Aware Layout Resolution

The resolver considers the available surface dimensions and determines how elements should fit within the available space.

The resolution process considers:

```text
Ad Specification
       ↓
Surface Constraints
       ↓
Safe Area
       ↓
Initial Placement
       ↓
Constraint Resolution
       ↓
Adaptive Transformations
       ↓
Final Layout
```

---

### 4. Priority-Based Degradation

Not every element has the same importance.

Elements can be assigned different priorities so that critical content is preserved when space becomes constrained.

For example:

```text
Primary CTA        → High priority
Brand Logo         → High priority
Headline           → High priority
Supporting Text    → Medium priority
Decorative Element → Low priority
```

When the available space becomes insufficient, lower-priority elements can be degraded or hidden before critical content.

---

### 5. Safe-Area Handling

The engine prevents important content from being positioned outside the usable area of a surface.

This is particularly important for:

* TV overlays
* Mobile screens
* Kiosk displays
* Surfaces with padding/insets

The final layout respects the configured safe-area boundaries.

---

### 6. Adaptive Text Handling

Text elements can adapt to constrained surfaces through mechanisms such as:

* Font-size adjustment
* Width constraints
* Height constraints
* Truncation
* Visibility changes

This helps prevent text from overflowing its allocated region.

---

### 7. Explainable Layout Decisions

The engine is designed to make its decisions understandable.

Instead of simply producing coordinates, the system can expose the transformations applied to elements, such as:

```text
Scaled
Repositioned
Truncated
Hidden
Moved inside safe area
Reduced font size
```

This makes the resolver easier to debug and demonstrates why a particular layout was generated.

---

### 8. Deterministic Resolution

Given the same:

```text
Ad Specification
+
Surface Specification
```

the resolver produces the same layout result.

This makes the engine predictable, testable, and suitable for automated validation.

---

## Architecture

The project separates the advertisement specification, surface constraints, layout resolution, and rendering layers.

```text
                    ┌──────────────────────┐
                    │   Ad Specification   │
                    │                      │
                    │ Text / Image / CTA   │
                    │ Priority / Constraints│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Surface Specification│
                    │                      │
                    │ Width / Height       │
                    │ Safe Area            │
                    │ Constraints          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Layout Resolver    │
                    │                      │
                    │ Constraint checking  │
                    │ Scaling              │
                    │ Repositioning        │
                    │ Degradation          │
                    │ Overflow handling    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Resolved Layout    │
                    │                      │
                    │ Final position       │
                    │ Final dimensions     │
                    │ Visibility            │
                    │ Transformations      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Preview     │
                    └──────────────────────┘
```

---

## Project Structure

```text
adaptive-layout-engine/
│
├── src/
│   ├── components/
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── layoutResolver.ts
│   │   └── ...
│   │
│   ├── models/
│   │   └── ...
│   │
│   ├── tests/
│   │   └── layoutResolver.test.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── public/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> The exact file structure may vary depending on the implementation.

---

## Technology Stack

* **React**
* **TypeScript**
* **Vite**
* **CSS**
* **Vitest**
* **Node.js / npm**

The layout-resolution logic is implemented independently from the UI so that the core engine can be tested without relying on browser rendering.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm

Verify the installation:

```bash
node --version
npm --version
```

---

## Installation

Clone the repository:


https://github.com/prabhasamu/adaptive-engine.git


Navigate to the project:

```bash
cd adaptive-layout-engine
```

Install dependencies:

```bash
npm install
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

---

## Type Checking

Run TypeScript validation:

```bash
npx tsc --noEmit
```

---

## Run Tests

Run the complete test suite:

```bash
npm test -- --run
```

The test suite validates the layout resolver and ensures that generated layouts satisfy the required constraints.

---

## Example Adaptation

Consider a single advertisement specification containing:

```text
Logo
Headline
Description
CTA
Background
```

The same specification can be resolved for different surfaces.

### Mobile Interstitial

```text
┌─────────────────────┐
│       LOGO          │
│                     │
│   LARGE HEADLINE    │
│                     │
│    Description      │
│                     │
│    ┌───────────┐    │
│    │    CTA    │    │
│    └───────────┘    │
└─────────────────────┘
```

### TV Lower Third

```text
┌──────────────────────────────────────────────────────┐
│ LOGO │ Headline / Description              │ CTA    │
└──────────────────────────────────────────────────────┘
```

### Square Kiosk

```text
┌─────────────────────────┐
│          LOGO           │
│                         │
│      HEADLINE           │
│                         │
│      Description        │
│                         │
│        ┌─────┐          │
│        │ CTA │          │
│        └─────┘          │
└─────────────────────────┘
```

The content specification remains the same while the resolver determines the appropriate placement and sizing.

---

## Layout Resolution Strategy

The engine follows a constraint-based approach rather than maintaining separate layouts for each surface.

A simplified resolution strategy is:

### Step 1 — Read the source specification

The engine receives the advertisement elements and their constraints.

### Step 2 — Read surface constraints

The target surface provides:

* Width
* Height
* Aspect ratio
* Safe area
* Available space

### Step 3 — Generate an initial layout

Elements are positioned according to their declared layout information.

### Step 4 — Detect violations

The resolver checks for:

* Overflow
* Safe-area violations
* Minimum-size violations
* Excessive text dimensions
* Element collisions

### Step 5 — Apply adaptive transformations

Depending on the violation and element priority, the engine may:

```text
Scale
↓
Reposition
↓
Resize
↓
Truncate
↓
Hide
```

### Step 6 — Produce the resolved layout

The final result contains the dimensions, positions, visibility state, and applied transformations.

---

## Design Principles

### No Per-Surface Hardcoding

The engine avoids writing independent layout logic such as:

```text
if surface === "mobile" ...
if surface === "tv" ...
if surface === "kiosk" ...
```

Instead, surface properties are represented as data and the resolver operates on constraints.

This makes it easier to introduce additional surfaces without rewriting the core layout algorithm.

---

### Content Priority

When all elements cannot fit, important content should survive longer than decorative content.

This makes degradation predictable and meaningful.

---

### Graceful Degradation

The engine should prefer controlled adaptation over simply allowing content to overflow.

For example:

```text
Normal
  ↓
Resize
  ↓
Reposition
  ↓
Truncate
  ↓
Hide low-priority content
```

---

### Separation of Concerns

The project separates:

```text
Data
 ↓
Layout Logic
 ↓
Resolved Layout
 ↓
Rendering
```

This allows the core resolver to be tested independently from the React interface.

---

## Testing

The project includes automated tests for layout resolution.

Tests cover scenarios such as:

* Surface-specific layout resolution
* TV lower-third constraints
* Overflow prevention
* Safe-area handling
* Adaptive element positioning
* Constraint satisfaction

Run:

```bash
npm test -- --run
```

TypeScript validation:

```bash
npx tsc --noEmit
```

Both are used as part of the final validation process.

---

## Why This Approach?

A multi-surface advertising system should not require designers or developers to create a completely independent layout for every screen size.

Instead, the system should understand:

```text
What is important?
What space is available?
What constraints exist?
What can be changed?
What must remain visible?
```

The Adaptive Layout Engine converts these rules into a concrete layout automatically.

This makes the system:

* Reusable
* Extensible
* Testable
* Predictable
* Explainable
* Less dependent on surface-specific code

---

## Future Improvements

Potential extensions include:

* Collision-aware element placement
* More advanced text measurement
* Image focal-point preservation
* Constraint solving using optimization techniques
* Additional surface types
* Animation-aware layout adaptation
* Accessibility constraints
* More sophisticated typography adaptation
* Visual regression testing
* Layout scoring based on readability and visual hierarchy

---

## Assignment Objective

This project was developed as a solution for the **Adaptive Layout Engine for Multi-Surface Ads** frontend R&D challenge.

The implementation focuses on demonstrating:

* Strong frontend engineering
* TypeScript architecture
* Constraint-based layout reasoning
* Responsive/adaptive UI design
* Automated testing
* Explainable system behavior
* Maintainable and extensible code

---

## Author

**Prema R**

Built using React, TypeScript, Vite, and Vitest.
