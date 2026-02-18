---
name: create-invoice
description: Create a new invoice for a client with line items
---

# Create Invoice

Create a new invoice using Invoice My Clients.

## Steps

1. Ask the user for:
   - Client name (required)
   - Work description (required)
   - Quantity/hours (required)
   - Rate per unit (optional — defaults to user's hourly rate)
   - Invoice notes (optional)

2. Call `get_user_settings` from the `invoice-my-clients` MCP server to get default rate and tax settings.

3. Call `search_businesses` to find the client. If multiple matches, ask the user to pick one. If no match, offer to create a new client.

4. Call `create_invoice` with:
   - `businessName`: the matched client name
   - `invoiceItemDescription`: work description
   - `invoiceItemQuantity`: quantity
   - `invoiceItemRate`: rate (omit to use default)
   - `invoiceNotes`: notes if provided

5. If the user has additional line items, call `create_invoice_item` for each.

6. Present a summary with invoice number, client, line items, subtotal, tax, and total. Remind the user the invoice is in Draft status.
