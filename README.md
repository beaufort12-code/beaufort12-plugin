# Beaufort 12 — Marketing Ops for Salesforce

A [Claude](https://claude.com) plugin for Mailchimp and Dropbox work on
your Salesforce records. Skills decide the workflow. Your org's
[Salesforce Hosted MCP](https://help.salesforce.com) server supplies the
tools. Beaufort 12 is not in the data path.

## What you get

| Skill | When to use it |
| --- | --- |
| `sync-triage` | A contact or lead is not appearing in Mailchimp |
| `pre-send-check` | Deliverability and audience health before a send |
| `opt-out-reconciliation` | Salesforce opt-out and Mailchimp status disagree |
| `cold-audience-reengagement` | Build a re-engagement segment from stale members |
| `deal-document-pack` | Assemble the Dropbox files for an Opportunity |
| `account-brief` | Campaign engagement plus files on an Account |

Install only the Apex actions you own on **one** Hosted MCP server. A
Mailchimp-only org never registers Dropbox tools.

## Install from this marketplace

In Claude Code:

```text
/plugin marketplace add beaufort12-code/beaufort12-plugin
/plugin install beaufort12@beaufort12
```

Then paste your Salesforce Hosted MCP URL when prompted. Read
[SETUP.md](SETUP.md) before you connect — the JWT named-user token
setting is easy to miss and produces a silent empty tool list.

## Prerequisites

- At least one Beaufort 12 pair installed:
  - Mailchimp: Email Made Easy (Mailchimp) + Mailchimp for Agentforce
  - Dropbox: Dropbox for Salesforce + Dropbox for Agentforce
- Salesforce Hosted MCP enabled in the org
- An External Client App with `mcp_api` and **Issue JWT-based access
  tokens for named users** turned **on**

## Validate locally

```bash
claude plugin validate . --strict
```

## Directory submission

Submit the public GitHub URL via one of:

- [claude.ai plugin submit](https://claude.ai/admin-settings/directory/submissions/plugins/new)
- [Claude Console](https://platform.claude.com/plugins/submit)

After listing, pushes to this repo are picked up automatically.

## License

Apache-2.0. See [LICENSE](LICENSE).
