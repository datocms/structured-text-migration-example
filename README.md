<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# Structured Text Example Migration

This repo contains the code for the [Migrating content to Structured Text](https://www.datocms.com/docs/structured-text/migrating-content-to-structured-text) tutorial.

## Get started

Install the `@datocms/cli` to manage migrations

```
npm install -g @datocms/cli
```

The `datocms.config.json` file can be customized according to your preferences. Read more about the [CLI configuration here](https://www.datocms.com/docs/scripting-migrations/installing-the-cli)

## How to test the example project

Clone the example DatoCMS project into your account using the button below:

[![Clone DatoCMS project](https://dashboard.datocms.com/clone/button.svg?)](https://dashboard.datocms.com/clone?projectId=42030&name=Demo%3A+Migrating+to+Structured+Text)

Copy the read-write token from Settings > API tokens inside the `.env` file.

Then inside the project root folder, run the following commands:

```
npm install
datocms migrate:run --destination=with-structured-text
```

## Create a new migration

To create a new migration use this command. The DatoCMS cli will generate a new migration, based on the settings specified in the `datocms.config.json` file

```
datocms migrate:new <nameOfMigrationScript>
```

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
