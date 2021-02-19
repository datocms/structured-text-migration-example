# Structured Text Example Migration

This repo contains the code for the [Migrating content to Structured Text](https://www.datocms.com/docs/structured-text/migrating-content-to-structured-text) tutorial.

## How to run the migrations

First of all, clone the [example project](https://dashboard.datocms.com/projects/duplicate-template?id=42030&name=Structured+Text+demo) into your account.

Then inside the project root folder, run the following commands:

```
npm install
migrate --destination=with-structured-text --token=<YOUR_READWRITE-TOKEN>
```
