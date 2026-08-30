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

| Need | Alias | Apex / label |
| --- | --- | --- |
| Connection | `mc_check` | `mone__McAgentGetConnectionStatus` |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Deliverability gate | `mc_deliverability` | Mailchimp: Check Mailchimp Deliverability |
| Field mapping | `mc_suggest` | Mailchimp: Suggest Mailchimp Field Mappings |
| Create merge field | `mc_merge_field` | Mailchimp: Create Mailchimp Merge Field — write |
| Create wizard | `mc_create_wizard` | Mailchimp: Create Mailchimp Data Wizard — write |
| Sync job | `mc_sync` | Mailchimp: Get Mailchimp Sync Status |
| Audience shape | `mc_audience` | Mailchimp: Get Mailchimp Audience Summary |

Never ask for a Salesforce Id. Resolve the audience by name.

If `mc_create_wizard` is not on this server, do not improvise. Say the
action is not registered, then give the build spec the admin needs for
the Data Wizard UI: source object, target audience, field mapping,
schedule. That is a useful answer. A fabricated one is not.

## What this action can and cannot do

`mc_create_wizard` takes a source object, a target audience, a field
mapping, a schedule, and an optional `dateFieldApiName` with `lastNDays`.

**It has no filter or criteria parameter.** "EMEA enterprise Contacts"
cannot be expressed through this action, and no rephrasing changes that.

That is a boundary, not a failure. Name it in one sentence and offer the
split that does work:

- The **wizard** syncs a population and its fields.
- The **segment** is a Mailchimp segment built on the merge fields the
  wizard syncs.

So when someone asks for a filtered set, make sure the fields that carry
their filter — region, country, account type, tier — reach Mailchimp as
merge fields. Then tell them the segment lives on those merge fields, and
offer to describe it. Never imply the wizard filtered something it did
not.

A recency ask ("changed in the last 90 days", "new since June") is
different — that maps onto `dateFieldApiName` and `lastNDays`, and the
action does support it.

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
4. **Mapping.** `mc_suggest` with the source object and the fields they
   asked for. Keep `mappingsJson` from the result verbatim for the
   create call — never hand-write it.
5. **Field coverage.** Before you map a field, say whether it is likely
   to be populated on that object. `LeadSource` is standard on Lead; on
   Contact it exists but is usually blank outside converted records.
   Mapping an empty column is worse than not mapping it, because it
   looks like it worked. Flag the risk and let them decide.
6. **Missing merge fields.** If a field they asked for has no merge
   field on the audience, say so and ask. After an explicit yes, call
   `mc_merge_field` — one call per field. This writes to Mailchimp.
7. **Read back, then create.** State the wizard title, source object,
   target audience by name, the fields being mapped, the schedule, and
   whether it will run now. Ask for confirmation. After yes, call
   `mc_create_wizard`. This writes a record into Salesforce.
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
- `mc_merge_field` and `mc_create_wizard` are writes. Get a separate yes
  for each. One "go ahead" does not authorise both.
- Never invent `mappingsJson`. It comes from `mc_suggest`.
- If a wizard already covers this population, say so and ask before
  building a second one. Duplicate wizards double the sync load.
- Do not subscribe people directly to reach the same outcome faster.
  That bypasses the wizard the user asked for.
- This skill does not send campaigns. Building the audience is not
  sending to it.
