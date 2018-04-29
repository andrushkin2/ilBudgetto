import { App } from "./server/expressInstance";
import * as http from "http";

http.createServer(App).listen(8080);
