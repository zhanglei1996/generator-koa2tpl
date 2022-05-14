const app = require("../app");
const http = require("http");
const WS = require("../utils/ws");
const config = require("config");
const apiPrefix = config.get("Router.apiPrefix");

/**
 * Create HTTP server.
 */
const server = http.createServer(app.callback());

/**
 * Create Socket server.
 */

WS.init(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(config.App.port);
console.log(`the server is start at port ${config.App.port}${apiPrefix}`);
