import { Media } from "./Media";
import { Season} from "./Season";

export class Serie extends Media {
    statut: "en_attente" | "en_cours" | "terminee";
    saisons: Season[];

    constructor(id: string, titre: string, plateforme: string, userId: string, statut: "en_attente" | "en_cours" | "terminee", saisons: Season[] = []) {
        super(id, titre, plateforme, userId);
        this.statut = statut;
        this.saisons = saisons;
    }

    addSaison(saison: Season): void {
        this.saisons.push(saison);
    }

    getSummary(): string {
        const totalEpisodes = this.saisons.reduce((sum, saison) => sum + saison.episodes.length, 0);
        return `${this.titre} (${this.statut}) - ${totalEpisodes} épisodes`;
    }
}




