# CareerDive

This is a Next.js application for CareerDive, a platform designed to connect mentors and mentees to foster career growth and development.

## Overview

CareerDive aims to provide a seamless experience for individuals seeking mentorship and for experienced professionals looking to guide others. This landing page showcases the platform's features, benefits, and pricing.

## Getting Started

To get started with the development environment:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the app on `http://localhost:9002`.

The main landing page code can be found in `src/app/page.tsx`. Components specific to the landing page are located in `src/components/landing/`.

## Core Features (Landing Page)

*   **Hero Section**: Introduces CareerDive with a compelling headline, subheadline, and calls to action.
*   **How it Works**: Explains the user journey on the platform in simple steps.
*   **Testimonials**: Showcases success stories from users.
*   **Pricing**: Displays available subscription plans.
*   **Footer**: Contains important links like Terms of Service, Privacy Policy, and Contact information.

## Tech Stack

*   Next.js (App Router)
*   React
*   TypeScript
*   Tailwind CSS
*   Shadcn/ui (for UI components)
*   Lucide Icons (for iconography)

## Project Structure

*   `src/app/`: Contains the main application pages and layouts.
    *   `page.tsx`: The entry point for the landing page.
    *   `layout.tsx`: The root layout for the application.
    *   `globals.css`: Global styles and Tailwind CSS configuration.
*   `src/components/`: Shared UI components.
    *   `ui/`: Shadcn/ui components.
    *   `landing/`: Components specific to the CareerDive landing page.
*   `public/`: Static assets.

## Design Style

The application follows a modern and clean design aesthetic:

*   **Color Palette**: Primarily uses soft teal, pale blue, and light desaturated teal to evoke professionalism, trust, and calmness.
*   **Typography**: Utilizes clear and readable fonts (Geist Sans, with fallbacks to Arial, Helvetica).
*   **Layout**: Emphasizes whitespace and responsive design for an optimal user experience across all devices.
*   **Iconography**: Incorporates simple and clear icons to enhance understanding of product features.

