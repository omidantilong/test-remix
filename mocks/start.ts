import { rest } from "msw";
import { setupServer } from "msw/node";

import "~/utils";

const handlers = [
  rest.get("fake.com/endpoint", (req, res, ctx) => {
    return res(ctx.json({ key: "value" }));
  }),
];

const server = setupServer(...handlers);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
