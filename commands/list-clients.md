---
name: list-clients
description: List and search your clients in Invoice My Clients
---

# List Clients

Display your client directory from Invoice My Clients.

## Steps

1. Ask the user: "Show all clients, or search for a specific one?"

2. Based on their choice:
   - **All clients**: Call `get_businesses` from the `invoice-my-clients` MCP server with `limit: 20`.
   - **Search**: Call `search_businesses` with the user's query.

3. Present results in a table:

   | # | Name | Email | Phone | City |
   |---|------|-------|-------|------|

4. If there are more results, offer to load the next page.

5. Offer follow-up actions: "Would you like to view a client's details, update a client, or create an invoice for any of these clients?"
