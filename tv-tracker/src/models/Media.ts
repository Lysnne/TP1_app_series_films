
export abstract class Media {
    id: string;
    titre: string;
    plateforme: string;
    userId: string;

    constructor(id: string, titre: string, plateforme: string, userId: string) {
        this.id = id;
        this.titre = titre;
        this.plateforme = plateforme;
        this.userId = userId;
    }
    
    abstract getSummary(): string;
}