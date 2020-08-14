import {Args, ID, Int, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {Author} from '../db/models/authors.entity';
import {BooksService} from './books.service';
import {Book} from "../db/models/books.entity";
import {BookInput} from "./dto/book.input";

@Resolver(of => Author)
export class BooksResolver {
    constructor(private readonly booksService: BooksService) {
    }

    @Query(returns => Book, {nullable: true})
    getBook(@Args('id', {type: () => ID}) id: number): Promise<Book> {
        return this.booksService.findOneById(id);
    }

    @Query(returns => [Book])
    getBooks(@Args('title', {nullable: true}) title?: string): Promise<Book[]> {
        return this.booksService.findAll(title);
    }

    @Mutation(returns => Book)
    createBook(@Args('book') book: BookInput): Promise<Book> {
        return this.booksService.create(book);
    }

    @Mutation(returns => Book)
    addAuthor(@Args('bookId', {type: () => ID}) bookId: number,
              @Args('authorId', {type: () => ID}) authorId: number): Promise<Book> {
        return this.booksService.addAuthor(bookId, authorId);
    }

    @Mutation(returns => Int)
    deleteBook(@Args('id', {type: () => ID}) id: number) {
        return this.booksService.remove(id);
    }
}
