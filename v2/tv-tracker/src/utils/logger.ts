import winston from "winston";

// Logger pour les opérations
export const operationsLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "operations.log" }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(info => {
                    const msg = typeof info.message === "object" ? JSON.stringify(info.message) : info.message;
                    const rest = { ...info } as any;
                    delete rest.level; delete rest.message; delete rest.splat; delete rest.timestamp;
                    const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";
                    return `${info.level}: ${msg}${meta}`;
                })
            )
        })
    ]
});

// Logger pour les erreurs
export const errorsLogger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "errors.log" }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(info => {
                    const msg = typeof info.message === "object" ? JSON.stringify(info.message) : info.message;
                    const rest = { ...info } as any;
                    delete rest.level; delete rest.message; delete rest.splat; delete rest.timestamp;
                    const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : "";
                    return `${info.level}: ${msg}${meta}`;
                })
            )
        })
    ]
});

// Helpers
export function logOperation(action: string, meta: any = {}) {
    operationsLogger.info({
        action,
        timestamp: new Date().toISOString(),
        ...meta
    });
}

export function logError(err: Error, meta: any = {}) {
    errorsLogger.error({
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        ...meta
    });
}

// Logger général (pour compatibilité)
export const logger = operationsLogger;
