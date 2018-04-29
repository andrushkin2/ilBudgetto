
import * as express from "express";
import { StaticConfig } from "./serverConfig";

const app = express();

app.use(express.static(__dirname + "/../public", StaticConfig))

export { app as App }