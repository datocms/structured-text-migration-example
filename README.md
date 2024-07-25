<!--datocms-autoinclude-header start--><a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

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
-----------------
# What is DatoCMS?
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agency partners, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Quick links:**

- ⚡️ Get started with a [free DatoCMS account](https://dashboard.datocms.com/signup)
- 🔖 Go through the [docs](https://www.datocms.com/docs)
- ⚙️ Get [support from us and the community](https://community.datocms.com/)
- 🆕 Stay up to date on new features and fixes on the [changelog](https://www.datocms.com/product-updates)

**Our featured repos:**
- [datocms/react-datocms](https://github.com/datocms/react-datocms): React helper components for images, Structured Text rendering, and more
- [datocms/js-rest-api-clients](https://github.com/datocms/js-rest-api-clients): Node and browser JavaScript clients for updating and administering your content. For frontend fetches, we recommend using our [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) instead.
- [datocms/cli](https://github.com/datocms/cli): Command-line interface that includes our [Contentful importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [Wordpress importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress)
- [datocms/plugins](https://github.com/datocms/plugins): Example plugins we've made that extend the editor/admin dashboard
- [DatoCMS Starters](https://www.datocms.com/marketplace/starters) has examples for various Javascript frontend frameworks

Or see [all our public repos](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)
<!--datocms-autoinclude-footer end-->
