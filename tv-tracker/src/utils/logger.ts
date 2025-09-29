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
                winston.format.simple()
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
                winston.format.simple()
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
