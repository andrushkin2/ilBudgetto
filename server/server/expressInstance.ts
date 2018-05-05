
import * as express from "express";
import * as bodyParser from "body-parser";
import { StaticConfig } from "./serverConfig";

const app = express();

app.use(express.static(__dirname + "/../public", StaticConfig));
app.use(bodyParser.json());

export { app as App };