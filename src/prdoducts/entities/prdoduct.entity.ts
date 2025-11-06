import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
@Entity({ name: 'prdoducts' })
export class Prdoduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text', { unique: true })

    title: string;
    @Column('float',{ default: 0 })
    price: number;
    @Column({ type: 'text', nullable: true })
    description: string;
    @Column('text', { unique: true })
    slug: string
    @Column('int', { default: 0 })
    stock: number;
    @Column('text', { array: true, default: [] })
    sizes: string[];
    @Column('text')
    gender: string;
    @Column('text', { array: true, default: [] })
    tags: string[];
    // relacion con imagenes decirle al producto que tiene imagenes y a las imagenes que van a tener un producto
    @OneToMany(() => ProductImage, (productImage) => productImage.product, { cascade: true, eager: true })
    images?: ProductImage[];



    // other functions
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }

    @BeforeUpdate()
    checkUpdate() {
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }   

}
