---
name: invoice-reporting
description: Generate reports and summaries from invoice data. Use when the user wants financial summaries, outstanding balances, revenue reports, or invoice analytics.
---

# Invoice Reporting Skill

## When to use

- User wants a summary of their invoices (monthly, quarterly, etc.)
- User wants to know outstanding balances or unpaid invoices
- User asks about revenue, earnings, or financial totals
- User wants to see overdue invoices
- User wants client-specific invoice history

## Instructions

### Outstanding Invoice Report

#### Step 1: Fetch All Invoices

Call `get_invoices` to retrieve all invoices. Paginate if necessary using `nextToken`:

```
{ "limit": 100 }
```

Continue fetching pages until all invoices are retrieved.

#### Step 2: Filter and Categorize

Categorize invoices by status:

- **Unpaid/Sent**: Invoices sent but not yet paid
- **Partially Paid**: Invoices with partial payments
- **Overdue**: Sent invoices past their due date
- **Draft**: Invoices not yet sent
- **Paid**: Completed invoices

#### Step 3: Calculate Totals

For each category, calculate:

- Number of invoices
- Total amount
- Average invoice amount

#### Step 4: Present Report

```
Invoice Summary
===============

Outstanding:
  Unpaid:         12 invoices   $24,500.00
  Partially Paid:  3 invoices   $4,200.00 remaining
  Overdue:         2 invoices   $3,800.00

Drafts:           5 invoices   $8,100.00

Paid (all time):  45 invoices  $92,350.00

Total Outstanding: $32,500.00
```

### Client Revenue Report

#### Step 1: Fetch Invoices and Businesses

1. Call `get_invoices` to get all invoices.
2. Call `get_businesses` to get all clients.

#### Step 2: Group by Client

Group invoices by client name and calculate per-client totals.

#### Step 3: Present Report

```
Revenue by Client
==================

| Client          | Invoices | Total Revenue | Outstanding |
|-----------------|----------|---------------|-------------|
| Acme Corp       | 15       | $45,000.00    | $3,200.00   |
| TechStart Inc   | 8        | $24,000.00    | $0.00       |
| Design Studio   | 12       | $18,500.00    | $2,800.00   |

Top Client: Acme Corp ($45,000.00)
Total Revenue: $87,500.00
```

### Monthly Revenue Report

#### Step 1: Fetch All Invoices

Retrieve all paid invoices.

#### Step 2: Group by Month

Parse invoice dates and group totals by month.

#### Step 3: Present Report

```
Monthly Revenue (2026)
=======================

| Month     | Invoices | Revenue    |
|-----------|----------|------------|
| January   | 8        | $12,400.00 |
| February  | 6        | $9,800.00  |

YTD Total: $22,200.00
Monthly Average: $11,100.00
```

### Overdue Invoice Alert

#### Step 1: Identify Overdue

Fetch invoices and identify those with:

- Status = SENT
- Payment status = UNPAID or PARTIALLY_PAID
- Due date in the past

#### Step 2: Present Alert

```
⚠ Overdue Invoices
===================

| Invoice # | Client      | Amount    | Days Overdue |
|-----------|-------------|-----------|--------------|
| INV000032 | Acme Corp   | $2,500.00 | 15 days      |
| INV000028 | Design Co   | $1,300.00 | 30 days      |

Total Overdue: $3,800.00

Consider sending payment reminders for these invoices.
```

## Limitations

- Reports are generated from the data available via the MCP tools.
- For very large datasets, pagination may result in multiple API calls.
- Date-based filtering is performed client-side after fetching data.

## Example Prompts

- "Show me my outstanding invoices"
- "How much revenue did I earn this month?"
- "Which clients owe me money?"
- "Give me a summary of all my invoices"
- "Show me overdue invoices"
- "What's my total revenue from Acme Corp?"
