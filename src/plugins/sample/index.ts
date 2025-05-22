import LoggerFactory from "../../logger";

const logger = LoggerFactory.getLogger("Sample");

export function start() {
    logger.info("hi sigmas");
}

export function stop() {
    logger.info("bye sigmas");
}