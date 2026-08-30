---
name: pre-send-check
description: >
  Check Mailchimp deliverability and audience health before a campaign goes
  out. Use when someone asks if it is "safe to send", wants a "pre-send
  check", "deliverability review", bounce or spam risk, or "audience health"
  before a campaign. Requires Mailchimp for Salesforce connected on this
  Hosted MCP server. Do not use for sync failures or Dropbox files.
---

# Pre-send check

Decide whether this audience is healthy enough to send. Read-only unless
the user asks you to change membership.

If Mailchimp tools are not on this server, say so and stop.

## Tools

| Need | Alias | Apex / label |
| --- | --- | --- |
| Connection | `mc_check` | `mone__McAgentGetConnectionStatus` |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Deliverability | `mc_deliverability` | Mailchimp: Check Mailchimp Deliverability |
| Bounce / unsub risk | `mc_find_risks` | Mailchimp: Find Bounce And Unsubscribe Risks |
| Audience headline | `mc_audience` | Mailchimp: Get Mailchimp Audience Summary |
| Growth | `mc_growth` | Mailchimp: Get Mailchimp Audience Growth Trends |
| Recent campaigns | `mc_campaigns` | Mailchimp: List Recent Mailchimp Campaigns |
| Campaign detail | `mc_campaign` | Mailchimp: Get Mailchimp Campaign Summary |

Never ask for a Salesforce Id. Resolve the audience by name.

## Workflow

1. **Connection.** If `mc_check` or `mone__McAgentGetConnectionStatus`
   is on this server, call it and stop if disconnected. If no
   connection tool is present, say so and continue.
2. **Audience.** Resolve with `mc_find_audience` using the exact name.
   If they did not name one, ask. Do not rely on the `*` wildcard listing
   — it is documented but not implemented in every package version, and a
   no-match result there does not mean the org has no audiences.
3. **Deliverability.** `mc_deliverability` first. This is the headline:
   bounces, spam complaints, unsubscribes, sending-domain authentication,
   and Mailchimp's own advice.
4. **Risk members.** `mc_find_risks` for recent bounce or unsubscribe
   signals. Do not dump a raw list — summarise counts and name a few
   examples.
5. **Audience shape.** `mc_audience` for subscribed vs unsubscribed and
   tag mix, then `mc_growth` for recent subscribe / unsubscribe trend.
   Flag a tiny or suddenly shrunken list.
6. **Last send.** `mc_campaigns` then `mc_campaign` on the most recent
   relevant send if they asked "how did the last one do".

## What "done" looks like

A go / caution / stop recommendation in plain language:

- **Go** — authentication looks fine, bounce and complaint rates are
  ordinary, no sudden list collapse.
- **Caution** — name the specific risk (domain auth, one mailbox domain,
  a spike in unsubscribes). Suggest what to fix before sending.
- **Stop** — hard bounces, missing authentication, or Mailchimp advice
  that says do not send. Quote the tool's `userMessage`.

Do not subscribe, unsubscribe, or tag anyone during a pre-send check
unless the user explicitly asks after seeing the report.

## Rules

- Hide Salesforce and Mailchimp Ids.
- Prefer `userMessage` from the deliverability tool.
- This skill does not send campaigns. Salesforce Hosted MCP cannot
  schedule a Mailchimp send from these actions.
