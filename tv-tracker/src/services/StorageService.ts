import { promises as fs } from "fs";
import path from "path";
import { Media } from "../models/Media";
import { User } from "../models/User";

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

export interface Database {
    medias: Media[];
    users: User[];
}

export class StorageService {
    private static instance: StorageService;
    private data: Database = { medias: [], users: [] };

    private constructor() {
        this.loadData();
    }

    public static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    private async loadData(): Promise<void> {
        try {
            const rawData = await fs.readFile(DB_PATH, "utf-8");
            this.data = JSON.parse(rawData);
        } catch (error) {
            console.log("Base de données vide, création d'une nouvelle base");
            this.data = { medias: [], users: [] };
        }
    }

    private async saveData(): Promise<void> {
        try {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
        }
    }

    // CRUD Operations for Media
    public async listMedias(): Promise<Media[]> {
        return this.data.medias;
    }

    public async getMediaById(id: string): Promise<Media | undefined> {
        return this.data.medias.find(media => media.id === id);
    }

    public async addMedia(media: Media): Promise<Media> {
        this.data.medias.push(media);
        await this.saveData();
        return media;
    }

    public async updateMedia(id: string, updatedMedia: Partial<Media>): Promise<Media | undefined> {
        const index = this.data.medias.findIndex(media => media.id === id);
        if (index !== -1) {
            this.data.medias[index] = { ...this.data.medias[index], ...updatedMedia };
            await this.saveData();
            return this.data.medias[index];
        }
        return undefined;
    }

    public async deleteMedia(id: string): Promise<boolean> {
        const index = this.data.medias.findIndex(media => media.id === id);
        if (index !== -1) {
            this.data.medias.splice(index, 1);
            await this.saveData();
            return true;
        }
        return false;
    }

    // CRUD Operations for Users
    public async listUsers(): Promise<User[]> {
        return this.data.users;
    }

    public async getUserById(id: string): Promise<User | undefined> {
        return this.data.users.find(user => user.id === id);
    }

    public async addUser(user: User): Promise<User> {
        this.data.users.push(user);
        await this.saveData();
        return user;
    }

    public async updateUser(id: string, updatedUser: Partial<User>): Promise<User | undefined> {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.data.users[index] = { ...this.data.users[index], ...updatedUser };
            await this.saveData();
            return this.data.users[index];
        }
        return undefined;
    }

    public async deleteUser(id: string): Promise<boolean> {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.data.users.splice(index, 1);
            await this.saveData();
            return true;
        }
        return false;
    }

    // Get medias by user
    public async getMediasByUserId(userId: string): Promise<Media[]> {
        return this.data.medias.filter(media => media.userId === userId);
    }
}
