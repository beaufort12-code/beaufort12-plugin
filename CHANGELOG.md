# Changelog

## 0.1.1 — 2026-08-28

- Add required `userConfig.salesforce_oauth_client_id` (Consumer Key) and
  pass it as `oauth.clientId` so Claude Code does not attempt Dynamic
  Client Registration against Salesforce Hosted MCP.

## 0.1.0 — 2026-08-27

- Initial public plugin: six marketing-ops skills for Mailchimp and Dropbox.
- Salesforce Hosted MCP via `userConfig.salesforce_mcp_url`.
- SETUP.md covers the JWT named-user token trap and recommended Apex actions.
- Self-hosted marketplace at `.claude-plugin/marketplace.json`.
