# Changelog

## 0.3.2 — 2026-08-31

- `audience-build`: never include `WITH USER_MODE` on Data Wizard SOQL.
  The package appends it and a duplicate clause fails.

## 0.3.1 — 2026-08-31

- README examples: account brief first, then pre-send, then Data Wizard.
  Spell out that the audience must already exist — do not "create an
  audience".
- `audience-build` uses the namespaced Apex classes when Setup-UI Hosted
  MCP has no starter aliases. A missing `mc_create_wizard` alias is not
  a missing action.
- Do not claim Data Wizard is UI-only. If the three wizard actions are
  unregistered, say so and tell the admin to add them.
- Use `recordFilters` / `includeAllRecords` when the create-wizard tool
  schema exposes them.

## 0.3.0 — 2026-08-31

- Add the `audience-build` skill: propose a Data Wizard, create missing
  merge fields, create and schedule the wizard, then poll the sync. Both
  writes are separately gated.
- Recommend `mc_suggest`, `mc_merge_field`, and `mc_create_wizard` in
  SETUP.md. They were previously on the do-not-register list, which left
  the plugin unable to build the wizard `sync-triage` diagnoses the need
  for.
- `audience-build` runs `mc_deliverability` before a bulk import and
  warns when the audience has recent cleans or bounces, and flags fields
  that are standard on Lead but usually blank on Contact.
- State plainly that `mc_create_wizard` has no filter parameter: the
  wizard syncs a population, the segment is built in Mailchimp on the
  merge fields it syncs.
- `sync-triage` hands off to `audience-build` when no wizard covers the
  population, instead of subscribing people one at a time.
- Stop relying on the `mc_find_audience` `*` wildcard in `sync-triage`,
  `pre-send-check`, and `audience-build`. The tool documents it, but
  `mone__McAgentFindAudienceByName` treats it as a literal name, so the
  "list every audience" fallback silently returned no match.
- `cold-audience-reengagement` now states that `mc_tags` takes one
  `recordId` per input. It confirms the member count before tagging and
  reports how many it actually tagged, instead of implying a whole
  segment was done in one call.
- Stop listing `mc_check` and `mc_record_tags` as required in the verify
  step. Neither is exposed on every server; the skills already continue
  without them. Verify now separates load-bearing tools from ones that
  degrade cleanly.
- `sync-triage` notes that `mc_find_missing` needs a source object as
  well as an audience.

## 0.2.0 — 2026-08-28

- Recommend `mc_record_audiences`, `mc_growth`, and `mc_record_tags` in
  SETUP.md so skills and the Hosted MCP server list the same tools.
- Make `sync-triage` and `pre-send-check` continue when `mc_check` is
  not on the server. Keep the write-gate on `mc_subscribe` only.
- Add a verify-the-install step and tell admins not to register unused
  Mailchimp extras or Dropbox near-duplicates.
- Add `scripts/check-tool-alignment.mjs` so skill aliases cannot drift
  from the SETUP.md recommended list.

## 0.1.1 — 2026-08-28

- Add required `userConfig.salesforce_oauth_client_id` (Consumer Key) and
  pass it as `oauth.clientId` so Claude Code does not attempt Dynamic
  Client Registration against Salesforce Hosted MCP.

## 0.1.0 — 2026-08-27

- Initial public plugin: six marketing-ops skills for Mailchimp and Dropbox.
- Salesforce Hosted MCP via `userConfig.salesforce_mcp_url`.
- SETUP.md covers the JWT named-user token trap and recommended Apex actions.
- Self-hosted marketplace at `.claude-plugin/marketplace.json`.
