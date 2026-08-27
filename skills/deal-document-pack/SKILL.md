---
name: deal-document-pack
description: >
  Assemble and verify the Dropbox document set for an Opportunity. Use when
  someone asks for "the files on this deal", "Opportunity folder", "proposal
  pack", "share the deal documents", or to create the folder if it is
  missing. Requires Dropbox for Salesforce connected on this Hosted MCP
  server. Do not use for Mailchimp sync or campaign questions.
---

# Deal document pack

Resolve the Opportunity, ensure its Dropbox folder, list what is there,
and share a link only after the user confirms.

If Dropbox tools are not on this server, say so and stop.

## Tools

| Need | Alias | Apex / label |
| --- | --- | --- |
| Connection | `dbx_check` | Dropbox: Check Dropbox connection status |
| Record | `dbx_find` | Dropbox: Find Salesforce record by name or email |
| Ensure folder | `dbx_ensure` | Dropbox: Ensure Dropbox folder for record |
| List files | `dbx_list` | Dropbox: List files in a record's Dropbox folder |
| Folder summary | `dbx_summary` | Dropbox: Get Dropbox record folder summary |
| Search by name | `dbx_search` | `dbx__DbAgentSearchFilesByName` |
| File share link | `dbx_share` | Dropbox: Get Dropbox file share link |
| Folder share link | `dbx_folderlink` | folder share / Get Folder Link |

`dbx_share` and `dbx_folderlink` are named "Get" but they **create**
sharing state. Confirm before calling. Do not call them to "see if a
link exists".

Never ask for a Salesforce Id. A Dropbox path is not a record Id.

## Workflow

1. **Connection.** `dbx_check`. Stop if Dropbox is not connected for
   this user.
2. **Resolve the deal.** Opportunity name → `dbx_find`. If several
   match, list names and ask. Do not guess.
3. **Folder.** `dbx_ensure` so a mapping exists. Then `dbx_summary` and
   `dbx_list`.
4. **Named files.** If they asked for a proposal, SOW, or invoice,
   `dbx_search` scoped to that record after `dbx_find`.
5. **Share.** Only after they say they want a link:
   - one file → `dbx_share`
   - the whole folder → `dbx_folderlink`
   Tell them the link is newly created if the tool created it.

## What "done" looks like

- Opportunity name (not Id)
- Whether a folder already existed or was created
- File count and a short list of names
- The share URL if they asked for one, plus who can open it if the
  tool said

If the folder is empty, say so. Offer to wait for an upload. Do not
fabricate documents.

## Rules

- Hide Salesforce Ids and raw Dropbox paths.
- Prefer `userMessage` from the tools.
- If `dbx_search` is missing but `DbAgentSearchFiles` (no "ByName")
  appears, still use the search tool that is present — production
  orgs expose `DbAgentSearchFilesByName`.
- If ensure/list tools are missing, the Dropbox Agentforce actions
  are not on this server. Stop.
