# Aura — Luxury Restaurant Landing Page

A clean, responsive landing page for Aura — a luxury fine dining restaurant. Built with Bootstrap and custom CSS, this project demonstrates a modern, accessible, and mobile-friendly website layout suitable for promotional purposes and simple reservation interactions.

## Live Demo
👉 https://beautiful-croissant-d70aae.netlify.app

## Tech Stack
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Font Awesome

## Features

- Responsive, mobile-first layout using Bootstrap 5
- Smooth scrolling navigation with active link highlighting
- Fixed, glassmorphic navigation bar with mobile collapse
- Signature menu, reviews carousel, and reservation form with client-side validation
- Lightweight vanilla JavaScript (no build step) in `js/main.js`

## Project Structure

- `index.html` — main entry and page markup
- `css/style.css` — main design tokens and layout styles
- `css/responsive-style.css` — responsive overrides and mobile adjustments
- `js/main.js` — DOM helpers, navigation behavior, and form validation
- `images/` — project images and assets

## Quick Start

Prerequisites: a modern browser (Chrome, Firefox, Edge, Safari). No server or build tools required — files are static.

## Development

- Edit HTML in `index.html`.
- Update styles in `css/style.css` and `css/responsive-style.css`.
- Update interactive behavior in `js/main.js`.

Tip: Use browser DevTools to inspect responsive breakpoints and test the mobile collapse behavior.

## Troubleshooting

If the mobile menu does not appear when clicking the hamburger:

- Verify Bootstrap JS is loaded (Popper + Bootstrap) and appears before `js/main.js` in `index.html`.
- Check the browser console for JavaScript errors.
- Confirm no CSS rules hide `.navbar-collapse.show` (see `css/responsive-style.css`).

## Purpose
This project is part of my personal portfolio, demonstrating frontend development and UI/UX design skills.
