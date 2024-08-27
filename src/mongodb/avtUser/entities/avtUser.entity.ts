import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'avtUser'})
export class avtUser {

    @PrimaryGeneratedColumn()
    id : string;

    @Column()
    avatarUrl: string;

    @Column()
    UserID: string;

    @Column()
    state: string;

}
