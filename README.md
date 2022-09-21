# Structured Text Example Migration

This repo contains the code for the [Migrating content to Structured Text](https://www.datocms.com/docs/structured-text/migrating-content-to-structured-text) tutorial.

## Get started

Install the `@datocms/cli` to manage migrations

```
npm install -g @datocms/cli
```

The `datocms.config.json` file can be customized according to your preferences. Read more about the [cli configuration here](https://www.datocms.com/docs/scripting-migrations/installing-the-cli)

## How to test the example project

Clone the [example project](https://dashboard.datocms.com/projects/duplicate-template?id=42030&name=Structured+Text+demo) into your account.

Copy the read-write token from settings > API tokens

[![Clone DatoCMS project](https://dashboard.datocms.com/clone/button.svg?)](https://dashboard.datocms.com/projects/duplicate-template?id=42030&name=Structured+Text+demo)

Then inside the project root folder, run the following commands:

```
npm install
datocms migrate:run --destination=with-structured-text --api-token=<YOUR_READWRITE-TOKEN>
```

## Create a new migration

To create a new migration use this command. The DatoCMS cli will generate a new migration, based on the settings specified in the `datocms.config.json` file

```
datocms migrate:new --token=<YOUR_READWRITE-TOKEN> --ts
```
