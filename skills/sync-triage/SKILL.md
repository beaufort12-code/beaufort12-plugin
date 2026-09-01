---
name: sync-triage
description: >
  Diagnose why a Salesforce contact or lead is not appearing in a Mailchimp
  audience. Use when someone says a contact "isn't syncing", is "missing from
  Mailchimp", a sync "stopped working", or a person "should be on the list"
  but is not. Requires Mailchimp for Salesforce connected on this Hosted MCP
  server. Do not use for Dropbox files, campaign performance, or deliverability.
---

# Sync triage

Find out why a Salesforce person is missing from a Mailchimp audience.
Read first. Write only after the user confirms.

If Mailchimp tools are not on this server, say so and stop. Do not invent
a workaround.

## Tools

Prefer starter aliases when present. Setup-UI servers expose the
namespaced Apex class instead — use that.

| Need | Alias | Apex / label |
| --- | --- | --- |
| Connection | `mc_check` | `mone__McAgentGetConnectionStatus` |
| Person | `mc_find_record` | Mailchimp: Find Salesforce Record |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Live Mailchimp status | `mc_find_member` | Mailchimp: Find Mailchimp Member Live |
| Missing from audience | `mc_find_missing` | Mailchimp: Find Missing Mailchimp Audience Members |
| Sync job | `mc_sync` | Mailchimp: Get Mailchimp Sync Status |
| Audiences on the person | `mc_record_audiences` | Mailchimp: List Mailchimp Audiences for Record |

Never ask the user for a Salesforce Id. Resolve names and emails with
`mc_find_record` / `mc_find_audience`.

## Workflow

1. **Connection.** If `mc_check` or `mone__McAgentGetConnectionStatus`
   is on this server, call it. If Mailchimp is not connected, stop and
   tell the admin to finish Mailchimp Connect. If no connection tool is
   present, skip this step silently and continue — do not mention it to
   the user.
2. **Resolve the person.** Name or email → `mc_find_record`. If several
   records match, list names and emails and ask which one. Do not guess.
3. **Resolve the audience.** If they named a list, `mc_find_audience`
   with the exact name. If they did not, prefer `mc_record_audiences` on
   the person. The `*` wildcard listing is documented but not implemented
   in every package version — if it returns no match, ask the user for
   the audience name rather than concluding no audiences exist.
4. **Live status.** `mc_find_member` with the email. This is Mailchimp
   truth, not the Salesforce sync table.
5. **Salesforce gap.** `mc_find_missing` on that audience if you need to
   confirm they are absent from synced members. It needs a source object
   as well as the audience — pass Contact or Lead to match the record you
   resolved in step 2, not both.
6. **Sync job.** If they said a wizard or batch is running, `mc_sync`
   before you declare them missing.

## What "done" looks like

Give a short diagnosis, then the next action. Typical outcomes:

- **Not connected** — admin must complete Mailchimp Connect.
- **Wrong audience** — they are on a different list. Name it.
- **No email** — the Salesforce email field is blank. Sync cannot run.
- **Not in the wizard / criteria** — they do not match the Data Wizard
  filters, or no wizard covers this population at all. Say which check
  failed if the tool tells you. If no wizard covers this population,
  that is the diagnosis. Hand off to `audience-build`. Do not offer to
  subscribe them one by one as the first option.
- **Unsubscribed or cleaned in Mailchimp** — do not silently resubscribe.
  Explain status and ask before `mc_subscribe`.
- **Sync still running** — wait and poll `mc_sync`. Do not create a
  second wizard.
- **Truly missing, and a wizard already covers them** — offer to run
  that wizard, or subscribe only after they explicitly want just this
  person.

## Rules

- Hide Salesforce and Mailchimp Ids in user-facing replies.
- Present `userMessage` from tools when it is written for a person.
- Mutating tools (`mc_subscribe`) need an explicit yes.
- Do not expose raw SOQL, package namespace chatter, or stack traces.
