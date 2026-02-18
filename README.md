# Invoice My Clients — Cursor Plugin

Manage invoices, clients, and payments directly from Cursor. Create, search, and update invoices using natural language through the [Invoice My Clients](https://invoicemyclients.com) platform.

## Features

### MCP Server Integration

The plugin connects to the Invoice My Clients MCP server, giving Cursor's AI agent access to 15+ invoice management tools:

**Invoice Operations**
- `create_invoice` — Create invoices with auto-generated numbers, client matching, and line items
- `update_invoice` — Modify invoice details, reassign clients, archive invoices
- `get_invoice` — Look up by ID or invoice number (supports fuzzy matching)
- `get_invoices` — List all invoices with pagination and filtering
- `search_invoices` — Free-text fuzzy search across invoices

**Client Management**
- `create_business` — Add new client records with full contact details
- `update_business` — Update client information
- `get_business` — Retrieve client details
- `get_businesses` — List all clients with pagination
- `search_businesses` — Fuzzy search across clients

**Line Items**
- `create_invoice_item` — Add line items to invoices
- `update_invoice_item` — Modify existing items
- `get_invoice_items` — List items on an invoice
- `delete_invoice_item` — Remove a line item

**Account**
- `get_user_settings` — Retrieve your business settings, rates, and preferences

### AI Rules

Bundled rules teach Cursor's agent how to properly handle:
- Invoice data creation and updates
- Client record management and deduplication
- Financial formatting (currency, dates, statuses)
- Tax, discount, and payment term best practices

### Agent Skills

Five specialized skills for complex multi-step workflows:

| Skill | Description |
|-------|-------------|
| `create-invoice` | End-to-end invoice creation with client matching and line items |
| `manage-clients` | Client CRUD with duplicate detection and data quality checks |
| `invoice-reporting` | Generate financial reports, revenue summaries, and overdue alerts |
| `bulk-operations` | Create multiple invoices from work logs, batch import clients |
| `setup-account` | First-time setup, API key configuration, connection verification |

### Custom Agents

Three purpose-built agents optimized for different tasks:

| Agent | Description |
|-------|-------------|
| `invoice-assistant` | General-purpose invoicing agent for all invoice operations |
| `client-manager` | Specialized in client relationships and data quality |
| `financial-analyst` | Revenue analysis, cash flow, and financial reporting |

### Commands

Seven quick-action commands:

| Command | Description |
|---------|-------------|
| `/create-invoice` | Create a new invoice |
| `/find-invoice` | Look up a specific invoice |
| `/list-invoices` | Browse and search invoices |
| `/create-client` | Add a new client |
| `/list-clients` | Browse and search clients |
| `/invoice-summary` | Quick financial overview |
| `/view-settings` | View account configuration |

### Hooks

- **Session Start** — Verifies API key configuration
- **After MCP Execution** — Audit logging for invoice operations

## Setup

### Prerequisites

1. An [Invoice My Clients](https://app.invoicemyclients.com) account
2. An API key from your account settings

### Generate an API Key

1. Log in to [Invoice My Clients](https://app.invoicemyclients.com)
2. Go to **Settings** → **Developer**
3. Click **Generate API Key**
4. Copy the key (starts with `imc_live_` or `imc_dev_`)

### Configure the Plugin

Set the `IMC_API_KEY` environment variable in your shell profile, Cursor settings, or a `.env` file:

```bash
export IMC_API_KEY=imc_live_your_api_key_here
```

If using a self-hosted MCP server, also set:

```bash
export IMC_MCP_SERVER_URL=https://your-server.com/mcp
```

### Verify Connection

Use the `/view-settings` command or ask the agent:

> "Check my Invoice My Clients connection"

## Usage Examples

### Create an Invoice

> "Invoice Acme Corp for 40 hours of web development at $150/hr"

The agent will:
1. Check your settings for defaults
2. Find "Acme Corp" in your clients
3. Create a draft invoice with a line item
4. Show a summary with invoice number and total

### Bulk Invoice from Work Log

> "Create invoices from this work log:
> - Acme Corp: 20 hrs backend dev, 10 hrs code review
> - TechStart: 15 hrs UI design
> - Design Co: 8 hrs consultation"

The agent will group by client, verify each exists, present a plan, and create invoices after confirmation.

### Financial Summary

> "How much do my clients owe me?"

The agent will fetch all invoices, categorize by status, and present a financial summary with outstanding balances.

### Client Management

> "Add a new client: TechStart Inc, email billing@techstart.io, phone 555-123-4567"

The agent will check for duplicates, create the record, and confirm.

### Find an Invoice

> "Find my invoice for Acme Corp from last week"

The agent will search invoices, match by client and date, and present the full details with line items.

## Architecture

```
invoice-my-clients-cursor-plugin/
├── .cursor-plugin/
│   └── plugin.json          # Plugin manifest
├── .mcp.json                # MCP server configuration
├── rules/                   # AI behavioral rules
│   ├── invoice-data-handling.mdc
│   ├── client-management.mdc
│   ├── invoice-formatting.mdc
│   └── financial-best-practices.mdc
├── skills/                  # Multi-step workflow skills
│   ├── create-invoice/
│   │   └── SKILL.md
│   ├── manage-clients/
│   │   └── SKILL.md
│   ├── invoice-reporting/
│   │   └── SKILL.md
│   ├── bulk-operations/
│   │   └── SKILL.md
│   └── setup-account/
│       └── SKILL.md
├── agents/                  # Purpose-built agents
│   ├── invoice-assistant.md
│   ├── client-manager.md
│   └── financial-analyst.md
├── commands/                # Quick-action commands
│   ├── create-invoice.md
│   ├── find-invoice.md
│   ├── list-invoices.md
│   ├── create-client.md
│   ├── list-clients.md
│   ├── invoice-summary.md
│   └── view-settings.md
├── hooks/                   # Automation hooks
│   └── hooks.json
├── scripts/                 # Hook scripts
│   ├── check-connection.js
│   └── log-mcp-usage.js
├── assets/                  # Static assets
│   └── logo.svg
└── README.md
```

## How It Works

The plugin connects Cursor's AI agent to your Invoice My Clients account through the [Model Context Protocol (MCP)](https://cursor.com/docs/context/mcp). When you ask the agent to perform invoice operations, it:

1. Authenticates using your API key
2. Calls the appropriate MCP tool (e.g., `create_invoice`)
3. The MCP server executes the operation via GraphQL against the Invoice My Clients backend
4. Results are returned to the agent, which presents them in a readable format

All data stays in your Invoice My Clients account. The plugin is a communication bridge — it doesn't store any data locally.

## Security

- **API Key Authentication** — All requests are authenticated with your API key
- **No Local Storage** — No invoice data is stored on your machine
- **Audit Logging** — MCP tool usage is logged for your records
- **Read/Write Control** — You control what operations to allow

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check your `IMC_API_KEY` is correct and not expired |
| "Connection refused" | Verify `IMC_MCP_SERVER_URL` is reachable |
| "Tools not appearing" | Restart Cursor, check plugin is installed and MCP server is enabled |
| "API key revoked" | Generate a new key at Settings → Developer |
| "Rate limit exceeded" | Wait a moment and retry |

## Support

- **Documentation**: [invoicemyclients.com/docs](https://invoicemyclients.com/docs)
- **Issues**: [GitHub Issues](https://github.com/invoicemyclients/invoice-my-clients-cursor-plugin/issues)
- **Email**: support@invoicemyclients.com

## License

MIT
