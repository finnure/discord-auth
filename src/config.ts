export const config = {
  PORT: parseInt(process.env.NODE_PORT || "8080"),
  discordToken: process.env.DISCORD_TOKEN || "",
  domain: process.env.COOKIE_DOMAIN || "localhost",
  maxAge: parseInt(
    process.env.COOKIE_MAX_AGE || (8 * 60 * 60 * 1000).toString()
  ),
  length: parseInt(process.env.PASSWORD_LENGTH || "6"),
};
