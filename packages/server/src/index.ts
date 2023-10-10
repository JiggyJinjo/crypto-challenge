import http from "http";
import { TYPES } from "./types";
import { Container } from "inversify";
import { asyncModules } from "./modules";
import { Logger } from "pino";

const container = new Container();
await container.loadAsync(...asyncModules);

const httpServerPort = Bun.env.HTTP_SERVER_PORT || 5000;
const httpServer = await container.getAsync<http.Server>(TYPES.HTTPServer);

const apiServerPort = Bun.env.HTTP_API_SERVER_PORT || 4040;
const api = await container.getAsync<http.Server>(TYPES.APIServer);

const logger = await container.getAsync<Logger>(TYPES.Logger);

await new Promise<void>((resolve) => [
  httpServer.listen({ port: httpServerPort }, resolve),
]);

await new Promise<void>((resolve) => [
  api.listen({ port: apiServerPort }, resolve),
]);

logger.info(`🚀 Server ready at http://localhost:${httpServerPort}/`);
logger.info(`🚀 API ready at http://localhost:${apiServerPort}/`);
