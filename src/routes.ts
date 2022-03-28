import { Request, Response } from "express";
import { JwtPayload, verify, sign } from "jsonwebtoken";
import { config } from "./config";
import { findChannel, login } from "./discordBot";
import { clientCache, generatePassword, passwordCache } from "./utils";

type Cookie = {
  token: string;
  user: string;
};
type LoginQuery = {
  query: {
    username?: string;
    password?: string;
  };
};

export const verifyTokenRoute = (req: Request, res: Response) => {
  const { login } = req.signedCookies;
  if (!login) return res.sendStatus(401).end();
  try {
    const verified = verify(login.token, config.discordToken) as JwtPayload & {
      name: string;
    };
    if (verified.name !== login.user) throw new Error();
    return res.end("OK");
  } catch (error) {
    return res.sendStatus(401).end();
  }
};

export const loginRoute = async (req: Request & LoginQuery, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { username } = req.query;
  if (!username || username === "general") return res.sendStatus(400);
  const client = clientCache.has("client")
    ? clientCache.get("client")
    : await login(config.discordToken);
  if (!client) return res.sendStatus(500);
  if (!client.isReady()) {
    await new Promise((resolve) => {
      setTimeout(() => resolve("done"), 1000);
    });
  }
  if (!clientCache.has("client")) {
    clientCache.set("client", client);
    setTimeout(() => {
      clientCache.delete("client");
      client.destroy();
    }, 10 * 60 * 1000);
  }
  const channel = findChannel(client, username.toLowerCase());
  if (!channel) return res.sendStatus(404);
  const password = generatePassword(config.length);
  passwordCache.set(username, password);
  channel.send(password);
  setTimeout(() => passwordCache.delete(username), 120000);
  return res.json({ status: "SUCCESS" });
};

export const authRoute = (req: Request & LoginQuery, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { username, password } = req.query;
  if (!username) return res.sendStatus(400).end();
  if (!password) return res.sendStatus(400).end();
  const expected = passwordCache.get(username);
  if (!expected) return res.sendStatus(400).end();
  passwordCache.delete(username);
  if (password === expected) {
    const token = sign({ name: username }, config.discordToken, {
      expiresIn: config.maxAge / 1000,
    });
    const cookie: Cookie = { token, user: username };
    res.cookie("login", cookie, {
      maxAge: config.maxAge,
      domain: config.domain,
      sameSite: "strict",
      signed: true,
      secure: true,
    });
    return res.json({ status: "LOGGEDIN" });
  }
  return res.sendStatus(403).end();
};
