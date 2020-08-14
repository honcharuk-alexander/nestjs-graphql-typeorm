import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Book} from "./books.entity";
import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";

@ObjectType()
@Entity({ name: 'authors' })
export class Author {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @ManyToMany(type => Book, book => book.authors, { cascade: true, eager: true })
  @JoinTable({
    name: 'author_book',
    joinColumn: { name: 'author_id', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id'},
  })
  @Field(type => [Book])
  books: Book[];
}


