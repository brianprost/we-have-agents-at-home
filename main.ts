import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { query } from "./agent.ts";
import { read, write } from "./db.ts";

const app = new Hono();

app.post("/", async (c) => {
  const body = await c.req.json();
  const cacheKey = `${new Date().toISOString().slice(0, 10)}:${body.query}`;
  let res = await read(cacheKey);
  if (res) {
    return c.json(res);
  }
  res = await query(body.query);
  if (!res) {
    return c.json({ error: "No response" });
  }
  await write(cacheKey, res);
  return c.json(res);
});

export const handler = handle(app);
