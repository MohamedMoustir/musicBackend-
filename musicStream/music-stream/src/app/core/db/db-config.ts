import Dexie ,{Table} from "dexie";
import { Track } from "../models/track";

export class MusicStreamDB extends Dexie{
    tracks!:Table<Track,number>;
    constructor(){
        super("MusicStreamDB");
        this.version(1).stores({
            tracks: '++id, title, artist, category, addedDate'
        });

    }
        
}
export const db  = new MusicStreamDB();