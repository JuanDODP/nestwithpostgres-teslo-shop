import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prdoduct } from "./prdoduct.entity";

@Entity('')
export class ProductImage {
    @PrimaryGeneratedColumn()
  id: string;
  @Column('text')
  url: string;
  @ManyToOne(
    () => Prdoduct,
    (prdoduct) => prdoduct.images,
    // { onDelete: 'CASCADE' }
  )
  product:Prdoduct
//   productId: string;

//   constructor(partial: Partial<ProductImage>) {
//     Object.assign(this, partial);
//   }
}