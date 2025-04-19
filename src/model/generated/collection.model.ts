import { Entity, Column, PrimaryColumn, Index, OneToMany } from "typeorm";
import { Transfer } from "./transfer.model";
import { Objekt } from "./objekt.model";

@Entity()
export class Collection {
  constructor(props?: Partial<Collection>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({
    type: "uuid",
  })
  id!: string;

  @Index()
  @Column("text", { nullable: false })
  contract!: string;

  @Index()
  @Column("timestamp with time zone", { nullable: false })
  createdAt!: Date;

  @Index({ unique: true })
  @Column("text", { nullable: false })
  slug!: string;

  @Column("text", { nullable: false })
  collectionId!: string;

  @Index()
  @Column("text", { nullable: false })
  season!: string;

  @Index()
  @Column("text", { nullable: false })
  member!: string;

  @Index()
  @Column("text", { nullable: false })
  artist!: string;

  @Index()
  @Column("text", { nullable: false })
  collectionNo!: string;

  @Index()
  @Column("text", { nullable: false })
  class!: string;

  @Column("text", { nullable: false })
  thumbnailImage!: string;

  @Column("text", { nullable: false })
  frontImage!: string;

  @Column("text", { nullable: false })
  backImage!: string;

  @Column("text", { nullable: false })
  backgroundColor!: string;

  @Column("text", { nullable: false })
  textColor!: string;

  @Column("text", { nullable: false })
  accentColor!: string;

  @Column("int4", { nullable: false })
  comoAmount!: number;

  @Index()
  @Column("text", { nullable: false })
  onOffline!: string;

  @OneToMany(() => Transfer, (e) => e.collection)
  transfers!: Transfer[];

  @OneToMany(() => Objekt, (e) => e.collection)
  objekts!: Objekt[];
}
