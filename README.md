# Crypto Coding Challenge

### Backend

The tech stack is mostly  [InversifyJS](https://inversify.io/)
running under [Express](https://expressjs.com/) with a few other small libraries, and it follows a scheme first approach for the
Postgres DB.

The only controversial tech used was [Bun](https://bun.sh/) for the JavaScript engine and testing, as it's just reached its 1.0 release. It
was mostly a very enjoyable experience with my only negative issues around the testing framework still lacking features.

All the endpoints have their inputs validated with Joi.

I decided to use a stored procedure starting a transaction in order to guarantee that no tocos can be lost in the wild during a transfer.

Most endpoints are tested, I would have handled more scenarios if I could spend more time.

The architecture is based on the SOLID principles in order to expand the server's functionalities easily

### Frontend

The frontend is [React](https://react.dev/), [Flowbite React](https://www.flowbite-react.com/) with a few other libraries.

I spent a lot less time on the frontend than I did on the backend and as such didn't make as much progress as I would have liked but it's in
a working state.

### Missing / Improvements

Given I tried to match the time given and mostly focused on the backend, the front is lacking quite a few features

- Some types are duplicated in the front/back, ideally there should be a shared library where they should be in
- Backend has validation but Front End is not reusing these errors
- I don't like how I'm passing around the repositories from the controllers, I would have added DI
- the module.ts from the API should be fed all the controllers at once
- I could have added code generated API documentation
- Server routers with decorators would have been clearer and cleaner
- Front-end validation missing, no refetch after queries
- A lot of UI/UX changes on the front : pre-select dropdowns, access resources by url,...

In the end, I found it quite hard to produce clean and quality code given the time allotted but I think the result is pretty good
considering the time given

## Dependencies

- [Docker](https://www.docker.com/)

### Development dependencies

- [Bun](https://bun.sh/)

## Running

```bash
docker compose -f docker-compose.cmd.yml up server --abort-on-container-exit --build
```

You can then access the `Dashboard` interface at http://localhost:5000

You can then access the `API` interface at http://localhost:4040

## Tests

You can run the project and its tests under docker with the following:-

Runs backend and frontend tests.

```bash
docker compose -f docker-compose.cmd.yml  -f docker-compose.test.yml up --abort-on-container-exit --build
```

This will build a local docker image of the projects and also run the postgres image.

### Backend

For just the backend test:

```bash
docker compose -f docker-compose.cmd.yml  -f docker-compose.test.yml up server --abort-on-container-exit --build
```

### Frontend

For just the frontend test:

```bash
docker compose -f docker-compose.cmd.yml -f docker-compose.test.yml up dashboard  --abort-on-container-exit --build
```

## Local Development

You can run a local copy of postgres which will also be created with the schema using the command:

```bash
docker compose  up
```

Install [Bun](https://bun.sh/)

```bash
curl -fsSL https://bun.sh/install | bash
```

From the root `./` run:-

```bash
bun install
```

### Backend

Then from within the `./packages/server` folder, you can run:-

```bash
bun run start
```

You can then access the `API` interface at http://localhost:4040

### Frontend

Then from within the `./packages/dashboard` folder you can run:

```bash
bun run start
```

You can then access the `Dashboard` interface at http://localhost:3000

- 2 Users are already created

- You can add new users or transfer Tocos from different users

#### Build / Publishing

When publishing dashboard, it gets copied into the the `public` folder of the server. This way you can run a single docker image with
everything being served by [Express](https://expressjs.com/).
