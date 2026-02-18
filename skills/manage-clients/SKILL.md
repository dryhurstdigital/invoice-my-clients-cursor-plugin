---
name: manage-clients
description: Create, update, search, and manage client/business records in Invoice My Clients. Use when the user wants to add a new client, update client info, find a client, or view their client list.
---

# Manage Clients Skill

## When to use

- User wants to add a new client or business
- User wants to update client contact information
- User wants to find or search for a client
- User wants to see their list of clients
- User needs to manage client records before invoicing

## Instructions

### Creating a New Client

#### Step 1: Gather Information

Collect client details from the user. Only `businessName` is required:

| Field                  | Required | Example            |
| ---------------------- | -------- | ------------------ |
| Business Name          | Yes      | "Acme Corporation" |
| Email                  | No       | "billing@acme.com" |
| Phone                  | No       | "555-123-4567"     |
| Mobile                 | No       | "555-987-6543"     |
| Street Address         | No       | "123 Main St"      |
| Suite/Unit             | No       | "Suite 400"        |
| City                   | No       | "New York"         |
| State                  | No       | "NY"               |
| Postal Code            | No       | "10001"            |
| Language               | No       | "en-US" or "es-Mx" |
| Accept Online Payments | No       | true/false         |

#### Step 2: Check for Duplicates

Before creating, search for existing clients:

1. Call `search_businesses` with the business name.
2. If matches are found, present them: "I found a similar client: [name]. Is this the same business, or should I create a new record?"
3. If no matches, proceed to creation.

#### Step 3: Create the Client

Call `create_business` with the collected fields:

```
{
  "businessName": "Acme Corporation",
  "businessEmail": "billing@acme.com",
  "businessPhone": "555-123-4567",
  "businessStreetAddress1": "123 Main St",
  "businessCity": "New York",
  "businessState": "NY",
  "businessPostCode": "10001"
}
```

#### Step 4: Confirm

Present the created record:

```
Client Created!

Name: Acme Corporation
Email: billing@acme.com
Phone: 555-123-4567
Address: 123 Main St, New York, NY 10001
```

### Searching for Clients

Use `search_businesses` for fuzzy text search:

```
{ "query": "acme" }
```

This searches across business name, email, and city. Present results in a table:

| Name | Email | City | Phone |
| ---- | ----- | ---- | ----- |

For a full list, use `get_businesses` with pagination:

```
{ "limit": 20 }
```

If there are more results, inform the user and offer to load more.

### Updating a Client

#### Step 1: Find the Client

Search for the client by name using `search_businesses`.

#### Step 2: Confirm Identity

Present the found record and confirm: "Is this the client you want to update?"

#### Step 3: Apply Updates

Call `update_business` with only the changed fields:

```
{
  "id": "<business ID>",
  "businessEmail": "new-billing@acme.com"
}
```

#### Step 4: Confirm Changes

Show a before/after summary of what changed.

### Viewing Client Details

Call `get_business` with the client's ID to retrieve full details. Present all available information in a clean format.

## Error Handling

- If search returns no results, suggest checking spelling or trying partial names.
- If creation fails, check for required fields and valid email format.
- Always use IDs from the API, never fabricate them.

## Example Prompts

- "Add a new client called TechStart Inc, email tech@techstart.io"
- "Find my client named Johnson"
- "Update Acme Corp's email to new-billing@acme.com"
- "Show me all my clients"
- "How many clients do I have?"
