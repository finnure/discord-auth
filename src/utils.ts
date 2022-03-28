import crypto from "crypto";
import { Client } from "discord.js";

export const passwordCache = new Map<string, string>();
export const clientCache = new Map<string, Client>();

export const generatePassword = (length: number) => {
  const numbers = ["p", "a", "j", "r", "i", "y", "k", "v", "u", "d"];
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "b")
    .replace(/\//g, "s")
    .split("")
    .map((c) => numbers[parseInt(c)] || c)
    .join("")
    .toLowerCase();
};
