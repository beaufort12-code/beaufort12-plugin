---
name: setup
description: >
  Walk an admin through connecting this plugin to Salesforce Hosted MCP.
  Use when the plugin is first installed, tools are missing, the connector
  shows Connected with an empty tool list, OAuth succeeds but nothing works,
  or the user asks how to set up Mailchimp or Dropbox in Claude.
---

# Connect Beaufort 12 to Salesforce Hosted MCP

Guide the signed-in admin. Do not invent a Consumer Key, server URL, or
workaround. Do not document Claude Code `--callback-port`.

This plugin talks to **one** Salesforce Hosted MCP server. The customer
adds only the Beaufort 12 Apex actions they have installed. A Mailchimp-only
org never registers Dropbox tools.

## 1. Confirm packages

In Salesforce Setup → Installed Packages, they need at least one pair:

| Product | Packages | Permission sets |
| --- | --- | --- |
| Mailchimp | Email Made Easy (Mailchimp) and Mailchimp for Agentforce | `mone__Mailchimp_Agent_Admin` plus a Mailchimp data permission set |
| Dropbox | Dropbox for Salesforce and Dropbox for Agentforce | `dbx__Dropbox_Agent_Admin` |

Each action user also needs an **active package license** and a completed
product connection (Mailchimp Connect or Dropbox Connect).

If neither pair is installed, stop. Tell them to install from AppExchange
first. Do not try to call tools.

## 2. Create one Hosted MCP server

1. Setup → **MCP Servers** → enable the service if it is off.
2. Add MCP Server → Create Salesforce MCP Server.
3. Give it a clear label such as `Beaufort 12`.
4. Add Server Assets → Add Tools → switch the list from Agentforce agents
   to **Apex actions**.
5. Add only the actions they own. Prefer the namespaced managed-package
   classes (`mone__McAgent*`, `dbx__DbAgent*`). If two similar labels
   appear, open each and pick the namespaced class.
6. Save, then **Activate**.
7. Copy the server URL:
   - Production: `https://api.salesforce.com/platform/mcp/v1/custom/<ApiName>`
   - Sandbox or scratch: `https://api.salesforce.com/platform/mcp/v1/sandbox/custom/<ApiName>`

That URL is the plugin `salesforce_mcp_url` value.

### Recommended Mailchimp actions

Add these when Mailchimp for Agentforce is installed. Starter-server
aliases are in parentheses.

- Mailchimp: Get Mailchimp Connection Status (`mc_check`)
- Mailchimp: Find Salesforce Record (`mc_find_record`)
- Mailchimp: Find Mailchimp Audience (`mc_find_audience`)
- Mailchimp: Find Mailchimp Member Live (`mc_find_member`)
- Mailchimp: Find Missing Mailchimp Audience Members (`mc_find_missing`)
- Mailchimp: List Mailchimp Audiences for Record (`mc_record_audiences`)
- Mailchimp: Find Stale Or At-Risk Mailchimp Members (`mc_find_stale`)
- Mailchimp: Find Bounce And Unsubscribe Risks (`mc_find_risks`)
- Mailchimp: Get Mailchimp Audience Summary (`mc_audience`)
- Mailchimp: Get Mailchimp Audience Growth Trends (`mc_growth`)
- Mailchimp: Get Mailchimp Sync Status (`mc_sync`)
- Mailchimp: Check Mailchimp Deliverability (`mc_deliverability`)
- Mailchimp: Get Mailchimp Record Engagement Summary (`mc_engagement`)
- Mailchimp: Get Mailchimp Record Email Activity (`mc_activity`)
- Mailchimp: List Recent Mailchimp Campaigns (`mc_campaigns`)
- Mailchimp: Get Mailchimp Campaign Summary (`mc_campaign`)
- Mailchimp: Get Mailchimp Record Tags (`mc_record_tags`)
- Mailchimp: Subscribe Mailchimp Subscriber (`mc_subscribe`) — write
- Mailchimp: Unsubscribe Mailchimp Subscriber (`mc_unsubscribe`) — write
- Mailchimp: Manage Mailchimp Tags (`mc_tags`) — write
- Mailchimp: Suggest Mailchimp Field Mappings (`mc_suggest`)
- Mailchimp: Create Mailchimp Merge Field (`mc_merge_field`) — write
- Mailchimp: Create Mailchimp Data Wizard (`mc_create_wizard`) — write

Do not add `McInvocableMembers`, `McInvocableTags`, or gateway utilities.
The `McAgent*` classes are the agent interface.

The last three build Data Wizards and are what `audience-build` needs.
Their Setup-UI labels may read slightly differently in your org — match
on "Suggest Mailchimp Wizard Field Mappings", "Create Mailchimp Audience
Merge Field" and "Create Mailchimp Data Wizard", and pick the namespaced
classes `mone__McAgentSuggestWizardMappings`,
`mone__McAgentCreateAudienceMergeField`, and
`mone__McAgentCreateDataWizard`. Leave all three off the server if you
only want a read-and-diagnose install; the skill then hands the admin a
build spec for the Data Wizard UI instead of calling anything.

`mc_create_wizard` takes a source object, an audience, a mapping, a
schedule, an optional recency window, and — on current package versions
— `recordFilters` and `includeAllRecords`. Use those when the tool
schema exposes them. If they are absent, `audience-build` syncs the
fields and puts the segment in Mailchimp rather than pretending the
wizard filtered.

Do not register Mailchimp extras the skills do not use:
`mc_compare`, `mc_event`, `mc_recipients`, `mc_taxonomy`,
`mc_followup`.

### Recommended Dropbox actions

Add these when Dropbox for Agentforce is installed.

- Dropbox: Check Dropbox connection status (`dbx_check`)
- Dropbox: Find Salesforce record by name or email (`dbx_find`)
- Dropbox: Search Dropbox files by name (`dbx_search`) — class
  `dbx__DbAgentSearchFilesByName`. Older packages only expose
  `dbx__DbAgentSearchFiles`; add whichever search action the org has.
- Dropbox: Ensure Dropbox folder for record (`dbx_ensure`)
- Dropbox: List files in a record's Dropbox folder (`dbx_list`)
- Dropbox: Get Dropbox record folder summary (`dbx_summary`)
- Dropbox: Get Dropbox file share link (`dbx_share`) — write; confirm first
- Dropbox: folder share link (`dbx_folderlink`) — write; confirm first

Share and folder-link actions are named "Get" but they **create** sharing
state. Never call them speculatively.

Register only these eight. Skip near-duplicates from the Setup UI
(`SearchFiles` vs `SearchFilesByName`, `GetShareLink` vs
`GetFileShareLink`, `CopyItem` / `CopyRecordItem` / `CopyDryRun`,
`MoveItem` / `MoveRecordItem`, `RenameItem` / `RenameRecordItem`,
`DeleteFile` / `DeleteRecordItem`, `CreateFolder` /
`CreateRecordSubfolder`, `GetStorage` / `GetStorageSummary`,
`ListFiles` / `ListRecordFiles` / `ListRecordFolders`,
`CheckConnection` / `CheckConnectionStatus`). Extra tools cost context
and the truncated Setup-UI names are hard to tell apart.

## 3. External Client App

1. Setup → **External Client App Manager** → New External Client App
   (or open the app the starter script created).
2. Callback URL: `https://claude.ai/api/mcp/auth_callback`
3. OAuth scopes:
   - Access Salesforce Hosted MCP Servers (`mcp_api`)
   - Perform requests at any time (`refresh_token`, `offline_access`)
4. Require PKCE: **On**
5. **Issue JWT-based access tokens for named users: On**
6. If connecting with Client ID only, turn off "Require secret" for the
   Web Server and Refresh Token flows.
7. Copy the **Consumer Key** from the UI. Never commit it.

## 4. Connect Claude

**claude.ai (preferred):** Customize → Connectors → Add custom connector.
Paste the server URL. Put the Consumer Key in Advanced settings as the
OAuth Client ID. Connect, sign in to Salesforce, Allow.

**This plugin in Claude Code:** when prompted, paste the same server URL
as `salesforce_mcp_url` and the External Client App **Consumer Key** as
`salesforce_oauth_client_id`. Then complete the Salesforce OAuth prompt.
Without the Consumer Key, Claude Code tries Dynamic Client Registration
and Salesforce returns `invalid_client`.

Use the claude.ai connector callback. Do not use `--callback-port`.
Claude Code picks a random port and Salesforce returns `redirect_uri_mismatch`.

The External Client App can take up to 30 minutes to become usable.

## 4b. `invalid_client` during registration

If `/mcp` shows `plugin:beaufort12:salesforce` failed with Dynamic Client
Registration rejected (HTTP 401 `invalid_client`):

1. Confirm the plugin has `salesforce_oauth_client_id` set to the
   Consumer Key from the Hosted MCP External Client App (`mcp_api`).
2. Do not use the B12 Mailchimp or Dropbox gateway app keys.
3. Reconnect from `/mcp`, or `/plugin` → configure, then start a new chat.

Do not retry reconnect without the Consumer Key — it will fail the same way.

## 5. Empty tool list — JWT trap

If OAuth says **Connected** and `tools/list` is empty:

1. Do not recreate the MCP server.
2. Do not blame permission sets yet.
3. Open the External Client App → OAuth settings.
4. Turn **Issue JWT-based access tokens for named users** **ON**.
5. Disconnect the connector, reconnect, start a **new** chat.

`api.salesforce.com` is outside the org. An opaque org token cannot be
validated there, so the session resolves to nothing and the tool list
comes back empty with no error. This is the first thing to check.

## 6. Each user

Every person who will use the plugin must:

1. Hold an active license for the packages they will call
2. Hold the permission sets in the table above
3. Be able to see the Salesforce records they ask about (sharing and FLS)
4. Have completed Mailchimp Connect and/or Dropbox Connect
5. Start a new Claude chat after the connector changes

Hosted MCP runs as the signed-in user. If they cannot see a Contact in
Salesforce, they cannot reach it through this plugin.

After you change tools on the server, disconnect and reconnect, then
start a new chat. An old chat will not see new tools.

## 7. Verify the install

After Activate, reconnect, and a **new** chat:

1. Call `mc_check` if a Mailchimp connection tool is present
   (`mc_check` or `mone__McAgentGetConnectionStatus`). Call `dbx_check`
   if a Dropbox connection tool is present.
2. Compare the live tool list to the recommended list for the products
   they installed.
3. Report gaps by alias and Apex label. Distinguish the two kinds:
   - **Load-bearing.** `mc_find_record`, `mc_find_audience`,
     `mc_find_member`, `mc_record_audiences`, `mc_deliverability`,
     `mc_engagement`. Skills stall without these.
   - **Degrade cleanly.** `mc_check` and `mc_record_tags` are absent from
     some servers and package versions. Skills are written to continue
     without them — do not chase them. `audience-build` without
     `mc_suggest`, `mc_merge_field` and `mc_create_wizard` gives a build
     spec instead of creating a wizard, which is a supported outcome.
4. Confirm `mc_find_audience` resolves a real audience name. The `*`
   wildcard listing is documented on the tool but is not implemented in
   every package version — test with a name you know exists, not `*`.
5. Tell them to add the missing Apex actions, reconnect, and start a
   new chat. If the tool list changes inside a live chat, that chat is
   unreliable — start a new one.

If a connection tool is absent, say so and continue the list check.
Do not invent a workaround.

## If a skill cannot see its tools

Tell the user that product is not on this server. Do not invent a
workaround, a second URL, or a call to `mcp.beaufort12.com`.
