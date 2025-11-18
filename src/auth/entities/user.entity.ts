import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })
    email: string;
    @Column('text')
    password: string;
    @Column('text')
    fullName: string;
    @Column('boolean', { default: true })
    isActive: boolean;
    @Column('text', { array: true, default: ['user'] })
    rol: string[];

    // es para grabar todos los emails en minusculas
    @BeforeInsert()
    normalizeEmail() {
        this.email = this.email.toLowerCase().trim();
    }
    @BeforeUpdate()
    checkEmailUpdate() {
        this.normalizeEmail();
    }
}
