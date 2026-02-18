---
name: setup-account
description: Help users set up and configure their Invoice My Clients connection. Use when the user is setting up the plugin for the first time, needs to configure their API key, or wants to verify their account settings.
---

# Setup Account Skill

## When to use

- User just installed the plugin and needs to configure it
- User wants to verify their API key or connection
- User wants to see or understand their account settings
- User encounters authentication errors
- User asks "how do I set up Invoice My Clients?"

## Instructions

### First-Time Setup

#### Step 1: Explain Requirements

Tell the user what they need:

```
To use Invoice My Clients from Cursor, you'll need:

1. An Invoice My Clients account (sign up at https://app.invoicemyclients.com)
2. An API key from your account settings
```

#### Step 2: Guide API Key Generation

Direct the user to generate an API key:

```
To generate your API key:

1. Log in to Invoice My Clients at https://app.invoicemyclients.com
2. Go to Settings > Developer
3. Click "Generate API Key"
4. Copy the key (it starts with "imc_live_")
5. Keep it safe — you won't be able to see it again!
```

#### Step 3: Configure Environment

Help the user set the environment variable:

```
Set the IMC_API_KEY environment variable in your Cursor settings
or in a .env file:

IMC_API_KEY=imc_live_your_api_key_here
```

If using a self-hosted MCP server, also set:

```
IMC_MCP_SERVER_URL=https://your-server-url.com/mcp
```

#### Step 4: Verify Connection

Test the connection by calling `get_user_settings`. If successful, present the account info:

```
Connection Verified!

Account: John Smith
Business: Smith Consulting
Email: john@smithconsulting.com
Default Rate: $150.00/hr
Tax Rate: 8%
Invoice Prefix: INV
Payment Terms: Net 30
```

If it fails, troubleshoot:

- Check the API key is correct and not expired
- Verify the MCP server URL is accessible
- Check that the API key hasn't been revoked

### Viewing Account Settings

Call `get_user_settings` and present all configured options:

```
Your Invoice My Clients Settings
==================================

Business Information:
  Name: Smith Consulting
  Email: john@smithconsulting.com
  Phone: 555-123-4567
  Address: 123 Main St, New York, NY 10001

Invoice Defaults:
  Prefix: INV
  Default Rate: $150.00/hr
  Tax: 8%
  Payment Terms: Net 30

Financial Settings:
  Interest on Overdue: 1.5% monthly
  Early Payment Discount: 2% within 10 days

Language: English (US)
```

### Troubleshooting

Common issues and solutions:

| Issue                   | Solution                                          |
| ----------------------- | ------------------------------------------------- |
| "Authentication failed" | Check API key is correct and not expired          |
| "Connection refused"    | Verify MCP server URL, check if server is running |
| "API key revoked"       | Generate a new API key in account settings        |
| "Rate limit exceeded"   | Wait a moment and try again                       |
| Tools not appearing     | Restart Cursor, check plugin is installed         |

## Example Prompts

- "Set up Invoice My Clients"
- "Configure my invoicing account"
- "Check my Invoice My Clients connection"
- "Show my account settings"
- "My API key isn't working"
