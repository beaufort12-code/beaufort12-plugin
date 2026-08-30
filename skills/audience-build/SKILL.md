---
name: audience-build
description: >
  Build a Mailchimp Data Wizard that syncs Salesforce records and fields
  into an audience, and schedule it. Use when someone asks to "build a
  Data Wizard", "sync these contacts into Mailchimp", "get this field
  into Mailchimp", "push a segment to Mailchimp", "map a field to a merge
  field", or "set up a recurring sync". Requires Mailchimp for Salesforce
  connected on this Hosted MCP server. Do not use to diagnose one missing
  person — that is sync-triage.
---

# Audience build

Propose a Data Wizard, confirm every write, create it, then wait for the
sync. Two of the three tools here write — one to Mailchimp, one to
Salesforce.

If Mailchimp tools are not on this server, say so and stop.

## Tools

Prefer starter aliases when present. Setup-UI Hosted MCP servers expose
the namespaced Apex class instead — **use that**. Do not treat a missing
alias as a missing action.

| Need | Alias | Apex class / Setup-UI label |
| --- | --- | --- |
| Connection | `mc_check` | `mone__McAgentGetConnectionStatus` |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Deliverability gate | `mc_deliverability` | Mailchimp: Check Mailchimp Deliverability |
| Field mapping | `mc_suggest` | `mone__McAgentSuggestWizardMappings` / Suggest Mailchimp Wizard Field Mappings |
| Create merge field | `mc_merge_field` | `mone__McAgentCreateAudienceMergeField` / Create Mailchimp Audience Merge Field — write |
| Create wizard | `mc_create_wizard` | `mone__McAgentCreateDataWizard` / Create Mailchimp Data Wizard — write |
| Sync job | `mc_sync` | Mailchimp: Get Mailchimp Sync Status |
| Audience shape | `mc_audience` | Mailchimp: Get Mailchimp Audience Summary |

Never ask for a Salesforce Id. Resolve the audience by name.

The package **can** create a Data Wizard. If none of `mc_create_wizard`,
`mone__McAgentCreateDataWizard`, or "Create Mailchimp Data Wizard" is on
this server, the admin has not registered it. Say that. Tell them to add
those three Apex actions on Setup → MCP Servers, disconnect, reconnect,
and start a new chat. Then give the build spec for the Data Wizard UI
(source object, audience, mapping, schedule). Do not say Data Wizard is
UI-only. Do not invent a privacy or timing reason to refuse the build.

## What this action can and cannot do

`mc_create_wizard` / `mone__McAgentCreateDataWizard` takes a source
object, a target audience, a field mapping, a schedule, optional
`dateFieldApiName` / `lastNDays`, and — when the tool schema includes
them — `recordFilters` and `includeAllRecords`.

If `recordFilters` is on the tool, pass the user's criteria as readable
lines (for example `BillingCountry equals United Kingdom`). Do not
invent SOQL.

If `recordFilters` is **not** on the tool schema, name that boundary in
one sentence and offer the split that still works:

- The **wizard** syncs a population and its fields.
- The **segment** is a Mailchimp segment built on the merge fields the
  wizard syncs.

Never imply the wizard filtered something it did not. A recency ask
("changed in the last 90 days") maps onto `dateFieldApiName` and
`lastNDays`, or onto `includeAllRecords` when they want every match.

Do not pass `sfImportId` unless the user has named an existing Data
Wizard they want reused, and the tool result confirms it. Do not guess.

## Workflow

1. **Connection.** Call `mc_check` if it is on this server. Stop if
   Mailchimp is not connected. If no connection tool is present, say so
   and continue.
2. **Audience.** Resolve with `mc_find_audience` using the exact name.
   If they did not name one, ask. The `*` wildcard listing is documented
   but not implemented in every package version — a no-match there is not
   evidence the audience is missing.
3. **Deliverability gate.** Call `mc_deliverability` before you build
   anything. A bulk import into an audience with recent cleans, hard
   bounces or a complaint spike — especially with a send already
   planned — is how the next spike happens. If the numbers are poor, say
   so plainly, quote the tool's `userMessage`, and ask whether to
   continue. Do not refuse; it is their audience. But do not stay quiet.
4. **Mapping.** Call `mc_suggest` or `mone__McAgentSuggestWizardMappings`
   with the source object and the fields they asked for. Keep
   `mappingsJson` from the result verbatim for the create call — never
   hand-write it.
5. **Field coverage.** Before you map a field, say whether it is likely
   to be populated on that object. `LeadSource` is standard on Lead; on
   Contact it exists but is usually blank outside converted records.
   Mapping an empty column is worse than not mapping it, because it
   looks like it worked. Flag the risk and let them decide. Flag
   `Description` as often containing internal notes, then ask — do not
   refuse the wizard because of it.
6. **Missing merge fields.** If a field they asked for has no merge
   field on the audience, say so and ask. After an explicit yes, call
   `mc_merge_field` or `mone__McAgentCreateAudienceMergeField` — one
   call per field. This writes to Mailchimp.
7. **Read back, then create.** State the wizard title, source object,
   target audience by name, the fields being mapped, the schedule, and
   whether it will run now. Ask for confirmation. After yes, call
   `mc_create_wizard` or `mone__McAgentCreateDataWizard`. This writes a
   record into Salesforce.
8. **Wait.** If it ran now, poll `mc_sync`. Do not report member counts
   or recipients before the batch finishes — say it is still running.

## What "done" looks like

- The wizard title, its source object, and the target audience by name
- Which fields are mapped, and any merge field you created
- The schedule in plain language ("weekly, Monday morning")
- Whether it ran now, and whether the sync has finished
- Where the segment lives, if they asked for one the wizard cannot filter
- Any deliverability caution you raised before the import

## Rules

- Hide Salesforce and Mailchimp Ids.
- `mc_merge_field` / `mone__McAgentCreateAudienceMergeField` and
  `mc_create_wizard` / `mone__McAgentCreateDataWizard` are writes. Get a
  separate yes for each. One "go ahead" does not authorise both.
- Never invent `mappingsJson`. It comes from `mc_suggest`.
- If a wizard already covers this population, say so and ask before
  building a second one. Duplicate wizards double the sync load.
- Do not subscribe people directly to reach the same outcome faster.
  That bypasses the wizard the user asked for.
- This skill does not send campaigns. Building the audience is not
  sending to it.
