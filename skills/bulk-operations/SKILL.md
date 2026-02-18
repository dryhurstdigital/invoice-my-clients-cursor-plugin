---
name: bulk-operations
description: Perform bulk invoice operations like creating multiple invoices, adding items in batch, or importing data. Use when the user wants to create several invoices at once, process a list of work entries, or perform batch updates.
---

# Bulk Operations Skill

## When to use

- User wants to create multiple invoices at once
- User has a list of work entries or time logs to convert to invoices
- User wants to add multiple line items to an invoice
- User wants to update multiple records in batch
- User provides structured data (CSV, table, list) for invoice creation

## Instructions

### Bulk Invoice Creation from Work Log

#### Step 1: Parse the Work Log

Accept work entries in various formats:
- Plain text list
- CSV data
- Markdown table
- Code comments with time tracking

Extract for each entry: client, description, hours/quantity, rate (optional).

#### Step 2: Group by Client

Group work entries by client to create one invoice per client.

#### Step 3: Retrieve Settings

Call `get_user_settings` once to get default rate, tax, and invoice preferences.

#### Step 4: Verify Clients

For each unique client, call `search_businesses` to verify they exist. Report any unmatched clients and ask how to proceed.

#### Step 5: Confirm Plan

Present the plan before executing:
```
Bulk Invoice Plan
==================

Invoice 1: Acme Corp
  - Backend API development (20 hrs @ $150/hr) = $3,000.00
  - Code review (5 hrs @ $150/hr) = $750.00
  Subtotal: $3,750.00

Invoice 2: TechStart Inc
  - UI Design (15 hrs @ $125/hr) = $1,875.00
  Subtotal: $1,875.00

Total: $5,625.00 across 2 invoices

Proceed? (yes/no)
```

#### Step 6: Execute

For each invoice:
1. Call `create_invoice` with the first line item.
2. Call `create_invoice_item` for each additional line item.
3. Report progress: "Created invoice 1/2: INV000042 for Acme Corp"

#### Step 7: Summary

```
Bulk Creation Complete!

| Invoice #  | Client       | Items | Total     |
|------------|--------------|-------|-----------|
| INV000042  | Acme Corp    | 2     | $3,750.00 |
| INV000043  | TechStart    | 1     | $1,875.00 |

Total Created: 2 invoices, $5,625.00
All invoices created as Draft.
```

### Adding Multiple Line Items

#### Step 1: Identify Target Invoice

Find the invoice using `get_invoice` or `search_invoices`.

#### Step 2: Parse Items

Extract line items from user input.

#### Step 3: Add Items Sequentially

For each item, call `create_invoice_item`:
```
{
  "invoiceId": "<invoice ID>",
  "invoiceItemDescription": "<description>",
  "invoiceItemQuantity": <qty>,
  "invoiceItemRate": <rate>
}
```

#### Step 4: Verify

Call `get_invoice_items` to confirm all items were added. Present the updated invoice.

### Bulk Client Import

#### Step 1: Parse Client Data

Accept client data in CSV or tabular format. Extract: name, email, phone, address fields.

#### Step 2: Check for Duplicates

For each client, search existing records with `search_businesses`.

#### Step 3: Confirm

Present the import plan, highlighting any potential duplicates.

#### Step 4: Execute

Call `create_business` for each new client. Report progress.

## Safety

- Always present a plan before executing bulk operations.
- Report progress after each operation.
- If any operation fails, report the error and continue with remaining items.
- Provide a final summary of successes and failures.

## Example Prompts

- "Create invoices from this work log: [list of entries]"
- "Add these items to invoice INV000042: [list of items]"
- "Import these clients: [CSV data]"
- "Invoice all my clients for January work"
