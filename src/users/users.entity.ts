import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column({
        type:'enum',
        enum:['admin','customer','saller'],
        default:'customer'
    })
    role:string;

    @Column({select:false})
    password:string;
}