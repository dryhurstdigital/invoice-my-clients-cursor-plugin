---
name: create-client
description: Add a new client to your Invoice My Clients account
---

# Create Client

Add a new client/business record to Invoice My Clients.

## Steps

1. Ask the user for client details:
   - Business name (required)
   - Email address (recommended)
   - Phone number (optional)
   - Address (optional)

2. Call `search_businesses` from the `invoice-my-clients` MCP server to check for duplicates.

3. If a similar client exists, show the match and ask: "A similar client already exists. Create a new record anyway?"

4. Call `create_business` with the provided details:
   - `businessName`: name
   - `businessEmail`: email
   - `businessPhone`: phone
   - `businessStreetAddress1`, `businessCity`, `businessState`, `businessPostCode`: address fields

5. Confirm creation with the new client's details. Offer to create an invoice for this client.
