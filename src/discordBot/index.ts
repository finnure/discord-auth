import { Client, Intents, TextChannel } from "discord.js";

export const login = async (token: string | undefined) => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  await client.login(token);
  return client;
};

export const findChannel = (client: Client, name: string) => {
  if (!client.isReady()) return;
  return client.channels.cache.find((channel) => {
    return channel.isText() && (channel as TextChannel).name === name;
  }) as TextChannel | undefined;
};
