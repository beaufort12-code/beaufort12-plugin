# Changelog

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
