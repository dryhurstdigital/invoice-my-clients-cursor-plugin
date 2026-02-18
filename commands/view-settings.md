---
name: view-settings
description: View your Invoice My Clients account settings and defaults
---

# View Settings

Display your Invoice My Clients account configuration.

## Steps

1. Call `get_user_settings` from the `invoice-my-clients` MCP server.

2. Present the settings in organized sections:

   ```
   Account Settings
   =================

   Business Info:
     Name: [business name]
     Email: [email]
     Phone: [phone]
     Address: [full address]

   Invoice Defaults:
     Prefix: [prefix]
     Hourly Rate: $[rate]/hr
     Tax Rate: [percentage]%
     Payment Terms: Net [days]

   Financial Settings:
     Interest on Overdue: [percentage]% [frequency]
     Early Payment Discount: [percentage]% within [days] days

   Language: [language]
   ```

3. Inform the user: "To change these settings, visit your Invoice My Clients dashboard at https://app.invoicemyclients.com/settings"
