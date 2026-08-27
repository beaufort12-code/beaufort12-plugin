---
name: account-brief
description: >
  Combined view of recent Mailchimp campaign engagement and Dropbox files
  on a Salesforce Account. Use when someone asks for an "account brief",
  "what do we know about this account", "engagement plus files", "campaign
  activity and documents", or a prep pack before a call. Works when one or
  both products are on this Hosted MCP server. Skip the side that has no
  tools; do not invent it.
---

# Account brief

One briefing: who the account is, how they engage with Mailchimp, and
which Dropbox files sit on the record. This is the launch demo skill.

If neither Mailchimp nor Dropbox tools are on this server, say so and
stop. If only one product is present, brief that side and say the other
package is not on this server.

## Tools

### Mailchimp (skip the section if these are absent)

| Need | Alias | Apex / label |
| --- | --- | --- |
| Person / account resolve | `mc_find_record` | Mailchimp: Find Salesforce Record |
| Audiences | `mc_record_audiences` | Mailchimp: List Mailchimp Audiences for Record |
| Engagement | `mc_engagement` | Mailchimp: Get Mailchimp Record Engagement Summary |
| Activity | `mc_activity` | Mailchimp: Get Mailchimp Record Email Activity |
| Campaigns | `mc_campaigns` / `mc_campaign` | List / Get Mailchimp Campaign Summary |

### Dropbox (skip the section if these are absent)

| Need | Alias | Apex / label |
| --- | --- | --- |
| Record | `dbx_find` | Dropbox: Find Salesforce record by name or email |
| Summary | `dbx_summary` | Dropbox: Get Dropbox record folder summary |
| Files | `dbx_list` | Dropbox: List files in a record's Dropbox folder |
| Search | `dbx_search` | `dbx__DbAgentSearchFilesByName` |
| Ensure folder | `dbx_ensure` | Dropbox: Ensure Dropbox folder for record |

Never ask for a Salesforce Id. Resolve "Acme" or "Disney" with the find
tools.

## Workflow

1. **Resolve the account.** Prefer `dbx_find` when Dropbox is present
   (it resolves Account, Contact, Lead, Opportunity). Use
   `mc_find_record` for a named person on the account. If both exist
   and they disagree, say so and use the record the user confirms.
2. **Mailchimp half.** For the account's people you can resolve:
   `mc_record_audiences`, `mc_engagement`, `mc_activity`. If they asked
   about a recent campaign, `mc_campaigns` then `mc_campaign`.
   Summarise opens, clicks, last send, and audience membership. Do not
   dump Ids.
3. **Dropbox half.** `dbx_ensure` only if you need a folder to exist.
   Otherwise `dbx_summary` and `dbx_list`. Mention file count, freshness,
   and a few document names. Search if they named a file type
   (contract, proposal, MSA).
4. **Do not share links** unless they asked. Sharing mutates Dropbox
   state — hand off to `deal-document-pack` or confirm first.

## What "done" looks like

A short brief a seller can read in thirty seconds:

- Account name
- Mailchimp: last engagement, audiences, anything stale or opted out
- Dropbox: folder present or missing, file count, notable documents
- Gaps: "Mailchimp is not on this server" or "no Dropbox folder yet"

## Rules

- Hide Salesforce Ids and raw Dropbox paths.
- One product missing is not a failure. Brief what you have.
- No subscribe, unsubscribe, or share-link calls in this skill unless
  the user clearly asked after seeing the brief.
- Prefer `userMessage` from tools. Do not re-format into a table of Ids.
