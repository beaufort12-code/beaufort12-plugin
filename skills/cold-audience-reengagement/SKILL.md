---
name: cold-audience-reengagement
description: >
  Build and tag a re-engagement segment from stale or low-engagement
  Mailchimp members. Use when someone asks to "re-engage", find "cold
  subscribers", "haven't opened in months", "at-risk members", or wants a
  win-back or sunset segment. Requires Mailchimp for Salesforce connected
  on this Hosted MCP server. Do not use for a single missing contact.
---

# Cold audience re-engagement

Find stale or at-risk members, explain the segment, then tag only after
confirmation.

If Mailchimp tools are not on this server, say so and stop.

## Tools

| Need | Alias | Apex / label |
| --- | --- | --- |
| Audience | `mc_find_audience` | Mailchimp: Find Mailchimp Audience |
| Stale / at-risk | `mc_find_stale` | Mailchimp: Find Stale Or At-Risk Mailchimp Members |
| Engagement | `mc_engagement` | Mailchimp: Get Mailchimp Record Engagement Summary |
| Activity | `mc_activity` | Mailchimp: Get Mailchimp Record Email Activity |
| Tags on a person | `mc_record_tags` | Mailchimp: Get Mailchimp Record Tags — may not be registered; skip the check if absent |
| Apply tags | `mc_tags` | Mailchimp: Manage Mailchimp Tags |
| Person | `mc_find_record` | Mailchimp: Find Salesforce Record |

Never ask for a Salesforce Id.

## Workflow

1. **Audience.** Resolve with `mc_find_audience`.
2. **Stale set.** `mc_find_stale`. Summarise how many, what "stale"
   meant, and a few named examples. Do not paste every member.
3. **Spot-check.** For one or two people the user cares about,
   `mc_find_record` then `mc_engagement` / `mc_activity` so the segment
   is believable.
4. **Propose the tag.** Suggest a single clear tag such as
   `reengage-2026-q3`. Ask before creating or applying it.
5. **Tag.** `mc_tags` takes one `recordId` per input — it tags a
   person, not a segment. Before you start, say how many people that
   means and get a yes for that number. Then tag them, batching inputs
   in one call where the tool accepts an array. If the set is large,
   propose a cap (say the fifty least engaged) rather than silently
   tagging a few and implying you did them all. Report how many you
   actually tagged. Do not also unsubscribe or delete anyone unless they
   explicitly asked for a sunset.

## What "done" looks like

- Count of stale or at-risk members
- What signal defined them
- The tag you applied, or the tag you are waiting to confirm
- A suggested next step (a Mailchimp segment on that tag, or a human
  review of the noisiest examples)

This skill does not send the win-back campaign. It prepares the segment.

## Rules

- Hide Ids.
- `mc_tags` is a write. Confirm first.
- Do not subscribe extra people into the audience to "grow" a
  re-engagement list.
- If `mc_find_stale` is missing, say the stale-member action is not on
  this server. Do not approximate with a homegrown SOQL story.
