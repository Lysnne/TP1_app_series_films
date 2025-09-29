import { Episode } from "./Episode";

export class Saison {
    numero: number;
    episodes: Episode[];

    constructor(numero: number, episodes: Episode[] = []) {
        this.numero = numero;
        this.episodes = episodes;
    }

    addEpisode(episode: Episode): void {
        this.episodes.push(episode);
    }

    getSummary(): string {
        return `Saison ${this.numero} - ${this.episodes.length} épisodes`;
    }
}

