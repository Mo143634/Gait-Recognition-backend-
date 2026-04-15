import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// define __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function attachmentRoutingLogger(app, routerPath, router, logsFileName) {
    const logsStream = fs.createWriteStream(
        path.join(__dirname, "../../logs", logsFileName),
        { flags: "a" }
    );

    app.use(routerPath, morgan("combined", { stream: logsStream }), router);
    app.use(routerPath, morgan("dev"), router);
}