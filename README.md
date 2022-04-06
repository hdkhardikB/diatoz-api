# Diatoz API

<p align="center"> A backend project to serve REST APIs.</p>

## Description

The project is built on NestJS, a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.

## Installation

```bash
$ yarn install
```

## Runnning Migration
```bash
$ yarn typeorm:run
```

#### _Note_
* Please make sure to edit `.sample.env` file, fill all environment variables and save it as `.env` file. At least one `.env` file required.
* Please make sure to run migrations `yarn typeorm:run` first, it has all necessary table schema and data seed information.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## To create new Migration

```bash
# development
$ yarn run typeorm:create SampleMigration
```
## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

