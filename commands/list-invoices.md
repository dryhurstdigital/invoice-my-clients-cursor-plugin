---
name: list-invoices
description: List and search your invoices with filtering options
---

# List Invoices

Display a list of your invoices from Invoice My Clients.

## Steps

1. Ask the user if they want to:
   - See all invoices
   - Search for specific invoices
   - Filter by status (Draft, Sent, Paid, Overdue)

2. Based on their choice:
   - **All invoices**: Call `get_invoices` from the `invoice-my-clients` MCP server with `limit: 20`.
   - **Search**: Call `search_invoices` with the user's query.
   - **By status**: Call `get_invoices` and filter results by status.

3. Present results in a table:

   | # | Invoice Number | Client | Status | Total | Date |
   |---|----------------|--------|--------|-------|------|

4. If there are more results (nextToken present), offer to load more.

5. Offer follow-up actions: "Would you like to view details of any invoice, create a new invoice, or see a financial summary?"
