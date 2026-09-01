# Beaufort 12 — Marketing Ops for Salesforce

A [Claude](https://claude.com) plugin for Mailchimp and Dropbox work on
your Salesforce records. Skills decide the workflow. Your org's
[Salesforce Hosted MCP](https://help.salesforce.com) server supplies the
tools. Beaufort 12 is not in the data path.

![Beaufort 12 — Mailchimp and Dropbox workflows from Claude](docs/overview.jpg)

## What you get

| Skill                        | When to use it                                     |
| ---------------------------- | -------------------------------------------------- |
| `setup`                      | First install, missing tools, or an empty tool list |
| `sync-triage`                | A contact or lead is not appearing in Mailchimp    |
| `pre-send-check`             | Deliverability and audience health before a send   |
| `opt-out-reconciliation`     | Salesforce opt-out and Mailchimp status disagree   |
| `cold-audience-reengagement` | Build a re-engagement segment from stale members   |
| `deal-document-pack`         | Assemble the Dropbox files for an Opportunity      |
| `account-brief`              | Campaign engagement plus files on an Account       |
| `audience-build`             | Build and schedule a Data Wizard into an audience  |

Install only the Apex actions you own on **one** Hosted MCP server. A
Mailchimp-only org never registers Dropbox tools.

## Try this

After [SETUP.md](SETUP.md), in a **new** chat. Skills trigger on plain
sentences — no slash command needed.

**Account brief** — engagement plus files, one answer:

```text
Give me a brief on <Account> before my call this afternoon. Include <person's email> — campaign engagement and the files on their record.
```

**Pre-send check** — a go / caution / stop verdict:

```text
We're sending a webinar invite on Thursday to <Audience name>. Is it safe to send?
```

**Sync triage** — why someone is missing from a list:

```text
<Name or email> should be getting this invite but they're not in <Audience name>. Why not?
```

**Audience build** — a filtered, scheduled Data Wizard from one sentence:

```text
Build a Data Wizard that syncs Contacts into <Audience name> where the email ends in <domain> and the Title is <title>. I want <field> to come across too. Run it now, then weekly on Mondays.
```

**Cold-audience re-engagement** — find and tag stale members:

```text
Who on <Audience name> hasn't opened anything in six months? I want a win-back segment.
```

**Opt-out reconciliation** — when the two systems disagree:

```text
<Name> is opted out in Salesforce but still shows subscribed in Mailchimp. Reconcile them.
```

**Deal document pack** — the Dropbox files on a deal:

```text
What's in Dropbox for the <Opportunity name> opportunity? Find the proposal.
```

Notes on the wizard prompt:

- The audience must already exist in Mailchimp and have synced. Do not
  ask Claude to "create an audience" — the package creates a Data
  Wizard, not a Mailchimp audience.
- Filters AND together. "Email ends in acme.com and Title is VP of
  Marketing" is both conditions, not either.
- Every write (merge field, wizard, tags, unsubscribe) waits for its
  own explicit yes.
- Resolve people by email when names are ambiguous — "Alex Taylor" may
  match several records, and Claude will stop to ask.

The wizard prompt needs three Apex actions on the Hosted MCP server.
In Setup → MCP Servers → Add Tools → **Apex actions**, add the
namespaced classes:

- Suggest Mailchimp Wizard Field Mappings (`mone__McAgentSuggestWizardMappings`)
- Create Mailchimp Audience Merge Field (`mone__McAgentCreateAudienceMergeField`)
- Create Mailchimp Data Wizard (`mone__McAgentCreateDataWizard`)

Then disconnect, reconnect, and start a new chat. An old chat will not
see the new tools. If those three are missing, Claude cannot create the
wizard — it is not a UI-only feature.

## Install from this marketplace

### Claude Desktop

1. Open **Claude Desktop** → **Customize** in the sidebar → **Plugins**
   → **Browse**.
2. Select the **Personal** tab, then **Add marketplace**.
3. In **URL**, enter `beaufort12-code/beaufort12-plugin` and select
   **Use "beaufort12-code/beaufort12-plugin"** if offered.
4. Leave **Sync automatically** on, then select **Sync**.
5. Find **Beaufort 12 — Marketing Ops for Salesforce** and select
   **Install**. Wait until the button changes to **Manage**.
6. When prompted, paste the Salesforce Hosted MCP URL and the External
   Client App **Consumer Key**, then complete the Salesforce login.
7. Start a **new** chat. Existing chats will not see the skills or
   tools.

To pick up a newer version later: in **Browse → Personal**, select the
**beaufort12-plugin** marketplace entry (not a plugin row), **⋯ →
Remove**, then repeat the steps above. Removing the marketplace also
uninstalls its plugin.

### Claude Code

```text
/plugin marketplace add beaufort12-code/beaufort12-plugin
/plugin install beaufort12@beaufort12
```

Then paste, when prompted:

- Salesforce Hosted MCP URL (`salesforce_mcp_url`)
- External Client App **Consumer Key** (`salesforce_oauth_client_id`)

Read [SETUP.md](SETUP.md) before you connect. The JWT named-user token
setting is easy to miss and produces a silent empty tool list. Without
the Consumer Key, Claude Code tries Dynamic Client Registration and
Salesforce returns `invalid_client`.

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
