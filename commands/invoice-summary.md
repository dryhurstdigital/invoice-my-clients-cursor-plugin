---
name: invoice-summary
description: Get a quick financial summary of your invoices
---

# Invoice Summary

Generate a quick financial overview of your invoicing activity.

## Steps

1. Call `get_invoices` from the `invoice-my-clients` MCP server to retrieve all invoices. Paginate through all results.

2. Categorize invoices:
   - **Draft**: Not yet sent
   - **Sent/Unpaid**: Awaiting payment
   - **Partially Paid**: Some payment received
   - **Paid**: Fully paid
   - **Overdue**: Past due date, unpaid

3. Calculate:
   - Total invoices count
   - Total revenue (paid invoices)
   - Outstanding balance (sent + partially paid)
   - Draft value (potential revenue)
   - Overdue amount (needs attention)

4. Present the summary:

   ```
   Invoice Summary
   ================

   Total Invoices: 65

   Paid:             45 invoices   $92,350.00
   Outstanding:      12 invoices   $24,500.00
   Partially Paid:    3 invoices    $4,200.00
   Overdue:           2 invoices    $3,800.00
   Draft:             5 invoices    $8,100.00

   Total Revenue:       $92,350.00
   Total Outstanding:   $32,500.00
   ```

5. Highlight any action items: overdue invoices needing follow-up, drafts ready to send.
