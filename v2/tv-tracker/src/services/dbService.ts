import fs from "fs";
import path from "path";
import { Media } from "../models/Media";
import { User } from "../models/User";

// Chemin vers le fichier JSON
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

// Tableaux exportés pour réutilisation dans les routes
export let medias: Media[] = [];
export let users: User[] = [];

// Charger la base de données
export function loadDB() {
    if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        const data = JSON.parse(raw);
        medias = data.medias || [];
        users = data.users || [];
    }
}

// Sauvegarder la base de données
export function saveDB() {
    // Crée le dossier si nécessaire
    if (!fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify({ medias, users }, null, 2));
}

// Charger les données au démarrage
loadDB();
