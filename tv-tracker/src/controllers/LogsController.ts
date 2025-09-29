import { Request, Response } from "express";
import { promises as fs } from "fs";
import { logOperation, logError } from "../utils/logger";

export class LogsController {
    static async getLastLog(req: Request, res: Response): Promise<void> {
        try {
            const logContent = await fs.readFile("operations.log", "utf-8");
            const lines = logContent.trim().split("\n").filter(line => line.trim());
            
            if (lines.length === 0) {
                res.status(404).json({ error: "Aucune action enregistrée" });
                return;
            }

            const lastLine = lines[lines.length - 1];
            const lastAction = JSON.parse(lastLine);
            
            logOperation("GET_LAST_LOG");
            res.json(lastAction);
        } catch (error) {
            logError(error as Error, { operation: "GET_LAST_LOG" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}