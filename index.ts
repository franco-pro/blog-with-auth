import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3002;

app.get("/", (req: Request, res: Response) => {
  res.send("express + prisma + Ts");
});

app.listen(port, () => {
  console.log(`[server] : server is running on http://localhost:${port}`);
});
