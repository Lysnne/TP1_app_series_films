import { Media } from "./Media";


 class User {
    id: number;
    email: string;
    password: string;
    role : "admin" | "user" ;
    favorites:Media[];

    constructor( id:number, email:string, password:string, role : "admin" | "user", favorites:Media[]){
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role ;
        this.favorites= favorites;
    }

}