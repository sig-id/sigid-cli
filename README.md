# sigid-cli

Public sources of the published SigID client packages below, licensed under MIT.

| Package | Version | Registry |
|---|---|---|
| `@sigid/cli` | `0.5.0` | [Published package](https://www.npmjs.com/package/@sigid/cli/v/0.5.0) |

[SigID](https://www.sigid.org) · [Documentation](https://docs.sigid.org) · [Issues](https://github.com/sig-id/sigid-cli/issues)

This repository is a registry release snapshot. `SOURCE_PROVENANCE.json` records
archive integrity, original file hashes, source-map recovery and metadata edits.
Implementation bytes come exclusively from the published archives. Changes to
repository links and this introduction do not change the package version.

Install with `npm install -g @sigid/cli`. Run launcher tests with
`node --test scripts/*.test.js`.

This is the JavaScript launcher only. Native binaries are downloaded through the
published optional platform packages. Their Rust implementation and build
workspace are not included. Local launcher execution requires an installed
platform package; tests do not require installing or running the binary.

---

## Published package README

# @sigid/cli

npm distribution of the **sigid** native binary (agent identity, workspace
bootstrap, keys, challenge-response auth, self-introduction links, x402).

```bash
npx @sigid/cli --help
npx @sigid/cli setup --name my-agent --redirect-uri http://localhost:3000/
npx @sigid/cli invite-link

# or install globally / as a devDependency
npm install -g @sigid/cli
sigid --version
```

## Platforms

Prebuilt binaries ship as optional platform packages:

| Package | OS | Arch |
|---------|----|------|
| `@sigid/cli-linux-x64` | Linux | x64 |
| `@sigid/cli-linux-arm64` | Linux | arm64 |
| `@sigid/cli-darwin-x64` | macOS | x64 |
| `@sigid/cli-darwin-arm64` | macOS | arm64 |

The Linux packages contain statically linked musl binaries, so they do not
require a particular glibc version on the host.

Windows is not published yet; use source install on unsupported platforms:

```bash
cargo install --path crates/sigid-cli
```

## How it works

`@sigid/cli` is a thin Node wrapper. On install, npm selects the matching
`optionalDependencies` package for your OS/CPU. The `sigid` bin spawns that
native binary with your arguments.

## Join a human's organization with a self-introduction link

When you want to participate in a SigID organization a human already owns,
introduce yourself: emit a link that carries your agent id and hand it to
the human. They open it, pick their organization and your role, and grant
membership directly on the Dashboard – the link is an identifier carrier,
never a credential, so forwarding it grants nothing.

```bash
npx @sigid/cli invite-link
# → https://dashboard.sigid.org/invite-agent?agent=<your-uuid>
# agents that already have the CLI installed:
sigid invite-link
```

`invite-link`:

- resolves the correct dashboard origin from the platform (workspace
  bootstrap metadata); `--dashboard-origin` overrides it when needed;
- prints the link to hand to the human – emitting it creates no
  platform-side state.

If you do not have an identity yet, register first
(`npx @sigid/cli init --name <your-name>`; registration is PoW-guided).
After the human grants, run `sigid whoami --remote` (or
`GET /agentinfo/organizations`) to confirm the membership – the bare
`sigid whoami` reads only the local cache and cannot see the new grant. See
[Joining an organization](https://docs.sigid.org/developers/joining-an-organization/)
for the full flow, key custody, and the sandbox-vs-production capability
boundaries.

## Key custody

The CLI stores private keys in `keys.enc` inside its config directory,
encrypted with a passphrase you choose (Argon2id + AES-256-GCM-SIV):

| Platform | Config directory |
|---|---|
| Linux | `~/.config/sigid/` |
| macOS | `~/Library/Application Support/sigid/` |

`XDG_CONFIG_HOME` overrides this on both platforms. Cached tokens live
beside the keystore in `tokens.enc` / `tokens.key`; the non-secret agent
manifest `agent.json` records the issuer, agent id, key label/fingerprint,
and joined organizations. The keystore can be relocated with the global
`--keystore` flag.

## Identity recovery semantics

There are no recovery codes for agent identities. SigID re-derives who you
are from exactly two inputs: your private key and the issuer URL – keystore,
challenge-response, token, claims. Caches are accelerators only.

**Losing the passphrase (or `keys.enc`) means losing the identity.** An
ownerless agent cannot be recovered; a replacement identity must be created
and re-invited. Owner-backed agents can be re-keyed by their owner through
the owner-scoped key surface. Keep the passphrase out of shell history:
prefer the interactive prompt, `--passphrase-stdin`, `--passphrase-file`, or
`SIGID_PASSPHRASE` in controlled environments.

## Docs

- [CLI reference](https://docs.sigid.org/developers/cli/)
- [Joining an organization](https://docs.sigid.org/developers/joining-an-organization/)
- Agent workspace bootstrap (ADR 0010): `sigid setup`
- Agent invitation ceremony (ADR 0024): `sigid join`
