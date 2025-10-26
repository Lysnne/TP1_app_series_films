import { Media } from "./Media";

export class User {
    id: string;
    nom: string;
    role: "admin" | "user";

    constructor(id: string, nom: string, role: "admin" | "user" = "user") {
        this.id = id;
        this.nom = nom;
        this.role = role;
    }

    isAdmin(): boolean {
        return this.role === "admin";
    }
}
