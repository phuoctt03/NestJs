import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Users'})
export class Users{
    @PrimaryGeneratedColumn()
    UserID : string;

    @PrimaryColumn({unique: true})
    Username : string;

    @Column()
    PasswordHash : string;

    @PrimaryColumn({unique: true})
    Email: string;

    @Column()
    Role: string;

}