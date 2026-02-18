---
name: create-invoice
description: Create a new invoice for a client with line items using the Invoice My Clients MCP server. Use when the user wants to invoice a client, bill for work, or create a new invoice.
---

# Create Invoice Skill

## When to use

- User wants to create or generate a new invoice
- User wants to bill a client for work performed
- User says "invoice [client] for [work]"
- User provides time/work logs and wants to convert them to an invoice

## Prerequisites

Before creating an invoice, gather the following information from the user. Required items are marked with \*.

- **Client name\*** - Who is being invoiced
- **Line item description\*** - What work was performed
- **Quantity\*** - Hours, units, or count
- **Rate** - Per-unit price (defaults to user's hourly rate if omitted)
- **Invoice name** - Title for the invoice (defaults to "INVOICE")
- **Notes** - Any additional notes for the invoice

## Instructions

### Step 1: Check User Settings

Call `get_user_settings` to retrieve:

- Default hourly rate (used if no rate specified)
- Invoice prefix and numbering
- Tax percentage
- Business contact info (auto-populated on invoice)
- Payment terms

Present a brief summary: "Your default rate is $X/hr, tax is Y%, payment terms are Net Z."

### Step 2: Find or Confirm the Client

If the user provided a client name:

1. Call `search_businesses` with the client name to check for existing records.
2. If an exact match is found, confirm: "I found [Client Name] in your records. Creating invoice for them."
3. If multiple matches are found, present options and ask the user to choose.
4. If no match is found, ask: "I don't have a record for [name]. Would you like me to create a new client, or did you mean one of your existing clients?"

If the user wants a new client, use the `manage-clients` skill to create one first.

### Step 3: Create the Invoice

Call `create_invoice` with:

```
{
  "businessName": "<client name>",
  "invoiceName": "<invoice title or 'INVOICE'>",
  "invoiceNotes": "<notes if provided>",
  "invoiceItemDescription": "<first line item description>",
  "invoiceItemQuantity": <quantity>,
  "invoiceItemRate": <rate if specified>
}
```

The system will:

- Auto-generate an invoice number (e.g., INV000042)
- Set the date to today
- Set status to DRAFT
- Auto-populate sender info from settings
- Match and link the client business record

### Step 4: Add Additional Line Items

If the user has multiple line items, add each with `create_invoice_item`:

```
{
  "invoiceId": "<invoice ID from step 3>",
  "invoiceItemDescription": "<description>",
  "invoiceItemQuantity": <quantity>,
  "invoiceItemRate": <rate>
}
```

### Step 5: Confirm and Summarize

Present a summary of the created invoice:

```
Invoice Created Successfully!

Invoice #: INV000042
Client: Acme Corp
Date: February 17, 2026
Status: Draft

| Description          | Qty | Rate    | Amount    |
|----------------------|-----|---------|-----------|
| Website Development  | 40  | $150.00 | $6,000.00 |
| UI Design            | 10  | $125.00 | $1,250.00 |

Subtotal: $7,250.00
Tax (8%): $580.00
Total: $7,830.00

Payment Terms: Net 30 (Due: March 19, 2026)
```

Remind the user: "This invoice is in Draft status. You can review and send it from the Invoice My Clients app."

## Error Handling

- If client matching returns a disambiguation list, present choices to the user.
- If invoice creation fails, check the error message and advise accordingly.
- If the invoice number has a collision (rare), the system auto-retries up to 10 times.

## Example Prompts

- "Create an invoice for Acme Corp for 40 hours of web development at $150/hr"
- "Invoice John Smith for logo design, 1 unit at $500"
- "Bill TechStart Inc for: 20hrs backend dev, 15hrs frontend dev, 5hrs code review"
