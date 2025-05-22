import { injectMain } from "./mainHook";
import { injectRenderer } from "./renderHook";

import LoggerFactory from "./logger";

const CoreLogger = LoggerFactory.getLogger("Core");
CoreLogger.log("hi sigmas")

injectMain();
injectRenderer();

require("./plugins/sample/index")