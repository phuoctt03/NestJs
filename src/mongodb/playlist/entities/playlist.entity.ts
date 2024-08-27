import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'playlist'})
export class Playlist {

    @PrimaryGeneratedColumn()
    id : string;

    @Column()
    avtUser: string;

    @Column()
    src: string;

    @Column()
    name: string;

    @Column()
    author: string;

    @Column()
    watched: string;

    @Column()
    date: string;

}
