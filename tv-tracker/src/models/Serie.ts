import {Media} from "./Media";

export class Serie extends Media {
    status:"En Cours" | "Terminée";

    constructor(id: string,title:string, genre: string,year:number ,rating:number, status:"En Cours" | "Terminée"){
        super(id, title,genre,year,rating);
        this.status= status;
        

    }

}