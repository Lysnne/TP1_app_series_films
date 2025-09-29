import { Media } from "./Media";
import { Saison } from "./Season";

export class Serie extends Media {
    statut: "en_attente" | "en_cours" | "terminee";
    saisons: Saison[];

    constructor(id: string, titre: string, plateforme: string, userId: string, statut: "en_attente" | "en_cours" | "terminee", saisons: Saison[] = []) {
        super(id, titre, plateforme, userId);
        this.statut = statut;
        this.saisons = saisons;
    }

    addSaison(saison: Saison): void {
        this.saisons.push(saison);
    }

    getSummary(): string {
        const totalEpisodes = this.saisons.reduce((sum, saison) => sum + saison.episodes.length, 0);
        return `${this.titre} (${this.statut}) - ${totalEpisodes} épisodes`;
    }
}




