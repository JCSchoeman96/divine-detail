# Divine Detail Site

SvelteKit 2 site configured for Cloudflare Pages/Workers with Bun.

## Local development

```sh
bun install
bun run dev
```

## Production build

```sh
bun run build
bun run preview
```

## Environment configuration

- Local development: copy `.dev.vars.example` to `.dev.vars` and fill in real values.
- Cloudflare Pages with Wrangler-managed config:
  - Keep non-sensitive values in `wrangler.toml` `[vars]`.
  - Set secrets through Cloudflare encrypted secrets.

### Required SendPulse secrets

Use one of these naming pairs:

- Preferred:
  - `SENDPULSE_ID`
  - `SENDPULSE_SECRET`
- Also supported:
  - `SENDPULSE_CLIENT_ID`
  - `SENDPULSE_CLIENT_SECRET`

Set secrets with Wrangler:

```sh
bunx wrangler secret put SENDPULSE_ID
bunx wrangler secret put SENDPULSE_SECRET
```
