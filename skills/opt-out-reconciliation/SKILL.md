---
name: opt-out-reconciliation
description: >
  Find and explain divergence between Salesforce opt-out state and Mailchimp
  subscription status. Use when someone is "opted out in Salesforce but still
  subscribed", "unsubscribed in Mailchimp but still getting mail from us",
  "HasOptedOutOfEmail doesn't match", or wants to "reconcile unsubscribes".
  Requires Mailchimp for Salesforce connected on this Hosted MCP server.
---

# Opt-out reconciliation

Compare Salesforce marketing preference with live Mailchimp status.
Unsubscribe only after the user confirms.

If Mailchimp tools are not on this server, say so and stop.

## Tools

| Need | Alias | Apex / label |
| --- | --- | --- |
| Person | `mc_find_record` | Mailchimp: Find Salesforce Record |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Live status | `mc_find_member` | Mailchimp: Find Mailchimp Member Live |
| Missing members | `mc_find_missing` | Mailchimp: Find Missing Mailchimp Audience Members |
| Audiences on the person | `mc_record_audiences` | Mailchimp: List Mailchimp Audiences for Record |
| Unsubscribe | `mc_unsubscribe` | Mailchimp: Unsubscribe Mailchimp Subscriber |
| Subscribe | `mc_subscribe` | Mailchimp: Subscribe Mailchimp Subscriber |

Never ask for a Salesforce Id.

## Workflow

1. **Resolve the person.** Name or email → `mc_find_record`.
2. **Live Mailchimp.** `mc_find_member` with the email. This is current
   Mailchimp status across audiences the tool can see.
3. **Salesforce side.** Use what `mc_find_record` and
   `mc_record_audiences` return. Do not invent a `HasOptedOutOfEmail`
   value if no tool returned it. If the user told you the Salesforce
   checkbox state, treat that as their statement and verify Mailchimp.
4. **Name the divergence** in one sentence, for example:
   - Salesforce opted out, Mailchimp still subscribed
   - Mailchimp unsubscribed or cleaned, Salesforce still shows opted in
   - Not on the audience at all
5. **Fix only with confirmation.**
   - To honour a Salesforce opt-out: `mc_unsubscribe` on each named
     audience after they say yes.
   - To resubscribe: only if they have a lawful, explicit request.
     Confirm, then `mc_subscribe`. Do not "helpfully" resubscribe a
     cleaned or complained address.

## What "done" looks like

A two-column explanation (Salesforce vs Mailchimp) plus the action you
took or the action you are waiting to confirm. If you unsubscribed,
say which audience and that Mailchimp is now unsubscribed.

## Rules

- Hide Ids.
- `mc_unsubscribe` and `mc_subscribe` are writes. Confirm first.
- Never unsubscribe a whole audience to fix one person.
- If the find-member tool says cleaned or pending, explain that status
  instead of forcing subscribe.
