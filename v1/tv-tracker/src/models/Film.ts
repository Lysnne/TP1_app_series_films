import { Media } from "./Media";

export class Film extends Media {
    duree: number;
    genre: string;
    annee: number;

    constructor(id: string, titre: string, plateforme: string, userId: string, duree: number, genre: string, annee: number) {
        super(id, titre, plateforme, userId);
        this.duree = duree;
        this.genre = genre;
        this.annee = annee;
    }

    getSummary(): string {
        return `${this.titre} (${this.annee}) - ${this.genre}, ${this.duree} min`;
    }
}