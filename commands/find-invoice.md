---
name: find-invoice
description: Look up a specific invoice by number, client name, or search query
---

# Find Invoice

Search for and display a specific invoice from Invoice My Clients.

## Steps

1. Ask the user what they're looking for:
   - An invoice number (e.g., "INV000042")
   - A client name (e.g., "Acme Corp")
   - A general search term

2. Based on their input:
   - **Invoice number**: Call `get_invoice` with `invoiceNumber` from the `invoice-my-clients` MCP server.
   - **Search term**: Call `search_invoices` with the query.

3. If multiple results are returned, present them in a list and ask the user to pick one.

4. For the selected invoice, call `get_invoice_items` to get line items.

5. Present the full invoice details:

   ```
   Invoice: INV000042
   Status: Sent | Unpaid
   Date: February 10, 2026
   Due: March 12, 2026

   From: [sender info]
   To: [client info]

   | Description          | Qty | Rate    | Amount    |
   |----------------------|-----|---------|-----------|
   | Web Development      | 40  | $150.00 | $6,000.00 |
   | Design Review        | 5   | $150.00 | $750.00   |

   Subtotal: $6,750.00
   Tax (8%): $540.00
   Total: $7,290.00
   ```

6. Offer follow-up actions: "Would you like to update this invoice, add items, or view the client's other invoices?"
