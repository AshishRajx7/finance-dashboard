# Finance Dashboard UI

A modern and interactive finance dashboard designed to help users track, analyze, and understand their financial activity through a clean and intuitive interface.

---

## Live Demo

https://your-vercel-link.vercel.app

---

## Repository

https://github.com/AshishRajx7/finance-dashboard

---

## Overview

This project is a frontend-only finance dashboard built as part of an assignment. It focuses on UI clarity, structured state management, and meaningful data visualization.

The dashboard is designed to communicate financial information within seconds using a top-down hierarchy:

- Summary
- Trends
- Detailed transactions
- Insights

---

## Features

### Dashboard Overview

- Total balance displayed in a card-style layout
- Income and expenses summary
- Balance trend visualization over time
- Spending breakdown by category

---

### Transactions

- Displays transactions with:
  - Date
  - Description
  - Category
  - Amount
  - Type (income or expense)

- Includes:
  - Search functionality
  - Filtering by transaction type
  - Sorting by date
  - Add, edit, and delete actions (admin role)
  - Export data as CSV and JSON

---

### Role-Based UI (Simulated)

- Viewer:
  - Can view data only

- Admin:
  - Can add, edit, and delete transactions

Role switching is handled on the frontend for demonstration purposes.

---

### Calendar Integration

- Monthly calendar with spending indicators
- Color-coded daily spending:
  - Low
  - Medium
  - High
- Clicking a date filters transactions for that day

---

### Insights

- Highest spending category
- Most frequent category
- Monthly comparison
- Highest spending day
- Average daily spending

Insights are computed dynamically from transaction data.

---

### Invoices

- Displays recent invoices with status:
  - Paid
  - Pending
  - Unpaid

- Actions:
  - Mark individual invoice as paid
  - Settle all invoices

---

## Tech Stack

- React with TypeScript (Vite)
- Tailwind CSS
- Zustand for state management
- Recharts for data visualization
- Framer Motion for animations
- Lucide React for icons
- date-fns for date handling

---

## State Management

The application uses Zustand as a centralized state store.

Key states include:

- Transactions data
- Filters (search, type, date)
- Selected role (admin or viewer)
- Selected date and month

All derived values such as totals, charts, and insights are computed from this single source of truth.

State is persisted using localStorage.

---

## Design and UX

- Clean and minimal interface
- Consistent spacing system
- Responsive layout across screen sizes
- Subtle animations for interaction feedback
- Handles empty and filtered states gracefully

---

## Setup Instructions
```
Clone the repository:

git clone https://github.com/AshishRajx7/finance-dashboard.git

Navigate into the project:

cd dashboard

Install dependencies:

npm install

Run the development server:

npm run dev
Build

To create a production build:

npm run build
Deployment
```
The project is deployed using Vercel.

Future Improvements
Backend integration with API
Authentication and user accounts
Budget tracking features
Advanced analytics and reporting
Multi-user support
Purpose

This project was built to demonstrate:

Frontend architecture and component design
State management using Zustand
Data-driven UI development
Practical product thinking
Contact

GitHub: https://github.com/AshishRajx7
