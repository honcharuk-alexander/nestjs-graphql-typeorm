import { Field, ID, ObjectType } from '@nestjs/graphql';
import {Author} from "./authors.entity";
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity({ name: 'books' })
export class Book {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @ManyToMany(type => Author, author => author.books)
  @Field(type => [Author])
  authors: Author[];
}


