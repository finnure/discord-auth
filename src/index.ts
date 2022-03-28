import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { verifyTokenRoute, loginRoute, authRoute } from "./routes";
const app = express();

app.use(cookieParser(config.discordToken));
app.use("/", express.static("dist"));

app.get("/verify", verifyTokenRoute);
app.get("/login", loginRoute);
app.get("/auth", authRoute);

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});
